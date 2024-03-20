import React, {useReducer, createContext, useMemo, useEffect} from 'react'
import Form from './Form';
import Table from './Table';


// 지뢰 상태
export const CODE = {
    // 지뢰
    MINE : -7,
    // 노멀
    NORMAL: -1,
    // 물음표 상태
    QUESTION: -2,
    // 깃발 상태
    FLAG: -3,
    // 물음표 상태에 지뢰가 있는 경우
    QUESTION_MINE: -4,
    // 깃발 상태에 지뢰가 있는 경우
    FLAG_MINE:-5,
    // 클릭 했을때 지뢰가 있는 경우
    CLICKED_MINE: -6,
    // 정상적으로 완료된 칸
    OPENED: 0, // 0으로 설정한 이유 : 0 이상이면 다 opened
};

export const TableContext = createContext({
    tableData:[],
    halted: true,
    dispatch: () => {},
});

// 지뢰 심는 함수
const plantMine = (row, cell, mine) => {
    console.log(row, cell, mine);
    // 0부터 99까지 칸
    const candidate = Array(row * cell).fill().map((arr, i) => {
        return i;
    });
    const shuffle = [];
    // 0부터 99까지의 칸 중에서 지뢰의 갯수 만큼 랜덤으로  숫자를 뽑음
    while (candidate.length > row * cell - mine){
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }
    const data = [];
    // 2차원 배열 만들기
    // 정상적인 칸
    for(let i = 0; i < row; i++){
        const rowData = [];
        data.push(rowData);
        for(let j = 0; j < cell; j++){
            rowData.push(CODE.NORMAL);
        }
    }

    // 지뢰 심기
    for(let k = 0; k < shuffle.length; k++){
        // 2차원 배열 [?,?]을 계산하기 위한
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }
    console.log(data);
    return data; // 지뢰 심은 칸 정보가 tableData에 저장
};

const initialState ={
    // 2차원 배열
    tableData: [],
    data:{
        row: 0,
        cell: 0,
        mine: 0,
    },
    timer: 0,
    result:'',
    halted: true, // 게임 멈춤
    openedCount: 0, // 카운트
};

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';
export const INCREMENT_TIMER = 'INCREMENT_TIMER';


const reducer = (state, action) => {
    // reducer : action 발생시에 state를 어떻게 바꿀지 처리
    //action이 실행됬을때 어떤 동작을 할지 reducer를 통해 정의
    switch(action.type){
        case START_GAME:
            return{
                ...state,
                data:{
                row: action.row,
                cell: action.cell,
                mine: action.mine,
                },
                openedCount: 0, // 게임을 재 시작할때 카운트 초기화 >> 초기화 안하면 카운트가 쌓여 버그 발생
                // row, cell, mine 정보를 이용하여 지뢰를 심는다.
                tableData: plantMine(action.row, action.cell, action.mine),
                halted: false,
                timer : 0,
            }
        case OPEN_CELL: {   // *** 불변성을 위한 작업
            const tableData = [...state.tableData];
            //tableData[action.row] = [...state.tableData[action.row]];
            tableData.forEach((row, i) => {
                tableData[i] = [...row];
            });
            // 한번 검사한 칸은 다시  검사x
            const checked = [];
            // 열려있는 칸
            let openedCount = 0;
            //console.log(tableData.length, tableData[0].length);
            // 주변 칸 검사
            const checkAround = (row, cell) => {
                //console.log(row, cell);
                // 클릭 기준 : 빈 칸일때만
                // 무한루프를 막기위해 조건문 설정
                // 상하좌우 칸이 아닌 경우 필터링
                if (row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length) {
                    return;
                } // 상하좌우 없는칸은 안 열기
                if ([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])) {
                    return;
                } // 닫힌 칸만 열기
                if (checked.includes(row + '/' + cell)) {
                    return;
                } else {
                checked.push(row + '/' + cell);
                } // 한 번 연칸은 무시하기
                let around = [
                    tableData[row][cell - 1], tableData[row][cell + 1],
                ];
                // 주변 칸 탐색
                // concat : 배열 병합, 이 메서드는 기존 배열을 변경하지 않고, 새 배열을 반환
                if (tableData[row - 1]) {
                    around = around.concat([
                        tableData[row - 1][cell - 1],
                        tableData[row - 1][cell],
                        tableData[row - 1][cell + 1
                    ]]);
                }
                if (tableData[row + 1]) {
                    around = around.concat([
                        tableData[row + 1][cell - 1],
                        tableData[row + 1][cell],
                        tableData[row + 1][cell + 1]
                    ]);
                }
                // 지뢰 칸 갯수 세기
                const count = around.filter((v) => 
                    [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;
                // 주변 칸 클릭
                // 위 아래만 검사하는 이유 : undefined의 속성에 접근하여 에러가 생김
                // 좌우 칸 : tableData 자체가 undefined가 되므로 filter로인해 사라진다.
                // 제일 윗 칸을 클릭한 경우 : 더 이상 윗칸은 없으므로 없애준다.
                // 제일 아랫칸을 클릭한 경우 : 더 이상 아랫칸은 없으므로 없애준다.
                        
                if (count === 0) { // 주변칸 오픈
                    if (row > -1) {
                        const near = [];
                        if (row - 1 > -1) {
                        near.push([row -1, cell - 1]);
                        near.push([row -1, cell]);
                        near.push([row -1, cell + 1]);
                        }
                        near.push([row, cell - 1]);
                        near.push([row, cell + 1]);
                        if (row + 1 < tableData.length) {
                        near.push([row + 1, cell - 1]);
                        near.push([row + 1, cell]);
                        near.push([row + 1, cell + 1]);
                        }
                        near.forEach((n) => {
                        // 무한루프를 막기위해 조건문 설정
                        // 주변 칸들이 닫혔을 경우만 연다.
                        // tableData[n[0]][n[1]] < CODE.OPENED
                        if (tableData[n[0]][n[1]] !== CODE.OPENED) {
                            checkAround(n[0], n[1]);
                        }
                        })
                    }
                }
                if (tableData[row][cell] === CODE.NORMAL) { // 내 칸이 닫힌 칸이면 카운트 증가
                    openedCount += 1;
                }
                tableData[row][cell] = count;
            };
            checkAround(action.row, action.cell);
            let halted = false;
            let result = '';
            console.log(state.data.row * state.data.cell - state.data.mine, state.openedCount, openedCount);
            // 승리조건 : 지뢰 없는 칸 만큼 열면 승리(전체 칸 - 지뢰 수)
            if(state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount){
                halted = true;
                result = `승리하였습니다. 기록 : ${state.timer}초`
            }
            return{
                ...state,
                tableData,
                openedCount: state.openedCount + openedCount,
                halted,
                result,
            }
        }
        // 지뢰 클릭
        case CLICK_MINE: { // *** 불변성을 위한 작업
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.cell] = CODE.CLICKED_MINE;
            return{
                ...state,
                tableData,
                halted:true,
            };
        }
        // 깃발 꽂기
        case FLAG_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if(tableData[action.row][action.cell] === CODE.MINE){
                tableData[action.row][action.cell] = CODE.FLAG_MINE;
            } else{
                tableData[action.row][action.cell] = CODE.FLAG;
            }
            return{
                ...state,
                tableData,
            };
        }
        // 물음표
        case QUESTION_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if(tableData[action.row][action.cell] === CODE.FLAG_MINE){
                tableData[action.row][action.cell] = CODE.QUESTION_MINE;
            } else{
                tableData[action.row][action.cell] = CODE.QUESTION;
            }
            return{
                ...state,
                tableData,
            };
        }
        // NORMAL
        case NORMALIZE_CELL:{
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if(tableData[action.row][action.cell] === CODE.QUESTION_MINE){
                tableData[action.row][action.cell] = CODE.MINE;
            } else{
                tableData[action.row][action.cell] = CODE.NORMAL;
            }
            return{
                ...state,
                tableData,
            };
        }
        case INCREMENT_TIMER: {
            return {
              ...state,
              timer: state.timer + 1,
            }
          }
        default:
            return state;
    }
}

function MineSearch(){
    const [state, dispatch] = useReducer(reducer, initialState);
    // 구조 분해
    const { tableData, halted, timer, result} = state;
    // useMemo 사용 : 매번 새로운 객체가 생기지 않게
    // useMemo(() => (),[바뀌는 목록])
    // cf) dispatch 함수는 바뀌지 않는다.(항상 같게 유지된다. 즉 바뀌는 목록에 추가 안해도된다.)
    const value = useMemo(() => ({tableData, halted, dispatch}), [tableData, halted]);

    useEffect(() => {
        let timer;
        if (halted === false) {
          timer = setInterval(() => {
            dispatch({ type: INCREMENT_TIMER });
          }, 1000);
        }
        return () => {
          clearInterval(timer);
        }
      }, [halted]);
    return(
        // <TableContext.Provider value={{tableData:state.tableData, dispatch}}>
        // => 위와 같이 작성하면 MineSearch가 새롭게 리 랜더링 될 때마다 위의 객체도 새로 생긴다
        // 즉 객체가 새로 생긴다는 것은 컨텍스트 api를 쓰는 자식들도 매번 새롭게 리 랜더링 된다는 뜻
        // => 컨텍스트 api : 성능 최적화 하기가 힘들다
        // 보완 : 캐싱
        
        <TableContext.Provider value={value}>
        <div  className='mine_container'>
            <div className='mine'>
        <Form/>
        <div className='timer'>{timer}</div>
        <Table/>
        <div className='result'>{result}</div>
            </div>
        </div>
        </TableContext.Provider>
    )
}
export default MineSearch;