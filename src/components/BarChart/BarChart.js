import React from "react";
import Chart from "./Chart";
import Bar from "./Bar";
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import { v4 as uuid } from "uuid";
import "../../styles/BarChart.css";

const heighestTimeFunc = (times) =>
    milliSecondsToHours(
        times.reduce((acc, cur) => (acc > cur ? acc : cur), -Infinity)
    );

const milliSecondsToHours = (milli) => {
    return milli / 1000 / 3600;
};

export default function BarChart({ data }) {
    const marginLeft = 20;
    const barWidth = 20;
    const barMargin = 2;
    const width = data.length * (barWidth + barMargin) + marginLeft;
    const height = 190;
    const heighestTime = heighestTimeFunc(
        data.map((item) => Math.max(item.times.coding, item.times.sport))
    );
    const heightPerHour = height / heighestTime;

    return (
        <Chart width={width} height={height} class="barchart">
            <XAxis
                x1={marginLeft}
                y1={height}
                x2={width + marginLeft}
                y2={height}
            />
            <YAxis
                x1={marginLeft}
                y1={0}
                x2={marginLeft}
                y2={height}
                height={height}
                interval={heightPerHour}
                heighestTime={heighestTime}
            />
            {data.map((item, index) => {
                const sportHours = milliSecondsToHours(item.times.sport);
                const codingHours = milliSecondsToHours(item.times.coding);
                const max = Math.max(sportHours, codingHours);
                const min = Math.min(sportHours, codingHours);
                return (
                    <g key={uuid()}>
                        <Bar
                            key={uuid()}
                            x={marginLeft + 5 + index * (barWidth + barMargin)}
                            y={height - max * heightPerHour - 5}
                            width={barWidth}
                            height={max * heightPerHour}
                            hours={max}
                            fill={codingHours > sportHours ? "blue" : "green"}
                        />
                        <Bar
                            key={uuid()}
                            x={marginLeft + 5 + index * (barWidth + barMargin)}
                            y={height - min * heightPerHour - 5}
                            width={barWidth}
                            height={min * heightPerHour}
                            hours={min}
                            fill={codingHours > sportHours ? "green" : "blue"}
                        />
                    </g>
                );
            })}
        </Chart>
    );
}
