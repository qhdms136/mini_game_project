import React from 'react'
import './Main.css'
import { Link } from 'react-router-dom';

function Main(){
    return(
        <div className='main'>
                <div className='GameBoxStyle1'>
                    <Link to='chess' className='ChessIcon'></Link>
                </div>
                <div className='GameBoxStyle2'>
                    <Link to='lotto' className='Lotto'></Link>
                </div>
                <div className='GameBoxStyle2'>
                <Link to='mine' className='Mine'></Link>
                </div>
                <div className='GameBoxStyle1'>
                <Link to='rescheck' className='ResCheck'></Link>
                </div>
                <div className='GameBoxStyle1'>
                <Link to='tetris' className='Tetris'></Link>
                </div>
                <div className='GameBoxStyle2'>
                <Link to='tictactoe' className='TicTacToe'></Link>
                </div>
        </div>
    )
}

export default Main;