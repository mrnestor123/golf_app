import json
from collections import defaultdict

with open('json/rounds.json', 'r') as f:
    rounds = json.load(f)
with open('json/holes.json', 'r') as f:
    holes = json.load(f)
with open('json/tees.json', 'r') as f:
    tees = json.load(f)

# Group rounds by (club_id, name)
groups = defaultdict(list)
for r in rounds:
    key = (r.get('club_id', ''), r.get('name', ''))
    groups[key].append(r)

to_delete = set()
for key, group in groups.items():
    if len(group) < 2:
        continue
    # Prefer keeping the round WITH course_url (more data); keep the last one with url
    with_url = [r for r in group if r.get('course_url')]
    if with_url:
        keep = with_url[-1]
    else:
        keep = group[-1]
    delete = [r['id'] for r in group if r['id'] != keep['id']]
    to_delete.update(delete)
    print(f'  [{key[1]}] club={key[0][:8]}... keep={keep["id"][:8]}... delete={len(delete)} rounds')

print(f'\nTotal rounds to delete: {len(to_delete)}')

new_rounds = [r for r in rounds if r['id'] not in to_delete]
new_holes = [h for h in holes if h.get('round_id') not in to_delete]
new_tees = [t for t in tees if t.get('round_id') not in to_delete]

print(f'Rounds: {len(rounds)} -> {len(new_rounds)}')
print(f'Holes:  {len(holes)} -> {len(new_holes)}')
print(f'Tees:   {len(tees)} -> {len(new_tees)}')

with open('json/rounds.json', 'w') as f:
    json.dump(new_rounds, f, indent=2, ensure_ascii=False)
with open('json/holes.json', 'w') as f:
    json.dump(new_holes, f, indent=2, ensure_ascii=False)
with open('json/tees.json', 'w') as f:
    json.dump(new_tees, f, indent=2, ensure_ascii=False)

print('\nDone. Files updated.')
