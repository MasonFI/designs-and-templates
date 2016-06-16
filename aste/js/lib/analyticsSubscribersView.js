define(['jquery', 'jqueryui', 'ember', 'translate', 'moment', 'viivaUtility', 'dialogManager', 'smartAdmin'],
       function($, jui, Ember, tr, moment, util, DialogManager) {
          var view = "<article>"+
                      "<div class='jarviswidget jarviswidget-color-blueDark analytics'>"+
                        "<header><h2>"+tr("analyticsSubscribers")+"</h2>"+
                          "<div class='jarviswidget-ctrls' role='menu'>"+
                            "<a href='javascript:void(0);' class='analytics-export-to-csv button-icon'>"+
                              "<i class='fa fa-download'></i>"+
                            "</a>"+
                          "</div>"+
                        "</header>"+
                        "<div class='widget-body-toolbar'>"+
                          "<form class='analytics-settings smart-form'>"+
                            "<header>"+tr("analyticsSettings", "capitalize")+"</header>"+
                            "<fieldset class='col col-6'>"+
                              "<section class='col col-4'>"+
                                "<label class='label'>"+tr("startDate", "capitalize")+"</label>"+
                                "<div class='input-group'>"+
                                  "<input class='form-control datepicker analytics-datepicker' type='text' name='date-from' data-dateformat='d.m.y' />"+
                                  "<span class='input-group-addon'><i class='fa fa-calendar'></i></span>"+
                                "</div>"+
                              "</section>"+
                              "<section class='col col-4'>"+
                                "<label class='label'>"+tr("endDate", "capitalize")+"</label>"+
                                "<div class='input-group'>"+
                                  "<input class='form-control datepicker analytics-datepicker' type='text' name='date-to' data-dateformat='d.m.y' />"+
                                  "<span class='input-group-addon'><i class='fa fa-calendar'></i></span>"+
                                "</div>"+
                              "</section>"+
                              "<section class='col col-4'>"+
                                "<label class='label'>"+tr("timeTypeSelect", "capitalize")+"</label>"+
                                "<div>"+
                                  "<select class='form-control' type='text' name='timeTypeSelect'>"+
                                    "<option value='year'>"+tr("yearView", "capitalize")+"</option>"+
                                    "<option value='month'>"+tr("monthView", "capitalize")+"</option>"+
                                    "<option selected value='week'>"+tr("weekView", "capitalize")+"</option>"+
                                    "<option value='day'>"+tr("dayView", "capitalize")+"</option>"+
                                  "</select>"+
                                "</div>"+
                              "</section>"+
                            "</fieldset>"+
                            "<fieldset class='col col-6'>"+
                              "<section class='col col-4'>"+
                                "<label class='label'>"+tr("productGroup", "capitalize")+"</label>"+
                                "<div>"+
                                  "<select class='form-control' name='productGroupSelect'></select>"+
                                "</div>"+
                              "</section>"+
                              "<section class='col col-4'>"+
                                "<label class='label'>"+tr("packageCategory", "capitalize")+"</label>"+
                                "<div>"+
                                  "<select class='form-control' name='packageCategorySelect'>"+
                                    "<option value='all'>"+tr("all", "capitalize")+"</option>"+
                                    "<option value='initial_sales'>"+tr("initialsales", "capitalize")+"</option>"+
                                    "<option value='customerservice'>"+tr("customerservice", "capitalize")+"</option>"+
                                    "<option value='continual_sales'>"+tr("continualsales", "capitalize")+"</option>"+
                                    "<option value='subpackage'>"+tr("subpackage", "capitalizefirst")+"</option>"+
                                  "</select>"+
                                "</div>"+
                              "</section>"+
                              "<section class='col col-4'>"+
                                "<label class='label'>"+tr("show", "capitalize")+"</label>"+
                                "<div>"+
                                  "<select class='form-control' name='dataTypeSelect'>"+
                                  "<option value='both'>Tilaukset ja eurot</option>"+
                                  "<option value='orders'>Tilaukset</option>"+
                                  "<option value='sales'>Eurot</option>"+
                                  "</select>"+
                                "</div>"+
                              "</section>"+
                            "</fieldset>"+
                            "<fieldset class='col col-xs-12'>"+
                              "<label class='toggle col col-xs-4' for='compare-values'>"+
                                "<input type='checkbox' id='compare-values' name='compare-values'>"+
                                "<i data-swchon-text='"+tr('yes', 'capitalizefirst')+"' data-swchoff-text='"+tr('no','capitalizefirst')+"'></i>"+tr('diffValues')+
                              "</label>"+
                            "</fieldset>"+
                            "<fieldset id='compare-date-from' class='col col-xs-12'>"+
                              "<section class='col col-2'>"+
                                "<label class='label'>"+tr("startDate", "capitalize")+"</label>"+
                                "<div class='input-group'>"+
                                  "<input class='form-control datepicker analytics-datepicker' type='text' name='compare-date-from' data-dateformat='d.m.y' />"+
                                  "<span class='input-group-addon'><i class='fa fa-calendar'></i></span>"+
                                "</div>"+
                              "</section>"+
                            "</fieldset>"+
                          "</form>"+
                          "</div>"+
                          "<div class='widget-body'>"+
                            "<div class='sk-three-bounce hidden'>"+
                              "<div class='sk-child sk-bounce1'></div>"+
                              "<div class='sk-child sk-bounce2'></div>"+
                              "<div class='sk-child sk-bounce3'></div></div></div></div>"
                            "</div>"+
                          "</div>"+
                        "</article>";
  return function(options) {
    return Ember.View.extend({
      template: Ember.Handlebars.compile(view),
      didInsertElement: function() {
 
        var _this = this;
        var jRoot = _this.$("");

        $('#content').css('overflow', 'auto');

        this.filterOptions = jRoot.find('form');
        this.ordersTableView = jRoot.find('.analytics');
        // apply datepicker

        jRoot.find('.datepicker').datepicker({prevText:"<", nextText:">"});

        this.startDate = jRoot.find('input[name=date-from]');
        this.endDate =  jRoot.find('input[name=date-to]');
        this.compareStartDate = jRoot.find('input[name=compare-date-from]');

        this.startDate.val(moment().subtract(1, 'months').format('DD.MM.YYYY'));
        this.endDate.val(moment().add(1, 'days').format('DD.MM.YYYY'));
        this.compareStartDate.val(moment().subtract(2, 'months').format('DD.MM.YYYY'));
         
        this.getOrders = function(datatype) {
          jRoot.find('.analytics-table').remove();
          jRoot.find('.sk-three-bounce').toggleClass('hidden');

          $.ajax({
            type: "post",
            url: util.apiAnalytics + 'analytics.orders.weekly.get',
            data: JSON.stringify(_this.params),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data){
              _this.ordersTableView.find('.sk-three-bounce').toggleClass('hidden');
              ordersTableContainer = _this.ordersTableView.find('.widget-body');
  
              ordersTable = '<table class="viivaDataTable table table-striped table-bordered dataTable analytics-table">';
  
              ordersTable += '<tr>';
              $.each(data.dates, function(k, v){
                  var timeDisplay = v[0];
                  var timeDisplayForCompare = '';
                  if (_this.params.compareValues) {
                    if (data.datesForCompare[k]) {
                      timeDisplayForCompare = ' ('+data.datesForCompare[k][0]+')';
                    }
                  }
                  if(_this.params.timeType == 'week') {
                    timeDisplay = tr('week') + ' ' + v[0];
                  } else if(_this.params.timeType == 'month') {
                    timeDisplay = moment("2016-"+ parseInt(v[0])+"-01").lang('fi');
                    timeDisplay = timeDisplay.format("MMM");
                    if (_this.params.compareValues) {
                      if (data.datesForCompare[k]) {
                        timeDisplayForCompare = moment("2016-"+ parseInt(data.datesForCompare[k][0])+"-01").lang('fi');
                        timeDisplayForCompare = ' ('+ timeDisplayForCompare.format("MMM") + ')';
                      }
                    }
                  }
  
                  ordersTable += '<th colspan="2" class="analytics-week" data-week="'+v[0]+'" data-year="'+v[1]+'"> '+ timeDisplay  + timeDisplayForCompare + "</th>";
              });
              ordersTable += '<th>'+tr("total", "capitalize")+'</th>';
              ordersTable += '</tr>';
              
              if(data.productGroups && typeof data.productGroups != 'undefined') {
                $.each(data.productGroups, function(productGroup, productGroupData) {
                    if( typeof productGroupData !== 'undefined' && productGroupData.length !== 0 ) {
                      if(productGroup == 'allOrdersTotal') {
                        ordersTable += '<tr><td colspan='+((data.dates.length * 2) + 1)+'></td><th>'+tr("allOrders", "capitalizefirst")+'</th></tr>';
                      } else {
                        ordersTable += '<tr><td colspan='+((data.dates.length * 2) + 1)+'></td><th>'+productGroup+'</th></tr>';
                      }

                      $.each(productGroupData, function(productIndex, productData ) {
                        ordersTable += '<tr>';

                        $.each(data.dates, function(dKey, date) {
                          
                          // if product has values for date
                          if(date[0] in productData) {
                            if( productIndex == 'cancels') {
                              var orderCountForCompare = '';
                              if (_this.params.compareValues) {
                                if (data.datesForCompare[dKey] && data.productGroupsForCompare[productGroup] && data.productGroupsForCompare[productGroup][productIndex] && data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]]) {
                                  orderCountForCompare = ' (' + data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]].orderCount + ')';
                                } else {
                                  orderCountForCompare = ' (0)';
                                }
                              }
                              ordersTable += '<td colspan="2" class="analytics-cancels">' + productData[date[0]].orderCount + orderCountForCompare + '</td>';
                            } else if( productIndex == 'totals') {
                              var orderCountForCompare = '';
                              var salesForCompare = '';
                              if (_this.params.compareValues) {
                                if (data.datesForCompare[dKey] && data.productGroupsForCompare[productGroup] && data.productGroupsForCompare[productGroup][productIndex] && data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]]) {
                                  orderCountForCompare = ' (' + data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]].orderCount + ')';
                                  salesForCompare      = ' (' + data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]].sales + '€)';
                                } else {
                                  orderCountForCompare = ' (0)';
                                  salesForCompare = ' (0€)';
                                }
                              }
                              ordersTable += '<td class="analytics-group-totals">' + productData[date[0]].orderCount + orderCountForCompare + '</td><td class="analytics-sales">'+productData[date[0]].sales+'€'+ salesForCompare + '</td>';
                            } else {
                              var orderCountForCompare = '';
                              var salesForCompare = '';
                              if (_this.params.compareValues) {
                                if (data.datesForCompare[dKey] && data.productGroupsForCompare[productGroup] && data.productGroupsForCompare[productGroup][productIndex] && data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]]) {
                                  orderCountForCompare = ' ('+ data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]].orderCount+')';
                                  salesForCompare = ' ('+ data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]].sales+'€)';
                                } else {
                                  orderCountForCompare = ' (0)';
                                  salesForCompare = ' (0€)';
                                }
                              }
                              ordersTable += '<td class="analytics-newOrders analytics-orders">' + productData[date[0]].orderCount + orderCountForCompare + '</td><td class="analytics-sales">'+productData[date[0]].sales+'€' + salesForCompare + '</td>';
                            }

                          } else {
                            // if product has no value for date
                            var orderCountForCompare = '';
                            var salesForCompare = '';
                            
                            if (_this.params.compareValues) {
                              if (data.datesForCompare[dKey] && data.productGroupsForCompare[productGroup] && data.productGroupsForCompare[productGroup][productIndex] && data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]]) {
                                orderCountForCompare = ' (' + data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]].orderCount + ')';
                                salesForCompare = ' (' + data.productGroupsForCompare[productGroup][productIndex][data.datesForCompare[dKey][0]].sales + '€)';
                              } else {
                                orderCountForCompare = '(0)';
                                salesForCompare = '(0€)';
                              }
                            }
                            if( productIndex == 'cancels') {
                              ordersTable += '<td colspan="2" class="analytics-cancels">0' + orderCountForCompare + '</td>';
                            } else if( productIndex == 'totals') {
                              ordersTable += '<td colspan="2" class="analytics-group-totals">0' + orderCountForCompare + '</td>';
                            } else {
                              ordersTable += '<td class="analytics-newOrders analytics-orders">0' + orderCountForCompare + '</td><td class="analytics-sales">0€' + salesForCompare + '</td>';
                            }
                          }
                        });

                        //  show empty for cancels row and total row
                        if( productIndex == 'cancels') {
                          ordersTable += '<td></td><td class="analytics-productName">'+tr("cancels", "capitalize")+'</td>';
                        } else if (productIndex == 'totals') {
                          // product group total
                          var totalForCompare = '';
                          if (_this.params.compareValues) {
                            if (data.productGroupsForCompare[productGroup] && data.productGroupsForCompare[productGroup][productIndex] && data.productGroupsForCompare[productGroup][productIndex].total) {
                              totalForCompare = ' (' + data.productGroupsForCompare[productGroup][productIndex].total + ')';
                            } else {
                              totalForCompare = ' (0)';
                            }
                          }
                          ordersTable += '<td>' + productData.total + totalForCompare + '</td><td class="analytics-productName">' + productGroup + " " +tr("totals", "capitalize")+'</td>';
                        } else if (productIndex == 'orders') {
                          // grand total
                          var totalForCompare = '';
                          if (_this.params.compareValues) {
                            if (data.productGroupsForCompare[productGroup] && data.productGroupsForCompare[productGroup][productIndex]) {
                              totalForCompare = ' (' + data.productGroupsForCompare[productGroup][productIndex].total + ')';
                            } else {
                              totalForCompare = ' (0)';
                            }
                          }
                          ordersTable += '<td>' + productData.total + totalForCompare + '</td><td class="analytics-productName"></td>';
                        } else {
                          // product total
                          var totalForCompare = '';
                          if (_this.params.compareValues) {
                            if (data.productGroupsForCompare[productGroup] && data.productGroupsForCompare[productGroup][productIndex] && data.productGroupsForCompare[productGroup][productIndex].total) {
                              totalForCompare = ' (' + data.productGroupsForCompare[productGroup][productIndex].total + ')';
                            } else {
                              totalForCompare = ' (0)';
                            }
                          }
                          ordersTable += '<td>' + productData.total + totalForCompare + '</td><td class="analytics-productName">' + productIndex + '</td>';
                        }
                        ordersTable += '</tr>';
                      });
                    }
                  });
              }
              ordersTable += '</table>';
              ordersTableContainer.append(ordersTable);
              _this.updateTableDisplay();

              // lots of !important so...
              $('.analytics-table td:last-child, .analytics-table th:last-child').attr('style', 'border-right: 1px solid #ccc !important');
              jRoot.find('.analytics-week').click(function(){
                var dataWeek = $(this).attr('data-week');
                var dataYear = $(this).attr('data-year');
                if( dataWeek && dataYear != 'undefined' && typeof dataYear != 'undefined') {
                  DialogManager.create({type: "AnalyticsWeekDialog", id:"analyticsWeekDialog", dataYear: dataYear, dataWeek: dataWeek, title: tr("week") + ' ' + dataWeek});
                }
              });
            }
          });
        }

        this.params = {
          timeStart: _this.startDate.val(),
          timeEnd: _this.endDate.val(),
          productGroup: null,
          timeType: 'week',
          compareValues: false,
          compareTimeStart: _this.compareStartDate.val()
        };

        this.populateProductSelect = function(){

          $.ajax({
            type: "post",
            url: util.apiBase + "product.group.get",
            data: JSON.stringify({}),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data){

              var productOptions = [];

              productOptions.push('<option value="">Kaikki</option>');

              $.each(data['groups'], function(key, value){

                productOptions.push('<option value="' + value['id'] + '">'+ value['name'] + '</option>');

              });

              $('select[name=productGroupSelect]').html(productOptions.join(''));

            }
          });

        }

        this.saveSettings = function(){

          if( localStorage && typeof localStorage != 'undefined' ){
            localStorage.setItem("analyticsTableCellDisplay", $('select[name="dataTypeSelect"]').val());
          }
        }

        this.applySettings = function(){

         if( localStorage && typeof localStorage != 'undefined' ){

            var cellDisplay = localStorage.getItem("analyticsTableCellDisplay");

            if( cellDisplay )
              $('select[name=dataTypeSelect]').val(cellDisplay);

          }
        }

        this.updateParams = function(){

          if(_this.startDate.val() != '' && typeof _this.startDate.val() != 'undefined')  
              _this.params.timeStart = _this.startDate.val();

          if(_this.endDate.val() != '' && typeof _this.endDate.val() != 'undefined')  
             _this.params.timeEnd =  _this.endDate.val();
          
          if(_this.compareStartDate.val() != '' && typeof _this.compareStartDate.val() != 'undefined')  
            _this.params.compareTimeStart =  _this.compareStartDate.val();

           var productGroup = $('select[name="productGroupSelect"]').val();

           if(productGroup != '' && typeof productGroup != 'undefined')
            _this.params.productGroup = productGroup;

          else 
            _this.params.productGroup = null; 

          var timeType = $('select[name="timeTypeSelect"]').val();

          if(timeType != '' && typeof timeType != 'undefined')
            _this.params.timeType = timeType;

          else
            _this.params.timeType = 'week';

          var category = $('select[name="packageCategorySelect"]').val();

          if( category != 'all' )
            _this.params.category = category;

          else
            _this.params.category = null;
        }

        this.updateTableDisplay = function(){

         var orders = $('.analytics-orders');
         var sales = $('.analytics-sales');

         switch( $('select[name="dataTypeSelect"]').val() ){

          case 'both':  
          orders.css('display', 'table-cell');
          sales.css('display', 'table-cell');
          orders.attr('colspan', 1);
          sales.attr('colspan', 1);
          break;

          case 'orders': 
          orders.css('display', 'table-cell');
          orders.attr('colspan', 2);
          sales.css('display', 'none');
          break;

          case 'sales':
          orders.css('display', 'none');
          sales.css('display', 'table-cell');
          sales.attr('colspan', 2);
          break;
        }

      }

      this.update = function(){

        _this.updateParams();
        _this.getOrders();

      }

      this.init = function(){
        jRoot.find('#compare-date-from').hide();
        _this.populateProductSelect();
        _this.getOrders();

      }

      this.filterOptions.find('input, select').on('change', function(){
        // if toggling diffing values
        if ($(this).attr('id') == 'compare-values') {
          jRoot.find('#compare-date-from').slideToggle('fast');
          _this.params.compareValues = !_this.params.compareValues;
        }
        _this.saveSettings();
        _this.update();      
      });
      
      jRoot.find('.analytics-export-to-csv').on('click', function() {
        var csvData = util.convertTableToCsvData.apply(this, [$('.analytics-table')]);
        util.exportToCsv(csvData, 'tilaukset.csv');
      });

      _this.applySettings();
      _this.init();

    }  
    });
  };
});
