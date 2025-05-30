import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import Quiz from './components/Quiz';  
import Home from './Home'; // adjust path if needed
import QuizResults from './components/QuizResults';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <div style={{ maxWidth: 1400, margin: 'auto', padding: 20 }}>
        <Nav />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/results" element={<QuizResults />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
