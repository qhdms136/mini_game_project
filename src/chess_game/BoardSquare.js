import React, {useState, useEffect} from "react";
import Square from "./Square";
import Piece from "./Piece";
import { useDrop } from "react-dnd";
import {handleMove} from "./Game"
import { gameSubject } from "./Game";
import Promote from "./Promote";

export default function BoardSquare({
    piece,
    black,
    position
}) {
    const [promotion, setPromotion] = useState(null)
    const [, drop] = useDrop({
        accept: 'piece',
        drop: (item) => {
            const [fromPostion] = item.id.split('_')
            handleMove(fromPostion, position) // 변경된 자리
        },
    })
    useEffect(() => {
        const subscribe = gameSubject.subscribe(
          ({ pendingPromotion }) =>
            pendingPromotion && pendingPromotion.to === position
              ? setPromotion(pendingPromotion)
              : setPromotion(null)
        )
        return () => subscribe.unsubscribe()
      }, [position])
    return(
        <div className="board_square" ref={drop}>
            <Square black={black}>
                {promotion ? (
            <Promote promotion={promotion} />
            ) : piece ? (
            <Piece piece={piece} position={position} />
            ) : null}
            </Square>
        </div>
    )
}