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
                    return '#FF7C7C';
                case Status.TOO_LOW:
                    return '#6492E3';
                case Status.UNDEF:
                    return '#C3C3C3';
                default:
                    return '#60C462';
            }
        });

        const uniqueColors = Array.from(new Set(colors));
        const legendLabels = (color) => {
            switch (color) {
                case '#FF7C7C':
                    return 'Too High';
                case '#6492E3':
                    return 'Too Low';
                case '#C3C3C3':
                    return 'Missing data';
                case '#60C462':
                    return 'Normal';
                default:
                    return 'Undefined';
            }
        };

        const chartData = {
            datasets: [
                {
                    label: `Impact of ${selectedX.label} on ${selectedY.label}`,
                    data: xValues.map((timestamp, index) => ({
                        x: timestamp,
                        y: yValues[index],
                    })),
                    backgroundColor: colors,
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
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: 'black',
                        usePointStyle: true,
                        generateLabels: function (_chart) {
                            return uniqueColors.map(color => ({
                                text: legendLabels(color),
                                fillStyle: color,
                                hidden: false,
                            }));
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const timestamp = dataset[selectedY.value][context.dataIndex].timestamp;
                            return `${selectedY.value} at ${timestamp}: ${context.dataset.data[context.dataIndex].y}`;
                        },
                    },
                },
            },
        };

        const newChart = new Chart(ctx, {
            type: type.value,
            data: chartData,
            options: chartOptions,
        });

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
