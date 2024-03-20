
import { Action } from './Input';
import { rotate } from '../business/Tetrominoes'
import { hasCollision, isWithinBoard } from '../business/Board'


const attemptRotation = ({ board, player, setPlayer }) => {
    const shape = rotate({
      piece: player.tetromino.shape,
      direction: 1 // 방향전환 1 시계 -1 반시계
    });

    const position = player.position;
      const isValidRotation =
        isWithinBoard({ board, position, shape }) &&
        !hasCollision({ board, position, shape });
    
        if (isValidRotation) {
            setPlayer({
              ...player,
              tetromino: {
                ...player.tetromino,
                shape
              }
            });
          } else {
            return false;
          }
};

export const movePlayer = ({ delta, position, shape, board }) => {
    const desiredNextPosition = {
        row: position.row + delta.row,
        column: position.column + delta.column
    };

    const collided = hasCollision({
        board,
        position: desiredNextPosition,
        shape
    });

    const isOnBoard = isWithinBoard({
        board,
        position: desiredNextPosition,
        shape
    });

    // 충돌방지
    const preventMove = !isOnBoard ||   (isOnBoard && collided);
    const nextPosition = preventMove ? position : desiredNextPosition;

    const isMovingDown = delta.row > 0;
    const isHit = isMovingDown && (collided || !isOnBoard);

    return { collided: isHit, nextPosition };

};

const attemptMovement = ({
    board,
    player, 
    setPlayer,
    action,
    setGameOver 
}) => {
    const delta = { row: 0, column: 0};
    let isFastDropping = false;
    if(action === Action.FastDrop) {
        isFastDropping = true;
        // 게임 오버로 빠르게 빠르게 떨어지면 느린 하락으로 인해 게임이 게임 오버 상태가 될 때까지(콘솔에 경고가 표시됨) 
        // 그걸 방지하기 위해 한줄 추가
        delta.row += 1;
    } else if(action === Action.SlowDrop){
        delta.row += 1;
    } else if(action === Action.Left){
        delta.column -= 1;
    } else if(action === Action.Right){
        delta.column += 1;
    }

    const {collided, nextPosition} = movePlayer({
        delta,
        position: player.position,
        shape: player.tetromino.shape,
        board
    });

    // 충돌하면 게임오버
    const isGameOver = collided && player.position.row === 0;
    if (isGameOver) {
        setGameOver(isGameOver);
    }
    setPlayer({
        ...player,
        collided,
        isFastDropping,
        position: nextPosition
    });
};


export const playerController = ({
    action,
    board,
    player,
    setPlayer,
    setGameOver
  }) => {
    if (!action){
        return;
    } 
  
    if (action === Action.Rotate) {
      attemptRotation({ board, player, setPlayer });
    } else {
      attemptMovement({ board, player, setPlayer, action, setGameOver });
    }
};