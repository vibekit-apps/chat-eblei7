const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Drawing Apocalypse API running' });
});

// User endpoints
app.post('/api/users', (req, res) => {
  const { username, email } = req.body;
  db.run(
    'INSERT INTO Users (username, email) VALUES (?, ?)',
    [username, email],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, username, email });
    }
  );
});

app.get('/api/users/:id', (req, res) => {
  db.get('SELECT * FROM Users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json(row);
  });
});

// ORB Profile endpoints
app.post('/api/orb-profiles', (req, res) => {
  const { user_id, orb_voice, orb_personality } = req.body;
  db.run(
    'INSERT INTO ORB_Profile (user_id, orb_voice, orb_personality) VALUES (?, ?, ?)',
    [user_id, orb_voice || 'ethereal', orb_personality || 'mystical'],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, user_id });
    }
  );
});

// Drawing categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM Drawing_Categories', (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows || []);
  });
});

// Lessons
app.get('/api/lessons/:categoryId', (req, res) => {
  db.all(
    'SELECT * FROM Drawing_Lessons WHERE category_id = ?',
    [req.params.categoryId],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Get lesson steps
app.get('/api/lessons/:lessonId/steps', (req, res) => {
  db.all(
    'SELECT * FROM Drawing_Steps WHERE lesson_id = ? ORDER BY step_number',
    [req.params.lessonId],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Save a drawing
app.post('/api/drawings', (req, res) => {
  const { user_id, lesson_id, image_reference, notes, completed } = req.body;
  db.run(
    'INSERT INTO Saved_Drawings (user_id, lesson_id, image_reference, notes, completed) VALUES (?, ?, ?, ?, ?)',
    [user_id, lesson_id, image_reference, notes, completed || false],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Get user's drawings
app.get('/api/users/:userId/drawings', (req, res) => {
  db.all(
    'SELECT * FROM Saved_Drawings WHERE user_id = ? ORDER BY saved_at DESC',
    [req.params.userId],
    (err, rows) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

// Game modes
app.get('/api/game-modes', (req, res) => {
  db.all('SELECT * FROM Game_Modes', (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows || []);
  });
});

// Get player progress
app.get('/api/progress/:userId', (req, res) => {
  db.get(
    'SELECT * FROM Player_Progress WHERE user_id = ?',
    [req.params.userId],
    (err, row) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json(row);
    }
  );
});

// Update player progress
app.put('/api/progress/:userId', (req, res) => {
  const { current_chapter, current_wave, highest_level, bosses_defeated, lessons_completed } = req.body;
  db.run(
    'UPDATE Player_Progress SET current_chapter = ?, current_wave = ?, highest_level = ?, bosses_defeated = ?, lessons_completed = ? WHERE user_id = ?',
    [current_chapter, current_wave, highest_level, bosses_defeated, lessons_completed, req.params.userId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// Get settings
app.get('/api/settings/:userId', (req, res) => {
  db.get('SELECT * FROM Settings WHERE user_id = ?', [req.params.userId], (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(row);
  });
});

// Update settings
app.put('/api/settings/:userId', (req, res) => {
  const { sound_enabled, voice_enabled, music_volume, effects_volume, graphics_quality } = req.body;
  db.run(
    'UPDATE Settings SET sound_enabled = ?, voice_enabled = ?, music_volume = ?, effects_volume = ?, graphics_quality = ? WHERE user_id = ?',
    [sound_enabled, voice_enabled, music_volume, effects_volume, graphics_quality, req.params.userId],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// Serve index.html for client-side routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Drawing Apocalypse API listening on port ${PORT}`);
  console.log(`Database initialized at apocalypse.db`);
});
