# Changelog

## [0.7.0] - 2026-04-06

### Added
- **Crafting system** — Ilmari the blacksmith forges gear from monster materials
  - 8 recipes: Rat-Tooth Dagger, Troll-Hide Vest, Spectral Band, Overclocked Blade, Drakefire Plate, Thunderstrike Axe, Aurora Cloak, Rune Amulet
  - 9 crafting materials dropped by specific monsters (Rat Fang, Troll Hide, Ghost Essence, Tech Chip, Hiisi Bark, Drake Scale, Storm Shard, Ancient Rune, Aurora Dust)
  - Find Ilmari in the tavern to access the forge
- **New Game+** — After slaying the dragon, restart with harder monsters but keep weapon, armor, accessory, bestiary, and half your gold
  - Monsters scale +30% per NG+ cycle, stacking infinitely
  - NG+ count displayed on victory screen
- **Landmark interactions** — 18 landmarks now have gameplay effects
  - Healing: Nuuksio Deep Lake, Mossy Boulder, Frozen Spring (HP); WiFi Shrine, Moonwell, Singing Well (MP); Rune Circle, Tapio's Grove (full restore)
  - Loot: Harbor Rocks, Startup Graveyard (gold); Crashed Plane (potion)
  - Knowledge: River Crossing, Aurora Pillar, Sampo Altar (XP)
  - Combat: Bus Stop 666, Cargo Hangar 7 (trigger encounters)
  - Hints: Kallio Graffiti Wall, Bear Scratch Tree, Runway's End (tips)
- **Encounter text variety** — Randomized combat messages
  - 5 aggressive attack lines, 5 defensive lines, 5 critical hit lines
  - 5 victory lines, 5 defeat lines, 5 flee success/fail lines each

## [0.6.0] - 2026-04-06

### Added
- **Monster Bestiary** — journal tracking all encountered and slain monsters, accessible from town menu
  - Detail view with pixel art portrait, stats, weaknesses, resistances
  - Humorous "Researcher's notes" for every monster
  - Encounter and kill counters per species
- **Grid Map Exploration** — forest is now a 9x9 navigable grid per region
  - WASD/Arrow key movement with fog of war
  - M key to view the map overlay
  - 32 unique landmarks (8 per region) with thematic descriptions
  - Town at bottom-center; player must walk back manually
  - Encounter chance scales with distance from town
  - Dragon fight triggers at Dragon's Mound landmark in Kauniainen
- **Day/Night Cycle** — 4 time phases (dawn, day, dusk, night)
  - Visual tinting and atmosphere changes per phase
  - Day-only and night-only monster variants
  - Night-specific flavor text per region
  - Time advances with each map movement, resets on rest
- **12 New Monsters** with humorous Finnish flavor
  - Helsinki: Postikyyhky, Kahvizombi, Yolohi, Kallio-Vampyyri
  - Espoo: Startup-Golemi, Nuuksio-Karhu, WLAN-Haamu
  - Vantaa: Laukkuhaukka, Bussi 666, Kiitotiesusi
  - Kauniainen: Revontulihai, Sammakkoprinssi
- **Sound Effects & Music** — Web Audio API procedural audio
  - Unique SFX for combat, menus, healing, level up, gold, dice, dragon
  - Per-screen looping chiptune music with night variant
  - M/S toggle buttons in status bar
- **Combat Animations** — screen flash and shake per action type
  - Color-coded by damage type (red hit, yellow crit, cyan block, purple magic)
- **Helsinki Hold'em Dice Game** — 5-dice tavern game replacing simple gambling
  - Hold/reroll mechanic with Yatzy-style scoring

## [0.5.0] - 2026-04-06

Initial release.

### Game Systems
- Turn-based combat with stance system (Aggressive / Defensive / Magic)
- 3 character classes: Warrior, Mage, Rogue with unique spell trees
- 12-level progression system with stat growth per class
- Equipment system: weapons, armor, accessories with tiered gear per region
- Inventory with consumables (potions, scrolls, antidotes)
- Save/load via localStorage
- Death penalty system (lose gold/XP, respawn at inn)

### World
- 4 explorable regions: Helsinki, Espoo, Vantaa, Kauniainen
- Each region has: town hub, inn, weapon shop, healer, tavern, quest board, forest
- Level-gated travel between regions (1-3, 4-6, 7-9, 10-12)
- Day/night cycle with 4 phases (dawn, day, dusk, night)
- Time advances with exploration, resets on rest
- Visual tinting and atmosphere changes per time of day

### Monsters
- 33 unique monsters across all regions
- Day-only and night-only monster variants
- Scaling difficulty based on player level
- Unique pixel art portrait for every monster
- Two-phase dragon boss fight (physical + spirit form)
- Humorous Finnish-themed creatures (Kaljatrolli, Kahvizombi, Bussi 666, Startup-Golemi, WLAN-Haamu, Revontulihai, Sammakkoprinssi, and more)

### NPCs & Social
- 6 AI adventurers who progress, fight, die, and respawn alongside you
- AI actions generate news board messages at the inn
- Tavern charm system with 4 unique NPCs (Saara, Juhani, Katariina, Tapio)
- Dialogue trees with charm scoring and tiered rewards
- AI adventurers appear in taverns with personality-driven dialogue

### Quests
- Quest board per region with kill-type quests
- Sampo fragment collection chain spanning all 4 regions
- Quest completion tracked automatically on monster kills
- Rewards: gold, XP, unique items, story progression
- Sampo Blade forging as prerequisite for dragon fight

### Events
- 13 random forest events with branching choices
- Persistent consequence flags affecting future encounters
- Special events: Sampo fragment discoveries, Mielikki encounters, ghost tram
- Region-specific and level-gated events

### Audio
- Web Audio API procedural sound effects (no external files)
- Unique sounds for: combat hits, crits, blocks, magic, healing, level up, victory, defeat, gold, dice, menus, inn rest, save, dragon roar
- Per-screen looping chiptune music (title, town, forest, combat, tavern, boss)
- Night forest music variant (slower, sparser)
- Toggle buttons for music (M) and SFX (S) in status bar

### Combat Animations
- Screen flash effects color-coded per action type
- Canvas shake on damage (intensity varies by damage type)
- Critical hit double-flash with stronger shake
- Block, magic, heal, victory, and defeat animations
- Animation system prevents input during playback

### Tavern Dice Game
- "Helsinki Hold'em" — 5-dice game replacing simple gambling
- 3 rolls with hold/reroll mechanic
- Yatzy-style scoring (Five of a Kind 10x down to Pair 0x)
- Play again or leave after each round

### Visuals
- All pixel art procedurally drawn with Canvas 2D fillRect/arc (no sprites)
- 320x200 native resolution scaled with pixelated rendering
- Unique art for: 4 town exteriors, 4 forest scenes, 6 location interiors, 33 monster portraits, title screen, death/victory screens, travel map, character creation
- Press Start 2P retro font throughout
- BBS terminal-inspired UI with colored text classes
