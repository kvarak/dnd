---
title: "Combat Cheat Sheet"
layout: default
permalink: /RulesCombat/combat_cheatsheet
extra_css: cheatsheet.css
---


# Combat Cheat Sheet

<div class="cheatsheet">

<button class="print-btn" onclick="window.print()">🖨 Print / Save as PDF</button>

<div class="grid">

<div>
<div class="box" markdown="1">

## Your Turn

*In any order:*

- <span class="tag">Move</span> up to your Speed
- <span class="tag">Action</span> one action
- <span class="tag">Bonus Action</span> one bonus action (if available)
- <span class="tag">Free</span> interact with one object

*You can split your move before/after your other actions.*

</div>

<div class="box" markdown="1">

## Actions in Combat

- <span class="tag">Attack</span> one attack (extra attacks may apply)
- <span class="tag">Dash</span> gain extra movement equal to your Speed
- <span class="tag">Disengage</span> movement doesn't provoke OAs this turn
- <span class="tag">Dodge</span> attacks vs you have disadvantage; Dex saves with advantage. Lose if incapacitated or speed 0
- <span class="tag">Help</span> give advantage on next ability check or attack roll against a creature within 5 ft
- <span class="tag">Ready</span> declare trigger + action; release as a reaction
- <span class="tag">Ready a Spell</span> cast with 1-action time; hold with concentration; release on trigger
- <span class="tag">Use an Object</span> interact with a second object
- <span class="tag">Grapple</span> Athletics check vs target's Athletics or Acrobatics
- <span class="tag">Shove</span> Athletics vs Strength save - push 5 ft or knock prone
- <span class="tag">Escape Grapple</span> Athletics or Acrobatics vs grappler's Athletics
</div>

<div class="box" markdown="1">

## Opportunity Attacks
Triggered when a visible enemy **leaves your reach** without Disengaging. Use your <span class="tag">reaction</span> to make one melee attack.

</div>

<div class="box" markdown="1">

## Two-Weapon Fighting
When you attack with a **light melee weapon**, use a <span class="tag">bonus action</span> to attack with a different light melee weapon in your other hand. No ability modifier to damage on the bonus attack (unless negative).

</div>
</div>

<div>
<div class="box" markdown="1">

## Initiative <span class="varlyn">★ Varlyn</span>
Roll d20 + **Intelligence** modifier (not Dexterity). Ties broken randomly.

</div>

<div class="box" markdown="1">

## Attack Rolls
- <span class="tag">Hit</span> d20 + proficiency + ability mod ≥ target AC
- <span class="tag">Critical Hit</span> natural 20 - roll 1d100 on crit table
- <span class="tag">Fumble</span> natural 1 - roll 1d100 on fumble table
- <span class="tag">Advantage</span> roll 2d20, take higher
- <span class="tag">Disadvantage</span> roll 2d20, take lower
- *Advantage and disadvantage cancel out.*
<br/>

- <span class="tag">Melee</span> STR mod (or DEX with finesse)
- <span class="tag">Thrown</span> STR mod (or DEX with finesse)
- <span class="tag">Ranged</span> DEX mod. Disadvantage in melee
- <span class="tag">Spell</span> d20 + spellcasting mod + proficiency vs AC
</div>

<div class="box" markdown="1">

## Cover

- <span class="tag">Half cover</span> +2 AC & Dex saves
- <span class="tag">¾ cover</span> +5 AC & Dex saves
- <span class="tag">Total cover</span> can't be targeted


</div>

<div class="box" markdown="1">

## Movement
- <span class="tag">Difficult terrain</span> costs 1 extra ft per ft
- <span class="tag">Drop prone</span> free (no movement cost)
- <span class="tag">Stand up</span> costs ½ Speed
- <span class="tag">Crawl</span> (while prone) - 1 extra ft per ft
- <span class="tag">Climb / Swim</span> 1 extra ft per ft (unless Speed applies)
- <span class="tag">Long jump</span> STR score in ft (10 ft run-up); half standing
- <span class="tag">High jump</span> 3 + STR mod ft (10 ft run-up); half standing
</div>

<div class="box" markdown="1">

## Surprise
If surprised: cannot move or act on your first turn; cannot take reactions until you have acted.

</div>

</div>

<div>
<div class="box" markdown="1">

## Dropping to 0 HP <span class="varlyn">★ Varlyn</span>
<span class="tag">Instant death</span> if remaining damage ≥ your HP maximum.
<span class="tag">Death saves</span> d20 at start of your turn. 3 successes = stable. 3 failures = dead. Natural 20 = regain 1 HP.
- Remaining dmg > CON score → first save at **disadvantage**
- Remaining dmg ≤ CON bonus (or 0) → first save at **advantage**

<span class="tag">Stabilize</span> DC 10 Wis (Medicine) check as action; or Healer's kit.
<span class="tag">Combat Exhaustion</span> (on return from 0 HP): gain 6 levels. Lose 1 per round. Reaching 6+ = <span class="tag">Stunned</span> (not dead).
</div>

<div class="box" markdown="1">

## Sneaking & Stabbing
Attack an **undetected** target: attack with **advantage**. On hit vs Humanoid: Constitution save or knocked **unconscious**. Save DC modified by head protection.
*Rogues force the save with disadvantage.*
</div>

<div class="box" markdown="1">

## Mounted Combat
- <span class="tag">Mount/dismount</span> ½ Speed
- Forced move of mount → DC 10 Dex save or fall prone
- <span class="tag">Controlled mount</span> on your initiative; only Dash, Disengage, Dodge
- <span class="tag">Independent mount</span> acts on its own initiative; full actions
- OA against you while mounted can target you or mount
</div>

<div class="box" markdown="1">

## Resistances & Immunities
- <span class="tag">Resistance</span> halve damage (applied after all other modifiers).
- <span class="tag">Immunity</span> no damage from that type.
- <span class="tag">Vulnerability</span> double damage.
*Multiple resistances to the same damage type still only count as one.*
</div>

<div class="box" markdown="1">

## Underwater Combat
- <span class="tag">Melee</span> disadvantage unless weapon deals **piercing**
- <span class="tag">Ranged</span> auto-miss beyond normal range; disadvantage within normal range (except crossbows & thrown weapons)
- <span class="tag">Fully immersed</span> resistance to **fire** damage

</div>
</div>

<div class="box full-width" markdown="1">

## Conditions

<div class="conditions-grid" markdown="1">
<div markdown="1">
<span class="tag">Blinded</span> - auto-fail sight checks; attacks against = advantage; your attacks = disadvantage

<span class="tag">Charmed</span> - can't attack charmer; charmer has advantage on social checks vs you

<span class="tag">Deafened</span> - auto-fail hearing checks

<span class="tag">Frightened</span> - disadvantage on checks & attacks while source is visible; can't willingly move closer

<span class="tag">Grappled</span> - Speed 0; ends if grappler is incapacitated or you are moved out of reach
</div>
<div markdown="1">
<span class="tag">Incapacitated</span> - no actions or reactions

<span class="tag">Invisible</span> - impossible to see without special sense; attacks against = disadvantage; your attacks = advantage

<span class="tag">Paralyzed</span> - incapacitated, can't move or speak; auto-fail STR/DEX saves; attacks against = advantage; hits within 5 ft = critical

<span class="tag">Petrified</span> - transformed to solid, incapacitated; resistance to all damage; immune to poison & disease; auto-fail STR/DEX saves

<span class="tag">Poisoned</span> - disadvantage on attack rolls and ability checks
</div>
<div markdown="1">
<span class="tag">Prone</span> - melee attacks = advantage; ranged attacks = disadvantage; your attacks = disadvantage; stand up costs ½ Speed

<span class="tag">Restrained</span> - Speed 0; attacks against = advantage; your attacks = disadvantage; disadvantage on Dex saves

<span class="tag">Stunned</span> - incapacitated; auto-fail STR/DEX saves; attacks against = advantage

<span class="tag">Unconscious</span> - incapacitated, prone, drop held items; auto-fail STR/DEX saves; attacks against = advantage; hits within 5 ft = critical

<span class="tag">Exhaustion</span> - 1: disadvantage on checks; 2: ½ Speed; 3: disadv. attacks & saves; 4: HP max halved; 5: Speed 0; 6: death
</div>
</div>
</div>

</div>
</div>


<br/>

*Full rules: [Combat](../RulesCombat/a_index.html) · [Combat Skills](../RulesCharacter/skills_combat.html)*

