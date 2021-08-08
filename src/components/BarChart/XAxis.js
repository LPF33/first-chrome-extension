import React from "react";

export default function XAxis({ x1, x2, y1, y2 }) {
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
        </g>
    );
}
