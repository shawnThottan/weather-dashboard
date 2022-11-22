import { useEffect, useRef } from 'react';

const useTimeout = () => {
    const timeout = useRef();

    const clear = () => {
        clearTimeout(timeout.current);
    }

    useEffect(() => () => {
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
    }, []);

    return [timeout, clear];
};

export {
    useTimeout
}