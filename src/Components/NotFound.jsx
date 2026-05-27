import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  // Inline CSS Styles
  const pageContainerStyle = {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#f8f9fa', // Light gray background
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  };

  const codeStyle = {
    fontSize: '120px',
    fontWeight: 'bold',
    color: '#dc3545', // A strong, attractive red (e.g., from Bootstrap's danger color)
    marginBottom: '20px',
    letterSpacing: '10px',
    textShadow: '3px 3px 5px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '36px',
    color: '#343a40', // Dark text for good contrast
    marginBottom: '15px',
  };

  const messageStyle = {
    fontSize: '18px',
    color: '#6c757d', // Muted text for the message
    marginBottom: '30px',
    maxWidth: '600px',
    lineHeight: '1.6',
  };

  const buttonStyle = {
    display: 'inline-block',
    padding: '12px 25px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff', // White text
    backgroundColor: '#007bff', // A vibrant blue
    border: 'none',
    borderRadius: '8px',
    textDecoration: 'none', // Important for an anchor tag
    transition: 'background-color 0.3s ease, transform 0.1s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)',
  };

  // A simple hover effect (can't use a true :hover in inline style, but this is an example)
  // For a real application, you'd use a styled-components or a CSS file for hover effects.
  // We'll keep it simple for the inline CSS requirement.
  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#0056b3', // Darker blue on "hover" (if this were a real CSS class)
  };


  return (
    <div style={pageContainerStyle}>
      <div style={codeStyle}>404</div>
      <h1 style={titleStyle}>Page Not Found</h1>
      <p style={messageStyle}>
        Oops! It looks like you've stumbled upon a page that doesn't exist.
        The link might be broken or the page may have been moved.
      </p>
      {/*
        NOTE: Replace the '#' with your actual home page path,
        e.g., href="/" or use a framework's Link component.
      */}
      <Link to="/" style={buttonStyle}
         // Optional: Add a subtle animation/style for user interaction (focus/active)
         onMouseDown={(e) => { e.currfentTarget.style.transform = 'scale(0.98)'; }}
         onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;