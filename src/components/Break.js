import React, { useState, useEffect, useRef } from "react";
import "../styles/Break.css";
import { MdFreeBreakfast } from "react-icons/md";
import { GiStopwatch } from "react-icons/gi";

export default function Break() {
    const [timer, setTimer] = useState(false);
    const [breakTime, setBreakTime] = useState("");
    const [clock, setClock] = useState("Start");

    const intervalRef = useRef();

    useEffect(() => {
        return () => {
            clearTimeout(intervalRef.current);
        };
    }, []);

    const checkBreakTime = () => {
        if (!breakTime) {
            return;
        }

        const [confHour, confMinutes] = breakTime
            .split(":")
            .map((item) => parseInt(item));
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();

        const calcTime = timeCalculation(
            confMinutes,
            confHour,
            currentMinutes,
            currentHour
        );

        if (!calcTime) {
            return setTimer(false);
        }
        setTimer(true);
        countdown(calcTime * 60);
    };

    const countdown = (time) => {
        if (time <= 0) {
            clearTimeout(intervalRef.current);
            return setClock("Break over!");
        }
        setClock(getTimeOutput(time));
        time--;
        intervalRef.current = setTimeout(() => countdown(time), 1000);
    };

    const stopTimer = () => {
        clearTimeout(intervalRef.current);
        setTimer(false);
    };

    if (timer) {
        return (
            <div className="break">
                <p>{clock}</p>
                <button onClick={stopTimer}>
                    <GiStopwatch />
                </button>
            </div>
        );
    }
    return (
        <div className="break">
            <h1>Set Timer:</h1>
            <input
                type="time"
                value={breakTime}
                onChange={(e) => setBreakTime(e.target.value)}
            />
            <button onClick={checkBreakTime}>
                <MdFreeBreakfast />
            </button>
        </div>
    );
}

function timeCalculation(confMinutes, confHour, currentMinutes, currentHour) {
    let hours, minutes;

    const diffMinutes =
        confMinutes >= currentMinutes
            ? confMinutes - currentMinutes
            : 60 - currentMinutes + confMinutes;

    const diffHours =
        confHour >= currentHour
            ? confHour - currentHour
            : 24 - currentHour + confHour;

    if (diffHours === 0 && diffMinutes === 0) {
        return null;
    } else if (diffHours === 0 && confMinutes < currentMinutes) {
        hours = 23;
        minutes = 60 - currentMinutes + confMinutes;
    } else if (diffHours === 0 && confMinutes > currentMinutes) {
        hours = 0;
        minutes = diffMinutes;
    } else if (diffHours > 0 && confMinutes > currentMinutes) {
        hours = diffHours;
        minutes = diffMinutes;
    } else if (diffHours > 0 && confMinutes <= currentMinutes) {
        hours = diffMinutes !== 0 ? diffHours - 1 : diffHours;
        minutes = diffMinutes;
    } else {
        return null;
    }

    return 60 * hours + minutes;
}

function padTime(val, len = 2) {
    return val.toString().padStart(len, "0");
}

function getTimeOutput(time) {
    var hours = padTime(Math.floor(time / 3600));
    var minutes = padTime(Math.floor((time % 3600) / 60));
    var seconds = padTime(Math.round(time % 60));

    return hours !== "00"
        ? hours + ":" + minutes + ":" + seconds
        : minutes + ":" + seconds;
}
