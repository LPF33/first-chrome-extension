chrome.commands.onCommand.addListener(async (command) => {
    console.log(command);
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    if (!tabs.length) {
        return;
    }
    if (command === "save-snippet") {
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
    }

    if (command === "pick-color") {
        chrome.scripting.executeScript({
            target: {
                tabId: tabs[0].id,
            },
            function: getPickedColor,
        });
    }
});

async function getPickedColor() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const videoElem = document.createElement("video");

    try {
        const captureStream = await navigator.mediaDevices.getDisplayMedia();
        let { width, height } = captureStream.getTracks()[0].getSettings();
        canvas.width = width;
        canvas.height = height;
        videoElem.autoplay = true;
        videoElem.srcObject = captureStream;
        videoElem.addEventListener("loadeddata", () => {
            if (videoElem.readyState === 4) {
                setTimeout(getScreenShot, 200, captureStream, width, height);
            }
        });
    } catch (err) {
        console.error("Error: " + err);
    }

    function getScreenShot(captureStream, width, height) {
        ctx.drawImage(videoElem, 0, 0, width, height);
        captureStream.getTracks().forEach((track) => track.stop());
        document.body.addEventListener(
            "mousedown",
            (e) => getRGBValue(e, ctx),
            { once: true, capture: true, passive: false }
        );
    }

    function getRGBValue(e, ctx) {
        e.preventDefault();
        e.stopPropagation();
        const imageData = ctx.getImageData(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );
        const rgb = { r: 0, g: 0, b: 0 };

        const [red, green, blue] = getColorIndicesForCoord(
            e.x,
            e.y + window.screen.availHeight - window.innerHeight,
            ctx.canvas.width
        );
        rgb.r = imageData.data[red];
        rgb.g = imageData.data[green];
        rgb.b = imageData.data[blue];
        chrome.storage.sync.set({ rgb });
    }
    function getColorIndicesForCoord(x, y, width) {
        var red = y * (width * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
    }
}
