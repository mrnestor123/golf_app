import json
import csv

# ── rounds.json → rounds.csv ──────────────────────────────────────────────────
with open('json/rounds.json') as f:
    rounds = json.load(f)

rounds_fields = ['id', 'name', 'club_id', 'handicaps', 'slopes', 'course_ratings']

with open('json/rounds.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=rounds_fields)
    writer.writeheader()
    for r in rounds:
        writer.writerow({
            'id': r.get('id', ''),
            'name': r.get('name', ''),
            'club_id': r.get('club_id', ''),
            'handicaps': json.dumps(r.get('handicaps', [])),
            'slopes': json.dumps(r.get('slopes', {})),
            'course_ratings': json.dumps(r.get('course_ratings', {})),
        })

print(f'rounds.csv: {len(rounds)} rows')

# ── holes.json → holes.csv ────────────────────────────────────────────────────
with open('json/holes.json') as f:
    holes = json.load(f)

with open('json/holes.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=['round_id', 'club_id', 'number', 'par', 'tees'])
    writer.writeheader()
    for hole in holes:
        writer.writerow({
            'round_id': hole.get('round_id', ''),
            'club_id': hole.get('club_id', ''),
            'number': hole.get('number', ''),
            'par': hole.get('par', ''),
            'tees': json.dumps(hole.get('tees', {})),
        })

print(f'holes.csv: {len(holes)} rows')

# ── tees.json → tees.csv ──────────────────────────────────────────────────────
with open('json/tees.json') as f:
    tees = json.load(f)

tees_fields = ['id', 'club_id', 'round_id', 'name']

with open('json/tees.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=tees_fields, extrasaction='ignore')
    writer.writeheader()
    for t in tees:
        writer.writerow({
            'id': t.get('id', ''),
            'club_id': t.get('club_id', ''),
            'round_id': t.get('round_id', ''),
            'name': t.get('name', ''),
        })

print(f'tees.csv: {len(tees)} rows')
print('Done.')
