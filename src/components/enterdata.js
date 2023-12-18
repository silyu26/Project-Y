import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Enterdata(props) {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

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
              <option>Mood Morning</option>
              <option>Mood Evening</option>
              <option>Sleep length</option>
              <option>Sports activity time</option>
              <option>Sports level of effort</option>
            </Form.Control>
          </Form.Group>
          {selectedAttribute === 'Mood Morning' || selectedAttribute === 'Mood Evening' || selectedAttribute === 'Sports level of effort' ? (
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Choose between 1-10 (1 being the lowest, 10 the highest)</Form.Label>
              <Form.Control as="select" onChange={handleValueChange}>
                {[...Array(10)].map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </Form.Control>
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
      <Button onClick={() => {alert(`Upload successful!\n\nAttribute: ${selectedAttribute}\nValue: ${selectedValue}\nDate: ${startDate}`);}}>Upload</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Enterdata;