import { useState, useEffect, useRef } from "react";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export default function Stopwatch({ onCall }) {
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(
        () => setTime(Date.now() - startTimeRef.current),
        1000
      );
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    onCall(time);
  }, [time]);

  const hours = Math.floor(time / HOUR);
  const minutes = Math.floor((time / MINUTE) % 60);
  const seconds = Math.floor((time / SECOND) % 60);

  const start = () => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const startAndStop = () => {
    isRunning ? stop() : start();
  };

  const reset = () => {
    stop();
    setTime(0);
  };
  return (
    <div className="flex flex-col ml-auto p-4 text-5xl gap-3 h-fit">
      <div className="h-24 rounded-lg p-3 bg-primary flex justify-center items-center">
        {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
      <button
        onClick={startAndStop}
        className="h-24 !rounded-lg p-3 !bg-green-500 flex justify-center"
      >
        {isRunning ? "Stop" : "Start"}
      </button>
      <button
        onClick={reset}
        className="h-24 !rounded-lg p-3 !bg-red-500 flex justify-center"
      >
        Reset
      </button>
    </div>
  );
}
