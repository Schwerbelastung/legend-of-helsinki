/* ============================================================
   combat.js — Turn-based combat system with stances
   ============================================================ */

import { state, getAvailableSpells, checkLevelUp, addInventoryItem, removeInventoryItem, hasItem } from './gameState.js';
import { useConsumable, CONSUMABLES, getItemById } from './items.js';
import { getRandomMonster, createMonsterInstance, getBoss } from './monsters.js';

export function startCombat(monsterTemplate) {
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

  return state.combatState;
}

export function startBossCombat(bossId) {
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

export function playerAttack(stance) {
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
      hitMessage = 'You attack aggressively!';
      // Crit chance
      const critChance = 0.15 + (p.accessory?.effect === 'critBonus' ? p.accessory.value : 0);
      if (Math.random() < critChance) {
        damageMultiplier *= 2;
        hitMessage = 'CRITICAL HIT!';
        log.push({ text: hitMessage, color: 'crit' });
      } else {
        log.push({ text: hitMessage, color: 'narrator' });
      }
      break;
    case 'defensive':
      damageMultiplier = 0.8;
      log.push({ text: 'You attack cautiously, guard raised.', color: 'narrator' });
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

export function playerCastSpell(spell) {
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

export function playerUseItem(itemId) {
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

export function playerRun() {
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
    log.push({ text: 'You flee into the darkness!', color: 'narrator' });
  } else {
    log.push({ text: 'You failed to escape!', color: 'combat' });
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
  log.push({ text: `You defeated ${m.name}!`, color: 'narrator' });

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

  log.push({ text: 'You have been defeated!', color: 'damage' });
  if (goldLoss > 0) log.push({ text: `Lost ${goldLoss} gold...`, color: 'gold' });
  if (xpLoss > 0) log.push({ text: `Lost ${xpLoss} XP...`, color: 'xp' });
  log.push({ text: 'You wake up at the inn...', color: 'narrator' });
}

export function getCombatMenuItems() {
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
