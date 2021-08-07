import React, { useEffect, useState } from "react";
import "../styles/ColorPicker.css";

export default function ColorPicker() {
    const [rgbValue, setRGBValue] = useState(null);
    const [hex, setHex] = useState(null);

    useEffect(() => {
        chrome.storage.sync.get(["rgb"], ({ rgb }) => {
            setRGBValue(rgb);
            const { r, g, b } = rgb;
            setHex(
                `#${r.toString(16).padStart(2, "0")}${g
                    .toString(16)
                    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
            );
        });
    }, []);

    const selectColor = (e) => {
        const textarea = document.createElement("textarea");
        textarea.textContent = e.target.innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        console.dir(textarea);
        textarea.remove();
    };

    if (!rgbValue) {
        return (
            <div className="color-picker">
                <h1>ColorPicker</h1>
                <p>No color picked</p>
            </div>
        );
    }

    return (
        <div className="color-picker">
            <h1>ColorPicker</h1>
            <div
                id="preview"
                style={{
                    backgroundColor: `rgb(${rgbValue.r},${rgbValue.g},${rgbValue.b})`,
                }}
            ></div>
            <p
                onClick={selectColor}
            >{`rgb(${rgbValue.r},${rgbValue.g},${rgbValue.b})`}</p>
            <p onClick={selectColor}>{hex}</p>
        </div>
    );
}
