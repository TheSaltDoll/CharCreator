/* Derivation engine. Takes the raw choice state and produces every computed
   value on the sheet. Pure — no DOM. */
window.DND = window.DND || {};

DND.Engine = (function () {

  function emptyScores() { return { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }; }

  function blankState() {
    return {
      name: '',
      level: 1,
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
        featsEnabled: true
      },
      raceChoices: {},
      backgroundChoices: {},
      originAsi: {},          // increaseIndex -> ability id
      originLanguages: {},    // original language id -> replacement id
      originSwaps: {},        // proficiency string -> replacement string
      customBackgroundSkills: [],
      customBackgroundExtras: [],
      feats: [],              // [{featId, asi, choices:{}, skills:[], tools:[], expertise:[], languages:[], weapons:[]}]
      asiSlots: {}            // level -> {mode:'asi'|'feat', a:'str', b:'con'}
    };
  }

  /* Ordered list of racial ability increases, as {amount, fixedAbility|null}. */
  function racialIncreases(race, subrace, state) {
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

  /* Resolve racial increases into an ability -> total map. */
  function resolveRacialAsi(race, subrace, state, warnings) {
    var out = {};
    var incs = racialIncreases(race, subrace, state);
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

  function pushProf(bucket, value, source, seen, warnings, label) {
    if (!value) return;
    if (seen[value]) {
      warnings.push('Duplicate ' + label + ': ' + prettyName(value) + ' comes from both ' + seen[value] + ' and ' + source + '.');
      return;
    }
    seen[value] = source;
    bucket.push({ value: value, source: source });
  }

  /* Which proficiency bucket a value belongs to, by its own identity. */
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

  function build(state) {
    var warnings = [];
    var race = DND.findRace(state.raceId);
    var subrace = DND.findSubrace(race, state.subraceId);
    var bg = DND.findBackground(state.backgroundId);
    var level = Math.max(1, Math.min(20, parseInt(state.level, 10) || 1));
    var pb = DND.proficiencyBonus(level);

    /* ---------- ability scores ---------- */
    var base = {};
    DND.ABILITIES.forEach(function (a) { base[a.id] = parseInt(state.baseScores[a.id], 10) || 10; });

    var racial = resolveRacialAsi(race, subrace, state, warnings);

    var featAsi = {};
    var levelAsi = {};

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

    var asiLevels = availableAsiLevels(level);
    asiLevels.forEach(function (lv) {
      var slot = state.asiSlots[lv];
      if (!slot || slot.mode !== 'asi') return;
      if (slot.a) levelAsi[slot.a] = (levelAsi[slot.a] || 0) + 1;
      if (slot.b) levelAsi[slot.b] = (levelAsi[slot.b] || 0) + 1;
    });

    var scores = {};
    DND.ABILITIES.forEach(function (a) {
      var r = racial.map[a.id] || 0;
      var ft = featAsi[a.id] || 0;
      var lv = levelAsi[a.id] || 0;
      var raw = base[a.id] + r + ft + lv;
      var total = Math.min(20, raw);
      if (raw > 20) warnings.push(a.name + ' would reach ' + raw + '. Ability scores cap at 20 without magic.');
      scores[a.id] = {
        base: base[a.id], racial: r, feat: ft, level: lv,
        total: total, mod: DND.abilityModifier(total)
      };
    });

    /* ---------- proficiencies ---------- */
    var skills = [], languages = [], tools = [], armor = [], weapons = [];
    var seenSkill = {}, seenLang = {}, seenTool = {}, seenArmor = {}, seenWeapon = {};
    var expertise = [];
    var saveProfs = [];

    function addSkill(id, src) { pushProf(skills, id, src, seenSkill, warnings, 'skill proficiency'); }
    function addLang(id, src) { pushProf(languages, id, src, seenLang, warnings, 'language'); }
    function addTool(id, src) { pushProf(tools, id, src, seenTool, warnings, 'tool proficiency'); }
    function addArmor(id, src) { pushProf(armor, id, src, seenArmor, warnings, 'armor proficiency'); }
    function addWeapon(id, src) { pushProf(weapons, id, src, seenWeapon, warnings, 'weapon proficiency'); }

    /* race + subrace */
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
          if (pick) addLang(pick, label);
        }
      }
    });

    /* race choices */
    var raceChoiceDefs = collectRaceChoices(race, subrace);
    raceChoiceDefs.forEach(function (c) {
      var val = state.raceChoices[c.id];
      if (!val) return;
      var vals = Array.isArray(val) ? val : [val];
      vals.forEach(function (v) {
        if (c.type === 'skill') addSkill(v, (subrace && hasChoice(subrace, c.id)) ? subrace.name : (race ? race.name : ''));
        else if (c.type === 'tool') addTool(v, race ? race.name : '');
      });
    });

    /* background */
    if (bg && bg.id !== 'custom') {
      (bg.skills || []).forEach(function (s) { addSkill(s, bg.name); });
      (bg.tools || []).forEach(function (t) { addTool(t, bg.name); });
      (bg.toolChoices || []).forEach(function (c) {
        var v = state.backgroundChoices[c.id];
        if (v) addTool(v, bg.name);
      });
      if (bg.languages) {
        for (var i = 0; i < (bg.languages.choose || 0); i++) {
          var p = state.backgroundChoices['lang' + i];
          if (p) addLang(p, bg.name);
        }
      }
    } else if (bg && bg.id === 'custom') {
      state.customBackgroundSkills.forEach(function (s) { if (s) addSkill(s, 'Custom background'); });
      state.customBackgroundExtras.forEach(function (e) {
        if (!e) return;
        if (e.indexOf('lang:') === 0) addLang(e.slice(5), 'Custom background');
        else addTool(e, 'Custom background');
      });
    }

    /* feats */
    state.feats.forEach(function (f) {
      var feat = DND.findFeat(f.featId);
      if (!feat) return;
      (feat.armor || []).forEach(function (a) { addArmor(a, feat.name); });
      (feat.tools || []).forEach(function (t) { addTool(t, feat.name); });
      (feat.languagesFixed || []).forEach(function (l) { addLang(l, feat.name); });
      (f.skills || []).forEach(function (s) { if (s) addSkill(s, feat.name); });
      (f.tools || []).forEach(function (t) { if (t) addTool(t, feat.name); });
      (f.weapons || []).forEach(function (w) { if (w) addWeapon(w, feat.name); });
      (f.languages || []).forEach(function (l) { if (l) addLang(l, feat.name); });
      (f.expertise || []).forEach(function (s) { if (s) expertise.push({ skill: s, source: feat.name }); });
      (feat.choices || []).forEach(function (c) {
        var v = f.choices && f.choices[c.id];
        if (v && c.type === 'skill') addSkill(v, feat.name);
        if (v && c.type === 'tool') addTool(v, feat.name);
      });
      (feat.toolChoices || []).forEach(function (c) {
        var v = f.choices && f.choices[c.id];
        if (v) addTool(v, feat.name);
      });
      if (feat.saveFromAsi && f.asi) saveProfs.push({ ability: f.asi, source: feat.name });
    });

    /* ---------- Tasha's proficiency swaps ----------
       A swap can change category: a martial weapon may become a tool. Pull the
       entry out of its old bucket and file it under the replacement's category. */
    if (state.options.tashaOrigin && race && !race.noOriginCustomization) {
      var buckets = { armor: armor, weapon: weapons, tool: tools, skill: skills };
      var moves = [];

      Object.keys(buckets).forEach(function (kind) {
        var bucket = buckets[kind];
        for (var i = bucket.length - 1; i >= 0; i--) {
          var entry = bucket[i];
          var rep = state.originSwaps[entry.value];
          if (!rep || rep === entry.value) continue;
          moves.push({ from: entry.value, to: rep, source: entry.source });
          bucket.splice(i, 1);
        }
      });

      moves.forEach(function (m) {
        var target = categoryOf(m.to);
        var entry = { value: m.to, source: m.source, swappedFrom: m.from };
        var bucket = buckets[target];
        var clash = bucket.filter(function (e) { return e.value === m.to; })[0];
        if (clash) {
          warnings.push('Swapping ' + prettyName(m.from) + ' for ' + prettyName(m.to) +
            ' duplicates a proficiency you already have from ' + clash.source + '.');
          return;
        }
        bucket.push(entry);
      });
    }

    /* ---------- derived ---------- */
    var speed = 30;
    if (race) speed = race.speed || 30;
    if (subrace && subrace.speed) speed = subrace.speed;
    var speedNotes = [];
    if (race && race.speedNote) speedNotes.push(race.speedNote);
    state.feats.forEach(function (f) {
      var feat = DND.findFeat(f.featId);
      if (feat && feat.speed) { speed += feat.speed; speedNotes.push(feat.name + ' adds ' + feat.speed + ' feet.'); }
    });

    var darkvision = 0;
    if (race && race.darkvision) darkvision = race.darkvision;
    if (subrace && subrace.darkvision) darkvision = subrace.darkvision;
    if (state.raceChoices.lineageVariable === 'Darkvision 60 feet') darkvision = Math.max(darkvision, 60);

    var size = 'Medium';
    if (race) size = race.size === 'choice' ? (state.raceChoices.__size || 'Medium') : (race.size || 'Medium');

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

    /* skill rows */
    var skillIds = skills.map(function (s) { return s.value; });
    var expertiseIds = expertise.map(function (e) { return e.skill; });
    var skillRows = DND.SKILLS.map(function (sk) {
      var prof = skillIds.indexOf(sk.id) !== -1;
      var exp = expertiseIds.indexOf(sk.id) !== -1;
      var bonus = scores[sk.ability].mod + (prof ? pb : 0) + (exp && prof ? pb : 0);
      var passive = 10 + bonus;
      if (sk.id === 'perception') passive += passivePerceptionBonus;
      if (sk.id === 'investigation') passive += passiveInvestigationBonus;
      var srcEntry = skills.filter(function (s) { return s.value === sk.id; })[0];
      return {
        id: sk.id, name: sk.name, ability: sk.ability, prof: prof, expertise: exp && prof,
        bonus: bonus, passive: passive, source: srcEntry ? srcEntry.source : ''
      };
    });

    /* saving throws — class grants two; until the class module lands, only
       feat-granted proficiencies (Resilient) apply. */
    var saveIds = saveProfs.map(function (s) { return s.ability; });
    var saveRows = DND.ABILITIES.map(function (ab) {
      var prof = saveIds.indexOf(ab.id) !== -1;
      var srcEntry = saveProfs.filter(function (s) { return s.ability === ab.id; })[0];
      return {
        id: ab.id, name: ab.name, abbr: ab.abbr, prof: prof,
        bonus: scores[ab.id].mod + (prof ? pb : 0),
        source: srcEntry ? srcEntry.source : ''
      };
    });

    /* traits */
    var traits = [];
    function addTraits(src, label) {
      if (!src || !src.traits) return;
      src.traits.forEach(function (t) {
        traits.push({ name: t.name, text: t.text, source: label });
      });
    }
    addTraits(race, race ? race.name : '');
    addTraits(subrace, subrace ? subrace.name : '');

    var innate = [];
    [race, subrace].forEach(function (src) {
      if (!src || !src.innateSpells) return;
      src.innateSpells.forEach(function (sp) {
        if (level >= sp.level) innate.push(sp);
      });
    });
    if (state.raceChoices.highElfCantrip) {
      innate.push({ level: 1, name: state.raceChoices.highElfCantrip, use: 'at will', ability: 'int' });
    }

    /* ancestry */
    var ancestry = null;
    if (state.raceChoices.draconicAncestry) {
      ancestry = DND.DRACONIC_ANCESTRY.filter(function (d) {
        return d.id === state.raceChoices.draconicAncestry;
      })[0] || null;
    }

    /* ---------- completeness ---------- */
    var pending = pendingChoices(state, race, subrace, bg, level, racial);

    return {
      name: state.name, level: level, proficiencyBonus: pb,
      race: race, subrace: subrace, background: bg,
      scores: scores, racialAsi: racial,
      skills: skillRows, saves: saveRows,
      languages: languages, tools: tools, armor: armor, weapons: weapons,
      speed: speed, speedNotes: speedNotes, darkvision: darkvision, size: size,
      creatureType: race && race.creatureType ? race.creatureType : 'Humanoid',
      initiative: initiative, hpPerLevel: hpPerLevel,
      traits: traits, innateSpells: innate, ancestry: ancestry,
      asiLevels: asiLevels,
      warnings: warnings, pending: pending,
      xp: DND.XP_THRESHOLDS[level - 1]
    };
  }

  function hasChoice(src, id) {
    return !!(src && src.choices && src.choices.some(function (c) { return c.id === id; }));
  }

  function collectRaceChoices(race, subrace) {
    var out = [];
    if (race && race.choices) out = out.concat(race.choices);
    if (subrace && subrace.choices) out = out.concat(subrace.choices);
    return out;
  }

  function availableAsiLevels(level) {
    return DND.BASE_ASI_LEVELS.filter(function (l) { return l <= level; });
  }

  function pendingChoices(state, race, subrace, bg, level, racial) {
    var out = [];
    if (!race) out.push('Choose a race.');
    if (race && race.subraces && race.subraces.length && !subrace) out.push('Choose a subrace.');
    if (!bg) out.push('Choose a background.');

    if (race && race.size === 'choice' && !state.raceChoices.__size) out.push('Choose your size.');

    if (state.options.tashaOrigin && race && !race.noOriginCustomization) {
      racial.increases.forEach(function (inc, i) {
        if (!state.originAsi[i]) out.push('Assign the +' + inc.amount + ' racial ability increase.');
      });
    } else if (racial) {
      racial.increases.forEach(function (inc, i) {
        if (!inc.fixed && !state.raceChoices['__asi' + i]) {
          out.push('Choose where the +' + inc.amount + ' racial increase goes.');
        }
      });
    }

    collectRaceChoices(race, subrace).forEach(function (c) {
      if (c.showIf) {
        var dep = state.raceChoices[c.showIf.choice];
        if (dep !== c.showIf.equals) return;
      }
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

    /* feats owed */
    var owed = featsOwed(state, race, level);
    var taken = state.feats.length;
    if (taken < owed) out.push('Choose ' + (owed - taken) + ' more feat' + (owed - taken === 1 ? '' : 's') + '.');

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

    availableAsiLevels(level).forEach(function (lv) {
      var slot = state.asiSlots[lv];
      if (!slot || !slot.mode) out.push('Level ' + lv + ': take an ability increase or a feat.');
      else if (slot.mode === 'asi' && (!slot.a || !slot.b)) out.push('Level ' + lv + ': assign both ability increases.');
    });

    return out;
  }

  /* Feats granted outside the level-up track (Variant Human, Custom Lineage),
     plus one for each ASI slot spent on a feat. */
  function featsOwed(state, race, level) {
    var n = 0;
    if (race && race.grantsFeat) n += race.grantsFeat;
    availableAsiLevels(level).forEach(function (lv) {
      var slot = state.asiSlots[lv];
      if (slot && slot.mode === 'feat') n += 1;
    });
    return n;
  }

  /* Prerequisite check against the current computed sheet. */
  function meetsPrereq(feat, computed, state) {
    if (!feat.prereq) return { ok: true };
    var p = feat.prereq, reasons = [];

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
    if (p.armor) {
      var have = computed.armor.some(function (a) { return a.value === p.armor; });
      if (!have) reasons.push(p.armor + ' proficiency');
    }
    if (p.spellcasting) reasons.push('__spellcasting');
    if (p.custom) reasons.push('__custom:' + p.custom);

    var hard = reasons.filter(function (r) { return r.indexOf('__') !== 0; });
    var soft = reasons.filter(function (r) { return r.indexOf('__') === 0; });

    return {
      ok: hard.length === 0,
      reasons: hard,
      unverified: soft.map(function (s) {
        return s === '__spellcasting' ? 'Requires the Spellcasting feature' : 'Requires: ' + s.slice(9);
      })
    };
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
    racialIncreases: racialIncreases,
    collectRaceChoices: collectRaceChoices,
    availableAsiLevels: availableAsiLevels,
    featsOwed: featsOwed,
    meetsPrereq: meetsPrereq,
    pointBuySpent: pointBuySpent,
    emptyScores: emptyScores,
    prettyName: prettyName,
    categoryOf: categoryOf
  };
})();
