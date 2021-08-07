import * as React from "react";
import { v4 as uuid4 } from "uuid";

export const AppContext = React.createContext();

export default function AppContextProvider(props) {
    const [tool, setTool] = React.useState("SnippetSafer");
    const [selectedText, setSelectedText] = React.useState({
        text: "",
        href: "",
    });

    React.useEffect(() => {
        chrome.runtime.onMessage.addListener(
            async ({ type, selection, href }, sender, respond) => {
                if (type === "get-selected-text") {
                    setSelectedText({ text: selection, href, id: uuid4() });
                }

                if (type === "save-selected-text") {
                    console.log("h", href);
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
    }, []);

    return (
        <AppContext.Provider
            value={{ tool, setTool, selectedText, setSelectedText }}
        >
            {props.children}
        </AppContext.Provider>
    );
}
