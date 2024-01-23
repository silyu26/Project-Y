import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BiLogoGitlab } from "react-icons/bi";
import "./style.css";
import { TbHexagonLetterS } from "react-icons/tb";
//
function Footer() {
    return (
        <Navbar bg="light" variant="light" fixed="bottom" style={{ position: 'relative'}}>{/** */}
            <Container>
                <Row className="align-items-center">
                    <Col className="text-center col-md-auto text-nowrap">
                        <a href="https://git.rwth-aachen.de/dsma/teaching/deco-lab-ws23/group-3/group3" target="_blank" rel="noopener noreferrer" className="no-underline">
                            <BiLogoGitlab size={30} style={{ paddingRight: '2px' }} />
                            Source code
                        </a>
                    </Col>
                    <Col className="text-center col-md-auto text-nowrap">
                        <a href={process.env.REACT_APP_SERVER_URL} target="_blank" rel="noopener noreferrer" className="no-underline" >
                            <TbHexagonLetterS size={25} style={{ paddingRight: '2px' }} />
                            Solid server
                        </a>
                    </Col>
                    <Col className="text-center">
                        <a href="https://youtu.be/dQw4w9WgXcQ?si=hky9wG9Zuy28Z0QM" target="_blank" rel="noopener noreferrer" className="no-underline">Tutorial</a>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col className="col-md-auto text-nowrap">
                        <ul>
                            <li><p className="font-weight-bold">Contact us</p></li>
                            <li><a href="mailto:elias.wirtz@rwth-aachen.de" className="no-underline"><small>Elias Wirtz</small></a></li>
                            <li><a href="mailto:martin.neumueller@rwth-aachen.de" className="no-underline"><small>Martin Neumüller</small></a></li>
                        </ul>
                    </Col>
                    <Col className="col-md-auto text-nowrap">
                        <ul>
                            <li><p className="font-weight-bold">&nbsp;</p></li>
                            <li><a href="mailto:silyu.li@rwth-aachen.de" className="no-underline"><small>Silyu Li</small></a></li>
                            <li><a href="mailto:van.dao@rwth-aachen.de" className="no-underline"><small>Van Dao</small></a></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

export default Footer;
