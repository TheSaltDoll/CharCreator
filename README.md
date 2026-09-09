# D&D 5e Character Builder

A static character builder for fifth edition, drawing on the Player's Handbook (2014),
Tasha's Cauldron of Everything, and Xanathar's Guide to Everything. No build step, no
dependencies, no server. Open `index.html` and it runs.

## Deploying to GitHub Pages

1. Push this folder to a repository.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/` within a minute or two.

Scripts are plain `<script>` tags rather than ES modules, so the page also works when
opened directly from disk with `file://`. The only network request is the Google Fonts
stylesheet; if it fails, the page falls back to Georgia and a system sans and stays
entirely usable.

## What this build covers

Everything that does not depend on a class:

- **Level 1–20**, with proficiency bonus and XP threshold.
- **Ability scores** by standard array, point buy (with a live 27-point budget),
  manual entry, or rolled 4d6-drop-lowest with assignment.
- **All PHB races and subraces**, plus Variant Human and Tasha's Custom Lineage.
  Racial choices are offered inline: the dwarf's artisan tools, the high elf's wizard
  cantrip, draconic ancestry, half-elf skill versatility, Custom Lineage's size and
  variable trait.
- **All 13 PHB backgrounds** with their variants, tool and language choices, and
  features.
- **Feats** — 42 from the PHB, 15 from Tasha's, 15 racial feats from Xanathar's.
  Prerequisites are checked against the live sheet and failing feats are disabled with
  the reason shown. Feats that require a class feature are marked with a dagger rather
  than blocked, since the class module isn't in yet.
- **Ability Score Improvements** at levels 4, 8, 12, 16, and 19, each spendable on
  +2/+1+1 or traded for a feat.

Optional rules, each behind a toggle:

- **Customizing Your Origin** (TCE 8) — reassign racial ability increases to any
  scores, swap racial languages, and trade racial proficiencies under the Proficiency
  Swaps table.
- **Customizing a Background** (PHB 125) — any two skills, any two tools or languages.
- **Feats** (PHB 165) — required before Variant Human and Custom Lineage unlock.

Calculated live in the right-hand sheet: ability modifiers, proficiency bonus,
initiative, speed, size, creature type, darkvision, bonus hit points per level, all
eighteen skill bonuses with expertise, passive Perception/Investigation/Insight,
saving throw bonuses, armor/weapon/tool/language proficiencies with their sources,
breath weapon save DC, and racial spellcasting.

The sheet also tracks what is still owed — every unmade choice appears under
*Still to choose* — and flags conflicts, such as a background skill duplicating a
racial one, or an ability score that would exceed 20.

Characters save to and load from JSON files.

## What comes next

Class, subclass, hit points, armor class, class saving throw proficiencies, spell
slots, and spell selection. The engine already has the seams for these:
`saveProfs` and `hpPerLevel` accumulate from any source, and `DND.BASE_ASI_LEVELS`
is the only place that assumes the standard 4/8/12/16/19 progression — fighters and
rogues will override it from class data.

## Files

```
index.html          page shell and the six numbered steps
css/style.css       all styling
data/rules.js       abilities, skills, languages, tools, weapons,
                    proficiency bonus, point buy, standard array, XP
data/races.js       races, subraces, draconic ancestry, Custom Lineage
data/backgrounds.js the 13 PHB backgrounds and their variants
data/feats.js       PHB, Tasha's, and Xanathar's racial feats
js/engine.js        pure derivation — state in, computed sheet out
js/ui.js            DOM helpers and shared form widgets
js/app.js           state, section rendering, save/load
```

`js/engine.js` touches no DOM, so it can be tested in Node directly:

```js
global.window = global;
require('./data/rules.js'); require('./data/races.js');
require('./data/backgrounds.js'); require('./data/feats.js');
require('./js/engine.js');

const s = DND.Engine.blankState();
s.raceId = 'dwarf'; s.subraceId = 'hillDwarf'; s.backgroundId = 'soldier';
console.log(DND.Engine.build(s));
```

## Adding content

Every entry is data, not code. A new race is an object in `DND.RACES` with `asi`,
`size`, `speed`, `languages`, and optional `skills` / `tools` / `armor` / `weapons`
arrays. Anything the player must pick goes in a `choices` array as
`{ id, label, type, count, from }`, where `type` is `skill`, `tool`, `ancestry`, or
`option`; the renderer builds the right control and the engine folds the result into
the sheet. Backgrounds and feats follow the same shape.

## A note on the source books

This implements the game's mechanics — the numbers, progressions, and proficiency
logic. Feature and trait descriptions are short mechanical summaries written for this
project, each carrying a book-and-page citation so you can read the full wording in
your own copy. It is a calculator, not a substitute for the books.

Dungeons & Dragons is a trademark of Wizards of the Coast. This is an unofficial
personal tool with no affiliation to or endorsement by Wizards of the Coast.
