define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment', 'viivaNotification', 'viivaGraphSettings',
    'smartAdmin', 'ember', 'dialogManager', 'customerServiceLekaJumper', 'underscore'],
  function ($, jui, DP, util, tr, moment, Notification, viivaGraph, viivaGraphSettings, Ember, DialogManager, LekaJumper, underscore) {

    return function () {
      this.settings = new Object();
      this.destroyed = false;

      this.loadData = function (customerId) {
        var _this = this;

        var mydigiCustomerId = null;

        if (typeof customerServiceWidgetManager.activeMyDigiCustomer !== "undefined" && customerServiceWidgetManager.activeMyDigiCustomer.id !== null) {
          mydigiCustomerId = customerServiceWidgetManager.activeMyDigiCustomer.id;
        }

        var data = {
          id: customerId,
          mydigiCustomerId: mydigiCustomerId
        };

        // load the orders first time
        DP.execute({type: "apiOrder", method: "getOrders", params: data}).then(function (response) {

          if (document.getElementById("jarviswidget-fullscreen-mode")) {
            setTimeout(function () {
              $('.orders-fullscreen-column').removeClass('hidden');
              $('.orders-fullscreen-row').removeClass('hidden');
            }, 10);
          }

          if (_.isEmpty(response.orders)) {
            _this.bindEvents();
          } else {
            _this.populateOrderInformation(response);
          }
        });
      };

      this.populateOrderInformation = function (response) {
        var _this = this;
        var customerOrders = response.orders;

        var $customerOrdersTable = $('#customer-orders-table');
        $customerOrdersTable.find('tr').remove();
        $customerOrdersTable.append("<tr><th></th><th>" + tr("widgetProduct") + "</th>" +
          "<th>" + tr("widgetPayer") + "</th>" +
          "<th>" + tr("widgetSeason") + "</th>" +
          "<th>" + tr("widgetOrderType") + "</th>" +
          "<th>" + tr("widgetOrderNo") + "</th>" +
          "<th class='orders-price-column'>" + tr("widgetPrice") + "</th>" +
          "<th>" + tr("widgetAlreadyPaid") + "</th>" +
          "<th title='" + tr("widgetNumsLarge") + "'>" + tr("widgetNums") + "</th>" +
          "<th>" + tr("widgetInvoicingPhase") + "</th>" +
          "<th class='orders-fullscreen-column hidden'>" + tr("widgetOfferNumber") + "</th>" +
          "<th class='orders-fullscreen-column hidden'>" + tr("widgetOT") + "</th>" +
          "<th class='orders-fullscreen-column hidden'>" + tr("widgetSalesPerson") + "</th>" +
          "<th class='orders-fullscreen-column hidden'>" + tr("widgetArchivingNumber") + "</th>" +
          "<th class='orders-fullscreen-column hidden'>" + tr("widgetSaveDate") + "</th>" +
          "<th class='orders-fullscreen-column hidden'>" + tr("widgetPeriodNumber") + "</th>" +
          "<th class='orders-fullscreen-column hidden'>" + tr("widgetStart") + "</th>" +
          "<th class='orders-fullscreen-column hidden'>" + tr("widgetDeliveryMethod") + "</th>" +
          "</tr>");

        if (response.message === 'Failed') {
          $customerOrdersTable.append("<tr><td colspan='100%'>" + response.orders.message + "</td></tr>");
        } else {
          if (customerOrders.leka.length !== 0) {
            var resultsInPeriod = 0;
            for (var i = 0; i < customerOrders.leka.length; i++) {
              var type, reason;

              if (customerOrders.leka[i].cancellationReason == " " || customerOrders.leka[i].cancellationReason === null) {
                reason = "widgetEmpty";
              } else {
                reason = "widget" + customerOrders.leka[i].cancellationReason;
              }

              if (!customerOrders.leka[i].cancellationType || customerOrders.leka[i].cancellationType === null) {
                type = "widgetEmpty";
              } else {
                type = "widget" + customerOrders.leka[i].cancellationType;
              }

              var orderPrice = customerOrders.leka[i].orderPrice - customerOrders.leka[i].orderBonus;
              var paidAmount = customerOrders.leka[i].orderPaidAmount.toFixed(2);

              customerOrders.leka[i] = characterReplacer.replaceCharacters(customerOrders.leka[i]);

              var orderStartDate = customerOrders.leka[i].orderStartDate;
              var orderEndDate = customerOrders.leka[i].orderEndDate;
              var orderProcessingDate = customerOrders.leka[i].orderProcessingDate;
              var orderSalesMethod = customerOrders.leka[i].salesMethod;
              var orderDeliveryType = customerOrders.leka[i].deliveryType;
              var orderStatus = "";

              var statusLight = "red";

              if (orderStartDate !== characterReplacer.replaceCharacter) {
                orderStartDate = moment(orderStartDate).format('DD.MM.YYYY');
              }

              if (orderEndDate !== characterReplacer.replaceCharacter) {
                orderEndDate = moment(orderEndDate).format('DD.MM.YYYY');

                /*
                 This if / else branch is used to determine status of the order

                 paytrouble = maksuhäiriö
                 red = päättynyt
                 yellow = irtisanottu, mutta silti vielä voimassa
                 future = tulevaisuudessa alkava jakso
                 green = meneillään oleva jakso
                 */

                if (customerOrders.leka[i].cancellationType === 'MH') {
                  statusLight = "paytrouble";
                  orderStatus = "suspended"; //Not to confuse with onbreak, suspended implies payment problem
                } else if ((moment().isAfter(customerOrders.leka[i].orderEndDate) && moment().format('YYYY-MM-DD') != customerOrders.leka[i].orderEndDate)) {
                  statusLight = "red";
                  orderStatus = "finished";
                } else if (customerOrders.leka[i].nextSalesMethod === 'E' || customerOrders.leka[i].nextSalesMethod === 'P'
                  || (customerOrders.leka[i].salesMethod === 'M' && customerOrders.leka[i].cancellationType !== "" )) {
                  statusLight = "yellow";
                  orderStatus = "cancelled";
                } else if (moment().isBefore(customerOrders.leka[i].orderStartDate)) {
                  statusLight = "future";
                  orderStatus = "active";
                } else {
                  statusLight = "green";
                  orderStatus = "active";
                }
              }

              if (orderProcessingDate !== characterReplacer.replaceCharacter) {
                orderProcessingDate = moment(orderProcessingDate).format('DD.MM.YYYY');
              }

              /*
               This is used to determine the order's type
               K = kesto
               M = määräaikainen
               T = toistuvaismaksu ( luottokortti )
               */
              if (orderSalesMethod !== characterReplacer.replaceCharacter) {
                if (orderSalesMethod === 'K') {
                  orderSalesMethod = tr("widgetFixed");
                } else if (orderSalesMethod === 'M') {
                  orderSalesMethod = tr("widgetPeriod");
                } else if (orderSalesMethod === 'T') {
                  orderSalesMethod = tr("widgetRecurring");
                }
              }

              if (orderDeliveryType !== characterReplacer.replaceCharacter) {
                if (orderDeliveryType === 'M') {
                  orderDeliveryType = tr("widgetGroundPost");
                } else if (orderDeliveryType === 'L') {
                  orderDeliveryType = tr("widgetAirmail");
                } else if (orderDeliveryType === 'E') {
                  orderDeliveryType = tr("widgetElectric");
                }
              }

              if (orderPrice !== characterReplacer.replaceCharacter) {
                orderPrice = orderPrice.toFixed(2);
              }

              var shouldHideOrderRow = true;

              if (statusLight === 'green' ||
                statusLight === 'future' ||
                statusLight === 'paytrouble' ||
                (statusLight === 'yellow' &&
                  customerOrders.leka[i].cancellationType !== 'TP' )) {
                shouldHideOrderRow = false;
                resultsInPeriod++;
              }

              var invoicePayer = "";

              if (customerOrders.leka[i].invoiceReceiverCustomerNumber !== customerOrders.leka[i].receiverCustomerNumber) {
                invoicePayer = customerOrders.leka[i].invoiceReceiverCustomerNumber;
              }

              var isDimmed = customerOrders.leka[i].invoiceType === "B";

              var row = $("<tr class='" + (shouldHideOrderRow ? "orders-fullscreen-row hidden" : "") + " " + (isDimmed ? "tr-dimmed" : "") + "' " +
                "leka-order-status='" + orderStatus + "' " +
                "order-start-date='" + customerOrders.leka[i].orderStartDate + "' " +
                "order-end-date='" + customerOrders.leka[i].orderEndDate + "' " +
                "order-type='" + customerOrders.leka[i].salesMethod + "'>" +
                "<td><div class='traffic-light " + statusLight + "'>" + (statusLight === "paytrouble" ? "<btn class='fa fa-ban' style='color: red; font-size: 1.5em;''></btn>" : " ") + "</div>" +
                "<div class='cancellation'>" +
                "<b>" + tr("widgetDate") + ":</b><br>" +
                "<b>" + tr("widgetCancelPerson") + ":</b><br>" +
                "<b>" + tr("widgetCancelReason") + ":</b> " + tr(reason) + "<br>" +
                "<b>" + tr("widgetChannel") + ":</b>" + tr(type) +
                "</div>" +
                "</td>" +
                "<td>" +
                "<div class='productPublishingSchedule' data-product='" + customerOrders.leka[i].productCode + "' data-productname='" + customerOrders.leka[i].productNameFull + "'><a href=''>" + customerOrders.leka[i].productCode + "</a></div>" +
                //"<a href='http://oiva.ok.root/otavamedia/lehtimyynti/Otavamedialle/Hinnastot%20ja%20ilmestymisaikataulut/Ilmestymisaikataulu%202016.pdf' target='blank' class='blue-underline'>" + customerOrders.leka[i].productCode + "</a>" +
                "</td>" +
                "<td><a href='#' class='changeCustomer'>" + invoicePayer + "</a></td>" +
                "<td>" + orderStartDate + " - " + orderEndDate + "</td>" +
                "<td>" + orderSalesMethod + "</td>" +
                "<td><span class='orderNumber'>" + customerOrders.leka[i].orderNumber + "</span></td>" +
                "<td><span class='orderPriceField'><input type='text' order-number=" + customerOrders.leka[i].orderNumber + " value = " + orderPrice + " style='width:60px'></span><span class='order-price-change-save-btn hidden'><i class='fa fa-save save-price' style='padding:10px'></i><i class='fa fa-close cancel-price-change'></i></span></td>" +
                "<td>" + paidAmount + "</td>" +
                "<td><span class='lekaCustomerJump' leka-operation='postdelivery' data='" + customerOrders.leka[i].orderNumber + "'><a href='##' class='blue-underline'>" + customerOrders.leka[i].orderItemcount + "</a></span></td>" +
                "<td class='small-screen order-control-bar'><a href='#' data='" + customerOrders.leka[i].orderNumber + "' class='blue-underline invoice-payment-information'>" + customerOrders.leka[i].invoicingPhase + "</a></td>" +
                "<td class='orders-fullscreen-column hidden'>" + customerOrders.leka[i].benefitCode + "</td>" +
                "<td class='orders-fullscreen-column hidden'><span class='campaignSubcode'>" + customerOrders.leka[i].campaignSubCode + "</span></td>" +
                "<td class='orders-fullscreen-column hidden'><span class='lekaCustomerJump' leka-operation='salesPerson' data='" + customerOrders.leka[i].salesPersonNumber + "'><a href='###' class='blue-underline leka-jumpper'>" + customerOrders.leka[i].salesPersonNumber + "</a></span></td>" +
                "<td class='orders-fullscreen-column hidden'><span class='archivingNumber'>" + customerOrders.leka[i].archivingNumber + "</span></td>" +
                "<td class='orders-fullscreen-column hidden'><span class='orderProcessingDate'>" + orderProcessingDate + "</span></td>" +
                "<td class='orders-fullscreen-column hidden'><span class='lekaCustomerJump'  leka-operation='paymentEntry' data='" + customerOrders.leka[i].orderNumber + "' data2='" + customerOrders.leka[i].invoiceInstructionNumber + "'><a href='###' class='blue-underline leka-jumpper'>" + customerOrders.leka[i].paymentEntryCount + "</a></span></td>" +
                "<td class='orders-fullscreen-column hidden'><span class='orderStartNumber'>" + customerOrders.leka[i].orderStartNumber + "</span></td>" +
                "<td class='orders-fullscreen-column hidden full-screen order-control-bar'><span class='deliveryType'>" + orderDeliveryType + "</span></td>" +
                "</tr>"
              );

              row.data('orderData', customerOrders.leka[i]);

              $customerOrdersTable.append(row);
            }

            if (resultsInPeriod < 1) {
              $customerOrdersTable.append("<tr><td colspan='100%'>" + tr("widgetNoResultsInPeriod") + "</td></tr>");
            }
          }

          if (customerOrders.mydigi.length !== 0) {

            // clear order area
            $('.mydigi-order-area').text('');

            for (var j = 0; j < customerOrders.mydigi.length; j++) {

              if (customerOrders.mydigi[j].info.orderTime !== characterReplacer.replaceCharacter) {
                customerOrders.mydigi[j].info.orderTime = util.parseDate(customerOrders.mydigi[j].info.orderTime);
              }

              var myDigiOrderStatus = "";

              if (typeof customerOrders.mydigi[j].info.orderStatus !== "undefined" && customerOrders.mydigi[j].info.orderStatus !== null) {
                myDigiOrderStatus = tr(customerOrders.mydigi[j].info.orderStatus);
              }

              $('.mydigi-order-area').append("<div class='mydigi-order' id='mydigipackage" + j + "' tableid='mydigitable" + j + "' mydigi-sales-method='" + customerOrders.mydigi[j].info.paymentMethod + "' mydigi-credit-bill-end-date='" + customerOrders.mydigi[j].info.creditBillPeriodEndDate + "' mydigi-order-id='" + customerOrders.mydigi[j].info.orderId + "' mydigi-order-status='" + customerOrders.mydigi[j].info.orderStatus + "' mydigi-order-leka-start-date='" + customerOrders.mydigi[j].info.lekaStartDate + "' mydigi-package-credit-bill-period='" + customerOrders.mydigi[j].info.packageCreditBillPeriod + "' mydigi-package-credit-offer-period-count='" + customerOrders.mydigi[j].info.packageCreditOfferPeriodCount + "' style='padding:7px; margin-bottom: 15px; background-color: rgb(247, 246, 244);'>" +
                "<header style='background-color: #fff; height:30px;'><strong>" + tr("productTitle", "capitalizefirst") + ":</strong> " + customerOrders.mydigi[j].info.packageName + " " +
                "<strong>" + tr("widgetOrderTime") + ":</strong> " + customerOrders.mydigi[j].info.orderTime + " " +
                "<strong>" + tr("orderPaymentMethod", "capitalizefirst") + ":</strong> " + customerOrders.mydigi[j].info.paymentMethod + " " +
                "<strong>" + tr("widgetOrderStatus") + ":</strong> " + myDigiOrderStatus + " " +
                "<span class='glyphicon glyphicon-cog mydigi-cancel cancel-order glyphicon-control' style='float:right; cursor: pointer;'></span>" +
                "<span class='glyphicon glyphicon-info-sign mydigi-show cancel-order glyphicon-control' title='" + tr("widgetShowMydigi") + "' style='cursor: pointer;float:right'></span>" +
                "</header>" +
                "</div>");

              var $myDigiPackageJ = $("#mydigipackage" + j + "");
              $myDigiPackageJ.data('orderData', customerOrders.mydigi[j]);
              $myDigiPackageJ.append("<table class='table control-table table-hover table-striped' id ='mydigitable" + j + "'></table>");

              customerOrders.mydigi[j].orders = simpleSorter.sortByProperty(customerOrders.mydigi[j].orders, 'productCode', 'asc');

              var myDigiOrderHasVisibleRows = false;

              if (!customerOrders.mydigi[j].orders && (myDigiOrderStatus === 'peruutettu' || myDigiOrderStatus === 'päättynyt')) {
                $myDigiPackageJ.addClass('orders-fullscreen-row');
                $myDigiPackageJ.addClass('hidden');
              }

              for (var k = 0; k < customerOrders.mydigi[j].orders.length; k++) {
                var type, reason;

                if (customerOrders.mydigi[j].orders[k].cancellationReason == " " || customerOrders.mydigi[j].orders[k].cancellationReason === null) {
                  reason = "widgetEmpty";
                } else {
                  reason = "widget" + customerOrders.mydigi[j].orders[k].cancellationReason;
                }

                if (!customerOrders.mydigi[j].orders[k].cancellationType || customerOrders.mydigi[j].orders[k].cancellationType === null) {
                  type = "widgetEmpty";
                } else {
                  type = "widget" + customerOrders.mydigi[j].orders[k].cancellationType;
                }

                var orderPrice = customerOrders.mydigi[j].orders[k].orderPrice - customerOrders.mydigi[j].orders[k].orderBonus;
                var paidAmount = customerOrders.mydigi[j].orders[k].orderPaidAmount.toFixed(2);

                customerOrders.mydigi[j].info = characterReplacer.replaceCharacters(customerOrders.mydigi[j].info);
                customerOrders.mydigi[j].orders[k] = characterReplacer.replaceCharacters(customerOrders.mydigi[j].orders[k]);

                var orderStartDate = customerOrders.mydigi[j].orders[k].orderStartDate;
                var orderEndDate = customerOrders.mydigi[j].orders[k].orderEndDate;
                var orderProcessingDate = customerOrders.mydigi[j].orders[k].orderProcessingDate;
                var orderSalesMethod = customerOrders.mydigi[j].orders[k].salesMethod;
                var orderDeliveryType = customerOrders.mydigi[j].orders[k].deliveryType;

                var statusLight = "red";

                if (orderStartDate !== characterReplacer.replaceCharacter) {
                  orderStartDate = moment(orderStartDate).format('DD.MM.YYYY');
                }

                if (orderEndDate !== characterReplacer.replaceCharacter) {
                  orderEndDate = moment(orderEndDate).format('DD.MM.YYYY');

                  /*
                   This if / else branch is used to determine status of the order

                   paytrouble = maksuhäiriö
                   red = päättynyt
                   yellow = irtisanottu, mutta silti vielä voimassa
                   future = tulevaisuudessa alkava jakso
                   green = meneillään oleva jakso
                   */

                  if (customerOrders.mydigi[j].orders[k].cancellationType === 'MH') {
                    statusLight = "paytrouble";
                  } else if ((moment().isAfter(customerOrders.mydigi[j].orders[k].orderEndDate) && moment().format('YYYY-MM-DD') != customerOrders.mydigi[j].orders[k].orderEndDate)) {
                    statusLight = "red";
                  } else if (customerOrders.mydigi[j].orders[k].nextSalesMethod === 'E' ||
                    customerOrders.mydigi[j].orders[k].nextSalesMethod === 'P' ||
                    customerOrders.mydigi[j].orders[k].salesMethod === 'M' &&
                    customerOrders.mydigi[j].orders[k].cancellationType !== "" ||
                    customerOrders.mydigi[j].info.orderStatus === 'cancelled' &&
                    moment().isBefore(customerOrders.mydigi[j].orders[k].orderEndDate)) {
                    statusLight = "yellow";
                  } else if (moment().isBefore(customerOrders.mydigi[j].orders[k].orderStartDate)) {
                    statusLight = "future";
                  } else {
                    statusLight = "green";
                  }
                }

                if (orderProcessingDate !== characterReplacer.replaceCharacter) {
                  orderProcessingDate = moment(orderProcessingDate).format('DD.MM.YYYY');
                }

                if (orderSalesMethod !== characterReplacer.replaceCharacter) {
                  if (orderSalesMethod === 'K') {
                    orderSalesMethod = tr("widgetFixed");
                  } else if (orderSalesMethod === 'M') {
                    orderSalesMethod = tr("widgetPeriod");
                  } else if (orderSalesMethod === 'T') {
                    orderSalesMethod = tr("widgetRecurring");
                  }
                }

                if (orderDeliveryType !== characterReplacer.replaceCharacter) {
                  if (orderDeliveryType === 'M') {
                    orderDeliveryType = tr("widgetGroundPost");
                  } else if (orderDeliveryType === 'L') {
                    orderDeliveryType = tr("widgetAirmail");
                  } else if (orderDeliveryType === 'E') {
                    orderDeliveryType = tr("widgetElectric");
                  }
                }

                if (orderPrice !== characterReplacer.replaceCharacter) {
                  orderPrice = orderPrice.toFixed(2);
                }

                var cancelTime = " ";
                if ((util.parseDate(customerOrders.mydigi[j].info.orderCancelTime) !== null )) {
                  cancelTime = util.parseDate(customerOrders.mydigi[j].info.orderCancelTime);
                }

                /*
                 Hidden order rows are only displayed in full screen view
                 */
                var shouldHideOrderRow = false;

                if (orderEndDate !== characterReplacer.replaceCharacter && ( statusLight === 'red' )) {
                  shouldHideOrderRow = true;
                } else {
                  myDigiOrderHasVisibleRows = true;
                }

                var orderCancelUser = "";
                if (typeof customerOrders.mydigi[j].info.orderCancelUser !== "undefined") {
                  orderCancelUser = customerOrders.mydigi[j].info.orderCancelUser;
                }

                var invoicePayer = "";
                if (customerOrders.mydigi[j].orders[k].receiverCustomerNumber !== customerOrders.mydigi[j].orders[k].invoiceReceiverCustomerNumber) {
                  invoicePayer = customerOrders.mydigi[j].orders[k].invoiceReceiverCustomerNumber;
                }

                var isDimmed = (customerOrders.mydigi[j].orders[k].invoiceType === "B");

                $("#mydigitable" + j).append("<tr class='" + (shouldHideOrderRow ? "orders-fullscreen-row hidden" : "  ") + " " + (isDimmed ? "tr-dimmed" : "") + "' status=" + statusLight + " dialog-start-date=" + customerOrders.mydigi[j].orders[k].orderStartDate + " dialog-end-date=" + customerOrders.mydigi[j].orders[k].orderEndDate + " >" +
                  "<td><div class='traffic-light " + statusLight + "'>" + (statusLight === "paytrouble" ? "<btn class='fa fa-ban' style='color: red; font-size: 1.5em;''></btn>" : " ") + "</div>" +
                  "<div class='cancellation'>" +
                  "<b>" + tr("widgetDate") + ":</b> " + cancelTime + "<br>" +
                  "<b>" + tr("widgetCancelPerson") + ":</b> " + orderCancelUser + "<br>" +
                  "<b>" + tr("widgetCancelReason") + ":</b> " + tr(reason) + "<br>" +
                  "<b>" + tr("widgetChannel") + ":</b> " + tr(type) +
                  "</div>" +
                  "</td>" +
                  "<td>" +
                  "<div class='productPublishingSchedule' data-product='" + customerOrders.mydigi[j].orders[k].productCode + "' data-productname='" + customerOrders.mydigi[j].orders[k].productNameFull + "'><a href=''>" + customerOrders.mydigi[j].orders[k].productCode + "</a></div>" +
                  //"<a href='http://oiva.ok.root/otavamedia/lehtimyynti/Otavamedialle/Hinnastot%20ja%20ilmestymisaikataulut/Ilmestymisaikataulu_2015.pdf' target='blank' class='blue-underline'>" + customerOrders.mydigi[j].orders[k].productCode + "</a>" +
                  "</td>" +
                  "<td><a href='#' class='changeCustomer'>" + invoicePayer + "</a></td>" +
                  "<td>" + orderStartDate + " - " + orderEndDate + "</td>" +
                  "<td>" + orderSalesMethod + "</td>" +
                  "<td><span class='orderNumber' cancel-start-date='" + customerOrders.mydigi[j].orders[k].orderStartDate + "' cancel-end-date='" + customerOrders.mydigi[j].orders[k].orderEndDate + "' status='" + statusLight + "' order-type='" + customerOrders.mydigi[j].orders[k].salesMethod + "'>" + customerOrders.mydigi[j].orders[k].orderNumber + "</span></td>" +
                  "<td><span class='mydigiOrderPriceField'><input type='text' order-number=" + customerOrders.mydigi[j].orders[k].orderNumber + " value = " + orderPrice + " style='width:60px'></span><span class='order-price-change-save-btn hidden'><i class='fa fa-save mydigi-save-price' style='padding:10px'></i><i class='fa fa-close cancel-price-change'></i></span></td>" +
                  "<td>" + paidAmount + "</td>" +
                  "<td><span class='lekaCustomerJump' leka-operation='postdelivery' data='" + customerOrders.mydigi[j].orders[k].orderNumber + "'><a href='##' class='blue-underline'>" + customerOrders.mydigi[j].orders[k].orderItemcount + "</a></span></td>" +
                  "<td class='small-screen order-control-bar'><a href='#' data='" + customerOrders.mydigi[j].orders[k].orderNumber + "' class='blue-underline invoice-payment-information'>" + customerOrders.mydigi[j].orders[k].invoicingPhase + "</a></td>" +
                  "<td class='orders-fullscreen-column hidden'>" + customerOrders.mydigi[j].orders[k].benefitCode + "</td>" +
                  "<td class='orders-fullscreen-column hidden'><span class='campaignSubcode'>" + customerOrders.mydigi[j].orders[k].campaignSubCode + "</span></td>" +
                  "<td class='orders-fullscreen-column hidden'><span class='lekaCustomerJump' leka-operation='salesPerson' data='" + customerOrders.mydigi[j].orders[k].salesPersonNumber + "'><a href='###' class='blue-underline leka-jumpper'>" + customerOrders.mydigi[j].orders[k].salesPersonNumber + "</a></span></td>" +
                  "<td class='orders-fullscreen-column hidden'><span class='archivingNumber'>" + customerOrders.mydigi[j].orders[k].archivingNumber + "</span></td>" +
                  "<td class='orders-fullscreen-column hidden'><span class='orderProcessingDate'>" + orderProcessingDate + "</span></td>" +
                  "<td class='orders-fullscreen-column hidden'><span class='lekaCustomerJump'  leka-operation='paymentEntry' data='" + customerOrders.mydigi[j].orders[k].orderNumber + "' data2='" + customerOrders.mydigi[j].orders[k].invoiceInstructionNumber + "'><a href='###' class='blue-underline leka-jumpper'>" + customerOrders.mydigi[j].orders[k].paymentEntryCount + "</a></span></td>" +
                  "<td class='orders-fullscreen-column hidden'><span class='orderStartNumber'>" + customerOrders.mydigi[j].orders[k].orderStartNumber + "</span></td>" +
                  "<td class='orders-fullscreen-column hidden full-screen order-control-bar'><span class='deliveryType'>" + orderDeliveryType + "</span></td>" +
                  "</tr>");

                if (k === customerOrders.mydigi[j].orders.length - 1 && !myDigiOrderHasVisibleRows) {
                  $("#mydigipackage" + j + "").addClass('orders-fullscreen-row hidden');
                }
              }
            }
          }

          var $ordersWidget = $('#ordersWidget');
          $ordersWidget.find('.productPublishingSchedule').hover(
            function() { // mouseover
              var $that = $(this);
              var product = $that.data('product');
              var productName = $that.data('productname');

              var isLoaded = $that.data('isLoaded');

              function appendTableRows(publishingSchedule) {
                var $tbody = $that.find('tbody');

                for (var i = 0; i < publishingSchedule.length; i++) {
                  var issue = publishingSchedule[i];

                  $tbody.append($(
                    "<tr>" +
                    "<td>" + issue.publishingNumber + "/" + issue.publishingYear + "</td>" +
                    "<td>" + moment(issue.publishingDate).format('D.M.YYYY') + "</td>" +
                    "<td>" + moment(issue.labelDate).format('D.M.YYYY') + "</td>" +
                    "</tr>"
                  ));
                }
              }

              if(isLoaded != undefined) {
                $that.find('.order-tooltip').show();
              } else {
                $that.data('isLoaded', true);
                $that.append(
                  "<div class='order-tooltip'>" +
                  "<h4>" + tr('productPublishingSchedule').replace('_PRODUCT_', productName) + "</h4>" +
                  "<table class='table' style='display:none;'>" +
                  "<thead>" +
                  "<tr>" +
                  "<th>" + tr("issue") + "</th>" +
                  "<th>" + tr("publishingDate") + "</th>" +
                  "<th>" + tr("labelDate") + "</th>" +
                  "</tr>" +
                  "</thead>" +
                  "<tbody>" +
                  "</tbody>" +
                  "</table>" +
                  "<img src='resources/img/ajax_loader.gif' style='display: block; margin: 10px auto;' />" +
                  "</div>"
                );

                DP.execute({type: "product", method: "getPublishingSchedule", params: {
                  prev: 5,
                  next: 2,
                  productCode: product
                }})
                  .then(function(response) {
                    appendTableRows(response.publishingSchedule);

                    $that.find('table').show();
                    $that.find('img').hide();
                  });
              }
            },
            function() { // mouseout
              var $that = $(this);
              $that.find('.order-tooltip').hide();
            }
          );

          $ordersWidget.find('.productPublishingSchedule a').click(function (e) {
            e.preventDefault();

            DialogManager.create({
              type: "CustomerServicePublishingScheduleBrowserDialog",
              id: "publishingschedule",
              product: $(this).parent().data('product'),
              productName: $(this).parent().data('productname')
            });
          });

          // cancellation bar
          $customerOrdersTable.find('.order-control-bar').each(function() {
            var that = $(this);

            if(!that.closest('tr').hasClass('tr-dimmed')) {
            that.append(
              "<div class='controls'>" +
              "<a href='' class='control-button'>" +
              "<span class='glyphicon glyphicon-cog cancel-order glyphicon-control'></span>" +
              "</a>" +
              "</div>");
            }
          });

          // LEKA ONLY cancels
          $('.control-button .cancel-order').on('click', function (e) {
            e.preventDefault();
            var $closestTr = $(this).closest('tr');
            var orderNumber = $closestTr.find('td:first').text();
            var orderRow = [$closestTr[0].innerHTML];
            var orderNumbers = [];

            var orderToCancel = {
              orderId: $closestTr.find('.orderNumber').text(),
              orderType: $closestTr.attr("order-type"),
              orderStartDate: $closestTr.attr("order-start-date"),
              orderEndDate: $closestTr.attr("order-end-date")
            };

            orderNumbers.push(orderToCancel);

            var message = {
              rows: orderRow,
              orderids: orderNumbers,
              orderStatus: $closestTr.attr("leka-order-status")
            };

            DialogManager.create({
              type: "CustomerServiceOrderCancelDialog",
              id: "confirm",
              message: message,
              orderData: $closestTr.data('orderData'),
              customerId: customerServiceWidgetManager.activeCustomer.customerNumber
            });
          });

          $('.save-price').click(function () {
            var updateOrderNumber = $(this).closest('td').find('input').attr('order-number');
            var updateOrderPrice = $(this).closest('td').find('input').first().val();
            var updatedOrder = {
              orderNumber: updateOrderNumber,
              orderPrice: updateOrderPrice
            };

            DP.execute({type: "apiOrder", method: "updateOrderPrice", params: updatedOrder}).then(function (response) {
              if (response.message === 'Successful') {
                customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);

                Notification.success({
                  title: tr("orderPriceUpdateSuccess"),
                  message: tr("orderPriceUpdateSuccess"),
                  container: $("body")
                });
              } else {
                Notification.error({title: tr("orderPriceUpdateFail"), message: response.order.message});
              }
            });
          });

          $('.mydigi-save-price').click(function () {
            var updateOrderNumber = $(this).closest('td').find('input').attr('order-number');
            var updateOrderPrice = $(this).closest('td').find('input').first().val();
            var updatedOrder = {
              orderNumber: updateOrderNumber,
              orderPrice: updateOrderPrice
            };

            DP.execute({type: "apiOrder", method: "updateOrderPrice", params: updatedOrder}).then(function (response) {
              if (response.message === 'Successful') {
                customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);

                Notification.success({
                  title: tr("orderPriceUpdateSuccess"),
                  message: tr("orderPriceUpdateSuccess"),
                  container: $("body")
                });

              } else {
                Notification.error({title: tr("orderPriceUpdateFail"), message: response.order.message});
              }
            });
          });

          $('.cancel-price-change').click(function () {
            customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);
          });

          // Mydigi AND LEKA
          $('.mydigi-show').click(function () {
            var dialogOption = {type: "OrderDialog", id: $(this).parent().parent().attr('mydigi-order-id')};
            DialogManager.create(dialogOption);
          });

          $('.invoice-payment-information').click(function () {
            event.preventDefault();
            var message = {
              id: $(this).attr('data')
            };
            var invoicePaymentDialog = {type: "CustomerServiceInvoicePaymentDialog", id: "payments", message: message};
            DialogManager.create(invoicePaymentDialog);
          });

          $('.mydigi-cancel').click(function () {
            var orderRow = [];
            var parentParent = $(this).parent().parent();
            var packageDiv = parentParent.attr('id');
            var packageTable = parentParent.attr('tableid');
            var myDigiOrderId = parentParent.attr('mydigi-order-id');
            var myDigiSalesMethod = parentParent.attr('mydigi-sales-method');
            var myDigiLekaStartDate = parentParent.attr('mydigi-order-leka-start-date');
            var myDigiPackageCreditBillPeriod = parseInt(parentParent.attr('mydigi-package-credit-bill-period'));
            var myDigiPackageCreditOfferPeriodCount = parseInt(parentParent.attr('mydigi-package-credit-offer-period-count'));
            var creditBillPeriodEndDate = parentParent.attr('mydigi-credit-bill-end-date');
            var orderNumbers = [];
            var orderStatus = parentParent.attr('mydigi-order-status');

            console.log(packageDiv);
            console.log(packageTable);

            // rows that dialog will display
            $('#' + packageTable).find('tr').each(function () {
              var dialogStartDate = $(this).attr('dialog-start-date');
              var dialogEndDate = $(this).attr('dialog-end-date');
              var shouldAddRow = $(this).attr('status');
              // row should be cancelled if its status is active, or it's in the future and there are no active orders

              if (shouldAddRow === 'green' ||
                shouldAddRow === 'future' ||
                (shouldAddRow === 'yellow' &&
                  (moment().isAfter(dialogStartDate) &&
                    moment().isBefore(dialogEndDate)))) {
                orderRow.push("<tr>" + $(this).context.innerHTML + "</tr>");
              }
            });

            // array that holds order numbers and dates
            $('#' + packageDiv).find('.orderNumber').each(function () {
              // cancel only orders that are on-going
              var shouldCancelOrder = $(this).attr('status');
              var orderCancelStartDate = $(this).attr('cancel-start-date');
              var orderCancelEndDate = $(this).attr('cancel-end-date');
              var orderType = $(this).attr('order-type');

              if (shouldCancelOrder === 'green' ||
                shouldCancelOrder === 'future' ||
                (shouldCancelOrder === 'yellow' &&
                  (moment().isAfter(orderCancelStartDate) && moment().isBefore(orderCancelEndDate)))) {
                var orderToCancel = {
                  orderId: this.innerHTML,
                  orderType: orderType,
                  orderStartDate: orderCancelStartDate,
                  orderEndDate: orderCancelEndDate
                };

                orderNumbers.push(orderToCancel);
              }
            });

            var hasCurrentOrders = true;
            if ($('#' + packageDiv).find('tr[status=green]').length === 0) {
              hasCurrentOrders = false;
            }

            var message = {
              rows: orderRow,
              hasCurrentOrders: hasCurrentOrders,
              orderids: orderNumbers,
              mydigi: myDigiOrderId,
              myDigiSalesMethod: myDigiSalesMethod,
              myDigiLekaStartDate: myDigiLekaStartDate,
              myDigiPackageCreditBillPeriod: myDigiPackageCreditBillPeriod,
              myDigiPackageCreditOfferPeriodCount: myDigiPackageCreditOfferPeriodCount,
              creditBillPeriodEndDate: util.parseDate(creditBillPeriodEndDate),
              orderStatus: orderStatus
            };

            DialogManager.create({
              type: "CustomerServiceOrderCancelDialog",
              id: "confirm",
              message: message,
              orderData: parentParent.data('orderData'),
              customerId: customerServiceWidgetManager.activeCustomer.customerNumber
            });
          });
        }

        _this.bindEvents();
      };

      this.bindEvents = function () {
        var _this = this;

        // leka jumper. jumps to a screen in link
        $('.lekaCustomerJump').on('click', function (event) {
          event.preventDefault();

          if ($(this).attr('leka-operation') === 'paymentEntry') {
            LekaJumper.jumpToLeka($(this).attr('leka-operation'), $(this).attr('data'), $(this).attr('data2'));
          } else {
            LekaJumper.jumpToLeka($(this).attr('leka-operation'), $(this).attr('data'));
          }
        });

        $('#ordersWidget').on('click', 'a.changeCustomer', function (event) {
          event.preventDefault();
          App.Router.router.transitionTo('customerService', $(this).text());
        });

        // new order click
        var $orders = $('#orders');

        $orders.find('.normal-order').on('click', function () {
          // check that customer has a valid email
          if (util.validateEmail(customerServiceWidgetManager.activeCustomer.email)) {
            DialogManager.create({type: "CustomerServiceOrderDialog", id: "apiOrder"});
          } else {
            Notification.warn({
              title: tr("emailMissing"),
              message: tr("emailMissingText"),
              container: $("body")
            });
          }
        });

        // new order click
        $orders.find('.secret-order').on('click', function () {
          var secretMessage = {
            view: "customer"
          };

          DialogManager.create({type: "CustomerServiceSecretOrderDialog", id: "orderSala", message: secretMessage});
        });

        $orders.on('click', function (event) {
          if (document.getElementById("jarviswidget-fullscreen-mode")) {
            $('.orders-fullscreen-column').removeClass('hidden');
            $('.orders-fullscreen-row').removeClass('hidden');
            $('.small-screen .controls').addClass('hidden');
            $('.full-screen .controls').removeClass('hidden');
            setTimeout(function () {
              $('.ui-dialog').css('z-index', '100000');
            }, 100);
          } else {
            $('.orders-fullscreen-column').addClass('hidden');
            $('.orders-fullscreen-row').addClass('hidden');
            $('.small-screen .controls').removeClass('hidden');
            $('.full-screen .controls').addClass('hidden');
          }
        });

        $orders.find('input').on('input', function () {
          console.log($(this).parent().next().removeClass('hidden'));
        });

        $('#orders-cancelbutton').click(function () {
          $orders.find('input').removeClass('modified-green');
          $('.orders-footer').addClass('hidden');

          _this.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);
        });
      };

      this.create = function (insideElement) {

        this.view = $("<div class='jarviswidget jarviswidget-color-blueDark' data-widget-deletebutton='false' " +
          "data-widget-colorbutton='false' data-widget-editbutton='false' data-widget-togglebutton='false' id='orders'>" +
          "<header>" +
          "<h2>Tilaukset</h2> " +
          "<div class='widget-toolbar'> " +
          "<btn class='btn secret-order btn-xs'><i class='fa fa-wrench'></i></btn>" +
          "<btn class='btn normal-order btn-xs'><i class='fa fa-plus'></i></btn>" +

          "</div>" +
          "</header>" +
          "<!-- widget div-->" +
          "<div class='widget-body' id='ordersWidget'>" +
          "<!-- widget edit box -->" +
          "<table class='table control-table table-striped table-hover' style='padding-left: 4px' id='customer-orders-table'>" +
          "<thead>" +
          "</thead>" +
          "<tbody>" +
          "</tbody>" +
          "</table><br><br>" +
          "<div class='mydigi-order-area'></div>" +
          "<div class='clearfix'></div>" +
          "<div class='eliteWidget orders-footer hidden text-right'>" +
          "<div><span>" + tr("widgetSaveChanges") + "</span>" +
          "<span><button type='button' class='btn btn-success btn-large' id='savebutton'>" + tr("save") + "</button></span>" +
          "<span><button type='button' id='orders-cancelbutton' class='btn btn-default btn-large'>" + tr("cancel") + "</button></span></div>" +
          "</div>" +
          "</div>");

        $(insideElement).append(this.view);

        /* Fix weird button click problem */
        // this.settingsView.find('label.btn-sm').css('width', '100px');

        this.domReady = true;
        this.parent = insideElement;

      }; // this.create
    }; // analyticsWidget
  });
