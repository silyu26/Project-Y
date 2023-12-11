// correlation.js

import Test from "../components/test"
import { Line, Scatter  } from 'react-chartjs-2';
import { Chart, registerables} from 'chart.js';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button'
Chart.register(...registerables);

const Correlation = () => {

  const [showFirstGraph, setShowFirstGraph] = useState(true);

  const dataPoints = [
    { x: 6, y: 8 },
    { x: 7, y: 9 },
    { x: 8, y: 10 },
    { x: 6.5, y: 8.4 },
    { x: 7.5, y: 9.4 },
    { x: 7.2, y: 9 },
    { x: 8, y: 10 },
    { x: 6.8, y: 8.6 },
    { x: 7.4, y: 9.2 },
    { x: 8.2, y: 10 },
    { x: 7.1, y: 8.8 },
    { x: 6.9, y: 8.2 },
    { x: 7.5, y: 9.6 },
    { x: 6.7, y: 8.6 },
    { x: 8.1, y: 9.8 },
    { x: 7.3, y: 9.2 },
    { x: 6.6, y: 8.4 },
    { x: 8.3, y: 10 },
    { x: 7.7, y: 9.4 },
    { x: 6.9, y: 8.8 },
    { x: 8.2, y: 10.6 },
    { x: 7.0, y: 9 },
    { x: 6.5, y: 8.2 },
    { x: 7.8, y: 9.8 },
    { x: 6.7, y: 8.4 },
    { x: 8.1, y: 10 },
    { x: 7.4, y: 9.6 },
    { x: 6.8, y: 8.6 },
    { x: 7.6, y: 9.4 },
    { x: 6.4, y: 8 },
  ];

  const sleepAndMoodData = {
    datasets: [
      {
        label: 'Sleep Time vs Mood',
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.4)',
        data: dataPoints,
      },
    ],
  };

  // Options for the scatter plot
  const scatterOptions = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Sleep Time (hours)',
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Mood',
        },
      },
    },
  };

  const chartData = {
    labels: dataPoints.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Sleep Time in hours',
        borderColor: 'rgba(75,192,192,1)',
        data: dataPoints.map((point) => point.x),
      },
      {
        label: 'Mood (1-10)',
        borderColor: 'rgba(255,99,132,1)',
        data: dataPoints.map((point) => point.y),
      },
    ],
  };

  // Options for the line charts
  const chartOptions = {
    scales: {
      x: [
        {
          type: 'linear',
          position: 'bottom',
        },
      ],
      y: [
        {
          type: 'linear',
          position: 'left',
        },
      ],
    },
  };

  const chartOptions2 = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Day of month',
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
  };
  const toggleGraph = () => {
    setShowFirstGraph((prev) => !prev);
  };

  return (
    <div>
      <h1>Mood and Sleep Time Correlation</h1>



      <div style={{ width: '80%', height: '80%' }}>
        <h2>Trends</h2>
        {showFirstGraph ? (
          <Line data={chartData} options={chartOptions2} />
        ) : (
          <Scatter data={sleepAndMoodData} options={scatterOptions} />
        )}
        <Button variant="outline-primary" onClick={toggleGraph}>Toggle Graph</Button>
      </div>
    </div>
  );
};

export default Correlation;