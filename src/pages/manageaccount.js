import React from 'react';
import Profile from '../components/patientProfile';
import { Container, Row, Col } from 'react-bootstrap';

const Manageaccount = () => {

  return (
      <Container className='text-center'>
          <br />
          <Profile />
      </Container>
  );
}

export default Manageaccount;