/* ============================================================
   regions.js — Region definitions and travel logic
   ============================================================ */

export const REGIONS = {
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

export function getRegion(id) {
  return REGIONS[id] || REGIONS.helsinki;
}

export function getUnlockedRegions(playerLevel) {
  return Object.values(REGIONS).filter(r => playerLevel >= r.unlockLevel);
}

export function getHealCost(region, playerLevel) {
  const r = REGIONS[region];
  return Math.floor(r.healCostBase * (1 + (playerLevel - 1) * 0.3));
}

export function getInnCost(region, playerLevel) {
  const r = REGIONS[region];
  return Math.floor(r.innCostBase * (1 + (playerLevel - 1) * 0.2));
}

export function canTravel(targetRegion, playerLevel) {
  const r = REGIONS[targetRegion];
  return playerLevel >= r.unlockLevel;
}
