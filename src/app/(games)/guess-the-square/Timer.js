import React, { useState, useEffect } from 'react';

const Timer = ({ startTimer, initialTime = 60, onTimeEnd, onTimeUpdate }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(startTimer);
    useEffect(() => {
        setIsRunning(startTimer);
    }, [startTimer]);
    useEffect(() => {
        let timerId;
        if (isRunning && timeLeft > 0) {
            timerId = setInterval(() => {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    onTimeUpdate && onTimeUpdate(newTime);
                    return newTime;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            onTimeEnd && onTimeEnd();
        }
        return () => clearInterval(timerId);

    }, [timeLeft, isRunning, onTimeEnd, onTimeUpdate, startTimer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const pauseTimer = () => setIsRunning(false);
    const resumeTimer = () => setIsRunning(true);
    const resetTimer = () => setTimeLeft(initialTime);

    return (
        <div className="timer">
            <div className="time-display">{formatTime(timeLeft)}</div>
            <div className="timer-controls">
            </div>
        </div>
    );
};

export default Timer;
