/* Races. PHB 2014 ch.2; Custom Lineage from TCE ch.1.
   Trait text is a short mechanical note, not book prose — look up the full
   wording in the cited book and page. */
window.DND = window.DND || {};

/* Wizard cantrips, needed for the high elf Cantrip trait. Moves to the spell
   module when classes land. PHB + XGE. */
DND.WIZARD_CANTRIPS = [
  'Acid Splash', 'Blade Ward', 'Chill Touch', 'Control Flames', 'Create Bonfire',
  'Dancing Lights', 'Fire Bolt', 'Friends', 'Frostbite', 'Gust', 'Infestation',
  'Light', 'Mage Hand', 'Mending', 'Message', 'Mind Sliver', 'Minor Illusion',
  'Mold Earth', 'Poison Spray', 'Prestidigitation', 'Ray of Frost',
  'Shape Water', 'Shocking Grasp', 'Sword Burst', 'Thunderclap',
  'Toll the Dead', 'True Strike'
];

DND.DRACONIC_ANCESTRY = [
  { id: 'black',  name: 'Black',  damage: 'Acid',      breath: '5 by 30 ft. line',  save: 'dex' },
  { id: 'blue',   name: 'Blue',   damage: 'Lightning', breath: '5 by 30 ft. line',  save: 'dex' },
  { id: 'brass',  name: 'Brass',  damage: 'Fire',      breath: '5 by 30 ft. line',  save: 'dex' },
  { id: 'bronze', name: 'Bronze', damage: 'Lightning', breath: '5 by 30 ft. line',  save: 'dex' },
  { id: 'copper', name: 'Copper', damage: 'Acid',      breath: '5 by 30 ft. line',  save: 'dex' },
  { id: 'gold',   name: 'Gold',   damage: 'Fire',      breath: '15 ft. cone',       save: 'dex' },
  { id: 'green',  name: 'Green',  damage: 'Poison',    breath: '15 ft. cone',       save: 'con' },
  { id: 'red',    name: 'Red',    damage: 'Fire',      breath: '15 ft. cone',       save: 'dex' },
  { id: 'silver', name: 'Silver', damage: 'Cold',      breath: '15 ft. cone',       save: 'con' },
  { id: 'white',  name: 'White',  damage: 'Cold',      breath: '15 ft. cone',       save: 'con' }
];

DND.RACES = [
  {
    id: 'dwarf', name: 'Dwarf', source: 'PHB 18',
    asi: { con: 2 }, size: 'Medium', speed: 25,
    speedNote: 'Speed is not reduced by wearing heavy armor.',
    darkvision: 60,
    languages: { fixed: ['common', 'dwarvish'], choose: 0 },
    weapons: ['Battleaxe', 'Handaxe', 'Light hammer', 'Warhammer'],
    traits: [
      { name: 'Dwarven Resilience', text: 'Advantage on saving throws against poison; resistance to poison damage.' },
      { name: 'Dwarven Combat Training', text: 'Proficiency with battleaxe, handaxe, light hammer, and warhammer.' },
      { name: 'Stonecunning', text: 'Count as proficient in History for stonework origin checks, and double your proficiency bonus.' }
    ],
    choices: [
      { id: 'dwarfTool', label: "Artisan's tools", type: 'tool', count: 1,
        from: ["Smith's tools", "Brewer's supplies", "Mason's tools"] }
    ],
    subraces: [
      {
        id: 'hillDwarf', name: 'Hill Dwarf', source: 'PHB 20', asi: { wis: 1 },
        hpPerLevel: 1,
        traits: [{ name: 'Dwarven Toughness', text: 'Hit point maximum increases by 1, and by 1 again at every level.' }]
      },
      {
        id: 'mountainDwarf', name: 'Mountain Dwarf', source: 'PHB 20', asi: { str: 2 },
        armor: ['Light armor', 'Medium armor'],
        traits: [{ name: 'Dwarven Armor Training', text: 'Proficiency with light and medium armor.' }]
      }
    ]
  },

  {
    id: 'elf', name: 'Elf', source: 'PHB 21',
    asi: { dex: 2 }, size: 'Medium', speed: 30, darkvision: 60,
    languages: { fixed: ['common', 'elvish'], choose: 0 },
    skills: ['perception'],
    traits: [
      { name: 'Keen Senses', text: 'Proficiency in Perception.' },
      { name: 'Fey Ancestry', text: 'Advantage on saves against being charmed; magic cannot put you to sleep.' },
      { name: 'Trance', text: 'Meditate 4 hours for the benefit of an 8-hour rest.' }
    ],
    subraces: [
      {
        id: 'highElf', name: 'High Elf', source: 'PHB 23', asi: { int: 1 },
        weapons: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'],
        languages: { choose: 1 },
        traits: [
          { name: 'Elf Weapon Training', text: 'Proficiency with longsword, shortsword, shortbow, and longbow.' },
          { name: 'Cantrip', text: 'Know one wizard cantrip. Intelligence is your spellcasting ability for it.' },
          { name: 'Extra Language', text: 'Speak, read, and write one extra language of your choice.' }
        ],
        choices: [
          { id: 'highElfCantrip', label: 'Wizard cantrip', type: 'option', count: 1, from: DND.WIZARD_CANTRIPS }
        ]
      },
      {
        id: 'woodElf', name: 'Wood Elf', source: 'PHB 24', asi: { wis: 1 },
        speed: 35,
        weapons: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'],
        traits: [
          { name: 'Elf Weapon Training', text: 'Proficiency with longsword, shortsword, shortbow, and longbow.' },
          { name: 'Fleet of Foot', text: 'Base walking speed is 35 feet.' },
          { name: 'Mask of the Wild', text: 'Can attempt to hide when lightly obscured by natural phenomena.' }
        ]
      },
      {
        id: 'darkElf', name: 'Dark Elf (Drow)', source: 'PHB 24', asi: { cha: 1 },
        darkvision: 120,
        weapons: ['Rapier', 'Shortsword', 'Hand crossbow'],
        traits: [
          { name: 'Superior Darkvision', text: 'Darkvision has a range of 120 feet.' },
          { name: 'Sunlight Sensitivity', text: 'Disadvantage on attack rolls and Perception checks relying on sight in direct sunlight.' },
          { name: 'Drow Magic', text: 'Know dancing lights. At 3rd level, cast faerie fire once per long rest; at 5th, darkness once per long rest. Charisma is the spellcasting ability.' },
          { name: 'Drow Weapon Training', text: 'Proficiency with rapier, shortsword, and hand crossbow.' }
        ],
        innateSpells: [
          { level: 1, name: 'Dancing Lights', use: 'at will', ability: 'cha' },
          { level: 3, name: 'Faerie Fire', use: '1/long rest', ability: 'cha' },
          { level: 5, name: 'Darkness', use: '1/long rest', ability: 'cha' }
        ]
      }
    ]
  },

  {
    id: 'halfling', name: 'Halfling', source: 'PHB 26',
    asi: { dex: 2 }, size: 'Small', speed: 25,
    languages: { fixed: ['common', 'halfling'], choose: 0 },
    traits: [
      { name: 'Lucky', text: 'When you roll a 1 on an attack, ability check, or save, reroll and use the new roll.' },
      { name: 'Brave', text: 'Advantage on saving throws against being frightened.' },
      { name: 'Halfling Nimbleness', text: 'Move through the space of any creature larger than you.' }
    ],
    subraces: [
      {
        id: 'lightfoot', name: 'Lightfoot Halfling', source: 'PHB 28', asi: { cha: 1 },
        traits: [{ name: 'Naturally Stealthy', text: 'Can hide when obscured only by a creature at least one size larger.' }]
      },
      {
        id: 'stout', name: 'Stout Halfling', source: 'PHB 28', asi: { con: 1 },
        traits: [{ name: 'Stout Resilience', text: 'Advantage on saves against poison; resistance to poison damage.' }]
      }
    ]
  },

  {
    id: 'human', name: 'Human', source: 'PHB 29',
    asi: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    size: 'Medium', speed: 30,
    languages: { fixed: ['common'], choose: 1 },
    traits: [{ name: 'Extra Language', text: 'Speak, read, and write one extra language of your choice.' }]
  },

  {
    id: 'variantHuman', name: 'Human (Variant)', source: 'PHB 31', optional: true,
    optionalNote: 'Optional rule. Requires your DM to allow feats.',
    asi: { choose: { count: 2, amount: 1, distinct: true } },
    size: 'Medium', speed: 30,
    languages: { fixed: ['common'], choose: 1 },
    grantsFeat: 1,
    traits: [
      { name: 'Ability Score Increase', text: 'Two different ability scores of your choice increase by 1.' },
      { name: 'Skills', text: 'Proficiency in one skill of your choice.' },
      { name: 'Feat', text: 'Gain one feat of your choice.' }
    ],
    choices: [
      { id: 'vhumanSkill', label: 'Skill proficiency', type: 'skill', count: 1, from: 'all' }
    ]
  },

  {
    id: 'dragonborn', name: 'Dragonborn', source: 'PHB 32',
    asi: { str: 2, cha: 1 }, size: 'Medium', speed: 30,
    languages: { fixed: ['common', 'draconic'], choose: 0 },
    traits: [
      { name: 'Draconic Ancestry', text: 'Choose a dragon type. It sets your breath weapon and damage resistance.' },
      { name: 'Breath Weapon', text: 'Exhale destructive energy as an action. DC = 8 + Constitution modifier + proficiency bonus. Damage scales with level. Once per short or long rest.' },
      { name: 'Damage Resistance', text: 'Resistance to the damage type of your ancestry.' }
    ],
    choices: [
      { id: 'draconicAncestry', label: 'Draconic ancestry', type: 'ancestry', count: 1, from: 'draconic' }
    ]
  },

  {
    id: 'gnome', name: 'Gnome', source: 'PHB 35',
    asi: { int: 2 }, size: 'Small', speed: 25, darkvision: 60,
    languages: { fixed: ['common', 'gnomish'], choose: 0 },
    traits: [
      { name: 'Gnome Cunning', text: 'Advantage on Intelligence, Wisdom, and Charisma saves against magic.' }
    ],
    subraces: [
      {
        id: 'forestGnome', name: 'Forest Gnome', source: 'PHB 37', asi: { dex: 1 },
        traits: [
          { name: 'Natural Illusionist', text: 'Know the minor illusion cantrip. Intelligence is your spellcasting ability for it.' },
          { name: 'Speak with Small Beasts', text: 'Communicate simple ideas with Small or smaller beasts.' }
        ],
        innateSpells: [{ level: 1, name: 'Minor Illusion', use: 'at will', ability: 'int' }]
      },
      {
        id: 'rockGnome', name: 'Rock Gnome', source: 'PHB 37', asi: { con: 1 },
        tools: ["Tinker's tools"],
        traits: [
          { name: "Artificer's Lore", text: 'Add double your proficiency bonus to History checks about magic, alchemical, or technological devices.' },
          { name: 'Tinker', text: "Proficiency with tinker's tools. Spend 1 hour and 10 gp to build a tiny clockwork device." }
        ]
      }
    ]
  },

  {
    id: 'halfElf', name: 'Half-Elf', source: 'PHB 38',
    asi: { cha: 2, choose: { count: 2, amount: 1, distinct: true, exclude: ['cha'] } },
    size: 'Medium', speed: 30, darkvision: 60,
    languages: { fixed: ['common', 'elvish'], choose: 1 },
    traits: [
      { name: 'Fey Ancestry', text: 'Advantage on saves against being charmed; magic cannot put you to sleep.' },
      { name: 'Skill Versatility', text: 'Proficiency in two skills of your choice.' }
    ],
    choices: [
      { id: 'halfElfSkills', label: 'Skill proficiencies', type: 'skill', count: 2, from: 'all' }
    ]
  },

  {
    id: 'halfOrc', name: 'Half-Orc', source: 'PHB 40',
    asi: { str: 2, con: 1 }, size: 'Medium', speed: 30, darkvision: 60,
    languages: { fixed: ['common', 'orc'], choose: 0 },
    skills: ['intimidation'],
    traits: [
      { name: 'Menacing', text: 'Proficiency in Intimidation.' },
      { name: 'Relentless Endurance', text: 'When dropped to 0 hit points without being killed outright, drop to 1 instead. Once per long rest.' },
      { name: 'Savage Attacks', text: 'On a critical hit with a melee weapon, roll one of the weapon damage dice an extra time.' }
    ]
  },

  {
    id: 'tiefling', name: 'Tiefling', source: 'PHB 42',
    asi: { int: 1, cha: 2 }, size: 'Medium', speed: 30, darkvision: 60,
    languages: { fixed: ['common', 'infernal'], choose: 0 },
    traits: [
      { name: 'Hellish Resistance', text: 'Resistance to fire damage.' },
      { name: 'Infernal Legacy', text: 'Know thaumaturgy. At 3rd level, cast hellish rebuke as a 2nd-level spell once per long rest; at 5th, darkness once per long rest. Charisma is the spellcasting ability.' }
    ],
    innateSpells: [
      { level: 1, name: 'Thaumaturgy', use: 'at will', ability: 'cha' },
      { level: 3, name: 'Hellish Rebuke (2nd level)', use: '1/long rest', ability: 'cha' },
      { level: 5, name: 'Darkness', use: '1/long rest', ability: 'cha' }
    ]
  },

  {
    id: 'customLineage', name: 'Custom Lineage', source: 'TCE 8', optional: true,
    optionalNote: 'Optional rule from Tasha\u2019s. Replaces choosing a race.',
    asi: { choose: { count: 1, amount: 2, distinct: true } },
    size: 'choice', sizeOptions: ['Small', 'Medium'], speed: 30,
    languages: { fixed: ['common'], choose: 1 },
    grantsFeat: 1,
    creatureType: 'Humanoid',
    noOriginCustomization: true,
    traits: [
      { name: 'Creature Type', text: 'You are a humanoid.' },
      { name: 'Ability Score Increase', text: 'One ability score of your choice increases by 2.' },
      { name: 'Feat', text: 'Gain one feat of your choice for which you qualify.' },
      { name: 'Variable Trait', text: 'Choose darkvision 60 feet, or proficiency in one skill.' }
    ],
    choices: [
      { id: 'lineageVariable', label: 'Variable trait', type: 'option', count: 1,
        from: ['Darkvision 60 feet', 'Skill proficiency'] },
      { id: 'lineageSkill', label: 'Skill proficiency', type: 'skill', count: 1, from: 'all',
        showIf: { choice: 'lineageVariable', equals: 'Skill proficiency' } }
    ]
  }
];

DND.findRace = function (id) {
  for (var i = 0; i < DND.RACES.length; i++) if (DND.RACES[i].id === id) return DND.RACES[i];
  return null;
};

DND.findSubrace = function (race, id) {
  if (!race || !race.subraces) return null;
  for (var i = 0; i < race.subraces.length; i++) if (race.subraces[i].id === id) return race.subraces[i];
  return null;
};
