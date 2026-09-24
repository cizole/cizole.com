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

  // the favicon is a "c" with an eye in it (see /favicon.svg). while you're gone it goes
  // dark and looks away, and every so often it blinks.
  const faviconSvg = (bg, fg, pupil) => 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
    `<rect width="32" height="32" rx="7" fill="${bg}"/>` +
    `<path d="M22.02 22.69 A9 9 0 1 1 22.02 9.31" fill="none" stroke="${fg}" stroke-width="5.5"/>` +
    pupil.replace('FG', fg) +
    '</svg>'
  );
  const LOOKING_AWAY = faviconSvg('#0e0d0b', '#c8ff3d', '<circle cx="13.2" cy="15" r="3.2" fill="FG"/>');
  const BLINK = faviconSvg('#c8ff3d', '#0e0d0b', '<rect x="13.6" y="15" width="7.4" height="2.2" rx="1.1" fill="FG"/>');
  const icon = document.querySelector('link[rel="icon"]');
  const iconHref = icon ? icon.getAttribute('href') : null;

  if (icon && iconHref && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    (function blinkLater() {
      setTimeout(() => {
        if (!document.hidden) {
          icon.setAttribute('href', BLINK);
          setTimeout(() => { if (!document.hidden) icon.setAttribute('href', iconHref); }, 180);
        }
        blinkLater();
      }, 8000 + Math.random() * 14000);
    })();
  }

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
