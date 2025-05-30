import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Trophy, Award, Target, RotateCcw, Home, Star, Zap, CheckCircle
} from 'lucide-react';

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

const categoryThemes = {
  /* same theme object as before */
  1: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: '#667eea',
    icon: '🎬',
    pattern: 'radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)'
  },
  2: {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: '#f093fb',
    icon: '🎵',
    pattern: 'radial-gradient(circle at 25% 25%, rgba(240, 147, 251, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(245, 87, 108, 0.3) 0%, transparent 50%)'
  },
  3: {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accent: '#4facfe',
    icon: '⚽',
    pattern: 'radial-gradient(circle at 30% 70%, rgba(79, 172, 254, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(0, 242, 254, 0.3) 0%, transparent 50%)'
  },
  4: {
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    accent: '#fa709a',
    icon: '🌸',
    pattern: 'radial-gradient(circle at 40% 20%, rgba(250, 112, 154, 0.4) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(254, 225, 64, 0.3) 0%, transparent 50%)'
  },
  5: {
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    accent: '#a8edea',
    icon: '🔬',
    pattern: 'radial-gradient(circle at 15% 85%, rgba(168, 237, 234, 0.4) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(254, 214, 227, 0.3) 0%, transparent 50%)'
  },
  6: {
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    accent: '#fcb69f',
    icon: '📚',
    pattern: 'radial-gradient(circle at 35% 65%, rgba(255, 236, 210, 0.4) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(252, 182, 159, 0.3) 0%, transparent 50%)'
  },
  7: {
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    accent: '#ff9a9e',
    icon: '💻',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(255, 154, 158, 0.4) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(254, 207, 239, 0.3) 0%, transparent 50%)'
  },
  8: {
    gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)',
    accent: '#ffeaa7',
    icon: '🕉️',
    pattern: 'radial-gradient(circle at 45% 25%, rgba(255, 234, 167, 0.4) 0%, transparent 50%), radial-gradient(circle at 55% 75%, rgba(250, 177, 160, 0.3) 0%, transparent 50%)'
  },
  9: {
    gradient: 'linear-gradient(135deg, #81ecec 0%, #6c5ce7 100%)',
    accent: '#81ecec',
    icon: '🌍',
    pattern: 'radial-gradient(circle at 60% 40%, rgba(129, 236, 236, 0.4) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(108, 92, 231, 0.3) 0%, transparent 50%)'
  },
  10: {
    gradient: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    accent: '#fdcb6e',
    icon: '🍳',
    pattern: 'radial-gradient(circle at 25% 75%, rgba(253, 203, 110, 0.4) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(225, 112, 85, 0.3) 0%, transparent 50%)'
  },
  11: {
    gradient: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    accent: '#fd79a8',
    icon: '👗',
    pattern: 'radial-gradient(circle at 30% 30%, rgba(253, 121, 168, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(253, 203, 110, 0.3) 0%, transparent 50%)'
  },
  12: {
    gradient: 'linear-gradient(135deg, #ff7675 0%, #74b9ff 100%)',
    accent: '#ff7675',
    icon: '🕉️',
    pattern: 'radial-gradient(circle at 25% 75%, rgba(255, 118, 117, 0.4) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(116, 185, 255, 0.3) 0%, transparent 50%)'
  }
};


const SAFE_THEME = {
  gradient: '#ffffff',
  accent: '#333333',
  icon: '❓',
  pattern: ''
};


export default function QuizResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(t);
  }, []);

  const {
    answers = {},
    questions = [],
    timeTaken = 0,
    date = new Date().toISOString(),
    score = 0,
    totalQuestions = 0,
  } = state;

  if (!location.state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">No quiz data available</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back Home
          </button>
        </div>
      </div>
    );
  }

  const theme = categoryThemes[state.categoryId] || SAFE_THEME;

  const correctCount = Object.entries(answers).filter(
    ([questionIndex, userAnswer]) => {
      const qIndex = Number(questionIndex);
      const correctAnswer = questions[qIndex]?.answer;
  
      return (
        typeof userAnswer === 'string' &&
        typeof correctAnswer === 'string' &&
        userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
      );
    }
  ).length;
  
  const difficultyPoints = { easy: 10, medium: 20, hard: 40 };

const maxPoints = questions.reduce(
  (sum, q) => sum + (difficultyPoints[q.difficulty] || 0),
  0
);



const percentage = totalQuestions > 0
  ? Math.round((score / 200) * 100)
  : 0;
  const cpercentage = totalQuestions > 0
  ? Math.round((correctCount / 10) * 100)
  : 0;

  const getPerf = () => {
    if (percentage >= 90) return { lvl: 'Outstanding!', col: '#10b981', Icon: Trophy };
    if (percentage >= 80) return { lvl: 'Excellent!',  col: '#3b82f6', Icon: Award  };
    if (percentage >= 70) return { lvl: 'Good Job!',    col: '#8b5cf6', Icon: Target };
    if (percentage >= 60) return { lvl: 'Not Bad!',      col: '#f59e0b', Icon: Star   };
    return                                { lvl: 'Keep Trying!', col:'#ef4444', Icon: Zap };
  };
  const { lvl, col, Icon } = getPerf();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: '#edfafe',
        backgroundImage: theme.pattern,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1.875rem",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          padding: "2.5rem",
          maxWidth: "64rem",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "700",
            textAlign: "center",
            color: "#1f2937", // gray-800
          }}
        >
          Quiz Results
        </h1>
  
        {/* 2x2 Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}
        >
          {/* Correct Count */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              backgroundColor: "#dbeafe", // blue-50
              borderRadius: "1rem",
            }}
          >
            <CheckCircle
              size={100}
              color={theme.accent}
              style={{ marginBottom: "0.5rem" }}
            />
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
              }}
            >
              {correctCount}
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                color: "#4b5563", // gray-600
              }}
            >
              Correct
            </div>
          </div>
  
          {/* Incorrect Count */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              backgroundColor: "#dbeafe", // red-50
              borderRadius: "1rem",
            }}
          >
            <Target
              size={100}
              color={theme.accent}
              style={{ marginBottom: "0.5rem" }}
            />
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "700",
              }}
            >
              {totalQuestions - correctCount}
            </div>
            <div
              style={{
                fontSize: "1.125rem",
                color: "#4b5563",
              }}
            >
              Incorrect
            </div>
          </div>
          </div>
          {/* Points Scored */}
          <div
  style={{
    display: "flex",
    gap: "3rem",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2rem",
  }}
>
  {/* Left side: Points Card + formula */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "1rem",
      minWidth: "280px", // smaller width for points box
      backgroundColor: "#dbeafe", // green-50
      padding: "1.5rem",
      borderRadius: "1rem",
    }}
  >
    {/* Points Scored Card */}
    <div
      style={{
        fontSize: "2.25rem",
        fontWeight: "700",
        marginBottom: "0.25rem",
      }}
    >
      {score} / {maxPoints}
    </div>
    <div
      style={{
        fontSize: "1.125rem",
        color: "#4b5563",
        marginBottom: "1rem",
      }}
    >
      Points Scored
    </div>

    {/* Points calculation formula */}
    <div style={{ fontSize: "1rem", color: "#374151", lineHeight: "1.4" }}>
      <div><strong>Calculation:</strong></div>
      <div>a * 10 + b * 20 + c * 40</div>
      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
        a = correct answers (Q1–Q4)<br />
        b = correct answers (Q5–Q8)<br />
        c = correct answers (Q9–Q10)
      </div>
    </div>
  </div>

  {/* Right side: Circle + message + time */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
    }}
  >
    <svg width="240" height="240" >
  {/* Background circle */}
  <circle
    cx="120"
    cy="120"
    r="100"
    stroke="#e5e7eb"
    strokeWidth="16"
    fill="none"
  />
  {/* Foreground arc */}
  <circle
    cx="120"
    cy="120"
    r="100"
    stroke={theme.accent}
    strokeWidth="16"
    fill="none"
    strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 100)} ${
      2 * Math.PI * 100
    }`}
    strokeDashoffset={2 * Math.PI * 100 * 0.25}
    strokeLinecap="round"
    style={{ transition: "stroke-dasharray 1s ease-out" }}
  />
  {/* Percentage Label */}
  <text
    x="120"
    y="130"
    textAnchor="middle"
    fontSize="32"
    fontWeight="bold"
    fill="#333"
  >
    {percentage}%
  </text>
</svg>

    {/* Performance Level Message */}
    <div
      style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        color: col,
        textAlign: "center",
      }}
    >
      {lvl}
    </div>

    {/* Time & Date */}
    <div
      style={{
        display: "flex",
        flexDirection: window.innerWidth >= 768 ? "row" : "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#4b5563",
        gap: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Star size={0} />
        <span>
          <strong>Time Taken:</strong> {timeTaken}s
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Zap size={20} />
        <span>
          <strong>Taken On:</strong> {new Date(date).toLocaleString()}
        </span>
      </div>
    </div>
  </div>
</div>
        {/* Review Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>#</th>
                <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>
                  Question
                </th>
                <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>
                  Your Answer
                </th>
                <th style={{ padding: "0.5rem 1rem", textAlign: "left" }}>
                  Correct Answer
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => {
                const yours = answers[i] ?? "—";
                const correct = yours === q.answer;
                return (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: correct ? "transparent" : "#fee2e2",
                    }}
                  >
                    <td
                      style={{
                        borderTop: "1px solid #e5e7eb",
                        padding: "0.75rem 1rem",
                        verticalAlign: "top",
                      }}
                    >
                      {i + 1}
                    </td>
                    <td
                      style={{
                        borderTop: "1px solid #e5e7eb",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      {q.question}
                    </td>
                    <td
                      style={{
                        borderTop: "1px solid #e5e7eb",
                        padding: "0.75rem 1rem",
                        color: correct ? "#16a34a" : "#dc2626", // green-600/red-600
                      }}
                    >
                      {yours}
                    </td>
                    <td
                      style={{
                        borderTop: "1px solid #e5e7eb",
                        padding: "0.75rem 1rem",
                      }}
                    >
                      {q.answer}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
  
        {/* Actions */}
        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth >= 768 ? "row" : "column",
            gap: "1rem",
          }}
        >
          <button
            onClick={() => navigate(`/quiz/${state.categoryId}`)}
            style={{
              flex: 1,
              padding: "0.75rem 0",
              backgroundColor: "#16a34a",
              color: "white",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: "500",
              cursor: "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#15803d")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#16a34a")}
          >
            <RotateCcw size={20} />
            Retake Quiz
          </button>
  
          <button
            onClick={() => navigate("/")}
            style={{
              flex: 1,
              padding: "0.75rem 0",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              borderRadius: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: "500",
              cursor: "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#d1d5db")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#e5e7eb")}
          >
            <Home size={20} />
            Back Home
          </button>
        </div>
      </div>
    </div>
  );
}