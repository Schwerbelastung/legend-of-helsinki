# Legend of Helsinki

A browser-based RPG inspired by the classic BBS door game **Legend of the Red Dragon** (LORD), set in a fantasy version of Helsinki's capital region (Paakaupunkiseutu).

Menu-driven text RPG with procedural pixel art, turn-based combat, and dry Finnish humor.

## How to Play

Open `index.html` in any modern browser. No build step, no server, no dependencies.

## Features

- **4 regions** to explore: Helsinki, Espoo, Vantaa, and Kauniainen, each with unique monsters, NPCs, shops, and pixel art
- **Turn-based combat** with stance system (Aggressive / Defensive / Magic)
- **12 character levels** across 3 classes: Warrior, Mage, Rogue
- **33 unique monsters** including a two-phase dragon boss fight
- **Day/night cycle** that affects which monsters appear, forest atmosphere, and visual tinting
- **AI adventurers** who progress alongside you, appear in taverns and forests, and generate news
- **Tavern charm system** with flirtable NPCs per region, each with dialogue trees and unique rewards
- **Helsinki Hold'em** dice game in the tavern
- **Quest board** with kill quests, the Sampo fragment collection chain, and region-specific objectives
- **Random forest events** with choices and persistent consequences
- **Equipment system** with weapons, armor, accessories, and consumables
- **Procedural pixel art** for all scenes, monsters, NPCs, and locations (no external assets)
- **Web Audio sound effects and music** with per-screen procedural chiptune tracks
- **Combat animations** with screen flash, shake, and per-action visual feedback
- **Save/load** via localStorage

## The Story

The ancient dragon Lohikaarme stirs beneath the hills of Kauniainen. As an adventurer arriving in Helsinki, you must grow strong enough across four municipalities to challenge it. Gather the four fragments of the mythical Sampo, forge the dragon-slaying blade, and save the capital region.

## Monsters

A mix of Finnish mythology, urban fantasy, and absurdist humor:

| Region | Examples |
|--------|----------|
| Helsinki | Rautatie-Rotta (metro rat), Kaljatrolli (beer troll), Kallio-Vampyyri (gentrified vampire), Kahvizombi (coffee zombie) |
| Espoo | Nuuksion Hiisi (forest demon), Koodihirvio (code monster), Startup-Golemi (pitch deck golem), WLAN-Haamu (dead router ghost) |
| Vantaa | Lentokenttadrake (airport drake), Tullidemoni (customs demon), Bussi 666 (possessed HSL bus), Kiitotiesusi (runway wolf) |
| Kauniainen | Jainen Louhitar (ice witch), Sammon Varjo (reality vortex), Revontulihai (aurora borealis shark), Sammakkoprinssi (royal frog) |

## Controls

- **Number keys 1-9** or **click** to select menu options
- **M** button in status bar to toggle music
- **S** button in status bar to toggle sound effects

## Tech Stack

- HTML5 + CSS + vanilla JavaScript (single file, no frameworks)
- Canvas 2D for pixel art (320x200 native, scaled up)
- Web Audio API for procedural sound effects and music
- Press Start 2P font for retro aesthetic
- localStorage for save games

## Project Structure

```
legend-of-helsinki/
  index.html          Entry point
  css/style.css       BBS terminal theme
  js/game.js          Bundled game (runs in browser)
  js/*.js             Source modules (reference)
```

The game runs from `js/game.js`, a single bundled file. The individual module files in `js/` are the original source files kept for reference and development.

## Credits

Inspired by **Legend of the Red Dragon** (1989) by Seth Able Robinson.

Built with Claude Code (Anthropic).

## License

MIT
