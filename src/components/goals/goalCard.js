import React, { useState, useEffect } from "react";
import { Modal, Card } from "react-bootstrap";
import { Carousel } from "react-bootstrap";

import GraphComponent from "../correlations/graph";
import { findCorrelationsFromData } from "../correlations/suggestion";
import { SuggestionComponent } from "../correlations/suggestion";
import "./goal.css";

const getDescription = (attribute) => {
    switch (attribute) {
        case 'Movement':
            return 'Engaging in physical activity is essential for overall well-being.';
        case 'Respiration':
            return 'Maintaining a healthy breathing pattern is important for respiratory health.';
        case 'Hydration':
            return 'Staying well-hydrated is crucial for various bodily functions.';
        case 'Body Temperature':
            return 'Maintaining a normal body temperature is crucial for physiological processes.';
        case 'Oxygen Saturation':
            return 'Adequate oxygen saturation levels are essential for proper organ function.';
        case 'Heart Rate':
            return 'A healthy heart rate depends on factors such as age, fitness level, and health conditions.';
        case 'Temperature':
            return 'Monitoring body temperature is important for detecting signs of illness or infection.';
        case 'Mood':
            return 'Paying attention to mood helps in managing stress and mental well-being.';
        case 'Sleep':
            return 'Quality sleep is crucial for overall health and cognitive function.';
        case 'Sport':
            return 'Engaging in sports activities contributes to physical fitness and mental well-being.';
        default:
            return '';
    }
};

const getDisplayForGraph = (key) => {
    switch (key) {
        case 'respiration':
            return { value: 'respiration', label: 'Respiration' };
        case 'hydration':
            return { value: 'hydration', label: 'Hydration' };
        case 'temperature':
            return { value: 'temperature', label: 'Temperature' };
        case 'oxygen saturation':
            return { value: 'oxygen saturation', label: 'Oxygen Saturation' };
        case 'heart rate':
            return { value: 'heart rate', label: 'Heart Rate' };
        case 'mood':
            return { value: 'mood', label: 'Mood' };
        case 'sleep':
            return { value: 'sleep', label: 'Sleep' };
        case 'sport':
            return { value: 'sport', label: 'Sport' };
        default:
            return null;

    }
}

const GoalCard = ({ goal, healthData }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [correlation, setCorrelation] = useState(null);
    const [available, setAvailable] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        if (available) {
            return;
        }
        if (healthData.hasOwnProperty(goal.id)) {
            setAvailable(true);
        }

    }, [healthData, available]);

    useEffect(() => {
        if (!available) {
            return;
        }
        setCorrelation(findCorrelationsFromData(healthData, goal.id));
    }, [healthData, available, goal]);

    return (
        <div>
            <Card key={goal.id} style={{ width: '14rem', margin: '10px' }} className="text-center" onClick={openModal}>
                <Card.Body>
                    <Card.Title>{goal.label}</Card.Title>
                    <hr />
                    <Card.Text>{getDescription(goal.label)}</Card.Text>
                </Card.Body>
            </Card>

            <Modal show={modalOpen} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{goal.label} Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel data-bs-theme="dark" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                        {correlation &&
                            correlation.map((item, index) => (
                                <Carousel.Item key={index}>
                                    <div style={{ padding: '0px 100px 50px 100px' }}>
                                        <h5>Correlation with {item.affectingCriterionKey}:</h5>
                                        <SuggestionComponent corrcoeff={item.correlationCoefficient} affectingCriteria={item.affectingCriterionKey} affectedCriteria={item.affectedCriterionKey} trendOfAbnormal={item.finalAbnormalStatus} />

                                        <GraphComponent
                                            dataset={healthData}
                                            selectedX={getDisplayForGraph(item.affectingCriterionKey)}
                                            selectedY={getDisplayForGraph(goal.id)}
                                            type={{ value: 'scatter', label: 'Scatter' }}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </Carousel.Item>
                            ))}
                    </Carousel>
                </Modal.Body>

            </Modal>
        </div>
    );
};

export default GoalCard;
