/* Builder application. Owns state, renders every section, keeps the sheet live. */
(function () {
  var el = DND.UI.el, clear = DND.UI.clear, field = DND.UI.field, select = DND.UI.select;
  var state = DND.Engine.blankState();
  var computed = null;
  var mount = {};

  function init() {
    ['identity', 'options', 'abilities', 'race', 'background', 'class', 'advancement', 'sheet']
      .forEach(function (k) { mount[k] = document.getElementById('mount-' + k); });

    document.getElementById('btn-save').addEventListener('click', saveJson);
    document.getElementById('btn-load').addEventListener('click', function () {
      document.getElementById('file-load').click();
    });
    document.getElementById('file-load').addEventListener('change', loadJson);
    document.getElementById('btn-reset').addEventListener('click', function () {
      if (confirm('Clear this character and start over?')) {
        state = DND.Engine.blankState();
        render();
      }
    });
    render();
  }

  function update(fn) { fn(); render(); }

  function render() {
    computed = DND.Engine.build(state);
    renderIdentity();
    renderOptions();
    renderAbilities();
    renderRace();
    renderBackground();
    renderClass();
    renderAdvancement();
    renderSheet();
  }

  /* ============================================================
     1. Identity
     ============================================================ */
  function renderIdentity() {
    var box = mount.identity;
    clear(box);

    var nameInput = el('input', { type: 'text', value: state.name, placeholder: 'Unnamed adventurer' });
    nameInput.addEventListener('input', function () {
      state.name = nameInput.value;
      renderSheet();
    });

    box.appendChild(field('Character name', nameInput,
      'Level ' + computed.level + ' \u00b7 proficiency bonus ' +
      DND.formatMod(computed.proficiencyBonus) + ' \u00b7 ' + computed.xp.toLocaleString() +
      ' XP. Level follows from the classes you take in step 6.'));
  }

  /* ============================================================
     2. Optional rules
     ============================================================ */
  function renderOptions() {
    var box = mount.options;
    clear(box);

    box.appendChild(DND.UI.toggle({
      label: 'Customizing Your Origin', source: 'TCE 8',
      description: 'Reassign racial ability increases to any scores, swap racial languages, and trade racial proficiencies.',
      checked: state.options.tashaOrigin,
      onchange: function (v) { update(function () { state.options.tashaOrigin = v; }); }
    }));

    box.appendChild(DND.UI.toggle({
      label: 'Customizing a Background', source: 'PHB 125',
      description: 'Build your own background: any two skills, and any two tools or languages.',
      checked: state.options.customBackground,
      onchange: function (v) {
        update(function () {
          state.options.customBackground = v;
          if (!v && state.backgroundId === 'custom') state.backgroundId = '';
        });
      }
    }));

    box.appendChild(DND.UI.toggle({
      label: 'Feats', source: 'PHB 165',
      description: 'Trade an Ability Score Improvement for a feat. Required for Variant Human and Custom Lineage.',
      checked: state.options.featsEnabled,
      onchange: function (v) {
        update(function () {
          state.options.featsEnabled = v;
          if (!v) {
            state.feats = [];
            Object.keys(state.asiSlots).forEach(function (k) {
              if (state.asiSlots[k].mode === 'feat') state.asiSlots[k] = { mode: 'asi' };
            });
          }
        });
      }
    }));

    box.appendChild(DND.UI.toggle({
      label: 'Multiclassing', source: 'PHB 163',
      description: 'Take levels in more than one class. Prerequisites are checked, and spell slots combine.',
      checked: state.options.multiclass,
      onchange: function (v) {
        update(function () {
          state.options.multiclass = v;
          if (!v) state.classes = state.classes.slice(0, 1);
        });
      }
    }));

    var bookRow = el('div', { class: 'book-row' }, [
      el('span', { class: 'field-label', text: 'Spell sources' })
    ]);
    [['PHB', "Player's Handbook"], ['XGE', "Xanathar's Guide"], ['TCE', "Tasha's Cauldron"]]
      .forEach(function (b) {
        var on = state.options.books[b[0]] !== false;
        bookRow.appendChild(el('button', {
          type: 'button', class: 'book-chip', 'aria-pressed': on ? 'true' : 'false', text: b[1],
          onclick: function () { update(function () { state.options.books[b[0]] = !on; }); }
        }));
      });
    box.appendChild(bookRow);

    box.appendChild(DND.UI.toggle({
      label: 'Optional Class Features', source: 'TCE 9',
      description: 'Extra and replacement class features, such as the ranger\u2019s Deft Explorer and the rogue\u2019s Steady Aim.',
      checked: state.options.optionalClassFeatures,
      onchange: function (v) {
        update(function () {
          state.options.optionalClassFeatures = v;
          if (!v) state.classes.forEach(function (c) { c.optionalFeatures = []; });
        });
      }
    }));
  }

  /* ============================================================
     3. Ability scores
     ============================================================ */
  var METHODS = [
    { id: 'standardArray', label: 'Standard array' },
    { id: 'pointBuy', label: 'Point buy' },
    { id: 'manual', label: 'Enter manually' },
    { id: 'roll', label: 'Roll 4d6' }
  ];

  function renderAbilities() {
    var box = mount.abilities;
    clear(box);

    var bar = el('div', { class: 'method-bar' });
    METHODS.forEach(function (m) {
      bar.appendChild(el('button', {
        type: 'button',
        'aria-pressed': state.abilityMethod === m.id ? 'true' : 'false',
        text: m.label,
        onclick: function () { update(function () { setMethod(m.id); }); }
      }));
    });
    box.appendChild(bar);

    if (state.abilityMethod === 'pointBuy') renderPointBuy(box);
    else if (state.abilityMethod === 'standardArray') renderArrayAssign(box, DND.STANDARD_ARRAY);
    else if (state.abilityMethod === 'roll') renderRoll(box);
    else renderManual(box);
  }

  function setMethod(id) {
    state.abilityMethod = id;
    if (id === 'standardArray') state.baseScores = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
    else if (id === 'pointBuy') state.baseScores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    else if (id === 'roll') {
      state.rolledPool = [];
      DND.ABILITIES.forEach(function (a) { state.baseScores[a.id] = 10; });
    }
  }

  function renderPointBuy(box) {
    var spent = DND.Engine.pointBuySpent(state.baseScores);
    var left = DND.POINT_BUY.budget - spent;
    box.appendChild(el('div', { class: 'budget' + (left < 0 ? ' over' : '') }, [
      el('span', { text: left < 0
        ? 'Over budget by ' + Math.abs(left) + ' points.'
        : left + ' of ' + DND.POINT_BUY.budget + ' points remaining.' })
    ]));

    var grid = el('div', { class: 'score-grid' });
    DND.ABILITIES.forEach(function (a) {
      var opts = [];
      for (var v = DND.POINT_BUY.min; v <= DND.POINT_BUY.max; v++) {
        opts.push({ value: String(v), label: v + '  (' + DND.POINT_BUY.cost[v] + ' pts)' });
      }
      grid.appendChild(scoreCell(a, select({
        placeholder: false, value: String(state.baseScores[a.id]), options: opts,
        onchange: function (val) { update(function () { state.baseScores[a.id] = parseInt(val, 10); }); }
      })));
    });
    box.appendChild(grid);
  }

  function renderArrayAssign(box, array) {
    var used = DND.ABILITIES.map(function (a) { return state.baseScores[a.id]; });
    box.appendChild(el('div', { class: 'budget' }, [
      el('span', { text: 'Assign ' + array.join(', ') + ' \u2014 one value to each ability.' })
    ]));

    var grid = el('div', { class: 'score-grid' });
    DND.ABILITIES.forEach(function (a, idx) {
      var mine = state.baseScores[a.id];
      var counts = {};
      used.forEach(function (v, i) { if (i !== idx) counts[v] = (counts[v] || 0) + 1; });

      var seen = {}, opts = [];
      array.forEach(function (v) {
        if (seen[v]) return;
        seen[v] = true;
        var total = array.filter(function (x) { return x === v; }).length;
        opts.push({ value: String(v), label: String(v), disabled: (counts[v] || 0) >= total && v !== mine });
      });

      grid.appendChild(scoreCell(a, select({
        placeholder: false, value: String(mine), options: opts,
        onchange: function (val) { update(function () { state.baseScores[a.id] = parseInt(val, 10); }); }
      })));
    });
    box.appendChild(grid);
  }

  function renderManual(box) {
    box.appendChild(el('div', { class: 'budget' }, [
      el('span', { text: 'Type any scores you like \u2014 rolled elsewhere, inherited from another sheet, or set by your DM.' })
    ]));
    var grid = el('div', { class: 'score-grid' });
    DND.ABILITIES.forEach(function (a) {
      var input = el('input', { type: 'number', min: '1', max: '30', value: String(state.baseScores[a.id]) });
      input.addEventListener('change', function () {
        update(function () {
          var v = parseInt(input.value, 10);
          state.baseScores[a.id] = isNaN(v) ? 10 : Math.max(1, Math.min(30, v));
        });
      });
      grid.appendChild(scoreCell(a, input));
    });
    box.appendChild(grid);
  }

  function renderRoll(box) {
    var bar = el('div', { class: 'pool' });
    bar.appendChild(el('button', {
      class: 'btn', type: 'button', text: state.rolledPool.length ? 'Roll again' : 'Roll six scores',
      onclick: function () {
        update(function () {
          state.rolledPool = [];
          for (var i = 0; i < 6; i++) state.rolledPool.push(DND.rollAbilityScore());
          DND.ABILITIES.forEach(function (a) { state.baseScores[a.id] = 10; });
        });
      }
    }));
    state.rolledPool.forEach(function (r) {
      bar.appendChild(el('span', {
        class: 'pool-die', text: String(r.total),
        title: 'Rolled ' + r.dice.join(', ') + ' \u2014 lowest dropped'
      }));
    });
    box.appendChild(bar);

    if (!state.rolledPool.length) {
      box.appendChild(el('p', { class: 'field-hint', text: 'Four six-sided dice per score, dropping the lowest. Roll, then assign each result to an ability.' }));
      return;
    }
    renderArrayAssign(box, state.rolledPool.map(function (r) { return r.total; }));
  }

  function scoreCell(ability, control) {
    var s = computed.scores[ability.id];
    var bits = [];
    if (s.racial) bits.push('race ' + DND.formatMod(s.racial));
    if (s.level) bits.push('level ' + DND.formatMod(s.level));
    if (s.feat) bits.push('feat ' + DND.formatMod(s.feat));
    if (s.classBonus) bits.push('class ' + DND.formatMod(s.classBonus));
    return el('div', { class: 'score-cell' }, [
      el('span', { class: 'field-label', text: ability.name }),
      control,
      el('div', { class: 'score-breakdown', text: bits.length ? bits.join(' \u00b7 ') + '  =  ' + s.total : '' })
    ]);
  }

  /* ============================================================
     4. Race
     ============================================================ */
  function renderRace() {
    var box = mount.race;
    clear(box);

    var standard = [], optional = [];
    DND.RACES.forEach(function (r) {
      var o = { value: r.id, label: r.name };
      if (r.optional) {
        if (!state.options.featsEnabled) {
          o.disabled = true;
          o.label = r.name + ' \u2014 needs the Feats rule';
        }
        optional.push(o);
      } else standard.push(o);
    });

    box.appendChild(field('Race', select({
      value: state.raceId,
      options: [
        { group: "Player's Handbook", options: standard },
        { group: 'Optional', options: optional }
      ],
      onchange: function (v) {
        update(function () {
          state.raceId = v;
          state.subraceId = '';
          state.raceChoices = {};
          state.originAsi = {};
          state.originLanguages = {};
          state.originSwaps = {};
          state.feats = state.feats.slice(0, DND.Engine.featsOwed(state, DND.findRace(v)));
        });
      }
    })));

    var race = computed.race;
    if (!race) return;

    var nested = el('div', { class: 'nested' });
    if (race.optionalNote) nested.appendChild(el('p', { class: 'field-hint', text: race.optionalNote }));

    if (race.subraces && race.subraces.length) {
      nested.appendChild(field('Subrace', select({
        value: state.subraceId,
        options: race.subraces.map(function (s) { return { value: s.id, label: s.name }; }),
        onchange: function (v) { update(function () { state.subraceId = v; state.raceChoices = {}; }); }
      })));
    }

    if (race.size === 'choice') {
      nested.appendChild(field('Size', select({
        value: state.raceChoices.__size || '',
        options: (race.sizeOptions || ['Small', 'Medium']).map(DND.UI.strOpt),
        onchange: function (v) { update(function () { state.raceChoices.__size = v; }); }
      })));
    }

    renderRacialAsi(nested, race);
    renderRaceChoices(nested, race);
    renderRaceLanguages(nested, race);
    if (state.options.tashaOrigin && !race.noOriginCustomization) renderOriginSwaps(nested, race);

    if (computed.traits.length) {
      var list = el('ul', { class: 'trait-list' });
      computed.traits.forEach(function (t) {
        list.appendChild(el('li', {}, [
          el('strong', { text: t.name + '. ' }),
          el('span', { text: t.text })
        ]));
      });
      nested.appendChild(list);
    }

    box.appendChild(nested);
  }

  function renderRacialAsi(box, race) {
    var incs = computed.racialAsi.increases;
    if (!incs.length) return;
    var tasha = state.options.tashaOrigin && !race.noOriginCustomization;

    var wrap = el('div', {});
    wrap.appendChild(el('span', { class: 'field-label', text: 'Ability score increases' }));

    if (!tasha) {
      var fixedBits = incs.filter(function (i) { return i.fixed; })
        .map(function (i) { return DND.formatMod(i.amount) + ' ' + DND.UI.abbr(i.fixed); });
      if (fixedBits.length) wrap.appendChild(el('p', { class: 'field-hint', text: fixedBits.join('  \u00b7  ') }));
    } else {
      wrap.appendChild(el('p', { class: 'field-hint', text: 'Each increase must go to a different ability.' }));
    }

    var chosen = [];
    incs.forEach(function (inc, i) {
      var cur = tasha ? (state.originAsi[i] || '') : (inc.fixed || state.raceChoices['__asi' + i] || '');
      if (cur) chosen.push(cur);
    });

    var row = el('div', { class: 'row' });
    incs.forEach(function (inc, i) {
      if (!tasha && inc.fixed) return;
      var current = tasha ? (state.originAsi[i] || '') : (state.raceChoices['__asi' + i] || '');
      var exclude = chosen.filter(function (c) { return c !== current; });
      var allowed = DND.ABILITIES.map(function (a) { return a.id; });
      if (inc.exclude) allowed = allowed.filter(function (a) { return inc.exclude.indexOf(a) === -1; });

      row.appendChild(field(DND.formatMod(inc.amount) + ' to', select({
        value: current,
        options: DND.UI.abilityOptions(allowed, exclude),
        onchange: function (v) {
          update(function () {
            if (tasha) state.originAsi[i] = v;
            else state.raceChoices['__asi' + i] = v;
          });
        }
      })));
    });

    if (row.children.length) wrap.appendChild(row);
    box.appendChild(wrap);
  }

  function renderRaceChoices(box, race) {
    DND.Engine.collectRaceChoices(race, computed.subrace).forEach(function (c) {
      if (c.showIf && state.raceChoices[c.showIf.choice] !== c.showIf.equals) return;

      var options;
      if (c.type === 'skill') {
        options = c.from === 'all' ? DND.UI.skillOptions()
          : DND.UI.skillOptions().filter(function (o) { return c.from.indexOf(o.value) !== -1; });
      } else if (c.type === 'tool') {
        options = DND.UI.toolOptions(c.from);
      } else if (c.type === 'ancestry') {
        options = DND.DRACONIC_ANCESTRY.map(function (d) {
          return { value: d.id, label: d.name + ' \u2014 ' + d.damage + ', ' + d.breath };
        });
      } else {
        options = c.from.map(DND.UI.strOpt);
      }

      var count = c.count || 1;
      for (var i = 0; i < count; i++) {
        (function (idx) {
          var key = count > 1 ? c.id + '_' + idx : c.id;
          var cur = state.raceChoices[key] || '';
          var others = [];
          for (var j = 0; j < count; j++) {
            if (j === idx) continue;
            var v = state.raceChoices[count > 1 ? c.id + '_' + j : c.id];
            if (v) others.push(v);
          }
          var opts = options.map(function (o) {
            if (o.group) return o;
            return { value: o.value, label: o.label, disabled: o.disabled || others.indexOf(o.value) !== -1 };
          });
          box.appendChild(field(c.label + (count > 1 ? ' ' + (idx + 1) : ''), select({
            value: cur, options: opts,
            onchange: function (v) {
              update(function () {
                state.raceChoices[key] = v;
                if (count > 1) {
                  var all = [];
                  for (var k = 0; k < count; k++) {
                    var vv = state.raceChoices[c.id + '_' + k];
                    if (vv) all.push(vv);
                  }
                  state.raceChoices[c.id] = all;
                }
              });
            }
          })));
        })(i);
      }
    });
  }

  function renderRaceLanguages(box, race) {
    [race, computed.subrace].forEach(function (src) {
      if (!src || !src.languages || !src.languages.choose) return;
      var known = computed.languages.map(function (l) { return l.value; });
      for (var i = 0; i < src.languages.choose; i++) {
        (function (idx) {
          var key = '__lang_' + src.id + '_' + idx;
          var cur = state.raceChoices[key] || '';
          box.appendChild(field('Extra language', select({
            value: cur,
            options: DND.UI.languageOptions(known.filter(function (k) { return k !== cur; })),
            onchange: function (v) { update(function () { state.raceChoices[key] = v; }); }
          })));
        })(i);
      }
    });
  }

  function renderOriginSwaps(box, race) {
    var wrap = el('div', {});
    wrap.appendChild(el('span', { class: 'field-label', text: 'Swap racial languages and proficiencies' }));
    wrap.appendChild(el('p', { class: 'field-hint', text: 'Skills swap for skills. Armor and martial weapons swap for any weapon or tool. Simple weapons and tools swap for a simple weapon or tool.' }));

    var fixedLangs = [];
    [race, computed.subrace].forEach(function (src) {
      if (src && src.languages && src.languages.fixed) {
        src.languages.fixed.forEach(function (l) { fixedLangs.push(l); });
      }
    });
    var row = el('div', { class: 'row' });
    fixedLangs.forEach(function (l) {
      row.appendChild(field(DND.Engine.prettyName(l), select({
        placeholder: false,
        value: state.originLanguages[l] || l,
        options: DND.LANGUAGES.filter(function (x) { return x.swap; })
          .map(function (x) { return { value: x.id, label: x.name }; }),
        onchange: function (v) { update(function () { state.originLanguages[l] = v; }); }
      })));
    });
    if (row.children.length) wrap.appendChild(row);

    var swappable = [], seenSwap = {};
    function collect(list) {
      list.forEach(function (entry) {
        var fromRace = entry.source === (race && race.name) ||
          (computed.subrace && entry.source === computed.subrace.name);
        if (!fromRace) return;
        var orig = entry.swappedFrom || entry.value;
        if (seenSwap[orig]) return;
        seenSwap[orig] = true;
        swappable.push({ value: orig, kind: DND.Engine.categoryOf(orig) });
      });
    }
    collect(computed.armor);
    collect(computed.weapons);
    collect(computed.tools);
    collect(computed.skills.filter(function (s) { return s.prof; })
      .map(function (s) { return { value: s.id, source: s.source }; }));

    var prow = el('div', { class: 'row' });
    swappable.forEach(function (item) {
      var options;
      if (item.kind === 'skill') options = DND.UI.skillOptions();
      else if (item.kind === 'armor' || item.kind === 'weapon') {
        options = [
          { group: 'Simple weapons', options: DND.SIMPLE_WEAPONS.map(DND.UI.strOpt) },
          { group: 'Martial weapons', options: DND.MARTIAL_WEAPONS.map(DND.UI.strOpt) }
        ].concat(DND.UI.toolOptions('all'));
      } else {
        options = [{ group: 'Simple weapons', options: DND.SIMPLE_WEAPONS.map(DND.UI.strOpt) }]
          .concat(DND.UI.toolOptions('all'));
      }
      prow.appendChild(field(DND.Engine.prettyName(item.value), select({
        placeholder: false,
        value: state.originSwaps[item.value] || item.value,
        options: [{ value: item.value, label: DND.Engine.prettyName(item.value) + ' (keep)' }].concat(options),
        onchange: function (v) { update(function () { state.originSwaps[item.value] = v; }); }
      })));
    });
    if (prow.children.length) wrap.appendChild(prow);

    box.appendChild(wrap);
  }

  /* ============================================================
     5. Background
     ============================================================ */
  function renderBackground() {
    var box = mount.background;
    clear(box);

    var groups = [{ group: "Player's Handbook",
      options: DND.BACKGROUNDS.map(function (b) { return { value: b.id, label: b.name }; }) }];
    if (state.options.customBackground) {
      groups.push({ group: 'Optional', options: [{ value: 'custom', label: 'Custom background' }] });
    }

    box.appendChild(field('Background', select({
      value: state.backgroundId, options: groups,
      onchange: function (v) {
        update(function () {
          state.backgroundId = v;
          state.backgroundVariantId = '';
          state.backgroundChoices = {};
          state.customBackgroundSkills = [];
          state.customBackgroundExtras = [];
        });
      }
    })));

    var bg = computed.background;
    if (!bg) return;

    var nested = el('div', { class: 'nested' });
    if (bg.id === 'custom') {
      renderCustomBackground(nested);
      box.appendChild(nested);
      return;
    }

    if (bg.variants && bg.variants.length) {
      nested.appendChild(field('Variant', select({
        placeholder: 'Standard', value: state.backgroundVariantId,
        options: bg.variants.map(function (v) { return { value: v.id, label: v.name }; }),
        onchange: function (v) { update(function () { state.backgroundVariantId = v; }); }
      })));
      var chosen = bg.variants.filter(function (v) { return v.id === state.backgroundVariantId; })[0];
      if (chosen) nested.appendChild(el('p', { class: 'field-hint', text: chosen.note }));
    }

    (bg.toolChoices || []).forEach(function (c) {
      nested.appendChild(field(c.label, select({
        value: state.backgroundChoices[c.id] || '',
        options: DND.UI.toolOptions(c.from),
        onchange: function (v) { update(function () { state.backgroundChoices[c.id] = v; }); }
      })));
    });

    if (bg.languages && bg.languages.choose) {
      var known = computed.languages.map(function (l) { return l.value; });
      for (var i = 0; i < bg.languages.choose; i++) {
        (function (idx) {
          var cur = state.backgroundChoices['lang' + idx] || '';
          nested.appendChild(field('Language', select({
            value: cur,
            options: DND.UI.languageOptions(known.filter(function (k) { return k !== cur; })),
            onchange: function (v) { update(function () { state.backgroundChoices['lang' + idx] = v; }); }
          })));
        })(i);
      }
    }

    var list = el('ul', { class: 'trait-list' });
    list.appendChild(el('li', {}, [el('strong', { text: 'Skills. ' }),
      el('span', { text: bg.skills.map(DND.Engine.prettyName).join(', ') })]));
    list.appendChild(el('li', {}, [el('strong', { text: bg.feature.name + '. ' }),
      el('span', { text: bg.feature.text })]));
    list.appendChild(el('li', {}, [el('strong', { text: 'Equipment. ' }),
      el('span', { text: bg.equipment })]));
    nested.appendChild(list);

    box.appendChild(nested);
  }

  function renderCustomBackground(box) {
    box.appendChild(el('p', { class: 'field-hint', text: 'Choose any two skills, then any two tool proficiencies or languages in total. Work out the feature and equipment with your DM.' }));

    var row = el('div', { class: 'row' });
    for (var i = 0; i < 2; i++) {
      (function (idx) {
        var other = state.customBackgroundSkills[1 - idx];
        row.appendChild(field('Skill ' + (idx + 1), select({
          value: state.customBackgroundSkills[idx] || '',
          options: DND.UI.skillOptions(other ? [other] : []),
          onchange: function (v) { update(function () { state.customBackgroundSkills[idx] = v; }); }
        })));
      })(i);
    }
    box.appendChild(row);

    var row2 = el('div', { class: 'row' });
    for (var j = 0; j < 2; j++) {
      (function (idx) {
        var langs = DND.LANGUAGES.filter(function (l) { return l.type !== 'secret'; })
          .map(function (l) { return { value: 'lang:' + l.id, label: l.name }; });
        row2.appendChild(field('Tool or language ' + (idx + 1), select({
          value: state.customBackgroundExtras[idx] || '',
          options: DND.UI.toolOptions('all').concat([{ group: 'Languages', options: langs }]),
          onchange: function (v) { update(function () { state.customBackgroundExtras[idx] = v; }); }
        })));
      })(j);
    }
    box.appendChild(row2);
  }

  /* ============================================================
     6. Class and level
     ============================================================ */
  function renderClass() {
    var box = mount.class;
    clear(box);

    state.classes.forEach(function (entry, idx) {
      box.appendChild(renderClassEntry(entry, idx));
    });

    if (state.options.multiclass && state.classes.length < 4 && computed.level < 20) {
      box.appendChild(el('button', {
        class: 'btn', type: 'button', text: 'Add another class',
        onclick: function () {
          update(function () {
            state.classes.push({ classId: '', subclassId: '', level: 1, skills: [], tools: {}, expertise: [], choices: {}, optionalFeatures: [], spells: blankSpells() });
          });
        }
      }));
    }

    renderHitPoints(box);
  }

  function renderClassEntry(entry, idx) {
    var wrap = el('div', { class: 'class-block' });
    var isFirst = idx === 0;

    var head = el('div', { class: 'class-head' }, [
      el('span', { class: 'field-label', text: isFirst ? 'Class' : 'Additional class' })
    ]);
    if (!isFirst) {
      head.appendChild(el('button', {
        class: 'btn-quiet', type: 'button', text: 'Remove',
        onclick: function () {
          update(function () {
            var removed = state.classes.splice(idx, 1)[0];
            Object.keys(state.asiSlots).forEach(function (k) {
              if (k.indexOf(removed.classId + ':') === 0) delete state.asiSlots[k];
            });
          });
        }
      }));
    }
    wrap.appendChild(head);

    var takenIds = state.classes.map(function (c, i) { return i === idx ? null : c.classId; }).filter(Boolean);
    var options = DND.CLASSES.map(function (cls) {
      var o = { value: cls.id, label: cls.name };
      if (takenIds.indexOf(cls.id) !== -1) { o.disabled = true; o.label = cls.name + ' \u2014 already taken'; }
      else if (!isFirst) {
        var chk = DND.Engine.multiclassCheck(cls, computed, false);
        if (!chk.ok) { o.disabled = true; o.label = cls.name + ' \u2014 needs ' + chk.reasons.join(', '); }
      }
      return o;
    });

    var maxLevel = 20 - (computed.level - (parseInt(entry.level, 10) || 0));
    var levelOpts = [];
    for (var i = 1; i <= Math.max(1, maxLevel); i++) levelOpts.push({ value: String(i), label: 'Level ' + i });

    var row = el('div', { class: 'row' });
    row.appendChild(field('Class', select({
      value: entry.classId, options: options,
      onchange: function (v) {
        update(function () {
          Object.keys(state.asiSlots).forEach(function (k) {
            if (k.indexOf(entry.classId + ':') === 0) delete state.asiSlots[k];
          });
          entry.classId = v; entry.subclassId = '';
          entry.skills = []; entry.tools = {}; entry.expertise = [];
          entry.choices = {}; entry.optionalFeatures = []; entry.spells = blankSpells();
        });
      }
    })));
    row.appendChild(field('Levels in this class', select({
      placeholder: false, value: String(entry.level), options: levelOpts,
      onchange: function (v) { update(function () { entry.level = parseInt(v, 10); }); }
    })));
    wrap.appendChild(row);

    var cls = DND.findClass(entry.classId);
    if (!cls) return wrap;

    var info = computed.classes.filter(function (c) { return c.id === cls.id; })[0];
    var nested = el('div', { class: 'nested' });

    /* headline facts */
    nested.appendChild(el('p', { class: 'field-hint',
      text: 'Hit die d' + cls.hitDie +
        (isFirst ? '  \u00b7  Saving throws: ' + cls.saves.map(DND.UI.abbr).join(' and ') : '  \u00b7  Multiclass: no saving throw proficiencies') +
        (cls.subclass ? '  \u00b7  ' + cls.subclass.label + ' at level ' + cls.subclass.level : '') }));

    /* class table columns */
    if (info && info.columns.length) {
      var tbl = el('div', { class: 'class-table' });
      info.columns.forEach(function (col) {
        tbl.appendChild(el('div', { class: 'class-stat' }, [
          el('span', { class: 'cs-label', text: col.label }),
          el('span', { class: 'cs-value', text: String(col.value) })
        ]));
      });
      nested.appendChild(tbl);
    }

    renderClassSkills(nested, cls, entry, isFirst);
    renderClassTools(nested, cls, entry, isFirst);
    renderClassExpertise(nested, cls, entry);
    renderFeatureChoices(nested, cls, entry);
    if (state.options.optionalClassFeatures) renderOptionalFeatures(nested, cls, entry);
    renderSubclass(nested, cls, entry, info);
    renderFeatureList(nested, cls, entry, info);
    renderSpells(nested, cls, entry);

    wrap.appendChild(nested);
    return wrap;
  }

  function renderClassSkills(box, cls, entry, isFirst) {
    var def = isFirst ? cls.skills : (cls.multiclass && cls.multiclass.skills);
    if (!def) return;

    var pool = def.from === 'all' ? DND.SKILLS.map(function (s) { return s.id; }) : def.from;
    var elsewhere = computed.skills.filter(function (s) {
      return s.prof && (entry.skills || []).indexOf(s.id) === -1;
    }).map(function (s) { return s.id; });

    var row = el('div', { class: 'row' });
    for (var i = 0; i < def.count; i++) {
      (function (idx) {
        var cur = (entry.skills || [])[idx] || '';
        var others = (entry.skills || []).filter(function (v, j) { return j !== idx && v; });
        var opts = DND.SKILLS.filter(function (s) { return pool.indexOf(s.id) !== -1; })
          .map(function (s) {
            var clash = others.indexOf(s.id) !== -1 || elsewhere.indexOf(s.id) !== -1;
            return {
              value: s.id,
              label: s.name + (clash && s.id !== cur ? ' \u2014 already proficient' : ''),
              disabled: clash && s.id !== cur
            };
          });
        row.appendChild(field('Skill ' + (idx + 1), select({
          value: cur, options: opts,
          onchange: function (v) {
            update(function () {
              entry.skills = entry.skills || [];
              entry.skills[idx] = v;
            });
          }
        })));
      })(i);
    }
    box.appendChild(row);
  }

  function renderClassTools(box, cls, entry, isFirst) {
    var defs = (isFirst ? cls.toolChoices : (cls.multiclass && cls.multiclass.toolChoices)) || [];
    if (cls.tools && cls.tools.length && isFirst) {
      box.appendChild(el('p', { class: 'field-hint', text: 'Tool proficiencies: ' + cls.tools.join(', ') }));
    }
    defs.forEach(function (def) {
      var row = el('div', { class: 'row' });
      for (var i = 0; i < def.count; i++) {
        (function (idx) {
          var key = def.id + '_' + idx;
          var from = def.from === 'artisanOrInstrument'
            ? DND.TOOLS.artisan.items.concat(DND.TOOLS.instrument.items)
            : def.from;
          box.appendChild(field(def.label + (def.count > 1 ? ' ' + (idx + 1) : ''), select({
            value: (entry.tools || {})[key] || '',
            options: DND.UI.toolOptions(from),
            onchange: function (v) {
              update(function () {
                entry.tools = entry.tools || {};
                entry.tools[key] = v;
              });
            }
          })));
        })(i);
      }
      if (row.children.length) box.appendChild(row);
    });
  }

  function renderClassExpertise(box, cls, entry) {
    var slots = DND.Engine.expertiseSlots(cls, Math.max(1, parseInt(entry.level, 10) || 1));
    if (!slots.length) return;

    var proficient = computed.skills.filter(function (s) { return s.prof; });
    var row = el('div', { class: 'row' });

    slots.forEach(function (slot, si) {
      for (var i = 0; i < slot.count; i++) {
        (function (flat) {
          var cur = (entry.expertise || [])[flat] || '';
          var others = (entry.expertise || []).filter(function (v, j) { return j !== flat && v; });
          var opts = proficient.map(function (s) {
            return { value: s.id, label: s.name, disabled: others.indexOf(s.id) !== -1 };
          });
          if (slot.allowThievesTools) opts.push({ value: "Thieves' tools", label: "Thieves' tools" });
          row.appendChild(field('Expertise ' + (flat + 1), select({
            value: cur, options: opts,
            onchange: function (v) {
              update(function () {
                entry.expertise = entry.expertise || [];
                entry.expertise[flat] = v;
              });
            }
          }), proficient.length ? null : 'Pick your skill proficiencies first.'));
        })(si * 2 + i);
      }
    });
    box.appendChild(row);
  }

  /* Fighting styles, metamagic, invocations, infusions, pact boons, ranger picks. */
  function renderFeatureChoices(box, cls, entry) {
    var ce = { cls: cls, entry: entry, level: Math.max(1, parseInt(entry.level, 10) || 1) };
    DND.Engine.featureChoices(ce).forEach(function (fc) {
      var def = fc.def, count = fc.count;
      if (!count) return;

      renderOneChoice(box, def, count, cls, entry, null);
    });
  }

  function renderOneChoice(box, def, count, cls, entry, sub) {
    {
      var ce = { cls: cls, entry: entry, level: Math.max(1, parseInt(entry.level, 10) || 1) };
      var opts = optionsForChoice(def, cls, entry, ce.level);
      if (count === 1) {
        box.appendChild(field(def.label, select({
          value: normalizeSingle(entry.choices[def.id]),
          options: opts.map(function (o) { return o; }),
          onchange: function (v) {
            update(function () {
              entry.choices[def.id] = v;
              delete entry.choices[def.id + 'Maneuver'];
            });
          }
        }), noteForChoice(def, entry.choices[def.id])));
        renderGrantedManeuver(box, def, entry);
        return;
      }

      var chosen = Array.isArray(entry.choices[def.id]) ? entry.choices[def.id].slice() : [];
      var wrap = el('div', { class: 'pick-list' });
      wrap.appendChild(el('span', { class: 'field-label', text: def.label + ' \u2014 ' + count + ' known' }));

      for (var i = 0; i < count; i++) {
        (function (idx) {
          var cur = chosen[idx] || '';
          var others = chosen.filter(function (v, j) { return j !== idx && v; });
          var list = opts.map(function (o) {
            if (o.group) return o;
            var repeatable = o.repeatable;
            return {
              value: o.value, label: o.label,
              disabled: o.disabled || (!repeatable && others.indexOf(o.value) !== -1 && o.value !== cur)
            };
          });
          wrap.appendChild(field(String(idx + 1), select({
            value: cur, options: list,
            onchange: function (v) {
              update(function () {
                var arr = Array.isArray(entry.choices[def.id]) ? entry.choices[def.id].slice() : [];
                arr[idx] = v;
                entry.choices[def.id] = arr;
              });
            }
          }), noteForChoice(def, cur)));
        })(i);
      }
      box.appendChild(wrap);
    }
  }

  function normalizeSingle(v) { return Array.isArray(v) ? (v[0] || '') : (v || ''); }

  /* Superior Technique hands you a maneuver along with the fighting style. */
  function renderGrantedManeuver(box, def, entry) {
    if (def.type !== 'fightingStyle') return;
    var style = DND.findOption(DND.FIGHTING_STYLES, normalizeSingle(entry.choices[def.id]));
    if (!style || !style.grantsManeuvers) return;
    var key = def.id + 'Maneuver';
    box.appendChild(field('Maneuver', select({
      value: entry.choices[key] || '',
      options: DND.MANEUVERS
        .filter(function (m) { return state.options.optionalClassFeatures || !m.optional; })
        .map(function (m) { return { value: m.id, label: m.name }; }),
      onchange: function (v) { update(function () { entry.choices[key] = v; }); }
    }), 'One superiority die (d6), regained on a short rest.'));
  }

  function optionsForChoice(def, cls, entry, classLevel) {
    var showOptional = state.options.optionalClassFeatures;

    if (def.type === 'fightingStyle') {
      return DND.FIGHTING_STYLES
        .filter(function (s) { return s.classes.indexOf(cls.id) !== -1; })
        .filter(function (s) { return showOptional || !s.optional; })
        .map(function (s) { return { value: s.id, label: s.name }; });
    }
    if (def.type === 'metamagic') {
      return DND.METAMAGIC
        .filter(function (m) { return showOptional || !m.optional; })
        .map(function (m) { return { value: m.id, label: m.name }; });
    }
    if (def.type === 'pactBoon') {
      return DND.PACT_BOONS
        .filter(function (b) { return showOptional || !b.optional; })
        .map(function (b) { return { value: b.id, label: b.name }; });
    }
    if (def.type === 'invocation') {
      var boon = normalizeSingle(entry.choices.pactBoon);
      return DND.INVOCATIONS
        .filter(function (inv) { return showOptional || !inv.optional; })
        .map(function (inv) {
          var blocked = [];
          if (inv.level && classLevel < inv.level) blocked.push('level ' + inv.level);
          if (inv.boon && inv.boon !== boon) {
            var b = DND.findOption(DND.PACT_BOONS, inv.boon);
            blocked.push(b ? b.name : inv.boon);
          }
          return {
            value: inv.id,
            label: inv.name + (blocked.length ? ' \u2014 needs ' + blocked.join(', ') : (inv.needs ? ' \u2020' : '')),
            disabled: blocked.length > 0,
            title: inv.needs ? 'Requires ' + inv.needs : null
          };
        });
    }
    if (def.type === 'infusion') {
      return DND.INFUSIONS.map(function (inf) {
        var blocked = inf.level && classLevel < inf.level;
        return {
          value: inf.id,
          label: inf.name + (blocked ? ' \u2014 needs level ' + inf.level : ''),
          disabled: blocked, repeatable: !!inf.repeatable
        };
      });
    }
    if (def.type === 'maneuver') {
      return DND.MANEUVERS
        .filter(function (m) { return showOptional || !m.optional; })
        .map(function (m) { return { value: m.id, label: m.name }; });
    }
    if (def.type === 'discipline') {
      return DND.DISCIPLINES.map(function (d) {
        var blocked = d.level > classLevel;
        return { value: d.id, label: d.name + (blocked ? ' \u2014 needs level ' + d.level : ''),
                 disabled: blocked };
      });
    }
    if (def.type === 'list') return def.from.map(DND.UI.strOpt);
    if (def.type === 'arcaneShot') return DND.ARCANE_SHOTS.map(function (a) {
      return { value: a.id, label: a.name };
    });
    if (def.type === 'rune') {
      return DND.RUNES.map(function (r) {
        var blocked = r.level && classLevel < r.level;
        return { value: r.id, label: r.name + (blocked ? ' \u2014 needs level ' + r.level : ''),
                 disabled: !!blocked };
      });
    }
    if (def.type === 'weapon') {
      return [{ group: 'Simple', options: DND.SIMPLE_WEAPONS.map(DND.UI.strOpt) },
              { group: 'Martial', options: DND.MARTIAL_WEAPONS.map(DND.UI.strOpt) }];
    }
    if (def.type === 'language') {
      var known = computed.languages.map(function (l) { return l.value; });
      return DND.UI.languageOptions(known);
    }
    if (def.type === 'spellFromList') {
      return DND.spellsForClass(def.list, state.options.books, [])
        .filter(function (id) { return DND.SPELLS[id].level === def.spellLevel; })
        .map(function (id) { return { value: String(id), label: DND.SPELLS[id].name }; });
    }
    if (def.type === 'favoredEnemy') return DND.FAVORED_ENEMIES.map(DND.UI.strOpt);
    if (def.type === 'terrain') return DND.FAVORED_TERRAINS.map(DND.UI.strOpt);
    if (def.type === 'proficientSkill') {
      return computed.skills.filter(function (s) { return s.prof; })
        .map(function (s) { return { value: s.id, label: s.name }; });
    }
    if (def.type === 'skill') {
      var pool = def.from === 'all' ? DND.SKILLS.map(function (s) { return s.id; }) : def.from;
      return DND.SKILLS.filter(function (s) { return pool.indexOf(s.id) !== -1; })
        .map(function (s) { return { value: s.id, label: s.name }; });
    }
    return (def.from || []).map(DND.UI.strOpt);
  }

  function noteForChoice(def, value) {
    if (!value) return null;
    var lists = {
      fightingStyle: DND.FIGHTING_STYLES, metamagic: DND.METAMAGIC,
      invocation: DND.INVOCATIONS, infusion: DND.INFUSIONS,
      pactBoon: DND.PACT_BOONS, discipline: DND.DISCIPLINES,
      arcaneShot: DND.ARCANE_SHOTS, rune: DND.RUNES
    };
    var list = lists[def.type];
    if (!list) return null;
    var found = DND.findOption(list, value);
    return found && found.note ? found.note : null;
  }

  function renderOptionalFeatures(box, cls, entry) {
    var available = DND.optionalFeaturesFor(cls.id, Math.max(1, parseInt(entry.level, 10) || 1));
    if (!available.length) return;

    var wrap = el('div', { class: 'optional-block' });
    wrap.appendChild(el('span', { class: 'field-label', text: 'Optional class features' }));
    available.forEach(function (opt) {
      wrap.appendChild(DND.UI.toggle({
        label: opt.name, source: opt.source,
        description: opt.note + (opt.replaces ? ' Replaces ' + opt.replaces + '.' : ''),
        checked: (entry.optionalFeatures || []).indexOf(opt.name) !== -1,
        onchange: function (v) {
          update(function () {
            entry.optionalFeatures = entry.optionalFeatures || [];
            var i = entry.optionalFeatures.indexOf(opt.name);
            if (v && i === -1) entry.optionalFeatures.push(opt.name);
            if (!v && i !== -1) entry.optionalFeatures.splice(i, 1);
          });
        }
      }));
    });
    box.appendChild(wrap);
  }

  function renderSubclass(box, cls, entry, info) {
    if (!cls.subclass) return;
    var due = entry.level >= cls.subclass.level;
    var options = DND.subclassesFor(cls.id);
    if (!options.length) return;

    var wrap = el('div', { class: 'subclass-block' });
    wrap.appendChild(el('span', { class: 'field-label', text: cls.subclass.label }));

    if (!due) {
      wrap.appendChild(el('p', { class: 'field-hint',
        text: 'Chosen at ' + cls.name + ' level ' + cls.subclass.level + '.' }));
      box.appendChild(wrap);
      return;
    }

    var groups = {};
    options.forEach(function (sub) {
      var book = sub.source.split(' ')[0];
      (groups[book] = groups[book] || []).push({ value: sub.id, label: sub.name });
    });
    var opts = Object.keys(groups).length > 1
      ? Object.keys(groups).map(function (b) { return { group: b, options: groups[b] }; })
      : groups[Object.keys(groups)[0]];

    wrap.appendChild(select({
      value: entry.subclassId || '', options: opts,
      onchange: function (v) {
        update(function () {
          var old = DND.findSubclass(entry.subclassId);
          if (old) clearSubclassChoices(entry, old);
          entry.subclassId = v;
        });
      }
    }));

    var sub = DND.findSubclass(entry.subclassId);
    if (!sub) { box.appendChild(wrap); return; }

    wrap.appendChild(el('p', { class: 'field-hint source-line', text: sub.source }));

    var subInfo = info && info.subclass;
    if (subInfo && subInfo.columns.length) {
      var tbl = el('div', { class: 'class-table' });
      subInfo.columns.forEach(function (col) {
        tbl.appendChild(el('div', { class: 'class-stat' }, [
          el('span', { class: 'cs-label', text: col.label }),
          el('span', { class: 'cs-value', text: String(col.value) })
        ]));
      });
      wrap.appendChild(tbl);
    }

    if (sub.skills) renderSubclassSkills(wrap, sub, entry);
    renderSubFeatureChoices(wrap, cls, sub, entry);

    if (subInfo && subInfo.features.length) {
      var list = el('ul', { class: 'trait-list' });
      subInfo.features.forEach(function (f) {
        list.appendChild(el('li', {}, [
          el('span', { class: 'feat-level', text: String(f.level) }),
          el('strong', { text: f.name + '. ' }),
          el('span', { text: f.text })
        ]));
      });
      wrap.appendChild(list);
    }

    if (subInfo && subInfo.spells.length) {
      wrap.appendChild(el('p', { class: 'field-hint', text: subInfo.spellsNote }));
      var tags = el('div', { class: 'tag-list', text: subInfo.spells.map(function (id) {
        return DND.SPELLS[id].name;
      }).sort().join(', ') });
      wrap.appendChild(tags);
    }

    box.appendChild(wrap);
  }

  function clearSubclassChoices(entry, sub) {
    (sub.features || []).forEach(function (f) {
      ['choice', 'choice2'].forEach(function (k) {
        if (f[k]) delete entry.choices[f[k].id];
      });
    });
    delete entry.choices.subSkills;
  }

  function renderSubclassSkills(box, sub, entry) {
    var def = sub.skills;
    var have = entry.choices.subSkills || [];
    var elsewhere = computed.skills.filter(function (s) {
      return s.prof && have.indexOf(s.id) === -1;
    }).map(function (s) { return s.id; });

    var row = el('div', { class: 'row' });
    for (var i = 0; i < def.count; i++) {
      (function (idx) {
        var cur = have[idx] || '';
        var others = have.filter(function (v, j) { return j !== idx && v; });
        var pool = def.from === 'all' ? DND.SKILLS.map(function (s) { return s.id; }) : def.from;
        var opts = DND.SKILLS.filter(function (s) { return pool.indexOf(s.id) !== -1; })
          .map(function (s) {
            var clash = others.indexOf(s.id) !== -1 || elsewhere.indexOf(s.id) !== -1;
            return { value: s.id, label: s.name + (clash && s.id !== cur ? ' \u2014 already proficient' : ''),
                     disabled: clash && s.id !== cur };
          });
        row.appendChild(field('Skill ' + (idx + 1), select({
          value: cur, options: opts,
          onchange: function (v) {
            update(function () {
              entry.choices.subSkills = entry.choices.subSkills || [];
              entry.choices.subSkills[idx] = v;
            });
          }
        })));
      })(i);
    }
    box.appendChild(row);
  }

  function renderSubFeatureChoices(box, cls, sub, entry) {
    (sub.features || []).filter(function (f) { return f.level <= entry.level; })
      .forEach(function (f) {
        ['choice', 'choice2'].forEach(function (ck) {
          var def = f[ck];
          if (!def) return;
          var count = def.count;
          if (def.countColumn) count = DND.subColumnValue(sub, def.countColumn, entry.level) || 0;
          if (!count) return;
          renderOneChoice(box, def, count, cls, entry, sub);
        });
      });
  }

  function renderFeatureList(box, cls, entry, info) {
    if (!info || !info.features.length) return;
    var list = el('ul', { class: 'trait-list' });

    info.features.forEach(function (f) {
      list.appendChild(el('li', {}, [
        el('span', { class: 'feat-level', text: String(f.level) }),
        el('strong', { text: f.name + '. ' }),
        el('span', { text: f.text })
      ]));
    });

    (info.optionalFeatures || []).forEach(function (f) {
      list.appendChild(el('li', {}, [
        el('span', { class: 'feat-level', text: String(f.level) }),
        el('strong', { text: f.name + '. ' }),
        el('span', { text: f.note }),
        el('em', { class: 'source-tag', text: f.source })
      ]));
    });

    box.appendChild(list);

    if (info.subclassDue) {
      box.appendChild(el('p', { class: 'field-hint subclass-note',
        text: 'Your ' + info.subclassLabel + ' is due at level ' + info.subclassLevel +
          '. Archetype lists arrive in the next build — choose yours from the book for now.' }));
    }
  }

  function blankSpells() { return { cantrips: [], known: [], book: [], secrets: [], arcanum: {} }; }

  /* ---------- spell selection ---------- */
  function renderSpells(box, cls, entry) {
    /* A subclass can be the source of spellcasting, so do not gate on the base class. */
    if (!computed.spellcasting) return;
    var p = computed.spellcasting.perClass.filter(function (x) { return x.classId === cls.id; })[0];
    if (!p) return;

    var wrap = el('div', { class: 'spell-block' });
    wrap.appendChild(el('span', { class: 'field-label', text: 'Spells' }));

    if (!p.active) {
      wrap.appendChild(el('p', { class: 'field-hint', text: cls.name + 's gain spellcasting at level 2.' }));
      box.appendChild(wrap);
      return;
    }
    if (p.fromSubclass) {
      wrap.appendChild(el('p', { class: 'field-hint',
        text: 'Granted by ' + p.subName + ', drawn from the wizard list.' }));
    }

    entry.spells = entry.spells || blankSpells();
    var pool = DND.spellsForClass(p.listId || cls.id, state.options.books,
      p.subclassExpanded ? p.subclassSpells : []);
    /* Divine Soul opens the cleric list alongside the sorcerer's. */
    (p.extraLists || []).forEach(function (lid) {
      DND.spellsForClass(lid, state.options.books, []).forEach(function (id) {
        if (pool.indexOf(id) === -1) pool.push(id);
      });
    });

    /* Eldritch Knight and Arcane Trickster are restricted to two schools, with a
       handful of free picks. Default to the restricted list, with a way out. */
    var schoolKey = cls.id + ':anySchool';
    if (p.schools) {
      var freePicks = (p.schoolsFreeAt || []).filter(function (lv) { return p.level >= lv; }).length;
      var showAll = spellFilters[schoolKey] === 'all';
      wrap.appendChild(el('p', { class: 'field-hint',
        text: 'Spells must come from ' + p.schools.join(' and ') + ', except your picks at ' +
          (p.schoolsFreeAt || []).join(', ') + ' \u2014 ' + freePicks +
          ' so far \u2014 which may be from any school.' }));
      wrap.appendChild(el('button', {
        type: 'button', class: 'book-chip', 'aria-pressed': showAll ? 'true' : 'false',
        text: showAll ? 'Showing every school' : 'Show every school',
        onclick: function () {
          spellFilters[schoolKey] = showAll ? '' : 'all';
          update(function () {});
        }
      }));
      if (!showAll) {
        pool = pool.filter(function (id) {
          var sp = DND.SPELLS[id];
          return sp.level === 0 || p.schools.indexOf(sp.school) !== -1;
        });
      }
    }

    var pickers = [];

    if (p.cantrips) {
      pickers.push(spellPicker({
        title: 'Cantrips', limit: p.cantrips, get: function () { return entry.spells.cantrips; },
        pool: function () { return pool; }, minLevel: 0, maxLevel: 0, key: cls.id + ':cantrips',
        siblings: pickers
      }));
    }

    if (p.spellbook) {
      pickers.push(spellPicker({
        title: 'Spellbook', limit: p.bookLimit, get: function () { return entry.spells.book; },
        pool: function () { return pool; }, minLevel: 1, maxLevel: p.maxSpellLevel,
        key: cls.id + ':book', siblings: pickers,
        note: 'Six spells at 1st level, and two more each time you gain a wizard level. Anything you find and copy in play is on top of these.',
        onRemove: function (id) {
          var prep = entry.spells.known, i = prep.indexOf(id);
          if (i !== -1) prep.splice(i, 1);
        }
      }));
      pickers.push(spellPicker({
        title: 'Prepared', limit: p.limit, get: function () { return entry.spells.known; },
        pool: function () { return entry.spells.book; }, minLevel: 1, maxLevel: p.maxSpellLevel,
        key: cls.id + ':prep', siblings: pickers,
        note: 'Chosen from your spellbook. You may swap these after a long rest.',
        empty: 'Copy some spells into your spellbook first.'
      }));
    } else if (p.limit) {
      pickers.push(spellPicker({
        title: p.limitLabel === 'prepared' ? 'Prepared' : 'Spells known',
        limit: p.limit, get: function () { return entry.spells.known; },
        pool: function () { return pool; }, minLevel: 1, maxLevel: p.maxSpellLevel,
        key: cls.id + ':known', siblings: pickers,
        note: p.limitLabel === 'prepared'
          ? 'You may swap these after a long rest.'
          : 'You may replace one when you gain a level in this class.'
      }));
    }

    if (p.subclassSpells && p.subclassSpells.length && !p.subclassExpanded) {
      var grantBox = el('div', { class: 'spell-picker granted' });
      grantBox.appendChild(el('div', { class: 'sp-head' }, [
        el('span', { class: 'sp-title', text: 'Always prepared' }),
        el('span', { class: 'sp-count', text: String(p.subclassSpells.length) })
      ]));
      grantBox.appendChild(el('p', { class: 'field-hint',
        text: 'Granted by your subclass. They do not count against the number you prepare.' }));
      grantBox.appendChild(el('div', { class: 'tag-list',
        text: p.subclassSpells.map(function (id) { return DND.SPELLS[id].name; }).sort().join(', ') }));
      wrap.appendChild(grantBox);
    }

    if (p.secretsLimit) {
      var everything = [];
      Object.keys(DND.SPELL_LISTS).forEach(function (c) {
        DND.spellsForClass(c, state.options.books, []).forEach(function (id) {
          if (everything.indexOf(id) === -1) everything.push(id);
        });
      });
      pickers.push(spellPicker({
        title: 'Magical Secrets', limit: p.secretsLimit, get: function () { return entry.spells.secrets; },
        pool: function () { return everything; }, minLevel: 0, maxLevel: p.maxSpellLevel,
        key: cls.id + ':secrets', siblings: pickers,
        note: 'Any spell from any class list. These count as bard spells for you, and do not count against your spells known.'
      }));
    }

    (p.arcanum || []).forEach(function (a) {
      entry.spells.arcanum = entry.spells.arcanum || {};
      entry.spells.arcanum[a.spellLevel] = entry.spells.arcanum[a.spellLevel] || [];
      pickers.push(spellPicker({
        title: 'Mystic Arcanum \u00b7 ' + DND.ordinal(a.spellLevel),
        limit: 1,
        get: function () { return entry.spells.arcanum[a.spellLevel]; },
        pool: function () { return pool; },
        minLevel: a.spellLevel, maxLevel: a.spellLevel,
        key: cls.id + ':arcanum' + a.spellLevel, siblings: pickers,
        note: 'Cast once per long rest without expending a slot.'
      }));
    });

    pickers.forEach(function (pk) { wrap.appendChild(pk.node); });
    box.appendChild(wrap);
  }

  var spellFilters = {};

  /* A picker mutates its array in state directly and refreshes only itself and
     the sheet. A full re-render would reset the scroll position of the list on
     every single tick, which makes choosing fourteen spells miserable. */
  function spellPicker(opts) {
    var node = el('div', { class: 'spell-picker' });
    var countEl = el('span', { class: 'sp-count' });
    node.appendChild(el('div', { class: 'sp-head' }, [
      el('span', { class: 'sp-title', text: opts.title }), countEl
    ]));
    if (opts.note) node.appendChild(el('p', { class: 'field-hint', text: opts.note }));

    var chipBox = el('div', { class: 'sp-chosen' });
    node.appendChild(chipBox);

    var search = el('input', { type: 'search', value: spellFilters[opts.key] || '',
      placeholder: 'Filter by name, school, or level\u2026' });
    var listBox = el('div', { class: 'sp-list' });
    node.appendChild(search);
    node.appendChild(listBox);
    search.addEventListener('input', function () {
      spellFilters[opts.key] = search.value;
      lastSig = null;
      drawList();
    });

    function available() {
      return opts.pool().filter(function (id) {
        var sp = DND.SPELLS[id];
        return sp && sp.level >= opts.minLevel && sp.level <= opts.maxLevel;
      });
    }

    var items = {};      /* spell id -> {label, checkbox} */
    var lastSig = null;  /* pool signature, so the list is only rebuilt when it changes */

    function toggle(id, on) {
      var arr = opts.get();
      var i = arr.indexOf(id);
      if (on && i === -1) arr.push(id);
      if (!on && i !== -1) {
        arr.splice(i, 1);
        if (opts.onRemove) opts.onRemove(id);
      }
      computed = DND.Engine.build(state);
      (opts.siblings || []).forEach(function (pk) { pk.refresh(); });
      renderSheet();
    }

    function refresh() {
      var chosen = opts.get();
      countEl.textContent = chosen.length + ' / ' + opts.limit;
      countEl.className = 'sp-count' + (chosen.length === opts.limit ? ' done'
        : (chosen.length > opts.limit ? ' over' : ''));

      clear(chipBox);
      chosen.slice().sort(function (a, b) {
        var A = DND.SPELLS[a], B = DND.SPELLS[b];
        return A.level - B.level || A.name.localeCompare(B.name);
      }).forEach(function (id) {
        var sp = DND.SPELLS[id];
        chipBox.appendChild(el('button', {
          type: 'button', class: 'sp-chip', title: 'Remove ' + sp.name,
          text: sp.name + ' \u00b7 ' + (sp.level === 0 ? 'C' : sp.level),
          onclick: function () { toggle(id, false); }
        }));
      });

      var sig = available().join(',');
      if (sig !== lastSig) drawList();
      else syncItems();
    }

    /* Update tick state without touching the DOM structure. */
    function syncItems() {
      var chosen = opts.get();
      var full = chosen.length >= opts.limit;
      Object.keys(items).forEach(function (id) {
        var it = items[id];
        var on = chosen.indexOf(Number(id)) !== -1;
        it.cb.checked = on;
        it.cb.disabled = full && !on;
        it.label.className = 'sp-item' + (on ? ' on' : '') + (full && !on ? ' full' : '');
      });
    }

    function drawList() {
      var top = listBox.scrollTop;
      var chosen = opts.get();
      var avail = available();
      lastSig = avail.join(',');
      items = {};
      clear(listBox);

      if (!avail.length) {
        listBox.appendChild(el('p', { class: 'field-hint', text: opts.empty || 'Nothing available yet.' }));
        return;
      }

      var q = (spellFilters[opts.key] || '').toLowerCase().trim();
      var byLevel = {};
      avail.forEach(function (id) {
        var sp = DND.SPELLS[id];
        if (q) {
          var hay = (sp.name + ' ' + sp.school + ' ' + DND.ordinal(sp.level) + ' ' +
            sp.source + ' ' + sp.castingTime + ' ' + sp.duration).toLowerCase();
          if (hay.indexOf(q) === -1) return;
        }
        (byLevel[sp.level] = byLevel[sp.level] || []).push(sp);
      });

      var levels = Object.keys(byLevel).map(Number).sort(function (a, b) { return a - b; });
      if (!levels.length) {
        listBox.appendChild(el('p', { class: 'field-hint', text: 'Nothing matches that.' }));
        return;
      }

      levels.forEach(function (lv) {
        listBox.appendChild(el('div', { class: 'sp-lvl',
          text: lv === 0 ? 'Cantrips' : DND.ordinal(lv) + ' level' }));
        var grid = el('div', { class: 'sp-grid' });
        byLevel[lv].sort(function (a, b) { return a.name.localeCompare(b.name); }).forEach(function (sp) {
          var on = chosen.indexOf(sp.id) !== -1;
          var full = chosen.length >= opts.limit && !on;
          var marks = [];
          if (sp.concentration) marks.push('C');
          if (sp.ritual) marks.push('R');
          var lbl = el('label', {
            class: 'sp-item' + (on ? ' on' : '') + (full ? ' full' : ''),
            title: sp.school + ' \u00b7 ' + sp.castingTime + ' \u00b7 ' + sp.range +
              ' \u00b7 ' + sp.components + ' \u00b7 ' + sp.duration + ' \u00b7 ' + sp.source +
              (sp.material ? '\nMaterial: ' + sp.material : '')
          });
          var cb = el('input', { type: 'checkbox' });
          cb.checked = on;
          cb.disabled = full;
          cb.addEventListener('change', function () { toggle(sp.id, cb.checked); });
          lbl.appendChild(cb);
          lbl.appendChild(el('span', { class: 'sp-name', text: sp.name }));
          if (marks.length) lbl.appendChild(el('span', { class: 'sp-mark', text: marks.join('') }));
          items[sp.id] = { label: lbl, cb: cb };
          grid.appendChild(lbl);
        });
        listBox.appendChild(grid);
      });
      listBox.scrollTop = top;
    }

    var api = { node: node, refresh: refresh };
    refresh();
    return api;
  }

  function renderHitPoints(box) {
    if (!computed.classes.length) return;

    var wrap = el('div', { class: 'hp-block' });
    wrap.appendChild(el('span', { class: 'field-label', text: 'Hit points' }));

    var bar = el('div', { class: 'method-bar' });
    [{ id: 'average', label: 'Fixed average' }, { id: 'roll', label: 'Roll each level' }, { id: 'manual', label: 'Enter total' }]
      .forEach(function (m) {
        bar.appendChild(el('button', {
          type: 'button', text: m.label,
          'aria-pressed': state.hpMethod === m.id ? 'true' : 'false',
          onclick: function () { update(function () { state.hpMethod = m.id; }); }
        }));
      });
    wrap.appendChild(bar);

    if (state.hpMethod === 'manual') {
      var input = el('input', { type: 'number', min: '1', max: '999',
        value: state.hpManual === null ? '' : String(state.hpManual), placeholder: 'Total hit points' });
      input.addEventListener('change', function () {
        update(function () { state.hpManual = parseInt(input.value, 10) || null; });
      });
      wrap.appendChild(input);
    } else if (state.hpMethod === 'roll') {
      var rollBar = el('div', { class: 'pool' });
      rollBar.appendChild(el('button', {
        class: 'btn', type: 'button', text: 'Roll hit dice',
        onclick: function () {
          update(function () {
            state.hpRolls = {};
            var first = true;
            computed.classes.forEach(function (ci) {
              for (var i = 1; i <= ci.level; i++) {
                if (first) { first = false; continue; }
                state.hpRolls[ci.id + ':' + i] = 1 + Math.floor(Math.random() * ci.hitDie);
              }
            });
          });
        }
      }));
      Object.keys(state.hpRolls).forEach(function (k) {
        rollBar.appendChild(el('span', { class: 'pool-die', text: String(state.hpRolls[k]), title: k }));
      });
      wrap.appendChild(rollBar);
      wrap.appendChild(el('p', { class: 'field-hint', text: 'Your first level always takes the full hit die. Unrolled levels fall back to the average.' }));
    } else {
      wrap.appendChild(el('p', { class: 'field-hint', text: computed.hp.note +
        ' Constitution contributes ' + DND.formatMod(computed.hp.conPerLevel || 0) + ' per level.' }));
    }

    box.appendChild(wrap);
  }

  /* ============================================================
     7. Advancement
     ============================================================ */
  function renderAdvancement() {
    var box = mount.advancement;
    clear(box);

    var slots = computed.asiSlots;
    if (!slots.length) {
      box.appendChild(el('p', { class: 'field-hint', text: 'No Ability Score Improvements yet. Most classes grant the first at level 4; fighters gain extras at 6 and 14, rogues at 10.' }));
    } else {
      box.appendChild(el('p', { class: 'field-hint', text: 'Improvements are counted per class, at the levels that class grants them.' }));
      slots.forEach(function (k) { box.appendChild(renderAsiSlot(k)); });
    }

    var race = computed.race;
    var n = 0;
    if (race && race.grantsFeat) {
      for (var i = 0; i < race.grantsFeat; i++) {
        box.appendChild(renderFeatSlot(n, race.name + ' feat'));
        n++;
      }
    }
    slots.forEach(function (k) {
      var slot = state.asiSlots[k.key];
      if (slot && slot.mode === 'feat') {
        box.appendChild(renderFeatSlot(n, k.className + ' level ' + k.level + ' feat'));
        n++;
      }
    });
  }

  function renderAsiSlot(k) {
    var slot = state.asiSlots[k.key] || {};
    var wrap = el('div', { class: 'asi-slot' });

    wrap.appendChild(el('div', { class: 'asi-slot-head' }, [
      el('span', { class: 'lvl', text: k.className + ' \u00b7 level ' + k.level }),
      el('h4', { text: 'Ability Score Improvement' })
    ]));

    var modeOpts = [{ value: 'asi', label: 'Increase ability scores' }];
    if (state.options.featsEnabled) modeOpts.push({ value: 'feat', label: 'Take a feat instead' });

    wrap.appendChild(field('Choose', select({
      value: slot.mode || '', options: modeOpts,
      onchange: function (v) {
        update(function () {
          state.asiSlots[k.key] = { mode: v };
          if (v === 'asi') {
            state.feats = state.feats.slice(0, DND.Engine.featsOwed(state, computed.race));
          }
        });
      }
    })));

    if (slot.mode === 'asi') {
      var row = el('div', { class: 'row' });
      ['a', 'b'].forEach(function (key) {
        row.appendChild(field(key === 'a' ? 'First +1' : 'Second +1', select({
          value: slot[key] || '', options: DND.UI.abilityOptions(),
          onchange: function (v) {
            update(function () {
              state.asiSlots[k.key] = state.asiSlots[k.key] || { mode: 'asi' };
              state.asiSlots[k.key][key] = v;
            });
          }
        })));
      });
      wrap.appendChild(row);
      wrap.appendChild(el('p', { class: 'field-hint', text: 'Pick the same ability twice for +2, or two different abilities for +1 each.' }));
    }

    return wrap;
  }

  function renderFeatSlot(index, label) {
    var taken = state.feats[index] || {};
    var wrap = el('div', { class: 'feat-slot' });
    wrap.appendChild(el('div', { class: 'feat-slot-head' }, [
      el('span', { class: 'field-label', text: label })
    ]));

    var otherIds = state.feats.filter(function (f, i) { return i !== index; })
      .map(function (f) { return f.featId; });

    var groups = { PHB: [], TCE: [], XGE: [] };
    DND.FEATS.forEach(function (feat) {
      var check = DND.Engine.meetsPrereq(feat, computed);
      var dup = otherIds.indexOf(feat.id) !== -1 && !feat.repeatable;
      var o = { value: feat.id, label: feat.name };
      if (!check.ok) {
        o.disabled = true;
        o.label = feat.name + ' \u2014 needs ' + check.reasons.join(', ');
      } else if (dup) {
        o.disabled = true;
        o.label = feat.name + ' \u2014 already taken';
      } else if (check.unverified.length) {
        o.label = feat.name + ' \u2020';
        o.title = check.unverified.join('; ');
      }
      var key = feat.source.indexOf('TCE') === 0 ? 'TCE' : (feat.source.indexOf('XGE') === 0 ? 'XGE' : 'PHB');
      groups[key].push(o);
    });

    wrap.appendChild(select({
      value: taken.featId || '',
      options: [
        { group: "Player's Handbook", options: groups.PHB },
        { group: "Tasha's Cauldron of Everything", options: groups.TCE },
        { group: "Xanathar's Guide \u2014 racial feats", options: groups.XGE }
      ],
      onchange: function (v) {
        update(function () {
          state.feats[index] = { featId: v, choices: {}, skills: [], tools: [], weapons: [], languages: [], expertise: [] };
        });
      }
    }));

    var feat = DND.findFeat(taken.featId);
    if (!feat) return wrap;

    wrap.appendChild(el('p', { class: 'feat-note' }, [
      el('span', { text: feat.note }),
      el('em', { class: 'source-tag', text: feat.source })
    ]));

    var check = DND.Engine.meetsPrereq(feat, computed);
    if (check.unverified.length) {
      wrap.appendChild(el('p', { class: 'feat-note warn', text: '\u2020 ' + check.unverified.join('; ') + '.' }));
    }

    var body = el('div', { class: 'row' });

    if (feat.asi && feat.asi.choose) {
      body.appendChild(field('Ability increase', select({
        value: taken.asi || '', options: DND.UI.abilityOptions(feat.asi.choose),
        onchange: function (v) { update(function () { state.feats[index].asi = v; }); }
      })));
    }

    (feat.choices || []).forEach(function (c) {
      var options = c.type === 'skill'
        ? DND.UI.skillOptions().filter(function (o) { return c.from === 'all' || c.from.indexOf(o.value) !== -1; })
        : c.from.map(DND.UI.strOpt);
      body.appendChild(field(c.label, select({
        value: (taken.choices && taken.choices[c.id]) || '', options: options,
        onchange: function (v) {
          update(function () {
            state.feats[index].choices = state.feats[index].choices || {};
            state.feats[index].choices[c.id] = v;
          });
        }
      })));
    });

    (feat.toolChoices || []).forEach(function (c) {
      body.appendChild(field(c.label, select({
        value: (taken.choices && taken.choices[c.id]) || '', options: DND.UI.toolOptions(c.from),
        onchange: function (v) {
          update(function () {
            state.feats[index].choices = state.feats[index].choices || {};
            state.feats[index].choices[c.id] = v;
          });
        }
      })));
    });

    var proficientSkills = computed.skills.filter(function (s) { return s.prof; });

    for (var i = 0; i < (feat.skillChoices || 0); i++) {
      (function (idx) {
        body.appendChild(field('Skill proficiency', select({
          value: (taken.skills && taken.skills[idx]) || '',
          options: DND.UI.skillOptions(proficientSkills.map(function (s) { return s.id; })
            .filter(function (id) { return id !== (taken.skills && taken.skills[idx]); })),
          onchange: function (v) {
            update(function () {
              state.feats[index].skills = state.feats[index].skills || [];
              state.feats[index].skills[idx] = v;
            });
          }
        })));
      })(i);
    }

    for (var j = 0; j < (feat.expertiseChoices || 0); j++) {
      (function (idx) {
        body.appendChild(field('Expertise in', select({
          value: (taken.expertise && taken.expertise[idx]) || '',
          options: proficientSkills.map(function (s) { return { value: s.id, label: s.name }; }),
          onchange: function (v) {
            update(function () {
              state.feats[index].expertise = state.feats[index].expertise || [];
              state.feats[index].expertise[idx] = v;
            });
          }
        }), proficientSkills.length ? null : 'Pick a skill proficiency first.'));
      })(j);
    }

    for (var k = 0; k < (feat.languages || 0); k++) {
      (function (idx) {
        var known = computed.languages.map(function (l) { return l.value; });
        var cur = (taken.languages && taken.languages[idx]) || '';
        body.appendChild(field('Language', select({
          value: cur,
          options: DND.UI.languageOptions(known.filter(function (x) { return x !== cur; })),
          onchange: function (v) {
            update(function () {
              state.feats[index].languages = state.feats[index].languages || [];
              state.feats[index].languages[idx] = v;
            });
          }
        })));
      })(k);
    }

    for (var w = 0; w < (feat.weaponChoices || 0); w++) {
      (function (idx) {
        body.appendChild(field('Weapon ' + (idx + 1), select({
          value: (taken.weapons && taken.weapons[idx]) || '',
          options: [
            { group: 'Simple', options: DND.SIMPLE_WEAPONS.map(DND.UI.strOpt) },
            { group: 'Martial', options: DND.MARTIAL_WEAPONS.map(DND.UI.strOpt) }
          ],
          onchange: function (v) {
            update(function () {
              state.feats[index].weapons = state.feats[index].weapons || [];
              state.feats[index].weapons[idx] = v;
            });
          }
        })));
      })(w);
    }

    for (var t = 0; t < (feat.skillOrToolChoices || 0); t++) {
      (function (idx) {
        var cur = (taken.skills && taken.skills[idx]) || (taken.tools && taken.tools[idx]) || '';
        body.appendChild(field('Skill or tool ' + (idx + 1), select({
          value: cur,
          options: [{ group: 'Skills', options: DND.UI.skillOptions() }].concat(DND.UI.toolOptions('all')),
          onchange: function (v) {
            update(function () {
              var f = state.feats[index];
              f.skills = f.skills || []; f.tools = f.tools || [];
              var isSkill = DND.SKILLS.some(function (s) { return s.id === v; });
              f.skills[idx] = isSkill ? v : '';
              f.tools[idx] = isSkill ? '' : v;
            });
          }
        })));
      })(t);
    }

    if (body.children.length) wrap.appendChild(body);
    return wrap;
  }

  /* ============================================================
     Live sheet
     ============================================================ */
  function renderSheet() {
    var box = mount.sheet;
    clear(box);
    var c = computed;

    var descBits = [];
    if (c.race) descBits.push(c.subrace ? c.subrace.name : c.race.name);
    if (c.classes.length) {
      descBits.push(c.classes.map(function (ci) { return ci.name + ' ' + ci.level; }).join(' / '));
    }
    if (c.background) descBits.push(c.background.name);

    box.appendChild(el('div', { class: 'sheet-name' }, [
      el('h3', { text: c.name || 'Unnamed adventurer' }),
      el('p', { text: descBits.length ? descBits.join('  \u00b7  ') : 'Level ' + c.level })
    ]));

    var block = el('div', { class: 'ability-block' });
    DND.ABILITIES.forEach(function (a) {
      var s = c.scores[a.id];
      var boosted = (s.racial + s.feat + s.level + s.classBonus) > 0;
      block.appendChild(el('div', { class: 'ability-cell' + (boosted ? ' boosted' : '') }, [
        el('span', { class: 'abbr', text: a.abbr }),
        el('span', { class: 'score', text: String(s.total) }),
        el('span', { class: 'mod', text: DND.formatMod(s.mod) })
      ]));
    });
    box.appendChild(block);

    var status = el('div', { class: 'status' + (c.pending.length ? '' : ' complete') });
    if (c.pending.length) {
      status.appendChild(el('h4', { text: 'Still to choose' }));
      var ul = el('ul');
      c.pending.slice(0, 8).forEach(function (p) { ul.appendChild(el('li', { text: p })); });
      if (c.pending.length > 8) ul.appendChild(el('li', { text: 'and ' + (c.pending.length - 8) + ' more\u2026' }));
      status.appendChild(ul);
    } else {
      status.appendChild(el('h4', { text: 'Every choice is made.' }));
    }
    box.appendChild(status);

    if (c.warnings.length) {
      var w = el('div', { class: 'sheet-section' });
      var wb = el('div', { class: 'warnings' });
      unique(c.warnings).forEach(function (msg) { wb.appendChild(el('p', { text: msg })); });
      w.appendChild(wb);
      box.appendChild(w);
    }

    /* core */
    var core = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Core' })]);
    if (c.hp.total !== null) {
      core.appendChild(DND.UI.statRow('Hit points', String(c.hp.total)));
      core.appendChild(DND.UI.statRow('Hit dice', c.hp.dice.join(' + ')));
    }
    core.appendChild(DND.UI.statRow('Proficiency bonus', DND.formatMod(c.proficiencyBonus)));
    core.appendChild(DND.UI.statRow('Initiative', DND.formatMod(c.initiative)));
    core.appendChild(DND.UI.statRow('Speed', c.speed + ' ft.'));
    core.appendChild(DND.UI.statRow('Size', c.size));
    core.appendChild(DND.UI.statRow('Creature type', c.creatureType));
    if (c.darkvision) core.appendChild(DND.UI.statRow('Darkvision', c.darkvision + ' ft.'));
    if (c.hpPerLevel) core.appendChild(DND.UI.statRow('Bonus hit points', DND.formatMod(c.hpPerLevel) + ' per level'));
    c.speedNotes.forEach(function (n) { core.appendChild(el('p', { class: 'field-hint', text: n })); });
    box.appendChild(core);

    /* armor class */
    var ac = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Armor class' })]);
    c.acOptions.forEach(function (o) {
      ac.appendChild(DND.UI.statRow(o.label, String(o.value)));
    });
    ac.appendChild(el('p', { class: 'field-hint', text: 'Worn armor is not tracked yet. These are your unarmored figures.' }));
    box.appendChild(ac);

    /* saves */
    var saves = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Saving throws' })]);
    c.saves.forEach(function (s) {
      saves.appendChild(el('div', { class: 'stat-row' + (s.prof ? '' : ' dim'), title: s.source || '' }, [
        el('span', { class: 'lbl' }, [
          el('span', { class: 'prof-dot' + (s.prof ? ' on' : '') }),
          document.createTextNode(s.name)
        ]),
        el('span', { class: 'val', text: DND.formatMod(s.bonus) })
      ]));
    });
    box.appendChild(saves);

    /* skills */
    var sk = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Skills' })]);
    c.skills.forEach(function (s) {
      var cls = 'prof-dot' + (s.expertise ? ' expert' : (s.prof ? ' on' : (s.jack ? ' half' : '')));
      sk.appendChild(el('div', { class: 'stat-row' + (s.prof ? '' : ' dim'), title: s.source || (s.jack ? 'Jack of All Trades' : '') }, [
        el('span', { class: 'lbl' }, [
          el('span', { class: cls }),
          document.createTextNode(s.name)
        ]),
        el('span', { class: 'val', text: DND.formatMod(s.bonus) })
      ]));
    });
    box.appendChild(sk);

    var pass = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Passive scores' })]);
    ['perception', 'investigation', 'insight'].forEach(function (id) {
      var row = c.skills.filter(function (s) { return s.id === id; })[0];
      pass.appendChild(DND.UI.statRow('Passive ' + row.name, String(row.passive)));
    });
    box.appendChild(pass);

    /* spellcasting */
    if (c.spellcasting) box.appendChild(renderSpellSection(c.spellcasting));

    /* class features */
    c.classes.forEach(function (ci) {
      var heading = ci.name + ' ' + ci.level;
      var sec = el('div', { class: 'sheet-section' }, [el('h4', { text: heading })]);
      if (ci.subclass) sec.appendChild(el('div', { class: 'sub-name', text: ci.subclass.name }));
      ci.columns.forEach(function (col) {
        sec.appendChild(DND.UI.statRow(col.label, String(col.value)));
      });
      if (ci.subclass) {
        ci.subclass.columns.forEach(function (col) {
          sec.appendChild(DND.UI.statRow(col.label, String(col.value)));
        });
      }
      ci.picks.forEach(function (p) {
        sec.appendChild(DND.UI.statRow(p.label, p.values.join(', ')));
      });
      var names = ci.features.map(function (f) { return f.name; })
        .concat(ci.subclass ? ci.subclass.features.map(function (f) { return f.name; }) : [])
        .concat(ci.optionalFeatures.map(function (f) { return f.name; }));
      if (names.length) {
        sec.appendChild(el('div', { class: 'tag-list', text: names.join(', ') }));
      }
      box.appendChild(sec);
    });

    box.appendChild(profSection('Armor proficiencies', c.armor));
    box.appendChild(profSection('Weapon proficiencies', c.weapons));
    box.appendChild(profSection('Tools', c.tools));
    box.appendChild(profSection('Languages', c.languages.map(function (l) {
      return { value: DND.Engine.prettyName(l.value) };
    })));

    if (c.ancestry) {
      var anc = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Breath weapon' })]);
      anc.appendChild(DND.UI.statRow('Ancestry', c.ancestry.name));
      anc.appendChild(DND.UI.statRow('Damage', c.ancestry.damage));
      anc.appendChild(DND.UI.statRow('Area', c.ancestry.breath));
      anc.appendChild(DND.UI.statRow('Save DC',
        String(8 + c.scores.con.mod + c.proficiencyBonus) + '  (' + DND.UI.abbr(c.ancestry.save) + ')'));
      box.appendChild(anc);
    }

    if (c.innateSpells.length) {
      var sp = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Racial spellcasting' })]);
      c.innateSpells.forEach(function (s) {
        sp.appendChild(DND.UI.statRow(s.name, s.use + '  \u00b7  ' + DND.UI.abbr(s.ability)));
      });
      box.appendChild(sp);
    }

    if (c.traits.length) {
      var tr = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Racial traits' })]);
      tr.appendChild(el('div', { class: 'tag-list',
        text: c.traits.map(function (t) { return t.name; }).join(', ') }));
      box.appendChild(tr);
    }

    if (state.feats.length) {
      var ft = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Feats' })]);
      state.feats.forEach(function (f) {
        var feat = DND.findFeat(f.featId);
        if (feat) ft.appendChild(DND.UI.statRow(feat.name, feat.source));
      });
      box.appendChild(ft);
    }
  }

  function renderSpellSection(sc) {
    var sec = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Spellcasting' })]);

    sc.perClass.forEach(function (p) {
      if (!p.active) {
        sec.appendChild(DND.UI.statRow(p.className, 'starts at level 2', true));
        return;
      }
      sec.appendChild(el('div', { class: 'cast-block' }, [
        el('div', { class: 'cast-head', text: (p.subName || p.className) + '  \u00b7  ' + DND.UI.abbr(p.ability) }),
        DND.UI.statRow('Save DC', String(p.saveDc)),
        DND.UI.statRow('Spell attack', DND.formatMod(p.attack)),
        p.cantrips ? DND.UI.statRow('Cantrips known', String(p.cantrips)) : null,
        p.known ? DND.UI.statRow('Spells known', String(p.known)) : null,
        p.prepared ? DND.UI.statRow('Spells prepared', String(p.prepared)) : null,
        p.ritual ? DND.UI.statRow('Rituals', 'yes') : null,
        DND.UI.statRow('Focus', p.focus),
        p.maxSpellLevel ? DND.UI.statRow('Highest spell level', DND.ordinal(p.maxSpellLevel)) : null
      ].filter(Boolean)));
      sec.appendChild(spellListRows(p));
    });

    if (sc.slots) {
      var grid = el('div', { class: 'slot-grid' });
      sc.slots.forEach(function (n, i) {
        grid.appendChild(el('div', { class: 'slot-cell' }, [
          el('span', { class: 'slot-level', text: ordinal(i + 1) }),
          el('span', { class: 'slot-count', text: String(n) })
        ]));
      });
      sec.appendChild(el('div', { class: 'slot-wrap' }, [
        el('h4', { text: 'Spell slots' + (sc.combined ? ' \u00b7 combined caster level ' + sc.casterLevel : '') }),
        grid
      ]));
    }

    if (sc.pact) {
      sec.appendChild(el('div', { class: 'slot-wrap' }, [
        el('h4', { text: 'Pact Magic' }),
        DND.UI.statRow('Slots', String(sc.pact.slots) + ' of ' + ordinal(sc.pact.level) + ' level')
      ]));
    }

    return sec;
  }

  /* The chosen spells, grouped by level, for the sheet. */
  function spellListRows(p) {
    var box = el('div', { class: 'sheet-spells' });
    function group(title, ids) {
      if (!ids || !ids.length) return;
      var byLevel = {};
      ids.forEach(function (id) {
        var sp = DND.SPELLS[id];
        if (sp) (byLevel[sp.level] = byLevel[sp.level] || []).push(sp.name);
      });
      box.appendChild(el('div', { class: 'ss-title', text: title }));
      Object.keys(byLevel).map(Number).sort(function (a, b) { return a - b; }).forEach(function (lv) {
        box.appendChild(el('div', { class: 'ss-row' }, [
          el('span', { class: 'ss-lvl', text: lv === 0 ? 'C' : String(lv) }),
          el('span', { class: 'ss-names', text: byLevel[lv].sort().join(', ') })
        ]));
      });
    }
    if (p.subclassSpells && p.subclassSpells.length && !p.subclassExpanded) {
      group('Always prepared', p.subclassSpells);
    }
    group('Cantrips', p.cantripsChosen);
    if (p.spellbook) group('Spellbook', p.bookChosen);
    group(p.limitLabel === 'prepared' ? 'Prepared' : 'Known', p.spellsChosen);
    group('Magical Secrets', p.secretsChosen);
    (p.arcanum || []).forEach(function (a) {
      if (a.chosen.length) group('Mystic Arcanum \u00b7 ' + DND.ordinal(a.spellLevel), a.chosen);
    });
    return box;
  }

  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function profSection(title, list) {
    var sec = el('div', { class: 'sheet-section' }, [el('h4', { text: title })]);
    var body = el('div', { class: 'tag-list' });
    if (!list.length) body.appendChild(el('span', { class: 'none', text: 'None yet' }));
    else body.textContent = list.map(function (x) { return x.value; }).sort().join(', ');
    sec.appendChild(body);
    return sec;
  }

  function unique(arr) {
    var seen = {}, out = [];
    arr.forEach(function (a) { if (!seen[a]) { seen[a] = 1; out.push(a); } });
    return out;
  }

  /* ============================================================
     Save / load
     ============================================================ */
  function saveJson() {
    var blob = new Blob([JSON.stringify({ version: 5, state: state }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (state.name || 'character').replace(/[^\w-]+/g, '-').toLowerCase() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  function loadJson(ev) {
    var file = ev.target.files && ev.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        var loaded = parsed.state || parsed;
        var fresh = DND.Engine.blankState();
        if (loaded.options && !loaded.options.books) loaded.options.books = { PHB: true, XGE: true, TCE: true };
        Object.keys(fresh).forEach(function (k) {
          if (loaded[k] !== undefined) fresh[k] = loaded[k];
        });
        /* version 1 files carried a flat level and no classes */
        if (!Array.isArray(fresh.classes) || !fresh.classes.length) {
          fresh.classes = [{ classId: '', subclassId: '', level: loaded.level || 1, skills: [], tools: {}, expertise: [], choices: {}, optionalFeatures: [], spells: blankSpells() }];
        }
        fresh.classes.forEach(function (c) {
          c.skills = c.skills || []; c.tools = c.tools || {};
          c.expertise = c.expertise || []; c.choices = c.choices || {};
          c.optionalFeatures = c.optionalFeatures || [];
          c.subclassId = c.subclassId || '';
          c.spells = c.spells || blankSpells();
          ['cantrips','known','book','secrets'].forEach(function (b) {
            c.spells[b] = (c.spells[b] || []).filter(function (x) { return typeof x === 'number'; });
          });
          c.spells.arcanum = c.spells.arcanum || {};
          Object.keys(c.spells.arcanum).forEach(function (lv) {
            c.spells.arcanum[lv] = (c.spells.arcanum[lv] || [])
              .filter(function (x) { return typeof x === 'number'; });
          });
        });
        state = fresh;
        render();
      } catch (e) {
        alert('That file could not be read as a saved character.');
      }
      ev.target.value = '';
    };
    reader.readAsText(file);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
