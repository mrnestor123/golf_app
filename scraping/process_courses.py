"""
Process courses.json to group courses by name
"""

import json
import re
from collections import defaultdict

def generate_id_from_name(name: str, index: int) -> str:
    """
    Generate ID from name by converting to lowercase, replacing spaces with underscores,
    and removing special characters.
    Example: "El club escorpión" -> "el_club_escorpion_0"
    """
    if not name:
        return f"club_{index}"
    
    # Convert to lowercase, replace spaces with underscores
    clean_name = name.lower().replace(' ', '_')
    
    # Remove any special characters except underscores
    clean_name = re.sub(r'[^a-z0-9_]', '', clean_name)
    
    return f"{clean_name}_{index}"

def parse_location(location_string):
    """
    Parse location string into structured format
    Example: "Isla de La Toja, Pontevedra, Spain" 
    -> {country: "Spain", province: "Pontevedra", address: "Isla de La Toja"}
    """
    if not location_string:
        return {'country': '', 'province': '', 'address': ''}
    
    parts = [part.strip() for part in location_string.split(',')]
    
    if len(parts) >= 3:
        return {
            'country': parts[-1],
            'province': parts[-2],
            'address': parts[0]
        }
    elif len(parts) == 2:
        return {
            'country': parts[-1],
            'province': '',
            'address': parts[0]
        }
    elif len(parts) == 1:
        return {
            'country': parts[0],
            'province': '',
            'address': ''
        }
    else:
        return {'country': '', 'province': '', 'address': ''}

# Read the courses.json file
with open('courses.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

# Group courses by name
grouped = defaultdict(lambda: {
    'id': '',
    'name': '',
    'location': {},
    'courses': []
})

index = 0
for course in courses:
    name = course.get('name', '')
    location_string = course.get('location_name', '')
    
    # Use name as the key
    if name not in grouped:
        grouped[name]['id'] = generate_id_from_name(name, index)
        grouped[name]['name'] = name
        grouped[name]['location'] = parse_location(location_string)
        index += 1
    
    # Add the course variant to the courses array
    grouped[name]['courses'].append({
        'tipo': course.get('tipo', ''),
        'url': course.get('url', '')
    })

# Convert to list
result = list(grouped.values())

# Sort by name
result.sort(key=lambda x: x['name'].lower())

# Save the processed data
with open('courses_grouped.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"✓ Processed {len(courses)} courses into {len(result)} unique golf clubs")
print(f"✓ Saved to courses_grouped.json")

# Show some examples
print("\nExamples:")
for i, club in enumerate(result[:5]):
    print(f"\n{i+1}. {club['name']}")
    loc = club['location']
    print(f"   Country: {loc['country']}")
    print(f"   Province: {loc['province']}")
    print(f"   Address: {loc['address']}")
    print(f"   Courses: {len(club['courses'])}")
    for course in club['courses']:
        print(f"     - {course['tipo']}")
