import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import GoalComponent from '../components/goals/goalComponent';

const Goals = ({ criteriaData }) => {

  return (
    <Container className='text-center'>
      <br />
      <h2 className='text-center'>Goals</h2>
      <p className='text-center' style={{ fontStyle: 'italic' }}>Manage your goals here</p>
      <hr />
      <br />
      <GoalComponent healthData={criteriaData} />
    </Container>
  );
}

export default Goals;