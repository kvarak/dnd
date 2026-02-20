#!/usr/bin/env python3
import re

with open('_data/question-bank.yml', 'r') as f:
    lines = f.readlines()

current_block_start = None
current_block_keys = {}
duplicates = []

for i, line in enumerate(lines, 1):
    # Detect start of a new mapping block (answers, yes, no, maybe, etc.)
    if re.match(r'^\s{2,6}["\w-]+:\s*$', line) or re.match(r'^\s{2,6}answers:\s*$', line):
        current_block_start = i
        current_block_keys = {}

    # Detect trait key: value pattern
    match = re.match(r'^(\s{6,10})([a-z-]+):\s+[+-]?\d+', line)
    if match:
        indent = match.group(1)
        key = match.group(2)

        if key in current_block_keys:
            duplicates.append((current_block_keys[key], i, key))
        else:
            current_block_keys[key] = i

    # Reset on non-indented lines (new section)
    if line.strip() and not line.startswith(' '):
        current_block_keys = {}

for dup in duplicates:
    print(f"Duplicate '{dup[2]}' at lines {dup[0]} and {dup[1]}")
