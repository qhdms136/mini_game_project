import { useEffect, useRef } from "react";

export const useInterval = (callback, delay) => {
    const saveCallback = useRef();

    // 최근 콜백 기억
    useEffect( () => {
        saveCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect( () => {
        function tick() {
            saveCallback.current();
        }
        if(delay !== null) {
            const id = setInterval(tick, delay);
            return() => {
                clearInterval(id);
            }
        }
    }, [delay]);
};