import React, { useState, useEffect } from 'react';
import { FaHandRock, FaHandPaper, FaHandScissors, FaCrown } from 'react-icons/fa';
import { BsFillEmojiSmileFill } from 'react-icons/bs';
import celebrationSound from './assets/rock-paper-scissors-253365.mp3';
import winSound from './assets/win-sound-effect-187097.mp3';
import loseSound from './assets/8-bit-video-game-fail-version-2-145478.mp3';
import tieSound from './assets/draw-sword1-44724.mp3';
import backgroundSound from './assets/game-music-loop-6-144641.mp3';

const choices = [
  { name: 'rock', icon: <FaHandRock /> },
  { name: 'paper', icon: <FaHandPaper /> },
  { name: 'scissors', icon: <FaHandScissors /> },
];

function getRandomChoice() {
  return choices[Math.floor(Math.random() * choices.length)].name;
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "It's a Stalemate! Clash Again!";
  if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    return 'Victory is Yours! You Crushed It!';
  }
  return 'The Machine Triumphs! Computer Wins!';
}

export default function RockPaperScissorsGame() {
  const [playerChoice, setPlayerChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [ultimateWinner, setUltimateWinner] = useState('');
  const [backgroundAudio] = useState(new Audio(backgroundSound));
  const [currentSound, setCurrentSound] = useState(null);

  useEffect(() => {
    backgroundAudio.volume = 0.1;
    backgroundAudio.loop = true;
    backgroundAudio.play();

    return () => {
      backgroundAudio.pause();
      backgroundAudio.currentTime = 0;
    };
  }, [backgroundAudio]);

  useEffect(() => {
    if (rounds === 10) {
      const winner = playerWins > computerWins ? 'Player' : 'Computer';
      setUltimateWinner(winner);
      new Audio(celebrationSound).play();
    }
  }, [rounds, playerWins, computerWins]);

  function stopCurrentSound() {
    if (currentSound) {
      currentSound.pause();
      currentSound.currentTime = 0;
    }
  }

  function playSound(type) {
    stopCurrentSound();

    let sound;
    if (type === 'win') sound = new Audio(winSound);
    else if (type === 'lose') sound = new Audio(loseSound);
    else sound = new Audio(tieSound);

    sound.play();
    setCurrentSound(sound);

    sound.onended = () => {
      backgroundAudio.play();
    };
  }

  function handleChoice(choice) {
    if (rounds >= 10) return;
    const computerPick = getRandomChoice();
    const roundResult = determineWinner(choice, computerPick);
    setPlayerChoice(choice);
    setComputerChoice(computerPick);
    setResult(roundResult);
    setRounds((prev) => prev + 1);

    if (roundResult.includes('Victory')) {
      setPlayerWins((prev) => prev + 1);
      playSound('win');
    } else if (roundResult.includes('Computer Wins')) {
      setComputerWins((prev) => prev + 1);
      playSound('lose');
    } else {
      playSound('tie');
    }
  }

  function restartGame() {
    setPlayerChoice('');
    setComputerChoice('');
    setResult('');
    setPlayerWins(0);
    setComputerWins(0);
    setRounds(0);
    setUltimateWinner('');
    stopCurrentSound();
    backgroundAudio.play();
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white animate-fade-in text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-bounce">⚔️ Rock Paper Scissors ⚔️</h1>
      <p className="text-sm sm:text-xl md:text-2xl mb-4 font-semibold">Prepare for Battle! Choose Your Weapon!</p>
      <div className="flex justify-center space-x-4 sm:space-x-6 md:space-x-8 mb-8">
        {choices.map((choice) => (
          <button
            key={choice.name}
            onClick={() => handleChoice(choice.name)}
            className="flex items-center justify-center w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-blue-600 hover:bg-blue-800 text-white rounded-full text-3xl sm:text-4xl md:text-5xl shadow-lg transform transition-transform duration-300 hover:scale-110"
          >
            {choice.icon}
          </button>
        ))}
      </div>
      {result && (
        <div className="mt-6">
          <p className="text-lg sm:text-2xl md:text-3xl font-bold">🔥 You chose: {playerChoice}</p>
          <p className="text-lg sm:text-2xl md:text-3xl font-bold">🤖 Computer chose: {computerChoice}</p>
          <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-4 text-yellow-300 animate-pulse">{result}</p>
        </div>
      )}
      <div className="text-lg sm:text-2xl md:text-3xl mt-4 font-semibold">
        🏆 Player Wins: {playerWins} | 🤖 Computer Wins: {computerWins} | 🕰️ Rounds: {rounds}/10
      </div>
      {ultimateWinner && (
        <div className="mt-8 flex flex-col items-center">
          <FaCrown className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl animate-bounce" />
          <p className="text-xl sm:text-3xl md:text-4xl font-bold mt-4 animate-glow">{ultimateWinner} is the Ultimate Champion!</p>
          <BsFillEmojiSmileFill className="text-green-400 text-4xl sm:text-5xl md:text-6xl animate-pulse mt-2" />
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-200 mt-2">🎉 Celebrate Your Triumph or Gear Up for a Comeback! 🎉</p>
          <button
            onClick={restartGame}
            className="mt-6 px-6 py-2 bg-green-500 hover:bg-green-700 text-white text-xl sm:text-2xl md:text-3xl rounded-lg shadow-md transition duration-300"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
