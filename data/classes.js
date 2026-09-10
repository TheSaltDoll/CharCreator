/* Classes. PHB 2014 ch.3; Artificer from TCE ch.1.
   Feature notes are short mechanical summaries; full wording is in the book at
   the cited page. Progression tables are hand-encoded and verified against the
   source, since the scanned tables do not extract reliably. */
window.DND = window.DND || {};

/* ---------------------------------------------------------------
   Spell slot tables. Index 0 is unused; index n is character level n.
   --------------------------------------------------------------- */
DND.SLOTS_FULL = [
  null,
  [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
  [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* Warlock Pact Magic: {slots, level}. */
DND.PACT_MAGIC = [
  null,
  { slots: 1, level: 1 }, { slots: 2, level: 1 }, { slots: 2, level: 2 }, { slots: 2, level: 2 },
  { slots: 2, level: 3 }, { slots: 2, level: 3 }, { slots: 2, level: 4 }, { slots: 2, level: 4 },
  { slots: 2, level: 5 }, { slots: 2, level: 5 }, { slots: 3, level: 5 }, { slots: 3, level: 5 },
  { slots: 3, level: 5 }, { slots: 3, level: 5 }, { slots: 3, level: 5 }, { slots: 3, level: 5 },
  { slots: 4, level: 5 }, { slots: 4, level: 5 }, { slots: 4, level: 5 }, { slots: 4, level: 5 }
];

/* Caster level contributed toward the shared slot table.
   PHB 164 for multiclassing; TCE 10 for the artificer's round-up. */
DND.casterLevel = function (casterType, classLevel, forMulticlass) {
  switch (casterType) {
    case 'full': return classLevel;
    case 'half':
      if (forMulticlass) return Math.floor(classLevel / 2);
      return classLevel < 2 ? 0 : Math.ceil(classLevel / 2);
    case 'artificer': return Math.ceil(classLevel / 2);
    case 'third': return Math.floor(classLevel / 3);
    default: return 0;
  }
};

/* Shorthand builders for level-indexed columns. */
function ramp(pairs) {
  /* ramp([[1,2],[6,3]]) => value 2 from level 1, 3 from level 6 */
  var out = [null];
  for (var lv = 1; lv <= 20; lv++) {
    var v = null;
    for (var i = 0; i < pairs.length; i++) if (lv >= pairs[i][0]) v = pairs[i][1];
    out[lv] = v;
  }
  return out;
}
function fromList(list) { return [null].concat(list); }

DND.CLASSES = [

  /* ============================ BARBARIAN ============================ */
  {
    id: 'barbarian', name: 'Barbarian', source: 'PHB 46',
    hitDie: 12, primary: ['str'], saves: ['str', 'con'],
    armor: ['Light armor', 'Medium armor', 'Shields'],
    weaponCategories: ['Simple weapons', 'Martial weapons'],
    skills: { count: 2, from: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'] },
    subclass: { level: 3, label: 'Primal Path' },
    multiclass: {
      prereq: { str: 13 },
      armor: ['Shields'], weaponCategories: ['Simple weapons', 'Martial weapons']
    },
    unarmoredDefense: { abilities: ['dex', 'con'], shieldAllowed: true },
    columns: [
      { id: 'rages', label: 'Rages', values: fromList([2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, '\u221e']) },
      { id: 'rageDamage', label: 'Rage damage', values: ramp([[1, '+2'], [9, '+3'], [16, '+4']]) }
    ],
    features: [
      { level: 1, name: 'Rage', text: 'Bonus action. Advantage on Strength checks and saves, bonus melee damage, resistance to bludgeoning, piercing, and slashing. Lasts 1 minute.' },
      { level: 1, name: 'Unarmored Defense', text: 'While wearing no armor, AC equals 10 + Dexterity modifier + Constitution modifier. A shield still applies.' },
      { level: 2, name: 'Reckless Attack', text: 'Gain advantage on Strength melee attacks this turn; attacks against you have advantage until your next turn.' },
      { level: 2, name: 'Danger Sense', text: 'Advantage on Dexterity saves against effects you can see.' },
      { level: 5, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
      { level: 5, name: 'Fast Movement', text: 'Speed increases by 10 feet while not wearing heavy armor.', speed: 10 },
      { level: 7, name: 'Feral Instinct', text: 'Advantage on initiative. If surprised, you may act by entering a rage first.' },
      { level: 9, name: 'Brutal Critical', text: 'Roll one additional weapon damage die on a critical hit.' },
      { level: 11, name: 'Relentless Rage', text: 'When dropped to 0 hit points while raging, make a DC 10 Constitution save to drop to 1 instead. DC rises by 5 each use.' },
      { level: 13, name: 'Brutal Critical (2 dice)', text: 'Two additional weapon damage dice on a critical hit.' },
      { level: 15, name: 'Persistent Rage', text: 'Your rage ends early only if you fall unconscious or choose to end it.' },
      { level: 17, name: 'Brutal Critical (3 dice)', text: 'Three additional weapon damage dice on a critical hit.' },
      { level: 18, name: 'Indomitable Might', text: 'If a Strength check totals less than your Strength score, use the score instead.' },
      { level: 20, name: 'Primal Champion', text: 'Strength and Constitution increase by 4, and their maximum becomes 24.',
        asi: { str: 4, con: 4 }, raiseMax: { str: 24, con: 24 } }
    ]
  },

  /* ============================== BARD =============================== */
  {
    id: 'bard', name: 'Bard', source: 'PHB 51',
    hitDie: 8, primary: ['cha'], saves: ['dex', 'cha'],
    armor: ['Light armor'],
    weaponCategories: ['Simple weapons'],
    weapons: ['Hand crossbow', 'Longsword', 'Rapier', 'Shortsword'],
    toolChoices: [{ id: 'bardInstruments', label: 'Musical instruments', count: 3, from: 'instrument' }],
    skills: { count: 3, from: 'all' },
    subclass: { level: 3, label: 'Bard College' },
    multiclass: {
      prereq: { cha: 13 },
      armor: ['Light armor'],
      skills: { count: 1, from: 'all' },
      toolChoices: [{ id: 'bardMcInstrument', label: 'Musical instrument', count: 1, from: 'instrument' }]
    },
    spellcasting: {
      type: 'full', ability: 'cha', prepares: false, ritual: true, focus: 'Musical instrument',
      cantrips: fromList([2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
      known: fromList([4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22])
    },
    expertise: [{ level: 3, count: 2 }, { level: 10, count: 2 }],
    features: [
      { level: 1, name: 'Bardic Inspiration (d6)', text: 'Bonus action. Give a creature a die to add to one ability check, attack roll, or save. Uses equal your Charisma modifier, regained on a long rest.' },
      { level: 2, name: 'Jack of All Trades', text: 'Add half your proficiency bonus, rounded down, to ability checks that do not already include it.' },
      { level: 2, name: 'Song of Rest (d6)', text: 'Allies who spend Hit Dice on a short rest regain an extra d6 hit points.' },
      { level: 3, name: 'Expertise', text: 'Double your proficiency bonus for two skills you are proficient with.' },
      { level: 5, name: 'Bardic Inspiration (d8)', text: 'Your inspiration die becomes a d8.' },
      { level: 5, name: 'Font of Inspiration', text: 'Regain Bardic Inspiration uses on a short rest as well as a long one.' },
      { level: 6, name: 'Countercharm', text: 'Action. Allies within 30 feet gain advantage on saves against being frightened or charmed.' },
      { level: 9, name: 'Song of Rest (d8)', text: 'Your Song of Rest die becomes a d8.' },
      { level: 10, name: 'Bardic Inspiration (d10)', text: 'Your inspiration die becomes a d10.' },
      { level: 10, name: 'Magical Secrets', text: 'Learn two spells from any class list. They count as bard spells for you.', magicalSecrets: 2 },
      { level: 13, name: 'Song of Rest (d10)', text: 'Your Song of Rest die becomes a d10.' },
      { level: 14, name: 'Magical Secrets', text: 'Learn two more spells from any class list.', magicalSecrets: 2 },
      { level: 15, name: 'Bardic Inspiration (d12)', text: 'Your inspiration die becomes a d12.' },
      { level: 17, name: 'Song of Rest (d12)', text: 'Your Song of Rest die becomes a d12.' },
      { level: 18, name: 'Magical Secrets', text: 'Learn two more spells from any class list.', magicalSecrets: 2 },
      { level: 20, name: 'Superior Inspiration', text: 'Regain one Bardic Inspiration use when you roll initiative with none left.' }
    ]
  },

  /* ============================= CLERIC ============================== */
  {
    id: 'cleric', name: 'Cleric', source: 'PHB 56',
    hitDie: 8, primary: ['wis'], saves: ['wis', 'cha'],
    armor: ['Light armor', 'Medium armor', 'Shields'],
    weaponCategories: ['Simple weapons'],
    skills: { count: 2, from: ['history', 'insight', 'medicine', 'persuasion', 'religion'] },
    subclass: { level: 1, label: 'Divine Domain' },
    multiclass: {
      prereq: { wis: 13 },
      armor: ['Light armor', 'Medium armor', 'Shields']
    },
    spellcasting: {
      type: 'full', ability: 'wis', prepares: true, ritual: true, focus: 'Holy symbol',
      preparedFormula: { base: 'level', ability: 'wis' },
      cantrips: fromList([3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5])
    },
    columns: [
      { id: 'channel', label: 'Channel Divinity', values: ramp([[1, '\u2014'], [2, '1/rest'], [6, '2/rest'], [18, '3/rest']]) }
    ],
    features: [
      { level: 1, name: 'Divine Domain', text: 'Choose a domain. It grants spells and features at 1st, 2nd, 6th, 8th, and 17th level.' },
      { level: 2, name: 'Channel Divinity', text: 'Turn Undead, plus your domain\u2019s options. Regained on a short or long rest.' },
      { level: 5, name: 'Destroy Undead (CR 1/2)', text: 'Undead of CR 1/2 or lower are destroyed instead of turned.' },
      { level: 8, name: 'Destroy Undead (CR 1)', text: 'The threshold rises to CR 1.' },
      { level: 10, name: 'Divine Intervention', text: 'Action. Percentile roll under your cleric level calls on your deity for aid. Once per 7 days on a success.' },
      { level: 11, name: 'Destroy Undead (CR 2)', text: 'The threshold rises to CR 2.' },
      { level: 14, name: 'Destroy Undead (CR 3)', text: 'The threshold rises to CR 3.' },
      { level: 17, name: 'Destroy Undead (CR 4)', text: 'The threshold rises to CR 4.' },
      { level: 20, name: 'Divine Intervention Improvement', text: 'Your Divine Intervention succeeds automatically.' }
    ]
  },

  /* ============================== DRUID ============================== */
  {
    id: 'druid', name: 'Druid', source: 'PHB 64',
    hitDie: 8, primary: ['wis'], saves: ['int', 'wis'],
    armor: ['Light armor', 'Medium armor', 'Shields'],
    armorNote: 'Druids will not wear armor or use shields made of metal.',
    weapons: ['Club', 'Dagger', 'Dart', 'Javelin', 'Mace', 'Quarterstaff', 'Scimitar', 'Sickle', 'Sling', 'Spear'],
    tools: ['Herbalism kit'],
    skills: { count: 2, from: ['arcana', 'animalHandling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'] },
    subclass: { level: 2, label: 'Druid Circle' },
    multiclass: {
      prereq: { wis: 13 },
      armor: ['Light armor', 'Medium armor', 'Shields']
    },
    spellcasting: {
      type: 'full', ability: 'wis', prepares: true, ritual: true, focus: 'Druidic focus',
      preparedFormula: { base: 'level', ability: 'wis' },
      cantrips: fromList([2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4])
    },
    columns: [
      { id: 'wildShape', label: 'Wild Shape max CR',
        values: ramp([[1, '\u2014'], [2, '1/4, no swim or fly'], [4, '1/2, no fly'], [8, '1']]) }
    ],
    features: [
      { level: 1, name: 'Druidic', text: 'You know the secret language of druids, and can leave hidden messages in it.' },
      { level: 2, name: 'Wild Shape', text: 'Action. Assume the form of a beast you have seen. Twice per short or long rest, for hours equal to half your druid level.' },
      { level: 2, name: 'Druid Circle', text: 'Choose a circle. It grants features at 2nd, 6th, 10th, and 14th level.' },
      { level: 18, name: 'Timeless Body', text: 'You age more slowly: one year for every ten that pass.' },
      { level: 18, name: 'Beast Spells', text: 'Cast druid spells while in Wild Shape, without material components.' },
      { level: 20, name: 'Archdruid', text: 'Unlimited Wild Shape uses. Ignore verbal and somatic components of druid spells.' }
    ]
  },

  /* ============================= FIGHTER ============================= */
  {
    id: 'fighter', name: 'Fighter', source: 'PHB 70',
    hitDie: 10, primary: ['str', 'dex'], saves: ['str', 'con'],
    armor: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'],
    weaponCategories: ['Simple weapons', 'Martial weapons'],
    skills: { count: 2, from: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'] },
    subclass: { level: 3, label: 'Martial Archetype' },
    asiLevels: [4, 6, 8, 12, 14, 16, 19],
    multiclass: {
      prereqAny: { str: 13, dex: 13 },
      armor: ['Light armor', 'Medium armor', 'Shields'],
      weaponCategories: ['Simple weapons', 'Martial weapons']
    },
    features: [
      { level: 1, name: 'Fighting Style', text: 'Choose a fighting style.',
        choice: { id: 'fighterStyle', label: 'Fighting Style', type: 'fightingStyle', count: 1, list: 'fighter' } },
      { level: 1, name: 'Second Wind', text: 'Bonus action. Regain 1d10 + fighter level hit points. Once per short or long rest.' },
      { level: 2, name: 'Action Surge', text: 'Take one additional action on your turn. Once per short or long rest.' },
      { level: 5, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
      { level: 9, name: 'Indomitable', text: 'Reroll a failed saving throw. Once per long rest.' },
      { level: 11, name: 'Extra Attack (2)', text: 'Attack three times when you take the Attack action.' },
      { level: 13, name: 'Indomitable (2 uses)', text: 'Two uses of Indomitable per long rest.' },
      { level: 17, name: 'Action Surge (2 uses)', text: 'Two uses of Action Surge per short or long rest.' },
      { level: 17, name: 'Indomitable (3 uses)', text: 'Three uses of Indomitable per long rest.' },
      { level: 20, name: 'Extra Attack (3)', text: 'Attack four times when you take the Attack action.' }
    ]
  },

  /* ============================== MONK =============================== */
  {
    id: 'monk', name: 'Monk', source: 'PHB 76',
    hitDie: 8, primary: ['dex', 'wis'], saves: ['str', 'dex'],
    armor: [],
    weaponCategories: ['Simple weapons'],
    weapons: ['Shortsword'],
    toolChoices: [{ id: 'monkTool', label: "Artisan's tools or musical instrument", count: 1, from: 'artisanOrInstrument' }],
    skills: { count: 2, from: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'] },
    subclass: { level: 3, label: 'Monastic Tradition' },
    multiclass: {
      prereq: { dex: 13, wis: 13 },
      weaponCategories: ['Simple weapons'], weapons: ['Shortsword']
    },
    unarmoredDefense: { abilities: ['dex', 'wis'], shieldAllowed: false },
    columns: [
      { id: 'martialArts', label: 'Martial Arts die', values: ramp([[1, 'd4'], [5, 'd6'], [11, 'd8'], [17, 'd10']]) },
      { id: 'ki', label: 'Ki points', values: fromList([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) },
      { id: 'unarmoredMove', label: 'Unarmored Movement', values: ramp([[1, '\u2014'], [2, '+10 ft.'], [6, '+15 ft.'], [10, '+20 ft.'], [14, '+25 ft.'], [18, '+30 ft.']]) }
    ],
    speedByLevel: ramp([[1, 0], [2, 10], [6, 15], [10, 20], [14, 25], [18, 30]]),
    speedNote: 'Unarmored Movement applies only while wearing no armor and carrying no shield.',
    features: [
      { level: 1, name: 'Unarmored Defense', text: 'While wearing no armor and carrying no shield, AC equals 10 + Dexterity modifier + Wisdom modifier.' },
      { level: 1, name: 'Martial Arts', text: 'Use Dexterity for monk weapons and unarmed strikes, roll the Martial Arts die for damage, and make an unarmed strike as a bonus action after attacking.' },
      { level: 2, name: 'Ki', text: 'Spend ki on Flurry of Blows, Patient Defense, and Step of the Wind. Regained on a short or long rest. Ki save DC = 8 + proficiency bonus + Wisdom modifier.' },
      { level: 2, name: 'Unarmored Movement', text: 'Speed increases while wearing no armor and no shield.' },
      { level: 3, name: 'Deflect Missiles', text: 'Reaction. Reduce ranged weapon damage by 1d10 + monk level + Dexterity modifier, and throw the missile back for 1 ki.' },
      { level: 4, name: 'Slow Fall', text: 'Reaction. Reduce falling damage by five times your monk level.' },
      { level: 5, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
      { level: 5, name: 'Stunning Strike', text: 'Spend 1 ki on a melee weapon hit to force a Constitution save or stun until the end of your next turn.' },
      { level: 6, name: 'Ki-Empowered Strikes', text: 'Your unarmed strikes count as magical.' },
      { level: 7, name: 'Evasion', text: 'On a successful Dexterity save against area damage, take none; on a failure, take half.' },
      { level: 7, name: 'Stillness of Mind', text: 'Action. End one effect charming or frightening you.' },
      { level: 10, name: 'Purity of Body', text: 'Immune to disease and poison.' },
      { level: 13, name: 'Tongue of the Sun and Moon', text: 'You understand all spoken languages, and creatures understand you.' },
      { level: 14, name: 'Diamond Soul', text: 'Proficiency in all saving throws. Spend 1 ki to reroll a failed save.',
        allSaves: true },
      { level: 15, name: 'Timeless Body', text: 'You no longer age and cannot be aged magically. You need no food or water.' },
      { level: 18, name: 'Empty Body', text: 'Spend 4 ki to turn invisible for 1 minute with resistance to all damage but force; spend 8 ki to cast astral projection.' },
      { level: 20, name: 'Perfect Self', text: 'Regain 4 ki when you roll initiative with none left.' }
    ]
  },

  /* ============================= PALADIN ============================= */
  {
    id: 'paladin', name: 'Paladin', source: 'PHB 82',
    hitDie: 10, primary: ['str', 'cha'], saves: ['wis', 'cha'],
    armor: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'],
    weaponCategories: ['Simple weapons', 'Martial weapons'],
    skills: { count: 2, from: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'] },
    subclass: { level: 3, label: 'Sacred Oath' },
    multiclass: {
      prereq: { str: 13, cha: 13 },
      armor: ['Light armor', 'Medium armor', 'Shields'],
      weaponCategories: ['Simple weapons', 'Martial weapons']
    },
    spellcasting: {
      type: 'half', ability: 'cha', prepares: true, ritual: false, focus: 'Holy symbol',
      preparedFormula: { base: 'halfLevel', ability: 'cha' },
      startLevel: 2
    },
    features: [
      { level: 1, name: 'Divine Sense', text: 'Action. Detect celestials, fiends, and undead within 60 feet. Uses equal 1 + Charisma modifier per long rest.' },
      { level: 1, name: 'Lay on Hands', text: 'A pool of healing equal to five times your paladin level, restored on a long rest. Spend 5 points to cure a disease or poison.' },
      { level: 2, name: 'Fighting Style', text: 'Choose a fighting style.',
        choice: { id: 'paladinStyle', label: 'Fighting Style', type: 'fightingStyle', count: 1, list: 'paladin' } },
      { level: 2, name: 'Divine Smite', text: 'Expend a spell slot on a melee weapon hit for 2d8 radiant damage, plus 1d8 per slot level above 1st, to a maximum of 5d8. Add 1d8 against undead and fiends.' },
      { level: 3, name: 'Divine Health', text: 'Immune to disease.' },
      { level: 3, name: 'Sacred Oath', text: 'Choose an oath. It grants spells, Channel Divinity options, and features through 20th level.' },
      { level: 5, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
      { level: 6, name: 'Aura of Protection', text: 'You and friendly creatures within 10 feet add your Charisma modifier to saving throws, minimum +1.' },
      { level: 10, name: 'Aura of Courage', text: 'You and friendly creatures within 10 feet cannot be frightened.' },
      { level: 11, name: 'Improved Divine Smite', text: 'Melee weapon hits deal an extra 1d8 radiant damage.' },
      { level: 14, name: 'Cleansing Touch', text: 'Action. End one spell on yourself or a willing creature. Uses equal your Charisma modifier per long rest.' },
      { level: 18, name: 'Aura Improvements', text: 'Your auras extend to 30 feet.' }
    ]
  },

  /* ============================== RANGER ============================= */
  {
    id: 'ranger', name: 'Ranger', source: 'PHB 89',
    hitDie: 10, primary: ['dex', 'wis'], saves: ['str', 'dex'],
    armor: ['Light armor', 'Medium armor', 'Shields'],
    weaponCategories: ['Simple weapons', 'Martial weapons'],
    skills: { count: 3, from: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'] },
    subclass: { level: 3, label: 'Ranger Archetype' },
    multiclass: {
      prereq: { dex: 13, wis: 13 },
      armor: ['Light armor', 'Medium armor', 'Shields'],
      weaponCategories: ['Simple weapons', 'Martial weapons'],
      skills: { count: 1, from: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'] }
    },
    spellcasting: {
      type: 'half', ability: 'wis', prepares: false, ritual: false, focus: 'None',
      startLevel: 2,
      known: fromList([0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11])
    },
    features: [
      { level: 1, name: 'Favored Enemy', text: 'Advantage on Survival checks to track your chosen enemies and on Intelligence checks to recall lore about them. Learn one of their languages.',
        choice: { id: 'favoredEnemy1', label: 'Favored enemy', type: 'favoredEnemy', count: 1 } },
      { level: 1, name: 'Natural Explorer', text: 'Choose a favored terrain. Double your proficiency bonus on Intelligence and Wisdom checks there, plus travel benefits.',
        choice: { id: 'terrain1', label: 'Favored terrain', type: 'terrain', count: 1 } },
      { level: 2, name: 'Fighting Style', text: 'Choose a fighting style.',
        choice: { id: 'rangerStyle', label: 'Fighting Style', type: 'fightingStyle', count: 1, list: 'ranger' } },
      { level: 3, name: 'Primeval Awareness', text: 'Expend a spell slot to sense whether certain creature types are within 1 mile, or 6 miles in your favored terrain.' },
      { level: 5, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
      { level: 6, name: 'Favored Enemy and Natural Explorer Improvements', text: 'Choose an additional favored enemy and an additional favored terrain.',
        choice: { id: 'favoredEnemy2', label: 'Second favored enemy', type: 'favoredEnemy', count: 1 },
        choice2: { id: 'terrain2', label: 'Second favored terrain', type: 'terrain', count: 1 } },
      { level: 8, name: "Land's Stride", text: 'Move through nonmagical difficult terrain unimpeded. Advantage on saves against plants that impede movement.' },
      { level: 10, name: 'Hide in Plain Sight', text: 'Spend 1 minute camouflaging yourself for a +10 bonus to Stealth while you remain still.' },
      { level: 10, name: 'Natural Explorer Improvement', text: 'Choose a third favored terrain.',
        choice: { id: 'terrain3', label: 'Third favored terrain', type: 'terrain', count: 1 } },
      { level: 14, name: 'Vanish', text: 'Hide as a bonus action. You cannot be tracked by nonmagical means.' },
      { level: 14, name: 'Favored Enemy Improvement', text: 'Choose a third favored enemy.',
        choice: { id: 'favoredEnemy3', label: 'Third favored enemy', type: 'favoredEnemy', count: 1 } },
      { level: 18, name: 'Feral Senses', text: 'No disadvantage against unseen creatures, and you sense invisible creatures within 30 feet.' },
      { level: 20, name: 'Foe Slayer', text: 'Once per turn, add your Wisdom modifier to an attack or damage roll against a favored enemy.' }
    ]
  },

  /* ============================== ROGUE ============================== */
  {
    id: 'rogue', name: 'Rogue', source: 'PHB 94',
    hitDie: 8, primary: ['dex'], saves: ['dex', 'int'],
    armor: ['Light armor'],
    weaponCategories: ['Simple weapons'],
    weapons: ['Hand crossbow', 'Longsword', 'Rapier', 'Shortsword'],
    tools: ["Thieves' tools"],
    skills: { count: 4, from: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'] },
    subclass: { level: 3, label: 'Roguish Archetype' },
    asiLevels: [4, 8, 10, 12, 16, 19],
    multiclass: {
      prereq: { dex: 13 },
      armor: ['Light armor'], tools: ["Thieves' tools"],
      skills: { count: 1, from: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'] }
    },
    expertise: [{ level: 1, count: 2, allowThievesTools: true }, { level: 6, count: 2, allowThievesTools: true }],
    columns: [
      { id: 'sneak', label: 'Sneak Attack', values: (function () {
        var o = [null];
        for (var i = 1; i <= 20; i++) o.push(Math.ceil(i / 2) + 'd6');
        return o;
      })() }
    ],
    features: [
      { level: 1, name: 'Expertise', text: 'Double your proficiency bonus for two skills, or one skill and thieves\u2019 tools.' },
      { level: 1, name: 'Sneak Attack', text: 'Once per turn, add extra damage to a finesse or ranged weapon attack when you have advantage or an ally is adjacent to the target.' },
      { level: 1, name: "Thieves' Cant", text: 'You know the secret argot of thieves and can hide messages in ordinary conversation.' },
      { level: 2, name: 'Cunning Action', text: 'Bonus action to Dash, Disengage, or Hide.' },
      { level: 5, name: 'Uncanny Dodge', text: 'Reaction. Halve the damage of an attack you can see.' },
      { level: 6, name: 'Expertise', text: 'Double your proficiency bonus for two more skills or tools.' },
      { level: 7, name: 'Evasion', text: 'On a successful Dexterity save against area damage, take none; on a failure, take half.' },
      { level: 11, name: 'Reliable Talent', text: 'Treat a d20 roll of 9 or lower as a 10 for any ability check using a proficient skill.' },
      { level: 14, name: 'Blindsense', text: 'Aware of hidden or invisible creatures within 10 feet.' },
      { level: 15, name: 'Slippery Mind', text: 'Proficiency in Wisdom saving throws.', addSave: 'wis' },
      { level: 18, name: 'Elusive', text: 'No attack roll has advantage against you while you are not incapacitated.' },
      { level: 20, name: 'Stroke of Luck', text: 'Turn a miss into a hit, or a failed check into a 20. Once per short or long rest.' }
    ]
  },

  /* ============================ SORCERER ============================= */
  {
    id: 'sorcerer', name: 'Sorcerer', source: 'PHB 99',
    hitDie: 6, primary: ['cha'], saves: ['con', 'cha'],
    armor: [],
    weapons: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light crossbow'],
    skills: { count: 2, from: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'] },
    subclass: { level: 1, label: 'Sorcerous Origin' },
    multiclass: { prereq: { cha: 13 } },
    spellcasting: {
      type: 'full', ability: 'cha', prepares: false, ritual: false, focus: 'Arcane focus',
      cantrips: fromList([4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]),
      known: fromList([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15])
    },
    columns: [
      { id: 'sorceryPoints', label: 'Sorcery points', values: fromList([0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) },
      { id: 'metamagicKnown', label: 'Metamagic known', values: ramp([[1, 0], [3, 2], [10, 3], [17, 4]]) }
    ],
    features: [
      { level: 1, name: 'Sorcerous Origin', text: 'Choose an origin. It grants features at 1st, 6th, 14th, and 18th level.' },
      { level: 2, name: 'Font of Magic', text: 'Convert sorcery points into spell slots and spell slots into sorcery points.' },
      { level: 3, name: 'Metamagic', text: 'Choose Metamagic options to alter your spells.',
        choice: { id: 'metamagic', label: 'Metamagic', type: 'metamagic', countColumn: 'metamagicKnown' } },
      { level: 20, name: 'Sorcerous Restoration', text: 'Regain 4 sorcery points on a short rest.' }
    ]
  },

  /* ============================= WARLOCK ============================= */
  {
    id: 'warlock', name: 'Warlock', source: 'PHB 105',
    hitDie: 8, primary: ['cha'], saves: ['wis', 'cha'],
    armor: ['Light armor'],
    weaponCategories: ['Simple weapons'],
    skills: { count: 2, from: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'] },
    subclass: { level: 1, label: 'Otherworldly Patron' },
    multiclass: {
      prereq: { cha: 13 },
      armor: ['Light armor'], weaponCategories: ['Simple weapons']
    },
    spellcasting: {
      type: 'pact', ability: 'cha', prepares: false, ritual: false, focus: 'Arcane focus',
      cantrips: fromList([2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]),
      known: fromList([2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15])
    },
    columns: [
      { id: 'invocationsKnown', label: 'Invocations known',
        values: fromList([0, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8]) }
    ],
    features: [
      { level: 1, name: 'Otherworldly Patron', text: 'Choose a patron. It grants an expanded spell list and features at 1st, 6th, 10th, and 14th level.' },
      { level: 1, name: 'Pact Magic', text: 'All your slots are the same level and return on a short or long rest.' },
      { level: 2, name: 'Eldritch Invocations', text: 'Fragments of forbidden knowledge that grant lasting abilities.',
        choice: { id: 'invocations', label: 'Eldritch Invocations', type: 'invocation', countColumn: 'invocationsKnown', order: 2 } },
      { level: 3, name: 'Pact Boon', text: 'Choose the gift your patron bestows.',
        choice: { id: 'pactBoon', label: 'Pact Boon', type: 'pactBoon', count: 1, order: 1 } },
      { level: 11, name: 'Mystic Arcanum (6th level)', text: 'Choose one 6th-level spell. Cast it once per long rest without a slot.' },
      { level: 13, name: 'Mystic Arcanum (7th level)', text: 'Choose one 7th-level spell. Cast it once per long rest without a slot.' },
      { level: 15, name: 'Mystic Arcanum (8th level)', text: 'Choose one 8th-level spell. Cast it once per long rest without a slot.' },
      { level: 17, name: 'Mystic Arcanum (9th level)', text: 'Choose one 9th-level spell. Cast it once per long rest without a slot.' },
      { level: 20, name: 'Eldritch Master', text: 'Spend 1 minute to regain all Pact Magic slots. Once per long rest.' }
    ]
  },

  /* ============================== WIZARD ============================= */
  {
    id: 'wizard', name: 'Wizard', source: 'PHB 112',
    hitDie: 6, primary: ['int'], saves: ['int', 'wis'],
    armor: [],
    weapons: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light crossbow'],
    skills: { count: 2, from: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'] },
    subclass: { level: 2, label: 'Arcane Tradition' },
    multiclass: { prereq: { int: 13 } },
    spellcasting: {
      type: 'full', ability: 'int', prepares: true, ritual: true, focus: 'Arcane focus',
      preparedFormula: { base: 'level', ability: 'int' },
      cantrips: fromList([3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]),
      spellbook: true
    },
    features: [
      { level: 1, name: 'Arcane Recovery', text: 'Once per day on a short rest, recover spell slots totalling half your wizard level, rounded up, none above 5th.' },
      { level: 2, name: 'Arcane Tradition', text: 'Choose a school. It grants features at 2nd, 6th, 10th, and 14th level.' },
      { level: 18, name: 'Spell Mastery', text: 'Choose a 1st- and a 2nd-level spell you can cast at will without a slot.' },
      { level: 20, name: 'Signature Spells', text: 'Choose two 3rd-level spells. Cast each once per short rest without a slot.' }
    ]
  },

  /* ============================ ARTIFICER ============================ */
  {
    id: 'artificer', name: 'Artificer', source: 'TCE 9',
    hitDie: 8, primary: ['int'], saves: ['con', 'int'],
    armor: ['Light armor', 'Medium armor', 'Shields'],
    weaponCategories: ['Simple weapons'],
    tools: ["Thieves' tools", "Tinker's tools"],
    toolChoices: [{ id: 'artificerTool', label: "Artisan's tools", count: 1, from: 'artisan' }],
    skills: { count: 2, from: ['arcana', 'history', 'investigation', 'medicine', 'nature', 'perception', 'sleightOfHand'] },
    subclass: { level: 3, label: 'Artificer Specialist' },
    multiclass: {
      prereq: { int: 13 },
      armor: ['Light armor', 'Medium armor', 'Shields'],
      tools: ["Thieves' tools", "Tinker's tools"]
    },
    spellcasting: {
      type: 'artificer', ability: 'int', prepares: true, ritual: true, focus: "Thieves' tools or artisan's tools",
      preparedFormula: { base: 'halfLevelRoundUp', ability: 'int' },
      cantrips: fromList([2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4])
    },
    columns: [
      { id: 'infusionsKnown', label: 'Infusions known',
        values: ramp([[1, 0], [2, 4], [6, 6], [10, 8], [14, 10], [18, 12]]) },
      { id: 'infusedItems', label: 'Infused items',
        values: ramp([[1, 0], [2, 2], [6, 3], [10, 4], [14, 5], [18, 6]]) }
    ],
    features: [
      { level: 1, name: 'Magical Tinkering', text: 'Give a Tiny object a minor magical property: light, a recorded message, an odor, a sound, or a static image.' },
      { level: 2, name: 'Infuse Item', text: 'Imbue mundane items with magic. Your infusions are chosen from the artificer infusion list.',
        choice: { id: 'infusions', label: 'Infusions known', type: 'infusion', countColumn: 'infusionsKnown' } },
      { level: 3, name: 'The Right Tool for the Job', text: "Spend 1 hour with thieves' tools or artisan's tools to create one set of artisan's tools." },
      { level: 6, name: 'Tool Expertise', text: 'Double your proficiency bonus for any tool you are proficient with.' },
      { level: 7, name: 'Flash of Genius', text: 'Reaction. Add your Intelligence modifier to a nearby creature\u2019s ability check or save. Uses equal your Intelligence modifier per long rest.' },
      { level: 10, name: 'Magic Item Adept', text: 'Attune to four magic items, and craft common and uncommon items in a quarter the time at half the cost.' },
      { level: 11, name: 'Spell-Storing Item', text: 'Store a 1st- or 2nd-level artificer spell in an item, castable a number of times equal to twice your Intelligence modifier.' },
      { level: 14, name: 'Magic Item Savant', text: 'Attune to five magic items, and ignore all class, race, spell, and level requirements on magic items.' },
      { level: 18, name: 'Magic Item Master', text: 'Attune to six magic items.' },
      { level: 20, name: 'Soul of Artifice', text: '+1 to saving throws per attuned magic item. Drop to 1 hit point instead of 0 by ending one infusion.' }
    ]
  }
];

DND.findClass = function (id) {
  for (var i = 0; i < DND.CLASSES.length; i++) if (DND.CLASSES[i].id === id) return DND.CLASSES[i];
  return null;
};

/* Value of a class table column at a given level. */
DND.columnValue = function (cls, columnId, level) {
  if (!cls.columns) return null;
  for (var i = 0; i < cls.columns.length; i++) {
    if (cls.columns[i].id === columnId) return cls.columns[i].values[level];
  }
  return null;
};
