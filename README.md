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

**Abilities.** Standard array, point buy with a live 27-point budget, manual entry,
or 4d6-drop-lowest. Racial, feat, level, and class increases are applied separately
and shown as a breakdown.

**Race.** Every Player's Handbook race and subrace, plus Variant Human and Custom
Lineage. Draconic ancestry, size choices, extra languages, and racial skill and tool
picks are all wired to the sheet.

**Background.** All thirteen Player's Handbook backgrounds with their variants, plus
Customizing a Background.

**Class.** All twelve Player's Handbook classes and the Artificer, with full level
progressions: hit dice, saving throws, armor and weapon proficiencies, skill and tool
choices, expertise, and every class feature from 1st to 20th level. Resource columns
such as rages, ki points, sneak attack dice, sorcery points, invocations known, and
infusions known follow the level you set. Feature choices are offered where the class
asks for them: fighting styles, metamagic, eldritch invocations with their boon and
level prerequisites, artificer infusions, pact boons, and the ranger's favored enemy
and terrain.

**Multiclassing.** Up to four classes, with prerequisites checked against your live
scores. Saving throw proficiencies come from the first class only, later classes grant
their reduced proficiency lists, and spell slots combine on the multiclass table while
Pact Magic stays separate.

**Hit points.** Fixed average, rolled, or entered by hand.

**Spellcasting.** Save DC, spell attack bonus, cantrips known, spells known or
prepared, ritual casting, spellbooks, focus, and the full slot table.

**Feats.** All Player's Handbook feats, the Tasha's feats, and the Xanathar's racial
feats, with prerequisites checked against your current scores and proficiencies.

**Optional rules.** Customizing Your Origin, Customizing a Background, Feats,
Multiclassing, and Tasha's Optional Class Features, each behind its own toggle.


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
