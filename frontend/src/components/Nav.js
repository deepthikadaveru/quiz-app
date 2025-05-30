import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../auth';

const styles = {
  nav: {
    backgroundColor: '#1A1F71',
    width: '98%', 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '1rem',
  },
 
  title: {
    color: '#fff', // Deep Navy Blue
    fontWeight: '800',
    fontSize: '35px',
    textDecoration: 'none',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    cursor: 'pointer',
  },
  linkContainer: {
    color: '#fff',
    display: 'flex',
    gap: '24px',
    justifyContent: 'flex-end',  // This pushes items to the right
    alignItems: 'center',   
    padding: '18px',     // Optional: aligns items vertically
    flex: 1     
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '18px',
    paddingBottom: '4px',
    transition: 'color 0.3s, border-bottom 0.3s',
    borderBottom: '2px solid transparent',
  },
  linkHover: {
    color: '#D4AF37',
    borderBottom: '2px solidrgb(248, 218, 45)',
  },
  buttonLogout: {
    backgroundColor: '#fff',
    color: '#1A1F71',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '17px',
    transition: 'background-color 0.3s ease',
  },
  buttonLogoutHover: {
    backgroundColor: '#f1f1f1',
  },
};

function Nav() {
  const [token, setToken] = useState(getToken());
  const [hoveredLink, setHoveredLink] = useState(null);
  const [logoutHover, setLogoutHover] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateToken = () => setToken(getToken());
  
    window.addEventListener('login', updateToken);
    window.addEventListener('storage', updateToken);
  
    return () => {
      window.removeEventListener('login', updateToken);
      window.removeEventListener('storage', updateToken);
    };
  }, []);
  

  const logout = () => {
    removeToken();
    setToken(null);
    navigate('/login');
  };

  const handleMouseEnter = (link) => setHoveredLink(link);
  const handleMouseLeave = () => setHoveredLink(null);

  return (
    <nav style={styles.nav}>
      <div
        style={{
          width: '100%',      // center horizontally
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',

        }}
      >
        <Link to="/" style={styles.title}>
          QuizHive
        </Link>

        <div style={styles.linkContainer}>
          {/* your links */}
          
          {token ? (
            <>
              <Link
                to="/profile"
                style={{
                  ...styles.link,
                  ...(hoveredLink === 'profile' ? styles.linkHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter('profile')}
                onMouseLeave={handleMouseLeave}
              >
                Profile
              </Link>
              <Link
                to="/leaderboard"
                style={{
                  ...styles.link,
                  ...(hoveredLink === 'leaderboard' ? styles.linkHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter('leaderboard')}
                onMouseLeave={handleMouseLeave}
              >
                Leaderboard
              </Link>
              
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  ...styles.link,
                  ...(hoveredLink === 'login' ? styles.linkHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter('login')}
                onMouseLeave={handleMouseLeave}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  ...styles.link,
                  ...(hoveredLink === 'register' ? styles.linkHover : {}),
                }}
                onMouseEnter={() => handleMouseEnter('register')}
                onMouseLeave={handleMouseLeave}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {token && (
          <button
            style={{
              ...styles.buttonLogout,
              ...(logoutHover ? styles.buttonLogoutHover : {}),
            }}
            onClick={logout}
            onMouseEnter={() => setLogoutHover(true)}
            onMouseLeave={() => setLogoutHover(false)}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );

}

export default Nav;
