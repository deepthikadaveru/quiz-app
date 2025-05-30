import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 1, name: 'Movies & TV Shows', image: '/images/movies.jpg' },
  { id: 2, name: 'Music & Lyrics', image: '/images/music.jpg' },
  { id: 3, name: 'Sports and Games', image: '/images/sports.jpg' },
  { id: 4, name: 'Anime & Cartoons', image: '/images/anime.jpg' },
  { id: 5, name: 'Science & Inventions', image: '/images/science.jpg' },
  { id: 6, name: 'General Knowledge', image: '/images/gk.jpg' },
  { id: 7, name: 'Technology & Gadgets', image: '/images/tech.jpg' },
  { id: 8, name: 'Indian Culture & Festivals', image: '/images/culture.jpg' },
  { id: 9, name: 'World Geography', image: '/images/geography.jpg' },
  { id: 10, name: 'Food & Cooking', image: '/images/food.jpg' },
  { id: 11, name: 'Fashion & Style', image: '/images/fashion.jpg' },
  { id: 12, name: 'Indian Mythology', image: '/images/mythology.jpg' },
];

function Home() {
  const navigate = useNavigate();

  const goToQuiz = (id) => {
    navigate(`/quiz/${id}`);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Choose a Quiz Category</h1>
      <div style={styles.grid}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={styles.card}
            onClick={() => goToQuiz(cat.id)}
            className="card"
          >
            <img src={cat.image} alt={cat.name} style={styles.image} />
            <div style={styles.cardTitle}>{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#edfafe',
    padding: '50px 6%',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    animation: 'fadeIn 0.6s ease-in-out',
  },
  heading: {
    fontSize: '36px',
    color: '#1A1F71',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '50px',
    letterSpacing: '0.5px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '28px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '18px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'all 0.35s ease',
    backdropFilter: 'blur(6px)',
  },
  image: {
    width: '100%',
    height: '250px',
    aspectRatio: '1 / 1', 
    objectFit: 'cover',
    borderTopLeftRadius: '18px',
  borderTopRightRadius: '18px',
  },
  cardTitle: {
    padding: '16px 12px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#1A1F71',
    textAlign: 'center',
    letterSpacing: '0.3px',
  },
};

// Extra styles via CSS for hover/animation
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
  .card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

export default Home;
