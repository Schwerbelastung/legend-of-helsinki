/* ============================================================
   main.js — Game entry point, screen state machine, input
   ============================================================ */

import { state, createPlayer, loadGame, hasSave, advanceDay, checkLevelUp, hasItem, addInventoryItem } from './gameState.js';
import * as Art from './art.js';
import { startCombat, startBossCombat, playerAttack, playerCastSpell, playerUseItem, playerRun, getCombatMenuItems } from './combat.js';
import { getRandomMonster, createMonsterInstance, getBoss } from './monsters.js';
import { getRegion } from './regions.js';
import { getRandomEvent, resolveChoice, getFlavorText } from './events.js';
import { updateQuestProgress } from './quests.js';
import { getItemById, CONSUMABLES } from './items.js';
import * as Loc from './locations.js';

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
  statusBar.region.textContent = region.name;
}

// ===================== SCREEN RENDERING =====================
function renderScreen() {
  switch (state.screen) {
    case 'title': Art.drawTitle(); break;
    case 'character-create': Art.drawCharacterCreate(); break;
    case 'town': drawTownArt(); break;
    case 'inn': Art.drawInn(); break;
    case 'shop': Art.drawShop(); break;
    case 'healer': Art.drawHealer(); break;
    case 'tavern': Art.drawTavern(); break;
    case 'quest-board': Art.drawQuestBoard(); break;
    case 'forest': drawForestArt(); break;
    case 'combat': drawCombatArt(); break;
    case 'event': drawEventArt(); break;
    case 'stats': Art.drawStats(); break;
    case 'travel': Art.drawTravelMap(); break;
    case 'death': Art.drawDeath(); break;
    case 'victory': Art.drawVictory(); break;
    case 'news': Art.drawNewsBoard(); break;
  }
  updateStatus();
}

function drawTownArt() {
  switch (state.player.currentRegion) {
    case 'helsinki': Art.drawTownHelsinki(); break;
    case 'espoo': Art.drawTownEspoo(); break;
    case 'vantaa': Art.drawTownVantaa(); break;
    case 'kauniainen': Art.drawTownKauniainen(); break;
  }
}

function drawForestArt() {
  switch (state.player.currentRegion) {
    case 'helsinki': Art.drawForestHelsinki(); break;
    case 'espoo': Art.drawForestEspoo(); break;
    case 'vantaa': Art.drawForestVantaa(); break;
    case 'kauniainen': Art.drawForestKauniainen(); break;
  }
}

function drawCombatArt() {
  if (state.combatState?.monster) {
    Art.drawMonster(state.combatState.monster.art, state.combatState.monster.region);
  }
}

function drawEventArt() {
  if (state.eventState?.event?.art) {
    const artFn = Art[state.eventState.event.art];
    if (artFn) artFn();
    else Art.drawEventGeneric();
  } else {
    Art.drawEventGeneric();
  }
}

// ===================== STATE TRANSITIONS =====================
function goToScreen(screen) {
  state.screen = screen;
  clearText();
  subState = null;
  nameInputWrap.style.display = 'none';

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
      Loc.enterTown(addMsg);
      setMenu(Loc.getTownMenu(addMsg));
      break;

    case 'inn':
      renderScreen();
      addMsg('The innkeeper nods a greeting.', 'npc');
      setMenu(Loc.getInnMenu(addMsg));
      break;

    case 'shop':
      renderScreen();
      addMsg('The shopkeeper eyes your purse.', 'npc');
      addMsg('"What can I get you today?"', 'npc');
      setMenu(Loc.getShopMenu(addMsg));
      break;

    case 'healer':
      renderScreen();
      addMsg('The healer looks you over with practiced eyes.', 'npc');
      setMenu(Loc.getHealerMenu(addMsg));
      break;

    case 'tavern':
      renderScreen();
      addMsg('The tavern is dimly lit, full of murmurs and the smell of mead.', 'narrator');
      setMenu(Loc.getTavernMenu(addMsg));
      break;

    case 'quest-board':
      renderScreen();
      setMenu(Loc.getQuestBoardMenu(addMsg));
      break;

    case 'forest': {
      renderScreen();
      const forestRegion = getRegion(state.player.currentRegion);
      addMsg(`You stand at the edge of the ${forestRegion.name} wilderness.`, 'narrator');
      const forestMenu = [
        { key: '1', label: 'Explore Deeper', action: 'forest_explore' },
      ];
      if (canFightDragon()) {
        forestMenu.push({ key: '2', label: '*** Challenge the Dragon ***', action: 'forest_dragon' });
        forestMenu.push({ key: '3', label: 'Return to Town', action: 'goto_town' });
      } else {
        forestMenu.push({ key: '2', label: 'Return to Town', action: 'goto_town' });
      }
      setMenu(forestMenu);
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
      Loc.showStats(addMsg);
      setMenu(Loc.getStatsMenu());
      break;

    case 'travel':
      renderScreen();
      addMsg('Where would you like to travel?', 'narrator');
      setMenu(Loc.getTravelMenu(addMsg));
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

    case 'victory':
      renderScreen();
      addMsg('*** VICTORY ***', 'levelup');
      addMsg('You have slain the great Lohikaarme!', 'narrator');
      addMsg('Helsinki and the Capital Region are saved!', 'narrator');
      addMsg('Your legend will be told for generations.', 'narrator');
      addMsg('', 'narrator');
      addMsg(`Final Stats: Level ${state.player.level}, ${state.player.kills} kills, ${state.player.deaths} deaths, Day ${state.dayCount}`, 'system');
      setMenu([
        { key: '1', label: 'Play Again', action: 'new_game' },
      ]);
      break;

    case 'news':
      renderScreen();
      Loc.innNews(addMsg);
      setMenu([
        { key: '1', label: 'Back', action: 'goto_inn' },
      ]);
      break;
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

// ===================== FOREST EXPLORATION =====================
function exploreForest() {
  const region = state.player.currentRegion;
  const level = state.player.level;
  const roll = Math.random();

  if (roll < 0.50) {
    // Monster encounter
    startCombat();
    goToScreen('combat');
  } else if (roll < 0.75) {
    // Random event
    const event = getRandomEvent(region, level);
    if (event) {
      state.eventState = { event };
      goToScreen('event');
    } else {
      // Fallback to flavor text
      addMsg(getFlavorText(region), 'narrator');
    }
  } else if (roll < 0.90) {
    // Flavor text (nothing happens)
    clearText();
    renderScreen();
    addMsg(getFlavorText(region), 'narrator');
    setMenu([
      { key: '1', label: 'Explore Deeper', action: 'forest_explore' },
      { key: '2', label: 'Return to Town', action: 'goto_town' },
    ]);
  } else {
    // Find gold/item
    clearText();
    renderScreen();
    const goldFound = Math.floor(5 + Math.random() * (10 * level));
    state.player.gold += goldFound;
    addMsg(`You find ${goldFound} gold coins scattered on the ground!`, 'gold');
    if (Math.random() < 0.3) {
      const potionId = level < 4 ? 'potion_small' : level < 8 ? 'potion_medium' : 'potion_large';
      addInventoryItem(potionId);
      addMsg(`Found: ${CONSUMABLES[potionId].name}!`, 'event');
    }
    setMenu([
      { key: '1', label: 'Explore Deeper', action: 'forest_explore' },
      { key: '2', label: 'Return to Town', action: 'goto_town' },
    ]);
  }
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
  if (item.disabled) return;
  const action = item.action;

  switch (action) {
    // Title
    case 'new_game':
      goToScreen('character-create');
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
    case 'goto_town': goToScreen('town'); break;
    case 'goto_inn': goToScreen('inn'); break;
    case 'goto_shop': goToScreen('shop'); break;
    case 'goto_healer': goToScreen('healer'); break;
    case 'goto_tavern': goToScreen('tavern'); break;
    case 'goto_quests': goToScreen('quest-board'); break;
    case 'goto_forest': goToScreen('forest'); break;
    case 'goto_travel': goToScreen('travel'); break;
    case 'goto_stats': goToScreen('stats'); break;

    // Inn
    case 'inn_rest':
      Loc.innRest(addMsg);
      updateStatus();
      setMenu(Loc.getInnMenu(addMsg));
      renderScreen();
      break;
    case 'inn_news':
      goToScreen('news');
      break;
    case 'inn_save':
      Loc.innSave(addMsg);
      break;

    // Shop
    case 'shop_weapons':
      clearText();
      addMsg('=== Weapons ===', 'title');
      setMenu(Loc.getShopBuyMenu('weapons', addMsg));
      break;
    case 'shop_armor':
      clearText();
      addMsg('=== Armor ===', 'title');
      setMenu(Loc.getShopBuyMenu('armor', addMsg));
      break;
    case 'shop_accessories':
      clearText();
      addMsg('=== Accessories ===', 'title');
      setMenu(Loc.getShopBuyMenu('accessories', addMsg));
      break;
    case 'shop_potions':
      clearText();
      addMsg('=== Potions ===', 'title');
      setMenu(Loc.getShopBuyMenu('potions', addMsg));
      break;
    case 'shop_sell':
      clearText();
      addMsg('=== Sell Items ===', 'title');
      setMenu(Loc.getShopSellMenu(addMsg));
      break;
    case 'buy_item':
      Loc.buyItem(item.data.item, item.data.type, addMsg);
      updateStatus();
      // Refresh the current shop view
      setMenu(Loc.getShopBuyMenu(item.data.type, addMsg));
      break;
    case 'sell_item':
      Loc.sellItem(item.data.itemId, addMsg);
      updateStatus();
      setMenu(Loc.getShopSellMenu(addMsg));
      break;

    // Healer
    case 'healer_heal':
      Loc.healerHeal(addMsg);
      updateStatus();
      setMenu(Loc.getHealerMenu(addMsg));
      renderScreen();
      break;
    case 'healer_cure':
      Loc.healerCure(addMsg);
      updateStatus();
      setMenu(Loc.getHealerMenu(addMsg));
      break;

    // Tavern
    case 'tavern_charm':
      clearText();
      setMenu(Loc.getCharmDialogueMenu(addMsg));
      break;
    case 'charm_choice':
      Loc.handleCharmChoice(item.data.npcId, item.data.optionIndex, addMsg);
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
      Loc.tavarnAiTalk(item.data, addMsg);
      break;
    case 'tavern_gamble':
      Loc.tavernGamble(addMsg);
      updateStatus();
      setMenu(Loc.getTavernMenu(addMsg));
      break;

    // Quest Board
    case 'accept_quest':
      Loc.handleAcceptQuest(item.data, addMsg);
      setMenu(Loc.getQuestBoardMenu(addMsg));
      break;

    // Forest
    case 'forest_explore':
      exploreForest();
      break;
    case 'forest_dragon':
      if (canFightDragon()) {
        clearText();
        startBossCombat('lohikaarme');
        goToScreen('combat');
      }
      break;

    // Combat
    case 'aggressive':
    case 'defensive':
      clearText();
      playerAttack(action);
      renderScreen();
      showCombatState();
      break;
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
    case 'cast_spell':
      clearText();
      state.combatState.phase = 'action';
      playerCastSpell(item.data);
      renderScreen();
      showCombatState();
      break;
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
        { key: '1', label: 'Continue Exploring', action: 'forest_explore' },
        { key: '2', label: 'Return to Town', action: 'goto_town' },
      ]);
      break;
    }

    // Travel
    case 'travel_to':
      Loc.travelTo(item.data, addMsg);
      goToScreen('town');
      break;

    // Stats
    case 'stats_use_item':
      clearText();
      Loc.showStats(addMsg);
      setMenu(Loc.getStatsItemMenu());
      break;
    case 'use_stat_item':
      Loc.useStatItem(item.data, addMsg);
      updateStatus();
      clearText();
      Loc.showStats(addMsg);
      setMenu(Loc.getStatsItemMenu());
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
  // Title screen: any key
  if (state.screen === 'title' && !currentMenu.length) {
    goToScreen('title');
    return;
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

// ===================== INIT =====================
function init() {
  goToScreen('title');
}

// Wait for font to load
document.fonts.ready.then(init);
