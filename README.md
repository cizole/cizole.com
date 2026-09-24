# cizole.com

> a website. allegedly.

A weird little personal internet museum, made by a programmer who can't leave things alone.

**Visit:** https://cizole.com

## what's here

The homepage is a lobby of numbered rooms, and each room commits fully to one idea. There are eyes that watch you, a button that doesn't want to be pressed, a server room full of servers with feelings, and a robot vacuum named dustin. There's also a fish tank that turns the tables, a sauna whose back door opens into a freezer, and a basement you can walk through in 3D. Some rooms have real information in them (999 is the about page). Most exist because the joke was worth a few hundred lines of JavaScript.

The lobby is the up-to-date list of rooms. This README doesn't try to keep up.

## how it's built

- Plain HTML, CSS, and JavaScript. No build step, no framework, no npm.
- Each room is a folder with one self-contained `index.html`.
- A few libraries come from jsDelivr where they unlock something (three.js for 3D, matter.js for physics). Everything else is browser APIs.
- Hosted on GitHub Pages from `main`, so pushing is deploying.

## running it locally

Folder links like `eyes/` don't work over `file://`, so use any static server:

```
python -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/.

## the shared parts

- **`assets/rooms.js`** is the one list of rooms: number, folder, name, and blurb. The lobby, the "rooms" menu inside every room, the basement's doors, the 90s webring, and each room's tab title are all built from it. Rename a room there and it's renamed everywhere.
- **`assets/away.js`** makes every page notice when you switch tabs. The title changes, the favicon looks away, and rooms can react when you come back.
- **`assets/site.css`** holds the shared colors and the lobby link style.
- **`favicon.svg`** is a "c" with an eye in it. It blinks.

## adding a room

1. Make a folder with an `index.html`. Copy the scaffolding from any room: `../assets/site.css`, the lobby link, the favicon link, and `rooms.js` then `away.js` right before `</body>`.
2. Add one line to `assets/rooms.js` with the next number, just above about (which is always 999).
3. Optionally, give it a light color in the basement's `GLOW` map. Otherwise its door gets a plain warm one.

## retiring a room

Room numbers are permanent and never leave gaps. A retired room keeps its line in `assets/rooms.js` with a `defunct: '<reason>'`, which shows it as closed everywhere rooms are listed. Its folder becomes a closed sign (see `mirror/`). Failures can be funny.

## the brief

The tone and design rules live in `CLAUDE.md`: dry, deadpan, behavior over decoration, and one stupid idea per room, fully committed to.
