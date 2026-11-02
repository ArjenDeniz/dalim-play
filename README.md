# Emoji'den Filmi Bil

A small emoji movie-guessing game for one friend group, played together on a shared screen.
Vue 3 + Vite + TypeScript, static, deployed with the Vercel CLI.

## How a round works
- The film's emojis sit on a film strip; only the first is open.
- Pick a film from the search box. Each wrong guess (or "Pas geç") opens one more emoji.
- Genres the guess shares with the answer fill in on the ticket and stay.
- The year narrows: guessing 2013 for a 2011 film shows `? < 📅 < 2013`. 🔥 means within 2 years.
- Run out of emojis and the round ends ("Perde indi").

## Film Kapışması (`#/kapisma`)
A quiz for the whole group: the host screen (TV or laptop) shows the questions, everyone answers on their phone.
- Open `#/kapisma` on the big screen. It opens a room with a 4-digit number and a QR code. Phones scan it or go to `#/katil` and type the number and a name.
- The question shows alone for 4 seconds, then the four options light up and the countdown runs (20 s by default).
- A right answer scores 1000 at once and falls to 500 at the buzzer, timed on the Firebase server clock. A streak adds +100 per question, up to +300. The first tap locks in.
- After the reveal (5 s) it moves on to the scoreboard ("Ara", 6 s) and then the next question by itself. Enter, Space or the button skips ahead. Timings are `REVEAL_MS` and `BOARD_MS` in `src/quiz/useQuiz.ts`. The final screen rolls the credits.
- Live rooms use Firebase (project `dalim-play`). Rules are in `firebase/firestore.rules`; deploy with `npm run deploy:firebase`, then check with `npm run check:rules`.
- To try it with real phones on the local network, run `npm run dev -- --host` and open the host page on the laptop's network address, not `localhost`, so the QR code points somewhere phones can reach.

## Content
- `src/data/films.ts` — the fixed list of guessable films (title, optional Turkish title, year, genres).
  Written by hand; double-check years/genres. Genre keys map to TMDB genre ids for a later TMDB swap.
- `src/data/puzzles.ts` — the rounds: a film id plus emojis ordered vaguest → most obvious.
- `src/data/quiz.ts` — Film Kapışması questions: four options plus the index of the right one. The current ones are test questions.
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
