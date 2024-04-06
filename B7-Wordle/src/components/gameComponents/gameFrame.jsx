import Button from './button';
import LetterQuantityDropdown from './droppDown';
import PlayerInput from './PlayerInput';
import Checkbox from './CheckBox';
import Modal from './CheckOutModal';
import { evaluateGameInput } from '../../Algorithms/gameInputHandler';
import { useEffect, useState } from 'react';
function GameFrame() {
  const [gameInfo, setGameInfo] = useState('Choose gamemode');
  const [wordGuess, setWordGuess] = useState('');
  const [result, setResult] = useState([]);
  const [includeDouble, setIncludeDouble] = useState(false);
  const [letterQuantity, setLetterQuantity] = useState(2);
  const [correctWord, setcorrectWord] = useState('');
  const [resultsArray, setResultsArray] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [wordGuessList, setWordGuessList] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  console.log('öppen', typeof gameTime, gameTime);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  async function postToServer(url, payload) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setcorrectWord(data.randomWord);
    if (response.ok) {
      console.log('Data arrived');
    } else {
      console.error('Data failed to deliverd');
    }
  }

  async function playerResultsArray(evaluatePlayerInput) {
    const playerGuess = evaluatePlayerInput.map((item) => item.letter);
    const playerWords = playerGuess.join('');
    setWordGuessList([...wordGuessList, playerWords]);

    const playerResults = {
      guess: wordGuessList,
      correctWord: correctWord,
      correctWordLength: letterQuantity,
      includedDoubble: includeDouble,
      playerName: playerName,
      gameTime: gameTime,
    };

    setResultsArray(playerResults);
  }

  const guessWord = () => {
    const evaluatePlayerInput = evaluateGameInput(wordGuess, correctWord);
    setResult(evaluatePlayerInput);
    //Duplicerad kod, bör fixas. 3 rader nedåt.
    const ifPlayerWinWord = evaluatePlayerInput.map(function (item) {
      return item.letter;
    });
    playerResultsArray(evaluatePlayerInput);
    const playerWins = ifPlayerWinWord.join('');

    if (playerWins === correctWord) {
      setGameInfo('winner!');
      toggleModal();

      let stopGame = new Date();
      let stopGameTime = stopGame.getTime();
      let timerMiliSeconds = stopGameTime - gameTime;
      let timerSeconds = timerMiliSeconds / 1000;
      console.log('timerSeconds', timerSeconds);

      setGameTime(timerSeconds);
      console.log('sista', gameTime);
    }
  };

  function startgameTimer() {
    let startGame = new Date();
    let startGameTime = startGame.getTime();
    setGameTime(startGameTime);
    console.log('startGame', typeof gameTime, gameTime);
  }

  return (
    <section className="steamgreen w-[550px] h-[700px] flex flex-col items-center gap-10 text-white mt-5 border">
      <div className="steamDark w-96 h-40 flex justify-center items-center mt-5 rounded-lg">
        <p className="text-2xl">{gameInfo}</p>
      </div>

      <div className="steamDark w-96 h-40 flex justify-center items-center mt-5 rounded-lg">
        <ul className="flex flex-row text-2xl">
          {result.map((item, index) => (
            <li
              key={index}
              className={
                item.result === 'Incorrect'
                  ? 'text-red-500'
                  : item.result === 'Misplaced'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }
            >
              {item.letter}
            </li>
          ))}
        </ul>
      </div>

      <menu className="steamDark border border-white max-w-3xl h-[400px] flex flex-col justify-center items-center p-6 rounded-lg mb-5">
        <Checkbox
          checked={includeDouble}
          checkOne="Yes"
          checkBoxInfo="Should the word include double letters?"
          handleChange={(e) => {
            setIncludeDouble(e.target.checked);
          }}
        />

        <LetterQuantityDropdown
          label="Choose how many letters the word should include"
          handleChange={(e) => {
            setLetterQuantity(e.target.value);
          }}
        />
        <PlayerInput
          label="Write your name here!"
          handlePlayerInput={(e) => {
            let input = e.target.value;
            setPlayerName(input);
          }}
        />

        <Button
          label="Start game!"
          handleClick={() => {
            const loot = {
              letterQuantity: letterQuantity,
              includeDouble: includeDouble,
            };

            setGameInfo(`Start guessing ${playerName}!`);
            postToServer('/api/gamemodehandler', loot);
            startgameTimer();
          }}
        />
        <PlayerInput
          label="Guess your word down here!"
          handlePlayerInput={(e) => {
            let input = e.target.value;
            setWordGuess(input);
          }}
          inputValue={wordGuess}
        />

        <Button label="Guess word" handleClick={guessWord} />
      </menu>
      <Modal
        playerName={playerName}
        showModal={showModal}
        onClick={() => {
          postToServer('/api/playerScoreData', resultsArray);
          window.location.href = '/highscore';
        }}
      />
    </section>
  );
}

export default GameFrame;
