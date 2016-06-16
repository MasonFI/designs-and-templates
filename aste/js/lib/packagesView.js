define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaTableView',
        'viivaFormElements', 'viivaListBox', 'viivaDataTable', 'dialogManager', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaTableView, ViivaFormElements, ViivaListBox,
                ViivaDataTable, DialogManager) {
  return function(options) {
    return Ember.View.extend({
      didInsertElement: function() {
        var _this = this;
        var jRoot = _this.$("");

        var view = new ViivaTableView();
        var viewFlags = view.SETTINGS | view.RELOAD;

        _this.dataTable = new ViivaDataTable();
        var dataTableParams = {
          method: "package.get",
          onProcessing: function(processing) {
            view.toggleReload(processing);
          },
          colDefs: [
            {name: tr("packageID"), prop: "id", visible: false},
            {name: tr("productGroup"), prop: "group", sortable: true},
            {name: tr("packageName"), prop: "name"},
            {name: tr("packageMarketingName"), prop: "marketingName"},
            {name: tr("packageSalesStart"), prop: "start",
             render: function(data) {return util.parseDate(data);}},
            {name: tr("packageSalesEnd"), prop: "end",
             render: function(data) {return util.parseDate(data);}}
          ],
          defaultSort: [[0, "desc"]], // Newest packages first
          filterFn: function(data) {
            if (typeof data !== "undefined" && data) {
              var salesStartStart = jRoot.find(".table-settings-body .package-sales-start input.datepicker.start").datepicker("getDate");
              var salesStartEnd = jRoot.find(".table-settings-body .package-sales-start input.datepicker.end").datepicker("getDate");
              var salesEndStart = jRoot.find(".table-settings-body .package-sales-end input.datepicker.start").datepicker("getDate");
              var salesEndEnd = jRoot.find(".table-settings-body  .package-sales-end input.datepicker.end").datepicker("getDate");
              var typeChecks = jRoot.find(".table-settings-body .package-filter-type input:checkbox:checked");
              var groupChecks = jRoot.find(".table-settings-body .package-filter-group input:checkbox:checked");

              var added = false;

              if (salesStartStart) {
                data.push({name: "salesStartStart", value: util.dateToUTCString(salesStartStart)});
                added = true;
              }
              if (salesStartEnd) {
                data.push({name: "salesStartEnd", value: util.dateToUTCString(salesStartEnd)});
                added = true;
              }
              if (salesEndStart) {
                data.push({name: "salesEndStart", value: util.dateToUTCString(salesEndStart)});
                added = true;
              }
              if (salesEndEnd) {
                data.push({name: "salesEndEnd", value: util.dateToUTCString(salesEndEnd)});
                added = true;
              }

              // There needs to be at least one checked type or product group to activate filter
              if (typeChecks.length) {
                var types = [];
                typeChecks.each(function() {
                  types.push($(this).val());
                });
                data.push({name: "productTypes", value: types});
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

              if (added) {
                return data;
              }
            }

            return null;
          }
        };

        if (window.App.__container__.lookup("controller:application").get("isUserSales")) {
          dataTableParams.onClick = function(row, data) {
            var dialogOption = {type: "PackageDialog", id: data.id,
                                update: function() {_this.dataTable.updateTable();}};
            DialogManager.create(dialogOption);
          };

          viewFlags |= view.ADD;
        }

        view.create({title: tr("packages"), flags: viewFlags, container: jRoot});

        // Package view settings
        var settings = jRoot.find(".table-settings-body");

        settings.append(ViivaFormElements.dateRange({label: tr("packageSalesStart"), classes: "package-sales-start"}));
        settings.append(ViivaFormElements.dateRange({label: tr("packageSalesEnd"), classes: "package-sales-end"}));

        settings.append("<div class='package-filter-type'></div>");
        DP.execute({type: "product", method: "findTypes"}).then(function(types) {
          if (types instanceof Array && types.length > 0) {
            var typeFilter = jRoot.find(".package-filter-type");
            var items = [];

            if (typeFilter.length > 0) {
              typeFilter.html("");

              for (var i = 0; i < types.length; i++) {
                items.push({name: types[i].name, value: types[i].id});
              }

              typeFilter.append(ViivaFormElements.switchGroup({label: tr("productType"),
                                on: "+", off: "-", items: items}));

              typeFilter.find("input:checkbox").change(function() {
                _this.dataTable.updateTable();
              });
            }
          }
        });

        settings.append("<div class='package-filter-group'></div>");
        DP.execute({type: "product", method: "findGroups"}).then(function(groups) {
          if (groups instanceof Array && groups.length > 0) {

            // alphabetical order
            groups = groups.sort(function (a, b) {
              return a.name.localeCompare(b.name);
            });

            var groupFilter = jRoot.find(".package-filter-group");
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
                                                      on: "+", off: "-", items: [
                                                        {name: tr("packageID"), value: 0},
                                                        {name: tr("productGroup"), value: 1, checked: true},
                                                        {name: tr("packageName"), value: 2, checked: true},
                                                        {name: tr("packageMarketingName"), value: 3, checked: true},
                                                        {name: tr("packageSalesStart"), value: 4, checked: true},
                                                        {name: tr("packageSalesEnd"), value: 5, checked: true},
                                                      ]}));

        settings.append("<div class='col-xs-12'><button class='pull-right btn btn-ms btn-primary filter-reset'>" +
                        tr("resetFilter") + "</button></div>");

        dataTableParams.container = jRoot.find(".table-body");
        _this.dataTable.create(dataTableParams);

        jRoot.find(".table-view").on("reload", function() {
          _this.dataTable.updateTable();
        });

        jRoot.find(".table-view").on("add", function() {
          DialogManager.create({type: "PackageDialog", id: "new",
                               update: function() {_this.dataTable.updateTable();}});
        });
        jRoot.find(".table-settings-body input.datepicker.start").change(function() {
          var startDate = $(this).datepicker("getDate");
          $(this).closest(".form-group").siblings(".form-group")
                 .find("input.datepicker.end").datepicker("option", "minDate", startDate);
        });
        jRoot.find(".table-settings-body input.datepicker").change(function() {
          _this.dataTable.updateTable();
        });
        jRoot.find(".table-settings-body .table-fields input:checkbox").change(function() {
          _this.dataTable.setColumnVisibility({columnIndex: parseInt($(this).val()),
                                              visibility: $(this).is(':checked')});
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

          jRoot.find(".table-settings-body input.datepicker").datepicker("setDate", null);

          jRoot.find('.package-filter-type input:checkbox').prop('checked', false);
          jRoot.find('.package-filter-group input:checkbox').prop('checked', false);
          _this.dataTable.updateTable();
        });

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
      }
    });
  };
});
