chrome.commands.onCommand.addListener((command) => {
    console.log("command ", command);
    if (command === "save-snippet") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: {
                    tabId: tabs[0].id,
                },
                function: function () {
                    const selection = `${window.getSelection()}`;
                    chrome.runtime.sendMessage({
                        type: "save-selected-text",
                        selection: selection.trim(),
                        href: window.location.href,
                    });
                },
            });
        });
    }
});
