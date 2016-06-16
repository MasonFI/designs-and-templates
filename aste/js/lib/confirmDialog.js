define(['jquery', 'jqueryui', 'ember', 'translate', 'viivaDialog'],
       function($, jui, Ember, tr) {

         /*
          title: '',
          message: '',
          yes: function() {},
          no: function(){},
          */

  var dialog = "<div>{{{view.options.message}}}</div>";

  var ConfirmDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = this.$("");

      var dialogButtons = [{
        html: tr("yes"),
        "class": "btn btn-primary",
        click: function() {
          _this.options.yes();
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
      jRoot.dialog({modal: true, draggable: false, resizable: false,
                    title: typeof _this.options.title === "string" ?
                    _this.options.title : null, buttons: dialogButtons});
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
