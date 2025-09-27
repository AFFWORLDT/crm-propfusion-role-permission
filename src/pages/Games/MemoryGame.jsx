import { useState, useEffect } from 'react';
import './MemoryGame.css';

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState(0);

  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];

  // Initialize game
  const initializeGame = () => {
    const gameCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
    setTimer(0);
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    if (gameWon || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);

    // Check for match when two cards are flipped
    if (flippedCards.length === 1) {
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      const secondCard = cards.find(c => c.id === cardId);
      
      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, firstCard.emoji]);
          setCards(prev => prev.map(c => 
            c.emoji === firstCard.emoji ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
          setMoves(prev => prev + 1);
          
          // Check if game is won
          if (matchedPairs.length + 1 === emojis.length) {
            setGameWon(true);
            const currentTime = timer;
            if (bestTime === 0 || currentTime < bestTime) {
              setBestTime(currentTime);
              localStorage.setItem('memoryGameBestTime', currentTime.toString());
            }
          }
        }, 500);
      } else {
        // No match, flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstCard.id || c.id === cardId ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setMoves(prev => prev + 1);
        }, 1000);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  // Load best time from localStorage
  useEffect(() => {
    const savedBestTime = localStorage.getItem('memoryGameBestTime');
    if (savedBestTime) {
      setBestTime(parseInt(savedBestTime));
    }
  }, []);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="memory-game">
        <div className="game-menu">
          <h1>🧠 Memory Match</h1>
          <p>Find matching pairs of cards</p>
          <p>Test your memory skills!</p>
          <div className="menu-buttons">
            <button onClick={initializeGame} className="start-btn">
              Start Game
            </button>
            {bestTime > 0 && (
              <div className="best-time">
                <h3>Best Time: {formatTime(bestTime)}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-game">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Time:</span>
            <span className="stat-value">{formatTime(timer)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Moves:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Pairs:</span>
            <span className="stat-value">{matchedPairs.length}/{emojis.length}</span>
          </div>
        </div>
        <button onClick={initializeGame} className="restart-btn">
          New Game
        </button>
      </div>

      <div className="game-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">❓</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {gameWon && (
        <div className="game-won-overlay">
          <div className="game-won-content">
            <h2>🎉 Congratulations!</h2>
            <p>You&apos;ve completed the game!</p>
            <div className="final-stats">
              <p>Time: {formatTime(timer)}</p>
              <p>Moves: {moves}</p>
              {bestTime === timer && <p className="new-record">🏆 New Best Time!</p>}
            </div>
            <button onClick={initializeGame} className="play-again-btn">
              Play Again
            </button>
          </div>
        </div>
      )}

      <div className="game-instructions">
        <h3>How to Play:</h3>
        <p>Click on cards to flip them and find matching pairs</p>
        <p>Try to complete the game with the fewest moves and fastest time!</p>
      </div>
    </div>
  );
};

export default MemoryGame;
