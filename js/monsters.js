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
    drops: [{ itemId: 'potion_small', chance: 0.2 }],
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
    drops: [{ itemId: 'potion_small', chance: 0.3 }],
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
    drops: [{ itemId: 'mana_small', chance: 0.2 }],
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
    drops: [{ itemId: 'potion_medium', chance: 0.2 }],
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
    drops: [{ itemId: 'antidote', chance: 0.25 }],
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
    drops: [{ itemId: 'potion_large', chance: 0.2 }],
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
    drops: [{ itemId: 'escape_scroll', chance: 0.1 }, { itemId: 'mana_large', chance: 0.2 }],
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
    drops: [{ itemId: 'potion_full', chance: 0.15 }],
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

export function getMonstersByRegion(region) {
  return Object.values(MONSTERS).filter(m => m.region === region && !m.isBoss);
}

export function getRandomMonster(region, playerLevel) {
  const pool = getMonstersByRegion(region).filter(m =>
    playerLevel >= m.levelRange[0] && playerLevel <= m.levelRange[1] + 2
  );
  if (pool.length === 0) return getMonstersByRegion(region)[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function createMonsterInstance(template, playerLevel) {
  // Scale monster stats slightly based on player level within range
  const levelDiff = Math.max(0, playerLevel - template.levelRange[0]);
  const scale = 1 + levelDiff * 0.1;
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

export function getMonsterById(id) {
  return MONSTERS[id] || null;
}

export function getBoss(id) {
  return MONSTERS[id] || null;
}
