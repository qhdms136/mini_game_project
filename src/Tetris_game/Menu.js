import './Menu.css'
import React from 'react';

function Menu({onClick}){
    return(
        <div className="tetris_menu">
            <button className="tetris_btn" onClick={onClick}>Play Tetris</button>
        </div>
    )
}

export default Menu;