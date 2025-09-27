import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './GamesHub.module.css';

const GamesHub = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const games = [
    {
      id: 'snake',
      name: 'Snake Game',
      description: 'Classic snake game - eat food and grow longer!',
      icon: '🐍',
      category: 'Arcade',
      difficulty: 'Easy',
      isOnline: false
    },
    {
      id: 'memory',
      name: 'Memory Match',
      description: 'Find matching pairs of cards',
      icon: '🧠',
      category: 'Brain Games',
      difficulty: 'Easy',
      isOnline: false
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Classic X and O game',
      icon: '⭕',
      category: 'Strategy',
      difficulty: 'Easy',
      isOnline: true
    },
    {
      id: 'puzzle',
      name: 'Sliding Puzzle',
      description: 'Arrange tiles in correct order',
      icon: '🧩',
      category: 'Puzzle',
      difficulty: 'Hard',
      isOnline: false
    },
    {
      id: 'breakout',
      name: 'Breakout',
      description: 'Break all the bricks with your paddle',
      icon: '🏓',
      category: 'Arcade',
      difficulty: 'Medium',
      isOnline: false
    },
            {
          id: 'monopoly',
          name: 'Monopoly',
          description: 'Classic property trading board game',
          icon: '🏠',
          category: 'Strategy',
          difficulty: 'Hard',
          isOnline: true
        },
        {
          id: 'dubai-monopoly',
          name: 'Dubai Monopoly',
          description: 'Experience Dubai in this exclusive board game with real landmarks!',
          icon: '🏙️',
          category: 'Strategy',
          difficulty: 'Hard',
          isOnline: true
        }
  ];

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles['games-hub']}>
      <div className={styles['games-header']}>
        <h1>🎮 Games Hub</h1>
        <p>Take a break and enjoy some fun games!</p>
        
        <div className={styles['search-container']}>
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles['search-input']}
          />
        </div>
      </div>

      <div className={styles['games-grid']}>
        {filteredGames.map((game) => (
          <Link to={`/games/${game.id}`} key={game.id} className={styles['game-card']}>
            <div className={styles['game-icon']}>{game.icon}</div>
            <div className={styles['game-info']}>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
              <div className={styles['game-meta']}>
                <span className={`${styles.category} ${styles[game.category.toLowerCase()]}`}>
                  {game.category}
                </span>
                <span className={`${styles.difficulty} ${styles[game.difficulty.toLowerCase()]}`}>
                  {game.difficulty}
                </span>
                <span className={`${styles.mode} ${styles[game.isOnline ? 'online' : 'offline']}`}>
                  {game.isOnline ? '🌐 Online' : '💻 Offline'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles['games-stats']}>
        <div className={styles['stat-card']}>
          <h3>Total Games</h3>
          <p>{games.length}</p>
        </div>
        <div className={styles['stat-card']}>
          <h3>Online Games</h3>
          <p>{games.filter(g => g.isOnline).length}</p>
        </div>
        <div className={styles['stat-card']}>
          <h3>Offline Games</h3>
          <p>{games.filter(g => !g.isOnline).length}</p>
        </div>
      </div>
    </div>
  );
};

export default GamesHub;
