import React, { useState, useEffect } from "react";
import "../styles/Tracker.css";
import { FcStart } from "react-icons/fc";
import { CgStopwatch } from "react-icons/cg";

export default function Tracker() {
    const [trackedTime, setTrackedTime] = useState({
        coding: { start: null },
        sport: { start: null },
        times: { coding: null, sport: null },
        date: `${new Date()}`,
        ended: false,
    });

    useEffect(() => {
        "storage" in chrome &&
            chrome.storage.sync.get(["tracker"], async ({ tracker = [] }) => {
                console.log("before", tracker);
                if (tracker && tracker.length) {
                    setTrackedTime(...tracker.filter((item) => !item.ended));
                }
            });
    }, []);

    const start = (type) => {
        setTrackedTime((prev) => {
            const newTrackedTime = {
                ...prev,
                [type]: { start: Date.now() },
            };
            storeChrome(newTrackedTime);
            return newTrackedTime;
        });
    };

    const stop = (type) => {
        let difference = Date.now() - trackedTime[type]["start"];
        difference += trackedTime.times[type];
        return setTrackedTime((prev) => {
            const newTrackedTime = {
                ...prev,
                times: { ...prev.times, [type]: difference },
                [type]: { start: null },
            };
            storeChrome(newTrackedTime);
            return newTrackedTime;
        });
    };

    const storeChrome = (newTrackedTime) => {
        "storage" in chrome &&
            chrome.storage.sync.get(["tracker"], async ({ tracker = [] }) => {
                if (tracker && tracker.length) {
                    tracker = tracker.map((item) => {
                        if (!item.ended) {
                            item = newTrackedTime;
                        }

                        return item;
                    });
                } else {
                    tracker.push(newTrackedTime);
                }
                console.log("store", tracker);
                await chrome.storage.sync.set({ tracker });
            });
    };

    const convertString = (str) => {
        const date = new Date(str);
        return date.toLocaleDateString();
    };

    return (
        <div className="tracker">
            <h1>Tracker</h1>
            <p>{convertString(trackedTime.date)}</p>
            <div>
                <h3>Coding</h3>
                {!trackedTime.coding.start && (
                    <button onClick={() => start("coding")}>
                        <FcStart />
                    </button>
                )}
                {trackedTime.coding.start && (
                    <button
                        onClick={() => stop("coding")}
                        className="stop-button"
                    >
                        <CgStopwatch />
                    </button>
                )}
            </div>
            <div>
                <h3>Sport</h3>
                {!trackedTime.sport.start && (
                    <button onClick={() => start("sport")}>
                        <FcStart />
                    </button>
                )}
                {trackedTime.sport.start && (
                    <button
                        onClick={() => stop("sport")}
                        className="stop-button"
                    >
                        <CgStopwatch />
                    </button>
                )}
            </div>
        </div>
    );
}
