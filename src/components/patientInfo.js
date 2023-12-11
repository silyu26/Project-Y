import { createSolidDataset, getSolidDataset, saveSolidDatasetAt, getUrlAll, getThing, getPodUrlAll,
    addDatetime, addStringNoLocale, createThing, setThing, getSourceUrl, addUrl, overwriteFile, saveFileInContainer } from "@inrupt/solid-client"
  import { useSession } from "@inrupt/solid-ui-react"
  import { useEffect, useState } from "react"
  import Button from 'react-bootstrap/Button'
  import Container from 'react-bootstrap/Container'
  import Row from 'react-bootstrap/Row'
  import Col from 'react-bootstrap/Col'
  import Form from 'react-bootstrap/Form'
  
  
  function PatientForm() {
      const { session } = useSession()
      const [patient, setPatient] = useState()
      const [fname, setFName] = useState("")
      const [lname, setLName] = useState("")
      const [gender, setGender] = useState("")
      const [telecom, setTelecom] = useState("")
      const [birth, setBirth] = useState("")
  
  
      const createPatient = async (containerUri, fetch, patientResource) => {
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
        return patientResource
      }
  
      const handleSubmit = async (event) => {
          event.preventDefault();
          //addPatient(Text);
          const patientResource = constructPatientResource(fname, lname, gender, telecom, birth)
          console.log("patient resource",patientResource)
          const containerUri = 'https://lab.wirtz.tech/test/patient/'
          const req = await createPatient(containerUri, session.fetch, patientResource)
          console.log("req",req)

          const savedFile = await overwriteFile(
            "https://lab.wirtz.tech/test/patient/patientInformation.ttl",
            new File([patientResource], "patientInformation", { type: "application/fhir+turtle" }),
            { contentType: "text/turtle", fetch: session.fetch }
          )

          /*const savedFile2 = await saveFileInContainer(
            "https://lab.wirtz.tech/test/patient/",
            new File(["This is a plain piece of text"], "myFile", { type: "plain/text" }),
            { slug: "suggestedFileName.txt", contentType: "text/plain", fetch: session.fetch }
          );*/
          console.log("req",savedFile)

          setFName("")
          setLName("")
          setBirth("")
          setGender("")
          setTelecom("")
          //setText("")
      }
      
      /*
      useEffect(() => {
        if (!session) return;
        (async () => {
          const containerUri = 'https://lab.wirtz.tech/test/patient/'
          const patientFile = await createPatient(containerUri, session.fetch)
          console.log("patient:",patientFile)
          // setPatient(patient)
          // console.log("patient:",patient)
        })()
      }, [session])*/
  
      return(
        <Container>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='Name'>
                  <Form.Label>patient first name</Form.Label>
                  <Form.Control type="text" placeholder="Max Mustermann" required
                    value={fname} onChange={(e) => setFName(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='Name'>
                  <Form.Label>patient last name</Form.Label>
                  <Form.Control type="text" placeholder="Max Mustermann" required
                    value={lname} onChange={(e) => setLName(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='gender'>
                  <Form.Label>patient gender</Form.Label>
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
                  <Form.Label>patient telecome</Form.Label>
                  <Form.Control type="tel" placeholder="0123456789" required
                    value={telecom} onChange={(e) => setTelecom(e.target.value)} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3' controlId='telecom'>
                  <Form.Label>patient birthday</Form.Label>
                  <Form.Control type="date" required
                    value={birth} onChange={(e) => setBirth(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" variant="primary" size="sm">
              Save Profile
            </Button>
          </Form>
        </Container>
      )
  }
  
  export default PatientForm