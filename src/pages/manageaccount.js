import React from 'react';
import Profile from '../components/patientProfile';
import { Container, Row, Col } from 'react-bootstrap';

const Manageaccount = () => {

  return (
      <Container className='text-center'>
        <h2 className='text-center'>Profile</h2>
        <p className='text-center' style={{ fontStyle: 'italic' }}>Manage your profile here</p>
        <hr />
          <br />
          <Row>
            <Col sm={4}><Profile /></Col>
            <Col sm={8}></Col>
          </Row>
          
          
      </Container>
  );
}

export default Manageaccount;