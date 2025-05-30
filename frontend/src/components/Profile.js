import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5002/api/users/${userId}`, {
      headers: { Authorization: token }
    })
    .then(res => {
      setUser(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  if (!user) return <div>User not found</div>;

  const scores = user.scores || [];
  const latestScore = scores[scores.length - 1];
  const highestScore = Math.max(...scores.map(s => s.score || 0), 0);
  const averageScore = scores.length ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0;

  const categoryCount = {};
  const categoryAvg = {};
  scores.forEach(s => {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
    categoryAvg[s.category] = (categoryAvg[s.category] || 0) + s.score;
  });

  Object.keys(categoryAvg).forEach(cat => {
    categoryAvg[cat] = Math.round(categoryAvg[cat] / categoryCount[cat]);
  });

  const mostPlayedCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const bestCategory = Object.entries(categoryAvg).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  const worstCategory = Object.entries(categoryAvg).sort((a, b) => a[1] - b[1])[0]?.[0] || '—';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const downloadCSV = () => {
    const csvContent = [
      ['Date', 'Category', 'Score', 'TimeTaken(s)', 'Accuracy(%)'],
      ...scores.map(s => {
        const correct = Object.entries(s.answers || {}).filter(([i, ans]) => ans === (s.questions?.[i]?.answer)).length;
        const accuracy = s.questions?.length ? Math.round((correct / s.questions.length) * 100) : 0;
        return [new Date(s.date).toLocaleDateString(), s.category, s.score, s.timeTaken, accuracy];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz_history_${user.username}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chartData = scores.map((s, i) => ({
    name: `Quiz ${i + 1}`,
    score: s.score,
    category: s.category
  }));

  const barData = Object.entries(categoryAvg).map(([cat, avg]) => ({
    category: cat,
    average: avg
  }));

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 {user.username}'s Profile</h2>
        <p><strong>Email:</strong> {user.email}</p>

        {/* Stats Summary */}
        <div style={styles.statsGrid}>
          <Stat label="Total Quizzes" value={scores.length} />
          <Stat label="Highest Score" value={highestScore} />
          <Stat label="Average Score" value={averageScore} />
          <Stat label="Most Played" value={mostPlayedCategory} />
          <Stat label="Best Category" value={bestCategory} />
          <Stat label="Needs Work" value={worstCategory} />
        </div>

        {/* Chart: Score Over Time */}
        <h3 style={styles.chartTitle}>📈 Score Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        {/* Chart: Avg Score by Category */}
        <h3 style={styles.chartTitle}>📊 Avg Score by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>

        {/* Table of Recent Scores */}
        <h3 style={styles.chartTitle}>📝 Quiz History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Score</th>
                <th>Time (s)</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => {
                const correct = Object.entries(s.answers || {}).filter(([i, ans]) => ans === (s.questions?.[i]?.answer)).length;
                const accuracy = s.questions?.length ? Math.round((correct / s.questions.length) * 100) : 0;
                return (
                  <tr key={i}>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td>{s.category}</td>
                    <td>{s.score}</td>
                    <td>{s.timeTaken}</td>
                    <td>{accuracy}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div style={styles.buttonRow}>
          <button onClick={() => window.location.href = `/quiz/${latestScore?.category || 1}`} style={styles.button}>Retake Last Quiz</button>
          <button onClick={downloadCSV} style={styles.button}>Download CSV</button>
          <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: '#ef4444' }}>Logout</button>
        </div>
      </div>
    </div>
  );
}

// 🔹 Stat box
function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

// 🔹 Styles
const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '26px',
    marginBottom: '20px',
    color: '#111827'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
    marginTop: '20px'
  },
  statBox: {
    backgroundColor: '#f3f4f6',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827'
  },
  chartTitle: {
    fontSize: '18px',
    margin: '30px 0 10px',
    color: '#374151'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    marginBottom: '30px'
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    padding: '10px 18px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    fontSize: '20px'
  }
};
