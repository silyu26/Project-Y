import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { useSession } from "@inrupt/solid-ui-react";
import { overwriteFile } from "@inrupt/solid-client";
import { format } from "date-fns";


const solidURL = process.env.REACT_APP_FHIR_DATA_URL;


function Enterdata(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const { session } = useSession();

  async function handleUpload(selectedAttribute, startDate, selectedValue, solidPodURL) {
    // Define the file URL
    const fileURL = `${solidPodURL}${startDate}/manual/${selectedAttribute}.json`;
    const jsonBlob = new Blob([JSON.stringify({ id: selectedAttribute, value: selectedValue, timestamp: startDate })], { type: "application/json" });
    const jsonFile = new File([jsonBlob], "goals.json", { type: "application/json" });

    // Overwrite the JSON file in the Solid Pod
    await overwriteFile(
      fileURL,
      jsonFile,
      { contentType: "application/json", fetch: session.fetch }
    );
  }

  const handleAttributeChange = (event) => {
    setSelectedAttribute(event.target.value);
  };
  const handleValueChange = (event) => {
    setSelectedValue(event.target.value);
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Enter your data
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Which data would you like to add?</h4>
        <p>
          Here you will be able to enter your data.
        </p>
        <Form>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Attribute</Form.Label>
            <Form.Control as="select" custom onChange={handleAttributeChange}>
              <option>Choose Attribute</option>
              <option>Mood Morning</option>
              <option>Mood Evening</option>
              <option>Sleep length</option>
              <option>Sports activity time</option>
              <option>Sports level of effort</option>
            </Form.Control>
          </Form.Group>
          {selectedAttribute === 'Mood Morning' || selectedAttribute === 'Mood Evening' || selectedAttribute === 'Sports level of effort' ? (
            // ...

            <Form.Group controlId="exampleForm.ControlSlider1">
              <Form.Label>Choose between 1-10 (1 being the lowest, 10 the highest)</Form.Label>
              <RangeSlider
                value={selectedValue}
                onChange={handleValueChange}
                min={1}
                max={10}
              />
            </Form.Group>
          ) : (
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Enter the time in minutes</Form.Label>
              <Form.Control type="number" onChange={handleValueChange} />
            </Form.Group>
          )}
          <Form.Group controlId="exampleForm.DatePicker">
            <Form.Label>Date</Form.Label>
          </Form.Group>
          <Form.Group>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          handleUpload(selectedAttribute, format(startDate, "yyyy-MM-dd"), selectedValue, solidURL)
            .then(() => console.log("File created successfully"))
            .catch(err => console.error(err));
          alert(selectedAttribute + " of " + selectedValue + " on date " + format(startDate, "yyyy-MM-dd") + " is stored successfully!");
        }}>Upload</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Enterdata;