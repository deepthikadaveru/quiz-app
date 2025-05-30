import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ─── Hooks (always at top) ───────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState(null);

  const timerRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  // 1️⃣ Fetch questions once
  useEffect(() => {
    axios
      .get(`http://localhost:5002/api/quiz/${id}`)
      .then(res => {
        const all = res.data;
        const easy = all.filter(q => q.difficulty === 'easy');
        const med  = all.filter(q => q.difficulty === 'medium');
        const hard = all.filter(q => q.difficulty === 'hard');
        const pick = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

        const selected = [
          ...pick(easy, 4),
          ...pick(med,  4),
          ...pick(hard, 2)
        ];
        setQuestions(selected);
        setQuizStartTime(Date.now());
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // 2️⃣ Timer effect (restarts on question change)
  useEffect(() => {
    if (!loading && questions.length) {
      setTimeLeft(10);
      setShowAnswerFeedback(false);
  
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setAnswers(a => {
              if (!(currentQIndex in a)) {
                return { ...a, [currentQIndex]: null };
              }
              return a;
            });
            triggerFeedback(); // show feedback or move to next question
            return 0;
          }
          
          
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, [currentQIndex, loading, questions.length]);
  

  // 3️⃣ Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(feedbackTimerRef.current);
    };
  }, []);
  useEffect(() => {
    // When the last question has an answer saved, finish quiz
    if (
      currentQIndex === questions.length - 1 &&
      answers.hasOwnProperty(currentQIndex) &&
      showAnswerFeedback === false // ensure feedback finished
    ) {
      finishQuiz();
    }
    // We want this effect to run when answers or currentQIndex change
  }, [answers, currentQIndex, showAnswerFeedback, questions.length]);
  

  // ─── Conditional early returns (after hooks) ─────────────────────────────
  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }
  if (questions.length === 0) {
    return <div style={styles.loading}>No questions found for this category.</div>;
  }

  // ─── Handlers & render logic ─────────────────────────────────────────────
  const triggerFeedback = () => {
    setShowAnswerFeedback(true);
    feedbackTimerRef.current = setTimeout(() => {
      setShowAnswerFeedback(false);
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(i => i + 1);
      }
      // Don't call finishQuiz here for last question, useEffect will handle it
    }, 2000);
  };
  

  const handleAnswerSelect = opt => {
    if (showAnswerFeedback) return;
    const curr = questions[currentQIndex];
    if (opt === curr.answer) {
      const pts = { easy:10, medium:20, hard:40 }[curr.difficulty] || 0;
      setScore(s => s + pts);
    }
    setAnswers(a => ({ ...a, [currentQIndex]: opt }));
    clearInterval(timerRef.current);
    triggerFeedback();
  };

  const finishQuiz = async () => {
    const totalTime = Math.floor((Date.now() - quizStartTime) / 1000);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }
      console.log("Data being submitted:", {
        score,
        timeTaken: totalTime,
        category: Number(id),
        date: new Date().toISOString(),
        answers,
        questions
      });
      console.log("Token:", token);
      
      await axios.post(
        'http://localhost:5002/api/submit',
        {
          score,
          timeTaken: totalTime,
          category: Number(id),
          date: new Date().toISOString(),
          answers,
          questions
        },
        { headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
    }

        
      );
    } catch (err) {
      console.error(err);
    }
    navigate('/results', {
      state: {
        score,
        totalQuestions: questions.length,
        categoryId: id,
        timeTaken: totalTime,
        answers,
        questions
      }
    });
  };

  // Render the current question
  const q = questions[currentQIndex];
  const correct = q.answer;

  return (
    <div style={{ ...styles.container, backgroundColor: bgByCategory(id) }}>
      <div style={styles.card}>
        {/* Meta */}
        <h2 style={styles.title}>Quiz Category: {id}</h2>
        <div style={styles.metaRow}>
          <span style={{ ...styles.difficultyLabel, backgroundColor: { easy:'#4caf50', medium:'#ff9800', hard:'#f44336' }[q.difficulty] }}>
            {q.difficulty.toUpperCase()}
          </span>
          <span style={styles.pointsLabel}>
            Points: {{ easy:10, medium:20, hard:40 }[q.difficulty]}
          </span>
          <span style={styles.questionNumber}>
            Question {currentQIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Question & Options */}
        <p style={styles.question}><strong>{q.question}</strong></p>
        <ul style={styles.optionsContainer}>
          {q.options.map((opt, i) => (
            <li key={i}>
              <button
                style={
                  !showAnswerFeedback
                    ? styles.option
                    : opt === correct
                      ? { ...styles.option, backgroundColor:'#c8e6c9', borderColor:'green' }
                      : (answers[currentQIndex] === opt)
                        ? { ...styles.option, backgroundColor:'#ffcdd2', borderColor:'red' }
                        : styles.option
                }
                onClick={() => handleAnswerSelect(opt)}
                disabled={showAnswerFeedback}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>

        {/* Feedback or Timer */}
        {showAnswerFeedback ? (
          <p style={styles.feedback}>
            {answers[currentQIndex] === correct ? '🎉 Correct!' : '❌ Incorrect.'}
          </p>
        ) : (
          <>
            <p style={styles.timerText}>Time remaining: {timeLeft}s</p>
            <div style={styles.timerBarWrapper}>
              <div style={{ ...styles.timerBar, width: `${(timeLeft/10)*100}%` }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ... include your styles and bgByCategory here ...

// --- 🎨 Internal Styles ---
const styles = {
  container: {
    height: '100vh',
    width: '87vw',
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#ffffffcc',
    borderRadius: '16px',
    padding: '30px',
    width: '100%',
    maxWidth: '700px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    textAlign: 'center'
  },
  title: {
    marginBottom: '15px',
    fontSize: '28px',
    color: '#333'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  difficultyLabel: {
    color: 'white',
    borderRadius: '12px',
    padding: '6px 12px',
    fontSize: '14px',
    letterSpacing: '1px',
  },
  pointsLabel: {
    fontSize: '16px',
    color: '#555',
  },
  questionNumber: {
    fontSize: '16px',
    color: '#555',
  },
  question: {
    fontSize: '20px',
    marginBottom: '25px'
  },
  optionsContainer: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '25px'
  },
  option: {
    display: 'block',
    width: '100%',
    padding: '14px 22px',
    marginBottom: '14px',
    backgroundColor: '#f0f0f0',
    border: '2px solid transparent',
    borderRadius: '10px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  feedback: {
    fontWeight: 'bold',
    fontSize: '22px',
    marginTop: '15px'
  },
  timerText: {
    marginBottom: '8px',
    color: '#555',
    fontSize: '18px',
  },
  timerBarWrapper: {
    height: '10px',
    backgroundColor: '#ddd',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  timerBar: {
    height: '100%',
    backgroundColor: '#007bff',
    transition: 'width 1s linear'
  },
  loading: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '18px'
  }
};

// --- 🎨 Dynamic Backgrounds by Category ---
function bgByCategory(cat) {
  const colors = {
    default: '#edfafe'
  };
  return colors[cat.toLowerCase()] || colors.default;
}


export default Quiz;
