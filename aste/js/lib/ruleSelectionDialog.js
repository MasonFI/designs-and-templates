define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaListBox'], function($, jui, Ember, DP, tr, ViivaListBox) {
  var dialog = "<div class='ruleSelectionDialog dialog'>" +
                 "<div class='ruleSelectionDialogContent'><h2>" + tr("selectRules") + "</h2>" +
                  "<div class='unselectedRuleListingBoxContainer ruleListingBoxContainer'>" +
                  "<h2>" + tr("unselectedRules") + "</h2><div class='ruleListingBoxContainerInner'>" +
                  "</div></div>" +
                  "<div class='ruleSwitcherButtons'><h2>&nbsp;</h2>" +
                    "<button class='button' id='removeRuleSelection'>&lt;</button><br />" +
                    "<button class='button' id='addRuleSelection'>&gt;</button>" +
                  "</div>" +
                  "<div class='selectedRuleListingBoxContainer ruleListingBoxContainer'>" +
                  "<h2>" + tr("selectedRules") + "</h2><div class='ruleListingBoxContainerInner'>" +
                  "</div></div>" +
                  "<hr />"+
                  "<table><tr><td>Vähintään</td><td><input type='text' size='2' /></td></tr>" +
                  "<tr><td>Enintään</td><td><input type='text' size='2' /></td></tr></table>" +                     
                 "</div>" +
                 "<div class='controls'>" +
                  "<button class='button dialogSave' onclick=\"$(this).closest('.ruleSelectionDialog').dialog('close');\">" + tr("save") + "</button>" +
                  "<button class='button dialogClose' onclick=\"$(this).closest('.ruleSelectionDialog').dialog('close');\">" + tr("close") + "</button>" +
                 "</div>" +
               "</div>";
  var RuleSelectionDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var ruleSelectionDialog = this.$(".ruleSelectionDialog");

      // Initialize JQuery widgets
      ruleSelectionDialog.find(".button").button();

      var selectedOffersListBox = new ViivaListBox();
      this.$(".selectedRuleListingBoxContainer .ruleListingBoxContainerInner").append(selectedOffersListBox.create({items: [
        {name: "bar"},
        {name: "foo"},
      ]}).bind("change", function() {}));

      var unselectedOffersListBox = new ViivaListBox();
      this.$(".unselectedRuleListingBoxContainer .ruleListingBoxContainerInner").append(unselectedOffersListBox.create({items: [
        {name: "123"},
        {name: "qqq"},
        {name: "aaa"},
        {name: "a1a1"},
        {name: "b1b1"}
      ]}).bind("change", function() {}));
      
      this.$("#addRuleSelection").click(function() {
        var selected = unselectedOffersListBox.getList();
        if (selected.length > 0) {
          var rules = $('.unselectedRuleListingBoxContainer .viivaListBox').children();
          for (var i = 0; i < selected.length; i++) {
            $('.selectedRuleListingBoxContainer .viivaListBox').append(rules[selected[i]]);
          }
        }
      });

      this.$("#removeRuleSelection").click(function() {
        var selected = selectedOffersListBox.getList();
        if (selected.length > 0) {
          var rules = $('.selectedRuleListingBoxContainer .viivaListBox').children();
          for (var i = 0; i < selected.length; i++) {
            $('.unselectedRuleListingBoxContainer .viivaListBox').append(rules[selected[i]]);
          }
        }
      });
      
      ruleSelectionDialog.addClass(this.elementId);
      ruleSelectionDialog.dialog({minWidth: 450, minHeight: 400, modal: true});
      ruleSelectionDialog.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        ruleSelectionDialog.dialog("destroy");
        _this.destroy();
      });
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.id !== "undefined") {
      /*var ctrlr = DP.find({type: "profile", id: options.id});*/

      var ruleSelectionDialog = RuleSelectionDialog.create();

      ruleSelectionDialog.appendTo($("body"));

      return ruleSelectionDialog;
    }
  }
});
