/* ============================================================
   art.js — Procedural pixel art for scenes, monsters, NPCs
   ============================================================ */

import { clear, rect, circle, line, text, textCenter, progressBar } from './renderer.js';

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
export function drawTitle() {
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
export function drawTownHelsinki() {
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

export function drawTownEspoo() {
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

export function drawTownVantaa() {
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

export function drawTownKauniainen() {
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
export function drawInn() {
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

export function drawShop() {
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

export function drawHealer() {
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

export function drawTavern() {
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

export function drawQuestBoard() {
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
export function drawForestHelsinki() {
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

export function drawForestEspoo() {
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

export function drawForestVantaa() {
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

export function drawForestKauniainen() {
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

export function drawMonster(artId, region) {
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
export function drawDeath() {
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

export function drawVictory() {
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

export function drawCharacterCreate() {
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

export function drawTravelMap() {
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

export function drawStats() {
  clear('#0a0a14');
  rect(5, 5, 310, 190, '#12121e');
  rect(7, 7, 306, 186, '#0e0e18');
  textCenter('Character', 12, '#e0d0a0', 8);
  rect(40, 24, 240, 1, '#3a3a4a');
}

export function drawNewsBoard() {
  clear('#1a1008');
  rect(40, 10, 240, 180, '#2a1a0a');
  rect(42, 12, 236, 176, '#3a2a1a');
  textCenter('News Board', 18, '#e0c080', 8);
  rect(80, 30, 160, 1, '#5a4a3a');
}

// ===================== EVENT SCENES =====================
export function drawEventMushroom() {
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

export function drawEventWell() {
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

export function drawEventSauna() {
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

export function drawEventCrossroads() {
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

export function drawEventGeneric() {
  drawForestHelsinki();
  // A mysterious glow
  circle(160, 100, 20, '#a080ff15');
  circle(160, 100, 10, '#a080ff20');
}
