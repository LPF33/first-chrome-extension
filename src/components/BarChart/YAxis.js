import React from "react";

export default function YAxis({ x1, x2, y1, y2, interval, height }) {
    const yInterval = Math.round(height / (interval * 2));

    return (
        <g>
            <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="white"
                stroke-width="5"
            ></line>
            {new Array(yInterval).fill("").map((item, index) => {
                return (
                    <text
                        x={16}
                        y={height - interval * 2 * index}
                        fill="white"
                        text-anchor="end"
                    >
                        {index * 2}
                    </text>
                );
            })}
        </g>
    );
}
