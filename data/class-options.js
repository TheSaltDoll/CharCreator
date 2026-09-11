/* Class option lists: the things a class feature asks you to pick.
   PHB 2014; XGE ch.1; TCE ch.1. */
window.DND = window.DND || {};

/* ---------------------------------------------------------------
   Fighting Styles. PHB 72; TCE 41 adds the rest.
   --------------------------------------------------------------- */
DND.FIGHTING_STYLES = [
  { id: 'archery', name: 'Archery', source: 'PHB 72', classes: ['fighter', 'ranger'],
    note: '+2 to attack rolls with ranged weapons.' },
  { id: 'blessedWarrior', name: 'Blessed Warrior', source: 'TCE 41', classes: ['paladin'], optional: true,
    note: 'Learn two cleric cantrips. Charisma is your spellcasting ability for them.' },
  { id: 'blindFighting', name: 'Blind Fighting', source: 'TCE 41', classes: ['fighter', 'paladin', 'ranger'], optional: true,
    note: 'Blindsight to 10 feet. You can see anything not behind total cover, even while blinded.' },
  { id: 'defense', name: 'Defense', source: 'PHB 72', classes: ['fighter', 'paladin', 'ranger'],
    note: '+1 AC while wearing armor.', acWhileArmored: 1 },
  { id: 'druidicWarrior', name: 'Druidic Warrior', source: 'TCE 41', classes: ['ranger'], optional: true,
    note: 'Learn two druid cantrips. Wisdom is your spellcasting ability for them.' },
  { id: 'dueling', name: 'Dueling', source: 'PHB 72', classes: ['fighter', 'paladin', 'ranger'],
    note: '+2 damage with a one-handed melee weapon when no other weapon is held.' },
  { id: 'greatWeapon', name: 'Great Weapon Fighting', source: 'PHB 72', classes: ['fighter', 'paladin'],
    note: 'Reroll 1s and 2s on damage dice for two-handed or versatile melee weapons.' },
  { id: 'interception', name: 'Interception', source: 'TCE 41', classes: ['fighter', 'paladin', 'ranger'], optional: true,
    note: 'Reaction. Reduce damage to a creature within 5 feet by 1d10 + your proficiency bonus.' },
  { id: 'protection', name: 'Protection', source: 'PHB 72', classes: ['fighter', 'paladin'],
    note: 'Reaction. Impose disadvantage on an attack against a creature within 5 feet. Requires a shield.' },
  { id: 'superiorTechnique', name: 'Superior Technique', source: 'TCE 42', classes: ['fighter'], optional: true,
    note: 'Learn one maneuver and gain one superiority die (d6), regained on a short rest.',
    grantsManeuvers: 1 },
  { id: 'thrownWeapon', name: 'Thrown Weapon Fighting', source: 'TCE 42', classes: ['fighter', 'ranger'], optional: true,
    note: 'Draw a thrown weapon as part of the attack, and deal +2 damage with it.' },
  { id: 'twoWeapon', name: 'Two-Weapon Fighting', source: 'PHB 72', classes: ['fighter', 'ranger'],
    note: 'Add your ability modifier to the damage of the off-hand attack.' },
  { id: 'unarmedFighting', name: 'Unarmed Fighting', source: 'TCE 42', classes: ['fighter'], optional: true,
    note: 'Unarmed strikes deal 1d6, or 1d8 with no weapon or shield in hand. Deal 1d4 to a creature you grapple.' }
];

/* ---------------------------------------------------------------
   Metamagic. PHB 102; TCE 66 adds two.
   --------------------------------------------------------------- */
DND.METAMAGIC = [
  { id: 'careful', name: 'Careful Spell', source: 'PHB 102', note: '1 sorcery point. Chosen creatures automatically succeed on the save.' },
  { id: 'distant', name: 'Distant Spell', source: 'PHB 102', note: '1 sorcery point. Double the range, or give a touch spell 30 feet of reach.' },
  { id: 'empowered', name: 'Empowered Spell', source: 'PHB 102', note: '1 sorcery point. Reroll damage dice up to your Charisma modifier.' },
  { id: 'extended', name: 'Extended Spell', source: 'PHB 102', note: '1 sorcery point. Double the duration, to a maximum of 24 hours.' },
  { id: 'heightened', name: 'Heightened Spell', source: 'PHB 102', note: '3 sorcery points. One target has disadvantage on its first save against the spell.' },
  { id: 'quickened', name: 'Quickened Spell', source: 'PHB 102', note: '2 sorcery points. Cast a 1-action spell as a bonus action.' },
  { id: 'seeking', name: 'Seeking Spell', source: 'TCE 66', optional: true, note: '2 sorcery points. Reroll a missed spell attack.' },
  { id: 'subtle', name: 'Subtle Spell', source: 'PHB 102', note: '1 sorcery point. Cast without verbal or somatic components.' },
  { id: 'transmuted', name: 'Transmuted Spell', source: 'TCE 66', optional: true, note: '1 sorcery point. Change acid, cold, fire, lightning, poison, or thunder damage to another of those types.' },
  { id: 'twinned', name: 'Twinned Spell', source: 'PHB 102', note: 'Sorcery points equal to the spell level, minimum 1. Target a second creature with a single-target spell.' }
];

/* ---------------------------------------------------------------
   Pact Boons. PHB 107; Talisman from TCE 70.
   --------------------------------------------------------------- */
DND.PACT_BOONS = [
  { id: 'chain', name: 'Pact of the Chain', source: 'PHB 107', note: 'Learn find familiar. Your familiar may take a special form, and can forgo its attack so you may attack.' },
  { id: 'blade', name: 'Pact of the Blade', source: 'PHB 107', note: 'Create a pact weapon in your hand. You are proficient with it and may use Charisma for it if it is a melee weapon.' },
  { id: 'tome', name: 'Pact of the Tome', source: 'PHB 108', note: 'A Book of Shadows with three cantrips from any class list.' },
  { id: 'talisman', name: 'Pact of the Talisman', source: 'TCE 70', optional: true, note: 'An amulet that lets the wearer add 1d4 to a failed ability check, a number of times equal to your proficiency bonus.' }
];

/* ---------------------------------------------------------------
   Eldritch Invocations. PHB 110; XGE 56; TCE 70.
   `level` is the minimum warlock level; `boon` a required Pact Boon;
   `needs` a free-text prerequisite the app cannot yet verify.
   --------------------------------------------------------------- */
DND.INVOCATIONS = [
  { id: 'agonizingBlast', name: 'Agonizing Blast', source: 'PHB 110', needs: 'eldritch blast cantrip', note: 'Add your Charisma modifier to eldritch blast damage.' },
  { id: 'armorOfShadows', name: 'Armor of Shadows', source: 'PHB 110', note: 'Cast mage armor on yourself at will, without a slot.' },
  { id: 'ascendantStep', name: 'Ascendant Step', source: 'PHB 110', level: 9, note: 'Cast levitate on yourself at will, without a slot.' },
  { id: 'aspectOfTheMoon', name: 'Aspect of the Moon', source: 'XGE 56', boon: 'tome', optional: true, note: 'You no longer need to sleep and cannot be forced to.' },
  { id: 'beastSpeech', name: 'Beast Speech', source: 'PHB 110', note: 'Cast speak with animals at will, without a slot.' },
  { id: 'beguilingInfluence', name: 'Beguiling Influence', source: 'PHB 110', note: 'Proficiency in Deception and Persuasion.', skills: ['deception', 'persuasion'] },
  { id: 'bewitchingWhispers', name: 'Bewitching Whispers', source: 'PHB 110', level: 7, note: 'Cast compulsion once per long rest using a warlock slot.' },
  { id: 'bondOfTheTalisman', name: 'Bond of the Talisman', source: 'TCE 70', level: 12, boon: 'talisman', optional: true, note: 'Teleport to the talisman\u2019s wearer, or they to you, a number of times equal to your proficiency bonus.' },
  { id: 'bookOfAncientSecrets', name: 'Book of Ancient Secrets', source: 'PHB 110', boon: 'tome', note: 'Inscribe two 1st-level rituals in your Book of Shadows and cast them as rituals.' },
  { id: 'chainsOfCarceri', name: 'Chains of Carceri', source: 'PHB 110', level: 15, boon: 'chain', note: 'Cast hold monster at will on a celestial, fiend, or elemental, without a slot.' },
  { id: 'cloakOfFlies', name: 'Cloak of Flies', source: 'XGE 56', level: 5, optional: true, note: 'Bonus action. A 5-foot aura of flies gives advantage on Intimidation, disadvantage on other Charisma checks, and poison damage.' },
  { id: 'devilsSight', name: "Devil's Sight", source: 'PHB 110', note: 'See normally in magical and nonmagical darkness to 120 feet.' },
  { id: 'dreadfulWord', name: 'Dreadful Word', source: 'PHB 110', level: 7, note: 'Cast confusion once per long rest using a warlock slot.' },
  { id: 'eldritchMind', name: 'Eldritch Mind', source: 'TCE 70', optional: true, note: 'Advantage on Constitution saves to maintain concentration.' },
  { id: 'eldritchSight', name: 'Eldritch Sight', source: 'PHB 110', note: 'Cast detect magic at will, without a slot.' },
  { id: 'eldritchSmite', name: 'Eldritch Smite', source: 'XGE 56', level: 5, boon: 'blade', optional: true, note: 'Expend a warlock slot on a pact weapon hit for 1d8 force per slot level, plus 1d8, and knock the target prone if it is Huge or smaller.' },
  { id: 'eldritchSpear', name: 'Eldritch Spear', source: 'PHB 110', needs: 'eldritch blast cantrip', note: 'Eldritch blast has a range of 300 feet.' },
  { id: 'eyesOfTheRuneKeeper', name: 'Eyes of the Rune Keeper', source: 'PHB 110', note: 'You can read all writing.' },
  { id: 'farScribe', name: 'Far Scribe', source: 'TCE 70', level: 5, boon: 'tome', optional: true, note: 'Add names to your Book of Shadows and send messages to them as by the sending spell.' },
  { id: 'fiendishVigor', name: 'Fiendish Vigor', source: 'PHB 110', note: 'Cast false life on yourself at will as a 1st-level spell, without a slot.' },
  { id: 'gazeOfTwoMinds', name: 'Gaze of Two Minds', source: 'PHB 110', note: 'Touch a willing humanoid to perceive through its senses until the end of your next turn.' },
  { id: 'ghostlyGaze', name: 'Ghostly Gaze', source: 'XGE 56', level: 7, optional: true, note: 'See through solid objects to 30 feet for 1 minute. Once per short rest.' },
  { id: 'giftOfTheDepths', name: 'Gift of the Depths', source: 'XGE 56', level: 5, optional: true, note: 'Breathe underwater, gain a swimming speed equal to your walking speed, and cast water breathing once per long rest.' },
  { id: 'giftOfTheEverLiving', name: 'Gift of the Ever-Living Ones', source: 'XGE 57', boon: 'chain', optional: true, note: 'Healing dice rolled while your familiar is within 100 feet always roll their maximum.' },
  { id: 'giftOfTheProtectors', name: 'Gift of the Protectors', source: 'TCE 70', level: 9, boon: 'tome', optional: true, note: 'Names in your book drop to 1 hit point instead of 0, once per long rest.' },
  { id: 'graspOfHadar', name: 'Grasp of Hadar', source: 'XGE 57', needs: 'eldritch blast cantrip', optional: true, note: 'Once per turn, pull a creature hit by eldritch blast 10 feet toward you.' },
  { id: 'improvedPactWeapon', name: 'Improved Pact Weapon', source: 'XGE 57', boon: 'blade', optional: true, note: 'Your pact weapon is +1, can be a spellcasting focus, and can be a bow or crossbow.' },
  { id: 'investmentOfTheChainMaster', name: 'Investment of the Chain Master', source: 'TCE 70', level: 5, boon: 'chain', optional: true, note: 'Your familiar gains flying or swimming speed, its attacks use your save DC, and you can command it as a bonus action.' },
  { id: 'lifedrinker', name: 'Lifedrinker', source: 'PHB 110', level: 12, boon: 'blade', note: 'Your pact weapon deals extra necrotic damage equal to your Charisma modifier.' },
  { id: 'maddeningHex', name: 'Maddening Hex', source: 'XGE 57', level: 5, needs: 'hex or a curse-bestowing warlock feature', optional: true, note: 'Bonus action. Deal psychic damage equal to your Charisma modifier to creatures near your cursed target.' },
  { id: 'maskOfManyFaces', name: 'Mask of Many Faces', source: 'PHB 110', note: 'Cast disguise self at will, without a slot.' },
  { id: 'masterOfMyriadForms', name: 'Master of Myriad Forms', source: 'PHB 111', level: 15, note: 'Cast alter self at will, without a slot.' },
  { id: 'minionsOfChaos', name: 'Minions of Chaos', source: 'PHB 111', level: 9, note: 'Cast conjure elemental once per long rest using a warlock slot.' },
  { id: 'mireTheMind', name: 'Mire the Mind', source: 'PHB 111', level: 5, note: 'Cast slow once per long rest using a warlock slot.' },
  { id: 'mistyVisions', name: 'Misty Visions', source: 'PHB 111', note: 'Cast silent image at will, without a slot.' },
  { id: 'oneWithShadows', name: 'One with Shadows', source: 'PHB 111', level: 5, note: 'Become invisible in dim light or darkness until you move or act.' },
  { id: 'otherworldlyLeap', name: 'Otherworldly Leap', source: 'PHB 111', level: 9, note: 'Cast jump on yourself at will, without a slot.' },
  { id: 'protectionOfTheTalisman', name: 'Protection of the Talisman', source: 'TCE 71', level: 13, boon: 'talisman', optional: true, note: 'The talisman\u2019s wearer can add 1d4 to a failed saving throw, a number of times equal to your proficiency bonus.' },
  { id: 'rebukeOfTheTalisman', name: 'Rebuke of the Talisman', source: 'TCE 71', boon: 'talisman', optional: true, note: 'Reaction. Deal psychic damage to a creature that hits the wearer, and push it 10 feet.' },
  { id: 'relentlessHex', name: 'Relentless Hex', source: 'XGE 57', level: 7, needs: 'hex or a curse-bestowing warlock feature', optional: true, note: 'Bonus action. Teleport up to 30 feet to a space near your cursed target.' },
  { id: 'repellingBlast', name: 'Repelling Blast', source: 'PHB 111', needs: 'eldritch blast cantrip', note: 'Push a creature hit by eldritch blast up to 10 feet away.' },
  { id: 'sculptorOfFlesh', name: 'Sculptor of Flesh', source: 'PHB 111', level: 7, note: 'Cast polymorph once per long rest using a warlock slot.' },
  { id: 'shroudOfShadow', name: 'Shroud of Shadow', source: 'XGE 57', level: 15, optional: true, note: 'Cast invisibility at will, without a slot.' },
  { id: 'signOfIllOmen', name: 'Sign of Ill Omen', source: 'PHB 111', level: 5, note: 'Cast bestow curse once per long rest using a warlock slot.' },
  { id: 'thiefOfFiveFates', name: 'Thief of Five Fates', source: 'PHB 111', note: 'Cast bane once per long rest using a warlock slot.' },
  { id: 'thirstingBlade', name: 'Thirsting Blade', source: 'PHB 111', level: 5, boon: 'blade', note: 'Attack twice with your pact weapon when you take the Attack action.' },
  { id: 'tombOfLevistus', name: 'Tomb of Levistus', source: 'XGE 57', optional: true, note: 'Reaction after taking damage. Gain 10 temporary hit points per warlock level, encased in ice. Once per short rest.' },
  { id: 'tricksterEscape', name: "Trickster's Escape", source: 'XGE 57', level: 7, optional: true, note: 'Cast freedom of movement on yourself once per long rest, without a slot.' },
  { id: 'undyingServitude', name: 'Undying Servitude', source: 'TCE 71', level: 5, optional: true, note: 'Cast animate dead once per long rest, without a slot.' },
  { id: 'visionsOfDistantRealms', name: 'Visions of Distant Realms', source: 'PHB 111', level: 15, note: 'Cast arcane eye at will, without a slot.' },
  { id: 'voiceOfTheChainMaster', name: 'Voice of the Chain Master', source: 'PHB 111', boon: 'chain', note: 'Communicate with your familiar telepathically at any distance and perceive through its senses.' },
  { id: 'whispersOfTheGrave', name: 'Whispers of the Grave', source: 'PHB 111', level: 9, note: 'Cast speak with dead at will, without a slot.' },
  { id: 'witchSight', name: 'Witch Sight', source: 'PHB 111', level: 15, note: 'See the true form of shapechangers and creatures concealed by illusion within 30 feet.' }
];

/* ---------------------------------------------------------------
   Artificer Infusions. TCE 14.
   --------------------------------------------------------------- */
DND.INFUSIONS = [
  { id: 'arcanePropulsionArmor', name: 'Arcane Propulsion Armor', source: 'TCE 14', level: 14, note: '+5 feet speed, armor cannot be removed against your will, and a magical gauntlet you can hurl and recall.' },
  { id: 'armorOfMagicalStrength', name: 'Armor of Magical Strength', source: 'TCE 14', level: 10, note: 'Armor with charges equal to your Intelligence modifier; spend them for Strength checks and saves, or to avoid being knocked prone.' },
  { id: 'bootsOfTheWindingPath', name: 'Boots of the Winding Path', source: 'TCE 15', level: 6, note: 'Teleport up to 15 feet to an unoccupied space you can see.' },
  { id: 'enhancedArcaneFocus', name: 'Enhanced Arcane Focus', source: 'TCE 15', note: '+1 to spell attack rolls, rising to +2 at 10th level, and you ignore half cover.' },
  { id: 'enhancedDefense', name: 'Enhanced Defense', source: 'TCE 15', note: '+1 AC from a suit of armor or a shield, rising to +2 at 10th level.' },
  { id: 'enhancedWeapon', name: 'Enhanced Weapon', source: 'TCE 15', note: '+1 to attack and damage rolls, rising to +2 at 10th level.' },
  { id: 'helmOfAwareness', name: 'Helm of Awareness', source: 'TCE 15', level: 10, note: 'Advantage on initiative. You cannot be surprised while conscious.' },
  { id: 'homunculusServant', name: 'Homunculus Servant', source: 'TCE 15', note: 'A Tiny construct companion that acts on your turn and shares your proficiency bonus.' },
  { id: 'mindSharpener', name: 'Mind Sharpener', source: 'TCE 16', note: 'Four charges. Spend one to succeed on a concentration save.' },
  { id: 'radiantWeapon', name: 'Radiant Weapon', source: 'TCE 16', level: 6, note: '+1 weapon that sheds light and can blind an attacker as a reaction.' },
  { id: 'repeatingShot', name: 'Repeating Shot', source: 'TCE 16', note: '+1 ammunition weapon that generates its own ammunition and ignores the loading property.' },
  { id: 'replicateMagicItem', name: 'Replicate Magic Item', source: 'TCE 16', repeatable: true, note: 'Reproduce a particular magic item from the replicable items tables. Take this infusion more than once for different items.' },
  { id: 'repulsionShield', name: 'Repulsion Shield', source: 'TCE 17', level: 6, note: '+1 shield with charges to push an attacker 15 feet away.' },
  { id: 'resistantArmor', name: 'Resistant Armor', source: 'TCE 17', level: 6, note: 'Armor granting resistance to one damage type of your choice.' },
  { id: 'returningWeapon', name: 'Returning Weapon', source: 'TCE 17', note: '+1 thrown weapon that returns to your hand after the attack.' },
  { id: 'spellRefuelingRing', name: 'Spell-Refueling Ring', source: 'TCE 17', level: 6, note: 'Recover one expended spell slot of 3rd level or lower. Once per day.' }
];

/* ---------------------------------------------------------------
   Battle Master maneuvers, needed by Superior Technique and the
   Martial Adept feat. PHB 74; TCE 42.
   --------------------------------------------------------------- */
DND.MANEUVERS = [
  { id: 'ambush', name: 'Ambush', source: 'TCE 42', optional: true },
  { id: 'baitAndSwitch', name: 'Bait and Switch', source: 'TCE 42', optional: true },
  { id: 'brace', name: 'Brace', source: 'TCE 42', optional: true },
  { id: 'commandersStrike', name: "Commander's Strike", source: 'PHB 74' },
  { id: 'commandingPresence', name: 'Commanding Presence', source: 'TCE 42', optional: true },
  { id: 'disarmingAttack', name: 'Disarming Attack', source: 'PHB 74' },
  { id: 'distractingStrike', name: 'Distracting Strike', source: 'PHB 74' },
  { id: 'evasiveFootwork', name: 'Evasive Footwork', source: 'PHB 74' },
  { id: 'feintingAttack', name: 'Feinting Attack', source: 'PHB 74' },
  { id: 'goadingAttack', name: 'Goading Attack', source: 'PHB 74' },
  { id: 'grapplingStrike', name: 'Grappling Strike', source: 'TCE 42', optional: true },
  { id: 'lungingAttack', name: 'Lunging Attack', source: 'PHB 74' },
  { id: 'maneuveringAttack', name: 'Maneuvering Attack', source: 'PHB 74' },
  { id: 'menacingAttack', name: 'Menacing Attack', source: 'PHB 74' },
  { id: 'parry', name: 'Parry', source: 'PHB 74' },
  { id: 'precisionAttack', name: 'Precision Attack', source: 'PHB 74' },
  { id: 'pushingAttack', name: 'Pushing Attack', source: 'PHB 74' },
  { id: 'quickToss', name: 'Quick Toss', source: 'TCE 42', optional: true },
  { id: 'rally', name: 'Rally', source: 'PHB 74' },
  { id: 'riposte', name: 'Riposte', source: 'PHB 74' },
  { id: 'sweepingAttack', name: 'Sweeping Attack', source: 'PHB 74' },
  { id: 'tacticalAssessment', name: 'Tactical Assessment', source: 'TCE 42', optional: true },
  { id: 'tripAttack', name: 'Trip Attack', source: 'PHB 74' }
];

/* ---------------------------------------------------------------
   Ranger choices. PHB 91.
   --------------------------------------------------------------- */
DND.FAVORED_ENEMIES = [
  'Aberrations', 'Beasts', 'Celestials', 'Constructs', 'Dragons', 'Elementals',
  'Fey', 'Fiends', 'Giants', 'Monstrosities', 'Oozes', 'Plants', 'Undead',
  'Two races of humanoid'
];

DND.FAVORED_TERRAINS = [
  'Arctic', 'Coast', 'Desert', 'Forest', 'Grassland', 'Mountain', 'Swamp', 'Underdark'
];

/* ---------------------------------------------------------------
   Optional class features. TCE 9-70. Each is keyed to a class and a
   level; `replaces` names the standard feature it supersedes.
   --------------------------------------------------------------- */
DND.OPTIONAL_CLASS_FEATURES = [
  { classId: 'barbarian', level: 3, name: 'Primal Knowledge', source: 'TCE 9',
    note: 'Gain proficiency in one more barbarian skill, and make certain Strength checks while raging.',
    choice: { id: 'primalKnowledge', label: 'Skill proficiency', type: 'skill',
      from: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'], count: 1 } },
  { classId: 'barbarian', level: 7, name: 'Instinctive Pounce', source: 'TCE 9',
    note: 'When you enter your rage as a bonus action, move up to half your speed.' },

  { classId: 'bard', level: 1, name: 'Additional Bard Spells', source: 'TCE 12',
    note: 'An expanded list of bard spells becomes available to you.' },
  { classId: 'bard', level: 4, name: 'Bardic Versatility', source: 'TCE 12',
    note: 'On an Ability Score Improvement, swap a cantrip or move one Expertise.' },

  { classId: 'cleric', level: 2, name: 'Harness Divine Power', source: 'TCE 19',
    note: 'Bonus action. Expend a use of Channel Divinity to recover a spell slot. Uses scale with proficiency bonus.' },
  { classId: 'cleric', level: 4, name: 'Cantrip Versatility', source: 'TCE 19',
    note: 'On an Ability Score Improvement, replace one cleric cantrip.' },
  { classId: 'cleric', level: 8, name: 'Blessed Strikes', source: 'TCE 19',
    note: 'Replaces Divine Strike or Potent Spellcasting. Add 1d8 radiant damage once per turn.' },

  { classId: 'druid', level: 1, name: 'Additional Druid Spells', source: 'TCE 20',
    note: 'An expanded list of druid spells becomes available to you.' },
  { classId: 'druid', level: 2, name: 'Wild Companion', source: 'TCE 20',
    note: 'Expend a Wild Shape use to cast find familiar without material components. The familiar is a fey.' },
  { classId: 'druid', level: 4, name: 'Cantrip Versatility', source: 'TCE 20',
    note: 'On an Ability Score Improvement, replace one druid cantrip.' },

  { classId: 'fighter', level: 4, name: 'Martial Versatility', source: 'TCE 41',
    note: 'On an Ability Score Improvement, swap a Fighting Style or a maneuver.' },

  { classId: 'monk', level: 2, name: 'Dedicated Weapon', source: 'TCE 47',
    note: 'Treat one simple or martial weapon as a monk weapon after a short rest.' },
  { classId: 'monk', level: 3, name: 'Ki-Fueled Attack', source: 'TCE 47',
    note: 'After spending ki on a spell or feature, make one unarmed or monk weapon attack as a bonus action.' },
  { classId: 'monk', level: 4, name: 'Quickened Healing', source: 'TCE 47',
    note: 'Action. Spend 2 ki to roll your Martial Arts die and regain that many hit points plus your proficiency bonus.' },
  { classId: 'monk', level: 5, name: 'Focused Aim', source: 'TCE 47',
    note: 'On a miss, spend 1 to 3 ki to add 2 to the attack roll per point.' },

  { classId: 'paladin', level: 1, name: 'Additional Paladin Spells', source: 'TCE 52',
    note: 'An expanded list of paladin spells becomes available to you.' },
  { classId: 'paladin', level: 3, name: 'Harness Divine Power', source: 'TCE 52',
    note: 'Bonus action. Expend a use of Channel Divinity to recover a spell slot.' },
  { classId: 'paladin', level: 4, name: 'Martial Versatility', source: 'TCE 52',
    note: 'On an Ability Score Improvement, swap your Fighting Style.' },

  { classId: 'ranger', level: 1, name: 'Deft Explorer', source: 'TCE 57',
    replaces: 'Natural Explorer',
    note: 'Canny at 1st: expertise in one proficient skill and two extra languages. Roving at 6th, Tireless at 10th.',
    choice: { id: 'deftExplorerSkill', label: 'Expertise in', type: 'proficientSkill', count: 1 } },
  { classId: 'ranger', level: 1, name: 'Favored Foe', source: 'TCE 57',
    replaces: 'Favored Enemy',
    note: 'Mark a target on a hit for extra 1d4 damage once per turn, concentration. Uses equal your proficiency bonus.' },
  { classId: 'ranger', level: 2, name: 'Spellcasting Focus', source: 'TCE 57',
    note: 'You can use a druidic focus as a spellcasting focus.' },
  { classId: 'ranger', level: 3, name: 'Primal Awareness', source: 'TCE 57',
    replaces: 'Primeval Awareness',
    note: 'Cast speak with animals, beast sense, and later spells once per long rest each, without a slot.' },
  { classId: 'ranger', level: 4, name: 'Martial Versatility', source: 'TCE 58',
    note: 'On an Ability Score Improvement, swap your Fighting Style.' },
  { classId: 'ranger', level: 10, name: "Nature's Veil", source: 'TCE 58',
    note: 'Bonus action. Turn invisible until the end of your next turn. Uses equal your proficiency bonus.' },

  { classId: 'rogue', level: 3, name: 'Steady Aim', source: 'TCE 62',
    note: 'Bonus action. Gain advantage on your next attack this turn if you have not moved, and your speed becomes 0.' },

  { classId: 'sorcerer', level: 1, name: 'Additional Sorcerer Spells', source: 'TCE 65',
    note: 'An expanded list of sorcerer spells becomes available to you.' },
  { classId: 'sorcerer', level: 4, name: 'Sorcerous Versatility', source: 'TCE 66',
    note: 'On an Ability Score Improvement, swap a Metamagic option or a cantrip.' },

  { classId: 'warlock', level: 1, name: 'Additional Warlock Spells', source: 'TCE 69',
    note: 'An expanded list of warlock spells becomes available to you.' },
  { classId: 'warlock', level: 4, name: 'Eldritch Versatility', source: 'TCE 71',
    note: 'On an Ability Score Improvement, swap a cantrip, an Eldritch Invocation, or your Pact Boon.' },

  { classId: 'wizard', level: 3, name: 'Cantrip Formulas', source: 'TCE 75',
    note: 'On a long rest, replace one wizard cantrip you know with another from your spellbook.' }
];

DND.optionalFeaturesFor = function (classId, level) {
  return DND.OPTIONAL_CLASS_FEATURES.filter(function (f) {
    return f.classId === classId && f.level <= level;
  });
};

DND.findOption = function (list, id) {
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
};

/* ---------------------------------------------------------------
   Arcane Shot options for the Arcane Archer. XGE 29.
   --------------------------------------------------------------- */
DND.ARCANE_SHOTS = [
  { id: 'banishing', name: 'Banishing Arrow', source: 'XGE 29', note: 'Banish the target to a harmless demiplane until the end of your next turn.' },
  { id: 'beguiling', name: 'Beguiling Arrow', source: 'XGE 29', note: 'Psychic damage, and the target is charmed by an ally of your choice.' },
  { id: 'bursting', name: 'Bursting Arrow', source: 'XGE 29', note: 'Force damage to the target and everything within 10 feet of it.' },
  { id: 'enfeebling', name: 'Enfeebling Arrow', source: 'XGE 29', note: 'Necrotic damage, and the target deals half weapon damage until your next turn.' },
  { id: 'grasping', name: 'Grasping Arrow', source: 'XGE 30', note: 'Poison damage, reduced speed, and slashing damage when the target moves.' },
  { id: 'piercing', name: 'Piercing Arrow', source: 'XGE 30', note: 'The arrow passes through cover and every creature in a 30-foot line.' },
  { id: 'seeking', name: 'Seeking Arrow', source: 'XGE 30', note: 'The arrow curves around cover to find a creature you name.' },
  { id: 'shadow', name: 'Shadow Arrow', source: 'XGE 30', note: 'Psychic damage, and the target cannot see beyond 5 feet until your next turn.' }
];

/* ---------------------------------------------------------------
   Runes for the Rune Knight. TCE 45.
   --------------------------------------------------------------- */
DND.RUNES = [
  { id: 'cloud', name: 'Cloud Rune', source: 'TCE 45', note: 'Advantage on Sleight of Hand and Deception. Invoke to redirect an attack to another creature.' },
  { id: 'fire', name: 'Fire Rune', source: 'TCE 46', note: 'Double proficiency on tool checks. Invoke to shackle and burn a creature you hit.' },
  { id: 'frost', name: 'Frost Rune', source: 'TCE 46', note: 'Advantage on Animal Handling and Intimidation. Invoke for +2 to Strength and Constitution checks and saves.' },
  { id: 'stone', name: 'Stone Rune', source: 'TCE 46', note: 'Advantage on Insight and darkvision to 120 feet. Invoke to charm a creature that starts its turn near you.' },
  { id: 'hill', name: 'Hill Rune', source: 'TCE 46', level: 7, note: 'Advantage on saves against poison and resistance to poison damage. Invoke for resistance to bludgeoning, piercing, and slashing.' },
  { id: 'storm', name: 'Storm Rune', source: 'TCE 46', level: 7, note: 'Advantage on Arcana and you cannot be surprised. Invoke to grant advantage or impose disadvantage on rolls near you.' }
];
