import React from 'react';

function Contact() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Contact Us</h1>
      <p>
        We’d love to hear from you! Whether you have questions, feedback, or suggestions — feel free to reach out.
      </p>
      <ul style={{ lineHeight: '2' }}>
        <li>Email: <a href="mailto:support@quizhive.com">support@quizhive.com</a></li>
        <li>Phone: +91 98765 43210</li>
        <li>Address: QuizHive HQ, Hyderabad, Telangana, India</li>
      </ul>
      <p>
        You can also follow us on our social channels for updates, new features, and daily quiz challenges.
      </p>
    </div>
  );
}

export default Contact;
