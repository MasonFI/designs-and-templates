define(['jquery', 'jqueryui', 'ember', 'analyticsWeekDialog', 'infoDialog', 'confirmDialog', 'profileDialog', 'customerDialog', 'contactDialog',
        'customerSelectionDialog', 'orderDialog', 'orderCancelConfirmDialog', 'productDialog', 'offerDialog', 'packageDialog',
        'offerSelectionDialog', 'packageSelectionDialog', 'packageConfigurationDialog', 'ruleSelectionDialog', 'ruleConditionDialog',
        'userDialog','customerServiceOrderCancelDialog','noteCreateDialog','customerServiceSecretOrderDialog', 'customerServiceOrderDialog', 'customerServiceInvoicePaymentDialog', 'resendConfirmDialog', 'CustomerServicePublishingScheduleBrowserDialog'],
       function($, jui, Ember, AnalyticsWeekDialog, InfoDialog, ConfirmDialog, ProfileDialog, CustomerDialog, ContactDialog,
                CustomerSelectionDialog, OrderDialog, OrderCancelConfirmDialog, ProductDialog, OfferDialog, PackageDialog,
                OfferSelectionDialog, PackageSelectionDialog, PackageConfigurationDialog, RuleSelectionDialog, RuleConditionDialog,
                UserDialog, CustomerServiceOrderCancelDialog, NoteCreateDialog, CustomerServiceSecretOrderDialog, CustomerServiceOrderDialog, CustomerServiceInvoicePaymentDialog, ResendConfirmDialog, CustomerServicePublishingScheduleBrowserDialog) {
  var dialogs = {
    "AnalyticsWeekDialog": {},
    "InfoDialog": {},
    "ConfirmDialog": {},
    "ProfileDialog": {},
    "CustomerDialog": {},
    "ContactDialog": {},
    "CustomerSelectionDialog": {},
    "OrderDialog": {},
    "OrderCancelConfirmDialog": {},
    "ProductDialog": {},
    "OfferDialog": {},
    "PackageDialog": {},
    "OfferSelectionDialog": {},
    "PackageSelectionDialog": {},
    "PackageConfigurationDialog": {},
    "RuleSelectionDialog": {},
    "RuleConditionDialog": {},
    "UserDialog": {},
    "CustomerServiceOrderCancelDialog": {},
    "NoteCreateDialog": {},
    "CustomerServiceSecretOrderDialog": {},
    "CustomerServiceOrderDialog": {},
    "CustomerServiceInvoicePaymentDialog": {},
    "ResendConfirmDialog": {},
    "CustomerServicePublishingScheduleBrowserDialog": {}
  };

  return {
    create: function(options) {
      if (typeof options !== "undefined" && options && typeof options.type === "string" &&
          typeof dialogs[options.type] !== "undefined" && typeof options.id !== "undefined" &&
          options.id) {
        var dialog = null; 
        if (typeof dialogs[options.type][options.id] !== "undefined") {
          // If dialog already exists, move it to top of the stack
          dialog = dialogs[options.type][options.id];
          // Callback dialog moveToTop if it exists
          if (typeof dialog.moveToTop === "function") {
            dialog.moveToTop(dialog, options);
          }
          $("#" + dialog.elementId).dialog("moveToTop")
                                   .siblings(".ui-dialog-titlebar")
                                   .effect("highlight", {color: '#3276b1', duration: 500});
        } else {
          // Create a new dialog when it doesn't exist
          switch(options.type) {
            case "AnalyticsWeekDialog":
              dialog = AnalyticsWeekDialog(options);
              break;
            case "InfoDialog":
              dialog = InfoDialog(options);
              break;
            case "ConfirmDialog":
              dialog = ConfirmDialog(options);
              break;
            case "ProfileDialog":
              dialog = ProfileDialog(options);
              break;
            case "CustomerDialog":
              dialog = CustomerDialog(options);
              break;
            case "ContactDialog":
              dialog = ContactDialog(options);
              break;
            case "CustomerSelectionDialog":
              dialog = CustomerSelectionDialog(options);
              break;
            case "OrderDialog":
              dialog = OrderDialog(options);
              break;
            case "OrderCancelConfirmDialog":
              dialog = OrderCancelConfirmDialog(options);
              break;
            case "ProductDialog":
              dialog = ProductDialog(options);
              break;
            case "OfferDialog":
              dialog = OfferDialog(options);
              break;
            case "PackageDialog":
              dialog = PackageDialog(options);
              break;
            case "OfferSelectionDialog":
              dialog = OfferSelectionDialog(options);
              break;
            case "PackageSelectionDialog":
              dialog = PackageSelectionDialog(options);
              break;
            case "PackageConfigurationDialog":
              dialog = PackageConfigurationDialog(options);
              break;
            case "RuleSelectionDialog":
              dialog = RuleSelectionDialog(options);
              break;
            case "RuleConditionDialog":
              dialog = RuleConditionDialog(options);
              break;
            case "UserDialog":
              dialog = UserDialog(options);
              break;
            case "CustomerServiceOrderCancelDialog":
              dialog = CustomerServiceOrderCancelDialog(options);
              break;
            case "NoteCreateDialog":
              dialog = NoteCreateDialog(options);
              break;
            case "CustomerServiceSecretOrderDialog":
              dialog = CustomerServiceSecretOrderDialog(options);
              break;
            case "CustomerServiceOrderDialog":
              dialog = CustomerServiceOrderDialog(options);
              break;
            case "CustomerServiceInvoicePaymentDialog":
              dialog = CustomerServiceInvoicePaymentDialog(options);
              break;
            case "ResendConfirmDialog":
              dialog = ResendConfirmDialog(options);
              break;
            case "CustomerServicePublishingScheduleBrowserDialog":
              dialog = CustomerServicePublishingScheduleBrowserDialog(options);
              break;
            default:
              return null;
          }

          if (dialog) {
            dialogs[options.type][options.id] = dialog;
          }

          dialog.onDestroy = function() {
            delete dialogs[options.type][options.id];
          };
        }

        return dialog;
      }
    },

    hasDialog: function(options) {
      if (typeof options !== "undefined" && options && typeof options.type === "string" &&
          typeof dialogs[options.type] !== "undefined" && typeof options.id !== "undefined" &&
          options.id) {
        if (typeof dialogs[options.type][options.id] !== "undefined") {
          return true;
        }
      }

      return false;
    }
  };
});
