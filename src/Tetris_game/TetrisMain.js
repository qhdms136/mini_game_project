import Game from './Game'

function TetrisMain (){
    return(
        <div className="tetris_container">
            <Game rows={20} columns={10} />
        </div>
    )
}

export default TetrisMain;