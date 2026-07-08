# Drawing Apocalypse API Documentation

## Database Schema
The app uses SQLite with 20 tables managing users, drawings, game content, and gameplay progression.

### Core Tables

#### Users
Central user data with progression metrics.
```
- id (PK)
- username (UNIQUE)
- email (UNIQUE)
- age_confirmed (BOOLEAN)
- orb_level (INT, default 1)
- xp (INT, default 0)
- coins (INT, default 0)
- favorite_drawing_category (TEXT)
- favorite_game_mode (TEXT)
- created_at (DATETIME)
```

#### ORB_Profile
AI companion customization and state.
```
- id (PK)
- user_id (FK → Users, UNIQUE)
- orb_level (INT, default 1)
- orb_voice (TEXT, default 'ethereal')
- orb_personality (TEXT, default 'mystical')
- orb_memory_notes (TEXT)
- unlocked_avatar_creator (BOOLEAN)
- current_form (TEXT, default 'sphere')
- halo_color (TEXT, default '#FFD700')
- galaxy_color (TEXT, default '#4B0082')
- created_at (DATETIME)
```

### Drawing System

#### Drawing_Categories
Lesson categories with progression gates.
```
- id (PK)
- name (TEXT)
- description (TEXT)
- icon (TEXT)
- is_locked (BOOLEAN)
- required_level (INT)
```

#### Drawing_Lessons
Individual drawing tutorials.
```
- id (PK)
- title (TEXT)
- category_id (FK → Drawing_Categories)
- style (TEXT)
- difficulty (TEXT)
- reference_image (TEXT)
- total_steps (INT)
- description (TEXT)
- created_at (DATETIME)
```

#### Drawing_Steps
Step-by-step breakdown of lessons with voice guidance.
```
- id (PK)
- lesson_id (FK → Drawing_Lessons)
- step_number (INT)
- step_image (TEXT)
- instruction_text (TEXT)
- voice_text (TEXT)
- is_current_step (BOOLEAN)
```

#### Saved_Drawings
User-created drawings from lessons.
```
- id (PK)
- user_id (FK → Users)
- lesson_id (FK → Drawing_Lessons)
- image_reference (TEXT)
- notes (TEXT)
- completed (BOOLEAN)
- saved_at (DATETIME)
```

### Game Content

#### Game_Modes
Available gameplay modes with progression requirements.
```
- id (PK)
- name (TEXT)
- description (TEXT)
- rules (TEXT)
- is_locked (BOOLEAN)
- required_level (INT)
```

#### Elements
Magic element system with damage types.
```
- id (PK)
- name (TEXT)
- element_type (TEXT)
- description (TEXT)
- damage_type (TEXT)
- visual_effect (TEXT)
- is_locked (BOOLEAN)
- required_level (INT)
```

#### Characters
Playable characters with element affinities.
```
- id (PK)
- name (TEXT)
- species (TEXT)
- character_type (TEXT)
- description (TEXT)
- default_element (FK ref)
- style (TEXT)
- is_locked (BOOLEAN)
- required_level (INT)
```

#### Weapons
Weaponry with damage stats and unlock gates.
```
- id (PK)
- name (TEXT)
- weapon_type (TEXT: gun/melee/staff)
- damage (INT)
- fire_rate (REAL)
- ammo_capacity (INT)
- recoil (REAL)
- unlock_level (INT)
- cost (INT, coins)
```

#### Zombies
Enemy types with behaviors and weaknesses.
```
- id (PK)
- name (TEXT)
- zombie_type (TEXT: walker/runner/tank/ranged)
- health (INT)
- damage (INT)
- speed (REAL)
- behavior (TEXT)
- weakness (TEXT: element type)
- description (TEXT)
```

#### Bosses
Major boss encounters with rewards.
```
- id (PK)
- name (TEXT)
- level_number (INT)
- health (INT)
- element (TEXT)
- attacks (TEXT, comma-separated)
- weakness (TEXT)
- description (TEXT)
- reward_coins (INT)
- reward_xp (INT)
```

### Player State

#### Avatar_Customizations
Real-time avatar appearance data.
```
- id (PK)
- user_id (FK → Users, UNIQUE)
- species (TEXT)
- body_type (TEXT)
- face_type (TEXT)
- hair_type (TEXT)
- scale_type (TEXT)
- feather_type (TEXT)
- clothing (TEXT)
- armor (TEXT)
- main_color (TEXT)
- secondary_color (TEXT)
- selected_element (TEXT)
- selected_style (TEXT)
```

#### Player_Weapons
User inventory and weapon upgrades.
```
- id (PK)
- user_id (FK → Users)
- weapon_id (FK → Weapons)
- upgrade_level (INT)
- attachments (TEXT, JSON)
- equipped (BOOLEAN)
```

#### Player_Progress
Campaign and unlock tracking.
```
- id (PK)
- user_id (FK → Users, UNIQUE)
- current_chapter (INT, default 1)
- current_wave (INT, default 1)
- highest_level (INT, default 1)
- bosses_defeated (INT)
- lessons_completed (INT)
- elements_unlocked (TEXT, comma-separated IDs)
- characters_unlocked (TEXT, comma-separated IDs)
```

#### Settings
User preferences and controls.
```
- id (PK)
- user_id (FK → Users, UNIQUE)
- sound_enabled (BOOLEAN, default true)
- voice_enabled (BOOLEAN, default true)
- music_volume (INT 0-100, default 80)
- effects_volume (INT 0-100, default 80)
- controller_enabled (BOOLEAN)
- control_layout (TEXT, default 'standard')
- graphics_quality (TEXT, default 'high')
```

### Content & Narrative

#### Missions
Campaign objectives and encounters.
```
- id (PK)
- title (TEXT)
- game_mode (TEXT)
- chapter_number (INT)
- objective (TEXT)
- map_name (TEXT)
- enemy_type (TEXT)
- boss_id (FK → Bosses)
- reward_coins (INT)
- reward_xp (INT)
```

#### ORB_Dialogue
Context-sensitive ORB companion dialogue.
```
- id (PK)
- situation (TEXT)
- dialogue_text (TEXT)
- voice_style (TEXT)
- required_level (INT)
- emotion (TEXT)
```

#### Lore_Entries
World building and narrative unlocks.
```
- id (PK)
- title (TEXT)
- lore_type (TEXT)
- content (TEXT)
- unlock_requirement (TEXT)
- is_unlocked (BOOLEAN)
```

#### Image_Generator_Requests
AI-generated drawing history and integration.
```
- id (PK)
- user_id (FK → Users)
- prompt (TEXT)
- style (TEXT)
- theme (TEXT)
- character (TEXT)
- element (TEXT)
- output_type (TEXT)
- generated_image (TEXT, URL/path)
- saved_to_lessons (BOOLEAN)
- created_at (DATETIME)
```

## REST Endpoints

### User Management
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user profile

### ORB Profile
- `POST /api/orb-profiles` - Create ORB profile
- `GET /api/orb-profiles/:userId` - Get ORB state

### Drawing Lessons
- `GET /api/categories` - List all categories
- `GET /api/lessons/:categoryId` - Lessons in category
- `GET /api/lessons/:lessonId/steps` - Get lesson steps
- `POST /api/drawings` - Save a drawing
- `GET /api/users/:userId/drawings` - User's saved drawings

### Game Content
- `GET /api/game-modes` - Available game modes
- `GET /api/progress/:userId` - Player progress
- `PUT /api/progress/:userId` - Update progress
- `GET /api/settings/:userId` - User settings
- `PUT /api/settings/:userId` - Update settings

## Sample Data Seeded
Run `node seed.js` to populate:
- 5 drawing categories (Creatures, Armor, Scenes, Character Design, Effects)
- 4 game modes (Survival, Drawing Challenge, Boss Rush, Arena)
- 5 elements (Fire, Frost, Lightning, Shadow, Light)
- 5 weapons (Inferno Pistol, Frost Rifle, Thunder Blade, Shadow Dagger, Holy Staff)
- 5 characters (Emberheart, Frostbane, Stormchaser, Shadowveil, Lightbringer)
- 4 zombie types (Shambler, Sprinter, Brute, Spitter)
- 3 bosses (Infernal Wraith, Glacial Titan, Storm Lord)
