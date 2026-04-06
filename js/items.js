/* ============================================================
   items.js — Equipment and consumable definitions
   ============================================================ */

export const WEAPONS = {
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

export const ARMORS = {
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

export const ACCESSORIES = {
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

export const CONSUMABLES = {
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
};

export function getShopWeapons(region) {
  return Object.values(WEAPONS).filter(w => w.region === region && w.price > 0 && !w.quest);
}

export function getShopArmors(region) {
  return Object.values(ARMORS).filter(a => a.region === region && a.price > 0);
}

export function getShopAccessories(region) {
  return Object.values(ACCESSORIES).filter(a => a.region === region && a.price > 0 && !a.charm && !a.quest);
}

export function getShopConsumables() {
  return Object.values(CONSUMABLES).filter(c => c.price > 0);
}

export function getItemById(id) {
  return WEAPONS[id] || ARMORS[id] || ACCESSORIES[id] || CONSUMABLES[id] || null;
}

export function useConsumable(player, itemId) {
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
