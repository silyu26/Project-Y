// import { Graph, Dataset, PlanBuilder } from "sparql-engine";
import { getSolidDataset, getThingAll } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button} from "react-bootstrap";

// import * as RDFLib from "rdflib"

const Profile = ()=> {

    const { session } = useSession()
    const [name, setName] = useState("")
    const [gender, setGender] = useState("")
    const [telecom, setTelecom] = useState("")
    const [birth, setBirth] = useState("")
    const [dataset, setDataset] = useState(null)


    /*
    const runQuery = async() => {
        const builder = new PlanBuilder(dataset)
        // const parser = new Parser()
        const endpointUrl = 'https://lab.wirtz.tech/test/patient/patientInformation.ttl'
        const queryStr = `
          PREFIX fhir: <http://hl7.org/fhir/> 
          PREFIX owl: <http://www.w3.org/2002/07/owl#> 
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

          SELECT ?name
          WHERE {
            [ a fhir:Patient ;
              fhir:name ([ 
                fhir:family [ fhir:v ?name ]
              ])
            ]
          } `

        if(dataset) {
            // const result = RDFLib.Query(queryStr, dataset)
            // console.log("result:",result)
            builder.execute(queryStr).then(results => {
                console.log("results",results)
            })
        } else {
            console.log("No Dataset Loaded")
        }
        
    }*/

    useEffect(() => {
        const getPatientProfile = async() => {
            try {
                const profileDataset = await getSolidDataset("https://lab.wirtz.tech/test/patient/patientInformation.ttl", {fetch: session.fetch})
                console.log("profile dataset",profileDataset)
                setDataset(profileDataset)
                const patientThings = profileDataset ? getThingAll(profileDataset) : [];
                console.log("patientThings",patientThings)
            } catch (error) {
                console.log("error!",error)
            }
        }
        getPatientProfile()
    },[session])

    return (
        <Container>
            {/*<Button onClick={runQuery}>Run Query</Button>*/}
            <Row>
              <Col>Name: {name}</Col>
              <Col>Gender: {gender}</Col>
              <Col>Tel: {telecom}</Col>
              <Col>Birth: {birth}</Col>
            </Row>
        </Container>
    )
}

export default Profile