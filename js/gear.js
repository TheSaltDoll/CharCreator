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
  function knowsWeapon(profs, w) {
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

  DND.Gear = {
    blank: blank,
    choosers: CHOOSERS,

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
          acFromArmor.push({ label: a.name, value: a.base + dex, armor: a,
            note: a.acText + (a.stealthDisadvantage ? ' \u00b7 stealth disadvantage' : '') });
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
        if (!w || knowsWeapon(weaponProfs, w)) return;
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
