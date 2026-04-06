/* ============================================================
   renderer.js — Canvas drawing utilities
   ============================================================ */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Disable smoothing for pixel-perfect rendering
ctx.imageSmoothingEnabled = false;

/* ============================================================
   sound.js — Web Audio API sound effects and music
   ============================================================ */

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let musicGain = null;
let sfxGain = null;
let currentMusic = null;
let musicEnabled = true;
let sfxEnabled = true;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioCtx();
  musicGain = audioCtx.createGain();
  musicGain.gain.value = 0.25;
  musicGain.connect(audioCtx.destination);
  sfxGain = audioCtx.createGain();
  sfxGain.gain.value = 0.4;
  sfxGain.connect(audioCtx.destination);
}

function playNote(freq, duration, type = 'square', gainNode = sfxGain, startTime = 0) {
  if (!audioCtx || !sfxEnabled) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.3, audioCtx.currentTime + startTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + startTime + duration);
  osc.connect(g);
  g.connect(gainNode);
  osc.start(audioCtx.currentTime + startTime);
  osc.stop(audioCtx.currentTime + startTime + duration);
}

function playNoise(duration, gainNode = sfxGain) {
  if (!audioCtx || !sfxEnabled) return;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.15, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  src.connect(filter);
  filter.connect(g);
  g.connect(gainNode);
  src.start();
  src.stop(audioCtx.currentTime + duration);
}

// --- Sound effects ---
function sfxMenuSelect() {
  playNote(800, 0.06, 'square');
  playNote(1200, 0.08, 'square', sfxGain, 0.04);
}

function sfxMenuBack() {
  playNote(600, 0.06, 'square');
  playNote(400, 0.08, 'square', sfxGain, 0.04);
}

function sfxPlayerHit() {
  playNote(200, 0.1, 'sawtooth');
  playNoise(0.08);
  playNote(120, 0.15, 'sawtooth', sfxGain, 0.05);
}

function sfxMonsterHit() {
  playNote(300, 0.08, 'sawtooth');
  playNote(150, 0.12, 'square', sfxGain, 0.05);
}

function sfxCrit() {
  playNote(400, 0.05, 'sawtooth');
  playNote(600, 0.05, 'sawtooth', sfxGain, 0.05);
  playNote(800, 0.1, 'sawtooth', sfxGain, 0.1);
  playNoise(0.12);
}

function sfxBlock() {
  playNote(180, 0.05, 'triangle');
  playNote(280, 0.08, 'triangle', sfxGain, 0.03);
}

function sfxMagic() {
  for (let i = 0; i < 5; i++) {
    playNote(400 + i * 100, 0.12, 'sine', sfxGain, i * 0.06);
  }
}

function sfxHeal() {
  playNote(523, 0.12, 'sine');
  playNote(659, 0.12, 'sine', sfxGain, 0.1);
  playNote(784, 0.15, 'sine', sfxGain, 0.2);
}

function sfxLevelUp() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => {
    playNote(n, 0.2, 'square', sfxGain, i * 0.12);
    playNote(n, 0.2, 'sine', sfxGain, i * 0.12);
  });
}

function sfxVictory() {
  const notes = [392, 523, 659, 784, 659, 784, 1047];
  notes.forEach((n, i) => playNote(n, 0.18, 'square', sfxGain, i * 0.1));
}

function sfxDefeat() {
  const notes = [400, 350, 300, 200, 150];
  notes.forEach((n, i) => playNote(n, 0.25, 'sawtooth', sfxGain, i * 0.15));
}

function sfxGold() {
  playNote(1200, 0.05, 'square');
  playNote(1600, 0.08, 'square', sfxGain, 0.04);
  playNote(2000, 0.06, 'square', sfxGain, 0.08);
}

function sfxDice() {
  for (let i = 0; i < 4; i++) {
    playNoise(0.04);
    playNote(300 + Math.random() * 400, 0.03, 'square', sfxGain, i * 0.07);
  }
}

function sfxRun() {
  for (let i = 0; i < 3; i++) {
    playNote(500 - i * 100, 0.06, 'triangle', sfxGain, i * 0.08);
  }
}

function sfxEvent() {
  playNote(600, 0.15, 'sine');
  playNote(800, 0.15, 'sine', sfxGain, 0.12);
  playNote(700, 0.2, 'sine', sfxGain, 0.24);
}

function sfxDragon() {
  playNote(80, 0.5, 'sawtooth');
  playNote(60, 0.6, 'sawtooth', sfxGain, 0.2);
  playNoise(0.4);
}

function sfxSave() {
  playNote(800, 0.08, 'sine');
  playNote(1000, 0.08, 'sine', sfxGain, 0.06);
  playNote(1200, 0.12, 'sine', sfxGain, 0.12);
}

function sfxInnRest() {
  playNote(400, 0.3, 'sine');
  playNote(500, 0.3, 'sine', sfxGain, 0.15);
  playNote(600, 0.4, 'sine', sfxGain, 0.3);
}

// --- Music system (simple looping arpeggios) ---
function stopMusic() {
  if (currentMusic) {
    currentMusic.forEach(osc => { try { osc.stop(); } catch(e) {} });
    currentMusic = null;
  }
}

function playMusic(pattern, bpm = 120) {
  if (!audioCtx || !musicEnabled) return;
  stopMusic();
  const beatLen = 60 / bpm;
  const totalDuration = pattern.length * beatLen;
  const oscs = [];

  pattern.forEach((note, i) => {
    if (note === 0) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = note;
    const t = audioCtx.currentTime + i * beatLen;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.02);
    g.gain.setValueAtTime(0.12, t + beatLen * 0.6);
    g.gain.linearRampToValueAtTime(0, t + beatLen * 0.9);
    osc.connect(g);
    g.connect(musicGain);
    osc.start(t);
    osc.stop(t + beatLen);
    oscs.push(osc);
  });

  // Loop
  currentMusic = oscs;
  const lastOsc = oscs[oscs.length - 1];
  if (lastOsc) {
    lastOsc.onended = () => {
      if (currentMusic === oscs && musicEnabled) {
        playMusic(pattern, bpm);
      }
    };
  }
}

// Music patterns (note frequencies, 0 = rest)
const MUSIC_TITLE = [
  262, 0, 330, 0, 392, 0, 330, 0, 262, 0, 196, 0, 220, 0, 262, 0,
  294, 0, 349, 0, 294, 0, 262, 0, 220, 0, 196, 0, 220, 0, 262, 0,
];
const MUSIC_TOWN = [
  330, 392, 494, 392, 330, 294, 330, 392, 440, 392, 330, 294, 262, 294, 330, 262,
];
const MUSIC_FOREST = [
  196, 0, 220, 0, 262, 0, 220, 0, 196, 0, 165, 0, 196, 0, 220, 0,
];
const MUSIC_COMBAT = [
  330, 330, 262, 262, 294, 294, 392, 392, 349, 349, 294, 294, 330, 330, 262, 262,
];
const MUSIC_TAVERN = [
  392, 440, 494, 440, 392, 330, 294, 330, 392, 440, 494, 523, 494, 440, 392, 330,
];
const MUSIC_BOSS = [
  165, 165, 196, 196, 220, 220, 262, 262, 196, 196, 165, 165, 147, 147, 165, 165,
];
const MUSIC_FOREST_NIGHT = [
  147, 0, 0, 165, 0, 0, 196, 0, 0, 165, 0, 0, 147, 0, 131, 0,
];

function startMusicForScreen(screen) {
  if (!audioCtx) return;
  switch (screen) {
    case 'title': playMusic(MUSIC_TITLE, 100); break;
    case 'town': playMusic(MUSIC_TOWN, 130); break;
    case 'forest': playMusic(isNight() ? MUSIC_FOREST_NIGHT : MUSIC_FOREST, isNight() ? 70 : 90); break;
    case 'combat': playMusic(MUSIC_COMBAT, 160); break;
    case 'tavern': playMusic(MUSIC_TAVERN, 140); break;
    case 'inn': playMusic(MUSIC_TOWN, 100); break;
    case 'shop': playMusic(MUSIC_TOWN, 120); break;
    case 'healer': playMusic(MUSIC_TOWN, 100); break;
    case 'death': stopMusic(); break;
    case 'victory': stopMusic(); sfxVictory(); break;
    default: break;
  }
}

/* ============================================================
   combat-anim.js — Simple combat animations
   ============================================================ */

let animating = false;

function flashCanvas(color, duration = 150) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:absolute;top:0;left:0;width:640px;height:400px;background:${color};pointer-events:none;z-index:10;opacity:0.5;`;
  const container = document.getElementById('gameContainer');
  container.style.position = 'relative';
  container.appendChild(overlay);
  setTimeout(() => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.15s';
    setTimeout(() => overlay.remove(), 160);
  }, duration);
}

function shakeCanvas(intensity = 4, duration = 200) {
  const c = document.getElementById('gameCanvas');
  const start = performance.now();
  function frame(time) {
    const elapsed = time - start;
    if (elapsed > duration) {
      c.style.transform = '';
      return;
    }
    const decay = 1 - elapsed / duration;
    const dx = (Math.random() * 2 - 1) * intensity * decay;
    const dy = (Math.random() * 2 - 1) * intensity * decay;
    c.style.transform = `translate(${dx}px, ${dy}px)`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function animateMonsterHit(callback) {
  animating = true;
  flashCanvas('rgba(255,60,60,0.4)', 100);
  shakeCanvas(3, 200);
  sfxMonsterHit();
  setTimeout(() => { animating = false; if (callback) callback(); }, 250);
}

function animatePlayerHit(callback) {
  animating = true;
  flashCanvas('rgba(255,120,40,0.3)', 100);
  shakeCanvas(5, 300);
  sfxPlayerHit();
  setTimeout(() => { animating = false; if (callback) callback(); }, 350);
}

function animateCrit(callback) {
  animating = true;
  flashCanvas('rgba(255,255,0,0.5)', 80);
  setTimeout(() => flashCanvas('rgba(255,0,0,0.4)', 100), 80);
  shakeCanvas(6, 350);
  sfxCrit();
  setTimeout(() => { animating = false; if (callback) callback(); }, 400);
}

function animateBlock(callback) {
  animating = true;
  flashCanvas('rgba(60,200,200,0.3)', 100);
  sfxBlock();
  setTimeout(() => { animating = false; if (callback) callback(); }, 200);
}

function animateMagic(callback) {
  animating = true;
  flashCanvas('rgba(100,60,255,0.4)', 100);
  setTimeout(() => flashCanvas('rgba(60,160,255,0.3)', 100), 120);
  sfxMagic();
  setTimeout(() => { animating = false; if (callback) callback(); }, 350);
}

function animateHeal(callback) {
  animating = true;
  flashCanvas('rgba(60,255,60,0.3)', 200);
  sfxHeal();
  setTimeout(() => { animating = false; if (callback) callback(); }, 300);
}

function animateVictory(callback) {
  animating = true;
  flashCanvas('rgba(255,215,0,0.3)', 300);
  sfxVictory();
  setTimeout(() => { animating = false; if (callback) callback(); }, 500);
}

function animateDefeat(callback) {
  animating = true;
  flashCanvas('rgba(80,0,0,0.5)', 400);
  sfxDefeat();
  setTimeout(() => { animating = false; if (callback) callback(); }, 600);
}

/* ============================================================
   dice.js — Tavern dice game (Yatzy-style "Helsinki Hold'em")
   ============================================================ */

let diceState = null;

function startDiceGame(bet, addMsg) {
  if (state.player.gold < bet) {
    addMsg("You can't afford that bet.", 'system');
    return false;
  }
  state.player.gold -= bet;
  const dice = rollDice(5);
  diceState = {
    dice: dice,
    held: [false, false, false, false, false],
    rollsLeft: 2,
    bet: bet,
  };
  sfxDice();
  addMsg(`You bet ${bet} gold. The dice roll...`, 'gold');
  showDice(addMsg);
  return true;
}

function rollDice(count) {
  const dice = [];
  for (let i = 0; i < count; i++) dice.push(Math.floor(Math.random() * 6) + 1);
  return dice;
}

function showDice(addMsg) {
  const diceStr = diceState.dice.map((d, i) =>
    diceState.held[i] ? `[${d}]` : ` ${d} `
  ).join('  ');
  addMsg(`  ${diceStr}`, 'narrator');
  if (diceState.rollsLeft > 0) {
    addMsg(`Rolls left: ${diceState.rollsLeft}. Toggle dice to hold, then reroll.`, 'system');
  }
}

function toggleDiceHold(index) {
  if (!diceState || index < 0 || index >= 5) return;
  diceState.held[index] = !diceState.held[index];
}

function rerollDice(addMsg) {
  if (!diceState || diceState.rollsLeft <= 0) return;
  diceState.rollsLeft--;
  sfxDice();
  for (let i = 0; i < 5; i++) {
    if (!diceState.held[i]) {
      diceState.dice[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
  addMsg('Rerolling...', 'narrator');
  showDice(addMsg);
}

function scoreDice(dice) {
  const counts = [0, 0, 0, 0, 0, 0];
  for (const d of dice) counts[d - 1]++;
  const maxCount = Math.max(...counts);
  const pairs = counts.filter(c => c >= 2).length;
  const sum = dice.reduce((a, b) => a + b, 0);
  const sorted = [...dice].sort();
  const isSmallStraight = sorted.join('') === '12345';
  const isLargeStraight = sorted.join('') === '23456';

  if (maxCount === 5) return { name: 'FIVE OF A KIND!', multiplier: 10 };
  if (maxCount === 4) return { name: 'Four of a Kind', multiplier: 5 };
  if (maxCount === 3 && pairs === 2) return { name: 'Full House', multiplier: 4 };
  if (isLargeStraight) return { name: 'Large Straight', multiplier: 4 };
  if (isSmallStraight) return { name: 'Small Straight', multiplier: 3 };
  if (maxCount === 3) return { name: 'Three of a Kind', multiplier: 2 };
  if (pairs === 2) return { name: 'Two Pairs', multiplier: 1.5 };
  if (maxCount === 2) return { name: 'One Pair', multiplier: 0 };
  return { name: 'Nothing', multiplier: 0 };
}

function finishDiceGame(addMsg) {
  if (!diceState) return;
  const result = scoreDice(diceState.dice);
  const winnings = Math.floor(diceState.bet * result.multiplier);
  showDice(addMsg);
  addMsg(`Result: ${result.name}!`, 'narrator');
  if (winnings > 0) {
    state.player.gold += winnings;
    addMsg(`You win ${winnings} gold!`, 'gold');
    sfxGold();
  } else {
    addMsg('You lose your bet. Better luck next time.', 'system');
  }
  diceState = null;
}

function getDiceMenu() {
  if (!diceState) return [];
  const items = [];
  if (diceState.rollsLeft > 0) {
    for (let i = 0; i < 5; i++) {
      const held = diceState.held[i];
      items.push({
        key: String(i + 1),
        label: `Die ${i + 1} [${diceState.dice[i]}] ${held ? '(HELD)' : ''}`,
        action: 'dice_toggle',
        data: i,
      });
    }
    items.push({ key: '6', label: `Reroll (${diceState.rollsLeft} left)`, action: 'dice_reroll' });
    items.push({ key: '7', label: 'Stand (keep current)', action: 'dice_stand' });
  } else {
    items.push({ key: '1', label: 'See results', action: 'dice_stand' });
  }
  return items;
}

function clear(color = '#0a0a12') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 320, 200);
}

function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function circle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2);
  ctx.fill();
}

function line(x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(Math.round(x1), Math.round(y1));
  ctx.lineTo(Math.round(x2), Math.round(y2));
  ctx.stroke();
}

function text(str, x, y, color = '#c0c0c0', size = 8) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Press Start 2P', monospace`;
  ctx.textBaseline = 'top';
  ctx.fillText(str, Math.round(x), Math.round(y));
}

function textCenter(str, y, color = '#c0c0c0', size = 8) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Press Start 2P', monospace`;
  ctx.textBaseline = 'top';
  const w = ctx.measureText(str).width;
  ctx.fillText(str, Math.round((320 - w) / 2), Math.round(y));
}

// Draw a progress bar (HP, MP, XP etc.)
function progressBar(x, y, w, h, ratio, fgColor, bgColor = '#1a1a2a') {
  rect(x, y, w, h, bgColor);
  if (ratio > 0) {
    rect(x, y, Math.round(w * Math.min(1, ratio)), h, fgColor);
  }
}

// Get the raw context for advanced drawing
function getCtx() { return ctx; }
function getCanvas() { return canvas; }
/* ============================================================
   items.js — Equipment and consumable definitions
   ============================================================ */

const WEAPONS = {
  // Helsinki tier (levels 1-3)
  fists:        { id: 'fists', name: 'Bare Fists', attackBonus: 0, price: 0, region: 'helsinki' },
  wooden_sword: { id: 'wooden_sword', name: 'Wooden Sword', attackBonus: 3, price: 50, region: 'helsinki' },
  bronze_axe:   { id: 'bronze_axe', name: 'Bronze Axe', attackBonus: 5, price: 120, region: 'helsinki' },
  iron_mace:    { id: 'iron_mace', name: 'Iron Mace', attackBonus: 8, price: 250, region: 'helsinki' },
  market_blade: { id: 'market_blade', name: 'Market Blade', attackBonus: 11, price: 400, region: 'helsinki' },

  // Espoo tier (levels 4-6)
  tech_blade:   { id: 'tech_blade', name: 'Techno Blade', attackBonus: 14, price: 600, region: 'espoo' },
  forest_bow:   { id: 'forest_bow', name: 'Nuuksio Bow', attackBonus: 17, price: 900, region: 'espoo' },
  hiisi_spear:  { id: 'hiisi_spear', name: 'Hiisi Spear', attackBonus: 21, price: 1400, region: 'espoo' },

  // Vantaa tier (levels 7-9)
  steel_katana: { id: 'steel_katana', name: 'Steel Katana', attackBonus: 26, price: 2000, region: 'vantaa' },
  thunder_axe:  { id: 'thunder_axe', name: 'Thunder Axe', attackBonus: 31, price: 3000, region: 'vantaa' },
  ghost_blade:  { id: 'ghost_blade', name: 'Ghost Blade', attackBonus: 37, price: 4500, region: 'vantaa' },

  // Kauniainen tier (levels 10-12)
  ancient_sword:  { id: 'ancient_sword', name: 'Ancient Sword', attackBonus: 44, price: 6500, region: 'kauniainen' },
  tuoni_scythe:   { id: 'tuoni_scythe', name: "Tuoni's Scythe", attackBonus: 52, price: 9000, region: 'kauniainen' },
  sampo_blade:    { id: 'sampo_blade', name: 'Sampo Blade', attackBonus: 60, price: 0, region: 'kauniainen', quest: true },
};

const ARMORS = {
  clothes:      { id: 'clothes', name: 'Old Clothes', defenseBonus: 0, price: 0, region: 'helsinki' },
  leather_vest: { id: 'leather_vest', name: 'Leather Vest', defenseBonus: 3, price: 40, region: 'helsinki' },
  chain_mail:   { id: 'chain_mail', name: 'Chain Mail', defenseBonus: 6, price: 150, region: 'helsinki' },
  iron_plate:   { id: 'iron_plate', name: 'Iron Plate', defenseBonus: 9, price: 350, region: 'helsinki' },

  tech_suit:    { id: 'tech_suit', name: 'Tech Suit', defenseBonus: 13, price: 550, region: 'espoo' },
  bark_armor:   { id: 'bark_armor', name: 'Bark Armor', defenseBonus: 17, price: 850, region: 'espoo' },
  hiisi_hide:   { id: 'hiisi_hide', name: 'Hiisi Hide', defenseBonus: 22, price: 1300, region: 'espoo' },

  steel_plate:  { id: 'steel_plate', name: 'Steel Plate', defenseBonus: 28, price: 2200, region: 'vantaa' },
  storm_cloak:  { id: 'storm_cloak', name: 'Storm Cloak', defenseBonus: 34, price: 3500, region: 'vantaa' },

  ancient_mail: { id: 'ancient_mail', name: 'Ancient Mail', defenseBonus: 42, price: 5500, region: 'kauniainen' },
  tuoni_shroud: { id: 'tuoni_shroud', name: "Tuoni's Shroud", defenseBonus: 50, price: 8000, region: 'kauniainen' },
};

const ACCESSORIES = {
  silver_ring:  { id: 'silver_ring', name: 'Silver Ring', effect: 'hpRegen', value: 2, desc: '+2 HP/turn', price: 200, region: 'helsinki' },
  lucky_coin:   { id: 'lucky_coin', name: 'Lucky Coin', effect: 'goldBonus', value: 0.2, desc: '+20% gold', price: 300, region: 'helsinki' },
  mana_pendant: { id: 'mana_pendant', name: 'Mana Pendant', effect: 'mpRegen', value: 2, desc: '+2 MP/turn', price: 350, region: 'espoo' },
  crit_amulet:  { id: 'crit_amulet', name: 'Crit Amulet', effect: 'critBonus', value: 0.15, desc: '+15% crit', price: 500, region: 'espoo' },
  speed_boots:  { id: 'speed_boots', name: 'Speed Boots', effect: 'speedBonus', value: 3, desc: '+3 Speed', price: 700, region: 'vantaa' },
  fire_ward:    { id: 'fire_ward', name: 'Fire Ward', effect: 'fireResist', value: 0.4, desc: '-40% fire dmg', price: 900, region: 'vantaa' },
  sampo_shard:  { id: 'sampo_shard', name: 'Sampo Shard', effect: 'allStats', value: 5, desc: '+5 all stats', price: 0, region: 'kauniainen', quest: true },

  // Charm reward accessories (one per tavern NPC)
  press_badge:  { id: 'press_badge', name: "Saara's Press Badge", effect: 'xpBonus', value: 0.15, desc: '+15% XP', price: 0, region: 'helsinki', charm: true },
  debug_ring:   { id: 'debug_ring', name: "Juhani's Debug Ring", effect: 'magicBonus', value: 5, desc: '+5 Magic', price: 0, region: 'espoo', charm: true },
  travel_charm: { id: 'travel_charm', name: "Katariina's Charm", effect: 'dodgeBonus', value: 0.1, desc: '+10% dodge', price: 0, region: 'vantaa', charm: true },
  forest_heart: { id: 'forest_heart', name: "Tapio's Heart", effect: 'hpRegen', value: 8, desc: '+8 HP/turn', price: 0, region: 'kauniainen', charm: true },
};

const CONSUMABLES = {
  potion_small: { id: 'potion_small', name: 'Small Potion', type: 'heal', value: 20, price: 15, desc: 'Heal 20 HP' },
  potion_medium:{ id: 'potion_medium', name: 'Medium Potion', type: 'heal', value: 50, price: 40, desc: 'Heal 50 HP' },
  potion_large: { id: 'potion_large', name: 'Large Potion', type: 'heal', value: 120, price: 100, desc: 'Heal 120 HP' },
  potion_full:  { id: 'potion_full', name: 'Full Potion', type: 'fullheal', value: 0, price: 250, desc: 'Full HP restore' },
  mana_small:   { id: 'mana_small', name: 'Small Mana Potion', type: 'mana', value: 15, price: 20, desc: 'Restore 15 MP' },
  mana_large:   { id: 'mana_large', name: 'Large Mana Potion', type: 'mana', value: 40, price: 60, desc: 'Restore 40 MP' },
  antidote:     { id: 'antidote', name: 'Antidote', type: 'cure', value: 0, price: 25, desc: 'Cure poison' },
  escape_scroll:{ id: 'escape_scroll', name: 'Escape Scroll', type: 'escape', value: 0, price: 50, desc: 'Flee combat (100%)' },

  // Quest items (not buyable)
  sampo_fragment_1: { id: 'sampo_fragment_1', name: 'Sampo Fragment (Helsinki)', type: 'quest', value: 0, price: 0, desc: 'A piece of the mythical Sampo' },
  sampo_fragment_2: { id: 'sampo_fragment_2', name: 'Sampo Fragment (Espoo)', type: 'quest', value: 0, price: 0, desc: 'A piece of the mythical Sampo' },
  sampo_fragment_3: { id: 'sampo_fragment_3', name: 'Sampo Fragment (Vantaa)', type: 'quest', value: 0, price: 0, desc: 'A piece of the mythical Sampo' },
  sampo_fragment_4: { id: 'sampo_fragment_4', name: 'Sampo Fragment (Kauniainen)', type: 'quest', value: 0, price: 0, desc: 'A piece of the mythical Sampo' },
  tram_key:         { id: 'tram_key', name: 'Tram Depot Key', type: 'quest', value: 0, price: 0, desc: 'Key to the old tram depot' },
  server_core:      { id: 'server_core', name: 'Server Core', type: 'quest', value: 0, price: 0, desc: 'Pulsing with strange energy' },
  tuonela_pass:     { id: 'tuonela_pass', name: 'Tuonela Transit Pass', type: 'quest', value: 0, price: 0, desc: 'Valid for one-way travel' },

  // Crafting materials (dropped by monsters)
  rat_fang:       { id: 'rat_fang', name: 'Rat Fang', type: 'material', value: 0, price: 5, desc: 'A yellowed fang. Surprisingly sharp.' },
  troll_hide:     { id: 'troll_hide', name: 'Troll Hide', type: 'material', value: 0, price: 8, desc: 'Thick, beer-stained leather.' },
  ghost_essence:  { id: 'ghost_essence', name: 'Ghost Essence', type: 'material', value: 0, price: 12, desc: 'A wisp of spectral energy in a bottle.' },
  tech_chip:      { id: 'tech_chip', name: 'Tech Chip', type: 'material', value: 0, price: 15, desc: 'A circuit board fragment that still hums.' },
  hiisi_bark:     { id: 'hiisi_bark', name: 'Hiisi Bark', type: 'material', value: 0, price: 18, desc: 'Bark from a forest demon. Warm to the touch.' },
  drake_scale:    { id: 'drake_scale', name: 'Drake Scale', type: 'material', value: 0, price: 25, desc: 'Iridescent and fireproof.' },
  storm_shard:    { id: 'storm_shard', name: 'Storm Shard', type: 'material', value: 0, price: 30, desc: 'A crystallized piece of lightning.' },
  ancient_rune:   { id: 'ancient_rune', name: 'Ancient Rune', type: 'material', value: 0, price: 40, desc: 'A stone tablet fragment pulsing with old magic.' },
  aurora_dust:    { id: 'aurora_dust', name: 'Aurora Dust', type: 'material', value: 0, price: 50, desc: 'Shimmering powder from the northern lights.' },
};

// Crafting recipes — Ilmari the blacksmith
const CRAFT_RECIPES = [
  { id: 'craft_rat_blade', name: 'Rat-Tooth Dagger', materials: [{ id: 'rat_fang', qty: 3 }], result: { type: 'weapon', id: 'rat_dagger' }, desc: 'A blade studded with rat fangs. Gross but effective.' },
  { id: 'craft_troll_armor', name: 'Troll-Hide Vest', materials: [{ id: 'troll_hide', qty: 3 }], result: { type: 'armor', id: 'troll_vest' }, desc: 'Smells terrible. Stops swords.' },
  { id: 'craft_ghost_ring', name: 'Spectral Band', materials: [{ id: 'ghost_essence', qty: 3 }], result: { type: 'accessory', id: 'spectral_band' }, desc: 'Your hand goes slightly transparent. MP flows freely.' },
  { id: 'craft_tech_blade', name: 'Overclocked Blade', materials: [{ id: 'tech_chip', qty: 3 }, { id: 'hiisi_bark', qty: 2 }], result: { type: 'weapon', id: 'overclocked_blade' }, desc: 'A sword that runs at 4.2GHz.' },
  { id: 'craft_drake_mail', name: 'Drakefire Plate', materials: [{ id: 'drake_scale', qty: 4 }], result: { type: 'armor', id: 'drakefire_plate' }, desc: 'Warm in winter. Fireproof all year.' },
  { id: 'craft_storm_axe', name: 'Thunderstrike Axe', materials: [{ id: 'storm_shard', qty: 3 }, { id: 'drake_scale', qty: 2 }], result: { type: 'weapon', id: 'storm_axe' }, desc: 'Each swing cracks like thunder.' },
  { id: 'craft_aurora_cloak', name: 'Aurora Cloak', materials: [{ id: 'aurora_dust', qty: 4 }, { id: 'ancient_rune', qty: 2 }], result: { type: 'armor', id: 'aurora_cloak' }, desc: 'Woven from frozen northern lights. Beautiful and impossible.' },
  { id: 'craft_rune_amulet', name: 'Rune Amulet', materials: [{ id: 'ancient_rune', qty: 3 }], result: { type: 'accessory', id: 'rune_amulet' }, desc: 'Ancient power hums against your chest.' },
];

// Crafted items (not sold in shops)
const CRAFTED_WEAPONS = {
  rat_dagger:        { id: 'rat_dagger', name: 'Rat-Tooth Dagger', attackBonus: 7, price: 0 },
  overclocked_blade: { id: 'overclocked_blade', name: 'Overclocked Blade', attackBonus: 19, price: 0 },
  storm_axe:         { id: 'storm_axe', name: 'Thunderstrike Axe', attackBonus: 35, price: 0 },
};
const CRAFTED_ARMORS = {
  troll_vest:     { id: 'troll_vest', name: 'Troll-Hide Vest', defenseBonus: 8, price: 0 },
  drakefire_plate:{ id: 'drakefire_plate', name: 'Drakefire Plate', defenseBonus: 32, price: 0 },
  aurora_cloak:   { id: 'aurora_cloak', name: 'Aurora Cloak', defenseBonus: 48, price: 0 },
};
const CRAFTED_ACCESSORIES = {
  spectral_band: { id: 'spectral_band', name: 'Spectral Band', effect: 'mpRegen', value: 4, desc: '+4 MP/turn', price: 0 },
  rune_amulet:   { id: 'rune_amulet', name: 'Rune Amulet', effect: 'allStats', value: 3, desc: '+3 all stats', price: 0 },
};

function getShopWeapons(region) {
  return Object.values(WEAPONS).filter(w => w.region === region && w.price > 0 && !w.quest);
}

function getShopArmors(region) {
  return Object.values(ARMORS).filter(a => a.region === region && a.price > 0);
}

function getShopAccessories(region) {
  return Object.values(ACCESSORIES).filter(a => a.region === region && a.price > 0 && !a.charm && !a.quest);
}

function getShopConsumables() {
  return Object.values(CONSUMABLES).filter(c => c.price > 0);
}

function getItemById(id) {
  return WEAPONS[id] || ARMORS[id] || ACCESSORIES[id] || CONSUMABLES[id]
    || CRAFTED_WEAPONS[id] || CRAFTED_ARMORS[id] || CRAFTED_ACCESSORIES[id] || null;
}

function useConsumable(player, itemId) {
  const item = CONSUMABLES[itemId];
  if (!item) return null;

  switch (item.type) {
    case 'heal':
      const healed = Math.min(item.value, player.maxHp - player.hp);
      player.hp += healed;
      return `Healed ${healed} HP.`;
    case 'fullheal':
      const fullHealed = player.maxHp - player.hp;
      player.hp = player.maxHp;
      return `Fully restored! (+${fullHealed} HP)`;
    case 'mana':
      const manaRestored = Math.min(item.value, player.maxMp - player.mp);
      player.mp += manaRestored;
      return `Restored ${manaRestored} MP.`;
    case 'cure':
      player.poisoned = false;
      player.poisonTurns = 0;
      return 'Poison cured!';
    case 'escape':
      return 'ESCAPE';
    default:
      return null;
  }
}
/* ============================================================
   monsters.js — Monster definitions for all regions
   ============================================================ */

const MONSTERS = {
  // ===== HELSINKI (Levels 1-3) =====
  rautatie_rotta: {
    id: 'rautatie_rotta', name: 'Rautatie-Rotta', region: 'helsinki',
    levelRange: [1, 2],
    hp: 15, strength: 5, defense: 2, speed: 6, magic: 0,
    xpReward: 15, goldReward: 8,
    drops: [{ itemId: 'potion_small', chance: 0.2 }, { itemId: 'rat_fang', chance: 0.35 }],
    attacks: ['bite', 'scratch'],
    weaknesses: ['fire'], resistances: [],
    art: 'drawRautatieRotta',
    desc: 'A bloated rat the size of a dog, its eyes glowing in the metro tunnel darkness.',
    attackMessages: {
      bite: 'The Rautatie-Rotta sinks its yellow teeth into you!',
      scratch: 'The Rautatie-Rotta claws at your legs!',
    }
  },
  torilokit: {
    id: 'torilokit', name: 'Torilokit', region: 'helsinki',
    levelRange: [1, 2],
    hp: 10, strength: 4, defense: 1, speed: 8, magic: 0,
    xpReward: 12, goldReward: 5,
    drops: [{ itemId: 'potion_small', chance: 0.15 }],
    attacks: ['peck', 'divebomb'],
    weaknesses: [], resistances: [],
    art: 'drawTorilokit',
    desc: 'A screaming swarm of seagulls, each one the size of an eagle. They want your lunch.',
    attackMessages: {
      peck: 'The Torilokit pecks at your head furiously!',
      divebomb: 'A gull divebombs straight into your face!',
    }
  },
  kaljatrolli: {
    id: 'kaljatrolli', name: 'Kaljatrolli', region: 'helsinki',
    levelRange: [1, 3],
    hp: 30, strength: 8, defense: 4, speed: 3, magic: 0,
    xpReward: 25, goldReward: 15,
    drops: [{ itemId: 'potion_small', chance: 0.3 }, { itemId: 'troll_hide', chance: 0.3 }],
    attacks: ['punch', 'belch', 'throw_bottle'],
    weaknesses: [], resistances: ['poison'],
    art: 'drawKaljatrolli',
    desc: 'A massive troll reeking of cheap beer. It sways dangerously, but hits like a truck.',
    attackMessages: {
      punch: 'The Kaljatrolli swings a meaty fist at you!',
      belch: 'The Kaljatrolli lets out a toxic belch! The smell alone hurts.',
      throw_bottle: 'The Kaljatrolli hurls an empty bottle at your head!',
    }
  },
  haamuvartija: {
    id: 'haamuvartija', name: 'Haamuvartija', region: 'helsinki',
    levelRange: [2, 3],
    hp: 22, strength: 7, defense: 3, speed: 5, magic: 4,
    xpReward: 30, goldReward: 20,
    drops: [{ itemId: 'mana_small', chance: 0.2 }, { itemId: 'ghost_essence', chance: 0.3 }],
    attacks: ['slash', 'ghostly_wail'],
    weaknesses: ['fire', 'lightning'], resistances: ['physical', 'poison'],
    art: 'drawHaamuvartija',
    desc: 'A spectral soldier from the Suomenlinna fortress, still guarding its post after centuries.',
    attackMessages: {
      slash: 'The ghostly sword passes through your guard!',
      ghostly_wail: 'The Haamuvartija lets out a chilling wail that freezes your blood!',
    }
  },
  meritonttu: {
    id: 'meritonttu', name: 'Meritonttu', region: 'helsinki',
    levelRange: [2, 3],
    hp: 18, strength: 5, defense: 2, speed: 7, magic: 6,
    xpReward: 22, goldReward: 25,
    drops: [{ itemId: 'lucky_coin', chance: 0.05 }, { itemId: 'potion_small', chance: 0.2 }],
    attacks: ['splash', 'trickery'],
    weaknesses: ['lightning'], resistances: ['ice'],
    art: 'drawMeritonttu',
    desc: 'A small, barnacle-covered gnome that emerged from the harbor. Mischievous but dangerous.',
    attackMessages: {
      splash: 'The Meritonttu hurls a ball of freezing seawater!',
      trickery: 'The Meritonttu plays a cruel trick, confusing your senses!',
    }
  },

  // ===== ESPOO (Levels 4-6) =====
  teknopeikko: {
    id: 'teknopeikko', name: 'Teknopeikko', region: 'espoo',
    levelRange: [4, 5],
    hp: 45, strength: 14, defense: 8, speed: 7, magic: 6,
    xpReward: 55, goldReward: 35,
    drops: [{ itemId: 'potion_medium', chance: 0.2 }, { itemId: 'tech_chip', chance: 0.3 }],
    attacks: ['zap', 'hack', 'overclock'],
    weaknesses: ['ice'], resistances: ['lightning'],
    art: 'drawTeknopeikko',
    desc: 'A goblin-like creature wrapped in tangled cables, sparks flying from its fingers.',
    attackMessages: {
      zap: 'The Teknopeikko zaps you with a burst of static!',
      hack: 'The Teknopeikko scrambles your thoughts with digital noise!',
      overclock: 'The Teknopeikko overclocks and attacks twice as fast!',
    }
  },
  nuuksion_hiisi: {
    id: 'nuuksion_hiisi', name: 'Nuuksion Hiisi', region: 'espoo',
    levelRange: [4, 6],
    hp: 55, strength: 16, defense: 10, speed: 5, magic: 8,
    xpReward: 70, goldReward: 40,
    drops: [{ itemId: 'antidote', chance: 0.25 }, { itemId: 'hiisi_bark', chance: 0.3 }],
    attacks: ['claw', 'dark_magic', 'root_snare'],
    weaknesses: ['fire'], resistances: ['dark', 'poison'],
    art: 'drawNuuksionHiisi',
    desc: 'An ancient forest demon with bark-like skin and eyes of smoldering amber.',
    attackMessages: {
      claw: 'The Hiisi rakes you with gnarled claws!',
      dark_magic: 'Dark energy erupts from the Hiisi\'s hands!',
      root_snare: 'Roots burst from the ground, entangling you!',
    }
  },
  koodihirvio: {
    id: 'koodihirvio', name: 'Koodihirviö', region: 'espoo',
    levelRange: [4, 5],
    hp: 35, strength: 10, defense: 6, speed: 10, magic: 12,
    xpReward: 50, goldReward: 45,
    drops: [{ itemId: 'mana_small', chance: 0.3 }],
    attacks: ['buffer_overflow', 'null_pointer', 'stack_trace'],
    weaknesses: ['physical'], resistances: ['lightning', 'dark'],
    art: 'drawKoodihirvio',
    desc: 'A glitching aberration of raw data, its form constantly shifting between shapes.',
    attackMessages: {
      buffer_overflow: 'The Koodihirviö overflows your mental buffers!',
      null_pointer: 'A null pointer exception tears at reality!',
      stack_trace: 'The Koodihirviö dumps a stack trace into your mind!',
    }
  },
  jarvenakki: {
    id: 'jarvenakki', name: 'Järvennäkki', region: 'espoo',
    levelRange: [5, 6],
    hp: 50, strength: 13, defense: 7, speed: 8, magic: 14,
    xpReward: 75, goldReward: 50,
    drops: [{ itemId: 'mana_large', chance: 0.15 }],
    attacks: ['drown', 'siren_song', 'whirlpool'],
    weaknesses: ['lightning', 'fire'], resistances: ['ice'],
    art: 'drawJarvenakki',
    desc: 'A beautiful and terrible water spirit rising from the lake, hair flowing like currents.',
    attackMessages: {
      drown: 'The Näkki drags you beneath the waves!',
      siren_song: 'An enchanting melody weakens your resolve!',
      whirlpool: 'A whirlpool of freezing water engulfs you!',
    }
  },
  betonijatti: {
    id: 'betonijatti', name: 'Betonijätti', region: 'espoo',
    levelRange: [5, 6],
    hp: 80, strength: 20, defense: 18, speed: 2, magic: 0,
    xpReward: 85, goldReward: 55,
    drops: [{ itemId: 'potion_medium', chance: 0.3 }],
    attacks: ['crush', 'groundslam', 'throw_rebar'],
    weaknesses: ['ice', 'dark'], resistances: ['physical', 'fire', 'lightning'],
    art: 'drawBetonijatti',
    desc: 'A golem of concrete and rebar, born from an abandoned construction site. Each step shakes the ground.',
    attackMessages: {
      crush: 'The Betonijätti brings its massive fist down!',
      groundslam: 'The ground cracks as the Betonijätti slams the earth!',
      throw_rebar: 'A twisted rebar spear flies at you!',
    }
  },

  // ===== VANTAA (Levels 7-9) =====
  lentokenttadrake: {
    id: 'lentokenttadrake', name: 'Lentokenttädrake', region: 'vantaa',
    levelRange: [7, 8],
    hp: 90, strength: 25, defense: 15, speed: 12, magic: 10,
    xpReward: 130, goldReward: 80,
    drops: [{ itemId: 'potion_large', chance: 0.2 }, { itemId: 'drake_scale', chance: 0.3 }],
    attacks: ['flame_breath', 'tail_whip', 'wing_gust'],
    weaknesses: ['ice'], resistances: ['fire'],
    art: 'drawLentokenttadrake',
    desc: 'A medium-sized drake nesting in the abandoned airport terminal. Its scales shimmer like jet fuel.',
    attackMessages: {
      flame_breath: 'The drake unleashes a torrent of flame!',
      tail_whip: 'The drake\'s tail cracks like a whip!',
      wing_gust: 'A powerful gust from its wings throws you back!',
    }
  },
  keravanjoki_kraken: {
    id: 'keravanjoki_kraken', name: 'Keravanjoki-Kraken', region: 'vantaa',
    levelRange: [7, 9],
    hp: 110, strength: 22, defense: 14, speed: 6, magic: 15,
    xpReward: 150, goldReward: 90,
    drops: [{ itemId: 'mana_large', chance: 0.25 }],
    attacks: ['tentacle', 'ink_cloud', 'constrict'],
    weaknesses: ['lightning', 'fire'], resistances: ['ice', 'physical'],
    art: 'drawKeravanjokkiKraken',
    desc: 'Massive tentacles rise from the Keravanjoki river, each one thick as a tree trunk.',
    attackMessages: {
      tentacle: 'A slimy tentacle lashes across your body!',
      ink_cloud: 'A cloud of ink blinds you!',
      constrict: 'The Kraken wraps a tentacle around you, squeezing!',
    }
  },
  tullidemoni: {
    id: 'tullidemoni', name: 'Tullidemoni', region: 'vantaa',
    levelRange: [7, 8],
    hp: 75, strength: 18, defense: 20, speed: 4, magic: 20,
    xpReward: 120, goldReward: 100,
    drops: [{ itemId: 'potion_large', chance: 0.15 }],
    attacks: ['red_tape', 'bureaucratic_curse', 'stamp_of_doom'],
    weaknesses: ['fire'], resistances: ['dark', 'physical'],
    art: 'drawTullidemoni',
    desc: 'A fiend in a customs uniform, drowning in paperwork. Its rubber stamp glows with dark power.',
    attackMessages: {
      red_tape: 'The Tullidemoni binds you in magical red tape!',
      bureaucratic_curse: 'Your passport has been DENIED. The pain is real.',
      stamp_of_doom: 'The stamp of REJECTED burns into your flesh!',
    }
  },
  terasvartija: {
    id: 'terasvartija', name: 'Teräsvartija', region: 'vantaa',
    levelRange: [8, 9],
    hp: 120, strength: 28, defense: 25, speed: 3, magic: 0,
    xpReward: 160, goldReward: 85,
    drops: [{ itemId: 'potion_large', chance: 0.3 }],
    attacks: ['steel_punch', 'laser', 'self_repair'],
    weaknesses: ['lightning', 'dark'], resistances: ['physical', 'fire', 'ice', 'poison'],
    art: 'drawTerasvartija',
    desc: 'An industrial robot gone haywire, its red eye scanning for targets.',
    attackMessages: {
      steel_punch: 'The Teräsvartija drives a steel fist into you!',
      laser: 'A precision laser beam sears across your chest!',
      self_repair: 'The Teräsvartija repairs itself with a mechanical whir!',
    }
  },
  myrskyhaamu: {
    id: 'myrskyhaamu', name: 'Myrskyhaamu', region: 'vantaa',
    levelRange: [8, 9],
    hp: 85, strength: 20, defense: 10, speed: 15, magic: 22,
    xpReward: 145, goldReward: 95,
    drops: [{ itemId: 'escape_scroll', chance: 0.1 }, { itemId: 'mana_large', chance: 0.2 }, { itemId: 'storm_shard', chance: 0.25 }],
    attacks: ['lightning_bolt', 'gale_force', 'phantom_chill'],
    weaknesses: ['fire'], resistances: ['lightning', 'ice', 'physical'],
    art: 'drawMyrskyhaamu',
    desc: 'The spirit of a crashed aircraft, a howling ghost wreathed in storm clouds.',
    attackMessages: {
      lightning_bolt: 'Lightning arcs from the Myrskyhaamu!',
      gale_force: 'Hurricane winds tear at you!',
      phantom_chill: 'An unearthly cold seeps into your bones!',
    }
  },

  // ===== KAUNIAINEN (Levels 10-12) =====
  ikivanha_hiisi: {
    id: 'ikivanha_hiisi', name: 'Ikivanha Hiisi', region: 'kauniainen',
    levelRange: [10, 11],
    hp: 160, strength: 35, defense: 22, speed: 8, magic: 25,
    xpReward: 250, goldReward: 150,
    drops: [{ itemId: 'potion_full', chance: 0.15 }, { itemId: 'ancient_rune', chance: 0.25 }],
    attacks: ['ancient_curse', 'claw', 'summon_roots'],
    weaknesses: ['fire'], resistances: ['dark', 'poison', 'physical'],
    art: 'drawIkivanhaHiisi',
    desc: 'An ancient forest demon, older than Helsinki itself. Trees bow in its presence.',
    attackMessages: {
      ancient_curse: 'The Ikivanha Hiisi speaks a word of power from ages past!',
      claw: 'Ancient claws rend through your armor!',
      summon_roots: 'The very forest attacks at the Hiisi\'s command!',
    }
  },
  tuonenvartija: {
    id: 'tuonenvartija', name: 'Tuonenvartija', region: 'kauniainen',
    levelRange: [10, 11],
    hp: 140, strength: 30, defense: 28, speed: 6, magic: 30,
    xpReward: 280, goldReward: 130,
    drops: [{ itemId: 'mana_large', chance: 0.3 }],
    attacks: ['death_touch', 'soul_drain', 'dark_barrier'],
    weaknesses: ['fire', 'lightning'], resistances: ['dark', 'ice', 'physical', 'poison'],
    art: 'drawTuonenvartija',
    desc: 'A grim guardian of the realm of the dead. Its hollow eyes see through time.',
    attackMessages: {
      death_touch: 'The cold hand of death reaches for your heart!',
      soul_drain: 'Your life force is pulled toward the underworld!',
      dark_barrier: 'The Tuonenvartija raises a shield of pure darkness!',
    }
  },
  sammon_varjo: {
    id: 'sammon_varjo', name: 'Sammon Varjo', region: 'kauniainen',
    levelRange: [10, 12],
    hp: 130, strength: 25, defense: 15, speed: 12, magic: 35,
    xpReward: 260, goldReward: 160,
    drops: [{ itemId: 'potion_full', chance: 0.1 }],
    attacks: ['reality_warp', 'shadow_bolt', 'entropy'],
    weaknesses: ['physical'], resistances: ['fire', 'ice', 'lightning', 'dark'],
    art: 'drawSammonVarjo',
    desc: 'The corrupted shadow of the mythical Sampo, a swirling vortex of broken reality.',
    attackMessages: {
      reality_warp: 'Reality bends and twists around you!',
      shadow_bolt: 'A bolt of pure shadow strikes!',
      entropy: 'Entropy itself eats away at your form!',
    }
  },
  jainen_louhitar: {
    id: 'jainen_louhitar', name: 'Jäinen Louhitar', region: 'kauniainen',
    levelRange: [11, 12],
    hp: 180, strength: 32, defense: 24, speed: 10, magic: 38,
    xpReward: 320, goldReward: 180,
    drops: [{ itemId: 'potion_full', chance: 0.2 }],
    attacks: ['blizzard', 'ice_prison', 'frost_lance', 'absolute_zero'],
    weaknesses: ['fire'], resistances: ['ice', 'lightning', 'dark'],
    art: 'drawJainenLouhitar',
    desc: 'An ice sorceress of terrible beauty, the air crystallizing around her.',
    attackMessages: {
      blizzard: 'A howling blizzard engulfs everything!',
      ice_prison: 'Ice encases your limbs, holding you fast!',
      frost_lance: 'A spear of pure ice pierces through you!',
      absolute_zero: 'The temperature drops to absolute zero!',
    }
  },

  // ===== BOSS: THE DRAGON =====
  lohikaarme: {
    id: 'lohikaarme', name: 'Lohikaarme', region: 'kauniainen',
    levelRange: [12, 12],
    hp: 500, strength: 55, defense: 40, speed: 8, magic: 45,
    xpReward: 0, goldReward: 0,
    drops: [],
    attacks: ['fire_storm', 'tail_crush', 'ancient_roar', 'inferno'],
    weaknesses: [], resistances: ['fire', 'physical', 'dark'],
    isBoss: true,
    art: 'drawLohikaarme',
    desc: 'The ancient dragon of Helsinki, Lohikaarme. It rises from beneath the hills, scales burning like embers, eyes older than the land itself.',
    attackMessages: {
      fire_storm: 'Lohikaarme unleashes a storm of dragonfire!',
      tail_crush: 'The dragon\'s massive tail crashes down!',
      ancient_roar: 'An earth-shaking roar shatters your concentration!',
      inferno: 'The world turns to fire. Everything burns.',
    }
  },
  // ===== NEW MONSTERS — DAY/NIGHT VARIANTS =====

  // --- Helsinki Day ---
  postikyyhky: {
    id: 'postikyyhky', name: 'Postikyyhky', region: 'helsinki',
    levelRange: [1, 2], timeOfDay: 'day',
    hp: 12, strength: 3, defense: 1, speed: 9, magic: 0,
    xpReward: 10, goldReward: 4,
    drops: [{ itemId: 'potion_small', chance: 0.1 }],
    attacks: ['peck', 'divebomb'],
    weaknesses: [], resistances: [],
    art: 'drawPostikyyhky',
    desc: 'A pigeon the size of a turkey. It is carrying a letter that is definitely not for you.',
    attackMessages: {
      peck: 'The Postikyyhky pecks at your sandwich hand!',
      divebomb: 'Special delivery! The pigeon dive-bombs your head!',
    }
  },
  kahvizombi: {
    id: 'kahvizombi', name: 'Kahvizombi', region: 'helsinki',
    levelRange: [1, 3], timeOfDay: 'day',
    hp: 20, strength: 6, defense: 3, speed: 2, magic: 0,
    xpReward: 18, goldReward: 12,
    drops: [{ itemId: 'potion_small', chance: 0.2 }],
    attacks: ['slap', 'groan', 'spill'],
    weaknesses: ['fire'], resistances: ['dark'],
    art: 'drawKahvizombi',
    desc: 'A shambling figure clutching an empty coffee cup. It hasn\'t had its morning brew. It is extremely dangerous.',
    attackMessages: {
      slap: 'The Kahvizombi slaps you with a limp, caffeinated hand!',
      groan: 'The Kahvizombi groans so loudly your ears ring!',
      spill: 'The Kahvizombi hurls scalding old coffee at you!',
    }
  },

  // --- Helsinki Night ---
  yolohi: {
    id: 'yolohi', name: 'Yölöhi', region: 'helsinki',
    levelRange: [1, 3], timeOfDay: 'night',
    hp: 25, strength: 7, defense: 2, speed: 7, magic: 3,
    xpReward: 22, goldReward: 18,
    drops: [{ itemId: 'mana_small', chance: 0.2 }],
    attacks: ['shadow_scratch', 'howl'],
    weaknesses: ['fire'], resistances: ['dark'],
    art: 'drawYolohi',
    desc: 'A shadow that has peeled itself off the wall. It smells faintly of tar and regret.',
    attackMessages: {
      shadow_scratch: 'The Yölöhi scratches you with fingers made of darkness!',
      howl: 'The Yölöhi howls — the sound of every missed last bus!',
    }
  },
  kallio_vampyyri: {
    id: 'kallio_vampyyri', name: 'Kallio-Vampyyri', region: 'helsinki',
    levelRange: [2, 3], timeOfDay: 'night',
    hp: 28, strength: 8, defense: 4, speed: 6, magic: 5,
    xpReward: 28, goldReward: 22,
    drops: [{ itemId: 'potion_small', chance: 0.25 }],
    attacks: ['bite', 'mesmerize', 'bat_swarm'],
    weaknesses: ['fire'], resistances: ['dark', 'poison'],
    art: 'drawKallioVampyyri',
    desc: 'Pale, stylish, and irritated. This vampire was gentrified out of Sörnäinen and is not happy about it.',
    attackMessages: {
      bite: 'The vampire bites your neck! Very cliché, but it hurts!',
      mesmerize: 'The Vampyyri stares into your eyes with hypnotic intensity!',
      bat_swarm: 'A swarm of tiny bats erupts from its vintage leather jacket!',
    }
  },

  // --- Espoo Day ---
  startup_golem: {
    id: 'startup_golem', name: 'Startup-Golemi', region: 'espoo',
    levelRange: [4, 6], timeOfDay: 'day',
    hp: 60, strength: 15, defense: 12, speed: 3, magic: 5,
    xpReward: 65, goldReward: 50,
    drops: [{ itemId: 'potion_medium', chance: 0.2 }],
    attacks: ['pitch_deck', 'pivot', 'crush'],
    weaknesses: ['fire', 'physical'], resistances: ['lightning'],
    art: 'drawStartupGolemi',
    desc: 'A golem made of failed pitch decks and broken dreams. Its chest reads "SERIES B". It is disrupting your face.',
    attackMessages: {
      pitch_deck: 'The Startup-Golemi throws a 200-slide pitch deck at your face!',
      pivot: 'The Golemi pivots violently and slams into you!',
      crush: 'The Golemi crushes you under the weight of unrealistic expectations!',
    }
  },
  nuuksio_karhu: {
    id: 'nuuksio_karhu', name: 'Nuuksio-Karhu', region: 'espoo',
    levelRange: [5, 6], timeOfDay: 'day',
    hp: 70, strength: 18, defense: 14, speed: 5, magic: 0,
    xpReward: 75, goldReward: 40,
    drops: [{ itemId: 'potion_medium', chance: 0.25 }],
    attacks: ['maul', 'roar', 'swipe'],
    weaknesses: ['fire'], resistances: ['physical', 'ice'],
    art: 'drawNuuksioKarhu',
    desc: 'An enormous bear that has eaten three hikers\' packed lunches. Not the hikers. Just the lunches. It wants yours too.',
    attackMessages: {
      maul: 'The bear mauls you with terrifying efficiency!',
      roar: 'A roar echoes through Nuuksio! Your legs feel weak!',
      swipe: 'A massive paw swipes you off your feet!',
    }
  },

  // --- Espoo Night ---
  wlan_haamu: {
    id: 'wlan_haamu', name: 'WLAN-Haamu', region: 'espoo',
    levelRange: [4, 5], timeOfDay: 'night',
    hp: 40, strength: 10, defense: 5, speed: 12, magic: 10,
    xpReward: 55, goldReward: 45,
    drops: [{ itemId: 'mana_small', chance: 0.3 }],
    attacks: ['disconnect', 'lag_spike', 'packet_loss'],
    weaknesses: ['physical'], resistances: ['lightning', 'dark'],
    art: 'drawWlanHaamu',
    desc: 'The ghost of a dead WiFi router. It flickers between 2.4GHz and 5GHz. Connection: UNSTABLE.',
    attackMessages: {
      disconnect: 'Your connection to reality drops! The WLAN-Haamu strikes!',
      lag_spike: 'Time stutters — a lag spike in reality itself!',
      packet_loss: 'Parts of you briefly stop existing! Packet loss: 43%.',
    }
  },

  // --- Vantaa Day ---
  laukkuhaukka: {
    id: 'laukkuhaukka', name: 'Laukkuhaukka', region: 'vantaa',
    levelRange: [7, 8], timeOfDay: 'day',
    hp: 80, strength: 22, defense: 12, speed: 14, magic: 0,
    xpReward: 120, goldReward: 70,
    drops: [{ itemId: 'potion_large', chance: 0.15 }],
    attacks: ['dive', 'snatch', 'screech'],
    weaknesses: ['lightning'], resistances: ['physical'],
    art: 'drawLaukkuhaukka',
    desc: 'A hawk the size of a small plane. It circles the airport, waiting to steal your luggage. And possibly you.',
    attackMessages: {
      dive: 'The Laukkuhaukka dives at terminal velocity!',
      snatch: 'It snatches you in its talons and drops you!',
      screech: 'A screech like a jet engine tears through the air!',
    }
  },
  bussi_666: {
    id: 'bussi_666', name: 'Bussi 666', region: 'vantaa',
    levelRange: [7, 9], timeOfDay: 'day',
    hp: 130, strength: 26, defense: 22, speed: 2, magic: 8,
    xpReward: 155, goldReward: 90,
    drops: [{ itemId: 'potion_large', chance: 0.2 }],
    attacks: ['run_over', 'exhaust_fumes', 'doors_closing'],
    weaknesses: ['lightning'], resistances: ['physical', 'fire', 'ice'],
    art: 'drawBussi666',
    desc: 'A possessed HSL bus. Route: 666 to Tuonela. It is 23 minutes late and absolutely furious about it.',
    attackMessages: {
      run_over: 'The bus charges straight at you!',
      exhaust_fumes: 'Toxic exhaust engulfs you!',
      doors_closing: '"OVET SULKEUTUVAT!" The doors slam on you repeatedly!',
    }
  },

  // --- Vantaa Night ---
  kiitotie_susihukka: {
    id: 'kiitotie_susihukka', name: 'Kiitotiesusi', region: 'vantaa',
    levelRange: [8, 9], timeOfDay: 'night',
    hp: 100, strength: 24, defense: 16, speed: 11, magic: 5,
    xpReward: 140, goldReward: 85,
    drops: [{ itemId: 'escape_scroll', chance: 0.1 }],
    attacks: ['fang', 'pack_howl', 'shadow_pounce'],
    weaknesses: ['fire'], resistances: ['dark', 'ice'],
    art: 'drawKiitotiesusi',
    desc: 'A massive wolf prowling the abandoned runways. Its eyes reflect the red runway lights.',
    attackMessages: {
      fang: 'The wolf lunges with bared fangs!',
      pack_howl: 'A howl summons phantom wolves! They all attack!',
      shadow_pounce: 'The wolf vanishes into darkness and strikes from behind!',
    }
  },

  // --- Kauniainen Night ---
  revontulihai: {
    id: 'revontulihai', name: 'Revontulihai', region: 'kauniainen',
    levelRange: [10, 12], timeOfDay: 'night',
    hp: 170, strength: 33, defense: 20, speed: 14, magic: 30,
    xpReward: 300, goldReward: 170,
    drops: [{ itemId: 'potion_full', chance: 0.15 }, { itemId: 'aurora_dust', chance: 0.25 }],
    attacks: ['aurora_beam', 'spectral_bite', 'cosmic_cold'],
    weaknesses: ['physical'], resistances: ['fire', 'ice', 'lightning'],
    art: 'drawRevontulihai',
    desc: 'A shark made of aurora borealis, swimming through the night sky. This is Finland. Don\'t question it.',
    attackMessages: {
      aurora_beam: 'The Revontulihai blasts you with concentrated northern lights!',
      spectral_bite: 'Spectral jaws clamp down on you from above!',
      cosmic_cold: 'The cold of outer space radiates from its body!',
    }
  },
  sammakkoprinssi: {
    id: 'sammakkoprinssi', name: 'Sammakkoprinssi', region: 'kauniainen',
    levelRange: [10, 11], timeOfDay: 'night',
    hp: 140, strength: 28, defense: 25, speed: 8, magic: 28,
    xpReward: 270, goldReward: 200,
    drops: [{ itemId: 'potion_full', chance: 0.1 }],
    attacks: ['royal_decree', 'tongue_lash', 'crown_toss'],
    weaknesses: ['ice', 'lightning'], resistances: ['dark', 'poison'],
    art: 'drawSammakkoprinssi',
    desc: 'A frog wearing a tiny golden crown. He insists he is royalty. His lawyers will be in touch.',
    attackMessages: {
      royal_decree: 'The Sammakkoprinssi decrees your immediate execution!',
      tongue_lash: 'A royal tongue whips across your face at supersonic speed!',
      crown_toss: 'The frog hurls its crown like a golden frisbee of doom!',
    }
  },

  // Spirit phase of dragon
  lohikaarme_spirit: {
    id: 'lohikaarme_spirit', name: 'Lohikaarme (Spirit)', region: 'kauniainen',
    levelRange: [12, 12],
    hp: 300, strength: 30, defense: 15, speed: 14, magic: 60,
    xpReward: 0, goldReward: 0,
    drops: [],
    attacks: ['spirit_flame', 'void_breath', 'soul_rend'],
    weaknesses: ['fire', 'lightning'], resistances: ['physical', 'ice', 'dark'],
    isBoss: true,
    magicOnly: true,
    art: 'drawLohikaarmeSpirit',
    desc: 'The dragon\'s spirit rises from its fallen body, a massive spectral form of pure flame and fury.',
    attackMessages: {
      spirit_flame: 'Ethereal flames consume you from within!',
      void_breath: 'The spirit breathes void itself!',
      soul_rend: 'Your very soul is torn!',
    }
  },
};

function getMonstersByRegion(region) {
  return Object.values(MONSTERS).filter(m => m.region === region && !m.isBoss);
}

function getRandomMonster(region, playerLevel) {
  const time = getTimeOfDay();
  const night = (time === 'night' || time === 'dusk');
  const pool = getMonstersByRegion(region).filter(m => {
    if (playerLevel < m.levelRange[0] || playerLevel > m.levelRange[1] + 2) return false;
    // Filter by time: no timeOfDay = anytime, 'day' = day/dawn, 'night' = night/dusk
    if (m.timeOfDay === 'day' && night) return false;
    if (m.timeOfDay === 'night' && !night) return false;
    return true;
  });
  if (pool.length === 0) return getMonstersByRegion(region)[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

function createMonsterInstance(template, playerLevel) {
  // Scale monster stats slightly based on player level within range
  const levelDiff = Math.max(0, playerLevel - template.levelRange[0]);
  const ngScale = getNgPlusScale();
  const scale = (1 + levelDiff * 0.1) * ngScale;
  return {
    ...template,
    hp: Math.round(template.hp * scale),
    maxHp: Math.round(template.hp * scale),
    strength: Math.round(template.strength * scale),
    defense: Math.round(template.defense * scale),
    speed: Math.round(template.speed * scale),
    magic: Math.round(template.magic * scale),
    xpReward: Math.round(template.xpReward * scale),
    goldReward: Math.round(template.goldReward * (0.8 + Math.random() * 0.4) * scale),
  };
}

function getMonsterById(id) {
  return MONSTERS[id] || null;
}

function getBoss(id) {
  return MONSTERS[id] || null;
}
/* ============================================================
   regions.js — Region definitions and travel logic
   ============================================================ */

const REGIONS = {
  helsinki: {
    id: 'helsinki',
    name: 'Helsinki',
    subtitle: 'The Capital',
    levelRange: [1, 3],
    unlockLevel: 1,
    description: 'The ancient capital, where cobblestone streets hide dark tunnels and the harbor wind carries whispers of sea creatures.',
    healCostBase: 5,
    innCostBase: 15,
  },
  espoo: {
    id: 'espoo',
    name: 'Espoo',
    subtitle: 'The Wilds of Tech',
    levelRange: [4, 6],
    unlockLevel: 4,
    description: 'Where modern technology meets ancient forest. The trees of Nuuksio hold secrets older than silicon.',
    healCostBase: 15,
    innCostBase: 40,
  },
  vantaa: {
    id: 'vantaa',
    name: 'Vantaa',
    subtitle: 'The Shattered Gateway',
    levelRange: [7, 9],
    unlockLevel: 7,
    description: 'The airport lies in ruins, a gateway between worlds. The Keravanjoki river runs dark with otherworldly currents.',
    healCostBase: 30,
    innCostBase: 80,
  },
  kauniainen: {
    id: 'kauniainen',
    name: 'Kauniainen',
    subtitle: 'The Ancient Heart',
    levelRange: [10, 12],
    unlockLevel: 10,
    description: 'A small city with ancient power. The stone arch marks the boundary between the mortal world and something older.',
    healCostBase: 50,
    innCostBase: 150,
  },
};

function getRegion(id) {
  return REGIONS[id] || REGIONS.helsinki;
}

function getUnlockedRegions(playerLevel) {
  return Object.values(REGIONS).filter(r => playerLevel >= r.unlockLevel);
}

function getHealCost(region, playerLevel) {
  const r = REGIONS[region];
  return Math.floor(r.healCostBase * (1 + (playerLevel - 1) * 0.3));
}

function getInnCost(region, playerLevel) {
  const r = REGIONS[region];
  return Math.floor(r.innCostBase * (1 + (playerLevel - 1) * 0.2));
}

function canTravel(targetRegion, playerLevel) {
  const r = REGIONS[targetRegion];
  return playerLevel >= r.unlockLevel;
}
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

// ===================== DAY/NIGHT CYCLE =====================
// Time advances with exploration and resting
// 4 phases: dawn, day, dusk, night (each has 4 "ticks" = 16 ticks per full cycle)
const TIME_PHASES = ['dawn', 'day', 'dusk', 'night'];
const TIME_NAMES = { dawn: 'Dawn', day: 'Day', dusk: 'Dusk', night: 'Night' };
const TIME_COLORS = {
  dawn:  { sky: '#1a1020', tint: 'rgba(255,160,80,0.08)', stars: false },
  day:   { sky: '#0a0a18', tint: null, stars: false },
  dusk:  { sky: '#14080e', tint: 'rgba(200,80,40,0.10)', stars: true },
  night: { sky: '#020208', tint: 'rgba(20,20,60,0.15)', stars: true },
};

function getTimeOfDay() {
  const tick = state.timeTick % 16;
  if (tick < 4) return 'dawn';
  if (tick < 8) return 'day';
  if (tick < 12) return 'dusk';
  return 'night';
}

function advanceTime(ticks = 1) {
  state.timeTick = (state.timeTick + ticks) % 16;
}

function isNight() {
  const t = getTimeOfDay();
  return t === 'night' || t === 'dusk';
}

function applyTimeOverlay() {
  const time = getTimeOfDay();
  const tc = TIME_COLORS[time];
  if (tc.tint) {
    ctx.fillStyle = tc.tint;
    ctx.fillRect(0, 0, 320, 200);
  }
  if (tc.stars) {
    // Extra stars at night
    for (let i = 0; i < 8; i++) {
      const sx = (i * 41 + 13) % 316;
      const sy = (i * 17 + 7) % 50;
      ctx.fillStyle = time === 'night' ? '#ffffff' : '#ffffff80';
      ctx.fillRect(sx, sy, 1, 1);
    }
  }
}

/* ============================================================
   bestiary.js — Monster journal with humorous researcher notes
   ============================================================ */

const BESTIARY_NOTES = {
  rautatie_rotta: "Researcher's note: Feeds primarily on dropped HSL travel cards and human dignity. Avoid eye contact.",
  torilokit: "Researcher's note: A single gull can steal a salmon sandwich in 0.3 seconds. A swarm can steal your will to live.",
  kaljatrolli: "Researcher's note: Blood alcohol level: yes. Surprisingly philosophical after its fourth bottle.",
  haamuvartija: "Researcher's note: Still reports for duty every morning at 0600. Has not been told the war ended.",
  meritonttu: "Researcher's note: Collects shiny objects. Will trade secrets for bottle caps. Do not trust.",
  postikyyhky: "Researcher's note: Delivers mail with 98% accuracy. The other 2% it delivers violence.",
  kahvizombi: "Researcher's note: The only known cure is a double espresso. Without it, all hope is lost.",
  yolohi: "Researcher's note: Born from the shadow of someone who missed the last metro. Smells of regret.",
  kallio_vampyyri: "Researcher's note: Moved to Kallio for the 'atmosphere'. Now IS the atmosphere. Rates vinyl records.",
  teknopeikko: "Researcher's note: Knows 14 programming languages. All of them are cursed.",
  nuuksion_hiisi: "Researcher's note: An ancient guardian of the forest. Dislikes hikers, joggers, and especially cyclists.",
  koodihirvio: "Researcher's note: A living stack overflow. If you understand its error messages, you are already infected.",
  jarvenakki: "Researcher's note: Sings beautifully. Swimming lessons after the concert are NOT optional.",
  betonijatti: "Researcher's note: Was a parking garage in a previous life. Misses the cars.",
  startup_golem: "Researcher's note: Has pivoted 47 times. Current business model: punching adventurers. VC funding: pending.",
  nuuksio_karhu: "Researcher's note: Has developed a sophisticated palate. Prefers rye bread sandwiches. Will reject white bread.",
  wlan_haamu: "Researcher's note: Signal strength varies with mood. Emotional support does not improve connectivity.",
  lentokenttadrake: "Researcher's note: Nests in Terminal 2. Gate B14 is its favorite. Accepts no boarding passes.",
  keravanjoki_kraken: "Researcher's note: Locals blame it for every missing bicycle. The kraken blames the current.",
  tullidemoni: "Researcher's note: Its 'Nothing to Declare' line takes 3 hours. The 'Something to Declare' line leads to Tuonela.",
  terasvartija: "Researcher's note: Still follows its original programming: 'PROTECT WAREHOUSE 7.' Warehouse 7 no longer exists.",
  myrskyhaamu: "Researcher's note: Weather forecast: 100% chance of pain. Carry an umbrella. It won't help.",
  laukkuhaukka: "Researcher's note: Can carry luggage up to 40kg. Does not return it. Has excellent frequent flyer status.",
  bussi_666: "Researcher's note: Runs on time only when chasing prey. Route: everywhere you don't want to be.",
  kiitotie_susihukka: "Researcher's note: Hunts in packs along abandoned runways. Howls sound like jet engines winding down.",
  ikivanha_hiisi: "Researcher's note: Older than Finnish independence. Older than Finland. Older than the concept of 'old'.",
  tuonenvartija: "Researcher's note: Employee of the year in the afterlife, 847 years running. Very committed.",
  sammon_varjo: "Researcher's note: Looking at it directly causes nosebleeds and an urge to file your taxes.",
  jainen_louhitar: "Researcher's note: Her ice palace has central heating. She keeps it off out of spite.",
  revontulihai: "Researcher's note: Scientists cannot explain it. Finns don't try. It's just a sky shark. It's fine.",
  sammakkoprinssi: "Researcher's note: Has been kissed 4,312 times. Still a frog. His lawyers are VERY busy.",
  lohikaarme: "Researcher's note: The big one. The really big one. Maybe bring a friend. And a will.",
  lohikaarme_spirit: "Researcher's note: You killed it and it's STILL fighting? That seems unfair.",
};

function recordBestiaryEntry(monsterId) {
  if (!state.bestiary) state.bestiary = {};
  if (!state.bestiary[monsterId]) {
    state.bestiary[monsterId] = { seen: 0, killed: 0, firstSeen: state.dayCount };
  }
  state.bestiary[monsterId].seen++;
}

function recordBestiaryKill(monsterId) {
  if (!state.bestiary) state.bestiary = {};
  if (!state.bestiary[monsterId]) {
    state.bestiary[monsterId] = { seen: 0, killed: 0, firstSeen: state.dayCount };
  }
  state.bestiary[monsterId].killed++;
}

function getBestiaryEntries() {
  if (!state.bestiary) return [];
  return Object.keys(state.bestiary).map(id => {
    const monster = MONSTERS[id];
    const entry = state.bestiary[id];
    return monster ? { ...monster, ...entry } : null;
  }).filter(Boolean);
}

/* ============================================================
   map.js — Grid map exploration with landmarks
   ============================================================ */

const MAP_SIZE = 9; // 9x9 grid per region
const TOWN_POS = { x: 4, y: 8 }; // Town at bottom-center

// Landmarks per region — {x, y, name, desc, art (canvas color)}
const LANDMARKS = {
  helsinki: [
    { x: 4, y: 8, type: 'town', name: 'Helsinki Town', desc: 'The capital. Safety and warm beds.', color: '#e0c060' },
    { x: 2, y: 5, type: 'landmark', name: 'Old Tram Depot', desc: 'Rusted trams sleep here. Rats skitter in the shadows.', color: '#8a6a3a' },
    { x: 6, y: 3, type: 'landmark', name: 'Suomenlinna Ruins', desc: 'A crumbling sea fortress. Ghosts patrol the walls.', color: '#6a6a8a' },
    { x: 4, y: 1, type: 'landmark', name: 'Cathedral Hill', desc: 'The white dome rises above the trees. Something watches from the steps.', color: '#d0c8b0' },
    { x: 1, y: 7, type: 'landmark', name: 'Harbor Rocks', desc: 'Barnacle-covered stones. The sea gnomes gather here at low tide.', color: '#3a6a6a' },
    { x: 7, y: 5, type: 'landmark', name: 'Kallio Graffiti Wall', desc: 'Colorful and profane. Someone painted "LOUHI WAS HERE" in blood red.', color: '#aa3a6a' },
    { x: 3, y: 3, type: 'landmark', name: 'The Singing Well', desc: 'An ancient well. Faint music rises from the depths.', color: '#4a7aaa' },
    { x: 7, y: 1, type: 'landmark', name: 'Statue of the Unknown Troll', desc: 'A bronze troll, green with age. Coins are wedged in its clenched fist.', color: '#4a8a4a' },
  ],
  espoo: [
    { x: 4, y: 8, type: 'town', name: 'Espoo Town', desc: 'Where technology meets forest. Coffee is mandatory.', color: '#e0c060' },
    { x: 1, y: 3, type: 'landmark', name: 'Nuuksio Deep Lake', desc: 'Crystal clear and impossibly deep. The Näkki watches from below.', color: '#2a4a8a' },
    { x: 6, y: 2, type: 'landmark', name: 'Otaniemi Server Room', desc: 'Abandoned. Screens still flicker with code no one wrote.', color: '#40a0ff' },
    { x: 3, y: 6, type: 'landmark', name: 'Mossy Boulder', desc: 'A glacial erratic covered in thick moss. Mushrooms grow in spiral patterns.', color: '#3a5a3a' },
    { x: 7, y: 5, type: 'landmark', name: 'Fallen Pine Giant', desc: 'A pine tree wider than a house, toppled centuries ago. An ecosystem of its own.', color: '#4a3a1a' },
    { x: 5, y: 1, type: 'landmark', name: 'The WiFi Shrine', desc: 'A stone cairn. Your phone shows full bars here. There is no router.', color: '#60a0c0' },
    { x: 2, y: 7, type: 'landmark', name: 'Startup Graveyard', desc: 'Weathered signs: "Über for Saunas", "Blockchain Berries", "AI Reindeer".', color: '#8a8a6a' },
    { x: 8, y: 3, type: 'landmark', name: 'The Bear Scratch Tree', desc: 'Deep claw marks six meters up. Whatever did this was NOT a normal bear.', color: '#6a4a2a' },
  ],
  vantaa: [
    { x: 4, y: 8, type: 'town', name: 'Vantaa Town', desc: 'The airport looms. The river runs dark.', color: '#e0c060' },
    { x: 2, y: 2, type: 'landmark', name: 'Crashed Plane', desc: 'Nose-down in the earth. Vines grow through the fuselage. The black box still beeps.', color: '#5a5a6a' },
    { x: 6, y: 4, type: 'landmark', name: 'River Crossing', desc: 'A rickety bridge over the Keravanjoki. The water below moves wrong.', color: '#3a5a7a' },
    { x: 1, y: 6, type: 'landmark', name: 'Customs Checkpoint', desc: '"NOTHING TO DECLARE" reads the sign. Paperwork flutters in unnatural wind.', color: '#aa6a3a' },
    { x: 7, y: 1, type: 'landmark', name: 'Control Tower', desc: 'The abandoned control tower. The radar still spins. The screens show flights that don\'t exist.', color: '#4a4a5a' },
    { x: 5, y: 6, type: 'landmark', name: 'Bus Stop 666', desc: 'The timetable lists departures to places you\'ve never heard of. "Next: 3 min."', color: '#cc3030' },
    { x: 3, y: 4, type: 'landmark', name: 'Cargo Hangar 7', desc: 'Half-collapsed. Mechanical sounds inside. Something is still being manufactured.', color: '#5a5a4a' },
    { x: 8, y: 7, type: 'landmark', name: 'Runway\'s End', desc: 'Where the runway meets the forest. Tire marks go INTO the trees.', color: '#3a3a3a' },
  ],
  kauniainen: [
    { x: 4, y: 8, type: 'town', name: 'Kauniainen Town', desc: 'The ancient gate. Where the mortal world grows thin.', color: '#e0c060' },
    { x: 4, y: 1, type: 'landmark', name: 'Dragon\'s Mound', desc: 'The hill pulses with heat. Below, something enormous breathes.', color: '#aa3a0a' },
    { x: 1, y: 4, type: 'landmark', name: 'Rune Circle', desc: 'Seven standing stones carved with proto-Finnish runes. They hum in moonlight.', color: '#6060aa' },
    { x: 7, y: 3, type: 'landmark', name: 'The Frozen Spring', desc: 'Water that flows upward. Ice that doesn\'t melt. Drink at your own risk.', color: '#80c0ff' },
    { x: 2, y: 1, type: 'landmark', name: 'Sampo Altar', desc: 'Where the Sampo was first shattered. Reality is thin here. Colors are wrong.', color: '#c0a0ff' },
    { x: 6, y: 6, type: 'landmark', name: 'Tapio\'s Grove', desc: 'The oldest trees in Finland. Tapio himself was last seen here. Bark faces watch.', color: '#2a4a2a' },
    { x: 3, y: 7, type: 'landmark', name: 'Moonwell', desc: 'A pool that reflects the moon even at noon. Drinking from it restores the spirit.', color: '#a0b0d0' },
    { x: 8, y: 5, type: 'landmark', name: 'Aurora Pillar', desc: 'A column of frozen northern light. Impossible. Beautiful. Slightly warm.', color: '#40c080' },
  ],
};

function initMapState() {
  if (!state.mapState) state.mapState = {};
  const region = state.player.currentRegion;
  if (!state.mapState[region]) {
    state.mapState[region] = {
      playerX: TOWN_POS.x,
      playerY: TOWN_POS.y,
      explored: {},  // "x,y" -> true
    };
    // Mark town and adjacent tiles as explored
    markExplored(region, TOWN_POS.x, TOWN_POS.y);
    markExplored(region, TOWN_POS.x - 1, TOWN_POS.y);
    markExplored(region, TOWN_POS.x + 1, TOWN_POS.y);
    markExplored(region, TOWN_POS.x, TOWN_POS.y - 1);
  }
}

function markExplored(region, x, y) {
  if (x < 0 || x >= MAP_SIZE || y < 0 || y >= MAP_SIZE) return;
  if (!state.mapState[region]) return;
  state.mapState[region].explored[`${x},${y}`] = true;
}

function isExplored(region, x, y) {
  return state.mapState[region]?.explored[`${x},${y}`] || false;
}

function getLandmarkAt(region, x, y) {
  const landmarks = LANDMARKS[region] || [];
  return landmarks.find(l => l.x === x && l.y === y);
}

function getPlayerMapPos() {
  const region = state.player.currentRegion;
  const ms = state.mapState[region];
  return ms ? { x: ms.playerX, y: ms.playerY } : { ...TOWN_POS };
}

function isAtTown() {
  const pos = getPlayerMapPos();
  return pos.x === TOWN_POS.x && pos.y === TOWN_POS.y;
}

function distanceFromTown() {
  const pos = getPlayerMapPos();
  return Math.abs(pos.x - TOWN_POS.x) + Math.abs(pos.y - TOWN_POS.y);
}

function movePlayer(dx, dy) {
  const region = state.player.currentRegion;
  initMapState();
  const ms = state.mapState[region];
  const nx = ms.playerX + dx;
  const ny = ms.playerY + dy;
  if (nx < 0 || nx >= MAP_SIZE || ny < 0 || ny >= MAP_SIZE) return false;
  ms.playerX = nx;
  ms.playerY = ny;
  markExplored(region, nx, ny);
  // Also reveal adjacent tiles
  markExplored(region, nx - 1, ny);
  markExplored(region, nx + 1, ny);
  markExplored(region, nx, ny - 1);
  markExplored(region, nx, ny + 1);
  return true;
}

function drawMapScreen() {
  clear('#08080e');
  const region = state.player.currentRegion;
  initMapState();
  const ms = state.mapState[region];
  const landmarks = LANDMARKS[region] || [];

  const cellSize = 18;
  const offsetX = Math.floor((320 - MAP_SIZE * cellSize) / 2);
  const offsetY = 20;

  // Title
  textCenter('Forest Map', 4, '#a0a0c0', 7);

  // Draw grid
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const px = offsetX + x * cellSize;
      const py = offsetY + y * cellSize;
      const explored = isExplored(region, x, y);

      if (!explored) {
        // Fog of war
        rect(px, py, cellSize - 1, cellSize - 1, '#0e0e14');
      } else {
        // Explored tile
        const landmark = getLandmarkAt(region, x, y);
        if (landmark) {
          rect(px, py, cellSize - 1, cellSize - 1, landmark.color + '40');
          rect(px + 2, py + 2, cellSize - 5, cellSize - 5, landmark.color + '80');
        } else {
          // Normal forest tile
          rect(px, py, cellSize - 1, cellSize - 1, '#1a2a1a');
          // Random tree dots
          if ((x * 7 + y * 13) % 3 === 0) {
            rect(px + 4, py + 3, 3, 3, '#0e1e0e');
            rect(px + 10, py + 8, 3, 3, '#0e1e0e');
          }
        }
      }

      // Player position
      if (x === ms.playerX && y === ms.playerY) {
        rect(px + 5, py + 4, 8, 10, '#e0d0a0');
        circle(px + 9, py + 3, 3, '#e0c090');
      }
    }
  }

  // Legend at bottom
  const ly = offsetY + MAP_SIZE * cellSize + 6;
  rect(10, ly, 6, 6, '#e0d0a0');
  text('You', 20, ly, '#a0a0b0', 6);
  rect(60, ly, 6, 6, '#e0c060');
  text('Town', 70, ly, '#a0a0b0', 6);
  rect(110, ly, 6, 6, '#6a8a6a');
  text('Landmark', 120, ly, '#a0a0b0', 6);
  rect(200, ly, 6, 6, '#0e0e14');
  text('Unknown', 210, ly, '#6a6a7a', 6);

  applyTimeOverlay();
}

function drawBestiaryScreen(monsterId) {
  if (monsterId && MONSTERS[monsterId]) {
    // Detail view — draw the monster
    const m = MONSTERS[monsterId];
    drawMonster(m.art, m.region);
    // Dark overlay for text readability
    rect(0, 130, 320, 70, '#0a0a12d0');
    text(m.name, 8, 134, '#e0d0a0', 7);
    // Stats line
    const weakStr = m.weaknesses.length > 0 ? m.weaknesses.join(', ') : 'none';
    text(`Weak: ${weakStr}`, 8, 148, '#e08080', 5);
    const resStr = m.resistances.length > 0 ? m.resistances.join(', ') : 'none';
    text(`Resist: ${resStr}`, 8, 158, '#8080e0', 5);
    // Stats
    text(`HP:${m.hp} STR:${m.strength} DEF:${m.defense} SPD:${m.speed}`, 8, 168, '#8a8a9a', 5);
    // Region and time
    const timeLabel = m.timeOfDay ? (m.timeOfDay === 'night' ? 'Night' : 'Day') : 'Any time';
    text(`${m.region} / ${timeLabel}`, 8, 178, '#6a8a6a', 5);
    // Kill count
    const entry = state.bestiary[monsterId];
    if (entry) {
      text(`Encountered: ${entry.seen}  Slain: ${entry.killed}`, 8, 188, '#a0a0b0', 5);
    }
  } else {
    // List view
    clear('#0a0a14');
    rect(5, 5, 310, 190, '#12121e');
    textCenter('Monster Bestiary', 10, '#e0d0a0', 8);
    rect(40, 22, 240, 1, '#3a3a4a');
    const entries = getBestiaryEntries();
    if (entries.length === 0) {
      textCenter('No monsters encountered yet.', 50, '#6a6a7a', 6);
    } else {
      textCenter(`${entries.length} species discovered`, 28, '#6a6a7a', 6);
    }
  }
}

const state = {
  screen: 'title',
  player: null,
  aiPlayers: [],
  newsBoard: [],
  dayCount: 0,
  timeTick: 4,
  combatState: null,
  eventState: null,
  shopState: null,
  questBoard: [],
  flags: {},
  bestiary: {},
  mapState: {},
  bestiaryViewId: null,
};

function createPlayer(name, playerClass) {
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

function getAvailableSpells() {
  if (!state.player) return [];
  const spells = CLASS_SPELLS[state.player.class] || [];
  return spells.filter(s => state.player.level >= s.level);
}

function checkLevelUp() {
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

function advanceDay() {
  state.dayCount++;
  state.timeTick = 4; // Reset to morning
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

function addInventoryItem(itemId, quantity = 1) {
  const existing = state.player.inventory.find(i => i.id === itemId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    state.player.inventory.push({ id: itemId, quantity });
  }
}

function removeInventoryItem(itemId, quantity = 1) {
  const existing = state.player.inventory.find(i => i.id === itemId);
  if (!existing) return false;
  existing.quantity -= quantity;
  if (existing.quantity <= 0) {
    state.player.inventory = state.player.inventory.filter(i => i.id !== itemId);
  }
  return true;
}

function hasItem(itemId) {
  const item = state.player.inventory.find(i => i.id === itemId);
  return item ? item.quantity : 0;
}

function saveGame() {
  const data = {
    player: state.player,
    aiPlayers: state.aiPlayers,
    newsBoard: state.newsBoard,
    dayCount: state.dayCount,
    timeTick: state.timeTick,
    questBoard: state.questBoard,
    flags: state.flags,
    bestiary: state.bestiary,
    mapState: state.mapState,
    ngPlusCount: state.ngPlusCount || 0,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    state.player = data.player;
    state.aiPlayers = data.aiPlayers;
    state.newsBoard = data.newsBoard;
    state.dayCount = data.dayCount;
    state.timeTick = data.timeTick || 4;
    state.questBoard = data.questBoard || [];
    state.flags = data.flags || {};
    state.bestiary = data.bestiary || {};
    state.mapState = data.mapState || {};
    state.ngPlusCount = data.ngPlusCount || 0;
    return true;
  } catch {
    return false;
  }
}

function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}
/* ============================================================
   combat.js — Turn-based combat system with stances
   ============================================================ */


function startCombat(monsterTemplate) {
  const monster = monsterTemplate
    ? createMonsterInstance(monsterTemplate, state.player.level)
    : createMonsterInstance(getRandomMonster(state.player.currentRegion, state.player.level), state.player.level);

  state.combatState = {
    monster,
    turn: 'player',
    log: [],
    phase: 'action',     // action, spell_select, item_select, result
    result: null,         // 'victory', 'defeat', 'fled'
    poisonDamageThisTurn: 0,
  };

  state.combatState.log.push({ text: monster.desc, color: 'narrator' });
  state.combatState.log.push({ text: `A ${monster.name} appears!`, color: 'combat' });

  recordBestiaryEntry(monster.id);
  return state.combatState;
}

function startBossCombat(bossId) {
  const template = getBoss(bossId);
  if (!template) return null;
  const monster = { ...template, maxHp: template.hp };
  state.combatState = {
    monster,
    turn: 'player',
    log: [],
    phase: 'action',
    result: null,
    poisonDamageThisTurn: 0,
    isBoss: true,
  };
  state.combatState.log.push({ text: monster.desc, color: 'narrator' });
  state.combatState.log.push({ text: `${monster.name} attacks!`, color: 'combat' });
  return state.combatState;
}

function playerAttack(stance) {
  const cs = state.combatState;
  if (!cs || cs.result) return;

  const p = state.player;
  const m = cs.monster;
  const log = cs.log;

  // Determine turn order by speed
  const playerFirst = p.speed + (p.accessory?.effect === 'speedBonus' ? p.accessory.value : 0)
    >= m.speed;

  if (playerFirst) {
    doPlayerAttack(stance);
    if (m.hp > 0) doMonsterAttack(stance);
  } else {
    doMonsterAttack(stance);
    if (p.hp > 0) doPlayerAttack(stance);
  }

  // Check poison on player
  if (p.poisoned && p.hp > 0) {
    const poisonDmg = Math.max(1, Math.floor(p.maxHp * 0.05));
    p.hp -= poisonDmg;
    p.poisonTurns--;
    log.push({ text: `Poison deals ${poisonDmg} damage!`, color: 'damage' });
    if (p.poisonTurns <= 0) {
      p.poisoned = false;
      log.push({ text: 'The poison wears off.', color: 'system' });
    }
  }

  // Accessory regen
  if (p.accessory?.effect === 'hpRegen' && p.hp > 0) {
    const regen = Math.min(p.accessory.value, p.maxHp - p.hp);
    if (regen > 0) {
      p.hp += regen;
      log.push({ text: `Regenerated ${regen} HP.`, color: 'heal' });
    }
  }
  if (p.accessory?.effect === 'mpRegen' && p.hp > 0) {
    const regen = Math.min(p.accessory.value, p.maxMp - p.mp);
    if (regen > 0) {
      p.mp += regen;
    }
  }

  // Check outcomes
  if (m.hp <= 0) {
    handleVictory();
  } else if (p.hp <= 0) {
    handleDefeat();
  }
}

function doPlayerAttack(stance) {
  const cs = state.combatState;
  const p = state.player;
  const m = cs.monster;
  const log = cs.log;

  let baseDamage = p.strength + (p.weapon?.attackBonus || 0);
  let damageMultiplier = 1.0;
  let hitMessage = '';

  switch (stance) {
    case 'aggressive':
      damageMultiplier = 1.4;
      hitMessage = pick(AGGRESSIVE_TEXTS);
      // Crit chance
      const critChance = 0.15 + (p.accessory?.effect === 'critBonus' ? p.accessory.value : 0);
      if (Math.random() < critChance) {
        damageMultiplier *= 2;
        hitMessage = pick(CRIT_TEXTS);
        log.push({ text: hitMessage, color: 'crit' });
      } else {
        log.push({ text: hitMessage, color: 'narrator' });
      }
      break;
    case 'defensive':
      damageMultiplier = 0.8;
      log.push({ text: pick(DEFENSIVE_TEXTS), color: 'narrator' });
      break;
  }

  // Check magic-only enemies
  if (m.magicOnly) {
    log.push({ text: 'Physical attacks pass through the spirit!', color: 'system' });
    log.push({ text: 'Only magic can harm this foe!', color: 'magic' });
    return;
  }

  let damage = Math.round(baseDamage * damageMultiplier * (0.8 + Math.random() * 0.4));
  damage = Math.max(1, damage - m.defense);

  m.hp -= damage;
  log.push({ text: `You deal ${damage} damage to ${m.name}!`, color: 'combat' });
}

function playerCastSpell(spell) {
  const cs = state.combatState;
  if (!cs || cs.result) return;

  const p = state.player;
  const m = cs.monster;
  const log = cs.log;

  if (p.mp < spell.mpCost) {
    log.push({ text: 'Not enough MP!', color: 'system' });
    return false;
  }

  p.mp -= spell.mpCost;
  log.push({ text: `You cast ${spell.name}!`, color: 'magic' });

  // Calculate magic damage
  let baseDamage = p.magic + (p.accessory?.effect === 'magicBonus' ? p.accessory.value : 0);
  let damage = Math.round(baseDamage * spell.power * (0.85 + Math.random() * 0.3));

  // Weakness/resistance check
  if (m.weaknesses.includes(spell.type)) {
    damage = Math.round(damage * 1.5);
    log.push({ text: "It's super effective!", color: 'crit' });
  } else if (m.resistances.includes(spell.type)) {
    damage = Math.round(damage * 0.5);
    log.push({ text: 'It resists this type of magic...', color: 'system' });
  }

  damage = Math.max(1, damage - Math.floor(m.defense * 0.3));

  // Poison DOT
  if (spell.dot) {
    log.push({ text: `${m.name} is poisoned!`, color: 'event' });
    // Apply poison as immediate extra damage over next turns via flag
  }

  m.hp -= damage;
  log.push({ text: `${spell.name} deals ${damage} magic damage!`, color: 'magic' });

  // Monster retaliates
  if (m.hp > 0) {
    doMonsterAttack('defensive'); // spellcasting is somewhat defensive
  }

  // Regen
  if (p.accessory?.effect === 'hpRegen' && p.hp > 0) {
    const regen = Math.min(p.accessory.value, p.maxHp - p.hp);
    if (regen > 0) p.hp += regen;
  }
  if (p.accessory?.effect === 'mpRegen' && p.hp > 0) {
    const regen = Math.min(p.accessory.value, p.maxMp - p.mp);
    if (regen > 0) p.mp += regen;
  }

  // Check outcomes
  if (m.hp <= 0) {
    handleVictory();
  } else if (p.hp <= 0) {
    handleDefeat();
  }

  return true;
}

function playerUseItem(itemId) {
  const cs = state.combatState;
  if (!cs || cs.result) return false;

  const p = state.player;
  const log = cs.log;

  if (!hasItem(itemId)) {
    log.push({ text: "You don't have that item!", color: 'system' });
    return false;
  }

  const result = useConsumable(p, itemId);
  if (!result) return false;

  removeInventoryItem(itemId);

  if (result === 'ESCAPE') {
    cs.result = 'fled';
    log.push({ text: 'You use an Escape Scroll and vanish!', color: 'event' });
    return true;
  }

  log.push({ text: result, color: 'heal' });

  // Monster still attacks
  if (cs.monster.hp > 0) {
    doMonsterAttack('defensive');
  }

  if (p.hp <= 0) {
    handleDefeat();
  }

  return true;
}

function playerRun() {
  const cs = state.combatState;
  if (!cs || cs.result) return;

  const p = state.player;
  const m = cs.monster;
  const log = cs.log;

  if (m.isBoss) {
    log.push({ text: 'There is no running from this fight!', color: 'combat' });
    doMonsterAttack('aggressive');
    if (p.hp <= 0) handleDefeat();
    return;
  }

  const runChance = 0.4 + (p.speed - m.speed) * 0.05 +
    (p.accessory?.effect === 'dodgeBonus' ? p.accessory.value : 0);

  if (Math.random() < Math.max(0.1, Math.min(0.9, runChance))) {
    cs.result = 'fled';
    log.push({ text: pick(FLEE_SUCCESS_TEXTS), color: 'narrator' });
  } else {
    log.push({ text: pick(FLEE_FAIL_TEXTS), color: 'combat' });
    doMonsterAttack('aggressive');
    if (p.hp <= 0) handleDefeat();
  }
}

function doMonsterAttack(playerStance) {
  const cs = state.combatState;
  const p = state.player;
  const m = cs.monster;
  const log = cs.log;

  // Pick random attack
  const attackKey = m.attacks[Math.floor(Math.random() * m.attacks.length)];
  const attackMsg = m.attackMessages[attackKey] || `${m.name} attacks!`;

  // Self-repair special (Teräsvartija)
  if (attackKey === 'self_repair') {
    const healAmt = Math.floor(m.maxHp * 0.15);
    m.hp = Math.min(m.maxHp, m.hp + healAmt);
    log.push({ text: attackMsg, color: 'combat' });
    log.push({ text: `${m.name} repairs ${healAmt} HP!`, color: 'heal' });
    return;
  }

  // Dark barrier (Tuonenvartija) — reduces next damage taken
  if (attackKey === 'dark_barrier') {
    log.push({ text: attackMsg, color: 'combat' });
    m.defense += 5;
    log.push({ text: `${m.name}'s defense increased!`, color: 'system' });
    return;
  }

  log.push({ text: attackMsg, color: 'combat' });

  // Calculate damage
  let baseDamage = m.strength;
  // Magic attacks use magic stat
  const magicAttacks = ['dark_magic', 'siren_song', 'whirlpool', 'buffer_overflow', 'null_pointer',
    'stack_trace', 'bureaucratic_curse', 'lightning_bolt', 'phantom_chill', 'ghostly_wail',
    'ancient_curse', 'death_touch', 'soul_drain', 'reality_warp', 'shadow_bolt', 'entropy',
    'blizzard', 'ice_prison', 'frost_lance', 'absolute_zero', 'spirit_flame', 'void_breath', 'soul_rend',
    'trickery', 'hack'];
  if (magicAttacks.includes(attackKey)) {
    baseDamage = m.magic;
  }

  let damageReduction = p.defense + (p.armor?.defenseBonus || 0);

  // Stance modifiers for player taking damage
  if (playerStance === 'aggressive') {
    damageReduction = Math.floor(damageReduction * 0.8);
  } else if (playerStance === 'defensive') {
    damageReduction = Math.floor(damageReduction * 1.4);
    // Block chance
    if (Math.random() < 0.2) {
      log.push({ text: 'You block the attack completely!', color: 'block' });
      return;
    }
  }

  // Fire resistance
  const fireAttacks = ['flame_breath', 'fire_storm', 'inferno', 'spirit_flame'];
  if (fireAttacks.includes(attackKey) && p.accessory?.effect === 'fireResist') {
    baseDamage = Math.floor(baseDamage * (1 - p.accessory.value));
  }

  // Dodge chance
  if (p.accessory?.effect === 'dodgeBonus' && Math.random() < p.accessory.value) {
    log.push({ text: 'You dodge the attack!', color: 'block' });
    return;
  }

  let damage = Math.round(baseDamage * (0.8 + Math.random() * 0.4));
  damage = Math.max(1, damage - damageReduction);

  p.hp -= damage;
  log.push({ text: `You take ${damage} damage!`, color: 'player-damage' });

  // Some attacks inflict poison
  const poisonAttacks = ['belch', 'ink_cloud'];
  if (poisonAttacks.includes(attackKey) && !p.poisoned && Math.random() < 0.3) {
    p.poisoned = true;
    p.poisonTurns = 3;
    log.push({ text: 'You are poisoned!', color: 'damage' });
  }
}

function handleVictory() {
  const cs = state.combatState;
  const p = state.player;
  const m = cs.monster;
  const log = cs.log;

  cs.result = 'victory';
  log.push({ text: `${pick(VICTORY_TEXTS)} ${m.name}!`, color: 'narrator' });
  recordBestiaryKill(m.id);

  // XP
  let xpGain = m.xpReward;
  if (p.accessory?.effect === 'xpBonus') {
    xpGain = Math.round(xpGain * (1 + p.accessory.value));
  }
  p.xp += xpGain;
  log.push({ text: `+${xpGain} XP`, color: 'xp' });

  // Gold
  let goldGain = m.goldReward;
  if (p.accessory?.effect === 'goldBonus') {
    goldGain = Math.round(goldGain * (1 + p.accessory.value));
  }
  p.gold += goldGain;
  log.push({ text: `+${goldGain} Gold`, color: 'gold' });

  p.kills++;

  // Item drops
  for (const drop of m.drops) {
    if (Math.random() < drop.chance) {
      addInventoryItem(drop.itemId);
      const item = getItemById(drop.itemId);
      const name = item ? item.name : drop.itemId;
      log.push({ text: `Found: ${name}!`, color: 'event' });
    }
  }

  // Level up check
  if (checkLevelUp()) {
    log.push({ text: `*** LEVEL UP! You are now level ${p.level}! ***`, color: 'levelup' });
    log.push({ text: 'All stats increased! HP and MP fully restored!', color: 'levelup' });
    sfxLevelUp();

    // Check for new spells
    const spells = getAvailableSpells();
    const newSpell = spells.find(s => s.level === p.level);
    if (newSpell) {
      log.push({ text: `New spell learned: ${newSpell.name}!`, color: 'magic' });
    }
  }
}

function handleDefeat() {
  const cs = state.combatState;
  const p = state.player;
  const log = cs.log;

  cs.result = 'defeat';
  p.hp = 0;
  p.deaths++;

  // Lose 10% gold and 5% XP
  const goldLoss = Math.floor(p.gold * 0.1);
  const xpLoss = Math.floor(p.xp * 0.05);
  p.gold -= goldLoss;
  p.xp = Math.max(0, p.xp - xpLoss);

  log.push({ text: pick(DEFEAT_TEXTS), color: 'damage' });
  if (goldLoss > 0) log.push({ text: `Lost ${goldLoss} gold...`, color: 'gold' });
  if (xpLoss > 0) log.push({ text: `Lost ${xpLoss} XP...`, color: 'xp' });
  log.push({ text: 'You wake up at the inn...', color: 'narrator' });
}

function getCombatMenuItems() {
  const cs = state.combatState;
  if (!cs || cs.result) return [];

  if (cs.phase === 'spell_select') {
    const spells = getAvailableSpells();
    const items = spells.map((s, i) => ({
      key: String(i + 1),
      label: `${s.name} (${s.mpCost} MP)`,
      action: 'cast_spell',
      data: s,
      disabled: state.player.mp < s.mpCost,
    }));
    items.push({ key: String(items.length + 1), label: 'Back', action: 'back' });
    return items;
  }

  if (cs.phase === 'item_select') {
    const usable = state.player.inventory
      .filter(inv => {
        const c = CONSUMABLES[inv.id];
        return c && c.type !== 'quest';
      })
      .map((inv, i) => {
        const c = CONSUMABLES[inv.id];
        return {
          key: String(i + 1),
          label: `${c.name} x${inv.quantity}`,
          action: 'use_item',
          data: inv.id,
        };
      });
    usable.push({ key: String(usable.length + 1), label: 'Back', action: 'back' });
    return usable;
  }

  return [
    { key: '1', label: 'Attack (Aggressive)', action: 'aggressive' },
    { key: '2', label: 'Attack (Defensive)', action: 'defensive' },
    { key: '3', label: 'Cast Spell', action: 'spell_menu' },
    { key: '4', label: 'Use Item', action: 'item_menu' },
    { key: '5', label: 'Run', action: 'run' },
  ];
}
/* ============================================================
   npcs.js — NPC definitions, dialogue, and tavern charm
   ============================================================ */


// Town NPCs (shopkeeper, innkeeper, healer) are handled inline in locations.js
// This file handles tavern charm NPCs and AI adventurer interactions

const TAVERN_NPCS = {
  helsinki: {
    id: 'saara', name: 'Saara', title: 'Journalist',
    region: 'helsinki',
    rewardItem: 'press_badge',
    charmThresholds: [3, 6, 10],
    greeting: "A sharp-eyed woman sits at the bar, scribbling notes. She looks up with a knowing smile.",
    dialogueOptions: [
      {
        text: '"Any interesting stories lately?"',
        responses: [
          "She leans in. 'There are whispers of something stirring in the metro tunnels. Something with teeth.'",
          "'The fish market vendors have been finding strange things in their nets. Things with too many eyes.'",
          "'I heard Louhi was seen near the old fortress. That one gives me chills.'",
        ],
        charm: 1,
      },
      {
        text: '"You have beautiful handwriting."',
        responses: [
          "She raises an eyebrow. 'Flattery will get you... well, maybe somewhere.'",
          "She laughs. 'You should see my shorthand. It's even prettier.'",
          "'That is the most journalist-specific compliment I have ever received. I respect that.'",
        ],
        charm: 2,
      },
      {
        text: '"Can I buy you a drink?"',
        responses: [
          "'Only if you have a good story to go with it.' She makes room on the bench.",
          "'I accept. But I warn you, I drink like a Kallio local.'",
          "She accepts with a warm smile. 'You know, you're more interesting than most adventurers.'",
        ],
        charm: 2,
      },
    ],
    charmMessages: [
      "Saara slips you a note: 'There's a hidden cache in the east forest. Don't tell anyone I told you.' (+50 gold)",
      "Saara seems genuinely happy to see you. 'Here, I found this while investigating a story.' She hands you a potion.",
      "Saara gives you her press badge. 'For luck. And for the story you're writing with your life.'",
    ],
  },
  espoo: {
    id: 'juhani', name: 'Juhani', title: 'Programmer',
    region: 'espoo',
    rewardItem: 'debug_ring',
    charmThresholds: [3, 6, 10],
    greeting: "A lanky man with tired eyes sits surrounded by empty coffee cups, muttering about recursive functions.",
    dialogueOptions: [
      {
        text: '"What are you working on?"',
        responses: [
          "'Trying to debug reality. There is a null pointer exception somewhere in the fabric of space-time.'",
          "'An algorithm to predict monster spawns. So far it just predicts coffee breaks.'",
          "'A recursive spell that calls itself. The stack overflow is... literal.'",
        ],
        charm: 1,
      },
      {
        text: '"Is that O(n) or O(my god)?"',
        responses: [
          "He snorts coffee through his nose. 'Finally, someone who speaks my language!'",
          "'O(n log n) at best. O(help me) at worst.' He grins despite himself.",
          "He stares at you with newfound respect. 'That was terrible. I love it.'",
        ],
        charm: 2,
      },
      {
        text: '"You look like you could use some sleep."',
        responses: [
          "'Sleep is just the body\'s garbage collector. I prefer to manage memory manually.'",
          "'I will sleep when the code compiles. So... never, probably.'",
          "He yawns. 'Actually, that might be the best idea I've heard all decade.'",
        ],
        charm: 2,
      },
    ],
    charmMessages: [
      "Juhani shares a debug tip: 'Try hitting the Koodihirviö with physical attacks. They crash faster.' (+30 XP)",
      "Juhani hands you a glowing gadget. 'Prototype. Don't ask what it does.' (Medium Mana Potion)",
      "Juhani solemnly presents his Debug Ring. 'May your bugs be shallow and your stack traces be readable.'",
    ],
  },
  vantaa: {
    id: 'katariina', name: 'Katariina', title: 'Traveler',
    region: 'vantaa',
    rewardItem: 'travel_charm',
    charmThresholds: [3, 6, 10],
    greeting: "A mysterious woman sits in the corner, her cloak shimmering with an otherworldly iridescence.",
    dialogueOptions: [
      {
        text: '"Where have you traveled from?"',
        responses: [
          "'From a place where the northern lights touch the ground. It is very cold there, but the silence is beautiful.'",
          "'Somewhere east of reality and west of dreams. The layover was terrible.'",
          "'I have been everywhere, and nowhere is quite like here. Helsinki has... gravity.'",
        ],
        charm: 1,
      },
      {
        text: '"That cloak is remarkable."',
        responses: [
          "'It was a gift from a grateful spirit. Or a cursed spirit. I forget which.'",
          "She pulls it tighter. 'It remembers every place I have been. Sometimes it shows them to me.'",
          "'Would you like to touch it?' The fabric feels like liquid starlight.",
        ],
        charm: 2,
      },
      {
        text: '"I feel like we have met before."',
        responses: [
          "'Perhaps in another timeline. There are so many, you know.'",
          "She smiles enigmatically. 'All travelers meet eventually. The roads are fewer than you think.'",
          "'We have. You just don't remember yet.' Her eyes hold ancient depths.",
        ],
        charm: 2,
      },
    ],
    charmMessages: [
      "Katariina whispers a shortcut. 'Through the cargo terminal, third door. Avoid the Tullidemoni.' (+60 gold)",
      "Katariina gives you a strange vial. 'From a place that doesn't exist yet.' (Large Potion)",
      "Katariina removes her charm necklace. 'You will need this more than I. The roads ahead are dark.'",
    ],
  },
  kauniainen: {
    id: 'tapio', name: 'Tapio', title: 'Forest Spirit',
    region: 'kauniainen',
    rewardItem: 'forest_heart',
    charmThresholds: [3, 6, 10],
    greeting: "An old man with bark-like skin and moss in his beard sits perfectly still. His eyes are the green of deep forest.",
    dialogueOptions: [
      {
        text: '"Are you truly Tapio, lord of the forest?"',
        responses: [
          "'Lord is a human word. I am the forest. The forest is me. We do not need titles.'",
          "'I have been called many things. Tapio is the name your kind remembers. It will do.'",
          "He chuckles, a sound like wind through leaves. 'Would you believe me if I said yes?'",
        ],
        charm: 1,
      },
      {
        text: '"The forest seems healthier since I started clearing the monsters."',
        responses: [
          "'The trees notice. They speak of you.' He seems pleased.",
          "'Balance returns slowly. But it returns. You have my thanks, small one.'",
          "'The hiisi were not always twisted. Something corrupted them. Perhaps you will discover what.'",
        ],
        charm: 2,
      },
      {
        text: '"Tell me about the dragon."',
        responses: [
          "His eyes darken. 'It sleeps beneath the oldest hill. Its dreams poison the land.'",
          "'Lohikaarme is older than me. It was here before the first tree grew. It will take great courage.'",
          "'You will need the four fragments of the Sampo. Without them, the dragon cannot be truly slain.'",
        ],
        charm: 2,
      },
    ],
    charmMessages: [
      "Tapio touches the ground and a sapling grows, bearing a golden fruit. 'Eat. Be strong.' (Full Heal)",
      "Tapio whispers to the trees. 'They will watch over you in the forest.' (Reduced random encounters for a while)",
      "Tapio places his hand on your chest. You feel warmth spread through you. 'Carry the forest's heart.'",
    ],
  },
};

function getTavernNpc(region) {
  return TAVERN_NPCS[region] || null;
}

function getCharmLevel(npcId) {
  return state.player.charm[npcId] || 0;
}

function addCharm(npcId, amount) {
  if (!state.player.charm[npcId]) state.player.charm[npcId] = 0;
  state.player.charm[npcId] += amount;
  return state.player.charm[npcId];
}

function checkCharmReward(npcId) {
  const npc = Object.values(TAVERN_NPCS).find(n => n.id === npcId);
  if (!npc) return null;

  const charm = getCharmLevel(npcId);
  const rewards = [];

  for (let i = 0; i < npc.charmThresholds.length; i++) {
    const threshold = npc.charmThresholds[i];
    const rewardKey = `charm_reward_${npcId}_${i}`;

    if (charm >= threshold && !state.flags[rewardKey]) {
      state.flags[rewardKey] = true;

      // Apply reward based on tier
      if (i === 0) {
        // Gold or minor bonus
        state.player.gold += 50;
        rewards.push({ message: npc.charmMessages[0], type: 'gold' });
      } else if (i === 1) {
        // Item reward
        addInventoryItem('potion_medium');
        rewards.push({ message: npc.charmMessages[1], type: 'item' });
      } else if (i === 2) {
        // Unique accessory
        rewards.push({ message: npc.charmMessages[2], type: 'accessory', itemId: npc.rewardItem });
      }
    }
  }

  return rewards.length > 0 ? rewards : null;
}

// AI adventurer dialogue when encountered in tavern
function getAiTavernDialogue(aiPlayer) {
  const lines = {
    brave: [
      `"I slew three monsters before breakfast! ${aiPlayer.level > 5 ? 'Espoo is getting interesting.' : 'Helsinki never sleeps.'}"`,
      '"Come, share a drink! Let me tell you about my latest battle!"',
      '"I heard the dragon stirs in its sleep. We must be ready!"',
    ],
    wise: [
      '"The runes speak of an ancient power awakening. Be cautious, friend."',
      `"I have been studying the ${aiPlayer.region === 'helsinki' ? 'harbor spirits' : 'local creatures'}. Fascinating, if deadly."`,
      '"Knowledge is the greatest weapon. Though a good staff helps too."',
    ],
    crafty: [
      '"I forged a new blade today. Want to see? ...Want to buy it?"',
      '"The metal in these regions has unique properties. Perfect for enchanting."',
      '"If you bring me rare materials, I can craft something special for you."',
    ],
    rival: [
      `"Still alive? How quaint. I am already level ${aiPlayer.level}."`,
      '"Do not get in my way. The dragon is mine to slay."',
      '"You should turn back while you still can."',
    ],
    tragic: [
      '"..." (Kullervo stares into his drink.)',
      '"Everything I touch turns to ash. Perhaps that is my fate."',
      '"Do you ever wonder if the monsters are the heroes of their own story?"',
    ],
    guardian: [
      '"The forest whispers your name. It watches over those who protect it."',
      '"Take care in the deep woods. Not all that shimmers is friendly."',
      '"I left something for you beneath the oldest oak. A gift from the forest."',
    ],
  };

  const pool = lines[aiPlayer.personality] || lines.brave;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getAiPlayersInRegion(region) {
  return state.aiPlayers.filter(ai => ai.region === region && ai.alive);
}
/* ============================================================
   events.js — Random forest events with choices and consequences
   ============================================================ */


const EVENTS = [
  // ===== HELSINKI EVENTS =====
  {
    id: 'mushroom_circle',
    regions: ['helsinki', 'espoo'],
    minLevel: 1,
    art: 'drawEventMushroom',
    text: 'You stumble upon a circle of glowing red mushrooms. The air inside the ring shimmers with an otherworldly light.',
    choices: [
      {
        text: 'Step into the circle',
        outcomes: [
          { weight: 0.6, text: 'Magical energy surges through you! Your mind expands.', effect: { mp: 10 } },
          { weight: 0.4, text: 'The mushrooms release spores! You feel dizzy and weakened.', effect: { hp: -15, flag: 'mushroom_curse' } },
        ]
      },
      {
        text: 'Pick a mushroom carefully',
        outcomes: [
          { weight: 0.7, text: 'The mushroom dissolves into a healing essence in your hands.', effect: { item: 'potion_small' } },
          { weight: 0.3, text: 'The mushroom crumbles to dust. Nothing happens.', effect: {} },
        ]
      },
      {
        text: 'Walk away',
        outcomes: [
          { weight: 1.0, text: 'You leave the fairy ring undisturbed. Sometimes wisdom is restraint.', effect: {} },
        ]
      }
    ]
  },
  {
    id: 'old_well',
    regions: ['helsinki'],
    minLevel: 1,
    art: 'drawEventWell',
    text: 'An ancient stone well stands in a clearing. From its depths, you hear faint singing — beautiful and sad.',
    choices: [
      {
        text: 'Toss a coin into the well',
        outcomes: [
          { weight: 0.5, text: 'The singing grows joyful! A soft light rises from the well, and you feel blessed.', effect: { gold: -5, hp: 999, mp: 999 } },
          { weight: 0.3, text: 'The coin clinks far below. Nothing happens. Five gold, gone.', effect: { gold: -5 } },
          { weight: 0.2, text: 'A ghostly hand reaches up and places a gem in your palm!', effect: { gold: 50 } },
        ]
      },
      {
        text: 'Listen to the singing',
        outcomes: [
          { weight: 0.6, text: 'The melody tells of ancient Helsinki, before the stones. You feel wiser.', effect: { xp: 20 } },
          { weight: 0.4, text: 'The song is hypnotic. You lose track of time. When you wake, the sun has moved.', effect: {} },
        ]
      },
      {
        text: 'Ignore the well',
        outcomes: [
          { weight: 1.0, text: 'You walk past. The singing fades behind you.', effect: {} },
        ]
      }
    ]
  },
  {
    id: 'wounded_creature',
    regions: ['helsinki', 'espoo', 'vantaa'],
    minLevel: 1,
    art: 'drawEventGeneric',
    text: 'A small hiisi lies wounded by the path, whimpering. It clutches a broken twig like a weapon. It does not seem aggressive.',
    choices: [
      {
        text: 'Help the creature',
        outcomes: [
          { weight: 0.8, text: 'You bandage its wounds. It looks at you with ancient eyes and nods. Something has changed in the forest.', effect: { flag: 'helped_hiisi', xp: 15 } },
          { weight: 0.2, text: 'You bandage its wounds. It bites you and runs away. Typical.', effect: { hp: -5 } },
        ]
      },
      {
        text: 'Attack the weakened hiisi',
        outcomes: [
          { weight: 1.0, text: 'You strike down the helpless creature. It dies with a sound like breaking branches. You find a few coins.', effect: { gold: 10, flag: 'killed_hiisi' } },
        ]
      },
      {
        text: 'Walk past',
        outcomes: [
          { weight: 1.0, text: 'You leave the hiisi to its fate. The forest watches silently.', effect: {} },
        ]
      }
    ]
  },
  {
    id: 'mysterious_sauna',
    regions: ['helsinki', 'espoo', 'vantaa', 'kauniainen'],
    minLevel: 2,
    art: 'drawEventSauna',
    text: 'Steam rises from a small wooden sauna that you are certain was not here before. The door is ajar, warmth spilling out.',
    choices: [
      {
        text: 'Enter the sauna',
        outcomes: [
          { weight: 0.7, text: 'The heat seeps into your bones. All your aches and pains melt away. You feel completely restored.', effect: { hp: 999, mp: 999, advanceDay: true } },
          { weight: 0.3, text: 'You relax deeply. When you emerge, the world seems slightly... different. Time has passed.', effect: { hp: 999, mp: 999, advanceDay: true, xp: 10 } },
        ]
      },
      {
        text: 'Peek inside cautiously',
        outcomes: [
          { weight: 0.6, text: 'You see only steam and warm wooden benches. Nothing suspicious. It smells of birch.', effect: {} },
          { weight: 0.4, text: 'You glimpse a shadowy figure in the steam. You quickly close the door.', effect: {} },
        ]
      },
      {
        text: "Leave it alone — too suspicious",
        outcomes: [
          { weight: 1.0, text: 'You walk away. The sauna fades into mist behind you, as if it never existed.', effect: {} },
        ]
      }
    ]
  },
  {
    id: 'crossroads_stranger',
    regions: ['helsinki', 'espoo', 'vantaa', 'kauniainen'],
    minLevel: 3,
    art: 'drawEventCrossroads',
    text: 'At a crossroads stands a tall figure in a dark cloak. "I have something you need," it says. "But everything has a price."',
    choices: [
      {
        text: '"What do you offer?"',
        outcomes: [
          { weight: 0.5, text: '"Knowledge." The stranger whispers a secret. You feel power flow through you.', effect: { xp: 40, gold: -30 } },
          { weight: 0.3, text: '"Strength." The stranger touches your shoulder. Your muscles surge with power.', effect: { tempStr: 3, gold: -50 } },
          { weight: 0.2, text: '"A warning: do not trust the shadows. They have their own agenda." The stranger vanishes.', effect: { flag: 'shadow_warning' } },
        ]
      },
      {
        text: '"I need nothing from strangers."',
        outcomes: [
          { weight: 0.7, text: 'The stranger laughs. "Pride. How refreshing." They dissolve into smoke.', effect: {} },
          { weight: 0.3, text: '"Very well. But remember — I offered." The stranger leaves behind a small potion.', effect: { item: 'potion_small' } },
        ]
      },
      {
        text: 'Attack the stranger',
        outcomes: [
          { weight: 0.6, text: 'Your blade passes through smoke. The stranger was never really there.', effect: {} },
          { weight: 0.4, text: 'The stranger catches your blade with two fingers. "Rude." A shockwave throws you back.', effect: { hp: -20 } },
        ]
      }
    ]
  },
  // ===== SPECIAL EVENTS =====
  {
    id: 'tram_tracks',
    regions: ['helsinki'],
    minLevel: 2,
    condition: () => !state.flags.found_tram_tracks,
    art: 'drawEventGeneric',
    text: 'You notice old tram tracks disappearing into a dark tunnel beneath the city. Fresh scratch marks line the entrance.',
    choices: [
      {
        text: 'Investigate the tunnel',
        outcomes: [
          { weight: 1.0, text: 'The tunnel reeks of rat. Deep claw marks cover the walls. Tram 3 was last seen heading this way...', effect: { flag: 'found_tram_tracks', xp: 15 } },
        ]
      },
      {
        text: 'Mark the location and move on',
        outcomes: [
          { weight: 1.0, text: 'You note the tunnel entrance. Something lives down there.', effect: { flag: 'found_tram_tracks' } },
        ]
      }
    ]
  },
  {
    id: 'mielikki_encounter',
    regions: ['helsinki', 'espoo', 'vantaa', 'kauniainen'],
    minLevel: 1,
    condition: () => Math.random() < 0.3,
    art: 'drawEventGeneric',
    text: 'A woman with bark-like skin and eyes of deep green steps from behind a tree. "The forest sent me," she says.',
    choices: [
      {
        text: '"What does the forest want?"',
        outcomes: [
          { weight: 0.5, text: '"To help those who help it." She hands you herbs and vanishes among the trees.', effect: { item: 'potion_medium', flag: 'met_mielikki' } },
          { weight: 0.5, text: '"To warn you. Something dark is growing stronger." Her eyes are full of concern.', effect: { xp: 20, flag: 'met_mielikki' } },
        ]
      },
      {
        text: '"Thank you, Mielikki."',
        outcomes: [
          { weight: 1.0, text: 'She smiles warmly. "You know my name. The forest remembers its friends." She presses a gift into your hands.', effect: { item: 'potion_medium', flag: 'met_mielikki' } },
        ]
      }
    ]
  },
  {
    id: 'golden_fish',
    regions: ['espoo', 'vantaa'],
    minLevel: 4,
    art: 'drawEventGeneric',
    text: 'A golden fish leaps from a stream, hovering in the air before you. It speaks: "Three questions I will answer, or one wish I will grant."',
    choices: [
      {
        text: '"I wish for gold."',
        outcomes: [
          { weight: 0.7, text: 'The fish spits a stream of coins and plops back into the water.', effect: { gold: 100 } },
          { weight: 0.3, text: '"Greedy, but fair." The fish grants a modest sum and disappears.', effect: { gold: 40 } },
        ]
      },
      {
        text: '"I wish for strength."',
        outcomes: [
          { weight: 1.0, text: 'The fish glows brightly. Power courses through your veins.', effect: { xp: 50 } },
        ]
      },
      {
        text: '"I wish for wisdom about the dragon."',
        outcomes: [
          { weight: 1.0, text: '"The dragon fears only the Sampo, forged from four fragments scattered across the land. Seek them." The fish vanishes.', effect: { xp: 30, flag: 'fish_wisdom' } },
        ]
      }
    ]
  },
  {
    id: 'ghost_tram',
    regions: ['helsinki'],
    minLevel: 2,
    art: 'drawEventGeneric',
    text: 'A translucent tram glides silently down tracks that no longer exist. Its windows glow with warm light. The door opens.',
    choices: [
      {
        text: 'Board the ghost tram',
        outcomes: [
          { weight: 0.5, text: 'The tram takes you on a tour of old Helsinki. Ghosts of the past nod at you. You disembark feeling strangely enriched.', effect: { xp: 25, hp: 999 } },
          { weight: 0.5, text: 'The tram drops you off somewhere unexpected. You find a few coins left on a seat.', effect: { gold: 20 } },
        ]
      },
      {
        text: 'Wave it on',
        outcomes: [
          { weight: 1.0, text: 'The ghost tram continues its eternal route, fading into the mist.', effect: {} },
        ]
      }
    ]
  },
  {
    id: 'sampo_fragment_helsinki',
    regions: ['helsinki'],
    minLevel: 3,
    condition: () => !hasItem('sampo_fragment_1') && state.player.level >= 3,
    art: 'drawEventGeneric',
    text: 'Deep in the forest, an ancient stone glows with a faint blue light. Carved runes pulse around a metallic fragment embedded in the rock.',
    choices: [
      {
        text: 'Extract the fragment',
        outcomes: [
          { weight: 1.0, text: 'With great effort, you pry the fragment free. It hums with power — a piece of the mythical Sampo!', effect: { item: 'sampo_fragment_1', xp: 50, flag: 'sampo_1_found' } },
        ]
      },
      {
        text: 'Study the runes first',
        outcomes: [
          { weight: 1.0, text: 'The runes speak of an artifact of infinite power, shattered and scattered. You carefully extract the fragment.', effect: { item: 'sampo_fragment_1', xp: 60, flag: 'sampo_1_found' } },
        ]
      }
    ]
  },
  {
    id: 'sampo_fragment_espoo',
    regions: ['espoo'],
    minLevel: 5,
    condition: () => !hasItem('sampo_fragment_2') && state.player.level >= 5,
    art: 'drawEventGeneric',
    text: 'At the bottom of a crystal-clear lake, you see a metallic gleam. The Näkki seems to be guarding it.',
    choices: [
      {
        text: 'Dive for the fragment',
        outcomes: [
          { weight: 0.6, text: 'You plunge in! The cold is shocking but you grab the fragment. A piece of the Sampo!', effect: { item: 'sampo_fragment_2', hp: -20, xp: 60, flag: 'sampo_2_found' } },
          { weight: 0.4, text: 'The lake spirit lets you pass — perhaps it recognizes your worth. You claim the fragment.', effect: { item: 'sampo_fragment_2', xp: 70, flag: 'sampo_2_found' } },
        ]
      },
      {
        text: 'Leave it — too dangerous',
        outcomes: [
          { weight: 1.0, text: 'You decide the risk is too great. The fragment continues to gleam below the surface.', effect: {} },
        ]
      }
    ]
  },
  {
    id: 'sampo_fragment_vantaa',
    regions: ['vantaa'],
    minLevel: 8,
    condition: () => !hasItem('sampo_fragment_3') && state.player.level >= 8,
    art: 'drawEventGeneric',
    text: 'In the ruins of an old cargo hangar, a metallic fragment floats in mid-air, surrounded by a faint distortion in reality.',
    choices: [
      {
        text: 'Reach through the distortion',
        outcomes: [
          { weight: 0.7, text: 'Reality bends around your hand. Pain, then triumph — you hold a Sampo fragment!', effect: { item: 'sampo_fragment_3', hp: -30, xp: 80, flag: 'sampo_3_found' } },
          { weight: 0.3, text: 'The distortion seems to recognize your purpose. The fragment floats gently into your hand.', effect: { item: 'sampo_fragment_3', xp: 90, flag: 'sampo_3_found' } },
        ]
      },
      {
        text: 'Not yet — need to be stronger',
        outcomes: [
          { weight: 1.0, text: 'You back away from the distortion. Wise, perhaps. The fragment will wait.', effect: {} },
        ]
      }
    ]
  },
  {
    id: 'sampo_fragment_kauniainen',
    regions: ['kauniainen'],
    minLevel: 10,
    condition: () => !hasItem('sampo_fragment_4') && state.player.level >= 10,
    art: 'drawEventGeneric',
    text: 'At the foot of the ancient stone arch, the earth cracks open revealing a glowing fragment. Runes flare to life on the arch.',
    choices: [
      {
        text: 'Claim the final fragment',
        outcomes: [
          { weight: 1.0, text: 'Power surges as you lift the final piece. The four fragments of the Sampo are meant to be reunited!', effect: { item: 'sampo_fragment_4', xp: 100, flag: 'sampo_4_found' } },
        ]
      }
    ]
  },
];

// Flavor text when nothing happens in the forest
const FLAVOR_TEXT = {
  helsinki: [
    'The distant hum of a tram echoes through the trees.',
    'Seagulls cry overhead, circling endlessly.',
    'The smell of coffee drifts from somewhere unseen.',
    'You find fresh boot prints on the path. Someone was here recently.',
    'A cold wind blows off the harbor, carrying the scent of salt.',
    'Graffiti on a rock reads: "Louhi was here." Typical.',
    'The trees thin and you catch a glimpse of the cathedral dome.',
    'You hear distant accordion music. It stops abruptly.',
  ],
  espoo: [
    'The forest is dense here. Sunlight barely reaches the ground.',
    'A deer watches you from behind a birch tree, then bolts.',
    'You find an old camping site. The ashes are cold.',
    'The sound of a stream guides you deeper into Nuuksio.',
    'Strange lights flicker between the trees — fireflies or something else?',
    'A sign reads: "Nuuksio National Park — Please do not feed the hiisi."',
    'You stumble over a fiber optic cable running through the moss.',
    'The trees here are impossibly old. Their roots go deep.',
  ],
  vantaa: [
    'A rusted plane propeller lies half-buried in the grass.',
    'The runway stretches into the distance, cracked and overgrown.',
    'You hear a distant rumble — thunder, or something underground.',
    'An old departure board flickers to life: "TUONELA — GATE 13 — BOARDING."',
    'The Keravanjoki river gurgles darkly beside the path.',
    'You find a customs form filled out in a language that hurts to read.',
    'A mechanical hum comes from a collapsed hangar. Something still runs in there.',
    'The air smells of ozone and old jet fuel.',
  ],
  kauniainen: [
    'The trees whisper in a language older than Finnish.',
    'Spirit wisps dance at the edge of your vision.',
    'The ground hums with ancient power beneath your feet.',
    'Runes carved into a stone glow faintly as you pass.',
    'You feel watched by something immense and patient.',
    'The mist parts to reveal a path that closes behind you.',
    'A crow speaks a word you almost understand. Then it flies away.',
    'The air tastes of iron and old magic.',
  ],
};

const FLAVOR_TEXT_NIGHT = {
  helsinki: [
    'The streetlights flicker and die as you pass. They relight behind you.',
    'Something moves in the metro tunnel entrance. Something large.',
    'A drunk ghost floats past, muttering about last call.',
    'The cathedral dome is silhouetted against the stars. It seems to be watching.',
    'You hear laughter from an empty playground. It stops when you look.',
    'A cat sits on a wall, its eyes glowing. It nods at you. Cats don\'t nod.',
    'The harbor is silent. Even the seagulls sleep. That itself is terrifying.',
    'Kallio\'s neon signs spell words in a language that doesn\'t exist.',
  ],
  espoo: [
    'The forest is alive with sounds you can\'t identify. None of them are reassuring.',
    'Mushrooms glow faintly blue along the path. They were not here during the day.',
    'An owl hoots a melody that sounds suspiciously like a Nokia ringtone.',
    'The WiFi signal from Otaniemi reaches here somehow. The password is "run".',
    'Tree branches creak overhead like old bones adjusting in a chair.',
    'You see eyes in the darkness. Many, many eyes. They blink in unison.',
    'The lake reflects stars that don\'t match the sky above.',
    'A sign glows: "Nuuksio after dark: Not recommended. Seriously."',
  ],
  vantaa: [
    'The airport\'s runway lights pulse like a heartbeat. Red. Red. Red.',
    'A phantom PA system announces a flight to Tuonela. Boarding now.',
    'The Keravanjoki river glows with a faint phosphorescence.',
    'You hear jet engines from a plane that crashed decades ago.',
    'Security cameras track you. They were all destroyed years ago.',
    'The baggage carousel in the ruins turns slowly. Something rides it.',
    'A passport lies on the ground. The photo changes every time you look.',
    'The customs demon\'s rubber stamp echoes through the ruins.',
  ],
  kauniainen: [
    'The rune stones pulse with light timed to your heartbeat.',
    'The ancient gate opens slightly. Cold air spills from the other side.',
    'Shadows of creatures extinct for millennia walk between the trees.',
    'The aurora borealis dips low enough to touch. It hums.',
    'Every tree has a face. Every face is watching.',
    'A voice from underground sings a lullaby in proto-Finnish.',
    'Time flows differently here at night. Minutes last hours.',
    'The dragon\'s heartbeat vibrates through the ground. Slow. Patient.',
  ],
};

function getRandomEvent(region, playerLevel) {
  // Check for special events first (with conditions)
  const specialEvents = EVENTS.filter(e =>
    e.regions.includes(region) &&
    playerLevel >= e.minLevel &&
    e.condition && e.condition()
  );

  if (specialEvents.length > 0 && Math.random() < 0.4) {
    return specialEvents[Math.floor(Math.random() * specialEvents.length)];
  }

  // Regular events
  const regularEvents = EVENTS.filter(e =>
    e.regions.includes(region) &&
    playerLevel >= e.minLevel &&
    !e.condition
  );

  if (regularEvents.length === 0) return null;
  return regularEvents[Math.floor(Math.random() * regularEvents.length)];
}

function resolveChoice(event, choiceIndex) {
  const choice = event.choices[choiceIndex];
  if (!choice) return null;

  // Pick outcome by weight
  const roll = Math.random();
  let cumulative = 0;
  for (const outcome of choice.outcomes) {
    cumulative += outcome.weight;
    if (roll <= cumulative) {
      applyEffect(outcome.effect);
      return outcome;
    }
  }

  // Fallback to last outcome
  const lastOutcome = choice.outcomes[choice.outcomes.length - 1];
  applyEffect(lastOutcome.effect);
  return lastOutcome;
}

function applyEffect(effect) {
  if (!effect) return;
  const p = state.player;

  if (effect.hp) {
    if (effect.hp === 999) {
      p.hp = p.maxHp;
    } else {
      p.hp = Math.max(0, Math.min(p.maxHp, p.hp + effect.hp));
    }
  }
  if (effect.mp) {
    if (effect.mp === 999) {
      p.mp = p.maxMp;
    } else {
      p.mp = Math.max(0, Math.min(p.maxMp, p.mp + effect.mp));
    }
  }
  if (effect.gold) {
    p.gold = Math.max(0, p.gold + effect.gold);
  }
  if (effect.xp) {
    p.xp += effect.xp;
  }
  if (effect.item) {
    addInventoryItem(effect.item);
  }
  if (effect.flag) {
    state.flags[effect.flag] = true;
  }
  if (effect.advanceDay) {
    // Will be handled by caller
  }
}

function getFlavorText(region) {
  const night = isNight();
  const pool = night
    ? (FLAVOR_TEXT_NIGHT[region] || FLAVOR_TEXT_NIGHT.helsinki)
    : (FLAVOR_TEXT[region] || FLAVOR_TEXT.helsinki);
  return pool[Math.floor(Math.random() * pool.length)];
}
/* ============================================================
   quests.js — Quest board system
   ============================================================ */


const QUEST_TEMPLATES = [
  // ===== HELSINKI QUESTS =====
  {
    id: 'lost_tram',
    title: 'The Lost Tram',
    region: 'helsinki',
    type: 'kill',
    description: 'Tram 3 vanished in the metro tunnels. Clear the Rautatie-Rotta infestation.',
    target: 'rautatie_rotta',
    required: 5,
    rewards: { gold: 100, xp: 80, itemId: 'tram_key' },
    unlockFlag: 'found_tram_tracks',
    minLevel: 2,
  },
  {
    id: 'gull_menace',
    title: 'The Gull Menace',
    region: 'helsinki',
    type: 'kill',
    description: 'The market vendors are desperate. Thin the seagull swarms around the harbor.',
    target: 'torilokit',
    required: 4,
    rewards: { gold: 60, xp: 50 },
    minLevel: 1,
  },
  {
    id: 'kallio_cleanup',
    title: 'Kallio Cleanup',
    region: 'helsinki',
    type: 'kill',
    description: 'The beer trolls are getting bolder. Deal with them before someone gets hurt.',
    target: 'kaljatrolli',
    required: 3,
    rewards: { gold: 120, xp: 70 },
    minLevel: 2,
  },
  {
    id: 'fortress_ghosts',
    title: 'Fortress Ghosts',
    region: 'helsinki',
    type: 'kill',
    description: 'The spirits of Suomenlinna are restless. Put them to peace.',
    target: 'haamuvartija',
    required: 4,
    rewards: { gold: 150, xp: 100 },
    minLevel: 2,
  },

  // ===== ESPOO QUESTS =====
  {
    id: 'otaniemi_anomaly',
    title: 'Otaniemi Anomaly',
    region: 'espoo',
    type: 'kill',
    description: 'A tech experiment has gone wrong, spawning digital aberrations. Destroy the Koodihirviö.',
    target: 'koodihirvio',
    required: 4,
    rewards: { gold: 200, xp: 150, itemId: 'server_core' },
    minLevel: 4,
  },
  {
    id: 'nuuksio_defense',
    title: 'Nuuksio Defense',
    region: 'espoo',
    type: 'kill',
    description: 'The hiisi are encroaching on hiking trails. Protect the park.',
    target: 'nuuksion_hiisi',
    required: 5,
    rewards: { gold: 250, xp: 180 },
    minLevel: 5,
  },
  {
    id: 'lake_terror',
    title: 'Terror of the Lake',
    region: 'espoo',
    type: 'kill',
    description: 'The Järvennäkki has been drowning travelers. End its reign.',
    target: 'jarvenakki',
    required: 3,
    rewards: { gold: 300, xp: 200 },
    minLevel: 5,
  },

  // ===== VANTAA QUESTS =====
  {
    id: 'customs_tuonela',
    title: 'The Customs of Tuonela',
    region: 'vantaa',
    type: 'kill',
    description: 'The airport has become a gateway to the underworld. Close the rift by defeating its guardians.',
    target: 'tullidemoni',
    required: 4,
    rewards: { gold: 400, xp: 350, itemId: 'tuonela_pass' },
    minLevel: 7,
  },
  {
    id: 'river_kraken',
    title: 'River Terror',
    region: 'vantaa',
    type: 'kill',
    description: 'The Keravanjoki-Kraken blocks all river crossings. Slay it.',
    target: 'keravanjoki_kraken',
    required: 2,
    rewards: { gold: 450, xp: 400 },
    minLevel: 8,
  },
  {
    id: 'steel_guardians',
    title: 'Rogue Machines',
    region: 'vantaa',
    type: 'kill',
    description: 'Industrial robots have gone haywire. Shut them down permanently.',
    target: 'terasvartija',
    required: 3,
    rewards: { gold: 500, xp: 450 },
    minLevel: 8,
  },

  // ===== KAUNIAINEN QUESTS =====
  {
    id: 'ancient_corruption',
    title: 'Ancient Corruption',
    region: 'kauniainen',
    type: 'kill',
    description: 'The Ikivanha Hiisi threaten the ancient balance. Restore order.',
    target: 'ikivanha_hiisi',
    required: 4,
    rewards: { gold: 600, xp: 600 },
    minLevel: 10,
  },
  {
    id: 'death_gate',
    title: 'Close the Gate',
    region: 'kauniainen',
    type: 'kill',
    description: 'Tuonela\'s guardians have breached the mortal world. Push them back.',
    target: 'tuonenvartija',
    required: 3,
    rewards: { gold: 700, xp: 700 },
    minLevel: 10,
  },
  {
    id: 'ice_witch',
    title: 'The Frozen Sorceress',
    region: 'kauniainen',
    type: 'kill',
    description: 'Jäinen Louhitar is spreading winter across the land. Stop her.',
    target: 'jainen_louhitar',
    required: 2,
    rewards: { gold: 800, xp: 800 },
    minLevel: 11,
  },

  // ===== SAMPO QUEST (meta quest, tracked via items) =====
  {
    id: 'forge_sampo',
    title: 'Forge the Sampo Blade',
    region: 'kauniainen',
    type: 'collect',
    description: 'Gather all four Sampo fragments and forge the dragon-slaying weapon.',
    collectItems: ['sampo_fragment_1', 'sampo_fragment_2', 'sampo_fragment_3', 'sampo_fragment_4'],
    rewards: { xp: 500, weaponId: 'sampo_blade' },
    minLevel: 10,
  },
];

function getAvailableQuests(region) {
  const active = state.questBoard.map(q => q.id);
  const completed = state.player.completedQuests;

  return QUEST_TEMPLATES.filter(q =>
    q.region === region &&
    !active.includes(q.id) &&
    !completed.includes(q.id) &&
    state.player.level >= q.minLevel &&
    (!q.unlockFlag || state.flags[q.unlockFlag])
  );
}

function acceptQuest(questId) {
  const template = QUEST_TEMPLATES.find(q => q.id === questId);
  if (!template) return false;

  state.questBoard.push({
    id: template.id,
    progress: 0,
    required: template.required || 0,
  });
  state.player.activeQuests.push(template.id);
  return true;
}

function updateQuestProgress(monsterId) {
  for (const quest of state.questBoard) {
    const template = QUEST_TEMPLATES.find(q => q.id === quest.id);
    if (!template || template.type !== 'kill') continue;
    if (template.target === monsterId) {
      quest.progress = Math.min(quest.progress + 1, quest.required);
    }
  }
}

function checkQuestCompletion() {
  const completed = [];

  for (const quest of state.questBoard) {
    const template = QUEST_TEMPLATES.find(q => q.id === quest.id);
    if (!template) continue;

    let isComplete = false;

    if (template.type === 'kill') {
      isComplete = quest.progress >= quest.required;
    } else if (template.type === 'collect') {
      isComplete = template.collectItems.every(itemId => hasItem(itemId) > 0);
    }

    if (isComplete) {
      completed.push(template);
    }
  }

  return completed;
}

function completeQuest(questId) {
  const template = QUEST_TEMPLATES.find(q => q.id === questId);
  if (!template) return null;

  // Remove from active
  state.questBoard = state.questBoard.filter(q => q.id !== questId);
  state.player.activeQuests = state.player.activeQuests.filter(q => q !== questId);
  state.player.completedQuests.push(questId);

  // Grant rewards
  const rewards = template.rewards;
  if (rewards.gold) state.player.gold += rewards.gold;
  if (rewards.xp) state.player.xp += rewards.xp;

  return template;
}

function getQuestTemplate(questId) {
  return QUEST_TEMPLATES.find(q => q.id === questId);
}

function getActiveQuests() {
  return state.questBoard.map(q => {
    const template = QUEST_TEMPLATES.find(t => t.id === q.id);
    return { ...q, template };
  });
}
/* ============================================================
   art.js — Procedural pixel art for scenes, monsters, NPCs
   ============================================================ */


// ===================== UTILITY =====================
function stars(count = 15) {
  const seed = [12,45,78,102,200,250,35,180,290,155,60,220,130,8,300];
  const yy =   [8,20,12,35,5,28,42,15,10,38,25,6,32,18,22];
  for (let i = 0; i < Math.min(count, seed.length); i++) {
    rect(seed[i] % 316 + 2, yy[i], 1, 1, '#ffffff');
    rect((seed[i] * 3) % 314 + 3, (yy[i] + 19) % 45, 1, 1, '#aaaacc');
  }
}

function ground(y, color1, color2) {
  rect(0, y, 320, 200 - y, color1);
  // Texture
  for (let i = 0; i < 20; i++) {
    rect((i * 17 + 5) % 316, y + (i * 7 + 3) % (195 - y), 2, 1, color2);
  }
}

function tree(x, y, trunkH = 20, canopyR = 12, trunkColor = '#4a3020', canopyColor = '#2a5a2a') {
  rect(x - 2, y - trunkH, 4, trunkH, trunkColor);
  circle(x, y - trunkH - canopyR + 4, canopyR, canopyColor);
  circle(x - 6, y - trunkH - canopyR + 8, canopyR - 3, canopyColor);
  circle(x + 6, y - trunkH - canopyR + 8, canopyR - 3, canopyColor);
}

function pine(x, y, h = 30, color = '#1a4a1a') {
  rect(x - 2, y - 8, 4, 8, '#3a2a1a');
  // Triangle layers
  for (let i = 0; i < 3; i++) {
    const w = 14 - i * 3;
    const ty = y - 8 - i * (h / 3);
    for (let j = 0; j < h / 3; j++) {
      const rw = Math.max(1, w - j);
      rect(x - rw, ty - j, rw * 2, 1, color);
    }
  }
}

function building(x, y, w, h, wallColor, roofColor, windowColor = '#e0c060') {
  rect(x, y - h, w, h, wallColor);
  // Roof
  for (let i = 0; i < 8; i++) {
    rect(x - 2 + i, y - h - 8 + i, w + 4 - i * 2, 1, roofColor);
  }
  // Windows
  const cols = Math.floor((w - 8) / 10);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < Math.floor((h - 10) / 12); r++) {
      rect(x + 6 + c * 10, y - h + 8 + r * 12, 5, 6, windowColor);
    }
  }
  // Door
  rect(x + Math.floor(w / 2) - 3, y - 12, 6, 12, '#3a2a1a');
}

// ===================== TITLE SCREEN =====================
function drawTitle() {
  clear('#06060c');
  stars(15);

  // Mountains
  for (let i = 0; i < 320; i++) {
    const h1 = Math.sin(i * 0.02) * 25 + Math.sin(i * 0.05) * 15 + 90;
    const h2 = Math.sin(i * 0.03 + 1) * 20 + Math.sin(i * 0.06) * 10 + 100;
    rect(i, 200 - h1, 1, h1, '#1a1a2a');
    rect(i, 200 - h2, 1, h2, '#0e0e1e');
  }

  // Ground
  rect(0, 155, 320, 45, '#1a2a1a');

  // Dragon silhouette on hill
  // Body
  rect(200, 105, 40, 15, '#2a0a0a');
  rect(195, 110, 50, 10, '#2a0a0a');
  // Head
  rect(245, 100, 15, 12, '#2a0a0a');
  rect(258, 103, 8, 4, '#2a0a0a'); // snout
  rect(260, 101, 2, 2, '#ff4020'); // eye
  // Wings
  rect(205, 88, 30, 3, '#2a0a0a');
  rect(200, 85, 8, 6, '#2a0a0a');
  rect(225, 85, 8, 6, '#2a0a0a');
  // Tail
  rect(185, 112, 15, 4, '#2a0a0a');
  rect(178, 110, 10, 3, '#2a0a0a');
  // Fire glow
  circle(265, 105, 3, '#ff200040');
  rect(266, 103, 6, 2, '#ff4020');
  rect(270, 102, 4, 1, '#ff8040');

  // Title text
  textCenter('LEGEND OF', 20, '#8a6a3a', 10);
  textCenter('HELSINKI', 38, '#e0b040', 16);

  // Subtitle
  textCenter('A Fantasy of the', 130, '#6a6a8a', 7);
  textCenter('Capital Region', 142, '#6a6a8a', 7);

  // Flickering prompt
  textCenter('Press any key', 175, '#4a4a6a', 7);
}

// ===================== TOWN SCENES =====================
function drawTownHelsinki() {
  clear('#0a0a18');
  stars(10);

  // Sky gradient
  for (let i = 0; i < 60; i++) {
    const c = Math.floor(10 + i * 0.5);
    rect(0, i, 320, 1, `rgb(${c},${c},${c + 15})`);
  }

  // Cathedral dome (Helsinki Cathedral reference)
  rect(130, 60, 60, 50, '#d0c8b0'); // main body
  rect(125, 58, 70, 4, '#b0a890');  // cornice
  // Dome
  for (let i = 0; i < 20; i++) {
    const w = 20 - Math.abs(i - 10) * 2;
    rect(160 - w, 40 + i, w * 2, 1, '#7a9a7a');
  }
  rect(158, 32, 4, 10, '#d0c8b0'); // cross base
  rect(156, 30, 8, 2, '#e0d0a0');  // cross
  rect(159, 26, 2, 6, '#e0d0a0');

  // Windows on cathedral
  rect(140, 72, 8, 14, '#2a2a40');
  rect(155, 72, 10, 14, '#2a2a40');
  rect(172, 72, 8, 14, '#2a2a40');

  // Steps
  for (let i = 0; i < 5; i++) {
    rect(120 + i * 2, 110 + i * 3, 80 - i * 4, 3, '#c0b8a0');
  }

  // Side buildings
  building(20, 130, 40, 35, '#8a7a6a', '#6a4a3a', '#e0c060');
  building(260, 130, 45, 40, '#7a6a5a', '#5a3a2a', '#e0c060');

  // Cobblestone ground
  rect(0, 130, 320, 70, '#3a3a40');
  for (let i = 0; i < 30; i++) {
    rect((i * 11 + 3) % 316, 132 + (i * 7) % 65, 6, 3, '#2e2e34');
  }

  // Lamppost
  rect(100, 100, 2, 30, '#4a4a4a');
  circle(101, 98, 3, '#e0c060');
  circle(101, 98, 5, '#e0c06030');

  text('Helsinki', 10, 3, '#8a8aaa', 7);
  text('Town Square', 10, 14, '#6a6a7a', 6);
}

function drawTownEspoo() {
  clear('#0a1008');
  stars(8);

  // Dense forest background
  for (let i = 0; i < 8; i++) {
    pine(i * 42 + 15, 130, 35, '#0e3a0e');
  }

  // Modern building (Otaniemi reference)
  rect(120, 75, 80, 55, '#4a5a6a');
  rect(118, 73, 84, 3, '#6a7a8a');
  // Glass windows grid
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      rect(125 + c * 12, 80 + r * 12, 8, 8, '#90b0d0');
    }
  }

  // Path
  rect(140, 130, 40, 70, '#5a5040');

  // Trees flanking
  tree(60, 140, 25, 14, '#3a2a1a', '#1a5a1a');
  tree(270, 145, 22, 12, '#3a2a1a', '#1a5a1a');

  // Ground
  ground(130, '#2a3a2a', '#1e2e1e');

  // Tech glow
  circle(160, 90, 2, '#40a0ff');
  circle(160, 90, 5, '#40a0ff20');

  text('Espoo', 10, 3, '#8aaa8a', 7);
  text('Otaniemi District', 10, 14, '#5a7a5a', 6);
}

function drawTownVantaa() {
  clear('#0c0a0a');
  stars(6);

  // Airport control tower
  rect(150, 40, 20, 80, '#5a5a6a');
  rect(140, 35, 40, 10, '#7a7a8a');
  // Tower windows (wraparound)
  for (let i = 0; i < 8; i++) {
    rect(142 + i * 4, 37, 3, 6, '#80c0ff');
  }
  // Antenna
  rect(159, 20, 2, 16, '#8a8a8a');
  rect(156, 18, 8, 2, '#8a8a8a');
  circle(160, 17, 2, '#ff2020');

  // Terminal building
  rect(60, 90, 200, 40, '#4a4a50');
  rect(58, 88, 204, 3, '#6a6a70');
  // Terminal windows
  for (let i = 0; i < 18; i++) {
    rect(65 + i * 11, 95, 7, 10, '#3a5a7a');
  }
  // Entrance
  rect(145, 110, 30, 20, '#2a4a6a');
  rect(150, 112, 20, 18, '#80b0d0');

  // Runway
  rect(0, 130, 320, 70, '#2a2a2e');
  // Runway markings
  for (let i = 0; i < 8; i++) {
    rect(20 + i * 38, 158, 20, 3, '#e0e0e0');
  }

  // Abandoned plane silhouette
  rect(30, 135, 50, 8, '#3a3a40');
  rect(20, 132, 15, 5, '#3a3a40');
  rect(45, 125, 25, 3, '#3a3a40'); // wing
  rect(70, 132, 8, 4, '#3a3a40');  // tail

  text('Vantaa', 10, 3, '#aa8a8a', 7);
  text('Airport Ruins', 10, 14, '#7a5a5a', 6);
}

function drawTownKauniainen() {
  clear('#08060e');
  stars(12);

  // Mystical forest with glowing elements
  for (let i = 0; i < 6; i++) {
    pine(i * 55 + 10, 140, 40, '#0a2a0a');
  }

  // Ancient stone arch
  rect(130, 60, 12, 80, '#5a5a5a');
  rect(178, 60, 12, 80, '#5a5a5a');
  for (let i = 0; i < 30; i++) {
    const w = 30 - Math.abs(i - 15) * 2;
    if (w > 0) rect(160 - w, 50 + i, w * 2, 1, '#5a5a5a');
  }
  // Runes on arch
  rect(134, 75, 4, 4, '#60a0ff');
  rect(134, 90, 4, 4, '#60a0ff');
  rect(182, 75, 4, 4, '#60a0ff');
  rect(182, 90, 4, 4, '#60a0ff');
  // Arch glow
  circle(160, 75, 15, '#4060a020');
  circle(160, 75, 8, '#6080c020');

  // Mystical ground
  ground(140, '#1a1a2a', '#14142a');

  // Floating lights
  circle(80, 90, 2, '#80ff80');
  circle(80, 90, 5, '#80ff8020');
  circle(240, 100, 2, '#8080ff');
  circle(240, 100, 5, '#8080ff20');
  circle(160, 60, 2, '#ffe080');
  circle(160, 60, 5, '#ffe08020');

  text('Kauniainen', 10, 3, '#a080c0', 7);
  text('The Ancient Gate', 10, 14, '#6a5a8a', 6);
}

// ===================== LOCATION INTERIORS =====================
function drawInn() {
  clear('#1a1008');
  // Wooden walls
  rect(0, 0, 320, 200, '#2a1a0a');
  // Wall planks
  for (let i = 0; i < 16; i++) {
    rect(0, i * 12, 320, 1, '#1e140a');
  }
  // Floor
  rect(0, 140, 320, 60, '#3a2a1a');
  for (let i = 0; i < 20; i++) {
    rect(i * 16, 140, 1, 60, '#2e1e0e');
  }

  // Fireplace
  rect(240, 80, 50, 60, '#1a1a1a');
  rect(238, 78, 54, 4, '#4a3a2a');
  rect(238, 140, 54, 3, '#4a3a2a');
  // Fire
  rect(252, 115, 25, 20, '#cc4010');
  rect(256, 110, 18, 15, '#ff6020');
  rect(260, 105, 10, 12, '#ffaa30');
  rect(263, 100, 4, 8, '#ffe060');
  // Fire glow
  circle(265, 120, 30, '#ff400010');

  // Bar counter
  rect(20, 120, 140, 8, '#5a3a1a');
  rect(18, 118, 144, 3, '#6a4a2a');
  rect(20, 128, 140, 12, '#4a2a0a');

  // Mugs on counter
  rect(40, 112, 6, 8, '#7a6a4a');
  rect(65, 112, 6, 8, '#7a6a4a');
  rect(100, 112, 6, 8, '#7a6a4a');

  // Innkeeper (simple figure behind counter)
  rect(80, 95, 12, 20, '#6a4a3a'); // body
  circle(86, 89, 7, '#d0b090');    // head
  rect(82, 86, 3, 2, '#2a1a0a');   // eye
  rect(87, 86, 3, 2, '#2a1a0a');   // eye
  rect(83, 91, 6, 1, '#c0a070');   // mouth

  text('The Inn', 10, 5, '#e0c080', 7);
}

function drawShop() {
  clear('#12100e');
  // Stone walls
  rect(0, 0, 320, 200, '#2a2a28');
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 16; j++) {
      rect(j * 20 + (i % 2) * 10, i * 14, 18, 12, i % 2 === 0 ? '#2e2e2c' : '#262624');
    }
  }

  // Floor
  rect(0, 140, 320, 60, '#3a3028');

  // Weapon rack on wall
  rect(30, 40, 80, 5, '#5a4a3a');
  // Swords
  rect(40, 20, 2, 20, '#a0a0b0');
  rect(37, 18, 8, 3, '#8a6a3a');
  rect(60, 25, 2, 15, '#b0b0c0');
  rect(57, 23, 8, 3, '#8a6a3a');
  rect(80, 22, 2, 18, '#a0a0a0');
  rect(77, 20, 8, 3, '#6a4a2a');
  rect(100, 18, 2, 22, '#c0c0d0');
  rect(97, 16, 8, 3, '#aa8a4a');

  // Armor stand
  rect(220, 50, 30, 40, '#5a5a6a');
  rect(225, 45, 20, 8, '#6a6a7a');
  circle(235, 40, 6, '#d0b090'); // helmet shape

  // Shop counter
  rect(60, 120, 200, 8, '#5a4a3a');
  rect(58, 118, 204, 3, '#6a5a4a');

  // Shopkeeper
  rect(150, 95, 14, 22, '#4a3a5a'); // body
  circle(157, 89, 7, '#d0b090');     // head
  rect(152, 86, 3, 2, '#2a1a0a');
  rect(158, 86, 3, 2, '#2a1a0a');
  rect(154, 91, 6, 1, '#c0a070');
  // Beard
  rect(152, 93, 10, 5, '#8a7a5a');

  text('Weapon Shop', 10, 5, '#c0a0a0', 7);
}

function drawHealer() {
  clear('#0a100a');
  // Herb hut interior
  rect(0, 0, 320, 200, '#1a2a1a');

  // Shelves with potions
  rect(10, 30, 100, 5, '#4a3a2a');
  rect(10, 70, 100, 5, '#4a3a2a');
  // Potions
  const potionColors = ['#ff4040', '#40ff40', '#4040ff', '#ffff40', '#ff40ff', '#40ffff'];
  for (let i = 0; i < 6; i++) {
    rect(18 + i * 15, 18, 6, 12, potionColors[i]);
    rect(20 + i * 15, 16, 2, 4, '#d0d0d0');
  }
  for (let i = 0; i < 5; i++) {
    rect(18 + i * 18, 58, 6, 12, potionColors[i + 1]);
    rect(20 + i * 18, 56, 2, 4, '#d0d0d0');
  }

  // Cauldron
  rect(220, 100, 60, 40, '#2a2a2a');
  circle(250, 100, 30, '#2a2a2a');
  circle(250, 98, 26, '#30a030');
  circle(250, 95, 20, '#40c040');
  // Bubbles
  circle(240, 90, 3, '#60e060');
  circle(255, 85, 2, '#60e060');
  circle(248, 82, 4, '#60e060');

  // Floor
  rect(0, 145, 320, 55, '#2a3a2a');

  // Healer figure
  rect(150, 100, 14, 30, '#e0e0e0'); // white robe
  circle(157, 94, 7, '#c0a080');      // head
  // Gentle eyes
  rect(153, 92, 2, 2, '#2a4a2a');
  rect(159, 92, 2, 2, '#2a4a2a');
  // Herb in hand
  rect(145, 115, 6, 3, '#40a040');

  text('Healer', 10, 5, '#80e080', 7);
}

function drawTavern() {
  clear('#140a08');
  // Dark wood interior
  rect(0, 0, 320, 200, '#1e0e08');
  // Walls
  for (let i = 0; i < 16; i++) {
    rect(0, i * 10, 320, 1, '#140a04');
  }

  // Floor
  rect(0, 140, 320, 60, '#2a1a0e');

  // Tables
  rect(30, 125, 40, 5, '#4a3020');
  rect(40, 130, 4, 15, '#3a2010');
  rect(60, 130, 4, 15, '#3a2010');

  rect(200, 120, 50, 5, '#4a3020');
  rect(210, 125, 4, 15, '#3a2010');
  rect(240, 125, 4, 15, '#3a2010');

  // Candles on tables
  rect(48, 118, 2, 7, '#e0d0a0');
  rect(47, 116, 4, 2, '#ff8040');
  circle(49, 115, 3, '#ff804030');

  rect(223, 113, 2, 7, '#e0d0a0');
  rect(222, 111, 4, 2, '#ff8040');
  circle(224, 110, 3, '#ff804030');

  // Bar at back
  rect(100, 50, 120, 8, '#5a3a1a');
  rect(98, 48, 124, 3, '#6a4a2a');
  rect(100, 58, 120, 30, '#4a2a0a');

  // Bottles on shelf behind bar
  rect(105, 20, 110, 5, '#4a3a2a');
  const colors = ['#aa3030', '#30aa30', '#3030aa', '#aaaa30', '#aa30aa'];
  for (let i = 0; i < 5; i++) {
    rect(112 + i * 20, 8, 6, 12, colors[i]);
  }

  // Barkeep
  rect(155, 30, 16, 20, '#8a2a2a'); // vest
  circle(163, 24, 7, '#d0b090');
  rect(158, 22, 3, 2, '#1a0a0a');
  rect(164, 22, 3, 2, '#1a0a0a');

  text("Dark Cloak's Tavern", 10, 5, '#c08050', 7);
}

function drawQuestBoard() {
  clear('#1a1a20');
  // Stone wall
  rect(0, 0, 320, 200, '#2a2a30');

  // Wooden board
  rect(60, 20, 200, 160, '#4a3a2a');
  rect(58, 18, 204, 4, '#5a4a3a');
  rect(58, 178, 204, 4, '#5a4a3a');
  rect(58, 18, 4, 164, '#5a4a3a');
  rect(258, 18, 4, 164, '#5a4a3a');

  // Nails
  circle(65, 25, 2, '#8a8a8a');
  circle(255, 25, 2, '#8a8a8a');
  circle(65, 175, 2, '#8a8a8a');
  circle(255, 175, 2, '#8a8a8a');

  // "QUESTS" header on board
  textCenter('QUESTS', 30, '#e0d0a0', 8);
  rect(100, 42, 120, 1, '#6a5a4a');

  text('Quest Board', 10, 5, '#a0a0c0', 7);
}

// ===================== FOREST SCENES =====================
function drawForestHelsinki() {
  clear('#060810');
  stars(8);

  // Dark urban forest
  rect(0, 120, 320, 80, '#1a2a1a');

  // Trees
  tree(40, 130, 30, 16, '#2a1a0a', '#1a3a1a');
  tree(150, 125, 35, 18, '#2a1a0a', '#1a4a1a');
  tree(280, 128, 28, 14, '#2a1a0a', '#1a3a1a');
  pine(100, 130, 35, '#0e2a0e');
  pine(220, 135, 30, '#0e2a0e');

  // Path through forest
  rect(130, 130, 60, 70, '#2a2a20');
  rect(135, 130, 50, 70, '#282818');

  // Old tram tracks crossing the path
  rect(0, 150, 320, 2, '#4a4a4a');
  for (let i = 0; i < 15; i++) {
    rect(i * 22 + 5, 148, 12, 6, '#3a2a1a');
  }

  // Distant city glow
  for (let i = 0; i < 320; i++) {
    const h = Math.sin(i * 0.05) * 5 + 10;
    rect(i, 90 - h, 1, h, '#1a1a2a');
  }
  rect(0, 85, 320, 5, '#10101a10');

  text('Helsinki Forest', 10, 3, '#6a8a6a', 6);
}

function drawForestEspoo() {
  clear('#040808');
  stars(5);

  // Dense Nuuksio forest
  rect(0, 100, 320, 100, '#0e1e0e');

  pine(20, 120, 45, '#0a2a0a');
  pine(60, 115, 50, '#0c2e0c');
  pine(110, 118, 42, '#0a280a');
  pine(160, 110, 55, '#0c300c');
  pine(210, 120, 44, '#0a2a0a');
  pine(260, 112, 48, '#0c2c0c');
  pine(300, 118, 43, '#0a280a');

  // Lake glimpse
  rect(80, 160, 160, 40, '#0a1a3a');
  // Reflection
  for (let i = 0; i < 160; i++) {
    if (i % 4 < 2) rect(80 + i, 162 + (i % 7), 1, 1, '#0e2040');
  }

  // Mossy rocks
  rect(40, 165, 20, 10, '#3a4a3a');
  rect(250, 170, 15, 8, '#3a4a3a');

  text('Nuuksio Wilds', 10, 3, '#4a8a4a', 6);
}

function drawForestVantaa() {
  clear('#0a0808');

  // Industrial wasteland with nature reclaiming
  rect(0, 110, 320, 90, '#2a2420');

  // Rusted structures
  rect(30, 60, 40, 60, '#5a3a2a');
  rect(28, 58, 44, 4, '#6a4a3a');
  // Rust holes
  rect(40, 75, 8, 8, '#1a1210');
  rect(55, 85, 6, 10, '#1a1210');

  // Broken runway section
  rect(100, 120, 180, 80, '#2e2e30');
  for (let i = 0; i < 5; i++) {
    rect(120 + i * 32, 145, 16, 2, '#6a6a6a');
  }

  // Overgrown vegetation
  pine(250, 115, 28, '#1a3a1a');
  tree(290, 118, 20, 10, '#2a1a0a', '#1a3a1a');

  // Keravanjoki river
  rect(0, 170, 320, 12, '#1a2a4a');
  for (let i = 0; i < 20; i++) {
    rect(i * 16, 172, 8, 1, '#2a3a5a');
  }

  // Distant airport tower
  rect(160, 30, 8, 40, '#3a3a40');
  rect(154, 26, 20, 6, '#4a4a50');
  circle(164, 24, 2, '#ff2020');

  text('Vantaa Outskirts', 10, 3, '#8a6a5a', 6);
}

function drawForestKauniainen() {
  clear('#04020a');
  stars(15);

  // Ancient mystical forest
  rect(0, 120, 320, 80, '#0e0a1a');

  // Ancient twisted trees
  for (let i = 0; i < 4; i++) {
    const x = 40 + i * 80;
    rect(x - 4, 80, 8, 50, '#1a0e1a');
    // Twisted branches
    rect(x - 15, 85, 12, 3, '#1a0e1a');
    rect(x + 5, 78, 14, 3, '#1a0e1a');
    rect(x - 18, 80, 5, 3, '#1a0e1a');
    rect(x + 15, 74, 6, 3, '#1a0e1a');
    // Sparse glowing leaves
    circle(x - 12, 78, 4, '#1a3a2a');
    circle(x + 12, 72, 5, '#1a3a2a');
  }

  // Rune stones
  rect(90, 130, 12, 18, '#4a4a5a');
  rect(92, 128, 8, 2, '#6060ff40');
  rect(220, 135, 10, 15, '#4a4a5a');
  rect(222, 133, 6, 2, '#6060ff40');

  // Spirit wisps
  circle(70, 100, 2, '#80ff80');
  circle(70, 100, 6, '#80ff8015');
  circle(180, 90, 3, '#a080ff');
  circle(180, 90, 8, '#a080ff15');
  circle(290, 105, 2, '#ff80a0');
  circle(290, 105, 5, '#ff80a015');

  // Mist at ground
  for (let i = 0; i < 20; i++) {
    rect(i * 16, 150 + (i % 3) * 5, 14, 3, '#2a2a4a20');
  }

  text('Ancient Woods', 10, 3, '#8060a0', 6);
}

// ===================== MONSTER ART =====================
function monsterBg(region) {
  switch (region) {
    case 'helsinki': drawForestHelsinki(); break;
    case 'espoo': drawForestEspoo(); break;
    case 'vantaa': drawForestVantaa(); break;
    case 'kauniainen': drawForestKauniainen(); break;
    default: drawForestHelsinki();
  }
}

function drawMonster(artId, region) {
  monsterBg(region);
  switch (artId) {
    case 'drawRautatieRotta': drawRautatieRotta(); break;
    case 'drawTorilokit': drawTorilokit(); break;
    case 'drawKaljatrolli': drawKaljatrolli(); break;
    case 'drawHaamuvartija': drawHaamuvartija(); break;
    case 'drawMeritonttu': drawMeritonttu(); break;
    case 'drawTeknopeikko': drawTeknopeikko(); break;
    case 'drawNuuksionHiisi': drawNuuksionHiisi(); break;
    case 'drawKoodihirvio': drawKoodihirvio(); break;
    case 'drawJarvenakki': drawJarvenakki(); break;
    case 'drawBetonijatti': drawBetonijatti(); break;
    case 'drawLentokenttadrake': drawLentokenttadrake(); break;
    case 'drawKeravanjokkiKraken': drawKeravanjokkiKraken(); break;
    case 'drawTullidemoni': drawTullidemoni(); break;
    case 'drawTerasvartija': drawTerasvartija(); break;
    case 'drawMyrskyhaamu': drawMyrskyhaamu(); break;
    case 'drawIkivanhaHiisi': drawIkivanhaHiisi(); break;
    case 'drawTuonenvartija': drawTuonenvartija(); break;
    case 'drawSammonVarjo': drawSammonVarjo(); break;
    case 'drawJainenLouhitar': drawJainenLouhitar(); break;
    case 'drawLohikaarme': drawLohikaarme(); break;
    case 'drawLohikaarmeSpirit': drawLohikaarmeSpirit(); break;
    case 'drawPostikyyhky': drawPostikyyhky(); break;
    case 'drawKahvizombi': drawKahvizombi(); break;
    case 'drawYolohi': drawYolohi(); break;
    case 'drawKallioVampyyri': drawKallioVampyyri(); break;
    case 'drawStartupGolemi': drawStartupGolemi(); break;
    case 'drawNuuksioKarhu': drawNuuksioKarhu(); break;
    case 'drawWlanHaamu': drawWlanHaamu(); break;
    case 'drawLaukkuhaukka': drawLaukkuhaukka(); break;
    case 'drawBussi666': drawBussi666(); break;
    case 'drawKiitotiesusi': drawKiitotiesusi(); break;
    case 'drawRevontulihai': drawRevontulihai(); break;
    case 'drawSammakkoprinssi': drawSammakkoprinssi(); break;
    default: break;
  }
}

// --- Helsinki Monsters ---
function drawRautatieRotta() {
  const x = 140, y = 100;
  // Body
  rect(x, y, 40, 20, '#5a4030');
  rect(x + 5, y + 2, 30, 16, '#6a5040');
  // Head
  rect(x + 35, y - 5, 20, 18, '#6a5040');
  rect(x + 50, y - 2, 10, 8, '#6a5040'); // snout
  // Eye
  rect(x + 42, y - 2, 4, 4, '#ff2020');
  rect(x + 43, y - 1, 2, 2, '#ffff00');
  // Ears
  rect(x + 38, y - 10, 6, 6, '#7a5a4a');
  rect(x + 46, y - 9, 5, 5, '#7a5a4a');
  // Tail
  rect(x - 15, y + 8, 18, 3, '#5a3a2a');
  rect(x - 25, y + 5, 12, 2, '#5a3a2a');
  // Legs
  rect(x + 8, y + 18, 5, 8, '#5a4030');
  rect(x + 25, y + 18, 5, 8, '#5a4030');
  // Whiskers
  line(x + 55, y, x + 65, y - 3, '#8a7a6a');
  line(x + 55, y + 4, x + 65, y + 4, '#8a7a6a');
  // Teeth
  rect(x + 52, y + 5, 3, 4, '#e0e0c0');
  rect(x + 56, y + 5, 3, 4, '#e0e0c0');
}

function drawTorilokit() {
  // Swarm of 3 gulls
  for (let i = 0; i < 3; i++) {
    const x = 120 + i * 35, y = 75 + i * 15 + Math.sin(i * 2) * 10;
    // Body
    rect(x, y, 20, 10, '#e0e0e0');
    rect(x + 2, y + 1, 16, 8, '#f0f0f0');
    // Head
    circle(x + 18, y - 2, 5, '#f0f0f0');
    // Eye
    rect(x + 19, y - 3, 2, 2, '#1a1a1a');
    // Beak
    rect(x + 22, y - 2, 6, 3, '#e0a020');
    rect(x + 26, y - 1, 3, 2, '#c08010');
    // Wings
    rect(x - 5, y - 3, 10, 4, '#c0c0c0');
    rect(x + 15, y - 3, 10, 4, '#c0c0c0');
    // Tail
    rect(x - 6, y + 2, 8, 3, '#c0c0c0');
  }
}

function drawKaljatrolli() {
  const x = 130, y = 55;
  // Large body
  rect(x, y, 55, 65, '#4a6a4a');
  rect(x + 5, y + 5, 45, 55, '#5a7a5a');
  // Head
  rect(x + 10, y - 25, 35, 30, '#5a7a5a');
  circle(x + 27, y - 10, 18, '#5a7a5a');
  // Eyes (droopy/drunk)
  rect(x + 16, y - 15, 8, 5, '#ffffff');
  rect(x + 18, y - 14, 4, 4, '#aa2020');
  rect(x + 30, y - 15, 8, 5, '#ffffff');
  rect(x + 33, y - 14, 4, 4, '#aa2020');
  // Mouth (grin)
  rect(x + 18, y - 3, 20, 3, '#2a1a0a');
  rect(x + 20, y - 4, 4, 3, '#e0e0c0'); // teeth
  rect(x + 30, y - 4, 4, 3, '#e0e0c0');
  // Belly
  circle(x + 28, y + 40, 22, '#5a8a5a');
  // Arms
  rect(x - 10, y + 15, 12, 35, '#4a6a4a');
  rect(x + 53, y + 15, 12, 35, '#4a6a4a');
  // Beer bottle in hand
  rect(x + 56, y + 42, 6, 16, '#3a5a3a');
  rect(x + 55, y + 38, 8, 6, '#a08030');
  // Legs
  rect(x + 10, y + 60, 14, 15, '#4a6a4a');
  rect(x + 32, y + 60, 14, 15, '#4a6a4a');
}

function drawHaamuvartija() {
  const x = 140, y = 50;
  // Ghostly glow
  circle(x + 20, y + 40, 35, '#4060a015');
  // Translucent body
  rect(x + 5, y + 20, 30, 55, '#6080b060');
  rect(x + 10, y + 25, 20, 45, '#8090c060');
  // Head
  circle(x + 20, y + 12, 12, '#8090c070');
  // Helmet
  rect(x + 8, y + 2, 24, 8, '#6a6a8a80');
  rect(x + 6, y + 8, 28, 3, '#7a7a9a80');
  // Eyes (glowing)
  rect(x + 14, y + 10, 4, 4, '#80c0ff');
  rect(x + 22, y + 10, 4, 4, '#80c0ff');
  // Sword
  rect(x + 36, y + 15, 3, 50, '#a0b0d080');
  rect(x + 33, y + 13, 9, 3, '#8a8a9a80');
  // Shield
  rect(x - 5, y + 25, 12, 18, '#6a7a9a60');
  // Wispy bottom (no legs, ghostly)
  for (let i = 0; i < 5; i++) {
    rect(x + 8 + i * 5, y + 73 + i * 2, 4, 5 - i, '#6080b030');
  }
}

function drawMeritonttu() {
  const x = 145, y = 90;
  // Small gnome body
  rect(x, y, 25, 22, '#2a6a5a');
  rect(x + 3, y + 2, 19, 18, '#3a7a6a');
  // Head
  circle(x + 12, y - 6, 10, '#6aaa8a');
  // Barnacles on head
  rect(x + 5, y - 12, 3, 3, '#8a8a7a');
  rect(x + 15, y - 10, 4, 3, '#8a8a7a');
  // Eyes (large, fishlike)
  rect(x + 6, y - 8, 5, 5, '#e0e080');
  rect(x + 8, y - 7, 2, 3, '#1a1a1a');
  rect(x + 14, y - 8, 5, 5, '#e0e080');
  rect(x + 16, y - 7, 2, 3, '#1a1a1a');
  // Mouth
  rect(x + 9, y - 1, 8, 2, '#1a4a3a');
  // Arms
  rect(x - 6, y + 5, 8, 4, '#3a7a6a');
  rect(x + 23, y + 5, 8, 4, '#3a7a6a');
  // Seaweed decorations
  rect(x - 3, y + 2, 2, 8, '#2a5a2a');
  rect(x + 26, y + 3, 2, 7, '#2a5a2a');
  // Legs
  rect(x + 5, y + 20, 5, 8, '#2a6a5a');
  rect(x + 15, y + 20, 5, 8, '#2a6a5a');
  // Water splash around feet
  rect(x - 5, y + 26, 35, 3, '#3a6a8a40');
}

// --- Espoo Monsters ---
function drawTeknopeikko() {
  const x = 138, y = 75;
  // Green goblin body
  rect(x, y, 22, 30, '#3a5a2a');
  rect(x + 3, y + 2, 16, 26, '#4a6a3a');
  // Head
  circle(x + 11, y - 8, 10, '#4a7a3a');
  // Pointy ears
  rect(x - 4, y - 14, 8, 4, '#4a7a3a');
  rect(x + 18, y - 14, 8, 4, '#4a7a3a');
  // Eyes (glowing digital)
  rect(x + 4, y - 10, 5, 4, '#00ff00');
  rect(x + 13, y - 10, 5, 4, '#00ff00');
  // Cables wrapped around body
  rect(x - 2, y + 5, 26, 2, '#2a2a2a');
  rect(x + 1, y + 15, 20, 2, '#2a2a2a');
  // Sparks
  rect(x + 22, y + 5, 4, 2, '#ffff00');
  rect(x - 4, y + 15, 3, 2, '#ffff00');
  rect(x + 15, y - 18, 2, 3, '#00ffff');
  // Arms with cables
  rect(x - 8, y + 8, 10, 4, '#3a5a2a');
  rect(x + 20, y + 8, 10, 4, '#3a5a2a');
  // Legs
  rect(x + 3, y + 28, 6, 10, '#3a5a2a');
  rect(x + 13, y + 28, 6, 10, '#3a5a2a');
}

function drawNuuksionHiisi() {
  const x = 125, y = 50;
  // Large bark-covered body
  rect(x, y + 10, 50, 65, '#3a2a1a');
  rect(x + 5, y + 15, 40, 55, '#4a3a2a');
  // Bark texture
  for (let i = 0; i < 6; i++) {
    rect(x + 8 + i * 6, y + 18 + i * 8, 4, 6, '#5a4a3a');
  }
  // Head
  circle(x + 25, y, 15, '#3a2a1a');
  rect(x + 10, y - 5, 30, 15, '#4a3a2a');
  // Glowing amber eyes
  rect(x + 14, y - 2, 6, 5, '#ff8020');
  rect(x + 16, y - 1, 2, 3, '#ffcc00');
  rect(x + 28, y - 2, 6, 5, '#ff8020');
  rect(x + 30, y - 1, 2, 3, '#ffcc00');
  // Horns (branch-like)
  rect(x + 8, y - 15, 4, 12, '#2a1a0a');
  rect(x + 4, y - 20, 4, 8, '#2a1a0a');
  rect(x + 38, y - 15, 4, 12, '#2a1a0a');
  rect(x + 42, y - 20, 4, 8, '#2a1a0a');
  // Mouth
  rect(x + 18, y + 6, 14, 3, '#1a0a0a');
  // Arms (root-like)
  rect(x - 12, y + 25, 15, 6, '#3a2a1a');
  rect(x - 18, y + 22, 8, 4, '#3a2a1a');
  rect(x + 47, y + 25, 15, 6, '#3a2a1a');
  rect(x + 58, y + 22, 8, 4, '#3a2a1a');
  // Legs
  rect(x + 8, y + 72, 12, 12, '#3a2a1a');
  rect(x + 30, y + 72, 12, 12, '#3a2a1a');
}

function drawKoodihirvio() {
  const x = 130, y = 65;
  // Glitchy, shifting form
  // Base shape with "glitch" rectangles
  rect(x, y, 45, 50, '#102010');
  rect(x + 3, y + 3, 39, 44, '#003300');
  // Glitch artifacts
  rect(x - 8, y + 10, 15, 4, '#00ff0080');
  rect(x + 40, y + 25, 20, 3, '#ff000060');
  rect(x + 10, y + 40, 30, 2, '#0000ff80');
  // "Face" made of code
  rect(x + 8, y + 8, 10, 8, '#00ff00');  // eye
  rect(x + 10, y + 10, 4, 4, '#ffffff');
  rect(x + 27, y + 8, 10, 8, '#00ff00');
  rect(x + 29, y + 10, 4, 4, '#ffffff');
  // Matrix-like cascading characters (just green rects)
  for (let i = 0; i < 8; i++) {
    rect(x + 5 + i * 5, y + 20 + (i * 3) % 15, 3, 4, '#00aa00');
  }
  // Floating data fragments
  rect(x + 50, y - 5, 12, 3, '#00ff0060');
  rect(x - 15, y + 30, 10, 3, '#00ff0060');
  rect(x + 20, y - 8, 8, 3, '#00ff0060');
}

function drawJarvenakki() {
  const x = 130, y = 55;
  // Water base
  rect(x - 10, y + 60, 80, 40, '#1a3a6a40');
  // Elegant figure rising from water
  rect(x + 10, y + 30, 30, 35, '#3a7aaa');
  rect(x + 15, y + 35, 20, 25, '#4a8aba');
  // Head
  circle(x + 25, y + 15, 12, '#70b0d0');
  // Beautiful face
  rect(x + 19, y + 12, 4, 3, '#2060a0');
  rect(x + 27, y + 12, 4, 3, '#2060a0');
  rect(x + 22, y + 20, 6, 1, '#5090c0');
  // Flowing hair
  for (let i = 0; i < 5; i++) {
    rect(x + 8 + i * 2, y + 5 - i, 3, 25 + i * 3, '#2a5a8a60');
  }
  for (let i = 0; i < 4; i++) {
    rect(x + 30 + i * 2, y + 7 - i, 3, 22 + i * 3, '#2a5a8a60');
  }
  // Arms (graceful)
  rect(x, y + 35, 12, 4, '#4a8aba');
  rect(x + 38, y + 35, 12, 4, '#4a8aba');
  // Water droplets
  circle(x + 5, y + 50, 2, '#80c0ff');
  circle(x + 45, y + 45, 2, '#80c0ff');
  circle(x + 25, y + 65, 3, '#80c0ff40');
}

function drawBetonijatti() {
  const x = 110, y = 30;
  // Massive concrete body
  rect(x, y + 20, 70, 80, '#7a7a7a');
  rect(x + 5, y + 25, 60, 70, '#8a8a8a');
  // Rebar sticking out
  rect(x - 5, y + 40, 10, 3, '#6a3a2a');
  rect(x + 65, y + 55, 12, 3, '#6a3a2a');
  rect(x + 30, y + 15, 3, 10, '#6a3a2a');
  // Head (small relative to body)
  rect(x + 20, y, 30, 22, '#7a7a7a');
  // Eyes (red LED-like)
  rect(x + 26, y + 6, 6, 4, '#ff2020');
  rect(x + 38, y + 6, 6, 4, '#ff2020');
  // Crack lines
  line(x + 15, y + 30, x + 45, y + 60, '#5a5a5a');
  line(x + 50, y + 25, x + 35, y + 70, '#5a5a5a');
  // Arms (massive)
  rect(x - 18, y + 30, 20, 50, '#7a7a7a');
  rect(x + 68, y + 30, 20, 50, '#7a7a7a');
  // Fists
  rect(x - 22, y + 75, 26, 14, '#6a6a6a');
  rect(x + 66, y + 75, 26, 14, '#6a6a6a');
  // Legs
  rect(x + 10, y + 95, 18, 20, '#7a7a7a');
  rect(x + 42, y + 95, 18, 20, '#7a7a7a');
}

// --- Vantaa Monsters ---
function drawLentokenttadrake() {
  const x = 110, y = 50;
  // Medium dragon
  // Body
  rect(x + 10, y + 20, 60, 35, '#5a3a2a');
  rect(x + 15, y + 25, 50, 25, '#6a4a3a');
  // Belly
  rect(x + 20, y + 35, 40, 15, '#8a6a4a');
  // Head
  rect(x + 65, y + 5, 30, 22, '#6a4a3a');
  rect(x + 90, y + 10, 15, 10, '#6a4a3a'); // snout
  // Eye
  rect(x + 75, y + 8, 6, 5, '#ff6020');
  rect(x + 77, y + 9, 2, 3, '#ffcc00');
  // Horns
  rect(x + 68, y, 4, 8, '#4a3020');
  rect(x + 78, y - 2, 4, 10, '#4a3020');
  // Wings
  rect(x + 15, y, 35, 5, '#5a3a2a');
  rect(x + 5, y - 8, 15, 12, '#5a3a2a');
  rect(x + 45, y - 5, 12, 8, '#5a3a2a');
  // Tail
  rect(x - 10, y + 30, 22, 8, '#5a3a2a');
  rect(x - 22, y + 28, 14, 5, '#5a3a2a');
  // Fire from nostrils
  rect(x + 100, y + 12, 8, 3, '#ff4020');
  rect(x + 106, y + 11, 5, 2, '#ff8040');
  // Legs
  rect(x + 20, y + 52, 8, 12, '#5a3a2a');
  rect(x + 50, y + 52, 8, 12, '#5a3a2a');
  // Jet fuel sheen on scales
  rect(x + 25, y + 28, 4, 4, '#8a7a9a40');
  rect(x + 40, y + 30, 4, 4, '#8a9a7a40');
}

function drawKeravanjokkiKraken() {
  const x = 80, y = 60;
  // Water surface
  rect(x, y + 70, 160, 40, '#1a3a5a');
  // Tentacles rising from water
  for (let i = 0; i < 6; i++) {
    const tx = x + 10 + i * 25;
    const ty = y + 30 + Math.sin(i * 1.5) * 20;
    // Tentacle
    rect(tx, ty, 8, 45 - Math.sin(i) * 10, '#4a2a4a');
    rect(tx + 1, ty + 2, 6, 40 - Math.sin(i) * 10, '#5a3a5a');
    // Suckers
    rect(tx + 2, ty + 10, 3, 3, '#6a4a6a');
    rect(tx + 2, ty + 20, 3, 3, '#6a4a6a');
    // Tip curl
    rect(tx - 2, ty - 2, 5, 4, '#4a2a4a');
  }
  // Eye peeking from water
  rect(x + 60, y + 65, 20, 12, '#3a1a3a');
  rect(x + 65, y + 67, 12, 8, '#80ff40');
  rect(x + 69, y + 69, 4, 4, '#1a0a1a');
  // Water splashes
  for (let i = 0; i < 8; i++) {
    rect(x + i * 20, y + 68 + (i % 3), 4, 2, '#3a5a7a');
  }
}

function drawTullidemoni() {
  const x = 135, y = 55;
  // Bureaucratic demon in suit
  rect(x, y + 15, 40, 55, '#2a2a3a'); // suit
  rect(x + 5, y + 20, 30, 45, '#3a3a4a');
  // Tie
  rect(x + 17, y + 18, 6, 30, '#8a2020');
  // Head (demonic)
  circle(x + 20, y + 2, 14, '#8a3030');
  // Horns
  rect(x + 5, y - 12, 5, 10, '#5a1010');
  rect(x + 30, y - 12, 5, 10, '#5a1010');
  // Eyes (glowing)
  rect(x + 12, y - 2, 6, 4, '#ffff00');
  rect(x + 22, y - 2, 6, 4, '#ffff00');
  // Sinister smile
  rect(x + 13, y + 7, 14, 2, '#1a0a0a');
  rect(x + 12, y + 6, 3, 2, '#e0e0c0');
  rect(x + 25, y + 6, 3, 2, '#e0e0c0');
  // Rubber stamp (in hand)
  rect(x + 42, y + 35, 12, 20, '#4a2a1a');
  rect(x + 40, y + 55, 16, 5, '#2a0a0a');
  // Glowing stamp face
  rect(x + 42, y + 55, 12, 3, '#ff404080');
  // Paperwork flying around
  rect(x - 15, y + 20, 10, 8, '#e0e0d0');
  rect(x + 50, y + 10, 10, 8, '#e0e0d0');
  rect(x - 8, y + 45, 8, 6, '#e0e0d0');
  // Legs
  rect(x + 8, y + 68, 8, 12, '#2a2a3a');
  rect(x + 24, y + 68, 8, 12, '#2a2a3a');
}

function drawTerasvartija() {
  const x = 120, y = 35;
  // Industrial robot
  rect(x + 10, y + 20, 50, 60, '#5a5a6a');
  rect(x + 15, y + 25, 40, 50, '#6a6a7a');
  // Head
  rect(x + 18, y, 34, 22, '#5a5a6a');
  rect(x + 20, y + 2, 30, 18, '#4a4a5a');
  // Red eye (single, cyclops)
  rect(x + 30, y + 7, 10, 6, '#ff0000');
  rect(x + 33, y + 8, 4, 4, '#ff4040');
  // Antenna
  rect(x + 34, y - 8, 2, 10, '#7a7a8a');
  circle(x + 35, y - 10, 3, '#ff2020');
  // Arms (hydraulic)
  rect(x - 8, y + 30, 20, 8, '#5a5a6a');
  rect(x - 14, y + 25, 8, 18, '#4a4a5a');
  rect(x + 58, y + 30, 20, 8, '#5a5a6a');
  rect(x + 76, y + 25, 8, 18, '#4a4a5a');
  // Claws
  rect(x - 18, y + 40, 6, 12, '#3a3a4a');
  rect(x - 12, y + 40, 6, 12, '#3a3a4a');
  rect(x + 78, y + 40, 6, 12, '#3a3a4a');
  rect(x + 84, y + 40, 6, 12, '#3a3a4a');
  // Legs (treads)
  rect(x + 12, y + 78, 20, 14, '#3a3a40');
  rect(x + 38, y + 78, 20, 14, '#3a3a40');
  // Tread pattern
  for (let i = 0; i < 4; i++) {
    rect(x + 14 + i * 4, y + 80, 2, 10, '#2a2a30');
    rect(x + 40 + i * 4, y + 80, 2, 10, '#2a2a30');
  }
  // Sparks
  rect(x + 6, y + 35, 3, 2, '#ffff00');
  rect(x + 60, y + 28, 2, 3, '#ffff00');
}

function drawMyrskyhaamu() {
  const x = 120, y = 40;
  // Storm cloud form
  circle(x + 40, y + 15, 25, '#3a3a5a60');
  circle(x + 25, y + 20, 20, '#3a3a5a50');
  circle(x + 55, y + 20, 20, '#3a3a5a50');
  circle(x + 40, y + 30, 22, '#2a2a4a60');
  // Face in the clouds
  rect(x + 28, y + 12, 6, 5, '#80c0ff');
  rect(x + 46, y + 12, 6, 5, '#80c0ff');
  rect(x + 32, y + 25, 16, 3, '#4a4a7a');
  // Lightning bolts
  rect(x + 20, y + 45, 4, 15, '#ffff40');
  rect(x + 22, y + 58, 4, 12, '#ffff40');
  rect(x + 55, y + 50, 4, 12, '#ffff40');
  rect(x + 53, y + 60, 4, 10, '#ffff40');
  // Rain
  for (let i = 0; i < 10; i++) {
    rect(x + 10 + i * 7, y + 40 + (i * 5) % 30, 1, 5, '#6a8aaa40');
  }
  // Plane silhouette ghostly
  rect(x + 25, y + 55, 30, 5, '#4a4a6a30');
  rect(x + 15, y + 53, 10, 3, '#4a4a6a30');
  rect(x + 50, y + 52, 8, 3, '#4a4a6a30');
}

// --- Kauniainen Monsters ---
function drawIkivanhaHiisi() {
  const x = 115, y = 30;
  // Massive ancient tree demon
  rect(x + 15, y + 20, 55, 80, '#2a1a0a');
  rect(x + 20, y + 25, 45, 70, '#3a2a1a');
  // Ancient bark texture (deep grooves)
  for (let i = 0; i < 8; i++) {
    rect(x + 22 + i * 5, y + 28, 2, 65, '#1a0a00');
  }
  // Head (merged with trunk)
  rect(x + 18, y, 50, 25, '#3a2a1a');
  // Crown of branches
  for (let i = 0; i < 5; i++) {
    rect(x + 10 + i * 12, y - 15, 4, 18, '#2a1a0a');
    rect(x + 8 + i * 12, y - 20, 3, 8, '#1a3a1a');
  }
  // Ancient glowing eyes
  rect(x + 25, y + 5, 8, 6, '#ff6000');
  rect(x + 27, y + 6, 4, 4, '#ffcc00');
  rect(x + 45, y + 5, 8, 6, '#ff6000');
  rect(x + 47, y + 6, 4, 4, '#ffcc00');
  // Mouth (gnarled)
  rect(x + 30, y + 16, 20, 5, '#0a0400');
  // Root-arms
  rect(x, y + 35, 18, 8, '#2a1a0a');
  rect(x - 12, y + 30, 15, 6, '#2a1a0a');
  rect(x + 67, y + 35, 18, 8, '#2a1a0a');
  rect(x + 82, y + 30, 15, 6, '#2a1a0a');
  // Roots at base
  rect(x + 5, y + 95, 75, 10, '#2a1a0a');
  rect(x, y + 100, 85, 8, '#1a0a00');
  // Moss/lichens
  rect(x + 25, y + 40, 6, 4, '#2a5a2a');
  rect(x + 50, y + 55, 5, 3, '#2a5a2a');
}

function drawTuonenvartija() {
  const x = 130, y = 40;
  // Death realm guardian — hooded figure
  // Dark aura
  circle(x + 25, y + 40, 40, '#1a0a2a20');
  // Robe
  rect(x + 5, y + 15, 40, 70, '#1a0a1a');
  rect(x + 10, y + 20, 30, 60, '#2a1a2a');
  // Robe widens at bottom
  rect(x, y + 75, 50, 15, '#1a0a1a');
  // Hood
  rect(x + 5, y, 40, 20, '#1a0a1a');
  circle(x + 25, y + 5, 18, '#1a0a1a');
  // Hollow eyes
  rect(x + 16, y + 5, 6, 5, '#6040a0');
  rect(x + 28, y + 5, 6, 5, '#6040a0');
  // Hands (skeletal)
  rect(x - 5, y + 40, 12, 4, '#a09080');
  rect(x + 43, y + 40, 12, 4, '#a09080');
  // Scythe
  rect(x + 50, y - 10, 3, 80, '#5a5a5a');
  // Scythe blade
  for (let i = 0; i < 12; i++) {
    rect(x + 35 + i, y - 15 + i, 15 - i, 2, '#8a8aaa');
  }
  // Soul wisps
  circle(x + 10, y + 60, 3, '#a080ff40');
  circle(x + 40, y + 50, 2, '#a080ff40');
  circle(x + 5, y + 35, 2, '#a080ff40');
}

function drawSammonVarjo() {
  const x = 120, y = 50;
  // Swirling vortex of reality
  // Concentric rings
  for (let r = 40; r > 5; r -= 5) {
    const colors = ['#2a0a3a', '#0a2a3a', '#3a0a0a', '#0a3a0a', '#2a2a0a', '#1a1a3a', '#3a1a2a', '#0a2a2a'];
    circle(x + 40, y + 30, r, colors[r % colors.length] + '40');
  }
  // Core
  circle(x + 40, y + 30, 8, '#ffffff40');
  circle(x + 40, y + 30, 4, '#ffffff80');
  // Fragments of reality floating around
  rect(x, y, 12, 8, '#4a3a5a');
  rect(x + 70, y + 5, 10, 10, '#3a5a4a');
  rect(x + 10, y + 60, 8, 12, '#5a4a3a');
  rect(x + 65, y + 55, 12, 8, '#4a4a5a');
  // Glitch-like streaks
  for (let i = 0; i < 6; i++) {
    rect(x + 10 + i * 12, y + 20 + i * 5, 8, 2, '#ff40ff30');
  }
  // Shadow bolts radiating outward
  rect(x + 5, y + 28, 25, 3, '#4020a060');
  rect(x + 55, y + 32, 25, 3, '#4020a060');
  rect(x + 38, y + 5, 3, 20, '#4020a060');
  rect(x + 38, y + 55, 3, 20, '#4020a060');
}

function drawJainenLouhitar() {
  const x = 130, y = 40;
  // Ice sorceress
  // Icy aura
  circle(x + 22, y + 40, 45, '#4060ff10');
  // Elegant robe
  rect(x + 5, y + 20, 35, 60, '#c0d0ff');
  rect(x + 10, y + 25, 25, 50, '#d0e0ff');
  // Robe flows wide at bottom
  rect(x, y + 70, 45, 18, '#b0c0ee');
  // Ice crystals on robe
  rect(x + 12, y + 35, 3, 6, '#80a0ff');
  rect(x + 28, y + 45, 3, 6, '#80a0ff');
  rect(x + 18, y + 55, 3, 6, '#80a0ff');
  // Head
  circle(x + 22, y + 10, 12, '#d0e0ff');
  // Crown of ice
  rect(x + 10, y - 5, 4, 10, '#80c0ff');
  rect(x + 18, y - 8, 4, 13, '#60a0ff');
  rect(x + 26, y - 5, 4, 10, '#80c0ff');
  rect(x + 34, y - 3, 4, 8, '#a0d0ff');
  // Eyes (cold blue)
  rect(x + 16, y + 7, 4, 3, '#2040aa');
  rect(x + 25, y + 7, 4, 3, '#2040aa');
  // Lips
  rect(x + 19, y + 14, 6, 1, '#8090cc');
  // Hands casting ice
  rect(x - 8, y + 35, 15, 4, '#d0e0ff');
  rect(x + 38, y + 35, 15, 4, '#d0e0ff');
  // Ice shards floating
  rect(x - 15, y + 25, 6, 3, '#80c0ff80');
  rect(x + 50, y + 20, 5, 8, '#80c0ff80');
  rect(x - 10, y + 50, 4, 6, '#80c0ff80');
  rect(x + 48, y + 48, 6, 4, '#80c0ff80');
  // Snow particles
  circle(x - 5, y + 40, 1, '#ffffff80');
  circle(x + 45, y + 30, 1, '#ffffff80');
  circle(x + 10, y + 65, 1, '#ffffff80');
}

// --- New Monsters ---
function drawPostikyyhky() {
  const x = 140, y = 85;
  // Fat pigeon
  rect(x, y, 28, 18, '#8a8a8a');
  rect(x + 3, y + 2, 22, 14, '#9a9a9a');
  // Head
  circle(x + 24, y - 2, 7, '#9a9a9a');
  rect(x + 28, y - 3, 6, 3, '#c0a040'); // beak
  rect(x + 25, y - 4, 3, 2, '#ff4020'); // eye
  // Neck shimmer
  rect(x + 20, y + 2, 6, 6, '#4a8a6a');
  rect(x + 21, y + 3, 4, 4, '#6a5a8a');
  // Wings
  rect(x - 4, y + 2, 8, 10, '#7a7a7a');
  rect(x + 22, y + 2, 8, 10, '#7a7a7a');
  // Legs
  rect(x + 8, y + 16, 2, 8, '#c08040');
  rect(x + 18, y + 16, 2, 8, '#c08040');
  // Letter in beak
  rect(x + 30, y - 6, 8, 6, '#e0e0c0');
  rect(x + 31, y - 5, 6, 1, '#4a4a4a');
  rect(x + 31, y - 3, 4, 1, '#4a4a4a');
}

function drawKahvizombi() {
  const x = 140, y = 60;
  // Shambling body
  rect(x, y + 15, 26, 45, '#4a5a3a');
  rect(x + 3, y + 18, 20, 38, '#5a6a4a');
  // Head (tilted)
  circle(x + 13, y + 6, 10, '#6a8a5a');
  // Sunken eyes
  rect(x + 7, y + 3, 5, 4, '#1a1a0a');
  rect(x + 15, y + 4, 5, 4, '#1a1a0a');
  rect(x + 8, y + 4, 3, 2, '#cc4040');
  rect(x + 16, y + 5, 3, 2, '#cc4040');
  // Open mouth (groaning)
  rect(x + 9, y + 10, 8, 4, '#1a1a0a');
  // Arms (reaching)
  rect(x - 10, y + 22, 12, 5, '#5a6a4a');
  rect(x + 24, y + 20, 14, 5, '#5a6a4a');
  // Coffee cup in hand
  rect(x + 34, y + 18, 8, 10, '#e0e0d0');
  rect(x + 33, y + 16, 10, 3, '#c0c0b0');
  // Empty cup indicator
  rect(x + 36, y + 22, 4, 4, '#3a2a1a');
  // Legs (shambling)
  rect(x + 4, y + 58, 7, 12, '#4a5a3a');
  rect(x + 16, y + 56, 7, 14, '#4a5a3a');
}

function drawYolohi() {
  const x = 130, y = 60;
  // Shadow creature
  circle(x + 25, y + 30, 30, '#0a0a1a40');
  rect(x + 5, y + 10, 40, 50, '#0e0e1e80');
  rect(x + 10, y + 15, 30, 40, '#1a1a2a90');
  // Eyes (glowing in shadow)
  rect(x + 15, y + 20, 6, 4, '#8080ff');
  rect(x + 17, y + 21, 2, 2, '#ffffff');
  rect(x + 29, y + 20, 6, 4, '#8080ff');
  rect(x + 31, y + 21, 2, 2, '#ffffff');
  // Mouth (wispy)
  rect(x + 18, y + 32, 14, 2, '#4040a060');
  // Shadow tendrils
  rect(x, y + 50, 8, 15, '#0e0e1e60');
  rect(x + 42, y + 48, 8, 18, '#0e0e1e60');
  rect(x + 15, y + 58, 6, 12, '#0e0e1e50');
  rect(x + 30, y + 56, 6, 14, '#0e0e1e50');
}

function drawKallioVampyyri() {
  const x = 140, y = 50;
  // Stylish figure
  rect(x, y + 15, 28, 50, '#1a1a1a');
  rect(x + 3, y + 18, 22, 44, '#2a2a2a');
  // Leather jacket collar
  rect(x - 2, y + 15, 32, 6, '#3a2a1a');
  // Head
  circle(x + 14, y + 5, 10, '#d0c8c0');
  // Slicked hair
  rect(x + 4, y - 5, 20, 8, '#1a1a1a');
  // Eyes (red, glowing)
  rect(x + 8, y + 2, 4, 3, '#ff2020');
  rect(x + 18, y + 2, 4, 3, '#ff2020');
  // Fangs
  rect(x + 11, y + 9, 2, 4, '#ffffff');
  rect(x + 17, y + 9, 2, 4, '#ffffff');
  // Cape
  rect(x - 8, y + 20, 10, 40, '#2a0a0a');
  rect(x + 26, y + 20, 10, 40, '#2a0a0a');
  // Pale hands
  rect(x - 4, y + 35, 6, 4, '#d0c8c0');
  rect(x + 26, y + 35, 6, 4, '#d0c8c0');
  // Boots
  rect(x + 4, y + 62, 8, 6, '#2a1a1a');
  rect(x + 16, y + 62, 8, 6, '#2a1a1a');
}

function drawStartupGolemi() {
  const x = 115, y = 40;
  // Body made of paper/screens
  rect(x + 10, y + 20, 55, 60, '#e0e0d0');
  rect(x + 15, y + 25, 45, 50, '#f0f0e0');
  // "SERIES B" on chest
  text('SERIES', x + 18, y + 30, '#4040a0', 6);
  text('B', x + 35, y + 40, '#4040a0', 8);
  // Head (monitor)
  rect(x + 20, y, 35, 22, '#3a3a3a');
  rect(x + 23, y + 3, 29, 16, '#4080ff');
  // Graph going down on screen
  line(x + 26, y + 6, x + 35, y + 8, '#ff4040');
  line(x + 35, y + 8, x + 42, y + 14, '#ff4040');
  line(x + 42, y + 14, x + 48, y + 16, '#ff4040');
  // Arms (holding pitch decks)
  rect(x, y + 30, 12, 6, '#e0e0d0');
  rect(x + 63, y + 30, 12, 6, '#e0e0d0');
  rect(x - 5, y + 28, 8, 12, '#f0f0e0'); // deck stack
  rect(x + 72, y + 28, 8, 12, '#f0f0e0');
  // Legs
  rect(x + 18, y + 78, 14, 14, '#d0d0c0');
  rect(x + 42, y + 78, 14, 14, '#d0d0c0');
}

function drawNuuksioKarhu() {
  const x = 115, y = 35;
  // Large bear
  rect(x + 10, y + 20, 60, 55, '#5a3a1a');
  rect(x + 15, y + 25, 50, 45, '#6a4a2a');
  // Head
  circle(x + 40, y + 10, 16, '#5a3a1a');
  // Ears
  circle(x + 28, y, 6, '#5a3a1a');
  circle(x + 52, y, 6, '#5a3a1a');
  circle(x + 28, y, 3, '#7a5a3a');
  circle(x + 52, y, 3, '#7a5a3a');
  // Eyes
  rect(x + 33, y + 6, 4, 4, '#1a0a0a');
  rect(x + 43, y + 6, 4, 4, '#1a0a0a');
  // Nose
  rect(x + 37, y + 14, 6, 4, '#1a0a0a');
  // Mouth (open, angry)
  rect(x + 34, y + 19, 12, 4, '#3a1a0a');
  rect(x + 36, y + 18, 3, 3, '#e0e0c0'); // teeth
  rect(x + 41, y + 18, 3, 3, '#e0e0c0');
  // Front legs
  rect(x + 5, y + 40, 14, 30, '#5a3a1a');
  rect(x + 61, y + 40, 14, 30, '#5a3a1a');
  // Claws
  rect(x + 3, y + 68, 18, 4, '#3a2a1a');
  rect(x + 59, y + 68, 18, 4, '#3a2a1a');
  // Lunch crumbs on snout
  rect(x + 38, y + 16, 2, 2, '#e0c060');
  rect(x + 44, y + 15, 2, 2, '#e0c060');
}

function drawWlanHaamu() {
  const x = 130, y = 55;
  // Ghostly router shape
  rect(x, y + 10, 45, 30, '#4a4a5a40');
  rect(x + 5, y + 15, 35, 20, '#6a6a7a50');
  // LED eyes (blinking)
  rect(x + 12, y + 20, 5, 5, '#00ff00');
  rect(x + 28, y + 20, 5, 5, '#ff0000');
  // Antennas
  rect(x + 8, y - 5, 2, 18, '#6a6a7a60');
  rect(x + 35, y - 5, 2, 18, '#6a6a7a60');
  // WiFi signal arcs
  for (let i = 0; i < 3; i++) {
    const r = 10 + i * 8;
    circle(x + 22, y - 10, r, '#40a0ff10');
  }
  // Glitch artifacts
  rect(x - 10, y + 25, 15, 3, '#00ff0060');
  rect(x + 45, y + 15, 12, 3, '#ff000040');
  rect(x + 10, y + 40, 20, 2, '#0000ff40');
  // Signal strength text
  text('404', x + 12, y + 28, '#ff404080', 6);
  // Ghost tail
  for (let i = 0; i < 4; i++) {
    rect(x + 5 + i * 10, y + 38 + i * 3, 8, 6 - i, '#4a4a5a30');
  }
}

function drawLaukkuhaukka() {
  const x = 110, y = 45;
  // Massive hawk
  // Body
  rect(x + 25, y + 20, 45, 25, '#5a3a1a');
  rect(x + 30, y + 23, 35, 19, '#6a4a2a');
  // Head
  rect(x + 65, y + 10, 20, 18, '#4a3020');
  // Beak (hooked)
  rect(x + 82, y + 14, 12, 6, '#c0a020');
  rect(x + 90, y + 18, 6, 4, '#a08010');
  // Eye (fierce)
  rect(x + 72, y + 13, 5, 4, '#ff8020');
  rect(x + 73, y + 14, 2, 2, '#1a1a1a');
  // Wings (spread wide)
  rect(x, y + 10, 30, 6, '#5a3a1a');
  rect(x - 10, y + 5, 15, 8, '#4a3020');
  rect(x + 65, y + 10, 5, 6, '#5a3a1a');
  // Wing feather details
  for (let i = 0; i < 4; i++) {
    rect(x + i * 8, y + 12 + i, 6, 3, '#4a2a10');
  }
  // Tail feathers
  rect(x + 15, y + 30, 15, 8, '#4a3020');
  // Talons (carrying a suitcase!)
  rect(x + 35, y + 43, 6, 8, '#c0a020');
  rect(x + 55, y + 43, 6, 8, '#c0a020');
  // Suitcase
  rect(x + 30, y + 50, 35, 18, '#3a3a5a');
  rect(x + 28, y + 48, 39, 3, '#4a4a6a');
  rect(x + 44, y + 46, 8, 3, '#5a5a7a');
}

function drawBussi666() {
  const x = 70, y = 60;
  // Possessed bus
  rect(x, y, 160, 55, '#cc3030');
  rect(x + 5, y + 5, 150, 40, '#dd4040');
  // Windows (glowing evil)
  for (let i = 0; i < 6; i++) {
    rect(x + 12 + i * 24, y + 8, 16, 18, '#ff8040');
    // Evil eyes in windows
    rect(x + 16 + i * 24, y + 14, 3, 3, '#ffff00');
    rect(x + 21 + i * 24, y + 14, 3, 3, '#ffff00');
  }
  // Route number
  rect(x + 8, y + 8, 18, 12, '#1a1a1a');
  text('666', x + 9, y + 10, '#ff2020', 6);
  // Wheels
  circle(x + 30, y + 55, 10, '#1a1a1a');
  circle(x + 130, y + 55, 10, '#1a1a1a');
  circle(x + 30, y + 55, 5, '#3a3a3a');
  circle(x + 130, y + 55, 5, '#3a3a3a');
  // Exhaust flames
  rect(x - 15, y + 35, 18, 6, '#ff4020');
  rect(x - 20, y + 33, 10, 4, '#ff8040');
  // Horns on top
  rect(x + 60, y - 8, 5, 10, '#aa2020');
  rect(x + 95, y - 8, 5, 10, '#aa2020');
  // "HSL" text
  text('HSL', x + 68, y + 32, '#ffffff', 6);
}

function drawKiitotiesusi() {
  const x = 125, y = 55;
  // Massive wolf
  rect(x + 10, y + 15, 50, 30, '#3a3a4a');
  rect(x + 15, y + 18, 40, 24, '#4a4a5a');
  // Head
  rect(x + 55, y + 5, 25, 20, '#3a3a4a');
  rect(x + 70, y + 8, 15, 10, '#3a3a4a'); // snout
  // Ears
  rect(x + 58, y - 2, 6, 10, '#3a3a4a');
  rect(x + 68, y - 2, 6, 10, '#3a3a4a');
  // Eyes (reflecting red)
  rect(x + 62, y + 8, 5, 4, '#ff2020');
  rect(x + 63, y + 9, 2, 2, '#ff6060');
  // Teeth
  rect(x + 72, y + 17, 3, 4, '#e0e0c0');
  rect(x + 78, y + 17, 3, 4, '#e0e0c0');
  // Legs
  rect(x + 15, y + 43, 8, 16, '#3a3a4a');
  rect(x + 30, y + 43, 8, 16, '#3a3a4a');
  rect(x + 42, y + 43, 8, 16, '#3a3a4a');
  // Tail (bushy)
  rect(x - 5, y + 18, 18, 8, '#3a3a4a');
  rect(x - 10, y + 15, 8, 6, '#4a4a5a');
  // Fur texture
  rect(x + 20, y + 22, 3, 3, '#4a4a5a');
  rect(x + 35, y + 25, 3, 3, '#4a4a5a');
}

function drawRevontulihai() {
  const x = 100, y = 40;
  // Aurora borealis shark swimming in the sky
  // Body (translucent aurora colors)
  rect(x + 20, y + 20, 70, 30, '#20a06040');
  rect(x + 25, y + 23, 60, 24, '#40c08050');
  // Gradient stripes
  rect(x + 25, y + 25, 60, 5, '#20a0a040');
  rect(x + 25, y + 32, 60, 5, '#a0408040');
  rect(x + 25, y + 39, 60, 5, '#4040a040');
  // Head/snout
  rect(x + 85, y + 22, 25, 22, '#40c08050');
  rect(x + 105, y + 27, 12, 12, '#40c08050');
  // Eye
  rect(x + 92, y + 26, 6, 5, '#ffffff');
  rect(x + 94, y + 27, 2, 3, '#1a1a3a');
  // Teeth
  rect(x + 108, y + 38, 4, 4, '#ffffff');
  rect(x + 113, y + 38, 3, 3, '#ffffff');
  // Dorsal fin
  for (let i = 0; i < 10; i++) {
    rect(x + 50 + i, y + 12 + i, 12 - i, 2, '#40c08040');
  }
  // Tail fin
  rect(x + 5, y + 20, 18, 8, '#20a06040');
  rect(x, y + 15, 10, 8, '#20a06030');
  rect(x, y + 32, 10, 8, '#20a06030');
  // Aurora trail
  for (let i = 0; i < 12; i++) {
    const colors = ['#20ff6020', '#40a0ff20', '#ff40a020', '#a040ff20'];
    rect(x - 10 + i * 3, y + 25 + Math.sin(i) * 5, 4, 3, colors[i % 4]);
  }
}

function drawSammakkoprinssi() {
  const x = 140, y = 70;
  // Regal frog
  rect(x, y, 30, 25, '#2a6a2a');
  rect(x + 3, y + 3, 24, 19, '#3a8a3a');
  // Head
  circle(x + 15, y - 5, 12, '#3a8a3a');
  // Big eyes (bulging)
  circle(x + 7, y - 10, 6, '#80cc40');
  rect(x + 5, y - 11, 3, 3, '#1a1a1a');
  circle(x + 23, y - 10, 6, '#80cc40');
  rect(x + 22, y - 11, 3, 3, '#1a1a1a');
  // Wide mouth (displeased)
  rect(x + 5, y - 1, 20, 2, '#1a4a1a');
  // Crown!
  rect(x + 5, y - 20, 20, 6, '#e0b020');
  rect(x + 7, y - 24, 4, 6, '#e0b020');
  rect(x + 13, y - 26, 4, 8, '#e0b020');
  rect(x + 19, y - 24, 4, 6, '#e0b020');
  // Jewels on crown
  rect(x + 8, y - 22, 2, 2, '#ff2020');
  rect(x + 14, y - 24, 2, 2, '#2020ff');
  rect(x + 20, y - 22, 2, 2, '#20ff20');
  // Cape (royal purple)
  rect(x - 8, y + 5, 10, 20, '#4a1a6a');
  rect(x + 28, y + 5, 10, 20, '#4a1a6a');
  // Ermine trim
  rect(x - 8, y + 5, 10, 3, '#e0e0e0');
  rect(x + 28, y + 5, 10, 3, '#e0e0e0');
  // Legs (sitting regally)
  rect(x + 2, y + 22, 10, 8, '#2a6a2a');
  rect(x + 18, y + 22, 10, 8, '#2a6a2a');
  // Webbed feet
  rect(x - 2, y + 28, 14, 4, '#2a5a2a');
  rect(x + 16, y + 28, 14, 4, '#2a5a2a');
}

// --- BOSS: The Dragon ---
function drawLohikaarme() {
  clear('#0a0204');
  // Fiery cavern background
  rect(0, 150, 320, 50, '#2a1008');
  rect(0, 170, 320, 30, '#3a1810');
  // Lava pools
  rect(20, 175, 40, 15, '#cc4010');
  rect(30, 178, 20, 8, '#ff6020');
  rect(250, 180, 50, 10, '#cc4010');
  rect(260, 182, 30, 6, '#ff6020');

  // Massive dragon
  const x = 40, y = 30;
  // Body
  rect(x + 30, y + 50, 100, 50, '#6a1a0a');
  rect(x + 35, y + 55, 90, 40, '#7a2a1a');
  // Belly
  rect(x + 45, y + 70, 70, 25, '#8a4a2a');
  // Neck
  rect(x + 125, y + 30, 25, 35, '#6a1a0a');
  rect(x + 128, y + 35, 19, 25, '#7a2a1a');
  // Head
  rect(x + 140, y + 10, 50, 30, '#6a1a0a');
  rect(x + 145, y + 15, 40, 20, '#7a2a1a');
  // Snout
  rect(x + 185, y + 18, 25, 15, '#6a1a0a');
  // Eye
  rect(x + 155, y + 15, 10, 8, '#ff4000');
  rect(x + 158, y + 17, 4, 4, '#ffcc00');
  // Horns
  rect(x + 142, y + 2, 6, 12, '#4a1008');
  rect(x + 160, y, 6, 14, '#4a1008');
  rect(x + 175, y + 5, 5, 10, '#4a1008');
  // Teeth
  for (let i = 0; i < 5; i++) {
    rect(x + 186 + i * 5, y + 32, 3, 6, '#e0d0c0');
  }
  // Wings (massive)
  rect(x + 40, y + 10, 80, 6, '#5a1008');
  rect(x + 20, y, 30, 15, '#5a1008');
  rect(x + 100, y + 5, 30, 12, '#5a1008');
  rect(x + 10, y - 10, 15, 15, '#5a1008');
  // Wing membrane
  for (let i = 0; i < 8; i++) {
    rect(x + 25 + i * 10, y + 5 + i * 2, 8, 3, '#4a0808');
  }
  // Tail
  rect(x, y + 60, 35, 12, '#6a1a0a');
  rect(x - 20, y + 55, 25, 8, '#6a1a0a');
  rect(x - 35, y + 50, 18, 6, '#6a1a0a');
  // Tail spikes
  rect(x - 38, y + 46, 6, 6, '#4a1008');
  // Front legs
  rect(x + 50, y + 95, 14, 20, '#6a1a0a');
  rect(x + 100, y + 95, 14, 20, '#6a1a0a');
  // Claws
  rect(x + 47, y + 112, 20, 4, '#4a0808');
  rect(x + 97, y + 112, 20, 4, '#4a0808');
  // Fire breath
  rect(x + 205, y + 20, 20, 8, '#ff4020');
  rect(x + 220, y + 18, 15, 6, '#ff8040');
  rect(x + 230, y + 16, 10, 4, '#ffcc60');
  // Fire glow
  circle(x + 210, y + 24, 15, '#ff400020');
  // Scales pattern
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 3; j++) {
      rect(x + 40 + i * 11, y + 58 + j * 10, 6, 4, '#6a2a1a');
    }
  }
}

function drawLohikaarmeSpirit() {
  clear('#04020a');
  // Ethereal background
  for (let i = 0; i < 200; i++) {
    const r = 10 + Math.sin(i * 0.1) * 8;
    const g = 5 + Math.sin(i * 0.08) * 5;
    const b = 20 + Math.sin(i * 0.12) * 15;
    rect(0, i, 320, 1, `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`);
  }

  const x = 60, y = 20;
  // Spectral dragon form
  // Body outline (ghostly)
  rect(x + 30, y + 50, 100, 50, '#4020a040');
  rect(x + 35, y + 55, 90, 40, '#6040c050');
  // Spectral neck
  rect(x + 125, y + 30, 25, 35, '#5030b040');
  // Head
  rect(x + 140, y + 10, 50, 30, '#6040c050');
  rect(x + 185, y + 18, 25, 15, '#5030b040');
  // Spirit eyes
  rect(x + 155, y + 15, 10, 8, '#ff80ff');
  rect(x + 158, y + 17, 4, 4, '#ffffff');
  // Spirit fire
  rect(x + 205, y + 20, 15, 6, '#a040ff');
  rect(x + 215, y + 18, 10, 4, '#c080ff');
  rect(x + 222, y + 17, 6, 3, '#e0c0ff');
  // Wings (ethereal)
  rect(x + 40, y + 10, 80, 4, '#4020a030');
  rect(x + 20, y, 30, 12, '#4020a030');
  rect(x + 100, y + 5, 30, 10, '#4020a030');
  // Soul wisps around
  for (let i = 0; i < 8; i++) {
    const wx = x + Math.sin(i * 1.2) * 80 + 80;
    const wy = y + Math.cos(i * 1.5) * 40 + 50;
    circle(wx, wy, 3, '#a080ff30');
  }
  // Spectral glow
  circle(x + 100, y + 60, 50, '#6040a015');

  textCenter('Spirit Form', 180, '#a080ff', 7);
}

// ===================== SPECIAL SCENES =====================
function drawDeath() {
  clear('#0a0204');
  // Dark red scene
  rect(0, 0, 320, 200, '#0e0408');

  // Fallen hero
  const x = 120, y = 130;
  rect(x, y, 30, 10, '#6a4a3a'); // fallen body
  circle(x, y + 2, 6, '#d0b090');  // head on ground
  // Weapon dropped
  rect(x + 40, y + 3, 20, 2, '#8a8a9a');
  rect(x + 38, y + 1, 4, 6, '#6a4a2a');

  // Ghostly glow rising
  circle(x + 15, y - 20, 10, '#ffffff10');
  circle(x + 15, y - 30, 6, '#ffffff08');

  textCenter('You have fallen...', 50, '#aa3030', 10);
  textCenter('But death is not', 80, '#6a3030', 7);
  textCenter('the end.', 95, '#6a3030', 7);
}

function drawVictory() {
  clear('#0a0810');
  stars(20);

  // Golden sunrise
  for (let i = 0; i < 80; i++) {
    const r = 40 + i * 2;
    const g = 30 + i * 1.5;
    const b = 10 + i * 0.3;
    rect(0, 120 + i, 320, 1, `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`);
  }

  // Sun
  circle(160, 130, 30, '#ffcc40');
  circle(160, 130, 25, '#ffe060');

  // Silhouette of hero on hill
  rect(150, 100, 4, 20, '#1a1a2a'); // body
  circle(152, 96, 5, '#1a1a2a');    // head
  // Raised sword
  rect(158, 80, 2, 20, '#a0a0b0');
  rect(155, 78, 8, 3, '#8a6a3a');

  // Dragon corpse below
  rect(80, 150, 60, 15, '#3a1a0a40');

  textCenter('VICTORY!', 20, '#ffd700', 14);
  textCenter('The dragon is slain!', 45, '#e0c060', 8);
  textCenter('Helsinki is saved!', 60, '#c0a040', 7);
}

function drawCharacterCreate() {
  clear('#08080e');
  stars(10);

  // Three class silhouettes
  // Warrior
  rect(40, 70, 16, 35, '#8a6a4a');  // body
  circle(48, 63, 8, '#d0b090');     // head
  rect(58, 75, 3, 25, '#a0a0b0');   // sword
  rect(55, 73, 9, 3, '#8a6a3a');
  rect(32, 80, 12, 16, '#6a6a7a');  // shield
  text('Warrior', 24, 115, '#c0a080', 6);

  // Mage
  rect(142, 70, 16, 35, '#4a3a6a'); // robe
  circle(150, 63, 8, '#d0b090');
  rect(132, 60, 3, 45, '#6a4a2a');  // staff
  circle(133, 57, 4, '#60a0ff');    // orb
  circle(133, 57, 7, '#60a0ff20');
  text('Mage', 136, 115, '#8080c0', 6);

  // Rogue
  rect(244, 70, 16, 35, '#2a2a2a'); // dark clothes
  circle(252, 63, 8, '#d0b090');
  rect(264, 82, 12, 2, '#a0a0b0');  // dagger
  rect(262, 80, 3, 6, '#6a4a2a');
  // Hood
  rect(244, 55, 16, 10, '#2a2a2a');
  text('Rogue', 234, 115, '#80a080', 6);

  textCenter('Choose Your Path', 25, '#e0d0a0', 9);
  textCenter('Who enters Helsinki?', 42, '#8a8a9a', 6);
}

function drawTravelMap() {
  clear('#08080e');

  // Simple map of capital region
  // Sea
  rect(0, 0, 320, 200, '#0a1a2a');

  // Land masses (simplified)
  // Helsinki (south-center)
  rect(100, 120, 90, 60, '#1a3a1a');
  rect(110, 130, 70, 40, '#2a4a2a');
  circle(145, 150, 30, '#1a3a1a');

  // Espoo (west)
  rect(20, 80, 90, 80, '#1a3a1a');
  rect(30, 90, 70, 60, '#2a4a2a');

  // Vantaa (north)
  rect(120, 30, 100, 80, '#1a3a1a');
  rect(130, 40, 80, 60, '#2a4a2a');

  // Kauniainen (tiny, between Espoo and Helsinki)
  rect(85, 95, 25, 25, '#1a3a2a');
  rect(88, 98, 19, 19, '#2a4a3a');

  // Labels
  text('Helsinki', 112, 145, '#80c080', 6);
  text('Espoo', 42, 115, '#80c080', 6);
  text('Vantaa', 148, 60, '#80c080', 6);
  text('Kaun.', 80, 103, '#80c080', 5);

  // Roads connecting
  line(90, 140, 110, 140, '#4a4a3a', 1);
  line(145, 120, 155, 100, '#4a4a3a', 1);
  line(97, 107, 120, 120, '#4a4a3a', 1);

  textCenter('Capital Region', 5, '#a0a0c0', 7);
}

function drawStats() {
  clear('#0a0a14');
  rect(5, 5, 310, 190, '#12121e');
  rect(7, 7, 306, 186, '#0e0e18');
  textCenter('Character', 12, '#e0d0a0', 8);
  rect(40, 24, 240, 1, '#3a3a4a');
}

function drawNewsBoard() {
  clear('#1a1008');
  rect(40, 10, 240, 180, '#2a1a0a');
  rect(42, 12, 236, 176, '#3a2a1a');
  textCenter('News Board', 18, '#e0c080', 8);
  rect(80, 30, 160, 1, '#5a4a3a');
}

// ===================== EVENT SCENES =====================
function drawEventMushroom() {
  drawForestHelsinki();
  // Fairy ring of mushrooms
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const mx = 160 + Math.cos(angle) * 25;
    const my = 120 + Math.sin(angle) * 12;
    rect(mx - 2, my - 4, 4, 4, '#ff4040');
    rect(mx - 1, my - 5, 2, 2, '#ffffff');
    rect(mx - 1, my, 2, 4, '#e0e0c0');
  }
  // Glow in center
  circle(160, 120, 15, '#80ff8010');
  circle(160, 120, 8, '#80ff8015');
}

function drawEventWell() {
  drawForestHelsinki();
  // Old stone well
  rect(145, 100, 30, 25, '#5a5a5a');
  rect(143, 98, 34, 4, '#6a6a6a');
  rect(148, 102, 24, 3, '#1a1a3a'); // dark water inside
  // Roof
  rect(140, 78, 40, 4, '#4a3020');
  rect(155, 68, 2, 12, '#5a4a3a');
  rect(163, 68, 2, 12, '#5a4a3a');
  rect(148, 66, 24, 3, '#4a3020');
  // Glow from inside
  circle(160, 105, 8, '#40a0ff10');
}

function drawEventSauna() {
  drawForestHelsinki();
  // Wooden sauna building
  rect(120, 85, 60, 40, '#5a3a1a');
  rect(118, 83, 64, 4, '#6a4a2a');
  // Roof
  for (let i = 0; i < 10; i++) {
    rect(118 + i * 2, 75 + i, 64 - i * 4, 2, '#4a3020');
  }
  // Door
  rect(142, 100, 16, 25, '#3a2010');
  // Steam
  circle(150, 70, 5, '#ffffff20');
  circle(155, 62, 4, '#ffffff15');
  circle(148, 55, 3, '#ffffff10');
  // Window with warm glow
  rect(170, 95, 6, 6, '#ff802040');
}

function drawEventCrossroads() {
  drawForestHelsinki();
  // Two paths diverging
  rect(140, 100, 40, 100, '#2a2a20');
  rect(100, 120, 60, 40, '#2a2a20');
  rect(160, 120, 60, 40, '#2a2a20');
  // Signpost
  rect(158, 85, 4, 30, '#5a4a3a');
  rect(145, 85, 20, 6, '#4a3a2a');
  rect(155, 93, 20, 6, '#4a3a2a');
  // Question mark
  textCenter('?', 75, '#e0c060', 12);
}

function drawEventGeneric() {
  drawForestHelsinki();
  // A mysterious glow
  circle(160, 100, 20, '#a080ff15');
  circle(160, 100, 10, '#a080ff20');
}
/* ============================================================
   locations.js — Town location menus and logic
   ============================================================ */


// Each location returns { menuItems, onEnter(addMsg), artFn }
// addMsg(text, colorClass) adds text to the text panel

// ===================== TOWN HUB =====================
function getTownMenu(addMsg) {
  const region = getRegion(state.player.currentRegion);
  return [
    { key: '1', label: 'The Inn', action: 'goto_inn' },
    { key: '2', label: 'Weapon Shop', action: 'goto_shop' },
    { key: '3', label: 'Healer', action: 'goto_healer' },
    { key: '4', label: "Dark Cloak's Tavern", action: 'goto_tavern' },
    { key: '5', label: 'Quest Board', action: 'goto_quests' },
    { key: '6', label: 'Enter the Forest', action: 'goto_forest' },
    { key: '7', label: 'Travel', action: 'goto_travel' },
    { key: '8', label: 'Character Stats', action: 'goto_stats' },
    { key: '9', label: 'Bestiary', action: 'goto_bestiary' },
  ];
}

function enterTown(addMsg) {
  const region = getRegion(state.player.currentRegion);
  addMsg(`Welcome to ${region.name} — ${region.subtitle}`, 'narrator');
  addMsg(region.description, 'system');

  // Check for completed quests
  const completed = checkQuestCompletion();
  for (const quest of completed) {
    addMsg(`Quest complete: "${quest.title}"!`, 'quest');
    const template = completeQuest(quest.id);
    if (template.rewards.gold) addMsg(`+${template.rewards.gold} gold`, 'gold');
    if (template.rewards.xp) {
      addMsg(`+${template.rewards.xp} XP`, 'xp');
      if (checkLevelUp()) {
        addMsg(`*** LEVEL UP! You are now level ${state.player.level}! ***`, 'levelup');
      }
    }
    if (template.rewards.itemId) {
      addInventoryItem(template.rewards.itemId);
      const item = getItemById(template.rewards.itemId);
      addMsg(`Received: ${item ? item.name : template.rewards.itemId}`, 'event');
    }
    if (template.rewards.weaponId) {
      const weapon = WEAPONS[template.rewards.weaponId];
      if (weapon) {
        state.player.weapon = { ...weapon };
        addMsg(`Forged the ${weapon.name}! (ATK +${weapon.attackBonus})`, 'levelup');
      }
    }
  }

  // AI player news
  const aiHere = getAiPlayersInRegion(state.player.currentRegion);
  if (aiHere.length > 0) {
    const ai = aiHere[Math.floor(Math.random() * aiHere.length)];
    addMsg(`You notice ${ai.name} nearby. ${ai.lastAction}.`, 'system');
  }
}

// ===================== INN =====================
function getInnMenu(addMsg) {
  const cost = getInnCost(state.player.currentRegion, state.player.level);
  return [
    { key: '1', label: `Rest & Heal (${cost}g)`, action: 'inn_rest' },
    { key: '2', label: 'News Board', action: 'inn_news' },
    { key: '3', label: 'Save Game', action: 'inn_save' },
    { key: '4', label: 'Back to Town', action: 'goto_town' },
  ];
}

function innRest(addMsg) {
  const cost = getInnCost(state.player.currentRegion, state.player.level);
  if (state.player.gold < cost) {
    addMsg("You can't afford a room. The innkeeper shrugs apologetically.", 'system');
    return false;
  }
  state.player.gold -= cost;
  state.player.hp = state.player.maxHp;
  state.player.mp = state.player.maxMp;
  state.player.poisoned = false;
  state.player.poisonTurns = 0;
  advanceDay();
  addMsg(`You rest at the inn. (-${cost}g) HP and MP fully restored.`, 'heal');
  addMsg(`Day ${state.dayCount} dawns.`, 'narrator');

  // Show a news snippet
  if (state.newsBoard.length > 0) {
    addMsg(`News: ${state.newsBoard[0]}`, 'npc');
  }
  return true;
}

function innNews(addMsg) {
  addMsg('=== News Board ===', 'title');
  if (state.newsBoard.length === 0) {
    addMsg('No news today.', 'system');
  } else {
    for (let i = 0; i < Math.min(8, state.newsBoard.length); i++) {
      addMsg(`  ${state.newsBoard[i]}`, 'npc');
    }
  }
}

function innSave(addMsg) {
  saveGame();
  addMsg('Game saved.', 'system');
}

// ===================== SHOP =====================
function getShopMenu(addMsg) {
  return [
    { key: '1', label: 'Buy Weapons', action: 'shop_weapons' },
    { key: '2', label: 'Buy Armor', action: 'shop_armor' },
    { key: '3', label: 'Buy Accessories', action: 'shop_accessories' },
    { key: '4', label: 'Buy Potions', action: 'shop_potions' },
    { key: '5', label: 'Sell Equipment', action: 'shop_sell' },
    { key: '6', label: 'Back to Town', action: 'goto_town' },
  ];
}

function getShopBuyMenu(type, addMsg) {
  let items = [];
  switch (type) {
    case 'weapons': items = getShopWeapons(state.player.currentRegion); break;
    case 'armor': items = getShopArmors(state.player.currentRegion); break;
    case 'accessories': items = getShopAccessories(state.player.currentRegion); break;
    case 'potions': items = getShopConsumables(); break;
  }

  const menuItems = items.map((item, i) => {
    const bonus = item.attackBonus ? `ATK+${item.attackBonus}` :
                  item.defenseBonus ? `DEF+${item.defenseBonus}` :
                  item.desc || '';
    const equipped = (state.player.weapon?.id === item.id || state.player.armor?.id === item.id || state.player.accessory?.id === item.id);
    return {
      key: String(i + 1),
      label: `${item.name} (${item.price}g) ${bonus}${equipped ? ' [EQUIPPED]' : ''}`,
      action: 'buy_item',
      data: { item, type },
      disabled: state.player.gold < item.price,
    };
  });

  menuItems.push({ key: String(menuItems.length + 1), label: 'Back', action: 'goto_shop' });
  return menuItems;
}

function buyItem(item, type, addMsg) {
  if (state.player.gold < item.price) {
    addMsg('Not enough gold!', 'system');
    return false;
  }
  state.player.gold -= item.price;

  if (type === 'weapons') {
    addMsg(`Sold your ${state.player.weapon.name}. Bought ${item.name}!`, 'gold');
    state.player.gold += Math.floor((state.player.weapon.price || 0) * 0.5);
    state.player.weapon = { ...item };
  } else if (type === 'armor') {
    addMsg(`Sold your ${state.player.armor.name}. Bought ${item.name}!`, 'gold');
    state.player.gold += Math.floor((state.player.armor.price || 0) * 0.5);
    state.player.armor = { ...item };
  } else if (type === 'accessories') {
    if (state.player.accessory) {
      addMsg(`Sold your ${state.player.accessory.name}. Bought ${item.name}!`, 'gold');
      state.player.gold += Math.floor((state.player.accessory.price || 0) * 0.5);
    } else {
      addMsg(`Bought ${item.name}!`, 'gold');
    }
    state.player.accessory = { ...item };
  } else if (type === 'potions') {
    addInventoryItem(item.id);
    addMsg(`Bought ${item.name}!`, 'gold');
  }

  return true;
}

function getShopSellMenu(addMsg) {
  const sellable = state.player.inventory
    .filter(inv => {
      const item = getItemById(inv.id);
      return item && item.price > 0 && item.type !== 'quest';
    })
    .map((inv, i) => {
      const item = getItemById(inv.id);
      const sellPrice = Math.floor(item.price * 0.5);
      return {
        key: String(i + 1),
        label: `${item.name} x${inv.quantity} (${sellPrice}g each)`,
        action: 'sell_item',
        data: { itemId: inv.id, sellPrice },
      };
    });

  sellable.push({ key: String(sellable.length + 1), label: 'Back', action: 'goto_shop' });
  return sellable;
}

function sellItem(itemId, addMsg) {
  const item = getItemById(itemId);
  if (!item) return;
  const sellPrice = Math.floor(item.price * 0.5);
  removeInventoryItem(itemId);
  state.player.gold += sellPrice;
  addMsg(`Sold ${item.name} for ${sellPrice}g.`, 'gold');
}

// ===================== HEALER =====================
function getHealerMenu(addMsg) {
  const cost = getHealCost(state.player.currentRegion, state.player.level);
  const p = state.player;
  const hpMissing = p.maxHp - p.hp;
  return [
    { key: '1', label: `Heal Wounds (${cost}g)`, action: 'healer_heal', disabled: hpMissing === 0 },
    { key: '2', label: 'Cure Poison (10g)', action: 'healer_cure', disabled: !p.poisoned },
    { key: '3', label: 'Back to Town', action: 'goto_town' },
  ];
}

function healerHeal(addMsg) {
  const cost = getHealCost(state.player.currentRegion, state.player.level);
  if (state.player.gold < cost) {
    addMsg("You can't afford healing. The healer looks sympathetic.", 'system');
    return;
  }
  if (state.player.hp >= state.player.maxHp) {
    addMsg("You're already at full health.", 'system');
    return;
  }
  state.player.gold -= cost;
  const healed = state.player.maxHp - state.player.hp;
  state.player.hp = state.player.maxHp;
  addMsg(`The healer's herbs restore ${healed} HP. (-${cost}g)`, 'heal');
}

function healerCure(addMsg) {
  if (state.player.gold < 10) {
    addMsg("You can't afford the antidote.", 'system');
    return;
  }
  if (!state.player.poisoned) {
    addMsg("You're not poisoned.", 'system');
    return;
  }
  state.player.gold -= 10;
  state.player.poisoned = false;
  state.player.poisonTurns = 0;
  addMsg('The poison is drawn from your body. (-10g)', 'heal');
}

// ===================== TAVERN =====================
function getTavernMenu(addMsg) {
  const npc = getTavernNpc(state.player.currentRegion);
  const aiHere = getAiPlayersInRegion(state.player.currentRegion);

  const items = [];
  if (npc) {
    items.push({ key: String(items.length + 1), label: `Talk to ${npc.name} (${npc.title})`, action: 'tavern_charm' });
  }
  for (const ai of aiHere) {
    items.push({ key: String(items.length + 1), label: `Talk to ${ai.name}`, action: 'tavern_ai', data: ai });
  }
  // Ilmari crafting — available if he's alive and in this region
  const ilmari = state.aiPlayers.find(a => a.name === 'Ilmari' && a.alive && a.region === state.player.currentRegion);
  if (ilmari) {
    items.push({ key: String(items.length + 1), label: 'Craft with Ilmari', action: 'goto_crafting' });
  }
  items.push({ key: String(items.length + 1), label: 'Dice Game (20g)', action: 'tavern_dice_start', disabled: state.player.gold < 20 });
  items.push({ key: String(items.length + 1), label: 'Back to Town', action: 'goto_town' });
  return items;
}

function getCharmDialogueMenu(addMsg) {
  const npc = getTavernNpc(state.player.currentRegion);
  if (!npc) return [];

  addMsg(npc.greeting, 'narrator');

  return npc.dialogueOptions.map((opt, i) => ({
    key: String(i + 1),
    label: opt.text,
    action: 'charm_choice',
    data: { npcId: npc.id, optionIndex: i },
  })).concat([
    { key: String(npc.dialogueOptions.length + 1), label: 'Leave', action: 'goto_tavern' }
  ]);
}

function handleCharmChoice(npcId, optionIndex, addMsg) {
  const npc = getTavernNpc(state.player.currentRegion);
  if (!npc || npc.id !== npcId) return;

  const option = npc.dialogueOptions[optionIndex];
  if (!option) return;

  const response = option.responses[Math.floor(Math.random() * option.responses.length)];
  addMsg(response, 'npc');

  addCharm(npcId, option.charm);
  const charmLevel = getCharmLevel(npcId);
  addMsg(`(Charm with ${npc.name}: ${charmLevel})`, 'system');

  const rewards = checkCharmReward(npcId);
  if (rewards) {
    for (const reward of rewards) {
      addMsg(reward.message, 'event');
      if (reward.type === 'accessory') {
        const acc = ACCESSORIES[reward.itemId];
        if (acc) {
          state.player.accessory = { ...acc };
          addMsg(`Equipped: ${acc.name} (${acc.desc})`, 'levelup');
        }
      }
    }
  }
}

function tavarnAiTalk(aiPlayer, addMsg) {
  const dialogue = getAiTavernDialogue(aiPlayer);
  addMsg(`${aiPlayer.name}: ${dialogue}`, 'npc');
}

function tavernGamble(addMsg) {
  // Legacy fallback — dice game is now used instead
  addMsg('The dice table awaits...', 'npc');
}

// ===================== QUEST BOARD =====================
function getQuestBoardMenu(addMsg) {
  const active = getActiveQuests();
  const available = getAvailableQuests(state.player.currentRegion);

  const items = [];

  // Show active quests
  if (active.length > 0) {
    addMsg('=== Active Quests ===', 'title');
    for (const q of active) {
      if (q.template) {
        addMsg(`  ${q.template.title}: ${q.progress}/${q.required}`, 'quest');
      }
    }
  }

  // Available quests to accept
  if (available.length > 0) {
    addMsg('=== Available Quests ===', 'title');
    for (const q of available) {
      items.push({
        key: String(items.length + 1),
        label: `${q.title} — ${q.description.substring(0, 40)}...`,
        action: 'accept_quest',
        data: q.id,
      });
    }
  }

  if (items.length === 0 && active.length === 0) {
    addMsg('No quests available right now.', 'system');
  }

  items.push({ key: String(items.length + 1), label: 'Back to Town', action: 'goto_town' });
  return items;
}

function handleAcceptQuest(questId, addMsg) {
  const template = getQuestTemplate(questId);
  if (!template) return;

  acceptQuest(questId);
  addMsg(`Accepted quest: "${template.title}"`, 'quest');
  addMsg(template.description, 'narrator');
  if (template.type === 'kill') {
    addMsg(`Objective: Defeat ${template.required} ${template.target.replace(/_/g, ' ')}`, 'system');
  }
  if (template.rewards.gold) addMsg(`Reward: ${template.rewards.gold} gold`, 'gold');
  if (template.rewards.xp) addMsg(`Reward: ${template.rewards.xp} XP`, 'xp');
}

// ===================== TRAVEL =====================
function getTravelMenu(addMsg) {
  const regions = getUnlockedRegions(state.player.level);
  const items = regions
    .filter(r => r.id !== state.player.currentRegion)
    .map((r, i) => ({
      key: String(i + 1),
      label: `${r.name} — ${r.subtitle} (Lv.${r.levelRange[0]}-${r.levelRange[1]})`,
      action: 'travel_to',
      data: r.id,
    }));

  // Show locked regions
  const allRegions = ['helsinki', 'espoo', 'vantaa', 'kauniainen'];
  for (const rId of allRegions) {
    if (!regions.find(r => r.id === rId)) {
      const r = getRegion(rId);
      items.push({
        key: '-',
        label: `${r.name} — Locked (Lv.${r.unlockLevel} required)`,
        action: 'none',
        disabled: true,
      });
    }
  }

  items.push({ key: String(items.length + 1), label: 'Back to Town', action: 'goto_town' });
  return items;
}

function travelTo(regionId, addMsg) {
  state.player.currentRegion = regionId;
  // Reset map position to town for new region
  initMapState();
  const ms = state.mapState[regionId];
  if (ms) { ms.playerX = TOWN_POS.x; ms.playerY = TOWN_POS.y; }
  const region = getRegion(regionId);
  addMsg(`You travel to ${region.name}...`, 'narrator');
}

// ===================== STATS =====================
function showStats(addMsg) {
  const p = state.player;
  addMsg('=== Character Stats ===', 'title');
  addMsg(`${p.name} — Level ${p.level} ${p.class}`, 'narrator');
  addMsg(`HP: ${p.hp}/${p.maxHp}  MP: ${p.mp}/${p.maxMp}`, 'system');
  addMsg(`STR: ${p.strength}  DEF: ${p.defense}  MAG: ${p.magic}  SPD: ${p.speed}`, 'system');
  addMsg(`XP: ${p.xp}/${p.xpToNext === Infinity ? 'MAX' : p.xpToNext}  Gold: ${p.gold}`, 'xp');
  addMsg(`Weapon: ${p.weapon.name} (ATK+${p.weapon.attackBonus})`, 'narrator');
  addMsg(`Armor: ${p.armor.name} (DEF+${p.armor.defenseBonus})`, 'narrator');
  if (p.accessory) {
    addMsg(`Accessory: ${p.accessory.name} (${p.accessory.desc})`, 'narrator');
  }
  addMsg(`Kills: ${p.kills}  Deaths: ${p.deaths}  Day: ${state.dayCount}`, 'system');

  // Inventory
  if (p.inventory.length > 0) {
    addMsg('--- Inventory ---', 'subtitle');
    for (const inv of p.inventory) {
      const item = getItemById(inv.id);
      addMsg(`  ${item ? item.name : inv.id} x${inv.quantity}`, 'system');
    }
  }

  // Active quests
  const active = getActiveQuests();
  if (active.length > 0) {
    addMsg('--- Active Quests ---', 'subtitle');
    for (const q of active) {
      if (q.template) {
        addMsg(`  ${q.template.title}: ${q.progress}/${q.required}`, 'quest');
      }
    }
  }
}

function getStatsMenu() {
  const items = [];

  // Use item from inventory
  const usable = state.player.inventory.filter(inv => {
    const c = CONSUMABLES[inv.id];
    return c && c.type !== 'quest' && c.type !== 'escape';
  });

  if (usable.length > 0) {
    items.push({ key: '1', label: 'Use Item', action: 'stats_use_item' });
  }

  items.push({ key: String(items.length + 1), label: 'Back to Town', action: 'goto_town' });
  return items;
}

function getStatsItemMenu() {
  const usable = state.player.inventory
    .filter(inv => {
      const c = CONSUMABLES[inv.id];
      return c && c.type !== 'quest' && c.type !== 'escape';
    })
    .map((inv, i) => {
      const c = CONSUMABLES[inv.id];
      return {
        key: String(i + 1),
        label: `${c.name} x${inv.quantity} — ${c.desc}`,
        action: 'use_stat_item',
        data: inv.id,
      };
    });
  usable.push({ key: String(usable.length + 1), label: 'Back', action: 'goto_stats' });
  return usable;
}

function useStatItem(itemId, addMsg) {
  if (!hasItem(itemId)) return;
  const result = useConsumable(state.player, itemId);
  if (result && result !== 'ESCAPE') {
    removeInventoryItem(itemId);
    addMsg(result, 'heal');
  }
}
/* ============================================================
   main.js — Game entry point, screen state machine, input
   ============================================================ */


// DOM elements
const textContent = document.getElementById('textContent');
const menuPanel = document.getElementById('menuPanel');
const statusBar = {
  name: document.getElementById('statName'),
  level: document.getElementById('statLevel'),
  hp: document.getElementById('statHp'),
  mp: document.getElementById('statMp'),
  gold: document.getElementById('statGold'),
  region: document.getElementById('statRegion'),
};
const nameInputWrap = document.getElementById('nameInputWrap');
const nameInput = document.getElementById('nameInput');
const nameSubmit = document.getElementById('nameSubmit');

let currentMenu = [];
let subState = null;  // For nested menus (shop type, spell select, etc.)

// ===================== TEXT PANEL =====================
function clearText() {
  textContent.innerHTML = '';
}

function addMsg(text, colorClass = 'narrator') {
  const span = document.createElement('span');
  span.className = `txt-${colorClass}`;
  span.textContent = text;
  textContent.appendChild(span);
  textContent.appendChild(document.createElement('br'));
  // Auto-scroll
  const panel = document.getElementById('textPanel');
  panel.scrollTop = panel.scrollHeight;
}

// ===================== MENU =====================
function setMenu(items) {
  currentMenu = items;
  menuPanel.innerHTML = '';
  for (const item of items) {
    const btn = document.createElement('button');
    btn.className = 'menu-item' + (item.disabled ? ' disabled' : '');
    btn.innerHTML = `<span class="menu-key">[${item.key}]</span> ${item.label}`;
    if (!item.disabled) {
      btn.addEventListener('click', () => handleMenuAction(item));
    }
    menuPanel.appendChild(btn);
  }
}

// ===================== STATUS BAR =====================
function updateStatus() {
  const p = state.player;
  if (!p) {
    statusBar.name.textContent = '-';
    statusBar.level.textContent = '';
    statusBar.hp.textContent = '';
    statusBar.mp.textContent = '';
    statusBar.gold.textContent = '';
    statusBar.region.textContent = '';
    return;
  }
  statusBar.name.textContent = p.name;
  statusBar.level.textContent = `Lv.${p.level}`;
  statusBar.hp.textContent = `HP:${p.hp}/${p.maxHp}`;
  statusBar.mp.textContent = `MP:${p.mp}/${p.maxMp}`;
  statusBar.gold.textContent = `${p.gold}g`;
  const region = getRegion(p.currentRegion);
  const timeIcon = { dawn: '🌅', day: '☀️', dusk: '🌆', night: '🌙' };
  statusBar.region.textContent = `${region.name} ${timeIcon[getTimeOfDay()] || ''}`;
}

// ===================== SCREEN RENDERING =====================
function renderScreen() {
  switch (state.screen) {
    case 'title': drawTitle(); break;
    case 'character-create': drawCharacterCreate(); break;
    case 'town': drawTownArt(); break;
    case 'inn': drawInn(); break;
    case 'shop': drawShop(); break;
    case 'healer': drawHealer(); break;
    case 'tavern': drawTavern(); break;
    case 'quest-board': drawQuestBoard(); break;
    case 'forest': drawForestArt(); break;
    case 'combat': drawCombatArt(); break;
    case 'event': drawEventArt(); break;
    case 'stats': drawStats(); break;
    case 'travel': drawTravelMap(); break;
    case 'death': drawDeath(); break;
    case 'victory': drawVictory(); break;
    case 'news': drawNewsBoard(); break;
    case 'map': drawMapScreen(); break;
    case 'bestiary': drawBestiaryScreen(state.bestiaryViewId); break;
  }
  // Apply day/night tint overlay to gameplay screens
  const tintScreens = ['town','inn','shop','healer','tavern','forest','combat','event'];
  if (state.player && tintScreens.includes(state.screen)) {
    applyTimeOverlay();
  }
  updateStatus();
}

function drawTownArt() {
  switch (state.player.currentRegion) {
    case 'helsinki': drawTownHelsinki(); break;
    case 'espoo': drawTownEspoo(); break;
    case 'vantaa': drawTownVantaa(); break;
    case 'kauniainen': drawTownKauniainen(); break;
  }
}

function drawForestArt() {
  switch (state.player.currentRegion) {
    case 'helsinki': drawForestHelsinki(); break;
    case 'espoo': drawForestEspoo(); break;
    case 'vantaa': drawForestVantaa(); break;
    case 'kauniainen': drawForestKauniainen(); break;
  }
}

function drawCombatArt() {
  if (state.combatState?.monster) {
    drawMonster(state.combatState.monster.art, state.combatState.monster.region);
  }
}

function drawEventArt() {
  if (state.eventState?.event?.art) {
    const artFn = window[state.eventState.event.art];
    if (artFn) artFn();
    else drawEventGeneric();
  } else {
    drawEventGeneric();
  }
}

// ===================== STATE TRANSITIONS =====================
function goToScreen(screen) {
  state.screen = screen;
  clearText();
  subState = null;
  nameInputWrap.style.display = 'none';
  startMusicForScreen(screen);

  switch (screen) {
    case 'title': {
      renderScreen();
      addMsg('LEGEND OF HELSINKI', 'title');
      addMsg('A fantasy of the Capital Region', 'subtitle');
      addMsg('', 'narrator');
      const titleMenu = [{ key: '1', label: 'New Game', action: 'new_game' }];
      if (hasSave()) {
        titleMenu.push({ key: '2', label: 'Continue', action: 'continue_game' });
      }
      setMenu(titleMenu);
      break;
    }

    case 'character-create':
      renderScreen();
      addMsg('Create your character.', 'narrator');
      addMsg('', 'narrator');
      setMenu([
        { key: '1', label: 'Warrior — Strong, tough, hits hard', action: 'class_warrior' },
        { key: '2', label: 'Mage — Powerful magic, fragile body', action: 'class_mage' },
        { key: '3', label: 'Rogue — Fast, sneaky, deadly crits', action: 'class_rogue' },
      ]);
      break;

    case 'town':
      renderScreen();
      enterTown(addMsg);
      setMenu(getTownMenu(addMsg));
      break;

    case 'inn':
      renderScreen();
      addMsg('The innkeeper nods a greeting.', 'npc');
      setMenu(getInnMenu(addMsg));
      break;

    case 'shop':
      renderScreen();
      addMsg('The shopkeeper eyes your purse.', 'npc');
      addMsg('"What can I get you today?"', 'npc');
      setMenu(getShopMenu(addMsg));
      break;

    case 'healer':
      renderScreen();
      addMsg('The healer looks you over with practiced eyes.', 'npc');
      setMenu(getHealerMenu(addMsg));
      break;

    case 'tavern':
      renderScreen();
      addMsg('The tavern is dimly lit, full of murmurs and the smell of mead.', 'narrator');
      setMenu(getTavernMenu(addMsg));
      break;

    case 'quest-board':
      renderScreen();
      setMenu(getQuestBoardMenu(addMsg));
      break;

    case 'forest': {
      initMapState();
      renderScreen();
      const forestRegion = getRegion(state.player.currentRegion);
      const timeDesc = { dawn: 'The early light filters through the trees.', day: 'Sunlight dapples the forest floor.', dusk: 'Long shadows stretch between the trees.', night: 'Darkness cloaks the wilderness. Strange sounds echo.' };
      const pos = getPlayerMapPos();
      const landmark = getLandmarkAt(state.player.currentRegion, pos.x, pos.y);
      const dist = distanceFromTown();

      if (isAtTown()) {
        addMsg(`You stand at the edge of the ${forestRegion.name} wilderness.`, 'narrator');
      } else if (landmark) {
        addMsg(`${landmark.name}`, 'title');
        addMsg(landmark.desc, 'narrator');
      } else {
        addMsg(`Deep in the ${forestRegion.name} forest. (${dist} steps from town)`, 'narrator');
      }
      addMsg(timeDesc[getTimeOfDay()], 'system');
      addMsg('WASD/Arrows to move, M for map', 'subtitle');
      setMenu(getForestMenu());
      break;
    }

    case 'combat':
      renderScreen();
      showCombatState();
      break;

    case 'event':
      renderScreen();
      showEventState();
      break;

    case 'stats':
      renderScreen();
      showStats(addMsg);
      setMenu(getStatsMenu());
      break;

    case 'travel':
      renderScreen();
      addMsg('Where would you like to travel?', 'narrator');
      setMenu(getTravelMenu(addMsg));
      break;

    case 'death':
      renderScreen();
      addMsg('You have fallen in battle.', 'damage');
      addMsg('But this is not the end...', 'narrator');
      state.player.hp = Math.floor(state.player.maxHp * 0.5);
      state.player.mp = Math.floor(state.player.maxMp * 0.5);
      state.player.poisoned = false;
      state.player.poisonTurns = 0;
      setMenu([
        { key: '1', label: 'Wake up at the Inn', action: 'goto_town' },
      ]);
      break;

    case 'victory': {
      renderScreen();
      const ngCount = state.ngPlusCount || 0;
      addMsg('*** VICTORY ***', 'levelup');
      addMsg('You have slain the great Lohikaarme!', 'narrator');
      if (ngCount > 0) {
        addMsg(`New Game+ ${ngCount} completed! The dragon was ${Math.round(getNgPlusScale() * 100)}% stronger!`, 'event');
      }
      addMsg('Helsinki and the Capital Region are saved!', 'narrator');
      addMsg('Your legend will be told for generations.', 'narrator');
      addMsg('', 'narrator');
      addMsg(`Final Stats: Level ${state.player.level}, ${state.player.kills} kills, ${state.player.deaths} deaths, Day ${state.dayCount}`, 'system');
      addMsg(`Bestiary: ${Object.keys(state.bestiary).length} species discovered`, 'system');
      setMenu([
        { key: '1', label: 'New Game+  (harder, keep gear)', action: 'new_game_plus' },
        { key: '2', label: 'New Game (fresh start)', action: 'new_game' },
      ]);
      break;
    }

    case 'news':
      renderScreen();
      innNews(addMsg);
      setMenu([
        { key: '1', label: 'Back', action: 'goto_inn' },
      ]);
      break;

    case 'map':
      renderScreen();
      addMsg('Your map of the region.', 'narrator');
      setMenu([
        { key: '1', label: 'Back', action: 'goto_forest' },
      ]);
      break;

    case 'bestiary': {
      state.bestiaryViewId = null;
      renderScreen();
      const entries = getBestiaryEntries();
      if (entries.length === 0) {
        addMsg('No monsters encountered yet. Explore the forest!', 'system');
        setMenu([{ key: '1', label: 'Back', action: 'goto_town' }]);
      } else {
        addMsg(`=== Monster Bestiary (${entries.length} discovered) ===`, 'title');
        const bItems = entries.map((m, i) => ({
          key: String(i + 1),
          label: `${m.name} — ${m.killed} slain`,
          action: 'bestiary_view',
          data: m.id,
        }));
        bItems.push({ key: String(bItems.length + 1), label: 'Back', action: 'goto_town' });
        setMenu(bItems);
      }
      break;
    }
  }
}

// ===================== COMBAT STATE =====================
function showCombatState() {
  const cs = state.combatState;
  if (!cs) return;

  // Show combat log
  for (const entry of cs.log) {
    addMsg(entry.text, entry.color);
  }
  cs.log = [];

  // HP bars
  const m = cs.monster;
  const p = state.player;
  addMsg(`${m.name}: ${Math.max(0, m.hp)}/${m.maxHp} HP`, 'combat');
  addMsg(`${p.name}: ${Math.max(0, p.hp)}/${p.maxHp} HP  ${p.mp}/${p.maxMp} MP`, 'narrator');

  if (cs.result === 'victory') {
    setMenu([{ key: '1', label: 'Continue', action: 'combat_end_victory' }]);
  } else if (cs.result === 'defeat') {
    setMenu([{ key: '1', label: 'Continue', action: 'combat_end_defeat' }]);
  } else if (cs.result === 'fled') {
    setMenu([{ key: '1', label: 'Continue', action: 'combat_end_fled' }]);
  } else {
    setMenu(getCombatMenuItems());
  }
}

// ===================== EVENT STATE =====================
function showEventState() {
  const es = state.eventState;
  if (!es) return;

  addMsg(es.event.text, 'event');
  const items = es.event.choices.map((choice, i) => ({
    key: String(i + 1),
    label: choice.text,
    action: 'event_choice',
    data: i,
  }));
  setMenu(items);
}

// ===================== FOREST EXPLORATION (MAP-BASED) =====================
function getForestMenu() {
  const pos = getPlayerMapPos();
  const items = [];
  // Directional movement
  if (pos.y > 0) items.push({ key: '1', label: 'Go North', action: 'map_move', data: { dx: 0, dy: -1 } });
  if (pos.y < MAP_SIZE - 1) items.push({ key: '2', label: 'Go South', action: 'map_move', data: { dx: 0, dy: 1 } });
  if (pos.x > 0) items.push({ key: '3', label: 'Go West', action: 'map_move', data: { dx: -1, dy: 0 } });
  if (pos.x < MAP_SIZE - 1) items.push({ key: '4', label: 'Go East', action: 'map_move', data: { dx: 1, dy: 0 } });
  items.push({ key: '5', label: 'View Map', action: 'view_map' });
  if (isAtTown()) {
    items.push({ key: '6', label: 'Enter Town', action: 'goto_town' });
  }
  // Dragon fight at Dragon's Mound in Kauniainen
  const landmark = getLandmarkAt(state.player.currentRegion, pos.x, pos.y);
  if (landmark && landmark.name === "Dragon's Mound" && canFightDragon()) {
    items.push({ key: '7', label: '*** Challenge the Dragon ***', action: 'forest_dragon' });
  }
  return items;
}

function handleMapMove(dx, dy) {
  const region = state.player.currentRegion;
  const level = state.player.level;

  if (!movePlayer(dx, dy)) {
    addMsg("You can't go that way.", 'system');
    return;
  }

  // Advance time
  const oldTime = getTimeOfDay();
  advanceTime(1);
  const newTime = getTimeOfDay();
  if (oldTime !== newTime) {
    addMsg(`The ${TIME_NAMES[newTime].toLowerCase()} settles over the land...`, 'system');
    if (newTime === 'night') addMsg('Strange creatures stir in the darkness.', 'event');
    if (newTime === 'dawn') addMsg('The first light brings relief.', 'narrator');
  }

  // Check for landmark
  const pos = getPlayerMapPos();
  const landmark = getLandmarkAt(region, pos.x, pos.y);

  if (landmark && landmark.type === 'town') {
    addMsg('You arrive back at town.', 'narrator');
    goToScreen('forest');
    return;
  }

  if (landmark && landmark.type === 'landmark') {
    sfxEvent();
    addMsg(`You discover: ${landmark.name}`, 'title');
    addMsg(landmark.desc, 'event');
    // Landmark interaction
    const changedScreen = handleLandmarkInteraction(landmark, addMsg);
    if (changedScreen) return; // Combat was triggered
    updateStatus();
    goToScreen('forest');
    return;
  }

  // Encounter chances — higher farther from town
  const dist = distanceFromTown();
  const encounterBonus = Math.min(0.15, dist * 0.02);
  const roll = Math.random();

  if (roll < 0.40 + encounterBonus) {
    // Monster encounter
    startCombat();
    goToScreen('combat');
  } else if (roll < 0.60 + encounterBonus) {
    // Random event
    const event = getRandomEvent(region, level);
    if (event) {
      state.eventState = { event };
      goToScreen('event');
    } else {
      if (!landmark) addMsg(getFlavorText(region), 'narrator');
      goToScreen('forest');
    }
  } else if (roll < 0.85) {
    // Flavor text
    if (!landmark) addMsg(getFlavorText(region), 'narrator');
    goToScreen('forest');
  } else {
    // Find gold/item
    const goldFound = Math.floor(5 + Math.random() * (10 * level));
    state.player.gold += goldFound;
    addMsg(`You find ${goldFound} gold scattered on the ground!`, 'gold');
    sfxGold();
    if (Math.random() < 0.3) {
      const potionId = level < 4 ? 'potion_small' : level < 8 ? 'potion_medium' : 'potion_large';
      addInventoryItem(potionId);
      addMsg(`Found: ${CONSUMABLES[potionId].name}!`, 'event');
    }
    goToScreen('forest');
  }
}

// Legacy wrapper for combat_end redirects
function exploreForest() {
  goToScreen('forest');
}

// ===================== DRAGON BOSS CHECK =====================
function canFightDragon() {
  return state.player.level >= 12 &&
    hasItem('sampo_fragment_1') > 0 &&
    hasItem('sampo_fragment_2') > 0 &&
    hasItem('sampo_fragment_3') > 0 &&
    hasItem('sampo_fragment_4') > 0 &&
    state.player.currentRegion === 'kauniainen';
}

// ===================== INPUT HANDLING =====================
function handleMenuAction(item) {
  if (item.disabled || animating) return;
  initAudio();
  const action = item.action;

  // Play menu sound for navigation actions
  const navActions = ['goto_town','goto_inn','goto_shop','goto_healer','goto_tavern','goto_quests','goto_forest','goto_travel','goto_stats','new_game','continue_game','back'];
  const backActions = ['goto_town','goto_shop','goto_tavern','back'];
  if (backActions.includes(action)) sfxMenuBack();
  else if (navActions.includes(action)) sfxMenuSelect();

  switch (action) {
    // Title
    case 'new_game':
      goToScreen('character-create');
      break;
    case 'new_game_plus':
      startNewGamePlus();
      clearText();
      addMsg(`*** NEW GAME+ ${state.ngPlusCount} ***`, 'levelup');
      addMsg(`Monsters are ${Math.round(getNgPlusScale() * 100)}% stronger!`, 'event');
      addMsg('You keep your weapon, armor, accessory, bestiary, and half your gold.', 'narrator');
      setTimeout(() => goToScreen('town'), 1000);
      break;
    case 'continue_game':
      if (loadGame()) {
        goToScreen('town');
      } else {
        addMsg('Failed to load save.', 'system');
      }
      break;

    // Character creation
    case 'class_warrior':
    case 'class_mage':
    case 'class_rogue':
      subState = { selectedClass: action.replace('class_', '') };
      clearText();
      renderScreen();
      addMsg(`You have chosen the path of the ${subState.selectedClass}.`, 'narrator');
      addMsg('What is your name, adventurer?', 'npc');
      nameInputWrap.style.display = 'flex';
      menuPanel.innerHTML = '';
      nameInput.value = '';
      nameInput.focus();
      break;

    // Navigation
    case 'goto_town': {
      // Reset map position to town
      initMapState();
      const r = state.player.currentRegion;
      if (state.mapState[r]) { state.mapState[r].playerX = TOWN_POS.x; state.mapState[r].playerY = TOWN_POS.y; }
      goToScreen('town');
      break;
    }
    case 'goto_inn': goToScreen('inn'); break;
    case 'goto_shop': goToScreen('shop'); break;
    case 'goto_healer': goToScreen('healer'); break;
    case 'goto_tavern': goToScreen('tavern'); break;
    case 'goto_quests': goToScreen('quest-board'); break;
    case 'goto_forest': goToScreen('forest'); break;
    case 'goto_travel': goToScreen('travel'); break;
    case 'goto_stats': goToScreen('stats'); break;
    case 'goto_bestiary': goToScreen('bestiary'); break;

    // Inn
    case 'inn_rest':
      innRest(addMsg);
      sfxInnRest();
      updateStatus();
      setMenu(getInnMenu(addMsg));
      renderScreen();
      break;
    case 'inn_news':
      goToScreen('news');
      break;
    case 'inn_save':
      innSave(addMsg);
      sfxSave();
      break;

    // Shop
    case 'shop_weapons':
      clearText();
      addMsg('=== Weapons ===', 'title');
      setMenu(getShopBuyMenu('weapons', addMsg));
      break;
    case 'shop_armor':
      clearText();
      addMsg('=== Armor ===', 'title');
      setMenu(getShopBuyMenu('armor', addMsg));
      break;
    case 'shop_accessories':
      clearText();
      addMsg('=== Accessories ===', 'title');
      setMenu(getShopBuyMenu('accessories', addMsg));
      break;
    case 'shop_potions':
      clearText();
      addMsg('=== Potions ===', 'title');
      setMenu(getShopBuyMenu('potions', addMsg));
      break;
    case 'shop_sell':
      clearText();
      addMsg('=== Sell Items ===', 'title');
      setMenu(getShopSellMenu(addMsg));
      break;
    case 'buy_item':
      buyItem(item.data.item, item.data.type, addMsg);
      sfxGold();
      updateStatus();
      // Refresh the current shop view
      setMenu(getShopBuyMenu(item.data.type, addMsg));
      break;
    case 'sell_item':
      sellItem(item.data.itemId, addMsg);
      sfxGold();
      updateStatus();
      setMenu(getShopSellMenu(addMsg));
      break;

    // Healer
    case 'healer_heal':
      healerHeal(addMsg);
      sfxHeal();
      updateStatus();
      setMenu(getHealerMenu(addMsg));
      renderScreen();
      break;
    case 'healer_cure':
      healerCure(addMsg);
      updateStatus();
      setMenu(getHealerMenu(addMsg));
      break;

    // Tavern
    case 'tavern_charm':
      clearText();
      setMenu(getCharmDialogueMenu(addMsg));
      break;
    case 'charm_choice':
      handleCharmChoice(item.data.npcId, item.data.optionIndex, addMsg);
      updateStatus();
      // Return to tavern after the interaction
      setTimeout(() => {
        setMenu([
          { key: '1', label: 'Continue talking', action: 'tavern_charm' },
          { key: '2', label: 'Back to Tavern', action: 'goto_tavern' },
        ]);
      }, 100);
      break;
    case 'tavern_ai':
      tavarnAiTalk(item.data, addMsg);
      break;
    case 'tavern_gamble':
      tavernGamble(addMsg);
      updateStatus();
      setMenu(getTavernMenu(addMsg));
      break;
    case 'goto_crafting':
      clearText();
      addMsg('=== Ilmari\'s Forge ===', 'title');
      setMenu(getCraftingMenu(addMsg));
      break;
    case 'craft_item':
      clearText();
      craftItem(item.data, addMsg);
      updateStatus();
      addMsg('', 'narrator');
      setMenu(getCraftingMenu(addMsg));
      break;
    case 'tavern_dice_start': {
      clearText();
      addMsg('=== Helsinki Hold\'em ===', 'title');
      addMsg('5 dice. 3 rolls. Hold what you want.', 'narrator');
      addMsg('Five of a Kind: 10x | Four: 5x | Full House: 4x', 'system');
      addMsg('Lg Straight: 4x | Sm Straight: 3x | Three: 2x', 'system');
      addMsg('Two Pairs: 1.5x | Pair or less: lose bet', 'system');
      addMsg('', 'narrator');
      startDiceGame(20, addMsg);
      setMenu(getDiceMenu());
      break;
    }
    case 'dice_toggle':
      toggleDiceHold(item.data);
      sfxMenuSelect();
      setMenu(getDiceMenu());
      break;
    case 'dice_reroll':
      clearText();
      rerollDice(addMsg);
      if (diceState.rollsLeft <= 0) {
        finishDiceGame(addMsg);
        updateStatus();
        setMenu([
          { key: '1', label: 'Play Again (20g)', action: 'tavern_dice_start', disabled: state.player.gold < 20 },
          { key: '2', label: 'Back to Tavern', action: 'goto_tavern' },
        ]);
      } else {
        setMenu(getDiceMenu());
      }
      break;
    case 'dice_stand':
      clearText();
      finishDiceGame(addMsg);
      updateStatus();
      setMenu([
        { key: '1', label: 'Play Again (20g)', action: 'tavern_dice_start', disabled: state.player.gold < 20 },
        { key: '2', label: 'Back to Tavern', action: 'goto_tavern' },
      ]);
      break;

    // Quest Board
    case 'accept_quest':
      handleAcceptQuest(item.data, addMsg);
      setMenu(getQuestBoardMenu(addMsg));
      break;

    // Forest
    case 'forest_explore':
      exploreForest();
      break;
    case 'map_move':
      clearText();
      handleMapMove(item.data.dx, item.data.dy);
      updateStatus();
      break;
    case 'view_map':
      goToScreen('map');
      break;
    case 'bestiary_view': {
      state.bestiaryViewId = item.data;
      clearText();
      renderScreen();
      const bm = MONSTERS[item.data];
      if (bm) {
        addMsg(`=== ${bm.name} ===`, 'title');
        addMsg(bm.desc, 'narrator');
        const note = BESTIARY_NOTES[item.data];
        if (note) addMsg(note, 'npc');
      }
      setMenu([{ key: '1', label: 'Back to Bestiary', action: 'goto_bestiary' }]);
      break;
    }
    case 'forest_dragon':
      if (canFightDragon()) {
        clearText();
        sfxDragon();
        startBossCombat('lohikaarme');
        stopMusic();
        playMusic(MUSIC_BOSS, 100);
        goToScreen('combat');
      }
      break;

    // Combat
    case 'aggressive':
    case 'defensive': {
      clearText();
      const preMonsterHp = state.combatState.monster.hp;
      const prePlayerHp = state.player.hp;
      playerAttack(action);
      const dmgToMonster = preMonsterHp - state.combatState.monster.hp;
      const dmgToPlayer = prePlayerHp - state.player.hp;
      // Determine animation
      if (state.combatState.result === 'victory') {
        animateVictory(() => { renderScreen(); showCombatState(); });
      } else if (state.combatState.result === 'defeat') {
        animateDefeat(() => { renderScreen(); showCombatState(); });
      } else if (dmgToMonster > 0 && dmgToPlayer > 0) {
        animateMonsterHit(() => {
          animatePlayerHit(() => { renderScreen(); showCombatState(); });
        });
      } else if (dmgToMonster > 0) {
        animateMonsterHit(() => { renderScreen(); showCombatState(); });
      } else if (dmgToPlayer > 0) {
        animatePlayerHit(() => { renderScreen(); showCombatState(); });
      } else {
        renderScreen(); showCombatState();
      }
      break;
    }
    case 'spell_menu':
      state.combatState.phase = 'spell_select';
      setMenu(getCombatMenuItems());
      break;
    case 'item_menu':
      state.combatState.phase = 'item_select';
      setMenu(getCombatMenuItems());
      break;
    case 'back':
      state.combatState.phase = 'action';
      setMenu(getCombatMenuItems());
      break;
    case 'cast_spell': {
      clearText();
      state.combatState.phase = 'action';
      const preSpellMHp = state.combatState.monster.hp;
      playerCastSpell(item.data);
      const spellDmg = preSpellMHp - state.combatState.monster.hp;
      if (spellDmg > 0) {
        animateMagic(() => { renderScreen(); showCombatState(); });
      } else {
        renderScreen(); showCombatState();
      }
      break;
    }
    case 'use_item':
      clearText();
      state.combatState.phase = 'action';
      playerUseItem(item.data);
      renderScreen();
      showCombatState();
      updateStatus();
      break;
    case 'run':
      clearText();
      playerRun();
      if (state.combatState.result === 'fled') sfxRun();
      else animatePlayerHit(() => {});
      renderScreen();
      showCombatState();
      break;
    case 'combat_end_victory':
      // Update quest progress
      if (state.combatState?.monster) {
        updateQuestProgress(state.combatState.monster.id);
      }
      // Check if dragon phase 2
      if (state.combatState?.monster?.id === 'lohikaarme') {
        clearText();
        addMsg('The dragon falls... but its spirit rises!', 'narrator');
        startBossCombat('lohikaarme_spirit');
        goToScreen('combat');
        break;
      }
      // Check if dragon spirit defeated = VICTORY
      if (state.combatState?.monster?.id === 'lohikaarme_spirit') {
        goToScreen('victory');
        break;
      }
      state.combatState = null;
      goToScreen('forest');
      break;
    case 'combat_end_defeat':
      state.combatState = null;
      goToScreen('death');
      break;
    case 'combat_end_fled':
      state.combatState = null;
      goToScreen('forest');
      break;

    // Events
    case 'event_choice': {
      clearText();
      sfxEvent();
      const outcome = resolveChoice(state.eventState.event, item.data);
      if (outcome) {
        addMsg(outcome.text, 'event');
        if (outcome.effect?.advanceDay) {
          advanceDay();
          addMsg(`Day ${state.dayCount} dawns.`, 'narrator');
        }
        if (outcome.effect?.hp === 999) addMsg('HP fully restored!', 'heal');
        if (outcome.effect?.mp === 999) addMsg('MP fully restored!', 'heal');
        if (outcome.effect?.gold > 0) addMsg(`+${outcome.effect.gold} gold`, 'gold');
        if (outcome.effect?.gold < 0) addMsg(`${outcome.effect.gold} gold`, 'gold');
        if (outcome.effect?.xp > 0) {
          addMsg(`+${outcome.effect.xp} XP`, 'xp');
          if (checkLevelUp()) {
            addMsg(`*** LEVEL UP! Level ${state.player.level}! ***`, 'levelup');
          }
        }
        if (outcome.effect?.item) {
          const foundItem = getItemById(outcome.effect.item);
          addMsg(`Received: ${foundItem ? foundItem.name : outcome.effect.item}`, 'event');
        }
      }
      updateStatus();
      state.eventState = null;
      setMenu([
        { key: '1', label: 'Continue', action: 'goto_forest' },
      ]);
      break;
    }

    // Travel
    case 'travel_to':
      travelTo(item.data, addMsg);
      goToScreen('town');
      break;

    // Stats
    case 'stats_use_item':
      clearText();
      showStats(addMsg);
      setMenu(getStatsItemMenu());
      break;
    case 'use_stat_item':
      useStatItem(item.data, addMsg);
      updateStatus();
      clearText();
      showStats(addMsg);
      setMenu(getStatsItemMenu());
      break;

    case 'none':
      break;
  }

  updateStatus();
}

// ===================== NAME INPUT HANDLER =====================
function submitName() {
  const name = nameInput.value.trim();
  if (!name) {
    addMsg('Please enter a name.', 'system');
    return;
  }
  nameInputWrap.style.display = 'none';
  createPlayer(name, subState.selectedClass);
  addMsg(`Welcome, ${name} the ${subState.selectedClass}!`, 'narrator');
  addMsg('Your journey begins in Helsinki...', 'narrator');

  // Check if dragon fight available (add to forest menu if in kauniainen)
  setTimeout(() => goToScreen('town'), 500);
}

nameSubmit.addEventListener('click', submitName);
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitName();
});

// ===================== KEYBOARD INPUT =====================
document.addEventListener('keydown', (e) => {
  if (animating) return;

  // Title screen: any key
  if (state.screen === 'title' && !currentMenu.length) {
    goToScreen('title');
    return;
  }

  // WASD / Arrow keys for map movement on forest screen
  if (state.screen === 'forest') {
    const keyMap = {
      'w': { dx: 0, dy: -1 }, 'ArrowUp': { dx: 0, dy: -1 },
      's': { dx: 0, dy: 1 }, 'ArrowDown': { dx: 0, dy: 1 },
      'a': { dx: -1, dy: 0 }, 'ArrowLeft': { dx: -1, dy: 0 },
      'd': { dx: 1, dy: 0 }, 'ArrowRight': { dx: 1, dy: 0 },
      'm': null, // view map
    };
    if (e.key in keyMap) {
      e.preventDefault();
      initAudio();
      if (e.key === 'm') {
        goToScreen('map');
      } else {
        clearText();
        handleMapMove(keyMap[e.key].dx, keyMap[e.key].dy);
        updateStatus();
      }
      return;
    }
  }

  // Number keys 1-9 select menu items
  const num = parseInt(e.key);
  if (num >= 1 && num <= 9) {
    const item = currentMenu.find(m => m.key === String(num));
    if (item && !item.disabled) {
      handleMenuAction(item);
    }
  }
});

// ===================== CRAFTING SYSTEM =====================
function getCraftingMenu(addMsg) {
  addMsg('"Bring me materials and I\'ll make you something special." — Ilmari', 'npc');
  addMsg('', 'narrator');
  const items = CRAFT_RECIPES.map((recipe, i) => {
    const matStr = recipe.materials.map(m => {
      const have = hasItem(m.id);
      const item = CONSUMABLES[m.id];
      return `${item ? item.name : m.id}: ${have}/${m.qty}`;
    }).join(', ');
    const canCraft = recipe.materials.every(m => hasItem(m.id) >= m.qty);
    const alreadyCrafted = state.flags[`crafted_${recipe.id}`];
    return {
      key: String(i + 1),
      label: `${recipe.name}${alreadyCrafted ? ' [DONE]' : ''} — ${matStr}`,
      action: 'craft_item',
      data: recipe,
      disabled: !canCraft || alreadyCrafted,
    };
  });
  items.push({ key: String(items.length + 1), label: 'Back to Tavern', action: 'goto_tavern' });
  return items;
}

function craftItem(recipe, addMsg) {
  // Check materials
  for (const mat of recipe.materials) {
    if (hasItem(mat.id) < mat.qty) {
      addMsg('Not enough materials!', 'system');
      return false;
    }
  }
  // Consume materials
  for (const mat of recipe.materials) {
    removeInventoryItem(mat.id, mat.qty);
  }
  // Grant item
  const result = recipe.result;
  if (result.type === 'weapon') {
    const w = CRAFTED_WEAPONS[result.id];
    if (w) { state.player.weapon = { ...w }; addMsg(`Ilmari forges the ${w.name}! (ATK+${w.attackBonus})`, 'levelup'); }
  } else if (result.type === 'armor') {
    const a = CRAFTED_ARMORS[result.id];
    if (a) { state.player.armor = { ...a }; addMsg(`Ilmari crafts the ${a.name}! (DEF+${a.defenseBonus})`, 'levelup'); }
  } else if (result.type === 'accessory') {
    const ac = CRAFTED_ACCESSORIES[result.id];
    if (ac) { state.player.accessory = { ...ac }; addMsg(`Ilmari creates the ${ac.name}! (${ac.desc})`, 'levelup'); }
  }
  addMsg(`"${recipe.desc}" — Ilmari`, 'npc');
  state.flags[`crafted_${recipe.id}`] = true;
  sfxLevelUp();
  return true;
}

// ===================== NEW GAME+ =====================
function startNewGamePlus() {
  const oldPlayer = state.player;
  const ngPlusCount = (state.ngPlusCount || 0) + 1;

  // Keep weapon, armor, accessory, bestiary
  const keptWeapon = { ...oldPlayer.weapon };
  const keptArmor = { ...oldPlayer.armor };
  const keptAccessory = oldPlayer.accessory ? { ...oldPlayer.accessory } : null;
  const keptBestiary = { ...state.bestiary };
  const keptGold = Math.floor(oldPlayer.gold * 0.5);

  // Reset via createPlayer
  createPlayer(oldPlayer.name, oldPlayer.class);

  // Restore kept items
  state.player.weapon = keptWeapon;
  state.player.armor = keptArmor;
  state.player.accessory = keptAccessory;
  state.player.gold = 50 + keptGold;
  state.bestiary = keptBestiary;
  state.ngPlusCount = ngPlusCount;
  state.flags.ng_plus = true;
}

// Scale monsters harder in NG+
function getNgPlusScale() {
  return 1 + (state.ngPlusCount || 0) * 0.3;
}

// ===================== ENCOUNTER TEXT VARIETY =====================
const AGGRESSIVE_TEXTS = [
  'You attack aggressively!',
  'You charge in with reckless fury!',
  'You swing with everything you\'ve got!',
  'No mercy! You lunge forward!',
  'You unleash a savage strike!',
];
const DEFENSIVE_TEXTS = [
  'You attack cautiously, guard raised.',
  'You probe for an opening, shield ready.',
  'A careful strike, watching for counters.',
  'You feint, then jab cautiously.',
  'You stay measured, looking for weakness.',
];
const CRIT_TEXTS = [
  'CRITICAL HIT!',
  'A devastating blow!',
  'You find the weak spot! CRITICAL!',
  'Perfect strike! CRITICAL DAMAGE!',
  'The stars align — MASSIVE HIT!',
];
const VICTORY_TEXTS = [
  'You defeated',
  'You vanquished',
  'You destroyed',
  'You slew',
  'You obliterated',
];
const DEFEAT_TEXTS = [
  'You have been defeated!',
  'Darkness takes you...',
  'You collapse, consciousness fading.',
  'The last thing you see is the sky.',
  'Everything goes black.',
];
const FLEE_SUCCESS_TEXTS = [
  'You flee into the darkness!',
  'You make a tactical retreat!',
  'You run like your life depends on it. It does.',
  'Discretion is the better part of valor. You run.',
  'Your legs make the smart decision your pride wouldn\'t.',
];
const FLEE_FAIL_TEXTS = [
  'You failed to escape!',
  'Your legs betray you!',
  'The creature blocks your path!',
  'You trip over a root! No escape!',
  'Nowhere to run!',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===================== LANDMARK INTERACTIONS =====================
const LANDMARK_EFFECTS = {
  'The Singing Well': { type: 'heal_mp', value: 999, msg: 'The well\'s song restores your magical energy.', sound: 'heal' },
  'Harbor Rocks': { type: 'gold', value: 15, msg: 'You find coins wedged between the rocks.', sound: 'gold', repeatable: true },
  'Nuuksio Deep Lake': { type: 'heal_hp', value: 30, msg: 'The cool water soothes your wounds.', sound: 'heal', repeatable: true },
  'Mossy Boulder': { type: 'heal_hp', value: 20, msg: 'You rest against the moss. Its softness is surprisingly restorative.', sound: 'heal', repeatable: true },
  'The WiFi Shrine': { type: 'heal_mp', value: 999, msg: 'Full signal. Full mana. The shrine provides.', sound: 'heal' },
  'River Crossing': { type: 'xp', value: 20, msg: 'You study the strange currents. Something clicks in your mind.', sound: 'event' },
  'Bus Stop 666': { type: 'random_encounter', msg: 'You wait at the bus stop. Something arrives.', sound: 'event' },
  'Rune Circle': { type: 'heal_all', value: 999, msg: 'The runes pulse. Your body and mind are made whole.', sound: 'heal' },
  'The Frozen Spring': { type: 'heal_hp', value: 50, msg: 'You drink the impossible water. Cold clarity floods through you.', sound: 'heal', repeatable: true },
  'Moonwell': { type: 'heal_mp', value: 999, msg: 'The moonlit water glows as you drink. Magical energy surges back.', sound: 'heal' },
  'Aurora Pillar': { type: 'xp', value: 50, msg: 'Touching the pillar fills you with ancient knowledge.', sound: 'event' },
  "Tapio's Grove": { type: 'heal_all', value: 999, msg: 'The ancient trees breathe life into you. Fully restored.', sound: 'heal' },
  'Kallio Graffiti Wall': { type: 'hint', msg: 'New graffiti reads: "Ilmari crafts. Bring him teeth, hide, and shards."', sound: 'event' },
  'Startup Graveyard': { type: 'gold', value: 30, msg: 'You salvage some abandoned office equipment and sell it mentally for 30 gold.', sound: 'gold', repeatable: true },
  'The Bear Scratch Tree': { type: 'hint', msg: 'The claw marks seem to point deeper into the forest. Something valuable lies north.', sound: 'event' },
  'Crashed Plane': { type: 'item', itemId: 'potion_large', msg: 'You find an intact first aid kit in the wreckage.', sound: 'event' },
  'Cargo Hangar 7': { type: 'random_encounter', msg: 'The machines inside activate. Something approaches.', sound: 'event' },
  "Runway's End": { type: 'hint', msg: 'The tire marks lead to a den. Wolves are stronger here at night.', sound: 'event' },
  'Sampo Altar': { type: 'xp', value: 40, msg: 'Fragments of ancient power seep into you from the broken altar.', sound: 'event' },
};

function handleLandmarkInteraction(landmark, addMsg) {
  const effect = LANDMARK_EFFECTS[landmark.name];
  if (!effect) return false;

  const flagKey = `landmark_used_${landmark.name.replace(/\s/g, '_')}`;
  if (!effect.repeatable && state.flags[flagKey]) {
    addMsg('You\'ve already interacted with this place.', 'system');
    return false;
  }

  addMsg(effect.msg, 'event');
  state.flags[flagKey] = true;

  switch (effect.type) {
    case 'heal_hp':
      const hpHeal = effect.value === 999 ? state.player.maxHp : effect.value;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + hpHeal);
      break;
    case 'heal_mp':
      state.player.mp = state.player.maxMp;
      break;
    case 'heal_all':
      state.player.hp = state.player.maxHp;
      state.player.mp = state.player.maxMp;
      break;
    case 'gold':
      state.player.gold += effect.value;
      addMsg(`+${effect.value} gold`, 'gold');
      break;
    case 'xp':
      state.player.xp += effect.value;
      addMsg(`+${effect.value} XP`, 'xp');
      if (checkLevelUp()) addMsg(`*** LEVEL UP! Level ${state.player.level}! ***`, 'levelup');
      break;
    case 'item':
      addInventoryItem(effect.itemId);
      const item = getItemById(effect.itemId);
      addMsg(`Found: ${item ? item.name : effect.itemId}`, 'event');
      break;
    case 'random_encounter':
      startCombat();
      goToScreen('combat');
      return true; // Signal that we changed screen
    case 'hint':
      break; // Message already shown
  }

  if (effect.sound === 'heal') sfxHeal();
  else if (effect.sound === 'gold') sfxGold();
  else if (effect.sound === 'event') sfxEvent();

  return false;
}

// ===================== AUDIO TOGGLES =====================
document.getElementById('btnMusic').addEventListener('click', () => {
  initAudio();
  musicEnabled = !musicEnabled;
  document.getElementById('btnMusic').classList.toggle('off', !musicEnabled);
  if (!musicEnabled) stopMusic();
  else startMusicForScreen(state.screen);
});

document.getElementById('btnSfx').addEventListener('click', () => {
  initAudio();
  sfxEnabled = !sfxEnabled;
  document.getElementById('btnSfx').classList.toggle('off', !sfxEnabled);
});

// ===================== INIT =====================
function init() {
  goToScreen('title');
}

// Wait for font to load
document.fonts.ready.then(init);
