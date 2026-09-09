/* Backgrounds. PHB 2014 ch.4. Feature names carry a short mechanical note;
   full wording is in the book at the cited page. */
window.DND = window.DND || {};

DND.BACKGROUNDS = [
  {
    id: 'acolyte', name: 'Acolyte', source: 'PHB 127',
    skills: ['insight', 'religion'],
    languages: { choose: 2 },
    feature: { name: 'Shelter of the Faithful', text: 'You and your companions receive free healing and care at temples of your faith.' },
    equipment: 'Holy symbol, prayer book or prayer wheel, 5 sticks of incense, vestments, common clothes, 15 gp.'
  },
  {
    id: 'charlatan', name: 'Charlatan', source: 'PHB 128',
    skills: ['deception', 'sleightOfHand'],
    tools: ['Disguise kit', 'Forgery kit'],
    feature: { name: 'False Identity', text: 'You have a second identity with documentation and can forge papers.' },
    equipment: 'Fine clothes, disguise kit, tools of your con of choice, 15 gp.'
  },
  {
    id: 'criminal', name: 'Criminal', source: 'PHB 129',
    skills: ['deception', 'stealth'],
    tools: ["Thieves' tools"],
    toolChoices: [{ id: 'crimGaming', label: 'Gaming set', type: 'tool', count: 1, from: 'gaming' }],
    feature: { name: 'Criminal Contact', text: 'You have a reliable contact in the criminal underworld and a network of messengers.' },
    equipment: 'Crowbar, dark common clothes with hood, belt pouch with 15 gp.',
    variants: [
      { id: 'spy', name: 'Spy', note: 'Same proficiencies and feature; a spy is a criminal in state service.' }
    ]
  },
  {
    id: 'entertainer', name: 'Entertainer', source: 'PHB 130',
    skills: ['acrobatics', 'performance'],
    tools: ['Disguise kit'],
    toolChoices: [{ id: 'entInstrument', label: 'Musical instrument', type: 'tool', count: 1, from: 'instrument' }],
    feature: { name: 'By Popular Demand', text: 'You can always find a place to perform, receiving free lodging and food of modest standard.' },
    equipment: 'Musical instrument, favor of an admirer, costume, 15 gp.',
    variants: [
      { id: 'gladiator', name: 'Gladiator', note: 'Replaces the instrument with an inexpensive but unusual weapon.' }
    ]
  },
  {
    id: 'folkHero', name: 'Folk Hero', source: 'PHB 131',
    skills: ['animalHandling', 'survival'],
    tools: ['Vehicles (land)'],
    toolChoices: [{ id: 'folkArtisan', label: "Artisan's tools", type: 'tool', count: 1, from: 'artisan' }],
    feature: { name: 'Rustic Hospitality', text: 'Common folk will shelter and hide you unless you have shown yourself a danger to them.' },
    equipment: "Artisan's tools, shovel, iron pot, common clothes, 10 gp."
  },
  {
    id: 'guildArtisan', name: 'Guild Artisan', source: 'PHB 132',
    skills: ['insight', 'persuasion'],
    languages: { choose: 1 },
    toolChoices: [{ id: 'guildArtisanTools', label: "Artisan's tools", type: 'tool', count: 1, from: 'artisan' }],
    feature: { name: 'Guild Membership', text: 'Your guild provides lodging, food, and legal support, in exchange for monthly dues.' },
    equipment: "Artisan's tools, letter of introduction from your guild, traveler's clothes, 15 gp.",
    variants: [
      { id: 'guildMerchant', name: 'Guild Merchant', note: "Swap artisan's tools for navigator's tools or a language; a mule and cart replace the tools in your equipment." }
    ]
  },
  {
    id: 'hermit', name: 'Hermit', source: 'PHB 134',
    skills: ['medicine', 'religion'],
    tools: ['Herbalism kit'],
    languages: { choose: 1 },
    feature: { name: 'Discovery', text: 'Your seclusion gave you a unique and powerful discovery, defined with your DM.' },
    equipment: 'Scroll case of notes, winter blanket, common clothes, herbalism kit, 5 gp.'
  },
  {
    id: 'noble', name: 'Noble', source: 'PHB 135',
    skills: ['history', 'persuasion'],
    languages: { choose: 1 },
    toolChoices: [{ id: 'nobleGaming', label: 'Gaming set', type: 'tool', count: 1, from: 'gaming' }],
    feature: { name: 'Position of Privilege', text: 'You are welcome in high society and can secure an audience with local nobles.' },
    equipment: 'Fine clothes, signet ring, scroll of pedigree, purse with 25 gp.',
    variants: [
      { id: 'knight', name: 'Knight', note: 'Replaces the feature with Retainers: three commoners serve you.' }
    ]
  },
  {
    id: 'outlander', name: 'Outlander', source: 'PHB 136',
    skills: ['athletics', 'survival'],
    languages: { choose: 1 },
    toolChoices: [{ id: 'outInstrument', label: 'Musical instrument', type: 'tool', count: 1, from: 'instrument' }],
    feature: { name: 'Wanderer', text: 'You have an excellent memory for maps and geography, and can find food and water for up to five people daily.' },
    equipment: 'Staff, hunting trap, animal trophy, traveler\u2019s clothes, 10 gp.'
  },
  {
    id: 'sage', name: 'Sage', source: 'PHB 137',
    skills: ['arcana', 'history'],
    languages: { choose: 2 },
    feature: { name: 'Researcher', text: 'When you do not know something, you usually know where to find it.' },
    equipment: 'Bottle of black ink, quill, small knife, letter from a dead colleague, common clothes, 10 gp.'
  },
  {
    id: 'sailor', name: 'Sailor', source: 'PHB 139',
    skills: ['athletics', 'perception'],
    tools: ["Navigator's tools", 'Vehicles (water)'],
    feature: { name: "Ship's Passage", text: 'You can secure free passage on a sailing ship for yourself and your companions, in exchange for helping crew it.' },
    equipment: 'Belaying pin (club), 50 feet of silk rope, lucky charm, common clothes, 10 gp.',
    variants: [
      { id: 'pirate', name: 'Pirate', note: 'Replaces the feature with Bad Reputation: people fear you and let minor crimes slide.' }
    ]
  },
  {
    id: 'soldier', name: 'Soldier', source: 'PHB 140',
    skills: ['athletics', 'intimidation'],
    tools: ['Vehicles (land)'],
    toolChoices: [{ id: 'soldierGaming', label: 'Gaming set', type: 'tool', count: 1, from: 'gaming' }],
    feature: { name: 'Military Rank', text: 'Soldiers loyal to your former organization recognize your authority and defer to you.' },
    equipment: 'Insignia of rank, trophy from a fallen enemy, dice or cards, common clothes, 10 gp.'
  },
  {
    id: 'urchin', name: 'Urchin', source: 'PHB 141',
    skills: ['sleightOfHand', 'stealth'],
    tools: ['Disguise kit', "Thieves' tools"],
    feature: { name: 'City Secrets', text: 'You can move between any two locations in a city at twice normal travel pace.' },
    equipment: 'Small knife, map of your home city, pet mouse, token of your parents, common clothes, 10 gp.'
  }
];

/* PHB 125-126, "Customizing a Background". */
DND.CUSTOM_BACKGROUND = {
  id: 'custom', name: 'Custom Background', source: 'PHB 125', optional: true,
  optionalNote: 'Optional rule. Choose any two skills, and any two tools or languages in total.',
  skillChoices: 2,
  toolOrLanguageChoices: 2
};

DND.findBackground = function (id) {
  if (id === 'custom') return DND.CUSTOM_BACKGROUND;
  for (var i = 0; i < DND.BACKGROUNDS.length; i++) if (DND.BACKGROUNDS[i].id === id) return DND.BACKGROUNDS[i];
  return null;
};
