define(['jquery', 'jqueryui', 'ember', 'translate', 'moment', 'viivaUtility', 'dialogManager', 'viivaTableView', 'ViivaD3', 'viivaFormElements', 'smartAdmin', 'd3', 'd3legend'],
  function($, jui, Ember, tr, moment, util, DialogManager, ViivaTableView, ViivaD3, ViivaFormElements) {

    var view = "<div class='row table-view'>" +
                 "<article class='col-xs-12'>" +
                   "<div class='jarviswidget jarviswidget-color-blueDark'>" +
                     "<header><h2>"+tr("analytics", "capitalize")+"</h2>" +
                       "<div class='jarviswidget-ctrls' role='menu'>"+
                         "<a href='javascript:void(0);' class='analytics-export-to-csv button-icon'>"+
                           "<i class='fa fa-download'></i>"+
                         "</a>"+
                       "</div>"+
                     "</header>"+
                     "<div role='content'>" +
                       "<div class='widget-body no-padding table-body'></div>" +
                     "</div>" +
                   "</div>" +
                 "</article>" +
               "</div>";

    return function(options) {
      return Ember.View.extend({
        template: Ember.Handlebars.compile(view),
        didInsertElement: function() {
          
 
          var _this = this;
          var jRoot = _this.$("");

          $('#content').css('overflow', 'auto');
          this.filterOptions = $('<div class="dropdown-menu pull-right table-settings-body analytics-settings" />').append([
            $('<div />').addClass('col-sm-12')
            .append($('<label class="col-xs-12" />').html(tr("timeScale", "capitalize"))),
            $('<div/>').addClass('col-sm-6')
            .append($('<div/>').addClass('input-group form-control')
              .append([$('<input/>')
                .attr('class', 'form-control datepicker analytics-datepicker')
                .attr({type: 'text', name: 'date-from', placeholder: tr("startDate", "capitalize")})
                .attr('data-dateformat', 'd.m.y'),
                $('<span class="input-group-addon"><i class="fa fa-calendar"></i></span>')
              ])
            ),

            $('<div />').addClass('col-sm-6')
            .append($('<div/>').addClass('input-group form-control')
              .append([$('<input/>')
                .attr('class', 'form-control datepicker analytics-datepicker')
                .attr({type: 'text', name: 'date-to', placeholder: tr("endDate", "capitalize")})
                .attr('data-dateformat', 'd.m.y'),
                $('<span class="input-group-addon"><i class="fa fa-calendar"></i></span>')
              ])
            ),
            $('<div />').addClass('col-sm-12 product-filter-group'),
            $('<div />').addClass('col-sm-12')
          ]);

          this.packageGraphContainer= $('<div/>').addClass('row').append([
            $('<div id="packageGraphContainer" />').addClass('col-xs-9'),
            $('<div id="settingsContainer" />').addClass('col-xs-3')
          ]);

          this.packageGraphContainer.find('#settingsContainer').append(this.filterOptions);
          jRoot.find('.widget-body').append(this.packageGraphContainer);

          jRoot.find('.datepicker').datepicker({prevText:"<", nextText:">"});

          this.startDate = jRoot.find('input[name=date-from]');
          this.endDate =  jRoot.find('input[name=date-to]');

          this.startDate.val(moment().subtract(1, 'months').format('DD.MM.YYYY'));
          this.endDate.val(moment().subtract(1, 'days').format('DD.MM.YYYY'));

          $('.totalResultsRow label').css('padding', '15px');
          $('.totalResultsRow').css('font-size', '20px');

          this.dateFormatHelper = function(d) {
            d = d.split('.');
            d.reverse();
            d = d.join('-');
            return d;
          }

          this.getTimeScale = function(timeframe, from, to) {
            switch (timeframe) {
              case "month": return 30;
              case "week": return 7;
              case "custom":
                t1 = new Date(moment(from, "DD.MM.YYYY")).getTime()/1000;
                t2 = new Date(moment(to, "DD.MM.YYYY")).getTime()/1000;
                diff = Math.floor((t2-t1)/86400);
                return diff;
              default: return 0;
            }
          }

          this.getRandomColor = function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }

          this.drawCharts = function() {
            var timescale = _this.getTimeScale('custom', _this.startDate.val(), _this.endDate.val());
   
            // format for array handling
            var startDate = _this.dateFormatHelper(_this.startDate.val());
            var endDate = _this.dateFormatHelper(_this.endDate.val());
  
            // backend queries BETWEEN inputs, add one day so we get full week
            endDate = moment(endDate).add(1, 'days').format('YYYY-MM-DD');
            $.ajax({
              type: "post",
              url: util.apiAnalytics + 'analytics.sales.get',
              data: JSON.stringify(_this.params),
              contentType: 'application/json',
              dataType: 'json',
              success: function(data) {
                /**
                 * Data.packages format:
                 * -PackageGroupName
                 * --PackageName
                 * ---"YYY-MM-DD":count
                 */
                // save data for export functionality
                _this.salesData = data.packages;
                // format data for d3
                var graphData = [];
                var end = moment(endDate);

                // loop whole timeline and add data to every date for every package
                $.each(data.packages, function(productGroupName, packages) {
                  // loop dates and push values
                  // create data array for whole package timeline
                  // fill empty days with zeroes so that the graph looks good
                  $.each(packages, function(packageName,packageData) {
                    var p = new Object();
                    p.Package = packageName;
     
                    if(p.Package == 'allOrders') {
                      p.Package = tr("allOrders", "capitalizefirst");
                    }
                    
                    p.Data = [];
                    var dataArrayForPackage = [];
                    var begin = moment(startDate);
                    while (begin.isBefore(end) || begin.isSame(end)) {
                      var dateValue = 0;
                      $.each(packageData, function(packageDate, packageSaleCount) {
                        if (begin.isSame(moment(packageDate))) {
                          // if date has value
                          dateValue = packageSaleCount;
                          return false;
                        }
                      });
                      
                      vals = new Object();
                      vals.Date = begin.format('YYYY-MM-DD');
                      vals.Value = parseInt(dateValue);
                      p.Data.push(vals);
                      
                      begin.add(1, 'd');
                    }
                    graphData.push(p);
                  });
                });
                jRoot.find('#packageGraphContainer').html('');  
                var options = {
                  container: '#packageGraphContainer',
                  ticks: 5
                };
                ViivaD3Chart(options, graphData);
              }
            });                  
          }

          this.params = {
            timeStart: _this.startDate.val(),
            timeEnd: _this.endDate.val(),
            timeType: 'day',
            productGroup: null,
            singlePackage: null
          };
          
          this.salesData = [];
          this.updateParams = function() {
            if(_this.startDate.val() != '' && typeof _this.startDate.val() != 'undefined') {  
              _this.params.timeStart = _this.startDate.val();
            }
   
            if(_this.endDate.val() != '' && typeof _this.endDate.val() != 'undefined') {  
              _this.params.timeEnd =  _this.endDate.val();
            }
   
            var productGroups = $(".analytics-settings .product-filter-group input:checkbox:checked");
   
            if(productGroups.length) {
              var groups = [];
              productGroups.each(function() {
                groups.push($(this).val());
              });
              _this.params.productGroup = groups;
            } else {
              _this.params.productGroup = null;
            }
  
            var singlePackage = $('select[name=packageSelect').val();
         
            if(singlePackage != '' & typeof singlePackage != 'undefined') {
              _this.params.singlePackage = singlePackage;
            } else { 
              _this.params.singlePackage = null;
            }
          }
  
          this.populateProductSelect = function() {
            $.ajax({
              type: "post",
              url: util.apiBase + "product.group.get",
              data: JSON.stringify({}),
              contentType: 'application/json',
              dataType: 'json',
              success: function(data) {
                var productOptions = [];
                $.each(data['groups'], function(key, value) {
                  productOptions.push({name: value.name, value: value.id});
                });
    
                $('.product-filter-group').append(ViivaFormElements.switchGroup({
                  label: tr("productGroup"),
                  on: "+", 
                  off: "-", 
                  items: productOptions
                }));
  
                $('.product-filter-group').find("input:checkbox").change(function() {
                  _this.updateParams();
                  _this.drawCharts();
                });
              }
            });
          }
  
          this.filterOptions.find('input').on('change', function() {
            _this.updateParams();
            _this.drawCharts();
          });
  
          this.filterOptions.find('select[name=productGroupSelect]').on('change', function() {
            $('select[name=packageSelect]').html('');
            _this.updateParams();
            _this.drawCharts();
          });
  
          this.filterOptions.find('select[name=packageSelect]').on('change', function() {
            _this.updateParams();
          });
          
          jRoot.find('.analytics-export-to-csv').on('click', function() {
            // transform graphData to correct format
            var csvData = '';
            // first row, "headers" from keys (dates)
            var startDate = _this.dateFormatHelper(_this.startDate.val());
            var endDate = _this.dateFormatHelper(_this.endDate.val());
            var end = moment(endDate);
            var begin = moment(startDate);
            
            var row = '';
            // variable for rows that have no values for dates (ie. productGroupName and -total rows)
            // so we just need to loop days once for those
            var noValsRow ='';
            // total for every date, indexed by order of dates
            var datesTotal = [];
            var i=0;
            while (begin.isBefore(end) || begin.isSame(end)) {
              row += begin.format('YYYY-MM-DD') + ',';
              noValsRow += ',';
              datesTotal[i] = 0;
              i++;
              begin.add(1, 'd');
            }
            // total
            row += tr("total", "capitalizefirst");
            csvData += row + '\n';
            
            // product rows
            // loop whole timeline and add data to every date for every package
            var packageRowAdded = false;
            var row = '';
            var productGroupTotal = 0;
            var packageTotal = 0;
            var grandTotal = 0;
            var result = '';
            $.each(_this.salesData, function(productGroupName, packages) {
              row = '';
              productGroupTotal = 0;
              if (!packageRowAdded) {
                // add row with a packageGroupName at the end + one for total cols
                row = noValsRow + productGroupName;
                result = row.replace(/"/g, '""');
                csvData += result + '\n';
              }
              // one row for every package
              $.each(packages, function(packageName,packageData) {
                var begin = moment(startDate);
                row = '';
                packageTotal = 0;
                if(packageName == 'allOrders') {
                  packageName = tr("allOrders", "capitalizefirst");
                }
                i=0;
                while (begin.isBefore(end) || begin.isSame(end)) {
                  var dateValue = 0;
                  $.each(packageData, function(packageDate, packageSaleCount) {
                    if (begin.isSame(moment(packageDate))) {
                      // if date has value
                      dateValue = packageSaleCount;
                      return false;
                    }
                  });
                  row += dateValue.toString() + ',';
                  productGroupTotal += parseInt(dateValue);
                  packageTotal += parseInt(dateValue);
                  datesTotal[i] += parseInt(dateValue);
                  grandTotal += parseInt(dateValue);
                  i++;
                  begin.add(1, 'd');
                }
                // add package total and name to end of row
                row += packageTotal + ',';
                row += packageName;
                
                result = row.replace(/"/g, '""');
                csvData += result + '\n';
              });
              row = noValsRow + productGroupTotal;
              // row for productGroupTotal
              result = row.replace(/"/g, '""');
              csvData += result + '\n';
            });
            // total for dates row
            row = '';
            
            $.each(datesTotal, function(index, dateTotal) {
              row += dateTotal.toString() + ',';
            });
            row += grandTotal;
            result = row.replace(/"/g, '""');
            csvData += result + '\n';
            util.exportToCsv.apply(this, [csvData, 'uusmyynti.csv']);
          });
  
          _this.populateProductSelect();
          _this.drawCharts();
        }  
      });
    };
  }
);
