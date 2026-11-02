"""List candidate "Kimin günlüğü?" pages from the Letterboxd exports.

    python3 -I scripts/diary-pages.py IREM_DIR NIL_DIR ARJEN_DIR DALIM_CSV [--top N]

IREM_DIR, NIL_DIR and ARJEN_DIR are unzipped Letterboxd exports (diary.csv, watched.csv, likes/films.csv).
DALIM_CSV is Dalım's films_watched.csv, which has one row per film with first and last log dates,
so Dalım's pages use last_logged and miss rewatches in between.

A page is 4–6 consecutive diary entries from one person within 10 days. Each candidate is printed with:
  only  entries nobody else in the group has seen (the signature)
  rated entries with stars
  days  spread from first to last entry
Pick the ones you like by hand into src/data/diary.ts. Nothing here is imported by the app.
"""

import csv
import sys
from datetime import date
from pathlib import Path

MAX_DAYS = 10


def read(path):
    with open(path, newline='', encoding='utf-8-sig') as f:
        return list(csv.DictReader(f))


def key(name, year):
    return (name.strip().lower(), str(year or '').strip())


def letterboxd(folder):
    folder = Path(folder)
    liked = {key(r['Name'], r['Year']) for r in read(folder / 'likes' / 'films.csv')}
    seen = {key(r['Name'], r['Year']) for r in read(folder / 'watched.csv')}
    entries = []
    for r in read(folder / 'diary.csv'):
        when = r['Watched Date'] or r['Date']
        k = key(r['Name'], r['Year'])
        entries.append({
            'date': when,
            'title': r['Name'],
            'year': r['Year'],
            'rating': r['Rating'],
            'rewatch': r['Rewatch'] == 'Yes',
            'liked': k in liked,
            'tags': r['Tags'],
            'key': k,
        })
    return entries, seen


def dalim(path):
    entries, seen = [], set()
    for r in read(path):
        k = key(r['title'], r['year'])
        seen.add(k)
        if r['last_logged']:
            entries.append({
                'date': r['last_logged'],
                'title': r['title'],
                'year': r['year'],
                'rating': r['my_rating'],
                'rewatch': bool(r['rewatched']),
                'liked': r['liked'] == 'yes',
                'tags': '',
                'key': k,
            })
    return entries, seen


def candidates(owner, entries, others_seen):
    entries = sorted(entries, key=lambda e: e['date'])
    out = []
    for size in (6, 5, 4):
        for i in range(len(entries) - size + 1):
            page = entries[i:i + size]
            first, last = date.fromisoformat(page[0]['date']), date.fromisoformat(page[-1]['date'])
            spread = (last - first).days
            if spread > MAX_DAYS:
                continue
            only = sum(1 for e in page if e['key'] not in others_seen)
            rated = sum(1 for e in page if e['rating'])
            score = only * 2 + rated + (1 if any(e['rewatch'] or e['liked'] for e in page) else 0)
            out.append((score, only, rated, spread, owner, page))
    # keep the best page per start date so one binge day doesn't fill the list
    best = {}
    for c in sorted(out, key=lambda c: -c[0]):
        best.setdefault(c[5][0]['date'], c)
    return sorted(best.values(), key=lambda c: -c[0])


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    top = int(sys.argv[sys.argv.index('--top') + 1]) if '--top' in sys.argv else 12
    if len(args) < 4:
        sys.exit(__doc__)
    people = {
        'irem': letterboxd(args[0]),
        'nil': letterboxd(args[1]),
        'arjen': letterboxd(args[2]),
        'dalim': dalim(args[3]),
    }
    for owner, (entries, _) in people.items():
        others = set().union(*(s for o, (_, s) in people.items() if o != owner))
        print(f'\n===== {owner}')
        for score, only, rated, spread, _, page in candidates(owner, entries, others)[:top]:
            print(f'\n  score {score}  only {only}  rated {rated}  days {spread}')
            for e in page:
                marks = ('↻' if e['rewatch'] else ' ') + ('♥' if e['liked'] else ' ')
                mine = '*' if e['key'] not in others else ' '
                tags = f"  [{e['tags']}]" if e['tags'] else ''
                print(f"    {e['date']} {mine} {e['title']} ({e['year']})  {e['rating'] or '-'} {marks}{tags}")


if __name__ == '__main__':
    main()
