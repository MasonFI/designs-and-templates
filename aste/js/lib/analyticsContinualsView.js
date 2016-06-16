define(['jquery', 'jqueryui', 'ember', 'translate', 'moment', 'viivaUtility', 'dialogManager', 'viivaTableView', 'viivaGraph', 'viivaGraphSettings', 'smartAdmin',
 'flot', 'flotResize', 'flotFillbetween', 'flotOrderBar', 'flotPie', 'flotTooltip', 'jqPlot', 'jqPlotBar', 'jqCategoryAxis', 'jqPointLabels'],
       function($, jui, Ember, tr, moment, util, DialogManager, ViivaTableView, viivaGraph, viivaGraphSettings) {

  return function(options) {
    return Ember.View.extend({
      didInsertElement: function() {
 
        var _this = this;
        var jRoot = _this.$("");

        $('#content').css('overflow', 'auto');

        this.cSubscribersView = $("<article/>").addClass('col-xs-6 analytics-csubs').append([

        $("<div class='jarviswidget' />").addClass('jarviswidget-color-blueDark').append("<header><h2>"+tr("continualSubscribers")+"</h2></header>")
            .append("<div role='content'><div id='cSubscribersGraphContainer' class='widget-body no-padding table-body jqplot-target'> <div class='sk-three-bounce'>"+
          "<div class='sk-child sk-bounce1'></div>"+
          "<div class='sk-child sk-bounce2'></div>"+
          "<div class='sk-child sk-bounce3'></div></div></div></div>")
          ]);

         jRoot.append(this.cSubscribersView);     

          this.getContinualSubscribers = function(){

                  var params = {};

                  $.ajax({
                              type: "post",
                              url: util.apiAnalytics + 'analytics.continuals.get',
                              data: JSON.stringify(params),
                              contentType: 'application/json',
                              dataType: 'json',
                              success: function(data){

                                $('.sk-three-bounce').addClass('hidden');

                                var products = [];
                                var customers = [];

                                $.each(data.cSubscribers, function(k, v){

                                  products.push(v[0]);
                                  customers.push(v[1]);

                                });

                                cSubsContainer = _this.cSubscribersView.find('.widget-body');
                                cSubsContainer.height(400);
                                cSubsContainer.html('');

                                cSubscribersGraph = $.jqplot('cSubscribersGraphContainer', [customers], {
                                seriesDefaults:{
                                    renderer:$.jqplot.BarRenderer,
                                    pointLabels: { show: true }
                                },
                                axesDefaults: {
                                	numberTicks: 10,
                                	max: 17000
                                },
                                axes: {
                                    xaxis: {
                                        renderer: $.jqplot.CategoryAxisRenderer,
                                        ticks: products
                                    },
                                },
                                highlighter: { show: false}
                            });
                        }
                    });

          }

        _this.getContinualSubscribers();
       }  
    });
  };
});
