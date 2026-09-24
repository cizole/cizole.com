// Every page notices when you leave.
// While the tab is hidden, the title and favicon change. Rooms can react through
// window events: `cizole:leave`, and `cizole:return` with `detail.awayMs`.
(() => {
  const LINES = [
    'come back',
    'we moved the furniture',
    "it's quiet without you",
    'hello?',
    '(1) new absence',
    'still here',
    'the lights are off in here',
    'we can hear the other tab',
    'take your time. or don\'t.',
  ];
  const BACK = "oh. you're back.";
  const OURS = new Set([...LINES, BACK]);

  // the favicon's eye looks off to the side while you're gone
  const LOOKING_AWAY = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
    '<rect width="32" height="32" rx="7" fill="#0e0d0b"/>' +
    '<path d="M3 16 Q16 4 29 16 Q16 28 3 16 Z" fill="#ebe5d6"/>' +
    '<circle cx="9" cy="14" r="5" fill="#c8ff3d"/>' +
    '<circle cx="8" cy="13.5" r="2.4" fill="#0e0d0b"/>' +
    '</svg>'
  );
  const icon = document.querySelector('link[rel="icon"]');
  const iconHref = icon ? icon.getAttribute('href') : null;

  let baseTitle = document.title;
  let leftAt = 0;
  let timer = 0;

  function cycle(i) {
    document.title = LINES[i % LINES.length];
    timer = setTimeout(() => cycle(i + 1), 5000);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!OURS.has(document.title)) baseTitle = document.title;
      leftAt = Date.now();
      clearTimeout(timer);
      timer = setTimeout(() => cycle(Math.floor(Math.random() * LINES.length)), 1200);
      if (icon) icon.setAttribute('href', LOOKING_AWAY);
      window.dispatchEvent(new CustomEvent('cizole:leave'));
    } else if (leftAt) {
      clearTimeout(timer);
      const awayMs = Date.now() - leftAt;
      leftAt = 0;
      if (icon && iconHref) icon.setAttribute('href', iconHref);
      if (awayMs > 4000) {
        document.title = BACK;
        timer = setTimeout(() => { document.title = baseTitle; }, 2500);
      } else {
        document.title = baseTitle;
      }
      window.dispatchEvent(new CustomEvent('cizole:return', { detail: { awayMs } }));
    }
  });
})();
