define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility',
        'viivaDataTable', 'viivaNotification', 'viivaDialog', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaDataTable, Notification) {

  var dialog = "<section>"+
                "<p>"+tr("newOrder", "capitalizefirst")+"</p>" +               
                 "<div class='row'>" +
                   "<div class='col-md-12 smart-form'>" +
                   "<div class='alert alert-danger'>"+tr("secretOrderWarning", "capitalizefirst")+"</div>"+
                    "<div class='contact-form'>" +
                      "<div class='col-md-6'>"+
                      "<form class='form form-horizontal'>"+
                      "<fieldset style='background-color:#f2f2f2; padding:0px;'>"+
                         "<section>" +
                         "<label class='label'>"+tr("secretOrderRecipientCustomerId", "capitalizefirst")+"</label>" +
                         "<div class='input mandatory'>"+
                         "<input class='recipientCustomerId' type='text' placeholder='123456'/>"+
                         "</div>" +
                     "</section>" +
                     "<section>" +
                        "<label class='label'>"+tr("secretOrderAddressId", "capitalizefirst")+"</label>" +
                         "<div class='input mandatory'>"+
                         "<input class='addressId' type='text' placeholder='123456'/>"+
                         "</div>" +
                     "</section>" +
                    "<section>" +
                        "<label class='label'>"+tr("secretOrderOfferId", "capitalizefirst")+"</label>" +
                         "<div class='input'>"+
                         "<input class='offerId' type='text' placeholder='3452'/>"+
                         "</div>" +
                     "</section>" +
                     "</fieldset>"+
                     "<section>" +
                        "<label class='label'>"+tr("SecretOrderBeginDate", "capitalizefirst")+"</label>"+
                        "<div class='input'><input class='datepicker' id='datepicker-start'>"+
                        "<i class='fa fa-calendar icon-append'></i></div>" +
                     "</section>" +
                      "<section>" +
                        "<label class='label'>"+tr("secretOrderDurationInMonths", "capitalizefirst")+"</label>" +
                         "<div class='input'>"+
                         "<input class='orderDurationInMonths' type='text' placeholder='3'/>"+
                         "</div>" +
                     "</section>" +
                    "<section>" +
                        "<label class='label'>"+tr("secretOrderSubscriberBenefits", "capitalizefirst")+"</label>" +
                         "<div class='input'>"+
                         "<input class='subscriberBenefits' type='text' placeholder='1234,2345,3456'/>"+
                         "</div>" +
                     "</section>" +
                     "</form>"+
                    "</div>"+
                    "<div class='col-md-6'>"+
                    "<form class='form form-horizontal' style='margin-left:20px;'>"+
                      "<section>" +
                      "<label class='label'>"+tr("secretOrderPayerCustomerId", "capitalizefirst")+"</label>" +
                       "<div class='input'>"+
                       "<input class='payerCustomerId' type='text' placeholder='123456'/>"+
                       "</div>" +
                     "</section>" +
                        "<section>" +
                      "<label class='label'>"+tr("secretOrderProductCode", "capitalizefirst")+"</label>" +
                       "<div class='input'>"+
                       "<input class='productCode' type='text' placeholder='TU'/>"+
                       "</div>" +
                     "</section>" +
                       "<section>" +
                      "<label class='label'>"+tr("secretOrderOrderPrice", "capitalizefirst")+"</label>" +
                       "<div class='input'>"+
                       "<input class='orderPrice' type='text' placeholder='0.00'/>"+
                       "</div>" +
                     "</section>"+ 
                      "<section>" +
                      "<label class='label'>"+tr("secretOrderSalesMethod", "capitalizefirst")+"</label>" +
                       "<div class='input'>"+
                       "<select class='form-control' id='salesMethod'>"+
                       "<option value='K'>"+tr("repeating", "capitalizefirst")+"</option>"+
                       "<option value='M'>"+tr("productFixedSales", "capitalizefirst")+"</option>"+
                     "</select>"+
                       "</div>" +
                     "</section>" +
                      "<section>" +
                      "<label class='label'>"+tr("secretOrderSalesChannel", "capitalizefirst")+"</label>" +
                       "<div class='input'>"+           
                      "<select class='form-control' id='salesChannel'>"+
                        "<option value=''></option>"+
                        "<option value='AB'>"+tr("salesChannelAB")+"</option>"+
                        "<option value='AH'>"+tr("salesChannelAH")+"</option>"+ 
                        "<option value='AM'>"+tr("salesChannelAM")+"</option>"+  
                        "<option value='I'>"+tr("salesChannelI")+"</option>"+
                        "<option value='IG'>"+tr("salesChannelIG")+"</option>"+
                        "<option value='IK'>"+tr("salesChannelIK")+"</option>"+
                        "<option value='IL'>"+tr("salesChannelIL")+"</option>"+ 
                        "<option value='K'>"+tr("salesChannelK")+"</option>"+  
                        "<option value='PT'>"+tr("salesChannelPT")+"</option>"+
                        "<option value='S'>"+tr("salesChannelS")+"</option>"+
                        "<option value='V'>"+tr("salesChannelV")+"</option>"+ 
                     "</select>"+
                       "</div>" +
                     "</section>" + 
                      "<section>" +
                     "<label class='toggle'>" +
                        "<input type='checkbox' name='checkbox-toggle' id='secret-enforce-order'>"+tr("widgetUseEnforceCode")+
                          "<i data-swchon-text='"+tr("yes")+"' data-swchoff-text='"+tr("no")+"'></i>" +
                      "</label>"+
                     "</section>" + 
                     "</form>"+
                   "</div>" +
                  "</div>"+
                  "</div>" +  
                  "</section>"+
                  "</div>" +
                "</div>"+
                "</section>"+
                "</div>"+
                "</section>";

  var WidgetConfirmDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {

      var _this = this;
      var jRoot = _this.$("").addClass("order-cancel-confirm-dialog");

      $('#datepicker-start').datepicker({prevText:"<", nextText:">"});
      $('#datepicker-end').datepicker({prevText:"<", nextText:">"});

      // if secret order is created in customerServiceViewq automatically 
      // set customer number 
      if (_this.options.message.view === 'customer') {
        jRoot.find('.recipientCustomerId').val(customerServiceWidgetManager.activeCustomer.customerNumber);
      }

      var dialogButtons = [{
        html: tr("save"),
        "class": "btn btn-primary",
        click: function() {

          var subscriberBenefits =  [''];

          if ($('.subscriberBenefits').val() != "") {
            subscriberBenefits = JSON.parse("[" + $('.subscriberBenefits').val()+ "]");
          }   

          var dialog = $(this);
          var order = {
           addressId: $('.addressId').val(),
           orderBeginMonth: moment($("#datepicker-start").datepicker("getDate")).format('YYYYMM'),
           orderDate: moment().format('YYYYMMDD'),
           recipientCustomerId: $('.recipientCustomerId').val(),
           payerCustomerId: $('.payerCustomerId').val(),
           productCode: $('.productCode').val(),
           orderPrice: $('.orderPrice').val(),
           salesMethod: $('#salesMethod').val(),
           salesChannel: $('#salesChannel').val(),
           offerId: $('.offerId').val(),
           enforceCode: $('#secret-enforce-order').prop('checked'),
           subscriberBenefits: subscriberBenefits,
           orderDurationInMonths: $('.orderDurationInMonths').val(),
           isSecretOrder: true
          }

          // if no offer, check these
          if ($('.offerId').val() == "") {

            if($('#salesChannel').val() == "") {
              Notification.error({title: tr("orderCreateFailed"), message: tr("salesChannelMandatory") });
              return false;
            }
            else if ($('.productCode').val() == "") {
              Notification.error({title: tr("orderCreateFailed"), message: tr("productCodeMandatory") });
              return false;
            }
            else if ($('.orderPrice').val() == "") {
              Notification.error({title: tr("orderCreateFailed"), message: tr("orderPriceMandatory") });
              return false;
            }
            else if ($('.orderDurationInMonths').val() == "") {
              Notification.error({title: tr("orderCreateFailed"), message: tr("orderDurationInMonthsMandatory") });
              return false;
            }
            else if (moment($("#datepicker-start").datepicker("getDate")).format('YYYYMM') == "Invalid date") {
               Notification.error({title: tr("orderCreateFailed"), message: tr("orderStartDateMandatory") });
              return false;
            }
          }
          
          if ( $('.addressId').val() == "") {
            Notification.error({title: tr("orderCreateFailed"), message: tr("OTMandatoryException") });
          }
          else if ( $('.recipientCustomerId').val() == "") {
            Notification.error({title: tr("orderCreateFailed"), message: tr("ReceiverMandatoryException") });
          }
          else if ($('.orderPrice').val().indexOf(',') !== -1 ) {
            Notification.error({title: tr("orderCreateFailed"), message: tr("CommaNotApprovedException") });
          }
          else {
            DP.execute({type:"apiOrder", method:"createConsolidatedOrder", params: order}).then(function(response) {
              if (response.message === 'Successful') {
                if (_this.options.message.view === 'customer') {
                  customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);
                }
                dialog.dialog("close");
                Notification.success({title: tr("newOrder", "capitalizefirst"), message: tr("orderCreateSuccess")      
                });
              }
              else {
                if (typeof response.order.message !== "undefined" && response.order.message != null) {
                  Notification.error({title: tr("orderCreateFailed"), message: response.order.message });
                }
                else {
                  Notification.error({title: tr("orderCreateFailed"), message: tr("unknownError") });
                }
            }
          });
          }
       
        }
      }, {
        html: tr("cancel"),
        "class": "btn btn-default",
        click: function() {

          $(this).dialog("close");
        }
      }];
            jRoot.dialog({minWidth: 700, minHeight: 580,modal: true, draggable: true, resizable: true,
                    title: "Uusi tilaus",
                    buttons: dialogButtons, 
                    tabs: [{title: tr("newOrder")}]});
            

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
     return WidgetConfirmDialog.create({options: options}).appendTo($("body"));
    }
  
  }
});


