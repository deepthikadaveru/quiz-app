import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <p style={styles.text}>© {new Date().getFullYear()} QuizHub. All rights reserved.</p>
        <p style={styles.links}>
          <a href="/about" style={styles.link}>About</a> | 
          <a href="/contact" style={styles.link}>Contact</a> | 
          <a href="/privacy-policy" style={styles.link}>Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#1A1F71',
    color: '#fff',
    padding: '30px 5%',
    marginTop: '60px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  content: {
    textAlign: 'center',
  },
  text: {
    fontSize: '14px',
    marginBottom: '10px',
  },
  links: {
    fontSize: '14px',
  },
  link: {
    color: '#fff',
    margin: '0 8px',
    textDecoration: 'none',
  },
};

export default Footer;
