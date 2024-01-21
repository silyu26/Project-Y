import React, { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { Card } from "react-bootstrap";
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
    const [respiration, setRespiration] = useState({ id: 'respiration', label: 'Respiration', priority: 0, show: false });
    const [hydration, setHydration] = useState({ id: 'hydration', label: 'Hydration', priority: 0, show: false });
    const [temperature, setTemperature] = useState({ id: 'temperature', label: 'Temperature', priority: 0, show: false });
    const [oxygenSaturation, setOxygenSaturation] = useState({ id: '[oxygenSaturation', label: 'Oxygen Saturation', priority: 0, show: false });
    const [heartRate, setHeartRate] = useState({ id: 'heartRate', label: 'Heart Rate', priority: 0, show: false });
    const [mood, setMood] = useState({ id: 'mood', label: 'Mood', priority: 0, show: false });
    const [sleep, setSleep] = useState({ id: 'sleep', label: 'Sleep', priority: 0, show: false });
    const [sport, setSport] = useState({ id: 'sport', label: 'Sport', priority: 0, show: false });
    const [source, setSource] = useState(null);

    useEffect(() => {
        const getGoalSource = async () => {
            try {
                const goalDataset = await getSolidDataset("http://88.99.95.51:3000/test/patient/goals.json", { fetch: session.fetch });
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
                    const obj = JSON.parse(await file.text());
                    setHeartRate(obj.heartRate);
                    setHydration(obj.hydration);
                    setMood(obj.mood);
                    setOxygenSaturation(obj.oxygenSaturation);
                    setRespiration(obj.respiration);
                    setSleep(obj.sleep);
                    setSport(obj.sport);
                    setTemperature(obj.temperature);
                }
            } catch (error) {
                console.log(error)
            }
        }
        queryObj()
    }, [source, session])

    const handleSubmit = async (updatedGoals) => {
        const uri = 'http://88.99.95.51:3000/test/patient/goals.json';

        // Convert the JSON content to a Blob
        const jsonBlob = new Blob([JSON.stringify(updatedGoals)], { type: "application/json" });

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
        if (!result.destination) {
            return;
        }

        const updatedGoals = {
            'respiration': { ...respiration, priority: result.destination.index },
            'hydration': { ...hydration, priority: result.destination.index },
            'temperature': { ...temperature, priority: result.destination.index },
            'oxygenSaturation': { ...oxygenSaturation, priority: result.destination.index },
            'heartRate': { ...heartRate, priority: result.destination.index },
            'mood': { ...mood, priority: result.destination.index },
            'sleep': { ...sleep, priority: result.destination.index },
            'sport': { ...sport, priority: result.destination.index }
        };

        setRespiration(updatedGoals.respiration);
        setHydration(updatedGoals.hydration);
        setTemperature(updatedGoals.temperature);
        setOxygenSaturation(updatedGoals.oxygenSaturation);
        setHeartRate(updatedGoals.heartRate);
        setMood(updatedGoals.mood);
        setSleep(updatedGoals.sleep);
        setSport(updatedGoals.sport);

        handleSubmit(updatedGoals);
    };

    const handleCheckboxChange = (goalId) => {
        const updatedGoal = { ...getGoalState(goalId), show: !getGoalState(goalId).show };

        switch (goalId) {
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
    };

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
                {[
                    respiration, hydration, temperature,
                    oxygenSaturation, heartRate, mood, sleep, sport
                ].map((goal) => (
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
                                    {[
                                        respiration, hydration, temperature,
                                        oxygenSaturation, heartRate, mood, sleep, sport
                                    ].map((goal, index) => (
                                        <Draggable key={goal.id} draggableId={goal.id} index={index}>
                                            {(provided, snapshot) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`list-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                                >
                                                    <div>{goal.priority + 1}</div>
                                                    <div>{goal.label}</div>
                                                    <div>
                                                        <input
                                                            type="checkbox"
                                                            checked={goal.show}
                                                            onChange={() => handleCheckboxChange(goal.id)}
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
