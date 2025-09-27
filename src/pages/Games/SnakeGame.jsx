import { useState, useEffect, useCallback, useRef } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState('right');
  const [gameSpeed, setGameSpeed] = useState(150);
  const [gridSize] = useState(20);
  const [canvasSize] = useState(400);

  // Initialize game
  const initGame = useCallback(() => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    
    setSnake(initialSnake);
    setDirection('right');
    setScore(0);
    generateFood();
    setGameState('playing');
  }, []);

  // Generate food at random position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    
    // Make sure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      generateFood();
    } else {
      setFood(newFood);
    }
  }, [snake]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (gameState !== 'playing') return;

    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'down') setDirection('up');
        break;
      case 'ArrowDown':
        if (direction !== 'up') setDirection('down');
        break;
      case 'ArrowLeft':
        if (direction !== 'right') setDirection('left');
        break;
      case 'ArrowRight':
        if (direction !== 'left') setDirection('right');
        break;
      case ' ':
        setGameState('paused');
        break;
      default:
        break;
    }
  }, [direction, gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      moveSnake();
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState, gameSpeed, snake, direction]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Move snake
  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      // Move head based on direction
      switch (direction) {
        case 'up':
          head.y = (head.y - 1 + gridSize) % gridSize;
          break;
        case 'down':
          head.y = (head.y + 1) % gridSize;
          break;
        case 'left':
          head.x = (head.x - 1 + gridSize) % gridSize;
          break;
        case 'right':
          head.x = (head.x + 1) % gridSize;
          break;
        default:
          break;
      }

      // Check collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return prevSnake;
      }

      // Check collision with food
      if (head.x === food.x && head.y === food.y) {
        newSnake.unshift(head);
        setScore(prev => prev + 10);
        generateFood();
        
        // Increase speed every 50 points
        if ((score + 10) % 50 === 0) {
          setGameSpeed(prev => Math.max(50, prev - 10));
        }
      } else {
        newSnake.unshift(head);
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gridSize, score, generateFood]);

  // Game over
  const gameOver = useCallback(() => {
    setGameState('gameOver');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Draw game on canvas
  useEffect(() => {
    if (gameState === 'menu') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cellSize = canvasSize / gridSize;

    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#e74c3c' : '#3498db';
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
  }, [snake, food, gameState, gridSize, canvasSize]);

  // Resume game
  const resumeGame = () => {
    setGameState('playing');
  };

  // Restart game
  const restartGame = () => {
    setGameSpeed(150);
    initGame();
  };

  if (gameState === 'menu') {
    return (
      <div className="snake-game">
        <div className="game-menu">
          <h1>🐍 Snake Game</h1>
          <p>Use arrow keys to control the snake</p>
          <p>Eat food to grow and score points</p>
          <p>Don&apos;t hit yourself!</p>
          <div className="menu-buttons">
            <button onClick={initGame} className="start-btn">
              Start Game
            </button>
            <div className="high-score">
              <h3>High Score: {highScore}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="snake-game">
      <div className="game-header">
        <div className="score-board">
          <div className="score">Score: {score}</div>
          <div className="high-score">High Score: {highScore}</div>
        </div>
        <div className="game-controls">
          {gameState === 'playing' && (
            <button onClick={() => setGameState('paused')} className="pause-btn">
              Pause
            </button>
          )}
          {gameState === 'paused' && (
            <button onClick={resumeGame} className="resume-btn">
              Resume
            </button>
          )}
          <button onClick={restartGame} className="restart-btn">
            Restart
          </button>
        </div>
      </div>

      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="game-canvas"
        />
        
        {gameState === 'paused' && (
          <div className="pause-overlay">
            <h2>Game Paused</h2>
            <p>Press Resume to continue</p>
          </div>
        )}
        
        {gameState === 'gameOver' && (
          <div className="game-over-overlay">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button onClick={restartGame} className="restart-btn">
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="game-instructions">
        <h3>Controls:</h3>
        <p>🔼 Arrow Up - Move Up</p>
        <p>🔽 Arrow Down - Move Down</p>
        <p>◀️ Arrow Left - Move Left</p>
        <p>▶️ Arrow Right - Move Right</p>
        <p>⏸️ Space - Pause/Resume</p>
      </div>
    </div>
  );
};

export default SnakeGame;
