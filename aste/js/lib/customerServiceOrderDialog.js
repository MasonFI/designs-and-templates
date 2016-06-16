define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaTableView',
        'viivaDataTable', 'viivaFormElements', 'viivaNotification', 'viivaDialog', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaTableView, ViivaDataTable, ViivaFormElements, Notification) {
  var dialog = "<section>" +
                 "<div class='row'>" +
                   "<section class='col-xs-9 smart-form package-controls'>" +
                     "<label class='label'>" + tr("package") + "</label>" +
                     "<div class='input'>" +
                       "<i class='fa fa-archive icon-append'></i>" +
                       "<input class='selected-package select-input custom-popover'>" +
                     "</div>" +
                     "<button class='btn btn-default show-package'>" + tr("showPackage") + "</button>" +
                   "</section>" +
                 "</div>" +
                    "<div class='row'>" +
                   "<div class='col-xs-9 smart-form package-controls'>" +
                   "<section class='col-xs-9 smart-form'>" +
                   "<label class='toggle' for='emailNotificationBox'>" +
                   "{{input type='checkbox' id='emailNotificationBox' checked=emailNotification}}" + tr("sendConfirmationEmail") +
                   "<i data-swchon-text='" + tr('yes', "capitalizefirst") + "'data-swchoff-text='" +
                   tr("no", "capitalizefirst") + "'></i>" +
                   "</label>" +
                   "</section>" +
                   "<section class='col-xs-9 smart-form'>" +
                   "<label class='toggle'>" +
                           "<input type='checkbox' name='checkbox-toggle' id='enforce-order'>"+tr("widgetUseEnforceCode") +
                           "<i data-swchon-text='"+tr("yes", "capitalizefirst")+"' data-swchoff-text='"+tr("no", "capitalizefirst")+"'></i>" +
                         "</label>"+
                   "</section>" +
                    "<section class='col-xs-9 smart-form new-account hidden'>" +
                   "<label class='toggle'>" +
                           "<input type='checkbox' name='checkbox-toggle' id='new-account-email'>"+tr("widgetSendAccountEmailConfirmation") +
                           "<i data-swchon-text='"+tr("yes", "capitalizefirst")+"' data-swchoff-text='"+tr("no","capitalizefirst")+"'></i>" +
                         "</label>"+
                   "</section>" +
                    "<section class='col-xs-9 smart-form'>" +
                   "<label class='toggle hidden' for=cardPaymentSelectBox>" +
                   "{{input type='checkbox'  id='cardPaymentSelectBox' checked=cardPaymentSelect}} " + tr("orderPaymentMethod") +
                   "<i data-swchon-text='" + tr('widgetOrderCard', "capitalizefirst") + "'data-swchoff-text='" +
                   tr("widgetOrderBill", "capitalizefirst") + "'></i>" +
                   "</label>" +
                   "</section>" +
                    "<section class='col-xs-9 smart-form overpriced hidden'>" +
                  "<div class='note'>Tilaus maksettavissa vain laskulla.</div>"+
                   "</section>" +
                   "</div>" +
                   "</div>" +
                 "<div class='row'>" +
                   "<section class='col-xs-12 smart-form'>" +
                     "<label class='label'>" + tr("offers") + "</label>" +
                     "<div class='offer-list'>" +
                     "</div>" +
                   "</section>" +
                 "</div>" +
               "</section>";

  var ApiOrderDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = _this.$("").addClass("order-dialog");

      if ( typeof customerServiceWidgetManager.activeMyDigiCustomer === "undefined") {
        $('.new-account').removeClass('hidden');
      }


      if (typeof _this.newOrder !== "undefined" && _this.newOrder) {
        jRoot.find(".contact-list").addClass("mandatory");
        jRoot.find(".selected-package").closest(".input").addClass("mandatory");


        var selectedPackageData = null;
        jRoot.find(".selected-package").popover({
          title: tr("selectPackage"), placement: 'bottom', container: 'body', html: true,
          template: "<div class='popover dynamic packages-popover'><div class='arrow'></div>" +
                    "<div class='popover-header'><h3 class='popover-title'></h3>" +
                    "<button class='btn btn-default btn-ms package-filter' data-toggle='dropdown'>" +
                    tr("packageProductFilter") + "</button>" +
                    "<div class='dropdown-menu arrow-box-up package-filter-content'>" +
                    "<div class='package-filter-type'></div><div class='package-filter-group'>" +
                    "</div></div><div class='popover-ctrls'><button class='btn btn-default btn-ms'> " +
                    tr("cancel") + "</button><button class='btn btn-primary btn-ms'>" +
                    tr("select") + "</button></div><div class='clearfix'></div></div>" +
                    "<div class='popover-content'></div></div>",
          content: "<div class='packages-selection'></div>"
        }).on('shown.bs.popover', function () {
          var packagesTable = new ViivaDataTable();
          packagesTable.create({
            container: $(".packages-selection"),
            method: "package.get",
            onProcessing: function(processing) {
              if (processing) {
                $(".packages-popover").css({"height": "450px"});
              }
            },
            colDefs: [
              {name: tr("packageID"), prop: "id", visible: false},
              {name: tr("productGroup"), prop: "group"},
              {name: tr("packageName"), prop: "name"},
              {name: tr("packageMarketingName"), prop: "marketingName"},
              {name: tr("billPeriod"), prop: "paperBillPeriod",
               render: function(data) {return data + " " + tr("months");}},
              {name: tr("packageSalesStart"), prop: "start",
               render: function(data) {return util.parseDate(data);}},
              {name: tr("packageSalesEnd"), prop: "end",
               render: function(data) {return util.parseDate(data);}}
            ],
            onClick: function(row, data) {
              if (row.hasClass("selected")) {
                row.removeClass("selected");
                selectedPackageData = null;
                packagesTable.closeInfo({row: row.get(0)});
              } else {
                var currentSelected = row.siblings("tr.selected");

                if (currentSelected.length > 0) {
                  currentSelected.removeClass("selected");
                  packagesTable.closeInfo({row: currentSelected.get(0)});
                }

                row.addClass("selected");
                var infoID = "packageDetials-" + data.id;
                packagesTable.openInfo({row: row.get(0), html: "<div id='" + infoID + "'></div>",
                                       classes: "package-details"});

                selectedPackageData = DP.execute({type: "package", method: "findOffers", params:
                                                 {package: data.id}});
               // Render an initial view of the package offers and determine if payable with credit card
                selectedPackageData.then(function(offers) {

                  var MAX_TOTAL_PRICE = 50; // euros,  TODO: get from server
                  var info = $(" #" + infoID);

                  if (info.length > 0) { // Make sure the info box hasn't been closed

                    info.empty();
                    var total_sum=0;
                    for (var i=0, offer=null; i < offers.length; i++) {
                      offer = offers[i];

                      // TODO: use updateOfferInfo perhaps
                      if (offer.paperPrice !== null) {

                        info.append("<h4>" + offer.productName + "</h4>");

                        info.append("<div>" + tr("offerPrice", "capitalizefirst") + ": " +
                            offer.paperPrice + " €" + "</div>");

                        info.append("<div>" + tr("offerPaymentType", "capitalizefirst") + ": " +
                            tr("paperPayment") + "</div>");

                        info.append("<div>" + tr("productOrderType", "capitalizefirst") + ": " + (offer.paymentType ?
                              tr(offer.paymentType) : "-") + "</div>");

                        if (offer.durationTo) {
                          info.append("<div>" + tr("offerDuration", "capitalizefirst") + ": " +
                              util.parseDate(offer.durationTo) + " " + tr("until") + "</div>");
                        } else if (offer.duration) {
                          info.append("<div>" + tr("offerDuration", "capitalizefirst") + ": " + (offer.duration ?
                                offer.duration : "-") + " " + tr(offer.durationType) + "</div>");
                        } else {
                          info.append("<div>" + tr("billPeriod", "capitalizefirst") + ": " + data.paperBillPeriod + " " + tr("months") + "</div>");
                        }
                      }

                      if (offer.creditPrice !== null) {
                        total_sum += parseFloat(offer.creditPrice);
                      } else {
                        total_sum = -1;
                      }

                    }

                    // Check if the current package is payable with a credit card
                    if ( total_sum <= 0 ||  total_sum >= MAX_TOTAL_PRICE) {

                      $("label[for=cardPaymentSelectBox]").addClass("hidden");
                      $('.overpriced').removeClass('hidden');

                    } else { // Permit credit card payments...
                      
                      $("label[for=cardPaymentSelectBox]").removeClass("hidden");
                      $('.overpriced').addClass('hidden');

                    }

                    // Default to leka
                    $('#cardPaymentSelect').prop('checked', false);
                    $('#emailNotificationBox').prop('disabled', false);
                    $("#emailNotificationBox").change();

                    _this.controller.set("paymentMethod", 'leka');

                  }
                }); // after getting the offer list
              }
            },
            filterFn: function(data) {
              var now = new Date();

              data.push({name: "salesStartEnd", value: util.dateToUTCString(now)});
              data.push({name: "salesEndStart", value: util.dateToUTCString(now)});
              data.push({name: "hasPaper", value: true});
              data.push({name: "excludePackageCategory", value: 'subpackage'});

              // There needs to be at least one checked type or product group to activate filter
              var typeChecks = $(".packages-popover .package-filter-type input:checkbox:checked");
              if (typeChecks.length) {
                var types = [];
                typeChecks.each(function() {
                  types.push($(this).val());
                });
                data.push({name: "productTypes", value: types});
              }

              var groupChecks = $(".packages-popover .package-filter-group input:checkbox:checked");
              if (groupChecks.length) {
                var groups = [];
                groupChecks.each(function() {
                  groups.push($(this).val());
                });
                data.push({name: "productGroups", value: groups});
              }

              return data;
            }
          });

          // Add package filters
          $(".packages-popover .package-filter-content").click(function(e) {
            // Stop dropdown menu from popping down
            e.stopPropagation();
          });

          DP.execute({type: "product", method: "findTypes"}).then(function(types) {
            if (types instanceof Array && types.length > 0) {
              var typeFilter = $(".packages-popover .package-filter-type");
              var items = [];

              if (typeFilter.length > 0) {
                typeFilter.html("");

                for (var i = 0; i < types.length; i++) {
                  items.push({name: types[i].name, value: types[i].id});
                }

                typeFilter.append(ViivaFormElements.switchGroup({label: tr("productType"),
                                  on: "+", off: "-", items: items}));

                typeFilter.find("input:checkbox").change(function() {
                  packagesTable.updateTable();
                });
              }
            }
          });

          DP.execute({type: "product", method: "findGroups"}).then(function(groups) {
            if (groups instanceof Array && groups.length > 0) {
              var groupFilter = $(".packages-popover .package-filter-group");
              var items = [];

              if (groupFilter.length > 0) {
                groupFilter.html("");

                for (var i = 0; i < groups.length; i++) {
                  items.push({name: groups[i].name, value: groups[i].id});
                }

                items = items.sort(function (a, b) {
                  return a.name.localeCompare(b.name);
                });

                groupFilter.append(ViivaFormElements.switchGroup({label: tr("productGroup"),
                                   on: "+", off: "-", items: items}));

                groupFilter.find("input:checkbox").change(function() {
                  packagesTable.updateTable();
                });
              }
            }
          });

          $(".packages-popover .popover-ctrls > button.btn-primary")
            .unbind("click").bind("click", function() {
              var selected = $(".packages-selection .selected");

              if (selected.length) {

                var package = packagesTable.getData(selected.get(0));

                if (package) {
                  jRoot.find(".selected-package").val(package.name);
                  jRoot.find(".show-package").show();
                  _this.controller.set("package", package.id);

                  // Fetch current package and its offers from the server and update the offer info list
                  DP.find({type: "package", id: _this.controller.get("package")}).then(function (package) {
                    DP.execute({type: "package", method: "findOffers", params: {package:
                      _this.controller.get("package")}})
                      .then(function(offers) {
                        updateOfferInfo(offers, package);
                      });
                  });

                }
              }
         

              jRoot.find(".selected-package").popover("hide");
            });

          $(".packages-popover .popover-ctrls > button.btn-default")
            .unbind( "click" ).bind("click", function() {
              jRoot.find(".selected-package").popover("hide");
            });
        }).on('hide.bs.popover', function() {
          $(".packages-popover").removeAttr("style");
        });
      } else {
        _this.controller.then(function() {
          jRoot.find(".selected-package").val(_this.controller.get("packageName"));
          jRoot.find(".show-package").show();
          DP.execute({type: "order", method: "findOffers", params: {order:
                     _this.options.id}}).then(function(oOffers) {
            var oOfferIDs = [];
            $.map(oOffers, function(offer) {
              oOfferIDs.push(offer.id);
            });
            DP.find({type: "package", id: _this.controller.get("package")}).then(function (package) {
              DP.execute({type: "package", method: "findOffers", params: {package:
                         _this.controller.get("package")}})
                         .then(function(pOffers) {
                var offerList = jRoot.find(".offer-list").empty();
                $.map(pOffers, function(offer) {
                  var idx = $.inArray(offer.id, oOfferIDs);
                  var row = $("<label class='checkbox'>" +
                              "<input type='checkbox' disabled='disabled'" +
                              (idx != -1 ? " checked='checked'" :
                               "") + "'><i></i>" + offer.productName +"</label>");
                  var repeatInfo = "";

                  if (offer.creditPrice !== null &&
                      (_this.controller.get("paymentMethod") == "payex_credit" ||
                       _this.controller.get("paymentMethod") == "payex_debit")) {
                    row.append(", " + tr("offerPrice") + ": " +
                               offer.creditPrice + " €");
                    row.append(", " + tr("offerPaymentType") + ": " +
                               tr("korttimaksu"));
                    repeatInfo = ", " + tr("billingPeriod") + ": " + package.get("creditBillPeriod")
                                 + " " + tr("months") + " (" + (package.get("creditOfferPeriodCount") > 0 ?
                                 package.get("creditOfferPeriodCount") : tr("offerAlways")) + ")";
                  } else if (offer.paperPrice !== null &&
                             (_this.controller.get("paymentMethod") == "leka" ||
                              _this.controller.get("paymentMethod") == "manual")) {
                    row.append(", " + tr("offerPrice") + ": " +
                               offer.paperPrice + " €");
                    row.append(", " + tr("offerPaymentType") + ": " +
                               tr("paperPayment"));
                    repeatInfo = ", " + tr("billPeriod") + ": " + package.get("paperBillPeriod")
                                 + " " + tr("months");
                  }

                  if (offer.durationTo) {
                    row.append(", " + tr("offerDuration") + ": " +
                               util.parseDate(offer.durationTo) + " " + tr("until"));
                  } else if (offer.duration) {
                    row.append(", " + tr("offerDuration") + ": " + (offer.duration ?
                               offer.duration : "-") + " " + tr(offer.durationType));
                  } else {
                    row.append(repeatInfo);
                  }

                  if (typeof _this.options.state == "undefined" ||
                      (_this.options.state != "inactive" &&
                       _this.options.state != "active"))
                    if (idx !== -1 && typeof oOffers[idx].validTill !== "undefined" &&
                        oOffers[idx].validTill) {
                    row.append(" (<u>" +  util.parseDate(oOffers[idx].validTill)  +
                               " " + tr("until") + "</u>)");
                  }

                  offerList.append(row);
                });
              });
            });
          });
        });
   
      }

          // Payment method selection
      jRoot.find('#cardPaymentSelectBox').change(function(){

        if ($(this).is(':checked')) {

          _this.controller.set("paymentMethod", "payex_credit");
          $("#emailNotificationBox").prop('checked', true);
          $("#emailNotificationBox").prop('disabled', true);

        } else {
          _this.controller.set("paymentMethod", "leka");
          $("#emailNotificationBox").prop('disabled', false);
        }

        // Fetch current package and its offers from the server and update the offer info list
        DP.find({type: "package", id: _this.controller.get("package")}).then(function (package) {
          DP.execute({type: "package", method: "findOffers", params: {package:
            _this.controller.get("package")}})
            .then(function(offers) {
              updateOfferInfo(offers, package);
            });
        });

        $("#emailNotificationBox").change();

      });

      jRoot.find('#emailNotificationBox').change(function() {
        if ($(this).is(':disabled')) {
          $('label[for=emailNotificationBox]').addClass('state-disabled');
        } else {
          $('label[for=emailNotificationBox]').removeClass('state-disabled');
        }
      });

      jRoot.find(".show-package").click(function() {
        if (_this.controller.get("package")) {
          require("dialogManager").create({type: "PackageDialog", id:
                                          _this.controller.get("package")});
        }
      });

       function updateOfferInfo(offers, package) {

        var offerList = jRoot.find(".offer-list").empty();
        var paymentMethod = _this.controller.get("paymentMethod");

        var row;
        for (var i=0, offer=null; i < offers.length; i++) {
          offer = offers[i];

          row = $("<label class='checkbox'>" +
              "<input type='checkbox' checked='checked' disabled='disabled' " +
              "value='" + offer.id + "'><i></i>" + offer.productName +"</label>");

          if (paymentMethod == "leka") {
            row.append(", " + tr("offerPrice") + ": " +
                offer.paperPrice + " €");

          } else if (paymentMethod == "payex_credit") {

            row.append(", " + tr("offerPrice") + ": " +
                offer.creditPrice + " €");
          }

          // Fixed offer, use offer data
          if (offer.durationTo) {
            row.append(", " + tr("offerDuration") + ": " +
                util.parseDate(offer.durationTo) + " " + tr("until"));
          } else if (offer.duration) {
            row.append(", " + tr("offerDuration") + ": " +
                (offer.duration ?  offer.duration : "-") +
                " " + tr(offer.durationType));
          } 
          else { // recurring, use package data

            if (paymentMethod == "leka") {

              row.append(", " + tr("billPeriod") + ": " +
                  package.get("paperBillPeriod") + " " +
                  tr("months"));

            } else if (paymentMethod == "payex_credit") {

              row.append(", " + tr("billPeriod") + ": " +
                  package.get("creditBillPeriod") + " " +
                  tr("months"));

              row.append(" (" + tr("offerPeriods") + ": " + (package.get("creditOfferPeriodCount") > 0 ?
                              package.get("creditOfferPeriodCount") : tr("offerAlways")) + ")");
              

            }

          }

          offerList.append(row);

        }

      }

      function getOffers() {
        var offers = [];

        jRoot.find(".offer-list input:checkbox:checked").each(function() {
          offers.push($(this).val());
        });

        return offers;
      }

      var dialogButtons = [];
      _this.dialogLock = false;
      if (typeof _this.newOrder !== "undefined" && _this.newOrder) {
        dialogButtons.push({
          html: "<i class='fa fa-save'></i> " + tr("save", "capitalizefirst"),
          "class": "btn btn-primary",
          click: function() {
            if (_this.dialogLock) {
              return;
            }
            _this.dialogLock = true;

            console.log(_this.controller.get("package"));

            var user = null;

            if (typeof customerServiceWidgetManager.activeMyDigiCustomer !== "undefined") {
              user = {
                user: customerServiceWidgetManager.activeCustomer,
                mydigiAccountId:  customerServiceWidgetManager.activeMyDigiCustomer.id,
                mydigiContactId: customerServiceWidgetManager.activeMyDigiCustomer.primaryContact
            }

            }

            else {
                user = {
                  user: customerServiceWidgetManager.activeCustomer
              }
            }

            var dialog = $(this);
            var data = {
              user: user,
              //account: _this.options.customer,
              //contact: jRoot.find(".contact-list select").val(),
              package: _this.controller.get("package"),
              enforceCode: $('#enforce-order').prop('checked'),
              //emailNotification: $('#customer-email-confirmation').prop('checked'),
              emailNotification: _this.controller.get("emailNotification"),
              paymentMethod: _this.controller.get("paymentMethod"),
              sendAccountConfirmationEmail: $('#new-account-email').prop('checked'),
              offers: getOffers()
            };
            if (data.user && data.package) {
              if (data.offers && data.offers instanceof Array && data.offers.length > 0) {
                DP.execute({type: "apiOrder", method: "createConsolidatedOrder", params: data})
                  .then(function(response) {
                    if (typeof _this.options.update === "function" && _this.options.update) {
                      _this.options.update();
                    }

                    if (response.message === 'Fragmented') {

                      customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);
                      
                      if (typeof response.errors !== "undefined" && response.errors instanceof Array ) {
                        for (var i = 0; i < response.errors.length; i++ ) {
                          Notification.error({title: tr("fragmentedOrderErrorMessage"), message: response.errors[i].message });
                        }
                      }
                      else if (typeof response.errors !== "undefined") {
                        Notification.error({title: tr("fragmentedOrderErrorMessage"), message: response.errors.message });
                      }
                      else {
                        Notification.error({title: tr("fragmentedOrderErrorMessage"), message: tr("unknownError")});
                      }
                       _this.dialogLock = false;
                        dialog.dialog("close");
                    }

                    else if (response.message === 'Successful') {
                      if (typeof response.mydigiCustomer !== "undefined") {
                          customerServiceWidgetManager.activeMyDigiCustomer = response.mydigiCustomer;
                      }
                      customerServiceWidgetManager.ordersWidget.loadData(customerServiceWidgetManager.activeCustomer.customerNumber);

                      _this.dialogLock = false;
                      Notification.success({title: tr("orderCreateSuccess"), message: "Tilaus luotu onnistuneesti käyttäjälle "+
                        response.order.givenName+" "+response.order.familyName+ " "+response.order.email});
                      dialog.dialog("close");
                    }
                    else if ( response.message === 'Failed') {

                      for (var i = 0; i < response.errors.length; i++ ) {
                        Notification.error({title: tr("orderCreateFailed"), message: response.errors[i].message });
                      }
                       _this.dialogLock = false;
                    }

                  }, function() {
                    _this.dialogLock = false;
                    Notification.error({title: tr("orderCreateFailed"), message: tr("unknownError")});
                  });
              } else {
                _this.dialogLock = false;
                Notification.error({title: tr("orderCreateFailed"), message: tr("orderMissingOffer")});
              }
            } else {
              _this.dialogLock = false;
              Notification.error({title: tr("orderCreateFailed"), message: tr("invalidFields")});
            }
          }
        });
      } else if (typeof _this.options.state !== "undefined" &&
                 (_this.options.state === "inactive" || _this.options.state === "active")){
        dialogButtons.push({
          html: "<i class='fa fa-ban'></i> " + tr("cancelOrder", "capitalizefirst"),
          "class": "btn btn-danger",
          click: function() {
            if (_this.dialogLock) {
              return;
            }
            _this.dialogLock = true;

            var dialog = $(this);
            require("dialogManager").create({type: "OrderCancelConfirmDialog", id: "confirm",
              message: tr("orderCancelConfirmation"), yes: function(source, reason) {
                // Cancel order
                var record = _this.controller.get("content");
                record.set("cancelSource", source);
                record.set("cancelReason", reason);
                record.deleteRecord();
                record.save().then(function() {
                  if (typeof _this.options.update === "function" && _this.options.update) {
                    _this.options.update();
                  }
                  _this.dialogLock = false;
                  dialog.dialog("close");
                }, function() {
                  _this.dialogLock = false;
                  Notification.error({title: tr("orderCancelFailed"), message: tr("unknownError")});
                });
              }, no: function() {_this.dialogLock = false;}
            });
          }
        });
      }
      dialogButtons.push({
        html: tr("close"),
        "class": "btn btn-default",
        click: function() {
          if (_this.dialogLock) {
            return;
          }
          $(this).dialog("close");
        }
      });

      var tabs = [{title: tr("orderOffers")}];
      if (typeof _this.newOrder === "undefined" || !_this.newOrder) {
        tabs.push({title: tr("orderPayments")});
      }

      jRoot.dialog({minWidth: 680, minHeight: 500,
                    title: typeof _this.newOrder !== "undefined" && _this.newOrder ?
                           tr("newOrder") : tr("order"),
                    buttons: dialogButtons, tabs: tabs});
      jRoot.on('dialogclose', function() {
        $(this).find(".custom-popover").popover("hide");

        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        jRoot.dialog("destroy");
        _this.destroy();
      });

      if (typeof pageSetUp == "function") {
        pageSetUp(jRoot);
      }
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.id !== "undefined") {
      var params = {options: options};
      params.controller =  DP.create({type: "order", data: {emailNotification: false, paymentMethod: "leka"}});
      params.newOrder = true;

      var apiOrderDialog = ApiOrderDialog.create(params);

      apiOrderDialog.appendTo($("body"));

      return apiOrderDialog;
    }
  };
});
