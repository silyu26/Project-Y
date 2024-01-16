import React, { useEffect, useState } from "react";
import { Container, Row, Modal } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "./goal.css"

const initialItems = [
    { id: 0, text: 'Movement', priority: 0, show: false },
    { id: 1, text: 'Respiration', priority: 0, show: false },
    { id: 2, text: 'Hydration', priority: 0, show: false },
    { id: 3, text: 'Body Temperature', priority: 0, show: false },
    { id: 4, text: 'Oxygen Saturation', priority: 0, show: false },
    { id: 5, text: 'Heart Rate', priority: 0, show: false },
    { id: 6, text: 'Temperature', priority: 0, show: false },
    { id: 7, text: 'Mood', priority: 0, show: false },
    { id: 8, text: 'Sleep', priority: 0, show: false },
    { id: 9, text: 'Sport', priority: 0, show: false },
];

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

const GoalComponent = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [items, setItems] = useState(initialItems);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const newItems = Array.from(items);
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);

        const updatedItems = newItems.map((item, index) => ({
            ...item,
            priority: index,
        }));

        setItems(updatedItems);
    };

    const handleCheckboxChange = (itemId) => {
        const updatedItems = items.map((item) =>
            item.id === itemId ? { ...item, show: !item.show } : item
        );

        setItems(updatedItems);
    };

    return (
        <Container>
            <MdEdit onClick={openModal} style={{ cursor: 'pointer', margin: '10px', marginLeft: 'auto' }} />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {items.map((item) => (
                    item.show && (
                        <Card key={item.id} style={{ width: '14rem', margin: '10px' }} className="text-center">
                            <Card.Body>
                                <Card.Title>{item.text}</Card.Title>
                                <hr />
                                <Card.Text>{getDescription(item.text)}</Card.Text>
                            </Card.Body>
                        </Card>
                    )
                ))}
            </div>



            <Modal show={modalOpen} onHide={closeModal} size="md">
                <Modal.Header closeButton>
                    <Modal.Title>Change your goals</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <ul {...provided.droppableProps} ref={provided.innerRef} className="draggable-list">
                                    <li className="list-header">
                                        <div>Priority</div>
                                        <div>Item</div>
                                        <div>Show</div>
                                    </li>
                                    {items.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`list-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                                >
                                                    <div>{item.priority + 1}</div>
                                                    <div>{item.text}</div>
                                                    <div>
                                                        <input
                                                            type="checkbox"
                                                            checked={item.show}
                                                            onChange={() => handleCheckboxChange(item.id)}
                                                        />
                                                    </div>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GoalComponent;
