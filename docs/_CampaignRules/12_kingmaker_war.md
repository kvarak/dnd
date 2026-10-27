---
title: "Kingmaker Warfare"
layout: default
path: 12
type: index
---

<div class="toc">

<h5><a href="#warfare">Warfare</a></h5>
<a href="#unit-statistics">Unit Statistics</a><br/>
<a href="#basic-units">Basic Units</a><br/>
<a href="#preparing-a-battle">Preparing a Battle</a><br/>
<a href="#battle-rounds">Battle Rounds</a><br/>
<a href="#attacking">Attacking</a><br/>
<a href="#targets-and-battlefield-circumstances">Targets and Circumstances</a><br/>
<a href="#diminished-units-and-morale">Diminished Units and Morale</a><br/>
<a href="#defeat-and-withdrawal">Defeat and Withdrawal</a><br/>
<a href="#player-characters">Player Characters</a><br/>
<a href="#after-the-battle">After the Battle</a><br/>
<a href="#using-roll20">Using Roll20</a><br/>
<a href="#short-example">Short Example</a><br/>

</div>

# Special Rules for Kingmaker

> The rules on this page are temporary rules for the Kingmaker campaign. Anything here is not officially part of the Varlyn ruleset, but is intended to be compatible with it. Perhaps we like the rules well enough to incorporate them into the Varlyn ruleset in the future.
>
> This is a deliberately simplified house-rule adaptation **inspired by** *Strongholds & Followers*. It is not a reproduction of the official Strongholds & Followers rules. Turn order, targeting, withdrawal and recovery are house rules.

# Warfare

Battles between armies use units rather than individual creatures. Each unit represents a group of soldiers fighting together.

Combat is abstract: there is no movement grid, facing, distance or formation tracking. Token placement on Roll20 is only for presentation.

**In short:** Pick an unused unit. Choose a target. Roll Attack, then Power. A successful attack removes 1 Strength. If the target is at half Strength or less, it checks Morale. Mark your unit as acted.

## Units
<div class="columnstwo">

- ### Unit Statistics

  Each unit has the following statistics:

  <div class="block classTable frame" markdown="1">

  | Statistic | Purpose |
  |---|---|
  | **Attack** | Bonus to the roll to hit an enemy unit. |
  | **Defense** | Target number an enemy Attack roll must meet. |
  | **Power** | Bonus to the roll to inflict casualties after a hit. |
  | **Toughness** | Target number an enemy Power roll must meet. |
  | **Morale** | Bonus to checks to hold together under losses. |
  | **Strength** | Current and maximum ability to remain in battle. |

  </div>

  Strength represents casualties, fatigue and cohesion - not an exact number of soldiers.

  Record Strength as a number, such as `6/6`. Although Strongholds & Followers uses casualty-die notation, this adaptation uses a numeric counter for easier tracking on Roll20. Do not roll the Strength counter.

  Unit statistics are separate from character statistics. They are assigned by the GM before battle, starting from the [Basic Units](#basic-units) below.

- ### Basic Units

  These profiles provide starting points for ordinary military units. They are campaign benchmarks, not character levels, and do not scale with the party's level.

  All profiles begin at full Strength. They use the normal warfare rules and have no special abilities unless the GM explicitly adds one.

  These profiles are provisional campaign defaults. Adjustments are made between battles, not during them.

- #### Quality Levels

  <div class="block classTable frame" markdown="1">

  | Quality | What it represents |
  |---|---|
  | **Militia** | Hastily assembled fighters with basic equipment and little experience fighting together. |
  | **Trained** | Regular soldiers capable of following orders and maintaining cohesion. The standard military baseline. |
  | **Veteran** | Experienced soldiers who fight effectively and hold together under pressure. |
  | **Elite** | Exceptional troops with excellent training, equipment and discipline. Intended to be uncommon. |

  </div>

  Quality describes the unit as a whole, not the level of each individual soldier.

- #### Reference Infantry

  Use these four profiles to understand the progression between qualities.

  <div class="block classTable frame" markdown="1">

  | Unit | Attack | Defense | Power | Toughness | Morale | Strength |
  |---|---|---|---|---|---|---|
  | Militia infantry | +2 | 11 | +2 | 11 | +0 | 4 |
  | Trained infantry | +4 | 13 | +3 | 12 | +2 | 6 |
  | Veteran infantry | +5 | 14 | +4 | 13 | +4 | 6 |
  | Elite infantry | +6 | 15 | +5 | 14 | +6 | 6 |

  </div>

  Trained infantry is the default reference unit. Militia is both less capable and more fragile. Veterans and elites are better soldiers, not automatically larger formations.

  Strength normally remains 6 above militia quality to avoid making better units simultaneously much harder to damage and much longer to defeat.

- ### Other Basic Units

  <div class="block classTable frame" markdown="1">

  | Trained unit | Attack | Defense | Power | Toughness | Morale | Strength |
  |---|---|---|---|---|---|---|
  | Infantry, archers or cavalry | +4 | 13 | +3 | 12 | +2 | 6 |

  </div>

  Infantry, archers and cavalry use the same basic statistics. Their equipment determines what they can reasonably do in the fiction, not additional actions or automatic bonuses. Archers can shoot across an obstacle; cavalry can undertake mounted scouting; infantry can operate where horses cannot.

  Heavy infantry (trained quality) and irregular raiders have their own profiles:

  <div class="block classTable frame" markdown="1">

  | Unit | Attack | Defense | Power | Toughness | Morale | Strength |
  |---|---|---|---|---|---|---|
  | Heavy infantry | +3 | 14 | +3 | 14 | +2 | 6 |
  | Irregular raiders | +3 | 11 | +4 | 11 | +0 | 4 |

  </div>

  **Heavy infantry:** well-armoured soldiers suited to enduring punishment. Their protection is already represented in their statistics.

  **Irregular raiders:** aggressive but poorly disciplined fighters. Use for bandit bands, desperate attackers or similar forces.

  These profiles are not equal-cost choices. In particular, cavalry's campaign mobility and heavy infantry's protection should matter when recruitment and upkeep rules are eventually added. Until then, the GM assigns forces rather than offering unrestricted purchases.

- ### Reskinning Units

  Choose the nearest profile and change its name and description.

  &dash; Village levy: militia infantry.<br/>
  &dash; Town watch or household soldiers: trained infantry.<br/>
  &dash; Experienced mercenaries: veteran infantry.<br/>
  &dash; A ruler's picked bodyguard: elite infantry.<br/>
  &dash; Local bowmen: trained archers.<br/>
  &dash; Armoured foot soldiers: heavy infantry.<br/>
  &dash; Mounted border patrol: trained cavalry.<br/>
  &dash; A loose bandit warband: irregular raiders.<br/>

  Ancestry does not automatically change statistics. Different peoples can field units of any appropriate quality.

- ### Unit Size

  A standard unit contains approximately 50 soldiers. Use this size for all ordinary infantry, archers and cavalry.

  Strength measures the formation's ability to keep fighting, not individual soldiers. Losing 1 Strength does not mean a fixed number of deaths.

  Do not split or combine units during a battle. For unusually small or large forces, the GM assigns units before the battle begins.

- ### Making Variants

  Use a listed profile and change its name and description. Ordinary equipment differences do not change its statistics.

  To make a trained unit veteran, add +1 Attack, Defense, Power and Toughness, and +2 Morale. Apply the same increases again for elite quality. Strength stays unchanged.

  Militia uses its own profile; do not apply these increases to militia.

</div>

## Battle

<div class="columnstwo">

- ### Preparing a Battle

  Before rolling:

  &dash; Establish each side's objective and what would make it withdraw.<br/>
  &dash; List the participating units and their current Strength.<br/>
  &dash; Assign friendly units to players to control.<br/>
  &dash; Agree on any important battlefield circumstances.<br/>

  For a straightforward battle, the objective is to force every opposing unit to withdraw or be defeated.

  For another objective, state its exact completion condition before the first activation. For example: "Hold until the end of round 4 while the villagers escape." When that condition is met, end the battle and resolve the consequences.

  Use a small number of units, ideally one or two per player.

- ### Battle Rounds

  1. Each side rolls an unmodified d20 at the start of battle. Reroll ties.
  2. The winning side chooses who activates first.
  3. Sides alternate activating one unit that has not acted this round.
  4. An activated unit either **attacks** or **withdraws**.
  5. If one side runs out of unactivated units, the other side activates its remaining units.
  6. Once every remaining unit has acted, clear the acted markers and start another round. The same side activates first each round, but each side may choose its units in a different order.

  Each unit activates once per round. Mark units that have acted.

  Battle rounds are abstract periods of fighting, not six-second character combat rounds.

- ### Attacking

  Choose an enemy unit that can reasonably be attacked.

  1. Roll `1d20 + Attack` against its **Defense**.
  2. If the total meets or exceeds Defense, roll `1d20 + Power` against its **Toughness**.
  3. If that total meets or exceeds Toughness, the enemy loses 1 Strength.

  If either roll fails, no Strength is lost.

  Natural 1s and 20s have no additional effect; compare the total to the target number. There are no automatic counterattacks.

- ### Targets and Battlefield Circumstances

  There are no detailed unit-type targeting restrictions. Normally, a unit can attack any enemy unit. The GM may rule a target inaccessible when the fiction clearly requires it: for example, ordinary infantry cannot attack flying enemies that remain out of reach.

  Before a unit attacks, the GM may grant **advantage** or **disadvantage** on its Attack roll for one clear battlefield circumstance. Examples include prepared cover protecting the defender or an ambush favouring the attacker.

  Power and Morale rolls are normally unmodified by circumstances. Multiple sources of advantage do not stack. If both advantage and disadvantage apply, roll normally.

  Unit labels such as infantry, archers and cavalry describe capabilities but do not automatically grant additional actions or bonuses.

- ### Diminished Units and Morale

  A unit is **diminished** while its current Strength is half its maximum or less, rounding down. For example, a unit with maximum Strength 5 becomes diminished at 2 Strength.

  Whenever a unit loses Strength from an attack and its remaining Strength is greater than 0 but no more than half its maximum, it makes a Morale check: `1d20 + Morale` against **DC 15**. On a failure, it loses 1 additional Strength.

  That additional loss does not trigger another Morale check. Do not make a check if the unit has already reached 0 Strength.

  *Example:* a unit with maximum Strength 6 falls from 4 to 3. It is now diminished and checks Morale. If it fails, it falls to 2, with no further check from that extra loss.

- ### Defeat and Withdrawal

  At 0 Strength, a unit is **defeated** and removed from the battle. It cannot activate again.

  Defeat does not automatically mean every soldier is dead. Depending on the situation, the unit may have scattered, surrendered, fled or suffered heavy casualties.

  A unit can **withdraw** instead of attacking on its activation. Withdrawal succeeds automatically and removes the unit from this battle; it cannot return during the same battle. Withdrawal does not guarantee escape from a siege, encirclement or other campaign-level danger. The GM resolves those consequences separately.

  End the battle when:

  &dash; One side has no units remaining.<br/>
  &dash; One side concedes.<br/>
  &dash; An agreed objective resolves the conflict.

  There is no automatic pursuit phase.

- ### Player Characters

  Characters influence battles through leadership, preparation, negotiations, sabotage and separate encounters.

  Do not translate ordinary character attacks, healing, temporary hit points or spells directly into unit Strength or damage.

  A decisive character contribution can grant advantage on one friendly unit's next Attack roll. Agree on the affected unit when the contribution succeeds. Alternatively, it may change the situation, such as opening a gate or securing a withdrawal route.

- ### After the Battle

  Record the outcome and each unit's remaining Strength in the kingdom's army roster.

  &dash; A surviving unit that spends a full day resting safely restores 1 Strength, up to its maximum.<br/>
  &dash; A unit at 0 Strength does not recover automatically. The GM determines whether it can be reassembled, rescued or ransomed, or must be replaced.<br/>
  &dash; A unit is no longer diminished once its Strength rises above half its maximum.

  Recruitment, replacement costs and upkeep are handled separately.

- ### Using Roll20

  Represent each unit with one token:

  &dash; Display its name.<br/>
  &dash; Use one bar for current and maximum Strength.<br/>
  &dash; Use one status marker for "acted this round".<br/>
  &dash; Use another marker for "diminished".<br/>
  &dash; Keep its statistics in an associated handout or character entry.

  Place opposing units in two groups. Token positions have no mechanical effect.

  Make Attack, Power and Morale rolls in chat. Update Strength and markers manually. Record final losses in the kingdom sheet after the battle.

</div>
