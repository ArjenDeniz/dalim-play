# Emoji'den Filmi Bil

A small emoji movie-guessing game for one friend group, played together on a shared screen.
Vue 3 + Vite + TypeScript, static, deployed with the Vercel CLI.

## How a round works
- The film's emojis sit on a film strip; only the first is open.
- Pick a film from the search box. Each wrong guess (or "Pas geç") opens one more emoji.
- Genres the guess shares with the answer fill in on the ticket and stay.
- The year narrows: guessing 2013 for a 2011 film shows `? < 📅 < 2013`. 🔥 means within 2 years.
- Run out of emojis and the round ends ("Perde indi").

## Content
- `src/data/films.ts` — the fixed list of guessable films (title, optional Turkish title, year, genres).
  Written by hand; double-check years/genres. Genre keys map to TMDB genre ids for a later TMDB swap.
- `src/data/puzzles.ts` — the rounds: a film id plus emojis ordered vaguest → most obvious.
- `public/img/` — images from the moodboard pack (Wikimedia Commons); credits are in the in-app "Görsel kaynakları" dialog.

## Commands
```sh
npm install
npm run dev      # local play
npm test         # game logic + data checks
npm run build
vercel           # preview deploy (vercel --prod for production)
```

Progress for each round is kept in localStorage, so a refresh doesn't lose the game.
