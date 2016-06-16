define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaDataTable'],
       function($, jui, Ember, DP, tr, util, ViivaDataTable) {
  var dialog = "<div class='packageSelectionDialog dialog'>" +
                 "<div class='packageSelectionDialogContent ui-widget-content ui-corner-all'>" +
                 "</div>" +
               "</div>";
  var PackageSelectionDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var packageSelectionDialog = this.$(".packageSelectionDialog");

      var dataTable = new ViivaDataTable();
      dataTable.create({
        container: packageSelectionDialog.find(".packageSelectionDialogContent"),
        method: "package.get",
        colDefs: [
          {name: tr("packageID"), prop: "id", visible: false},
          {name: tr("productGroup"), prop: "group"},
          {name: tr("packageName"), prop: "name"},
          {name: tr("packageDescription"), prop: "description"},
          {name: tr("packageSalesStart"), prop: "start",
           render: function(data) {return util.parseDate(data)}},
          {name: tr("packageSalesEnd"), prop: "end",
           render: function(data) {return util.parseDate(data)}}
        ],
        onClick: function(row, data) {
          var currentActiveRow = packageSelectionDialog.find(".packageSelectionDialogContent .active");
          if (currentActiveRow !== row) {
            if (currentActiveRow.length > 0) {
              currentActiveRow.removeClass("active");
              dataTable.closeInfo({row: currentActiveRow.get(0)});
            }
            row.addClass("active");
            var infoID = "packageDetials-" + data.id;
            dataTable.openInfo({row: row.get(0), html: "<div id='" + infoID + "'></div>",
                               classes: "packageDetails"});

            DP.execute({type: "offer", method: "findByPackage", params: {package: data.id}})
              .then(function(offers) {
              var info = $(".dialog." + _this.elementId + " #" + infoID);
              if (info.length > 0) { // Make sure the info box hasn't been closed
                $.map(offers, function(offer) {
                  info.append("<h4>" + offer.name + "</h4>");
                  if (offer.pricePercentage !== null) {
                    info.append("<div>" + tr("offerPricePercentage", "capitalizefirst") + ": " +
                                offer.pricePercentage + "%" + "</div>");
                  } else {
                    info.append("<div>" + tr("offerFixedPrice", "capitalizefirst") + ": " + (offer.fixedPrice !== null ?
                                offer.fixedPrice : "-") + " €</div>");
                  }

                  if (offer.durationTo) {
                    info.append("<div>" + tr("offerDuration", "capitalizefirst") + ": " +
                                util.parseDate(offer.durationTo) + " " + tr("until") + "</div>");
                  } else {
                    info.append("<div>" + tr("offerDuration", "capitalizefirst") + ": " + (offer.duration ?
                                 offer.duration : "-") + " " + tr(offer.durationType) + "</div>");
                  }

                  info.append("<div>" + tr("offerPaymentType", "capitalizefirst") + ": " + (offer.paymentType ?
                              tr(offer.paymentType) : "-") + "</div>");
                });
              }
            });
          }
        },
        filterFn: function(data) {
          if (typeof data !== "undefined" && data) {
            data.push({name: "packages", value: ["dd5a91b3-5869-11e3-809c-00163ef4d609",
                                                 "be87bbf6-5869-11e3-809c-00163ef4d609",
                                                 "ee1505ef-5869-11e3-809c-00163ef4d609"]});
            return data;
          }

          return null;
        }
      });

      packageSelectionDialog.addClass(this.elementId);
      var dialogButtons = {};
      dialogButtons[tr("select")] = function() {
        var currentActiveRow = packageSelectionDialog.find(".packageSelectionDialogContent .active");
        if (currentActiveRow.length > 0) {
          var pkg = dataTable.getData(currentActiveRow.get(0));
          if (pkg && typeof pkg.id !== "undefined" && pkg.id &&
              typeof _this.packageSelected === "function") {
            _this.packageSelected(pkg.name, pkg.id);
          }
        }
        $(this).dialog("close");
      };
      dialogButtons[tr("close")] = function() {
        $(this).dialog("close");
      };
      packageSelectionDialog.dialog({minWidth: 600, minHeight: 450, modal: true, buttons: dialogButtons});
      packageSelectionDialog.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        packageSelectionDialog.dialog("destroy");
        _this.destroy();
      });
    }
  });

  return function(options) {
    var settings = {};
    if (typeof options !== "undefined" && options && typeof options.packageSelected === "function") {
      settings.packageSelected = options.packageSelected;
    }

    return PackageSelectionDialog.create(settings).appendTo($("body"));
  }
});
