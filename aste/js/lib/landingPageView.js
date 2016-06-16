define(['jquery', 'jqueryui', 'ember', 'translate', 'landingPageWidget', 'smartAdmin'],
       function($, jui, Ember, tr, landingPageWidget) {
	
      var html = '<section id="widget-grid-asd"></section>';
      
      

  return function(options) {
    return Ember.View.extend({
      template: Ember.Handlebars.compile(html),
      didInsertElement: function() {
        var _this = this;
        var jRoot = _this.$("");
	
	$('#content').css({"overflow-y" : "scroll", "overflow-x" :  "hidden"});
	
	// Wrap it
	var div = $('<div/>').hide();

	widget = new landingPageWidget();
	widget.create(div);
	//widget.loadAll();
	widget.loadSpots();
	widget.bindEvents();
	
	$('#widget-grid-asd').append(div);
	
	div.show();
	
	if($('.colorpicker.dropdown-menu').length){
	    $('.colorpicker.dropdown-menu').remove();
	}
	
	/*------------- New code goes here ---------------*/

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
      }
    });
  };
});
