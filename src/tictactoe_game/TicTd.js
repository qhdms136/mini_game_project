import React, {useCallback, memo, useContext} from 'react'
import {CLICK_CELL, TableContext} from './TicTacToe'

const TicTd = memo(({rowIndex, cellIndex, dispatch , cellData}) => {
    // 랜더링 검사
    //const ref = useRef([]);
    //useEffect(() => {
    //    console.log(rowIndex === ref.current[0], dispatch === ref.current[2], rowIndex === ref.current[3])
    //    ref.current = [rowIndex, dispatch, cellData];
    //},[rowIndex, dispatch, cellData])
    //console.log('td rendered');
    const winner = useContext(TableContext);
    const onClickTd = useCallback(() => {
        // console.log('너가 셀 누를때마다 나오는거엿어?');
        console.log(winner);
        console.log(rowIndex, cellIndex);
        if( winner || cellData){
            return;
        }
        // action은 마음대로 만들되 reducer에서 잘 처리해야한다.
        dispatch({type:CLICK_CELL, row: rowIndex, cell: cellIndex});
    }, [cellData, winner]);

    return(
        <td className='ticTd' onClick={onClickTd}>{cellData}</td>
    );
});

export default TicTd;