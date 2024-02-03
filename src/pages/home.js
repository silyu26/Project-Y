// Import necessary React components and styles
import React from 'react';
import { useSession } from "@inrupt/solid-ui-react";
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import PodConnectionSuggestion from '../components/correlations/connection';
import { Container, Row, Col } from 'react-bootstrap';
import { FcComboChart } from "react-icons/fc";
import { FcPrivacy } from "react-icons/fc";
import { FcExport } from "react-icons/fc";
import { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';


// Dummy data for featured health correlations
const featuredCorrelations = [
  { title: 'Sleep vs. Mood', description: 'Explore the relationship between sleep duration and your mood.' },
  { title: 'Heart Rate vs. Exercise', description: 'See how your heart rate correlates with different types of exercise.' },
  // Add more featured correlations as needed
];

const Home = () => {

  const { session } = useSession()
  const options = ['Hydration', 'Temperature', 'Heart Rate', 'Mood', 'Sleep', 'Sport Time', 'Sport Intensity'];
  const [selectedOption1, setSelectedOption1] = useState(options[0]);
  const [selectedOption2, setSelectedOption2] = useState(options[1]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Randomly pick a new value for each button
      const randomIndex1 = Math.floor(Math.random() * options.length);
      const randomIndex2 = (randomIndex1 + 1) % options.length; // Ensure values are different
      setSelectedOption1(options[randomIndex1]);
      setSelectedOption2(options[randomIndex2]);
    }, 3000); // Change the value every 3 seconds (adjust as needed)

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [options]);


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
        <Col><FcComboChart /> Explore the correlation between different criteria</Col>
        <Col><Dropdown variant="dark">
              <Dropdown.Toggle id="dropdown-button-1">
                {selectedOption1}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {options.map((option) => (
                  <Dropdown.Item key={option} onClick={() => setSelectedOption1(option)}>
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            vs.
            <Dropdown>
              <Dropdown.Toggle id="dropdown-button-2">
                {selectedOption2}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {options.map((option) => (
                  <Dropdown.Item key={option} onClick={() => setSelectedOption2(option)}>
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown></Col>    
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
        {session.info.isLoggedIn ?
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