/* ============================================================
   quests.js — Quest board system
   ============================================================ */

import { state, hasItem } from './gameState.js';

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

export function getAvailableQuests(region) {
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

export function acceptQuest(questId) {
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

export function updateQuestProgress(monsterId) {
  for (const quest of state.questBoard) {
    const template = QUEST_TEMPLATES.find(q => q.id === quest.id);
    if (!template || template.type !== 'kill') continue;
    if (template.target === monsterId) {
      quest.progress = Math.min(quest.progress + 1, quest.required);
    }
  }
}

export function checkQuestCompletion() {
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

export function completeQuest(questId) {
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

export function getQuestTemplate(questId) {
  return QUEST_TEMPLATES.find(q => q.id === questId);
}

export function getActiveQuests() {
  return state.questBoard.map(q => {
    const template = QUEST_TEMPLATES.find(t => t.id === q.id);
    return { ...q, template };
  });
}
