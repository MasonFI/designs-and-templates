
define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate','moment', 'customerServiceAccessHistory','viivaUtility','viivaDataTable', 'viivaNotification', 'dialogManager', 'smartAdmin', 'underscore'],
       function($, jui, Ember, DP, tr, moment, AccessHistory, util, ViivaDataTable, Notification, DialogManager, underscore) {

    if ( !window.widgetAutoUpdater ) window.widgetAutoUpdater = {};

      widgetAutoUpdater.fetchStomp = function() {

      var params = {
        id: 0
      }    
      
      var stomp = DP.execute({type: "apiStomp", method: "getStomp", params: params });

      if (stomp != null) {
        stomp.then(function(response) {
        if (typeof response.user !== "undefined" && response.user.customerNumber !== null) {
          App.Router.router.transitionTo('customerService', response.user.customerNumber);
          }
        });
      }
     }

      if (window.location.hostname === "mydigi.otavamedia.fi" || window.location.hostname === "okmydimxl01.ok.root" ) {
        var stompInterval = setInterval(widgetAutoUpdater.fetchStomp, 15000);
      }

        
      widgetAutoUpdater.searchForCustomers = function () {

          $('.sk-three-bounce').removeClass('hidden');

          var customer = {

              customerId: $("#searchCustomerId").val(),
              email: $("#searchEmail").val(),
              mobile: $("#searchMobile").val(),
              orderId:$("#searchOrderId").val(),
              specifier: $('#searchSpecifier').val(),
              specifierType: $('#searchSpecifierType').val(),
              name: $("#searchName").val(),
              address: $("#searchAddress").val(),
              zip: $("#searchZip").val(),
              po: $("#searchPo").val(),
              country: $('#customerSearch [name=country]').val()

            };

            // set mobile phone as specifier if it is found in its field
            if (typeof customer.mobile != "undefined" && customer.mobile.trim() != "") {
              customer.specifier = customer.mobile;
              customer.specifierType = "MA";

            }

            sessionStorage.setItem('jamSearchParams', JSON.stringify(customer));

          DP.execute({type: "apiCustomer", method: "findCustomers", params: customer }).then(function(response) {

                // remove loading image
                $('.no-results').text('');
                $('.sk-three-bounce').addClass('hidden');
              
                 // found only one customer with customernumber, init page    
                if (response.customers.length === 1 && response.customers[0].customerNumber != null) {
         
                  $('.no-results').text('');

                        App.Router.router.transitionTo('customerService', response.customers[0].customerNumber);
                  }

                else if (response.message == "Failed") {
            
                  $('#queryResults').show();
                  $('#searchHistory').show();
                  $("#resultsTable tr").remove();

                    Notification.warn({
                    title: tr(response.customers.msg),
                         message: tr(response.customers.msg),
                       
                       });
                    
                }

                // several customers found
                else {

                  // hillotaan ja tarjotaan
                  sessionStorage.setItem('jamResponse', JSON.stringify(response));     
                  responseRenderer.render(response);           
                }

             });

        }

    

    if( !window.responseRenderer ) window.responseRenderer = {};

      responseRenderer.render = function(response){

                  $('.no-results').text('');
                  $('#queryResults').show();
                  $('#searchHistory').show();
                  $("#resultsTable tr").remove();
                  $("#resultsTable").append("<tr>"+
                    "<th>"+tr("widgetCustomerNumber")+"</th>"+
                    "<th>"+tr("widgetCustomerName")+"</th>"+
                    "<th>"+tr("widgetCustomerAddress")+"</th>"+
                    "<th>"+tr("widgetCustomerPOandCity")+"</th>"+
                    "<th>"+tr("widgetEmail")+"</th>"+
                    "<th>"+tr("widgetSpecifier")+"</th>"+
                    "<th>"+tr("widgetCustomerLeka")+"</th>"+
                    "<th>"+tr("widgetCustomerMD")+"</th>"+
                    "</tr>");

                  for ( var i = 0; i < response.customers.length; i++) {

                   response.customers[i] = characterReplacer.replaceCharacters(response.customers[i]);

                   var resultsTable =  $("#resultsTable tbody");

                   var inLeka = (response.customers[i].inLeka === true || typeof response.customers[i].inLeka == 'undefined') ? "<span class='widgetDataSourceOK glyphicon glyphicon-ok'></span>" : "";
                   var inMD = (response.customers[i].inMD) ? "<span class='widgetDataSourceOK glyphicon glyphicon-ok'></span>" : "";

                   resultsTable.append("<tr>"+
                    "<td mydigi-account-id='"+response.customers[i].account+"' mydigi-contact-id='"+response.customers[i].contact+"' in-leka='"+response.customers[i].inLeka+"'>" + response.customers[i].customerNumber + "</td>"+
                    "<td>" + response.customers[i].name + "</td>"+
                    "<td>" + response.customers[i].address + "</td>"+
                    "<td>" + response.customers[i].postNumber +" "+response.customers[i].postOffice+ "</td>"+
                    "<td>" + response.customers[i].email +"</td>"+
                    "<td>" + response.customers[i].addressSpecifier +"</td>"+
                    "<td class='leka'>" + inLeka + "</td>"+
                    "<td>" + inMD + "</td>"+
                    "</tr>");
                    }
                    
                     // bind click listener 
                      $("#resultsTable tbody tr").click(function() {
        
                        var customerNumber = $(this).closest('tr').find('td:first').text();
                        var mydigiAccountId = $(this).closest('tr').find('td:first').attr('mydigi-account-id');
                        var accountInLeka = $(this).closest('tr').find('td:first').attr('in-leka');

      
                        // getting attribute from html-tag not actually a boolean
                        if(accountInLeka === "true" || accountInLeka === "undefined") {
                            // init konepelti
                            App.Router.router.transitionTo('customerService', customerNumber);                       
                        }
                        else if (mydigiAccountId !== null ) {
                          // show Mydigi customer dialog
                          var dialogOption = {type: "CustomerDialog", id: mydigiAccountId};
                          DialogManager.create(dialogOption);

                        }
                    });
      }
        
var view = $("<div><div class='row'><article class='col-xs-7'><div class='jarviswidget jarviswidget-color-blueDark'>"+
  "<header><h2>"+tr("widgetSearchCustomers")+"</h2>"+
    "<div class='widget-toolbar'> "+
    "<btn class='btn btn-xs secretOrder'><i class='fa fa-wrench'></i></button>"+
    "</div></header>"+
    "<div role='content'><div class='widget-body'><form class='form-horizontal' role='form' id='customerSearch'>"+
                       "<fieldset>"+
                              "<div class='form-group'>"+

                              "<label class='col-md-4 control-label text-left'>"+tr("widgetCustomerNumber")+"</label>"+
                                 "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='searchCustomerId' value=''  />"+
                                  "</div>"+
                              "</div>"+ 
                             
                              "<fieldset id='border-group'><div class='form-group'>"+
                                  "<label class='col-md-4 control-label text-left'><strong>"+tr("widgetCustomerName")+"</strong></label>"+
                                  "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='searchName' value=''  />"+
                                  "</div>"+
                              "</div>"+
                              "<div class='form-group'>"+
                                  "<label class='col-md-4 control-label text-left'><strong>"+tr("widgetCustomerAddress")+"</strong></label>"+
                                  "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='searchAddress' value=''  />"+
                                  "</div>"+
                              "</div>"+
                              "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'><strong>"+tr("widgetCustomerPOandCity")+"</strong></label>"+
                                 "<div class='col-md-2'>"+
                                    "<input class='form-control' type='text' id='searchZip' value=''  />"+
                                  "</div>"+
                                  "<div class='col-md-6'>"+
                                    "<input class='form-control' type='text'  id='searchPo' value=''  />"+
                                  "</div>"+
                              "</div>"+
                              "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'><strong>"+tr("widgetCountry")+"</strong></label>"+
                                 "<div class='col-md-4'>"+
                                  util.countryCodeSelectHTML+
                                  "</div>"+
                              "</div></fieldset>"+
                               "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetEmail")+"</label>"+
                                 "<div class='col-md-8' >"+
                                  "<input class='form-control' type='text' id='searchEmail' value=''  />"+
                                  "</div>"+
                              "</div>"+
                               "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetMobile")+"</label>"+
                                 "<div class='col-md-8' >"+
                                  "<input class='form-control' type='text' id='searchMobile' value=''  />"+
                                  "</div>"+
                              "</div>"+
                               "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetOrderNo")+"</label>"+
                                 "<div class='col-md-8'>"+
                                  "<input class='form-control' type='text' id='searchOrderId' value=''  />"+
                                  "</div>"+
                              "</div>"+
                               "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetSpecifier")+"</label>"+
                                 "<div class='col-md-2'>"+
                                  "<input class='form-control' type='text' id='searchSpecifier' value=''  />"+
                                     "</div>"+
                                  "<div class='col-md-4'>"+
                                  "<select id='searchSpecifierType' name='specifierType' class='form-control'><option value=''></option><option value='MA'>"+tr("widgetMobile")+"</option><option value='VI'>"+tr("widgetReferenceNo")+"</option><option value='TY'>"+tr("widgetPusher")+"</option></select>"+                             
                                  "</div>"+
                            
                              "</fieldset>"+

                            "</form>"+
                             "<button type='button' class='btn btn-primary' id='searchbtn'>"+tr("widgetSearch")+"</button>"+
                             "</div></div></article>"+

                             "<article class='col-xs-5' style='float: right;'>"+
                               "<div class='jarviswidget jarviswidget-color-blueDark'>"+
                                "<header><h2>"+tr("widgetSearchHistory")+"</h2></header>"+
                                  "<div role='content'><div class='widget-body no-padding table-body historyTableBody'>"+
                                  "<table id='historyTable' class='table table-striped table-hover table-bordered'></table>"+
                             "</div></div></div></article></div>"+
                           
              "<div class='dynamiclink'></div>"+
                          "<div class='sk-three-bounce hidden' style='margin-left: 400px;'>"+
                          "<div class='sk-child sk-bounce1'></div>"+
                          "<div class='sk-child sk-bounce2'></div>"+
                          "<div class='sk-child sk-bounce3'></div></div>"+
                          "<div class='row'>"+
                          "<article class='col-xs-12' id='queryResults'><div class='jarviswidget jarviswidget-color-blueDark'>"+
                          "<header><h2>"+tr("widgetSearchResults")+"</h2></header>"+
                          "<div role='content'><div class='widget-body no-padding table-body'>"+
                          "<span class='no-results'></span>"+
                          "<table class='table table-striped table-hover table-bordered' id='resultsTable' style='cursor:pointer'></table>"+
                           "</div></div></div></article>"+
                        "</div>");

  return function(options) {
    return Ember.View.extend({
      template: Ember.Handlebars.compile(view[0].outerHTML),
      // Effectively document ready
      didInsertElement: function() {

        if (window.location.hostname === "accounts-dev.viivamedia.fi") {
            $('body #header').css('background', 'rgb(129, 122, 119)');
        }
        
        $('#content').css('overflow', 'auto');

        // prepend most used countries to select
        $('[name="country"]').prepend('<option value="" selected="selected"></option><option value="FI">'+tr("widgetFI")+'</option><option value="SE">'+tr("widgetSE")+'</option><option value="DE">'+tr("widgetDE")+'</option><option value="FR">'+tr("widgetFR")+'</option><option value="ES">'+tr("widgetES")+'</option><option value="--">-----</option>');


        // disable other fields
        $('#searchCustomerId').on('keyup', function(event) {
          $('#customerSearch input, [name=country], [name=specifierType]').not('#searchCustomerId').attr('disabled',true);
          if ($('#searchCustomerId').val().length == 0) {
              $('#customerSearch input, [name=country], [name=specifierType]').not('#searchCustomerId').attr('disabled',false);
            }
            else if ($('#searchCustomerId').val().length == 1) {
              $('#customerSearch input, [name=country], [name=specifierType]').not('#searchCustomerId').val('');
            }
          
        });

        var _this = this;
        var jRoot = _this.$("");

        AccessHistory.getAccessHistory();
          
        $('#infoWidgetLoader').addClass('widget-black');

        if(sessionStorage.getItem('jamResponse') !== null){

          Ember.Logger.info('Hillottu response havaittu');

          var response = JSON.parse(sessionStorage.getItem('jamResponse'));

          responseRenderer.render(response);
        }


        $('#searchbtn').click(function() {

              widgetAutoUpdater.searchForCustomers();
        });


        $('.secretOrder').click(function (){

           var secretMessage = {
              view: "search"
            }

            DialogManager.create({type: "CustomerServiceSecretOrderDialog", id:"orderSala", message: secretMessage});

        });



        $('#customerSearch input').keyup(function(e){
            if(e.keyCode == 13)
            {
              widgetAutoUpdater.searchForCustomers();
              }
            });
        }

    });
  };


});

