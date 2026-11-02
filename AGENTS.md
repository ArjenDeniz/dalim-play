# Emoji'den Filmi Bil

Private emoji movie-guessing game for one friend group of five, played live on a shared screen with one person typing. Keep it small: static Vue 3 + Vite + TypeScript, no backend, no accounts, no scaling work.

## Deploy
Pushing to `master` deploys production to https://dalim-play.vercel.app (Vercel Git integration). Other branches get preview URLs. Run `npm test && npm run build` before committing.

## Content
- Rounds live in `src/data/puzzles.ts`. Order each puzzle's emojis vaguest → most obvious: one opens per wrong guess, and the emoji count is also the guess limit.
- `src/data/films.ts` is a hand-written stand-in for TMDB, so years and genres may be off. Genre keys map to TMDB genre ids for the planned TMDB swap. Film ids are `slug(title)-year`; the tests fail if a puzzle points at a missing film.

## Design
- UI copy is Turkish, casual and gender-neutral.
- Look comes from the moodboard pack (`~/Downloads/moodboard-dalim-part{1,2,3}.zip`, outside the repo): dark velvet cinema, marquee-bulb gold, film strip with TV-static frames. Tokens are in `src/style.css`.
- Every moodboard image added to `public/img/` needs an entry in `src/components/CreditsDialog.vue`: the licences (CC BY / BY-SA) require attribution. Licence details are in the pack's `images/credits.csv`.
