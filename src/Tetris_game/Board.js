import React from 'react';
import BoardCell from "./BoardCell";
import './Board.css'
function Board({board}){
    const boardStyles = {
        /* repeat() 함수 사용법 */
        //   grid-template-rows: repeat(2, 1fr);         /* 1fr 1fr */
        //   grid-template-columns: repeat(3, 1fr 2fr);  /* 1fr 2fr 1fr 2fr 1fr 2fr */
        gridTemplateRows: `repeat(${board.size.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${board.size.columns}, 1fr)`
      };
    
      return (
        <div className="Board" style={boardStyles}>
          {board.rows.map((row, y) =>
            row.map((cell, x) => (
              <BoardCell key={x * board.size.columns + x} cell={cell} />
            ))
          )}
        </div>
      );
}

export default Board;