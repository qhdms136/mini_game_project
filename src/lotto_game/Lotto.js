import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Ball from './Ball';

function getWinNumbers() {
    console.log('getWinNumbers');
    const candidate = Array(45).fill().map((v, i) => i + 1);
    const shuffle = [];
    while (candidate.length > 0){
        // 랜덤하게 숫자를 뽑아서 하나씩 정렬
        // Math.floor() 함수는 주어진 숫자와 같거나 작은 정수 중에서 가장 큰 수를 반환
        //  array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }
    const bonusNumber = shuffle[shuffle.length - 1];
    // arr.sort([compareFunction]);
    // compareFunction : 정렬 순서를 정의하는 함수
    const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
    return [...winNumbers, bonusNumber];
}

const Lotto = () => {
    // useMemo : 복잡한 함수 결과값을 기억
    // useRef : 일반 값을 기억
    const lottoNumbers = useMemo(() => getWinNumbers(), []);
    const [winNumbers, setWinNumbers] = useState(lottoNumbers);
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo ,setRedo] = useState(false);
    const timeouts = useRef([]);

    useEffect(() => {
        console.log('useEffect');
        // 첫번째 번호 1초후 나옴 2번째 번호 2초후 나옴... n초후 나옴
        for (let i = 0; i < winNumbers.length - 1; i++) {
            timeouts.current[i] = setTimeout(() => {
              setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
            }, (i + 1) * 1000);
          }
          // 보너스 번호 7번째 7초후 나옴
          timeouts.current[6] = setTimeout(() => {
            setBonus(winNumbers[6]);
            setRedo(true);
          }, 7000);
          return () => {
            timeouts.current.forEach((v) => {
              clearTimeout(v);
            });
          };
    }, [timeouts.current]);

    useEffect(()=>{
        console.log('로또 숫자를 생성합니다.');
    }, [winNumbers])
    
    // 자식 컴포넌트에 props로 함수를 넘길때는 useCallback필수
    const onClickRedo = useCallback(() =>{
      console.log('onClickRedo');
      console.log(winNumbers);
      setWinNumbers(getWinNumbers());
      setWinBalls([]);
      setBonus(null);
      setRedo(false);
      timeouts.current = [];
    }, [winNumbers]);

    return(
      <div className='lotto_container'>
        <div className='lotto'>
             <h1 className='LottoFont'>당첨 숫자</h1>
            <div id="결과창">
                {winBalls.map((v) => <Ball key={v} number={v} />)}
            </div>
            <h2 className='LottoFont'>보너스!</h2>
            {bonus && <Ball number={bonus} onClick={onClickRedo} />}
            {redo && <button className='LottoBtn'onClick={onClickRedo}>한 번 더!</button>}
        </div>
        </div>
    );
}

export default Lotto;