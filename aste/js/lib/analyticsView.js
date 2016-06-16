define(['jquery', 'jqueryui', 'ember', 'translate', 'analyticsWidget', 'smartAdmin', 'flot', 'flotResize', 'flotFillbetween', 'flotOrderBar', 'flotPie',
'flotTooltip'],
       function($, jui, Ember, tr, analyticsWidget) {
	
      $html = $('<section id="widget-grid"></section>');
      $controls = $('<div style="padding-bottom: 50px;"><div class="col-xs-3 col-sm-7 col-md-7 col-lg-7">' +
      '<button id="new-analytics-widget" class="btn btn-success">' +
	'<i class="fa fa-plus"></i><span class="hidden-mobile"> Uusi näkymä</span>' +
      '</button>' +
      '<button id="save-widgets" class="btn btn-primary" style="margin-left: 20px;">' +
	'<i class="fa fa-save"></i><span class="hidden-mobile"> Tallenna näkymät</span>' +
      '</button>' +
      '</div></div>');
      
      $html.append($controls);
      var html = $('<div/>').append($html).html();
      

  return function(options) {
    return Ember.View.extend({
      template: Ember.Handlebars.compile(html),
      didInsertElement: function() {
        var _this = this;
        var jRoot = _this.$("");
	
	var widget_bank = new Array();
	var settings_bank = new Array();
	
	$('#content').css({"overflow-y" : "scroll", "overflow-x" :  "hidden"});
	
	$('#new-analytics-widget').on('click', function(event){
	  new_widget();
	})
	
	$('#save-widgets').on('click', function(event){
	  settings_bank = [];
	  for (var i=0; i<widget_bank.length; i++) {
	    var widget = widget_bank[i];
	    if (typeof widget != "undefined" && widget.destroyed == false) {
	      widget.saveSettings();
	      settings_bank.push(widget.settings);
	    }
	    else {
	      widget_bank.splice(i, i+1);
	    }
	  }
	  localStorage.setItem("analyticsView", JSON.stringify(settings_bank));
	});
	
	function new_widget(){
	  var div = $('<div/>').hide();
	  var analyticsView = new analyticsWidget();
	  
	  analyticsView.create(div);
	  analyticsView.loadAll();
	  analyticsView.bindEvents();
	  analyticsView.initializeSettings();
	  
	  $('#widget-grid').append(div);
	  
	  setTimeout(function() {
	    pageSetUp(div);
	    div.show();
	    }, 0);
	  
	  widget_bank.push(analyticsView);
	  return analyticsView;
	}
	

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
	
	/* Load view from local storage if available */
	if (typeof localStorage.analyticsView != "undefined") {
	  var views = JSON.parse(localStorage.analyticsView);
	  for (var i=0; i<views.length; i++) {
	    console.log(views[i]);
	    var wid = new_widget();
	    wid.settings = views[i];
	    wid.asyncLoadSettings();
	  }
	}
	/* If no previous views are available just create one widget entry */
	else
	{
	  var n = new_widget();
	  n.loadSettings();
	}
      }
    });
  };
});
