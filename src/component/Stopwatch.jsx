import React, { useState, useRef, useEffect } from 'react';
import './Stopwatch.css'; // Import your CSS for Stopwatch styling

const Stopwatch = () => {
    const [timer, setTimer] = useState(null); // State to hold setInterval() function
    const [startTime, setStartTime] = useState(0); // State to hold start time of the stopwatch
    const [isRunning, setIsRunning] = useState(false); // State to track if stopwatch is running
    const [laps, setLaps] = useState([]); // State to store lap times
    const [currentTime, setCurrentTime] = useState({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }); // State to hold current time
    const displayRef = useRef(null); // Ref for displaying the stopwatch time

    // Effect to handle starting, pausing, and resetting the stopwatch
    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                setCurrentTime(calculateTime(elapsedTime));
            }, 10); // Update display every 10 milliseconds

            return () => clearInterval(interval); // Clean up interval on component unmount or state change
        } else {
            clearInterval(timer); // Clear interval if stopwatch is paused
        }
    }, [isRunning, startTime]);

    // Function to start or pause the stopwatch
    const startPause = () => {
        if (isRunning) {
            setIsRunning(false);
        } else {
            const start = Date.now() - (laps.length > 0 ? laps[laps.length - 1].time : 0);
            setStartTime(start);
            setIsRunning(true);
        }
    };

    // Function to reset the stopwatch
    const reset = () => {
        // Prompt confirmation before resetting
        const confirmReset = window.confirm('Are you sure you want to reset the stopwatch?');

        if (confirmReset) {
            setIsRunning(false);
            setTimer(null);
            setCurrentTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
            setLaps([]);
        }
    };

    // Function to record a lap time
    const lap = () => {
        if (isRunning) {
            const lapTime = Date.now() - startTime;
            setLaps([...laps, { time: lapTime }]);
        }
    };

    // Function to calculate time from milliseconds
    const calculateTime = (milliseconds) => {
        let hours = Math.floor(milliseconds / 3600000);
        milliseconds %= 3600000;
        let minutes = Math.floor(milliseconds / 60000);
        milliseconds %= 60000;
        let seconds = Math.floor(milliseconds / 1000);
        milliseconds %= 1000;

        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            milliseconds: milliseconds
        };
    };

    // Function to format time into HH:mm:ss.SSS
    const formatTime = (time) => {
        const hours = String(time.hours).padStart(2, '0');
        const minutes = String(time.minutes).padStart(2, '0');
        const seconds = String(time.seconds).padStart(2, '0');
        const milliseconds = String(time.milliseconds).padStart(3, '0');
        
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    // Effect to update display every 100 milliseconds to reduce flickering
    useEffect(() => {
        const displayInterval = setInterval(() => {
            if (isRunning) {
                displayRef.current.textContent = formatTime(currentTime);
            }
        }, 100); // Update display every 100 milliseconds

        return () => clearInterval(displayInterval); // Clean up interval on component unmount or state change
    }, [isRunning, currentTime]);

    // State to manage button click effect
    const [startButtonClicked, setStartButtonClicked] = useState(false);

    // Function to handle start button click
    const handleStartButtonClick = () => {
        setStartButtonClicked(true);
        startPause(); // Call startPause function to start/pause stopwatch
        setTimeout(() => setStartButtonClicked(false), 200); // Reset button effect after 200ms
    };

    return (
        <div className="stopwatch">
            <div className="display">
                <span ref={displayRef}>{formatTime(currentTime)}</span>
            </div>
            <div className="controls">
                <button
                    onClick={handleStartButtonClick}
                    className={isRunning ? 'running' : startButtonClicked ? 'start-clicked' : ''}
                >
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                
                <button onClick={reset}>Reset</button>
                <button onClick={lap}>Lap</button>
            </div>
            <ul className="laps">
                {laps.map((lap, index) => (
                    <li key={index}>{formatTime(calculateTime(lap.time))}</li>
                ))}
            </ul>
        </div>
    );
};

export default Stopwatch;
