define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment', 'viivaNotification', 'viivaGraphSettings',
        'smartAdmin', 'ember', 'dialogManager', 'customerServiceLekaJumper', 'underscore'],
    function($, jui, DP, util, tr, moment, Notification, viivaGraph, viivaGraphSettings, Ember, DialogManager, LekaJumper, underscore) {

return function (){
    this.settings = new Object();
    this.destroyed = false;

    

   this.loadData = function(customerId) {

        var _this = this;

        var data = {

            id: customerId
          }

        DP.execute({type: "apiCustomer", method:"getCustomerHousehold", params: data}).then(function(response) {


        if (response.message === "Failed") {
              // show tbale if no results
            $('#otherHouseholdMembers').text('');
           
            $('#customer-household-table tr').remove();
            $('#customer-household-table').append("<tr>"+
                              "<th></th>"+
                              "<th>"+tr("widgetCustomerName")+"</th>"+
                              "<th>"+tr("widgetCustomerNumber")+"</th>"+
                              "<th>"+tr("widgetProduct")+"</th>"+
                              "<th>"+tr("widgetSeason")+"</th>"+
                              "<th>"+tr("widgetPrice")+"</th>"+
              "</tr>");


            $('#customer-household-table').append("<tr><td colspan='100%'>Ei tuloksia</td></tr>");

         }
          
         else  if (response.household !== "undefined" && response.household && !_.isEmpty(response.household)) {
           _this.populateHouseholdInformation(response, customerId);
             
          }
         


        });
    }

this.populateHouseholdInformation = function(response, currentCustomer) {

  var currentCustomerNumber = parseInt(currentCustomer);

  var _this = this;

          $('#otherHouseholdMembers').text('');
         
          $('#customer-household-table tr').remove();
          $('#customer-household-table').append("<tr>"+
                            "<th></th>"+
                            "<th>"+tr("widgetCustomerName")+"</th>"+
                            "<th>"+tr("widgetCustomerNumber")+"</th>"+
                            "<th>"+tr("widgetProduct")+"</th>"+
                            "<th>"+tr("widgetSeason")+"</th>"+
                            "<th>"+tr("widgetPrice")+"</th>"+
                        "</tr>");

          // show household members without orders
          if (response.household.noOrders.length > 0 ) {

            $('#houseHoldText').show();

            for (var i = 0; i < response.household.noOrders.length; i++) {

               $('#otherHouseholdMembers').append("<li class ='changeView'>"+response.household.noOrders[i].name+ " <a href='#'>"+response.household.noOrders[i].customerNumber+"</a></li>");

            }
          }

          // show household orders if any
          if (response.household.orders.length > 0 ) {

            var resultsInPeriod = 0;
            for ( var j = 0; j < response.household.orders.length; j++ ) {

                    response.household.orders[j] = characterReplacer.replaceCharacters(response.household.orders[j]);

                    var orderStartDate = response.household.orders[j].periodStart;
                    var orderEndDate = response.household.orders[j].periodEnd;
                    var orderPrice = response.household.orders[j].price;
                    var statusLight = "red";

                    var myDigiOrderStatus = null;
                    var myDigiOrderPaymentMethod = null;


                    if (typeof response.household.orders[j].myDigiOrder.orderStatus !== "undefined" && response.household.orders[j].myDigiOrder.orderStatus != null
                     && response.household.orders[j].myDigiOrder.orderStatus !==  "" ) {
                      myDigiOrderStatus = response.household.orders[j].myDigiOrder.orderStatus;
                    }

                    if (typeof response.household.orders[j].myDigiOrder.paymentMethod !== "undefined" && response.household.orders[j].myDigiOrder.paymentMethod != null
                      && response.household.orders[j].myDigiOrder.paymentMethod !==  "" ) {
                      myDigiOrderPaymentMethod = response.household.orders[j].myDigiOrder.paymentMethod;
                    }
 
                    if (orderStartDate !== characterReplacer.replaceCharacter) {
                      orderStartDate = moment(orderStartDate).format('DD.MM.YYYY');
                    }

                    if (orderEndDate !== characterReplacer.replaceCharacter) {
                        orderEndDate = moment(orderEndDate).format('DD.MM.YYYY');

                           if (typeof response.household.orders[j].cancellationType !== "undefined" && response.household.orders[j].cancellationType ==='MH') {
                             statusLight = "paytrouble";
                           }

                            else if (moment().isAfter(response.household.orders[j].periodEnd) && moment().format('YYYY-MM-DD') != response.household.orders[j].periodEnd || response.household.orders[j].cancellationType == 'MH' ) {
                              statusLight= "red";
                            }
                             // order has been cancelled when period ends
                            else if (response.household.orders[j].nextSalesMethod === 'E' || response.household.orders[j].nextSalesMethod === 'P'  
                             || response.household.orders[j].salesMethod === 'M' && response.household.orders[j].cancellationType !== ""
                             || myDigiOrderStatus === 'cancelled' && myDigiOrderPaymentMethod !== 'leka' && moment().isBefore(response.household.orders[j].periodEnd )) {
                              statusLight="yellow";
                            }
                            else if(moment().isBefore(response.household.orders[j].periodStart)) {
                              statusLight = "future";
                            }
                            else {
                              statusLight = "green";
                          
                            }

                    }

                  if (orderPrice !== characterReplacer.replaceCharacter) {
                    orderPrice = orderPrice.toFixed(2);
                    }       

                      var shouldHideHouseholdRow = true;

                      if ( response.household.orders[j].periodEnd !== characterReplacer.replaceCharacter && j < 10 && (statusLight === 'green' || 
                            statusLight === 'yellow' || statusLight === 'paytrouble' ||  statusLight === 'future' || statusLight === 'red' &&
                              !moment().subtract(1,'year').isAfter(response.household.orders[j].periodEnd))) {
                        shouldHideHouseholdRow = false;
                      resultsInPeriod++;
                       }

                      $('#customer-household-table').append("<tr"+(shouldHideHouseholdRow ? " class='household-fullscreen-row hidden'" :" ")+">"+
                      "<td><div class='traffic-light "+statusLight+"'>"+(statusLight === "paytrouble" ? "<btn class='fa fa-ban' style='color: red; font-size: 1.5em;''></btn>": " ")+"</div>"+
                      "<td>" + response.household.orders[j].name +"</td>"+
                      "<td><span class='changeView'><a href=''>"+response.household.orders[j].customerNumber+"</a></span></td>"+
                      "<td><a href='http://oiva.ok.root/otavamedia/lehtimyynti/Otavamedialle/Hinnastot%20ja%20ilmestymisaikataulut/Ilmestymisaikataulu%202016.pdf' class='blue-underline' target='blank'>" + response.household.orders[j].productCode +"</a></td>"+
                      "<td>" + orderStartDate+" - "+orderEndDate+"</td>"+
                      "<td><span class='lekaHouseholdJump' leka-operation='billpayment' data='"+response.household.orders[j].invoiceInstructionNumber+"'><a href='##' class='blue-underline'>"+orderPrice+"</a></span></td></tr>"
                    );
              
                }
            }

            if (resultsInPeriod < 1 ) {
               $('#customer-household-table').append("<tr><td colspan='100%'>Ei tuloksia tarkastelujaksolla</td></tr>");
            }

            if ( _.isEmpty(response.household.noOrders) && _.isEmpty(response.household.orders)) {
               $('#customer-household-table').append("<tr><td colspan='100%'>Ei tuloksia</td></tr>");
            }

           _this.bindEvents();

    }


     this.bindEvents = function() {

        $('#household').on('click', function(event) {

         if(document.getElementById("jarviswidget-fullscreen-mode")) {
            $('#customer-household-table .household-fullscreen-row').removeClass('hidden');
                
          }
          else {
            $('#customer-household-table .household-fullscreen-row').addClass('hidden');

          }
        });


         // leka jumper
        $('.lekaHouseholdJump').on('click', function(event) {

          event.preventDefault();

         LekaJumper.jumpToLeka($(this).attr('leka-operation'), $(this).attr('data'));


        });

        $('.changeView').on('click', function(event) {

          event.preventDefault();

          App.Router.router.transitionTo('customerService', $(this).find('a').text());


        });


    }

 
    this.create = function(insideElement){

        this.view = $("<div class='jarviswidget jarviswidget-color-blueDark' data-widget-deletebutton='false' data-widget-colorbutton='false' data-widget-editbutton='false'  id='household'>"+
                  "<header>"+
                  "<h2>Talous</h2> "+             
                  "</header>"+
                  "<!-- widget div-->"+
                  "<div class='widget-body' id='householdWidget'>"+
                  " <!-- widget edit box -->"+
                  "<table class='table table-striped' id='customer-household-table'>"+
                    "<tbody></tbody>"+
                    "</table>"+
                    "<div><span id='houseHoldText' style='display:none'>"+tr("widgetMembersWithout")+"</span><br><ul id='otherHouseholdMembers'></ul></div>"+
                    "</div>"+
                    "</div>");
        

        $(insideElement).append(this.view);
        
        /* Fix weird button click problem */
       // this.settingsView.find('label.btn-sm').css('width', '100px');
        
        this.domReady = true;
        this.parent = insideElement;


 
    } // this.create

} // analyticsWidget

});