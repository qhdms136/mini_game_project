import React, {memo, useCallback, useContext} from 'react'
import {CODE, OPEN_CELL, CLICK_MINE, FLAG_CELL, QUESTION_CELL, NORMALIZE_CELL, TableContext } from './MineSearch';

const getTdStyle = (code) => {
    switch(code){
        case CODE.NORMAL:
        case CODE.MINE:
            return{
                background: '#8C8C8C',
            };
        case CODE.OPENED:
        case CODE.CLICKED_MINE:
            return{
                background:'white',
            };
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
            return{
                background:'blue',
            };
        case CODE.FLAG_MINE:
        case CODE.FLAG:
            return{
                background:'white',
            };
        default:
            return{
                background:'white',
            };
    }
};
const getTdText = (code) => {
    switch(code){
        case CODE.NORMAL:
            return '';
        case CODE.MINE:
            return 'X';
        case CODE.CLICKED_MINE:
            return '💣';
        case CODE.FLAG_MINE:
        case CODE.FLAG:
            return '🚩';
        case CODE.QUESTION_MINE:
        case CODE.QUESTION:
            return'❔';
        default:
            return code || '';
    }
};

const Td = memo(({rowIndex, cellIndex}) => {
    const { tableData, dispatch, halted } = useContext(TableContext);

    const onClickTd = useCallback(() => {    // tableData[rowIndex][cellIndex] 바뀌는 데이터이므로 useCallback에 넣기
        if (halted) {
            return;
          }
          switch (tableData[rowIndex][cellIndex]) {
            case CODE.OPENED:
            case CODE.FLAG_MINE:
            case CODE.FLAG:
            case CODE.QUESTION_MINE:
            case CODE.QUESTION:
              return;
            case CODE.NORMAL:
              dispatch({ type: OPEN_CELL, row: rowIndex, cell: cellIndex });
              return;
            case CODE.MINE:
              dispatch({ type: CLICK_MINE, row: rowIndex, cell: cellIndex });
              return;
            default:
              return;
          }
    }, [tableData[rowIndex][cellIndex], halted]);

    const onRightClickTd = useCallback((e) => {
        e.preventDefault();
        if (halted) {
          return;
        }
        switch (tableData[rowIndex][cellIndex]) {
          case CODE.NORMAL:
          case CODE.MINE:
            dispatch({ type: FLAG_CELL, row: rowIndex, cell: cellIndex });
            return;
          case CODE.FLAG_MINE:
          case CODE.FLAG:
            dispatch({ type: QUESTION_CELL, row: rowIndex, cell: cellIndex });
            return;
          case CODE.QUESTION_MINE:
          case CODE.QUESTION:
            dispatch({ type: NORMALIZE_CELL, row: rowIndex, cell: cellIndex });
            return;
          default:
            return;
        }
      }, [tableData[rowIndex][cellIndex], halted]);

    console.log('real td rendered');
    return <RealTd onClickTd={onClickTd} onRightClickTd={onRightClickTd} data={tableData[rowIndex][cellIndex]} />;
    // 함수 자체는 여러번 실행되도(정확히는 호출) return 부분은 한번만 실행(재 랜더링)
    //return useMemo(() => (
       //  <td 
        // style={getTdStyle(tableData[rowIndex][cellIndex])}
       //  onClick={onClickTd}
    //     onContextMenu={onRightClickTd}>
    //    {getTdText(tableData[rowIndex][cellIndex])}</td>
   // ), [tableData[rowIndex][cellIndex]]);
});
const RealTd = memo(({ onClickTd, onRightClickTd, data}) => {
    console.log('real td rendered');
    return (
      <td
        style={getTdStyle(data)}
        onClick={onClickTd}
        onContextMenu={onRightClickTd}
      >{getTdText(data)}</td>
    )
  });

export default Td;