require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./Models/users');
const Game = require('./Models/games');

const app = express();
app.use(cors());
app.use(express.json());

const SEED_GAMES = [
  {
    title: 'Mystic Realms',
    developer: 'Phantom Studios',
    ESRB: 'E',
    price: 49.99,
    originalPrice: 59.99,
    discountPercentage: 17,
    genre: 'Fantasy RPG',
    genres: ['RPG', 'Fantasy'],
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1562576650-27130b06c0ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwZ2FtZSUyMGNvdmVyJTIwYXJ0fGVufDF8fHx8MTc3NDQ3MDk1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Embark on an epic journey through mystical lands filled with ancient magic and legendary creatures.',
    tags: ['RPG', 'Fantasy', 'Open World', 'Multiplayer'],
    isActive: true,
    releaseDate: new Date('2023-03-15'),
  },
  {
    title: 'Galactic Frontier',
    developer: 'Nova Games',
    ESRB: 'E',
    price: 39.99,
    discountPercentage: 0,
    genre: 'Sci-Fi Adventure',
    genres: ['Sci-Fi', 'Adventure'],
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1765881736141-bda98391c3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBnYW1lJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc3NDQ3MDk1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Explore the far reaches of space in this thrilling sci-fi adventure with stunning visuals.',
    tags: ['Sci-Fi', 'Exploration', 'Story-Rich', 'Single Player'],
    isActive: true,
    releaseDate: new Date('2023-06-20'),
  },
  {
    title: 'Street Racer X',
    developer: 'Velocity Interactive',
    ESRB: 'E10',
    price: 29.99,
    originalPrice: 39.99,
    discountPercentage: 25,
    genre: 'Racing',
    genres: ['Racing', 'Action'],
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1723360480597-d21deccaf3d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWNpbmclMjBjYXIlMjBnYW1lfGVufDF8fHx8MTc3NDM5MzkzN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Feel the adrenaline rush in intense street racing action with customizable vehicles.',
    tags: ['Racing', 'Action', 'Multiplayer', 'Competitive'],
    isActive: true,
    releaseDate: new Date('2023-09-01'),
  },
  {
    title: 'The Haunting',
    developer: 'Shadow Works',
    ESRB: 'M',
    price: 24.99,
    discountPercentage: 0,
    genre: 'Horror',
    genres: ['Horror', 'Atmospheric'],
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1551536637-f5f1984f1398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3Jyb3IlMjBkYXJrJTIwYXRtb3NwaGVyZXxlbnwxfHx8fDE3NzQzOTg3ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Experience pure terror in this atmospheric horror game that will keep you on edge.',
    tags: ['Horror', 'Atmospheric', 'Psychological', 'Single Player'],
    isActive: true,
    releaseDate: new Date('2023-10-31'),
  },
  {
    title: 'Mountain Explorer',
    developer: 'Peak Studios',
    ESRB: 'E10',
    price: 34.99,
    discountPercentage: 0,
    genre: 'Adventure',
    genres: ['Adventure', 'Survival'],
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1673505413397-0cd0dc4f5854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZHZlbnR1cmUlMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzQ0NzA3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Scale treacherous peaks and discover hidden secrets in this breathtaking adventure game.',
    tags: ['Adventure', 'Exploration', 'Survival', 'Beautiful'],
    isActive: true,
    releaseDate: new Date('2024-01-10'),
  },
  {
    title: 'Neon Runners',
    developer: 'Neon Labs',
    ESRB: 'T',
    price: 44.99,
    originalPrice: 54.99,
    discountPercentage: 18,
    genre: 'Cyberpunk Action',
    genres: ['Cyberpunk', 'Action'],
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1641650265007-b2db704cd9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwY2l0eXxlbnwxfHx8fDE3NzQzNjkwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Navigate a dystopian future in this fast-paced cyberpunk action game with stunning neon aesthetics.',
    tags: ['Cyberpunk', 'Action', 'Fast-Paced', 'Story-Rich'],
    isActive: true,
    releaseDate: new Date('2024-03-15'),
  },
];

function transformGame(game) {
  const g = game.toObject ? game.toObject() : { ...game };
  return { ...g, id: g._id.toString() };
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const count = await Game.countDocuments();
    if (count === 0) {
      await Game.insertMany(SEED_GAMES);
      console.log('Games seeded');
    }
  })
  .catch((err) => console.log(err));

app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find({ isActive: true }).sort({ rating: -1 });
    res.status(200).json({ games: games.map(transformGame), error: '' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json({ game: transformGame(game), error: '' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'Game not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'An account with that email already exists' });
    }

    const newUser = new User({ username, email: email.toLowerCase(), password });
    const saved = await newUser.save();

    res.status(201).json({ id: saved._id.toString(), username: saved.username, error: '' });
  } catch {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ id: user._id.toString(), username: user.username, error: '' });
  } catch {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

app.post('/api/purchase', async (req, res) => {
  const { userId, gameIds } = req.body;

  if (!userId || !Array.isArray(gameIds) || gameIds.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const alreadyOwned = new Set(user.gamesLibrary.map((id) => id.toString()));
    const newIds = gameIds
      .filter((id) => !alreadyOwned.has(id))
      .map((id) => {
        try { return new mongoose.Types.ObjectId(id); }
        catch { return null; }
      })
      .filter(Boolean);

    user.gamesLibrary.push(...newIds);
    await user.save();

    res.status(200).json({ error: '' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/library/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('gamesLibrary');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ games: user.gamesLibrary.map(transformGame), error: '' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ error: 'User not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/addcard', (req, res) => {
  res.status(200).json({ error: '' });
});

app.post('/api/searchcards', (req, res) => {
  res.status(200).json({ results: [], error: '' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
