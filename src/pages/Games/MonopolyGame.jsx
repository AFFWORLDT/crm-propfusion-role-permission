import { useState, useEffect, useCallback, useRef } from 'react';
import './MonopolyGame.css';

const MonopolyGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [board, setBoard] = useState([]);
  const [dice, setDice] = useState([1, 1]);
  const [gamePhase, setGamePhase] = useState('roll');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [diceRolling, setDiceRolling] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    startingMoney: 1500,
    houseCost: 50,
    hotelCost: 50,
    jailFine: 50,
    passingGoBonus: 200
  });
  const [animations, setAnimations] = useState({
    playerMoving: false,
    moneyChanging: false,
    propertyBought: false
  });

  // Enhanced board data with more details
  const boardData = [
    { id: 0, name: 'GO', type: 'corner', color: '#8B4513', price: 0, rent: 0, position: 0, special: 'start' },
    { id: 1, name: 'Mediterranean Avenue', type: 'property', color: '#8B4513', price: 60, rent: [2, 10, 30, 90, 160, 250], houses: 0, maxHouses: 5, position: 1, group: 'brown' },
    { id: 2, name: 'Community Chest', type: 'chest', color: '#FFD700', price: 0, rent: 0, position: 2, special: 'chest' },
    { id: 3, name: 'Baltic Avenue', type: 'property', color: '#8B4513', price: 60, rent: [4, 20, 60, 180, 320, 450], houses: 0, maxHouses: 5, position: 3, group: 'brown' },
    { id: 4, name: 'Income Tax', type: 'tax', color: '#FF6347', price: 0, rent: 200, position: 4, special: 'tax' },
    { id: 5, name: 'Reading Railroad', type: 'railroad', color: '#696969', price: 200, rent: 25, position: 5, group: 'railroad' },
    { id: 6, name: 'Oriental Avenue', type: 'property', color: '#87CEEB', price: 100, rent: [6, 30, 90, 270, 400, 550], houses: 0, maxHouses: 5, position: 6, group: 'lightblue' },
    { id: 7, name: 'Chance', type: 'chance', color: '#FFD700', price: 0, rent: 0, position: 7, special: 'chance' },
    { id: 8, name: 'Vermont Avenue', type: 'property', color: '#87CEEB', price: 100, rent: [6, 30, 90, 270, 400, 550], houses: 0, maxHouses: 5, position: 8, group: 'lightblue' },
    { id: 9, name: 'Connecticut Avenue', type: 'property', color: '#87CEEB', price: 120, rent: [8, 40, 100, 300, 450, 600], houses: 0, maxHouses: 5, position: 9, group: 'lightblue' },
    { id: 10, name: 'Jail', type: 'corner', color: '#FFD700', price: 0, rent: 0, position: 10, special: 'jail' },
    { id: 11, name: 'St. Charles Place', type: 'property', color: '#FF69B4', price: 140, rent: [10, 50, 150, 450, 625, 750], houses: 0, maxHouses: 5, position: 11, group: 'pink' },
    { id: 12, name: 'Electric Company', type: 'utility', color: '#FFFF00', price: 150, rent: 0, position: 12, group: 'utility' },
    { id: 13, name: 'States Avenue', type: 'property', color: '#FF69B4', price: 140, rent: [10, 50, 150, 450, 625, 750], houses: 0, maxHouses: 5, position: 13, group: 'pink' },
    { id: 14, name: 'Virginia Avenue', type: 'property', color: '#FF69B4', price: 160, rent: [12, 60, 180, 500, 700, 900], houses: 0, maxHouses: 5, position: 14, group: 'pink' },
    { id: 15, name: 'Pennsylvania Railroad', type: 'railroad', color: '#696969', price: 200, rent: 25, position: 15, group: 'railroad' },
    { id: 16, name: 'St. James Place', type: 'property', color: '#FFA500', price: 180, rent: [14, 70, 200, 550, 750, 950], houses: 0, maxHouses: 5, position: 16, group: 'orange' },
    { id: 17, name: 'Community Chest', type: 'chest', color: '#FFD700', price: 0, rent: 0, position: 17, special: 'chest' },
    { id: 18, name: 'Tennessee Avenue', type: 'property', color: '#FFA500', price: 180, rent: [14, 70, 200, 550, 750, 950], houses: 0, maxHouses: 5, position: 18, group: 'orange' },
    { id: 19, name: 'New York Avenue', type: 'property', color: '#FFA500', price: 200, rent: [16, 80, 220, 600, 800, 1000], houses: 0, maxHouses: 5, position: 19, group: 'orange' },
    { id: 20, name: 'Free Parking', type: 'corner', color: '#32CD32', price: 0, rent: 0, position: 20, special: 'parking' },
    { id: 21, name: 'Kentucky Avenue', type: 'property', color: '#FF0000', price: 220, rent: [18, 90, 250, 700, 875, 1050], houses: 0, maxHouses: 5, position: 21, group: 'red' },
    { id: 22, name: 'Chance', type: 'chance', color: '#FFD700', price: 0, rent: 0, position: 22, special: 'chance' },
    { id: 23, name: 'Indiana Avenue', type: 'property', color: '#FF0000', price: 220, rent: [18, 90, 250, 700, 875, 1050], houses: 0, maxHouses: 5, position: 23, group: 'red' },
    { id: 24, name: 'Illinois Avenue', type: 'property', color: '#FF0000', price: 240, rent: [20, 100, 300, 750, 925, 1100], houses: 0, maxHouses: 5, position: 24, group: 'red' },
    { id: 25, name: 'B. & O. Railroad', type: 'railroad', color: '#696969', price: 200, rent: 25, position: 25, group: 'railroad' },
    { id: 26, name: 'Atlantic Avenue', type: 'property', color: '#FFFF00', price: 260, rent: [22, 110, 330, 800, 975, 1150], houses: 0, maxHouses: 5, position: 26, group: 'yellow' },
    { id: 27, name: 'Ventnor Avenue', type: 'property', color: '#FFFF00', price: 260, rent: [22, 110, 330, 800, 975, 1150], houses: 0, maxHouses: 5, position: 27, group: 'yellow' },
    { id: 28, name: 'Water Works', type: 'utility', color: '#FFFF00', price: 150, rent: 0, position: 28, group: 'utility' },
    { id: 29, name: 'Marvin Gardens', type: 'property', color: '#FFFF00', price: 280, rent: [24, 120, 360, 850, 1025, 1200], houses: 0, maxHouses: 5, position: 29, group: 'yellow' },
    { id: 30, name: 'Go To Jail', type: 'corner', color: '#FFD700', price: 0, rent: 0, position: 30, special: 'goToJail' },
    { id: 31, name: 'Pacific Avenue', type: 'property', color: '#00FF00', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houses: 0, maxHouses: 5, position: 31, group: 'green' },
    { id: 32, name: 'North Carolina Avenue', type: 'property', color: '#00FF00', price: 300, rent: [26, 130, 390, 900, 1100, 1275], houses: 0, maxHouses: 5, position: 32, group: 'green' },
    { id: 33, name: 'Community Chest', type: 'chest', color: '#FFD700', price: 0, rent: 0, position: 33, special: 'chest' },
    { id: 34, name: 'Pennsylvania Avenue', type: 'property', color: '#00FF00', price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houses: 0, maxHouses: 5, position: 34, group: 'green' },
    { id: 35, name: 'Short Line', type: 'railroad', color: '#696969', price: 200, rent: 25, position: 35, group: 'railroad' },
    { id: 36, name: 'Chance', type: 'chance', color: '#FFD700', price: 0, rent: 0, position: 36, special: 'chance' },
    { id: 37, name: 'Park Place', type: 'property', color: '#0000FF', price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houses: 0, maxHouses: 5, position: 37, group: 'blue' },
    { id: 38, name: 'Luxury Tax', type: 'tax', color: '#FF6347', price: 0, rent: 100, position: 38, special: 'tax' },
    { id: 39, name: 'Boardwalk', type: 'property', color: '#0000FF', price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houses: 0, maxHouses: 5, position: 39, group: 'blue' }
  ];

  // Enhanced chance cards
  const chanceCards = [
    { id: 1, text: 'Advance to GO (Collect $200)', action: 'goToGo', icon: '🏠' },
    { id: 2, text: 'Go directly to Jail', action: 'goToJail', icon: '🚔' },
    { id: 3, text: 'Pay poor tax of $15', action: 'payTax', amount: 15, icon: '💰' },
    { id: 4, text: 'Take a trip to Reading Railroad', action: 'goToRailroad', position: 5, icon: '🚂' },
    { id: 5, text: 'Bank pays you dividend of $50', action: 'collectMoney', amount: 50, icon: '🏦' },
    { id: 6, text: 'Get out of Jail Free', action: 'getOutOfJailFree', icon: '🔓' },
    { id: 7, text: 'Go back 3 spaces', action: 'goBack', spaces: 3, icon: '⬅️' },
    { id: 8, text: 'Make general repairs on all your property', action: 'repairs', amount: 25, icon: '🔧' },
    { id: 9, text: 'You have won a crossword competition', action: 'collectMoney', amount: 100, icon: '🏆' },
    { id: 10, text: 'Advance to Illinois Avenue', action: 'goToProperty', position: 24, icon: '🏃' }
  ];

  // Enhanced community chest cards
  const communityChestCards = [
    { id: 1, text: 'From sale of stock you get $45', action: 'collectMoney', amount: 45, icon: '📈' },
    { id: 2, text: 'Income tax refund', action: 'collectMoney', amount: 20, icon: '💸' },
    { id: 3, text: 'Holiday fund matures', action: 'collectMoney', amount: 100, icon: '🏖️' },
    { id: 4, text: 'Life insurance matures', action: 'collectMoney', amount: 100, icon: '📋' },
    { id: 5, text: 'Pay school tax of $150', action: 'payTax', amount: 150, icon: '🎓' },
    { id: 6, text: 'Doctor\'s fee', action: 'payTax', amount: 50, icon: '👨‍⚕️' },
    { id: 7, text: 'You inherit $100', action: 'collectMoney', amount: 100, icon: '👑' },
    { id: 8, text: 'Receive $25 consultancy fee', action: 'collectMoney', amount: 25, icon: '💼' },
    { id: 9, text: 'You have won second prize in a beauty contest', action: 'collectMoney', amount: 10, icon: '👸' },
    { id: 10, text: 'Bank error in your favor', action: 'collectMoney', amount: 200, icon: '🏦' }
  ];

  // Initialize board with enhanced features
  const initializeBoard = useCallback(() => {
    const boardWithOwnership = boardData.map(space => ({
      ...space,
      owner: null,
      mortgaged: false,
      hotel: false,
      houses: 0,
      canBuild: false,
      rentIndex: 0
    }));

    console.log('Initializing board with', boardWithOwnership.length, 'spaces');
    setBoard(boardWithOwnership);
  }, []);

  // Initialize players with enhanced features
  const initializePlayers = useCallback((playerCount) => {
    const playerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'];
    const newPlayers = [];

    for (let i = 0; i < playerCount; i++) {
      newPlayers.push({
        id: i,
        name: playerNames[i],
        color: playerColors[i],
        money: gameSettings.startingMoney,
        position: 0,
        properties: [],
        getOutOfJailFree: 0,
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
        totalWorth: gameSettings.startingMoney,
        housesOwned: 0,
        hotelsOwned: 0,
        railroadsOwned: 0,
        utilitiesOwned: 0
      });
    }

    setPlayers(newPlayers);
    setCurrentPlayer(0);
  }, [gameSettings.startingMoney]);

  // Start new game
  const startGame = useCallback((playerCount) => {
    initializeBoard();
    initializePlayers(playerCount);
    setGameState('playing');
    setTurnCount(0);
    setGamePhase('roll');
  }, [initializeBoard, initializePlayers]);

  // Initialize board on component mount
  useEffect(() => {
    if (gameState === 'menu') {
      initializeBoard();
    }
  }, [gameState, initializeBoard]);

  // Enhanced dice rolling with animations
  const rollDice = useCallback(() => {
    if (gamePhase !== 'roll' || diceRolling) return;

    setDiceRolling(true);
    
    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(rollInterval);
      const finalDice = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ];
      setDice(finalDice);
      setDiceRolling(false);

      const totalRoll = finalDice[0] + finalDice[1];
      const currentPlayerData = players[currentPlayer];

      if (currentPlayerData.inJail) {
        if (finalDice[0] === finalDice[1]) {
          setPlayers(prev => prev.map(p => 
            p.id === currentPlayer ? { ...p, inJail: false, jailTurns: 0 } : p
          ));
          movePlayer(totalRoll);
        } else {
          setPlayers(prev => prev.map(p => 
            p.id === currentPlayer ? { ...p, jailTurns: p.jailTurns + 1 } : p
          ));
          if (currentPlayerData.jailTurns >= 3) {
            setPlayers(prev => prev.map(p => 
              p.id === currentPlayer ? { ...p, inJail: false, jailTurns: 0 } : p
            ));
            movePlayer(totalRoll);
          }
          setGamePhase('endTurn');
        }
      } else {
        movePlayer(totalRoll);
      }

      setGamePhase('buy');
    }, 1000);
  }, [gamePhase, players, currentPlayer, diceRolling]);

  // Enhanced player movement with animations
  const movePlayer = useCallback((spaces) => {
    setAnimations(prev => ({ ...prev, playerMoving: true }));
    
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = newPlayers[currentPlayer];
      let newPosition = (player.position + spaces) % 40;

      if (newPosition < player.position) {
        player.money += gameSettings.passingGoBonus;
        // Animate money change
        setAnimations(prev => ({ ...prev, moneyChanging: true }));
        setTimeout(() => setAnimations(prev => ({ ...prev, moneyChanging: false })), 1000);
      }

      player.position = newPosition;
      return newPlayers;
    });

    setTimeout(() => {
      handleLandingOnSpace();
      setAnimations(prev => ({ ...prev, playerMoving: false }));
    }, 800);
  }, [currentPlayer, gameSettings.passingGoBonus]);

  // Enhanced space handling
  const handleLandingOnSpace = useCallback(() => {
    const player = players[currentPlayer];
    const space = board[player.position];

    switch (space.type) {
      case 'property':
      case 'railroad':
      case 'utility':
        if (space.owner === null && player.money >= space.price) {
          setGamePhase('buy');
        } else if (space.owner !== null && space.owner !== player.id) {
          payRent(space);
        } else {
          setGamePhase('endTurn');
        }
        break;
      case 'tax':
        payTax(space.rent);
        break;
      case 'chance':
        drawChanceCard();
        break;
      case 'chest':
        drawCommunityChestCard();
        break;
      case 'corner':
        if (space.name === 'Go To Jail') {
          goToJail();
        } else if (space.name === 'Free Parking') {
          // Collect parking money if any
          setGamePhase('endTurn');
        } else {
          setGamePhase('endTurn');
        }
        break;
      default:
        setGamePhase('endTurn');
    }
  }, [players, currentPlayer, board]);

  // Enhanced property buying
  const buyProperty = useCallback(() => {
    if (gamePhase !== 'buy') return;

    const player = players[currentPlayer];
    const space = board[player.position];

    if (space.owner === null && player.money >= space.price) {
      setPlayers(prev => prev.map(p => 
        p.id === currentPlayer ? { 
          ...p, 
          money: p.money - space.price, 
          properties: [...p.properties, space.id],
          totalWorth: p.totalWorth + space.price
        } : p
      ));

      setBoard(prev => prev.map(s => 
        s.id === space.id ? { ...s, owner: currentPlayer } : s
      ));

      // Animate property bought
      setAnimations(prev => ({ ...prev, propertyBought: true }));
      setTimeout(() => setAnimations(prev => ({ ...prev, propertyBought: false })), 1000);

      setGamePhase('endTurn');
    }
  }, [gamePhase, players, currentPlayer, board]);

  // Enhanced rent calculation
  const payRent = useCallback((space) => {
    const player = players[currentPlayer];
    const owner = players.find(p => p.id === space.owner);
    let rentAmount = space.rent;

    if (space.type === 'property') {
      if (space.hotel) {
        rentAmount = space.rent[5];
      } else if (space.houses > 0) {
        rentAmount = space.rent[space.houses];
      } else {
        rentAmount = space.rent[0];
      }
    } else if (space.type === 'railroad') {
      const railroadsOwned = owner.properties.filter(propId => {
        const prop = board.find(b => b.id === propId);
        return prop && prop.type === 'railroad';
      }).length;
      rentAmount = 25 * Math.pow(2, railroadsOwned - 1);
    } else if (space.type === 'utility') {
      const utilitiesOwned = owner.properties.filter(propId => {
        const prop = board.find(b => b.id === propId);
        return prop && prop.type === 'utility';
      }).length;
      rentAmount = (dice[0] + dice[1]) * (utilitiesOwned === 1 ? 4 : 10);
    }

    if (player.money >= rentAmount) {
      setPlayers(prev => prev.map(p => {
        if (p.id === currentPlayer) {
          return { ...p, money: p.money - rentAmount, totalWorth: p.totalWorth - rentAmount };
        } else if (p.id === space.owner) {
          return { ...p, money: p.money + rentAmount, totalWorth: p.totalWorth + rentAmount };
        }
        return p;
      }));
    } else {
      handleBankruptcy(rentAmount);
    }

    setGamePhase('endTurn');
  }, [players, currentPlayer, board, dice]);

  // Pay tax function
  const payTax = useCallback((amount) => {
    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer ? { 
        ...p, 
        money: p.money - amount,
        totalWorth: p.totalWorth - amount
      } : p
    ));
    setGamePhase('endTurn');
  }, [currentPlayer]);

  // Enhanced card drawing
  const drawChanceCard = useCallback(() => {
    const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
    handleCardAction(card);
  }, [chanceCards]);

  const drawCommunityChestCard = useCallback(() => {
    const card = communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
    handleCardAction(card);
  }, [communityChestCards]);

  // Enhanced card action handling
  const handleCardAction = useCallback((card) => {
    const player = players[currentPlayer];

    switch (card.action) {
      case 'goToGo':
        setPlayers(prev => prev.map(p => 
          p.id === currentPlayer ? { 
            ...p, 
            position: 0, 
            money: p.money + gameSettings.passingGoBonus,
            totalWorth: p.totalWorth + gameSettings.passingGoBonus
          } : p
        ));
        break;
      case 'goToJail':
        goToJail();
        break;
      case 'payTax':
        payTax(card.amount);
        return;
      case 'collectMoney':
        setPlayers(prev => prev.map(p => 
          p.id === currentPlayer ? { 
            ...p, 
            money: p.money + card.amount,
            totalWorth: p.totalWorth + card.amount
          } : p
        ));
        break;
      case 'getOutOfJailFree':
        setPlayers(prev => prev.map(p => 
          p.id === currentPlayer ? { ...p, getOutOfJailFree: p.getOutOfJailFree + 1 } : p
        ));
        break;
      case 'goToRailroad':
        setPlayers(prev => prev.map(p => 
          p.id === currentPlayer ? { ...p, position: card.position } : p
        ));
        break;
      case 'goToProperty':
        setPlayers(prev => prev.map(p => 
          p.id === currentPlayer ? { ...p, position: card.position } : p
        ));
        break;
      case 'goBack':
        setPlayers(prev => prev.map(p => 
          p.id === currentPlayer ? { ...p, position: Math.max(0, p.position - card.spaces) } : p
        ));
        break;
      case 'repairs': {
        const repairCost = player.properties.length * card.amount;
        setPlayers(prev => prev.map(p => 
          p.id === currentPlayer ? { 
            ...p, 
            money: p.money - repairCost,
            totalWorth: p.totalWorth - repairCost
          } : p
        ));
        break;
      }
    }

    setGamePhase('endTurn');
  }, [players, currentPlayer, payTax, gameSettings.passingGoBonus]);

  // Enhanced jail system
  const goToJail = useCallback(() => {
    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer ? { ...p, position: 10, inJail: true, jailTurns: 0 } : p
    ));
    setGamePhase('endTurn');
  }, [currentPlayer]);

  // Enhanced bankruptcy handling
  const handleBankruptcy = useCallback((debt) => {
    const player = players[currentPlayer];
    
    if (player.properties.length > 0) {
      setBoard(prev => prev.map(space => 
        player.properties.includes(space.id) ? { ...space, owner: null } : space
      ));
    }

    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer ? { 
        ...p, 
        bankrupt: true, 
        money: 0, 
        properties: [],
        totalWorth: 0
      } : p
    ));

    const activePlayers = players.filter(p => !p.bankrupt);
    if (activePlayers.length <= 1) {
      endGame();
    } else {
      setGamePhase('endTurn');
    }
  }, [players, currentPlayer]);

  // Enhanced turn management
  const endTurn = useCallback(() => {
    if (gamePhase !== 'endTurn') return;

    let nextPlayer = (currentPlayer + 1) % players.length;
    while (players[nextPlayer].bankrupt && nextPlayer !== currentPlayer) {
      nextPlayer = (nextPlayer + 1) % players.length;
    }

    if (nextPlayer === currentPlayer) {
      endGame();
      return;
    }

    setCurrentPlayer(nextPlayer);
    setGamePhase('roll');
    setTurnCount(prev => prev + 1);
  }, [gamePhase, currentPlayer, players]);

  // Enhanced game ending
  const endGame = useCallback(() => {
    setGameState('gameOver');
  }, []);

  // Enhanced building system
  const buildHouse = useCallback((propertyId) => {
    const player = players[currentPlayer];
    const property = board[propertyId];
    const houseCost = gameSettings.houseCost;

    if (property.owner === currentPlayer && 
        property.houses < property.maxHouses && 
        player.money >= houseCost) {
      
      setBoard(prev => prev.map(p => 
        p.id === propertyId ? { ...p, houses: p.houses + 1 } : p
      ));

      setPlayers(prev => prev.map(p => 
        p.id === currentPlayer ? { 
          ...p, 
          money: p.money - houseCost,
          totalWorth: p.totalWorth + houseCost,
          housesOwned: p.housesOwned + 1
        } : p
      ));
    }
  }, [players, currentPlayer, board, gameSettings.houseCost]);

  const buildHotel = useCallback((propertyId) => {
    const player = players[currentPlayer];
    const property = board[propertyId];
    const hotelCost = gameSettings.hotelCost;

    if (property.owner === currentPlayer && 
        property.houses === property.maxHouses && 
        !property.hotel && 
        player.money >= hotelCost) {
      
      setBoard(prev => prev.map(p => 
        p.id === propertyId ? { ...p, hotel: true, houses: 0 } : p
      ));

      setPlayers(prev => prev.map(p => 
        p.id === currentPlayer ? { 
          ...p, 
          money: p.money - hotelCost,
          totalWorth: p.totalWorth + hotelCost,
          hotelsOwned: p.hotelsOwned + 1,
          housesOwned: p.housesOwned - property.maxHouses
        } : p
      ));
    }
  }, [players, currentPlayer, board, gameSettings.hotelCost]);

  // Enhanced property management
  const mortgageProperty = useCallback((propertyId) => {
    const property = board[propertyId];
    const player = players[currentPlayer];

    if (property.owner === currentPlayer && !property.mortgaged) {
      const mortgageValue = Math.floor(property.price / 2);
      
      setBoard(prev => prev.map(p => 
        p.id === propertyId ? { ...p, mortgaged: true } : p
      ));

      setPlayers(prev => prev.map(p => 
        p.id === currentPlayer ? { 
          ...p, 
          money: p.money + mortgageValue,
          totalWorth: p.totalWorth + mortgageValue
        } : p
      ));
    }
  }, [players, currentPlayer, board]);

  const unmortgageProperty = useCallback((propertyId) => {
    const property = board[propertyId];
    const player = players[currentPlayer];

    if (property.owner === currentPlayer && property.mortgaged) {
      const unmortgageCost = Math.ceil(property.price * 0.55);
      
      if (player.money >= unmortgageCost) {
        setBoard(prev => prev.map(p => 
          p.id === propertyId ? { ...p, mortgaged: false } : p
        ));

        setPlayers(prev => prev.map(p => 
          p.id === currentPlayer ? { 
            ...p, 
            money: p.money - unmortgageCost,
            totalWorth: p.totalWorth - unmortgageCost
          } : p
        ));
      }
    }
  }, [players, currentPlayer, board]);

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="monopoly-game">
        <div className="game-menu">
          <h1>🏠 Monopoly</h1>
          <p>Buy, sell, and trade your way to victory!</p>
          <p>Be the last player standing to win!</p>
          
          <div className="player-selector">
            <h3>Select Number of Players:</h3>
            <div className="player-buttons">
              {[2, 3, 4, 5, 6].map(num => (
                <button 
                  key={num}
                  onClick={() => startGame(num)} 
                  className="player-btn"
                >
                  {num} Players
                </button>
              ))}
            </div>
          </div>
          
          <div className="game-rules">
            <h3>How to Play:</h3>
            <ul>
              <li>Roll dice to move around the board</li>
              <li>Buy properties when you land on them</li>
              <li>Build houses and hotels to increase rent</li>
              <li>Collect rent from other players</li>
              <li>Use Chance and Community Chest cards</li>
              <li>Be the last player with money to win!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameState === 'gameOver') {
    const winner = players.find(p => !p.bankrupt);
    return (
      <div className="monopoly-game">
        <div className="game-over">
          <h2>🎉 Game Over!</h2>
          {winner && (
            <div className="winner">
              <h3>🏆 {winner.name} Wins!</h3>
              <p>Final Money: ${winner.money.toLocaleString()}</p>
              <p>Properties Owned: {winner.properties.length}</p>
              <p>Total Worth: ${winner.totalWorth.toLocaleString()}</p>
            </div>
          )}
          <button onClick={() => setGameState('menu')} className="new-game-btn">
            New Game
          </button>
        </div>
      </div>
    );
  }

  const currentPlayerData = players[currentPlayer];

  return (
    <div className="monopoly-game">
      <div className="game-header">
        <div className="game-info">
          <h2>🏠 Monopoly</h2>
          <div className="turn-info">
            <span>Turn: {turnCount + 1}</span>
            <span>Phase: {gamePhase}</span>
          </div>
        </div>
        
        <div className="current-player">
          <div 
            className="player-token"
            style={{ backgroundColor: currentPlayerData.color }}
          >
            {currentPlayerData.name[0]}
          </div>
          <div className="player-details">
            <span className="player-name">{currentPlayerData.name}</span>
            <span className="player-money">${currentPlayerData.money.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="game-container">
        <div className="board-container">
          <div className="monopoly-board">
            {board.map((space, index) => (
              <div
                key={space.id}
                className={`board-space ${space.type} ${space.mortgaged ? 'mortgaged' : ''}`}
                style={{ 
                  backgroundColor: space.color,
                  borderColor: space.owner !== null ? players[space.owner]?.color : 'transparent'
                }}
                onClick={() => setSelectedProperty(space)}
              >
                <div className="space-name">{space.name}</div>
                {space.type === 'property' && (
                  <>
                    <div className="space-price">${space.price.toLocaleString()}</div>
                    {space.houses > 0 && (
                      <div className="houses">
                        {Array(space.houses).fill('🏠').join('')}
                      </div>
                    )}
                    {space.hotel && <div className="hotel">🏨</div>}
                    {space.owner !== null && (
                      <div className="owner-indicator" style={{ backgroundColor: players[space.owner]?.color }}>
                        {players[space.owner]?.name[0]}
                      </div>
                    )}
                  </>
                )}
                {space.type === 'railroad' && (
                  <>
                    <div className="railroad-icon">🚂</div>
                    <div className="space-price">${space.price.toLocaleString()}</div>
                    {space.owner !== null && (
                      <div className="owner-indicator" style={{ backgroundColor: players[space.owner]?.color }}>
                        {players[space.owner]?.name[0]}
                      </div>
                    )}
                  </>
                )}
                {space.type === 'utility' && (
                  <>
                    <div className="utility-icon">⚡</div>
                    <div className="space-price">${space.price.toLocaleString()}</div>
                    {space.owner !== null && (
                      <div className="owner-indicator" style={{ backgroundColor: players[space.owner]?.color }}>
                        {players[space.owner]?.name[0]}
                      </div>
                    )}
                  </>
                )}
                {space.type === 'corner' && (
                  <div className="corner-icon">
                    {space.name === 'GO' && '🏠'}
                    {space.name === 'Jail' && '🚔'}
                    {space.name === 'Free Parking' && '🅿️'}
                    {space.name === 'Go To Jail' && '🚔'}
                  </div>
                )}
                {space.type === 'chance' && (
                  <>
                    <div className="chance-icon">🎲</div>
                    <div className="space-label">Chance</div>
                  </>
                )}
                {space.type === 'chest' && (
                  <>
                    <div className="chest-icon">📦</div>
                    <div className="space-label">Community Chest</div>
                  </>
                )}
                {space.type === 'tax' && (
                  <>
                    <div className="tax-icon">💰</div>
                    <div className="space-label">{space.name}</div>
                    <div className="space-price">${space.rent.toLocaleString()}</div>
                  </>
                )}
                
                {players.map(player => (
                  player.position === space.id && !player.bankrupt && (
                    <div
                      key={player.id}
                      className="player-token-on-board"
                      style={{ backgroundColor: player.color }}
                    >
                      {player.name[0]}
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="game-sidebar">
          <div className="dice-section">
            <h3>🎲 Dice</h3>
            <div className={`dice ${diceRolling ? 'rolling' : ''}`}>
              <div className="die">{dice[0]}</div>
              <div className="die">{dice[1]}</div>
            </div>
            <button 
              onClick={rollDice} 
              className="roll-btn"
              disabled={gamePhase !== 'roll' || diceRolling}
            >
              {diceRolling ? 'Rolling...' : 'Roll Dice'}
            </button>
          </div>

          <div className="actions-section">
            <h3>Actions</h3>
            {gamePhase === 'buy' && (
              <button onClick={buyProperty} className="action-btn buy-btn">
                Buy Property
              </button>
            )}
            {gamePhase === 'endTurn' && (
              <button onClick={endTurn} className="action-btn end-turn-btn">
                End Turn
              </button>
            )}
          </div>

          <div className="players-section">
            <h3>Players</h3>
            {players.map((player, index) => (
              <div 
                key={player.id} 
                className={`player-info ${index === currentPlayer ? 'current' : ''} ${player.bankrupt ? 'bankrupt' : ''}`}
              >
                <div 
                  className="player-token-small"
                  style={{ backgroundColor: player.color }}
                >
                  {player.name[0]}
                </div>
                <div className="player-stats">
                  <span className="player-name">{player.name}</span>
                  <span className="player-money">${player.money.toLocaleString()}</span>
                  <span className="player-properties">{player.properties.length} properties</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Property Details Modal */}
      {selectedProperty && (
        <div className="property-modal">
          <div className="modal-content">
            <h3>{selectedProperty.name}</h3>
            <div className="property-details">
              <p>Type: {selectedProperty.type}</p>
              <p>Price: ${selectedProperty.price.toLocaleString()}</p>
              {selectedProperty.type === 'property' && (
                <>
                  <p>Base Rent: ${selectedProperty.rent[0].toLocaleString()}</p>
                  <p>Houses: {selectedProperty.houses}/{selectedProperty.maxHouses}</p>
                  <p>Hotel: {selectedProperty.hotel ? 'Yes' : 'No'}</p>
                  <p>Group: {selectedProperty.group}</p>
                </>
              )}
              {selectedProperty.owner !== null && (
                <p>Owner: {players[selectedProperty.owner]?.name}</p>
              )}
            </div>
            
            {selectedProperty.owner === currentPlayer && (
              <div className="property-actions">
                {selectedProperty.type === 'property' && selectedProperty.houses < selectedProperty.maxHouses && (
                  <button onClick={() => buildHouse(selectedProperty.id)} className="action-btn">
                    Build House (${gameSettings.houseCost.toLocaleString()})
                  </button>
                )}
                {selectedProperty.type === 'property' && selectedProperty.houses === selectedProperty.maxHouses && !selectedProperty.hotel && (
                  <button onClick={() => buildHotel(selectedProperty.id)} className="action-btn">
                    Build Hotel (${gameSettings.hotelCost.toLocaleString()})
                  </button>
                )}
                {!selectedProperty.mortgaged ? (
                  <button onClick={() => mortgageProperty(selectedProperty.id)} className="action-btn">
                    Mortgage (${Math.floor(selectedProperty.price / 2).toLocaleString()})
                  </button>
                ) : (
                  <button onClick={() => unmortgageProperty(selectedProperty.id)} className="action-btn">
                    Unmortgage (${Math.ceil(selectedProperty.price * 0.55).toLocaleString()})
                  </button>
                )}
              </div>
            )}
            
            <button onClick={() => setSelectedProperty(null)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};



export default MonopolyGame;
