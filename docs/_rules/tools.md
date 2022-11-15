---
#layout: default
title: Tools Proficiences
#description: undefined
#tags: ''
#systems:
#  - 5e
#renderer: V3
---

```css
@import url('https://fonts.googleapis.com/css2?family=Buenard&display=swap');

/* A4 Page Size */
.page {
	width  : 210mm;
	height : 296.8mm;
}
.page table thead { display: table-row-group;}
.page { background-image: url('https://robertrigo.github.io/page-background.jpg') }

.page { font-family: "Buenard";
  		 font-size: 13px; }

/* monster table stat color fix  */
.monster table tbody tr td { background-color: rgba(255, 0, 0, 0);}

/* Spell heading */
.spell {	text-align:center;
					margin-top: 5px;
					margin-bottom: 5px;
					background:#b5e2f1;	}

/* Info areas */
  .descriptive{ background-color: #b5e2f1 !important; }

  .phb hr+blockquote {
    background-color: #b5e2f1 !important;;
    background-position: center center;
    border-width: 6px;
    border-image: url(https://i.imgur.com/gtHyLi6.png);
    border-image-slice: 20 }

  .phb blockquote {background-color: #b5e2f1 !important;}
  .phb hr+blockquote hr+ul {color: #000;}
  .phb hr+blockquote table {color: #000;}

  .phb hr+blockquote hr {
    filter: hue-rotate(180deg);
	background-image: url(https://i.imgur.com/gtHyLi6.png)}

/* Feat block */
  .feat {	background-color: #E5E8E8;
					color: black;
 					border-radius: 8px;
					margin-bottom: 15px;
					font-size: 0.95em;
					padding: 2px; }

	.feat h2 { 	padding: 5px;
							background-color: #d42129;
							color: white;
							font-size: large;
							font-weight: bold;	}

/* Tables */
  table tr:nth-child(odd) td {background-color: #b5e2f1;}


/* styled Tables */
  .sTable {	background-color: #b5e2f1;
						color: white;
 						border-radius: 8px;
						margin-bottom: 15px;
						border-bottom: solid; }

	.sTable h4 {	padding: 8px 0px 6px 10px ; }

	.sTable th {	background-color: #E5E8E8;
								color: black;}

	.sTable td {	font-size: 0.95em; }

	.sTable tr:nth-child(odd) td {	background-color: #E5E8E8;
																	color: black; }

	.sTable tr:nth-child(even) td {	background-color: white;
																	color: black;}

/* Footer */
  .page:nth-child(odd):after{
    content          : '';
    position         : absolute;
    bottom           : 0px;
    left             : 10px;
    z-index          : -5;
    height           : 336px;
    width            : 100%;
    background-image : url('https://i.imgur.com/KsIZkRy.png');
    background-size  : cover;
}

  .page:nth-child(even):after{
    content          : '';
    position         : absolute;
    bottom           : 0px;
    left             : 0px;
    z-index          : -5;
    height           : 336px;
    width            : 100%;
    background-image : url('https://i.imgur.com/KsIZkRy.png');
    background-size  : cover;
}

/* Page Number */
  .page .pageNumber.auto:nth-child(odd):after{
    color      : #374360;
    position   : absolute;
    bottom     : 30px;
    z-index    : -5;
    width      : 50px;
    left       : -5px;
    text-align : center;
    font-size  : 15pt;

}
  .page .pageNumber.auto:nth-child(even):after{
    color      : #374360;
    position   : absolute;
    bottom     : 30px;
    z-index    : -5;
    width      : 50px;
    left       : 10px;
    text-align : center;
    font-size  : 15pt;
}

	top_image {
		position:absolute;
		top:0px;
		right:0px;
		width:100% }

```

# Tool Proficiencies
Tool proficiencies are a useful way to highlight a character’s background and talents. At the game table, though, the use of tools sometimes overlaps with the use of skills, and it can be unclear how to use them together in certain situations. This section offers various ways that tools can be used in the game.
:
The table of contents can also be used to roll a random set of tools.


{{toc
- **[Tool Descriptions](#p1)**
  - [1 Alchemist’s Supplies](#p2)
  - [2 Brewer’s Supplies](#p2)
  - [3 Calligrapher’s Supplies](#p2)
  - [4 Carpenter’s Tools](#p2)
  - [5 Cartographer’s Tools](#p3)
  - [6 Cobbler’s Tools](#p3)
  - [7 Cook’s Utensils](#p3)
  - [8 Disguise Kit](#p3)
  - [9 Forgery Kit](#p4)
  - [10 Fortune Teller’s Kit](#p4)
  - [11 Gaming Set](#p4)
  - [12 Glassblower’s Tools](#p4)
  - [13 Herbalism Kit](#p5)
  - [14 Jeweler’s Tools](#p5)
  - [15 Land and Water Vehicles](#p5)
  - [16 Leatherworker’s Tools](#p5)
  - [17 Mason’s Tools](#p5)
  - [18 Musical Instruments](#p6)
  - [19 Navigator’s Tools](#p6)
  - [20 Painter’s Supplies](#p6)
  - [21 Poisoner’s Kit](#p6)
  - [22 Potter’s Tools](#p6)
  - [23 Sculptor’s Tools](#p7)
  - [24 Smith’s Tools](#p7)
  - [25 Tattoo Artist’s Tools](#p7)
  - [26 Thieves’ Tools](#p7)
  - [27 Tinker’s Tools](#p7)
  - [28 Weaver’s Tools](#p8)
  - [29 Woodcarver’s Tools](#p8)
}}

### Tools and Skills Together
Tools have more specific applications than skills. The History skill applies to any event in the past. A tool such as a forgery kit is used to make fake objects and little else. Thus, why would a character who has the opportunity to acquire one or the other want to gain a tool proficiency instead of proficiency in a skill?

\column

**Advantage**. If the use of a tool and the use of a skill both apply to a check, and a character is proficient with the tool and the skill, the character to makes the check with advantage. In the tool descriptions that follow, this benefit is often expressed as additional insight (or something similar), which translates into an increased chance that the check will be a success.
:
**Added Benefit**. In addition, characters who have both a relevant skill and a relevant tool proficiency often gain an added benefit on a successful check. This benefit might be in the form of more detailed information or could simulate the effect of a different sort of successful check.

## Tool Descriptions
The following sections go into detail about the tools presented in the Player’s Handbook, offering advice on how to use them in a campaign.
:
**Components**. The first paragraph in each description gives details on what a set of supplies or tools is made up of. A character who is proficient with a tool knows how to use all of its component parts.
:
**Skills**. Every tool potentially provides advantage on a check when used in conjunction with certain skills, provided a character is proficient with the tool and the skill. As DM, you can allow a character to make a check using the indicated skill with advantage. Paragraphs that begin with skill names discuss these possibilities. In each of these paragraphs, the benefits apply only to someone who has proficiency with the tool, not someone who simply owns it.
:
With respect to skills, the system is mildly abstract in terms of what a tool proficiency represents; essentially, it assumes that a character who has proficiency with a tool also has learned about facets of the trade or profession that are not necessarily associated with the use of the tool.
:
In addition, you can consider giving a character extra information or an added benefit on a skill check. The text provides some examples and ideas when this opportunity is relevant.
:
**Special Use**. Proficiency with a tool usually brings with it a particular benefit in the form of a special use, as described in this paragraph.
:
**Sample DCs**. A table at the end of each section lists activities that a tool can be used to perform, and suggested DCs for the necessary ability checks.

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}
\page

### Alchemist’s Supplies
Alchemist’s supplies enable a character to produce useful concoctions, such as acid or alchemist’s fire.
:
**Components**. A collection of crucibles and glass vials, mortar and pestle, an alcohol-burning lamp, and a pouch of common alchemical ingredients, including salt, powdered iron, and purified water. These come in a box with velvet-lined cut-outs designed to hold the delicate instruments safely in place.
:
**Arcana**. Proficiency with alchemist’s supplies allows you to unlock more information on Arcana checks involving potions and similar materials.
:
**Investigation**. When you inspect an area for clues, proficiency with alchemist’s supplies grants additional insight into any chemicals or other substances that might have been used in the area.
:
**Alchemical Crafting**. You can use this tool proficiency to create alchemical items. A character can spend money to collect raw materials, which weigh 1 pound for every 50 gp spent. As part of a long rest, you can use alchemist’s supplies to make one dose of acid, alchemist’s fire, antitoxin, oil, perfume, or soap. Subtract half the value of the created item from the total gp worth of raw materials you are carrying.

{{sTable
#### Alchemist’s Supplies
| Activity | DC |
| :-- | :--: |
| Create a puff of thick smoke | 10 |
| Identify a poison | 10 |
| Identify a substance | 15 |
| Start a fire | 15 |
| Neutralize acid | 20 |
}}

### Brewer’s Supplies
Brewing is the art of producing beer. Not only does beer serve as an alcoholic beverage, but the process of brewing purifies water. Crafting beer takes weeks of fermentation, but only a few hours of work.
:
**Components**. Measuring bowls, scales, hops bags made of muslin, spices, hoses, a funnel, and other equipment suitable for brewing alcoholic beverages. Depending on the type of beverage crafted, kegs, casks, pitchers or other liquid storage devices may also be required for practicing this trade.
:
**History**. Proficiency with brewer’s supplies gives you additional insight on Intelligence (History) checks concerning events that involve alcohol as a significant element.
:
**Medicine**. This tool proficiency grants additional insight when you treat anyone suffering from alcohol poisoning or when you can use alcohol to dull pain.

\column

**Persuasion**. A stiff drink can help soften the hardest heart. Your proficiency with brewer’s supplies can help you ply someone with drink, giving them just enough alcohol to mellow their mood.
:
**Potable Water**. Your knowledge of brewing enables you to purify water that would otherwise be  undrinkable. As part of a long rest, you can purify up to 6 gallons of water, or 1 gallon as part of a short rest.

{{sTable
#### Brewer’s Supplies
| Activity | DC |
| :-- | :--: |
| Detect poison or impurities in a drink | 10 |
| Identify alcohol | 15 |
| Ignore effects of alcohol | 20 |
}}

### Calligrapher’s Supplies
Calligraphy treats writing as a delicate, beautiful art. Calligraphers produce text that is pleasing to the eye, using a style that is difficult to forge. Their supplies also give them some ability to examine scripts and determine if they are legitimate, since a calligrapher’s training involves long hours of studying writing and attempting to replicate its style and design.
:
**Components**. A set of fine pens, colorful inks, and fancy sheets of parchment. Also included are sealing waxes of various colors and qualities and an array of wax stamps.
:
**Arcana**. Although calligraphy is of little help in deciphering the content of magical writings, proficiency with these supplies can aid in identifying who wrote a script of a magical nature.
:
**History**. This tool proficiency can augment the benefit of successful checks made to analyze or investigate ancient writings, scrolls, or other texts, including runes etched in stone or messages in frescoes or other displays.
:
**Decipher Treasure Map**. This tool proficiency grants you expertise in examining maps. You can make an Intelligence check to determine a map’s age, whether a map includes any hidden messages, or similar facts.

{{sTable
#### Calligrapher’s Supplies
| Activity | DC |
| :-- | :--: |
| Identify writer of nonmagical script | 10 |
| Determine writer’s state of mind | 15 |
| Spot forged text | 15 |
| Forge a signature | 20 |
}}

### Carpenter’s Tools
Skill at carpentry enables a character to construct wooden structures. A carpenter can build a house, a shack, a wooden cabinet, or similar items.
:
**Components**. Mallets, nails, measuring cords, cutting templates or triangles, smoothing planes, a plane, a chisel and a small saw.

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}
\page

**History**. This tool proficiency aids you in identifying the use and the origin of wooden buildings and other large wooden objects.
:
**Investigation**. You gain additional insight when inspecting areas within wooden structures, because you know tricks of construction that can conceal areas from discovery.
:
**Perception**. You can spot irregularities in wooden walls or floors, making it easier to find trap doors and secret passages.
:
**Stealth**. You can quickly assess the weak spots in a wooden floor, making it easier to avoid the places that creak and groan when they’re stepped on.
:
**Fortify**. With 1 minute of work and raw materials, you can make a door or window harder to force open. Increase the DC needed to open it by 5.
:
**Temporary Shelter**. As part of a long rest, you can construct a lean-to or a similar shelter to keep your group dry and in the shade for the duration of the rest. Because it was fashioned quickly from whatever wood was available, the shelter collapses 1d3 days after being assembled.

{{sTable
#### Carpenter’s Tools
| Activity | DC |
| :-- | :--: |
| Build a simple wooden structure | 10 |
| Design a complex wooden structure | 15 |
| Find a weak point in a wooden wall | 15 |
| Pry apart a door | 20 |
}}

### Cartographer’s Tools
Using cartographer’s tools, you can create accurate maps to make travel easier for yourself and those who come after you. These maps can range from large-scale depictions of mountain ranges to diagrams that show the layout of a dungeon level.
:
**Components**. Cartographer’s tools consist of a satchel containing templates of maps and large, blank parchments suitable for map-making. It includes special inks and writing tools, particularly tools for drawing objects to scale relative to one another, a pair of compasses, calipers, and a ruler. Cartographer’s tools also include collapsible surveying rods, the measuring tools used to calculate overland distances and geographic features.
:
**Arcana, History, Religion**. You can use your knowledge of maps and locations to unearth more detailed information when you use these skills. For instance, you might spot hidden messages in a map, identify when the map was made to determine if geographical features have changed since then, and so forth.

\column

**Nature**. Your familiarity with physical geography makes it easier for you to answer questions or solve issues relating to the terrain around you.
:
**Survival**. Your understanding of geography makes it easier to find paths to civilization, to predict areas where villages or towns might be found, and to avoid becoming lost. You have studied so many maps that common patterns, such as how trade routes evolve and where settlements arise in relation to geographic locations, are familiar to you.
:
**Craft a Map**. While traveling, you can draw a map as you go in addition to engaging in other activity.

{{sTable
#### Cartographer’s Tools
| Activity | DC |
| :-- | :--: |
| Determine a map’s age and origin | 10 |
| Estimate direction and distance to a landmark | 15 |
| Discern that a map is fake | 15 |
| Fill in a missing part of a map | 20 |
}}
### Cobbler’s Tools
Although the cobbler’s trade might seem too humble for an adventurer, a good pair of boots will see a character across rugged wilderness and through deadly dungeons.
:
**Components**. These tools come in a box, and include a mallet and nails, sturdy sewing needles and thread, rolls of soft leather, stamped pieces of hard leather, molding implements, and other devices that aid in the construction and repair of footwear.
:
**Arcana, History**. Your knowledge of shoes aids you in identifying the magical properties of enchanted boots or the history of such items.
:
**Investigation**. Footwear holds a surprising number of secrets. You can learn where someone has recently visited by examining the wear and the dirt that has accumulated on their shoes. Your experience in repairing shoes makes it easier for you to identify where damage might come from.
:
**Maintain Shoes**. As part of a long rest, you can repair your companions’ shoes. For the next 24 hours, up to six creatures of your choice who wear shoes you worked on can travel up to 10 hours a day without making saving throws to avoid exhaustion.
:
**Craft Hidden Compartment**. With 8 hours of work, you can add a hidden compartment to a pair of shoes. The compartment can hold an object up to 3 inches long and 1 inch wide and deep. You make an Intelligence check using your tool proficiency to determine the Intelligence (Investigation) check DC needed to find the compartment.

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}
\page

{{sTable
#### Cobbler’s Tools
| Activity | DC |
| :-- | :--: |
| Determine a shoe’s age and origin | 10 |
| Find a hidden compartment in a boot heel | 15 |
}}

### Cook’s Utensils
Adventuring is a hard life. With a cook along on the journey, your meals will be much better than the typical mix of hardtack and dried fruit.
:
**Components**. Pans, knives, bottles of assorted seasonings, a journal of recipes, and tools used to produce food.
:
**History**. Your knowledge of cooking techniques allows you to assess the social patterns involved in a culture’s eating habits.
:
**Medicine**. When administering treatment, you can transform medicine that is bitter or sour into a pleasing concoction.

{{sTable
#### Cook’s Utensils
| Activity | DC |
| :-- | :--: |
| Create a typical meal | 10 |
| Duplicate a meal | 10 |
| Spot poison or impurities in food | 15 |
| Create a gourmet meal | 15 |
}}

### Disguise Kit
The perfect tool for anyone who wants to engage in trickery, a disguise kit enables its owner to adopt a false identity.
:
**Components**. A disguise kit includes cosmetics, hair dye, small props, and a few pieces of clothing.
:
**Deception**. In certain cases, a disguise can improve your ability to weave convincing lies.
:
**Intimidation**. The right disguise can make you look more fearsome, whether you want to scare someone away by posing as a plague victim or intimidate a gang of thugs by taking the appearance of a bully.
:
**Performance**. A cunning disguise can enhance an audience’s enjoyment of a performance, provided the disguise is properly designed to evoke the desired reaction.
:
**Persuasion**. Folk tend to trust a person in uniform. If you disguise yourself as an authority figure, your efforts to persuade others are often more effective.
:
**Create Disguise**. You can use a long rest or one day of downtime to create a disguise. Each disguise weighs 1 pound and takes one minute to put on or take off. This readymade disguise uses quite a few of your disguise kit components; you can only keep one disguise together at a time.

\column

When composing and applying a disguise not previously-created, you must use 10 minutes for one that involves moderate changes to your appearance, or 30 minutes for one that involves more extensive changes.

##### Disguise Kit
| Activity | DC |
| :-- | :--: |
| Cover injuries or distinguishing marks | 10 |
| Spot a disguise being used by someone else | 15 |
| Copy a humanoid’s appearance | 20 |

### Forgery Kit
A forgery kit is designed to duplicate documents and to make it easier to copy a person’s seal or signature.
:
**Components**. A forgery kit includes several different types of ink, a variety of parchments and papers, several quills, seals and sealing wax, gold and silver leaf, and small tools to sculpt melted wax to mimic a seal.
:
**Arcana**. A forgery kit can be used in conjunction with the Arcana skill to determine if a magic item is real or fake.
:
**Deception**. A well-crafted forgery, such as papers proclaiming you to be a noble or a writ that grants you safe passage, can lend credence to a lie.
:
**History**. A forgery kit combined with your knowledge of history improves your ability to create fake historical documents or to tell if an old document is authentic.
:
**Investigation**. When you examine objects, proficiency with a forgery kit is useful for determining how an object was made and whether it is genuine.
:
**Other Tools**. Knowledge of other tools makes your forgeries that much more believable. For example, you could combine proficiency with a forgery kit and proficiency with cartographer’s tools to make a fake map.
:
**Quick Fake**. As part of a short rest, you can produce a forged document no more than one page in length. As part of a long rest, you can produce a document that is up to four pages long. Your Intelligence check using a forgery kit determines the DC for someone else’s Intelligence (Investigation) check to spot the fake.

{{sTable
#### Forgery Kit
| Activity | DC |
| :-- | :--: |
| Mimic handwriting | 15 |
| Duplicate a wax seal | 20 |
}}

### Fortune Teller’s Kit
This kit comes in a box. It includes a crystal ball, fortune telling cards, and other tools of the trade. If proficient, your bonus applies to ability checks to tell fortunes convincingly. A fortune teller’s kit can be used to generate an income like artisan’s tools, provided they are used in a large enough area and in a society suitably tolerant of fortune tellers.

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}
\page

Use a fortune teller’s kit to understand someone you are telling a fortune to, determining a characteristic or ideal (DC 15), or determining a bond or flaw (DC 20).

### Gaming Set
Proficiency with a gaming set applies to one type of game, such as Three-Dragon Ante or games of chance that use dice.
:
**Components**. A gaming set has all the pieces needed to play a specific game or type of game, such as a complete deck of cards or a board and tokens.
:
**History**. Your mastery of a game includes knowledge of its history, as well as of important events it was connected to or prominent historical figures involved with it.
:
**Insight**. Playing games with someone is a good way to gain understanding of their personality, granting you a better ability to discern their lies from their truths and read their mood.
:
**Sleight of Hand**. Sleight of Hand is a useful skill for cheating at a game, as it allows you to swap pieces, palm cards, or alter a die roll. Alternatively, engrossing a target in a game by manipulating the components with dexterous movements is a great distraction for a
pickpocketing attempt.

{{sTable
#### Gaming Set
| Activity | DC |
| :-- | :--: |
| Catch a player cheating | 15 |
| Gain insight into an opponent’s personality | 15 |
}}

### Glassblower’s Tools
Someone who is proficient with glassblower’s tools has not only the ability to shape glass, but also specialized knowledge of the methods used to produce glass objects.
:
**Components**. This kit contains crimps and clamps, a pouring block, shears, and a blowpipe, items used to manipulate glass with a kiln or another source of high heat. It also contains rods of glass in various colors.
:
**Arcana, History**. Your knowledge of glassmaking techniques aids you when you examine glass objects, such as potion bottles or glass items found in a treasure hoard. For instance, you can study how a glass potion bottle has been changed by its contents to help determine a potion’s effects. (A potion might leave behind a residue, deform the glass, or stain it.)
:
**Investigation**. When you study an area, your knowledge can aid you if the clues include broken glass or glass objects.
:
**Identify Weakness**. With 1 minute of study, you can identify the weak points in a glass object. Any damage dealt to the object by striking a weak spot is doubled.

\column

{{sTable
#### Glassblower’s Tools
| Activity | DC |
| :-- | :--: |
| Identify source of glass | 10 |
| Determine what a glass object once held | 20 |
}}

### Herbalism Kit
Proficiency with an herbalism kit allows you to identify plants and safely collect their useful elements.
:
**Components**. An herbalism kit includes pouches to store herbs, clippers and leather gloves for collecting plants, a mortar and pestle, and several glass jars.
:
**Arcana**. Your knowledge of the nature and uses of herbs can add insight to your magical studies that deal with plants and your attempts to identify potions.
:
**Investigation**. When you inspect an area overgrown with plants, your proficiency can help you pick out details and clues that others might miss.
:
**Medicine**. Your mastery of herbalism improves your ability to treat illnesses and wounds by augmenting your methods of care with medicinal plants.
:
**Nature and Survival**. When you travel in the wild, your skill in herbalism makes it easier to identify plants and spot sources of food that others might overlook.
:
**Identify Plants**. You can identify most plants with a quick inspection of their appearance and smell.

{{sTable
#### Herbalism Kit
| Activity | DC |
| :-- | :--: |
| Find plants | 15 |
| Identify poison | 20 |
}}

### Jeweler’s Tools
Training with jeweler’s tools includes the basic techniques needed to beautify gems. It also gives you expertise in identifying precious stones.
:
**Components**. This kit contains chisels, brushes, polish, and other tools used to prepare or enhance gemstones, plus small-scale metalworking tools used to shape precious metals into jewelry of various kinds. A small jeweler’s loupe is included for examining jewelry and gemstones.
:
**Arcana**. Proficiency with jeweler’s tools grants you knowledge about the reputed mystical uses of gems. This insight proves handy when you make Arcana checks related to gems or gemencrusted items.
:
**Investigation**. When you inspect jeweled objects, your proficiency with jeweler’s tools aids you in picking out clues they might hold.

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}
\page

**Identify Gems**. You can identify and appraise the value of gemstones at a glance, applying your proficiency modifier to any such checks.
:
**Cut Gems**. Turning a raw gem into a standard one is a crafting project that requires 1 day of work per 5 gp of value added, up to the standard value of the gemstone. This is not the same as modifying a gem’s appearance; that task requires a Dexterity (jeweler’s tools) check and turns a gemstone of one shape or cut into a gemstone of another.

{{sTable
#### Jeweler’s Tools
| Activity | DC |
| :-- | :--: |
| Modify a gem’s appearance | 15 |
| Determine a gem’s history | 20 |
}}

### Land and Water Vehicles
Proficiency with land vehicles covers a wide range of options, from chariots and howdahs to wagons and carts. Proficiency with water vehicles covers anything that navigates waterways. Proficiency with vehicles grants the knowledge needed to handle vehicles of that type, along with knowledge of how to repair and maintain them.
:
In addition, a character proficient with water vehicles is knowledgeable about anything a professional sailor would be familiar with, such as information about the sea and islands, tying knots, and assessing weather and sea conditions.
:
**Arcana**. When you study a magic vehicle, this tool proficiency aids you in uncovering lore or determining how the vehicle operates.
:
**Investigation, Perception**. When you inspect a vehicle for clues or hidden information, your proficiency aids you in noticing things that others might miss.
:
**Vehicle Handling**. When piloting a vehicle, you can apply your proficiency bonus to the vehicle’s AC and saving throws.

{{sTable
#### Vehicles
| Activity | DC |
| :-- | :--: |
| Navigate rough terrain or waters | 10 |
| Assess a vehicle’s condition | 15 |
| Take a tight corner at high speed | 20 |
}}

### Leatherworker’s Tools
Knowledge of leatherworking extends to lore concerning animal hides and their properties. It also confers knowledge of leather armor and similar goods.
:
**Components**. This kit contains cutting and edging tools, grommet setters and punches, a mallet, needles and awls, and other miscellaneous tools used to craft processed leather into clothing and accessories.

\column

**Arcana**. Your expertise in working with leather grants you added insight when you inspect magic items crafted from leather, such as boots and some cloaks.
:
**Investigation**. You gain added insight when studying leather items or clues related to them, as you draw on your knowledge of leather to pick out details that others would overlook.
:
**Identify Hides**. When looking at a hide or a leather item, you can determine the source of the leather and any special techniques used to treat it. For example, you can spot the difference between leather crafted using dwarven methods and leather crafted using halfling methods.

{{sTable
#### Leatherworker’s Tools
| Activity | DC |
| :-- | :--: |
| Modify a leather item’s appearance | 10 |
| Determine a leather item’s history | 20 |
}}

### Mason’s Tools
Mason’s tools allow you to craft stone structures, including walls and buildings crafted from brick.
:
**Components**. This satchel contains the tools used to craft masonry. In addition to the trowels and joint molders, used to apply mortar, the kit includes telescoping pole braces and measuring blocks used to measure and precisely align stone and brickwork of various kinds.
:
**History**. Your expertise aids you in identifying a stone building’s date of construction and purpose, along with insight into who might have built it.
:
**Investigation**. You gain additional insight when inspecting areas within stone structures.
:
**Perception**. You can spot irregularities in stone walls or floors, making it easier to find trap doors and secret passages.
:
**Demolition**. Your knowledge of masonry allows you to spot weak points in brick walls. You deal double damage to such structures with your weapon attacks.

{{sTable
#### Mason’s Tools
| Activity | DC |
| :-- | :--: |
| Chisel a small hole in a stone wall | 10 |
| Find a weak point in a stone wall | 15 |
}}


### Musical Instruments
Proficiency with a musical instrument indicates you are familiar with the techniques used to play it. You also have knowledge of some songs commonly performed with that instrument.
:
**History**. Your expertise aids you in recalling lore related to your instrument.

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}
\page

**Performance**. Your ability to put on a good show is improved when you incorporate an instrument into your act.
:
**Compose a Tune**. As part of a long rest, you can compose a new tune and lyrics for your instrument. You might use this ability to impress a noble or spread scandalous rumors with a catchy tune.

{{sTable
#### Musical Instrument
| Activity | DC |
| :-- | :--: |
| Identify a tune | 10 |
| Improvise a tune | 20 |
}}

### Navigator’s Tools
Proficiency with navigator’s tools helps you determine a true course based on observing the stars. It also grants you insight into charts and maps while developing your sense of direction.
:
**Components**. Navigator’s tools include a sextant, a compass, calipers, a ruler, parchment, ink, and a quill.
:
**Survival**. Knowledge of navigator’s tools helps you avoid becoming lost and also grants you insight into the most likely location for roads and settlements.
:
**Sighting**. By taking careful measurements, you can determine your position on a nautical chart and the time of day.

{{sTable
#### Navigator’s Tools
| Activity | DC |
| :-- | :--: |
| Plot a course | 10 |
| Discover your position on a nautical chart | 15 |
}}
### Painter’s Supplies
Proficiency with painter’s supplies represents your ability to paint and draw. You also acquire an understanding of art history, which can aid you in examining works of art.
:
**Components**. Small pots of paints in various colors, alchemical mixtures for paint thinning, a painter’s palette, and an array of paintbrushes. This set of tools typically includes brushes sized for the sort of work the painter intends, from artistic to functional. These include the small, intricate brushes used to put paint on canvas, or the larger type of brushes suitable to painting buildings or murals.
:
**Arcana, History, Religion**. Your expertise aids you in uncovering lore of any sort that is attached to a work of art, such as the magical properties of a painting or the origins of a strange mural found in a dungeon.
:
**Investigation, Perception**. When you inspect a painting or a similar work of visual art, your knowledge of the practices behind creating it can grant you additional insight.

\column

**Painting and Drawing**. As part of a short or long rest, you can produce a simple work of art. Although your work might lack precision, you can capture an image or a scene, or make a quick copy of a piece of art you saw.

{{sTable
#### Painter’s Supplies
| Activity | DC |
| :-- | :--: |
| Paint an accurate portrait | 10 |
| Create a painting with a hidden message | 20 |
}}

### Poisoner’s Kit
A poisoner’s kit is a favored resource for thieves, assassins, and others who engage in skulduggery. It allows you to apply poisons and create them from various materials. Your knowledge of poisons also helps you treat them.
:
**Components**. A poisoner’s kit includes glass vials, a mortar and pestle, chemicals, and a glass stirring rod.
:
**History**. Your training with poisons can help you when you try to recall facts about infamous poisonings.
:
**Investigation, Perception**. Your knowledge of poisons has taught you to handle those substances carefully, giving you an edge when you inspect poisoned objects or try to extract clues from events that involve poison.
:
**Medicine**. When you treat the victim of a poison, your knowledge grants you added insight into how to provide the best care to your patient.
:
**Nature, Survival**. Working with poisons enables you to acquire lore about which plants and animals are poisonous.
:
**Handle Poison**. Your proficiency allows you to handle and apply a poison without risk of exposing yourself to its effects.

{{sTable
#### Poisoner’s Tools
| Activity | DC |
| :-- | :--: |
| Spot a poisoned object | 10 |
| Determine the effects of a poison | 20 |
}}

### Potter’s Tools
Potter’s tools are used to create a variety of ceramic objects, most typically pots and similar vessels.
:
**Components**. These tools are used to craft and repair pottery. They include molds, knives, sponges, and styluses for decorating pottery, alchemical glues for repairing shattered pottery pieces, and the dyes and glazes for finishing or resurfacing them.
:
**History**. Your expertise aids you in identifying ceramic objects, including when they were created and their likely place or culture of origin.

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}
\page

**Investigation, Perception**. You gain additional insight when inspecting ceramics, uncovering clues others would overlook by spotting minor irregularities.
:
**Reconstruction**. Examining two or more shards of a piece of pottery allows you to automatically identify its original shape and its likely purpose. As part of a long rest, you can use potter's tools to create or reconstruct a ceramic object that is no more than 3 feet in any dimension. If you are missing a ceramic shard needed to reconstruct the object, you can melt down and reshape ceramic that you already have to create a replacement.

{{sTable
#### Potter’s Tools
| Activity | DC |
| :-- | :--: |
| Determine what a vessel once held | 10 |
| Create a serviceable pot | 15 |
| Find a weak point in a ceramic object | 20 |
}}

### Sculptor’s Tools
This satchel contains chisels, mallets, files, and finishing polishes for sculpting statues out of minerals (typically stone or clay), or applying decorative engraving to the mineral surfaces of walls, doors, and other edifices.
:
With one minute of study, you can identify weak points in inanimate sculptures such that your successful attacks, or the successful attacks of others that you direct, are automatically critical hits.
:
Use sculptor’s tools to modify a statute (DC 10) or detect hidden messages in the designs engraved into a wall or similar surface (DC 20).

### Smith’s Tools
Smith’s tools allow you to work metal, heating it to alter its shape, repair damage, or work raw ingots into useful items.
:
**Components**. Hammers and tongs of various kinds used to shape metal, as well as the crimps used for creating rivets or repairing links of chain.
:
**Arcana and History**. Your expertise lends you additional insight when examining metal objects, such as weapons.
:
**Investigation**. You can spot clues and make deductions that others might overlook when an investigation involves armor, weapons, or other metalwork.
:
**Repair**. With access to your tools and an open flame hot enough to make metal pliable, you can restore 10 hit points to a damaged metal object for each hour of work.

{{sTable
#### Smith’s Tools
| Activity | DC |
| :-- | :--: |
| Sharpen a dull blade | 10 |
| Repair a suit of armor | 15 |
| Sunder a nonmagical metal object | 15 |
}}

\column

### Tattoo Artist’s Tools
This set of tools includes a variety of needles and inks as well as ointments and various treatments used to create tattoos on the skin of animals and humanoids.
:
Use tattoo artist’s tools to identify tattooing techniques or origins (DC 10) or create tattoos with hidden meanings or messages (DC 20).

### Thieves’ Tools
Perhaps the most common tools used by adventurers, thieves’ tools are designed for picking locks and foiling traps. Proficiency with the tools also grants you a general knowledge of traps and locks.
:
**Components**. A complex set of picks and tools used to disable locks and traps, rolled into a leather satchel. These tools resemble a highly specialized segment of tinker’s tools and can be disguised as such.
:
**History**. Your knowledge of traps grants you insight when answering questions about locations that are renowned for their traps.
:
**Investigation and Perception**. You gain additional insight when looking for traps, because you have learned a variety of common signs that betray their presence.
:
**Set a Trap**. Just as you can disable traps, you can also set them. As part of a short rest, you can create a trap using items you have on hand. The total of your check becomes the DC for someone else’s attempt to discover or disable the trap. The trap deals damage appropriate to the materials used in crafting it (such as poison or a weapon) or damage equal to half the total of your check, whichever the DM deems appropriate.
:
**Reset a Trap**. You can also reset a disabled trap if your check meets the original DC to disable it. Reset traps use their original DCs to discover or disable, along with their original damage (unless a vital component is missing, like poison for the spikes).

{{sTable
#### Thieves' Tools
| Activity | DC |
| :-- | :--: |
| Pick a lock | 5-30 |
| Disable a trap | 5-30 |
}}

### Tinker’s Tools
A set of tinker’s tools is designed to enable you to repair many mundane objects. Though you can’t manufacture much with tinker’s tools, you can mend torn clothes, sharpen a worn sword, and patch a tattered suit of chain mail.

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}
\page

**Components**. Various tools used for crafting or repairing intricate machines. These look like smith’s tools or thieves’ tools, but on a tiny scale. The hammers, chisels, picks, and other implements are typically suitable for application to small projects like clockwork devices. Most tool sets also include an array of mundane materials to repair almost any simple object.
:
**History**. You can determine the age and origin of objects, even if you have only a few pieces remaining from the original.
:
**Investigation**. When you inspect a damaged object, you gain knowledge of how it was damaged and how long ago.
:
**Repair**. These tools can be used to repair most portable items made of metal, leather, or cloth, regardless of the artisan’s tools needed to craft such things. You can  restore 10 hit points to a damage object per hour of work. You need access to the appropriate materials for this task, and a hot enough flame if you are repairing metal objects.

{{sTable
#### Tinker’s Tools
| Activity | DC |
| :-- | :--: |
| Temporarily repair a disabled device | 10 |
| Repair an item in half the time | 15 |
| Improvise a temporary item using scraps | 20 |
}}

### Weaver’s Tools
Weaver’s tools allow you to create cloth and tailor it into articles of clothing.
:
**Components**. A small, collapsible loom and shuttle used for weaving, plus various dyes and tools used to treat and store wool and other types of thread. These materials are suitable for the creation of clothing.
:
**Arcana, History**. Your expertise lends you additional insight when examining cloth objects, including cloaks and robes.
:
**Investigation**. Using your knowledge of the process of creating cloth objects, you can spot clues and make deductions that others would overlook when you examine tapestries, upholstery, clothing, and other woven items.
.
**Repair**. You can repair a single damaged garment as part of a short rest.
:
**Craft Clothing**. Assuming you have access to sufficient cloth and thread, you can create an outfit for a creature as part of a long rest.

{{sTable
#### Weaver’s Tools
| Activity | DC |
| :-- | :--: |
| Repurpose cloth | 10 |
| Mend a hole in a piece of cloth | 10 |
| Tailor an outfit | 15 |
}}

\column

### Woodcarver’s Tools
Woodcarver’s tools allow you to craft intricate objects from wood, such as wooden tokens or arrows.
:
**Components**. A set of chisels, files, carving knives, small lathes, and other instruments for making fine impressions on wooden pieces.
:
**Arcana, History**. Your expertise lends you additional insight when you examine wooden objects, such as figurines or arrows.
:
**Nature**. Your knowledge of wooden objects gives you some added insight when you examine trees.
:
**Repair**. As part of a short rest, you can repair a single damaged wooden object.
:
**Craft Arrows**. As part of a short rest, you can craft up to five arrows. As part of a long rest, you can craft up to twenty. You must have enough wood on hand to produce them.

{{sTable
#### Woodcarver’s Tools
| Activity | DC |
| :-- | :--: |
| Craft a small wooden figurine | 10 |
| Carve an intricate pattern in wood | 15 |
}}

![skull_divider](https://robertrigo.github.io/pics/skull_divider.png) {position:absolute,bottom:60px,left:120px,width:70%}

![top_image](https://robertrigo.github.io/pics/KsIZkRy.png) {position:absolute,top:0px,right:0px,width:100%}

{{pageNumber,auto}}