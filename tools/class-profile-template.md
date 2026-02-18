# Class Profile Template

This template defines the standardized `profile` frontmatter structure for class files in the recommendation engine.

## Schema

```yaml
profile:
  # Generic trait categories (standardized across all classes)
  generic:
    magicType: "none" | "utility" | "damage" | "healing" | "control" | "versatile"
    roleplaying: "low" | "medium" | "high" | "very-high"
    originBackground: ["military", "rural", "urban", "noble", "criminal", "tribal", "scholarly", "artisan"]

  # Specific/unique traits (narrative flavor, array of strings)
  specific: ["war-deserter", "former-slave", "noble-outcast", "haunted-past", ...]

  # Archetype overrides (optional, inherits base class profile if not specified)
  archetypes:
    archetype-name:
      generic:
        # Override any generic traits that differ from base class
        magicType: "damage"
      specific: ["additional-trait", "archetype-specific-trait"]
```

## Generic Trait Categories

### magicType
- **none**: No magical abilities
- **utility**: Magic for problem-solving, exploration, social situations
- **damage**: Destructive spells and offensive magic
- **healing**: Restorative and protective magic
- **control**: Battlefield control, debuffs, manipulation
- **versatile**: Mix of multiple magic types

### roleplaying
- **low**: Straightforward mechanics, limited roleplay hooks
- **medium**: Some built-in roleplay elements and social features
- **high**: Rich roleplay opportunities and social mechanics
- **very-high**: Class heavily focused on narrative and character interaction

### originBackground
Array of likely character backgrounds that fit the class theme:
- **military**: Soldiers, guards, mercenaries
- **rural**: Farmers, hunters, wilderness dwellers
- **urban**: City folk, merchants, craftspeople
- **noble**: Aristocrats, courtiers, wealthy families
- **criminal**: Thieves, smugglers, underground contacts
- **tribal**: Clan members, shamanic traditions, nomads
- **scholarly**: Academics, researchers, scribes
- **artisan**: Crafters, builders, makers

## Specific Traits Examples

Narrative flavor elements that add character depth:
- **war-deserter**: Left military service, possibly under questionable circumstances
- **former-slave**: Background of bondage, seeking freedom/justice
- **noble-outcast**: Cast out from high society, carries grudges or secrets
- **haunted-past**: Traumatic history that influences current behavior
- **mentor-seeker**: Looking for or has lost an important teacher/guide
- **reluctant-hero**: Thrust into adventure against their preferences
- **destiny-burdened**: Prophesy or fate weighs heavily on their choices
- **family-honor**: Actions driven by family reputation or obligations
- **divine-chosen**: Selected by deity/force for special purpose
- **natural-prodigy**: Exceptional talent discovered by chance

## Implementation Example

```yaml
---
title: Fighter
layout: default
profile:
  generic:
    magicType: "none"
    roleplaying: "medium"
    originBackground: ["military", "rural", "urban"]
  specific: ["disciplined-warrior", "tactical-mind", "physical-prowess"]
  archetypes:
    champion:
      generic:
        complexityLevel: "beginner"
      specific: ["pure-warrior", "weapon-master"]
    eldritch-knight:
      generic:
        magicType: "utility"
        complexityLevel: "advanced"
      specific: ["scholar-warrior", "magic-student", "dual-nature"]
---
```