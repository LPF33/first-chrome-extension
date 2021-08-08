import React, { useState, useEffect, useContext } from "react";
import "../styles/Tracker.css";
import { FcStart } from "react-icons/fc";
import { CgStopwatch } from "react-icons/cg";
import { AiOutlineBarChart, AiFillCloseCircle } from "react-icons/ai";
import BarChart from "./BarChart/BarChart.js";
import { AppContext } from "../context/AppContext";

export default function Tracker() {
    const [showBar, setShowBar] = useState(false);
    const [trackedTime, setTrackedTime] = useState({
        coding: { start: null },
        sport: { start: null },
        times: { coding: null, sport: null },
        date: `${new Date()}`,
        ended: false,
    });

    const { trackerTimes } = useContext(AppContext);

    useEffect(() => {
        const filterTrackerTimes = trackerTimes.filter((item) => !item.ended);
        if (filterTrackerTimes.length) {
            setTrackedTime(...filterTrackerTimes);
        }
        // eslint-disable-next-line
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
                await chrome.storage.sync.set({ tracker });
            });
    };

    const convertString = (str) => {
        const date = new Date(str);
        return date.toLocaleDateString();
    };

    if (showBar) {
        return (
            <div className="tracker bar">
                <p>
                    <span>Coding</span>
                    <span>Sport</span>
                </p>
                <button onClick={() => setShowBar(false)} id="close-button">
                    <AiFillCloseCircle />
                </button>
                <BarChart data={trackerTimes} />
            </div>
        );
    }

    return (
        <div className="tracker">
            <h1>Tracker</h1>
            <p>{convertString(trackedTime.date)}</p>
            <button onClick={() => setShowBar(true)} id="show-bar-button">
                <AiOutlineBarChart />
            </button>
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
