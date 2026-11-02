# Emoji'den Filmi Bil

Private emoji movie-guessing game for one friend group of five, played live on a shared screen with one person typing. Keep it small: static Vue 3 + Vite + TypeScript, no accounts, no scaling work. The only backend is Firebase (see below) for live Film Kapışması rooms; don't add a server of our own.

## Deploy
Pushing to `master` deploys production to https://dalim-play.vercel.app (Vercel Git integration). Other branches get preview URLs. Run `npm test && npm run build` before committing.

## Content
- Content comes from the players' Letterboxd exports (İrem, Nil, Arjen, Dalim; Su plays but has no export), read on 2026-11-02. The raw exports stay out of the repo; only what the games need is copied in.
- Emoji rounds are grouped into packs in `src/data/puzzles.ts` (`PACKS`). Order each puzzle's emojis vaguest → most obvious: one opens per wrong guess, and the emoji count is also the guess limit. A film appears in one pack only. `whoseFavorite` packs ask "Kimin favorisi?" after each film.
- `src/data/groupSeen.ts` says who logged each pack film (stars, heart, this year, favourite); the round end shows it. `src/data/people.ts` lists the four.
- Film Kapışması (`#/kapisma`) questions live in `src/data/quiz.ts`: four options, `answer` is the right one's index (0–3), optional `seconds` (default 20). "Kim…?" questions keep the names in the same order.
- `src/data/films.ts` is a hand-written stand-in for TMDB, so years and genres may be off; `src/data/groupFilms.ts` adds films from our Letterboxd logs (generated once, edit by hand). Genre keys map to TMDB genre ids for the planned TMDB swap. Film ids are `slug(title)-year`; the tests fail if a puzzle points at a missing film.

## Firebase (Film Kapışması)
- Google Cloud / Firebase project `dalim-play` (owner arjendenizturkmen@gmail.com): Firestore in `europe-west3`, anonymous sign-in. The web config in `src/firebase.ts` is public by design.
- Data model is in `src/quiz/room.ts`: `rooms/{pin}` written only by the host screen, `players/{uid}` and `answers/{round}_{uid}` written by phones.
- Fairness lives in `firebase/firestore.rules`: one answer per player per round, only while the options are lit, timed on the server clock. After changing the rules run `npm run deploy:firebase` then `npm run check:rules` (probes the live rules with throwaway users and a test room).

## Plans
Proposals for the next games are in `docs/`: Dalim Wrapped (`dalim-wrapped.md`), Kimin günlüğü (`kimin-gunlugu.md`) and Kavga çıkaran filmler (`kavga-cikaran-filmler.md`).

## Pages
Each page is a component in `src/views/`, registered in `PAGES` in `src/useRoute.ts` (hash routes, which also adds the top-bar link). Shared pieces go in `src/components/`, page-specific ones in a subfolder (for example `src/components/quiz/`).

## Design
- UI copy is Turkish, casual and gender-neutral.
- Look comes from the moodboard pack (`~/Downloads/moodboard-dalim-part{1,2,3}.zip`, outside the repo): dark velvet cinema, marquee-bulb gold, film strip with TV-static frames. Tokens are in `src/style.css`.
- Every moodboard image added to `public/img/` needs an entry in `src/components/CreditsDialog.vue`: the licences (CC BY / BY-SA) require attribution. Licence details are in the pack's `images/credits.csv`.
