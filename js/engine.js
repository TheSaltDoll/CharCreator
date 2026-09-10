/* Derivation engine. Takes the raw choice state and produces every computed
   value on the sheet. Pure — no DOM. */
window.DND = window.DND || {};

DND.Engine = (function () {

  function blankState() {
    return {
      name: '',
      abilityMethod: 'standardArray',
      baseScores: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
      rolledPool: [],
      raceId: '',
      subraceId: '',
      backgroundId: '',
      backgroundVariantId: '',
      options: {
        tashaOrigin: false,
        customBackground: false,
        featsEnabled: true,
        multiclass: false,
        optionalClassFeatures: false
      },
      classes: [{ classId: '', level: 1, skills: [], tools: {}, expertise: [], choices: {}, optionalFeatures: [] }],
      hpMethod: 'average',
      hpRolls: {},
      hpManual: null,
      raceChoices: {},
      backgroundChoices: {},
      originAsi: {},
      originLanguages: {},
      originSwaps: {},
      customBackgroundSkills: [],
      customBackgroundExtras: [],
      feats: [],
      asiSlots: {}
    };
  }

  function totalLevel(state) {
    var n = 0;
    state.classes.forEach(function (c) { if (c.classId) n += (parseInt(c.level, 10) || 0); });
    return Math.max(1, Math.min(20, n || 1));
  }

  function asiLevelsFor(cls, classLevel) {
    var levels = (cls && cls.asiLevels) ? cls.asiLevels : DND.BASE_ASI_LEVELS;
    return levels.filter(function (l) { return l <= classLevel; });
  }

  function asiSlotKeys(state) {
    var keys = [];
    state.classes.forEach(function (entry) {
      var cls = DND.findClass(entry.classId);
      if (!cls) return;
      asiLevelsFor(cls, parseInt(entry.level, 10) || 1).forEach(function (lv) {
        keys.push({ key: entry.classId + ':' + lv, classId: entry.classId, className: cls.name, level: lv });
      });
    });
    return keys;
  }

  function racialIncreases(race, subrace) {
    var list = [];
    function harvest(src) {
      if (!src || !src.asi) return;
      DND.ABILITIES.forEach(function (ab) {
        if (typeof src.asi[ab.id] === 'number') list.push({ amount: src.asi[ab.id], fixed: ab.id });
      });
      if (src.asi.choose) {
        var c = src.asi.choose;
        for (var i = 0; i < c.count; i++) {
          list.push({ amount: c.amount, fixed: null, exclude: c.exclude || [], pick: true });
        }
      }
    }
    harvest(race);
    harvest(subrace);
    return list;
  }

  function resolveRacialAsi(race, subrace, state, warnings) {
    var out = {};
    var incs = racialIncreases(race, subrace);
    var used = [];
    incs.forEach(function (inc, i) {
      var target = null;
      if (state.options.tashaOrigin && !(race && race.noOriginCustomization)) {
        target = state.originAsi[i] || null;
      } else if (inc.fixed) {
        target = inc.fixed;
      } else {
        target = state.raceChoices['__asi' + i] || null;
      }
      if (!target) return;
      if (used.indexOf(target) !== -1) {
        warnings.push('Two racial increases are assigned to the same ability. They must go to different scores.');
        return;
      }
      used.push(target);
      out[target] = (out[target] || 0) + inc.amount;
    });
    return { map: out, increases: incs, assigned: used };
  }

  function categoryOf(value) {
    if (DND.SKILLS.some(function (s) { return s.id === value; })) return 'skill';
    if (DND.ARMOR_TYPES.indexOf(value) !== -1) return 'armor';
    if (DND.SIMPLE_WEAPONS.indexOf(value) !== -1 ||
        DND.MARTIAL_WEAPONS.indexOf(value) !== -1) return 'weapon';
    return 'tool';
  }

  function prettyName(v) {
    var s = DND.SKILLS.filter(function (x) { return x.id === v; })[0];
    if (s) return s.name;
    var l = DND.LANGUAGES.filter(function (x) { return x.id === v; })[0];
    if (l) return l.name;
    return v;
  }

  /* `chosen` marks a proficiency that cost the player a pick. Two classes both
     granting light armor is redundant but harmless; two picks landing on the
     same skill wastes one, and that is worth saying out loud. */
  function pushProf(bucket, value, source, seen, warnings, label, chosen) {
    if (!value) return;
    var prior = seen[value];
    if (prior) {
      if (chosen || prior.chosen) {
        warnings.push('Duplicate ' + label + ': ' + prettyName(value) +
          ' comes from both ' + prior.source + ' and ' + source +
          '. One of those picks is going to waste.');
      }
      return;
    }
    seen[value] = { source: source, chosen: !!chosen };
    bucket.push({ value: value, source: source, chosen: !!chosen });
  }

  function activeFeatures(ce) {
    if (!ce.cls || !ce.cls.features) return [];
    var replaced = {};
    (ce.entry.optionalFeatures || []).forEach(function (name) {
      var opt = DND.OPTIONAL_CLASS_FEATURES.filter(function (o) {
        return o.classId === ce.cls.id && o.name === name;
      })[0];
      if (opt && opt.replaces) replaced[opt.replaces] = true;
    });
    return ce.cls.features.filter(function (f) {
      return f.level <= ce.level && !replaced[f.name];
    });
  }

  function expertiseSlots(cls, classLevel) {
    return (cls.expertise || []).filter(function (e) { return e.level <= classLevel; });
  }

  /* ================================================================
     build
     ================================================================ */
  function build(state) {
    var warnings = [];
    var race = DND.findRace(state.raceId);
    var subrace = DND.findSubrace(race, state.subraceId);
    var bg = DND.findBackground(state.backgroundId);
    var level = totalLevel(state);
    var pb = DND.proficiencyBonus(level);

    var classEntries = [];
    state.classes.forEach(function (c, idx) {
      var cls = DND.findClass(c.classId);
      if (!cls) return;
      classEntries.push({
        entry: c, index: idx, cls: cls,
        level: Math.max(1, parseInt(c.level, 10) || 1),
        isFirst: classEntries.length === 0
      });
    });

    /* ---------- ability scores ---------- */
    var base = {};
    DND.ABILITIES.forEach(function (a) { base[a.id] = parseInt(state.baseScores[a.id], 10) || 10; });

    var racial = resolveRacialAsi(race, subrace, state, warnings);
    var featAsi = {}, levelAsi = {}, classAsi = {}, maxOverride = {};

    state.feats.forEach(function (f) {
      var feat = DND.findFeat(f.featId);
      if (!feat || !feat.asi) return;
      if (feat.asi.choose) {
        if (f.asi) featAsi[f.asi] = (featAsi[f.asi] || 0) + (feat.asi.amount || 1);
      } else {
        DND.ABILITIES.forEach(function (ab) {
          if (feat.asi[ab.id]) featAsi[ab.id] = (featAsi[ab.id] || 0) + feat.asi[ab.id];
        });
      }
    });

    asiSlotKeys(state).forEach(function (k) {
      var slot = state.asiSlots[k.key];
      if (!slot || slot.mode !== 'asi') return;
      if (slot.a) levelAsi[slot.a] = (levelAsi[slot.a] || 0) + 1;
      if (slot.b) levelAsi[slot.b] = (levelAsi[slot.b] || 0) + 1;
    });

    classEntries.forEach(function (ce) {
      activeFeatures(ce).forEach(function (f) {
        if (f.asi) {
          DND.ABILITIES.forEach(function (ab) {
            if (f.asi[ab.id]) classAsi[ab.id] = (classAsi[ab.id] || 0) + f.asi[ab.id];
          });
        }
        if (f.raiseMax) {
          Object.keys(f.raiseMax).forEach(function (k) {
            maxOverride[k] = Math.max(maxOverride[k] || 20, f.raiseMax[k]);
          });
        }
      });
    });

    var scores = {};
    DND.ABILITIES.forEach(function (a) {
      var r = racial.map[a.id] || 0;
      var ft = featAsi[a.id] || 0;
      var lv = levelAsi[a.id] || 0;
      var cl = classAsi[a.id] || 0;
      var cap = maxOverride[a.id] || 20;
      var raw = base[a.id] + r + ft + lv + cl;
      var total = Math.min(cap, raw);
      if (raw > cap) warnings.push(a.name + ' would reach ' + raw + '. Your maximum is ' + cap + '.');
      scores[a.id] = {
        base: base[a.id], racial: r, feat: ft, level: lv, classBonus: cl,
        total: total, mod: DND.abilityModifier(total), max: cap
      };
    });

    /* ---------- proficiencies ---------- */
    var skills = [], languages = [], tools = [], armor = [], weapons = [];
    var seenSkill = {}, seenLang = {}, seenTool = {}, seenArmor = {}, seenWeapon = {};
    var expertise = [], saveProfs = [], allSaves = false;

    function addSkill(id, src, ch) { pushProf(skills, id, src, seenSkill, warnings, 'skill proficiency', ch); }
    function addLang(id, src, ch) { pushProf(languages, id, src, seenLang, warnings, 'language', ch); }
    function addTool(id, src, ch) { pushProf(tools, id, src, seenTool, warnings, 'tool proficiency', ch); }
    function addArmor(id, src) { pushProf(armor, id, src, seenArmor, warnings, 'armor proficiency', false); }
    function addWeapon(id, src) { pushProf(weapons, id, src, seenWeapon, warnings, 'weapon proficiency', false); }

    [[race, race ? race.name : ''], [subrace, subrace ? subrace.name : '']].forEach(function (pair) {
      var src = pair[0], label = pair[1];
      if (!src) return;
      (src.skills || []).forEach(function (s) { addSkill(s, label); });
      (src.tools || []).forEach(function (t) { addTool(t, label); });
      (src.armor || []).forEach(function (a) { addArmor(a, label); });
      (src.weapons || []).forEach(function (w) { addWeapon(w, label); });
      if (src.languages) {
        (src.languages.fixed || []).forEach(function (l) {
          var replaced = state.options.tashaOrigin ? (state.originLanguages[l] || l) : l;
          addLang(replaced, label);
        });
        for (var i = 0; i < (src.languages.choose || 0); i++) {
          var pick = state.raceChoices['__lang_' + src.id + '_' + i];
          if (pick) addLang(pick, label, true);
        }
      }
    });

    collectRaceChoices(race, subrace).forEach(function (c) {
      var val = state.raceChoices[c.id];
      if (!val) return;
      (Array.isArray(val) ? val : [val]).forEach(function (v) {
        if (c.type === 'skill') addSkill(v, race ? race.name : '', true);
        else if (c.type === 'tool') addTool(v, race ? race.name : '', true);
      });
    });

    if (bg && bg.id !== 'custom') {
      (bg.skills || []).forEach(function (s) { addSkill(s, bg.name); });
      (bg.tools || []).forEach(function (t) { addTool(t, bg.name); });
      (bg.toolChoices || []).forEach(function (c) {
        var v = state.backgroundChoices[c.id];
        if (v) addTool(v, bg.name, true);
      });
      if (bg.languages) {
        for (var i = 0; i < (bg.languages.choose || 0); i++) {
          var p = state.backgroundChoices['lang' + i];
          if (p) addLang(p, bg.name, true);
        }
      }
    } else if (bg && bg.id === 'custom') {
      state.customBackgroundSkills.forEach(function (s) { if (s) addSkill(s, 'Custom background', true); });
      state.customBackgroundExtras.forEach(function (e) {
        if (!e) return;
        if (e.indexOf('lang:') === 0) addLang(e.slice(5), 'Custom background', true);
        else addTool(e, 'Custom background', true);
      });
    }

    classEntries.forEach(function (ce) {
      var cls = ce.cls, label = cls.name;
      var grant = ce.isFirst ? cls : (cls.multiclass || {});

      (grant.armor || []).forEach(function (a) { addArmor(a, label); });
      (grant.weaponCategories || []).forEach(function (w) { addWeapon(w, label); });
      (grant.weapons || []).forEach(function (w) { addWeapon(w, label); });
      (grant.tools || []).forEach(function (t) { addTool(t, label); });

      if (ce.isFirst) {
        (cls.saves || []).forEach(function (s) { saveProfs.push({ ability: s, source: label }); });
      }

      var skillDef = ce.isFirst ? cls.skills : (cls.multiclass && cls.multiclass.skills);
      if (skillDef) {
        (ce.entry.skills || []).slice(0, skillDef.count).forEach(function (s) {
          if (s) addSkill(s, label, true);
        });
      }

      var toolDefs = (ce.isFirst ? cls.toolChoices : (cls.multiclass && cls.multiclass.toolChoices)) || [];
      toolDefs.forEach(function (def) {
        for (var i = 0; i < def.count; i++) {
          var v = (ce.entry.tools || {})[def.id + '_' + i];
          if (v) addTool(v, label, true);
        }
      });

      expertiseSlots(cls, ce.level).forEach(function (slot, si) {
        for (var i = 0; i < slot.count; i++) {
          var v = (ce.entry.expertise || [])[si * 2 + i];
          if (v) expertise.push({ skill: v, source: label });
        }
      });

      activeFeatures(ce).forEach(function (f) {
        if (f.addSave) saveProfs.push({ ability: f.addSave, source: cls.name + ' \u2014 ' + f.name });
        if (f.allSaves) allSaves = true;
      });

      var inv = (ce.entry.choices || {}).invocations;
      if (inv) {
        (Array.isArray(inv) ? inv : [inv]).forEach(function (id) {
          var i = DND.findOption(DND.INVOCATIONS, id);
          if (i && i.skills) i.skills.forEach(function (s) { addSkill(s, i.name); });
        });
      }
    });

    state.feats.forEach(function (f) {
      var feat = DND.findFeat(f.featId);
      if (!feat) return;
      (feat.armor || []).forEach(function (a) { addArmor(a, feat.name); });
      (feat.tools || []).forEach(function (t) { addTool(t, feat.name); });
      (feat.languagesFixed || []).forEach(function (l) { addLang(l, feat.name); });
      (f.skills || []).forEach(function (s) { if (s) addSkill(s, feat.name, true); });
      (f.tools || []).forEach(function (t) { if (t) addTool(t, feat.name, true); });
      (f.weapons || []).forEach(function (w) { if (w) addWeapon(w, feat.name); });
      (f.languages || []).forEach(function (l) { if (l) addLang(l, feat.name, true); });
      (f.expertise || []).forEach(function (s) { if (s) expertise.push({ skill: s, source: feat.name }); });
      (feat.choices || []).forEach(function (c) {
        var v = f.choices && f.choices[c.id];
        if (v && c.type === 'skill') addSkill(v, feat.name, true);
        if (v && c.type === 'tool') addTool(v, feat.name, true);
      });
      (feat.toolChoices || []).forEach(function (c) {
        var v = f.choices && f.choices[c.id];
        if (v) addTool(v, feat.name, true);
      });
      if (feat.saveFromAsi && f.asi) saveProfs.push({ ability: f.asi, source: feat.name });
    });

    if (state.options.tashaOrigin && race && !race.noOriginCustomization) {
      var buckets = { armor: armor, weapon: weapons, tool: tools, skill: skills };
      var moves = [];
      Object.keys(buckets).forEach(function (kind) {
        var bucket = buckets[kind];
        for (var i = bucket.length - 1; i >= 0; i--) {
          var entry = bucket[i];
          var isRacial = entry.source === (race && race.name) ||
            (subrace && entry.source === subrace.name);
          if (!isRacial) continue;
          var rep = state.originSwaps[entry.value];
          if (!rep || rep === entry.value) continue;
          moves.push({ from: entry.value, to: rep, source: entry.source });
          bucket.splice(i, 1);
        }
      });
      moves.forEach(function (m) {
        var bucket = buckets[categoryOf(m.to)];
        var clash = bucket.filter(function (e) { return e.value === m.to; })[0];
        if (clash) {
          warnings.push('Swapping ' + prettyName(m.from) + ' for ' + prettyName(m.to) +
            ' duplicates a proficiency from ' + clash.source + '.');
          return;
        }
        bucket.push({ value: m.to, source: m.source, swappedFrom: m.from });
      });
    }

    /* ---------- speed, senses, size ---------- */
    var speed = race ? (race.speed || 30) : 30;
    if (subrace && subrace.speed) speed = subrace.speed;
    var speedNotes = [];
    if (race && race.speedNote) speedNotes.push(race.speedNote);

    classEntries.forEach(function (ce) {
      if (ce.cls.speedByLevel) {
        var bonus = ce.cls.speedByLevel[ce.level] || 0;
        if (bonus) { speed += bonus; if (ce.cls.speedNote) speedNotes.push(ce.cls.speedNote); }
      }
      activeFeatures(ce).forEach(function (f) {
        if (f.speed) {
          speed += f.speed;
          speedNotes.push(ce.cls.name + ' \u2014 ' + f.name + ' adds ' + f.speed + ' feet.');
        }
      });
    });

    state.feats.forEach(function (f) {
      var feat = DND.findFeat(f.featId);
      if (feat && feat.speed) {
        speed += feat.speed;
        speedNotes.push(feat.name + ' adds ' + feat.speed + ' feet.');
      }
    });

    var darkvision = 0;
    if (race && race.darkvision) darkvision = race.darkvision;
    if (subrace && subrace.darkvision) darkvision = subrace.darkvision;
    if (state.raceChoices.lineageVariable === 'Darkvision 60 feet') darkvision = Math.max(darkvision, 60);

    var size = 'Medium';
    if (race) size = race.size === 'choice' ? (state.raceChoices.__size || 'Medium') : (race.size || 'Medium');

    /* ---------- initiative, passives, hp bonuses ---------- */
    var initiative = scores.dex.mod;
    var passivePerceptionBonus = 0, passiveInvestigationBonus = 0, hpPerLevel = 0;
    state.feats.forEach(function (f) {
      var feat = DND.findFeat(f.featId);
      if (!feat) return;
      if (feat.initiative) initiative += feat.initiative;
      if (feat.passivePerception) passivePerceptionBonus += feat.passivePerception;
      if (feat.passiveInvestigation) passiveInvestigationBonus += feat.passiveInvestigation;
      if (feat.hpPerLevel) hpPerLevel += feat.hpPerLevel;
    });
    if (subrace && subrace.hpPerLevel) hpPerLevel += subrace.hpPerLevel;

    var hp = computeHp(state, classEntries, scores.con.mod, hpPerLevel, level);

    /* ---------- skills ---------- */
    var skillIds = skills.map(function (s) { return s.value; });
    var expertiseIds = expertise.map(function (e) { return e.skill; });
    var jackOfAllTrades = classEntries.some(function (ce) {
      return ce.cls.id === 'bard' && ce.level >= 2;
    });

    var skillRows = DND.SKILLS.map(function (sk) {
      var prof = skillIds.indexOf(sk.id) !== -1;
      var exp = expertiseIds.indexOf(sk.id) !== -1 && prof;
      var bonus = scores[sk.ability].mod;
      if (prof) bonus += pb;
      if (exp) bonus += pb;
      if (!prof && jackOfAllTrades) bonus += Math.floor(pb / 2);
      var passive = 10 + bonus;
      if (sk.id === 'perception') passive += passivePerceptionBonus;
      if (sk.id === 'investigation') passive += passiveInvestigationBonus;
      var srcEntry = skills.filter(function (s) { return s.value === sk.id; })[0];
      return {
        id: sk.id, name: sk.name, ability: sk.ability, prof: prof, expertise: exp,
        jack: !prof && jackOfAllTrades, bonus: bonus, passive: passive,
        source: srcEntry ? srcEntry.source : ''
      };
    });

    /* ---------- saving throws ---------- */
    var saveIds = saveProfs.map(function (s) { return s.ability; });
    var saveRows = DND.ABILITIES.map(function (ab) {
      var prof = allSaves || saveIds.indexOf(ab.id) !== -1;
      var srcEntry = saveProfs.filter(function (s) { return s.ability === ab.id; })[0];
      return {
        id: ab.id, name: ab.name, abbr: ab.abbr, prof: prof,
        bonus: scores[ab.id].mod + (prof ? pb : 0),
        source: srcEntry ? srcEntry.source : (allSaves ? 'Diamond Soul' : '')
      };
    });

    /* ---------- armor class ---------- */
    var acOptions = [{ label: 'No armor', value: 10 + scores.dex.mod, note: '10 + Dexterity modifier' }];
    classEntries.forEach(function (ce) {
      var ud = ce.cls.unarmoredDefense;
      if (!ud) return;
      var a1 = DND.ABILITIES.filter(function (a) { return a.id === ud.abilities[0]; })[0];
      var a2 = DND.ABILITIES.filter(function (a) { return a.id === ud.abilities[1]; })[0];
      acOptions.push({
        label: ce.cls.name + ' Unarmored Defense',
        value: 10 + scores[ud.abilities[0]].mod + scores[ud.abilities[1]].mod,
        note: '10 + ' + a1.name + ' + ' + a2.name + (ud.shieldAllowed ? '. A shield still applies.' : '. No shield.')
      });
    });

    /* ---------- traits ---------- */
    var traits = [];
    function addTraits(src, label) {
      if (!src || !src.traits) return;
      src.traits.forEach(function (t) { traits.push({ name: t.name, text: t.text, source: label }); });
    }
    addTraits(race, race ? race.name : '');
    addTraits(subrace, subrace ? subrace.name : '');

    var innate = [];
    [race, subrace].forEach(function (src) {
      if (!src || !src.innateSpells) return;
      src.innateSpells.forEach(function (sp) { if (level >= sp.level) innate.push(sp); });
    });
    if (state.raceChoices.highElfCantrip) {
      innate.push({ level: 1, name: state.raceChoices.highElfCantrip, use: 'at will', ability: 'int' });
    }

    var ancestry = null;
    if (state.raceChoices.draconicAncestry) {
      ancestry = DND.DRACONIC_ANCESTRY.filter(function (d) {
        return d.id === state.raceChoices.draconicAncestry;
      })[0] || null;
    }

    /* ---------- class summary ---------- */
    var classInfo = classEntries.map(function (ce) {
      return {
        id: ce.cls.id, name: ce.cls.name, level: ce.level, source: ce.cls.source,
        hitDie: ce.cls.hitDie, isFirst: ce.isFirst,
        subclassLabel: ce.cls.subclass ? ce.cls.subclass.label : null,
        subclassLevel: ce.cls.subclass ? ce.cls.subclass.level : null,
        subclassDue: ce.cls.subclass ? ce.level >= ce.cls.subclass.level : false,
        features: activeFeatures(ce),
        columns: (ce.cls.columns || []).map(function (col) {
          return { id: col.id, label: col.label, value: col.values[ce.level] };
        }),
        optionalFeatures: state.options.optionalClassFeatures
          ? DND.optionalFeaturesFor(ce.cls.id, ce.level).filter(function (f) {
              return (ce.entry.optionalFeatures || []).indexOf(f.name) !== -1;
            })
          : [],
        picks: describePicks(ce)
      };
    });

    var spellcasting = computeSpellcasting(state, classEntries, scores, pb);
    var pending = pendingChoices(state, race, subrace, bg, level, racial, classEntries);

    return {
      name: state.name, level: level, proficiencyBonus: pb,
      race: race, subrace: subrace, background: bg,
      classes: classInfo, classEntries: classEntries,
      scores: scores, racialAsi: racial,
      skills: skillRows, saves: saveRows,
      languages: languages, tools: tools, armor: armor, weapons: weapons,
      expertise: expertise,
      speed: speed, speedNotes: speedNotes.filter(Boolean),
      darkvision: darkvision, size: size,
      creatureType: race && race.creatureType ? race.creatureType : 'Humanoid',
      initiative: initiative, hp: hp, hpPerLevel: hpPerLevel,
      acOptions: acOptions,
      traits: traits, innateSpells: innate, ancestry: ancestry,
      spellcasting: spellcasting,
      asiSlots: asiSlotKeys(state),
      warnings: warnings, pending: pending,
      xp: DND.XP_THRESHOLDS[level - 1]
    };
  }

  /* Named picks made from class features, for display on the sheet. */
  function describePicks(ce) {
    var out = [];
    featureChoices(ce).forEach(function (fc) {
      var v = (ce.entry.choices || {})[fc.def.id];
      if (!v) return;
      var vals = Array.isArray(v) ? v.filter(Boolean) : [v];
      if (!vals.length) return;
      out.push({
        label: fc.def.label,
        values: vals.map(function (id) { return labelForChoiceValue(fc.def.type, id); })
      });
    });
    return out;
  }

  function labelForChoiceValue(type, id) {
    var list = null;
    if (type === 'fightingStyle') list = DND.FIGHTING_STYLES;
    else if (type === 'metamagic') list = DND.METAMAGIC;
    else if (type === 'invocation') list = DND.INVOCATIONS;
    else if (type === 'infusion') list = DND.INFUSIONS;
    else if (type === 'pactBoon') list = DND.PACT_BOONS;
    else if (type === 'maneuver') list = DND.MANEUVERS;
    if (list) {
      var f = DND.findOption(list, id);
      return f ? f.name : id;
    }
    if (type === 'skill' || type === 'proficientSkill') return prettyName(id);
    return id;
  }

  function computeHp(state, classEntries, conMod, hpPerLevel, level) {
    if (!classEntries.length) {
      return { total: null, note: 'Choose a class to compute hit points.', dice: [] };
    }
    if (state.hpMethod === 'manual' && state.hpManual) {
      return {
        total: parseInt(state.hpManual, 10) || 0,
        note: 'Entered by hand.',
        dice: classEntries.map(function (ce) { return ce.level + 'd' + ce.cls.hitDie; })
      };
    }

    var total = 0, first = true;
    classEntries.forEach(function (ce) {
      for (var i = 1; i <= ce.level; i++) {
        var die = ce.cls.hitDie, gain;
        if (first) { gain = die; first = false; }
        else if (state.hpMethod === 'roll') {
          gain = state.hpRolls[ce.cls.id + ':' + i] || (Math.floor(die / 2) + 1);
        } else {
          gain = Math.floor(die / 2) + 1;
        }
        total += gain + conMod;
      }
    });
    total += hpPerLevel * level;

    return {
      total: Math.max(1, total),
      note: state.hpMethod === 'roll'
        ? 'First level takes the full die; later levels are rolled.'
        : 'First level takes the full die; later levels take the fixed average.',
      dice: classEntries.map(function (ce) { return ce.level + 'd' + ce.cls.hitDie; }),
      conPerLevel: conMod
    };
  }

  function computeSpellcasting(state, classEntries, scores, pb) {
    var casters = classEntries.filter(function (ce) { return ce.cls.spellcasting; });
    if (!casters.length) return null;

    var perClass = casters.map(function (ce) {
      var sc = ce.cls.spellcasting;
      var mod = scores[sc.ability].mod;
      var active = !sc.startLevel || ce.level >= sc.startLevel;
      var prepared = null;
      if (sc.prepares && sc.preparedFormula) {
        var basis = sc.preparedFormula.base === 'level' ? ce.level
          : sc.preparedFormula.base === 'halfLevel' ? Math.floor(ce.level / 2)
          : Math.ceil(ce.level / 2);
        prepared = Math.max(1, basis + mod);
      }
      return {
        classId: ce.cls.id, className: ce.cls.name, level: ce.level,
        ability: sc.ability, mod: mod, active: active,
        saveDc: 8 + pb + mod, attack: pb + mod,
        ritual: !!sc.ritual, focus: sc.focus, spellbook: !!sc.spellbook,
        cantrips: sc.cantrips ? sc.cantrips[ce.level] : null,
        known: sc.known ? sc.known[ce.level] : null,
        prepared: prepared, type: sc.type
      };
    });

    var pactEntry = casters.filter(function (ce) { return ce.cls.spellcasting.type === 'pact'; })[0];
    var pact = null;
    if (pactEntry) {
      var p = DND.PACT_MAGIC[pactEntry.level];
      pact = { slots: p.slots, level: p.level, className: pactEntry.cls.name };
    }

    var slotCasters = casters.filter(function (ce) { return ce.cls.spellcasting.type !== 'pact'; });
    var slots = null, casterLevel = 0, combined = slotCasters.length > 1;

    if (slotCasters.length === 1) {
      var only = slotCasters[0];
      casterLevel = DND.casterLevel(only.cls.spellcasting.type, only.level, false);
    } else if (slotCasters.length > 1) {
      slotCasters.forEach(function (ce) {
        casterLevel += DND.casterLevel(ce.cls.spellcasting.type, ce.level, true);
      });
    }
    casterLevel = Math.min(20, casterLevel);
    if (casterLevel > 0) slots = DND.SLOTS_FULL[casterLevel];

    return { perClass: perClass, slots: slots, casterLevel: casterLevel, combined: combined, pact: pact };
  }

  function collectRaceChoices(race, subrace) {
    var out = [];
    if (race && race.choices) out = out.concat(race.choices);
    if (subrace && subrace.choices) out = out.concat(subrace.choices);
    return out;
  }

  function featureChoices(ce) {
    var out = [];
    activeFeatures(ce).forEach(function (f) {
      ['choice', 'choice2'].forEach(function (key) {
        if (!f[key]) return;
        var c = f[key];
        var count = c.count;
        if (c.countColumn) count = DND.columnValue(ce.cls, c.countColumn, ce.level) || 0;
        out.push({ def: c, count: count, featureName: f.name });
      });
    });
    (ce.entry.optionalFeatures || []).forEach(function (name) {
      var opt = DND.OPTIONAL_CLASS_FEATURES.filter(function (o) {
        return o.classId === ce.cls.id && o.name === name && o.level <= ce.level;
      })[0];
      if (opt && opt.choice) out.push({ def: opt.choice, count: opt.choice.count || 1, featureName: opt.name });
    });
    /* A choice that gates another must be offered first, whatever level it
       arrives at: the Pact Boon decides which invocations are even legal. */
    return out.map(function (o, i) { return { o: o, i: i }; })
      .sort(function (a, b) {
        var wa = a.o.def.order || 50, wb = b.o.def.order || 50;
        return wa === wb ? a.i - b.i : wa - wb;
      })
      .map(function (x) { return x.o; });
  }

  function pendingChoices(state, race, subrace, bg, level, racial, classEntries) {
    var out = [];
    if (!race) out.push('Choose a race.');
    if (race && race.subraces && race.subraces.length && !subrace) out.push('Choose a subrace.');
    if (!bg) out.push('Choose a background.');
    if (!classEntries.length) out.push('Choose a class.');

    if (race && race.size === 'choice' && !state.raceChoices.__size) out.push('Choose your size.');

    if (state.options.tashaOrigin && race && !race.noOriginCustomization) {
      racial.increases.forEach(function (inc, i) {
        if (!state.originAsi[i]) out.push('Assign the +' + inc.amount + ' racial ability increase.');
      });
    } else {
      racial.increases.forEach(function (inc, i) {
        if (!inc.fixed && !state.raceChoices['__asi' + i]) {
          out.push('Choose where the +' + inc.amount + ' racial increase goes.');
        }
      });
    }

    collectRaceChoices(race, subrace).forEach(function (c) {
      if (c.showIf && state.raceChoices[c.showIf.choice] !== c.showIf.equals) return;
      var v = state.raceChoices[c.id];
      var have = Array.isArray(v) ? v.filter(Boolean).length : (v ? 1 : 0);
      if (have < (c.count || 1)) out.push('Choose your ' + c.label.toLowerCase() + '.');
    });

    [race, subrace].forEach(function (src) {
      if (!src || !src.languages) return;
      for (var i = 0; i < (src.languages.choose || 0); i++) {
        if (!state.raceChoices['__lang_' + src.id + '_' + i]) out.push('Choose an extra language.');
      }
    });

    if (bg && bg.id !== 'custom') {
      (bg.toolChoices || []).forEach(function (c) {
        if (!state.backgroundChoices[c.id]) out.push('Choose your ' + c.label.toLowerCase() + ' from your background.');
      });
      if (bg.languages) {
        for (var j = 0; j < (bg.languages.choose || 0); j++) {
          if (!state.backgroundChoices['lang' + j]) out.push('Choose a background language.');
        }
      }
    }
    if (bg && bg.id === 'custom') {
      if (state.customBackgroundSkills.filter(Boolean).length < 2) out.push('Choose two background skills.');
      if (state.customBackgroundExtras.filter(Boolean).length < 2) out.push('Choose two tools or languages.');
    }

    classEntries.forEach(function (ce) {
      var cls = ce.cls;
      var skillDef = ce.isFirst ? cls.skills : (cls.multiclass && cls.multiclass.skills);
      if (skillDef) {
        var have = (ce.entry.skills || []).filter(Boolean).length;
        if (have < skillDef.count) {
          out.push(cls.name + ': choose ' + (skillDef.count - have) + ' more skill' +
            (skillDef.count - have === 1 ? '' : 's') + '.');
        }
      }
      var toolDefs = (ce.isFirst ? cls.toolChoices : (cls.multiclass && cls.multiclass.toolChoices)) || [];
      toolDefs.forEach(function (def) {
        for (var i = 0; i < def.count; i++) {
          if (!(ce.entry.tools || {})[def.id + '_' + i]) {
            out.push(cls.name + ': choose your ' + def.label.toLowerCase() + '.');
            break;
          }
        }
      });
      expertiseSlots(cls, ce.level).forEach(function (slot, si) {
        for (var i = 0; i < slot.count; i++) {
          if (!(ce.entry.expertise || [])[si * 2 + i]) {
            out.push(cls.name + ': choose your Expertise skills.');
            return;
          }
        }
      });
      featureChoices(ce).forEach(function (fc) {
        var v = (ce.entry.choices || {})[fc.def.id];
        var have = Array.isArray(v) ? v.filter(Boolean).length : (v ? 1 : 0);
        if (have < fc.count) {
          out.push(cls.name + ': ' + fc.featureName + ' \u2014 choose ' +
            (fc.count - have) + ' more ' + fc.def.label.toLowerCase() + '.');
        }
      });
    });

    var owed = featsOwed(state, race);
    if (state.feats.length < owed) {
      out.push('Choose ' + (owed - state.feats.length) + ' more feat' + (owed - state.feats.length === 1 ? '' : 's') + '.');
    }

    state.feats.forEach(function (f) {
      var feat = DND.findFeat(f.featId);
      if (!feat) return;
      if (feat.asi && feat.asi.choose && !f.asi) out.push(feat.name + ': choose an ability increase.');
      (feat.choices || []).forEach(function (c) {
        if (!(f.choices && f.choices[c.id])) out.push(feat.name + ': choose a ' + c.label.toLowerCase() + '.');
      });
      if (feat.skillChoices && (f.skills || []).filter(Boolean).length < feat.skillChoices) {
        out.push(feat.name + ': choose a skill.');
      }
      if (feat.expertiseChoices && (f.expertise || []).filter(Boolean).length < feat.expertiseChoices) {
        out.push(feat.name + ': choose a skill for expertise.');
      }
    });

    asiSlotKeys(state).forEach(function (k) {
      var slot = state.asiSlots[k.key];
      var label = k.className + ' level ' + k.level;
      if (!slot || !slot.mode) out.push(label + ': take an ability increase or a feat.');
      else if (slot.mode === 'asi' && (!slot.a || !slot.b)) out.push(label + ': assign both ability increases.');
    });

    return out;
  }

  function featsOwed(state, race) {
    var n = 0;
    if (race && race.grantsFeat) n += race.grantsFeat;
    asiSlotKeys(state).forEach(function (k) {
      var slot = state.asiSlots[k.key];
      if (slot && slot.mode === 'feat') n += 1;
    });
    return n;
  }

  function multiclassCheck(cls, computed, isFirst) {
    if (isFirst || !cls.multiclass) return { ok: true, reasons: [] };
    var reasons = [], p = cls.multiclass;
    if (p.prereq) {
      Object.keys(p.prereq).forEach(function (k) {
        if (!computed.scores[k] || computed.scores[k].total < p.prereq[k]) {
          reasons.push(abbrOf(k) + ' ' + p.prereq[k]);
        }
      });
    }
    if (p.prereqAny) {
      var any = Object.keys(p.prereqAny).some(function (k) {
        return computed.scores[k] && computed.scores[k].total >= p.prereqAny[k];
      });
      if (!any) {
        reasons.push(Object.keys(p.prereqAny).map(function (k) {
          return abbrOf(k) + ' ' + p.prereqAny[k];
        }).join(' or '));
      }
    }
    return { ok: reasons.length === 0, reasons: reasons };
  }

  function meetsPrereq(feat, computed) {
    if (!feat.prereq) return { ok: true, reasons: [], unverified: [] };
    var p = feat.prereq, reasons = [], unverified = [];

    if (p.ability) {
      Object.keys(p.ability).forEach(function (k) {
        if (!computed.scores[k] || computed.scores[k].total < p.ability[k]) {
          reasons.push(abbrOf(k) + ' ' + p.ability[k]);
        }
      });
    }
    if (p.abilityAny) {
      var any = Object.keys(p.abilityAny).some(function (k) {
        return computed.scores[k] && computed.scores[k].total >= p.abilityAny[k];
      });
      if (!any) {
        reasons.push(Object.keys(p.abilityAny).map(function (k) {
          return abbrOf(k) + ' ' + p.abilityAny[k];
        }).join(' or '));
      }
    }
    if (p.races || p.subraces || p.size) {
      var raceOk = p.races && computed.race && p.races.indexOf(computed.race.id) !== -1;
      var subOk = p.subraces && computed.subrace && p.subraces.indexOf(computed.subrace.id) !== -1;
      var sizeOk = p.size && computed.size === p.size;
      if (!raceOk && !subOk && !sizeOk) reasons.push(feat.prereqNote || describeRacePrereq(p));
    }
    if (p.armor && !computed.armor.some(function (a) { return a.value === p.armor; })) {
      reasons.push(p.armor + ' proficiency');
    }
    if (p.spellcasting && !computed.spellcasting) reasons.push('the Spellcasting feature');
    if (p.custom) {
      if (/martial weapon/i.test(p.custom)) {
        var martial = computed.weapons.some(function (w) {
          return w.value === 'Martial weapons' || DND.MARTIAL_WEAPONS.indexOf(w.value) !== -1;
        });
        if (!martial) reasons.push('proficiency with a martial weapon');
      } else if (/Pact Magic|Spellcasting/i.test(p.custom)) {
        if (!computed.spellcasting) reasons.push('a Spellcasting or Pact Magic feature');
      } else {
        unverified.push('Requires: ' + p.custom);
      }
    }

    return { ok: reasons.length === 0, reasons: reasons, unverified: unverified };
  }

  function describeRacePrereq(p) {
    var bits = [];
    (p.races || []).forEach(function (r) {
      var race = DND.findRace(r);
      if (race) bits.push(race.name);
    });
    (p.subraces || []).forEach(function (sr) {
      DND.RACES.forEach(function (race) {
        (race.subraces || []).forEach(function (s) { if (s.id === sr) bits.push(s.name); });
      });
    });
    if (p.size) bits.push('a ' + p.size + ' race');
    return bits.join(' or ');
  }

  function abbrOf(id) {
    var a = DND.ABILITIES.filter(function (x) { return x.id === id; })[0];
    return a ? a.abbr : id.toUpperCase();
  }

  function pointBuySpent(scores) {
    var total = 0;
    DND.ABILITIES.forEach(function (a) {
      var v = scores[a.id];
      total += (DND.POINT_BUY.cost[v] !== undefined) ? DND.POINT_BUY.cost[v] : 99;
    });
    return total;
  }

  return {
    blankState: blankState,
    build: build,
    totalLevel: totalLevel,
    racialIncreases: racialIncreases,
    collectRaceChoices: collectRaceChoices,
    featureChoices: featureChoices,
    expertiseSlots: expertiseSlots,
    activeFeatures: activeFeatures,
    asiLevelsFor: asiLevelsFor,
    asiSlotKeys: asiSlotKeys,
    featsOwed: featsOwed,
    meetsPrereq: meetsPrereq,
    multiclassCheck: multiclassCheck,
    pointBuySpent: pointBuySpent,
    prettyName: prettyName,
    categoryOf: categoryOf,
    labelForChoiceValue: labelForChoiceValue
  };
})();
