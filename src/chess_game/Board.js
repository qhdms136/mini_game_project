import React,{ useEffect, useState } from "react";
import './ChessBoard.css'
import BoardSquare from "./BoardSquare";

export default function Board({board, turn}){
    const [currBoard, setCurrBoard] = useState([])

    useEffect(() => {
      setCurrBoard(
        turn === 'w' ? board.flat() : board.flat().reverse()
      )
    }, [board, turn])


    function getXYPosition(i) {

        // Math.abs : 절댓값 구하기
        // Math.floor : 항상 반올림하여 주어진 숫자보다 작거나 같은 가장 큰 정수를 반환
        const x = turn === 'w' ? i % 8 : Math.abs((i % 8) - 7)
        const y =
          turn === 'w'
            ? Math.abs(Math.floor(i / 8) - 7)
            : Math.floor(i / 8)
        return { x, y }
    }

    function isBlack(i){
        const {x ,y} = getXYPosition(i);
        return (x + y) % 2 === 1;

    }

    function getPosition(i) {
        const {x ,y} = getXYPosition(i);
        const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x]
        // chess 는 0이라는 위치가 없으므로 더하기 1
        return `${letter}${y + 1}`
    }

    return(
        <div className="container">
            <div className="board_container">
                <div className="chess_board">
                {currBoard.map((piece, i) => (
                    <div key={i} className="square">
                        {/* <p>{JSON.stringify(piece)}</p> */}
                        <BoardSquare
                            piece={piece}
                            black={isBlack(i)}
                            position={getPosition(i)} />
                    </div>
                ))}
                </div>
            </div>
        </div>
       
    )
}

