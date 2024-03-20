import React from 'react'
import './GameController.css'
import { Action ,actionForKey, actionIsDrop } from '../business/Input'
import { playerController } from '../business/PlayerController';
import { useInterval } from '../hooks/useInterval'
import { useDropTime } from '../hooks/useDropTime'
const  GameController = ({
    board,
    gameStats,
    player,
    setGameOver,
    setPlayer
}) => {
    const [dropTime, pauseDropTime, resumeDropTime] = useDropTime({
        gameStats
    });

    useInterval(() => {
        handleInput({ action: Action.SlowDrop });
      }, dropTime);
    
    const onKeyUp =({code}) => {
        //console.log(`onKeyUp ${code}`);
        const action = actionForKey(code);
        if (actionIsDrop(action)) resumeDropTime();
    };
    
    const onKeyDown = ({ code }) => {
        console.log({code});
        const action = actionForKey(code);
    
        if (action === Action.Pause) {
          if (dropTime) {
            pauseDropTime();
          } else {
            resumeDropTime();
          }
        } else if (action === Action.Quit) {
          setGameOver(true);
        } else {
          if (actionIsDrop(action)) pauseDropTime();
          if (!dropTime) {
            return;
          }
          handleInput({ action });
        }
      };

    const handleInput = ({ action }) => {
        playerController({
          action,
          board,
          player,
          setPlayer,
          setGameOver
        });
    }

    return(
        <div>
            <input
                className='GameController'
                type='text'
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                autoFocus    
            />
        </div>
    )
}

export default GameController;