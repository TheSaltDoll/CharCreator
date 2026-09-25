/* The printed character sheet.

   Three US Letter pages arranged like the official fifth edition sheet: the
   core page (abilities, saves and skills; armor class, hit points, attacks
   and equipment; personality and features), a details page left blank for
   the player, and a spells page when the character casts. Every section
   grows with its content rather than holding a fixed size.

   Drawn entirely with borders and text, never background fills, so it prints
   the same whether or not the browser's "background graphics" is ticked.
   Built on demand by js/app.js before printing; nothing here holds state. */
window.DND = window.DND || {};

DND.Print = (function () {
  var el = DND.UI.el, clear = DND.UI.clear;
  var fmt = function (n) { return DND.formatMod(n); };

  /* h('div', 'cls', [kids]) or h('div', 'cls', 'text') */
  function h(tag, cls, kids) {
    if (typeof kids === 'string' || typeof kids === 'number') return el(tag, { class: cls, text: String(kids) });
    return el(tag, { class: cls }, kids || []);
  }
  function label(text) { return h('div', 'ps-lbl', text); }

  /* A bordered box with its label at the top. */
  function box(title, kids, cls) {
    return h('section', 'ps-box' + (cls ? ' ' + cls : ''), [label(title)].concat(kids || []));
  }
  /* A box left empty for handwriting; its height is set in the stylesheet. */
  function blank(title, cls) { return box(title, [h('div', 'ps-write')], cls); }

  /* Proficiency and spell markers, drawn with borders so they always print.
     kinds: '' empty ring, 'on' filled, 'expert' filled and ringed, 'half' two-tone. */
  function dot(kind) { return h('span', 'pd' + (kind ? ' pd-' + kind : '')); }
  function diamond() { return h('span', 'pdia'); }

  function ordinal(n) { return DND.ordinal(n); }
  function abbr(id) {
    var a = DND.ABILITIES.filter(function (x) { return x.id === id; })[0];
    return a ? a.abbr.charAt(0) + a.abbr.slice(1).toLowerCase() : id;
  }
  function uniq(list) {
    var seen = {};
    return list.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; });
  }

  /* ============================================================
     Page 1: the core sheet
     ============================================================ */
  function headerField(title, value) {
    return h('div', 'ps-field', [h('div', 'ps-field-val', value || ''), label(title)]);
  }

  function classLine(c) {
    return c.classes.map(function (ci) {
      return ci.name + ' ' + ci.level + (ci.subclass ? ' (' + ci.subclass.name + ')' : '');
    }).join(' / ');
  }

  function pageCore(c, state) {
    var page = h('section', 'ps-page ps-core');

    page.appendChild(h('header', 'ps-head', [
      h('div', 'ps-name', [h('div', 'ps-name-val', c.name || ''), label('Character name')]),
      h('div', 'ps-meta', [
        headerField('Class & level', classLine(c)),
        headerField('Background', c.background ? c.background.name : ''),
        headerField('Player name', c.playerName),
        headerField('Race', c.subrace ? c.subrace.name : (c.race ? c.race.name : '')),
        headerField('Alignment', c.alignment),
        headerField('Experience points', '')
      ])
    ]));

    /* an unfinished character must not pass for a finished one */
    var warnings = uniq(c.warnings || []);
    if (c.pending.length || warnings.length) {
      var kids = [];
      if (c.pending.length) {
        var shown = c.pending.slice(0, 6).join(' ');
        if (c.pending.length > 6) shown += ' And ' + (c.pending.length - 6) + ' more.';
        kids.push(h('p', null, [h('strong', null, 'Not finished. '), 'Still to choose in the builder: ' + shown]));
      }
      warnings.forEach(function (w) { kids.push(h('p', null, w)); });
      page.appendChild(h('div', 'ps-notice', kids));
    }

    page.appendChild(h('div', 'ps-cols', [colAbilities(c), colCombat(c, state), colPersona(c, state)]));
    return page;
  }

  /* ---------- left column: abilities, saves, skills, proficiencies ---------- */
  function colAbilities(c) {
    var abilities = h('div', 'ps-abilities', DND.ABILITIES.map(function (a) {
      var s = c.scores[a.id];
      return h('div', 'ps-abl', [
        h('div', 'ps-abl-name', a.name),
        h('div', 'ps-abl-mod', fmt(s.mod)),
        h('div', 'ps-abl-score', String(s.total))
      ]);
    }));

    var saves = box('Saving throws', c.saves.map(function (s) {
      return h('div', 'ps-check', [dot(s.prof ? 'on' : ''), h('span', 'ps-check-val', fmt(s.bonus)), h('span', null, s.name)]);
    }));

    var skills = box('Skills', c.skills.map(function (s) {
      var kind = s.expertise ? 'expert' : (s.prof ? 'on' : (s.jack ? 'half' : ''));
      return h('div', 'ps-check', [
        dot(kind), h('span', 'ps-check-val', fmt(s.bonus)),
        h('span', null, [s.name + ' ', h('span', 'ps-dim', '(' + abbr(s.ability) + ')')])
      ]);
    }));
    var marks = [];
    if (c.skills.some(function (s) { return s.expertise; })) marks.push([dot('expert'), ' expertise']);
    if (c.skills.some(function (s) { return s.jack; })) marks.push([dot('half'), ' Jack of All Trades']);
    if (marks.length) {
      skills.appendChild(h('div', 'ps-key', [].concat.apply([], marks.map(function (m, i) {
        return (i ? ['   '] : []).concat(m);
      }))));
    }

    var side = h('div', 'ps-abl-side', [
      h('div', 'ps-pill', [h('span', 'ps-pill-square'), label('Inspiration')]),
      h('div', 'ps-pill', [h('span', 'ps-pill-val', fmt(c.proficiencyBonus)), label('Proficiency bonus')]),
      saves, skills
    ]);

    var perception = c.skills.filter(function (s) { return s.id === 'perception'; })[0];
    var passive = h('div', 'ps-pill', [h('span', 'ps-pill-val', String(perception.passive)),
                                        label('Passive Wisdom (Perception)')]);

    var profLine = function (title, list) {
      var text = list.length ? list.join(', ') : 'None';
      return h('p', 'ps-prof', [h('span', 'ps-run', title + '. '), text]);
    };
    var other = box('Other proficiencies & languages', [
      profLine('Armor', c.armor.map(function (x) { return x.value; })),
      profLine('Weapons', c.weapons.map(function (x) { return x.value; })),
      profLine('Tools', c.tools.map(function (x) { return x.value; })),
      profLine('Languages', c.languages.map(function (l) { return DND.Engine.prettyName(l.value); }))
    ], 'ps-grow');

    return h('div', 'ps-col ps-col-a', [h('div', 'ps-abl-wrap', [abilities, side]), passive, other]);
  }

  /* ---------- middle column: defenses, hit points, attacks, equipment ---------- */
  function colCombat(c, state) {
    /* The headline AC is the best option you are proficient with; the others follow. */
    var usable = c.acOptions.filter(function (o) { return o.proficient !== false; });
    var best = usable.reduce(function (a, b) { return b.value > a.value ? b : a; }, usable[0]);
    var acBox = h('div', 'ps-stat ps-stat-ac', [h('div', 'ps-stat-val', best ? String(best.value) : ''), label('Armor class')]);
    var trio = h('div', 'ps-trio', [
      acBox,
      h('div', 'ps-stat', [h('div', 'ps-stat-val', fmt(c.initiative)), label('Initiative')]),
      h('div', 'ps-stat', [h('div', 'ps-stat-val', c.speed + ' ft'), label('Speed')])
    ]);
    var acNotes = [];
    if (best) {
      var others = usable.filter(function (o) { return o !== best; })
        .map(function (o) { return o.label + ' ' + o.value; });
      acNotes.push(h('p', null, best.label + (others.length ? '. Also: ' + others.join(', ') + '.' : '.')));
    }
    c.gear.armorNotes.forEach(function (n) { acNotes.push(h('p', 'ps-warn', n)); });
    c.speedNotes.forEach(function (n) { acNotes.push(h('p', null, n)); });

    var hp = h('section', 'ps-box ps-hp', [
      h('div', 'ps-hp-max', [h('span', 'ps-lbl', 'Hit point maximum'),
                             h('span', 'ps-hp-max-val', c.hp.total !== null ? String(c.hp.total) : '')]),
      h('div', 'ps-write'), label('Current hit points')
    ]);
    var temp = h('section', 'ps-box ps-temp', [h('div', 'ps-write'), label('Temporary hit points')]);

    var circles = function (n) { var out = []; for (var i = 0; i < n; i++) out.push(dot('')); return h('span', 'ps-circles', out); };
    var duo = h('div', 'ps-duo', [
      h('section', 'ps-box ps-hd', [
        h('div', 'ps-hd-total', [h('span', 'ps-lbl', 'Total '), h('span', null, c.hp.dice.join(' + '))]),
        h('div', 'ps-write'), label('Hit dice')
      ]),
      h('section', 'ps-box ps-death', [
        h('div', 'ps-death-row', [h('span', 'ps-lbl', 'Successes'), circles(3)]),
        h('div', 'ps-death-row', [h('span', 'ps-lbl', 'Failures'), circles(3)]),
        label('Death saves')
      ])
    ]);

    return h('div', 'ps-col ps-col-b', [trio, h('div', 'ps-ac-notes', acNotes), hp, temp, duo,
                                         attacksBox(c), equipmentBox(c, state)]);
  }

  function attacksBox(c) {
    /* each attack and its notes share a tbody, so a page break cannot part them */
    var groups = [h('thead', null, [h('tr', null, [h('th', null, 'Name'), h('th', 'ps-num', 'Atk bonus'), h('th', null, 'Damage/type')])])];
    c.attacks.forEach(function (a) {
      var rows = [];
      rows.push(h('tr', 'ps-atk', [
        h('td', 'ps-atk-name', a.name),
        h('td', 'ps-num', fmt(a.toHit)),
        h('td', null, a.damage + (a.damageType ? ' ' + a.damageType : ''))
      ]));
      var extra = [];
      if (a.properties) extra.push(a.properties);
      if (a.twoHanded) extra.push('Two-handed: ' + a.twoHanded);
      if (a.thrown && a.thrown.damage) extra.push('Thrown: ' + a.thrown.damage);
      extra = extra.concat(a.notes);
      if (extra.length) rows.push(h('tr', 'ps-atk-note', [el('td', { colspan: '3', text: extra.join('. ') + '.' })]));
      groups.push(h('tbody', 'ps-atk-group', rows));
    });
    /* two ruled lines to write on, as the official sheet leaves */
    var blanks = [];
    for (var i = 0; i < 2; i++) {
      blanks.push(h('tr', 'ps-atk ps-atk-blank', [h('td', null, ''), h('td', null, ''), h('td', null, '')]));
    }
    groups.push(h('tbody', null, blanks));
    var kids = [h('table', 'ps-table ps-attacks', groups)];

    (c.spellcasting ? c.spellcasting.perClass : []).forEach(function (p) {
      if (!p.active) return;
      kids.push(h('p', 'ps-castline', (p.subName || p.className) + ' spells: save DC ' + p.saveDc +
        ', spell attack ' + fmt(p.attack) + ' (' + abbr(p.ability) + ').'));
    });
    return box('Attacks & spellcasting', kids);
  }

  function equipmentBox(c, state) {
    /* Coin: the purse is kept in copper; shown in gold, silver and copper,
       with electrum and platinum left to fill in. */
    var cp = c.gear.remainingCp, coins = { cp: '', sp: '', ep: '', gp: '', pp: '' };
    if (cp >= 0) {
      coins.gp = String(Math.floor(cp / 100));
      coins.sp = String(Math.floor((cp % 100) / 10));
      coins.cp = String(cp % 10);
    }
    var purse = h('div', 'ps-coins', ['cp', 'sp', 'ep', 'gp', 'pp'].map(function (k) {
      return h('div', 'ps-coin', [h('span', 'ps-coin-lbl', k.toUpperCase()), h('span', 'ps-coin-val', coins[k])]);
    }));

    /* one line per item, quantities summed; a pack lists what is inside */
    var byName = {}, items = [];
    c.gear.inventory.forEach(function (it) {
      if (byName[it.name]) { byName[it.name].qty += it.qty; return; }
      byName[it.name] = { name: it.name, qty: it.qty, contents: it.contents };
      items.push(byName[it.name]);
    });
    var list = items.map(function (it) {
      var kids = [it.name + (it.qty > 1 ? ' \u00d7' + it.qty : '')];
      if (it.contents && it.contents.length) {
        kids.push(h('span', 'ps-dim', '. ' + it.contents.map(function (x) {
          return typeof x === 'string' ? x : (x.name + (x.qty > 1 ? ' \u00d7' + x.qty : ''));
        }).join(', ')));
      }
      return h('li', null, kids);
    });
    var body = [h('ul', 'ps-items', list)];
    var bg = c.gear.backgroundLine;
    if (bg && !(state.gear && state.gear.dropped && state.gear.dropped.bg)) {
      body.push(h('p', 'ps-bgline', [h('span', 'ps-run', 'From ' + bg.name + '. '), bg.equipment]));
    }
    var foot = ['Carried ' + c.gear.weight + ' lb.'];
    if (cp < 0) foot.push('Overspent by ' + DND.money(-cp) + '.');
    body.push(h('p', cp < 0 ? 'ps-warn' : 'ps-dim', foot.join(' ')));

    return box('Equipment', [h('div', 'ps-equip', [purse, h('div', 'ps-equip-list', body)])]);
  }

  /* ---------- right column: personality (to write) and features ---------- */
  function colPersona(c, state) {
    return h('div', 'ps-col ps-col-c', [
      blank('Personality traits', 'ps-traits'),
      blank('Ideals', 'ps-short'), blank('Bonds', 'ps-short'), blank('Flaws', 'ps-short'),
      featuresBox(c, state)
    ]);
  }

  /* Progressions repeat a feature under a new name ("Extra Attack (2)",
     "Destroy Undead (CR 1)"); on paper only the latest matters. */
  function latestOnly(features) {
    var index = {}, out = [];
    features.forEach(function (f) {
      var base = f.name.replace(/\s*\([^)]*\)\s*$/, '');
      if (index[base] !== undefined) out[index[base]] = f;
      else { index[base] = out.length; out.push(f); }
    });
    return out;
  }

  function entry(name, text) {
    return h('p', 'ps-feat', [h('span', 'ps-run', name + '. '), text || '']);
  }
  function kv(k, v) { return h('div', 'ps-kv', [h('span', null, k), h('span', 'ps-kv-val', v)]); }

  function featuresBox(c, state) {
    var kids = [];
    c.classes.forEach(function (ci) {
      kids.push(h('h4', 'ps-group', ci.name + ' ' + ci.level + (ci.subclass ? ', ' + ci.subclass.name : '')));
      ci.columns.forEach(function (col) { kids.push(kv(col.label, String(col.value))); });
      if (ci.subclass) ci.subclass.columns.forEach(function (col) { kids.push(kv(col.label, String(col.value))); });
      ci.picks.forEach(function (p) { kids.push(kv(p.label, p.values.join(', '))); });
      latestOnly(ci.features).forEach(function (f) { kids.push(entry(f.name, f.text)); });
      if (ci.subclass) latestOnly(ci.subclass.features).forEach(function (f) { kids.push(entry(f.name, f.text)); });
      ci.optionalFeatures.forEach(function (f) { kids.push(entry(f.name, f.text)); });
    });

    if (c.traits.length) {
      kids.push(h('h4', 'ps-group', (c.subrace ? c.subrace.name : c.race.name) + ' traits'));
      kids.push(kv('Size', c.size));
      if (c.darkvision) kids.push(kv('Darkvision', c.darkvision + ' ft'));
      c.traits.forEach(function (t) { kids.push(entry(t.name, t.text)); });
    }

    if (c.background && c.background.feature) {
      kids.push(h('h4', 'ps-group', 'Background: ' + c.background.name));
      kids.push(entry(c.background.feature.name, c.background.feature.text));
    }

    /* feats live in state, as on the live sheet */
    var feats = (state.feats || []).map(function (f) { return DND.findFeat(f.featId); }).filter(Boolean);
    if (feats.length) {
      kids.push(h('h4', 'ps-group', 'Feats'));
      feats.forEach(function (f) { kids.push(entry(f.name, f.note)); });
    }
    return box('Features & traits', kids, 'ps-features');
  }

  /* ============================================================
     Page 2: details, all left for the player
     ============================================================ */
  function pageDetails(c) {
    var page = h('section', 'ps-page ps-details');
    page.appendChild(h('header', 'ps-head', [
      h('div', 'ps-name', [h('div', 'ps-name-val', c.name || ''), label('Character name')]),
      h('div', 'ps-meta', ['Age', 'Height', 'Weight', 'Eyes', 'Skin', 'Hair'].map(function (t) {
        return headerField(t, '');
      }))
    ]));
    var allies = box('Allies & organizations', [
      h('div', 'ps-symbol', [label('Name'), h('div', 'ps-write'), label('Symbol')]),
      h('div', 'ps-write')
    ], 'ps-allies');
    page.appendChild(h('div', 'ps-details-grid', [
      h('div', 'ps-col', [blank('Character appearance', 'ps-appearance'), blank('Character backstory', 'ps-backstory')]),
      h('div', 'ps-col', [allies, blank('Additional features & traits', 'ps-additional'), blank('Treasure', 'ps-treasure')])
    ]));
    return page;
  }

  /* ============================================================
     Page 3: spells, when the character casts any
     ============================================================ */
  var RANK = { always: 4, arcanum: 3, prepared: 2, known: 2, cantrip: 2, book: 1 };

  function spellEntries(p) {
    var byId = {};
    function add(id, mark, note) {
      var sp = DND.SPELLS[id];
      if (!sp) return;
      var prev = byId[id];
      if (prev && RANK[prev.mark] >= RANK[mark]) return;
      byId[id] = { spell: sp, mark: sp.level === 0 && mark !== 'always' ? 'cantrip' : mark,
                   note: note || '', cls: p.subName || p.className };
    }
    if (!p.subclassExpanded) (p.subclassSpells || []).forEach(function (id) { add(id, 'always'); });
    (p.cantripsChosen || []).forEach(function (id) { add(id, 'cantrip'); });
    (p.bookChosen || []).forEach(function (id) { add(id, 'book'); });
    (p.spellsChosen || []).forEach(function (id) { add(id, p.prepared !== null ? 'prepared' : 'known'); });
    (p.secretsChosen || []).forEach(function (id) { add(id, 'known', 'Magical Secrets'); });
    (p.arcanum || []).forEach(function (a) {
      (a.chosen || []).forEach(function (id) { add(id, 'arcanum', 'Mystic Arcanum: once per long rest, no slot'); });
    });
    return Object.keys(byId).map(function (k) { return byId[k]; });
  }

  function marker(mark) {
    if (mark === 'always') return diamond();
    if (mark === 'book') return dot('');
    if (mark === 'cantrip') return h('span', 'pd-none');
    return dot('on');
  }

  /* "1 reaction, which you take when..." goes in the column as "1 reaction";
     the trigger is printed under the spell's name instead. */
  function splitCastingTime(t) {
    var m = /^(1 reaction), (which you take .*)$/.exec(t);
    return m ? { time: m[1], trigger: m[2].charAt(0).toUpperCase() + m[2].slice(1) } : { time: t, trigger: '' };
  }

  function spellRow(e, multi) {
    var s = e.spell, ct = splitCastingTime(s.castingTime);
    var tags = [];
    if (s.concentration) tags.push(h('span', 'ps-tag', 'C'));
    if (s.ritual) tags.push(h('span', 'ps-tag', 'R'));
    var sub = [ct.trigger, e.note].filter(Boolean).join('. ');
    var cells = [
      h('td', 'ps-mark', [marker(e.mark)]),
      h('td', 'ps-spell', [h('span', 'ps-spell-name', s.name)].concat(tags)
        .concat(sub ? [h('div', 'ps-spell-sub', sub + '.')] : [])),
      h('td', null, ct.time),
      h('td', null, s.range),
      h('td', null, (s.components || '\u2014') + (s.costly ? '\u2020' : '')),
      h('td', null, s.duration)
    ];
    if (multi) cells.push(h('td', null, e.cls));
    cells.push(h('td', 'ps-src', s.source));
    return h('tr', 'ps-spell-row', cells);
  }

  /* Fixed column widths (set per header class in the stylesheet) keep the
     columns aligned from one spell level to the next. */
  function spellTable(entries, multi, blanks, isCantrips) {
    var head = ['', 'Spell', 'Casting time', 'Range', 'Components', 'Duration'];
    var keys = ['mark', 'name', 'time', 'range', 'comp', 'dur'];
    if (multi) { head.push('Class'); keys.push('class'); }
    head.push('Book'); keys.push('book');
    var rows = entries.slice().sort(function (a, b) { return a.spell.name.localeCompare(b.spell.name); })
      .map(function (e) { return spellRow(e, multi); });
    for (var i = 0; i < blanks; i++) {
      /* cantrips are never prepared, so their blank lines get no circle */
      rows.push(h('tr', 'ps-spell-row ps-spell-blank', head.map(function (x, j) {
        return h('td', j === 0 ? 'ps-mark' : null, j === 0 && !isCantrips ? [dot('')] : '');
      })));
    }
    return h('table', 'ps-table ps-spells' + (multi ? ' ps-multi' : ''), [
      h('thead', null, [h('tr', null, head.map(function (x, j) { return h('th', 'sc-' + keys[j], x); }))]),
      h('tbody', null, rows)
    ]);
  }

  function pageSpells(c) {
    var sc = c.spellcasting;
    var casters = sc ? sc.perClass.filter(function (p) { return p.active; }) : [];
    var innate = c.innateSpells || [];
    if (!casters.length && !innate.length) return null;

    var page = h('section', 'ps-page ps-spellpage');
    var multi = casters.length > 1;

    if (casters.length) {
      var rows = [h('tr', null, ['Spellcasting class', 'Spellcasting ability', 'Spell save DC', 'Spell attack bonus', '']
        .map(function (x) { return h('th', null, x); }))];
      casters.forEach(function (p) {
        var extra = [];
        if (p.type === 'pact' && sc.pact) {
          extra.push('Pact Magic: ' + sc.pact.slots + ' slot' + (sc.pact.slots === 1 ? '' : 's') + ' of ' +
                     ordinal(sc.pact.level) + ' level, regained on a short or long rest ');
          for (var i = 0; i < sc.pact.slots; i++) extra.push(dot(''));
        }
        rows.push(h('tr', null, [
          h('td', 'ps-cast-class', (p.subName ? p.subName + ' (' + p.className + ')' : p.className)),
          h('td', null, DND.ABILITIES.filter(function (a) { return a.id === p.ability; })[0].name),
          h('td', 'ps-num-big', String(p.saveDc)),
          h('td', 'ps-num-big', fmt(p.attack)),
          h('td', 'ps-dim', extra)
        ]));
      });
      page.appendChild(h('header', 'ps-head ps-head-spells', [
        h('div', 'ps-name', [h('div', 'ps-name-val', c.name || ''), label('Spells')]),
        h('table', 'ps-table ps-casters', [h('tbody', null, rows)])
      ]));
    } else {
      page.appendChild(h('header', 'ps-head ps-head-spells', [
        h('div', 'ps-name', [h('div', 'ps-name-val', c.name || ''), label('Spells')])
      ]));
    }

    if (casters.length) {
      page.appendChild(h('p', 'ps-legend', [
        dot('on'), ' prepared or known   ', dot(''), ' in your spellbook, not prepared   ',
        diamond(), ' always prepared   ', h('span', 'ps-tag', 'C'), ' concentration   ',
        h('span', 'ps-tag', 'R'), ' ritual   \u2020 material component with a cost'
      ]));

      var entries = [];
      casters.forEach(function (p) { entries = entries.concat(spellEntries(p)); });
      var slots = sc.slots || [];
      var hasCantrips = casters.some(function (p) { return p.cantrips; });

      for (var lv = 0; lv <= 9; lv++) {
        var mine = entries.filter(function (e) { return e.spell.level === lv; });
        var total = lv ? (slots[lv - 1] || 0) : 0;
        var open = lv === 0 ? hasCantrips : total > 0;
        if (!mine.length && !open) continue;

        var headKids = [h('h3', 'ps-level-name', lv === 0 ? 'Cantrips' : ordinal(lv) + ' level')];
        if (total) {
          var ring = [];
          for (var k = 0; k < total; k++) ring.push(dot(''));
          headKids.push(h('span', 'ps-slots', [h('span', 'ps-lbl', 'Slots total '), h('b', null, String(total)),
            h('span', 'ps-lbl', '   Expended '), h('span', 'ps-circles', ring)]));
        }
        page.appendChild(h('section', 'ps-level', [
          h('div', 'ps-level-head', headKids),
          spellTable(mine, multi, open ? 2 : 0, lv === 0)
        ]));
      }
    }

    if (innate.length) {
      var ab = function (id) { return c.scores[id].mod; };
      var irows = innate.map(function (s) {
        var sp = DND.SPELL_BY_NAME[s.name.replace(/\s*\([^)]*\)\s*$/, '').toLowerCase()];
        var dc = 8 + c.proficiencyBonus + ab(s.ability), atk = c.proficiencyBonus + ab(s.ability);
        return h('tr', 'ps-spell-row', [
          h('td', 'ps-spell', [h('span', 'ps-spell-name', s.name)].concat(
            sp && sp.concentration ? [h('span', 'ps-tag', 'C')] : [])),
          h('td', null, s.use),
          h('td', null, abbr(s.ability) + ': save DC ' + dc + ', attack ' + fmt(atk)),
          h('td', null, sp ? splitCastingTime(sp.castingTime).time : ''),
          h('td', null, sp ? sp.range : ''),
          h('td', null, sp ? sp.duration : '')
        ]);
      });
      page.appendChild(h('section', 'ps-level', [
        h('div', 'ps-level-head', [h('h3', 'ps-level-name', 'Racial spells')]),
        h('table', 'ps-table ps-spells ps-innate', [
          h('thead', null, [h('tr', null, ['Spell', 'Use', 'Ability', 'Casting time', 'Range', 'Duration']
            .map(function (x) { return h('th', null, x); }))]),
          h('tbody', null, irows)
        ])
      ]));
    }
    return page;
  }

  /* ============================================================ */
  function render(c, state, mount) {
    clear(mount);
    mount.appendChild(pageCore(c, state));
    mount.appendChild(pageDetails(c));
    var spells = pageSpells(c);
    if (spells) mount.appendChild(spells);
  }

  return { render: render };
})();
