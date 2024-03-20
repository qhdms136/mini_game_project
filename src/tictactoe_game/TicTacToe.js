import React, {useState, useReducer, useCallback, useEffect, createContext} from 'react'
import TicTable from './TicTable';

const initialState = {
    winner: '',
    turn: 'O',
    tableData:[
    ['','',''],
    ['','',''],
    ['','',''],
    ],
    recentCell: [-1, -1],
}
export const TableContext = createContext({
    winner: '',
});
// action을 변수에 담아 저장
export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

// action을 해석해서 state를 직접 바꿔주는 역할
// action을 dispatch할때마다 reducer 실행
// 어떻게 바꿀지는 reducer에서 써준다.
const reducer = (state, action) =>{
    switch (action.type){
        case SET_WINNER:
        // state.winner = action.winner; 이렇게 하면 안됨!
            return{
                ...state, // 데이터 불변성
                winner: action.winner,
            };
        case CLICK_CELL:{
            // 객체가 있으면 얕은 복사를 해준다.
            const tableData = [...state.tableData];
            tableData[action.row] = [...tableData[action.row]]; // immer라는 라이브러리로 가독성 해결
            tableData[action.row][action.cell] = state.turn;
            return{
                ...state,
                tableData,
                // 최근에 클릭한 셀 기억
                recentCell: [action.row, action.cell],
            };
        }
        case CHANGE_TURN: {
            return{
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O',
            };
        }
        case RESET_GAME: {
            return{
                ...state,
                turn: 'O',
                tableData:[
                ['','',''],
                ['','',''],
                ['','',''],
                ],
                recentCell: [-1, -1],
            };
        }
        default:
            return state;
    }
}

function TicTacToe(){
    const [state, dispatch] = useReducer(reducer, initialState);
    const { tableData, turn, winner, recentCell } = state;
    // const [winner, setWinner] = useState('');
    // const [turn, setTurn] = useState('O');
    // const [tableData, setTableData] = useState([['','',''],['','',''],['','','']]);
    const value = winner;
    // 컴포넌트에 넣는 이벤트는 useCallback
    const onClickTable = useCallback(() =>{
        // dispatch 안에 들어가는 것을 action이라 부른다.
        //{type:'SET_WINNER', winner:'O'} action 객체
        // type : action의 이름
        // dispatch 하면 action을 실행한다.
        dispatch({type:SET_WINNER, winner:'O'});
    }, []);

    // 다시하기 버튼 이벤트
    const ResetTable = () => {
      dispatch({ type: SET_WINNER, winner: null });
      dispatch({ type: RESET_GAME });
    }


    // 비동기 state따라 처리할때는 useEffect
    useEffect(() => {
        const [row, cell] = recentCell;
        // 게임이 실행되지 않았을때
        if (row < 0) {
          return;
        }
        let win = false;
        // 클릭한 가로줄 검사
        if (tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) {
          win = true;
        }
        // 클릭한 세로줄 검사
        if (tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) {
          win = true;
        }
        // 대각선 검사
        if (tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) {
          win = true;
        }
        // 역 대각선 검사
        if (tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) {
          win = true;
        }
        console.log(win, row, cell, tableData, turn);
        if (win) { // 승리시
          dispatch({ type: SET_WINNER, winner: turn });
          // dispatch({ type: RESET_GAME });
        } else {
          let all = true; // all이 true면 무승부라는 뜻
          tableData.forEach((row) => { // 무승부 검사
            row.forEach((cell) => {
              if (!cell) {
                all = false;
              }
            });
          });
          if (all) {
            dispatch({ type: SET_WINNER, winner: null });
            dispatch({ type: RESET_GAME });
          } else {
            dispatch({ type: CHANGE_TURN });
          }
        }
      }, [recentCell]);

    return(
      <div className='tictactoe_container'>
        <div className='tictactoe'>
           <TableContext.Provider value={value}>
            <TicTable onClick={onClickTable} tableData={state.tableData} dispatch={dispatch} />
            </TableContext.Provider>
        </div>
            {state.winner && <div className='TicResult'>{state.winner}님의 승리</div>}
            <button className='ResetBtn' onClick={ResetTable}>다시하기</button>
      </div>
    )
}

export default TicTacToe;