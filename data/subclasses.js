/* Subclasses. PHB 2014 ch.3.
   Feature names and levels were checked against the book; the notes are short
   mechanical summaries. Granted spell names are validated at load against
   data/spells.js, so a typo here shows up as a console warning rather than a
   silently missing spell. */
window.DND = window.DND || {};

/* Spells known by the third-casters. Index is fighter/rogue level. */
var EK_KNOWN = [null, 0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13];
var EK_CANTRIPS = [null, 0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
var AT_CANTRIPS = [null, 0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

DND.SUBCLASSES = [

/* ============================ BARBARIAN ============================ */
{ id: 'berserker', classId: 'barbarian', name: 'Path of the Berserker', source: 'PHB 49',
  features: [
    { level: 3, name: 'Frenzy', text: 'Rage in a frenzy to make a bonus action melee attack each turn. When the rage ends you suffer one level of exhaustion.' },
    { level: 6, name: 'Mindless Rage', text: 'You cannot be charmed or frightened while raging, and a suspended effect resumes when the rage ends.' },
    { level: 10, name: 'Intimidating Presence', text: 'Action. Frighten one creature within 30 feet with a Wisdom save against DC 8 + proficiency bonus + Charisma modifier.' },
    { level: 14, name: 'Retaliation', text: 'Reaction. Make a melee weapon attack against a creature within 5 feet that damages you.' }
  ]
},
{ id: 'totemWarrior', classId: 'barbarian', name: 'Path of the Totem Warrior', source: 'PHB 50',
  features: [
    { level: 3, name: 'Spirit Seeker', text: 'Cast beast sense and speak with animals as rituals.' },
    { level: 3, name: 'Totem Spirit', text: 'Choose a totem animal. Bear grants resistance to all damage but psychic while raging; eagle gives Dash as a bonus action and denies opportunity attacks; wolf gives allies advantage against creatures near you.',
      choice: { id: 'totem3', label: 'Totem spirit', type: 'list', count: 1,
        from: ['Bear', 'Eagle', 'Wolf'] } },
    { level: 6, name: 'Aspect of the Beast', text: 'Bear doubles carrying capacity and gives advantage on Strength checks to move objects; eagle grants keen sight; wolf lets you track at a fast pace and move stealthily at a normal pace.',
      choice: { id: 'totem6', label: 'Aspect of the Beast', type: 'list', count: 1,
        from: ['Bear', 'Eagle', 'Wolf'] } },
    { level: 10, name: 'Spirit Walker', text: 'Cast commune with nature as a ritual. A totem spirit appears to answer.' },
    { level: 14, name: 'Totemic Attunement', text: 'Bear makes nearby enemies suffer disadvantage attacking others; eagle grants a flying speed while raging; wolf lets you knock a Large or smaller creature prone on a hit.',
      choice: { id: 'totem14', label: 'Totemic Attunement', type: 'list', count: 1,
        from: ['Bear', 'Eagle', 'Wolf'] } }
  ]
},

/* =============================== BARD ============================== */
{ id: 'lore', classId: 'bard', name: 'College of Lore', source: 'PHB 54',
  skills: { count: 3, from: 'all' },
  features: [
    { level: 3, name: 'Bonus Proficiencies', text: 'Proficiency with three skills of your choice.' },
    { level: 3, name: 'Cutting Words', text: 'Reaction. Expend a Bardic Inspiration die to subtract it from a creature\u2019s attack roll, ability check, or damage roll.' },
    { level: 6, name: 'Additional Magical Secrets', text: 'Learn two spells from any class list. They do not count against your spells known.',
      magicalSecrets: 2 },
    { level: 14, name: 'Peerless Skill', text: 'Expend a Bardic Inspiration die to add it to your own ability check.' }
  ]
},
{ id: 'valor', classId: 'bard', name: 'College of Valor', source: 'PHB 55',
  armor: ['Medium armor', 'Shields'], weaponCategories: ['Martial weapons'],
  features: [
    { level: 3, name: 'Bonus Proficiencies', text: 'Proficiency with medium armor, shields, and martial weapons.' },
    { level: 3, name: 'Combat Inspiration', text: 'A creature with your Bardic Inspiration die may add it to a damage roll, or to AC against one attack.' },
    { level: 6, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
    { level: 14, name: 'Battle Magic', text: 'After casting a bard spell, make one weapon attack as a bonus action.' }
  ]
},

/* ============================== CLERIC ============================= */
{ id: 'knowledge', classId: 'cleric', name: 'Knowledge Domain', source: 'PHB 59',
  spells: { 1: ['Command', 'Identify'], 3: ['Augury', 'Suggestion'],
            5: ['Nondetection', 'Speak with Dead'], 7: ['Arcane Eye', 'Confusion'],
            9: ['Legend Lore', 'Scrying'] },
  features: [
    { level: 1, name: 'Blessings of Knowledge', text: 'Learn two languages, and gain proficiency and expertise in two skills from Arcana, History, Nature, and Religion.',
      choice: { id: 'knowledgeSkills', label: 'Skills with expertise', type: 'skill', count: 2,
        from: ['arcana', 'history', 'nature', 'religion'], expertise: true },
      choice2: { id: 'knowledgeLangs', label: 'Languages', type: 'language', count: 2 } },
    { level: 2, name: 'Channel Divinity: Knowledge of the Ages', text: 'Gain proficiency with one skill or tool for 10 minutes.' },
    { level: 6, name: 'Channel Divinity: Read Thoughts', text: 'Read a creature\u2019s surface thoughts for 1 minute, and cast suggestion on it without a slot.' },
    { level: 8, name: 'Potent Spellcasting', text: 'Add your Wisdom modifier to cantrip damage.' },
    { level: 17, name: 'Visions of the Past', text: 'Concentrate for 1 minute to receive visions about an object or your surroundings.' }
  ]
},
{ id: 'life', classId: 'cleric', name: 'Life Domain', source: 'PHB 60',
  armor: ['Heavy armor'],
  spells: { 1: ['Bless', 'Cure Wounds'], 3: ['Lesser Restoration', 'Spiritual Weapon'],
            5: ['Beacon of Hope', 'Revivify'], 7: ['Death Ward', 'Guardian of Faith'],
            9: ['Mass Cure Wounds', 'Raise Dead'] },
  features: [
    { level: 1, name: 'Bonus Proficiency', text: 'Proficiency with heavy armor.' },
    { level: 1, name: 'Disciple of Life', text: 'Healing spells of 1st level or higher restore an extra 2 + the spell\u2019s level hit points.' },
    { level: 2, name: 'Channel Divinity: Preserve Life', text: 'Restore hit points equal to five times your cleric level, divided among creatures within 30 feet, to no more than half their maximum.' },
    { level: 6, name: 'Blessed Healer', text: 'When you heal another creature with a spell, you regain 2 + the spell\u2019s level hit points.' },
    { level: 8, name: 'Divine Strike', text: 'Once per turn, a weapon hit deals an extra 1d8 radiant damage, rising to 2d8 at 14th level.' },
    { level: 17, name: 'Supreme Healing', text: 'Healing dice you would roll are treated as rolling their maximum.' }
  ]
},
{ id: 'light', classId: 'cleric', name: 'Light Domain', source: 'PHB 60',
  spells: { 1: ['Burning Hands', 'Faerie Fire'], 3: ['Flaming Sphere', 'Scorching Ray'],
            5: ['Daylight', 'Fireball'], 7: ['Guardian of Faith', 'Wall of Fire'],
            9: ['Flame Strike', 'Scrying'] },
  features: [
    { level: 1, name: 'Bonus Cantrip', text: 'Learn the light cantrip if you do not already know it.', grantsSpell: 'Light' },
    { level: 1, name: 'Warding Flare', text: 'Reaction. Impose disadvantage on an attack against you. Uses equal your Wisdom modifier per long rest.' },
    { level: 2, name: 'Channel Divinity: Radiance of the Dawn', text: 'Dispel magical darkness within 30 feet and deal 2d10 + cleric level radiant damage, halved on a Constitution save.' },
    { level: 6, name: 'Improved Flare', text: 'Warding Flare can protect another creature within 30 feet.' },
    { level: 8, name: 'Potent Spellcasting', text: 'Add your Wisdom modifier to cantrip damage.' },
    { level: 17, name: 'Corona of Light', text: 'Action. Emit bright light for 1 minute. Enemies in it have disadvantage on saves against fire and radiant spells.' }
  ]
},
{ id: 'nature', classId: 'cleric', name: 'Nature Domain', source: 'PHB 61',
  armor: ['Heavy armor'],
  spells: { 1: ['Animal Friendship', 'Speak with Animals'], 3: ['Barkskin', 'Spike Growth'],
            5: ['Plant Growth', 'Wind Wall'], 7: ['Dominate Beast', 'Grasping Vine'],
            9: ['Insect Plague', 'Tree Stride'] },
  features: [
    { level: 1, name: 'Acolyte of Nature', text: 'Learn one druid cantrip and gain proficiency in one of Animal Handling, Nature, or Survival.',
      choice: { id: 'natureSkill', label: 'Skill proficiency', type: 'skill', count: 1,
        from: ['animalHandling', 'nature', 'survival'] },
      choice2: { id: 'natureCantrip', label: 'Druid cantrip', type: 'spellFromList',
        count: 1, list: 'druid', spellLevel: 0 } },
    { level: 1, name: 'Bonus Proficiency', text: 'Proficiency with heavy armor.' },
    { level: 2, name: 'Channel Divinity: Charm Animals and Plants', text: 'Charm beasts and plants within 30 feet for 1 minute on a failed Wisdom save.' },
    { level: 6, name: 'Dampen Elements', text: 'Reaction. Grant resistance to acid, cold, fire, lightning, or thunder damage to a creature within 30 feet.' },
    { level: 8, name: 'Divine Strike', text: 'Once per turn, a weapon hit deals an extra 1d8 cold, fire, or lightning damage, rising to 2d8 at 14th level.' },
    { level: 17, name: 'Master of Nature', text: 'Command charmed beasts and plants as a bonus action.' }
  ]
},
{ id: 'tempest', classId: 'cleric', name: 'Tempest Domain', source: 'PHB 62',
  armor: ['Heavy armor'], weaponCategories: ['Martial weapons'],
  spells: { 1: ['Fog Cloud', 'Thunderwave'], 3: ['Gust of Wind', 'Shatter'],
            5: ['Call Lightning', 'Sleet Storm'], 7: ['Control Water', 'Ice Storm'],
            9: ['Destructive Wave', 'Insect Plague'] },
  features: [
    { level: 1, name: 'Bonus Proficiencies', text: 'Proficiency with martial weapons and heavy armor.' },
    { level: 1, name: 'Wrath of the Storm', text: 'Reaction. Deal 2d8 lightning or thunder damage to a creature that hits you, halved on a Dexterity save. Uses equal your Wisdom modifier per long rest.' },
    { level: 2, name: 'Channel Divinity: Destructive Wrath', text: 'Deal maximum lightning or thunder damage instead of rolling.' },
    { level: 6, name: 'Thunderbolt Strike', text: 'Lightning damage you deal pushes a Large or smaller creature 10 feet away.' },
    { level: 8, name: 'Divine Strike', text: 'Once per turn, a weapon hit deals an extra 1d8 thunder damage, rising to 2d8 at 14th level.' },
    { level: 17, name: 'Stormborn', text: 'A flying speed equal to your walking speed while not underground or indoors.' }
  ]
},
{ id: 'trickery', classId: 'cleric', name: 'Trickery Domain', source: 'PHB 62',
  spells: { 1: ['Charm Person', 'Disguise Self'], 3: ['Mirror Image', 'Pass without Trace'],
            5: ['Blink', 'Dispel Magic'], 7: ['Dimension Door', 'Polymorph'],
            9: ['Dominate Person', 'Modify Memory'] },
  features: [
    { level: 1, name: 'Blessing of the Trickster', text: 'Action. Give a creature advantage on Stealth checks for 1 hour.' },
    { level: 2, name: 'Channel Divinity: Invoke Duplicity', text: 'Create an illusory duplicate for 1 minute. Cast spells from its space and gain advantage when you are both near a target.' },
    { level: 6, name: 'Channel Divinity: Cloak of Shadows', text: 'Become invisible until the end of your next turn.' },
    { level: 8, name: 'Divine Strike', text: 'Once per turn, a weapon hit deals an extra 1d8 poison damage, rising to 2d8 at 14th level.' },
    { level: 17, name: 'Improved Duplicity', text: 'Create up to four duplicates, and gain advantage on attacks against creatures within 5 feet of any of them.' }
  ]
},
{ id: 'war', classId: 'cleric', name: 'War Domain', source: 'PHB 63',
  armor: ['Heavy armor'], weaponCategories: ['Martial weapons'],
  spells: { 1: ['Divine Favor', 'Shield of Faith'], 3: ['Magic Weapon', 'Spiritual Weapon'],
            5: ['Crusader\u2019s Mantle', 'Spirit Guardians'], 7: ['Freedom of Movement', 'Stoneskin'],
            9: ['Flame Strike', 'Hold Monster'] },
  features: [
    { level: 1, name: 'Bonus Proficiencies', text: 'Proficiency with martial weapons and heavy armor.' },
    { level: 1, name: 'War Priest', text: 'Bonus action weapon attack when you take the Attack action. Uses equal your Wisdom modifier per long rest.' },
    { level: 2, name: 'Channel Divinity: Guided Strike', text: '+10 to an attack roll after seeing the result.' },
    { level: 6, name: "Channel Divinity: War God's Blessing", text: 'Reaction. Grant +10 to an ally\u2019s attack roll within 30 feet.' },
    { level: 8, name: 'Divine Strike', text: 'Once per turn, a weapon hit deals an extra 1d8 damage of the weapon\u2019s type, rising to 2d8 at 14th level.' },
    { level: 17, name: 'Avatar of Battle', text: 'Resistance to nonmagical bludgeoning, piercing, and slashing damage.' }
  ]
},

/* ============================== DRUID ============================== */
{ id: 'land', classId: 'druid', name: 'Circle of the Land', source: 'PHB 68',
  features: [
    { level: 2, name: 'Bonus Cantrip', text: 'Learn one additional druid cantrip.',
      choice: { id: 'landCantrip', label: 'Druid cantrip', type: 'spellFromList', count: 1, list: 'druid', spellLevel: 0 } },
    { level: 2, name: 'Natural Recovery', text: 'On a short rest, recover spell slots totalling half your druid level, rounded up, none above 5th. Once per long rest.' },
    { level: 3, name: 'Circle Spells', text: 'Your chosen land grants spells at 3rd, 5th, 7th, and 9th level. They are always prepared and do not count against your limit.',
      choice: { id: 'landType', label: 'Land', type: 'list', count: 1,
        from: ['Arctic', 'Coast', 'Desert', 'Forest', 'Grassland', 'Mountain', 'Swamp', 'Underdark'] } },
    { level: 6, name: "Land's Stride", text: 'Move through nonmagical difficult terrain unimpeded, and gain advantage on saves against plants that impede movement.' },
    { level: 10, name: "Nature's Ward", text: 'You cannot be charmed or frightened by elementals or fey, and you are immune to poison and disease.' },
    { level: 14, name: "Nature's Sanctuary", text: 'Beasts and plants must make a Wisdom save to attack you.' }
  ],
  variantSpells: {
    key: 'landType',
    Arctic: { 3: ['Hold Person', 'Spike Growth'], 5: ['Sleet Storm', 'Slow'], 7: ['Freedom of Movement', 'Ice Storm'], 9: ['Commune with Nature', 'Cone of Cold'] },
    Coast: { 3: ['Mirror Image', 'Misty Step'], 5: ['Water Breathing', 'Water Walk'], 7: ['Control Water', 'Freedom of Movement'], 9: ['Conjure Elemental', 'Scrying'] },
    Desert: { 3: ['Blur', 'Silence'], 5: ['Create Food and Water', 'Protection from Energy'], 7: ['Blight', 'Hallucinatory Terrain'], 9: ['Insect Plague', 'Wall of Stone'] },
    Forest: { 3: ['Barkskin', 'Spider Climb'], 5: ['Call Lightning', 'Plant Growth'], 7: ['Divination', 'Freedom of Movement'], 9: ['Commune with Nature', 'Tree Stride'] },
    Grassland: { 3: ['Invisibility', 'Pass without Trace'], 5: ['Daylight', 'Haste'], 7: ['Divination', 'Freedom of Movement'], 9: ['Dream', 'Insect Plague'] },
    Mountain: { 3: ['Spider Climb', 'Spike Growth'], 5: ['Lightning Bolt', 'Meld into Stone'], 7: ['Stone Shape', 'Stoneskin'], 9: ['Passwall', 'Wall of Stone'] },
    Swamp: { 3: ['Darkness', 'Melf\u2019s Acid Arrow'], 5: ['Water Walk', 'Stinking Cloud'], 7: ['Freedom of Movement', 'Locate Creature'], 9: ['Insect Plague', 'Scrying'] },
    Underdark: { 3: ['Spider Climb', 'Web'], 5: ['Gaseous Form', 'Stinking Cloud'], 7: ['Greater Invisibility', 'Stone Shape'], 9: ['Cloudkill', 'Insect Plague'] }
  }
},
{ id: 'moon', classId: 'druid', name: 'Circle of the Moon', source: 'PHB 69',
  features: [
    { level: 2, name: 'Combat Wild Shape', text: 'Wild Shape as a bonus action, and expend a spell slot while transformed to regain 1d8 hit points per slot level.' },
    { level: 2, name: 'Circle Forms', text: 'Wild Shape into beasts of CR 1, rising to CR equal to a third of your druid level, rounded down, at 6th level.' },
    { level: 6, name: 'Primal Strike', text: 'Your beast form attacks count as magical.' },
    { level: 10, name: 'Elemental Wild Shape', text: 'Expend two Wild Shape uses to become an air, earth, fire, or water elemental.' },
    { level: 14, name: 'Thousand Forms', text: 'Cast alter self at will.' }
  ]
},

/* ============================= FIGHTER ============================= */
{ id: 'champion', classId: 'fighter', name: 'Champion', source: 'PHB 72',
  features: [
    { level: 3, name: 'Improved Critical', text: 'Weapon attacks score a critical hit on a 19 or 20.' },
    { level: 7, name: 'Remarkable Athlete', text: 'Add half your proficiency bonus, rounded up, to Strength, Dexterity, and Constitution checks that do not already include it. Your running long jump is longer by your Strength modifier in feet.' },
    { level: 10, name: 'Additional Fighting Style', text: 'Choose a second fighting style.',
      choice: { id: 'championStyle', label: 'Second Fighting Style', type: 'fightingStyle', count: 1, list: 'fighter' } },
    { level: 15, name: 'Superior Critical', text: 'Weapon attacks score a critical hit on an 18 to 20.' },
    { level: 18, name: 'Survivor', text: 'Regain hit points equal to 5 + your Constitution modifier at the start of each turn while at or below half your maximum.' }
  ]
},
{ id: 'battleMaster', classId: 'fighter', name: 'Battle Master', source: 'PHB 73',
  features: [
    { level: 3, name: 'Combat Superiority', text: 'Superiority dice fuel your maneuvers: four d8s at 3rd level, five at 7th, six at 15th. The die grows to d10 at 10th level and d12 at 18th. Maneuver save DC is 8 + proficiency bonus + Strength or Dexterity modifier.',
      choice: { id: 'maneuvers', label: 'Maneuvers', type: 'maneuver', countColumn: 'maneuversKnown' } },
    { level: 3, name: 'Student of War', text: 'Proficiency with one type of artisan\u2019s tools.',
      choice2: { id: 'bmTools', label: "Artisan's tools", type: 'tool', count: 1, from: 'artisan' } },
    { level: 7, name: 'Know Your Enemy', text: 'Study a creature for 1 minute to learn how it compares to you in two characteristics.' },
    { level: 10, name: 'Improved Combat Superiority', text: 'Your superiority dice become d10s.' },
    { level: 15, name: 'Relentless', text: 'Regain one superiority die when you roll initiative with none left.' }
  ],
  columns: [
    { id: 'maneuversKnown', label: 'Maneuvers known', ramp: [[3, 3], [7, 5], [10, 7], [15, 9]] },
    { id: 'superiorityDice', label: 'Superiority dice', ramp: [[3, 4], [7, 5], [15, 6]] },
    { id: 'superiorityDie', label: 'Superiority die', ramp: [[3, 'd8'], [10, 'd10'], [18, 'd12']] }
  ]
},
{ id: 'eldritchKnight', classId: 'fighter', name: 'Eldritch Knight', source: 'PHB 74',
  spellcasting: { type: 'third', ability: 'int', list: 'wizard', focus: 'None',
    schools: ['abjuration', 'evocation'], schoolsFreeAt: [3, 8, 14, 20],
    cantrips: EK_CANTRIPS, known: EK_KNOWN },
  features: [
    { level: 3, name: 'Spellcasting', text: 'Learn wizard spells, Intelligence-based. Most must come from abjuration and evocation; your picks at 3rd, 8th, 14th, and 20th level may be from any school.' },
    { level: 3, name: 'Weapon Bond', text: 'Bond with up to two weapons. A bonded weapon cannot be disarmed and can be summoned as a bonus action.' },
    { level: 7, name: 'War Magic', text: 'After casting a cantrip, make one weapon attack as a bonus action.' },
    { level: 10, name: 'Eldritch Strike', text: 'A weapon hit gives the target disadvantage on its next save against your spells before your next turn ends.' },
    { level: 15, name: 'Arcane Charge', text: 'Teleport up to 30 feet when you use Action Surge.' },
    { level: 18, name: 'Improved War Magic', text: 'War Magic works after casting any spell, not only a cantrip.' }
  ]
},

/* ============================== MONK =============================== */
{ id: 'openHand', classId: 'monk', name: 'Way of the Open Hand', source: 'PHB 79',
  features: [
    { level: 3, name: 'Open Hand Technique', text: 'A Flurry of Blows hit can knock the target prone, push it 15 feet, or deny it reactions, each on a failed save.' },
    { level: 6, name: 'Wholeness of Body', text: 'Action. Regain hit points equal to three times your monk level. Once per long rest.' },
    { level: 11, name: 'Tranquility', text: 'End a long rest under a sanctuary effect, with a save DC of 8 + Wisdom modifier + proficiency bonus.' },
    { level: 17, name: 'Quivering Palm', text: 'Spend 3 ki on a hit to set up vibrations you can end as an action, dealing 10d10 necrotic damage or reducing the target to 1 hit point.' }
  ]
},
{ id: 'shadow', classId: 'monk', name: 'Way of Shadow', source: 'PHB 80',
  features: [
    { level: 3, name: 'Shadow Arts', text: 'Spend 2 ki to cast darkness, darkvision, pass without trace, or silence. You know the minor illusion cantrip.', grantsSpell: 'Minor Illusion' },
    { level: 6, name: 'Shadow Step', text: 'Teleport up to 60 feet between areas of dim light or darkness as a bonus action, with advantage on your next melee attack.' },
    { level: 11, name: 'Cloak of Shadows', text: 'Action. Become invisible in dim light or darkness until you attack, cast a spell, or enter bright light.' },
    { level: 17, name: 'Opportunist', text: 'Reaction. Make a melee attack against a creature within 5 feet that is hit by someone else.' }
  ]
},
{ id: 'fourElements', classId: 'monk', name: 'Way of the Four Elements', source: 'PHB 80',
  features: [
    { level: 3, name: 'Disciple of the Elements', text: 'Learn elemental disciplines and spend ki to cast them. Elemental Attunement is always available.',
      choice: { id: 'disciplines', label: 'Elemental disciplines', type: 'discipline', countColumn: 'disciplinesKnown' } }
  ],
  columns: [
    { id: 'disciplinesKnown', label: 'Disciplines known', ramp: [[3, 1], [6, 2], [11, 3], [17, 4]] }
  ]
},

/* ============================= PALADIN ============================= */
{ id: 'devotion', classId: 'paladin', name: 'Oath of Devotion', source: 'PHB 85',
  spells: { 3: ['Protection from Evil and Good', 'Sanctuary'], 5: ['Lesser Restoration', 'Zone of Truth'],
            9: ['Beacon of Hope', 'Dispel Magic'], 13: ['Freedom of Movement', 'Guardian of Faith'],
            17: ['Commune', 'Flame Strike'] },
  features: [
    { level: 3, name: 'Channel Divinity: Sacred Weapon', text: 'Add your Charisma modifier to attack rolls with a weapon that sheds light, for 1 minute.' },
    { level: 3, name: 'Channel Divinity: Turn the Unholy', text: 'Fiends and undead within 30 feet must save or be turned for 1 minute.' },
    { level: 7, name: 'Aura of Devotion', text: 'You and allies within 10 feet cannot be charmed, extending to 30 feet at 18th level.' },
    { level: 15, name: 'Purity of Spirit', text: 'You are always under the effect of protection from evil and good.' },
    { level: 20, name: 'Holy Nimbus', text: 'Action. Emit sunlight for 1 minute, damaging fiends and undead and granting advantage on saves against their spells. Once per long rest.' }
  ]
},
{ id: 'ancients', classId: 'paladin', name: 'Oath of the Ancients', source: 'PHB 86',
  spells: { 3: ['Ensnaring Strike', 'Speak with Animals'], 5: ['Moonbeam', 'Misty Step'],
            9: ['Plant Growth', 'Protection from Energy'], 13: ['Ice Storm', 'Stoneskin'],
            17: ['Commune with Nature', 'Tree Stride'] },
  features: [
    { level: 3, name: "Channel Divinity: Nature's Wrath", text: 'Restrain a creature with spectral vines on a failed Strength or Dexterity save.' },
    { level: 3, name: 'Channel Divinity: Turn the Faithless', text: 'Fey and fiends within 30 feet must save or be turned for 1 minute, revealing their true forms.' },
    { level: 7, name: 'Aura of Warding', text: 'You and allies within 10 feet have resistance to damage from spells, extending to 30 feet at 18th level.' },
    { level: 15, name: 'Undying Sentinel', text: 'When reduced to 0 hit points, drop to 1 instead. Once per long rest. You also stop aging.' },
    { level: 20, name: 'Elder Champion', text: 'Action. For 1 minute, regain 10 hit points each turn, cast paladin spells as a bonus action, and impose disadvantage on saves against your spells and Channel Divinity. Once per long rest.' }
  ]
},
{ id: 'vengeance', classId: 'paladin', name: 'Oath of Vengeance', source: 'PHB 88',
  spells: { 3: ['Bane', 'Hunter\u2019s Mark'], 5: ['Hold Person', 'Misty Step'],
            9: ['Haste', 'Protection from Energy'], 13: ['Banishment', 'Dimension Door'],
            17: ['Hold Monster', 'Scrying'] },
  features: [
    { level: 3, name: 'Channel Divinity: Abjure Enemy', text: 'Frighten and slow one creature within 60 feet for 1 minute on a failed Wisdom save.' },
    { level: 3, name: 'Channel Divinity: Vow of Enmity', text: 'Bonus action. Gain advantage on attacks against one creature for 1 minute.' },
    { level: 7, name: 'Relentless Avenger', text: 'Move up to half your speed as part of an opportunity attack hit, without provoking.' },
    { level: 15, name: 'Soul of Vengeance', text: 'Reaction. Attack a creature under your Vow of Enmity when it attacks.' },
    { level: 20, name: 'Avenging Angel', text: 'Action. For 1 hour, gain a 60-foot flying speed and frighten nearby enemies. Once per long rest.' }
  ]
},

/* ============================== RANGER ============================= */
{ id: 'hunter', classId: 'ranger', name: 'Hunter', source: 'PHB 93',
  features: [
    { level: 3, name: "Hunter's Prey", text: 'Colossus Slayer adds 1d8 to a damaged target; Giant Killer allows a reaction attack against a Large or larger attacker; Horde Breaker allows a second attack against a different adjacent creature.',
      choice: { id: 'huntersPrey', label: "Hunter's Prey", type: 'list', count: 1,
        from: ['Colossus Slayer', 'Giant Killer', 'Horde Breaker'] } },
    { level: 7, name: 'Defensive Tactics', text: 'Escape the Horde imposes disadvantage on opportunity attacks; Multiattack Defense grants +4 AC against a creature\u2019s follow-up attacks; Steel Will grants advantage on saves against being frightened.',
      choice: { id: 'defensiveTactics', label: 'Defensive Tactics', type: 'list', count: 1,
        from: ['Escape the Horde', 'Multiattack Defense', 'Steel Will'] } },
    { level: 11, name: 'Multiattack', text: 'Volley makes a ranged attack against any number of creatures in a 10-foot radius; Whirlwind Attack makes a melee attack against any number of creatures within 5 feet.',
      choice: { id: 'multiattack', label: 'Multiattack', type: 'list', count: 1,
        from: ['Volley', 'Whirlwind Attack'] } },
    { level: 15, name: "Superior Hunter's Defense", text: 'Evasion, Stand Against the Tide, or Uncanny Dodge.',
      choice: { id: 'superiorDefense', label: "Superior Hunter's Defense", type: 'list', count: 1,
        from: ['Evasion', 'Stand Against the Tide', 'Uncanny Dodge'] } }
  ]
},
{ id: 'beastMaster', classId: 'ranger', name: 'Beast Master', source: 'PHB 93',
  features: [
    { level: 3, name: "Ranger's Companion", text: 'A beast of CR 1/4 or lower and Medium or smaller acts on your command, adding your proficiency bonus to its AC, attacks, damage, saves, and proficient skills.' },
    { level: 7, name: 'Exceptional Training', text: 'Use a bonus action to have your companion Dash, Disengage, Dodge, or Help. Its attacks count as magical.' },
    { level: 11, name: 'Bestial Fury', text: 'Your companion makes two attacks when it takes the Attack action.' },
    { level: 15, name: 'Share Spells', text: 'A spell you cast on yourself also affects your companion within 30 feet.' }
  ]
},

/* ============================== ROGUE ============================== */
{ id: 'thief', classId: 'rogue', name: 'Thief', source: 'PHB 97',
  features: [
    { level: 3, name: 'Fast Hands', text: 'Use Cunning Action to make a Sleight of Hand check, use thieves\u2019 tools to disarm a trap or open a lock, or take the Use an Object action.' },
    { level: 3, name: 'Second-Story Work', text: 'Climbing costs no extra movement, and your running jump distance increases by your Dexterity modifier in feet.' },
    { level: 9, name: 'Supreme Sneak', text: 'Advantage on Stealth checks if you move no more than half your speed on your turn.' },
    { level: 13, name: 'Use Magic Device', text: 'Ignore all class, race, and level requirements on the use of magic items.' },
    { level: 17, name: "Thief's Reflexes", text: 'Take two turns during the first round of combat, the second at initiative minus 10.' }
  ]
},
{ id: 'assassin', classId: 'rogue', name: 'Assassin', source: 'PHB 97',
  tools: ['Disguise kit', 'Poisoner\u2019s kit'],
  features: [
    { level: 3, name: 'Bonus Proficiencies', text: 'Proficiency with the disguise kit and the poisoner\u2019s kit.' },
    { level: 3, name: 'Assassinate', text: 'Advantage on attacks against creatures that have not yet taken a turn, and any hit on a surprised creature is a critical.' },
    { level: 9, name: 'Infiltration Expertise', text: 'Spend 25 gp and seven days to establish a false identity.' },
    { level: 13, name: 'Impostor', text: 'Mimic another creature\u2019s speech, writing, and behaviour after three hours of study.' },
    { level: 17, name: 'Death Strike', text: 'A hit on a surprised creature forces a Constitution save against DC 8 + Dexterity modifier + proficiency bonus, doubling all damage on a failure.' }
  ]
},
{ id: 'arcaneTrickster', classId: 'rogue', name: 'Arcane Trickster', source: 'PHB 97',
  spellcasting: { type: 'third', ability: 'int', list: 'wizard', focus: 'None',
    schools: ['enchantment', 'illusion'], schoolsFreeAt: [3, 8, 14, 20],
    cantrips: AT_CANTRIPS, known: EK_KNOWN, grantsSpell: 'Mage Hand' },
  features: [
    { level: 3, name: 'Spellcasting', text: 'Learn wizard spells, Intelligence-based. Most must come from enchantment and illusion; your picks at 3rd, 8th, 14th, and 20th level may be from any school.' },
    { level: 3, name: 'Mage Hand Legerdemain', text: 'Your mage hand is invisible and can pick locks, disarm traps, and pick pockets.' },
    { level: 9, name: 'Magical Ambush', text: 'A creature you are hidden from has disadvantage on saves against your spells this turn.' },
    { level: 13, name: 'Versatile Trickster', text: 'Bonus action. Use mage hand to distract a creature, giving you advantage against it.' },
    { level: 17, name: 'Spell Thief', text: 'Reaction. Steal a spell cast at you for 8 hours on a failed save. Once per long rest.' }
  ]
},

/* ============================ SORCERER ============================= */
{ id: 'draconic', classId: 'sorcerer', name: 'Draconic Bloodline', source: 'PHB 102',
  features: [
    { level: 1, name: 'Dragon Ancestor', text: 'Choose a dragon type. You speak Draconic, and double your proficiency bonus on Charisma checks when dealing with dragons.',
      choice: { id: 'dragonAncestor', label: 'Dragon ancestor', type: 'ancestry', count: 1 } },
    { level: 1, name: 'Draconic Resilience', text: 'Your hit point maximum increases by 1 per sorcerer level, and your AC is 13 + Dexterity modifier while wearing no armor.',
      hpPerLevel: 1, unarmoredAc: { base: 13, ability: 'dex', label: 'Draconic Resilience' } },
    { level: 6, name: 'Elemental Affinity', text: 'Add your Charisma modifier to damage of your ancestry\u2019s type, and spend 1 sorcery point to gain resistance to it for an hour.' },
    { level: 14, name: 'Dragon Wings', text: 'Bonus action. Sprout wings with a flying speed equal to your walking speed.' },
    { level: 18, name: 'Draconic Presence', text: 'Spend 5 sorcery points to awe or frighten creatures within 60 feet for 1 minute.' }
  ]
},
{ id: 'wildMagic', classId: 'sorcerer', name: 'Wild Magic', source: 'PHB 103',
  features: [
    { level: 1, name: 'Wild Magic Surge', text: 'After casting a sorcerer spell of 1st level or higher, your DM may have you roll on the Wild Magic table.' },
    { level: 1, name: 'Tides of Chaos', text: 'Gain advantage on one attack, check, or save. Regained when the DM has you roll a surge.' },
    { level: 6, name: 'Bend Luck', text: 'Reaction. Spend 2 sorcery points to add or subtract 1d4 from another creature\u2019s roll.' },
    { level: 14, name: 'Controlled Chaos', text: 'Roll twice on the Wild Magic table and choose either result.' },
    { level: 18, name: 'Spell Bombardment', text: 'Once per turn, reroll the highest damage die of a spell and add it to the total.' }
  ]
},

/* ============================= WARLOCK ============================= */
{ id: 'archfey', classId: 'warlock', name: 'The Archfey', source: 'PHB 108',
  spells: { 1: ['Faerie Fire', 'Sleep'], 2: ['Calm Emotions', 'Phantasmal Force'],
            3: ['Blink', 'Plant Growth'], 4: ['Dominate Beast', 'Greater Invisibility'],
            5: ['Dominate Person', 'Seeming'] },
  spellsNote: 'Expanded spell list. These are added to the spells you may choose as warlock spells known.',
  expandedList: true,
  features: [
    { level: 1, name: 'Fey Presence', text: 'Action. Charm or frighten creatures in a 10-foot cube for one turn on a failed Wisdom save. Once per short rest.' },
    { level: 6, name: 'Misty Escape', text: 'Reaction on taking damage. Turn invisible and teleport 60 feet. Once per short rest.' },
    { level: 10, name: 'Beguiling Defenses', text: 'Immunity to being charmed, and a reaction to turn a charm attempt back on its caster.' },
    { level: 14, name: 'Dark Delirium', text: 'Charm or frighten one creature within 60 feet for 1 minute, wrapping it in illusion. Once per short rest.' }
  ]
},
{ id: 'fiend', classId: 'warlock', name: 'The Fiend', source: 'PHB 109',
  spells: { 1: ['Burning Hands', 'Command'], 2: ['Blindness/Deafness', 'Scorching Ray'],
            3: ['Fireball', 'Stinking Cloud'], 4: ['Fire Shield', 'Wall of Fire'],
            5: ['Flame Strike', 'Hallow'] },
  spellsNote: 'Expanded spell list. These are added to the spells you may choose as warlock spells known.',
  expandedList: true,
  features: [
    { level: 1, name: "Dark One's Blessing", text: 'Gain temporary hit points equal to your Charisma modifier + warlock level when you reduce a hostile creature to 0 hit points.' },
    { level: 6, name: "Dark One's Own Luck", text: 'Add 1d10 to an ability check or saving throw. Once per short rest.' },
    { level: 10, name: 'Fiendish Resilience', text: 'Choose a damage type after each rest and gain resistance to it from nonmagical sources.' },
    { level: 14, name: 'Hurl Through Hell', text: 'Send a creature you hit through the lower planes for 10d10 psychic damage. Once per long rest.' }
  ]
},
{ id: 'greatOldOne', classId: 'warlock', name: 'The Great Old One', source: 'PHB 109',
  spells: { 1: ['Dissonant Whispers', 'Tasha\u2019s Hideous Laughter'], 2: ['Detect Thoughts', 'Phantasmal Force'],
            3: ['Clairvoyance', 'Sending'], 4: ['Dominate Beast', 'Evard\u2019s Black Tentacles'],
            5: ['Dominate Person', 'Telekinesis'] },
  spellsNote: 'Expanded spell list. These are added to the spells you may choose as warlock spells known.',
  expandedList: true,
  features: [
    { level: 1, name: 'Awakened Mind', text: 'Speak telepathically to any creature within 30 feet that shares a language with you.' },
    { level: 6, name: 'Entropic Ward', text: 'Reaction. Impose disadvantage on an attack against you, and gain advantage on your next attack if it misses. Once per short rest.' },
    { level: 10, name: 'Thought Shield', text: 'Your thoughts cannot be read, you have resistance to psychic damage, and psychic damage rebounds on its source.' },
    { level: 14, name: 'Create Thrall', text: 'Charm an incapacitated humanoid indefinitely and communicate with it telepathically at any distance.' }
  ]
},

/* ============================== WIZARD ============================= */
{ id: 'abjuration', classId: 'wizard', name: 'School of Abjuration', source: 'PHB 115',
  features: [
    { level: 2, name: 'Abjuration Savant', text: 'Copying an abjuration spell into your book costs half the gold and time.' },
    { level: 2, name: 'Arcane Ward', text: 'Casting an abjuration spell creates a ward with hit points equal to twice your wizard level + Intelligence modifier, which absorbs damage you take.' },
    { level: 6, name: 'Projected Ward', text: 'Reaction. Your Arcane Ward absorbs damage aimed at a creature within 30 feet.' },
    { level: 10, name: 'Improved Abjuration', text: 'Add your proficiency bonus to ability checks made as part of abjuration spells, such as counterspell and dispel magic.' },
    { level: 14, name: 'Spell Resistance', text: 'Advantage on saves against spells, and resistance to damage from spells.' }
  ]
},
{ id: 'conjuration', classId: 'wizard', name: 'School of Conjuration', source: 'PHB 116',
  features: [
    { level: 2, name: 'Conjuration Savant', text: 'Copying a conjuration spell into your book costs half the gold and time.' },
    { level: 2, name: 'Minor Conjuration', text: 'Action. Conjure an inanimate object of no more than 3 feet and 10 pounds for 1 hour.' },
    { level: 6, name: 'Benign Transposition', text: 'Teleport up to 30 feet, or swap places with a willing creature. Recharges when you cast a conjuration spell.' },
    { level: 10, name: 'Focused Conjuration', text: 'Damage cannot break your concentration on a conjuration spell.' },
    { level: 14, name: 'Durable Summons', text: 'Creatures you summon gain 30 temporary hit points.' }
  ]
},
{ id: 'divination', classId: 'wizard', name: 'School of Divination', source: 'PHB 116',
  features: [
    { level: 2, name: 'Divination Savant', text: 'Copying a divination spell into your book costs half the gold and time.' },
    { level: 2, name: 'Portent', text: 'Roll two d20s after a long rest and replace any attack, check, or save with one of them.' },
    { level: 6, name: 'Expert Divination', text: 'Casting a divination spell of 2nd level or higher regains a lower-level slot.' },
    { level: 10, name: 'The Third Eye', text: 'Gain darkvision, ethereal sight, greater comprehension, or see invisibility after each rest.' },
    { level: 14, name: 'Greater Portent', text: 'Roll three d20s for Portent instead of two.' }
  ]
},
{ id: 'enchantment', classId: 'wizard', name: 'School of Enchantment', source: 'PHB 117',
  features: [
    { level: 2, name: 'Enchantment Savant', text: 'Copying an enchantment spell into your book costs half the gold and time.' },
    { level: 2, name: 'Hypnotic Gaze', text: 'Action. Charm and incapacitate one creature within 5 feet for a turn, extendable each round.' },
    { level: 6, name: 'Instinctive Charm', text: 'Reaction. Redirect an attack aimed at you to the nearest other creature on a failed Wisdom save.' },
    { level: 10, name: 'Split Enchantment', text: 'Enchantment spells that target one creature may target a second.' },
    { level: 14, name: 'Alter Memories', text: 'A creature is unaware it was charmed, and you can erase up to your Charisma modifier in hours of its memory.' }
  ]
},
{ id: 'evocation', classId: 'wizard', name: 'School of Evocation', source: 'PHB 117',
  features: [
    { level: 2, name: 'Evocation Savant', text: 'Copying an evocation spell into your book costs half the gold and time.' },
    { level: 2, name: 'Sculpt Spells', text: 'Protect 1 + the spell\u2019s level creatures from your own evocation spells; they automatically succeed and take no damage.' },
    { level: 6, name: 'Potent Cantrip', text: 'Creatures that succeed on a save against your cantrips still take half damage.' },
    { level: 10, name: 'Empowered Evocation', text: 'Add your Intelligence modifier to the damage of one evocation spell you cast.' },
    { level: 14, name: 'Overchannel', text: 'Deal maximum damage with a spell of 5th level or lower. After the first use per long rest it costs you necrotic damage.' }
  ]
},
{ id: 'illusion', classId: 'wizard', name: 'School of Illusion', source: 'PHB 118',
  features: [
    { level: 2, name: 'Illusion Savant', text: 'Copying an illusion spell into your book costs half the gold and time.' },
    { level: 2, name: 'Improved Minor Illusion', text: 'Learn minor illusion, and create both a sound and an image with it.', grantsSpell: 'Minor Illusion' },
    { level: 6, name: 'Malleable Illusions', text: 'Action. Reshape an illusion you cast while it lasts.' },
    { level: 10, name: 'Illusory Self', text: 'Reaction. An illusory duplicate causes an attack to miss. Once per short rest.' },
    { level: 14, name: 'Illusory Reality', text: 'Make one object within an illusion real for 1 minute.' }
  ]
},
{ id: 'necromancy', classId: 'wizard', name: 'School of Necromancy', source: 'PHB 118',
  features: [
    { level: 2, name: 'Necromancy Savant', text: 'Copying a necromancy spell into your book costs half the gold and time.' },
    { level: 2, name: 'Grim Harvest', text: 'Regain hit points equal to twice the spell\u2019s level when you kill a creature with a spell, or three times for necromancy.' },
    { level: 6, name: 'Undead Thralls', text: 'Learn animate dead. It raises one extra skeleton or zombie, and your undead gain bonus hit points and damage.', grantsSpell: 'Animate Dead' },
    { level: 10, name: 'Inured to Undeath', text: 'Resistance to necrotic damage, and your hit point maximum cannot be reduced.' },
    { level: 14, name: 'Command Undead', text: 'Wrest control of an undead creature from its master with a Charisma save.' }
  ]
},
{ id: 'transmutation', classId: 'wizard', name: 'School of Transmutation', source: 'PHB 119',
  features: [
    { level: 2, name: 'Transmutation Savant', text: 'Copying a transmutation spell into your book costs half the gold and time.' },
    { level: 2, name: 'Minor Alchemy', text: 'Transform one material into another for 1 hour, spending 10 minutes per cubic foot.' },
    { level: 6, name: "Transmuter's Stone", text: 'Create a stone granting darkvision, +10 speed, proficiency in Constitution saves, or resistance to one energy type.' },
    { level: 10, name: 'Shapechanger', text: 'Learn polymorph. Cast it on yourself once per short rest without a slot.', grantsSpell: 'Polymorph' },
    { level: 14, name: 'Master Transmuter', text: 'Consume your stone to transmute an object, remove curses and disease, restore youth, or create a major magic item.' }
  ]
}

];

/* ---------------------------------------------------------------
   Elemental disciplines for the Way of the Four Elements. PHB 80.
   --------------------------------------------------------------- */
DND.DISCIPLINES = [
  { id: 'elementalAttunement', name: 'Elemental Attunement', level: 3, note: 'Free. A minor elemental effect: snuff a flame, chill an object, shape earth.' },
  { id: 'breathOfWinter', name: 'Breath of the Winter', level: 17, note: '6 ki. Cast cone of cold.' },
  { id: 'clenchOfNorth', name: 'Clench of the North Wind', level: 6, note: '3 ki. Cast hold person.' },
  { id: 'eternalMountain', name: 'Eternal Mountain Defense', level: 17, note: '5 ki. Cast stoneskin on yourself.' },
  { id: 'fangOfFireSnake', name: 'Fangs of the Fire Snake', level: 3, note: '1 ki. Extend your unarmed reach by 10 feet and deal fire damage.' },
  { id: 'fistOfFourThunders', name: 'Fist of Four Thunders', level: 3, note: '2 ki. Cast thunderwave.' },
  { id: 'fistOfUnbrokenAir', name: 'Fist of Unbroken Air', level: 3, note: '2 ki. Push and damage a creature within 30 feet.' },
  { id: 'flamesOfPhoenix', name: 'Flames of the Phoenix', level: 11, note: '4 ki. Cast fireball.' },
  { id: 'gongOfSummit', name: 'Gong of the Summit', level: 6, note: '3 ki. Cast shatter.' },
  { id: 'mistStance', name: 'Mist Stance', level: 11, note: '4 ki. Cast gaseous form on yourself.' },
  { id: 'rideTheWind', name: 'Ride the Wind', level: 11, note: '4 ki. Cast fly on yourself.' },
  { id: 'riverOfHungryFlame', name: 'River of Hungry Flame', level: 17, note: '5 ki. Cast wall of fire.' },
  { id: 'rushOfGaleSpirits', name: 'Rush of the Gale Spirits', level: 3, note: '2 ki. Cast gust of wind.' },
  { id: 'shapeOfFlowingRiver', name: 'Shape the Flowing River', level: 3, note: '1 ki. Reshape ice and water within 120 feet.' },
  { id: 'sweepingCinderStrike', name: 'Sweeping Cinder Strike', level: 3, note: '2 ki. Cast burning hands.' },
  { id: 'waterWhip', name: 'Water Whip', level: 3, note: '2 ki. Pull, knock prone, and damage a creature within 30 feet.' },
  { id: 'waveOfRollingEarth', name: 'Wave of Rolling Earth', level: 17, note: '6 ki. Cast wall of stone.' }
];

DND.subclassesFor = function (classId) {
  return DND.SUBCLASSES.filter(function (s) { return s.classId === classId; });
};

DND.findSubclass = function (id) {
  for (var i = 0; i < DND.SUBCLASSES.length; i++) {
    if (DND.SUBCLASSES[i].id === id) return DND.SUBCLASSES[i];
  }
  return null;
};

/* Level-indexed value from a subclass resource column. */
DND.subColumnValue = function (sub, columnId, level) {
  if (!sub || !sub.columns) return null;
  for (var i = 0; i < sub.columns.length; i++) {
    var col = sub.columns[i];
    if (col.id !== columnId) continue;
    var v = null;
    for (var j = 0; j < col.ramp.length; j++) {
      if (level >= col.ramp[j][0]) v = col.ramp[j][1];
    }
    return v;
  }
  return null;
};

/* Spell ids a subclass grants at a given level, resolved by name. */
DND.subclassSpells = function (sub, level, pick) {
  if (!sub) return [];
  var table = sub.spells;
  if (sub.variantSpells && pick) table = sub.variantSpells[pick] || null;
  var out = [];
  if (table) {
    Object.keys(table).forEach(function (lv) {
      if (level < parseInt(lv, 10)) return;
      table[lv].forEach(function (name) {
        var sp = DND.SPELL_BY_NAME[name.toLowerCase().replace(/\u2019/g, "'")];
        if (sp) out.push(sp.id);
        else if (window.console) console.warn('Subclass spell not found:', name, '(' + sub.name + ')');
      });
    });
  }
  (sub.features || []).forEach(function (f) {
    if (f.grantsSpell && level >= f.level) {
      var sp = DND.SPELL_BY_NAME[f.grantsSpell.toLowerCase()];
      if (sp) out.push(sp.id);
    }
  });
  if (sub.spellcasting && sub.spellcasting.grantsSpell) {
    var g = DND.SPELL_BY_NAME[sub.spellcasting.grantsSpell.toLowerCase()];
    if (g) out.push(g.id);
  }
  return out;
};
