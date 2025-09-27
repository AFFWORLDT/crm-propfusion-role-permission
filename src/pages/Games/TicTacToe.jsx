import { useState, useEffect } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState('menu'); // menu, single, multi
  const [gameWon, setGameWon] = useState(false);
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [aiThinking, setAiThinking] = useState(false);

  // Winning combinations
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  // Check for winner
  const checkWinner = (squares) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // Check for draw
  const checkDraw = (squares) => {
    return squares.every(square => square !== null);
  };

  // AI move (simple minimax)
  const aiMove = (squares) => {
    setAiThinking(true);
    setTimeout(() => {
      const availableMoves = squares.map((square, index) => square === null ? index : null).filter(index => index !== null);
      
      if (availableMoves.length === 0) return;

      // Try to win
      for (let move of availableMoves) {
        const newSquares = [...squares];
        newSquares[move] = 'O';
        if (checkWinner(newSquares) === 'O') {
          handleClick(move);
          setAiThinking(false);
          return;
        }
      }

      // Block opponent from winning
      for (let move of availableMoves) {
        const newSquares = [...squares];
        newSquares[move] = 'X';
        if (checkWinner(newSquares) === 'X') {
          handleClick(move);
          setAiThinking(false);
          return;
        }
      }

      // Take center if available
      if (availableMoves.includes(4)) {
        handleClick(4);
        setAiThinking(false);
        return;
      }

      // Take corner if available
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(corner => availableMoves.includes(corner));
      if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        handleClick(randomCorner);
        setAiThinking(false);
        return;
      }

      // Take any available move
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      handleClick(randomMove);
      setAiThinking(false);
    }, 500);
  };

  // Handle square click
  const handleClick = (index) => {
    if (board[index] || gameWon || draw || (gameMode === 'single' && !xIsNext && aiThinking)) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameWon(true);
      setWinner(winner);
      if (winner === 'X') {
        setXScore(prev => prev + 1);
      } else {
        setOScore(prev => prev + 1);
      }
      return;
    }

    if (checkDraw(newBoard)) {
      setDraw(true);
      return;
    }

    setXIsNext(!xIsNext);

    // AI move in single player mode
    if (gameMode === 'single' && !xIsNext && !winner) {
      aiMove(newBoard);
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameWon(false);
    setWinner(null);
    setDraw(false);
    setAiThinking(false);
  };

  // New game (reset scores too)
  const newGame = () => {
    setXScore(0);
    setOScore(0);
    resetGame();
  };

  // Render square
  const renderSquare = (index) => {
    return (
      <button
        className={`square ${board[index] ? `square-${board[index].toLowerCase()}` : ''}`}
        onClick={() => handleClick(index)}
        disabled={aiThinking && gameMode === 'single' && !xIsNext}
      >
        {board[index]}
      </button>
    );
  };

  // Get game status
  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (draw) {
      return 'Game is a draw!';
    } else if (gameMode === 'single' && !xIsNext && aiThinking) {
      return 'AI is thinking...';
    } else {
      return `Next player: ${xIsNext ? 'X' : 'O'}`;
    }
  };

  if (gameMode === 'menu') {
    return (
      <div className="tic-tac-toe">
        <div className="game-menu">
          <h1>⭕ Tic Tac Toe</h1>
          <p>Choose your game mode</p>
          <div className="menu-buttons">
            <button onClick={() => setGameMode('single')} className="menu-btn single-btn">
              🎮 Single Player vs AI
            </button>
            <button onClick={() => setGameMode('multi')} className="menu-btn multi-btn">
              👥 Two Players
            </button>
          </div>
          <div className="scores">
            <div className="score-item">
              <span className="score-label">X Wins:</span>
              <span className="score-value">{xScore}</span>
            </div>
            <div className="score-item">
              <span className="score-label">O Wins:</span>
              <span className="score-value">{oScore}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tic-tac-toe">
      <div className="game-header">
        <h2>⭕ Tic Tac Toe</h2>
        <div className="game-info">
          <div className="status">{getStatus()}</div>
          <div className="mode-indicator">
            Mode: {gameMode === 'single' ? 'Single Player' : 'Two Players'}
          </div>
        </div>
        <div className="scores">
          <div className="score-item">
            <span className="score-label">X:</span>
            <span className="score-value">{xScore}</span>
          </div>
          <div className="score-item">
            <span className="score-label">O:</span>
            <span className="score-value">{oScore}</span>
          </div>
        </div>
      </div>

      <div className="game-board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>

      <div className="game-controls">
        <button onClick={resetGame} className="control-btn reset-btn">
          Reset Game
        </button>
        <button onClick={newGame} className="control-btn new-btn">
          New Game
        </button>
        <button onClick={() => setGameMode('menu')} className="control-btn menu-btn">
          Back to Menu
        </button>
      </div>

      {(gameWon || draw) && (
        <div className="game-result">
          <h3>{winner ? `🎉 ${winner} Wins!` : '🤝 It\'s a Draw!'}</h3>
          <button onClick={resetGame} className="play-again-btn">
            Play Again
          </button>
        </div>
      )}

      <div className="game-instructions">
        <h3>How to Play:</h3>
        <p>Take turns placing X and O on the board</p>
        <p>Get three in a row to win!</p>
        {gameMode === 'single' && (
          <p>You play as X, AI plays as O</p>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
