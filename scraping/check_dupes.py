import json
from collections import defaultdict

with open('json/rounds.json') as f:
    rounds = json.load(f)

# Check by (club_id, name)
by_key = defaultdict(list)
for r in rounds:
    key = (r.get('club_id', ''), r.get('name', ''))
    by_key[key].append(r)

dupes = {k: v for k, v in by_key.items() if len(v) > 1}
print(f'Exact dupes (same club_id + name): {len(dupes)}')
for (cid, name), group in dupes.items():
    print(f'  [{name}] club={cid[:12]}: {len(group)} rounds')
    for r in group:
        print(f'    id={r["id"]}  url={r.get("course_url", "none")}')

# Also check by name only
by_name = defaultdict(list)
for r in rounds:
    by_name[r.get('name', '')].append(r)

print(f'\nGroups with same name (any club):')
for name, group in sorted(by_name.items()):
    if len(group) > 1:
        club_ids = list({r.get('club_id', '') for r in group})
        same_club = len(club_ids) < len(group)
        print(f'  [{name}] {len(group)} rounds, same_club={same_club}')
        if same_club:
            for r in group:
                print(f'    id={r["id"]}  club={r.get("club_id", "")}  url={r.get("course_url", "none")}')

print(f'\nTotal rounds: {len(rounds)}')
