import { getSolidDataset, getThingAll } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { Container, Row, Modal, Button, Image} from "react-bootstrap";
import { Card } from "react-bootstrap";
import dummy from "../dummy_img.jpg"
import { MdEdit } from "react-icons/md";
import PatientForm from "./patientInfo";
const QueryEngine = require('@comunica/query-sparql').QueryEngine


const Profile = ()=> {

    const { session } = useSession() 
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [gender, setGender] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [telecom, setTelecom] = useState("")
    const [birth, setBirth] = useState("")

    /**
     * // test emotibit observation data
        const queryStr2 = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema>
PREFIX loinc: <https://loinc.org/rdf/>
PREFIX owl: <http://www.w3.org/2002/07/owl>
PREFIX fhir: <http://hl7.org/fhir/> 

SELECT ?heartRateValue ?bodyTemp
WHERE {
  {?observation a fhir:Observation ;
               fhir:id [ fhir:v "heart-rate"] ;
               fhir:value [ a fhir:Quantity ;
                             fhir:value [ fhir:v ?heartRateValue] ;
                             fhir:unit [ fhir:v "beats/minute" ] ;
                             fhir:system [ fhir:v "http://unitsofmeasure.org"^^xsd:anyURI ] ;
                             fhir:code [ fhir:v "/min" ]
               ] .
} 
UNION 
{
  ?observation a fhir:Observation ;
               fhir:id [ fhir:v "body-temperature"] ;
               fhir:value [ a fhir:Quantity ;
                             fhir:value [ fhir:v ?bodyTemp] ;
                             fhir:unit [ fhir:v "C" ] ;
                             fhir:system [ fhir:v "http://unitsofmeasure.org"^^xsd:anyURI ] ;
                             fhir:code [ fhir:v "Cel" ]
               ] .
}
}`
*/

    useEffect(() => {
      const runQuery = async() => {
        const myEngine = new QueryEngine()
        const queryStr = `
          PREFIX fhir: <http://hl7.org/fhir/> 
          PREFIX owl: <http://www.w3.org/2002/07/owl#> 
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

          SELECT ?fname ?lname ?gender ?tel ?birth
          WHERE {
            [ a fhir:Patient ;
              fhir:name ([ 
                fhir:family [ fhir:v ?lname ];
                fhir:given ([fhir:v ?fname])
              ]);
              fhir:gender [fhir:v ?gender];
              fhir:telecom ([ 
                fhir:value [ fhir:v ?tel ];
              ]);
              fhir:birthDate [fhir:v ?birth];
            ]
          } `
        const bindingsStream = await myEngine.queryBindings(queryStr, {
          sources: [process.env.REACT_APP_SERVER_URL2+"patient/patientInformation.ttl"] 
            //patientSources
        })

        if(bindingsStream) {
            const bindings = await bindingsStream.toArray()
            setFName(bindings[0].get('fname').value)
            setLName(bindings[0].get('lname').value)
            setBirth(bindings[0].get('birth').value)
            setTelecom(bindings[0].get('tel').value)
            setGender(bindings[0].get('gender').value)
        } else {
            console.log("No Dataset Loaded")
        } 
      }
      runQuery()
    },[session])

    const openModal = () => {
      setModalOpen(true)
    }
    const closeModal = () => {
      setModalOpen(false)
    }
    
    /*useEffect(() => {
        const getPatientProfile = async() => {
            try {
                const profileDataset = await getSolidDataset("https://lab.wirtz.tech/test/patient/", {fetch: session.fetch})
                console.log("profile dataset",profileDataset.graphs.default)
                setDataset(profileDataset)

                let sources = []
                for (const key in profileDataset.graphs.default) {
                  if(profileDataset.graphs.default.hasOwnProperty(key)) {
                    const pattern = /^https:\/\/lab\.wirtz\.tech\/test\/patient\/patientInformation.*\.ttl$/;
                    const value = profileDataset.graphs.default[key]
                    if(pattern.test(value.url)){
                      sources.push(value.url)
                    }
                  }
                }
                console.log("sources",sources)
                setPatientSources(sources)
            } catch (error) {
                console.log("error!",error)
            }
        }
        getPatientProfile()
    },[session])*/

    return (
        <Container>

          <Modal show={modalOpen} onHide={closeModal} size="md">
            <Modal.Header closeButton>
            <Modal.Title>Profile Form</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PatientForm f={fname} l={lname} g={gender} t={telecom} b={birth}/>
            </Modal.Body>
          </Modal>

          <Row>
            <Card style={{ width: '14rem' }} className="text-center">
              <div className="justify-content-center"><Image src={dummy} roundedCircle style={{width:"8rem"}}/></div>
              <hr />
              <Card.Body>
                <Card.Title>{fname} {lname} <MdEdit onClick={openModal} style={{ cursor: 'pointer' }} /></Card.Title><br/>
                <Card.Text >
                  <div>Birthday: {birth}</div><br />
                  <div>Gender: {gender}</div><br />
                  <div>Tel: {telecom}</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>  
        </Container>
    )
}

export default Profile