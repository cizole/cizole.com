// The room directory: one list of every room. The lobby draws its list from it,
// and every room gets a "rooms" menu next to its lobby link, so you can go
// room to room without scrolling the lobby.
//
// Room numbers are permanent. A retired room stays here with `defunct: '<reason>'`:
// it shows as closed (struck through, not clickable) everywhere rooms are listed.
// A room with `hidden: true` is a secret: it's left out of every list until the
// visitor has unlocked it (the lobby's Konami code sets `cizole.nothing`).
(() => {
  const ALL = [
    { n: '001', slug: 'eyes', name: 'eyes', blurb: "they're watching" },
    { n: '002', slug: 'button', name: 'the button', blurb: "it doesn't want this" },
    { n: '003', slug: 'trip', name: 'trip', blurb: "don't stare too long" },
    { n: '004', slug: 'escape', name: 'escape room', blurb: "there's a way out. probably." },
    { n: '005', slug: 'server-room', name: 'server room', blurb: "please don't touch anything" },
    { n: '006', slug: 'funky-town', name: 'funky town', blurb: 'population: you' },
    { n: '007', slug: 'roomba-room', name: 'roomba room', blurb: "it's doing its best" },
    { n: '008', slug: 'fish-tank', name: 'fish tank', blurb: 'please do not tap the glass' },
    { n: '009', slug: 'blacklight', name: 'blacklight room', blurb: 'some things only show up in the dark' },
    { n: '010', slug: 'game-room', name: 'game room', blurb: 'insert token' },
    { n: '011', slug: '70s', name: 'the 70s', blurb: 'it will always be 1976 in here' },
    { n: '012', slug: '80s', name: 'the 80s', blurb: 'be kind, rewind' },
    { n: '013', slug: '90s', name: 'the 90s', blurb: 'best viewed in 800x600' },
    { n: '014', slug: 'other-window', name: 'the other window', blurb: 'bring a second window', featured: true },
    { n: '015', slug: 'mirror', name: 'mirror', blurb: 'looks normal', defunct: 'closed. it was weird. even for here.' },
    { n: '016', slug: 'junk-drawer', name: 'junk drawer', blurb: 'no organizational guarantees' },
    { n: '017', slug: 'basement', name: 'the basement', blurb: 'the doors go to the rooms. mostly.' },
    { n: '018', slug: 'weather', name: 'weather', blurb: 'it is not snowing in here' },
    { n: '019', slug: 'escher', name: 'escher room', blurb: 'every way is up' },
    { n: '020', slug: 'sauna', name: 'sauna', blurb: "it's never enough" },
    { n: '021', slug: 'freezer', name: 'freezer', blurb: 'the door closes. they do that.' },
    { n: '022', slug: 'retro', name: 'retro gaming', blurb: 'blow on it first' },
    { n: '023', slug: 'nothing', name: 'nothing', blurb: "you weren't supposed to find this", hidden: true },
    // 023 is the secret room for good. new rooms start at 024 and go above this line;
    // the missing 023 in the lobby is the clue. about is always 999 and always last.
    { n: '999', slug: 'about', name: 'about', blurb: 'regrettably, a person' },
  ];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (err) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (err) { /* storage off */ } },
  };
  const unlocked = store.get('cizole.nothing') === '1';
  const ROOMS = ALL.filter(r => !r.hidden || unlocked);
  window.CIZOLE_ROOMS = ROOMS;
  window.CIZOLE_ALL_ROOMS = ALL;

  // which room is this? /eyes/ or /eyes/index.html -> "eyes"
  const parts = location.pathname.split('/').filter(Boolean);
  if (parts.length && /\.html?$/.test(parts[parts.length - 1])) parts.pop();
  const slug = parts[parts.length - 1];
  const room = ALL.find(r => r.slug === slug) || null;
  const here = ROOMS.findIndex(r => r.slug === slug);

  // the stamp card: every room you've set foot in, kept per visitor
  let visited = [];
  try { visited = JSON.parse(store.get('cizole.visited') || '[]'); } catch (err) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  if (room && !room.defunct && !visited.includes(room.slug)) {
    visited.push(room.slug);
    store.set('cizole.visited', JSON.stringify(visited));
  }
  window.CIZOLE_VISITED = visited;

  if (room) {
    try { sessionStorage.setItem('cizole.last-room', room.slug); } catch (err) { /* storage off */ }
    // the tab title comes from this list too, so renaming a room here renames it everywhere
    document.title = `${room.name}${room.defunct ? ' (closed)' : ''} · cizole`;
  }

  // the lobby has no lobby link and draws its own list. a room missing from this list
  // (say, a cached copy older than the room) still gets the menu, just without prev/next.
  const lobbyLink = document.querySelector('.lobby-link');
  if (!lobbyLink) return;

  // ---------- the "rooms" menu ----------
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'rooms-btn';
  btn.textContent = 'rooms';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'rooms-panel');

  const panel = document.createElement('nav');
  panel.className = 'rooms-panel';
  panel.id = 'rooms-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'rooms');

  const grid = document.createElement('div');
  grid.className = 'rooms-grid';
  ROOMS.forEach((r, i) => {
    const linked = i !== here && !r.defunct;
    const item = document.createElement(linked ? 'a' : 'span');
    item.className = 'rooms-item' + (i === here ? ' here' : '') + (r.defunct ? ' defunct' : '') + (visited.includes(r.slug) ? ' seen' : '');
    if (i === here) item.setAttribute('aria-current', 'page');
    if (linked) item.href = `../${r.slug}/`;
    if (r.defunct) item.title = r.defunct;
    const num = document.createElement('span');
    num.className = 'rooms-num';
    num.textContent = r.n;
    const name = document.createElement('span');
    name.className = 'rooms-name';
    name.textContent = r.name;
    item.append(num, ' ', name);
    if (r.defunct) item.append(' (closed)');
    else if (i === here) item.append(' (you are here)');
    grid.appendChild(item);
  });

  const foot = document.createElement('div');
  foot.className = 'rooms-foot';
  const link = (href, text) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    return a;
  };
  // prev/next skip closed rooms
  const open = (from, step) => {
    for (let k = 1; k <= ROOMS.length; k++) {
      const r = ROOMS[(from + step * k + ROOMS.length * k) % ROOMS.length];
      if (!r.defunct) return r;
    }
    return null;
  };
  const prev = here >= 0 ? open(here, -1) : null;
  const next = here >= 0 ? open(here, 1) : null;
  if (prev && next) {
    foot.append(
      link(`../${prev.slug}/`, `← ${prev.n} ${prev.name}`),
      link('../', 'lobby'),
      link(`../${next.slug}/`, `${next.n} ${next.name} →`),
    );
    const keys = document.createElement('div');
    keys.className = 'rooms-keys';
    keys.textContent = 'keys: < previous room · next room >';
    foot.appendChild(keys);
    // < and > hop rooms from anywhere, as long as you're not typing
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === '<') location.href = `../${prev.slug}/`;
      else if (e.key === '>') location.href = `../${next.slug}/`;
    });
  } else {
    foot.append(link('../', 'lobby'));
  }
  panel.append(grid, foot);
  document.body.append(btn, panel);

  function position() {
    const r = lobbyLink.getBoundingClientRect();
    btn.style.left = Math.round(r.right + 8) + 'px';
    btn.style.top = Math.round(r.top) + 'px';
    panel.style.top = Math.round(r.bottom + 8) + 'px';
  }
  position();
  addEventListener('resize', position);
  if (document.fonts) document.fonts.ready.then(position);

  function setOpen(open, fromKeyboard) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('on', open);
    if (open) {
      position();
      const first = panel.querySelector('a');
      if (first && fromKeyboard) first.focus({ preventScroll: true });
    }
  }
  btn.addEventListener('click', e => {
    e.stopPropagation();
    setOpen(panel.hidden, e.detail === 0);
  });
  document.addEventListener('pointerdown', e => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) setOpen(false);
  }, true);
  // capture phase, so rooms that use Escape themselves don't see this one
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) {
      e.stopPropagation();
      setOpen(false);
      btn.focus({ preventScroll: true });
    }
  }, true);
})();
