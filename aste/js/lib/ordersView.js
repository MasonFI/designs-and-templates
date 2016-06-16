define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility',
        'viivaTableView', 'viivaFormElements', 'viivaListBox', 'viivaDataTable',
        'dialogManager', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaTableView, ViivaFormElements, ViivaListBox,
                ViivaDataTable, DialogManager) {
  return function(options) {
    return Ember.View.extend({
      // Effectively document ready
      didInsertElement: function() {
        var _this = this;
        var jRoot = _this.$("");

        var view = new ViivaTableView();
        view.create({title: tr("orders"), flags: view.SETTINGS |
                     view.RELOAD | view.ADD, container: jRoot});

        var settings = jRoot.find(".table-settings-body");
        settings.append(ViivaFormElements.dateRange({label: tr("orderCreated"), classes: "order-created"}));
        settings.append(ViivaFormElements.dateRange({label: tr("orderLastPaid"), classes: "order-last-paid"}));

        settings.append(ViivaFormElements.switchGroup({label: tr("orderStatus"), classes: "order-status",
                                                      on: "+", off: "-", columns: 1, items: [
                                                      {name: tr("inactive"), value: 'inactive'},
                                                      {name: tr("active"), value: 'active'},
                                                      {name: tr("suspended"), value: 'suspended'},
                                                      {name: tr("cancelled"), value: 'cancelled,cancel_pending'},
                                                      {name: tr("finished"), value: 'finished'},
                                                      {name: tr("renewal_pending"), value: 'renewal_pending'}
                                                      ]}));

        settings.append(ViivaFormElements.switchGroup({label: tr("packageCategory"), classes: "order-package-category",
                                                      on: "+", off: "-", columns: 1, items: [
                                                      {name: tr("initialsales"), value: 'initial_sales'},
                                                      {name: tr("continualsales"), value: 'continual_sales'},
                                                      {name: tr("subpackage"), value: 'subpackage'},
                                                      {name: tr("customerservice"), value: 'customerservice'},
                                                      ]}));

        settings.append(ViivaFormElements.switchGroup({ label: tr("orderPaymentMethod"), on: "+", off: "-", columns: 1, classes: "order-paymentmethod", items:
                               [ { name: tr("paperPayment"), value: 'leka', checked: true }, {name: tr("cardPayment"), value: 'payex_credit', checked: true } ]}));

        settings.append("<div class='order-filter-group'></div>");

        DP.execute({type: "product", method: "findGroups"}).then(function(groups) {

          if (groups instanceof Array && groups.length > 0) {

            groups = groups.sort(function (a, b) {
              return a.name.localeCompare(b.name);
            });

            var groupFilter = jRoot.find(".order-filter-group");
            var items = [];

            if (groupFilter.length > 0) {
              groupFilter.html("");

              for (var i = 0; i < groups.length; i++) {
                items.push({name: groups[i].name, value: groups[i].id});
              }

              groupFilter.append(ViivaFormElements.switchGroup({label: tr("productGroup"),
                                 on: "+", off: "-", items: items}));

              groupFilter.find("input:checkbox").change(function() {
                _this.dataTable.updateTable();
              });
            }
          }
        });

        settings.append(ViivaFormElements.switchGroup({label: tr("tableFields"), classes: "table-fields",
                                                      on: "+", off: "-", columns: 1, items: [
                                                      {name: tr("orderID"), value: 0},
                                                      {name: tr("productGroup"), value: 1, checked: true},
                                                      {name: tr("packageName"), value: 2, checked: true},
                                                      {name: tr("orderCustomerName"), value: 3, checked: true},
                                                      {name: tr("orderCreated"), value: 4, checked: true},
                                                      {name: tr("orderLastPaid"), value: 5, checked: true},
                                                      {name: tr("orderStatus"), value: 6, checked: true}
                                                      ]}));

        settings.append("<div class='col-xs-12'><button class='pull-right btn btn-ms btn-primary filter-reset'>" +
                        tr("resetFilter") + "</button></div>");

        _this.dataTable = new ViivaDataTable();
        _this.dataTable.create({
          container: jRoot.find(".table-body"),
          method: "order.get",
          onProcessing: function(processing) {
            view.toggleReload(processing);
          },
          colDefs: [
            {name: tr("orderID"), prop: "id", visible: false},
            {name: tr("productGroup"), prop: "group"},
            {name: tr("packageName"), prop: "package"},
            {name: tr("orderCustomerName"), prop: "customer"},
            {name: tr("orderCreated"), prop: "created",
             render: function(data) {return util.parseDate(data);}},
            {name: tr("orderLastPaid"), prop: "lastPaid",
             render: function(data) {return util.parseDate(data);}},
            {name: tr("orderStatus"), prop: "state",
             render: function(data) {return tr(data, "capitalizefirst");}},
            {prop: "state", sortable: false,
             render: function(data) {
               if (data === "active" || data === "inactive") {
                 return "<button class='btn btn-danger btn-ms'>" + tr("cancel") + "</button>";
               } else {
                 return "";
               }
             }},
            {name: "", prop: "isGiftOrder", sortable: false,
            render: function(data){
              if (data) {
                return "<i class='fa fa-gift' style='font-size: 2em; margin-left:6px'><i>";
              }
              else {
                return "";
              }
              }
            },
          ],
          defaultSort: [[4, "desc"]], // Newest orders first
          onRowCreated: function(row, data) {
            $(row).find("button").click(function(event) {
              var message = tr("orderCancelConfirmationAlt");
              message = message.replace("_ORDER_ID_", data.id)
                               .replace("_CUSTOMER_", data.customer);
              DialogManager.create({type: "OrderCancelConfirmDialog", id: "confirm",
                message: message, yes: function(source, reason) {
                  // Cancel order
                  DP.find({type: "order", id: data.id}).then(function(record) {
                    record.set("cancelSource", source);
                    record.set("cancelReason", reason);
                    record.deleteRecord();
                    record.save().then(function() {
                      _this.dataTable.updateTable();
                    });
                  });
                }
              });
              event.stopPropagation();
            });
          },
          onClick: function(row, data) {
            var dialogOption = {type: "OrderDialog", id: data.id, state: data.state,
                                update: function() {_this.dataTable.updateTable();}};

            DialogManager.create(dialogOption);
          },
          filterFn: function(data) {
            if (typeof data !== "undefined" && data) {
              var createdStart = settings.find(".order-created input.datepicker.start").datepicker("getDate");
              var createdEnd = settings.find(".order-created input.datepicker.end").datepicker("getDate");
              var lastPaidStart = settings.find(".order-last-paid input.datepicker.start").datepicker("getDate");
              var lastPaidEnd = settings.find(".order-last-paid input.datepicker.end").datepicker("getDate");
              var statusChecks = settings.find('.order-status input:checkbox:checked');
              var groupChecks = settings.find(".order-filter-group input:checkbox:checked");
              var packageCategoryChecks = settings.find('.order-package-category input:checkbox:checked');
              var paymentMethodChecks = settings.find('.order-paymentmethod input:checkbox:checked' );

              var added = false;

              if (createdStart) {
                data.push({name: "createdStart", value: util.dateToUTCString(createdStart)});
                added = true;
              }
              if (createdEnd) {
                data.push({name: "createdEnd", value: util.dateToUTCString(createdEnd)});
                added = true;
              }
              if (lastPaidStart) {
                data.push({name: "lastPaidStart", value: util.dateToUTCString(lastPaidStart)});
                added = true;
              }
              if (lastPaidEnd) {
                data.push({name: "lastPaidEnd", value: util.dateToUTCString(lastPaidEnd)});
                added = true;
              }
              // There needs to be at least one checked status or product group to activate filter
              if (statusChecks.length) {
                var stats = [];
                statusChecks.each(function() {
                  stats = stats.concat($(this).val().split(','));
                });
                data.push({name: "orderStatus", value: stats});
                added = true;
              }
              if (groupChecks.length) {
                var groups = [];
                groupChecks.each(function() {
                  groups.push($(this).val());
                });
                data.push({name: "productGroups", value: groups});
                added = true;
              }
              if (packageCategoryChecks.length) {
                var packageCategories = [];
                packageCategoryChecks.each(function() {
                  packageCategories.push($(this).val());
                });
                data.push({name: "packageCategories", value: packageCategories});
                added = true;
              }
              if (paymentMethodChecks.length) {
                var paymentMethods = [];
                paymentMethodChecks.each(function() {
                  paymentMethods.push($(this).val());
                });
                data.push({name: "paymentMethods", value: paymentMethods });
                added = true;
              }

              if (added) {
                return data;
              }
            }

            return null;
          }
        });
        jRoot.find(".table-settings-body .table-fields input:checkbox").change(function() {
          _this.dataTable.setColumnVisibility({columnIndex: parseInt($(this).val()),
                                        visibility: $(this).is(':checked')});
        });
        jRoot.find(".table-settings-body input.datepicker.start").change(function() {
          var startDate = $(this).datepicker("getDate");
          $(this).closest(".form-group").siblings(".form-group")
                 .find("input.datepicker.end").datepicker("option", "minDate", startDate);
        });
        jRoot.find(".datepicker, .order-status input:checkbox, .order-package-category input:checkbox, .order-paymentmethod input:checkbox").change(function() {
          _this.dataTable.updateTable();
        });
        jRoot.find(".table-settings-body .filter-reset").click(function() {
          var checkBoxes = jRoot.find(".table-settings-body .table-fields input:checkbox");

          checkBoxes.eq(0).prop('checked', false);
          _this.dataTable.setColumnVisibility({columnIndex: 0, visibility: false});
          checkBoxes.eq(1).prop('checked', true);
          _this.dataTable.setColumnVisibility({columnIndex: 1, visibility: true});
          checkBoxes.eq(2).prop('checked', true);
          _this.dataTable.setColumnVisibility({columnIndex: 2, visibility: true});
          checkBoxes.eq(3).prop('checked', true);
          _this.dataTable.setColumnVisibility({columnIndex: 3, visibility: true});
          checkBoxes.eq(4).prop('checked', true);
          _this.dataTable.setColumnVisibility({columnIndex: 4, visibility: true});
          checkBoxes.eq(5).prop('checked', true);
          _this.dataTable.setColumnVisibility({columnIndex: 5, visibility: true});
          checkBoxes.eq(6).prop('checked', true);
          _this.dataTable.setColumnVisibility({columnIndex: 6, visibility: true});

          jRoot.find(".table-settings-body input.datepicker").datepicker("setDate", null);
          jRoot.find('.order-status input:checkbox').prop('checked', false);
          jRoot.find('.order-filter-group input:checkbox').prop('checked', false);
          jRoot.find('.order-package-category input:checkbox').prop('checked', false);
          _this.dataTable.updateTable();
        });

        jRoot.find(".table-view").on("reload", function() {
          _this.dataTable.updateTable();
        });

        jRoot.find(".table-view").on("add", function() {
          DialogManager.create({type: "OrderDialog", id: "new",
                               update: function() {_this.dataTable.updateTable();}});
        });

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
      }
    });
  };
});
