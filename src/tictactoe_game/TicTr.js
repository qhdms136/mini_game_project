import React, {memo} from 'react'
import TicTd from './TicTd'
const  TicTr = memo(({rowData, rowIndex, dispatch}) => {
    return(
        <tr>
            {Array(rowData.length).fill().map((td, i) => (<TicTd key={i} dispatch={dispatch} rowIndex={rowIndex} cellData={rowData[i]} cellIndex={i}>{''}</TicTd>))}
        </tr>
    );
});

export default TicTr;