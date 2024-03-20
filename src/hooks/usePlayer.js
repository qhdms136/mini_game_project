import { useCallback, useState } from "react"
import { randomTetromino } from "../business/Tetrominoes";

// 플레이어의 초기 버전을 빌드하고 나중에 플레이어가 변경될때 플레이어를 업데이트
const buildPlayer = (previous) => {
    let tetrominoes;

    if (previous) {
        tetrominoes = [...previous.tetrominoes];
        tetrominoes.unshift(randomTetromino());
    } else {
        tetrominoes = Array(5)
        .fill(0)
        .map((_) => randomTetromino());
    }

    return {
        collided: false,
        isFastDropping: false,
        position: { row: 0, column: 4 },
        tetrominoes,
        tetromino: tetrominoes.pop()
    };
}

export const usePlayer = () => {
    const [player, setPlayer] = useState(buildPlayer());

    const resetPlayer = useCallback(() => {
        setPlayer((prev) => buildPlayer(prev));
    }, [])

    return [player, setPlayer, resetPlayer];
}