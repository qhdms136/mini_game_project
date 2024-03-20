import React, { useState, useRef, useCallback, useMemo } from 'react';

const ResponseCheck = () => {
  const [state, setState] = useState('waiting');
  const [message, setMessage] = useState('클릭해서 시작하세요.');
  const [result, setResult] = useState([]);
  // useState : 값이 바뀌면 return 부분이 다시 리 랜더링
  // useRef : 값이 바뀌어도 리 랜더링 x(값은 바뀌지만 화면에는 영향 x)
  // useRef는 current로 접근
  const timeout = useRef(null);
  const startTime = useRef(0);
  const endTime = useRef(0);

  const onClickScreen = useCallback(() => {
    if (state === 'waiting') {
      timeout.current = setTimeout(() => {
        setState('now');
        setMessage('지금 클릭');
        startTime.current = new Date();
      }, Math.floor(Math.random() * 1000) + 2000); // 2초~3초 랜덤
      setState('ready');
      setMessage('초록색이 되면 클릭하세요.');
    } else if (state === 'ready') { // 성급하게 클릭
      clearTimeout(timeout.current);
      setState('waiting');
      setMessage('너무 성급하시군요! 초록색이 된 후에 클릭하세요.');
    } else if (state === 'now') { // 반응속도 체크
      endTime.current = new Date();
      setState('waiting');
      setMessage('클릭해서 시작하세요.');
      setResult((prevResult) => {
        return [...prevResult, endTime.current - startTime.current];
      });
    }
  }, [state]);
  const onReset = useCallback(() => {
    setResult([]);
  }, []);

  const renderAverage = () => {
    // 보호 연산자 result.length !== && <div>...</div>
    return result.length === 0
      ? null
      : <>
        <div className='res_result'>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
        <button onClick={onReset} className='ResBtn'>리셋</button>
      </>
  };

  return (
    <div className='rescheck_container'>
      <div className='rescheck'>
        <div
          id="screen"
          className={state}
          onClick={onClickScreen}
        >
          {message}
        </div>
        {renderAverage()}
      </div>
    </div>
  );
};

export default ResponseCheck;

