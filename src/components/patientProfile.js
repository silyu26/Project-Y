import { getSolidDataset, getThingAll } from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Button} from "react-bootstrap";
const QueryEngine = require('@comunica/query-sparql').QueryEngine

const Profile = ()=> {

    const { session } = useSession()
    const [fname, setFName] = useState("")
    const [lname, setLName] = useState("")
    const [gender, setGender] = useState("")
    const [telecom, setTelecom] = useState("")
    const [birth, setBirth] = useState("")
    const [dataset, setDataset] = useState(null)
    const [patientSources, setPatientSources] = useState([])


    
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

          // This is for testing the INSERT option
          /*const queryStr = `
          PREFIX fhir: <http://hl7.org/fhir/> 
          PREFIX owl: <http://www.w3.org/2002/07/owl#> 
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

          INSERT DATA {
            [ a fhir:Patient ;
              fhir:nodeRole fhir:treeRoot ;
              fhir:id [ fhir:v "example"] ;    
              fhir:active [ fhir:v "true"^^xsd:boolean] ;  
              fhir:name ( [
                 fhir:use [ fhir:v "official" ] ;
                 fhir:family [ fhir:v "Li" ] ;
                 fhir:given ( [ fhir:v "Silyu" ] )
              ] ) ;     
              fhir:telecom ( [
                 fhir:system [ fhir:v "phone" ] ;
                 fhir:value [ fhir:v "0123456789" ] ;
                 fhir:use [ fhir:v "work" ] ;
                 fhir:rank [ fhir:v "1"^^xsd:positiveInteger ]
              ] ) ;
              fhir:gender [ fhir:v "male"] ;     
              fhir:birthDate [ fhir:v "2023-12-13"^^xsd:date ] ; 
              fhir:deceased [ fhir:v "false"^^xsd:boolean] ;
              fhir:address ( [
                 fhir:use [ fhir:v "home" ] ;
                 fhir:type [ fhir:v "both" ] ;
                 fhir:text [ fhir:v "534 Erewhon St PeasantVille, Rainbow, Vic  3999" ] ;
                 fhir:line ( [ fhir:v "534 Erewhon St" ] ) ;
                 fhir:city [ fhir:v "PleasantVille" ] ;
                 fhir:district [ fhir:v "Rainbow" ] ;
                 fhir:state [ fhir:v "Vic" ] ;
                 fhir:postalCode [ fhir:v "3999" ] ;
                 fhir:period [
                   fhir:start [ fhir:v "1974-12-25"^^xsd:date ]
                 ]
              ] )
            ] .
          }
          `*/
          const bindingsStream = await myEngine.queryBindings(queryStr, {
            sources: patientSources
            /*[
              "https://lab.wirtz.tech/test/patient/patientInformation.ttl",
              "https://lab.wirtz.tech/test/patient/patientInformation2.ttl"
            ]*/
          })

        if(dataset) {
            // const result = RDFLib.Query(queryStr, dataset)
            // console.log("result:",result)
            const bindings = await bindingsStream.toArray()
            console.log(bindings)
            console.log(bindings[0].get('lname').value)
            console.log(bindings[0].get('fname').value)
            console.log(bindings[0].get('gender').value)
            console.log(bindings[0].get('tel').value)
            console.log(bindings[0].get('birth').value)
            console.log(bindings[1].get('lname').value)
            console.log(bindings[1].get('fname').value)
            console.log(bindings[1].get('gender').value)
            console.log(bindings[1].get('tel').value)
            console.log(bindings[1].get('birth').value)
            setFName(bindings[0].get('fname').value)
            setLName(bindings[0].get('lname').value)
            setBirth(bindings[0].get('birth').value)
            setTelecom(bindings[0].get('tel').value)
            setGender(bindings[0].get('gender').value)
        } else {
            console.log("No Dataset Loaded")
        }
        
    }

    useEffect(() => {
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
    },[session])

    return (
        <Container>
            {/**/}
            <Button variant="info" onClick={runQuery}>Run Query</Button>
            <Row>
              <Col>First Name: {fname}</Col>
              <Col>Last Name: {lname}</Col>
              <Col>Gender: {gender}</Col>
              <Col>Tel: {telecom}</Col>
              <Col>Birthday: {birth}</Col>
            </Row>
        </Container>
    )
}

export default Profile