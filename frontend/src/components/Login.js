import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const { email, password } = credentials;
    if (!email || !password) {
      setMessage('⚠️ Please fill in both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('⚠️ Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', data.username);

        window.dispatchEvent(new Event('login'));


        setMessage('✅ Logged in successfully!');
        navigate('/profile');
      } else {
        setMessage(`❌ ${data.message || 'Login failed'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrapper: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#edfafe',
    },
    imageSide: {
      flex: 1,
      backgroundImage: "url('/images/reg.jpg')", // You can replace with your login image
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundColor: '#edfafe',
      padding: '20px',
      marginTop: '60px',
      marginBottom: '60px',
      height: 'calc(100vh - 120px)',
      width: 'calc(100vh - 120px)',
      maxWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    formBox: {
      width: '90%',
      maxWidth: '400px',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      fontFamily: 'Segoe UI, sans-serif',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    input: {
      width: '93%',
      padding: '12px',
      margin: '10px 0',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
    },
    checkbox: {
      marginTop: '10px',
      fontSize: '14px',
    },
    button: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: '#1A1F70',
      color: '#fff',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '15px',
    },
    message: {
      textAlign: 'center',
      marginTop: '15px',
      fontSize: '14px',
      color: '#444',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.imageSide}></div>
      <div style={styles.formContainer}>
        <div style={styles.formBox}>
          <h2 style={styles.title}>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
              required
              autoComplete="username"
              style={styles.input}
            />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              style={styles.input}
            />
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
              />{' '}
              Show Password
            </label>
            <button
              type="submit"
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
