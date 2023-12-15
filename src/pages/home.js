// Import necessary React components and styles
import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation
import PodConnectionCor from '../components/correlations/connection';


// Dummy data for featured health correlations
const featuredCorrelations = [
  { title: 'Sleep vs. Mood', description: 'Explore the relationship between sleep duration and your mood.' },
  { title: 'Heart Rate vs. Exercise', description: 'See how your heart rate correlates with different types of exercise.' },
  // Add more featured correlations as needed
];

const home = () => {
    return (
      <div className="homepage-container">
        <header>
          <h1>Your Health Data App</h1>
          <p>Visualize and understand correlations in your health data.</p>
        </header>
  
        <section className="featured-correlations">
          <h2>Featured Correlations</h2>
          <div className="correlation-list">
            {featuredCorrelations.map((correlation, index) => (
              <div className="correlation-item" key={index}>
                <h3>{correlation.title}</h3>
                <p>{correlation.description}</p>
              </div>
            ))}
          </div>
        </section>
  
        <section className="cta-section">
          <p>Ready to explore your health data?</p>
          <Link to="pages/correlation" className="cta-button">Get Started</Link>
        </section>
      </div>
    );
  };

  export default home;