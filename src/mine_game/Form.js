import React, {useState, useCallback, useContext, memo ,useEffect} from 'react'
import { START_GAME, TableContext } from './MineSearch';
const Form = memo(() => {
    // 세로칸 개수 설정
    const [row, setRow] = useState(10);
    // 가로칸 개수 설정
    const [cell, setCell] = useState(10);
    // 지뢰 개수 설정
    const [mine, setMine] = useState(20);
    
    const { dispatch } = useContext(TableContext);

    useEffect( () => {
        if(row > 30){
            setRow(30);
        } else if(cell > 30){
            setCell(30);
        } else if(mine > parseInt((row * cell)/3)){
            setMine(parseInt((row * cell)/3));
        }
    }, [row, cell, mine]);

    const onChangeRow = useCallback((e) => {
        setRow(e.target.value);
    }, []);  
    const onChangeCell = useCallback((e) => {
        setCell(e.target.value);
    }, []);
    const onChangeMine = useCallback((e) => {
        setMine(e.target.value);
    }, []);

    const onClickBtn = useCallback(() => {
        dispatch({ type: START_GAME, row, cell, mine });
    }, [row, cell, mine]);
    // Maximum call stack 오류 방지를 위해 input maxlength 조절
    return(
        <div>
            <input className='mine_input' type="number" placeholder='세로' max={30} value={row} onChange={onChangeRow}/>
            <input className='mine_input' type="number" placeholder='가로' max={30} value={cell} onChange={onChangeCell}/>
            <input className='mine_input' type="number" placeholder='지뢰' max={parseInt(row * cell) / 3}value={mine} onChange={onChangeMine}/>
            <button onClick={onClickBtn} className='mine_start'>시작</button>
        </div>
    )
})

export default Form;