import { useState, useEffect, useRef, useCallback } from 'react';
import './BreakoutGame.css';

const BreakoutGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Game objects
  const [paddle, setPaddle] = useState({ x: 0, y: 0, width: 100, height: 10 });
  const [ball, setBall] = useState({ x: 0, y: 0, radius: 5, dx: 4, dy: -4 });
  const [bricks, setBricks] = useState([]);
  
  const [canvasSize] = useState({ width: 800, height: 600 });
  const [gameSpeed] = useState(16); // 60 FPS

  // Initialize game
  const initGame = useCallback(() => {
    // Initialize paddle
    setPaddle({
      x: canvasSize.width / 2 - 50,
      y: canvasSize.height - 30,
      width: 100,
      height: 10
    });

    // Initialize ball
    setBall({
      x: canvasSize.width / 2,
      y: canvasSize.height - 40,
      radius: 5,
      dx: 4,
      dy: -4
    });

    // Initialize bricks
    const newBricks = [];
    const brickRows = 5;
    const brickCols = 10;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 5;
    const brickOffsetTop = 60;
    const brickOffsetLeft = 30;

    for (let c = 0; c < brickCols; c++) {
      for (let r = 0; r < brickRows; r++) {
        newBricks.push({
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          width: brickWidth,
          height: brickHeight,
          visible: true
        });
      }
    }
    setBricks(newBricks);

    setScore(0);
    setLives(3);
    setLevel(1);
    setGameState('playing');
  }, [canvasSize]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
    if (gameState !== 'playing') return;

    switch (e.key) {
      case 'ArrowLeft':
        setPaddle(prev => ({
          ...prev,
          x: Math.max(0, prev.x - 20)
        }));
        break;
      case 'ArrowRight':
        setPaddle(prev => ({
          ...prev,
          x: Math.min(canvasSize.width - prev.width, prev.x + 20)
        }));
        break;
      case ' ':
        setGameState('paused');
        break;
      default:
        break;
    }
  }, [gameState, canvasSize.width]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      updateGame();
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState, gameSpeed, ball, paddle, bricks]);

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('breakoutHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Update game state
  const updateGame = useCallback(() => {
    // Move ball
    setBall(prev => {
      let newX = prev.x + prev.dx;
      let newY = prev.y + prev.dy;
      let newDx = prev.dx;
      let newDy = prev.dy;

      // Wall collision
      if (newX + prev.radius > canvasSize.width || newX - prev.radius < 0) {
        newDx = -newDx;
      }
      if (newY - prev.radius < 0) {
        newDy = -newDy;
      }

      // Paddle collision
      if (newY + prev.radius > paddle.y && 
          newX > paddle.x && 
          newX < paddle.x + paddle.width) {
        newDy = -Math.abs(newDy);
        // Adjust ball direction based on where it hits the paddle
        const hitPos = (newX - paddle.x) / paddle.width;
        newDx = (hitPos - 0.5) * 8;
      }

      // Floor collision (lose life)
      if (newY + prev.radius > canvasSize.height) {
        setLives(prev => prev - 1);
        if (lives <= 1) {
          gameOver();
          return prev;
        }
        // Reset ball
        newX = canvasSize.width / 2;
        newY = canvasSize.height - 40;
        newDx = 4;
        newDy = -4;
      }

      return { ...prev, x: newX, y: newY, dx: newDx, dy: newDy };
    });

    // Check brick collisions
    setBricks(prev => {
      const newBricks = [...prev];
      let brickHit = false;

      newBricks.forEach(brick => {
        if (brick.visible) {
          if (ball.x + ball.radius > brick.x && 
              ball.x - ball.radius < brick.x + brick.width &&
              ball.y + ball.radius > brick.y && 
              ball.y - ball.radius < brick.y + brick.height) {
            brick.visible = false;
            brickHit = true;
            setScore(prev => prev + 10);
          }
        }
      });

      // Check if level is complete
      if (newBricks.every(brick => !brick.visible)) {
        nextLevel();
      }

      return newBricks;
    });
  }, [ball, paddle, bricks, lives, canvasSize, gameOver, nextLevel]);

  // Next level
  const nextLevel = useCallback(() => {
    setLevel(prev => prev + 1);
    setBall(prev => ({ ...prev, dx: prev.dx * 1.1, dy: prev.dy * 1.1 }));
    initGame();
  }, [initGame]);

  // Game over
  const gameOver = useCallback(() => {
    setGameState('gameOver');
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('breakoutHighScore', score.toString());
    }
  }, [score, highScore]);

  // Resume game
  const resumeGame = () => {
    setGameState('playing');
  };

  // Restart game
  const restartGame = () => {
    initGame();
  };

  // Draw game on canvas
  useEffect(() => {
    if (gameState === 'menu') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw paddle
    ctx.fillStyle = '#3498db';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();

    // Draw bricks
    bricks.forEach(brick => {
      if (brick.visible) {
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    // Draw score and lives
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Lives: ${lives}`, 10, 60);
    ctx.fillText(`Level: ${level}`, 10, 90);
  }, [ball, paddle, bricks, score, lives, level, gameState, canvasSize]);

  if (gameState === 'menu') {
    return (
      <div className="breakout-game">
        <div className="game-menu">
          <h1>🏓 Breakout</h1>
          <p>Break all the bricks with your paddle</p>
          <p>Don&apos;t let the ball fall!</p>
          <div className="menu-buttons">
            <button onClick={initGame} className="start-btn">
              Start Game
            </button>
            {highScore > 0 && (
              <div className="high-score">
                <h3>High Score: {highScore}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="breakout-game">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Lives:</span>
            <span className="stat-value">{lives}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level:</span>
            <span className="stat-value">{level}</span>
          </div>
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
          width={canvasSize.width}
          height={canvasSize.height}
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
        <p>◀️ Arrow Left - Move Paddle Left</p>
        <p>▶️ Arrow Right - Move Paddle Right</p>
        <p>⏸️ Space - Pause/Resume</p>
        <p>Break all bricks to advance to the next level!</p>
      </div>
    </div>
  );
};

export default BreakoutGame;
