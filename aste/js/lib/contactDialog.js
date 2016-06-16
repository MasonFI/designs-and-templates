define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility'],
       function($, jui, Ember, DP, tr, util) {
  var dialog = "<div class='contactDialog dialog'>" +
                 "<div class='contactDialogContent ui-widget-content ui-corner-all'>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerFirstName") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=givenName}} <span class='mandatory'>*</span></div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerLastName") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=familyName}} <span class='mandatory'>*</span></div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerMobile") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=mobile}}</div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerPhone") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=phone}}</div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerEmail") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=email}} <span class='mandatory'>*</span></div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerAddress") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=address}} <span class='mandatory'>*</span></div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerPostalCode") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=postCode}} <span class='mandatory'>*</span></div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerCity") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=city}} <span class='mandatory'>*</span></div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerCountry") + ":</div>" +
                     "<div class='inputFields'>" + util.countryCodeSelectHTML + " <span class='mandatory'>*</span></div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                   "<div>" +
                     "<div class='label'>" + tr("customerCompany") + ":</div>" +
                     "<div class='inputFields'>{{input type='text' value=company}}</div>" +
                     "<div class='clear'></div>" +
                   "</div>" +
                 "</div>" +
               "</div>";

  var ContactDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var contactDialog = this.$(".contactDialog");

      contactDialog.find("select[name='country']").change(function() {
        _this.controller.set("country", $(this).val());
      });
      // JQuery UI takes the dialog element out. Mark it
      // by a class name that is this view's ID
      contactDialog.addClass(this.elementId);
      var dialogButtons = {};
      dialogButtons[tr("save")] = function() {
        if (typeof _this.controller._attributes !== "undefined") {
          if (typeof _this.controller._attributes["givenName"] !== "undefined" && _this.controller._attributes["givenName"] &&
              typeof _this.controller._attributes["familyName"] !== "undefined" && _this.controller._attributes["familyName"] &&
              typeof _this.controller._attributes["email"] !== "undefined" && _this.controller._attributes["email"] &&
              typeof _this.controller._attributes["address"] !== "undefined" && _this.controller._attributes["address"] &&
              typeof _this.controller._attributes["postCode"] !== "undefined" && _this.controller._attributes["postCode"] &&
              typeof _this.controller._attributes["city"] !== "undefined" && _this.controller._attributes["city"] &&
              typeof _this.controller._attributes["country"] !== "undefined" && _this.controller._attributes["country"]) {
            if (typeof _this.options !== "undefined" && _this.options) {
              if ((typeof _this.options.save === "undefined" || _this.options.save) &&
                  (typeof _this.options.customer !== "undefined" && _this.options.customer)) {
                // Push the contact to the server
                _this.controller.save().then(function(record) {
                  _this.options.contactCreated(record);
                });
              } else if (typeof _this.options.contactCreated === "function") {
                _this.options.contactCreated(_this.controller._attributes);
              }
            }
          } else {
            require("dialogManager").create({type: "InfoDialog", id: "info", message: tr("contactMissingMandatoryField")});
            return;
          }
        }
        $(this).dialog("close");
      };
      dialogButtons[tr("close")] = function() {
        $(this).dialog("close");
      };
      contactDialog.dialog({width: 360, height: 415, resizable: false,
                            modal: true, buttons: dialogButtons});
      contactDialog.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        contactDialog.dialog("destroy");
        _this.destroy();
      });
    }
  });

  return function(options) {
    var settings = {};
    var data = {country: "FI"};

    // Currently used exclusively for creating a contact
    if (typeof options !== "undefined" && options) {
      settings["options"] = options;

      if (typeof options.customer !== "undefined" && options.customer) {
        data["account"] = options.customer;
      }

      if (typeof options.email !== "undefined" && options.email) {
        data["email"] = options.email;
      }
    }

    settings["controller"] = DP.create({type: "contact", data: data});

    return ContactDialog.create(settings).appendTo($("body"));
  }
});
