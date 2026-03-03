import json
import unicodedata
import re

def normalize(name: str) -> str:
    """Lowercase, remove accents, strip punctuation/spaces for fuzzy matching."""
    name = unicodedata.normalize('NFD', name)
    name = ''.join(c for c in name if unicodedata.category(c) != 'Mn')
    name = name.lower()
    name = re.sub(r'[^a-z0-9]', '', name)
    return name

with open('json/supabase_data.json', 'r', encoding='utf-8') as f:
    supabase = json.load(f)

with open('json/courses_grouped.json', 'r', encoding='utf-8') as f:
    grouped = json.load(f)

# Build lookup: normalized name -> supabase id
supabase_lookup = {normalize(item['name']): item['id'] for item in supabase}

matched = 0
unmatched = []

for club in grouped:
    key = normalize(club['name'])
    if key in supabase_lookup:
        club['id'] = supabase_lookup[key]
        club.pop('supabase_id', None)
        matched += 1
    else:
        unmatched.append(club['name'])

with open('json/courses_grouped.json', 'w', encoding='utf-8') as f:
    json.dump(grouped, f, ensure_ascii=False, indent=2)

print(f"✓ Matched: {matched}")
print(f"✗ Unmatched ({len(unmatched)}):")
for name in unmatched:
    print(f"  - {name}")
