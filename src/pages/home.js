// Import necessary React components and styles
import React from 'react';
import { useSession } from "@inrupt/solid-ui-react";
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import PodConnectionSuggestion from '../components/correlations/connection';
import { Container, Row, Col } from 'react-bootstrap';
import { FcComboChart } from "react-icons/fc";
import { FcPrivacy } from "react-icons/fc";
import { FcExport } from "react-icons/fc";


// Dummy data for featured health correlations
const featuredCorrelations = [
  { title: 'Sleep vs. Mood', description: 'Explore the relationship between sleep duration and your mood.' },
  { title: 'Heart Rate vs. Exercise', description: 'See how your heart rate correlates with different types of exercise.' },
  // Add more featured correlations as needed
];

const Home = () => {

  const { session } = useSession()

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
                <h6><FcComboChart /> {correlation.title}</h6>
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
            <h6 style={{ fontStyle: 'italic' }}><FcPrivacy /> We value your privacy! Only authorized third-party entities can access your data.</h6>
          </Row> 
          <br />

          <Row>
            <h4>Data Sharing</h4>
          </Row>
          <br />
          <Row>
            <h6 style={{ fontStyle: 'italic' }}><FcExport /> We possess the capability to adapt and share your data in a standardized and interoperable manner.</h6>
          </Row>
          <br />
          { session.info.isLoggedIn ?
            <p className='text-muted'>Ready to explore your health data? 
              <Link to="pages/correlation" className="cta-button"> Get Started</Link>
            </p>
            :
            <p className='text-muted'>Ready to explore your health data? <b>Sign in to continue!</b></p>
          }
        </Container>
      </div>
    );
  };

  export default Home;