// Import necessary React components and styles
import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import PodConnectionSuggestion from '../components/correlations/connection';
import { Container, Row, Col } from 'react-bootstrap';
import { FcComboChart } from "react-icons/fc";


// Dummy data for featured health correlations
const featuredCorrelations = [
  { title: 'Sleep vs. Mood', description: 'Explore the relationship between sleep duration and your mood.' },
  { title: 'Heart Rate vs. Exercise', description: 'See how your heart rate correlates with different types of exercise.' },
  // Add more featured correlations as needed
];

const home = () => {
    return (
      <div className="homepage-container">
        <br />
        <header>
          <h2 className='text-center'>Your Personal Health Data App</h2>
          <p className='text-center' style={{ fontStyle: 'italic' }}>Visualize and understand correlations in your health data.</p>
        </header>
        <hr />
        
        <Container>
          <Row><h4>Featured Correlations</h4></Row>
          <br />
          <Row>
            {featuredCorrelations.map((correlation, index) => (
              <Col key={index}><div className="correlation-item">
                <h5><FcComboChart /> {correlation.title}</h5>
                <p style={{ fontStyle: 'italic' }}>{correlation.description}</p>
              </div></Col>
            ))}
          </Row>
          <br />
          <Row>
            <h4>Privacy & Safety</h4>
          </Row> 
          <br />
          <Row>
            <h4>Data Sharing</h4>
          </Row>
          <br />
          <br />
          <p className='text-muted'>Ready to explore your health data? <Link to="pages/correlation" className="cta-button">Get Started</Link></p>
        </Container>
      </div>
    );
  };

  export default home;