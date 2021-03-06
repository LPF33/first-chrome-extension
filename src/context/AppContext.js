import * as React from "react";
import { v4 as uuid4 } from "uuid";

export const AppContext = React.createContext();

export default function AppContextProvider(props) {
    const [tool, setTool] = React.useState("SnippetSafer");
    const [selectedText, setSelectedText] = React.useState({
        text: "",
        href: "",
    });
    const [trackerTimes, setTrackerTimes] = React.useState([]);

    React.useEffect(() => {
        "runtime" in chrome &&
            chrome.runtime.onMessage.addListener(
                async ({ type, selection, href }, sender, respond) => {
                    if (type === "get-selected-text") {
                        setSelectedText({ text: selection, href, id: uuid4() });
                    }

                    if (type === "save-selected-text") {
                        chrome.storage.sync.get(
                            ["snippets"],
                            ({ snippets = [] }) => {
                                snippets.push({
                                    text: selection,
                                    href,
                                    id: uuid4(),
                                });
                                chrome.storage.sync.set({ snippets });
                            }
                        );
                    }
                }
            );

        "storage" in chrome &&
            chrome.storage.sync.get(["tracker"], async ({ tracker = [] }) => {
                if (tracker.length) {
                    tracker = tracker.map(endTrackerCheckStoppedTimes);
                }
                setTrackerTimes(tracker);
                await chrome.storage.sync.set({ tracker });
            });

        "storage" in chrome &&
            chrome.storage.onChanged.addListener(function (changes) {
                const [[key, { newValue }]] = Object.entries(changes);
                if (key === "tracker") {
                    setTrackerTimes(newValue);
                }
            });
    }, []);

    return (
        <AppContext.Provider
            value={{
                tool,
                setTool,
                selectedText,
                setSelectedText,
                trackerTimes,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
}

function endTrackerCheckStoppedTimes(obj) {
    if (!obj.ended) {
        const currentDate = new Date();
        const [month, day] = [currentDate.getMonth(), currentDate.getDate()];
        const itemCopy = { ...obj };
        const itemDate = new Date(itemCopy.date);
        const [itemMonth, itemDay] = [itemDate.getMonth(), itemDate.getDate()];
        if (itemMonth !== month || (itemMonth === month && itemDay !== day)) {
            itemCopy.ended = true;

            if (itemCopy?.coding?.start) {
                let difference = Date.now() - itemCopy.coding.start;
                difference += itemCopy.times.coding;
                itemCopy.times.coding =
                    difference > 21600000 ? 21600000 : difference;
            }

            if (itemCopy?.sport?.start) {
                let difference = Date.now() - itemCopy.sport.start;
                difference += itemCopy.times.sport;
                itemCopy.times.sport =
                    difference > 3600000 ? 3600000 : difference;
            }
        }
        return itemCopy;
    }

    return obj;
}

// [
// {
//     times: { coding: 27360000, sport: 2880000 },
//     date: "Mon Aug 08 2021 01:19:09 GMT+0200 (Mitteleurop??ische Sommerzeit)",
//     ended: false,
// },
//     {
//         times: { coding: 92849343, sport: 23000000 },
//         date: "Mon Aug 07 2021 01:19:09 GMT+0200 (Mitteleurop??ische Sommerzeit)",
//         ended: true,
//     },
//     {
//         times: { coding: 72849343, sport: 62849343 },
//         date: "Mon Aug 06 2021 01:19:09 GMT+0200 (Mitteleurop??ische Sommerzeit)",
//         ended: true,
//     },
//     {
//         times: { coding: 112849343, sport: 23000000 },
//         date: "Mon Aug 05 2021 01:19:09 GMT+0200 (Mitteleurop??ische Sommerzeit)",
//         ended: true,
//     },
// ]
