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
        view.create({title: tr("offers"), flags: view.SETTINGS |
                     view.RELOAD | view.ADD, container: jRoot});

        _this.dataTable = new ViivaDataTable();
        _this.dataTable.create({
          container: jRoot.find(".table-body"),
          method: "offer.get",
          onProcessing: function(processing) {
            view.toggleReload(processing);
          },
          colDefs: [
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
            // This will raise the dialog if it has been created already
            //DialogManager.create(dialogOption);
          }
        });

        jRoot.find(".table-view").on("reload", function() {
          _this.dataTable.updateTable();
        });

        jRoot.find(".table-view").on("add", function() {
          DialogManager.create({type: "OfferDialog", id: "new", product: "foo", revision: 0});
        });

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
      }
    });
  };
});
