import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
//import { buildQuery } from "react-query-restful";
import React, { useState, useEffect } from 'react';
import {Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";




function Connectsensor(props) {

  const [data, setData] = useState([]);
    //Use Python Backend to connect Sensor
    useEffect(() => {
        fetch('http://localhost:8000')
        .then((response) => response.text())
        .then((data) => setData(data));
    }, []);
  

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Connect your sensor
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <h4>Click here to start connecting an EmotiBit?</h4>
        <div id="ob">

        <button onClick={() => (window.location.href = "" + data)}>
        Redirect
</button>



        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Connectsensor