import React, {useContext, memo} from 'react'
import Tr from './Tr'
import { TableContext } from './MineSearch';

const Table = memo(() => {
    // TableContext를 넣어주면 value(value.tableData)가 나옴
    const {tableData} = useContext(TableContext);
    return (
            <table>
                <thead></thead>
                <tbody>
                {Array(tableData.length).fill().map((tr, i) => <Tr rowIndex={i}  key={i}/>)}
                </tbody>
            </table>
    )
});
export default Table;