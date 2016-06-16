define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility',
  'viivaDataTable', 'viivaNotification', 'viivaDialog', 'smartAdmin'],
  function($, jui, Ember, DP, tr, util, ViivaDataTable, Notification) {
    var uncancel_min_months = 2;

    var cancelSourceCustomerLetterList = "<div class='select'>" +
                    "<select class='order-cancel-source'>" +
                      "<option value='empty'></option>" +
                      "<option value='AK'>" + tr("cancelSourceCustomerLetter", "capitalizefirst") + "</option>" +
                      "<option value='AP'>" + tr("widgetAP", "capitalizefirst") + "</option>" +
                      "<option value='AS'>" + tr("widgetAS", "capitalizefirst") + "</option>" +
                      "<option value='AT'>" + tr("widgetAT", "capitalizefirst") + "</option>" +
                      "<option value='LL'>" + tr("widgetLL", "capitalizefirst") + "</option>" +
                      "<option value='MH'>" + tr("widgetMH", "capitalizefirst") + "</option>" +
                      "<option value='MK'>" + tr("widgetMK", "capitalizefirst") + "</option>" +
                      "<option value='MP'>" + tr("widgetMP", "capitalizefirst") + "</option>" +
                      "<option value='MS'>" + tr("widgetMS", "capitalizefirst") + "</option>" +
                      "<option value='MV'>" + tr("widgetMV", "capitalizefirst") + "</option>" +
                      "<option value='PA'>" + tr("widgetPA", "capitalizefirst") + "</option>" +
                      "<option value='PP'>" + tr("widgetPP", "capitalizefirst") + "</option>" +
                      "<option value='TP'>" + tr("widgetTP", "capitalizefirst") + "</option>" +
                    "</select><i></i>" +
                  "</div>";

   var cancelReasonCustomerLetterList = "<div class='select'>" +
                    "<select class='order-cancel-reason'>" +
                      "<option value='empty'></option>" +
                      "<option value='K'>" + tr("widgetK", "capitalizefirst") + "</option>" +
                      "<option value='L'>" + tr("widgetL", "capitalizefirst") + "</option>" +
                      "<option value='O'>" + tr("widgetO", "capitalizefirst") + "</option>" +
                      "<option value='P'>" + tr("widgetP", "capitalizefirst") + "</option>" +
                      "<option value='S'>" + tr("widgetS", "capitalizefirst") + "</option>" +
                      "<option value='T'>" + tr("widgetT", "capitalizefirst") + "</option>" +
                      "<option value='V'>" + tr("widgetV", "capitalizefirst") + "</option>" +
                      "<option value='X'>" + tr("widgetX", "capitalizefirst") + "</option>" +
                    "</select><i></i>" +
                  "</div>";

    var dialog =  "{{#if view.options.cancelTab}}" +
        "<section class='order-cancel' style='color:white;'>"+
          // normal order cancel
          "<p style='color:black'>"+tr("widgetOrderCancelQuestion")+"</p>" +
          "<p><table class='table table-hover' style='color:black;'>{{{view.options.message.text}}}</table></p>" +
          "<div class='row'>" +
            "<div class='col-md-8 smart-form'>" +
            // cancel operations. selection will determine how the order is cancelled: right away or end of period
              "<section class='cancel-form-operations'>" +
                "<input type='radio' id='JL' value='JL' name='orderOperation'> <label for='end'>"+tr("widgetOrderCancelReasonPeriodEnd", "capitalizefirst")+"</label><br>"+
                // "<input type='radio' id='PV' value='PV' name='orderOperation'> <label for='custom'>"+tr("widgetOrderCancelReasonDate", "capitalizefirst")+"</label><br>"+-->
                "<input type='radio' id='HE' value='HE' name='orderOperation'> <label for='now'>"+tr("widgetOrderCancelReasonNow", "capitalizefirst")+"</label><br>"+
                "<br>"+
                "<div class='input hidden' id='picker'>"+
                  "<input class='datepicker' id='datepicker'>" +
                  "<i class='fa fa-calendar icon-append'></i>" +
                "</div>" +
                "<div class='order-cancel-area hidden'>"+
                  "<br>"+tr("widgetOrderCancelText")+"<br><br>"+
                "</div>"+
              "</section>" +
              "<section class='recurring-cancel-operations hidden'>"+
                "<p><small>" +tr("widgetRecurringHelpText")+"</small></p><br>" +
                "<input type='radio' id='KJL' value='JL' name='recurringOperation'> <label for='end'>"+tr("widgetOrderCancelReasonPeriodEnd", "capitalizefirst")+"</label><br>"+
                "<input type='radio' id='KVI' value='VI' name='recurringOperation'> <label for='now'>"+tr("widgetORderCancelReasonFuturePeriodEnd", "capitalizefirst")+"</label><br>"+
                "<div class='recurring-future-cancel hidden'>" +
                  tr("cancel", "capitalizefirst") +
                  "<div class='select offer-periods'><select>" +
                    "<option value='1'>1</option>" +
                    "<option value='2'>2</option>" +
                    "<option value='3'>3</option>" +
                    "<option value='4'>4</option>" +
                    "<option value='5'>5</option>" +
                    "<option value='6'>6</option>" +
                    "<option value='7'>7</option>" +
                    "<option value='8'>8</option>" +
                    "<option value='9'>9</option>" +
                    "<option value='10'>10</option>" +
                    "<option value='11'>11</option>" +
                    "<option value='12'>12</option>" +
                  "</select><i></i></div>" +
                  tr("cancelAfterPeriods") + "<br>" +
                  "<div class='note'>" + tr("periodLength", "capitalizefirst") + " <span class='offer-period-length'></span> " + tr("months") + ", " + tr("offerEndDate") +
                  " <span class='offer-end-date'></span><br>" +
                  tr("delayedCancelLastValidDate") + " <strong class='order-last-day' style='color: black;'></strong></div>" +
                "</div>" +
              "</section>" +
              // cancel sources
              "<section>" +
                "<label class='label'>" + tr("orderCancelSource") + "</label>" +
                cancelSourceCustomerLetterList +
              "</section>" +
              // cancel reasons
              "<section>" +
                "<label class='label'>" + tr("orderCancelReason", "capitalizefirst") + "</label>" +
                cancelReasonCustomerLetterList +
              "</section>"+
              "<section>"+
                "<div class='col-xs-6'>"+
                  "<button class='btn btn-primary order-cancellation-button btn-sm'>" + tr("cancelOrder") + "</button>" +
                "</div>"+
              "</section>"+
            "</div>" +
          "</div>"+
        "</section>"+
        "{{/if}}" +
        "{{#if view.options.reviveTab}}" +
        // order revival. "voimaannosto"
        "<section class='order-revival'>" +
          "<p><table class='table table-hover' style='color:black;'>{{{view.options.message.text}}}</table></p>" +
          "<div class='col-xs-10 smart-form'>"+
            /*"<section>" +
              "<input type='radio' id='JL' value='JL' name='orderOperation'> <label for='end'>"+tr("widgetOrderCancelReasonPeriodEnd", "capitalizefirst")+"</label><br>"+
              "<input type='radio' id='HE' value='HE' name='orderOperation'> <label for='now'>"+tr("widgetOrderCancelReasonNow", "capitalizefirst")+"</label>"+
            "</section>" +*/
            "<section>" +
              "<label class='toggle' for='postShipments'>" +
                "<input type='checkbox' id='postShipments'>" + tr("postShipments") +
                "<i data-swchon-text='" + tr('yes', "capitalizefirst") + "'data-swchoff-text='" +
                tr("no", "capitalizefirst") + "'></i>" +
              "</label>" +
              "<label class='toggle state-disabled' for='emailNotificationBox'>" +
                "<input type='checkbox' id='emailNotificationBox' disabled='true'>" + tr("sendEmailOnBreakResume") +
                "<i data-swchon-text='" + tr('yes', "capitalizefirst") + "'data-swchoff-text='" +
                tr("no", "capitalizefirst") + "'></i>" +
              "</label>" +
            "</section>"+
            "<section>"+
              "<button class='btn btn-primary revival-btn btn-sm'>" + tr("orderRevivalCommit") + "</button>" +
            "</section>"+
          "</div>" +
          "<div class='col-xs-12 alert alert-warning revival-warning hidden'>"+
            tr("uncancelMonthsLimit") +
          "</div>" +
        "</section>"+
        "{{/if}}" +
        "{{#if view.options.breakTab}}" +
        // order pause/break, "keskeytys"
        "<section class='order-break'>" +
          "<p><table class='table table-hover' style='color:black;'>{{{view.options.message.text}}}</table></p>" +
          "<div class='col-xs-8 smart-form'>"+
            "<section>" +
              "<label class='label'>" + tr("orderCancelSource") + "</label>" +
              cancelSourceCustomerLetterList +
            "</section>" +
            "<section>" +
              "<label class='label'>" + tr("orderCancelReason", "capitalizefirst") + "</label>" +
              cancelReasonCustomerLetterList +
            "</section>"+
            "<section>" +
              "<label class='label'>"+tr("orderPauseStart")+"</label>"+
              "<div class='input mandatory' id='picker_pause_start'>"+
                "<i class='fa fa-calendar icon-append'></i>" +
                "<input class='datepicker' id='datepicker-break-start'>" +
              "</div>" +
            "</section>" +
            "<section>" +
              "<label class='label'>"+tr("orderPauseEnd")+"</label>"+
              "<div class='input mandatory' id='picker_pause_end'>"+
                "<i class='fa fa-calendar icon-append'></i>" +
                "<input class='datepicker' id='datepicker-break-end'>" +
              "</div>" +
            "</section>" +
            "<section>" +
              "<button class='btn btn-primary break-order-button btn-sm'>" + tr("orderPauseCommit") + "</button>" +
            "</section>" +
          "</div>" +
          "<div class='col-xs-12 alert alert-warning break-warning hidden'>"+
            tr("cardPaymentCantBreak") +
          "</div>" +
        "</section>"+
        "{{/if}}" +
        "{{#if view.options.transferTab}}" +
        // order transfer "siirto"
        "<section class='order-transfer'>" +
          "<p><table class='table table-hover' style='color:black;'>{{{view.options.message.text}}}</table></p>" +
          "<div class='col-xs-12 smart-form' style='min-height: 430px'>"+
            "<label style='color:#000'>" + tr("orderTransferReceiver") + "</label><br>" +
            "<input type='text' class='receiver-customer-number'/>" +
            // glyphicon hidden until search returns valid customer number
            "<div class='glyphicon-customer-id glyphicon glyphicon-ok' style='color: green; display: none; margin-left: 10px;'></div>" +
            "<button class='btn btn-primary btn-sm searchButton' style='margin-left: 10px;'>" + tr("widgetSearch") + "</button>" +
            "<br><br>"+
            "<p id='customerInfoPlaceholder' style='cursor: default'></p>" +
            // placeholder for adding customer to mydigi
            "<div id='askForEmail' style='display: none'>" +
              "<input type='text' class='customer-new-email' style='width: 70%; margin-top: 5px'/>" +
              "<div class='glyphicon-customer-email glyphicon glyphicon-ok' style='color: green; display: none; margin-left: 10px'></div>" +
              "<button class='btn btn-primary btn-sm addEmailBtn' style='margin-left: 10px; display: none'>" + tr("widgetAdd") + "</button>" +
            "</div>" +
            // table for choosing md account
            "<div class='choose-md-account' style='display: none; cursor: default'>" +
            "<table class='table-hover' style='width: 100%'>" +
            "<thead style='background-color: #4C4F53; border: solid 1px; color: white'><tr><td style='padding-left: 10px'>" +
            tr("widgetCustomerNumberShort", "capitalizefirst") + "</td>" + 
            "<td>" + tr("userEmail", "capitalizefirst") + "</td><td>" + tr("userCreated", "capitalizefirst") + "</td>" +
            "<td>" + tr("widgetLastUsed", "capitalizefirst")  + "</td></tr></thead>" +
            "<tbody style='border: solid 1px'</tbody></table></div>" +
            // selected action
            "<div class='select-action' style='display: none'></div>" +
            "<div id='emailForNewMDaccount' style='display: none'>" +
              "<p id='existingEmail'>" + "<button class='btn btn-primary useExistingBtn' style='margin-left: 10px;'>" + 
              tr("widgetUseMailMD") + "</button>" + "</p>" + 
            "</div>" + 
            "<br>" +
            "<section id='cancelReasonDropdown' style='display: none'>" +
              "<label style='color:#000'>" + tr("orderCancelSource", "capitalizefirst") + "</label>" +
                cancelSourceCustomerLetterList +
            "</section>"+
            "<br><button class='btn btn-primary btn-sm transfer-button' style='display: none'>" + tr("orderTransferCommit") + "</button>" +
            "</div>" +
            "<div class='col-xs-12 alert alert-warning break-warning hidden'>"+
            tr("cardPaymentCantTransfer") +
          "</div>" +
        "</section>"+
        "{{/if}}" +
        "{{#if view.options.postDeliveryTab}}" +
          "<section class='order-transfer'>" +
            "<div id='post-delivery-tab'></div>" +
          "</section>"+
        "{{/if}}" +
          "<div class='sk-three-bounce'>"+
          "<div class='sk-child sk-bounce1'></div>"+
          "<div class='sk-child sk-bounce2'></div>"+
          "<div class='sk-child sk-bounce3'></div>"+
          "<div class='sk-child sk-bounce4'></div>"+
          "</div>";

    function getPeriodEnd(startDate, periodLength, periodCount, inFuture) {
      if (typeof startDate != "undefined") {
        var start = moment(startDate);
        if (start.isValid()) {
          if (typeof periodLength == "number" && periodLength > 0 &&
              typeof periodCount == "number" && periodCount > 0) {
            if (typeof inFuture !== "undefined" && inFuture) {
              var now = moment();
              if (now > start) {
                var diff = now.diff(start, "months");
                var completedPeriods = Math.floor(diff / periodLength);
                start.add(periodLength * (completedPeriods + 1), "months"); // Get the starting date of the next period
              }
            }

            // Get the final count
            return start.add(periodLength * periodCount, "months").subtract(1, "day").format("DD.MM.YYYY");
          }
        }
      }
      return "";
    }

var WidgetConfirmDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),

    didInsertElement: function() {

      var _this = this;
      var jRoot = _this.$("").addClass("order-cancel-confirm-dialog");

      var cancelSection = jRoot.find(".order-cancel");
      var reviveSection = jRoot.find(".order-revival");
      var breakSection = jRoot.find(".order-break");
      var transferSection = jRoot.find(".order-transfer");

    // hide loading animation
    jRoot.find('.sk-three-bounce').addClass('hidden');


          jRoot.find('.mydigi-cancel').remove();
          jRoot.find('.orders-fullscreen-column').remove();

    // z-index hack. this is set because of full screen orders view and order cancel dialog not playing together nicely
    setTimeout(function(){ $('.ui-dialog').css('z-index','100000'); }, 100);

    // GLOBAL SMART ADMIN FUNCTION smartAdmin.js : 610
    if (typeof runAllForms === "function") {
      runAllForms(jRoot);
    }

    // listener for order cancel oparation
    cancelSection.find('input[name=orderOperation]:radio').click(function() {

      if( $(this).context.id === 'JL' ) {
        cancelSection.find('.order-cancel-area').addClass('hidden');
        cancelSection.find('#picker').addClass('hidden');

      } else if( $(this).context.id === 'HE') {
        cancelSection.find('.order-cancel-area').removeClass('hidden');
        cancelSection.find('#picker').addClass('hidden');

        var orderNumberDates = _this.options.message.orderids;
        var mydigiCancelId = null;
        
        if (typeof _this.options.message.mydigi !== "undefined" ) {
          mydigiCancelId = _this.options.message.mydigi;
        }

        for (var i = 0; i < orderNumberDates.length; i++) {
        
          if(moment().isBefore(orderNumberDates[i].orderStartDate)  ) {
            $("#orderrow"+orderNumberDates[i].orderId).addClass('hidden-order-cancel-row');
          }
          else {
            $("#orderrow"+orderNumberDates[i].orderId).removeClass('hidden-order-cancel-row');
          }

        }

      } else if ($(this).context.id === 'PV') {
          cancelSection.find('.order-cancel-area').removeClass('hidden');
          cancelSection.find('#picker').removeClass('hidden');
      }
    });

    cancelSection.find('input[name=recurringOperation]:radio').click(function() {
      if( $(this).context.id === 'KJL' ) {
        cancelSection.find('.recurring-future-cancel').addClass('hidden');
      } else if( $(this).context.id === 'KVI') {
        cancelSection.find('.recurring-future-cancel').removeClass('hidden');
      }
    });

      // displays order rows that are sent from orders view

      console.log(_this.options.message);

      for ( var i = 0 ; i < _this.options.message.orderids.length; i++ ) {
       jRoot.find('.order-cancel-area').append("<div id='orderrow"+_this.options.message.orderids[i].orderId+"'><label><strong>"+tr("widgetOrderNo")+": </strong>"+_this.options.message.orderids[i].orderId+" <strong>"+tr("secretOrderPrice")+": </strong></label> <input type='text' id='ordernumber-cancel"+_this.options.message.orderids[i].orderId+"' size='6' class='order-cancel-price'"+
         "style='text-align: right !important' placeholder='xx.xx' value='0.00'></input></div>");
      }

      jRoot.find('#datepicker-break-start').datepicker("option", "minDate", 0);
      jRoot.find('#datepicker-break-end').datepicker("option", "minDate", 0);
      jRoot.find('#datepicker').datepicker();

      /**
       * 
       * Description: Cancels customer order
       * 
       */
      cancelSection.find('.order-cancellation-button').click(function() {

        jRoot.find('.sk-three-bounce').removeClass('hidden');

          var selectedOperation = $(".recurring-cancel-operations").hasClass("hidden") ?
                                   $('input:radio[name=orderOperation]:checked').val() :
                                   $('input:radio[name=recurringOperation]:checked').val();
          var orderCancelEndDate ="";

          var orderCancellationType = cancelSection.find('.order-cancel-source').val();
          var orderCancellationReason = cancelSection.find('.order-cancel-reason').val();

            // check that reason and type are checked  
          if ( orderCancellationReason === 'empty' ) {
            Notification.error({
              title: tr("widgetOrderCancelFailed"),
              message: tr("widgetOrderCancelReasonException"),
              container: $("body")
            });

          }
          // check that operation has been selected
          else if ( typeof selectedOperation === 'undefined' ) {
            Notification.error({
              title: tr("widgetOrderCancelFailed"),
              message: tr("widgetOrderCancelOperationException"),
              container: $("body")
            });

          }
           // check that cancellation type has been selected
          else if ( orderCancellationType === 'empty') {
            Notification.error({
              title: tr("widgetOrderCancelFailed"),
              message: tr("widgetOrderCancelTypeException"),
              container: $("body")
            });
          }
          // everything ok, commit to cancelling order
          else {

            var orderNumberArray = _this.options.message.orderids;
            var mydigiId = null;
            var hasCurrentOrders = _this.options.message.hasCurrentOrders;

            // get possible mydigi order id if it is a mydigi order
            if (typeof _this.options.message.mydigi !== "undefined" ) {
              mydigiId = _this.options.message.mydigi;
            }

            var orders = [];

          // there might be multiple offers in an order. all need to be cancelled
          for (var i = 0; i < orderNumberArray.length; i++) {

            var sendOperation = selectedOperation;
            if (sendOperation === 'PV') {
              orderCancelEndDate = moment(cancelSection.find("#datepicker").datepicker("getDate")).format('YYYY-MM-DD');
            }

          // ignore order rows where cancel end date is after order end date 
          if(moment(orderCancelEndDate).isAfter(orderNumberArray[i].orderEndDate) && sendOperation === 'PV' && mydigiId != null) {
             //console.log("ignore");
           }
          else {

            if ( sendOperation === 'JL' && mydigiId == null || sendOperation === 'JL' && mydigiId != null && !hasCurrentOrders) {
              sendOperation = 'JL';
            }
            // is cancel date is before start of period, set cancel date as first day of period and operation as pvm
            else if ((moment().isBefore(orderNumberArray[i].orderStartDate) && sendOperation !== 'PV') || moment(orderCancelEndDate).isBefore(orderNumberArray[i].orderStartDate)) {
              sendOperation =  "PV";
              orderCancelEndDate = orderNumberArray[i].orderStartDate;
          }

          var cancelPrice = $("#ordernumber-cancel"+orderNumberArray[i].orderId).val();

          // create order object
          var order = {
            operation: sendOperation,
            endDate: orderCancelEndDate,
            orderNumber: orderNumberArray[i].orderId,
            orderPrice: cancelPrice
            };

              orders.push(order);
            }

          }

          var cancelMyDigiSalesMethod = null;

          if (typeof _this.options.message.myDigiSalesMethod !== "undefined") {
            cancelMyDigiSalesMethod = _this.options.message.myDigiSalesMethod;
          }

          // Mydigi order that is paid with a credit card can be cancelled at a later time
          var myDigiDelayedCancellation = null;
          var myDigiDelayedOrderCancelDate = cancelSection.find('.order-last-day').html();

          if (!$(".recurring-cancel-operations").hasClass("hidden") &&
              myDigiDelayedOrderCancelDate.trim().length > 0 &&
              cancelSection.find(".recurring-cancel-operations #KVI").prop("checked")) {
            myDigiDelayedCancellation = true;
            myDigiDelayedOrderCancelDate = myDigiDelayedOrderCancelDate.trim() + " 23:59:59"; //last second of the last day
          } else {
            myDigiDelayedOrderCancelDate = null;
          }

          var orderObject = {
            myDigiSalesMethod: cancelMyDigiSalesMethod, 
            myDigiDelayedCancellation: myDigiDelayedCancellation,
            myDigiDelayedOrderCancelDate: myDigiDelayedOrderCancelDate,
            orders: orders,
            mydigiId: mydigiId,
            cancellationType: orderCancellationType,
            cancellationReason: orderCancellationReason
          };

          // send order cancellation to backend
          DP.execute({type:"apiOrder", method:"cancelOrder", params: orderObject}).then(function(response) {

            // show loading animation
            jRoot.find('.sk-three-bounce').addClass('hidden');

            if (response.message === 'Successful') {

              // load updated order data
              customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);

              Notification.success({
                title: tr("orderCancelSuccess"),
                message: tr("orderCancelSuccess"),
                container: $("body")
              });

              jRoot.dialog("close");

            }

            else {
              if (typeof response.orders !== "undefined" && response.orders instanceof Array ) {
                for (var i = 0; i < response.orders.length; i++ ) {
                  Notification.error({title: tr("orderCancelFailed"), message: response.orders[i].message });
                }
              }
              else if (typeof response.orders !== "undefined") {
                Notification.error({title: tr("orderCancelFailed"), message: response.orders.message });
              }
              else {
                Notification.error({title: tr("orderCancelFailed"), message: tr("unknownError")});
              }

            }
          });

        }

    });

      /**
       * 
       * Description: Brings back customer order if it has been cancelled
       * 
       */
      reviveSection.find("#postShipments").change(function() {
        if ($(this).prop("checked")) {
          reviveSection.find("#emailNotificationBox").attr("disabled", false).parent().removeClass("state-disabled");
        } else {
          reviveSection.find("#emailNotificationBox").attr("disabled", true).prop("checked", false).parent().addClass("state-disabled");
        }
      });

      reviveSection.find('.revival-btn').click(function() {
        // Show loading animation
        jRoot.find('.sk-three-bounce').removeClass('hidden');

        // Get orders
        var orders = [];
        for (i = 0; i < _this.options.message.orderids.length; i++) {
          orders.push({
            orderNumber: _this.options.message.orderids[i].orderId,
          });
        }
        // Get settings
        var orderObject = {
          myDigiID: typeof _this.options.message.mydigi !== "undefined" ? _this.options.message.mydigi : null,
          postShipments: reviveSection.find("#postShipments").prop("checked"),
          emailNotification: reviveSection.find("#emailNotificationBox").prop("checked"),
          orders: orders
        };

        DP.execute({type:"apiOrder", method:"cancelOrderResume", params: orderObject}).then(function(response) {
          jRoot.find('.sk-three-bounce').addClass('hidden');

          if (response.message === 'Successful') {
            customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);
              Notification.success({
              title: tr("ordeResumeSuccess"),
              message: tr("ordeResumeSuccess"),
              container: $("body")
            });
            jRoot.dialog("close");
          } else {
            Notification.error({title: tr("orderCancelFailed"), message: tr("unknownError")});
          }
        });
      });

    /**
     * 
     * Description: Breaks customer order. Meaning that it will be cancelled stariing from orderBreakStarDate until orderBreakDate
     * 
     */
    breakSection.find("#datepicker-break-start").change(function() {
        var date = $(this).datepicker("getDate");

        // Limit start date of end datepicker
        breakSection.find("#datepicker-break-end").datepicker("option", "minDate", date);
    });

    breakSection.find('.break-order-button').click(function() {

      var orderNumberToBreak = _this.options.message.orderids[0].orderId;

      // Make sure dates are set
      if (breakSection.find("#datepicker-break-start").datepicker("getDate") == null ||
          breakSection.find("#datepicker-break-start").datepicker("getDate") == null) {
        Notification.error({title: tr("orderBreakFailure"), message: tr("orderBreakMissingDates")});
        return;
      }

      jRoot.find('.sk-three-bounce').removeClass('hidden');

      var orderCancellationType = breakSection.find('.order-cancel-source').val();
      var orderCancellationReason = breakSection.find('.order-cancel-reason').val();

      // Leka expects orderEnd date and orderStart date
      // orderEndDate is breakStartDate - 1 day
      // orderStartDate is breakEndDate + 1 day
      var orderEndDate = moment(breakSection.find("#datepicker-break-start").datepicker("getDate"))
                           .subtract(1, "days").format('YYYY-MM-DD');
      var orderStartDate = moment(breakSection.find("#datepicker-break-end").datepicker("getDate"))
                             .add(1, "days").format('YYYY-MM-DD');

      // Get orders
      var orders = [];
      for (i = 0; i < _this.options.message.orderids.length; i++) {
        orders.push({
          orderNumber: _this.options.message.orderids[i].orderId
        });
      }

      // Get settings
      var orderObject = {
        myDigiID: typeof _this.options.message.mydigi !== "undefined" ? _this.options.message.mydigi : null,
        cancellationType: orderCancellationType,
        cancellationReason: orderCancellationReason,
        endDate: orderEndDate ,
        startDate: orderStartDate,
        orders: orders
      };

      DP.execute({type:"apiOrder", method:"breakOrder", params: orderObject}).then(function(response) {
        jRoot.find('.sk-three-bounce').addClass('hidden');

        if (response.message === 'Successful') {

          customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);

          Notification.success({
            title: tr("orderBreakSuccess"),
            message: tr("orderBreakSuccess"),
            container: $("body")
          });

          jRoot.dialog("close");

        } else {
          Notification.error({title: tr("orderBreakFailure"), message: tr("orderBreakFailure")});
        }

      });

    });


    /**
     * 
     * Description: Transfers customer order from one customer number to another
     * 
     */

     // GLOBAL VARIABLE!!
     var emailUpdateDenied = false;

    /**
    * Search for customer with id. If customer found and order is in Leka proceed. 
    * If order is in myDigi check if customer has myDigi account(s) and act accordingly.
    */
    transferSection.find('.searchButton').click(function() {
      clearTransferView();
      var searchMe = {
        customerId: transferSection.find('.receiver-customer-number').val()
      };
      DP.execute({type: "apiCustomer", method: "findCustomers", params: searchMe }).then(function(response) {
        var digi = _this.options.message.mydigi;
        if (inLeka(response)) {
          if (typeof digi !== 'undefined') {
            searchWithEmailAndPopulateSelectList(response);
            var optionsCount = transferSection.find('.choose-md-account tr').size();
            if (optionsCount > 1) {
              updateTransferView(response);
              transferSection.find('#cancelReasonDropdown').css("display", "none");
              transferSection.find('#customerInfoPlaceholder').append("<br><br>" + tr("widgetSelectMDaccount"));
              transferSection.find('.choose-md-account').css("display", "");
            } else {
              transferSection.find('.addEmailBtn').click(function() {
              transferSection.find('#cancelReasonDropdown').css("display", "");
              transferSection.find('.transfer-button').unbind();
              transferSection.find('.transfer-button').click(function(){
                upgradeToMDandTransfer(transferSection.find('.customer-new-email').val(), response.customers[0]);
                });
              });
              upgradeToMD(response);
            }
          } else {
            transferSection.find('.transfer-button').unbind();
            transferSection.find('.transfer-button').click(function(){transfer(response.customers[0])});
            updateTransferView(response);
          }
        } else {
          noLekaCustomerFound();
        }
      }); 
    });

    /**
    * Search customers from DB with email addresses acquired from search via customer number.
    * Populate table with both; param object's customers array and found occurences
    * from searching DB with registered customer's email addresses.
    *
    * @param  res                 Object with customers array. Each customer object is added to table
    *                             if that object is myDigi account. If email address field is defined and
    *                             not null, a DB query will search for more accounts that have same email
    *                             registered (and different customer number).
    */

    function searchWithEmailAndPopulateSelectList(res) {
      // check if email update to md is allowed
      for (r = 1; r < res.customers.length; r++) {
        if (res.customers[0].email === res.customers[r].email) {
          emailUpdateDenied = true;
        }
      }
      transferSection.find('.mdAccountChooser').html('');
      // if Leka account is also MD account, add it to list
      if (typeof res.customers[0].inMD !== 'undefined' && res.customers[0].inMD !== null) {
        // md email update denied
        emailUpdateDenied = true;

        addCustomerToTable(res.customers[0], res.customers[0]);
      }
      for (l = 1; l < res.customers.length; l++) {
        addCustomerToTable(res.customers[l], res.customers[0]);
      } 
      // actual search with email
      for (i = 0; i < res.customers.length; i++) {
        if (typeof res.customers[i].email !== 'undefined' && res.customers[i].email !== null) {
          var emailSearch = {
            email: res.customers[i].email
          };
          DP.execute({type: "apiCustomer", method: "findCustomers", params: emailSearch }).then(function(newRes) {
            for (j = 0; j < newRes.customers.length; j++) {
              var foundedObject = false;
              for (k = 0; k < res.customers.length; k++) {
                if (res.customers[k].email === newRes.customers[j].email && 
                  res.customers[k].customerNumber == newRes.customers[j].customerNumber) {
                  foundedObject = true;
                }
              }
              if (!foundedObject) {
                // do not allow update of mydigi email if leka has same email
                if (newRes.customers[j].email === res.customers[0].email) {
                  emailUpdateDenied = true;
                }
                addCustomerToTable(newRes.customers[j], res.customers[0]);
              } 
            }
          });
        }
      }
    }

    /**
    * Add customer object to table. Method checks if created and lastAuth fields are
    * defined. If not, corresponding table cell will be filled with ''.
    *
    * @param  customer            Customer object
    * @param  lekaCustomer        Handle to customers Leka account (customer object)
    */
    function addCustomerToTable(customer, lekaCustomer) {
      var createdDate;
      var lastAuthDate;
      if (typeof customer.created === 'undefined' || customer.created === null) {
        createdDate = '';
      } else {
        createdDate = util.parseDate(customer.created, "D.M.YYYY");
      }
      if (typeof customer.lastAuth === 'undefined' || customer.lastAuth === null) {
        lastAuthDate = '';
      } else {
        lastAuthDate = util.parseDate(customer.lastAuth, "D.M.YYYY");
      }

      $('<tr><td style="padding-left: 10px">' + customer.customerNumber + '</td><td>' + 
        customer.email + '</td><td>' + createdDate + '</td><td>' + lastAuthDate + '</td></tr>')
        .appendTo(transferSection.find('.choose-md-account table')).click(function() {
          transferSection.find('.choose-md-account table tbody tr').each(function() {
            $(this).css("background-color", "");
          });
          $(this).css('background-color', 'lightblue');
          populateSelectAction(customer, lekaCustomer);});
    }

    /**
    * Populate select-action UI with elements based on given customer and Leka customer.
    *
    * @param  customer            Customer
    * @param  lekaCustomer        Handle to customers Leka account (customer object)
    */
    function populateSelectAction(customer, lekaCustomer) {
      transferSection.find('.select-action').html('');
      transferSection.find('.select-action').css("display", "");
      transferSection.find('.select-action').css("color", "");
      transferSection.find('#cancelReasonDropdown').css("display", "none");

      if (customer.id == lekaCustomer.id && customer.email == lekaCustomer.email) {
        transferSection.find('#cancelReasonDropdown').css("display", "");
        transferSection.find('.transfer-button').unbind();
        transferSection.find('.transfer-button').click(function() {
          transfer(customer);
        })
      } else if (customer.customerNumber == lekaCustomer.id && customer.email != lekaCustomer.email) {
        transferSection.find('.select-action').append("<form action=''>");
        $('<input type="radio" name="email" id="updateLeka" value="updateLeka" style="margin-right: 5px">' +
          '<label for="updateLeka"> ' + tr("widgetUpdateLekaEmail") + '</label><br>')
        .appendTo(transferSection.find('.select-action form')).click(function() {
          transferSection.find('#cancelReasonDropdown').css("display", "");
          transferSection.find('.transfer-button').unbind();
          transferSection.find('.transfer-button').click(function() {
            changeEmailandTransfer(customer, lekaCustomer, "leka");
          });
        });
        $('<input type="radio" name="email" id="updateMD" class="update-mydigi-email-select" ' +
          'value="updateMD" style="margin-right: 5px">' +
          '<label for="updateMD" class="update-mydigi-email-select"> ' + tr("widgetUpdateMDemail") + '</label><br>')
        .appendTo(transferSection.find('.select-action form')).click(function() {
          transferSection.find('#cancelReasonDropdown').css("display", "");
          transferSection.find('.transfer-button').unbind();
          transferSection.find('.transfer-button').click(function() {
            changeEmailandTransfer(lekaCustomer, customer, "mydigi");
          });
        });
        transferSection.find('.select-action').append("</form>");
        if (emailUpdateDenied) {
          hideMdEmailUpdate();
        }
        if (typeof lekaCustomer.email === 'undefined' || lekaCustomer.email === null) {
          hideMdEmailUpdate();
        }
      } else if (customer.customerNumber != lekaCustomer.id && customer.email == lekaCustomer.email) {
        transferSection.find('.select-action').append(tr("widgetUpdateMDemailFromLeka"));
        transferSection.find('.select-action').css("color", "red");
        transferSection.find('.transfer-button').unbind();
        transferSection.find('.transfer-button').click(function() {
          changeCustomerNumberandTransfer(lekaCustomer, customer);
        });
        transferSection.find('#cancelReasonDropdown').css("display", "");
      } else {
        Notification.error({title: tr("orderTransferFailed"), message: tr("unknownError")});
      }
    }

    /**
    * Disable selection to update mydigi accounts email from leka
    */
    function hideMdEmailUpdate() {
      transferSection.find('#updateLeka').prop('checked', true);
      transferSection.find('.update-mydigi-email-select').css('display', 'none');
      transferSection.find('#updateLeka').click();
    }

    /**
    * Checks if given object's array contains customer object that is in Leka system
    * 
    * @param  res  Object with customers array to be checked
    * @return      True one of params objects array is Leka customer
    */
    function inLeka(res) {
      if (res.customers.length === 0) {
        return false;
      } else {
        for (i = 0; i < res.customers.length; i++) {
          if (typeof res.customers[i].id !== 'undefined') {
           return true;
          } 
        }
      }
      return false;
    }

    /**
    * Update display to view needed components so that customer's Leka
    * account can be upgraded to mydigi. Actual transformation of account
    * will be done separately. This method only updates form's view.
    *
    * @param  res   Object with array of customers with size of at least 1. 
    *               By default customers Leka account will be searched from
    *               index 0.
    */
    function upgradeToMD(res) {
      var customer = res.customers[0];
      transferSection.find('.glyphicon-customer-id').css("display", "");
      transferSection.find('#customerInfoPlaceholder').css("display", "").text("");
      if (typeof customer.email !== 'undefined' && customer.email !== null) {
        transferSection.find('#customerInfoPlaceholder').append(customer.name + "<br>" + customer.email + 
        "<br>" + customer.address + "<br>" + customer.postNumber + " " + customer.postOffice);
      } else {
        transferSection.find('#customerInfoPlaceholder').append(customer.name + "<br>" + customer.address + 
        "<br>" + customer.postNumber + " " + customer.postOffice);
      }
      transferSection.find('#customerInfoPlaceholder').append("<br><br>" + tr("widgetCustomerNotInMD"));
      transferSection.find('#customerInfoPlaceholder').append("<br>" + tr("widgetCreateMdAccountWithEmail") + ":");
      transferSection.find('#askForEmail').css("display", "");
      if (typeof customer.email !== 'undefined' && customer.email !== null) {
        transferSection.find('.customer-new-email').val(customer.email);
        transferSection.find('.glyphicon-customer-email').css("display", "");
        transferSection.find('.addEmailBtn').css("display", "");
        transferSection.find('.addEmailBtn').text(tr("widgetUseMailMD"));
      }
    }

    /**
    * Display notification error that no customer can be found from Leka with
    * given customer number.
    */
    function noLekaCustomerFound() {
        transferSection.find('.glyphicon-customer-id').css("display", "none");
        transferSection.find('.searchButton').css("margin-left", "10px");
        Notification.error({title: tr("orderTransferFailed"), message: tr("widgetNoSuchCustomerId")});
    }

    /**
    * Clear UI components and only display field for customer number and search button.
    * Method doesn't remove any elements, it simply hides every element with CSS:
    * display : none
    */
    function clearTransferView() {
      transferSection.find('.transfer-button').css("display", "none");
      transferSection.find('#cancelReasonDropdown').css("display", "none");
      transferSection.find('#emailForNewMDaccount').css("display", "none");
      transferSection.find('#customerInfoPlaceholder').css("display", "none");
      transferSection.find('#askForEmail').css("display", "none");
      transferSection.find('.choose-md-account').css("display", "none");
      transferSection.find('.select-action').css("display", "none");
      transferSection.find('.choose-md-account tbody').html('');
      transferSection.find('.choose-md-account').css("display", "none");
    }

    /**
    * Update UI with customer's info. Method updates following; 
    * <ul>
    * <li>Show green glyphicon to verify found customer number</li>
    * <li>Show cancellation reason selection</li>
    * <li>Show customer's name, email and address</li>
    * </ul>
    *
    * @param  customerData  Object with array consisting of customers. 
    *                       Data will be updated with array index of 0.
    */
    function updateTransferView(customerData) {
      var customer = customerData.customers[0];
      transferSection.find('.glyphicon-customer-id').css("display", "");
      transferSection.find('.searchButton').css("margin-left", "10px");
      transferSection.find('#cancelReasonDropdown').css("display", "");
      transferSection.find('#customerInfoPlaceholder').css("display", "").text("");
      if (typeof customer.email !== 'undefined' && customer.email !== null) {
        transferSection.find('#customerInfoPlaceholder').append(customer.name + "<br>" + customer.email + 
        "<br>" + customer.address + "<br>" + customer.postNumber + " " + customer.postOffice);
      } else {
        transferSection.find('#customerInfoPlaceholder').append(customer.name + "<br>" + customer.address + 
        "<br>" + customer.postNumber + " " + customer.postOffice);
      }
      
    }

    /**
    * Validate given email and show button to add or use chosen email.
    *
    * If user account has email defined, UI automatically uses that email
    * in 'customer-new-email' -field and button will have caption 'use'.
    *
    * If no email is bound to customer Leka account, or email address
    * is altered, button will have caption 'add' and button will be visible
    * only after email address seems valid.
    */
    transferSection.find('.customer-new-email').keyup(function(evt) {
      if (evt) {
        if (util.validateEmail(transferSection.find('.customer-new-email').val())) {
          transferSection.find('.glyphicon-customer-email').css("display", "");
          transferSection.find('.addEmailBtn').css("display", "");
          transferSection.find('.addEmailBtn').text(tr("widgetUpdateToThis"));
        } else {
          transferSection.find('.glyphicon-customer-email').css("display", "none");
          transferSection.find('.addEmailBtn').css("display", "none");
        }
      }
    });

    /**
    * Show cancel reason if existing email is to be used in md order transfer.
    */
    transferSection.find('.useExistingBtn').click(function () {
      transferSection.find('#cancelReasonDropdown').css("display", ""); 
    });

    /**
    * Show transfer button after cancel reason has been selected.
    */
    transferSection.find(".order-cancel-source").change(function() {
      transferSection.find('.transfer-button').css("display", "")
    });

    /**
    * Bind keyup event to [Enter] -key so that when customer number has been
    * entered, query can be started by simply pressing [Enter]. 
    */
    transferSection.find('.receiver-customer-number').keyup(function(event) {
      if(event.keyCode == 13) {
        transferSection.find('.searchButton').click();
      }
    });

    /**
    * Show cancellation reason dropdown select. Event will occur when user
    * selects action with radio buttons.
    *
    * Applicable when customer has many myDigi accounts and Leka account
    * has to be binded to one of them. Radio buttons are show on options
    * to either update Leka's email with given myDigi accounts email or
    * to update email from Leka to chosen myDigi account.
    */
    transferSection.find('.select-action input:radio').click(function() {
      transferSection.find('#cancelReasonDropdown').css("display", ""); 
    });

    /**
    * Following 4 methods do changes to accounts so that transfer is possible.
    */

    /**
    * Change customer email address and call transfer.
    *
    * @param  source        Customer object whos email is to be copied
    * @param  destination   Customer object whos email is to be overwritten
    * @param  update        Update myDigi or Leka
    */
    function changeEmailandTransfer(source, destination, update) {
      destination.email = source.email;
      destination.update = update;


      DP.execute({type:"apiCustomer", method:"updateEmail", params: destination}).then(function(response) {
        if (response.message === 'Successful') {
          Notification.success({title: tr("widgetChangeEmailSuccess"), message: tr("widgetChangeEmailSuccess")});
          transfer(destination);
        } else {
           Notification.error({title: tr("widgetChangeEmailError"), message: tr("widgetChangeEmailError")});
        }

      });

    }

    /**
    * Change customer id to myDigi account from Leka account and call transfer
    *
    * @param  lekaSource    Customer object where id is copied from
    * @param  mdDestination Customer object whos id is updated
    */
    function changeCustomerNumberandTransfer(lekaSource, mdDestination) {
      mdDestination.id = lekaSource.id;

      DP.execute({type:"apiCustomer", method:"changeCustomerNumber", params: mdDestination}).then(function(response) {
        if (response.message === 'Successful') {
          Notification.success({title: tr("widgetCustomerNumberChangeSuccess"), message: tr("widgetCustomerNumberChangeSuccess")});
          transfer(mdDestination);
        } else {
          Notification.error({title: tr("widgetCustomerNumberChangeError"), message: tr("widgetCustomerNumberChangeError")});
        }

      });

    }

    /**
    * Upgrade customer Leka account to Leka+myDigi with given email address.
    * After upgrade call transfer.
    *
    * @param  email   String for email to be bound with Leka+myDigi account
    */
    function upgradeToMDandTransfer(email, lekaCustomer) {
      lekaCustomer.email = email;

      var createAccount = {
        lekaCustomer: lekaCustomer
      };
      
      DP.execute({type:"apiCustomer", method:"addMdAccount", params: createAccount}).then(function(response) {
        if (response.message === 'Successful') {
          Notification.success({title: tr("widgetAccountUpgradeSuccess"), message: tr("widgetAccountUpgraded")});
          lekaCustomer.account = response.account.account;
          transfer(lekaCustomer);
        } else {
          Notification.error({title: tr("widgetUpgradeToMdFailed"), message: tr("widgetUpgradeFailedMessage")});
        }

      });
     
    }

    /**
    * Transfers order.
    *
    * @param  receiver  Customer object to whom to transfer
    */
    function transfer(receiver) {
      var orderCancelSourceTransfer = transferSection.find('.order-cancel-source').val();
      var receiverCustomer = receiver;
      var mdOrderID = _this.options.message.mydigi;
      var lekaOrderNumberArray = [];

      for (i = 0; i < _this.options.message.orderids.length; i++) {
        lekaOrderNumberArray.push(_this.options.message.orderids[i].orderId);
      }

      // DO TRANSFER HERE

      var orderObject = {
        orderNumbers: lekaOrderNumberArray,
        receiverCustomer: receiverCustomer,
        orderCancelSourceTransfer: orderCancelSourceTransfer,
        mdOrderID: mdOrderID
      };
      
      DP.execute({type:"apiOrder", method:"transferOrder", params: orderObject}).then(function(response) {
        if (response.message === 'Successful') {
          customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);
          Notification.success({
            title: tr("orderTransferSuccess"),
            message: tr("orderTransferSuccess"),
            container: $("body")
          });


          jRoot.dialog("close"); 
        }

        else {
          if(Array.isArray(response.order)) {
            for( var i =0; i< response.order.length;i++) {
              Notification.error({title: tr("orderTransferFailed"), message: response.order[i].message });
            }

          }
          else {
            Notification.error({title: tr("orderTransferFailed"), message: response.order.message });
          }
        }

      });
    }


    /*
    transferSection.find('.transfer-button').click(function() {
      
      var orderNumberForTranfer = _this.options.message.orderids[0].orderId; //leka
      var receiverCustomerNumber = transferSection.find('.receiver-customer-number').val();
      var orderCancelSourceTransfer = transferSection.find('.order-cancel-source').val();

        // check that reason and type are checked  
      if ( orderCancelSourceTransfer === 'empty' ) {
                Notification.error({
                  title: tr("widgetOrderCancelFailed"),
                  message: tr("widgetOrderCancelReasonException"),
                  container: $("body")
                });

                return false;
      }

      var orderObject = {
        orderNumber: orderNumberForTranfer,
        receiverCustomerNumber: receiverCustomerNumber,
        orderCancelSourceTransfer: orderCancelSourceTransfer
      }
      
      DP.execute({type:"apiOrder", method:"transferOrder", params: orderObject}).then(function(response) {
        if (response.message === 'Successful') {
          customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);
          Notification.success({
            title: tr("orderTransferSuccess"),
            message: tr("orderTransferSuccess"),
            container: $("body")
          });


          jRoot.dialog("close");
          
        }

        else {
          Notification.error({title: tr("orderTransferFailed"), message: response.order.message});
        }

      });


    });
    */

  $('#datepicker').on('change', function() {

    var orderNumberDates = _this.options.message.orderids;
    var mydigiCancelId = null;
    if (typeof _this.options.message.mydigi !== "undefined" ) {
      mydigiCancelId = _this.options.message.mydigi;
    }

    for (var i = 0; i < orderNumberDates.length; i++) {

      var cancelChangeDate = moment(jRoot.find("#datepicker").datepicker("getDate")).format('YYYY-MM-DD');

      if (moment(cancelChangeDate).isBefore(orderNumberDates[i].orderStartDate) ) {
       
        $("#orderrow"+orderNumberDates[i].orderId).addClass('hidden-order-cancel-row');
      }

      else if(moment(cancelChangeDate).isAfter(orderNumberDates[i].orderEndDate)  && mydigiCancelId != null ) {
        
        $("#orderrow"+orderNumberDates[i].orderId).addClass('hidden-order-cancel-row');
      }

      else {
        $("#orderrow"+orderNumberDates[i].orderId).removeClass('hidden-order-cancel-row');
      }

    }
    

  });
      var selectedProduct = null;
      var earliestIssuePublishDate;
      var mydigiCustomerId;

      populateProductSelect();

      function populateProductSelect() {
        if (typeof customerServiceWidgetManager.activeMyDigiCustomer !== "undefined" && customerServiceWidgetManager.activeMyDigiCustomer.id !== null ) {
          mydigiCustomerId = customerServiceWidgetManager.activeMyDigiCustomer.id;
        }

        var $postDeliveryTab = $('#post-delivery-tab');

        console.log("_this.options", _this.options);

        var lekaFormat = !!_this.options.orderData.productCode;

        console.log("lekaFormat", lekaFormat);

        var printOrderArray = [];

        if(!lekaFormat) {
          for (var i = 0; i < _this.options.orderData.orders.length; i++) {
            var order = _this.options.orderData.orders[i];
            if(order.productType === "Printti" && moment(order.orderEndDate).isAfter(moment())) {
              printOrderArray.push(order);
            }
          }
        }

        if(!lekaFormat && printOrderArray.length > 1) {
          var select = "<div class='smart-form' style='margin-bottom: 5px;'>" +
            "<section>" +
            "<label for='postDeliverySelectProduct'>" + tr("selectProductName") + "</label>" +
            "<div class='select'>" +
            "<select name='postDeliverySelectProduct' id='postDeliverySelectProduct'>" +
            "<option disabled='disabled' selected='selected'>" + tr("selectProductName") + "</option>";

          for (var i = 0; i < printOrderArray.length; i++) {
            var order = printOrderArray[i];
            select += "<option value='" + order.productCode + "'>" + order.productCode + "</option>";
          }

          select += "</select></div></section></div>";

          $postDeliveryTab.append(select);
        }

        $postDeliveryTab.append($('<div id="post-delivery-table">').css({'marginBottom': '5px'}));
        $postDeliveryTab.append($("<div class='smart-form'>" +
          "<label class='toggle'>" +
          "<input type='checkbox' name='post-delivery-urgent' id='post-delivery-urgent' checked='checked' />"+
          tr("postDeliveryOrderIsUrgent")+
          "<i data-swchon-text='"+tr("yes")+"' data-swchoff-text='"+tr("no")+"'></i>" +
          "</label></div>"));
        $postDeliveryTab.append($("<div class='text-center'>" +
          "<button id='post-delivery-older' class='btn btn-default' style='display:none;margin:5px 10px;'>"+tr('showOlderIssues')+"</button>" +
          "<button id='post-delivery-submit' class='btn btn-primary' style='display:none;margin:5px 10px;'>"+tr('makeOrder')+"</button>" +
          "</div>"));

        if (!lekaFormat && printOrderArray.length > 1) {
          $('#postDeliverySelectProduct').change(function() {
            selectedProduct = $(this).val();
            populateProductIssueTable(selectedProduct, true);
          });
        } else if (!lekaFormat && printOrderArray.length === 1) {
          selectedProduct = printOrderArray[0].productCode;
          populateProductIssueTable(selectedProduct, true);
        } else {
          selectedProduct = _this.options.orderData.productCode;
          populateProductIssueTable(selectedProduct, true);
        }

        $('#post-delivery-older').on('click', function(e) {
          e.preventDefault();

          DP.execute({type: "product", method: "getPublishingSchedule", params: {
            prev: 10,
            next: 0,
            now: earliestIssuePublishDate.unix(),
            productCode: selectedProduct
          }}).then(function(response) {
            makeTable(response.publishingSchedule);
          });
        });

        $('#post-delivery-submit').click(function() {
          var selected = [];

          $('#post-delivery-table').find('input').each(function () {
            var that = $(this);

            if(that.prop('checked')) {
              selected.push(that.parent().parent().parent().data('publishingSchedule'));
            }
          });

          if(selected.length > 0) {
            var orderNumber,
            customerNumber = _this.options.customerId;

            var isUrgent = $('#post-delivery-urgent').prop('checked');

            if(lekaFormat) {
              orderNumber = _this.options.orderData.orderNumber;
            } else {
              var trimmedNeedle = $.trim(selected[0].productCode);
              for (var j = 0; j < printOrderArray.length; j++) {
                var order = _this.options.orderData.orders[j];

                if(order.productCode == trimmedNeedle) {
                  orderNumber = order.orderNumber;
                  break;
                }
              }

              if(!orderNumber) {
                console.log("order number not found, this is bug");
              }
            }

            doConfirm(selected, customerNumber, mydigiCustomerId, orderNumber, isUrgent);
          }
        });
      }

      var reloadable;

      function doConfirm(issues, customerNumber, mydigiCustomerId, orderNumber, isUrgent) {
        var confirm = window.confirm(tr("resendConfirm"));
        if(confirm) {
          reloadable = true;
          for (var i = 0; i < issues.length; i++) {
            var issue = issues[i];

            doSend({
              customerNumber: customerNumber,
              mydigiCustomerId: mydigiCustomerId,
              orderNumber: orderNumber,
              productCode: issue.productCode,
              publishingNumber: issue.publishingNumber,
              publishingYear: issue.publishingYear,
              emailNotification: isUrgent
            });
          }
        }
      }

      function clearCheckboxes() {
        $('#post-delivery-table').find('input').each(function () {
          $(this).prop('checked', false);
        });
      }

      function doSend(params) {
        console.log("postDelivery: %o", params);
        DP.execute({type:"product", method:"postDeliveryAdd", params: params}).then(function(response) {
          if (response.code === 0) {
            Notification.success({
              title: tr("resendSuccess"),
              message: tr("resendSuccess"),
              container: $("body")
            });
            if(reloadable) {
              clearCheckboxes();
              customerServiceWidgetManager.postDeliveryWidget.reload();
              jRoot.dialog("close");
              reloadable = false;
            }
          } else {
            Notification.error({
              title: tr("resendFailed"),
              message: response.error.cause,
              container: $("body")
            });
          }
        });
      }

      function populateProductIssueTable(productCode, isFirstTime) {
        console.log("populateProductIssueTable", productCode, isFirstTime);
        var $tableDiv = $('#post-delivery-table');

        if(isFirstTime) {
          var table = $(
            "<table class='table'>" +
            "<thead>" +
            "<tr>" +
            "<th>&nbsp;</th>" +
            "<th>" + tr("issue") + "</th>" +
            "<th>" + tr("publishingDate") + "</th>" +
            "<th>" + tr("labelDate") + "</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>" +
            "</table>"
          );

          $tableDiv.html(table);

          $('#post-delivery-older').show();
          $('#post-delivery-submit').show();
        }

        selectedProduct = productCode;
        $tableDiv.find('tbody').html('');

        DP.execute({type: "product", method: "getPublishingSchedule", params: {
          prev: 8,
          next: 2,
          productCode: selectedProduct
        }}).then(function(response) {
          makeTable(response.publishingSchedule);
        });
      }

      function makeTable(publishingSchedules) {
        var $tbody = $('#post-delivery-table').find('tbody');

        for (var i = 0; i < publishingSchedules.length; i++) {
          var publishingSchedule = publishingSchedules[i];

          if(i === publishingSchedules.length - 1) {
            earliestIssuePublishDate = moment(publishingSchedule.publishingDate);
            console.log("earliestIssuePublishDate ", earliestIssuePublishDate.format('D.M.YYYY'));
          }

          var name = 'resend-' + this.selectedProduct + '-' +publishingSchedule.publishingNumber +'-' + publishingSchedule.publishingYear;

          $tbody.append($(
            '<tr class="label-row">' +
            '<td class="text-center"><label for="' + name + '"><input type="checkbox" name="'+ name +'" id="'+ name +'" /></label></td>' +
            '<td><label for="' + name + '">' + publishingSchedule.publishingNumber +'/' + publishingSchedule.publishingYear +'</label></td>' +
            '<td><label for="' + name + '">' + moment(publishingSchedule.publishingDate).format('D.M.YYYY') +'</label></td>' +
            '<td><label for="' + name + '">' + moment(publishingSchedule.labelDate).format('D.M.YYYY') +'</label></td>' +
            '</tr>'
          ).data('publishingSchedule', publishingSchedule));
        }
      }

  var tabs = [];

  if (typeof _this.options.cancelTab !== "undefined" && _this.options.cancelTab) {
    tabs.push({title: tr("orderCancellationText")});
    if (typeof _this.options.message.myDigiSalesMethod == "string" &&
        _this.options.message.myDigiSalesMethod.toLowerCase() == "kortti" &&
        _this.options.message.myDigiLekaStartDate != "0") {
      cancelSection.find('.cancel-form-operations').hide();
      cancelSection.find('.recurring-cancel-operations').removeClass('hidden');


      cancelSection.find('.offer-period-length').html(_this.options.message.myDigiPackageCreditBillPeriod);
      cancelSection.find('.offer-end-date').html(getPeriodEnd(
        _this.options.message.myDigiLekaStartDate,
        _this.options.message.myDigiPackageCreditBillPeriod,
        _this.options.message.myDigiPackageCreditOfferPeriodCount));
      cancelSection.find('.order-last-day').html(getPeriodEnd(
        _this.options.message.myDigiLekaStartDate,
        _this.options.message.myDigiPackageCreditBillPeriod, 1, true));

      cancelSection.find(".offer-periods > select").change(function() {
        cancelSection.find('.order-last-day').html(getPeriodEnd(
          _this.options.message.myDigiLekaStartDate,
          _this.options.message.myDigiPackageCreditBillPeriod,
          parseInt($(this).val()), true));
      });
    }
  }
  if (typeof _this.options.reviveTab !== "undefined" && _this.options.reviveTab) {
    tabs.push({title: tr("orderRevival")});

    // Verify that renewing orders meet the minimum months of validity
    for (i = 0; i < _this.options.message.orderids.length; i++) {
      if (typeof _this.options.message.orderids[i].orderType !== "undefined" &&
          _this.options.message.orderids[i].orderType === "M" &&
          typeof _this.options.message.orderids[i].orderEndDate !== "undefined" &&
          moment().add(uncancel_min_months, "months").isAfter(_this.options.message.orderids[i].orderEndDate)) {
        // Disable inputs, display warning text
        reviveSection.find("#postShipments").attr("disabled", true).parent().addClass("state-disabled");
        reviveSection.find('.revival-btn').addClass("disabled");
        reviveSection.find('.revival-warning').removeClass("hidden");
        break;
      }
    }
  }
  if (typeof _this.options.breakTab !== "undefined" && _this.options.breakTab) {
    tabs.push({title: tr("orderPause")});

    // Verify that the order is not paid by card
    if (typeof _this.options.message.myDigiSalesMethod == "string" &&
        _this.options.message.myDigiSalesMethod.toLowerCase() == "kortti") {
      breakSection.find(".datepicker").attr("disabled", true).parent()
                                .addClass("state-disabled").removeClass("mandatory");
      breakSection.find('select').attr("disabled", true).parent().addClass("state-disabled");
      breakSection.find('.break-order-button').addClass("disabled");
      breakSection.find('.break-warning').removeClass("hidden");
    }
  }
  if (typeof _this.options.transferTab !== "undefined" && _this.options.transferTab) {
    tabs.push({title: tr("orderTransfer")});

    // Verify that the order is not paid by card
    if (typeof _this.options.message.myDigiSalesMethod == "string" &&
        _this.options.message.myDigiSalesMethod.toLowerCase() == "kortti") {
        transferSection.find('.receiver-customer-number').attr("disabled", true).parent()
          .addClass("state-disabled");
        transferSection.find('.searchButton').attr("disabled", true).parent()
          .addClass("state-disabled"); 
        transferSection.find('.break-warning').removeClass("hidden");
    }
  }

      if(typeof _this.options.postDeliveryTab !== "undefined" && _this.options.postDeliveryTab) {
        tabs.push({title: "Jälkitoimitus"});
      }


    jRoot.dialog({minWidth: 750, minHeight: 500,
      //title: "Tilauksen peruutus",
      title: "Tilaustoiminnot",
      buttons: null, 
      tabs: tabs});


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

        var containsPrintProduct = false;

        if(options.orderData.productType && options.orderData.productType === "Printti") {
          containsPrintProduct = true;
        } else if(options.orderData.orders) {
          for (var i = 0; i < options.orderData.orders.length; i++) {
            var order = options.orderData.orders[i];
            if(order.productType === "Printti" && moment(order.orderEndDate).isAfter(moment())) {
              containsPrintProduct = true;
              break;
            }
          }
        } else {
          console.log("No leka or mydigi formatted products found D:", options.orderData);
        }

        // Show the right set of tabs
        options.cancelTab = options.breakTab = options.transferTab = true;
        options.reviveTab = false;
        options.postDeliveryTab = containsPrintProduct;
        if (typeof options.message.orderStatus !== "undefined") {
          switch (options.message.orderStatus) {
            case "cancelled":
              options.transferTab = false;
              options.reviveTab = true;
              break;
            case "onbreak":
              options.breakTab = options.transferTab = false;
              options.cancelTab = true;
              break;
            default:
              break;
          }
        }

        options.message.text = "";
        for (i = 0; i < options.message.rows.length; i++){
          options.message.text += options.message.rows[i];
        }

        return WidgetConfirmDialog.create({options: options}).appendTo($("body"));
     }
    }
});
