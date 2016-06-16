define(['jquery', 'jqueryui', 'ember', 'translate', 'viivaUtility','customerServiceInfoWidget','customerServiceHouseholdWidget','customerServiceOrdersWidget','customerServiceServiceAccessWidget',
    'customerServiceOffersWidget', 'customerServiceExternalServicesWidget', 'customerServiceNotesWidget', 'dataPool', 'dialogManager', 'viivaNotification', 'customerServicePayersOrdersWidget', 'customerServicePostDeliveryWidget'],
       function($, jui, Ember, tr, util, customerServiceInfoWidget, customerServiceHouseholdWidget, customerServiceOrdersWidget,
                customerServiceServiceAccessWidget, customerServiceOffersWidget, customerServiceExternalServicesWidget, customerServiceNotesWidget, DP, DialogManager, Notification, customerServicePayersOrdersWidget, customerServicePostDeliveryWidget) {


         if (!window.simpleSorter) window.simpleSorter = {};


        simpleSorter.sortByProperty = function (arrayToSort, property, direction) {

          if (_.isEmpty(arrayToSort)) {
            return false;
          }

          var resultArray = arrayToSort;
          resultArray.sort(function (a, b) {
              if (a[property] === null) {
                a[property] = "";

            }
              if (b[property] === null) {
                b[property] = "";
              }
              if (a[property] > b[property]) {
                    return 1;
                  }
                  if (a[property] < b[property]) {
                    return -1;
                  }
                  // a must be equal to b
                  return 0;

          });

          if (typeof direction !== "undefined" && direction !== 'asc') {
            resultArray.reverse();
          }  

          return resultArray;
        };
  
    if( !window.characterReplacer ) window.characterReplacer = {};

    characterReplacer.charactersToReplace = [0, null];
    characterReplacer.replaceCharacter = "";
    characterReplacer.ignoreProperties = ["orderBonus"];

    /**
    Description: Replaces all characters from a given array with
    a character. Object properties can be ignored with ignoreProperties array
    **/
    characterReplacer.replaceCharacters = function(object)  {

            for (var i = 0; i < characterReplacer.charactersToReplace.length; i++ ) {
              for (var property in object ) {
                  if (object[property] === characterReplacer.charactersToReplace[i]) {
                    for (var j = 0; j < characterReplacer.ignoreProperties.length; j++) {
                      if (property !== characterReplacer.ignoreProperties[j]) {
                      object[property] = characterReplacer.replaceCharacter;
                     }
                    }
                  }
                }
              }

              return object;
    };

  var view= $('<section id="widget-grid">'+
      '<article class="col-xs-12 col-md-12 col-xl-6 sortable-grid ui-sortable customerServiceFirstColumn"></article>'+
      '<article class="col-xs-12 col-md-12 col-xl-6 sortable-grid ui-sortable customerServiceSecondColumn"></article>'+
     '</section>');

  return function(options) {
    return Ember.View.extend({
      template: Ember.Handlebars.compile(view[0].outerHTML),
      // Effectively document ready
      initPage: function () {

        $('#content').css('overflow', 'auto');

          function createCustomerServiceWidget(widgetName, customerId){

            var customerServiceWidget;

             switch(widgetName) {

                case "customerServiceInfoWidget":
                  customerServiceWidget = new customerServiceInfoWidget();
                  break;
                case "customerServicePayersOrdersWidget":
                  customerServiceWidget = new customerServicePayersOrdersWidget();
                  break;
                case "customerServiceHouseholdWidget":
                  customerServiceWidget = new customerServiceHouseholdWidget();
                  break;
                case "customerServiceOrdersWidget":
                  customerServiceWidget = new customerServiceOrdersWidget();
                  break;
                case "customerServiceServiceAccessWidget":
                  customerServiceWidget = new customerServiceServiceAccessWidget();
                  break;
                case "customerServiceOffersWidget":
                  customerServiceWidget = new customerServiceOffersWidget();
                  break;
                case "customerServiceExternalServicesWidget":
                  customerServiceWidget = new customerServiceExternalServicesWidget();
                  break;
                case "customerServiceNotesWidget":
                  customerServiceWidget = new customerServiceNotesWidget();
                  break;
                case "customerServicePostDeliveryWidget":
                 customerServiceWidget = new customerServicePostDeliveryWidget();
                 break;
                default:
                  break;
              }
             // var div =  $('<article/>').addClass('col-xs-6 sortable-grid ui-sortable');
              var div = $('<div/>');
              customerServiceWidget.create(div);

              if (widgetName !== 'customerServiceExternalServicesWidget') {
                customerServiceWidget.loadData(customerId);
              }

              
              if ( widgetName === 'customerServiceInfoWidget' || widgetName === 'customerServiceOrdersWidget' || widgetName === 'customerServiceOffersWidget' 
              || widgetName === 'customerServiceExternalServicesWidget' || widgetName === 'customerServicePayersOrdersWidget') {
              $('.customerServiceFirstColumn').append(div);
               }
               else {
              $('.customerServiceSecondColumn').append(div);
            }

              
              setTimeout(function() {
                pageSetUp(customerServiceWidget);
                div.show();
                }, 0);
              
         
              return customerServiceWidget;
            }

            customerServiceWidgetManager.infoWidget = createCustomerServiceWidget("customerServiceInfoWidget", customerServiceWidgetManager.activeCustomer.customerNumber);           
            customerServiceWidgetManager.householdWidget = createCustomerServiceWidget("customerServiceHouseholdWidget", customerServiceWidgetManager.activeCustomer.customerNumber);
            customerServiceWidgetManager.ordersWidget = createCustomerServiceWidget("customerServiceOrdersWidget", customerServiceWidgetManager.activeCustomer.customerNumber);
            customerServiceWidgetManager.payersOrdersWidget = createCustomerServiceWidget("customerServicePayersOrdersWidget", customerServiceWidgetManager.activeCustomer.customerNumber);
            customerServiceWidgetManager.serviceAccessWidget = createCustomerServiceWidget("customerServiceServiceAccessWidget", customerServiceWidgetManager.activeCustomer.email);
            customerServiceWidgetManager.offersWidget = createCustomerServiceWidget("customerServiceOffersWidget", customerServiceWidgetManager.activeCustomer.customerNumber);
            customerServiceWidgetManager.notesWidget = createCustomerServiceWidget("customerServiceNotesWidget", customerServiceWidgetManager.activeCustomer.customerNumber);
            customerServiceWidgetManager.externalServicesWidget = createCustomerServiceWidget("customerServiceExternalServicesWidget");
            customerServiceWidgetManager.postDeliveryWidget = createCustomerServiceWidget("customerServicePostDeliveryWidget");
      },
      didInsertElement: function() {
        var _this = this;
        var jRoot = _this.$("");

        // get customer parameter
        var route = this;

        var customerId = route.get('controller').get('content');

        var data = {
          id: customerId,
          mergeCustomer: true
        };

        // this global variable will hold all the widgets and customer account number and mydigi account id
        customerServiceWidgetManager = {};

        DP.execute({type:"apiCustomer", method:"getCustomer", params:data}).then(function(response) {
     
                  if (response.message === "Successful") {
                    
                      customerServiceWidgetManager.activeCustomer = response.customer;
                      if(typeof response.mydigiCustomer !== "undefined") {
                        customerServiceWidgetManager.activeMyDigiCustomer = response.mydigiCustomer;
                      }
                      _this.initPage();

                    }
                    else {
                      console.log("no matching account was found, nothing to do");
                      App.Router.router.transitionTo('customerWidget');
                    }

              });
             
      }
    });
  };
});
