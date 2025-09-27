import React, { useState, useEffect, useCallback, useRef } from 'react';
import './DubaiMonopolyGame.css';

const DubaiMonopolyGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [board, setBoard] = useState([]);
  const [dice, setDice] = useState([1, 1]);
  const [gamePhase, setGamePhase] = useState('roll');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [diceRolling, setDiceRolling] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showBankruptcyModal, setShowBankruptcyModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [showTradeOfferModal, setShowTradeOfferModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [auctionProperty, setAuctionProperty] = useState(null);
  const [auctionBids, setAuctionBids] = useState([]);
  const [currentBid, setCurrentBid] = useState(0);
  const [tradeOffer, setTradeOffer] = useState(null);
  const [selectedPropertiesForTrade, setSelectedPropertiesForTrade] = useState([]);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    startingMoney: 50000000, // 50 Million AED starting money for realistic Dubai prices
    houseCost: 1000000, // 1 Million AED per house
    hotelCost: 2000000, // 2 Million AED per hotel
    jailFine: 500000, // 500K AED jail fine
    passingGoBonus: 5000000 // 5 Million AED for passing GO
  });

  // Dubai-themed board with REALISTIC Dubai property prices (in AED)
  const boardData = [
    { id: 0, name: 'GO', type: 'corner', color: '#8B4513', price: 0, rent: 0, position: 0, special: 'start', emoji: '🏠', description: 'Start your Dubai adventure!' },
    { id: 1, name: 'Deira Gold Souk', type: 'property', color: '#FFD700', price: 1500000, rent: [12000, 60000, 180000, 540000, 800000, 1100000], houses: 0, maxHouses: 5, position: 1, group: 'gold', emoji: '🥇', description: 'Historic gold trading center' },
    { id: 2, name: 'Community Chest', type: 'chest', color: '#FFD700', price: 0, rent: 0, position: 2, special: 'chest', emoji: '📦', description: 'Dubai community events' },
    { id: 3, name: 'Spice Souk', type: 'property', color: '#FFD700', price: 1200000, rent: [10000, 50000, 150000, 450000, 625000, 750000], houses: 0, maxHouses: 5, position: 3, group: 'gold', emoji: '🌶️', description: 'Traditional spice market' },
    { id: 4, name: 'Dubai Municipality Tax', type: 'tax', color: '#FF6347', price: 0, rent: 200000, position: 4, special: 'tax', emoji: '💰', description: 'Annual property tax' },
    { id: 5, name: 'Dubai Metro Red Line', type: 'railroad', color: '#FF0000', price: 2000000, rent: 250000, position: 5, group: 'metro', emoji: '🚇', description: 'Main metro line connecting Dubai' },
    { id: 6, name: 'Al Fahidi Fort', type: 'property', color: '#8B4513', price: 2500000, rent: [20000, 100000, 300000, 900000, 1600000, 2500000], houses: 0, maxHouses: 5, position: 6, group: 'heritage', emoji: '🏰', description: 'Historic fort and museum' },
    { id: 7, name: 'Chance', type: 'chance', color: '#FFD700', price: 0, rent: 0, position: 7, special: 'chance', emoji: '🎲', description: 'Dubai adventure awaits!' },
    { id: 8, name: 'Dubai Museum', type: 'property', color: '#8B4513', price: 2200000, rent: [18000, 90000, 250000, 700000, 875000, 1050000], houses: 0, maxHouses: 5, position: 8, group: 'heritage', emoji: '🏛️', description: 'Cultural heritage center' },
    { id: 9, name: 'Bastakiya Quarter', type: 'property', color: '#8B4513', price: 2800000, rent: [22000, 110000, 330000, 800000, 975000, 1150000], houses: 0, maxHouses: 5, position: 9, group: 'heritage', emoji: '🏘️', description: 'Traditional Emirati neighborhood' },
    { id: 10, name: 'Jail', type: 'corner', color: '#FFD700', price: 0, rent: 0, position: 10, special: 'jail', emoji: '🚔', description: 'Dubai Central Jail' },
    { id: 11, name: 'Dubai Creek', type: 'property', color: '#87CEEB', price: 3500000, rent: [28000, 150000, 500000, 1200000, 1400000, 2000000], houses: 0, maxHouses: 5, position: 11, group: 'waterfront', emoji: '🌊', description: 'Historic waterway' },
    { id: 12, name: 'DEWA', type: 'utility', color: '#FFFF00', price: 1500000, rent: 0, position: 12, group: 'utility', emoji: '⚡', description: 'Dubai Electricity & Water Authority' },
    { id: 13, name: 'Dubai Frame', type: 'property', color: '#87CEEB', price: 3200000, rent: [26000, 130000, 390000, 900000, 1100000, 1275000], houses: 0, maxHouses: 5, position: 13, group: 'waterfront', emoji: '🖼️', description: 'Iconic architectural landmark' },
    { id: 14, name: 'Zabeel Park', type: 'property', color: '#87CEEB', price: 3800000, rent: [30000, 150000, 450000, 1000000, 1200000, 1400000], houses: 0, maxHouses: 5, position: 14, group: 'waterfront', emoji: '🌳', description: 'Central park and recreation area' },
    { id: 15, name: 'Dubai Metro Green Line', type: 'railroad', color: '#00FF00', price: 2000000, rent: 250000, position: 15, group: 'metro', emoji: '🚇', description: 'Secondary metro line' },
    { id: 16, name: 'Dubai Mall', type: 'property', color: '#FF69B4', price: 4500000, rent: [35000, 175000, 500000, 1100000, 1300000, 1500000], houses: 0, maxHouses: 5, position: 16, group: 'shopping', emoji: '🛍️', description: 'World\'s largest shopping mall' },
    { id: 17, name: 'Community Chest', type: 'chest', color: '#FFD700', price: 0, rent: 0, position: 17, special: 'chest', emoji: '📦', description: 'Dubai community events' },
    { id: 18, name: 'Mall of Emirates', type: 'property', color: '#FF69B4', price: 4200000, rent: [32000, 160000, 450000, 1000000, 1200000, 1400000], houses: 0, maxHouses: 5, position: 18, group: 'shopping', emoji: '🏬', description: 'Luxury shopping destination' },
    { id: 19, name: 'Ibn Battuta Mall', type: 'property', color: '#FF69B4', price: 3800000, rent: [30000, 150000, 450000, 1000000, 1200000, 1400000], houses: 0, maxHouses: 5, position: 19, group: 'shopping', emoji: '🏛️', description: 'Themed shopping experience' },
    { id: 20, name: 'Free Parking', type: 'corner', color: '#32CD32', price: 0, rent: 0, position: 20, special: 'parking', emoji: '🅿️', description: 'Free parking in Dubai' },
    { id: 21, name: 'Burj Al Arab', type: 'property', color: '#FF0000', price: 8000000, rent: [60000, 300000, 900000, 2000000, 2500000, 3000000], houses: 0, maxHouses: 5, position: 21, group: 'luxury', emoji: '⛵', description: '7-star luxury hotel' },
    { id: 22, name: 'Chance', type: 'chance', color: '#FFD700', price: 0, rent: 0, position: 22, special: 'chance', emoji: '🎲', description: 'Dubai adventure awaits!' },
    { id: 23, name: 'Atlantis Hotel', type: 'property', color: '#FF0000', price: 7500000, rent: [55000, 275000, 825000, 1800000, 2200000, 2750000], houses: 0, maxHouses: 5, position: 23, group: 'luxury', emoji: '🏨', description: 'Iconic Palm resort' },
    { id: 24, name: 'Palm Jumeirah', type: 'property', color: '#FF0000', price: 9000000, rent: [70000, 350000, 1000000, 2200000, 2600000, 3200000], houses: 0, maxHouses: 5, position: 24, group: 'luxury', emoji: '🌴', description: 'Artificial palm-shaped island' },
    { id: 25, name: 'Dubai Metro Blue Line', type: 'railroad', color: '#0000FF', price: 2000000, rent: 250000, position: 25, group: 'metro', emoji: '🚇', description: 'Future metro extension' },
    { id: 26, name: 'Dubai Marina', type: 'property', color: '#FFFF00', price: 6000000, rent: [45000, 225000, 675000, 1400000, 1700000, 2000000], houses: 0, maxHouses: 5, position: 26, group: 'marina', emoji: '⛵', description: 'Modern waterfront district' },
    { id: 27, name: 'JBR Walk', type: 'property', color: '#FFFF00', price: 5800000, rent: [43000, 215000, 645000, 1300000, 1600000, 1900000], houses: 0, maxHouses: 5, position: 27, group: 'marina', emoji: '🏖️', description: 'Beachfront promenade' },
    { id: 28, name: 'Etisalat', type: 'utility', color: '#FFFF00', price: 1500000, rent: 0, position: 28, group: 'utility', emoji: '📱', description: 'Telecommunications company' },
    { id: 29, name: 'Bluewaters Island', type: 'property', color: '#FFFF00', price: 6500000, rent: [50000, 250000, 750000, 1500000, 1800000, 2100000], houses: 0, maxHouses: 5, position: 29, group: 'marina', emoji: '🏝️', description: 'Island with Ain Dubai' },
    { id: 30, name: 'Go To Jail', type: 'corner', color: '#FFD700', price: 0, rent: 0, position: 30, special: 'goToJail', emoji: '🚔', description: 'Go directly to jail' },
    { id: 31, name: 'Dubai Hills', type: 'property', color: '#00FF00', price: 7000000, rent: [55000, 275000, 825000, 1600000, 1900000, 2200000], houses: 0, maxHouses: 5, position: 31, group: 'residential', emoji: '🏡', description: 'Master-planned community' },
    { id: 32, name: 'Community Chest', type: 'chest', color: '#FFD700', price: 0, rent: 0, position: 32, special: 'chest', emoji: '📦', description: 'Dubai community events' },
    { id: 33, name: 'Emirates Hills', type: 'property', color: '#00FF00', price: 7500000, rent: [60000, 300000, 900000, 1700000, 2000000, 2300000], houses: 0, maxHouses: 5, position: 33, group: 'residential', emoji: '🏘️', description: 'Luxury residential area' },
    { id: 34, name: 'Palm Jebel Ali', type: 'property', color: '#00FF00', price: 8000000, rent: [65000, 325000, 975000, 1800000, 2100000, 2400000], houses: 0, maxHouses: 5, position: 34, group: 'residential', emoji: '🌴', description: 'Second palm island' },
    { id: 35, name: 'Dubai Metro Purple Line', type: 'railroad', color: '#800080', price: 2000000, rent: 250000, position: 35, group: 'metro', emoji: '🚇', description: 'Future metro line' },
    { id: 36, name: 'Chance', type: 'chance', color: '#FFD700', price: 0, rent: 0, position: 36, special: 'chance', emoji: '🎲', description: 'Dubai adventure awaits!' },
    { id: 37, name: 'Downtown Dubai', type: 'property', color: '#0000FF', price: 12000000, rent: [90000, 450000, 1350000, 2500000, 3000000, 3500000], houses: 0, maxHouses: 5, position: 37, group: 'downtown', emoji: '🏙️', description: 'City center and business district' },
    { id: 38, name: 'Luxury Tax', type: 'tax', color: '#FF6347', price: 0, rent: 500000, position: 38, special: 'tax', emoji: '💎', description: 'Luxury property tax' },
    { id: 39, name: 'Burj Khalifa', type: 'property', color: '#0000FF', price: 15000000, rent: [120000, 600000, 1800000, 3000000, 3500000, 4000000], houses: 0, maxHouses: 5, position: 39, group: 'downtown', emoji: '🗼', description: 'World\'s tallest building' }
  ];

  // Dubai-themed chance cards
  const chanceCards = [
    { id: 1, text: 'Visit Dubai Mall - Collect AED 200', action: 'collectMoney', amount: 200, emoji: '🛍️' },
    { id: 2, text: 'Go directly to Jail', action: 'goToJail', emoji: '🚔' },
    { id: 3, text: 'Pay Dubai Municipality fee AED 50', action: 'payTax', amount: 50, emoji: '🏛️' },
    { id: 4, text: 'Take Dubai Metro to Deira - Free ride', action: 'goToProperty', position: 1, emoji: '🚇' },
    { id: 5, text: 'Dubai Tourism bonus AED 100', action: 'collectMoney', amount: 100, emoji: '🏖️' },
    { id: 6, text: 'Get out of Jail Free', action: 'getOutOfJailFree', emoji: '🔓' },
    { id: 7, text: 'Go back 3 spaces', action: 'goBack', spaces: 3, emoji: '⬅️' },
    { id: 8, text: 'Dubai Expo 2020 bonus AED 150', action: 'collectMoney', amount: 150, emoji: '🌍' },
    { id: 9, text: 'Dubai Shopping Festival - Collect AED 120', action: 'collectMoney', amount: 120, emoji: '🎉' },
    { id: 10, text: 'Advance to Burj Khalifa', action: 'goToProperty', position: 39, emoji: '🗼' }
  ];

  // Dubai-themed community chest cards
  const communityChestCards = [
    { id: 1, text: 'Dubai Duty Free bonus AED 80', action: 'collectMoney', amount: 80, emoji: '✈️' },
    { id: 2, text: 'Dubai Taxi refund AED 30', action: 'collectMoney', amount: 30, emoji: '🚕' },
    { id: 3, text: 'Dubai Parks bonus AED 100', action: 'collectMoney', amount: 100, emoji: '🎢' },
    { id: 4, text: 'Pay Dubai RTA fine AED 80', action: 'payTax', amount: 80, emoji: '🚗' },
    { id: 5, text: 'Dubai Creek cruise AED 60', action: 'payTax', amount: 60, emoji: '⛵' },
    { id: 6, text: 'Dubai Miracle Garden bonus AED 90', action: 'collectMoney', amount: 90, emoji: '🌸' },
    { id: 7, text: 'Dubai Frame entrance AED 40', action: 'payTax', amount: 40, emoji: '🖼️' },
    { id: 8, text: 'Dubai Fountain show bonus AED 70', action: 'collectMoney', amount: 70, emoji: '⛲' },
    { id: 9, text: 'Dubai Desert Safari AED 120', action: 'payTax', amount: 120, emoji: '🐪' },
    { id: 10, text: 'Dubai Heritage bonus AED 110', action: 'collectMoney', amount: 110, emoji: '🏺' }
  ];

  // Initialize board with Dubai theme
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

    console.log('Initializing Dubai Monopoly board with', boardWithOwnership.length, 'spaces');
    setBoard(boardWithOwnership);
  }, []);

  // Initialize board when game state is menu
  useEffect(() => {
    if (gameState === 'menu') {
      initializeBoard();
    }
  }, [gameState, initializeBoard]);

  // Initialize players with Dubai names
  const initializePlayers = useCallback((playerCount) => {
    const playerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const playerNames = ['Sheikh Ahmed', 'Fatima', 'Omar', 'Aisha', 'Khalid', 'Layla'];
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

  // Enhanced dice rolling with animations
  const rollDice = useCallback(() => {
    if (gamePhase !== 'roll' || diceRolling) return;

    setDiceRolling(true);
    
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

  // Move player
  const movePlayer = useCallback((spaces) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      const player = newPlayers[currentPlayer];
      let newPosition = (player.position + spaces) % 40;

      if (newPosition < player.position) {
        player.money += gameSettings.passingGoBonus;
      }

      player.position = newPosition;
      return newPlayers;
    });

    setTimeout(() => {
      handleLandingOnSpace();
    }, 800);
  }, [currentPlayer, gameSettings.passingGoBonus]);

  // Handle landing on a space
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
          setGamePhase('endTurn');
        } else {
          setGamePhase('endTurn');
        }
        break;
      default:
        setGamePhase('endTurn');
    }
  }, [players, currentPlayer, board]);

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

  // Buy property
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

      setGamePhase('endTurn');
    }
  }, [gamePhase, players, currentPlayer, board]);

  // Pay rent
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

  // Draw chance card
  const drawChanceCard = useCallback(() => {
    const card = chanceCards[Math.floor(Math.random() * chanceCards.length)];
    setCurrentCard(card);
    setShowCardModal(true);
    
    // Add to game history
    setGameHistory(prev => [...prev, {
      type: 'chance_card',
      player: players[currentPlayer].name,
      card: card.text,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, [chanceCards, players, currentPlayer]);

  // Draw community chest card
  const drawCommunityChestCard = useCallback(() => {
    const card = communityChestCards[Math.floor(Math.random() * communityChestCards.length)];
    setCurrentCard(card);
    setShowCardModal(true);
    
    // Add to game history
    setGameHistory(prev => [...prev, {
      type: 'community_chest_card',
      player: players[currentPlayer].name,
      card: card.text,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, [communityChestCards, players, currentPlayer]);

  // Handle card actions
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
    }

    setGamePhase('endTurn');
  }, [players, currentPlayer, payTax, gameSettings.passingGoBonus]);

  // Go to jail
  const goToJail = useCallback(() => {
    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer ? { ...p, position: 10, inJail: true, jailTurns: 0 } : p
    ));
    setGamePhase('endTurn');
  }, [currentPlayer]);

  // Handle bankruptcy
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

  // End turn
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

  // End game
  const endGame = useCallback(() => {
    setGameState('gameOver');
  }, []);

  // Build house
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

  // Build hotel
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

      // Add to game history
      setGameHistory(prev => [...prev, {
        type: 'hotel_built',
        player: player.name,
        property: property.name,
        cost: hotelCost,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  }, [players, currentPlayer, board, gameSettings.hotelCost]);

  // Trade properties between players
  const tradeProperty = useCallback((fromPlayer, toPlayer, propertyId, price) => {
    const property = board[propertyId];
    
    if (property.owner === fromPlayer && players[toPlayer].money >= price) {
      setBoard(prev => prev.map(p => 
        p.id === propertyId ? { ...p, owner: toPlayer } : p
      ));

      setPlayers(prev => prev.map(p => {
        if (p.id === fromPlayer) {
          return { 
            ...p, 
            money: p.money + price,
            totalWorth: p.totalWorth + price,
            properties: p.properties.filter(prop => prop !== propertyId)
          };
        } else if (p.id === toPlayer) {
          return { 
            ...p, 
            money: p.money - price,
            totalWorth: p.totalWorth + property.price,
            properties: [...p.properties, propertyId]
          };
        }
        return p;
      }));

      // Add to game history
      setGameHistory(prev => [...prev, {
        type: 'property_traded',
        fromPlayer: players[fromPlayer].name,
        toPlayer: players[toPlayer].name,
        property: property.name,
        price: price,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setShowTradeModal(false);
    }
  }, [players, board]);

  // Mortgage property
  const mortgageProperty = useCallback((propertyId) => {
    const player = players[currentPlayer];
    const property = board[propertyId];

    if (property.owner === currentPlayer && !property.mortgaged && property.houses === 0 && !property.hotel) {
      const mortgageValue = Math.floor(property.price * 0.5);
      
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

      // Add to game history
      setGameHistory(prev => [...prev, {
        type: 'property_mortgaged',
        player: player.name,
        property: property.name,
        amount: mortgageValue,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  }, [players, currentPlayer, board]);

  // Unmortgage property
  const unmortgageProperty = useCallback((propertyId) => {
    const player = players[currentPlayer];
    const property = board[propertyId];

    if (property.owner === currentPlayer && property.mortgaged) {
      const unmortgageCost = Math.floor(property.price * 0.55);
      
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

        // Add to game history
        setGameHistory(prev => [...prev, {
          type: 'property_unmortgaged',
          player: player.name,
          property: property.name,
          cost: unmortgageCost,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    }
  }, [players, currentPlayer, board]);

  // Sell property to bank
  const sellProperty = useCallback((propertyId) => {
    const player = players[currentPlayer];
    const property = board[propertyId];

    if (property.owner === currentPlayer && !property.mortgaged) {
      let sellPrice = property.price;
      
      // Add value of houses and hotels
      if (property.houses > 0) {
        sellPrice += property.houses * gameSettings.houseCost;
      }
      if (property.hotel) {
        sellPrice += gameSettings.hotelCost;
      }

      // Bank pays 80% of total value
      const bankPayment = Math.floor(sellPrice * 0.8);

      setBoard(prev => prev.map(p => 
        p.id === propertyId ? { 
          ...p, 
          owner: null, 
          houses: 0, 
          hotel: false, 
          mortgaged: false 
        } : p
      ));

      setPlayers(prev => prev.map(p => 
        p.id === currentPlayer ? { 
          ...p, 
          money: p.money + bankPayment,
          totalWorth: p.totalWorth + bankPayment,
          properties: p.properties.filter(prop => prop !== propertyId),
          housesOwned: p.housesOwned - property.houses,
          hotelsOwned: p.hotelsOwned - (property.hotel ? 1 : 0)
        } : p
      ));

      // Add to game history
      setGameHistory(prev => [...prev, {
        type: 'property_sold',
        player: player.name,
        property: property.name,
        amount: bankPayment,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setShowSellModal(false);
    }
  }, [players, currentPlayer, board, gameSettings.houseCost, gameSettings.hotelCost]);

  // Start auction for property
  const startAuction = useCallback((propertyId) => {
    const property = board[propertyId];
    if (property.owner === null) {
      setAuctionProperty(property);
      setAuctionBids([]);
      setCurrentBid(Math.floor(property.price * 0.5)); // Start at 50% of property value
      setShowAuctionModal(true);
    }
  }, [board]);

  // Place bid in auction
  const placeBid = useCallback((bidAmount) => {
    if (bidAmount > currentBid) {
      setCurrentBid(bidAmount);
      setAuctionBids(prev => [...prev, {
        player: currentPlayer,
        amount: bidAmount,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
  }, [currentPlayer, currentBid]);

  // End auction and award property
  const endAuction = useCallback(() => {
    if (auctionBids.length > 0) {
      const winningBid = auctionBids[auctionBids.length - 1];
      const property = auctionProperty;
      
      setBoard(prev => prev.map(p => 
        p.id === property.id ? { ...p, owner: winningBid.player } : p
      ));

      setPlayers(prev => prev.map(p => 
        p.id === winningBid.player ? { 
          ...p, 
          money: p.money - winningBid.amount,
          totalWorth: p.totalWorth + property.price,
          properties: [...p.properties, property.id]
        } : p
      ));

      // Add to game history
      setGameHistory(prev => [...prev, {
        type: 'auction_won',
        player: players[winningBid.player].name,
        property: property.name,
        amount: winningBid.amount,
        timestamp: new Date().toLocaleTimeString()
      }]);
    }
    
    setShowAuctionModal(false);
    setAuctionProperty(null);
    setAuctionBids([]);
    setCurrentBid(0);
  }, [auctionBids, auctionProperty, players]);

  // Menu screen
  if (gameState === 'menu') {
    return (
      <div className="dubai-monopoly-game">
        <div className="game-menu">
          <h1>🏙️ Dubai Monopoly</h1>
          <p>Experience the magic of Dubai in this exclusive board game!</p>
          <p>Buy iconic landmarks, ride the metro, and build your Dubai empire!</p>
          
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
            <h3>Dubai Monopoly Features:</h3>
            <ul>
              <li>🏗️ Real Dubai locations and landmarks</li>
              <li>🚇 Dubai Metro lines as railroads</li>
              <li>🛍️ Famous shopping malls and souks</li>
              <li>🏨 Luxury hotels and resorts</li>
              <li>🌴 Palm Islands and waterfront properties</li>
              <li>🏛️ Cultural and heritage sites</li>
              <li>💰 Dubai Dirhams (AED) currency</li>
              <li>🎲 Dubai-themed chance and community chest cards</li>
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
      <div className="dubai-monopoly-game">
        <div className="game-over">
          <h2>🎉 Game Over!</h2>
          {winner && (
            <div className="winner">
              <h3>🏆 {winner.name} Wins!</h3>
              <p>Final Money: AED {winner.money.toLocaleString()}</p>
              <p>Properties Owned: {winner.properties.length}</p>
              <p>Total Worth: AED {winner.totalWorth.toLocaleString()}</p>
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
    <div className="dubai-monopoly-game">
      <div className="game-header">
        <div className="game-info">
          <h2>🏙️ Dubai Monopoly</h2>
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
            <span className="player-money">AED {currentPlayerData.money.toLocaleString()}</span>
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
                <div className="space-emoji">{space.emoji}</div>
                <div className="space-name">{space.name}</div>
                {space.type === 'property' && (
                  <>
                    <div className="space-price">AED {space.price.toLocaleString()}</div>
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
                    <div className="space-price">AED {space.price.toLocaleString()}</div>
                    {space.owner !== null && (
                      <div className="owner-indicator" style={{ backgroundColor: players[space.owner]?.color }}>
                        {players[space.owner]?.name[0]}
                      </div>
                    )}
                  </>
                )}
                {space.type === 'utility' && (
                  <>
                    <div className="space-price">AED {space.price.toLocaleString()}</div>
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
                    <div className="space-label">{space.name}</div>
                    <div className="space-price">AED {space.rent.toLocaleString()}</div>
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
            
            {/* Always Available Actions */}
            <div className="always-available-actions">
              <button onClick={() => setShowSellModal(true)} className="action-btn sell-btn">
                💰 Sell Properties
              </button>
              <button onClick={() => setShowAuctionModal(true)} className="action-btn auction-btn">
                🏷️ Start Auction
              </button>
              <button onClick={() => setShowTradeOfferModal(true)} className="action-btn trade-btn">
                🤝 Make Trade Offer
              </button>
              <button onClick={() => setShowPlayerStats(true)} className="action-btn stats-btn">
                📊 Player Stats
              </button>
              <button onClick={() => setShowHelpModal(true)} className="action-btn help-btn">
                ❓ Help & Rules
              </button>
            </div>
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
                  <span className="player-money">AED {player.money.toLocaleString()}</span>
                  <span className="player-properties">{player.properties.length} properties</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="property-modal">
          <div className="modal-content">
            <h3>{selectedProperty.emoji} {selectedProperty.name}</h3>
            <div className="property-details">
              <p>Type: {selectedProperty.type}</p>
              <p>Price: AED {selectedProperty.price.toLocaleString()}</p>
              {selectedProperty.type === 'property' && (
                <>
                  <p>Base Rent: AED {selectedProperty.rent[0].toLocaleString()}</p>
                  <p>Houses: {selectedProperty.houses}/{selectedProperty.maxHouses}</p>
                  <p>Hotel: {selectedProperty.hotel ? 'Yes' : 'No'}</p>
                  <p>Group: {selectedProperty.group}</p>
                  <p>Description: {selectedProperty.description}</p>
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
                    Build House (AED {gameSettings.houseCost.toLocaleString()})
                  </button>
                )}
                {selectedProperty.type === 'property' && selectedProperty.houses === selectedProperty.maxHouses && !selectedProperty.hotel && (
                  <button onClick={() => buildHotel(selectedProperty.id)} className="action-btn">
                    Build Hotel (AED {gameSettings.hotelCost.toLocaleString()})
                  </button>
                )}
                {selectedProperty.type === 'property' && !selectedProperty.mortgaged && selectedProperty.houses === 0 && !selectedProperty.hotel && (
                  <button onClick={() => mortgageProperty(selectedProperty.id)} className="action-btn">
                    Mortgage Property
                  </button>
                )}
                {selectedProperty.type === 'property' && selectedProperty.mortgaged && (
                  <button onClick={() => unmortgageProperty(selectedProperty.id)} className="action-btn">
                    Unmortgage Property
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

      {/* Card Modal */}
      {showCardModal && currentCard && (
        <div className="card-modal">
          <div className="modal-content">
            <h3>🎲 {currentCard.emoji} {currentCard.text}</h3>
            <div className="card-actions">
              <button onClick={() => {
                handleCardAction(currentCard);
                setShowCardModal(false);
                setCurrentCard(null);
              }} className="action-btn">
                Apply Card
              </button>
            </div>
            <button onClick={() => {
              setShowCardModal(false);
              setCurrentCard(null);
            }} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Game History Modal */}
      <div className="game-history-btn" onClick={() => setShowPropertyDetails(!showPropertyDetails)}>
        📜 Game History
      </div>
      
      {showPropertyDetails && (
        <div className="history-modal">
          <div className="modal-content">
            <h3>📜 Game History</h3>
            <div className="history-list">
              {gameHistory.map((event, index) => (
                <div key={index} className="history-item">
                  <span className="history-time">{event.timestamp}</span>
                  <span className="history-text">
                    {event.type === 'hotel_built' && `🏨 ${event.player} built a hotel on ${event.property}`}
                    {event.type === 'property_traded' && `🔄 ${event.fromPlayer} traded ${event.property} to ${event.toPlayer} for AED ${event.price.toLocaleString()}`}
                    {event.type === 'property_mortgaged' && `🏦 ${event.player} mortgaged ${event.property} for AED ${event.amount.toLocaleString()}`}
                    {event.type === 'property_unmortgaged' && `💰 ${event.player} unmortgaged ${event.property} for AED ${event.cost.toLocaleString()}`}
                    {event.type === 'chance_card' && `🎲 ${event.player} drew: ${event.card}`}
                    {event.type === 'community_chest_card' && `📦 ${event.player} drew: ${event.card}`}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPropertyDetails(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Sell Properties Modal */}
      {showSellModal && (
        <div className="sell-modal">
          <div className="modal-content">
            <h3>💰 Sell Properties</h3>
            <div className="sell-properties-list">
              {players[currentPlayer].properties.map(propertyId => {
                const property = board[propertyId];
                if (property && !property.mortgaged) {
                  let sellPrice = property.price;
                  if (property.houses > 0) sellPrice += property.houses * gameSettings.houseCost;
                  if (property.hotel) sellPrice += gameSettings.hotelCost;
                  const bankPayment = Math.floor(sellPrice * 0.8);
                  
                  return (
                    <div key={propertyId} className="sell-property-item">
                      <div className="property-info">
                        <span className="property-name">{property.emoji} {property.name}</span>
                        <span className="property-value">AED {bankPayment.toLocaleString()}</span>
                      </div>
                      <button onClick={() => sellProperty(propertyId)} className="sell-btn-small">
                        Sell
                      </button>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <button onClick={() => setShowSellModal(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Auction Modal */}
      {showAuctionModal && (
        <div className="auction-modal">
          <div className="modal-content">
            <h3>🏷️ Property Auction</h3>
            <div className="auction-info">
              <p>Select a property to auction:</p>
              <div className="auction-properties">
                {board.filter(space => space.owner === null && space.type === 'property').map(space => (
                  <button 
                    key={space.id}
                    onClick={() => startAuction(space.id)}
                    className="auction-property-btn"
                  >
                    {space.emoji} {space.name} - AED {space.price.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowAuctionModal(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Active Auction Modal */}
      {auctionProperty && (
        <div className="active-auction-modal">
          <div className="modal-content">
            <h3>🏷️ Auction: {auctionProperty.emoji} {auctionProperty.name}</h3>
            <div className="auction-details">
              <p>Current Bid: AED {currentBid.toLocaleString()}</p>
              <p>Starting Price: AED {Math.floor(auctionProperty.price * 0.5).toLocaleString()}</p>
            </div>
            <div className="bid-input">
              <input 
                type="number" 
                placeholder="Enter your bid"
                min={currentBid + 100000}
                step={100000}
                className="bid-input-field"
              />
              <button onClick={() => {
                const input = document.querySelector('.bid-input-field');
                if (input && input.value) {
                  placeBid(parseInt(input.value));
                  input.value = '';
                }
              }} className="place-bid-btn">
                Place Bid
              </button>
            </div>
            <div className="auction-bids">
              <h4>Bid History:</h4>
              {auctionBids.map((bid, index) => (
                <div key={index} className="bid-item">
                  <span>{players[bid.player].name}</span>
                  <span>AED {bid.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="auction-actions">
              <button onClick={endAuction} className="end-auction-btn">
                End Auction
              </button>
              <button onClick={() => {
                setShowAuctionModal(false);
                setAuctionProperty(null);
              }} className="cancel-auction-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trade Offer Modal */}
      {showTradeOfferModal && (
        <div className="trade-offer-modal">
          <div className="modal-content">
            <h3>🤝 Make Trade Offer</h3>
            <div className="trade-offer-form">
              <div className="trade-partner">
                <label>Trade with:</label>
                <select className="trade-partner-select">
                  {players.filter(p => p.id !== currentPlayer && !p.bankrupt).map(player => (
                    <option key={player.id} value={player.id}>{player.name}</option>
                  ))}
                </select>
              </div>
              <div className="trade-items">
                <div className="trade-properties">
                  <label>Your Properties:</label>
                  {players[currentPlayer].properties.map(propertyId => {
                    const property = board[propertyId];
                    return property ? (
                      <label key={propertyId} className="trade-property-checkbox">
                        <input 
                          type="checkbox" 
                          value={propertyId}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPropertiesForTrade([...selectedPropertiesForTrade, propertyId]);
                            } else {
                              setSelectedPropertiesForTrade(selectedPropertiesForTrade.filter(id => id !== propertyId));
                            }
                          }}
                        />
                        {property.emoji} {property.name}
                      </label>
                    ) : null;
                  })}
                </div>
                <div className="trade-money">
                  <label>Money to offer:</label>
                  <input 
                    type="number" 
                    placeholder="AED amount"
                    className="trade-money-input"
                  />
                </div>
              </div>
              <button onClick={() => {
                // Implement trade offer logic
                setShowTradeOfferModal(false);
              }} className="make-trade-btn">
                Make Trade Offer
              </button>
            </div>
            <button onClick={() => setShowTradeOfferModal(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Player Stats Modal */}
      {showPlayerStats && (
        <div className="player-stats-modal">
          <div className="modal-content">
            <h3>📊 Player Statistics</h3>
            <div className="stats-grid">
              {players.map(player => (
                <div key={player.id} className="player-stat-card">
                  <h4>{player.name}</h4>
                  <div className="stat-details">
                    <p>💰 Money: AED {player.money.toLocaleString()}</p>
                    <p>🏠 Properties: {player.properties.length}</p>
                    <p>🏘️ Houses: {player.housesOwned}</p>
                    <p>🏨 Hotels: {player.hotelsOwned}</p>
                    <p>🚇 Metro Lines: {player.railroadsOwned}</p>
                    <p>⚡ Utilities: {player.utilitiesOwned}</p>
                    <p>💎 Total Worth: AED {player.totalWorth.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowPlayerStats(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Help & Rules Modal */}
      {showHelpModal && (
        <div className="help-modal">
          <div className="modal-content">
            <h3>❓ Help & Rules</h3>
            <div className="help-content">
              <div className="help-section">
                <h4>🎯 How to Play:</h4>
                <ol>
                  <li>Roll dice to move around the board</li>
                  <li>Buy properties when you land on them</li>
                  <li>Build houses and hotels to increase rent</li>
                  <li>Collect rent from other players</li>
                  <li>Use Chance and Community Chest cards</li>
                  <li>Trade properties with other players</li>
                  <li>Mortgage properties for quick cash</li>
                  <li>Participate in property auctions</li>
                </ol>
              </div>
              <div className="help-section">
                <h4>💰 Actions Available:</h4>
                <ul>
                  <li><strong>Buy Property:</strong> Purchase unowned properties</li>
                  <li><strong>Sell Properties:</strong> Sell to bank for 80% value</li>
                  <li><strong>Build Houses/Hotels:</strong> Increase property value</li>
                  <li><strong>Mortgage:</strong> Get cash by mortgaging properties</li>
                  <li><strong>Trade:</strong> Make trade offers with other players</li>
                  <li><strong>Auction:</strong> Bid on properties</li>
                  <li><strong>View Stats:</strong> Check player statistics</li>
                </ul>
              </div>
            </div>
            <button onClick={() => setShowHelpModal(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DubaiMonopolyGame;
