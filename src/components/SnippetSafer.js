import React, { useContext, useEffect } from "react";
import { GiSafetyPin } from "react-icons/gi";
import { RiSafe2Fill } from "react-icons/ri";
import { FcDeleteDatabase } from "react-icons/fc";
import "../styles/SnippetSafer.css";
import { AppContext } from "../context/AppContext";

const queryOptions = { active: true, currentWindow: true };

export default function SnippetSafer() {
    const { selectedText, setSelectedText } = useContext(AppContext);

    useEffect(() => {
        chrome.tabs &&
            chrome.tabs.query(queryOptions, (tabs) => {
                chrome.scripting.executeScript({
                    target: {
                        tabId: tabs[0].id,
                    },
                    function: function () {
                        const selection = `${window.getSelection()}`;
                        chrome.runtime.sendMessage(
                            {
                                type: "get-selected-text",
                                selection: selection.trim(),
                                href: window.location.href,
                            },
                            () => {
                                console.log(selection);
                            }
                        );
                    },
                });
            });

        // eslint-disable-next-line
    }, []);

    const safeSnippet = () => {
        chrome &&
            chrome.storage.sync.get(["snippets"], ({ snippets = [] }) => {
                snippets.push({ ...selectedText });
                chrome.storage.sync.set({ snippets });
                setSelectedText({ text: "", href: "" });
            });
    };

    const showSnippet = () => {
        chrome.storage.sync.get(["snippets"], async ({ snippets }) => {
            if (snippets && snippets.length) {
                let url = chrome.runtime.getURL("assets/snippets_page.html");
                const tab = await chrome.tabs.create({ url });
                chrome.runtime.sendMessage({
                    type: "show-snippets",
                    tabId: tab.id,
                });
            }
        });
    };

    const deleteStorage = () => {
        chrome.storage.sync.remove(["snippets"]);
    };

    if (!selectedText.text) {
        return (
            <div className="snippet-safer">
                <h1>Show Snippets</h1>
                <button onClick={showSnippet}>
                    <RiSafe2Fill />
                </button>
                <button onClick={deleteStorage}>
                    <FcDeleteDatabase />
                </button>
            </div>
        );
    }

    return (
        <div className="snippet-safer">
            <h1>Safe Snippet?</h1>
            <h5>{selectedText.href}</h5>
            <blockquote>{selectedText.text}</blockquote>
            <button onClick={safeSnippet}>
                <GiSafetyPin />
            </button>
        </div>
    );
}
