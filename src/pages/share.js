// share.js
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner, Toast, ToastContainer, Form } from 'react-bootstrap';
import { useSession } from '@inrupt/solid-ui-react';
import { fetch } from '@inrupt/solid-client-authn-browser';
import { getSolidDatasetWithAcl, getSolidDataset, hasResourceAcl, createAclFromFallbackAcl,
   isContainer, saveAclFor, overwriteFile, setAgentResourceAccess,
   hasFallbackAcl, getResourceAcl, hasAccessibleAcl, getFile } from "@inrupt/solid-client";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FaRegFaceSmileWink } from "react-icons/fa6";

const animatedComponents = makeAnimated()

async function setAccess(resourceURL, agentWebID, toread, towrite, toappend, tocontrol) {
  console.log("Resource URL:", resourceURL);
    if (!resourceURL) {
      throw new Error("Resource URL is undefined or invalid.");
    }

  try {
    // Fetch the SolidDataset and its associated ACLs, if available:
    const myDatasetWithAcl = await getSolidDatasetWithAcl(resourceURL);

    // Obtain the SolidDataset's own ACL, if available,
    // or initialise a new one, if possible:
    let resourceAcl;
    if (!hasResourceAcl(myDatasetWithAcl)) {
      if (!hasAccessibleAcl(myDatasetWithAcl)) {
        throw new Error(
          "The current user does not have permission to change access rights to this Resource."
        );
      }
      if (!hasFallbackAcl(myDatasetWithAcl)) {
        throw new Error(
          "The current user does not have permission to see who currently has access to this Resource."
        );
        // Alternatively, initialise a new empty ACL as follows,
        // but be aware that if you do not give someone Control access,
        // **nobody will ever be able to change Access permissions in the future**:
        // resourceAcl = createAcl(myDatasetWithAcl);
      }
      resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
    } else {
      resourceAcl = getResourceAcl(myDatasetWithAcl);
    }

    // Give someone Control access to the given Resource:
    const updatedAcl = setAgentResourceAccess(
      resourceAcl,
      agentWebID,
      { read: toread, append: toappend, write: towrite, control: tocontrol }
    );

    // Now save the ACL:
    await saveAclFor(myDatasetWithAcl, updatedAcl);
  } catch (error) {
    console.error("Error setting access:", error);
  }
}

const Share = () => {

  const { session } = useSession()
  const [containers, setContainers] = useState([])
  const [validContainer, setValidContainer] = useState([])
  const [isSharing, setIsSharing] = useState(false)
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [resourceURL, setResourceURL] = useState('');
  const [agentWebID, setAgentWebID] = useState('');
  const [readAccess, setReadAccess] = useState(false);
  const [writeAccess, setWriteAccess] = useState(false);
  const [appendAccess, setAppendAccess] = useState(false);
  const [controlAccess, setControlAccess] = useState(false);

  useEffect(() => {
    const getAllContainers = async() => {
      try {
        const hrDataset = await getSolidDataset(process.env.REACT_APP_FHIR_DATA_URL, { fetch: session.fetch })
        console.log(hrDataset)
        let tmp = []
        for (const key in hrDataset.graphs.default) {
          if(isContainer(key) && key!==process.env.REACT_APP_FHIR_DATA_URL ) {
            const tmpUrl= key.replace(process.env.REACT_APP_FHIR_DATA_URL,"")
            tmp.push({ value: tmpUrl, label: tmpUrl })
          }
        }
        setContainers(tmp)
        console.log(tmp)

      } catch (error) {
        console.log(error)
      }
    }
    getAllContainers()
  }, [])

  const shareData = () => {
    let urls = []
    if(validContainer.length > 0){
      console.log(validContainer)
      setIsSharing(true)
      for(const container of validContainer){
        urls.push(process.env.REACT_APP_FHIR_DATA_URL+container.value)
      }
      console.log(urls)
      convertToFhir(urls)
    }
    
  }

  const constructObservation = (timestamp, heartrate, temperature) => {
    const Str = `@prefix fhir: <http://hl7.org/fhir/> .
        @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns> .
        @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema> .
        @prefix xsd: <http://www.w3.org/2001/XMLSchema> .
        @prefix loinc: <https://loinc.org/rdf/> .
        @prefix owl: <http://www.w3.org/2002/07/owl#> .
        
        
        #http://example.com/Patient/PATIENTNB a fhir:Patient .
        
        [a fhir:Observation ;
          fhir:nodeRole fhir:treeRoot ;
          fhir:id [ fhir:v "heart-rate"] ; # 
          fhir:meta [
             fhir:profile ( [
               fhir:v "http://hl7.org/fhir/StructureDefinition/vitalsigns"^^xsd:anyURI ;
               fhir:link <http://hl7.org/fhir/StructureDefinition/vitalsigns>
             ] )
          ] ; #  
          fhir:status [ fhir:v "final"] ; # 
          fhir:category ( [
             fhir:coding ( [
               fhir:system [ fhir:v "http://terminology.hl7.org/CodeSystem/observation-category"^^xsd:anyURI ] ;
               fhir:code [ fhir:v "vital-signs" ] ;
               fhir:display [ fhir:v "Vital Signs" ]
             ] ) ;
             fhir:text [ fhir:v "Vital Signs" ]
          ] ) ; # 
          fhir:code [
             fhir:coding ( [
               a loinc:8867-4 ;
               fhir:system [ fhir:v "http://loinc.org"^^xsd:anyURI ] ;
               fhir:code [ fhir:v "8867-4" ] ;
               fhir:display [ fhir:v "Heart rate" ]
             ] ) ;
             fhir:text [ fhir:v "Heart rate" ]
          ] ; # 
          fhir:subject [
             fhir:reference [ fhir:v "Patient/PATIENTNB" ]
          ] ; # 
          fhir:effective [ fhir:v "${timestamp}"^^xsd:date] ; # 
          fhir:value [
             a fhir:Quantity ;
             fhir:value [ fhir:v "${heartrate}"^^xsd:decimal ] ;
             fhir:unit [ fhir:v "beats/minute" ] ;
             fhir:system [ fhir:v "http://unitsofmeasure.org"^^xsd:anyURI ] ;
             fhir:code [ fhir:v "/min" ]
          ]] . # 
        
        
        
        [a fhir:Observation ;
          fhir:nodeRole fhir:treeRoot ;
          fhir:id [ fhir:v "body-temperature"] ; # 
          fhir:meta [
             fhir:profile ( [
               fhir:v "http://hl7.org/fhir/StructureDefinition/vitalsigns"^^xsd:anyURI ;
               fhir:link <http://hl7.org/fhir/StructureDefinition/vitalsigns>
             ] )
          ] ; #  
          fhir:status [ fhir:v "final"] ; # 
          fhir:category ( [
             fhir:coding ( [
               fhir:system [ fhir:v "http://terminology.hl7.org/CodeSystem/observation-category"^^xsd:anyURI ] ;
               fhir:code [ fhir:v "vital-signs" ] ;
               fhir:display [ fhir:v "Vital Signs" ]
             ] ) ;
             fhir:text [ fhir:v "Vital Signs" ]
          ] ) ; # 
          fhir:code [
             fhir:coding ( [
               a loinc:8310-5 ;
               fhir:system [ fhir:v "http://loinc.org"^^xsd:anyURI ] ;
               fhir:code [ fhir:v "8310-5" ] ;
               fhir:display [ fhir:v "Body temperature" ]
             ] ) ;
             fhir:text [ fhir:v "Body temperature" ]
          ] ; # 
          fhir:subject [
             fhir:reference [ fhir:v "Patient/PATIENTNB" ]
          ] ; # 
          fhir:effective [ fhir:v "${timestamp}"^^xsd:date] ; # 
          fhir:value [
             a fhir:Quantity ;
             fhir:value [ fhir:v "${temperature}"^^xsd:decimal ] ;
             fhir:unit [ fhir:v "C" ] ;
             fhir:system [ fhir:v "http://unitsofmeasure.org"^^xsd:anyURI ] ;
             fhir:code [ fhir:v "Cel" ]
          ]] . # `
      return Str
  }

  const convertToFhir = async (urls) => {
    try {
      for(const url of urls){
        let sources = []
        const datasets = await getSolidDataset(url, { fetch: session.fetch })
        for(const key in datasets.graphs.default){
          
          const value = datasets.graphs.default[key]
          if(!isContainer(value.url)){
            sources.push(value.url)
          }
          
        }
        // const validSources = sources.slice(1)
        // console.log(validSources)
        const promises = sources.map(async (source) => {
          const file = await getFile(source, { fetch: session.fetch })
          // console.log("file",file)
          return JSON.parse(await file.text())
        })
        const objArr = await Promise.all(promises)
        for(const obj of objArr) {
          const observation = constructObservation(obj.measurement.timestamp, obj.measurement.heartrate, obj.measurement.temperature)
          console.log("observation",observation)
          const savedFile = await overwriteFile(
            url+`fhir/observation${obj.measurement.timestamp}.ttl`,
            new File([observation], "patientInformation", { type: "application/fhir+turtle" }),
            { contentType: "text/turtle", fetch: session.fetch }
          )
        }
      }
      setIsSharing(false)
      setShow(true)
    } catch (error) {
      console.log(error)
      setIsSharing(false)
      setShow2(true)
    }
    
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await setAccess(resourceURL, agentWebID, readAccess, writeAccess, appendAccess, controlAccess);
    alert('Access request has been sent!');
  }

  return (
    <Container>
      <br />
        <h2 className='text-center'>Share</h2>
        <p className='text-center' style={{ fontStyle: 'italic' }}>This is the site for sharing your pods with your doctor.</p>
      <hr />
      <br />

      <Row>
      <p className='text-center' style={{ fontStyle: 'italic' }}>Simply select the data you want to share, we'll transfer them for you! <FaRegFaceSmileWink /></p>
      </Row>
      <br /> 
      <Row className='text-center'>
        <Col>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[]}
            isMulti
            options={containers}
            onChange={setValidContainer}
          />
        </Col>
        <Col>
        {
          isSharing ? <Button variant="outline-primary" disabled>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          /> Sharing In Progress</Button>
          : <Button variant='outline-primary' onClick={shareData}>Start Sharing!</Button>
        }
        </Col>
      </Row>
      <br />
      <hr />
      <br />

      <Row>
        <p className='text-center' style={{ fontStyle: 'italic' }}>Manage the access control for your resources! <FaRegFaceSmileWink /></p>
      </Row>
      <br />
      <Form onSubmit={handleSubmit}>
      
      <Row>
        <Col>
        <Form.Label>
          Resource URL:
        </Form.Label>
        <Form.Control type="text" required value={resourceURL} onChange={(e) => setResourceURL(e.target.value)} />
        </Col>
        <Col>
        <Form.Label>
          Agent WebID:
        </Form.Label>
        <Form.Control type="text" required value={agentWebID} onChange={(e) => setAgentWebID(e.target.value)} />
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
        <Form.Check label={"Read Access:"} checked={readAccess} onChange={(e) => setReadAccess(e.target.checked)} />
        </Col>
        <Col>
        <Form.Check label={"Write Access:"} checked={writeAccess} onChange={(e) => setWriteAccess(e.target.checked)} />
        </Col>
        <Col>
        <Form.Check label={"Append Access:"} checked={appendAccess} onChange={(e) => setAppendAccess(e.target.checked)} />
        </Col>
        <Col>
        <Form.Check label={"Control Access:"} checked={controlAccess} onChange={(e) => setControlAccess(e.target.checked)} />
        </Col>
      </Row>
      <br />
      <Button type="submit" variant="primary" size="md">Set Access</Button>
      </Form>

      {/*<div>{readAccess ? <p>t</p> : <p>f</p>}</div>
      <div>{writeAccess ? <p>t</p> : <p>f</p>}</div>
      <div>{appendAccess ? <p>t</p> : <p>f</p>}</div>
      <div>{controlAccess ? <p>t</p> : <p>f</p>}</div>*/}


      <ToastContainer position='top-end'>
      <Toast show={show} onClose={() => setShow(false)} delay={5000} bg='success'>
        <Toast.Header>
          <strong className="me-auto">Sharing Completed!</strong>
        </Toast.Header>
        <Toast.Body>Your doctor can now view your observations!</Toast.Body>
      </Toast>
      <Toast show={show2} onClose={() => setShow2(false)} delay={5000} bg='danger' >
        <Toast.Header>
          <strong className="me-auto">Sharing Failed!</strong>
        </Toast.Header>
        <Toast.Body>Something is not working...</Toast.Body>
      </Toast></ToastContainer>
    </Container>  
  );
}

export default Share;