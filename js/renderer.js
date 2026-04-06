/* ============================================================
   renderer.js — Canvas drawing utilities
   ============================================================ */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Disable smoothing for pixel-perfect rendering
ctx.imageSmoothingEnabled = false;

export function clear(color = '#0a0a12') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 320, 200);
}

export function rect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export function circle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(Math.round(x), Math.round(y), r, 0, Math.PI * 2);
  ctx.fill();
}

export function line(x1, y1, x2, y2, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(Math.round(x1), Math.round(y1));
  ctx.lineTo(Math.round(x2), Math.round(y2));
  ctx.stroke();
}

export function text(str, x, y, color = '#c0c0c0', size = 8) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Press Start 2P', monospace`;
  ctx.textBaseline = 'top';
  ctx.fillText(str, Math.round(x), Math.round(y));
}

export function textCenter(str, y, color = '#c0c0c0', size = 8) {
  ctx.fillStyle = color;
  ctx.font = `${size}px 'Press Start 2P', monospace`;
  ctx.textBaseline = 'top';
  const w = ctx.measureText(str).width;
  ctx.fillText(str, Math.round((320 - w) / 2), Math.round(y));
}

// Draw a progress bar (HP, MP, XP etc.)
export function progressBar(x, y, w, h, ratio, fgColor, bgColor = '#1a1a2a') {
  rect(x, y, w, h, bgColor);
  if (ratio > 0) {
    rect(x, y, Math.round(w * Math.min(1, ratio)), h, fgColor);
  }
}

// Get the raw context for advanced drawing
export function getCtx() { return ctx; }
export function getCanvas() { return canvas; }
