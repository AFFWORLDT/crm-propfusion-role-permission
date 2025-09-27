import { useState, useEffect } from 'react';
import './SlidingPuzzle.css';

const SlidingPuzzle = () => {
  const [puzzle, setPuzzle] = useState([]);
  const [size, setSize] = useState(3);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const [bestMoves, setBestMoves] = useState(0);

  // Initialize puzzle
  const initializePuzzle = (puzzleSize) => {
    const totalTiles = puzzleSize * puzzleSize;
    const tiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    tiles.push(null); // Empty tile
    
    // Shuffle tiles
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    // Ensure puzzle is solvable
    if (!isSolvable(tiles, puzzleSize)) {
      // Swap two tiles to make it solvable
      const firstTile = tiles.findIndex(tile => tile !== null);
      const lastTile = tiles.findLastIndex(tile => tile !== null);
      [tiles[firstTile], tiles[lastTile]] = [tiles[lastTile], tiles[firstTile]];
    }
    
    setPuzzle(tiles);
    setSize(puzzleSize);
    setMoves(0);
    setGameWon(false);
    setGameStarted(true);
    setTimer(0);
  };

  // Check if puzzle is solvable
  const isSolvable = (tiles, puzzleSize) => {
    let inversions = 0;
    const tilesWithoutEmpty = tiles.filter(tile => tile !== null);
    
    for (let i = 0; i < tilesWithoutEmpty.length; i++) {
      for (let j = i + 1; j < tilesWithoutEmpty.length; j++) {
        if (tilesWithoutEmpty[i] > tilesWithoutEmpty[j]) {
          inversions++;
        }
      }
    }
    
    if (puzzleSize % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      const emptyRow = Math.floor(tiles.indexOf(null) / puzzleSize);
      return (inversions + emptyRow) % 2 === 0;
    }
  };

  // Check if puzzle is solved
  const checkWin = (currentPuzzle) => {
    for (let i = 0; i < currentPuzzle.length - 1; i++) {
      if (currentPuzzle[i] !== i + 1) {
        return false;
      }
    }
    return currentPuzzle[currentPuzzle.length - 1] === null;
  };

  // Handle tile click
  const handleTileClick = (index) => {
    if (gameWon) return;
    
    const emptyIndex = puzzle.indexOf(null);
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    
    // Check if tile is adjacent to empty space
    const isAdjacent = (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    );
    
    if (isAdjacent) {
      const newPuzzle = [...puzzle];
      [newPuzzle[index], newPuzzle[emptyIndex]] = [newPuzzle[emptyIndex], newPuzzle[index]];
      
      setPuzzle(newPuzzle);
      setMoves(prev => prev + 1);
      
      // Check for win
      if (checkWin(newPuzzle)) {
        setGameWon(true);
        const currentTime = timer;
        const currentMoves = moves + 1;
        
        if (bestTime === 0 || currentTime < bestTime) {
          setBestTime(currentTime);
          localStorage.setItem(`puzzleBestTime${size}`, currentTime.toString());
        }
        
        if (bestMoves === 0 || currentMoves < bestMoves) {
          setBestMoves(currentMoves);
          localStorage.setItem(`puzzleBestMoves${size}`, currentMoves.toString());
        }
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

  // Load best scores from localStorage
  useEffect(() => {
    const savedBestTime = localStorage.getItem(`puzzleBestTime${size}`);
    const savedBestMoves = localStorage.getItem(`puzzleBestMoves${size}`);
    
    if (savedBestTime) {
      setBestTime(parseInt(savedBestTime));
    }
    if (savedBestMoves) {
      setBestMoves(parseInt(savedBestMoves));
    }
  }, [size]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render tile
  const renderTile = (tile, index) => {
    if (tile === null) {
      return (
        <div key={index} className="tile empty-tile">
          &nbsp;
        </div>
      );
    }
    
    return (
      <div
        key={index}
        className="tile"
        onClick={() => handleTileClick(index)}
      >
        {tile}
      </div>
    );
  };

  if (!gameStarted) {
    return (
      <div className="sliding-puzzle">
        <div className="game-menu">
          <h1>🧩 Sliding Puzzle</h1>
          <p>Arrange the tiles in order from 1 to {size * size - 1}</p>
          <p>Click tiles adjacent to the empty space to move them</p>
          
          <div className="size-selector">
            <h3>Choose Puzzle Size:</h3>
            <div className="size-buttons">
              <button 
                onClick={() => initializePuzzle(3)} 
                className={`size-btn ${size === 3 ? 'active' : ''}`}
              >
                3x3
              </button>
              <button 
                onClick={() => initializePuzzle(4)} 
                className={`size-btn ${size === 4 ? 'active' : ''}`}
              >
                4x4
              </button>
              <button 
                onClick={() => initializePuzzle(5)} 
                className={`size-btn ${size === 5 ? 'active' : ''}`}
              >
                5x5
              </button>
            </div>
          </div>
          
          <div className="best-scores">
            {bestTime > 0 && (
              <div className="best-score">
                <span>Best Time: {formatTime(bestTime)}</span>
              </div>
            )}
            {bestMoves > 0 && (
              <div className="best-score">
                <span>Best Moves: {bestMoves}</span>
              </div>
            )}
          </div>
          
          <button onClick={() => initializePuzzle(size)} className="start-btn">
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sliding-puzzle">
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
            <span className="stat-label">Size:</span>
            <span className="stat-value">{size}x{size}</span>
          </div>
        </div>
        <button onClick={() => setGameStarted(false)} className="menu-btn">
          Back to Menu
        </button>
      </div>

      <div className="puzzle-container">
        <div 
          className="puzzle-board"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`
          }}
        >
          {puzzle.map((tile, index) => renderTile(tile, index))}
        </div>
      </div>

      {gameWon && (
        <div className="game-won-overlay">
          <div className="game-won-content">
            <h2>🎉 Puzzle Solved!</h2>
            <div className="final-stats">
              <p>Time: {formatTime(timer)}</p>
              <p>Moves: {moves}</p>
              {(bestTime === timer || bestMoves === moves) && (
                <p className="new-record">🏆 New Record!</p>
              )}
            </div>
            <div className="win-buttons">
              <button onClick={() => initializePuzzle(size)} className="play-again-btn">
                Play Again
              </button>
              <button onClick={() => setGameStarted(false)} className="menu-btn">
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="game-instructions">
        <h3>How to Play:</h3>
        <p>Click tiles adjacent to the empty space to move them</p>
        <p>Arrange numbers from 1 to {size * size - 1} in order</p>
        <p>Try to solve it in the fewest moves and fastest time!</p>
      </div>
    </div>
  );
};

export default SlidingPuzzle;
