define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaDialogView',
    'viivaItemList', 'offerItem', 'offerRequirement', 'viivaDialog', 'smartAdmin'],
    function($, jui, Ember, DP, tr, util, ViivaDialogView, ViivaItemList, OfferItem, OfferRequirement) {
      var dialog = "<section>" +
        "<div class='row'>" +
        "<div class='col-xs-5 smart-form'>" +
        "<label class='label'>" + tr("offerName") + "</label><div class='input'><input type='text'></div>" +
        "</div>" +
        "<div class='col-xs-4 smart-form'>" +
        "<label class='label'>" + tr("product") + "</label>" +
        "<select class='select2' data-no-match='" + tr("noResult", "capitalizefirst") + "'>" +
        "<optgroup label='Suomen Kuvalehti'>" +
        "<option value='SKD'>SK Digi</option>" +
        "<option value='SKP'>SK Printti</option>" +
        "</optgroup>" +
        "<optgroup label='Golf Digest'>" +
        "<option value='GDD'>GD Digi</option>" +
        "<option value='GDP'>GD Printti</option>" +
        "</optgroup>" +
        "</select>" +
        "</div>" +
        "<div class='col-xs-3 smart-form'>" +
        "<label class='label'>" + tr("offerAddressCollection") + "</label><div class='input'><input type='text'></div>" +
        "</div>" +
        "</div>" +
        "<div class='row'>" +
        "<div class='col-xs-6 form-group card-items'>" +
        "</div>" +
        "<div class='col-xs-6 form-group paper-items'>" +
        "</div>" +
        "</div>" +
        "</section>" +
        "<section>" +
        "<div class='col-xs-6 smart-form'>" +
        "<section>" +
        "<label class='label'>" + tr("offerReceiptInfo") + "</label>" +
        "<div class='textarea'><textarea rows='8'></textarea></div>" +
        "</section>" +
        "<section>" +
        "<label class='label'>" + tr("offerExtraDescription") + "</label>" +
        "<div class='textarea'><textarea rows='8'></textarea></div>" +
        "</section>" +
        "</div>" +
        "<div class='col-xs-6 offer-requirements'>" +
        "</div>" +
        "</section>";

      var OfferDialog = ViivaDialogView.extend({
        template: Ember.Handlebars.compile(dialog),
        didInsertElement: function() {
          var _this = this;
          var jRoot = _this.$("").addClass("offer-dialog");

          var oList1 = new ViivaItemList();
          oList1.create({title: tr("cardPayment"), container: jRoot.find(".card-items"), item: OfferItem});

          var oList2 = new ViivaItemList();
          oList2.create({title: tr("paperPayment"), container: jRoot.find(".paper-items"), item: OfferItem});

          var rList = new ViivaItemList();
          rList.create({title: tr("lekaRequirements"), container: jRoot.find(".offer-requirements"),
            reorder: false, item: OfferRequirement});

          var dialogButtons = [];
          /*
             dialogButtons.push({
             html: "<i class='fa fa-trash-o'></i> " + tr("remove"),
             "class": "btn btn-danger",
             click: function() {
             $(this).dialog("close");
             }
             });
             */
          dialogButtons.push({
            html: "<i class='fa fa-save'></i> " + tr("save", "capitalizefirst"),
            "class": "btn btn-primary",
            click: function() {
              $(this).dialog("close");
            }
          });
          dialogButtons.push({
            html: tr("close"),
            "class": "btn btn-default",
            click: function() {
              $(this).dialog("close");
            }
          });
          jRoot.dialog({minWidth: 780, minHeight: 500,
            title: typeof _this.newOffer !== "undefined" && _this.newOffer ?
              tr("newOffer") : tr("offer"),
            buttons: dialogButtons,
            tabs: [{title: tr("basicInfo")}, {title: tr("extraInfo")}]});
          jRoot.on('dialogclose', function() {
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
          //      if (options.id === "new") {
          //        var ctrlr = DP.find({type: "offer", id: options.id});

          var offerDialog = OfferDialog.create({controller: {}, options: options, newOffer: true});
          //      }

          offerDialog.appendTo($("body"));

          return offerDialog;
        }
      };
      /*
         var dialog = "<div class='offerDialog dialog'>" +
         "<div class='offerDialogContent  ui-widget-content ui-corner-all'>" +
         "<div>" +
         "<div class='label'>" + tr("offerName") + "</div>" +
         "<div class='inputFields'>{{input type='text' value=name}}" +
         "{{#if view.newOffer}} <span class='mandatory'>*</span>{{/if}}</div>" +
         "<div class='clear'></div>" +
         "</div>" +
         "<div>" +
         "<div class='label'>" + tr("productOrderType") + "</div>" +
         "<div class='inputFields'>" + util.paymentTypeSelectHTML + "</div>" +
         "<div class='clear'></div>" +
         "</div>" +
         "<div>" +
         "<div style='display: inline-block;'>" +
         "<div class='label'>" + tr("offerFixedPrice") + "</div>" +
         "<div class='inputFields'>{{input type='number' value=fixedPrice}}</div>" +
         "</div> " +
         tr("or") +
         " <div style='display: inline-block;'>" +
         "<div class='label'>" + tr("offerDiscount") + "</div>" +
         "<div class='inputFields'>{{input type='number' value=pricePercentage}}</div>" +
         "</div>" +
         "{{#if view.newOffer}} <span class='mandatory'>*</span>{{/if}}" +
         "<div class='clear'></div>" +
         "</div>" +
         "<div>" +
         "<div class='label'>" + tr("offerDuration") + "</div>" +
         "<div class='inputFields'>{{input type='number' value=duration}} " + tr("months") +
         "<div class='clear'></div>" +
         "</div>" +
         "<div class='offerSalesTime'>" +
         "<div class='label'>" + tr("offerSalesTime") + "</div>" +
         "<div class='inputFields'><input class='datepicker start'> - <input class='datepicker end'></div>" +
         "<div class='clear'></div>" +
         "</div>" +
         "<div>" +
         "<div class='label'>" + tr("offerReceiptInfo") + "</div>" +
         "<div class='inputFields'>{{textarea value=receiptInfo}}</div>" +
         "<div class='clear'></div>" +
         "</div>" +
         "<div>" +
         "<div class='label'>" + tr("offerExtraDescription") + "</div>" +
         "<div class='inputFields'>{{textarea value=extraDescription}}</div>" +
         "<div class='clear'></div>" +
         "</div>" +
         "</div>" +
         "</div>";

         var OfferDialog = ViivaDialogView.extend({
         template: Ember.Handlebars.compile(dialog),
         didInsertElement: function() {
         var _this = this;
         var offerDialog = this.$(".offerDialog");

// Initialize JQuery widgets
offerDialog.find(".button").button();
offerDialog.find("input.datepicker").datepicker();
offerDialog.find("input.datepicker.start").change(function() {
var startDate = $(this).datepicker("getDate");
$(this).siblings("input.datepicker.end").datepicker("option", "minDate", startDate);
});

if (typeof this.controller.isFulfilled !== "undefined" && this.controller.isFulfilled) {
var from = this.controller.content.get("durationFrom");
if (from) {
offerDialog.find(".offerSalesTime input.datepicker.start").datepicker("setDate", from);
}
var to = this.controller.content.get("durationTo");
if (to) {
      offerDialog.find(".offerSalesTime input.datepicker.end").datepicker("setDate", to);
    }
offerDialog.find("select[name='paymentType']").val(this.controller.content.get("paymentType"));
}

// Listen to specific widgets to update controller
offerDialog.find(".offerSalesTime input.datepicker.start").change(function() {
  if (typeof _this.controller.set === "function") {
    _this.controller.set("durationFrom", $(this).datepicker("getDate"));
  }
});
offerDialog.find(".offerSalesTime input.datepicker.end").change(function() {
  if (typeof _this.controller.set === "function") {
    _this.controller.set("durationTo", util.endOfDay($(this).datepicker("getDate")));
  }
});
offerDialog.find("select[name='paymentType']").change(function() {
  if (typeof _this.controller.set === "function") {
    _this.controller.set("paymentType", $(this).val());
  }
});

offerDialog.addClass(this.elementId);
var dialogButtons = [];
if (typeof this.newOffer !== "undefined" && this.newOffer) {
  dialogButtons.push({
    text: tr("save"),
    click: function() {
      var dialog = $(this);
      _this.controller.save().then(function() {
        if (typeof _this.options.update === "function" && _this.options.update) {
          _this.options.update();
        }
        dialog.dialog("close");
      });
    }
  });
} else {
  var style = "display: none;";
  if (typeof this.controller.isFulfilled !== "undefined" &&
      this.controller.isFulfilled && this.controller.content.get("editable")) {
    style = "";
  }
  dialogButtons.push({
    text: tr("remove"),
    "class": "editableButton",
    style: style,
    click: function() {
      var dialog = $(this);
      var record = _this.controller.get("content");
      record.deleteRecord();
      record.save().then(function() {
        if (typeof _this.options.update === "function" && _this.options.update) {
          _this.options.update();
        }
        dialog.dialog("close");
      });
    }
  });
  dialogButtons.push({
    text: tr("save"),
    "class": "editableButton",
    style: style,
    click: function() {
      var dialog = $(this);
      _this.controller.get("content").save().then(function() {
        if (typeof _this.options.update === "function" && _this.options.update) {
          _this.options.update();
        }
        dialog.dialog("close");
      });
    }
  });
}
dialogButtons.push({
  text: tr("close"),
  click: function() {
    $(this).dialog("close");
  }
});
offerDialog.dialog({minWidth: 450, minHeight: 400, modal: true, buttons: dialogButtons});
offerDialog.on('dialogclose', function() {
  if (typeof _this.onDestroy === "function" && _this.onDestroy){
    _this.onDestroy();
  }
  offerDialog.dialog("destroy");
  _this.destroy();
});
},
  didFulfillPromise: function(view) {
    var from = view.controller.content.get("durationFrom");
    if (from) {
      $(".dialog." + view.elementId + " .offerSalesTime input.datepicker.start").datepicker("setDate", from);
    }
    var to = view.controller.content.get("durationTo");
    if (to) {
      $(".dialog." + view.elementId + " .offerSalesTime input.datepicker.end").datepicker("setDate", to);
    }
    $(".dialog." + view.elementId + " select[name='paymentType']").val(view.controller.content.get("paymentType"));
    if (view.controller.content.get("editable")) {
      $(".dialog." + view.elementId).parent().find(".editableButton").show();
    }
  }
});

return function(options) {
  if (typeof options !== "undefined" && options && typeof options.id !== "undefined") {
    if (options.id === "new") {
      if (typeof options.product !== "undefined" && options.product) {
        var data = {product: options.product};
        if (typeof options.revision !== "undefined") {
          data.revision = options.revision;
        }
        var offerDialog = OfferDialog.create({controller: DP.create({type: "offer",
          data: data}), newOffer: true, options: options});
      } else {
        return null;
      }
    } else {
      var ctrlr = DP.find({type: "offer", id: options.id});

      var offerDialog = OfferDialog.create({controller: ctrlr, options: options});
    }

    offerDialog.appendTo($("body"));

    return offerDialog;
  }
}
*/
});
