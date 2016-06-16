define(['jquery', 'jqueryui', 'ember', 'translate', 'viivaUtility','viivaDialog', 'jqPlot', 'jqPlotBar', 'jqCategoryAxis'],
       function($, jui, Ember, tr, util) {
  var dialog = "<section class='cancellations'></section>";

  var AnalyticsWeekDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = this.$("");

      var params = {dataWeek: _this.options.dataWeek, dataYear: _this.options.dataYear};

     /* $.ajax({
          type: "post",
          url: util.apiAnalytics + 'analytics.sales.get',
          data: JSON.stringify(params),
          contentType: 'application/json',
          dataType: 'json',
          success: function(data){

                           var packageNames = [];
                           var packageSales = [];
                           var packageOrders = [];

                           $.each(data.packages, function(k, v){

                              packageNames.push(v[0]);
                              packageSales.push(v[2]);
                              packageOrders.push(v[1]);

                           });

                           var packageSalesGraphOptions = {
                                title: tr("packageGraphSales")+ ' €',
                                seriesDefaults:{
                                    renderer: $.jqplot.BarRenderer,
                                    pointLabels: { show: true },
                                    rendererOptions: {
                                      barDirection: 'horizontal',
                                      barWidth: '15'
                                    }
                                },
                                axes: {
                                    xaxis: {
                                      tickOptions: {formatString: '%d'}
                                    },
                                    yaxis: {
                                        renderer: $.jqplot.CategoryAxisRenderer,
                                        ticks: packageNames
                                    }
                                }
                            };

                            var packageOrdersGraphOptions = {
                                title: tr("packageGraphOrders"),
                                seriesDefaults:{
                                    renderer: $.jqplot.BarRenderer,
                                    pointLabels: { show: true, formatString: '%d' },
                                    rendererOptions: {
                                      barDirection: 'horizontal',
                                      barWidth: '15'
                                    }
                                },
                                axes: {
                                    xaxis: {numberTicks: 4
                                    },
                                    yaxis: {
                                        renderer: $.jqplot.CategoryAxisRenderer,
                                        ticks: packageNames
                                    }
                                }
                            };

                           var graphContainer = jRoot.find('.orders');

                           graphContainer.find('#packageSales').html('');
                           graphContainer.find('#packageOrders').html('');

                           //_this.packagesView.find('.widget-body').html(JSON.stringify(data.packages));
                           var packageSalesChart = $.jqplot('packageSales', [packageSales], packageSalesGraphOptions);
                           var packageOrdersChart = $.jqplot('packageOrders', [packageOrders], packageOrdersGraphOptions)

                           $('.jqplot-xaxis').css('bottom', '-6px');
          }
      });*/

      $.ajax({
          type: "post",
          url: util.apiAnalytics + 'analytics.cancels.get',
          data: JSON.stringify(params),
          contentType: 'application/json',
          dataType: 'json',
          success: function(data){
                           console.log(data);

                           var cancelsContainer = jRoot.find('.cancellations');

                           var cancelsTable = '<table class="viivaDataTable table table-striped table-bordered table-hover dataTable">';

                           cancelsTable += '<tr>';
                           cancelsTable += '<th>'+tr("analyticsPackage")+'</th>';
                           cancelsTable += '<th>'+tr("cancellations")+'</th>';
                           cancelsTable += '</th>';

                           $.each(data.cancels, function(k, v){                                                   
                              cancelsTable += '<tr>';
                              cancelsTable += '<td>'+v.packageName+'</td>';
                              cancelsTable += '<td>'+v.orderCount+'</td>';
                              cancelsTable += '</tr>';
                           });

                           cancelsTable += '</table>';
                           cancelsContainer.append(cancelsTable);
          }
        });

      jRoot.dialog({minWidth: 700, modal: true, draggable: false, resizable: false,
                    title: typeof _this.options.title === "string" ?
                    _this.options.title : null, buttons: null, tabs: [{title: tr("cancellations")}]});
      jRoot.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        jRoot.dialog("destroy");
        _this.destroy();
      });
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options) {
     return AnalyticsWeekDialog.create({options: options}).appendTo($("body"));
    }
  
  }
});
