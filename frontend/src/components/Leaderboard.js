import React, { useEffect, useState } from 'react';
import axios from 'axios';

const categoryMap = {
  1: 'Movies & TV Shows',
  2: 'Music and Lyrics',
  3: 'Sports and Games',
  4: 'Anime and Cartoons',
  5: 'Science & Inventions',
  6: 'General Knowledge',
  7: 'Technology & Gadgets',
  8: 'Indian Culture & Festivals',
  9: 'World Geography',
  10: 'Food & Cooking',
  11: 'Fashion & Style',
  12: 'Indian Mythology',
};

export default function Leaderboard() {
  const [selectedCat, setSelectedCat] = useState('1');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5002/api/leaderboard/${categoryMap[selectedCat]}`)
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to fetch leaderboard:', err))
      .finally(() => setLoading(false));
  }, [selectedCat]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏆 Leaderboard</h2>

      <div style={styles.selectWrapper}>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          style={styles.select}
        >
          {Object.entries(categoryMap).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No data</td></tr>
            ) : (
              data.map((user, index) => (
                <tr
                  key={index}
                  style={user.userId === currentUserId ? styles.highlightRow : {}}
                >
                  <td>#{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.score}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#111827',
    textAlign: 'center'
  },
  selectWrapper: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  select: {
    padding: '8px',
    fontSize: '16px'
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 18px rgba(0,0,0,0.05)'
  },
  highlightRow: {
    backgroundColor: '#e0f2fe'
  },
  'td, th': {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'left'
  }
};
