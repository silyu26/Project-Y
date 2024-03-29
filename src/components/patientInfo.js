import { createSolidDataset, getSolidDataset, saveSolidDatasetAt, getUrlAll, getThing, getPodUrlAll,
    addDatetime, addStringNoLocale, createThing, setThing, getSourceUrl, addUrl, overwriteFile, saveFileInContainer } from "@inrupt/solid-client"
import { useSession } from "@inrupt/solid-ui-react"
import { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
  
  
  function PatientForm({f,l,g,t,b}) {
      const { session } = useSession()
      const [patient, setPatient] = useState()
      const [fname, setFName] = useState(f || "")
      const [lname, setLName] = useState(l || "")
      const [gender, setGender] = useState(g || "")
      const [telecom, setTelecom] = useState(t || "")
      const [birth, setBirth] = useState(b || "")
      const [show, setShow] = useState(false)
      const [show2, setShow2] = useState(false)
  
  
      const createPatient = async (containerUri, fetch) => {
          const indexUrl = `${containerUri}patientInformation.ttl`
          console.log("index",indexUrl)
          try{
            const patient = await getSolidDataset(indexUrl, {fetch})
            return patient
          } catch (error) {
            if(error.statusCode === 404) {
              const patient = await saveSolidDatasetAt(
                indexUrl,
                // patientResource,
                createSolidDataset(), 
                {
                  fetch
                }
              )
              return patient
            } else {
                console.log(error)
            }
          }
      }

      const constructPatientResource = (fname, lname, gender, tel, birth) => {

        const patientResource = `
        @prefix fhir: <http://hl7.org/fhir/> .
        @prefix owl: <http://www.w3.org/2002/07/owl#> .
        @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
        @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
        
        # - resource -------------------------------------------------------------------
        
        [a fhir:Patient ;
          fhir:nodeRole fhir:treeRoot ;
          fhir:id [ fhir:v "example"] ;    
          fhir:active [ fhir:v "true"^^xsd:boolean] ;  
          fhir:name ( [
             fhir:use [ fhir:v "official" ] ;
             fhir:family [ fhir:v "${lname}" ] ;
             fhir:given ( [ fhir:v "${fname}" ] )
          ] ) ;     
          fhir:telecom ( [
             fhir:system [ fhir:v "phone" ] ;
             fhir:value [ fhir:v "${tel}" ] ;
             fhir:use [ fhir:v "work" ] ;
             fhir:rank [ fhir:v "1"^^xsd:positiveInteger ]
          ] ) ; #     home communication details aren't known    
          fhir:gender [ fhir:v "${gender}"] ;     
          fhir:birthDate [ fhir:v "${birth}"^^xsd:date ] ; 
          fhir:deceased [ fhir:v "false"^^xsd:boolean]
        ] .  
          
        
        # -------------------------------------------------------------------------------------
        `
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
          fhir:effective [ fhir:v "2023-12-12T16:27:22Z"^^xsd:date] ; # 
          fhir:value [
             a fhir:Quantity ;
             fhir:value [ fhir:v "18.00"^^xsd:decimal ] ;
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
          fhir:effective [ fhir:v "2023-12-12T16:27:22Z"^^xsd:date] ; # 
          fhir:value [
             a fhir:Quantity ;
             fhir:value [ fhir:v "22.00"^^xsd:decimal ] ;
             fhir:unit [ fhir:v "C" ] ;
             fhir:system [ fhir:v "http://unitsofmeasure.org"^^xsd:anyURI ] ;
             fhir:code [ fhir:v "Cel" ]
          ]] . # `
        return patientResource
      }
  
      const handleSubmit = async (event) => {
        try {
          event.preventDefault();
          //addPatient(Text);
          const patientResource = constructPatientResource(fname, lname, gender, telecom, birth)
          console.log("patient resource",patientResource)
          const containerUri = process.env.REACT_APP_SERVER_URL2+'patient/'
          const req = await createPatient(containerUri, session.fetch)
          console.log("req",req)

          const savedFile = await overwriteFile(
            process.env.REACT_APP_SERVER_URL2+"patient/patientInformation.ttl",
            new File([patientResource], "patientInformation", { type: "application/fhir+turtle" }),
            { contentType: "text/turtle", fetch: session.fetch }
          )
          setFName("")
          setLName("")
          setBirth("")
          setGender("")
          setTelecom("")
          setShow(true)
        } catch (error) {
          setShow2(true)
          console.log(error)
        }
          
      }

      return(
        <Container>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='Name'>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="Max Mustermann" required
                    value={fname} onChange={(e) => setFName(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='Name'>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Max Mustermann" required
                    value={lname} onChange={(e) => setLName(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='gender'>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select required
                    value={gender} onChange={(e) => setGender(e.target.value)} >
                    <option>Select Gender</option>
                    <option value={"male"}>male</option>
                    <option value={"female"}>female</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='telecom'>
                  <Form.Label>Telecome</Form.Label>
                  <Form.Control type="tel" placeholder="0123456789" required
                    value={telecom} onChange={(e) => setTelecom(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='telecom'>
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control type="date" required
                    value={birth} onChange={(e) => setBirth(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" size="sm">
              Save Profile
            </Button>
          </Form>  
          
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
      )
  }
  
  export default PatientForm