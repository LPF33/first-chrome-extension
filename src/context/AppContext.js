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
                    const currentDate = new Date();
                    const [month, day] = [
                        currentDate.getMonth(),
                        currentDate.getDate(),
                    ];

                    tracker = tracker.map((item) => {
                        if (!item.ended) {
                            const itemDate = new Date(item.date);
                            const [itemMonth, itemDay] = [
                                itemDate.getMonth(),
                                itemDate.getDate(),
                            ];
                            if (
                                itemMonth !== month ||
                                (itemMonth === month && itemDay !== day)
                            ) {
                                item.ended = true;
                            }
                        }

                        return item;
                    });
                }
                console.log("e", tracker);
                setTrackerTimes(tracker);
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
