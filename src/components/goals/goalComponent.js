import React, { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "./goal.css"
import { getSolidDataset } from "@inrupt/solid-client"
import { overwriteFile } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { getFile } from "@inrupt/solid-client";
import GoalCard from "./goalCard";



const GoalComponent = ({ healthData }) => {
    const { session } = useSession();
    const [modalOpen, setModalOpen] = useState(false);
    const [respiration, setRespiration] = useState({ id: 'respiration', label: 'Respiration', priority: 0, show: true });
    const [hydration, setHydration] = useState({ id: 'hydration', label: 'Hydration', priority: 1, show: true });
    const [temperature, setTemperature] = useState({ id: 'temperature', label: 'Temperature', priority: 2, show: true });
    const [oxygenSaturation, setOxygenSaturation] = useState({ id: '[oxygenSaturation', label: 'Oxygen Saturation', priority: 3, show: true });
    const [heartRate, setHeartRate] = useState({ id: 'heartRate', label: 'Heart Rate', priority: 4, show: true });
    const [mood, setMood] = useState({ id: 'mood', label: 'Mood', priority: 5, show: true });
    const [sleep, setSleep] = useState({ id: 'sleep', label: 'Sleep', priority: 6, show: true });
    const [sport, setSport] = useState({ id: 'sport', label: 'Sport', priority: 7, show: true });
    const [source, setSource] = useState(null);

    const [goals, setGoals] = useState([
        respiration, hydration, temperature, oxygenSaturation, heartRate, mood, sleep, sport
    ]);

    const goalIds = ['respiration', 'hydration', 'temperature', 'oxygenSaturation', 'heartRate', 'mood', 'sleep', 'sport'];

    useEffect(() => {
        const getGoalSource = async () => {
            try {
                const goalDataset = await getSolidDataset(`${process.env.REACT_APP_SERVER_URL}/goals/goals.json`, { fetch: session.fetch });
                // Check if the file exists before updating the state
                if (goalDataset) {
                    setSource(goalDataset.uri);
                }
            } catch (error) {
                console.log("error!", error);
            }
        };
        getGoalSource();
    }, [session]);

    useEffect(() => {
        const queryObj = async () => {
            try {
                if (source.length > 0) {
                    const file = await getFile(source, { fetch: session.fetch });

                    if (file) {
                        const obj = JSON.parse(await file.text());

                        // Update each goal state only if the corresponding property exists in the loaded JSON
                        goalIds.forEach((goalId) => {
                            if (obj.hasOwnProperty(goalId)) {
                                const updatedGoal = { ...getGoalState(goalId), ...obj[goalId] };
                                setGoalState(updatedGoal);
                            }
                        });
                    } else {
                        // If the file doesn't exist, set default initial values for each goal
                        goalIds.forEach((goalId) => {
                            const defaultGoal = { id: goalId, label: getDefaultLabel(goalId), priority: 0, show: false }; // Adjust the default values
                            setGoalState(defaultGoal);
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        queryObj();
    }, [source, session]);

    const handleSubmit = async () => {
        const goalsObject = goals.reduce((acc, goal) => {
            acc[goal.id] = goal;
            return acc;
        }, {});

        const uri = `${process.env.REACT_APP_SERVER_URL}/goals/goals.json`;

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
        if (!result.destination) return; // Dragged outside the list

        const updatedGoals = [...goals];
        const [movedGoal] = updatedGoals.splice(result.source.index, 1);
        updatedGoals.splice(result.destination.index, 0, movedGoal);

        setGoals(updatedGoals);
        goals.forEach((goal) => {
            setGoalState(goal);
        });
        handleSubmit();
    };

    const getDefaultLabel = (goalId) => {
        switch (goalId) {
            case 'respiration':
                return 'Respiration';
            case 'hydration':
                return 'Hydration';
            case 'temperature':
                return 'Temperature';
            case 'oxygenSaturation':
                return 'Oxygen Saturation';
            case 'heartRate':
                return 'Heart Rate';
            case 'mood':
                return 'Mood';
            case 'sleep':
                return 'Sleep';
            case 'sport':
                return 'Sport';
            default:
                return '';
        }
    }

    const handleCheckboxChange = (goalId, event) => {
        const updatedGoal = getGoalState(goalId);

        if (updatedGoal) {
            updatedGoal.show = event.target.checked;
            setGoalState(updatedGoal);
            handleSubmit();
        } else {
            console.error(`Goal with id ${goalId} not found.`);
        }
    };

    const setGoalState = (updatedGoal) => {
        switch (updatedGoal.id) {
            case 'respiration':
                setRespiration(updatedGoal);
                break;
            case 'hydration':
                setHydration(updatedGoal);
                break;
            case 'temperature':
                setTemperature(updatedGoal);
                break;
            case 'oxygenSaturation':
                setOxygenSaturation(updatedGoal);
                break;
            case 'heartRate':
                setHeartRate(updatedGoal);
                break;
            case 'mood':
                setMood(updatedGoal);
                break;
            case 'sleep':
                setSleep(updatedGoal);
                break;
            case 'sport':
                setSport(updatedGoal);
                break;
            default:
                break;
        }
    }


    const getGoalState = (goalId) => {
        switch (goalId) {
            case 'respiration':
                return respiration;
            case 'hydration':
                return hydration;
            case 'temperature':
                return temperature;
            case 'oxygenSaturation':
                return oxygenSaturation;
            case 'heartRate':
                return heartRate;
            case 'mood':
                return mood;
            case 'sleep':
                return sleep;
            case 'sport':
                return sport;
            default:
                return null;
        }
    };

    return (
        <Container>
            <MdEdit onClick={openModal} style={{ cursor: 'pointer', margin: '10px', marginLeft: 'auto' }} />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {goals.map((goal) => (
                    goal.show && (
                        <GoalCard key={goal.id} goal={goal} healthData={healthData} />
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
