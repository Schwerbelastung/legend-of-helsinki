/* ============================================================
   gameState.js — Player state, AI adventurers, save/load
   ============================================================ */

const SAVE_KEY = 'legend_helsinki_save';

// XP required per level (index = level, so index 0 unused)
const XP_TABLE = [
  0, 0, 100, 250, 500, 900, 1500, 2400, 3800, 5800, 8500, 12000, 17000
];

// Stat growth per level by class: [hp, mp, str, def, mag, spd]
const CLASS_GROWTH = {
  warrior:  [12, 2, 4, 3, 1, 2],
  mage:     [7, 6, 1, 2, 4, 2],
  rogue:    [9, 3, 3, 2, 2, 4],
};

// Base stats by class at level 1
const CLASS_BASE = {
  warrior:  { hp: 30, mp: 5,  str: 8, def: 6, mag: 2, spd: 4 },
  mage:     { hp: 18, mp: 20, str: 3, def: 3, mag: 8, spd: 4 },
  rogue:    { hp: 22, mp: 10, str: 5, def: 4, mag: 4, spd: 7 },
};

// Spells unlocked at levels by class
const CLASS_SPELLS = {
  warrior: [
    { level: 3, id: 'bash', name: 'Shield Bash', mpCost: 4, power: 1.3, type: 'physical' },
    { level: 7, id: 'fury', name: 'Battle Fury', mpCost: 8, power: 2.0, type: 'physical' },
    { level: 11, id: 'smite', name: 'Dragon Smite', mpCost: 15, power: 3.0, type: 'physical' },
  ],
  mage: [
    { level: 1, id: 'fireball', name: 'Tulipallo', mpCost: 5, power: 1.5, type: 'fire' },
    { level: 4, id: 'ice', name: 'Jääpuikko', mpCost: 8, power: 2.0, type: 'ice' },
    { level: 7, id: 'lightning', name: 'Ukkonen', mpCost: 12, power: 2.5, type: 'lightning' },
    { level: 10, id: 'void', name: 'Tuonelan Tuuli', mpCost: 20, power: 3.5, type: 'dark' },
  ],
  rogue: [
    { level: 2, id: 'backstab', name: 'Backstab', mpCost: 4, power: 1.8, type: 'physical' },
    { level: 5, id: 'poison', name: 'Poison Blade', mpCost: 6, power: 1.2, type: 'poison', dot: true },
    { level: 9, id: 'shadow', name: 'Shadow Strike', mpCost: 12, power: 2.8, type: 'dark' },
  ],
};

export const state = {
  screen: 'title',
  player: null,
  aiPlayers: [],
  newsBoard: [],
  dayCount: 0,
  combatState: null,
  eventState: null,
  shopState: null,
  questBoard: [],
  flags: {},
};

export function createPlayer(name, playerClass) {
  const base = CLASS_BASE[playerClass];
  state.player = {
    name,
    class: playerClass,
    level: 1,
    xp: 0,
    xpToNext: XP_TABLE[2],
    hp: base.hp,
    maxHp: base.hp,
    mp: base.mp,
    maxMp: base.mp,
    strength: base.str,
    defense: base.def,
    magic: base.mag,
    speed: base.spd,
    gold: 50,
    weapon: { id: 'fists', name: 'Bare Fists', attackBonus: 0, price: 0 },
    armor: { id: 'clothes', name: 'Old Clothes', defenseBonus: 0, price: 0 },
    accessory: null,
    inventory: [
      { id: 'potion_small', quantity: 3 },
    ],
    currentRegion: 'helsinki',
    activeQuests: [],
    completedQuests: [],
    kills: 0,
    deaths: 0,
    charm: {},       // { npcId: score }
    poisoned: false,
    poisonTurns: 0,
  };
  state.flags = {};
  state.dayCount = 1;
  state.newsBoard = [
    'Welcome to Helsinki, adventurer!',
    'The Red Dragon terrorizes the land...',
    'Brave souls gather at the inn.',
  ];
  initAiPlayers();
  initQuestBoard();
}

function initAiPlayers() {
  state.aiPlayers = [
    { name: 'Aino', personality: 'brave', class: 'warrior', level: 1, hp: 30, maxHp: 30, weapon: 'Wooden Sword', armor: 'Leather Vest', region: 'helsinki', alive: true, lastAction: 'arrived in Helsinki' },
    { name: 'Väinö', personality: 'wise', class: 'mage', level: 1, hp: 18, maxHp: 18, weapon: 'Oak Staff', armor: 'Robe', region: 'helsinki', alive: true, lastAction: 'is studying ancient runes' },
    { name: 'Ilmari', personality: 'crafty', class: 'warrior', level: 1, hp: 28, maxHp: 28, weapon: 'Hammer', armor: 'Work Apron', region: 'helsinki', alive: true, lastAction: 'is sharpening blades at the forge' },
    { name: 'Louhi', personality: 'rival', class: 'mage', level: 2, hp: 22, maxHp: 22, weapon: 'Dark Staff', armor: 'Shadow Cloak', region: 'helsinki', alive: true, lastAction: 'watches you from the shadows' },
    { name: 'Kullervo', personality: 'tragic', class: 'rogue', level: 1, hp: 24, maxHp: 24, weapon: 'Rusty Knife', armor: 'Torn Cloak', region: 'helsinki', alive: true, lastAction: 'sits alone, brooding' },
    { name: 'Mielikki', personality: 'guardian', class: 'mage', level: 5, hp: 40, maxHp: 40, weapon: 'Forest Staff', armor: 'Bark Armor', region: 'helsinki', alive: true, lastAction: 'tends to the forest creatures' },
  ];
}

function initQuestBoard() {
  state.questBoard = [];
}

export function getAvailableSpells() {
  if (!state.player) return [];
  const spells = CLASS_SPELLS[state.player.class] || [];
  return spells.filter(s => state.player.level >= s.level);
}

export function checkLevelUp() {
  const p = state.player;
  if (!p) return false;
  if (p.level >= 12) return false;
  if (p.xp < p.xpToNext) return false;

  p.level++;
  const growth = CLASS_GROWTH[p.class];
  p.maxHp += growth[0];
  p.maxMp += growth[1];
  p.strength += growth[2];
  p.defense += growth[3];
  p.magic += growth[4];
  p.speed += growth[5];
  p.hp = p.maxHp;
  p.mp = p.maxMp;
  p.xpToNext = p.level < 12 ? XP_TABLE[p.level + 1] : Infinity;
  return true;
}

export function advanceDay() {
  state.dayCount++;
  simulateAiPlayers();
}

function simulateAiPlayers() {
  const regions = ['helsinki', 'espoo', 'vantaa', 'kauniainen'];
  const monsterNames = {
    helsinki: ['Rautatie-Rotta', 'Torilokit', 'Kaljatrolli', 'Haamuvartija', 'Meritonttu'],
    espoo: ['Teknopeikko', 'Nuuksion Hiisi', 'Koodihirviö', 'Järvennäkki', 'Betonijätti'],
    vantaa: ['Lentokenttädrake', 'Keravanjoki-Kraken', 'Tullidemoni', 'Teräsvartija', 'Myrskyhaamu'],
    kauniainen: ['Ikivanha Hiisi', 'Tuonenvartija', 'Sammon Varjo', 'Jäinen Louhitar'],
  };

  const news = [];

  for (const ai of state.aiPlayers) {
    if (ai.personality === 'guardian') continue; // Mielikki doesn't adventure normally

    if (!ai.alive) {
      // 30% chance to respawn
      if (Math.random() < 0.3) {
        ai.alive = true;
        ai.level = Math.max(1, ai.level - 1);
        ai.hp = ai.maxHp;
        ai.lastAction = 'has returned from the dead!';
        news.push(`${ai.name} has returned, looking weary but determined.`);
      }
      continue;
    }

    const roll = Math.random();

    if (roll < 0.4) {
      // Fight a monster
      const monstersHere = monsterNames[ai.region] || monsterNames.helsinki;
      const monster = monstersHere[Math.floor(Math.random() * monstersHere.length)];

      if (Math.random() < 0.85) {
        // Win
        ai.lastAction = `defeated a ${monster}`;
        news.push(`${ai.name} defeated a ${monster} in ${ai.region}!`);
        // Chance to level up
        if (Math.random() < 0.25 && ai.level < 12) {
          ai.level++;
          ai.maxHp += 8;
          ai.hp = ai.maxHp;
          news.push(`${ai.name} has reached level ${ai.level}!`);
        }
      } else {
        // Die
        ai.alive = false;
        ai.lastAction = `was slain by a ${monster}`;
        news.push(`${ai.name} was slain by a ${monster}... Rest in peace.`);
      }
    } else if (roll < 0.6) {
      // Move to next region if strong enough
      const ri = regions.indexOf(ai.region);
      const targetLevel = [1, 4, 7, 10];
      if (ri < 3 && ai.level >= targetLevel[ri + 1]) {
        ai.region = regions[ri + 1];
        ai.lastAction = `traveled to ${ai.region}`;
        news.push(`${ai.name} has journeyed to ${ai.region}.`);
      } else {
        ai.lastAction = 'is resting at the inn';
      }
    } else {
      // Flavor actions
      const flavors = [
        'is drinking at the tavern',
        'is sharpening their weapon',
        'was seen talking to a stranger',
        'found a few coins on the ground',
        'is staring at the sky thoughtfully',
      ];
      ai.lastAction = flavors[Math.floor(Math.random() * flavors.length)];
    }
  }

  // Louhi special: always stays slightly ahead
  const louhi = state.aiPlayers.find(a => a.name === 'Louhi');
  if (louhi && louhi.alive && state.player) {
    if (louhi.level <= state.player.level) {
      louhi.level = Math.min(12, state.player.level + 1);
    }
  }

  // Keep only last 20 news items
  state.newsBoard = [...news, ...state.newsBoard].slice(0, 20);
}

export function addInventoryItem(itemId, quantity = 1) {
  const existing = state.player.inventory.find(i => i.id === itemId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.player.inventory.push({ id: itemId, quantity });
  }
}

export function removeInventoryItem(itemId, quantity = 1) {
  const existing = state.player.inventory.find(i => i.id === itemId);
  if (!existing) return false;
  existing.quantity -= quantity;
  if (existing.quantity <= 0) {
    state.player.inventory = state.player.inventory.filter(i => i.id !== itemId);
  }
  return true;
}

export function hasItem(itemId) {
  const item = state.player.inventory.find(i => i.id === itemId);
  return item ? item.quantity : 0;
}

export function saveGame() {
  const data = {
    player: state.player,
    aiPlayers: state.aiPlayers,
    newsBoard: state.newsBoard,
    dayCount: state.dayCount,
    questBoard: state.questBoard,
    flags: state.flags,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    state.player = data.player;
    state.aiPlayers = data.aiPlayers;
    state.newsBoard = data.newsBoard;
    state.dayCount = data.dayCount;
    state.questBoard = data.questBoard || [];
    state.flags = data.flags || {};
    return true;
  } catch {
    return false;
  }
}

export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}
