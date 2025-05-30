// 📦 Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// 🔧 Config
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🗃️ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected')).catch(err => console.error(err));

// 📂 Schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  scores: [
    {
      category: String, // e.g., "Science", "Math"
      score: Number,
      timeTaken: Number, // seconds
      date: Date,
      answers: Object, // key: question index, value: selected option
      questions: Array       // timestamp of when quiz was taken
    }
  ],
});

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  category: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
});

const User = mongoose.model('User', userSchema);
const Question = mongoose.model('Question', questionSchema);

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


// 🔐 Middleware
// 🔐 Middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) 
    return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;         // { _id: '...', iat, exp }
    return next();
  } catch (err) {
    // <— add the return here so route handler never executes
    return res.status(400).send('Invalid Token');
  }
};


// 📌 Auth Routes
const validator = require('validator'); // Add at top with other requires

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Empty check
  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  // 2. Email format check
  if (!validator.isEmail(email)) {
    return res.status(400).send('Invalid email format');
  }

  // 3. Password strength check
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).send('Password must be 8+ chars with upper, lower, number, and special char');
  }

  // 4. Uniqueness checks
  const existingEmail = await User.findOne({ email });
  if (existingEmail) return res.status(400).send('Email already in use');

  const existingUsername = await User.findOne({ username });
  if (existingUsername) return res.status(400).send('Username already taken');

  // 5. Save user
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashed });
  await newUser.save();

  res.send('Registered successfully');
});


app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const id = req.params.id; 
    const user = await User.findOne({ email });

    if (!user) return res.status(401).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token);

    // Return token, userId, and usernamean
    res.json({ token, userId: user._id, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// Route: Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// 📚 Quiz Routes
app.get('/api/quiz/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const categoryName = categoryMap[id];

  if (!categoryName) {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  try {
    const questions = await Question.find({ category: categoryName });

    if (!questions.length) {
      return res.status(404).json({ error: 'No questions found for this category' });
    }

    const easyQs = questions.filter(q => q.difficulty === 'easy');
    const mediumQs = questions.filter(q => q.difficulty === 'medium');
    const hardQs = questions.filter(q => q.difficulty === 'hard');

    function shuffleArray(array) {
      const arr = array.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function pickRandom(arr, n) {
      return shuffleArray(arr).slice(0, n);
    }

    const easyCount = Math.min(4, easyQs.length);
    const mediumCount = Math.min(4, mediumQs.length);
    const hardCount = Math.min(2, hardQs.length);

    const selectedEasy = pickRandom(easyQs, easyCount);
    const selectedMedium = pickRandom(mediumQs, mediumCount);
    const selectedHard = pickRandom(hardQs, hardCount);

    let combined = [...selectedEasy, ...selectedMedium, ...selectedHard];
    combined = shuffleArray(combined);

    res.json(combined.slice(0, 10));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



// 📝 Submit Quiz
app.post('/api/submit', auth,  async (req, res) => {
  console.log('🔹 /api/submit hit — raw body:', req.body);

  // ↓ remove or comment out any manual 400 checks here ↓
  // if (/* bad shape */) return res.status(400).json({ error: 'Bad Request' })

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { score, timeTaken, category, date, answers, questions } = req.body;
    if (
      score === undefined || timeTaken === undefined ||
      !category || !date || !answers || !questions
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const entry = {
      category: categoryMap[String(category)] || categoryMap['1'],
      score,
      timeTaken,
      date: new Date(date),
      answers,
      questions
    };

    user.scores.push(entry);
    await user.save();
    console.log('✅ Saved to DB:', entry);
    return res.json(entry);

  } catch (err) {
    console.error('❌ Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});






// 📈 Leaderboard
app.get('/api/leaderboard/:category', async (req, res) => {
  const users = await User.find();
  const leaderboard = users.map(u => {
    const scores = u.scores.filter(s => s.category === req.params.category);
    const top = Math.max(...scores.map(s => s.score), 0);
    return { username: u.username, score: top };
  });
  res.json(leaderboard.sort((a, b) => b.score - a.score));
});

// 📊 Progress Graph Data
app.get('/api/progress', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.scores);
});

// ⚙️ Admin Upload Questions (CSV)
const upload = multer({ dest: 'uploads/' });
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', data => results.push(data))
    .on('end', async () => {
      for (let r of results) {
        const q = new Question({
          question: r.question,
          options: [r.option1, r.option2, r.option3, r.option4],
          answer: r.answer,
          category: r.category,
        });
        await q.save();
      }
      fs.unlinkSync(req.file.path);
      res.send('Questions uploaded');
    });
});

// 🧪 Test Route
app.get('/', (req, res) => {
  res.send('Quiz API is running!');
});

// 🚀 Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
