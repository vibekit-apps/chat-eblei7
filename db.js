const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'apocalypse.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Users
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age_confirmed BOOLEAN DEFAULT 0,
      orb_level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      coins INTEGER DEFAULT 0,
      favorite_drawing_category TEXT,
      favorite_game_mode TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. ORB_Profile
  db.run(`
    CREATE TABLE IF NOT EXISTS ORB_Profile (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      orb_level INTEGER DEFAULT 1,
      orb_voice TEXT DEFAULT 'ethereal',
      orb_personality TEXT DEFAULT 'mystical',
      orb_memory_notes TEXT,
      unlocked_avatar_creator BOOLEAN DEFAULT 0,
      current_form TEXT DEFAULT 'sphere',
      halo_color TEXT DEFAULT '#FFD700',
      galaxy_color TEXT DEFAULT '#4B0082',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )
  `);

  // 3. Drawing_Categories
  db.run(`
    CREATE TABLE IF NOT EXISTS Drawing_Categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      is_locked BOOLEAN DEFAULT 0,
      required_level INTEGER DEFAULT 1
    )
  `);

  // 4. Drawing_Lessons
  db.run(`
    CREATE TABLE IF NOT EXISTS Drawing_Lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      style TEXT,
      difficulty TEXT,
      reference_image TEXT,
      total_steps INTEGER,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES Drawing_Categories(id)
    )
  `);

  // 5. Drawing_Steps
  db.run(`
    CREATE TABLE IF NOT EXISTS Drawing_Steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      step_number INTEGER NOT NULL,
      step_image TEXT,
      instruction_text TEXT,
      voice_text TEXT,
      is_current_step BOOLEAN DEFAULT 0,
      FOREIGN KEY (lesson_id) REFERENCES Drawing_Lessons(id)
    )
  `);

  // 6. Saved_Drawings
  db.run(`
    CREATE TABLE IF NOT EXISTS Saved_Drawings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER,
      image_reference TEXT,
      notes TEXT,
      completed BOOLEAN DEFAULT 0,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id),
      FOREIGN KEY (lesson_id) REFERENCES Drawing_Lessons(id)
    )
  `);

  // 7. Game_Modes
  db.run(`
    CREATE TABLE IF NOT EXISTS Game_Modes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      rules TEXT,
      is_locked BOOLEAN DEFAULT 0,
      required_level INTEGER DEFAULT 1
    )
  `);

  // 8. Characters
  db.run(`
    CREATE TABLE IF NOT EXISTS Characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      species TEXT,
      character_type TEXT,
      description TEXT,
      default_element TEXT,
      style TEXT,
      is_locked BOOLEAN DEFAULT 0,
      required_level INTEGER DEFAULT 1
    )
  `);

  // 9. Elements
  db.run(`
    CREATE TABLE IF NOT EXISTS Elements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      element_type TEXT,
      description TEXT,
      damage_type TEXT,
      visual_effect TEXT,
      is_locked BOOLEAN DEFAULT 0,
      required_level INTEGER DEFAULT 1
    )
  `);

  // 10. Avatar_Customizations
  db.run(`
    CREATE TABLE IF NOT EXISTS Avatar_Customizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      species TEXT,
      body_type TEXT,
      face_type TEXT,
      hair_type TEXT,
      scale_type TEXT,
      feather_type TEXT,
      clothing TEXT,
      armor TEXT,
      main_color TEXT,
      secondary_color TEXT,
      selected_element TEXT,
      selected_style TEXT,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )
  `);

  // 11. Weapons
  db.run(`
    CREATE TABLE IF NOT EXISTS Weapons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      weapon_type TEXT,
      damage INTEGER,
      fire_rate REAL,
      ammo_capacity INTEGER,
      recoil REAL,
      unlock_level INTEGER DEFAULT 1,
      cost INTEGER
    )
  `);

  // 12. Player_Weapons
  db.run(`
    CREATE TABLE IF NOT EXISTS Player_Weapons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      weapon_id INTEGER NOT NULL,
      upgrade_level INTEGER DEFAULT 0,
      attachments TEXT,
      equipped BOOLEAN DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES Users(id),
      FOREIGN KEY (weapon_id) REFERENCES Weapons(id)
    )
  `);

  // 13. Zombies
  db.run(`
    CREATE TABLE IF NOT EXISTS Zombies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      zombie_type TEXT,
      health INTEGER,
      damage INTEGER,
      speed REAL,
      behavior TEXT,
      weakness TEXT,
      description TEXT
    )
  `);

  // 14. Bosses
  db.run(`
    CREATE TABLE IF NOT EXISTS Bosses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level_number INTEGER,
      health INTEGER,
      element TEXT,
      attacks TEXT,
      weakness TEXT,
      description TEXT,
      reward_coins INTEGER,
      reward_xp INTEGER
    )
  `);

  // 15. Missions
  db.run(`
    CREATE TABLE IF NOT EXISTS Missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      game_mode TEXT,
      chapter_number INTEGER,
      objective TEXT,
      map_name TEXT,
      enemy_type TEXT,
      boss_id INTEGER,
      reward_coins INTEGER,
      reward_xp INTEGER,
      FOREIGN KEY (boss_id) REFERENCES Bosses(id)
    )
  `);

  // 16. Player_Progress
  db.run(`
    CREATE TABLE IF NOT EXISTS Player_Progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      current_chapter INTEGER DEFAULT 1,
      current_wave INTEGER DEFAULT 1,
      highest_level INTEGER DEFAULT 1,
      bosses_defeated INTEGER DEFAULT 0,
      lessons_completed INTEGER DEFAULT 0,
      elements_unlocked TEXT,
      characters_unlocked TEXT,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )
  `);

  // 17. ORB_Dialogue
  db.run(`
    CREATE TABLE IF NOT EXISTS ORB_Dialogue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      situation TEXT NOT NULL,
      dialogue_text TEXT NOT NULL,
      voice_style TEXT,
      required_level INTEGER DEFAULT 1,
      emotion TEXT
    )
  `);

  // 18. Lore_Entries
  db.run(`
    CREATE TABLE IF NOT EXISTS Lore_Entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      lore_type TEXT,
      content TEXT,
      unlock_requirement TEXT,
      is_unlocked BOOLEAN DEFAULT 0
    )
  `);

  // 19. Image_Generator_Requests
  db.run(`
    CREATE TABLE IF NOT EXISTS Image_Generator_Requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      style TEXT,
      theme TEXT,
      character TEXT,
      element TEXT,
      output_type TEXT,
      generated_image TEXT,
      saved_to_lessons BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )
  `);

  // 20. Settings
  db.run(`
    CREATE TABLE IF NOT EXISTS Settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      sound_enabled BOOLEAN DEFAULT 1,
      voice_enabled BOOLEAN DEFAULT 1,
      music_volume INTEGER DEFAULT 80,
      effects_volume INTEGER DEFAULT 80,
      controller_enabled BOOLEAN DEFAULT 0,
      control_layout TEXT DEFAULT 'standard',
      graphics_quality TEXT DEFAULT 'high',
      FOREIGN KEY (user_id) REFERENCES Users(id)
    )
  `);

  console.log('All tables created successfully!');
});

module.exports = db;
