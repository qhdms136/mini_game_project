import './App.css';
import './style.css';
import './style2.css';
import React, {useEffect, useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import MineSearch from './mine_game/MineSearch';
import TicTacToe from './tictactoe_game/TicTacToe';
import ResponseCheck from './res_check_game/ResponseCheck';
import Lotto from './lotto_game/Lotto';
import TetrisMain from './Tetris_game/TetrisMain';
import Chess from './chess_game/Board';
import { gameSubject, initGame } from './chess_game/Game';
import NotFound from './NotFound';

function App() {
  const [board, setBoard] = useState([]);
  const [isGameOver, setIsGameOver] = useState();
  const [result, setResult] = useState();
  const [turn, setTurn] = useState();
  useEffect( () => {
    initGame()
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board)
      setIsGameOver(game.isGameOver)
      setResult(game.result)
      setTurn(game.turn)
    })
    return () => subscribe.unsubscribe()
  }, []);

  return (
    <BrowserRouter>
    <div className="App">
      <Header/>
      <Routes>
        <Route index element={<Main/>}></Route>
        <Route path='mine' element={<MineSearch/>}></Route>
        <Route path='tictactoe' element={<TicTacToe/>}></Route>
        <Route path='rescheck' element={<ResponseCheck/>}></Route>
        <Route path='lotto' element={<Lotto/>}></Route>
        <Route path='tetris' element={<TetrisMain/>}></Route>
        <Route path='chess' 
        element={
          <div className="container2">
          {isGameOver && (
            <h2 className="vertical-text">
              GAME OVER
              {/* <button onClick={resetGame}> */}
                <span className="vertical-text"> NEW GAME</span>
              {/* </button> */}
            </h2>
          )}
          <div className="board-container">
          <Chess board={board} turn={turn}/>
          </div>
          {result && <p className="vertical-text">{result}</p>}
        </div>
        }></Route>
        <Route path='/*' element={<NotFound/>}></Route>
      </Routes>
      <Footer/>
    </div>
    </BrowserRouter>
  );
}

export default App;
