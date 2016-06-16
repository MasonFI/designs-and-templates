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
        view.create({title: tr("customers"), flags: view.SETTINGS |
                     view.RELOAD | view.ADD, container: jRoot});

        var settings = jRoot.find(".table-settings-body");
        settings.append(ViivaFormElements.dateRange({label: tr("customerLastActive"), classes: "last-active"}));
        settings.append(ViivaFormElements.select({label: tr("customerNumber"), classes: "customer-number", items: [
                                                 {name: tr("noLimit", "capitalizefirst"), value: 0},
                                                 {name: tr("notExist", "capitalizefirst"), value: 1},
                                                 {name: tr("exist", "capitalizefirst"), value: 2}
                                                 ]}));

        settings.append(ViivaFormElements.select({label: tr("customerName"), classes: "customer-name", items: [
                                                 {name: tr("noLimit", "capitalizefirst"), value: 0},
                                                 {name: tr("notExist", "capitalizefirst"), value: 1},
                                                 {name: tr("exist", "capitalizefirst"), value: 2}
                                                 ]}));

        settings.append(ViivaFormElements.switchGroup({label: tr("tableFields"), classes: "table-fields",
                                                      on: "+", off: "-", items: [
                                                      {name: tr("customerID"), value: 0},
                                                      {name: tr("customerName"), value: 1, checked: true},
                                                      {name: tr("customerNumber"), value: 2, checked: true},
                                                      {name: tr("customerEmail"), value: 3, checked: true},
                                                      {name: tr("customerAccountCreated"), value: 4, checked: true},
                                                      {name: tr("customerLastLogin"), value: 5, checked: true}
                                                      ]}));

        settings.append("<div class='col-xs-12'><button class='pull-right btn btn-ms btn-primary filter-reset'>" +
                        tr("resetFilter") + "</button></div>");

        var dataTable = new ViivaDataTable();
        dataTable.create({
          container: jRoot.find(".table-body"),
          method: "account.get",
          onProcessing: function(processing) {
            view.toggleReload(processing);
          },
          colDefs: [
            {name: tr("customerID"), prop: "id", visible: false},
            {name: tr("customerName"), prop: "name"},
            {name: tr("customerNumber"), prop: "customerNumber"},
            {name: tr("customerEmail"), prop: "email"},
            {name: tr("customerAccountCreated"), prop: "created",
             render: function(data) {return util.parseDate(data);}},
            {name: tr("customerLastLogin"), prop: "lastAuth",
             render: function(data) {return util.parseDate(data);}}
          ],
          defaultSort: [[4, "desc"]], // Newest accounts first
          onClick: function(row, data) {
            var dialogOption = {type: "CustomerDialog", id: data.id,
                                update: function() {dataTable.updateTable();}};

            DialogManager.create(dialogOption);
          },
          filterFn: function(data) {
            if (typeof data !== "undefined" && data) {
              var lastActiveStart = settings.find(".last-active .start").datepicker("getDate");
              var lastActiveEnd = settings.find(".last-active .end").datepicker("getDate");
              var customerNumber = parseInt(settings.find('.customer-number select').find(":selected").val());
              var customerName = parseInt(settings.find('.customer-name select').find(":selected").val());

              var added = false;

              if (lastActiveStart) {
                data.push({name: "lastActiveStart", value: util.dateToUTCString(lastActiveStart)});
                added = true;
              }
              if (lastActiveEnd) {
                data.push({name: "lastActiveEnd", value: util.dateToUTCString(lastActiveEnd)});
                added = true;
              }
              if (customerNumber) {
                data.push({name: "customerNumber", value: customerNumber});
                added = true;
              }
              if (customerName) {
                data.push({name: "customerName", value: customerName});
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
          dataTable.setColumnVisibility({columnIndex: parseInt($(this).val()),
                                        visibility: $(this).is(':checked')});
        });

        jRoot.find(".table-settings-body input.datepicker.start").change(function() {
          var startDate = $(this).datepicker("getDate");
          $(this).closest(".form-group").siblings(".form-group")
                 .find("input.datepicker.end").datepicker("option", "minDate", startDate);
        });

        jRoot.find(".table-settings-body .datepicker, .table-settings-body select").change(function() {
          dataTable.updateTable();
        });

        jRoot.find(".table-settings-body .filter-reset").click(function() {
          var checkBoxes = jRoot.find(".table-settings-body .table-fields input:checkbox");

          checkBoxes.eq(0).prop('checked', false);
          dataTable.setColumnVisibility({columnIndex: 0, visibility: false});
          checkBoxes.eq(1).prop('checked', true);
          dataTable.setColumnVisibility({columnIndex: 1, visibility: true});
          checkBoxes.eq(2).prop('checked', true);
          dataTable.setColumnVisibility({columnIndex: 2, visibility: true});
          checkBoxes.eq(3).prop('checked', true);
          dataTable.setColumnVisibility({columnIndex: 3, visibility: true});
          checkBoxes.eq(4).prop('checked', true);
          dataTable.setColumnVisibility({columnIndex: 4, visibility: true});
          checkBoxes.eq(5).prop('checked', true);
          dataTable.setColumnVisibility({columnIndex: 5, visibility: true});

          jRoot.find(".table-settings-body input.datepicker").datepicker("setDate", null);
          jRoot.find(".table-settings-body .customer-number select").val(0);
          jRoot.find(".table-settings-body .customer-name select").val(0);
          dataTable.updateTable();
        });

        jRoot.find(".table-view").on("reload", function() {
          dataTable.updateTable();
        });

        jRoot.find(".table-view").on("add", function() {
          DialogManager.create({type: "CustomerDialog", id: "new",
                               update: function() {dataTable.updateTable();}});
        });

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
      }
    });
  };
});
