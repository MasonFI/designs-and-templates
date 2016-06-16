define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaTableView',
        'viivaDataTable', 'viivaFormElements', 'viivaNotification', 'viivaDialog', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaTableView, ViivaDataTable, ViivaFormElements, Notification) {
           var dialog = "<section>" +
                 "{{#if view.newOrder}}" +
                   "<div class='row'>" +
                     "<section class='col-xs-6 smart-form'>" +
                       "<label class='label'>" + tr("customer") + "</label>" +
                       "<div class='input'>" +
                         "<i class='fa fa-user icon-append'></i>" +
                         "<input class='selected-customer select-input custom-popover'>" +
                       "</div>" +
                     "</section>" +
                     "<section class='col-xs-6 smart-form'>" +
                       "<label class='label'>" + tr("customerContactInfo") + "</label>" +
                       "<div class='select contact-list'><select>" +
                       "</select><i></i></div>" +
                     "</section>" +
                   "</div>" +
                 "{{/if}}" +
                 "<div class='row user-info'>" +
                   "<div class='col-xs-6 smart-form'>" +
                   "{{#if giftReceiverGivenName}}"+
                   "<h3>Lahjan maksajan tiedot</h3>"+
                   "{{/if}}"+
                     "<section>" +
                       "<label class='label'>" + tr("customerFirstName") + ":</label>" +
                       "<div class='text'>{{givenName}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerLastName") + ":</label>" +
                       "<div class='text'>{{familyName}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerPhone") + ":</label>" +
                       "<div class='text'>{{phone}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerMobile") + ":</label>" +
                       "<div class='text'>{{mobile}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerEmail") + ":</label>" +
                       "<div class='text'>{{email}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerAddress") + ":</label>" +
                       "<div class='text'>{{address}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerPostalCode") + ":</label>" +
                       "<div class='text'>{{postCode}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerCity") + ":</label>" +
                       "<div class='text'>{{city}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerCountry") + ":</label>" +
                       "<div class='text'>{{country}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerCompany") + ":</label>" +
                       "<div class='text'>{{company}}</div>" +
                     "</section>" +
                   "</div>" +
                   "{{#if giftReceiverGivenName}}"+
                   "<div class='col-xs-6 smart-form'>" +
                   "<h3>Lahjan saajan tiedot</h3>"+
                     "<section>" +
                       "<label class='label'>" + tr("customerFirstName") + ":</label>" +
                       "<div class='text'>{{giftReceiverGivenName}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerLastName") + ":</label>" +
                       "<div class='text'>{{giftReceiverFamilyName}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerPhone") + ":</label>" +
                       "<div class='text'>{{giftReceiverPhone}}</div>" +
                     "</section>" +
                    "<section>" +
                       "<label class='label'>" + tr("customerMobile") + ":</label>" +
                       "<div class='text'></div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerEmail") + ":</label>" +
                       "<div class='text'>{{giftReceiverEmail}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerAddress") + ":</label>" +
                       "<div class='text'>{{giftReceiverAddress}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerPostalCode") + ":</label>" +
                       "<div class='text'>{{giftReceiverPostCode}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerCity") + ":</label>" +
                       "<div class='text'>{{giftReceiverCity}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerCountry") + ":</label>" +
                       "<div class='text'>{{giftReceiverCountry}}</div>" +
                     "</section>" +
                      "<section>" +
                       "<label class='label'>" + tr("customerCompany") + ":</label>" +
                       "<div class='text'></div>" +
                     "</section>" +
                   "</div>" +
                   "{{/if}}" +
                   "{{#unless view.newOrder}}" +
                     "<div class='col-xs-6 smart-form'>" +
                       "{{#if giftReceiverGivenName}}"+
                       "<h3 style='padding-top:10px'>Tilaustiedot</h3>"+
                       "{{/if}}"+
                       "<section>" +
                         "<label class='label'>" + tr("orderID") + ":</label>" +
                         "<div class='text'>{{view.options.id}}</div>" +
                       "</section>" +
                       "<section>" +
                         "<label class='label'>" + tr("orderStatus") + ":</label>" +
                         "<div class='text'>{{state}}</div>" +
                       "</section>" +
                       "<section>" +
                         "<label class='label'>" + tr("orderCreated") + ":</label>" +
                         "<div class='text'>{{parseDate created}}</div>" +
                       "</section>" +
                       "<section>" +
                         "<label class='label'>" + tr("orderPaymentTime") + ":</label>" +
                         "<div class='text'>{{parseDate lastPaid}}</div>" +
                       "</section>" +
                       "<section>" +
                         "<label class='label'>" + tr("orderSoldByService") + ":</label>" +
                         "<div class='text'>{{sellerServiceName}}</div>" +
                       "</section>" +
                       "<section>" +
                         "<label class='label'>" + tr("orderSoldByUser") + ":</label>" +
                         "<div class='text'>{{sellerUserName}}</div>" +
                       "</section>" +
                     "{{/unless}}" +
                   "</div>" +
                 "</div>" +
               "</section>" +
               "<section>" +
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
                 "{{#if view.newOrder}}" +
                   "<div class='row'>" +
                   "<div class='col-xs-9 smart-form package-controls'>" +
                   "<section class='col-xs-7 smart-form'>" +
                   "<label class='toggle' for='emailNotificationBox'>" +
                   "{{input type='checkbox' id='emailNotificationBox' checked=emailNotification}}" + tr("sendConfirmationEmail") +
                   "<i data-swchon-text='" + tr('yes', "capitalizefirst") + "'data-swchoff-text='" +
                   tr("no", "capitalizefirst") + "'></i>" +
                   "</label>" +
                   "</section>" +
                   "<section class='col-xs-7 smart-form'>" +
                   "<label class='toggle hidden' for=cardPaymentSelectBox>" +
                   "{{input type='checkbox'  id='cardPaymentSelectBox' checked=cardPaymentSelect}} " + tr("orderPaymentMethod") +
                   "<i data-swchon-text='" + tr('widgetOrderCard', "capitalizefirst") + "'data-swchoff-text='" +
                   tr("widgetOrderBill", "capitalizefirst") + "'></i>" +
                   "</label>" +
                   "</section>" +
                   "</div>" +
                   "</div>" +
                 "{{/if}}" +
//                 "<div class='row'>" +
//                   "<section class='col-xs-12 smart-form'>" +
//                     "<label class='label'>" + tr("billingTime") + "</label>" +
//                     "<div class='text'>XXXXXXX</div>" +
//                   "</section>" +
//                 "</div>" +
                 "<div class='row'>" +
                   "<section class='col-xs-12 smart-form'>" +
                     "<label class='label'>" + tr("offers") + "</label>" +
                     "<div class='offer-list'>" +
                     "</div>" +
                   "</section>" +
                 "</div>" +
               "</section>" +
               "{{#unless view.newOrder}}" +
                 "<section class='order-bills'>" +
                 "</section>" +
               "{{/unless}}";

  var OrderDialog = Ember.View.extend({
      template: Ember.Handlebars.compile(dialog),
      didInsertElement: function() {
      var _this = this;
      var jRoot = _this.$("").addClass("order-dialog");

      // Customer and its contacts
      function fillContactInfo(contact) {
        if (typeof contact !== "undefined" && contact) {
          for (var property in contact) {
            _this.controller.set(property, contact[property]);
          }
        }
      }

      // The offers to be sent to the server
      function getOffers() {
        var offers = [];
        jRoot.find(".offer-list input:checkbox:checked").each(function() {
          offers.push($(this).val());
        });
        return offers;
      }

      // Returns a compact description of a package and its offers and whether the package is payable by card or by bill
      // Shows the prices as grand totals
      function getPackagePaymentDetails (offers, package) {

        var MAX_CREDITCARD_PRICE_LEGAL_HARDLIMIT = 50; // euros,  TODO: get from server, set in PayExClient_Additional maxAmount
        var output = "";
        var paper_price_tot = -1.0;
        var credit_price_tot = -1.0;


        // Criterion for payment method selection: paperPrice/creditPrice of the first offer

        output += "<h4>" + offers.map(function(o) {

          var title = o.productName;

          if (o.paymentType === "repeating") {

            title += " ("  + tr(o.paymentType) + ")";

          } else {

            // It's a fixed offer
            if (o.durationTo) {
              title += " (" + util.parseDate(o.durationTo) + " " + tr("until") + ")";
            } else if (o.duration) {
              title += " (" + (o.duration ? o.duration : "-") +
                " " + tr(o.durationType) + ")";
            }
          }

          return title;
        
        }).join(", ") + "</h4>";

        if (offers[0].paperPrice !== null) {

          paper_price_tot = offers.map(function(o) { 
            return parseFloat(o.paperPrice); 
          }).reduce(function(a, b) {
            return a + b;
          }
          );

          output += "<div>" + tr("paperPayment", "capitalizefirst") + 
            ": " + String(paper_price_tot.toFixed(2)) + " €" + "</div>";

        }

        if (offers[0].creditPrice !== null) {

          credit_price_tot =  offers.map(function(o) { 
            return parseFloat(o.creditPrice); 
          }).reduce(function(a, b) {
            return a + b;
          }
          );

          output += "<div>" + tr("cardPayment", "capitalizefirst") + 
            ": " + String(credit_price_tot.toFixed(2)) + " €" + "</div>";

        }

        if (paper_price_tot >= 0.0) {
          output += "<div>" + tr("billPeriod", "capitalizefirst") + 
            ": " + package.paperBillPeriod + " " + tr("months") + "</div>";
        }

        if (credit_price_tot >= 0.0) {
          output += "<div>" + tr("billingPeriod", "capitalizefirst") + " " + tr("and") +
            " " + tr("offerPeriods") + ": " + package.creditBillPeriod + " " + tr("months") +
            ", " + package.creditOfferPeriodCount + " " + tr("pc") +"</div>";
        }

        return {
          payableByCard: credit_price_tot >= 0.0 && credit_price_tot <= MAX_CREDITCARD_PRICE_LEGAL_HARDLIMIT,
          payableByPaper: paper_price_tot >= 0.0,
          html: output
        };

      }

      // Renders a list of offers with a (disabled) checkbox in the beginning
      // Enumerates the price per offer 
      // Rendering depends on the user's selection of paymentMethod
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
                  (offer.duration ? offer.duration : "-") +
                  " " + tr(offer.durationType));
          } else { // recurring, use package data

              if (paymentMethod == "leka") {

                  row.append(", " + tr("billPeriod") + ": " + package.paperBillPeriod + " " + tr("months"));

              } else if (paymentMethod == "payex_credit") {


                row.append(", " + tr("billPeriod") + ": " +
                    package.creditBillPeriod + " " +
                    tr("months"));

                row.append(" (" + tr("offerPeriods") + ": " + (package.creditOfferPeriodCount > 0 ?
                        package.creditOfferPeriodCount : tr("offerAlways")) + ")");

              }

          }

          offerList.append(row);

        }

      }

      function getContactList() {
        if (typeof _this.options.customer !== "undefined" &&
            _this.options.customer) {
          var contactList = jRoot.find(".contact-list select");

          if (contactList.length > 0) {
            // Reset contact list
            contactList.empty();
            contactList.unbind("change");
            _this.controller.set("givenName", null);
            _this.controller.set("familyName", null);
            _this.controller.set("mobile", null);
            _this.controller.set("phone", null);
            _this.controller.set("email", null);
            _this.controller.set("address", null);
            _this.controller.set("postCode", null);
            _this.controller.set("city", null);
            _this.controller.set("country", null);
            _this.controller.set("company", null);

            // Fill up the contact list
            DP.execute({type: "contact", method: "findByCustomer",
                       params: {customer: _this.options.customer}})
                      .then(function (contactInfo){
              $.map(contactInfo, function(info) {
                var option = "<option value='" + info.id + "'>" + info.givenName + " " +
                             info.familyName + ", " + info.address + "</option>";
                if (contactList.find("option").length === 0) {
                  // First item, fill the contact info with this
                  fillContactInfo(info);
                }
                contactList.append(option);
              });
            });

            contactList.bind("change", function() {
              var contact = $(this).val();
              if (contact) {
                DP.find({type: "contact", id: contact}).then(function(info) {
                  fillContactInfo(info.get("data"));
                });
              }
            });
          }
        }
      }

      if (typeof _this.newOrder !== "undefined" && _this.newOrder) {

        jRoot.find(".contact-list").addClass("mandatory");
        jRoot.find(".selected-package").closest(".input").addClass("mandatory");

        if (typeof _this.customer !== "undefined" && _this.customer) {
          // For a specific customer
          _this.customer.then(function(customer) {
            jRoot.find(".selected-customer").val(customer.get("email"));
          });
          getContactList();

        } else {

          jRoot.find(".selected-customer").closest(".input").addClass("mandatory");
          // Need to enable customer selection
          jRoot.find(".selected-customer").popover({
            title: tr("selectCustomer"), placement: 'bottom', container: 'body', html: true,
            template: "<div class='popover dynamic customers-popover'><div class='arrow'></div>" +
                      "<div class='popover-header'><h3 class='popover-title'></h3>" +
                      "<div class='popover-ctrls'><button class='btn btn-default btn-ms'> " +
                      tr("cancel") + "</button><button class='btn btn-primary btn-ms'>" +
                      tr("select") + "</button></div><div class='clearfix'></div></div>" +
                      "<div class='popover-content'></div></div>",
            content: "<div class='customers-selection'></div>"
          }).on('shown.bs.popover', function () {
            var customersTable = new ViivaDataTable();
            customersTable.create({
              container: $(".customers-selection"),
              method: "account.get",
              onProcessing: function(processing) {
                if (processing) {
                  $(".customers-popover").css({"height": "450px"});
                }
              },
              colDefs: [
                {name: tr("customerID"), prop: "id", visible: false},
                {name: tr("customerName"), prop: "name"},
                {name: tr("customerNumber"), prop: "customerNumber"},
                {name: tr("customerEmail"), prop: "email"}
              ],
              onClick: function(row, data) {
                if (row.hasClass("selected")) {
                  row.removeClass("selected");
                } else {
                  row.siblings("tr").removeClass("selected");
                  row.addClass("selected");
                }
              }
            });

            $(".customers-popover .popover-ctrls > button.btn-primary")
              .unbind("click").bind("click", function() {
                var selected = $(".customers-selection .selected");

                if (selected.length) {
                  var customer = customersTable.getData(selected.get(0));
                  if (customer) {
                    jRoot.find(".selected-customer").val(customer.email);
                    _this.options.customer = customer.id;
                    getContactList();
                  }
                }

                jRoot.find(".selected-customer").popover("hide");
              });

            $(".customers-popover .popover-ctrls > button.btn-default")
              .unbind( "click" ).bind("click", function() {
                jRoot.find(".selected-customer").popover("hide");
              });
          }).on('hide.bs.popover', function() {
            $(".customers-popover").removeAttr("style");
          });
        }

        var selectedPackageOffers = null;
        jRoot.find(".selected-package").popover({
          title: tr("selectPackage"), placement: 'bottom', container: 'body', html: true,
          template: "<div class='popover dynamic packages-popover'><div class='arrow'></div>" +
                    "<div class='popover-header'><h3 class='popover-title'></h3>" +
                    "<button class='btn btn-default btn-ms package-filter' data-toggle='dropdown'>" +
                    tr("packageProductFilter") + "</button>" +
                    "<div class='dropdown-menu arrow-box-up package-filter-content'>" +
                    "<div class='package-filter-type'></div><div class='package-filter-paymentmethod'></div><div class='package-filter-group'>" +
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
            colDefs: [ // The displayed column in the package table
              {name: tr("packageID"), prop: "id", visible: false},
              {name: tr("billPeriod"), prop: "paperBillPeriod", visible: false},
              {name: tr("billingPeriod"), prop: "creditBillPeriod", visible: false},
              {name: tr("offerPeriods"), prop: "creditOfferPeriodCount", visible: false},
              {name: tr("productGroup"), prop: "group"},
              {name: tr("packageName"), prop: "name"},
              {name: tr("packageMarketingName"), prop: "marketingName"},
              {name: tr("packageCategory"), prop: "category",
               render: function(data) {return tr(data.replace('_', ''), 'capitalizefirst');}},
              {name: tr("packageSalesStart"), prop: "start",
               render: function(data) {return util.parseDate(data);}},
              {name: tr("packageSalesEnd"), prop: "end",
               render: function(data) {return util.parseDate(data);}}
            ],
            onClick: function(row, package) { // when selecting a package for placing an order

              if (row.hasClass("selected")) {
                row.removeClass("selected");
                selectedPackageOffers = null;
                packagesTable.closeInfo({row: row.get(0)});

              } else {

                var currentSelected = row.siblings("tr.selected");

                if (currentSelected.length > 0) {
                  currentSelected.removeClass("selected");
                  packagesTable.closeInfo({row: currentSelected.get(0)});
                }

                row.addClass("selected");
                var infoID = "packageDetials-" + package.id; // TODO: typo?
                packagesTable.openInfo({row: row.get(0), html: "<div id='" + infoID + "'></div>",
                                       classes: "package-details"});

                selectedPackageOffers = DP.execute({type: "package", method: "findOffers", params:
                                                 {"package": package.id}});

                // Render an initial view of the package offers and determine if payable with credit card
                selectedPackageOffers.then(function(offers) {

                  var info = $(" #" + infoID);

                  if (info.length > 0) { // Make sure the info box hasn't been closed

                    var details = getPackagePaymentDetails(offers, package);

                    // These can be used in the future
                    _this.controller.set("payableByCard", details.payableByCard);
                    _this.controller.set("payableByPaper", details.payableByPaper);

                    info.empty();
                    info.append(details.html);

                    // Check if the current package is payable with a credit card
                    if ( !details.payableByCard ) {

                      $("label[for=cardPaymentSelectBox]").addClass("hidden");

                    } else { // Permit credit card payments...
                      
                      $("label[for=cardPaymentSelectBox]").removeClass("hidden");

                    }

                  }
                }); // after getting the offer list

              }
            },
            filterFn: function(data) {
              var now = new Date();

              data.push({name: "salesStartEnd", value: util.dateToUTCString(now)});
              data.push({name: "salesEndStart", value: util.dateToUTCString(now)});
              data.push({name: "excludePackageCategory", value: 'subpackage'});
              //data.push({name: "hasPaper", value: true});

              // There needs to be at least one checked type or product group to activate filter
              var typeChecks = $(".packages-popover .package-filter-type input:checkbox:checked");
              if (typeChecks.length) {
                var types = [];
                typeChecks.each(function() {
                  types.push($(this).val());
                });
                data.push({name: "productTypes", value: types});
              }

              var methodChecks = $(".packages-popover .package-filter-paymentmethod input:checkbox:checked");
              if (methodChecks.length) {
                var methods = {};
                methodChecks.each(function(){
                  methods[$(this).val()] = 1;
                });
                data.push({name: "packagePaymentMethods", value: methods});
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

          function renderFilters (data, target, label) 
          {

            if (data instanceof Array && data.length > 0) {
              var filter = $(target);
              var items = [];

              if (filter.length > 0) {
                filter.html("");

                for (var i = 0; i < data.length; i++) {
                  items.push({name: data[i].name, value: data[i].id});
                }

                items = items.sort(function (a, b) {
                  return a.name.localeCompare(b.name);
                });

                filter.append(ViivaFormElements.switchGroup({label: label,
                                  on: "+", off: "-", items: items}));

                filter.find("input:checkbox").change(function() {
                  packagesTable.updateTable();
                });
              }
            }
          
          }

          // Print or Digi
          DP.execute({type: "product", method: "findTypes"}).then(function (types) { 
            renderFilters(types, ".packages-popover .package-filter-type", tr("productType"));
          });

          renderFilters([
              {name: tr("cardPayment"), id: 'payableByCard'},
              {name: tr("paperPayment"), id: 'payableByPaper'}
          ], ".packages-popover .package-filter-paymentmethod", tr("productPaymentType"));

          DP.execute({type: "product", method: "findGroups"}).then(function(groups) {
            renderFilters(groups, ".packages-popover .package-filter-group", tr("productGroup"));
          });

          // Pressing select
          $(".packages-popover .popover-ctrls > button.btn-primary")
            .unbind("click").bind("click", function() {
              var selected = $(".packages-selection .selected");

              // Rendering the listing of the selected offers
              if (selected.length) {

                var package = packagesTable.getData(selected.get(0));

                if (package) {

                  jRoot.find(".selected-package").val(package.name);
                  jRoot.find(".show-package").show();
                  _this.controller.set("package", package.id);

                  DP.execute({
                          type: "package",
                          method: "findOffers",
                          params: {
                              package: _this.controller.get("package")
                          }
                      })
                      .then(function(offers) {

                          // Reset the default payment method selection to leka
                          $('#cardPaymentSelectBox').prop('checked', false);
                          $('#emailNotificationBox').prop('disabled', false);
                          $("#emailNotificationBox").change();
                          _this.controller.set("paymentMethod", 'leka');
                          updateOfferInfo(offers, package);

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

      } else { // orderDialog for an existing order

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
                      repeatInfo = ", " + tr("billingPeriod") + ": " +
                        package.get("creditBillPeriod") + " " + tr("months") + "(" + (package.get("creditOfferPeriodCount") > 0 ?
                              package.get("creditOfferPeriodCount") : tr("offerAlways")) + ")";
                    } else if (offer.paperPrice !== null &&
                        (_this.controller.get("paymentMethod") == "leka" ||
                         _this.controller.get("paymentMethod") == "manual")) {
                      row.append(", " + tr("offerPrice") + ": " + offer.paperPrice + " €");
                      row.append(", " + tr("offerPaymentType") + ": " +
                          tr("paperPayment"));
                      repeatInfo = ", " + tr("billPeriod") + ": " + package.get("paperBillPeriod") +
                        " " + tr("months");
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

        var billView = new ViivaTableView();
        billView.create({title: tr("orders"), color: "light", flags: billView.RELOAD,
                        container: jRoot.find(".order-bills")});

        var billTable = new ViivaDataTable();
        billTable.create({
          container: jRoot.find(".order-bills .table-body"),
          method: "bill.get",
          onProcessing: function(processing) {
            billView.toggleReload(processing);
          },
          colDefs: [
            {prop: "id", visible: false},
            {name: "billTime", prop: "time",
             render: function(data) {return util.parseDate(data);}},
            {name: "billPrice", prop: "price",
             render: function(data) {return data + " €";}},
            {name: "billStatus", prop: "status",
             render: function(data) {return tr(data, "capitalizefirst");}}
          ],
          onClick: function(row, data) {
            if (row.hasClass("selected")) {
              row.removeClass("selected");
              billTable.closeInfo({row: row.get(0)});
            } else {
              var currentSelected = row.siblings("tr.selected");

              if (currentSelected.length > 0) {
                currentSelected.removeClass("selected");
                billTable.closeInfo({row: currentSelected.get(0)});
              }

              row.addClass("selected");
              var infoID = "billDetials-" + data.id;
              billTable.openInfo({row: row.get(0), html: "<div id='" + infoID + "'></div>",
                                 classes: "billDetails"});

              DP.execute({type: "billrow", method: "findByBill", params: {bill: data.id}})
                .then(function(billrows) {
                var info = jRoot.find("#" + infoID);
                if (info.length > 0) { // Make sure the info box hasn't been closed
                  info.empty();
                  $.map(billrows, function(billrow) {
                    info.append("<h4>" + billrow.productTitle + " (" + billrow.productShortCode + ")</h4>");
                    info.append("<div>" + tr("billPrice", "capitalizefirst") + ": " +
                                billrow.price + " €</div>");
                    info.append("<div>" + tr("billTaxPercent", "capitalizefirst") + ": " +
                                billrow.tax + " %</div>");
                    info.append("<div>" + tr("offerPaymentType", "capitalizefirst") + ": " +
                                tr(billrow.paymentType, "capitalizefirst") + "</div>");
                    info.append("<div>" + tr("productDuration", "capitalizefirst") + ": " +
                                util.parseDate(billrow.start, "D.M.YYYY") + " - " +
                                util.parseDate(billrow.end, "D.M.YYYY") + "</div>");
                  });
                }
              });
            }
          },
          filterFn: function(data) {
            if (typeof data !== "undefined" && data) {
              data.push({name: "order", value: _this.options.id});
              return data;
            }

            return null;
          }
        });

        jRoot.find(".order-bills .table-view").on("reload", function() {
          billTable.updateTable();
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
        // TODO: Start using ember's fancy data store feature here
        DP.find({
            type: "package",
            id: _this.controller.get("package")
        }).then(function(package) {
            DP.execute({
                    type: "package",
                    method: "findOffers",
                    params: {
                        package: _this.controller.get("package")
                    }
                })
                .then(function(offers) {
                    updateOfferInfo(offers, package.toJSON());
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

      // When requiring details about the ordered package
      jRoot.find(".show-package").click(function() {
        if (_this.controller.get("package")) {
          require("dialogManager").create({type: "PackageDialog", id:
                                          _this.controller.get("package")});
        }
      });

      // The save and close buttons
      var dialogButtons = [];
      _this.dialogLock = false;
      if (typeof _this.newOrder !== "undefined" && _this.newOrder) { // UI for placing orders
        dialogButtons.push({
          html: "<i class='fa fa-save'></i> " + tr("save", "capitalizefirst"),
          "class": "btn btn-primary",
          click: function() {
            if (_this.dialogLock) {
              return;
            }
            _this.dialogLock = true;

            var dialog = $(this);
            var data = {
              account: _this.options.customer,
              contact: jRoot.find(".contact-list select").val(),
              package: _this.controller.get("package"),
              emailNotification: _this.controller.get("emailNotification"),
              paymentMethod: _this.controller.get("paymentMethod"),
              offers: getOffers()
            };

            if (data.account && data.contact && data.package) {
              if (data.offers && data.offers instanceof Array && data.offers.length > 0) {
                DP.execute({type: "order", method: "createWithOffers", params: data})
                  .then(function() {
                    if (typeof _this.options.update === "function" && _this.options.update) {
                      _this.options.update();
                    }
                    _this.dialogLock = false;
                    Notification.success({title: tr("orderCreateSuccess"), message:
                                          tr("orderCreateSuccessDescription").replace(
                                          "_EMAIL_", _this.controller.get('email'))});
                    dialog.dialog("close");
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
      } else if (typeof _this.options.state !== "undefined" && // UI for cancelling orders
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

      var tabs = [{title: tr("basicInfo")}, {title: tr("orderOffers")}];
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

      if (options.id === "new") {
        params.controller = DP.create({type: "order", data: {emailNotification: true, paymentMethod: "leka"}});
        params.newOrder = true;

        if (typeof options.customer !== "undefined" && options.customer) {
          params.customer = DP.find({type: "customer", id: options.customer});
        }
      } else {
        params.controller = DP.find({type: "order", id: options.id, reload: true});
      }

      var orderDialog = OrderDialog.create(params);

      orderDialog.appendTo($("body"));

      return orderDialog;
    }
  };
});
