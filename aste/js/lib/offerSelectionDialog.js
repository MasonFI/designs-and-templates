define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaDataTable'],
       function($, jui, Ember, DP, tr, util, ViivaDataTable) {
  var dialog = "<div class='offerSelectionDialog dialog'>" +
                 "<div class='offerSelectionDialogContent ui-widget-content ui-corner-all'>" +
                 "</div>" +
               "</div>";
  var OfferSelectionDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var offerSelectionDialog = this.$(".offerSelectionDialog");

      var dataTable = new ViivaDataTable();
      dataTable.create({
        container: offerSelectionDialog.find(".offerSelectionDialogContent"),
        method: "offer.get",
        colDefs: [
          {name: tr("offerID"), prop: "id", visible: false},
          {name: tr("offerName"), prop: "name"},
          {name: tr("offerPrice") + " / " + tr("offerDiscount"), prop: "price"},
          {name: tr("offerDuration"), prop: "durationCalculated"},
          {name: tr("offerPaymentType"), prop: "paymentType",
            render: function(data) {return tr(data, "capitalizefirst");}}
        ],
        formatFn: function(data) {
          if (data.pricePercentage !== null) {
            data.price = data.pricePercentage + "%";
          } else if (data.fixedPrice !== null) {
            data.price = data.fixedPrice + " €";
          } else {
            data.price = "";
          }

          if (data.durationTo) {
            data.durationCalculated = util.parseDate(data.durationTo) + " " + tr("until");
          } else if (data.duration) {
            data.durationCalculated = data.duration + " " + tr(data.durationType);
          } else {
            data.durationCalculated = "";
          }

          return data;
        },
        onClick: function(row, data) {
          var currentActiveRow = offerSelectionDialog.find(".offerSelectionDialogContent .active");
          if (currentActiveRow !== row) {
            currentActiveRow.removeClass("active");
            row.addClass("active");
          }
        }
      });

      offerSelectionDialog.addClass(this.elementId);
      var dialogButtons = {};
      dialogButtons[tr("select")] = function() {
        var currentActiveRow = offerSelectionDialog.find(".offerSelectionDialogContent .active");
        if (currentActiveRow.length > 0) {
          var offer = dataTable.getData(currentActiveRow.get(0));
          if (offer && typeof offer.id !== "undefined" && offer.id &&
              typeof _this.offerSelected === "function") {
            _this.offerSelected(offer.id);
          }
        }
        $(this).dialog("close");
      };
      dialogButtons[tr("close")] = function() {
        $(this).dialog("close");
      };
      offerSelectionDialog.dialog({minWidth: 600, minHeight: 450, modal: true, buttons: dialogButtons});
      offerSelectionDialog.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        offerSelectionDialog.dialog("destroy");
        _this.destroy();
      });
    }
  });

  return function(options) {
    var settings = {};
    if (typeof options !== "undefined" && options && typeof options.offerSelected === "function") {
      settings.offerSelected = options.offerSelected;
    }

    return OfferSelectionDialog.create(settings).appendTo($("body"));
  }
});
