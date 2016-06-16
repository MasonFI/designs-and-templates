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
        view.create({title: tr("products"), flags: view.SETTINGS |
                     view.RELOAD | view.ADD, container: jRoot});

        var settings = jRoot.find(".table-settings-body");
        settings.append(ViivaFormElements.switchGroup({label: tr("tableFields"), classes: "table-fields",
                                                      on: "+", off: "-", items: [
                                                        {name: tr("productID"), value: 0},
                                                        {name: tr("productGroup"), value: 1, checked: true},
                                                        {name: tr("productTitle"), value: 2, checked: true},
                                                        {name: tr("productType"), value: 3, checked: true},
                                                        {name: tr("productShortCode"), value: 4, checked: true}
                                                      ]}));

        settings.append("<div class='col-xs-12'><button class='pull-right btn btn-ms btn-primary filter-reset'>" +
                        tr("resetFilter") + "</button></div>");

        _this.dataTable = new ViivaDataTable();
        _this.dataTable.create({
          container: jRoot.find(".table-body"),
          method: "product.get",
          onProcessing: function(processing) {
            view.toggleReload(processing);
          },
          colDefs: [
            {name: tr("productID"), prop: "id", visible: false},
            {name: tr("productGroup"), prop: "group"},
            {name: tr("productTitle"), prop: "title"},
            {name: tr("productType"), prop: "type",
             render: function(data) {return tr(data, "capitalizefirst");}},
            {name: tr("productShortCode"), prop: "shortCode"}
          ],
          defaultSort: [[1, "asc"]], // product groups in alphabetical order
          onClick: function(row, data) {
            var dialogOption = {type: "ProductDialog", id: data.id,
                                update: function() {_this.dataTable.updateTable();}};

            // This will raise the dialog if it has been created already
            DialogManager.create(dialogOption);
          }
        });

        jRoot.find(".table-view").on("reload", function() {
          _this.dataTable.updateTable();
        });

        jRoot.find(".table-view").on("add", function() {
          DialogManager.create({type: "ProductDialog", id: "new",
                               update: function() {_this.dataTable.updateTable();}});
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
        });

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
      }
    });
  };
});
