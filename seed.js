const db = require('./db');

function seedData() {
  db.serialize(() => {
    // Add sample drawing categories
    db.run(`
      INSERT OR IGNORE INTO Drawing_Categories (name, description, icon, is_locked, required_level)
      VALUES 
        ('Creatures', 'Draw mythical creatures and monsters', '🐉', 0, 1),
        ('Armor & Weapons', 'Design protective gear and weapons', '⚔️', 0, 2),
        ('Apocalyptic Scenes', 'Create end-world landscapes', '🌋', 0, 3),
        ('Character Design', 'Build unique character profiles', '👤', 1, 5),
        ('Magical Effects', 'Illustrate spells and magic', '✨', 1, 8)
    `);

    // Add sample game modes
    db.run(`
      INSERT OR IGNORE INTO Game_Modes (name, description, rules, is_locked, required_level)
      VALUES 
        ('Survival', 'Defend against waves of enemies', 'Defeat enemies to advance', 0, 1),
        ('Drawing Challenge', 'Complete timed drawing objectives', 'Draw faster than the timer', 0, 1),
        ('Boss Rush', 'Face increasingly difficult bosses', 'Defeat each boss to progress', 1, 3),
        ('Multiplayer Arena', 'Battle other players', 'Last player standing wins', 1, 10)
    `);

    // Add sample elements
    db.run(`
      INSERT OR IGNORE INTO Elements (name, element_type, description, damage_type, visual_effect, is_locked, required_level)
      VALUES 
        ('Fire', 'burning', 'Flames and heat damage', 'damage', 'orange glow', 0, 1),
        ('Frost', 'freezing', 'Ice and freeze effects', 'freeze', 'blue shimmer', 0, 2),
        ('Lightning', 'electric', 'Electricity and shock', 'damage', 'yellow sparks', 0, 3),
        ('Shadow', 'dark', 'Darkness and void power', 'damage', 'dark mist', 1, 5),
        ('Light', 'holy', 'Radiant healing energy', 'heal', 'golden aura', 1, 7)
    `);

    // Add sample weapons
    db.run(`
      INSERT OR IGNORE INTO Weapons (name, weapon_type, damage, fire_rate, ammo_capacity, recoil, unlock_level, cost)
      VALUES 
        ('Inferno Pistol', 'gun', 15, 1.2, 30, 0.8, 1, 100),
        ('Frost Rifle', 'gun', 25, 0.8, 20, 1.5, 2, 250),
        ('Thunder Blade', 'melee', 35, 0.5, 0, 0, 3, 400),
        ('Shadow Dagger', 'melee', 20, 1.0, 0, 0, 1, 150),
        ('Holy Staff', 'staff', 20, 0.7, 50, 1.0, 5, 600)
    `);

    // Add sample characters
    db.run(`
      INSERT OR IGNORE INTO Characters (name, species, character_type, description, default_element, style, is_locked, required_level)
      VALUES 
        ('Emberheart', 'Phoenix', 'warrior', 'Fire-wielding phoenix guardian', 'Fire', 'sketch', 0, 1),
        ('Frostbane', 'Dragon', 'mage', 'Ancient ice dragon', 'Frost', 'detailed', 0, 2),
        ('Stormchaser', 'Gryphon', 'ranger', 'Lightning-quick gryphon', 'Lightning', 'sketch', 0, 3),
        ('Shadowveil', 'Wraith', 'assassin', 'Mysterious shadow entity', 'Shadow', 'dark', 1, 5),
        ('Lightbringer', 'Angel', 'healer', 'Divine celestial being', 'Light', 'celestial', 1, 8)
    `);

    // Add sample zombies
    db.run(`
      INSERT OR IGNORE INTO Zombies (name, zombie_type, health, damage, speed, behavior, weakness, description)
      VALUES 
        ('Shambler', 'walker', 5, 2, 0.5, 'slow-attack', 'fire', 'Basic undead walker'),
        ('Sprinter', 'runner', 3, 3, 1.5, 'fast-charge', 'frost', 'Aggressive quick zombie'),
        ('Brute', 'tank', 20, 5, 0.3, 'aggressive-melee', 'lightning', 'Heavily armored undead'),
        ('Spitter', 'ranged', 8, 4, 0.8, 'ranged-attack', 'shadow', 'Dangerous toxic zombie')
    `);

    // Add sample bosses
    db.run(`
      INSERT OR IGNORE INTO Bosses (name, level_number, health, element, attacks, weakness, description, reward_coins, reward_xp)
      VALUES 
        ('Infernal Wraith', 1, 50, 'Fire', 'fireball,flame-burst', 'Frost', 'First major boss', 500, 1000),
        ('Glacial Titan', 2, 75, 'Frost', 'ice-storm,freeze-ray', 'Lightning', 'Second area boss', 750, 1500),
        ('Storm Lord', 3, 100, 'Lightning', 'lightning-strike,thunder-wave', 'Shadow', 'Third area boss', 1000, 2000)
    `);

    console.log('Sample data seeded successfully!');
  });
}

seedData();
