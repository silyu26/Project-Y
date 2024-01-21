import React, { useState, useEffect } from "react";
import { Card, Modal, Accordion, CardGroup } from "react-bootstrap";
import GraphComponent from "../correlations/graph";
import { generateSuggestion } from "../correlations/suggestion";
import { Status } from "../correlations/normalRanges";
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import jstat from 'jstat';

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

const GoalCard = ({ goal, healthData }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [correlation, setCorrelation] = useState(null);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        const correlations = [];

        Object.entries(healthData).map(([affectingCriterionKey, affectingCriterion]) => {
            Object.entries(healthData).map(([affectedCriterionKey, affectedCriterion]) => {
                if (affectingCriterionKey === affectedCriterionKey || affectedCriterionKey !== goal.id) {
                    return;
                }

                const abnormalValues = [].concat(...Object.values(affectedCriterion).map(entry => entry.abnormal));
                const tooHighCount = abnormalValues.filter(status => status === Status.TOO_HIGH).length;
                const tooLowCount = abnormalValues.filter(status => status === Status.TOO_LOW).length;

                const finalAbnormalStatus =
                    tooHighCount.length > 2 && tooLowCount > 2
                        ? 'unstable'
                        : tooHighCount > 2
                            ? 'too high'
                            : tooLowCount > 2
                                ? 'too low'
                                : 'normal';

                const affectingValues = [].concat(...Object.values(affectingCriterion).map(entry => entry.value));
                const affectedValues = [].concat(...Object.values(affectedCriterion).map(entry => entry.value));
                const correlationCoefficient = jstat.corrcoeff(affectingValues, affectedValues);

                const suggestions = generateSuggestion(
                    correlationCoefficient,
                    affectingCriterionKey,
                    affectedCriterionKey,
                    finalAbnormalStatus
                );

                correlations.push({
                    affectingCriterionKey,
                    correlationCoefficient,
                    suggestions,
                });
            });
        });

        setCorrelation(correlations);
    }, [healthData]);

    return (
        <>
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
                    <Accordion>
                        {correlation && correlation.map((correlationItem, index) => (
                            <Card key={index}>
                                <Accordion.Toggle as={Card.Header} eventKey={index}>
                                    {correlationItem.affectingCriterionKey} - Correlation: {correlationItem.correlationCoefficient.toFixed(2)}
                                    {index === 0 ? <FaAngleUp /> : <FaAngleDown />}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey={index}>
                                    <Card.Body>
                                        <GraphComponent
                                            dataset={healthData}
                                            selectedX={correlationItem.affectingCriterionKey}
                                            selectedY={goal.id}
                                            type={'scatter'}
                                        />
                                        <ul>
                                            {correlationItem.suggestions.map((suggestion, i) => (
                                                <li key={i}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        ))}
                    </Accordion>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default GoalCard;
