import React from 'react'
import TicTr from './TicTr'

function TicTable({tableData, dispatch}){
    return(
        <table>
            <tbody>
            {Array(tableData.length).fill().map((tr, i) => (<TicTr key={i} dispatch={dispatch} rowIndex={i} rowData={tableData[i]}/>))}
            </tbody>
        </table>
    )
}

export default TicTable;