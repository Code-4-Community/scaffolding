import React from 'react';
import { Link } from 'react-router-dom';
import checkIcon from './check.png';


const SuccessPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1>Welcome, Volunteer!</h1>
        <div style={styles.checkContainer}>
          <img src={checkIcon} alt="Check Icon" style={styles.checkIcon} /> {/* Use img tag with src attribute */}
          <p>Thank you!</p>
          <p>Please verify your account with the link sent to your email.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    outline: '1px solid black', // Outline of the sign-up form
  } as React.CSSProperties, // Assert styles as React.CSSProperties
  content: {
    textAlign: 'center',
  } as React.CSSProperties, // Assert styles as React.CSSProperties
  checkContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1rem',
  } as React.CSSProperties, // Assert styles as React.CSSProperties
  checkIcon: {
    width: '100px', // Adjust the width and height of the image as needed
    height: '100px',
    marginBottom: '0.5rem',
  } as React.CSSProperties, // Assert styles as React.CSSProperties
};

export default SuccessPage;