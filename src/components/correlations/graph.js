import React, { useEffect, useRef } from 'react';
import { Chart, registerables} from 'chart.js';
import { Status } from './normalRanges';

Chart.register(...registerables);


const GraphComponent = ({ dataset, selectedX, selectedY, type }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        console.log("Graph component is called");
        console.log(dataset);
        console.log(selectedX);
        console.log(selectedY);
        if (!dataset || !chartRef.current || !dataset[selectedX.value] || !dataset[selectedY.value]) {
            // Data is still loading or missing, show loading message
            return;
        }

        const ctx = chartRef.current.getContext('2d');

        // Extract x and y values based on the selectedX and selectedY keys
        const xValues = dataset[selectedX.value].map((entry) => entry.value);
        const yValues = dataset[selectedY.value].map((entry) => entry.value);

        // Map status to color
        const colors = dataset[selectedY.value].map((entry) => {
            switch (entry.abnormal) {
                case Status.TOO_HIGH:
                    return 'red';
                case Status.TOO_LOW:
                    return 'blue';
                default:
                    return 'green';
            }
        });


        const chartData = {
            datasets: [
                {
                    label: `Impact of ${selectedX.label} on ${selectedY.label}`,
                    data: xValues.map((timestamp, index) => ({
                        x: new Date(timestamp),
                        y: yValues[index],
                        backgroundColor: colors[index],
                    })),
                },
            ],
        };

        const chartOptions = {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: selectedX.label,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: selectedY.label,
                    },
                },
            },
        };

        new Chart(ctx, {
            type: type.value,
            data: chartData,
            options: chartOptions,
        });
    }, [dataset, selectedX, selectedY, type]);

    return (
        <div>
            {(!dataset || !dataset[selectedX.value] || !dataset[selectedY.value]) && <p>Data is loading...</p>}
            <canvas ref={chartRef} />
        </div>
    );
};

export default GraphComponent;
