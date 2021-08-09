import React from "react";

export default function Bar({ x, y, width, height, hours, fill = "black" }) {
    return (
        <g>
            <rect x={x} y={y} width={width} height={height} fill={fill}></rect>
            <text
                x={x}
                y={y}
                dx="1.2em"
                dy=".35em"
                fill="white"
                transform={`rotate(90,${x + width / 2},${y})`}
                className="bar-text"
            >
                {hours.toFixed(1)}h
            </text>
        </g>
    );
}
