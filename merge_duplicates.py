#!/usr/bin/env python3
import re

with open('_data/question-bank.yml', 'r') as f:
    lines = f.readlines()

# Track duplicates to merge
duplicates_to_merge = []
current_block_keys = {}
block_start_line = 0

for i, line in enumerate(lines):
    # Detect start of a new mapping block
    if re.match(r'^\s{2,6}["\w-]+:\s*$', line) or re.match(r'^\s{2,6}answers:\s*$', line):
        current_block_keys = {}
        block_start_line = i

    # Detect trait key: value pattern
    match = re.match(r'^(\s{6,10})([a-z-]+):\s+([+-]?\d+)(.*)', line)
    if match:
        indent = match.group(1)
        key = match.group(2)
        value = int(match.group(3))
        comment = match.group(4)

        if key in current_block_keys:
            # Found duplicate - merge with previous
            prev_line, prev_value, prev_comment = current_block_keys[key]
            combined_value = prev_value + value
            # Combine comments or use first one
            if prev_comment and comment:
                combined_comment = prev_comment.split('#')[1].strip() + ' and ' + comment.split('#')[1].strip()
                combined_comment = ' # ' + combined_comment
            else:
                combined_comment = prev_comment or comment

            duplicates_to_merge.append({
                'first_line': prev_line,
                'second_line': i,
                'key': key,
                'combined_value': combined_value,
                'combined_comment': combined_comment,
                'indent': indent
            })
        else:
            current_block_keys[key] = (i, value, comment)

    # Reset on non-indented lines
    if line.strip() and not line.startswith(' '):
        current_block_keys = {}

# Apply merges in reverse order (to preserve line numbers)
for dup in reversed(duplicates_to_merge):
    first_line = dup['first_line']
    second_line = dup['second_line']

    # Remove the second occurrence
    lines[second_line] = ''

    # Update the first occurrence with combined value
    new_line = f"{dup['indent']}{dup['key']}: {dup['combined_value']:+d}{dup['combined_comment']}\n"
    lines[first_line] = new_line

# Write back, removing empty lines
with open('_data/question-bank.yml', 'w') as f:
    for line in lines:
        if line:  # Skip empty lines we created
            f.write(line)

print(f"Merged {len(duplicates_to_merge)} duplicate keys")
