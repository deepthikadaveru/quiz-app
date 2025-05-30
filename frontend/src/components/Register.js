import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStrongPassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      return setMessage('⚠️ Please fill in all fields.');
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return setMessage('⚠️ Invalid email format.');
    }

    if (!isStrongPassword(password)) {
      return setMessage(
        '⚠️ Password must include upper, lower, number, special char, and be 8+ chars.'
      );
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5002/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.text();
      if (response.ok) {
        setMessage('✅ Registered successfully!');
        setFormData({ username: '', email: '', password: '' });
      } else {
        setMessage(`❌ ${data}`);
      }
    } catch (error) {
      setMessage('❌ Error during registration.');
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
      backgroundImage: "url('/images/reg2.jpg')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundColor: '#edfafe',
      padding: '20px',
      marginTop: '60px',
      marginBottom: '60px',
      height: 'calc(100vh - 120px)',  // height based on viewport height minus margins
      width: 'calc(100vh - 120px)',   // width equal to height to make it square
      maxWidth: '100%',               // prevents overflow on smaller screens
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
          <h2 style={styles.title}>Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <div style={styles.checkbox}>
              <label>
                <input
                  type="checkbox"
                  onChange={() => setShowPassword((prev) => !prev)}
                />{' '}
                Show Password
              </label>
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
