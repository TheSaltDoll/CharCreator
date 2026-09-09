/* Small DOM helpers and shared widgets. No state lives here. */
window.DND = window.DND || {};

DND.UI = (function () {

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  /* A labelled <select>. options: [{value,label,disabled}] */
  function select(opts) {
    var s = el('select', { id: opts.id || null, 'aria-label': opts.ariaLabel || opts.label || null });
    if (opts.placeholder !== false) {
      s.appendChild(el('option', { value: '', text: opts.placeholder || 'Choose\u2026' }));
    }
    (opts.options || []).forEach(function (o) {
      if (o.group) {
        var g = el('optgroup', { label: o.group });
        o.options.forEach(function (c) { g.appendChild(makeOption(c)); });
        s.appendChild(g);
      } else {
        s.appendChild(makeOption(o));
      }
    });
    s.value = opts.value === undefined || opts.value === null ? '' : opts.value;
    if (opts.onchange) s.addEventListener('change', function () { opts.onchange(s.value); });
    return s;
  }

  function makeOption(o) {
    return el('option', {
      value: o.value,
      text: o.label,
      disabled: o.disabled ? 'disabled' : null,
      title: o.title || null
    });
  }

  function field(label, control, hint) {
    var kids = [el('span', { class: 'field-label', text: label }), control];
    if (hint) kids.push(el('p', { class: 'field-hint', text: hint }));
    return el('label', { class: 'field' }, kids);
  }

  function toggle(opts) {
    var input = el('input', { type: 'checkbox', checked: opts.checked ? 'checked' : null });
    input.checked = !!opts.checked;
    input.addEventListener('change', function () { opts.onchange(input.checked); });
    var body = [el('strong', {}, [
      document.createTextNode(opts.label),
      opts.source ? el('em', { class: 'source-tag', text: opts.source }) : null
    ])];
    if (opts.description) body.push(el('span', { text: opts.description }));
    return el('label', { class: 'toggle' }, [input, el('span', { class: 'toggle-body' }, body)]);
  }

  function skillOptions(exclude) {
    exclude = exclude || [];
    return DND.SKILLS.map(function (s) {
      return { value: s.id, label: s.name + ' (' + abbr(s.ability) + ')', disabled: exclude.indexOf(s.id) !== -1 };
    });
  }

  function languageOptions(exclude) {
    exclude = exclude || [];
    var std = [], exo = [];
    DND.LANGUAGES.forEach(function (l) {
      if (l.type === 'secret') return;
      var o = { value: l.id, label: l.name, disabled: exclude.indexOf(l.id) !== -1 };
      (l.type === 'standard' ? std : exo).push(o);
    });
    return [{ group: 'Standard', options: std }, { group: 'Exotic', options: exo }];
  }

  function toolOptions(from) {
    if (from === 'all' || !from) {
      return Object.keys(DND.TOOLS).map(function (k) {
        return { group: DND.TOOLS[k].label, options: DND.TOOLS[k].items.map(strOpt) };
      });
    }
    if (Array.isArray(from)) return from.map(strOpt);
    if (DND.TOOLS[from]) return DND.TOOLS[from].items.map(strOpt);
    return [];
  }

  function strOpt(s) { return { value: s, label: s }; }

  function abilityOptions(allowed, exclude) {
    allowed = allowed || DND.ABILITIES.map(function (a) { return a.id; });
    exclude = exclude || [];
    return DND.ABILITIES.filter(function (a) { return allowed.indexOf(a.id) !== -1; })
      .map(function (a) {
        return { value: a.id, label: a.name, disabled: exclude.indexOf(a.id) !== -1 };
      });
  }

  function abbr(id) {
    var a = DND.ABILITIES.filter(function (x) { return x.id === id; })[0];
    return a ? a.abbr : id;
  }

  function statRow(label, value, dim) {
    return el('div', { class: 'stat-row' + (dim ? ' dim' : '') }, [
      el('span', { class: 'lbl', text: label }),
      el('span', { class: 'val', text: value })
    ]);
  }

  return {
    el: el, clear: clear, select: select, field: field, toggle: toggle,
    skillOptions: skillOptions, languageOptions: languageOptions,
    toolOptions: toolOptions, abilityOptions: abilityOptions,
    strOpt: strOpt, abbr: abbr, statRow: statRow
  };
})();
