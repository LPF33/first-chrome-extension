import React from "react";

export default function YAxis({
    x1,
    x2,
    y1,
    y2,
    interval,
    height,
    heighestTime,
}) {
    const yAxisProperties = Math.ceil(heighestTime / 5);
    const yInterval = Math.ceil(height / (interval * yAxisProperties));

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
                        y={height - interval * yAxisProperties * index}
                        fill="white"
                        text-anchor="end"
                        key={index}
                    >
                        {index * yAxisProperties}
                    </text>
                );
            })}
        </g>
    );
}
