import { useState, useEffect, useRef, useCallback } from 'react';

export const usePollTimer = (initialTime, isActive, onExpire) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const intervalRef = useRef(null);

  // Update timer when initialTime changes (for server sync)
  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (onExpire) {
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onExpire]);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback((newTime) => {
    stopTimer();
    setTimeRemaining(newTime);
  }, [stopTimer]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [isActive, startTimer, stopTimer, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    resetTimer,
    stopTimer,
  };
};
