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

/* Every weapon in the Player's Handbook, PHB 149. Parsed from the OCR'd table
   row by row, then checked field by field against an independent list; the
   table is one of the few in the scan that survived intact. `kind` is the
   table the weapon sits in, so a dagger is melee even though it can be thrown.
   `properties` holds the bare property names for filtering; `text` is the
   entry as printed. Cost and weight are carried for the equipment step. */
DND.WEAPONS = [
  { name: 'Club',           category: 'simple', kind: 'melee', cost: '1 sp',  damage: '1d4 bludgeoning',   weight: 2,   
    properties: ['light'],
    text: 'Light' },
  { name: 'Dagger',         category: 'simple', kind: 'melee', cost: '2 gp',  damage: '1d4 piercing',      weight: 1,   
    properties: ['finesse', 'light', 'thrown'], range: '20/60',
    text: 'Finesse, light, thrown (range 20/60)' },
  { name: 'Greatclub',      category: 'simple', kind: 'melee', cost: '2 sp',  damage: '1d8 bludgeoning',   weight: 10,  
    properties: ['two-handed'],
    text: 'Two-handed' },
  { name: 'Handaxe',        category: 'simple', kind: 'melee', cost: '5 gp',  damage: '1d6 slashing',      weight: 2,   
    properties: ['light', 'thrown'], range: '20/60',
    text: 'Light, thrown (range 20/60)' },
  { name: 'Javelin',        category: 'simple', kind: 'melee', cost: '5 sp',  damage: '1d6 piercing',      weight: 2,   
    properties: ['thrown'], range: '30/120',
    text: 'Thrown (range 30/120)' },
  { name: 'Light hammer',   category: 'simple', kind: 'melee', cost: '2 gp',  damage: '1d4 bludgeoning',   weight: 2,   
    properties: ['light', 'thrown'], range: '20/60',
    text: 'Light, thrown (range 20/60)' },
  { name: 'Mace',           category: 'simple', kind: 'melee', cost: '5 gp',  damage: '1d6 bludgeoning',   weight: 4,   
    properties: [],
    text: '' },
  { name: 'Quarterstaff',   category: 'simple', kind: 'melee', cost: '2 sp',  damage: '1d6 bludgeoning',   weight: 4,   
    properties: ['versatile'], versatile: '1d8',
    text: 'Versatile (1d8)' },
  { name: 'Sickle',         category: 'simple', kind: 'melee', cost: '1 gp',  damage: '1d4 slashing',      weight: 2,   
    properties: ['light'],
    text: 'Light' },
  { name: 'Spear',          category: 'simple', kind: 'melee', cost: '1 gp',  damage: '1d6 piercing',      weight: 3,   
    properties: ['thrown', 'versatile'], range: '20/60', versatile: '1d8',
    text: 'Thrown (range 20/60), versatile (1d8)' },
  { name: 'Light crossbow', category: 'simple', kind: 'ranged', cost: '25 gp', damage: '1d8 piercing',      weight: 5,   
    properties: ['ammunition', 'loading', 'two-handed'], range: '80/320',
    text: 'Ammunition (range 80/320), loading, two-handed' },
  { name: 'Dart',           category: 'simple', kind: 'ranged', cost: '5 cp',  damage: '1d4 piercing',      weight: 0.25,
    properties: ['finesse', 'thrown'], range: '20/60',
    text: 'Finesse, thrown (range 20/60)' },
  { name: 'Shortbow',       category: 'simple', kind: 'ranged', cost: '25 gp', damage: '1d6 piercing',      weight: 2,   
    properties: ['ammunition', 'two-handed'], range: '80/320',
    text: 'Ammunition (range 80/320), two-handed' },
  { name: 'Sling',          category: 'simple', kind: 'ranged', cost: '1 sp',  damage: '1d4 bludgeoning',   weight: null,
    properties: ['ammunition'], range: '30/120',
    text: 'Ammunition (range 30/120)' },
  { name: 'Battleaxe',      category: 'martial', kind: 'melee', cost: '10 gp', damage: '1d8 slashing',      weight: 4,   
    properties: ['versatile'], versatile: '1d10',
    text: 'Versatile (1d10)' },
  { name: 'Flail',          category: 'martial', kind: 'melee', cost: '10 gp', damage: '1d8 bludgeoning',   weight: 2,   
    properties: [],
    text: '' },
  { name: 'Glaive',         category: 'martial', kind: 'melee', cost: '20 gp', damage: '1d10 slashing',     weight: 6,   
    properties: ['heavy', 'reach', 'two-handed'],
    text: 'Heavy, reach, two-handed' },
  { name: 'Greataxe',       category: 'martial', kind: 'melee', cost: '30 gp', damage: '1d12 slashing',     weight: 7,   
    properties: ['heavy', 'two-handed'],
    text: 'Heavy, two-handed' },
  { name: 'Greatsword',     category: 'martial', kind: 'melee', cost: '50 gp', damage: '2d6 slashing',      weight: 6,   
    properties: ['heavy', 'two-handed'],
    text: 'Heavy, two-handed' },
  { name: 'Halberd',        category: 'martial', kind: 'melee', cost: '20 gp', damage: '1d10 slashing',     weight: 6,   
    properties: ['heavy', 'reach', 'two-handed'],
    text: 'Heavy, reach, two-handed' },
  { name: 'Lance',          category: 'martial', kind: 'melee', cost: '10 gp', damage: '1d12 piercing',     weight: 6,   
    properties: ['reach', 'special'],
    text: 'Reach, special' },
  { name: 'Longsword',      category: 'martial', kind: 'melee', cost: '15 gp', damage: '1d8 slashing',      weight: 3,   
    properties: ['versatile'], versatile: '1d10',
    text: 'Versatile (1d10)' },
  { name: 'Maul',           category: 'martial', kind: 'melee', cost: '10 gp', damage: '2d6 bludgeoning',   weight: 10,  
    properties: ['heavy', 'two-handed'],
    text: 'Heavy, two-handed' },
  { name: 'Morningstar',    category: 'martial', kind: 'melee', cost: '15 gp', damage: '1d8 piercing',      weight: 4,   
    properties: [],
    text: '' },
  { name: 'Pike',           category: 'martial', kind: 'melee', cost: '5 gp',  damage: '1d10 piercing',     weight: 18,  
    properties: ['heavy', 'reach', 'two-handed'],
    text: 'Heavy, reach, two-handed' },
  { name: 'Rapier',         category: 'martial', kind: 'melee', cost: '25 gp', damage: '1d8 piercing',      weight: 2,   
    properties: ['finesse'],
    text: 'Finesse' },
  { name: 'Scimitar',       category: 'martial', kind: 'melee', cost: '25 gp', damage: '1d6 slashing',      weight: 3,   
    properties: ['finesse', 'light'],
    text: 'Finesse, light' },
  { name: 'Shortsword',     category: 'martial', kind: 'melee', cost: '10 gp', damage: '1d6 piercing',      weight: 2,   
    properties: ['finesse', 'light'],
    text: 'Finesse, light' },
  { name: 'Trident',        category: 'martial', kind: 'melee', cost: '5 gp',  damage: '1d6 piercing',      weight: 4,   
    properties: ['thrown', 'versatile'], range: '20/60', versatile: '1d8',
    text: 'Thrown (range 20/60), versatile (1d8)' },
  { name: 'War pick',       category: 'martial', kind: 'melee', cost: '5 gp',  damage: '1d8 piercing',      weight: 2,   
    properties: [],
    text: '' },
  { name: 'Warhammer',      category: 'martial', kind: 'melee', cost: '15 gp', damage: '1d8 bludgeoning',   weight: 2,   
    properties: ['versatile'], versatile: '1d10',
    text: 'Versatile (1d10)' },
  { name: 'Whip',           category: 'martial', kind: 'melee', cost: '2 gp',  damage: '1d4 slashing',      weight: 3,   
    properties: ['finesse', 'reach'],
    text: 'Finesse, reach' },
  { name: 'Blowgun',        category: 'martial', kind: 'ranged', cost: '10 gp', damage: '1 piercing',        weight: 1,   
    properties: ['ammunition', 'loading'], range: '25/100',
    text: 'Ammunition (range 25/100), loading' },
  { name: 'Hand crossbow',  category: 'martial', kind: 'ranged', cost: '75 gp', damage: '1d6 piercing',      weight: 3,   
    properties: ['ammunition', 'light', 'loading'], range: '30/120',
    text: 'Ammunition (range 30/120), light, loading' },
  { name: 'Heavy crossbow', category: 'martial', kind: 'ranged', cost: '50 gp', damage: '1d10 piercing',     weight: 18,  
    properties: ['ammunition', 'heavy', 'loading', 'two-handed'], range: '100/400',
    text: 'Ammunition (range 100/400), heavy, loading, two-handed' },
  { name: 'Longbow',        category: 'martial', kind: 'ranged', cost: '50 gp', damage: '1d8 piercing',      weight: 2,   
    properties: ['ammunition', 'heavy', 'two-handed'], range: '150/600',
    text: 'Ammunition (range 150/600), heavy, two-handed' },
  { name: 'Net',            category: 'martial', kind: 'ranged', cost: '1 gp',  damage: null,                weight: 3,   
    properties: ['special', 'thrown'], range: '5/15',
    text: 'Special, thrown (range 5/15)' }
];

DND.findWeapon = function (name) {
  for (var i = 0; i < DND.WEAPONS.length; i++) if (DND.WEAPONS[i].name === name) return DND.WEAPONS[i];
  return null;
};
DND.weaponHas = function (name, prop) {
  var w = DND.findWeapon(name);
  return !!(w && w.properties.indexOf(prop) !== -1);
};


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
