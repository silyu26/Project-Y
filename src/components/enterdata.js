import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import { getSolidDataset, saveSolidDatasetAt, createThing, addStringNoLocale, setThing, createSolidDataset } from '@inrupt/solid-client';

const template = `

@prefix fhir: <http://hl7.org/fhir/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

# - resource -------------------------------------------------------------------

 a fhir:ValueSet ;
  fhir:nodeRole fhir:treeRoot ;
  fhir:id [ fhir:v "pcd-sleep-observation-code"] ; # 
  fhir:text [
fhir:status [ fhir:v "generated" ] ;
fhir:div "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p>This value set includes codes based on the following rules:</p><ul><li>Include these codes as defined in <a href=\"http://loinc.org\"><code>http://loinc.org</code></a><table class=\"none\"><tr><td style=\"white-space:nowrap\"><b>Code</b></td><td><b>Display</b></td></tr><tr><td><a href=\"https://loinc.org/93831-6/\">93831-6</a></td><td>Deep sleep duration</td></tr><tr><td><a href=\"https://loinc.org/93830-8/\">93830-8</a></td><td>Light sleep duration</td></tr><tr><td><a href=\"https://loinc.org/93829-0/\">93829-0</a></td><td>REM sleep duration</td></tr><tr><td><a href=\"https://loinc.org/93832-4/\">93832-4</a></td><td>Sleep duration</td></tr></table></li><li>Include these codes as defined in <a href=\"http://www.snomed.org/\"><code>http://snomed.info/sct</code></a><table class=\"none\"><tr><td style=\"white-space:nowrap\"><b>Code</b></td><td><b>Display</b></td></tr><tr><td><a href=\"http://snomed.info/id/258158006\">258158006</a></td><td>Sleep, function (observable entity)</td></tr></table></li></ul></div>"
  ] ; # 
  fhir:url [ fhir:v "https://open-health-manager.github.io/standard-patient-health-record-ig/ValueSet/pcd-sleep-observation-code"^^xsd:anyURI] ; # 
  fhir:version [ fhir:v "0.4.4"] ; # 
  fhir:name [ fhir:v "PCDSleepObservationCode"] ; # 
  fhir:title [ fhir:v "Patient contributed data: sleep observation code"] ; # 
  fhir:status [ fhir:v "draft"] ; # 
  fhir:date [ fhir:v "2023-12-08T19:54:19+00:00"^^xsd:dateTime] ; # 
  fhir:publisher [ fhir:v "MITRE"] ; # 
  fhir:contact ( [
fhir:name [ fhir:v "MITRE" ] ;
    ( fhir:telecom [
fhir:system [ fhir:v "url" ] ;
fhir:value [ fhir:v "https://open-health-manager.github.io/standard-patient-health-record-ig" ]     ] )
  ] ) ; # 
  fhir:description [ fhir:v "This value set includes codes to track patient sleep recorded by device or app"] ; # 
  fhir:compose [
    ( fhir:include [
fhir:system [ fhir:v "http://loinc.org"^^xsd:anyURI ] ;
      ( fhir:concept [
fhir:code [ fhir:v "93831-6" ] ;
fhir:display [ fhir:v "Deep sleep duration" ]       ] [
fhir:code [ fhir:v "93830-8" ] ;
fhir:display [ fhir:v "Light sleep duration" ]       ] [
fhir:code [ fhir:v "93829-0" ] ;
fhir:display [ fhir:v "REM sleep duration" ]       ] [
fhir:code [ fhir:v "93832-4" ] ;
fhir:display [ fhir:v "Sleep duration" ]       ] )     ] [
fhir:system [ fhir:v "http://snomed.info/sct"^^xsd:anyURI ] ;
      ( fhir:concept [
fhir:code [ fhir:v "258158006" ] ;
fhir:display [ fhir:v "Sleep, function (observable entity)" ]       ] )     ] )
  ] . # 


  `

const solidURL = process.env.REACT_APP_SERVER_URL;

async function createTTLFile(selectedAttribute, startDate, selectedValue, solidPodURL) {
    // Define the file URL
    const fileURL = `${solidPodURL}manual/${selectedAttribute}/${startDate}.ttl`;

    // Create a new Thing for the content
    let myThing = createThing({ name: "myData" });
    myThing = addStringNoLocale(myThing, "http://schema.org/text", selectedValue);

    // Create a new dataset and add the Thing to it
    let myDataset = createSolidDataset();
    myDataset = setThing(myDataset, myThing);

    // Save the dataset back to the Pod
    await saveSolidDatasetAt(fileURL, myDataset, { fetch: fetch.bind(window) });
}


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
      <Button onClick={() => {createTTLFile(selectedAttribute, startDate.toDateString() , selectedValue, solidURL)
        .then(() => console.log("File created successfully"))
        .catch(err => console.error(err));
        alert("File created successfully with the following data: " + selectedAttribute + " " + startDate.toDateString() + " " + selectedValue);
        }}>Upload</Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Enterdata;