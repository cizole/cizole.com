// The room directory: one list of every room. The lobby draws its grid from it,
// and every room gets a "rooms" menu next to its lobby link, so you can go
// room to room without scrolling the lobby.
(() => {
  const ROOMS = [
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
    { n: '016', slug: 'junk-drawer', name: 'junk drawer', blurb: 'no organizational guarantees' },
    { n: '017', slug: 'basement', name: 'the basement', blurb: 'the doors go to the rooms. mostly.' },
    { n: '018', slug: 'weather', name: 'weather', blurb: 'it is not snowing in here' },
    { n: '019', slug: 'escher', name: 'escher room', blurb: 'every way is up' },
    { n: '020', slug: 'sauna', name: 'sauna', blurb: "it's never enough" },
    { n: '021', slug: 'freezer', name: 'freezer', blurb: 'the door closes. they do that.' },
    { n: '022', slug: 'about', name: 'about', blurb: 'regrettably, a person' },
  ];
  window.CIZOLE_ROOMS = ROOMS;

  // which room is this? /eyes/ or /eyes/index.html -> "eyes"
  const parts = location.pathname.split('/').filter(Boolean);
  if (parts.length && /\.html?$/.test(parts[parts.length - 1])) parts.pop();
  const here = ROOMS.findIndex(r => r.slug === parts[parts.length - 1]);
  if (here >= 0) {
    try { sessionStorage.setItem('cizole.last-room', ROOMS[here].slug); } catch (err) { /* storage off */ }
  }

  const lobbyLink = document.querySelector('.lobby-link');
  if (here < 0 || !lobbyLink) return; // the lobby draws its own list

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
    const item = document.createElement(i === here ? 'span' : 'a');
    item.className = 'rooms-item' + (i === here ? ' here' : '');
    if (i === here) item.setAttribute('aria-current', 'page');
    else item.href = `../${r.slug}/`;
    const num = document.createElement('span');
    num.className = 'rooms-num';
    num.textContent = r.n;
    item.append(num, ' ', i === here ? `${r.name} (you are here)` : r.name);
    grid.appendChild(item);
  });

  const prev = ROOMS[(here - 1 + ROOMS.length) % ROOMS.length];
  const next = ROOMS[(here + 1) % ROOMS.length];
  const foot = document.createElement('div');
  foot.className = 'rooms-foot';
  const link = (href, text) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    return a;
  };
  foot.append(
    link(`../${prev.slug}/`, `← ${prev.n} ${prev.name}`),
    link('../', 'lobby'),
    link(`../${next.slug}/`, `${next.n} ${next.name} →`),
  );
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
