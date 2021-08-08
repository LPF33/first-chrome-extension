import React from "react";

export default function Chart({children, height, width}){
    return (
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
            {children}
        </svg>
    )
}