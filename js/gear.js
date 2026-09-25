/* Equipment: what you start with, what you buy, what it costs, and what it
   does to your armor class.

   Money is copper everywhere. Starting equipment comes from your first class
   only — multiclassing grants proficiencies but no further equipment (PHB 163)
   — plus your background's gold, which seeds the purse but can be overridden.

   Items you were granted and then dropped are not refunded: they were never
   bought. Items you bought and then removed are. */

(function () {
  'use strict';

  var CHOOSERS = {
    simple:      { label: 'any simple weapon',        pick: function () { return weapons('simple'); } },
    martial:     { label: 'any martial weapon',       pick: function () { return weapons('martial'); } },
    simpleMelee: { label: 'any simple melee weapon',  pick: function () { return weapons('simple', 'melee'); } },
    martialMelee:{ label: 'any martial melee weapon', pick: function () { return weapons('martial', 'melee'); } },
    instrument:  { label: 'a musical instrument',     pick: function () { return tools('instrument'); } },
    artisanTools:{ label: "artisan's tools",          pick: function () { return tools('artisan'); } },
    arcaneFocus: { label: 'an arcane focus',          pick: function () { return prefixed('Arcane focus:'); } },
    druidicFocus:{ label: 'a druidic focus',          pick: function () { return prefixed('Druidic focus:'); } },
    holySymbol:  { label: 'a holy symbol',            pick: function () { return prefixed('Holy symbol:'); } }
  };

  /* Firearms are outside the three books, and the advanced ones need DM
     approval, so neither belongs in a class's starting equipment. */
  function weapons(cat, kind) {
    return DND.WEAPONS.filter(function (w) {
      return w.category === cat && !w.firearm && (!kind || w.kind === kind);
    }).map(function (w) { return w.name; });
  }
  function tools(kind) {
    return DND.TOOL_ITEMS.filter(function (t) { return t.kind === kind; })
      .map(function (t) { return t.name; });
  }
  function prefixed(pre) {
    return DND.GEAR.filter(function (g) { return g.name.indexOf(pre) === 0; })
      .map(function (g) { return g.name; });
  }


  var ARMOR_PROF = { light: 'Light armor', medium: 'Medium armor', heavy: 'Heavy armor', shield: 'Shields' };

  /* Firearms borrow an existing weapon's proficiency: a Carbine is used with
     Light crossbow proficiency, a Musket with Heavy crossbow, and so on. */
  function profWeapon(w) {
    return (w.proxy && DND.findWeapon(w.proxy)) || w;
  }
  function knowsWeapon(profs, w, opts) {
    /* The Gunner feat grants proficiency with firearms outright (TCE 80). */
    if (w.firearm && opts && opts.firearms) return true;
    var ref = profWeapon(w);
    if (profs.indexOf(ref.name) !== -1) return true;
    return profs.indexOf(ref.category === 'simple' ? 'Simple weapons' : 'Martial weapons') !== -1;
  }
  function knowsArmor(profs, cat) {
    return profs.indexOf(ARMOR_PROF[cat]) !== -1;
  }

  function blank() {
    return { choices: {}, picks: {}, dropped: {}, bought: {}, purse: null };
  }

  /* One line of starting equipment. `key` stays stable so it can be dropped. */
  function resolve(item, key, gear, source, out) {
    if (item.choose) {
      var opts = CHOOSERS[item.choose] ? CHOOSERS[item.choose].pick() : [];
      var picked = gear.picks[key];
      out.push({ key: key, name: picked || null, qty: 1, source: source,
                 choose: item.choose, chooseLabel: CHOOSERS[item.choose].label, options: opts });
    } else {
      out.push({ key: key, name: item.name, qty: item.qty || 1, source: source });
    }
  }

  /* The starting-equipment offer for the first class: each group with its
     options, plus the items granted outright. */
  function startingFor(classId, gear) {
    var def = DND.STARTING_EQUIPMENT[classId];
    if (!def) return null;
    var groups = def.groups.map(function (g, gi) {
      var key = classId + ':' + gi;
      var chosen = gear.choices[key];
      if (chosen === undefined || !g.options[chosen]) chosen = null;
      var items = [];
      if (chosen !== null) {
        g.options[chosen].items.forEach(function (it, ii) {
          resolve(it, key + ':' + ii, gear, g.label, items);
        });
      }
      return { key: key, label: g.label, options: g.options, chosen: chosen, items: items };
    });
    var fixed = [];
    (def.fixed || []).forEach(function (it, ii) {
      resolve(it, classId + ':fixed:' + ii, gear, 'Class equipment', fixed);
    });
    return { groups: groups, fixed: fixed };
  }

  function lookup(name) { return name ? DND.findGear(name) : null; }

  /* ---------------------------------------------------------------
     Attacks: to-hit and damage for the weapons you carry.

     Making an Attack (PHB 193): melee weapon attacks use Strength and
     ranged weapon attacks Dexterity, and the proficiency bonus is added only
     when proficient. Weapon properties (Weapons, PHB 146): a finesse weapon
     uses either, the same one for attack and damage; a thrown melee weapon
     keeps its melee ability. Damage and Healing (PHB 196): damage adds the
     ability modifier used for the attack.
     --------------------------------------------------------------- */
  function diceAverage(d) {
    var m = /^(\d+)d(\d+)$/.exec(d);
    if (m) return m[1] * (Number(m[2]) + 1) / 2;
    var n = Number(d);
    return isNaN(n) ? 0 : n;
  }
  /* '1d8' and +3 -> '1d8+3'; a flat '1' and +3 -> '4', never below 0 */
  function damageText(dice, mod) {
    if (/^\d+$/.test(dice)) return String(Math.max(0, Number(dice) + mod));
    return mod ? dice + DND.formatMod(mod) : dice;
  }
  function parseDamage(s) {
    var m = s ? /^(\d+d\d+|\d+)\s+(.+)$/.exec(s) : null;
    return m ? { dice: m[1], type: m[2] } : null;
  }
  function bestAbility(ids, mods) {
    return ids.reduce(function (a, b) { return mods[b] > mods[a] ? b : a; });
  }

  function weaponAttack(w, ctx) {
    var has = function (p) { return w.properties.indexOf(p) !== -1; };
    var proficient = knowsWeapon(ctx.profs, w, { firearms: ctx.firearms });

    /* Monk weapons are shortswords and simple melee weapons without the
       two-handed or heavy property (Monk, PHB 76); kensei weapons count too (XGE 34). */
    var monkWeapon = !!ctx.martialArts && (w.name === 'Shortsword' ||
      (w.category === 'simple' && w.kind === 'melee' && !has('two-handed') && !has('heavy')) ||
      ctx.kensei.indexOf(w.name) !== -1);

    /* Martial Arts lets a monk use Dexterity *instead of Strength*,
       so it widens melee weapons only; finesse allows either for any weapon. */
    var base = w.kind === 'melee' ? 'str' : 'dex';
    var options = has('finesse') || (monkWeapon && base === 'str') ? ['str', 'dex'] : [base];
    var ability = bestAbility(options, ctx.mods);
    var mod = ctx.mods[ability];
    var archery = ctx.styles.archery && w.kind === 'ranged' ? 2 : 0;   /* ranged weapons only */
    var toHit = mod + (proficient ? ctx.pb : 0) + archery;

    var row = { name: w.name, ability: ability, proficient: proficient, toHit: toHit,
                damage: null, damageType: null, twoHanded: null, thrown: null,
                properties: w.text && w.text !== '\u2014' ? w.text : null, notes: [] };

    var dmg = parseDamage(w.damage);
    if (!dmg) {
      row.damage = w.damage ? w.damage : '\u2014';     /* Grenade: Special; Net: none */
    } else {
      var dice = dmg.dice, twoDice = has('versatile') ? w.versatile : null;
      /* the Martial Arts die replaces the weapon's die when it is better */
      if (monkWeapon) {
        var ma = '1' + ctx.martialArts;
        if (diceAverage(ma) > diceAverage(dice)) { dice = ma; row.notes.push('Martial Arts die'); }
        if (twoDice && diceAverage(ma) >= diceAverage(twoDice)) twoDice = null;
      }
      /* Dueling: +2 damage with a melee weapon held in one hand and no other
         weapon (PHB 72). It does not apply when a versatile weapon is used two-handed. */
      var dueling = ctx.styles.dueling && w.kind === 'melee' && !has('two-handed') ? 2 : 0;
      /* Thrown Weapon Fighting: +2 damage on a ranged attack with a thrown weapon (TCE 42) */
      var thrownBonus = ctx.styles.thrownWeapon && has('thrown') ? 2 : 0;

      row.damageType = dmg.type;
      if (w.kind === 'ranged') {
        row.damage = damageText(dice, mod + thrownBonus);
      } else {
        row.damage = damageText(dice, mod + dueling);
        if (twoDice) row.twoHanded = damageText(twoDice, mod);
        if (has('thrown')) {
          var thrownDamage = damageText(dice, mod + thrownBonus);
          row.thrown = { range: w.range, damage: thrownDamage !== row.damage ? thrownDamage : null };
        }
      }
      if (dueling) row.notes.push('Dueling +2 included; one weapon in hand');
      if (ctx.styles.greatWeapon && w.kind === 'melee' && (has('two-handed') || twoDice)) {
        row.notes.push('Great Weapon Fighting: reroll 1s and 2s' + (twoDice ? ' two-handed' : ''));
      }

      /* Hex Warrior: the weapon touched after a long rest may use Charisma
         (XGE 55). Chosen per rest, so shown as an alternative, not applied. */
      if (ctx.hexWarrior && proficient && !has('two-handed') && ctx.mods.cha > mod) {
        row.notes.push('As your Hex Warrior weapon: ' + DND.formatMod(ctx.mods.cha + ctx.pb + archery) +
          ' to hit, ' + damageText(dice, ctx.mods.cha + (w.kind === 'ranged' ? thrownBonus : dueling)));
      }
    }
    if (!proficient) row.notes.push('Not proficient: no proficiency bonus');
    if (has('heavy') && ctx.small) row.notes.push('Heavy: disadvantage for a Small creature');
    return row;
  }

  /* An unarmed strike is listed only when something improves it. This PHB
     printing puts it in the Simple Melee Weapons table dealing 1 bludgeoning,
     plus the Strength modifier as for any melee weapon; Tavern Brawler makes
     it a d4 and grants proficiency (PHB 170); Martial Arts supplies its die
     and Dexterity (Monk, PHB 76); Unarmed Fighting makes it 1d6 + Strength, or 1d8
     with no weapon or shield in hand (TCE 42). */
  function unarmedAttack(ctx) {
    var tavern = ctx.feats.indexOf('tavernBrawler') !== -1;
    var monk = !!ctx.martialArts;
    if (!tavern && !monk && !ctx.styles.unarmedFighting) return null;
    var either = monk ? ['str', 'dex'] : ['str'];
    var cands = [{ dice: '1', abilities: either }];
    if (tavern) cands.push({ dice: '1d4', abilities: either });
    if (monk) cands.push({ dice: '1' + ctx.martialArts, abilities: either, note: 'Martial Arts die' });
    if (ctx.styles.unarmedFighting) cands.push({ dice: '1d6', abilities: ['str'], alt: '1d8' });
    var pick = null, pickAbility = null, pickScore = -Infinity;
    cands.forEach(function (c) {
      var ab = bestAbility(c.abilities, ctx.mods);
      var score = diceAverage(c.dice) + ctx.mods[ab];
      if (score > pickScore) { pick = c; pickAbility = ab; pickScore = score; }
    });
    var mod = ctx.mods[pickAbility];
    var proficient = tavern || ctx.profs.indexOf('Simple weapons') !== -1;
    var row = { name: 'Unarmed strike', ability: pickAbility, proficient: proficient,
                toHit: mod + (proficient ? ctx.pb : 0), damage: damageText(pick.dice, mod),
                damageType: 'bludgeoning', twoHanded: null, thrown: null, properties: null, notes: [] };
    if (pick.note) row.notes.push(pick.note);
    if (pick.alt) row.notes.push('With no weapon or shield in hand: ' + damageText(pick.alt, mod));
    if (!proficient) row.notes.push('Not proficient: no proficiency bonus');
    return row;
  }

  /* One row per kind of weapon carried, quantities summed, then any unarmed strike. */
  function attacks(inventory, ctx) {
    var byName = {}, rows = [];
    inventory.forEach(function (it) {
      var w = DND.findWeapon(it.name);
      if (!w) return;
      if (byName[w.name]) { byName[w.name].qty += it.qty; return; }
      var row = weaponAttack(w, ctx);
      row.qty = it.qty;
      byName[w.name] = row;
      rows.push(row);
    });
    var unarmed = unarmedAttack(ctx);
    if (unarmed) rows.push(unarmed);
    return rows;
  }

  DND.Gear = {
    blank: blank,
    choosers: CHOOSERS,
    attacks: attacks,
    knowsWeapon: knowsWeapon,

    /* Everything the Equipment step and the sheet need. */
    compute: function (state, classEntries, background, ctx) {
      ctx = ctx || {};
      var dexMod = ctx.dexMod || 0;
      var armorProfs = ctx.armorProfs || [], weaponProfs = ctx.weaponProfs || [];
      var gear = state.gear || blank();
      var firstClass = classEntries.length ? classEntries[0].cls.id : null;
      var start = firstClass ? startingFor(firstClass, gear) : null;

      var lines = [], pending = [];
      if (start) {
        start.groups.forEach(function (g) {
          if (g.chosen === null) { pending.push('Equipment: choose your ' + g.label.toLowerCase() + '.'); return; }
          g.items.forEach(function (it) { lines.push(it); });
        });
        start.fixed.forEach(function (it) { lines.push(it); });
        lines.forEach(function (it) {
          if (it.choose && !it.name) pending.push('Equipment: choose ' + it.chooseLabel + '.');
        });
      }
      if (background && background.equipment) {
        lines.push({ key: 'bg', name: null, qty: 1, source: background.name,
                     text: background.equipment, granted: true });
      }

      /* granted items, minus anything dropped */
      var kept = lines.filter(function (it) { return !gear.dropped[it.key] && (it.name || it.text); });

      /* what was bought */
      var bought = Object.keys(gear.bought)
        .filter(function (n) { return gear.bought[n] > 0; })
        .map(function (n) {
          var g2 = lookup(n);
          return { name: n, qty: gear.bought[n], source: 'Purchased',
                   cost: g2 ? g2.cost : null, weight: g2 ? g2.weight : 0, bought: true };
        })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });

      var spent = bought.reduce(function (n, it) {
        return n + (it.cost || 0) * it.qty;
      }, 0);

      var defaultPurse = background && background.gold ? background.gold : 0;
      var purse = gear.purse === null || gear.purse === undefined ? defaultPurse : gear.purse;

      /* one inventory, granted first, with weights resolved */
      var inventory = kept.filter(function (it) { return it.name; }).map(function (it) {
        var g3 = lookup(it.name);
        return { name: it.name, qty: it.qty, source: it.source, key: it.key,
                 cost: g3 ? g3.cost : null, weight: g3 ? g3.weight : 0,
                 pack: !!(g3 && g3.contents), contents: g3 && g3.contents };
      }).concat(bought);

      var weight = inventory.reduce(function (n, it) { return n + (it.weight || 0) * it.qty; }, 0);

      /* armor you are carrying, as AC options */
      var hasShield = inventory.some(function (it) { return it.name === 'Shield'; });
      var acFromArmor = [], armorNotes = [], weaponNotes = [], unskilledArmor = false;

      inventory.forEach(function (it) {
        var a = DND.ARMOR.filter(function (x) { return x.name === it.name; })[0];
        if (!a) return;

        if (a.name !== 'Shield') {
          /* light armor has no Dex cap at all, so guard on the type rather
             than on null: a missing key used to make this NaN. */
          var dex = typeof a.dexMax === 'number' ? Math.min(dexMod, a.dexMax) : dexMod;
          /* Defense: +1 AC while wearing armor (PHB 72). A shield alone is not armor. */
          var armored = ctx.armoredAcBonus || 0;
          acFromArmor.push({ label: a.name, value: a.base + dex + armored, armor: a,
            proficient: knowsArmor(armorProfs, a.category),
            note: a.acText + (a.stealthDisadvantage ? ' \u00b7 stealth disadvantage' : '') +
                  (armored ? ' Defense +' + armored + '.' : '') });
        }

        /* Strength minimum: too weak and the armor costs you 10 feet of
           speed, though dwarves are never slowed by it (PHB 144, 20). */
        if (a.strength && ctx.strScore !== undefined && ctx.strScore < a.strength) {
          armorNotes.push(ctx.isDwarf
            ? a.name + ' needs Strength ' + a.strength + '. You have ' + ctx.strScore +
              ', but dwarves are never slowed by armor.'
            : a.name + ' needs Strength ' + a.strength + '. With ' + ctx.strScore +
              ', wearing it drops your speed by 10 feet.');
        }

        if (!knowsArmor(armorProfs, a.category)) {
          unskilledArmor = true;
          armorNotes.push('You are not proficient with ' +
            (a.category === 'shield' ? 'shields' : a.category + ' armor') +
            '. You still get the AC from ' + a.name + ', but you have disadvantage on any ability ' +
            'check, saving throw, or attack roll that uses Strength or Dexterity, and you cannot cast spells.');
        }
      });

      inventory.forEach(function (it) {
        var w = DND.findWeapon(it.name);
        if (!w || knowsWeapon(weaponProfs, w, { firearms: ctx.firearmsProficient })) return;
        var ref = profWeapon(w);
        weaponNotes.push('You are not proficient with ' + w.name +
          (ref !== w ? ' (it uses ' + ref.name + ' proficiency)' : '') +
          '. You can still use it, but you add no proficiency bonus to its attack rolls.');
      });

      return {
        start: start, groups: start ? start.groups : [], fixedItems: start ? start.fixed : [],
        firstClass: firstClass, backgroundLine: background && background.equipment ? background : null,
        inventory: inventory, bought: bought, weight: Math.round(weight * 100) / 100,
        purseCp: purse, defaultPurseCp: defaultPurse, spentCp: spent, remainingCp: purse - spent,
        acFromArmor: acFromArmor, hasShield: hasShield, pending: pending,
        shieldProficient: knowsArmor(armorProfs, 'shield'),
        armorNotes: armorNotes, weaponNotes: weaponNotes,
        wearingUnskilledArmor: unskilledArmor,
        wearingArmor: acFromArmor.length > 0
      };
    },

    /* Shop shelves. Advanced firearms are kept in their own group, flagged. */
    catalog: function () {
      var byCat = function (cat, kind) {
        return DND.WEAPONS.filter(function (w) {
          return w.category === cat && w.kind === kind && !w.advanced &&
            (!w.firearm || cat === 'simple' || cat === 'martial');
        });
      };
      var shelves = [
        { group: 'Simple melee weapons', items: byCat('simple', 'melee') },
        { group: 'Simple ranged weapons', items: byCat('simple', 'ranged') },
        { group: 'Martial melee weapons', items: byCat('martial', 'melee') },
        { group: 'Martial ranged weapons', items: byCat('martial', 'ranged') },
        { group: 'Advanced firearms', note: 'Requires special access and DM approval.',
          items: DND.WEAPONS.filter(function (w) { return w.advanced; }) },
        { group: 'Light armor', items: DND.ARMOR.filter(function (a) { return a.category === 'light'; }) },
        { group: 'Medium armor', items: DND.ARMOR.filter(function (a) { return a.category === 'medium'; }) },
        { group: 'Heavy armor', items: DND.ARMOR.filter(function (a) { return a.category === 'heavy'; }) },
        { group: 'Shield', items: DND.ARMOR.filter(function (a) { return a.category === 'shield'; }) },
        { group: 'Equipment packs', items: DND.PACKS },
        { group: "Artisan's tools", items: DND.TOOL_ITEMS.filter(function (t) { return t.kind === 'artisan'; }) },
        { group: 'Kits and tools', items: DND.TOOL_ITEMS.filter(function (t) { return t.kind === 'kit'; }) },
        { group: 'Gaming sets', items: DND.TOOL_ITEMS.filter(function (t) { return t.kind === 'gaming'; }) },
        { group: 'Musical instruments', items: DND.TOOL_ITEMS.filter(function (t) { return t.kind === 'instrument'; }) },
        { group: 'Adventuring gear', items: DND.GEAR }
      ];
      return shelves.filter(function (s) { return s.items.length; });
    }
  };
})();
