/* ============================================================
   events.js — Random forest events with choices and consequences
   ============================================================ */

import { state, addInventoryItem, hasItem } from './gameState.js';

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

export function getRandomEvent(region, playerLevel) {
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

export function resolveChoice(event, choiceIndex) {
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

export function getFlavorText(region) {
  const pool = FLAVOR_TEXT[region] || FLAVOR_TEXT.helsinki;
  return pool[Math.floor(Math.random() * pool.length)];
}
