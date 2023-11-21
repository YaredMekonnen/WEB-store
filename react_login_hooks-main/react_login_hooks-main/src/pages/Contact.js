import React from 'react';
import { useLocation } from 'react-router-dom';

function Contact() {
  const location = useLocation();
  const props = location.state;

  return (
    <div>
      <h1>Contact Information</h1>
      <p>Name: {props && props.username}</p>
      <p>Email: {props && props.email}</p>
      <p>Phone Number: {props && props.phone}</p>
      {/* Additional contact information display */}
    </div>
  );
}

export default Contact;

