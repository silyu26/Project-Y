import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Status } from "../../utils/normalRanges";
import Spinner from 'react-bootstrap/Spinner';

Chart.register(...registerables);


const GraphComponent = ({ dataset, selectedX, selectedY, type }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!dataset || !chartRef.current || !dataset[selectedX.value] || !dataset[selectedY.value]) {
            // Data is still loading or missing, show loading message
            return;
        }

        if (chartRef.current) {
            // If there's an existing chart, destroy it
            const existingChartInstance = Chart.getChart(chartRef.current);
            if (existingChartInstance) {
                existingChartInstance.destroy();
            }
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
                        //x: new Date(timestamp),
                        x: timestamp,
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

        const newChart = new Chart(ctx, {
            type: type.value,
            data: chartData,
            options: chartOptions,
        })

        // Make sure to clean up the chart when the component is unmounted
        return () => {
            if (newChart) {
                newChart.destroy();
            }
        };
    }, [dataset, selectedX, selectedY, type]);

    return (
        <div>
            {(!dataset || !dataset[selectedX.value] || !dataset[selectedY.value]) && <div className='text-center'><Spinner variant='info' animation="border" /><p>Fetching Data</p></div>}
            <canvas ref={chartRef} />
        </div>
    );
};

export default GraphComponent;
