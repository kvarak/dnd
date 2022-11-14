
$(document).ready(function () {
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    // Initialize featTable and its functions
    var featTable = $('#featTable').DataTable({
      'paging': false,
      'info': false});

    $('#featTable tbody').on( 'click', 'tr', function () {
      $(this).toggleClass('info');
    });

    $('#deselect').click( function () {
      featTable.rows('.info').nodes().to$().removeClass('info');
    });

    $('.applySub').click( function () {
      var sub = $(this).attr("id");
      var currentURL = window.location.href;
      if (currentURL.includes('sub=')) {
        var newURL = currentURL.replace(/sub=\w+/, 'sub=' + sub);
      } else if (currentURL.includes('?')) {
        var newURL = currentURL + '&sub=' + sub;
      } else {
        var newURL = currentURL + '?sub=' + sub;
      };
      window.location.href = newURL;
   });
    
    ///////////////////////////////////////////
    ///////////////////////////////////////////
    // Initialize classTable and its functions
    var classTable = $('.classTable').DataTable({
      'paging': false,
      'info': false,
      'searching': false,
      'ordering': false });

      $('#applyFeats').click( function () {
        var selectedRows = featTable.rows('.info').data();
        if (selectedRows.length == 0) {
          alert('No feats selected!');
        } else {
          var featString = 'feat='
          for (var i=0 ; i < selectedRows.length ; i++) {
            featString += selectedRows[i].DT_RowId;
          };
  
          var currentURL = window.location.href;
          if (currentURL.includes('feat=')) {
            var newURL = currentURL.replace(/feat=\w+/, featString);
          } else if (currentURL.includes('?')) {
            var newURL = currentURL + '&' + featString;
          } else {
            var newURL = currentURL + '?' + featString;
          }
          window.location.href = newURL;
        }
     });
  
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    // Get url parameters if there. Otherwise they will be undefined
    var URLparameters = window.location.search.substring(1).split('&');
    for (var i = 0; i < URLparameters.length; i++) {
      var parameter = URLparameters[i].split('=');
      window[parameter[0]] = parameter[1];
    }
    
    // Adjust content based on GET parameters in the URL
    if (typeof sub !== 'undefined') {
      applySub(sub)
    }

    if (typeof feat !== 'undefined') {
      var featList = feat.match(/(.{1,2})/g);
      applyFeat(featList);
    }

    if (typeof lvl !== 'undefined') {
      $('.lvl1').hide();
      var nextLevelInfo = '<h3>Next level</h3><strong>Hit points:</strong> 1d10 or 6 hp<br><strong>Proficiency modifier:</strong> ';
      
      var prof = parseInt(classTable.cell(lvl, 1).data());
      var previousProf = parseInt(classTable.cell(lvl-1, 1).data());
      if (prof == previousProf) {
        nextLevelInfo += 'No change';
      } else { 
        nextLevelInfo += '+1';
      }
      
      var features = classTable.cell(lvl, 2).data();
      $('#nextLevel').html(nextLevelInfo + '<br><strong>New features:</strong> ' + features )
      $('.nextLevel').show();
      
      for (var i = 20; i > lvl-1; i--) { 
       classTable.rows(i).remove();
      }
      classTable.draw()
    }
    
    //////////////////////////////////////////
    //////////////////////////////////////////
    // For showing&hiding relevant features
    $('.btn-show').click(function(){
      $('.features').collapse('show');
    });
    $('.btn-hide').click(function(){
      $('.features').collapse('hide');
    });
    
    $('.sub-show').click(function(){
      $('.subFeatures').collapse('show');
    });
    $('.sub-hide').click(function(){
      $('.subFeatures').collapse('hide');
    });
    
    //////////////////////////////////
    // Selecting archetypes to view
    $('#archetypeSelection').change(function(){          
      var value = $('#archetypeSelection option:selected').val();
      var archetype = $('#' + value);
      $('.archetype').addClass('hidden');
      archetype.removeClass('hidden');
      featTable.rows('.info').nodes().to$().removeClass('info');
    });    

    // Spell tooltip
    $('#calmEmotions').tooltip({title: "<h4 class='tooltip-header'>Calm Emotions</h4><br><em>2nd-level enchantment</em><br><strong>Casting time:</strong> Action<br><strong>Range:</strong> 60ft<br><strong>Components:</strong> V, S<br><strong>Duration:</strong> Concentration, up to 1 minute<br><p>You attempt to suppress strong emotions in a group of people. Each humanoid in a 20-foot-radius sphere centered on a point you choose within range must make a Charisma saving throw; a creature can choose to fail this saving throw if it wishes. If a creature fails its saving throw, choose one of the following two effects.</p><p>You can suppress any effect causing a target to be charmed or frightened. When this spell ends, any suppressed effect resumes, provided that its duration has not expired in the meantime.</p><p>Alternatively, you can make a target indifferent about creatures of your choice that it is hostile toward. This indifference ends if the target is attacked or harmed by a spell or if it witnesses any of its friends being harmed. When the spell ends, the creature becomes hostile again, unless the DM rules otherwise.", html: true, placement: "auto"}); 
    
    });

///////////////////////////////////////////////////////
// Select archetype and add its features to main table
function applySub(selector) {
  ///////////////////////////////////////////
  // Reset main table and descriptions
  $('.sub').each(function () {
       $(this).html('');
  });

  ///////////////////////////////////////////////
  // Include archetype description to main class
  $('#subDesc').html($('#' + selector + 'Desc').html())

  ///////////////////////////////////////////
  // Add all archetype features to main class
  $('.' + selector).each(function () {
    var lvl = $(this).data("lvl")
    var feature = $(this).clone()
    feature.removeClass("subFeatures").addClass("features")
    feature.prop('id',feature.prop('id').replace(selector, 'sub'))
    $('#f' + lvl).append(feature)
  });

  //////////////////////////////////////////////////
  // Add archetype feature names to main classTable
  $('.' + selector + 'Link').each(function () {
    var lvl = $(this).data("lvl")
    var featureNames = $(this).html()
    featureNames = featureNames.replaceAll(selector, 'sub')
    $('#fName' + lvl).append(featureNames)
  });
};

///////////////////////////////////////////////////////
// Select feats and add to main table

function applyFeat(featList) {
  ///////////////////////////////////////////
  // Reset main table and descriptions
  $('.asi').each(function () {
    $(this).html('');
  });

  $('.asiDesc').each(function () {
    $(this).html('');
  });

  ///////////////////////////////////////////
  // Add all archetype features to main class
  var featTable = $('#featTable').DataTable()

  $('.asi').each(function () {
//  for (var i=0 ; i < $('.asi').length ; i++) {
    if (featList.length == 0) {
      return false;
    } else {
      var lvl = $(this).data("lvl")
      var featRow = featTable.row('#' + featList.shift())[0];
      var featName = featTable.cell(featRow, 0).data();
      var featNameHtml = '<a href="#asi' + lvl + '" data-toggle="collapse">' + featName + '</a>'
      
      $(this).html(featNameHtml);

      var featDesc = featTable.cell(featRow, 2).data();
      featDesc = '<h3>' + featName + '</h3>' + featDesc
      $('#asi' + lvl).html(featDesc);
    }
  });

};
