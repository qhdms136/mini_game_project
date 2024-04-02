import './Menu.css'
import React from 'react';

function Menu({onClick}){
    return(
        <div className="tetris_menu">
            <div>
            <button className="tetris_btn" onClick={onClick}>Play Tetris</button>
            <div className='tetris_guide'>
                <h2 className='guide_title'>Guide</h2>
                <div className='guide_box'>
                    <div className='guide_cont1'>
                    <p>↑ </p>
                    <p>←↓→ </p>
                    <p>Q</p>
                    <p>P</p>
                    <p>Space</p>
                    </div>
                    <div className='guide_cont2'>
                    <p>: 방향 전환</p>
                    <p>: 방향 이동</p>
                    <p>: 시작 페이지</p>
                    <p>: 일시정지</p>
                    <p>: 빠른드롭</p>
                    </div>
                </div>
                    <br/>
                    <p>※ input 박스에 focus가 잡혀야 컨트롤 가능합니다.</p>
                </div>
            </div>
        </div>
    )
}

export default Menu;