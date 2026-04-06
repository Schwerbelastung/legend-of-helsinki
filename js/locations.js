/* ============================================================
   locations.js — Town location menus and logic
   ============================================================ */

import { state, saveGame, advanceDay, addInventoryItem, removeInventoryItem, hasItem, checkLevelUp } from './gameState.js';
import { getShopWeapons, getShopArmors, getShopAccessories, getShopConsumables, getItemById, WEAPONS, ARMORS, ACCESSORIES, CONSUMABLES, useConsumable } from './items.js';
import { getRegion, getHealCost, getInnCost, getUnlockedRegions } from './regions.js';
import { getTavernNpc, getCharmLevel, addCharm, checkCharmReward, getAiTavernDialogue, getAiPlayersInRegion } from './npcs.js';
import { getAvailableQuests, acceptQuest, getActiveQuests, checkQuestCompletion, completeQuest, getQuestTemplate } from './quests.js';

// Each location returns { menuItems, onEnter(addMsg), artFn }
// addMsg(text, colorClass) adds text to the text panel

// ===================== TOWN HUB =====================
export function getTownMenu(addMsg) {
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
  ];
}

export function enterTown(addMsg) {
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
export function getInnMenu(addMsg) {
  const cost = getInnCost(state.player.currentRegion, state.player.level);
  return [
    { key: '1', label: `Rest & Heal (${cost}g)`, action: 'inn_rest' },
    { key: '2', label: 'News Board', action: 'inn_news' },
    { key: '3', label: 'Save Game', action: 'inn_save' },
    { key: '4', label: 'Back to Town', action: 'goto_town' },
  ];
}

export function innRest(addMsg) {
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

export function innNews(addMsg) {
  addMsg('=== News Board ===', 'title');
  if (state.newsBoard.length === 0) {
    addMsg('No news today.', 'system');
  } else {
    for (let i = 0; i < Math.min(8, state.newsBoard.length); i++) {
      addMsg(`  ${state.newsBoard[i]}`, 'npc');
    }
  }
}

export function innSave(addMsg) {
  saveGame();
  addMsg('Game saved.', 'system');
}

// ===================== SHOP =====================
export function getShopMenu(addMsg) {
  return [
    { key: '1', label: 'Buy Weapons', action: 'shop_weapons' },
    { key: '2', label: 'Buy Armor', action: 'shop_armor' },
    { key: '3', label: 'Buy Accessories', action: 'shop_accessories' },
    { key: '4', label: 'Buy Potions', action: 'shop_potions' },
    { key: '5', label: 'Sell Equipment', action: 'shop_sell' },
    { key: '6', label: 'Back to Town', action: 'goto_town' },
  ];
}

export function getShopBuyMenu(type, addMsg) {
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

export function buyItem(item, type, addMsg) {
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

export function getShopSellMenu(addMsg) {
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

export function sellItem(itemId, addMsg) {
  const item = getItemById(itemId);
  if (!item) return;
  const sellPrice = Math.floor(item.price * 0.5);
  removeInventoryItem(itemId);
  state.player.gold += sellPrice;
  addMsg(`Sold ${item.name} for ${sellPrice}g.`, 'gold');
}

// ===================== HEALER =====================
export function getHealerMenu(addMsg) {
  const cost = getHealCost(state.player.currentRegion, state.player.level);
  const p = state.player;
  const hpMissing = p.maxHp - p.hp;
  return [
    { key: '1', label: `Heal Wounds (${cost}g)`, action: 'healer_heal', disabled: hpMissing === 0 },
    { key: '2', label: 'Cure Poison (10g)', action: 'healer_cure', disabled: !p.poisoned },
    { key: '3', label: 'Back to Town', action: 'goto_town' },
  ];
}

export function healerHeal(addMsg) {
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

export function healerCure(addMsg) {
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
export function getTavernMenu(addMsg) {
  const npc = getTavernNpc(state.player.currentRegion);
  const aiHere = getAiPlayersInRegion(state.player.currentRegion);

  const items = [];
  if (npc) {
    items.push({ key: String(items.length + 1), label: `Talk to ${npc.name} (${npc.title})`, action: 'tavern_charm' });
  }
  for (const ai of aiHere) {
    items.push({ key: String(items.length + 1), label: `Talk to ${ai.name}`, action: 'tavern_ai', data: ai });
  }
  items.push({ key: String(items.length + 1), label: 'Gamble (20g)', action: 'tavern_gamble', disabled: state.player.gold < 20 });
  items.push({ key: String(items.length + 1), label: 'Back to Town', action: 'goto_town' });
  return items;
}

export function getCharmDialogueMenu(addMsg) {
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

export function handleCharmChoice(npcId, optionIndex, addMsg) {
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

export function tavarnAiTalk(aiPlayer, addMsg) {
  const dialogue = getAiTavernDialogue(aiPlayer);
  addMsg(`${aiPlayer.name}: ${dialogue}`, 'npc');
}

export function tavernGamble(addMsg) {
  if (state.player.gold < 20) {
    addMsg("You can't afford to gamble.", 'system');
    return;
  }
  state.player.gold -= 20;
  const roll = Math.random();
  if (roll < 0.4) {
    state.player.gold += 40;
    addMsg('You win! +40 gold!', 'gold');
  } else if (roll < 0.55) {
    state.player.gold += 80;
    addMsg('Big win! +80 gold!', 'gold');
  } else {
    addMsg('You lose your bet. The house always wins.', 'system');
  }
}

// ===================== QUEST BOARD =====================
export function getQuestBoardMenu(addMsg) {
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

export function handleAcceptQuest(questId, addMsg) {
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
export function getTravelMenu(addMsg) {
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

export function travelTo(regionId, addMsg) {
  state.player.currentRegion = regionId;
  const region = getRegion(regionId);
  addMsg(`You travel to ${region.name}...`, 'narrator');
}

// ===================== STATS =====================
export function showStats(addMsg) {
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

export function getStatsMenu() {
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

export function getStatsItemMenu() {
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

export function useStatItem(itemId, addMsg) {
  if (!hasItem(itemId)) return;
  const result = useConsumable(state.player, itemId);
  if (result && result !== 'ESCAPE') {
    removeInventoryItem(itemId);
    addMsg(result, 'heal');
  }
}
