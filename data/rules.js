/* Core rules reference tables. PHB 2014, TCE, XGE.
   Namespace: window.DND */
window.DND = window.DND || {};

DND.ABILITIES = [
  { id: 'str', name: 'Strength',     abbr: 'STR' },
  { id: 'dex', name: 'Dexterity',    abbr: 'DEX' },
  { id: 'con', name: 'Constitution', abbr: 'CON' },
  { id: 'int', name: 'Intelligence', abbr: 'INT' },
  { id: 'wis', name: 'Wisdom',       abbr: 'WIS' },
  { id: 'cha', name: 'Charisma',     abbr: 'CHA' }
];

DND.SKILLS = [
  { id: 'acrobatics',     name: 'Acrobatics',      ability: 'dex' },
  { id: 'animalHandling', name: 'Animal Handling', ability: 'wis' },
  { id: 'arcana',         name: 'Arcana',          ability: 'int' },
  { id: 'athletics',      name: 'Athletics',       ability: 'str' },
  { id: 'deception',      name: 'Deception',       ability: 'cha' },
  { id: 'history',        name: 'History',         ability: 'int' },
  { id: 'insight',        name: 'Insight',         ability: 'wis' },
  { id: 'intimidation',   name: 'Intimidation',    ability: 'cha' },
  { id: 'investigation',  name: 'Investigation',   ability: 'int' },
  { id: 'medicine',       name: 'Medicine',        ability: 'wis' },
  { id: 'nature',         name: 'Nature',          ability: 'int' },
  { id: 'perception',     name: 'Perception',      ability: 'wis' },
  { id: 'performance',    name: 'Performance',     ability: 'cha' },
  { id: 'persuasion',     name: 'Persuasion',      ability: 'cha' },
  { id: 'religion',       name: 'Religion',        ability: 'int' },
  { id: 'sleightOfHand',  name: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth',        name: 'Stealth',         ability: 'dex' },
  { id: 'survival',       name: 'Survival',        ability: 'wis' }
];

/* PHB p.123. Tasha's "Customizing Your Origin" allows any race language to be
   swapped for one on the standard-swap list (the 16 below marked swap:true). */
DND.LANGUAGES = [
  { id: 'common',       name: 'Common',        type: 'standard', swap: true },
  { id: 'dwarvish',     name: 'Dwarvish',      type: 'standard', swap: true },
  { id: 'elvish',       name: 'Elvish',        type: 'standard', swap: true },
  { id: 'giant',        name: 'Giant',         type: 'standard', swap: true },
  { id: 'gnomish',      name: 'Gnomish',       type: 'standard', swap: true },
  { id: 'goblin',       name: 'Goblin',        type: 'standard', swap: true },
  { id: 'halfling',     name: 'Halfling',      type: 'standard', swap: true },
  { id: 'orc',          name: 'Orc',           type: 'standard', swap: true },
  { id: 'abyssal',      name: 'Abyssal',       type: 'exotic',   swap: true },
  { id: 'celestial',    name: 'Celestial',     type: 'exotic',   swap: true },
  { id: 'draconic',     name: 'Draconic',      type: 'exotic',   swap: true },
  { id: 'deepSpeech',   name: 'Deep Speech',   type: 'exotic',   swap: true },
  { id: 'infernal',     name: 'Infernal',      type: 'exotic',   swap: true },
  { id: 'primordial',   name: 'Primordial',    type: 'exotic',   swap: true },
  { id: 'sylvan',       name: 'Sylvan',        type: 'exotic',   swap: true },
  { id: 'undercommon',  name: 'Undercommon',   type: 'exotic',   swap: true },
  { id: 'druidic',      name: 'Druidic',       type: 'secret',   swap: false },
  { id: 'thievesCant',  name: "Thieves' Cant", type: 'secret',   swap: false }
];

/* PHB p.154. Grouped so the UI can offer "one type of artisan's tools" etc. */
DND.TOOLS = {
  artisan: {
    label: "Artisan's tools",
    items: [
      "Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies",
      "Carpenter's tools", "Cartographer's tools", "Cobbler's tools",
      "Cook's utensils", "Glassblower's tools", "Jeweler's tools",
      "Leatherworker's tools", "Mason's tools", "Painter's supplies",
      "Potter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools",
      "Woodcarver's tools"
    ]
  },
  gaming: {
    label: 'Gaming set',
    items: ['Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set']
  },
  instrument: {
    label: 'Musical instrument',
    items: [
      'Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn',
      'Pan flute', 'Shawm', 'Viol'
    ]
  },
  kit: {
    label: 'Kit',
    items: [
      'Disguise kit', 'Forgery kit', 'Herbalism kit', "Navigator's tools",
      "Poisoner's kit", "Thieves' tools"
    ]
  },
  vehicle: {
    label: 'Vehicles',
    items: ['Vehicles (land)', 'Vehicles (water)']
  }
};

DND.allTools = function () {
  var out = [];
  Object.keys(DND.TOOLS).forEach(function (k) {
    DND.TOOLS[k].items.forEach(function (t) { out.push(t); });
  });
  return out.sort();
};

DND.ARMOR_TYPES = ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'];

DND.SIMPLE_WEAPONS = [
  'Club', 'Dagger', 'Greatclub', 'Handaxe', 'Javelin', 'Light hammer', 'Mace',
  'Quarterstaff', 'Sickle', 'Spear', 'Light crossbow', 'Dart', 'Shortbow', 'Sling'
];

DND.MARTIAL_WEAPONS = [
  'Battleaxe', 'Flail', 'Glaive', 'Greataxe', 'Greatsword', 'Halberd', 'Lance',
  'Longsword', 'Maul', 'Morningstar', 'Pike', 'Rapier', 'Scimitar', 'Shortsword',
  'Trident', 'War pick', 'Warhammer', 'Whip', 'Blowgun', 'Hand crossbow',
  'Heavy crossbow', 'Longbow', 'Net'
];

/* PHB p.15. Proficiency bonus by character level. */
DND.proficiencyBonus = function (level) {
  return 2 + Math.floor((Math.max(1, Math.min(20, level)) - 1) / 4);
};

DND.abilityModifier = function (score) {
  return Math.floor((score - 10) / 2);
};

DND.formatMod = function (n) {
  return (n >= 0 ? '+' : '\u2212') + Math.abs(n);
};

/* Ability score generation. PHB p.13 (standard array, point buy, 4d6 drop lowest). */
DND.STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

DND.POINT_BUY = {
  budget: 27,
  min: 8,
  max: 15,
  cost: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
};

DND.rollAbilityScore = function () {
  var d = [];
  for (var i = 0; i < 4; i++) d.push(1 + Math.floor(Math.random() * 6));
  d.sort(function (a, b) { return b - a; });
  return { total: d[0] + d[1] + d[2], dice: d };
};

/* Character levels at which nearly every class grants an Ability Score
   Improvement. Fighter (6, 14) and Rogue (10) gain extras; that lives in the
   class data added in the next phase. */
DND.BASE_ASI_LEVELS = [4, 8, 12, 16, 19];

DND.XP_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

DND.SIZES = {
  Small: { space: '5 ft.', note: 'Small' },
  Medium: { space: '5 ft.', note: 'Medium' }
};
