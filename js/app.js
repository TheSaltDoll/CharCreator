/* Builder application. Owns state, renders every section, keeps the sheet live. */
(function () {
  var el = DND.UI.el, clear = DND.UI.clear, field = DND.UI.field, select = DND.UI.select;
  var state = DND.Engine.blankState();
  var computed = null;

  var mount = {};

  function init() {
    ['identity', 'options', 'abilities', 'race', 'background', 'advancement', 'sheet']
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

    var levelSel = select({
      placeholder: false,
      value: String(state.level),
      options: Array.apply(null, Array(20)).map(function (_, i) {
        return { value: String(i + 1), label: 'Level ' + (i + 1) + '  \u00b7  PB ' + DND.formatMod(DND.proficiencyBonus(i + 1)) };
      }),
      onchange: function (v) { update(function () { state.level = parseInt(v, 10); }); }
    });

    box.appendChild(el('div', { class: 'row' }, [
      field('Character name', nameInput),
      field('Character level', levelSel,
        'Proficiency bonus ' + DND.formatMod(computed.proficiencyBonus) +
        '  \u00b7  ' + computed.xp.toLocaleString() + ' XP')
    ]));
  }

  /* ============================================================
     2. Optional rules
     ============================================================ */
  function renderOptions() {
    var box = mount.options;
    clear(box);

    box.appendChild(DND.UI.toggle({
      label: 'Customizing Your Origin',
      source: 'TCE 8',
      description: 'Reassign racial ability increases to any scores, swap racial languages, and trade racial proficiencies.',
      checked: state.options.tashaOrigin,
      onchange: function (v) { update(function () { state.options.tashaOrigin = v; }); }
    }));

    box.appendChild(DND.UI.toggle({
      label: 'Customizing a Background',
      source: 'PHB 125',
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
      label: 'Feats',
      source: 'PHB 165',
      description: 'Trade an Ability Score Improvement for a feat. Required for Variant Human and Custom Lineage.',
      checked: state.options.featsEnabled,
      onchange: function (v) {
        update(function () {
          state.options.featsEnabled = v;
          if (!v) {
            state.feats = [];
            Object.keys(state.asiSlots).forEach(function (lv) {
              if (state.asiSlots[lv].mode === 'feat') state.asiSlots[lv] = { mode: 'asi' };
            });
          }
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
    if (id === 'standardArray') {
      state.baseScores = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
    } else if (id === 'pointBuy') {
      state.baseScores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    } else if (id === 'roll') {
      state.rolledPool = [];
      state.baseScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
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
      var sel = select({
        placeholder: false, value: String(state.baseScores[a.id]), options: opts,
        onchange: function (val) { update(function () { state.baseScores[a.id] = parseInt(val, 10); }); }
      });
      grid.appendChild(scoreCell(a, sel));
    });
    box.appendChild(grid);
  }

  function renderArrayAssign(box, array) {
    var used = DND.ABILITIES.map(function (a) { return state.baseScores[a.id]; });
    box.appendChild(el('div', { class: 'budget' }, [
      el('span', { text: 'Assign 15, 14, 13, 12, 10, 8 \u2014 one value to each ability.' })
    ]));

    var grid = el('div', { class: 'score-grid' });
    DND.ABILITIES.forEach(function (a, idx) {
      var mine = state.baseScores[a.id];
      var counts = {};
      used.forEach(function (v, i) { if (i !== idx) counts[v] = (counts[v] || 0) + 1; });
      var avail = {};
      array.forEach(function (v) { avail[v] = (avail[v] || 0) + 1; });

      var opts = array.filter(function (v, i, arr) { return arr.indexOf(v) === i; })
        .map(function (v) {
          var taken = counts[v] || 0;
          var total = array.filter(function (x) { return x === v; }).length;
          return { value: String(v), label: String(v), disabled: taken >= total && v !== mine };
        });

      var sel = select({
        placeholder: false, value: String(mine), options: opts,
        onchange: function (val) { update(function () { state.baseScores[a.id] = parseInt(val, 10); }); }
      });
      grid.appendChild(scoreCell(a, sel));
    });
    box.appendChild(grid);

    var dupes = used.slice().sort().some(function (v, i, arr) { return i > 0 && arr[i - 1] === v && countIn(array, v) < 2; });
    if (dupes) {
      box.appendChild(el('div', { class: 'warnings' }, [
        el('p', { text: 'Two abilities share a value that appears only once in the array.' })
      ]));
    }
  }

  function countIn(arr, v) { return arr.filter(function (x) { return x === v; }).length; }

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

    var totals = state.rolledPool.map(function (r) { return r.total; });
    renderArrayAssign(box, totals);
  }

  function scoreCell(ability, control) {
    var s = computed.scores[ability.id];
    var bits = [];
    if (s.racial) bits.push('race ' + DND.formatMod(s.racial));
    if (s.level) bits.push('level ' + DND.formatMod(s.level));
    if (s.feat) bits.push('feat ' + DND.formatMod(s.feat));
    return el('div', { class: 'score-cell' }, [
      el('span', { class: 'field-label', text: ability.name }),
      control,
      el('div', { class: 'score-breakdown', text: bits.length
        ? bits.join(' \u00b7 ') + '  =  ' + s.total
        : '' })
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
        if (r.id === 'variantHuman' && !state.options.featsEnabled) {
          o.disabled = true; o.title = 'Turn on the Feats optional rule first.';
        }
        if (r.id === 'customLineage' && !state.options.featsEnabled) {
          o.disabled = true; o.title = 'Turn on the Feats optional rule first.';
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
          var r = DND.findRace(v);
          state.feats = state.feats.slice(0, DND.Engine.featsOwed(state, r, state.level));
        });
      }
    })));

    var race = computed.race;
    if (!race) return;

    var nested = el('div', { class: 'nested' });

    if (race.optionalNote) {
      nested.appendChild(el('p', { class: 'field-hint', text: race.optionalNote }));
    }

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
      var fixedBits = [];
      incs.forEach(function (inc, i) {
        if (inc.fixed) fixedBits.push(DND.formatMod(inc.amount) + ' ' + DND.UI.abbr(inc.fixed));
      });
      if (fixedBits.length) wrap.appendChild(el('p', { class: 'field-hint', text: fixedBits.join('  \u00b7  ') }));
    }

    var row = el('div', { class: 'row' });
    var chosen = [];
    incs.forEach(function (inc, i) {
      var key = tasha ? null : '__asi' + i;
      var current = tasha ? (state.originAsi[i] || '') : (inc.fixed || state.raceChoices[key] || '');
      if (current) chosen.push(current);
    });

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

    if (tasha) {
      wrap.appendChild(el('p', { class: 'field-hint', text: 'Each increase must go to a different ability.' }));
    }

    if (row.children.length) { wrap.appendChild(row); box.appendChild(wrap); }
    else if (!tasha) box.appendChild(wrap);
  }

  function renderRaceChoices(box, race) {
    var defs = DND.Engine.collectRaceChoices(race, computed.subrace);
    defs.forEach(function (c) {
      if (c.showIf) {
        var dep = state.raceChoices[c.showIf.choice];
        if (dep !== c.showIf.equals) return;
      }
      var options;
      if (c.type === 'skill') {
        options = c.from === 'all' ? DND.UI.skillOptions() : DND.UI.skillOptions().filter(function (o) {
          return c.from.indexOf(o.value) !== -1;
        });
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

    /* languages */
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

    /* proficiencies. The swap rules key off what the proficiency originally was,
       so classify by the pre-swap value rather than the bucket it now sits in. */
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
      if (item.kind === 'skill') {
        options = DND.UI.skillOptions();
      } else if (item.kind === 'armor' || item.kind === 'weapon') {
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

    var opts = DND.BACKGROUNDS.map(function (b) { return { value: b.id, label: b.name }; });
    var groups = [{ group: "Player's Handbook", options: opts }];
    if (state.options.customBackground) {
      groups.push({ group: 'Optional', options: [{ value: 'custom', label: 'Custom background' }] });
    }

    box.appendChild(field('Background', select({
      value: state.backgroundId,
      options: groups,
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
        placeholder: 'Standard',
        value: state.backgroundVariantId,
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
    list.appendChild(el('li', {}, [
      el('strong', { text: 'Skills. ' }),
      el('span', { text: bg.skills.map(DND.Engine.prettyName).join(', ') })
    ]));
    list.appendChild(el('li', {}, [
      el('strong', { text: bg.feature.name + '. ' }),
      el('span', { text: bg.feature.text })
    ]));
    list.appendChild(el('li', {}, [
      el('strong', { text: 'Equipment. ' }),
      el('span', { text: bg.equipment })
    ]));
    nested.appendChild(list);

    box.appendChild(nested);
  }

  function renderCustomBackground(box) {
    box.appendChild(el('p', { class: 'field-hint', text: 'Choose any two skills, then any two tool proficiencies or languages in total. Work out the feature and equipment with your DM.' }));

    var row = el('div', { class: 'row' });
    for (var i = 0; i < 2; i++) {
      (function (idx) {
        var cur = state.customBackgroundSkills[idx] || '';
        var other = state.customBackgroundSkills[1 - idx];
        row.appendChild(field('Skill ' + (idx + 1), select({
          value: cur,
          options: DND.UI.skillOptions(other ? [other] : []),
          onchange: function (v) { update(function () { state.customBackgroundSkills[idx] = v; }); }
        })));
      })(i);
    }
    box.appendChild(row);

    var row2 = el('div', { class: 'row' });
    for (var j = 0; j < 2; j++) {
      (function (idx) {
        var cur = state.customBackgroundExtras[idx] || '';
        var langs = DND.LANGUAGES.filter(function (l) { return l.type !== 'secret'; })
          .map(function (l) { return { value: 'lang:' + l.id, label: l.name }; });
        row2.appendChild(field('Tool or language ' + (idx + 1), select({
          value: cur,
          options: DND.UI.toolOptions('all').concat([{ group: 'Languages', options: langs }]),
          onchange: function (v) { update(function () { state.customBackgroundExtras[idx] = v; }); }
        })));
      })(j);
    }
    box.appendChild(row2);
  }

  /* ============================================================
     6. Advancement — ASIs and feats
     ============================================================ */
  function renderAdvancement() {
    var box = mount.advancement;
    clear(box);

    var levels = computed.asiLevels;

    box.appendChild(el('p', { class: 'field-hint', text: levels.length
      ? 'Most classes grant an Ability Score Improvement at levels 4, 8, 12, 16, and 19. Fighters and rogues gain extra ones; those arrive with the class module.'
      : 'No Ability Score Improvements yet \u2014 the first arrives at level 4.' }));

    levels.forEach(function (lv) {
      box.appendChild(renderAsiSlot(lv));
    });

    /* race-granted feats */
    var race = computed.race;
    if (race && race.grantsFeat) {
      for (var i = 0; i < race.grantsFeat; i++) {
        box.appendChild(renderFeatSlot(i, race.name + ' feat'));
      }
    }

    /* feats taken in place of ASIs */
    var offset = race && race.grantsFeat ? race.grantsFeat : 0;
    var n = offset;
    levels.forEach(function (lv) {
      var slot = state.asiSlots[lv];
      if (slot && slot.mode === 'feat') {
        box.appendChild(renderFeatSlot(n, 'Level ' + lv + ' feat'));
        n++;
      }
    });
  }

  function renderAsiSlot(lv) {
    var slot = state.asiSlots[lv] || {};
    var wrap = el('div', { class: 'asi-slot' });

    var head = el('div', { class: 'asi-slot-head' }, [
      el('span', { class: 'lvl', text: 'Level ' + lv }),
      el('h4', { text: 'Ability Score Improvement' })
    ]);
    wrap.appendChild(head);

    var modeOpts = [{ value: 'asi', label: 'Increase ability scores' }];
    if (state.options.featsEnabled) modeOpts.push({ value: 'feat', label: 'Take a feat instead' });

    wrap.appendChild(field('Choose', select({
      value: slot.mode || '',
      options: modeOpts,
      onchange: function (v) {
        update(function () {
          state.asiSlots[lv] = { mode: v };
          if (v === 'asi') {
            var owed = DND.Engine.featsOwed(state, computed.race, state.level);
            state.feats = state.feats.slice(0, owed);
          }
        });
      }
    })));

    if (slot.mode === 'asi') {
      var row = el('div', { class: 'row' });
      ['a', 'b'].forEach(function (key) {
        row.appendChild(field(key === 'a' ? 'First +1' : 'Second +1', select({
          value: slot[key] || '',
          options: DND.UI.abilityOptions(),
          onchange: function (v) {
            update(function () {
              state.asiSlots[lv] = state.asiSlots[lv] || { mode: 'asi' };
              state.asiSlots[lv][key] = v;
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
      var check = DND.Engine.meetsPrereq(feat, computed, state);
      var dup = otherIds.indexOf(feat.id) !== -1 && !feat.repeatable;
      var o = { value: feat.id, label: feat.name };
      if (!check.ok) {
        o.disabled = true;
        o.label = feat.name + ' \u2014 needs ' + check.reasons.join(', ');
      } else if (dup) {
        o.disabled = true;
        o.label = feat.name + ' \u2014 already taken';
      } else if (check.unverified && check.unverified.length) {
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

    var check = DND.Engine.meetsPrereq(feat, computed, state);
    if (check.unverified && check.unverified.length) {
      wrap.appendChild(el('p', { class: 'feat-note warn', text: '\u2020 ' + check.unverified.join('; ') + '. Verify once you pick a class.' }));
    }

    var body = el('div', { class: 'row' });

    if (feat.asi && feat.asi.choose) {
      body.appendChild(field('Ability increase', select({
        value: taken.asi || '',
        options: DND.UI.abilityOptions(feat.asi.choose),
        onchange: function (v) { update(function () { state.feats[index].asi = v; }); }
      })));
    }

    (feat.choices || []).forEach(function (c) {
      var options = c.type === 'skill'
        ? DND.UI.skillOptions().filter(function (o) { return c.from === 'all' || c.from.indexOf(o.value) !== -1; })
        : c.from.map(DND.UI.strOpt);
      body.appendChild(field(c.label, select({
        value: (taken.choices && taken.choices[c.id]) || '',
        options: options,
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
        value: (taken.choices && taken.choices[c.id]) || '',
        options: DND.UI.toolOptions(c.from),
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

    /* name + line */
    var descBits = [];
    if (c.race) descBits.push(c.subrace ? c.subrace.name : c.race.name);
    if (c.background) descBits.push(c.background.name);
    descBits.push('Level ' + c.level);

    box.appendChild(el('div', { class: 'sheet-name' }, [
      el('h3', { text: c.name || 'Unnamed adventurer' }),
      el('p', { text: descBits.join('  \u00b7  ') })
    ]));

    /* the anchor */
    var block = el('div', { class: 'ability-block' });
    DND.ABILITIES.forEach(function (a) {
      var s = c.scores[a.id];
      var boosted = (s.racial + s.feat + s.level) > 0;
      block.appendChild(el('div', { class: 'ability-cell' + (boosted ? ' boosted' : '') }, [
        el('span', { class: 'abbr', text: a.abbr }),
        el('span', { class: 'score', text: String(s.total) }),
        el('span', { class: 'mod', text: DND.formatMod(s.mod) })
      ]));
    });
    box.appendChild(block);

    /* status */
    var status = el('div', { class: 'status' + (c.pending.length ? '' : ' complete') });
    if (c.pending.length) {
      status.appendChild(el('h4', { text: 'Still to choose' }));
      var ul = el('ul');
      c.pending.slice(0, 8).forEach(function (p) { ul.appendChild(el('li', { text: p })); });
      if (c.pending.length > 8) ul.appendChild(el('li', { text: 'and ' + (c.pending.length - 8) + ' more\u2026' }));
      status.appendChild(ul);
    } else {
      status.appendChild(el('h4', { text: 'Origin complete. Class comes next.' }));
    }
    box.appendChild(status);

    if (c.warnings.length) {
      var w = el('div', { class: 'sheet-section' });
      var wb = el('div', { class: 'warnings' });
      unique(c.warnings).forEach(function (msg) { wb.appendChild(el('p', { text: msg })); });
      w.appendChild(wb);
      box.appendChild(w);
    }

    /* core numbers */
    var core = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Core' })]);
    core.appendChild(DND.UI.statRow('Proficiency bonus', DND.formatMod(c.proficiencyBonus)));
    core.appendChild(DND.UI.statRow('Initiative', DND.formatMod(c.initiative)));
    core.appendChild(DND.UI.statRow('Speed', c.speed + ' ft.'));
    core.appendChild(DND.UI.statRow('Size', c.size));
    core.appendChild(DND.UI.statRow('Creature type', c.creatureType));
    if (c.darkvision) core.appendChild(DND.UI.statRow('Darkvision', c.darkvision + ' ft.'));
    if (c.hpPerLevel) core.appendChild(DND.UI.statRow('Bonus hit points', DND.formatMod(c.hpPerLevel) + ' per level'));
    c.speedNotes.forEach(function (n) {
      core.appendChild(el('p', { class: 'field-hint', text: n }));
    });
    box.appendChild(core);

    /* saves */
    var saves = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Saving throws' })]);
    c.saves.forEach(function (s) {
      saves.appendChild(el('div', { class: 'stat-row' + (s.prof ? '' : ' dim') }, [
        el('span', { class: 'lbl' }, [
          el('span', { class: 'prof-dot' + (s.prof ? ' on' : '') }),
          document.createTextNode(s.name)
        ]),
        el('span', { class: 'val', text: DND.formatMod(s.bonus) })
      ]));
    });
    saves.appendChild(el('p', { class: 'field-hint', text: 'Your class grants two save proficiencies. Those arrive with the class module.' }));
    box.appendChild(saves);

    /* skills */
    var sk = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Skills' })]);
    c.skills.forEach(function (s) {
      sk.appendChild(el('div', { class: 'stat-row' + (s.prof ? '' : ' dim'), title: s.source || '' }, [
        el('span', { class: 'lbl' }, [
          el('span', { class: 'prof-dot' + (s.expertise ? ' expert' : (s.prof ? ' on' : '')) }),
          document.createTextNode(s.name)
        ]),
        el('span', { class: 'val', text: DND.formatMod(s.bonus) })
      ]));
    });
    box.appendChild(sk);

    /* passive */
    var pass = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Passive scores' })]);
    ['perception', 'investigation', 'insight'].forEach(function (id) {
      var row = c.skills.filter(function (s) { return s.id === id; })[0];
      pass.appendChild(DND.UI.statRow('Passive ' + row.name, String(row.passive)));
    });
    box.appendChild(pass);

    /* proficiencies */
    box.appendChild(profSection('Armor', c.armor));
    box.appendChild(profSection('Weapons', c.weapons));
    box.appendChild(profSection('Tools', c.tools));
    box.appendChild(profSection('Languages', c.languages.map(function (l) {
      return { value: DND.Engine.prettyName(l.value), source: l.source };
    })));

    /* racial extras */
    if (c.ancestry) {
      var anc = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Breath weapon' })]);
      anc.appendChild(DND.UI.statRow('Ancestry', c.ancestry.name));
      anc.appendChild(DND.UI.statRow('Damage', c.ancestry.damage));
      anc.appendChild(DND.UI.statRow('Area', c.ancestry.breath));
      anc.appendChild(DND.UI.statRow('Save DC',
        String(8 + c.scores.con.mod + c.proficiencyBonus) + '  (' + DND.UI.abbr(c.ancestry.save) + ')'));
      anc.appendChild(DND.UI.statRow('Resistance', c.ancestry.damage));
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
      var tr = el('div', { class: 'sheet-section' }, [el('h4', { text: 'Traits' })]);
      var tl = el('div', { class: 'tag-list' });
      tl.textContent = c.traits.map(function (t) { return t.name; }).join(', ');
      tr.appendChild(tl);
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

  function profSection(title, list) {
    var sec = el('div', { class: 'sheet-section' }, [el('h4', { text: title })]);
    var body = el('div', { class: 'tag-list' });
    if (!list.length) {
      body.appendChild(el('span', { class: 'none', text: 'None yet' }));
    } else {
      body.textContent = list.map(function (x) { return x.value; }).sort().join(', ');
    }
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
    var blob = new Blob([JSON.stringify({ version: 1, state: state }, null, 2)], { type: 'application/json' });
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
        Object.keys(fresh).forEach(function (k) {
          if (loaded[k] !== undefined) fresh[k] = loaded[k];
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
