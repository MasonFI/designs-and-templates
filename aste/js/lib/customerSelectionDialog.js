define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaDataTable'],
       function($, jui, Ember, DP, tr, ViivaDataTable) {
  var dialog = "<div class='customerSelectionDialog dialog'>" +
                 "<div class='customerSelectionDialogContent ui-widget-content ui-corner-all'>" +
                 "</div>" +
               "</div>";
  var CustomerSelectionDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var customerSelectionDialog = this.$(".customerSelectionDialog");

      var dataTable = new ViivaDataTable();
      dataTable.create({
        container: customerSelectionDialog.find(".customerSelectionDialogContent"),
        method: "account.get",
        colDefs: [
          {name: tr("customerID"), prop: "id", visible: false},
          {name: tr("customerName"), prop: "name"},
          {name: tr("customerNumber"), prop: "customerNumber"},
          {name: tr("customerEmail"), prop: "email"}
        ],
        onClick: function(row, data) {
          var currentActiveRow = customerSelectionDialog.find(".customerSelectionDialogContent .active");
          if (currentActiveRow !== row) {
            currentActiveRow.removeClass("active");
            row.addClass("active");
          }
        }
      });

      customerSelectionDialog.addClass(this.elementId);
      var dialogButtons = {};
      dialogButtons[tr("select")] = function() {
        var currentActiveRow = customerSelectionDialog.find(".customerSelectionDialogContent .active");
        if (currentActiveRow.length > 0) {
          var customer = dataTable.getData(currentActiveRow.get(0));
          if (customer && typeof customer.id !== "undefined" && customer.id &&
              typeof _this.customerSelected === "function") {
            _this.customerSelected(customer.email, customer.id);
          }
        }
        $(this).dialog("close");
      };
      dialogButtons[tr("close")] = function() {
        $(this).dialog("close");
      };
      customerSelectionDialog.dialog({minWidth: 650, minHeight: 450, modal: true, buttons: dialogButtons});
      customerSelectionDialog.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        customerSelectionDialog.dialog("destroy");
        _this.destroy();
      });
    }
  });

  return function(options) {
    var settings = {};
    if (typeof options !== "undefined" && options && typeof options.customerSelected === "function") {
      settings.customerSelected = options.customerSelected;
    }

    return CustomerSelectionDialog.create(settings).appendTo($("body"));
  };

});
