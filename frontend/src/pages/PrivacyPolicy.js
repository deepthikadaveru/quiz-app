import React from 'react';

function PrivacyPolicy() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Privacy Policy</h1>
      <p>
        At <strong>QuizHive</strong>, we value your privacy and are committed to protecting your personal data. This
        policy outlines how we collect, use, and safeguard your information.
      </p>

      <h3>Information We Collect</h3>
      <ul>
        <li>Basic info during sign-up (name, email, etc.)</li>
        <li>Quiz performance and activity logs</li>
        <li>Browser and device info for improving user experience</li>
      </ul>

      <h3>How We Use It</h3>
      <ul>
        <li>To personalize your quiz experience</li>
        <li>To improve our features and services</li>
        <li>To communicate with you for important updates</li>
      </ul>

      <h3>Your Data Rights</h3>
      <p>
        You can request to access, update, or delete your personal data at any time by contacting us at
        <a href="mailto:privacy@quizhive.com"> privacy@quizhive.com</a>.
      </p>

      <p>
        Your trust matters. We never sell your data and only share it with trusted services essential to platform
        functionality.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
