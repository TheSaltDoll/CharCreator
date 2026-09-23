/* Weapons, armor, and adventuring gear.

   Transcribed from the campaign's own gear tables rather than the scanned
   books, at the player's request: the tables carry a handful of items the
   core books do not (firearms, a few sundries) and the scan mangled some
   numbers. Costs are held in copper throughout to keep the arithmetic exact:
   1 gp = 10 sp = 100 cp. Weight is in pounds.

   `firearm` marks weapons outside the three core books; `advanced` marks the
   four that the table says need special access and DM permission. Subclass
   features that pick a weapon (Kensei, Bladesinging) ignore both, since those
   features are written against the Player's Handbook list. */

DND.COIN = { gp: 100, sp: 10, cp: 1 };

DND.money = function (cp) {
  /* smallest sensible rendering: 125 -> "1 gp 2 sp 5 cp" */
  if (!cp) return '0 gp';
  var out = [], units = [['gp', 100], ['sp', 10], ['cp', 1]];
  units.forEach(function (u) {
    var n = Math.floor(cp / u[1]);
    if (n) { out.push(n + ' ' + u[0]); cp -= n * u[1]; }
  });
  return out.join(' ');
};

DND.WEAPONS = [
  { name: 'Club', category: 'simple', kind: 'melee', cost: 10, damage: '1d4 bludgeoning', weight: 2.0, properties: ['light'], firearm: false, advanced: false, text: 'Light' },
  { name: 'Dagger', category: 'simple', kind: 'melee', cost: 200, damage: '1d4 piercing', weight: 1.0, properties: ['finesse', 'light', 'thrown'], range: '20/60', firearm: false, advanced: false, text: 'Finesse, light, thrown (range 20/60)' },
  { name: 'Greatclub', category: 'simple', kind: 'melee', cost: 20, damage: '1d8 bludgeoning', weight: 10.0, properties: ['two-handed'], firearm: false, advanced: false, text: 'Two-handed' },
  { name: 'Handaxe', category: 'simple', kind: 'melee', cost: 500, damage: '1d6 slashing', weight: 2.0, properties: ['light', 'thrown'], range: '20/60', firearm: false, advanced: false, text: 'Light, thrown (range 20/60)' },
  { name: 'Javelin', category: 'simple', kind: 'melee', cost: 50, damage: '1d6 piercing', weight: 2.0, properties: ['thrown'], range: '30/120', firearm: false, advanced: false, text: 'Thrown (range 30/120)' },
  { name: 'Light hammer', category: 'simple', kind: 'melee', cost: 200, damage: '1d4 bludgeoning', weight: 2.0, properties: ['light', 'thrown'], range: '20/60', firearm: false, advanced: false, text: 'Light, thrown (range 20/60)' },
  { name: 'Mace', category: 'simple', kind: 'melee', cost: 500, damage: '1d6 bludgeoning', weight: 4.0, properties: [], firearm: false, advanced: false, text: '\u2014' },
  { name: 'Quarterstaff', category: 'simple', kind: 'melee', cost: 20, damage: '1d6 bludgeoning', weight: 4.0, properties: ['versatile'], versatile: '1d8', firearm: false, advanced: false, text: 'Versatile (1d8)' },
  { name: 'Sickle', category: 'simple', kind: 'melee', cost: 100, damage: '1d4 slashing', weight: 2.0, properties: ['light'], firearm: false, advanced: false, text: 'Light' },
  { name: 'Spear', category: 'simple', kind: 'melee', cost: 100, damage: '1d6 piercing', weight: 3.0, properties: ['thrown', 'versatile'], range: '20/60', versatile: '1d8', firearm: false, advanced: false, text: 'Thrown (range 20/60), versatile (1d8)' },
  { name: 'Light crossbow', category: 'simple', kind: 'ranged', cost: 2500, damage: '1d8 piercing', weight: 5.0, properties: ['ammunition', 'loading', 'two-handed'], range: '80/320', firearm: false, advanced: false, text: 'Ammunition (range 80/320), loading, two-handed' },
  { name: 'Carbine', proxy: 'Light crossbow', category: 'simple', kind: 'ranged', cost: 7500, damage: '1d12 piercing', weight: 5.0, properties: ['ammunition', 'loud', 'misfire', 'muzzle-loading', 'two-handed'], range: '50/150', firearm: true, advanced: false, text: 'Ammunition (range 50/150), loud, misfire, muzzle-loading, two-handed' },
  { name: 'Shotgun', proxy: 'Light crossbow', category: 'simple', kind: 'ranged', cost: 7500, damage: '1d10 piercing', weight: 6.0, properties: ['ammunition', 'loud', 'misfire', 'muzzle-loading', 'two-handed', 'scatter'], range: '30/90', firearm: true, advanced: false, text: 'Ammunition (range 30/90), loud, misfire, muzzle-loading, two-handed, scatter' },
  { name: 'Dart', category: 'simple', kind: 'ranged', cost: 5, damage: '1d4 piercing', weight: 0.25, properties: ['finesse', 'thrown'], range: '20/60', firearm: false, advanced: false, text: 'Finesse, thrown (range 20/60)' },
  { name: 'Shortbow', category: 'simple', kind: 'ranged', cost: 2500, damage: '1d6 piercing', weight: 2.0, properties: ['ammunition', 'two-handed'], range: '80/320', firearm: false, advanced: false, text: 'Ammunition (range 80/320), two-handed' },
  { name: 'Sling', category: 'simple', kind: 'ranged', cost: 10, damage: '1d4 bludgeoning', weight: 0, properties: ['ammunition'], range: '30/120', firearm: false, advanced: false, text: 'Ammunition (range 30/120)' },
  { name: 'Battleaxe', category: 'martial', kind: 'melee', cost: 1000, damage: '1d8 slashing', weight: 4.0, properties: ['versatile'], versatile: '1d10', firearm: false, advanced: false, text: 'Versatile (1d10)' },
  { name: 'Flail', category: 'martial', kind: 'melee', cost: 1000, damage: '1d8 bludgeoning', weight: 2.0, properties: [], firearm: false, advanced: false, text: '\u2014' },
  { name: 'Glaive', category: 'martial', kind: 'melee', cost: 2000, damage: '1d10 slashing', weight: 6.0, properties: ['heavy', 'reach', 'two-handed'], firearm: false, advanced: false, text: 'Heavy, reach, two-handed' },
  { name: 'Greataxe', category: 'martial', kind: 'melee', cost: 3000, damage: '1d12 slashing', weight: 7.0, properties: ['heavy', 'two-handed'], firearm: false, advanced: false, text: 'Heavy, two-handed' },
  { name: 'Greatsword', category: 'martial', kind: 'melee', cost: 5000, damage: '2d6 slashing', weight: 6.0, properties: ['heavy', 'two-handed'], firearm: false, advanced: false, text: 'Heavy, two-handed' },
  { name: 'Halberd', category: 'martial', kind: 'melee', cost: 2000, damage: '1d10 slashing', weight: 6.0, properties: ['heavy', 'reach', 'two-handed'], firearm: false, advanced: false, text: 'Heavy, reach, two-handed' },
  { name: 'Lance', category: 'martial', kind: 'melee', cost: 1000, damage: '1d12 piercing', weight: 6.0, properties: ['reach', 'special'], firearm: false, advanced: false, text: 'Reach, special' },
  { name: 'Longsword', category: 'martial', kind: 'melee', cost: 1500, damage: '1d8 slashing', weight: 3.0, properties: ['versatile'], versatile: '1d10', firearm: false, advanced: false, text: 'Versatile (1d10)' },
  { name: 'Maul', category: 'martial', kind: 'melee', cost: 1000, damage: '2d6 bludgeoning', weight: 10.0, properties: ['heavy', 'two-handed'], firearm: false, advanced: false, text: 'Heavy, two-handed' },
  { name: 'Morningstar', category: 'martial', kind: 'melee', cost: 1500, damage: '1d8 piercing', weight: 4.0, properties: [], firearm: false, advanced: false, text: '\u2014' },
  { name: 'Pike', category: 'martial', kind: 'melee', cost: 500, damage: '1d10 piercing', weight: 18.0, properties: ['heavy', 'reach', 'two-handed'], firearm: false, advanced: false, text: 'Heavy, reach, two-handed' },
  { name: 'Rapier', category: 'martial', kind: 'melee', cost: 2500, damage: '1d8 piercing', weight: 2.0, properties: ['finesse'], firearm: false, advanced: false, text: 'Finesse' },
  { name: 'Scimitar', category: 'martial', kind: 'melee', cost: 2500, damage: '1d6 slashing', weight: 3.0, properties: ['finesse', 'light'], firearm: false, advanced: false, text: 'Finesse, light' },
  { name: 'Shortsword', category: 'martial', kind: 'melee', cost: 1000, damage: '1d6 piercing', weight: 2.0, properties: ['finesse', 'light'], firearm: false, advanced: false, text: 'Finesse, light' },
  { name: 'Trident', category: 'martial', kind: 'melee', cost: 500, damage: '1d6 piercing', weight: 4.0, properties: ['thrown', 'versatile'], range: '20/60', versatile: '1d8', firearm: false, advanced: false, text: 'Thrown (range 20/60), versatile (1d8)' },
  { name: 'War pick', category: 'martial', kind: 'melee', cost: 500, damage: '1d8 piercing', weight: 2.0, properties: [], firearm: false, advanced: false, text: '\u2014' },
  { name: 'Warhammer', category: 'martial', kind: 'melee', cost: 1500, damage: '1d8 bludgeoning', weight: 2.0, properties: ['versatile'], versatile: '1d10', firearm: false, advanced: false, text: 'Versatile (1d10)' },
  { name: 'Whip', category: 'martial', kind: 'melee', cost: 200, damage: '1d4 slashing', weight: 3.0, properties: ['finesse', 'reach'], firearm: false, advanced: false, text: 'Finesse, reach' },
  { name: 'Blowgun', category: 'martial', kind: 'ranged', cost: 1000, damage: '1 piercing', weight: 1.0, properties: ['ammunition', 'loading'], range: '25/100', firearm: false, advanced: false, text: 'Ammunition (range 25/100), loading' },
  { name: 'Hand crossbow', category: 'martial', kind: 'ranged', cost: 7500, damage: '1d6 piercing', weight: 3.0, properties: ['ammunition', 'light', 'loading'], range: '30/120', firearm: false, advanced: false, text: 'Ammunition (range 30/120), light, loading' },
  { name: 'Pistol', proxy: 'Hand crossbow', category: 'martial', kind: 'ranged', cost: 7500, damage: '1d10 piercing', weight: 3.0, properties: ['ammunition', 'loud', 'misfire', 'muzzle-loading'], range: '20/60', firearm: true, advanced: false, text: 'Ammunition (range 20/60), loud, misfire, muzzle-loading' },
  { name: 'Heavy crossbow', category: 'martial', kind: 'ranged', cost: 5000, damage: '1d10 piercing', weight: 18.0, properties: ['ammunition', 'heavy', 'loading', 'two-handed'], range: '100/400', firearm: false, advanced: false, text: 'Ammunition (range 100/400), heavy, loading, two-handed' },
  { name: 'Musket', proxy: 'Heavy crossbow', category: 'martial', kind: 'ranged', cost: 9000, damage: '2d8 piercing', weight: 10.0, properties: ['ammunition', 'loud', 'misfire', 'muzzle-loading', 'two-handed'], range: '60/180', firearm: true, advanced: false, text: 'Ammunition (range 60/180), loud, misfire, muzzle-loading, two-handed' },
  { name: 'Longbow', category: 'martial', kind: 'ranged', cost: 5000, damage: '1d8 piercing', weight: 2.0, properties: ['ammunition', 'heavy', 'two-handed'], range: '150/600', firearm: false, advanced: false, text: 'Ammunition (range 150/600), heavy, two-handed' },
  { name: 'Net', category: 'martial', kind: 'ranged', cost: 100, damage: null, weight: 3.0, properties: ['special', 'thrown'], range: '5/15', firearm: false, advanced: false, text: 'Special, thrown (range 5/15)' },
  { name: 'Grenade', category: 'martial', kind: 'ranged', cost: 5000, damage: 'Special', weight: 1.0, properties: ['thrown'], range: '20/60', firearm: true, advanced: true, text: 'Thrown (range 20/60)' },
  { name: 'Target Pistol', category: 'martial', kind: 'ranged', cost: 30000, damage: '1d10 piercing', weight: 3.0, properties: ['ammunition', 'loud', 'muzzle-loading', 'rifled'], range: '40/160', firearm: true, advanced: true, text: 'Ammunition (range 40/160), loud, muzzle-loading, rifled' },
  { name: 'Rifled Carbine', category: 'martial', kind: 'ranged', cost: 30000, damage: '1d12 piercing', weight: 5.0, properties: ['ammunition', 'loud', 'misfire', 'muzzle-loading', 'two-handed', 'rifled'], range: '80/320', firearm: true, advanced: true, text: 'Ammunition (range 80/320), loud, misfire, muzzle-loading, two-handed, rifled' },
  { name: 'Rifled Musket', category: 'martial', kind: 'ranged', cost: 31500, damage: '2d8 piercing', weight: 3.0, properties: ['ammunition', 'loud', 'misfire', 'muzzle-loading', 'two-handed', 'rifled'], range: '100/400', firearm: true, advanced: true, text: 'Ammunition (range 100/400), loud, misfire, muzzle-loading, two-handed, rifled' }
];

DND.ARMOR = [
  { name: 'Padded', category: 'light', cost: 500, base: 11, dexMax: null, stealthDisadvantage: true, weight: 8.0, acText: '11 + Dex modifier' },
  { name: 'Leather', category: 'light', cost: 1000, base: 11, dexMax: null, stealthDisadvantage: false, weight: 10.0, acText: '11 + Dex modifier' },
  { name: 'Studded leather', category: 'light', cost: 4500, base: 12, dexMax: null, stealthDisadvantage: false, weight: 13.0, acText: '12 + Dex modifier' },
  { name: 'Hide', category: 'medium', cost: 1000, base: 12, dexMax: 2, stealthDisadvantage: false, weight: 12.0, acText: '12 + Dex modifier (max 2)' },
  { name: 'Chain shirt', category: 'medium', cost: 5000, base: 13, dexMax: 2, stealthDisadvantage: false, weight: 20.0, acText: '13 + Dex modifier (max 2)' },
  { name: 'Scale mail', category: 'medium', cost: 5000, base: 14, dexMax: 2, stealthDisadvantage: true, weight: 45.0, acText: '14 + Dex modifier (max 2)' },
  { name: 'Breastplate', category: 'medium', cost: 40000, base: 14, dexMax: 2, stealthDisadvantage: false, weight: 20.0, acText: '14 + Dex modifier (max 2)' },
  { name: 'Half plate', category: 'medium', cost: 75000, base: 15, dexMax: 2, stealthDisadvantage: true, weight: 40.0, acText: '15 + Dex modifier (max 2)' },
  { name: 'Ring mail', category: 'heavy', cost: 3000, base: 14, dexMax: 0, stealthDisadvantage: true, weight: 40.0, acText: '14' },
  { name: 'Chain mail', category: 'heavy', cost: 7500, base: 16, dexMax: 0, strength: 13, stealthDisadvantage: true, weight: 55.0, acText: '16' },
  { name: 'Splint', category: 'heavy', cost: 20000, base: 17, dexMax: 0, strength: 15, stealthDisadvantage: true, weight: 60.0, acText: '17' },
  { name: 'Plate', category: 'heavy', cost: 150000, base: 18, dexMax: 0, strength: 15, stealthDisadvantage: true, weight: 65.0, acText: '18' },
  { name: 'Shield', category: 'shield', cost: 1000, bonus: 2, stealthDisadvantage: false, weight: 6.0, acText: '+2' }
];

DND.GEAR = [
  { name: 'Abacus', cost: 200, weight: 2.0 },
  { name: 'Acid (vial)', cost: 2500, weight: 1.0 },
  { name: 'Alchemist\u2019s fire (flask)', cost: 5000, weight: 1.0 },
  { name: 'Ammunition: Arrows (20)', cost: 100, weight: 1.0 },
  { name: 'Ammunition: Blowgun needles (50)', cost: 100, weight: 1.0 },
  { name: 'Ammunition: Bullets, firedust (20 shots)', cost: 100, weight: 2.0 },
  { name: 'Ammunition: Crossbow bolts (20)', cost: 100, weight: 1.5 },
  { name: 'Ammunition: Sling bullets (20)', cost: 4, weight: 1.5 },
  { name: 'Antitoxin (vial)', cost: 5000, weight: 0 },
  { name: 'Arcane focus: Crystal', cost: 1000, weight: 1.0 },
  { name: 'Arcane focus: Orb', cost: 2000, weight: 3.0 },
  { name: 'Arcane focus: Rod', cost: 1000, weight: 2.0 },
  { name: 'Arcane focus: Staff', cost: 500, weight: 4.0 },
  { name: 'Arcane focus: Wand', cost: 1000, weight: 1.0 },
  { name: 'Backpack', cost: 200, weight: 5.0 },
  { name: 'Ball bearings (bag of 1,000)', cost: 100, weight: 2.0 },
  { name: 'Barrel', cost: 200, weight: 70.0 },
  { name: 'Basket', cost: 40, weight: 2.0 },
  { name: 'Bedroll', cost: 100, weight: 7.0 },
  { name: 'Bell', cost: 100, weight: 0 },
  { name: 'Blanket', cost: 50, weight: 3.0 },
  { name: 'Block and tackle', cost: 100, weight: 5.0 },
  { name: 'Book', cost: 2500, weight: 5.0 },
  { name: 'Bottle, glass', cost: 200, weight: 2.0 },
  { name: 'Bucket', cost: 5, weight: 2.0 },
  { name: 'Caltrops (bag of 20)', cost: 100, weight: 2.0 },
  { name: 'Candle', cost: 1, weight: 0 },
  { name: 'Case, crossbow bolt', cost: 100, weight: 1.0 },
  { name: 'Case, map or scroll', cost: 100, weight: 1.0 },
  { name: 'Chain (10 feet)', cost: 500, weight: 10.0 },
  { name: 'Chalk (1 piece)', cost: 1, weight: 0 },
  { name: 'Chest', cost: 500, weight: 25.0 },
  { name: 'Climber\u2019s kit', cost: 2500, weight: 12.0 },
  { name: 'Clothes, common', cost: 50, weight: 3.0 },
  { name: 'Clothes, costume', cost: 500, weight: 4.0 },
  { name: 'Clothes, fine', cost: 1500, weight: 6.0 },
  { name: 'Clothes, traveler\u2019s', cost: 200, weight: 4.0 },
  { name: 'Component pouch', cost: 2500, weight: 2.0 },
  { name: 'Crowbar', cost: 200, weight: 5.0 },
  { name: 'Druidic focus: Sprig of mistletoe', cost: 100, weight: 0 },
  { name: 'Druidic focus: Totem', cost: 100, weight: 0 },
  { name: 'Druidic focus: Wooden staff', cost: 500, weight: 4.0 },
  { name: 'Druidic focus: Yew wand', cost: 1000, weight: 1.0 },
  { name: 'Fey pepper, week\u2019s supply', cost: 1000, weight: 0 },
  { name: 'Firedust, cask', cost: 2000, weight: 20.0 },
  { name: 'Fishing tackle', cost: 100, weight: 4.0 },
  { name: 'Flask or tankard', cost: 2, weight: 1.0 },
  { name: 'Gentleman\u2019s outfit', cost: 3000, weight: 6.0 },
  { name: 'Goggles', cost: 500, weight: 1.0 },
  { name: 'Grappling hook', cost: 200, weight: 4.0 },
  { name: 'Hammer', cost: 100, weight: 3.0 },
  { name: 'Hammer, sledge', cost: 200, weight: 10.0 },
  { name: 'Healer\u2019s kit', cost: 500, weight: 3.0 },
  { name: 'Holy symbol: Amulet', cost: 500, weight: 1.0 },
  { name: 'Holy symbol: Emblem', cost: 500, weight: 0 },
  { name: 'Holy symbol: Reliquary', cost: 500, weight: 2.0 },
  { name: 'Holy water (flask)', cost: 2500, weight: 1.0 },
  { name: 'Hourglass', cost: 2500, weight: 1.0 },
  { name: 'Hunting trap', cost: 500, weight: 25.0 },
  { name: 'Ink (1 ounce bottle)', cost: 1000, weight: 0 },
  { name: 'Ink pen', cost: 2, weight: 0 },
  { name: 'Jug or pitcher', cost: 2, weight: 4.0 },
  { name: 'Ladder (10-foot)', cost: 10, weight: 25.0 },
  { name: 'Lady\u2019s outfit', cost: 3000, weight: 12.0 },
  { name: 'Lamp', cost: 50, weight: 1.0 },
  { name: 'Lantern, bullseye', cost: 1000, weight: 2.0 },
  { name: 'Lantern, hooded', cost: 500, weight: 2.0 },
  { name: 'Leaf of Nicodemus, week\u2019s supply', cost: 100, weight: 0 },
  { name: 'Lock', cost: 1000, weight: 1.0 },
  { name: 'Magnifying glass', cost: 10000, weight: 0 },
  { name: 'Manacles', cost: 200, weight: 6.0 },
  { name: 'Mess kit', cost: 20, weight: 1.0 },
  { name: 'Mirror, steel', cost: 500, weight: 0.5 },
  { name: 'Oil (flask)', cost: 10, weight: 1.0 },
  { name: 'Paper (one sheet)', cost: 20, weight: 0 },
  { name: 'Parchment (one sheet)', cost: 10, weight: 0 },
  { name: 'Perfume (vial)', cost: 500, weight: 0 },
  { name: 'Pick, miner\u2019s', cost: 200, weight: 10.0 },
  { name: 'Piton', cost: 5, weight: 0.25 },
  { name: 'Pocket watch', cost: 2500, weight: 0 },
  { name: 'Poison, basic (vial)', cost: 10000, weight: 0 },
  { name: 'Pole (10-foot)', cost: 5, weight: 7.0 },
  { name: 'Pot, iron', cost: 200, weight: 10.0 },
  { name: 'Potion of healing', cost: 5000, weight: 0.5 },
  { name: 'Pouch', cost: 50, weight: 1.0 },
  { name: 'Quiver', cost: 100, weight: 1.0 },
  { name: 'Ram, portable', cost: 400, weight: 35.0 },
  { name: 'Rations (1 day)', cost: 50, weight: 2.0 },
  { name: 'Robes', cost: 100, weight: 4.0 },
  { name: 'Rope, hempen (50 feet)', cost: 100, weight: 10.0 },
  { name: 'Rope, silk (50 feet)', cost: 1000, weight: 5.0 },
  { name: 'Sack', cost: 1, weight: 0.5 },
  { name: 'Scale, merchant\u2019s', cost: 500, weight: 3.0 },
  { name: 'Sealing wax', cost: 50, weight: 0 },
  { name: 'Shovel', cost: 200, weight: 5.0 },
  { name: 'Signal whistle', cost: 5, weight: 0 },
  { name: 'Signet ring', cost: 500, weight: 0 },
  { name: 'Soap', cost: 2, weight: 0 },
  { name: 'Spellbook', cost: 5000, weight: 3.0 },
  { name: 'Spikes, iron (10)', cost: 100, weight: 5.0 },
  { name: 'Spyglass', cost: 100000, weight: 1.0 },
  { name: 'Surgeon\u2019s kit', cost: 5000, weight: 2.0 },
  { name: 'Tent, two-person', cost: 200, weight: 20.0 },
  { name: 'Tinderbox', cost: 50, weight: 1.0 },
  { name: 'Torch', cost: 1, weight: 1.0 },
  { name: 'Vial', cost: 100, weight: 0 },
  { name: 'Waterskin', cost: 20, weight: 5.0 },
  { name: 'Whetstone', cost: 1, weight: 1.0 }
];


/* Tools, from the Player's Handbook table (PHB 154). Not in the campaign's
   gear tables, but class and background equipment needs them and they should
   be buyable. `kind` matches the grouping the proficiency lists use. */
DND.TOOL_ITEMS = [
  { name: "Alchemist's supplies", kind: 'artisan', cost: 5000, weight: 8 },
  { name: "Brewer's supplies", kind: 'artisan', cost: 2000, weight: 9 },
  { name: "Calligrapher's supplies", kind: 'artisan', cost: 1000, weight: 5 },
  { name: "Carpenter's tools", kind: 'artisan', cost: 800, weight: 6 },
  { name: "Cartographer's tools", kind: 'artisan', cost: 1500, weight: 6 },
  { name: "Cobbler's tools", kind: 'artisan', cost: 500, weight: 5 },
  { name: "Cook's utensils", kind: 'artisan', cost: 100, weight: 8 },
  { name: "Glassblower's tools", kind: 'artisan', cost: 3000, weight: 5 },
  { name: "Jeweler's tools", kind: 'artisan', cost: 2500, weight: 2 },
  { name: "Leatherworker's tools", kind: 'artisan', cost: 500, weight: 5 },
  { name: "Mason's tools", kind: 'artisan', cost: 1000, weight: 8 },
  { name: "Painter's supplies", kind: 'artisan', cost: 1000, weight: 5 },
  { name: "Potter's tools", kind: 'artisan', cost: 1000, weight: 3 },
  { name: "Smith's tools", kind: 'artisan', cost: 2000, weight: 8 },
  { name: "Tinker's tools", kind: 'artisan', cost: 5000, weight: 10 },
  { name: "Weaver's tools", kind: 'artisan', cost: 100, weight: 5 },
  { name: "Woodcarver's tools", kind: 'artisan', cost: 100, weight: 5 },
  { name: 'Disguise kit', kind: 'kit', cost: 2500, weight: 3 },
  { name: 'Forgery kit', kind: 'kit', cost: 1500, weight: 5 },
  { name: 'Herbalism kit', kind: 'kit', cost: 500, weight: 3 },
  { name: "Navigator's tools", kind: 'kit', cost: 2500, weight: 2 },
  { name: "Poisoner's kit", kind: 'kit', cost: 5000, weight: 2 },
  { name: "Thieves' tools", kind: 'kit', cost: 2500, weight: 1 },
  { name: 'Dice set', kind: 'gaming', cost: 10, weight: 0 },
  { name: 'Dragonchess set', kind: 'gaming', cost: 100, weight: 0.5 },
  { name: 'Playing card set', kind: 'gaming', cost: 50, weight: 0 },
  { name: 'Three-Dragon Ante set', kind: 'gaming', cost: 100, weight: 0 },
  { name: 'Bagpipes', kind: 'instrument', cost: 3000, weight: 6 },
  { name: 'Drum', kind: 'instrument', cost: 600, weight: 3 },
  { name: 'Dulcimer', kind: 'instrument', cost: 2500, weight: 10 },
  { name: 'Flute', kind: 'instrument', cost: 200, weight: 1 },
  { name: 'Lute', kind: 'instrument', cost: 3500, weight: 2 },
  { name: 'Lyre', kind: 'instrument', cost: 3000, weight: 2 },
  { name: 'Horn', kind: 'instrument', cost: 300, weight: 2 },
  { name: 'Pan flute', kind: 'instrument', cost: 1200, weight: 2 },
  { name: 'Shawm', kind: 'instrument', cost: 200, weight: 1 },
  { name: 'Viol', kind: 'instrument', cost: 3000, weight: 1 }
];

/* Pack-only oddments: they come inside a pack and are not sold separately. */
DND.PACK_ONLY_ITEMS = [
  { name: 'String (10 feet)', cost: null, weight: 0 },
  { name: 'Alms box', cost: null, weight: 0 },
  { name: 'Incense (block)', cost: null, weight: 0 },
  { name: 'Censer', cost: null, weight: 1 },
  { name: 'Vestments', cost: null, weight: 4 },
  { name: 'Bag of sand', cost: null, weight: 0 },
  { name: 'Small knife', cost: null, weight: 0 }
];

DND.findGear = function (name) {
  var all = DND.WEAPONS.concat(DND.ARMOR, DND.GEAR, DND.TOOL_ITEMS,
                               DND.PACK_ONLY_ITEMS, DND.PACKS || []);
  for (var i = 0; i < all.length; i++) if (all[i].name === name) return all[i];
  return null;
};
DND.findWeapon = function (name) {
  for (var i = 0; i < DND.WEAPONS.length; i++) if (DND.WEAPONS[i].name === name) return DND.WEAPONS[i];
  return null;
};
DND.weaponHas = function (name, prop) {
  var w = DND.findWeapon(name);
  return !!(w && w.properties.indexOf(prop) !== -1);
};
