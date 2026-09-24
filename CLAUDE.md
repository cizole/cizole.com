# cizole.com

## What this site is

This site belongs to Cole, a software developer and lifelong tinkerer who enjoys building things mostly because he wants to see if he can make them work. He is technically minded, curious, slightly obsessive about interesting problems, and has a dry, self-deprecating, occasionally absurd sense of humor. He likes computers and old-school internet culture, programming, weird little web experiments, video games, LEGO and custom builds, skiing and snowboarding, camping, mountains, weather, gadgets, fixing or modifying things around the house, and generally going down rabbit holes that start with "I wonder if I could..." and end several hours later with something unnecessarily elaborate but functional. He builds actual projects like Snowology, but he also enjoys making things that have absolutely no practical reason to exist.

cizole.com should feel like wandering into Cole's little corner of the internet, not visiting his professional portfolio. It should not feel corporate, optimized, marketable, inspirational, minimalist-for-the-sake-of-minimalism, or like a generic developer site generated from a template. Do not fill it with skill percentages, giant LinkedIn-style biography sections, stock illustrations, glowing code screenshots, "crafting digital experiences," or generic hackerman aesthetics.

The identity: **a weird little personal internet museum made by a programmer who can't leave things alone.** Not "developer portfolio with quirky styling."

## Look and tone

- The default look is the restrained dark/off-black palette, monospace character, slightly sickly acid-green accent, understated presentation, and deadpan writing style. The lobby and shared chrome stay this way.
- Loud is allowed on purpose. Cole loves neon colors and bright, playful snowboard/streetwear brands like Neff. A room can go full neon, colorful, and flashy when the idea calls for it or when he asks for it (the trip room is the example). What to avoid is flashiness as default decoration. When a room goes loud, commit to it.
- Most rooms get their weirdness from **behavior** rather than visual clutter. A page can initially look almost normal and then reveal that something is slightly wrong with it. Objects can notice the visitor, resist them, get annoyed, become tired, hide, remember things, behave irrationally, or otherwise act like they have personalities. In those rooms, tiny details and unexpected interactions matter more than animation.
- Use weirdness sparingly. The lobby is mostly typography and whitespace, and then the letters dodge your mouse. Each room commits fully to one stupid idea. Don't make every page generically "wacky."
- Humor is dry and delivered completely straight. The site behaves strangely while the writing calmly pretends everything is normal ("it's just a button," then the button refuses to be pressed). Avoid "lol so random," meme overload, excessive profanity, and constant jokes.
- Handmade over impressive. Clever vanilla HTML/CSS/JS beats introducing a framework because one exists. Complexity is welcome when the result is interesting, not for architecture's sake.
- Picture a mix of an old personal website, a strange interactive museum, a programmer's workbench, a forgotten terminal, and a basement full of interesting objects nobody will throw away. Personal and handcrafted, without deliberately imitating ugly 1990s web design.
- Don't make it impressive by making it polished; make it memorable by making it specific. When choosing between conventionally good UX and something mildly inconvenient but genuinely funny, the funny option is sometimes right, as long as the visitor can always get back to the lobby.

The guiding question for anything added: **"Would Cole find this amusing enough to spend an unreasonable amount of time making it work?"** If yes, it probably belongs here.

## Structure: a lobby of rooms

The homepage is a lobby that lists numbered rooms. Don't turn it into About / Projects / Contact / Resume. Real, useful content lives inside the metaphor as rooms of its own. Some rooms hold real information; others exist only because the joke was worth 200 lines of JavaScript.

Room ideas not built yet (numbers continue from the lobby):

- snowology: apparently weather needed more software
- projects: things that escaped localhost
- guestbook: the internet used to have these
- links: leave while you still can
- the light switch: turning the lights off makes something in the room move
- 404 department: an increasingly unhelpful search party
- a single checkbox whose label keeps changing after you check it
- nothing: a page called "nothing" with an absurd amount of hidden interaction
- uptime: "cizole.com: operational / cole: questionable / motivation: intermittent / cat interference: elevated"

## How the repo works

- Static HTML/CSS/JS. No build step, no framework, no npm. Fonts come from Google Fonts.
- Libraries are fine when they unlock something new (physics, 3D, face tracking, and so on), not for convenience; skip jQuery. Load them from cdn.jsdelivr.net with exact pinned versions (an import map for ES modules). Use browser APIs directly when they're enough.
- Each room is its own folder with a self-contained `index.html` (inline `<style>` and `<script>`). Shared color tokens (`--bg`, `--fg`, `--dim`, `--faint`, `--acid`, `--font`) and the `.lobby-link` style live in `assets/site.css`.
- Every room links back to the lobby with `<a class="lobby-link" href="../">&larr; lobby</a>`.
- Every page links the favicon as `<link rel="icon" href="../favicon.svg?v=2" type="image/svg+xml">` (the version busts browser caches; bump it on every page if the icon changes). `favicon.ico` and `apple-touch-icon.png` at the root are fallbacks. `away.js` mirrors the icon's shape for its "looking away" and blink variants, so update those too if the design changes.
- `assets/away.js` is on every page. While the tab is hidden it changes the title and favicon, and it fires `cizole:leave` and `cizole:return` (with `detail.awayMs`) on `window`. Rooms can listen for `cizole:return` and react in a small, deadpan way.
- Camera or other sensitive input is always opt-in behind a clear button, processed locally, and never uploaded.
- The list of rooms lives in `assets/rooms.js` (number, folder slug, name, deadpan blurb). The lobby grid and the "rooms" menu inside every room are both built from it, so a new room is one line there with the next number. The lobby lists rooms strictly in number order. `featured: true` only adds a small "recommended by the management." note to that room's row.
- The about page is room **999** and always stays last (in `assets/rooms.js` and the basement's door list). New rooms take the next number in the normal sequence and go just above it.
- Room numbers are permanent and there are no gaps. Retiring a room means keeping its entry in `assets/rooms.js` with `defunct: '<deadpan reason>'` (e.g. mirror: "closed. it was weird. even for here."). Closed rooms show struck through with a red "closed" stamp and aren't clickable in the lobby and the rooms menu, and prev/next skip them. Replace the room's folder with a small closed-sign page (`mirror/index.html` is the template) so old links land somewhere funny instead of a 404, and give its basement door `defunct: '<reason>'` so it's boarded up. Our failures can be funny.
- A room with `hidden: true` in `assets/rooms.js` is a secret: it's left out of every list until the visitor unlocks it. 023 "nothing" unlocks with the Konami code on the lobby (`localStorage` `cizole.nothing`), which also turns the basement's unnumbered "not yet." door into its door. The visible gap in the numbers is the clue; leave it.
- rooms.js keeps a stamp card: every room a visitor enters is added to `localStorage` `cizole.visited`. Visited rooms get a small dot in the lobby and the rooms menu, and the lobby footer counts them ("you've been in 7 of 23"). `<` and `>` hop to the previous/next open room from inside any room.
- Every room includes `<script src="../assets/rooms.js"></script>` and then `<script src="../assets/away.js"></script>` right before `</body>`. rooms.js adds the "rooms" button next to the lobby link, so keep the top-left corner clear.
- `robots.txt` and `humans.txt` at the root are in the site's voice. The lobby prints a small message to the browser console for anyone who opens devtools; it hints at the Konami code.
- Links that leave a room (webrings, doors, real URLs) open in a new tab (`target="_blank" rel="noopener"`, or `window.open` inside the click/key handler), so nobody loses their place. The lobby link, the rooms menu, and the lobby itself navigate in place.
- Use relative paths (`../assets/site.css`). The exception is `404.html`, which is served at any missing URL, so it uses root paths and inline styles.
- Respect `prefers-reduced-motion`.
- Preview with a local server, since folder links like `eyes/` don't work over `file://`: `python -m http.server 8765 --bind 127.0.0.1`, then open http://127.0.0.1:8765/.
- `assets/rooms.js` is the single source of truth for room numbers, names, and status. The lobby, the rooms menu, the basement's doors, the 90s webring, and each room's tab title (`<name> · cizole`) all read from it, so renaming or retiring a room there updates everything. Don't hardcode room lists anywhere else. The only per-room data kept elsewhere is the basement's `GLOW` map (the color of the light behind each door, optional).
- `README.md` is the repo's front page on GitHub. It's excluded from the published site in `_config.yml`, like this file.

## Deploying

- GitHub Pages serves the `main` branch of https://github.com/cizole/cizole.com (a public repo). Pushing to `main` redeploys in about a minute.
- `CNAME` holds the custom domain. DNS is at Namecheap: four A records point `@` at GitHub Pages, and `www` is a CNAME to `cizole.github.io`.
- Pages builds with Jekyll, so files and folders starting with `_` or `.` aren't published. `_config.yml` excludes this file from the published site; keep it that way.
