<!DOCTYPE html>

<html>
<head>
  <!-- Compiled and minified Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <!-- jQuery library -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <!-- Compiled Bootstrap JavaScript -->
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

  <link rel="stylesheet" type="text/css" href="../assets/css/originalDndStyle.css">
  
  <style>
  
    body {font-family: "Buenard";
  		 font-size: 13px;}

</style>


<title>Equipment</title>
</head>

<body>
  <div class="row">
    <div class="col-sm-1"></div>
    <div class="col-sm-11">
      <h1>Skills</h1>
      In addition to the ones a character gets at character creation, gain a skill point each level.  Each skill costs 1 skill point. 
      Feats are not used anymore.

      <h2>Terms</h2>
      Cumulative. This can be taken several times. Cost increases by 1 each time.
      Expertise. Advantage on checks using this proficiency
      Expertise (Ability X, Ability Y). You have advantage, but one of the dice uses ability modifier X and the other ability modifier Y.
      Group. You cannot learn this as it is a group of skills. Select one of the skills in the description.
      Synergy (X). If you have proficiency with skill X, gain advantage when using that skill.
      Trait. A trait is like a binary skill; either you can do it or not. A roll is not required in most cases.
      Untrained. Unless a trait or a specialized activity, this skill can normally be attempted without having proficiency.
      → X. If you have proficiency with skill X, the cost of this skill is reduced by 1.
      Ability score increase 2 p
      Remove cumulative stat inc
      Add cumulative +1 to skills after expertise is achieved
      
      <ul class="nav nav-pills">
        <li class="active"><a data-toggle="pill" href="#untrained">Untrained</a></li>
        <li><a data-toggle="pill" href="#knowledge">Knowledge</a></li>
        <li><a data-toggle="pill" href="#craft">Craft</a></li>
      </ul>
      
      <div class="tab-content">
        <div id="untrained" class="tab-pane fade in active">
          <h3>Untrained Skills</h3>
          <p>List of skills</p>


      <div class="panel-group" id="untrainedAccordion">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <a data-toggle="collapse" data-parent="#accordion" href="#acrobatics">Acrobatics</a>
            </h4>
          </div>
          <div id="acrobatics" class="panel-collapse collapse">
            <div class="panel-body">
              <i>(Untrained)</i><br>
              This skill mixes various physical performances with feats of extraordinary balance, agility and coordination. It incorporates numerous amusements and stunts which can be performed for an audience, as well as tricks that can serve the character well in other ventures, such as staying on your feet when trying to run across a sheet of ice, balance on a tightrope, or stay upright on a rocking ships’ deck. It is commonly mastered by jugglers, tumblers, aerialists and other circus performers — persons fascinating to watch but not of particularly high social standing.
            
              <div class="panel-group" id="accordion">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">
                      <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsAerial">Aerial Acrobatics</a>
                    </h3>
                  </div>
                  <div id="acrobaticsAerial" class="panel-collapse collapse">
                    <div class="panel-body">
                    Acrobatics performed in the air on a suspended apparatus such as a trapeze, a vertically hanging rope (corde lisse), a long length of fabric or similar. When making a performance you have Expertise (Dex, Cha). During adventuring you could use this skill with Expertise to jump from a balcony to catch a rope, move between chandeliers, climb ropes (using Strength) or other similar aerial feats.
                    </div>
                  </div>
                </div>

                    <div class="panel panel-default">
                      <div class="panel-heading">
                        <h3 class="panel-title">
                          <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsContortion">Contortion</a>
                        </h3>
                      </div>
                      <div id="acrobaticsContortion" class="panel-collapse collapse">
                        <div class="panel-body">  
                        (trait). The skill of extreme physical flexibility. This skill allows you to squeeze through very tight spaces as long as your head fits. You have Expertise to escape grapples.
                      Body Packing (trait). You can squeeze your body into a small, knee-high box or other contained space which appears as being too small to contain you.
                      Dislocation (trait). You can easily dislocate your shoulders and with a bit more effort even your hip joints. This allows you to escape most bonds given time. 
                    </div>
                  </div>
                </div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsFast">Fast Reflexes</a>
                </h3>
              </div>
              <div id="acrobaticsFast" class="panel-collapse collapse">
                <div class="panel-body"> 
              (trait). The large amount of training you have put yourself through has made you able to react without a conscious thought. You can use reactions before you have had the chance to act in a combat. This applies even if you are surprised.
            </div>
          </div>
        </div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsGive">Give Exhibition</a>
                </h3>
              </div>
              <div id="acrobaticsGive" class="panel-collapse collapse">
                <div class="panel-body"> 
              Enabling you to put on an acrobatic performance, incorporating elements of juggling, tumbling and so on. The character is assumed to perform tricks regularly and work at his or her craft to invent something new. When making a performance you have Expertise (Dex, Cha).
            </div>
          </div>
</div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsImproved">Improved Dexterity</a>
                </h3>
              </div>
              <div id="acrobaticsImproved" class="panel-collapse collapse">
                <div class="panel-body"> 
              (cumulative, trait). You have trained to improve your agility, reflexes and/or balance. Gain +1 Dexterity.
            </div>
          </div>
        </div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsParkour">Parkour</a>
                </h3>
              </div>
              <div id="acrobaticsParkour" class="panel-collapse collapse">
                <div class="panel-body"> 
              The skill by which characters aim to move from one point to another in a complex, jumbled environment, without equipment and in the fastest and most efficient way possible. You have Expertise on checks made to avoid the effects of non-magical difficult terrain. As a bonus action, you can make a DC 12 Dexterity (Parkour) check. If you succeed, difficult terrain doesn’t cost you extra movement until the end of the current turn.
              Parkour through magic (→ Arcana). You also have Expertise on checks made to avoid the effects of magical difficult terrain.
              Wall Runner (trait). When you take the Dash action and move at least 10 ft, you may climb up to 10 ft of shear wall without using any additional movement. You cannot end your movement there without falling. When climbing you may also do a high or long jump.
            </div>
          </div>
</div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsPole">Pole Vault </a>
                </h3>
              </div>
              <div id="acrobaticsPole" class="panel-collapse collapse">
                <div class="panel-body"> 
              (trait). You are skilled at using a pole to overcome obstacles. If you have a pole or staff, you can use an item action to extend your jumping distance by the length of the pole.
            </div>
          </div>
        </div>

            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsRoll">Roll with the blow</a>
                </h3>
              </div>
              <div id="acrobaticsRoll" class="panel-collapse collapse">
                <div class="panel-body"> 
              When struck by an effect that moves you and you can see, you may choose to "roll with the blow". If you do, move an additional 5 ft, and gain Expertise on any checks to avoid falling prone. If it does not allow a check, you can still make an Dexterity (Roll with the blow) check against a DC equal to damage dealt, or if no damage, a DC of 15. This includes forced movement from critical hits and fumbles. Also, note that you can only do this if there is enough space behind you.
              Roll with the blow II. You may roll with the blow against any attack that deals bludgeoning damage, as long as you have a 5 ft behind you and spend a reaction. On a successful Dexterity (Roll with the blow) check against a DC equal to the damage dealt, you gain resistance to the attack and move 5 ft back (without provoking an attack of opportunity). If you roll a 1, you fall prone, and are not allowed a check to avoid it.
            </div>
          </div></div>


            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsSlip">Slip Trap</a>
                </h3>
              </div>
              <div id="acrobaticsSlip" class="panel-collapse collapse">
                <div class="panel-body"> 
              Your fast reflexes and acrobatic training allows you to forgo damage from traps by nimbly twisting your body to escape harm. When a trap allows for a Dexterity save, you can use this skill with Expertise instead.
            </div>
          </div></div>


            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsStability">Stability</a>
                </h3>
              </div>
              <div id="acrobaticsStability" class="panel-collapse collapse">
                <div class="panel-body"> 
              You have exceptional balance. This skill grants Expertise on all checks to keep your balance, such as balancing on a ledge, to stay upright on a ship or even to keep you footing within a grease spell.
              Beam walking (trait). You are comfortable on narrow beams or ledges, as long as they are at least 4 in. wide. You are able to disregard any distance, even a thousand feet, that may threaten beneath your footing. Furthermore, you are able to sit comfortably, rest and eat on such a ledge.
              Log Riding (trait). Enables sure-footedness when clambering across loose logs moving upon a rivercourse; requires a peavey, a short hooked pike.
              Tightrope walking (trait). You are skilled at walking along a thin wire or rope, allowing you to walk at full speed.
            </div>
          </div>
</div>
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  <a data-toggle="collapse" data-parent="#accordion" href="#acrobaticsTumbling">Tumbling</a>
                </h3>
              </div>
              <div id="acrobaticsTumbling" class="panel-collapse collapse">
                <div class="panel-body"> 
              The acrobatic skill of doing rolls, twists, somersaults and other rotational activities using the whole body. This skill grants Expertise on such checks, as well as the following benefits.
              When prone, standing up uses only 5 ft of your movement. 
              If you spend 1 minute stretching and limbering up, you gain advantage on one Strength check.
              You may safely fall a number of feet equal to your Dexterity modifier x5.
                    </div>
          </div>
        </div>
      </div> 
    
    </div>
          </div>
        </div>

        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <a data-toggle="collapse" data-parent="#untrainedAccordion" href="#animalHandling">Animal Handling</a>
            </h4>
          </div>
          <div id="animalHandling" class="panel-collapse collapse">
            <div class="panel-body">Description of skill</div>
          </div>
        </div>
        
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <a data-toggle="collapse" data-parent="#untrainedAccordion" href="#gaming">Gaming</a>
            </h4>
          </div>
          <div id="gaming" class="panel-collapse collapse">
            <div class="panel-body">Description of skill</div>
          </div>
        </div>
      </div>
     

      
        </div>

        <div id="knowledge" class="tab-pane fade">
          <h3>Knowledge Skills</h3>
          <p>List of skills</p>
        </div>
        <div id="craft" class="tab-pane fade">
          <h3>Craft Skills</h3>
          <p>List of skills</p>
        </div>
      </div>
    </div>
  </div>  
  </div>
</body>