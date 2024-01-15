import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GoalComponent from '../components/goal';

const Goals = () => {

  return (
      <Container className='text-center'>
        <h2 className='text-center'>Goals</h2>
        <p className='text-center' style={{ fontStyle: 'italic' }}>Manage your goal here</p>
        <hr />
          <br />
          <Row>
            <Col sm={4}><GoalComponent /></Col>
            <Col sm={8}></Col>
          </Row>
          
          
      </Container>
  );
}

export default Goals;