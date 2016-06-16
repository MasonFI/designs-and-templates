define(['jquery', 'jqueryui', 'ember', 'translate'],
       function($, jui, Ember, tr) {
  var dialog = "<div class='infoDialog dialog'>" +
                 "<div class='infoDialogContent'>{{{view.options.message}}}</div>" +
               "</div>";

  var InfoDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var infoDialog = this.$(".infoDialog");

      // JQuery UI takes the dialog element out. Mark it
      // by a class name that is this view's ID
      infoDialog.addClass(this.elementId);
      var dialogButtons = {};
      dialogButtons[tr("close")] = function() {
        $(this).dialog("close");
      };
      infoDialog.dialog({modal: true, buttons: dialogButtons});
      infoDialog.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        infoDialog.dialog("destroy");
        _this.destroy();
      });
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.message !== "undefined" &&
        options.message) {
      var infoDialog = InfoDialog.create({options: options});

      infoDialog.appendTo($("body"));

      return infoDialog;
    }
  }
});
