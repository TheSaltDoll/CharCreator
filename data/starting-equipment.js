/* Starting equipment: the packs, and what each class begins with.

   Costs are copper, as everywhere else in the gear data. Pack contents are
   listed so the inventory can show what is inside; a few of those contents
   (a bell's length of string, an alms box, incense, a censer, vestments, a
   bag of sand, a small knife) are not sold separately in the gear tables, so
   they carry no price and exist only as lines in the pack.

   An option is either a concrete list of `items`, or a `choose` that opens a
   picker: 'simple', 'martial', 'simpleMelee', 'martialMelee', 'instrument',
   'arcaneFocus', 'druidicFocus', 'artisanTools'. Class equipment is PHB
   chapter 3; the artificer is TCE 10. */

DND.PACKS = [
  { name: "Burglar's Pack", cost: 1600, weight: 44.5, contents: [
    { name: 'Backpack' }, { name: 'Ball bearings (bag of 1,000)' }, { name: 'String (10 feet)' },
    { name: 'Bell' }, { name: 'Candle', qty: 5 }, { name: 'Crowbar' }, { name: 'Hammer' },
    { name: 'Piton', qty: 10 }, { name: 'Lantern, hooded' }, { name: 'Oil (flask)', qty: 2 },
    { name: 'Rations (1 day)', qty: 5 }, { name: 'Tinderbox' }, { name: 'Waterskin' },
    { name: 'Rope, hempen (50 feet)' } ] },
  { name: "Diplomat's Pack", cost: 3900, weight: 39, contents: [
    { name: 'Chest' }, { name: 'Case, map or scroll', qty: 2 }, { name: 'Clothes, fine' },
    { name: 'Ink (1 ounce bottle)' }, { name: 'Ink pen' }, { name: 'Lamp' },
    { name: 'Oil (flask)', qty: 2 }, { name: 'Paper (one sheet)', qty: 5 },
    { name: 'Perfume (vial)' }, { name: 'Sealing wax' }, { name: 'Soap' } ] },
  { name: "Dungeoneer's Pack", cost: 1200, weight: 61.5, contents: [
    { name: 'Backpack' }, { name: 'Crowbar' }, { name: 'Hammer' }, { name: 'Piton', qty: 10 },
    { name: 'Torch', qty: 10 }, { name: 'Tinderbox' }, { name: 'Rations (1 day)', qty: 10 },
    { name: 'Waterskin' }, { name: 'Rope, hempen (50 feet)' } ] },
  { name: "Entertainer's Pack", cost: 4000, weight: 38, contents: [
    { name: 'Backpack' }, { name: 'Bedroll' }, { name: 'Clothes, costume', qty: 2 },
    { name: 'Candle', qty: 5 }, { name: 'Rations (1 day)', qty: 5 }, { name: 'Waterskin' },
    { name: 'Disguise kit' } ] },
  { name: "Explorer's Pack", cost: 1000, weight: 59, contents: [
    { name: 'Backpack' }, { name: 'Bedroll' }, { name: 'Mess kit' }, { name: 'Tinderbox' },
    { name: 'Torch', qty: 10 }, { name: 'Rations (1 day)', qty: 10 }, { name: 'Waterskin' },
    { name: 'Rope, hempen (50 feet)' } ] },
  { name: "Priest's Pack", cost: 1900, weight: 24, contents: [
    { name: 'Backpack' }, { name: 'Blanket' }, { name: 'Candle', qty: 10 }, { name: 'Tinderbox' },
    { name: 'Alms box' }, { name: 'Incense (block)', qty: 2 }, { name: 'Censer' },
    { name: 'Vestments' }, { name: 'Rations (1 day)', qty: 2 }, { name: 'Waterskin' } ] },
  { name: "Scholar's Pack", cost: 4000, weight: 10, contents: [
    { name: 'Backpack' }, { name: 'Book' }, { name: 'Ink (1 ounce bottle)' }, { name: 'Ink pen' },
    { name: 'Parchment (one sheet)', qty: 10 }, { name: 'Bag of sand' }, { name: 'Small knife' } ] }
];

/* Items that exist only inside a pack, so the inventory can name them. */
DND.PACK_ONLY = ['String (10 feet)', 'Alms box', 'Incense (block)', 'Censer', 'Vestments',
                 'Bag of sand', 'Small knife', 'Disguise kit'];

function pack(n) { return { name: n + "'s Pack" }; }

DND.STARTING_EQUIPMENT = {
  barbarian: {
    groups: [
      { label: 'Weapon', options: [
        { label: 'A greataxe', items: [{ name: 'Greataxe' }] },
        { label: 'Any martial melee weapon', items: [{ choose: 'martialMelee' }] } ] },
      { label: 'Second weapon', options: [
        { label: 'Two handaxes', items: [{ name: 'Handaxe', qty: 2 }] },
        { label: 'Any simple weapon', items: [{ choose: 'simple' }] } ] }
    ],
    fixed: [pack('Explorer'), { name: 'Javelin', qty: 4 }]
  },
  bard: {
    groups: [
      { label: 'Weapon', options: [
        { label: 'A rapier', items: [{ name: 'Rapier' }] },
        { label: 'A longsword', items: [{ name: 'Longsword' }] },
        { label: 'Any simple weapon', items: [{ choose: 'simple' }] } ] },
      { label: 'Pack', options: [
        { label: "A diplomat's pack", items: [pack('Diplomat')] },
        { label: "An entertainer's pack", items: [pack('Entertainer')] } ] },
      { label: 'Instrument', options: [
        { label: 'A lute', items: [{ name: 'Lute' }] },
        { label: 'Any other musical instrument', items: [{ choose: 'instrument' }] } ] }
    ],
    fixed: [{ name: 'Leather' }, { name: 'Dagger' }]
  },
  cleric: {
    groups: [
      { label: 'Weapon', options: [
        { label: 'A mace', items: [{ name: 'Mace' }] },
        { label: 'A warhammer (if proficient)', items: [{ name: 'Warhammer' }] } ] },
      { label: 'Armor', options: [
        { label: 'Scale mail', items: [{ name: 'Scale mail' }] },
        { label: 'Leather armor', items: [{ name: 'Leather' }] },
        { label: 'Chain mail (if proficient)', items: [{ name: 'Chain mail' }] } ] },
      { label: 'Second weapon', options: [
        { label: 'A light crossbow and 20 bolts', items: [{ name: 'Light crossbow' }, { name: 'Ammunition: Crossbow bolts (20)' }] },
        { label: 'Any simple weapon', items: [{ choose: 'simple' }] } ] },
      { label: 'Pack', options: [
        { label: "A priest's pack", items: [pack('Priest')] },
        { label: "An explorer's pack", items: [pack('Explorer')] } ] }
    ],
    fixed: [{ name: 'Shield' }, { choose: 'holySymbol' }]
  },
  druid: {
    groups: [
      { label: 'Shield or weapon', options: [
        { label: 'A wooden shield', items: [{ name: 'Shield' }] },
        { label: 'Any simple weapon', items: [{ choose: 'simple' }] } ] },
      { label: 'Weapon', options: [
        { label: 'A scimitar', items: [{ name: 'Scimitar' }] },
        { label: 'Any simple melee weapon', items: [{ choose: 'simpleMelee' }] } ] }
    ],
    fixed: [{ name: 'Leather' }, pack('Explorer'), { choose: 'druidicFocus' }]
  },
  fighter: {
    groups: [
      { label: 'Armor', options: [
        { label: 'Chain mail', items: [{ name: 'Chain mail' }] },
        { label: 'Leather armor, longbow, and 20 arrows', items: [{ name: 'Leather' }, { name: 'Longbow' }, { name: 'Ammunition: Arrows (20)' }] } ] },
      { label: 'Weapons', options: [
        { label: 'A martial weapon and a shield', items: [{ choose: 'martial' }, { name: 'Shield' }] },
        { label: 'Two martial weapons', items: [{ choose: 'martial' }, { choose: 'martial' }] } ] },
      { label: 'Ranged or thrown', options: [
        { label: 'A light crossbow and 20 bolts', items: [{ name: 'Light crossbow' }, { name: 'Ammunition: Crossbow bolts (20)' }] },
        { label: 'Two handaxes', items: [{ name: 'Handaxe', qty: 2 }] } ] },
      { label: 'Pack', options: [
        { label: "A dungeoneer's pack", items: [pack('Dungeoneer')] },
        { label: "An explorer's pack", items: [pack('Explorer')] } ] }
    ],
    fixed: []
  },
  monk: {
    groups: [
      { label: 'Weapon', options: [
        { label: 'A shortsword', items: [{ name: 'Shortsword' }] },
        { label: 'Any simple weapon', items: [{ choose: 'simple' }] } ] },
      { label: 'Pack', options: [
        { label: "A dungeoneer's pack", items: [pack('Dungeoneer')] },
        { label: "An explorer's pack", items: [pack('Explorer')] } ] }
    ],
    fixed: [{ name: 'Dart', qty: 10 }]
  },
  paladin: {
    groups: [
      { label: 'Weapons', options: [
        { label: 'A martial weapon and a shield', items: [{ choose: 'martial' }, { name: 'Shield' }] },
        { label: 'Two martial weapons', items: [{ choose: 'martial' }, { choose: 'martial' }] } ] },
      { label: 'Thrown or melee', options: [
        { label: 'Five javelins', items: [{ name: 'Javelin', qty: 5 }] },
        { label: 'Any simple melee weapon', items: [{ choose: 'simpleMelee' }] } ] },
      { label: 'Pack', options: [
        { label: "A priest's pack", items: [pack('Priest')] },
        { label: "An explorer's pack", items: [pack('Explorer')] } ] }
    ],
    fixed: [{ name: 'Chain mail' }, { choose: 'holySymbol' }]
  },
  ranger: {
    groups: [
      { label: 'Armor', options: [
        { label: 'Scale mail', items: [{ name: 'Scale mail' }] },
        { label: 'Leather armor', items: [{ name: 'Leather' }] } ] },
      { label: 'Weapons', options: [
        { label: 'Two shortswords', items: [{ name: 'Shortsword', qty: 2 }] },
        { label: 'Two simple melee weapons', items: [{ choose: 'simpleMelee' }, { choose: 'simpleMelee' }] } ] },
      { label: 'Pack', options: [
        { label: "A dungeoneer's pack", items: [pack('Dungeoneer')] },
        { label: "An explorer's pack", items: [pack('Explorer')] } ] }
    ],
    fixed: [{ name: 'Longbow' }, { name: 'Ammunition: Arrows (20)' }, { name: 'Quiver' }]
  },
  rogue: {
    groups: [
      { label: 'Weapon', options: [
        { label: 'A rapier', items: [{ name: 'Rapier' }] },
        { label: 'A shortsword', items: [{ name: 'Shortsword' }] } ] },
      { label: 'Ranged or melee', options: [
        { label: 'A shortbow and quiver of 20 arrows', items: [{ name: 'Shortbow' }, { name: 'Ammunition: Arrows (20)' }, { name: 'Quiver' }] },
        { label: 'A shortsword', items: [{ name: 'Shortsword' }] } ] },
      { label: 'Pack', options: [
        { label: "A burglar's pack", items: [pack('Burglar')] },
        { label: "A dungeoneer's pack", items: [pack('Dungeoneer')] },
        { label: "An explorer's pack", items: [pack('Explorer')] } ] }
    ],
    fixed: [{ name: 'Leather' }, { name: 'Dagger', qty: 2 }, { name: "Thieves' tools" }]
  },
  sorcerer: {
    groups: [
      { label: 'Weapon', options: [
        { label: 'A light crossbow and 20 bolts', items: [{ name: 'Light crossbow' }, { name: 'Ammunition: Crossbow bolts (20)' }] },
        { label: 'Any simple weapon', items: [{ choose: 'simple' }] } ] },
      { label: 'Focus', options: [
        { label: 'A component pouch', items: [{ name: 'Component pouch' }] },
        { label: 'An arcane focus', items: [{ choose: 'arcaneFocus' }] } ] },
      { label: 'Pack', options: [
        { label: "A dungeoneer's pack", items: [pack('Dungeoneer')] },
        { label: "An explorer's pack", items: [pack('Explorer')] } ] }
    ],
    fixed: [{ name: 'Dagger', qty: 2 }]
  },
  warlock: {
    groups: [
      { label: 'Weapon', options: [
        { label: 'A light crossbow and 20 bolts', items: [{ name: 'Light crossbow' }, { name: 'Ammunition: Crossbow bolts (20)' }] },
        { label: 'Any simple weapon', items: [{ choose: 'simple' }] } ] },
      { label: 'Focus', options: [
        { label: 'A component pouch', items: [{ name: 'Component pouch' }] },
        { label: 'An arcane focus', items: [{ choose: 'arcaneFocus' }] } ] },
      { label: 'Pack', options: [
        { label: "A scholar's pack", items: [pack('Scholar')] },
        { label: "A dungeoneer's pack", items: [pack('Dungeoneer')] } ] }
    ],
    fixed: [{ name: 'Leather' }, { choose: 'simple' }, { name: 'Dagger', qty: 2 }]
  },
  wizard: {
    groups: [
      { label: 'Weapon', options: [
        { label: 'A quarterstaff', items: [{ name: 'Quarterstaff' }] },
        { label: 'A dagger', items: [{ name: 'Dagger' }] } ] },
      { label: 'Focus', options: [
        { label: 'A component pouch', items: [{ name: 'Component pouch' }] },
        { label: 'An arcane focus', items: [{ choose: 'arcaneFocus' }] } ] },
      { label: 'Pack', options: [
        { label: "A scholar's pack", items: [pack('Scholar')] },
        { label: "An explorer's pack", items: [pack('Explorer')] } ] }
    ],
    fixed: [{ name: 'Spellbook' }]
  },
  artificer: {
    groups: [
      { label: 'Armor', options: [
        { label: 'Studded leather armor', items: [{ name: 'Studded leather' }] },
        { label: 'Scale mail', items: [{ name: 'Scale mail' }] } ] }
    ],
    fixed: [{ choose: 'simple' }, { choose: 'simple' }, { name: 'Light crossbow' },
            { name: 'Ammunition: Crossbow bolts (20)' }, { name: "Thieves' tools" },
            pack('Dungeoneer')]
  }
};
