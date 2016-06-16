define(['jquery', 'jqueryui', 'ember', 'translate'],
       function($, jui, Ember, tr) {
  var dialog = "<div>" +
                 "<p>{{{view.options.message}}}</p>" +
                 "<div class='smart-form'>" +
                   "<section>" +
                     "<label class='label'>" + tr("orderCancelSource") + "</label>" +
                     "<div class='select'>" +
                       "<select class='orderCancelSource'>" +
                         "<option value='AP'>" + tr("cancelSourceCustomerPhone", "capitalizefirst") + "</option>" +
                         "<option value='AF'>" + tr("cancelSourceCustomerFax", "capitalizefirst") + "</option>" +
                         "<option value='AK'>" + tr("cancelSourceCustomerLetter", "capitalizefirst") + "</option>" +
                         "<option value='AS'>" + tr("cancelSourceCustomerEmail", "capitalizefirst") + "</option>" +
                         "<option value='AT'>" + tr("cancelSourceCustomerInternet", "capitalizefirst") + "</option>" +
                         "<option value='LK'>" + tr("cancelSourceMagazineCancel", "capitalizefirst") + "</option>" +
                         "<option value='LL'>" + tr("cancelSourceMagazineStop", "capitalizefirst") + "</option>" +
                         "<option value='MH'>" + tr("cancelSourcePaymentProblem", "capitalizefirst") + "</option>" +
                         "<option value='MF'>" + tr("cancelSourceSellerFax", "capitalizefirst") + "</option>" +
                         "<option value='MK'>" + tr("cancelSourceSellerLetter", "capitalizefirst") + "</option>" +
                         "<option value='MP'>" + tr("cancelSourceSellerPhone", "capitalizefirst") + "</option>" +
                         "<option value='MS'>" + tr("cancelSourceSellerEmail", "capitalizefirst") + "</option>" +
                         "<option value='MT'>" + tr("cancelSourceSellerCannon", "capitalizefirst") + "</option>" +
                         "<option value='PA'>" + tr("cancelSourceServiceAutomat", "capitalizefirst") + "</option>" +
                         "<option value='PK'>" + tr("cancelSourceServiceCard", "capitalizefirst") + "</option>" +
                         "<option value='PP'>" + tr("cancelSourcePostalReturn", "capitalizefirst") + "</option>" +
                         "<option value='TL'>" + tr("cancelSourceOutOfProduct", "capitalizefirst") + "</option>" +
                         "<option value='TP'>" + tr("cancelSourceTechnicalCancel", "capitalizefirst") + "</option>" +
                       "</select><i></i>" +
                     "</div>" +
                   "</section>" +
                   "<section>" +
                     "<label class='label'>" + tr("orderCancelReason", "capitalizefirst") + "</label>" +
                     "<div class='select'>" +
                       "<select class='orderCancelReason'>" +
                      "<option value='K'>" + tr("widgetK", "capitalizefirst") + "</option>" +
                      "<option value='L'>" + tr("widgetL", "capitalizefirst") + "</option>" +
                      "<option value='O'>" + tr("widgetO", "capitalizefirst") + "</option>" +
                      "<option value='P'>" + tr("widgetP", "capitalizefirst") + "</option>" +
                      "<option value='S'>" + tr("widgetS", "capitalizefirst") + "</option>" +
                      "<option value='T'>" + tr("widgetT", "capitalizefirst") + "</option>" +
                      "<option value='V'>" + tr("widgetV", "capitalizefirst") + "</option>" +
                      "<option value='X'>" + tr("widgetX", "capitalizefirst") + "</option>" +
                       "</select><i></i>" +
                     "</div>" +
                   "</section>" +
                 "</div>" +
               "</div>";

  var ConfirmDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = _this.$("").addClass("order-cancel-confirm-dialog");

      // JQuery UI takes the dialog element out. Mark it
      // by a class name that is this view's ID
      var dialogButtons = [{
        html: tr("yes"),
        "class": "btn btn-primary",
        click: function() {
          _this.options.yes(jRoot.find(".orderCancelSource").val(),
                            jRoot.find(".orderCancelReason").val());
          $(this).dialog("close");
        }
      }, {
        html: tr("no"),
        "class": "btn btn-default",
        click: function() {
          if (typeof _this.options.no === "function" && _this.options.no) {
            _this.options.no();
          }
          $(this).dialog("close");
        }
      }];
      jRoot.dialog({title: tr("cancelOrder"), modal: true, draggable: false,
                    resizable: false, buttons: dialogButtons});
      jRoot.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        jRoot.dialog("destroy");
        _this.destroy();
      });
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.message !== "undefined" &&
        options.message && typeof options.yes === "function" && options.yes) {
     return ConfirmDialog.create({options: options}).appendTo($("body"));
    }
  }
});
