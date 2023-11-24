import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Contact() {
  const location = useLocation();
  const props = location.state;

  useEffect(() => {
    // Make API request to update views when component mounts
    const updateViews = async () => {
      try {
        const response = await fetch(`/api/posts/${props._id}/updateViews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (result.success) {
          console.log('Views updated successfully');
        } else {
          console.error('Error updating views:', result.message);
        }
      } catch (error) {
        console.error('Error updating views:', error);
      }
    };

    updateViews();
  }, [props._id]); // Ensure you have the correct property for the post ID

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
