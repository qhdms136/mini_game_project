import { defaultCell } from "./Cell";
import { transferToBoard } from "./Tetrominoes";
import { movePlayer } from "./PlayerController";

export const buildBoard = ({ rows, columns }) => {
    const builtRows = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => ({ ...defaultCell }))
    );
  
    return {
      rows: builtRows,
      size: { rows, columns }
    };
  };

  const findDropPosition = ({ board, position, shape }) => {
    let max = board.size.rows - position.row + 1;
    let row = 0;
  
    for (let i = 0; i < max; i++) {
      const delta = { row: i, column: 0 };
      const result = movePlayer({ delta, position, shape, board });
      const { collided } = result;
  
      if (collided) {
        break;
      }
  
      row = position.row + i;
    }
  
    return { ...position, row };
  };

  export const nextBoard = ({ board, player, resetPlayer, addLinesCleared }) => {
    const { tetromino, position } = player;
  
    // Copy and clear spaces used by pieces that
    // hadn't collided and occupied spaces permanently
    let rows = board.rows.map((row) =>
      row.map((cell) => (cell.occupied ? cell : { ...defaultCell }))
    );

     // Drop position
    const dropPosition = findDropPosition({
      board,
      position,
      shape: tetromino.shape
    });

    // Place ghost
    const className = `${tetromino.className} ${player.isFastDropping ? "" : "ghost"}`;
    rows = transferToBoard({
      className,
      isOccupied: player.isFastDropping,
      position: dropPosition,
      rows,
      shape: tetromino.shape
    });

    // Place the piece.
    // 충돌한 경우 보드 셀을 충돌한 것으로 표시
    if(!player.isFastDropping){
      rows = transferToBoard({
        className: tetromino.className,
        isOccupied: player.collided,
        position,
        rows,
        shape: tetromino.shape
      });
    }

    // Check for cleared lines
    const blankRow = rows[0].map((_) => ({ ...defaultCell }));
    let linesCleared = 0;
    rows = rows.reduce((acc, row) => {
      // 가득차있는 경우
      if (row.every((column) => column.occupied)){
        linesCleared++;
        acc.unshift([...blankRow]);
      } else{
        acc.push(row);
      }
      return acc;
    }, []);

    if(linesCleared > 0){
      addLinesCleared(linesCleared);
    }


     // 바닦에 충돌했을때 재설정(다음 블럭을 불러오기 위한 조건)
    if (player.collided || player.isFastDropping) {
      resetPlayer();
    }

    // 다음 보드 반환
    return {
      rows,
      size: { ...board.size }
    };
  };

  export const hasCollision = ({ board, position, shape }) => {
    for (let y = 0; y < shape.length; y++) {
      const row = y + position.row;
  
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const column = x + position.column;
  
          if (
            board.rows[row] &&
            board.rows[row][column] &&
            board.rows[row][column].occupied
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // 4 x 4 모든 칸을 확인하여 보드 안에 있는지 확인
  export const isWithinBoard = ({ board, position, shape }) => {
    for (let y = 0; y < shape.length; y++) {
      const row = y + position.row;
  
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const column = x + position.column;
          const isValidPosition = board.rows[row] && board.rows[row][column];
  
          if (!isValidPosition){
            return false;
          }
        }
      }
    }
    return true;
  };
  