import React, { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "./goal.css"
import { overwriteFile } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { getFile } from "@inrupt/solid-client";
import GoalCard from "./goalCard";



const GoalComponent = ({ healthData }) => {
    const { session } = useSession();
    const [modalOpen, setModalOpen] = useState(false);
    const [hydration, setHydration] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [heartRate, setHeartRate] = useState(null);
    const [mood, setMood] = useState(null);
    const [sleep, setSleep] = useState(null);
    const [sportTime, setSportTime] = useState(null);
    const [sportLevel, setSportLevel] = useState(null);
    const [initiated, setInitiated] = useState(false);
    const goalIds = ['hydration', 'temperature', 'heart rate', 'mood', 'sleep', 'sport time', 'sport level'];
    const getDefaultLabel = (goalId) => {
        switch (goalId) {
            case 'hydration':
                return 'Hydration';
            case 'temperature':
                return 'Temperature';
            case 'heart rate':
                return 'Heart Rate';
            case 'mood':
                return 'Mood';
            case 'sleep':
                return 'Sleep';
            case 'sport time':
                return 'Sport Time';
            case 'sport level':
                return 'Sport Intensity';
            default:
                return '';
        }
    }
    const [goals, setGoals] = useState(goalIds.map((goalId, index) => ({
        id: goalId,
        label: getDefaultLabel(goalId),
        priority: index,
        show: true
    })));


    useEffect(() => {
        if (initiated) {
            return;
        }
        const queryObj = async () => {
            const file = await getFile(`${process.env.REACT_APP_SERVER_URL2}goal2/goals.json`, { fetch: session.fetch });
            if (file) {
                const obj = JSON.parse(await file.text());
                setGoals(Object.values(obj));
                goalIds.forEach((goalId) => {
                    if (obj.hasOwnProperty(goalId)) {
                        setGoalState(obj[goalId], false, false);
                    }
                });
            }
        };
        queryObj();
        setInitiated(true);
    }, [session, initiated]);

    const handleSubmit = async () => {
        const goalsObject = goals.reduce((acc, goal) => {
            acc[goal.id] = { ...goal }; // Create a shallow copy of the goal object
            return acc;
        }, {});

        const uri = `${process.env.REACT_APP_SERVER_URL2}goal2/goals.json`;

        // Convert the JSON content to a Blob
        const jsonBlob = new Blob([JSON.stringify(goalsObject)], { type: "application/json" });

        // Create a File from the Blob with a .json extension
        const jsonFile = new File([jsonBlob], "goals.json", { type: "application/json" });

        // Overwrite the JSON file in the Solid Pod
        const savedFile = await overwriteFile(
            uri,
            jsonFile,
            { contentType: "application/json", fetch: session.fetch }
        );
    };

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const onDragEnd = (result) => {
        if (!result.destination) { return; }
        const updatedGoals = goals;
        const [movedGoal] = goals.splice(result.source.index, 1);
        updatedGoals.splice(result.destination.index, 0, movedGoal);
        updatedGoals.forEach((goal, index) => {
            goal.priority = index;
            setGoalState(goal, true, true);
        });
        handleSubmit();
    };



    const handleCheckboxChange = (goalId, event) => {
        const updatedGoal = getGoalState(goalId);
        if (updatedGoal) {
            updatedGoal.show = event.target.checked;
            setGoalState(updatedGoal, false, true);
            handleSubmit();
        } else {
            console.error(`Goal with id ${goalId} not found.`);
        }
    };

    const setGoalState = (goal, sort, updateGoals) => {
        switch (goal.id) {
            case 'hydration':
                setHydration(goal);
                break;
            case 'temperature':
                setTemperature(goal);
                break;
            case 'heart rate':
                setHeartRate(goal);
                break;
            case 'mood':
                setMood(goal);
                break;
            case 'sleep':
                setSleep(goal);
                break;
            case 'sport time':
                setSportTime(goal);
                break;
            case 'sport level':
                setSportLevel(goal);
                break;
            default:
                break;
        }
        if (updateGoals) {
            const updatedGoals = goals.map((g) => (g.id == goal.id ? goal : g));
            if (sort) {
                updatedGoals.sort((a, b) => a.priority - b.priority);
            }
            setGoals(updatedGoals);
        }

    };


    const getGoalState = (goalId) => {
        switch (goalId) {
            case 'hydration':
                return hydration;
            case 'temperature':
                return temperature;
            case 'heart rate':
                return heartRate;
            case 'mood':
                return mood;
            case 'sleep':
                return sleep;
            case 'sport time':
                return sportTime;
            case 'sport level':
                return sportLevel;
            default:
                return null;
        }
    };

    return (
        <Container>
            <MdEdit onClick={openModal} style={{ cursor: 'pointer', margin: '10px', marginLeft: 'auto' }} />
            {initiated ? (
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {goals.map((goal) => (
                        goal.show && (
                            <GoalCard key={goal.id} goal={goal} healthData={healthData} />
                        )
                    ))}
                </div>
            ) : (
                // Render a loading icon or message here
                <div>Loading...</div>
            )}
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
                                    {goals.map((goal, index) => (
                                        <Draggable key={goal.id} draggableId={goal.id} index={index}>
                                            {(provided, snapshot) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`list-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                                >
                                                    <div>{index + 1}</div>
                                                    <div>{goal.label}</div>
                                                    <div>
                                                        <input
                                                            type="checkbox"
                                                            checked={goal.show}
                                                            onChange={(event) => handleCheckboxChange(goal.id, event)}
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
