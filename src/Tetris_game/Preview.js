import "./Preview.css";
import React from "react";

import { buildBoard } from "../business/Board";
import { transferToBoard } from "../business/Tetrominoes";

import BoardCell from "./BoardCell";

const Preview = ({ tetromino, index }) => {
  const { shape, className } = tetromino;

  // 4행 4열 보드 생성
  const board = buildBoard({ rows: 4, columns: 4 });

  // 겹치지 않도록 상단에 동적으로 설정
  const style = { top: `${index * 15}vw` };

  board.rows = transferToBoard({
    className,
    isOccupied: false,
    position: { row: 0, column: 0 },
    rows: board.rows,
    shape
  });

  return (
    <div className="Preview" style={style}>
      <div className="Preview-board">
        {board.rows.map((row, y) =>
          row.map((cell, x) => (
            <BoardCell key={x * board.size.columns + x} cell={cell} />
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(Preview);
