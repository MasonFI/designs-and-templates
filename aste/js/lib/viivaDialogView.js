define(['ember'], function(Ember) {
  return Ember.View.extend({
    init: function() {
      this._super();

      controller = this.get('controller');
      if (controller && controller.toString().indexOf("DS.PromiseObject") >= 0 &&
          typeof this.didFulfillPromise === "function") {
        var callback = this.didFulfillPromise;
        var view = this;
        controller.then(function(obj) {
          callback(view, obj);
        });
      }
    }
  });
});
