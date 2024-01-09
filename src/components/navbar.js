import Nav from 'react-bootstrap/Nav';
import { useSession } from "@inrupt/solid-ui-react";
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container'
import Loginnavbar from '../pages/loginnavbar'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import EnterData from './enterdata';
import Connectsensor from './connectsensor';
import Createcorrelation from './createcorrelation';

function Navigatebar() {

    const [enterDataModalShow, setEnterDataModalShow] = useState(false)
    const [connectSensorModalShow, setConnectSensorModalShow] = useState(false)
    const [createCorrelationModalShow, setCreateCorrelationModalShow] = useState(false)
    const { session } = useSession() 

    return(
      <Navbar bg="dark" data-bs-theme="dark" >
        <Container>
          <Navbar.Brand href="/">PROJECT {" "}
          <img
              src="/../y.png"
              width="20"
              height="25"
              className="d-inline-block align-top"
              alt="Project Y logo"
            />
          </Navbar.Brand>
          {session.info.isLoggedIn ?
          (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">

              <NavDropdown title="Dashboard" id="basic-nav-dropdown">
                <NavDropdown.Item><Link to="/pages/correlation" className="no-ul">  Correlations</Link></NavDropdown.Item>
                <NavDropdown.Item> <Link to="/pages/suggestions" className="no-ul"> Suggestions</Link></NavDropdown.Item>
                <NavDropdown.Item> <Link to="/pages/testMatrix" className="no-ul"> The Matrix</Link></NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Add Data" id="basic-nav-dropdown">
               <NavDropdown.Item> <span onClick={() => setEnterDataModalShow(true)}>
                 Manually enter data
                 </span>
                  <EnterData
                  show={enterDataModalShow}
                  onHide={() => setEnterDataModalShow(false)}
                  />
              </NavDropdown.Item>
              {/*<NavDropdown.Item> <Link to="/pages/login" className="no-ul"> Add/Show Data</Link></NavDropdown.Item>*/}
              <NavDropdown.Item> <span onClick={() => setConnectSensorModalShow(true)}>
                 Connect Sensor
                 </span>
                <Connectsensor
                  show={connectSensorModalShow}
                  onHide={() => setConnectSensorModalShow(false)}
                  />
              </NavDropdown.Item>
              <NavDropdown.Item> <span onClick={() => setCreateCorrelationModalShow(true)}>
                Create Correlation
                </span>
                <Createcorrelation
                  show={createCorrelationModalShow}
                  onHide={() => setCreateCorrelationModalShow(false)}
                  />
              </NavDropdown.Item>
              </NavDropdown>

              
            </Nav>
          </Navbar.Collapse>)
          : null
          }
          
          <Navbar.Collapse >
            <Nav className="ms-auto">
              {session.info.isLoggedIn ?
              (<>
              <Nav.Link ><Link to="/pages/share" className="no-ul"> Share</Link></Nav.Link>
              <NavDropdown title="Profile" id="basic-nav-dropdown" >
                <NavDropdown.Item> <Link to="/pages/manageaccount" className="no-ul"> Manage Account</Link></NavDropdown.Item>
                <NavDropdown.Item> <Link to="/pages/managepod" className="no-ul"> Manage Pod</Link></NavDropdown.Item>
                <NavDropdown.Item> <Link to="/pages/settings" className="no-ul"> Settings</Link></NavDropdown.Item>
              </NavDropdown>
              <Loginnavbar /></>)
              : <Loginnavbar />}
              
            </Nav>
          </Navbar.Collapse> 
          
       </Container>
      </Navbar>
    )
} 

export default Navigatebar