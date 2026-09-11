/* Subclasses from Xanathar's Guide to Everything and Tasha's Cauldron of
   Everything. Appended to the Player's Handbook set in data/subclasses.js.
   Feature names and levels were checked against the books. */
window.DND = window.DND || {};

DND.SUBCLASSES = (DND.SUBCLASSES || []).concat([

/* ============================ BARBARIAN ============================ */
{ id: 'ancestralGuardian', classId: 'barbarian', name: 'Path of the Ancestral Guardian', source: 'XGE 9',
  features: [
    { level: 3, name: 'Ancestral Protectors', text: 'The first creature you hit while raging has disadvantage against anyone but you, and its damage to others is halved.' },
    { level: 6, name: 'Spirit Shield', text: 'Reaction while raging. Reduce damage to an ally within 30 feet by 2d6, rising to 3d6 at 10th level and 4d6 at 14th.' },
    { level: 10, name: 'Consult the Spirits', text: 'Cast augury or clairvoyance without a slot, once per short rest.' },
    { level: 14, name: 'Vengeful Ancestors', text: 'Spirit Shield deals the damage it prevents back to the attacker as force damage.' }
  ]
},
{ id: 'stormHerald', classId: 'barbarian', name: 'Path of the Storm Herald', source: 'XGE 10',
  features: [
    { level: 3, name: 'Storm Aura', text: 'A 10-foot aura while raging. Desert deals fire damage, sea deals lightning to one creature, tundra grants temporary hit points.',
      choice: { id: 'stormAura', label: 'Storm Aura environment', type: 'list', count: 1,
        from: ['Desert', 'Sea', 'Tundra'] } },
    { level: 6, name: 'Storm Soul', text: 'Resistance to your environment\u2019s damage type, and a matching benefit: desert grants fire resistance and comfort in heat, sea a swimming speed and water breathing, tundra the ability to freeze water.' },
    { level: 10, name: 'Shielding Storm', text: 'Allies in your aura gain the same damage resistance you do.' },
    { level: 14, name: 'Raging Storm', text: 'Your aura gains an offensive effect: desert burns an attacker, sea knocks a creature prone, tundra halves a creature\u2019s speed.' }
  ]
},
{ id: 'zealot', classId: 'barbarian', name: 'Path of the Zealot', source: 'XGE 11',
  features: [
    { level: 3, name: 'Divine Fury', text: 'The first hit each turn while raging deals an extra 1d6 + half your barbarian level radiant or necrotic damage.' },
    { level: 3, name: 'Warrior of the Gods', text: 'A spell that restores you to life needs no material component.' },
    { level: 6, name: 'Fanatical Focus', text: 'Reroll a failed save while raging. Once per rage.' },
    { level: 10, name: 'Zealous Presence', text: 'Bonus action. Up to ten allies gain advantage on attacks and saves until your next turn. Once per long rest.' },
    { level: 14, name: 'Rage Beyond Death', text: 'Dropping to 0 hit points while raging does not knock you unconscious.' }
  ]
},
{ id: 'beastBarb', classId: 'barbarian', name: 'Path of the Beast', source: 'TCE 10',
  features: [
    { level: 3, name: 'Form of the Beast', text: 'Grow a natural weapon when you rage: a bite that heals you, claws for an extra attack, or a tail that adds to AC as a reaction.',
      choice: { id: 'beastForm', label: 'Natural weapon', type: 'list', count: 1,
        from: ['Bite', 'Claws', 'Tail'] } },
    { level: 6, name: 'Bestial Soul', text: 'Your natural weapons count as magical, and you gain a swimming, climbing, or jumping benefit after each rest.' },
    { level: 10, name: 'Infectious Fury', text: 'A natural weapon hit while raging can force a Wisdom save to compel an attack on another creature or deal 2d12 psychic damage.' },
    { level: 14, name: 'Call the Hunt', text: 'Give up to your Constitution modifier in allies an extra damage die on their attacks, and gain temporary hit points.' }
  ]
},
{ id: 'wildMagicBarb', classId: 'barbarian', name: 'Path of Wild Magic', source: 'TCE 11',
  features: [
    { level: 3, name: 'Magic Awareness', text: 'Action. Detect spells and magic items within 60 feet. Uses equal your proficiency bonus per long rest.' },
    { level: 3, name: 'Wild Surge', text: 'Roll on the Wild Magic table when you enter your rage.' },
    { level: 6, name: 'Bolstering Magic', text: 'Grant an ally a d3 bonus to attacks and checks for 10 minutes, or restore a spell slot of 3rd level or lower.' },
    { level: 10, name: 'Unstable Backlash', text: 'Reaction while raging. Reroll on the Wild Magic table when you take damage or fail a save.' },
    { level: 14, name: 'Controlled Surge', text: 'Roll twice on the Wild Magic table and choose the result.' }
  ]
},

/* =============================== BARD ============================== */
{ id: 'glamour', classId: 'bard', name: 'College of Glamour', source: 'XGE 14',
  features: [
    { level: 3, name: 'Mantle of Inspiration', text: 'Bonus action. Spend a Bardic Inspiration to give allies temporary hit points and a free move without provoking.' },
    { level: 3, name: 'Enthralling Performance', text: 'Perform for 1 minute to charm up to your Charisma modifier in creatures for 1 hour.' },
    { level: 6, name: 'Mantle of Majesty', text: 'Bonus action. Cast command without a slot and repeat it each turn for 1 minute while charmed creatures obey.' },
    { level: 14, name: 'Unbreakable Majesty', text: 'Bonus action. Assume a majestic presence for 1 minute; attackers must save or lose the attack and be unable to target you.' }
  ]
},
{ id: 'swords', classId: 'bard', name: 'College of Swords', source: 'XGE 15',
  armor: ['Medium armor'], weapons: ['Scimitar'],
  features: [
    { level: 3, name: 'Bonus Proficiencies', text: 'Proficiency with medium armor and the scimitar. You may use any simple or martial weapon as a spellcasting focus.' },
    { level: 3, name: 'Fighting Style', text: 'Choose Duelling or Two-Weapon Fighting.',
      choice: { id: 'swordsStyle', label: 'Fighting Style', type: 'list', count: 1,
        from: ['Duelling', 'Two-Weapon Fighting'] } },
    { level: 3, name: 'Blade Flourish', text: 'Your speed increases by 10 feet on a turn you attack, and you may spend a Bardic Inspiration on a defensive, slashing, or mobile flourish.' },
    { level: 6, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
    { level: 14, name: "Master's Flourish", text: 'Roll a d6 for a flourish instead of spending a Bardic Inspiration die.' }
  ]
},
{ id: 'whispers', classId: 'bard', name: 'College of Whispers', source: 'XGE 16',
  features: [
    { level: 3, name: 'Psychic Blades', text: 'Spend a Bardic Inspiration on a hit for extra psychic damage, starting at 2d6 and rising with level.' },
    { level: 3, name: 'Words of Terror', text: 'Speak to a humanoid for 1 minute to frighten it of a creature or object for an hour.' },
    { level: 6, name: 'Mantle of Whispers', text: 'Reaction on a humanoid\u2019s death. Capture its shadow and wear its identity for 1 hour.' },
    { level: 14, name: 'Shadow Lore', text: 'Whisper a dark secret to charm a creature for 8 days on a failed Wisdom save.' }
  ]
},
{ id: 'creation', classId: 'bard', name: 'College of Creation', source: 'TCE 15',
  features: [
    { level: 3, name: 'Mote of Potential', text: 'Your Bardic Inspiration also creates a mote: bonus damage on an attack, temporary hit points on a check, or an ally bonus on a save.' },
    { level: 3, name: 'Performance of Creation', text: 'Action. Create a nonmagical item worth no more than 20 gp times your bard level.' },
    { level: 6, name: 'Animating Performance', text: 'Animate a Large or smaller object as a Dancing Item that acts on your turn.' },
    { level: 14, name: 'Creative Crescendo', text: 'Performance of Creation makes multiple items, without the size or value limits.' }
  ]
},
{ id: 'eloquence', classId: 'bard', name: 'College of Eloquence', source: 'TCE 16',
  features: [
    { level: 3, name: 'Silver Tongue', text: 'Treat a d20 roll of 9 or lower as a 10 for Persuasion and Deception.' },
    { level: 3, name: 'Unsettling Words', text: 'Bonus action. Spend a Bardic Inspiration to subtract the die from a creature\u2019s next saving throw.' },
    { level: 6, name: 'Unfailing Inspiration', text: 'An inspiration die that fails to change the outcome is not lost.' },
    { level: 6, name: 'Universal Speech', text: 'Make yourself understood by creatures of your choice for 1 hour.' },
    { level: 14, name: 'Infectious Inspiration', text: 'Reaction. When a creature succeeds using your inspiration, give another creature a die without spending one.' }
  ]
},

/* ============================== CLERIC ============================= */
{ id: 'forge', classId: 'cleric', name: 'Forge Domain', source: 'XGE 18',
  armor: ['Heavy armor'], weaponCategories: ['Martial weapons'], tools: ["Smith's tools"],
  spells: { 1: ['Identify', 'Searing Smite'], 3: ['Heat Metal', 'Magic Weapon'],
            5: ['Elemental Weapon', 'Protection from Energy'], 7: ['Fabricate', 'Wall of Fire'],
            9: ['Animate Objects', 'Creation'] },
  features: [
    { level: 1, name: 'Bonus Proficiencies', text: 'Proficiency with heavy armor and smith\u2019s tools.' },
    { level: 1, name: 'Blessing of the Forge', text: 'Grant a suit of armor or a weapon a +1 bonus after a long rest.' },
    { level: 2, name: "Channel Divinity: Artisan's Blessing", text: 'A one-hour ritual creates a simple metal item worth no more than 100 gp.' },
    { level: 6, name: 'Soul of the Forge', text: 'Resistance to fire damage, and +1 AC while wearing heavy armor.' },
    { level: 8, name: 'Divine Strike', text: 'Once per turn, a weapon hit deals an extra 1d8 fire damage, rising to 2d8 at 14th level.' },
    { level: 17, name: 'Saint of Forge and Fire', text: 'Immunity to fire, and resistance to nonmagical bludgeoning, piercing, and slashing while in heavy armor.' }
  ]
},
{ id: 'grave', classId: 'cleric', name: 'Grave Domain', source: 'XGE 19',
  spells: { 1: ['Bane', 'False Life'], 3: ['Gentle Repose', 'Ray of Enfeeblement'],
            5: ['Revivify', 'Vampiric Touch'], 7: ['Blight', 'Death Ward'],
            9: ['Antilife Shell', 'Raise Dead'] },
  features: [
    { level: 1, name: 'Circle of Mortality', text: 'Healing spells that roll dice restore the maximum to a creature at 0 hit points, and you cast spare the dying at 30 feet as a bonus action.', grantsSpell: 'Spare the Dying' },
    { level: 1, name: 'Eyes of the Grave', text: 'Action. Sense undead within 60 feet. Uses equal your Wisdom modifier per long rest.' },
    { level: 2, name: 'Channel Divinity: Path to the Grave', text: 'Curse a creature so the next attack against it has vulnerability to all its damage.' },
    { level: 6, name: "Sentinel at Death's Door", text: 'Reaction. Turn a critical hit against a nearby creature into a normal hit. Uses equal your Wisdom modifier per long rest.' },
    { level: 8, name: 'Potent Spellcasting', text: 'Add your Wisdom modifier to cantrip damage.' },
    { level: 17, name: 'Keeper of Souls', text: 'A dying enemy restores hit points equal to its hit dice to a creature within 60 feet.' }
  ]
},
{ id: 'order', classId: 'cleric', name: 'Order Domain', source: 'TCE 31',
  armor: ['Heavy armor'],
  skills: { count: 1, from: ['intimidation', 'persuasion'] },
  spells: { 1: ['Command', 'Heroism'], 3: ['Hold Person', 'Zone of Truth'],
            5: ['Mass Healing Word', 'Slow'], 7: ['Compulsion', 'Locate Creature'],
            9: ['Commune', 'Dominate Person'] },
  features: [
    { level: 1, name: 'Bonus Proficiencies', text: 'Proficiency with heavy armor and one of Intimidation or Persuasion.' },
    { level: 1, name: 'Voice of Authority', text: 'A spell you cast on an ally lets it make one weapon attack as a reaction.' },
    { level: 2, name: "Channel Divinity: Order's Demand", text: 'Charm creatures within 30 feet on a failed Wisdom save, and command one to drop what it holds.' },
    { level: 6, name: 'Embodiment of the Law', text: 'Cast an enchantment spell of 1st level or higher as a bonus action. Uses equal your Wisdom modifier per long rest.' },
    { level: 8, name: 'Divine Strike', text: 'Once per turn, a weapon hit deals an extra 1d8 psychic damage, rising to 2d8 at 14th level.' },
    { level: 17, name: "Order's Wrath", text: 'A creature damaged by your Divine Strike takes 2d8 psychic damage from the next ally to hit it.' }
  ]
},
{ id: 'peace', classId: 'cleric', name: 'Peace Domain', source: 'TCE 33',
  armor: ['Heavy armor'], tools: ['One musical instrument'],
  skills: { count: 1, from: ['insight', 'performance', 'persuasion'] },
  spells: { 1: ['Heroism', 'Sanctuary'], 3: ['Aid', 'Warding Bond'],
            5: ['Beacon of Hope', 'Sending'], 7: ['Aura of Purity', 'Otiluke\u2019s Resilient Sphere'],
            9: ['Greater Restoration', 'Rary\u2019s Telepathic Bond'] },
  features: [
    { level: 1, name: 'Implement of Peace', text: 'Proficiency in Insight, Performance, or Persuasion.' },
    { level: 1, name: 'Emboldening Bond', text: 'Bond up to your proficiency bonus in creatures for 10 minutes; a bonded creature near another may add 1d4 to an attack, check, or save.' },
    { level: 2, name: 'Channel Divinity: Balm of Peace', text: 'Move up to your speed without provoking, healing each creature you pass for 2d6 + your Wisdom modifier.' },
    { level: 6, name: 'Protective Bond', text: 'A bonded creature may take another\u2019s damage as a reaction, with resistance to it.' },
    { level: 8, name: 'Potent Spellcasting', text: 'Add your Wisdom modifier to cantrip damage.' },
    { level: 17, name: 'Expansive Bond', text: 'Emboldening Bond and Protective Bond work at 60 feet.' }
  ]
},
{ id: 'twilight', classId: 'cleric', name: 'Twilight Domain', source: 'TCE 35',
  armor: ['Heavy armor'], weaponCategories: ['Martial weapons'],
  spells: { 1: ['Faerie Fire', 'Sleep'], 3: ['Moonbeam', 'See Invisibility'],
            5: ['Aura of Vitality', 'Leomund\u2019s Tiny Hut'], 7: ['Aura of Life', 'Greater Invisibility'],
            9: ['Circle of Power', 'Mislead'] },
  features: [
    { level: 1, name: 'Bonus Proficiencies', text: 'Proficiency with martial weapons and heavy armor.' },
    { level: 1, name: 'Eyes of Night', text: 'Darkvision out to 300 feet, shareable with up to your Wisdom modifier in creatures.' },
    { level: 1, name: 'Vigilant Blessing', text: 'Action. Give a creature advantage on its next initiative roll.' },
    { level: 2, name: 'Channel Divinity: Twilight Sanctuary', text: 'A 30-foot sphere for 1 minute granting allies temporary hit points or ending a charm or fright.' },
    { level: 6, name: 'Steps of Night', text: 'Bonus action in dim light or darkness. Gain a flying speed equal to your walking speed.' },
    { level: 8, name: 'Divine Strike', text: 'Once per turn, a weapon hit deals an extra 1d8 radiant damage, rising to 2d8 at 14th level.' },
    { level: 17, name: 'Twilight Shroud', text: 'Allies in your Twilight Sanctuary gain half cover.' }
  ]
},

/* ============================== DRUID ============================== */
{ id: 'dreams', classId: 'druid', name: 'Circle of Dreams', source: 'XGE 22',
  features: [
    { level: 2, name: 'Balm of the Summer Court', text: 'A pool of d6s equal to your druid level, spent to heal and grant temporary hit points.' },
    { level: 6, name: 'Hearth of Moonlight and Shadow', text: 'A 30-foot sphere during a rest granting advantage on Stealth and Perception, and total cover.' },
    { level: 10, name: 'Hidden Paths', text: 'Bonus action. Teleport 60 feet, or teleport a willing creature you touch. Uses equal your Wisdom modifier per long rest.' },
    { level: 14, name: 'Walker in Dreams', text: 'Cast dream, scrying, or teleportation circle after a short rest, without a slot.' }
  ]
},
{ id: 'shepherd', classId: 'druid', name: 'Circle of the Shepherd', source: 'XGE 23',
  features: [
    { level: 2, name: 'Speech of the Woods', text: 'You speak Sylvan and can converse with beasts.' },
    { level: 2, name: 'Spirit Totem', text: 'Bonus action. A 30-foot spirit aura for 1 minute: bear grants temporary hit points and advantage on Strength checks, hawk grants advantage on attacks and Perception, unicorn grants advantage to find creatures and boosts healing.',
      choice: { id: 'spiritTotem', label: 'Spirit Totem', type: 'list', count: 1,
        from: ['Bear Spirit', 'Hawk Spirit', 'Unicorn Spirit'] } },
    { level: 6, name: 'Mighty Summoner', text: 'Creatures you conjure gain 2 extra hit points per hit die, and their attacks count as magical.' },
    { level: 10, name: 'Guardian Spirit', text: 'Summoned creatures in your totem aura regain hit points equal to half your druid level at the end of their turns.' },
    { level: 14, name: 'Faithful Summons', text: 'Four dire wolves appear to defend you when you drop to 0 hit points. Once per long rest.' }
  ]
},
{ id: 'spores', classId: 'druid', name: 'Circle of Spores', source: 'TCE 36',
  spells: { 2: ['Chill Touch', 'Blindness/Deafness'], 3: ['Gentle Repose', 'Ray of Enfeeblement'],
            5: ['Animate Dead', 'Gaseous Form'], 7: ['Blight', 'Confusion'],
            9: ['Cloudkill', 'Contagion'] },
  features: [
    { level: 2, name: 'Halo of Spores', text: 'Reaction. Deal 1d4 necrotic damage to a creature within 10 feet, rising with level.' },
    { level: 2, name: 'Symbiotic Entity', text: 'Expend a Wild Shape use for 4 temporary hit points per druid level, doubled Halo damage, and extra necrotic damage on melee hits.' },
    { level: 6, name: 'Fungal Infestation', text: 'Reaction. Raise a slain beast or humanoid as a zombie for 1 hour. Uses equal your Wisdom modifier per long rest.' },
    { level: 10, name: 'Spreading Spores', text: 'Bonus action. Hurl your Halo into a 10-foot cube within 30 feet for 1 minute.' },
    { level: 14, name: 'Fungal Body', text: 'You cannot be blinded, deafened, frightened, or poisoned, and critical hits against you count as normal hits.' }
  ]
},
{ id: 'stars', classId: 'druid', name: 'Circle of Stars', source: 'TCE 38',
  features: [
    { level: 2, name: 'Star Map', text: 'A map that acts as a spellcasting focus. You know guidance, and cast guiding bolt a number of times equal to your proficiency bonus.', grantsSpell: 'Guidance' },
    { level: 2, name: 'Starry Form', text: 'Expend a Wild Shape use for 10 minutes of a constellation: Archer for a bonus ranged attack, Chalice for healing, Dragon for steady concentration.',
      choice: { id: 'starryForm', label: 'Starry Form', type: 'list', count: 1,
        from: ['Archer', 'Chalice', 'Dragon'] } },
    { level: 6, name: 'Cosmic Omen', text: 'Reaction. Add or subtract 1d6 from a roll near you. Uses equal your proficiency bonus per long rest.' },
    { level: 10, name: 'Twinkling Constellations', text: 'Your Starry Form improves, and you may change constellation each turn.' },
    { level: 14, name: 'Full of Stars', text: 'While in Starry Form you are partly incorporeal, with resistance to bludgeoning, piercing, and slashing damage.' }
  ]
},
{ id: 'wildfire', classId: 'druid', name: 'Circle of Wildfire', source: 'TCE 39',
  spells: { 2: ['Burning Hands', 'Cure Wounds'], 3: ['Flaming Sphere', 'Scorching Ray'],
            5: ['Plant Growth', 'Revivify'], 7: ['Aura of Life', 'Fire Shield'],
            9: ['Flame Strike', 'Mass Cure Wounds'] },
  features: [
    { level: 2, name: 'Summon Wildfire Spirit', text: 'Expend a Wild Shape use to summon a wildfire spirit that acts on your turn.' },
    { level: 6, name: 'Enhanced Bond', text: 'Your fire and healing spells gain 1d8 while the spirit is near, and it can be the origin of your spells.' },
    { level: 10, name: 'Cauterizing Flames', text: 'A creature dying near you leaves a flame that heals or burns another creature for 2d10.' },
    { level: 14, name: 'Blazing Revival', text: 'Dismiss your spirit to return to half your hit points instead of dropping to 0. Once per long rest.' }
  ]
},

/* ============================= FIGHTER ============================= */
{ id: 'arcaneArcher', classId: 'fighter', name: 'Arcane Archer', source: 'XGE 28',
  skills: { count: 1, from: ['arcana', 'nature'] },
  features: [
    { level: 3, name: 'Arcane Archer Lore', text: 'Proficiency in Arcana or Nature, and either the prestidigitation or druidcraft cantrip.',
      choice2: { id: 'archerCantrip', label: 'Cantrip', type: 'list', count: 1,
        from: ['Prestidigitation', 'Druidcraft'] } },
    { level: 3, name: 'Arcane Shot', text: 'Infuse an arrow with magic twice per short rest. The save DC is 8 + proficiency bonus + Intelligence modifier.',
      choice: { id: 'arcaneShots', label: 'Arcane Shot options', type: 'arcaneShot', countColumn: 'shotsKnown' } },
    { level: 7, name: 'Magic Arrow', text: 'Your arrows count as magical.' },
    { level: 7, name: 'Curving Shot', text: 'Bonus action. Reroll a missed magic arrow attack against another target.' },
    { level: 15, name: 'Ever-Ready Shot', text: 'Regain an Arcane Shot use when you roll initiative with none left.' }
  ],
  columns: [{ id: 'shotsKnown', label: 'Arcane Shots known', ramp: [[3, 2], [7, 3], [10, 4], [15, 5], [18, 6]] }]
},
{ id: 'cavalier', classId: 'fighter', name: 'Cavalier', source: 'XGE 30',
  features: [
    { level: 3, name: 'Bonus Proficiency', text: 'Proficiency in one skill from Animal Handling, History, Insight, Performance, or Persuasion, or with land vehicles.',
      choice: { id: 'cavalierSkill', label: 'Skill proficiency', type: 'skill', count: 1,
        from: ['animalHandling', 'history', 'insight', 'performance', 'persuasion'] } },
    { level: 3, name: 'Born to the Saddle', text: 'Advantage on saves to avoid falling off your mount, and you land on your feet from a 10-foot fall.' },
    { level: 3, name: 'Unwavering Mark', text: 'Mark a creature you hit; it suffers disadvantage attacking anyone else, and you may strike it with advantage and bonus damage.' },
    { level: 7, name: 'Warding Maneuver', text: 'Reaction. Add 1d8 to an ally\u2019s AC and grant resistance to the damage. Uses equal your Constitution modifier per long rest.' },
    { level: 10, name: 'Hold the Line', text: 'Opportunity attacks reduce a creature\u2019s speed to 0 for the turn.' },
    { level: 15, name: 'Ferocious Charger', text: 'Knock a creature prone after moving 10 feet in a straight line.' },
    { level: 18, name: 'Vigilant Defender', text: 'Make an opportunity attack on every other creature\u2019s turn.' }
  ]
},
{ id: 'samurai', classId: 'fighter', name: 'Samurai', source: 'XGE 31',
  skills: { count: 1, from: ['history', 'insight', 'performance', 'persuasion'] },
  features: [
    { level: 3, name: 'Bonus Proficiency', text: 'Proficiency in History, Insight, Performance, or Persuasion.' },
    { level: 3, name: 'Fighting Spirit', text: 'Bonus action. Gain advantage on weapon attacks this turn and temporary hit points. Three uses per long rest.' },
    { level: 7, name: 'Elegant Courtier', text: 'Add your Wisdom modifier to Persuasion, and gain proficiency in Wisdom saves.', addSave: 'wis' },
    { level: 10, name: 'Tireless Spirit', text: 'Regain a Fighting Spirit use when you roll initiative with none left.' },
    { level: 15, name: 'Rapid Strike', text: 'Trade advantage on an attack for an extra attack.' },
    { level: 18, name: 'Strength before Death', text: 'Reaction on dropping to 0 hit points. Take an extra turn first. Once per long rest.' }
  ]
},
{ id: 'psiWarrior', classId: 'fighter', name: 'Psi Warrior', source: 'TCE 42',
  features: [
    { level: 3, name: 'Psionic Power', text: 'Psionic Energy dice, twice your proficiency bonus per long rest, starting at d6 and growing with level.' },
    { level: 3, name: 'Protective Field', text: 'Reaction. Spend a die to reduce damage to a creature within 30 feet by the die + your Intelligence modifier.' },
    { level: 3, name: 'Psionic Strike', text: 'Once per turn, spend a die to add it plus your Intelligence modifier as force damage.' },
    { level: 3, name: 'Telekinetic Movement', text: 'Move an object or creature 30 feet with your mind.' },
    { level: 7, name: 'Telekinetic Adept', text: 'Psi-Powered Leap and Telekinetic Thrust, which can push or knock prone a target of your Psionic Strike.' },
    { level: 10, name: 'Guarded Mind', text: 'Resistance to psychic damage, and spend a die to end a charm or fright.' },
    { level: 15, name: 'Bulwark of Force', text: 'Give yourself and up to your Intelligence modifier in creatures half cover for 1 minute.' }
  ],
  columns: [{ id: 'psiDie', label: 'Psionic Energy die', ramp: [[3, 'd6'], [5, 'd8'], [11, 'd10'], [17, 'd12']] }]
},
{ id: 'runeKnight', classId: 'fighter', name: 'Rune Knight', source: 'TCE 45',
  tools: ["Smith's tools"],
  features: [
    { level: 3, name: 'Bonus Proficiencies', text: 'Proficiency with smith\u2019s tools, and you understand Giant.' },
    { level: 3, name: 'Rune Carver', text: 'Inscribe runes on your gear, each granting a passive benefit and an invocable power.',
      choice: { id: 'runes', label: 'Runes known', type: 'rune', countColumn: 'runesKnown' } },
    { level: 3, name: "Giant's Might", text: 'Bonus action. Grow to Large, gain advantage on Strength checks and saves, and add 1d6 to one damage roll per turn.' },
    { level: 7, name: 'Runic Shield', text: 'Reaction. Force an attacker to reroll against a creature within 60 feet. Uses equal your proficiency bonus per long rest.' },
    { level: 10, name: 'Great Stature', text: 'You grow 3d4 inches taller, and Giant\u2019s Might deals 1d8.' },
    { level: 15, name: 'Master of Runes', text: 'Invoke each rune twice per short rest.' },
    { level: 18, name: 'Runic Juggernaut', text: 'Giant\u2019s Might deals 1d10, makes you Huge, and adds 5 feet of reach.' }
  ],
  columns: [{ id: 'runesKnown', label: 'Runes known', ramp: [[3, 2], [7, 3], [10, 4], [15, 5]] }]
},

/* ============================== MONK =============================== */
{ id: 'drunkenMaster', classId: 'monk', name: 'Way of the Drunken Master', source: 'XGE 33',
  skills: { count: 1, from: ['performance'] },
  tools: ["Brewer's supplies"],
  features: [
    { level: 3, name: 'Bonus Proficiencies', text: 'Proficiency in Performance and with brewer\u2019s supplies.' },
    { level: 3, name: 'Drunken Technique', text: 'Flurry of Blows grants the benefit of Disengage and 10 feet of extra movement.' },
    { level: 6, name: 'Tipsy Sway', text: 'Leap to your feet from prone for 5 feet of movement, and redirect a missed attack onto another creature for 1 ki.' },
    { level: 11, name: "Drunkard's Luck", text: 'Spend 2 ki to cancel disadvantage on an attack, check, or save.' },
    { level: 17, name: 'Intoxicated Frenzy', text: 'Flurry of Blows allows up to three extra attacks against different targets.' }
  ]
},
{ id: 'kensei', classId: 'monk', name: 'Way of the Kensei', source: 'XGE 34',
  features: [
    { level: 3, name: 'Path of the Kensei', text: 'Choose two kensei weapons, gaining proficiency and treating them as monk weapons, plus an agile parry or ranged bonus.',
      choice: { id: 'kenseiWeapons', label: 'Kensei weapons', type: 'weapon', count: 2 } },
    { level: 6, name: 'One with the Blade', text: 'Kensei weapons count as magical, and you may spend 1 ki for extra damage equal to your Martial Arts die.' },
    { level: 11, name: 'Sharpen the Blade', text: 'Spend up to 3 ki to give a kensei weapon a matching bonus to attack and damage for 1 minute.' },
    { level: 17, name: 'Unerring Accuracy', text: 'Reroll a missed monk weapon attack once per turn.' }
  ]
},
{ id: 'sunSoul', classId: 'monk', name: 'Way of the Sun Soul', source: 'XGE 35',
  features: [
    { level: 3, name: 'Radiant Sun Bolt', text: 'A ranged spell attack at 30 feet dealing your Martial Arts die in radiant damage, with bonus action attacks for 1 ki.' },
    { level: 6, name: 'Searing Arc Strike', text: 'Spend ki after the Attack action to cast burning hands as a bonus action.' },
    { level: 11, name: 'Searing Sunburst', text: 'Action. A 20-foot sphere of light dealing 2d6 radiant damage, raised by 2d6 per ki point spent.' },
    { level: 17, name: 'Sun Shield', text: 'Emit bright light, and damage a melee attacker for 5 + your Wisdom modifier in radiant damage.' }
  ]
},
{ id: 'mercy', classId: 'monk', name: 'Way of Mercy', source: 'TCE 49',
  skills: { count: 1, from: ['insight', 'medicine'] },
  tools: ["Herbalism kit"],
  features: [
    { level: 3, name: 'Implements of Mercy', text: 'Proficiency in Insight and Medicine, and with the herbalism kit.' },
    { level: 3, name: 'Hand of Healing', text: 'Spend 1 ki to restore a number of hit points equal to your Martial Arts die + your Wisdom modifier.' },
    { level: 3, name: 'Hand of Harm', text: 'Spend 1 ki on a hit for extra necrotic damage equal to your Martial Arts die + your Wisdom modifier. Once per turn.' },
    { level: 6, name: 'Physician\u2019s Touch', text: 'Hand of Healing also ends a condition; Hand of Harm also poisons the target.' },
    { level: 11, name: 'Flurry of Healing and Harm', text: 'Flurry of Blows carries Hand of Healing without ki, and Hand of Harm on one hit.' },
    { level: 17, name: 'Hand of Ultimate Mercy', text: 'Spend 5 ki to return a creature dead no more than 24 hours to life. Once per long rest.' }
  ]
},
{ id: 'astralSelf', classId: 'monk', name: 'Way of the Astral Self', source: 'TCE 50',
  features: [
    { level: 3, name: 'Arms of the Astral Self', text: 'Bonus action. Spend 1 ki for spectral arms that use Wisdom for attacks and add your Wisdom modifier to Strength checks.' },
    { level: 6, name: 'Visage of the Astral Self', text: 'Spectral features granting darkvision, advantage on Insight and Intimidation, and Wisdom of the Spirit.' },
    { level: 11, name: 'Body of the Astral Self', text: 'With both arms and visage summoned, gain Deflect Energy and an extra damage die once per turn.' },
    { level: 17, name: 'Awakened Astral Self', text: 'Summon the full astral self for +2 AC, a third arm attack, and an extra attack.' }
  ]
},

/* ============================= PALADIN ============================= */
{ id: 'conquest', classId: 'paladin', name: 'Oath of Conquest', source: 'XGE 37',
  spells: { 3: ['Armor of Agathys', 'Command'], 5: ['Hold Person', 'Spiritual Weapon'],
            9: ['Bestow Curse', 'Fear'], 13: ['Dominate Beast', 'Stoneskin'],
            17: ['Cloudkill', 'Dominate Person'] },
  features: [
    { level: 3, name: 'Channel Divinity: Conquering Presence', text: 'Frighten creatures within 30 feet for 1 minute on a failed Wisdom save.' },
    { level: 3, name: 'Channel Divinity: Guided Strike', text: '+10 to an attack roll after seeing the result.' },
    { level: 7, name: 'Aura of Conquest', text: 'Frightened creatures within 10 feet have their speed reduced to 0 and take psychic damage, extending to 30 feet at 18th level.' },
    { level: 15, name: 'Scornful Rebuke', text: 'A creature that hits you takes psychic damage equal to your Charisma modifier.' },
    { level: 20, name: 'Invincible Conqueror', text: 'Action. For 1 minute gain resistance to all damage, an extra attack, and critical hits on a 19 or 20. Once per long rest.' }
  ]
},
{ id: 'redemption', classId: 'paladin', name: 'Oath of Redemption', source: 'XGE 38',
  spells: { 3: ['Sanctuary', 'Sleep'], 5: ['Calm Emotions', 'Hold Person'],
            9: ['Counterspell', 'Hypnotic Pattern'], 13: ['Otiluke\u2019s Resilient Sphere', 'Stoneskin'],
            17: ['Hold Monster', 'Wall of Force'] },
  features: [
    { level: 3, name: 'Channel Divinity: Emissary of Peace', text: 'Gain a +5 bonus to Persuasion checks for 10 minutes.' },
    { level: 3, name: 'Channel Divinity: Rebuke the Violent', text: 'Reaction. Deal radiant damage equal to the damage an attacker dealt to another creature.' },
    { level: 7, name: 'Aura of the Guardian', text: 'Take the damage an ally within 10 feet would suffer, extending to 30 feet at 18th level.' },
    { level: 15, name: 'Protective Spirit', text: 'Regain 1d6 + half your paladin level hit points at the end of your turn while below half your maximum.' },
    { level: 20, name: 'Emissary of Redemption', text: 'Resistance to all damage from other creatures, and attackers take radiant damage in return.' }
  ]
},
{ id: 'glory', classId: 'paladin', name: 'Oath of Glory', source: 'TCE 54',
  spells: { 3: ['Guiding Bolt', 'Heroism'], 5: ['Enhance Ability', 'Magic Weapon'],
            9: ['Haste', 'Protection from Energy'], 13: ['Compulsion', 'Freedom of Movement'],
            17: ['Commune', 'Flame Strike'] },
  features: [
    { level: 3, name: 'Channel Divinity: Peerless Athlete', text: 'Advantage on Athletics and Acrobatics for 10 minutes, with greater carrying and jumping.' },
    { level: 3, name: 'Channel Divinity: Inspiring Smite', text: 'Distribute temporary hit points after a Divine Smite.' },
    { level: 7, name: 'Aura of Alacrity', text: 'Your speed increases by 10 feet, and allies who start their turn near you gain 10 feet of speed.' },
    { level: 15, name: 'Glorious Defense', text: 'Reaction. Add your Charisma modifier to a creature\u2019s AC against an attack, and strike back if it misses.' },
    { level: 20, name: 'Living Legend', text: 'Action. For 1 minute gain Charisma-based persuasion advantage, turn a miss into a hit once per turn, and reroll failed saves. Once per long rest.' }
  ]
},
{ id: 'watchers', classId: 'paladin', name: 'Oath of the Watchers', source: 'TCE 56',
  spells: { 3: ['Alarm', 'Detect Magic'], 5: ['Moonbeam', 'See Invisibility'],
            9: ['Counterspell', 'Nondetection'], 13: ['Aura of Purity', 'Banishment'],
            17: ['Hold Monster', 'Scrying'] },
  features: [
    { level: 3, name: 'Channel Divinity: Watcher\u2019s Will', text: 'Give yourself and up to your Charisma modifier in creatures advantage on Intelligence, Wisdom, and Charisma saves for 1 minute.' },
    { level: 3, name: 'Channel Divinity: Abjure the Extraplanar', text: 'Turn aberrations, celestials, elementals, fey, and fiends within 30 feet for 1 minute.' },
    { level: 7, name: 'Aura of the Sentinel', text: 'You and allies within 10 feet add your proficiency bonus to initiative, extending to 30 feet at 18th level.' },
    { level: 15, name: 'Vigilant Rebuke', text: 'Reaction. Deal 2d8 + your Charisma modifier force damage to a creature whose spell you resisted.' },
    { level: 20, name: 'Mortal Bulwark', text: 'Action. For 1 minute gain truesight, advantage against extraplanar creatures, and the power to banish them. Once per long rest.' }
  ]
},

/* ============================== RANGER ============================= */
{ id: 'gloomStalker', classId: 'ranger', name: 'Gloom Stalker', source: 'XGE 41',
  spells: { 3: ['Disguise Self'], 5: ['Rope Trick'], 9: ['Fear'],
            13: ['Greater Invisibility'], 17: ['Seeming'] },
  features: [
    { level: 3, name: 'Dread Ambusher', text: '+ your Wisdom modifier to initiative, and on your first turn 10 extra feet of speed and an extra attack dealing 1d8.' },
    { level: 3, name: 'Umbral Sight', text: 'Darkvision to 60 feet, and invisibility to darkvision while in darkness.' },
    { level: 7, name: 'Iron Mind', text: 'Proficiency in Wisdom saves, or Intelligence or Charisma if you already have it.', addSave: 'wis' },
    { level: 11, name: "Stalker's Flurry", text: 'Make another weapon attack when you miss. Once per turn.' },
    { level: 15, name: 'Shadowy Dodge', text: 'Reaction. Impose disadvantage on an attack that would hit you.' }
  ]
},
{ id: 'horizonWalker', classId: 'ranger', name: 'Horizon Walker', source: 'XGE 42',
  spells: { 3: ['Protection from Evil and Good'], 5: ['Misty Step'], 9: ['Haste'],
            13: ['Banishment'], 17: ['Teleportation Circle'] },
  features: [
    { level: 3, name: 'Detect Portal', text: 'Sense the nearest planar portal within 1 mile. Once per short rest.' },
    { level: 3, name: 'Planar Warrior', text: 'Bonus action. Mark a creature so your attack deals force damage plus 1d8, rising to 2d8 at 11th level.' },
    { level: 7, name: 'Ethereal Step', text: 'Bonus action. Cast etherealness on yourself for one turn. Once per short rest.' },
    { level: 11, name: 'Distant Strike', text: 'Teleport 10 feet before each attack, and attack a third creature if you strike two.' },
    { level: 15, name: 'Spectral Defense', text: 'Reaction. Halve the damage of an attack that hits you.' }
  ]
},
{ id: 'monsterSlayer', classId: 'ranger', name: 'Monster Slayer', source: 'XGE 43',
  spells: { 3: ['Protection from Evil and Good'], 5: ['Zone of Truth'], 9: ['Magic Circle'],
            13: ['Blight'], 17: ['Hold Monster'] },
  features: [
    { level: 3, name: "Hunter's Sense", text: 'Action. Learn a creature\u2019s immunities, resistances, and vulnerabilities. Uses equal your Wisdom modifier per long rest.' },
    { level: 3, name: "Slayer's Prey", text: 'Bonus action. Mark a creature to take an extra 1d6 damage from your first hit each turn.' },
    { level: 7, name: 'Supernatural Defense', text: 'Add 1d6 to saves and escape checks against your marked quarry.' },
    { level: 11, name: "Magic-User's Nemesis", text: 'Reaction. Force a caster or teleporter to fail on a Wisdom save. Once per short rest.' },
    { level: 15, name: "Slayer's Counter", text: 'Reaction. Attack your quarry when it forces a save; a hit means the save succeeds.' }
  ]
},
{ id: 'feyWanderer', classId: 'ranger', name: 'Fey Wanderer', source: 'TCE 58',
  spells: { 3: ['Charm Person'], 5: ['Misty Step'], 9: ['Dispel Magic'],
            13: ['Dimension Door'], 17: ['Mislead'] },
  features: [
    { level: 3, name: 'Dreadful Strikes', text: 'Once per turn, deal an extra 1d4 psychic damage, rising to 1d6 at 11th level.' },
    { level: 3, name: 'Otherworldly Glamour', text: 'Add your Wisdom modifier to Charisma checks, and gain proficiency in one Charisma skill.',
      choice: { id: 'feySkill', label: 'Charisma skill', type: 'skill', count: 1,
        from: ['deception', 'intimidation', 'performance', 'persuasion'] } },
    { level: 7, name: 'Beguiling Twist', text: 'Advantage on saves against being charmed or frightened, and a reaction to redirect such an effect.' },
    { level: 11, name: 'Fey Reinforcements', text: 'You always have summon fey prepared, and can cast it once per long rest without a slot.' },
    { level: 15, name: 'Misty Wanderer', text: 'Cast misty step without a slot, taking a willing creature with you. Uses equal your Wisdom modifier per long rest.' }
  ]
},
{ id: 'swarmkeeper', classId: 'ranger', name: 'Swarmkeeper', source: 'TCE 60',
  spells: { 3: ['Mage Hand', 'Faerie Fire'], 5: ['Web'], 9: ['Gaseous Form'],
            13: ['Arcane Eye'], 17: ['Insect Plague'] },
  features: [
    { level: 3, name: 'Gathered Swarm', text: 'Once per turn, your swarm deals 1d6 piercing damage, moves the target 15 feet, or moves you 5 feet.' },
    { level: 7, name: 'Writhing Tide', text: 'Bonus action. Gain a flying speed of 10 feet for 1 minute. Uses equal your proficiency bonus per long rest.' },
    { level: 11, name: 'Mighty Swarm', text: 'Gathered Swarm deals 1d8, knocks prone, or grants half cover.' },
    { level: 15, name: 'Swarming Dispersal', text: 'Reaction. Gain resistance to damage and teleport 30 feet. Uses equal your proficiency bonus per long rest.' }
  ]
},

/* ============================== ROGUE ============================== */
{ id: 'inquisitive', classId: 'rogue', name: 'Inquisitive', source: 'XGE 45',
  features: [
    { level: 3, name: 'Ear for Deceit', text: 'Treat a d20 roll of 7 or lower as an 8 when detecting a lie with Insight.' },
    { level: 3, name: 'Eye for Detail', text: 'Bonus action. Make a Perception check to spot a hidden creature or an Investigation check to uncover a clue.' },
    { level: 3, name: 'Insightful Fighting', text: 'Bonus action. Read a creature to gain Sneak Attack against it without advantage for 1 minute.' },
    { level: 9, name: 'Steady Eye', text: 'Advantage on Perception and Investigation checks if you move no more than half your speed.' },
    { level: 13, name: 'Unerring Eye', text: 'Sense illusions and other deceptions within 30 feet. Uses equal your Wisdom modifier per long rest.' },
    { level: 17, name: 'Eye for Weakness', text: 'Insightful Fighting adds 3d6 to your Sneak Attack.' }
  ]
},
{ id: 'mastermind', classId: 'rogue', name: 'Mastermind', source: 'XGE 46',
  tools: ['Disguise kit', 'Forgery kit'],
  features: [
    { level: 3, name: 'Master of Intrigue', text: 'Proficiency with the disguise kit, forgery kit, one gaming set, and two languages. You can mimic speech and handwriting.',
      choice: { id: 'mastermindGaming', label: 'Gaming set', type: 'tool', count: 1, from: 'gaming' },
      choice2: { id: 'mastermindLangs', label: 'Languages', type: 'language', count: 2 } },
    { level: 3, name: 'Master of Tactics', text: 'Use the Help action as a bonus action, at a range of 30 feet.' },
    { level: 9, name: 'Insightful Manipulator', text: 'Study a creature for 1 minute to learn two of its characteristics compared to your own.' },
    { level: 13, name: 'Misdirection', text: 'Reaction. Redirect an attack on you to a creature providing you cover.' },
    { level: 17, name: 'Soul of Deceit', text: 'Your thoughts cannot be read, and magic never detects your lies.' }
  ]
},
{ id: 'scout', classId: 'rogue', name: 'Scout', source: 'XGE 47',
  features: [
    { level: 3, name: 'Skirmisher', text: 'Reaction. Move half your speed when an enemy ends its turn within 5 feet, without provoking.' },
    { level: 3, name: 'Survivalist', text: 'Proficiency and expertise in Nature and Survival.',
      expertiseSkills: ['nature', 'survival'] },
    { level: 9, name: 'Superior Mobility', text: 'Your walking speed increases by 10 feet.', speed: 10 },
    { level: 13, name: 'Ambush Master', text: 'Advantage on initiative, and allies gain advantage against the first creature you hit.' },
    { level: 17, name: 'Sudden Strike', text: 'Bonus action for an extra attack, with Sneak Attack usable twice per turn against different targets.' }
  ]
},
{ id: 'swashbuckler', classId: 'rogue', name: 'Swashbuckler', source: 'XGE 47',
  features: [
    { level: 3, name: 'Fancy Footwork', text: 'A creature you attack in melee cannot make opportunity attacks against you this turn.' },
    { level: 3, name: 'Rakish Audacity', text: 'Add your Charisma modifier to initiative, and Sneak Attack a lone adjacent foe without advantage.' },
    { level: 9, name: 'Panache', text: 'A Persuasion contest charms a creature for 1 minute or goads a hostile one into attacking only you.' },
    { level: 13, name: 'Elegant Maneuver', text: 'Bonus action. Gain advantage on your next Acrobatics or Athletics check.' },
    { level: 17, name: 'Master Duelist', text: 'Reroll a missed attack with advantage. Once per short rest.' }
  ]
},
{ id: 'phantom', classId: 'rogue', name: 'Phantom', source: 'TCE 62',
  features: [
    { level: 3, name: 'Whispers of the Dead', text: 'Gain proficiency in one skill or tool after each rest.' },
    { level: 3, name: 'Wails from the Grave', text: 'Sneak Attack also deals half as many d6s of necrotic damage to a second creature. Uses equal your proficiency bonus per long rest.' },
    { level: 9, name: 'Tokens of the Departed', text: 'A soul trinket from each death near you grants advantage on Constitution and death saves, and fuels your other features.' },
    { level: 13, name: 'Ghost Walk', text: 'Bonus action. Assume spectral form with a 10-foot flying speed and the ability to pass through creatures and objects.' },
    { level: 17, name: "Death's Friend", text: 'Wails from the Grave triggers on every Sneak Attack, and you gain a soul trinket after each long rest.' }
  ]
},
{ id: 'soulknife', classId: 'rogue', name: 'Soulknife', source: 'TCE 64',
  features: [
    { level: 3, name: 'Psionic Power', text: 'Psionic Energy dice, twice your proficiency bonus per long rest, starting at d6 and growing with level. They fuel Psi-Bolstered Knack and Psychic Whispers.' },
    { level: 3, name: 'Psychic Blades', text: 'Manifest a thrown or melee psychic blade dealing 1d6 psychic damage, with a bonus action second blade at 1d4.' },
    { level: 9, name: 'Soul Blades', text: 'Homing Strikes turns a miss into a hit, and Psychic Teleportation throws a blade to teleport you.' },
    { level: 13, name: 'Psychic Veil', text: 'Turn invisible for 1 hour. Once per long rest, or by spending a Psionic Energy die.' },
    { level: 17, name: 'Rend Mind', text: 'Sneak Attack with a Psychic Blade can stun a creature for 1 minute.' }
  ],
  columns: [{ id: 'psiDie', label: 'Psionic Energy die', ramp: [[3, 'd6'], [5, 'd8'], [11, 'd10'], [17, 'd12']] }]
},

/* ============================ SORCERER ============================= */
{ id: 'divineSoul', classId: 'sorcerer', name: 'Divine Soul', source: 'XGE 50',
  features: [
    { level: 1, name: 'Divine Magic', text: 'You may choose spells from the cleric list as well, and your affinity grants one spell always known.',
      choice: { id: 'divineAffinity', label: 'Divine affinity', type: 'list', count: 1,
        from: ['Good \u2014 cure wounds', 'Evil \u2014 inflict wounds', 'Law \u2014 bless', 'Chaos \u2014 bane', 'Neutrality \u2014 protection from evil and good'] },
      extraList: 'cleric' },
    { level: 1, name: 'Favored by the Gods', text: 'Add 2d4 to a failed save or missed attack. Once per short rest.' },
    { level: 6, name: 'Empowered Healing', text: 'Spend 1 sorcery point to reroll healing dice. Once per turn.' },
    { level: 14, name: 'Otherworldly Wings', text: 'Bonus action. Sprout wings with a flying speed of 30 feet.' },
    { level: 18, name: 'Unearthly Recovery', text: 'Bonus action. Regain hit points equal to half your maximum while below half. Once per long rest.' }
  ]
},
{ id: 'shadowMagic', classId: 'sorcerer', name: 'Shadow Magic', source: 'XGE 50',
  features: [
    { level: 1, name: 'Eyes of the Dark', text: 'Darkvision to 120 feet, and you know darkness, castable with sorcery points and visible through your own darkness.', grantsSpell: 'Darkness' },
    { level: 1, name: 'Strength of the Grave', text: 'A Charisma save lets you drop to 1 hit point instead of 0. Once per long rest.' },
    { level: 6, name: 'Hound of Ill Omen', text: 'Spend 3 sorcery points to summon a dire wolf that hunts one creature and gives you advantage against it.' },
    { level: 14, name: 'Shadow Walk', text: 'Bonus action in dim light or darkness. Teleport up to 120 feet.' },
    { level: 18, name: 'Umbral Form', text: 'Spend 6 sorcery points to become shadow, with resistance to all damage but force and radiant.' }
  ]
},
{ id: 'stormSorcery', classId: 'sorcerer', name: 'Storm Sorcery', source: 'XGE 51',
  features: [
    { level: 1, name: 'Wind Speaker', text: 'You speak, read, and write Primordial and its dialects.' },
    { level: 1, name: 'Tempestuous Magic', text: 'Bonus action before or after casting a spell of 1st level or higher. Fly 10 feet without provoking.' },
    { level: 6, name: 'Heart of the Storm', text: 'Resistance to lightning and thunder damage, and nearby creatures take damage when you cast such a spell.' },
    { level: 6, name: 'Storm Guide', text: 'Stop rain around you, or direct the wind.' },
    { level: 14, name: "Storm's Fury", text: 'Reaction. Damage and push a creature that hits you in melee.' },
    { level: 18, name: 'Wind Soul', text: 'Immunity to lightning and thunder, a 60-foot flying speed, and the power to grant flight to others.' }
  ]
},
{ id: 'aberrantMind', classId: 'sorcerer', name: 'Aberrant Mind', source: 'TCE 66',
  spells: { 1: ['Arms of Hadar', 'Dissonant Whispers', 'Mind Sliver'],
            2: ['Calm Emotions', 'Detect Thoughts', 'Phantasmal Force'],
            3: ['Hunger of Hadar', 'Sending', 'Summon Aberration'],
            4: ['Evard\u2019s Black Tentacles', 'Summon Aberration'],
            5: ['Rary\u2019s Telepathic Bond', 'Telekinesis'] },
  spellsNote: 'Psionic Spells. You learn one at each listed sorcerer level; they count as sorcerer spells and do not count against your spells known.',
  features: [
    { level: 1, name: 'Psionic Spells', text: 'Learn psionic spells as you gain levels, swapping one for a divination or enchantment spell whenever you gain a sorcerer level.' },
    { level: 1, name: 'Telepathic Speech', text: 'Bonus action. Link telepathically with a creature for a number of minutes equal to your sorcerer level.' },
    { level: 6, name: 'Psionic Sorcery', text: 'Cast a psionic spell with sorcery points instead of a slot, without verbal or somatic components.' },
    { level: 6, name: 'Psychic Defenses', text: 'Resistance to psychic damage, and advantage on saves against being charmed or frightened.' },
    { level: 14, name: 'Revelation in Flesh', text: 'Spend sorcery points for aberrant senses: flight, swimming, seeing invisibility, or squeezing through gaps.' },
    { level: 18, name: 'Warping Implosion', text: 'Teleport 120 feet and deal 3d10 force damage to creatures at your origin. Once per long rest.' }
  ]
},
{ id: 'clockworkSoul', classId: 'sorcerer', name: 'Clockwork Soul', source: 'TCE 68',
  spells: { 1: ['Alarm', 'Protection from Evil and Good'], 2: ['Aid', 'Lesser Restoration'],
            3: ['Dispel Magic', 'Protection from Energy'], 4: ['Freedom of Movement', 'Summon Construct'],
            5: ['Greater Restoration', 'Wall of Force'] },
  spellsNote: 'Clockwork Spells. They count as sorcerer spells and do not count against your spells known.',
  features: [
    { level: 1, name: 'Restore Balance', text: 'Reaction. Cancel advantage or disadvantage on a roll within 60 feet. Uses equal your proficiency bonus per long rest.' },
    { level: 6, name: 'Bastion of Law', text: 'Spend 1 to 5 sorcery points to give a creature that many d8s to spend warding off damage.' },
    { level: 14, name: 'Trance of Order', text: 'Bonus action. For 1 minute, treat attack rolls of 9 or lower as 10 and deny attackers advantage. Once per long rest.' },
    { level: 18, name: 'Clockwork Cavalcade', text: 'Spend 7 sorcery points to heal, repair, and dispel within a 30-foot cube.' }
  ]
},

/* ============================= WARLOCK ============================= */
{ id: 'celestial', classId: 'warlock', name: 'The Celestial', source: 'XGE 54',
  expandedList: true,
  spells: { 1: ['Cure Wounds', 'Guiding Bolt'], 2: ['Flaming Sphere', 'Lesser Restoration'],
            3: ['Daylight', 'Revivify'], 4: ['Guardian of Faith', 'Wall of Fire'],
            5: ['Flame Strike', 'Greater Restoration'] },
  spellsNote: 'Expanded spell list. These are added to the spells you may choose as warlock spells known.',
  features: [
    { level: 1, name: 'Bonus Cantrips', text: 'You learn light and sacred flame.', grantsSpell: 'Sacred Flame' },
    { level: 1, name: 'Healing Light', text: 'A pool of d6s equal to 1 + your warlock level, spent as a bonus action to heal.' },
    { level: 6, name: 'Radiant Soul', text: 'Resistance to radiant damage, and your Charisma modifier added to one radiant or fire spell\u2019s damage.' },
    { level: 10, name: 'Celestial Resilience', text: 'Temporary hit points for you and your allies after each rest.' },
    { level: 14, name: 'Searing Vengeance', text: 'Rise to half your hit points when you would make a death save, blinding and burning nearby enemies. Once per long rest.' }
  ]
},
{ id: 'hexblade', classId: 'warlock', name: 'The Hexblade', source: 'XGE 55',
  armor: ['Medium armor', 'Shields'], weaponCategories: ['Martial weapons'],
  expandedList: true,
  spells: { 1: ['Shield', 'Wrathful Smite'], 2: ['Blur', 'Branding Smite'],
            3: ['Blink', 'Elemental Weapon'], 4: ['Phantasmal Killer', 'Staggering Smite'],
            5: ['Banishing Smite', 'Cone of Cold'] },
  spellsNote: 'Expanded spell list. These are added to the spells you may choose as warlock spells known.',
  features: [
    { level: 1, name: "Hexblade's Curse", text: 'Bonus action. Curse a creature for 1 minute: bonus damage, critical hits on 19 or 20, and healing when it dies.' },
    { level: 1, name: 'Hex Warrior', text: 'Proficiency with medium armor, shields, and martial weapons, and one weapon that uses Charisma for attack and damage.' },
    { level: 6, name: 'Accursed Specter', text: 'Raise a slain humanoid as a specter until your next long rest.' },
    { level: 10, name: 'Armor of Hexes', text: 'A cursed creature has a chance to miss you entirely.' },
    { level: 14, name: 'Master of Hexes', text: 'Move your curse to a new creature when the cursed one dies.' }
  ]
},
{ id: 'fathomless', classId: 'warlock', name: 'The Fathomless', source: 'TCE 71',
  expandedList: true,
  spells: { 1: ['Create or Destroy Water', 'Thunderwave'], 2: ['Gust of Wind', 'Silence'],
            3: ['Lightning Bolt', 'Sleet Storm'], 4: ['Control Water', 'Summon Elemental'],
            5: ['Bigby\u2019s Hand', 'Cone of Cold'] },
  spellsNote: 'Expanded spell list. These are added to the spells you may choose as warlock spells known.',
  features: [
    { level: 1, name: 'Tentacle of the Deeps', text: 'Bonus action. Summon a spectral tentacle dealing 1d8 cold damage and halving a target\u2019s speed. Uses equal your proficiency bonus per long rest.' },
    { level: 1, name: 'Gift of the Sea', text: 'A swimming speed of 40 feet and the ability to breathe underwater.' },
    { level: 6, name: 'Oceanic Soul', text: 'Resistance to cold damage, and you can speak with any creature underwater.' },
    { level: 6, name: 'Guardian Coil', text: 'Your tentacle reduces damage to a nearby creature by 1d8, rising to 2d8 at 10th level.' },
    { level: 10, name: 'Grasping Tentacles', text: 'You always have evard\u2019s black tentacles prepared, cast once per long rest without a slot.' },
    { level: 14, name: 'Fathomless Plunge', text: 'Action. Teleport up to six willing creatures to a coast within 1 mile. Once per short rest.' }
  ]
},
{ id: 'genie', classId: 'warlock', name: 'The Genie', source: 'TCE 73',
  expandedList: true,
  spells: { 1: ['Detect Evil and Good'], 2: ['Phantasmal Force'], 3: ['Create Food and Water'],
            4: ['Phantasmal Killer'], 5: ['Creation'], 9: ['Wish'] },
  spellsNote: 'Expanded spell list, plus the spells of your patron\u2019s kind shown below.',
  variantSpells: {
    key: 'genieKind',
    'Dao \u2014 earth': { 1: ['Sanctuary'], 2: ['Spike Growth'], 3: ['Meld into Stone'], 4: ['Stone Shape'], 5: ['Wall of Stone'] },
    'Djinni \u2014 air': { 1: ['Thunderwave'], 2: ['Gust of Wind'], 3: ['Wind Wall'], 4: ['Greater Invisibility'], 5: ['Seeming'] },
    'Efreeti \u2014 fire': { 1: ['Burning Hands'], 2: ['Scorching Ray'], 3: ['Fireball'], 4: ['Fire Shield'], 5: ['Flame Strike'] },
    'Marid \u2014 water': { 1: ['Fog Cloud'], 2: ['Blur'], 3: ['Sleet Storm'], 4: ['Control Water'], 5: ['Cone of Cold'] }
  },
  features: [
    { level: 1, name: "Genie's Vessel", text: 'A Tiny vessel that serves as a spellcasting focus, grants bonus damage once per turn, and can be entered as a refuge.',
      choice: { id: 'genieKind', label: 'Genie kind', type: 'list', count: 1,
        from: ['Dao \u2014 earth', 'Djinni \u2014 air', 'Efreeti \u2014 fire', 'Marid \u2014 water'] } },
    { level: 6, name: 'Elemental Gift', text: 'Resistance to your patron\u2019s damage type, and a bonus action flying speed of 30 feet.' },
    { level: 10, name: 'Sanctuary Vessel', text: 'Take up to five creatures into your vessel, where a short rest counts as a long one.' },
    { level: 14, name: 'Limited Wish', text: 'Cast any spell of 6th level or lower without components. Once per 1d4 long rests.' }
  ]
},

/* ============================== WIZARD ============================= */
{ id: 'warMagic', classId: 'wizard', name: 'War Magic', source: 'XGE 59',
  features: [
    { level: 2, name: 'Arcane Deflection', text: 'Reaction. Gain +2 AC or +4 on a save, at the cost of casting only cantrips next turn.' },
    { level: 2, name: 'Tactical Wit', text: 'Add your Intelligence modifier to initiative.' },
    { level: 6, name: 'Power Surge', text: 'Store surges from dispelled spells, spending one to add half your wizard level to a spell\u2019s damage.' },
    { level: 10, name: 'Durable Magic', text: '+2 to AC and saves while concentrating on a spell.' },
    { level: 14, name: 'Deflecting Shroud', text: 'Arcane Deflection also deals force damage to up to three nearby creatures.' }
  ]
},
{ id: 'bladesinging', classId: 'wizard', name: 'Bladesinging', source: 'TCE 76',
  armor: ['Light armor'],
  features: [
    { level: 2, name: 'Training in War and Song', text: 'Proficiency with light armor, one one-handed melee weapon, and Performance.',
      choice: { id: 'bladesingWeapon', label: 'One-handed melee weapon', type: 'weapon', count: 1 } },
    { level: 2, name: 'Bladesong', text: 'Bonus action. For 1 minute gain +Intelligence modifier to AC, 10 feet of speed, advantage on Acrobatics, and concentration bonuses. Uses equal your proficiency bonus per rest.' },
    { level: 6, name: 'Extra Attack', text: 'Attack twice when you take the Attack action, and may replace one attack with a cantrip.' },
    { level: 10, name: 'Song of Defense', text: 'Expend a spell slot while Bladesong is active to reduce damage by five times the slot level.' },
    { level: 14, name: 'Song of Victory', text: 'Add your Intelligence modifier to melee weapon damage during Bladesong.' }
  ]
},
{ id: 'scribes', classId: 'wizard', name: 'Order of Scribes', source: 'TCE 77',
  features: [
    { level: 2, name: 'Wizardly Quill', text: 'A magic quill that needs no ink, copies spells in far less time, and can erase its own writing.' },
    { level: 2, name: 'Awakened Spellbook', text: 'Your book speaks to you. Change a spell\u2019s damage type, cast a ritual at its normal time once per long rest, and replace a lost book in a day.' },
    { level: 6, name: 'Manifest Mind', text: 'Bonus action. Project your book\u2019s spirit as a light source you can cast through at 300 feet.' },
    { level: 10, name: 'Master Scrivener', text: 'Create a magic scroll of a 1st- or 2nd-level spell after each long rest.' },
    { level: 14, name: 'One with the Word', text: 'Bond so deeply with your book that you can avoid death by erasing spells from it. Once per long rest.' }
  ]
},

/* ============================ ARTIFICER ============================ */
{ id: 'alchemist', classId: 'artificer', name: 'Alchemist', source: 'TCE 18',
  tools: ["Alchemist's supplies"],
  spells: { 3: ['Healing Word', 'Ray of Sickness'], 5: ['Flaming Sphere', 'Melf\u2019s Acid Arrow'],
            9: ['Gaseous Form', 'Mass Healing Word'], 13: ['Blight', 'Death Ward'],
            17: ['Cloudkill', 'Raise Dead'] },
  features: [
    { level: 3, name: 'Tool Proficiency', text: 'Proficiency with alchemist\u2019s supplies.' },
    { level: 3, name: 'Experimental Elixir', text: 'Create random elixirs after a long rest, or by expending a spell slot, with effects from healing to flight.' },
    { level: 5, name: 'Alchemical Savant', text: 'Add your Intelligence modifier to one roll of any spell that restores hit points or deals acid, fire, necrotic, or poison damage.' },
    { level: 9, name: 'Restorative Reagents', text: 'Elixirs also grant temporary hit points, and you cast lesser restoration without a slot.' },
    { level: 15, name: 'Chemical Mastery', text: 'Resistance to acid and poison damage, immunity to the poisoned condition, and free casting of greater restoration and heal.' }
  ]
},
{ id: 'armorer', classId: 'artificer', name: 'Armorer', source: 'TCE 19',
  armor: ['Heavy armor'], tools: ["Smith's tools"],
  spells: { 3: ['Magic Missile', 'Thunderwave'], 5: ['Mirror Image', 'Shatter'],
            9: ['Hypnotic Pattern', 'Lightning Bolt'], 13: ['Fire Shield', 'Greater Invisibility'],
            17: ['Passwall', 'Wall of Force'] },
  features: [
    { level: 3, name: 'Tools of the Trade', text: 'Proficiency with heavy armor and smith\u2019s tools.' },
    { level: 3, name: 'Arcane Armor', text: 'Your armor becomes a magic item that needs no Strength, cannot be removed against your will, and replaces a spellcasting focus.' },
    { level: 3, name: 'Armor Model', text: 'Guardian for a thunder gauntlet and defensive taunt, or Infiltrator for a lightning launcher and stealth.',
      choice: { id: 'armorModel', label: 'Armor model', type: 'list', count: 1,
        from: ['Guardian', 'Infiltrator'] } },
    { level: 5, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
    { level: 9, name: 'Armor Modifications', text: 'Your armor counts as four separate items for infusions, and you gain two more infusions known.' },
    { level: 15, name: 'Perfected Armor', text: 'Your model improves: Guardian pulls creatures to you, Infiltrator staggers and damages them.' }
  ]
},
{ id: 'artillerist', classId: 'artificer', name: 'Artillerist', source: 'TCE 20',
  tools: ["Woodcarver's tools"],
  spells: { 3: ['Shield', 'Thunderwave'], 5: ['Scorching Ray', 'Shatter'],
            9: ['Fireball', 'Wind Wall'], 13: ['Ice Storm', 'Wall of Fire'],
            17: ['Cone of Cold', 'Wall of Force'] },
  features: [
    { level: 3, name: 'Tool Proficiency', text: 'Proficiency with woodcarver\u2019s tools.' },
    { level: 3, name: 'Eldritch Cannon', text: 'Create a cannon that can be a flamethrower, force ballista, or protector.' },
    { level: 5, name: 'Arcane Firearm', text: 'A wand or staff that adds 1d8 to one damage roll of your artificer spells.' },
    { level: 9, name: 'Explosive Cannon', text: 'Your cannon deals an extra 1d8, and can be detonated for 3d8 force damage.' },
    { level: 15, name: 'Fortified Position', text: 'You and allies gain half cover near your cannon, and you may have two at once.' }
  ]
},
{ id: 'battleSmith', classId: 'artificer', name: 'Battle Smith', source: 'TCE 21',
  tools: ["Smith's tools"],
  spells: { 3: ['Heroism', 'Shield'], 5: ['Branding Smite', 'Warding Bond'],
            9: ['Aura of Vitality', 'Conjure Barrage'], 13: ['Aura of Purity', 'Fire Shield'],
            17: ['Banishing Smite', 'Mass Cure Wounds'] },
  features: [
    { level: 3, name: 'Tool Proficiency', text: 'Proficiency with smith\u2019s tools.' },
    { level: 3, name: 'Battle Ready', text: 'Proficiency with martial weapons, and you may use Intelligence for magic weapon attack and damage rolls.',
      weaponCategories: ['Martial weapons'] },
    { level: 3, name: 'Steel Defender', text: 'A construct companion that acts on your turn, using your proficiency bonus.' },
    { level: 5, name: 'Extra Attack', text: 'Attack twice when you take the Attack action.' },
    { level: 9, name: 'Arcane Jolt', text: 'Add 2d6 force damage or heal a nearby creature. Uses equal your Intelligence modifier per long rest.' },
    { level: 15, name: 'Improved Defender', text: 'Arcane Jolt rises to 4d6, and your defender gains AC and a deflecting reaction.' }
  ],
  weaponCategories: ['Martial weapons']
}

]);
