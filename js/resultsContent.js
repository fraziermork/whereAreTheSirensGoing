// draw objects onto map
//
// format objects into articles w/ handlebars
//
// VIEW - will compile handlebars,

(function(module){
  resultsContent = {};
  var template = Handlebars.compile($('#incident-template').text());

  resultsContent.render = function(incident) {
    return template(incident);
  };

  //this needs to do anything to draw the results page that happens before the police AJAX call comes back
  //notably, this needs to draw the google map centered at the user's position
  resultsContent.index = function() {
    console.log('resultsContent.index called');
    userPositionMarkerOptions = {
      animation: google.maps.Animation.DROP,
      icon: {
        url: '/img/man.svg',
        scaledSize: new google.maps.Size(32,32),
        strokeColor: 'blue',
        fillColor: 'blue',
        fillOpacity: 1
      }
    };
    maps.buildMap([+resultsController.searchParams.lat, +resultsController.searchParams.lng]);
    maps.addMarker([+resultsController.searchParams.lat, +resultsController.searchParams.lng], false, userPositionMarkerOptions);

  };

  resultsContent.renderArticlesAndMapMarkers = function(incidents){
    console.log('resultsContent.renderArticlesAndMapMarkers called');
    var today = new Date().getDate();
    var filteredIncidents = Incident.all.filter(function(current){
      if (current.event_clearance_date){
        return today === new Date(current.event_clearance_date.replace('T', ' ')).getDate();
      } else {
        return false;
      }
    });


    filteredIncidents.forEach(function(thisIncident) {
      maps.addMarker([+thisIncident.latitude, +thisIncident.longitude], true);
      $('#results-handlebars-here').append(resultsContent.render(thisIncident));
    });

    $('#results-handlebars-here li:nth-of-type(n+6)').hide();


    // $('<div/>', {
    //   'id':'myDiv',
    //   'class':'myClass',
    //   'style':'cursor:pointer;font-weight:bold;',
    //   'html':'<span id="readon">Display all Incidents >>></span>',
    //   'click':function(){ resultsContent.readOn(); },
    //   'mouseenter':function(){ $(this).css('color', 'red'); },
    //   'mouseleave':function(){ $(this).css('color', 'black'); }
    // }).appendTo('.handlebars-goes-here');
  };

  $('#resultsReadOn').on('click', function(e){
    event.preventDefault();
    resultsContent.readOn();
  });


  resultsContent.readOn = function() {
    $('#results-handlebars-here li:nth-of-type(n+6)').show();
    $('#resultsReadOn').hide();

  };


  module.resultsContent = resultsContent;
})(window);
