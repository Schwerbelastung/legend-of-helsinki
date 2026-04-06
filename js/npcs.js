/* ============================================================
   npcs.js — NPC definitions, dialogue, and tavern charm
   ============================================================ */

import { state, addInventoryItem } from './gameState.js';
import { ACCESSORIES } from './items.js';

// Town NPCs (shopkeeper, innkeeper, healer) are handled inline in locations.js
// This file handles tavern charm NPCs and AI adventurer interactions

const TAVERN_NPCS = {
  helsinki: {
    id: 'saara', name: 'Saara', title: 'Journalist',
    region: 'helsinki',
    rewardItem: 'press_badge',
    charmThresholds: [3, 6, 10],
    greeting: "A sharp-eyed woman sits at the bar, scribbling notes. She looks up with a knowing smile.",
    dialogueOptions: [
      {
        text: '"Any interesting stories lately?"',
        responses: [
          "She leans in. 'There are whispers of something stirring in the metro tunnels. Something with teeth.'",
          "'The fish market vendors have been finding strange things in their nets. Things with too many eyes.'",
          "'I heard Louhi was seen near the old fortress. That one gives me chills.'",
        ],
        charm: 1,
      },
      {
        text: '"You have beautiful handwriting."',
        responses: [
          "She raises an eyebrow. 'Flattery will get you... well, maybe somewhere.'",
          "She laughs. 'You should see my shorthand. It's even prettier.'",
          "'That is the most journalist-specific compliment I have ever received. I respect that.'",
        ],
        charm: 2,
      },
      {
        text: '"Can I buy you a drink?"',
        responses: [
          "'Only if you have a good story to go with it.' She makes room on the bench.",
          "'I accept. But I warn you, I drink like a Kallio local.'",
          "She accepts with a warm smile. 'You know, you're more interesting than most adventurers.'",
        ],
        charm: 2,
      },
    ],
    charmMessages: [
      "Saara slips you a note: 'There's a hidden cache in the east forest. Don't tell anyone I told you.' (+50 gold)",
      "Saara seems genuinely happy to see you. 'Here, I found this while investigating a story.' She hands you a potion.",
      "Saara gives you her press badge. 'For luck. And for the story you're writing with your life.'",
    ],
  },
  espoo: {
    id: 'juhani', name: 'Juhani', title: 'Programmer',
    region: 'espoo',
    rewardItem: 'debug_ring',
    charmThresholds: [3, 6, 10],
    greeting: "A lanky man with tired eyes sits surrounded by empty coffee cups, muttering about recursive functions.",
    dialogueOptions: [
      {
        text: '"What are you working on?"',
        responses: [
          "'Trying to debug reality. There is a null pointer exception somewhere in the fabric of space-time.'",
          "'An algorithm to predict monster spawns. So far it just predicts coffee breaks.'",
          "'A recursive spell that calls itself. The stack overflow is... literal.'",
        ],
        charm: 1,
      },
      {
        text: '"Is that O(n) or O(my god)?"',
        responses: [
          "He snorts coffee through his nose. 'Finally, someone who speaks my language!'",
          "'O(n log n) at best. O(help me) at worst.' He grins despite himself.",
          "He stares at you with newfound respect. 'That was terrible. I love it.'",
        ],
        charm: 2,
      },
      {
        text: '"You look like you could use some sleep."',
        responses: [
          "'Sleep is just the body\'s garbage collector. I prefer to manage memory manually.'",
          "'I will sleep when the code compiles. So... never, probably.'",
          "He yawns. 'Actually, that might be the best idea I've heard all decade.'",
        ],
        charm: 2,
      },
    ],
    charmMessages: [
      "Juhani shares a debug tip: 'Try hitting the Koodihirviö with physical attacks. They crash faster.' (+30 XP)",
      "Juhani hands you a glowing gadget. 'Prototype. Don't ask what it does.' (Medium Mana Potion)",
      "Juhani solemnly presents his Debug Ring. 'May your bugs be shallow and your stack traces be readable.'",
    ],
  },
  vantaa: {
    id: 'katariina', name: 'Katariina', title: 'Traveler',
    region: 'vantaa',
    rewardItem: 'travel_charm',
    charmThresholds: [3, 6, 10],
    greeting: "A mysterious woman sits in the corner, her cloak shimmering with an otherworldly iridescence.",
    dialogueOptions: [
      {
        text: '"Where have you traveled from?"',
        responses: [
          "'From a place where the northern lights touch the ground. It is very cold there, but the silence is beautiful.'",
          "'Somewhere east of reality and west of dreams. The layover was terrible.'",
          "'I have been everywhere, and nowhere is quite like here. Helsinki has... gravity.'",
        ],
        charm: 1,
      },
      {
        text: '"That cloak is remarkable."',
        responses: [
          "'It was a gift from a grateful spirit. Or a cursed spirit. I forget which.'",
          "She pulls it tighter. 'It remembers every place I have been. Sometimes it shows them to me.'",
          "'Would you like to touch it?' The fabric feels like liquid starlight.",
        ],
        charm: 2,
      },
      {
        text: '"I feel like we have met before."',
        responses: [
          "'Perhaps in another timeline. There are so many, you know.'",
          "She smiles enigmatically. 'All travelers meet eventually. The roads are fewer than you think.'",
          "'We have. You just don't remember yet.' Her eyes hold ancient depths.",
        ],
        charm: 2,
      },
    ],
    charmMessages: [
      "Katariina whispers a shortcut. 'Through the cargo terminal, third door. Avoid the Tullidemoni.' (+60 gold)",
      "Katariina gives you a strange vial. 'From a place that doesn't exist yet.' (Large Potion)",
      "Katariina removes her charm necklace. 'You will need this more than I. The roads ahead are dark.'",
    ],
  },
  kauniainen: {
    id: 'tapio', name: 'Tapio', title: 'Forest Spirit',
    region: 'kauniainen',
    rewardItem: 'forest_heart',
    charmThresholds: [3, 6, 10],
    greeting: "An old man with bark-like skin and moss in his beard sits perfectly still. His eyes are the green of deep forest.",
    dialogueOptions: [
      {
        text: '"Are you truly Tapio, lord of the forest?"',
        responses: [
          "'Lord is a human word. I am the forest. The forest is me. We do not need titles.'",
          "'I have been called many things. Tapio is the name your kind remembers. It will do.'",
          "He chuckles, a sound like wind through leaves. 'Would you believe me if I said yes?'",
        ],
        charm: 1,
      },
      {
        text: '"The forest seems healthier since I started clearing the monsters."',
        responses: [
          "'The trees notice. They speak of you.' He seems pleased.",
          "'Balance returns slowly. But it returns. You have my thanks, small one.'",
          "'The hiisi were not always twisted. Something corrupted them. Perhaps you will discover what.'",
        ],
        charm: 2,
      },
      {
        text: '"Tell me about the dragon."',
        responses: [
          "His eyes darken. 'It sleeps beneath the oldest hill. Its dreams poison the land.'",
          "'Lohikaarme is older than me. It was here before the first tree grew. It will take great courage.'",
          "'You will need the four fragments of the Sampo. Without them, the dragon cannot be truly slain.'",
        ],
        charm: 2,
      },
    ],
    charmMessages: [
      "Tapio touches the ground and a sapling grows, bearing a golden fruit. 'Eat. Be strong.' (Full Heal)",
      "Tapio whispers to the trees. 'They will watch over you in the forest.' (Reduced random encounters for a while)",
      "Tapio places his hand on your chest. You feel warmth spread through you. 'Carry the forest's heart.'",
    ],
  },
};

export function getTavernNpc(region) {
  return TAVERN_NPCS[region] || null;
}

export function getCharmLevel(npcId) {
  return state.player.charm[npcId] || 0;
}

export function addCharm(npcId, amount) {
  if (!state.player.charm[npcId]) state.player.charm[npcId] = 0;
  state.player.charm[npcId] += amount;
  return state.player.charm[npcId];
}

export function checkCharmReward(npcId) {
  const npc = Object.values(TAVERN_NPCS).find(n => n.id === npcId);
  if (!npc) return null;

  const charm = getCharmLevel(npcId);
  const rewards = [];

  for (let i = 0; i < npc.charmThresholds.length; i++) {
    const threshold = npc.charmThresholds[i];
    const rewardKey = `charm_reward_${npcId}_${i}`;

    if (charm >= threshold && !state.flags[rewardKey]) {
      state.flags[rewardKey] = true;

      // Apply reward based on tier
      if (i === 0) {
        // Gold or minor bonus
        state.player.gold += 50;
        rewards.push({ message: npc.charmMessages[0], type: 'gold' });
      } else if (i === 1) {
        // Item reward
        addInventoryItem('potion_medium');
        rewards.push({ message: npc.charmMessages[1], type: 'item' });
      } else if (i === 2) {
        // Unique accessory
        rewards.push({ message: npc.charmMessages[2], type: 'accessory', itemId: npc.rewardItem });
      }
    }
  }

  return rewards.length > 0 ? rewards : null;
}

// AI adventurer dialogue when encountered in tavern
export function getAiTavernDialogue(aiPlayer) {
  const lines = {
    brave: [
      `"I slew three monsters before breakfast! ${aiPlayer.level > 5 ? 'Espoo is getting interesting.' : 'Helsinki never sleeps.'}"`,
      '"Come, share a drink! Let me tell you about my latest battle!"',
      '"I heard the dragon stirs in its sleep. We must be ready!"',
    ],
    wise: [
      '"The runes speak of an ancient power awakening. Be cautious, friend."',
      `"I have been studying the ${aiPlayer.region === 'helsinki' ? 'harbor spirits' : 'local creatures'}. Fascinating, if deadly."`,
      '"Knowledge is the greatest weapon. Though a good staff helps too."',
    ],
    crafty: [
      '"I forged a new blade today. Want to see? ...Want to buy it?"',
      '"The metal in these regions has unique properties. Perfect for enchanting."',
      '"If you bring me rare materials, I can craft something special for you."',
    ],
    rival: [
      `"Still alive? How quaint. I am already level ${aiPlayer.level}."`,
      '"Do not get in my way. The dragon is mine to slay."',
      '"You should turn back while you still can."',
    ],
    tragic: [
      '"..." (Kullervo stares into his drink.)',
      '"Everything I touch turns to ash. Perhaps that is my fate."',
      '"Do you ever wonder if the monsters are the heroes of their own story?"',
    ],
    guardian: [
      '"The forest whispers your name. It watches over those who protect it."',
      '"Take care in the deep woods. Not all that shimmers is friendly."',
      '"I left something for you beneath the oldest oak. A gift from the forest."',
    ],
  };

  const pool = lines[aiPlayer.personality] || lines.brave;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getAiPlayersInRegion(region) {
  return state.aiPlayers.filter(ai => ai.region === region && ai.alive);
}
