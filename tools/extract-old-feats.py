#!/usr/bin/env python3
"""Extract feats from __OldRules/feats.md for search indexing"""

import re

def extract_feats():
    """Extract all feats from the OldRules feats markdown file"""

    # Read the feats markdown
    with open('docs/__OldRules/feats.md', 'r') as f:
        content = f.read()

    feats = []

    # Split by feat markers: -   ### Feat Name
    # This pattern matches the bullet list structure
    feat_pattern = r'-   ### ([^\n]+)\n((?:[^\n]*\n)*?)(?=(?:-   ###|<div class="columnsthree">|##\s|$))'

    matches = re.finditer(feat_pattern, content)

    for match in matches:
        feat_name = match.group(1).strip()
        feat_content = match.group(2)

        # Skip empty or malformed feats
        if not feat_name or len(feat_name) < 2:
            continue

        # Generate anchor ID from feat name
        feat_anchor = feat_name.lower()
        feat_anchor = re.sub(r'[^a-z0-9\s-]', '', feat_anchor)
        feat_anchor = re.sub(r'\s+', '-', feat_anchor.strip())

        # Extract description: get first meaningful line that's not a bullet or prerequisite
        description_lines = []
        for line in feat_content.split('\n'):
            line = line.strip()

            # Skip empty lines
            if not line:
                if description_lines:  # Stop at first empty line after content
                    break
                continue

            # Skip structural elements
            if '<br/>&dash;' in line or '*Prerequisite:' in line or '<div' in line:
                continue

            # Keep descriptive text
            description_lines.append(line)

        # Join and clean description
        description = ' '.join(description_lines)
        description = re.sub(r'<[^>]+>', '', description)  # Remove HTML tags
        description = re.sub(r'\s+', ' ', description).strip()  # Normalize whitespace
        description = description[:300]  # Truncate to 300 chars

        # Only add if we have meaningful content
        if description and len(description) > 10:
            feats.append({
                'name': feat_name,
                'anchor': feat_anchor,
                'description': description
            })

    return feats

if __name__ == '__main__':
    feats = extract_feats()

    print(f"✓ Extracted {len(feats)} feats")
    print("\nFirst 5 feats:")
    for feat in feats[:5]:
        print(f"  - {feat['name']}")
    print("  ...")

    # Write to YAML file (manual generation without yaml module)
    output_path = '_data/searchable_old_feats.yml'
    with open(output_path, 'w') as f:
        f.write('---\n')
        for feat in feats:
            # Escape special characters for YAML
            name = feat['name'].replace('"', '\\"')
            anchor = feat['anchor']
            desc = feat['description'].replace('\\', '\\\\').replace('"', '\\"')
            
            f.write(f'- name: "{name}"\n')
            f.write(f'  anchor: "{anchor}"\n')
            f.write(f'  description: "{desc}"\n')
