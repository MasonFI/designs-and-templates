define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaDataTable'],
       function($, jui, Ember, DP, tr, util, ViivaDataTable) {
  var dialog = "<div class='packageConfigurationDialog dialog'>" +
                 "<div class='packageConfigurationDialogContent ui-widget-content ui-corner-all'>" +
                 "</div>" +
               "</div>";

  function checkEndConditionsFulfilled(view) {
    var displayedSelections = $(".dialog." + view.elementId + " .packageConfigurationDialogContent .packageRuleNode:visible");
    var selectionFulfilled = 0;

    // When all selection available have fullfilled their "all" rule. The end condition is then met.
    displayedSelections.each(function() {
      var nodeID = $(this).attr("id");

      if (typeof nodeID !== "undefined" && nodeID && typeof view.transitions[nodeID] !== "undefined" &&
          view.transitions[nodeID] && typeof view.transitions[nodeID]["all"] !== "undefined" && view.transitions[nodeID]["all"]) {
        var selected = $(this).children("input:checkbox:checked");

        if ((typeof view.transitions[nodeID]["all"].max !== "undefined" && selected.length > view.transitions[nodeID]["all"].max) ||
            (typeof view.transitions[nodeID]["all"].min !== "undefined" && selected.length < view.transitions[nodeID]["all"].min)) {
          return false;
        }
      }

      selectionFulfilled++;
    });

    if (selectionFulfilled === displayedSelections.length) {
      // All fulfilled
      return true;
    } else {
      return false;
    }
  }

  function getDisplayNodes(view, from, to) {
    var fromID = from.attr("id");

    if (typeof view.transitions[fromID] === "undefined") {
      // No rule set from this node, all allowed
      return to;
    } else {
      // Get currently selected nodes
      var selected =[];
      from.children("input:checkbox:checked").each(function () {
        var offerID = $(this).val();
        selected.push(offerID);
      });

      if (typeof view.transitions[fromID]["all"] !== "undefined") {
        // There is a general rule apply to all in the form of min or max
        if ((typeof view.transitions[fromID]["all"].min !== "undefined" &&
            selected.length < view.transitions[fromID]["all"].min) ||
            (typeof view.transitions[fromID]["all"].max !== "undefined" &&
            selected.length > view.transitions[fromID]["all"].max)) {
          // Failed the general rule
          return [];
        }
      }
      // Check through nodes against specific configuration
      var r = $.map(to, function(node) {
        var id = $(node).attr("id");

        if (typeof view.transitions[fromID][id] !== "undefined") {
          var transitionRule = view.transitions[fromID][id];

          // Have specific rule, check
          if ((typeof transitionRule.min !== "undefined" &&
              selected.length < transitionRule.min) ||
              (typeof transitionRule.max !== "undefined" &&
              selected.length > transitionRule.max)) {
            return null;
          }

          if (typeof transitionRule.match !== "undefined") {
            for (var i = 0; i < transitionRule.match.length; i++) {
              if ($.inArray(transitionRule.match[i], selected) === -1) {
                return null;
              }
            }
          }

          return node;
        } else {
          // Don't have a specific fule, qualified
          return node;
        }
      });

      return $(r);
    }
  }

  function renderRule(view, container, position, rule) {
    if (typeof container !== "undefined" && container &&
        typeof position !== "undefined" && position &&
        typeof rule !== "undefined" && rule) {
      if (rule.type === "selection" && typeof rule.from != "undefined" &&
          rule.from instanceof Array && rule.from.length > 0) {
        var sectionID = "ruleNode" + position;
        var section = $("<div class='packageRuleNode' id='" + sectionID + "'></div>");
        $.map(rule.from, function(item) {
          $("<input type='checkbox' value='" + item.id + "' id='" + position + "#" + item.id + "'>" +
              "<label for='" + position + "#" + item.id + "'>" + (typeof item.name !== "undefined" ? item.name : item.id) +
              "</label><br>").appendTo(section);
          var details = $("<div class='offerDetails'></div>").appendTo(section);

          DP.find({type: "offer", id: item.id}).then(function(record) {
            if (record.get("pricePercentage") !== null) {
              details.append("<div>" + tr("offerPricePercentage", "capitalizefirst") + ": " +
                             record.get("pricePercentage") + "%" + "</div>");
            } else {
              details.append("<div>" + tr("offerFixedPrice", "capitalizefirst") + ": " + (record.get("fixedPrice") !== null ?
                             record.get("fixedPrice") : "-") + " €</div>");
            }

            if (record.get("durationTo")) {
              details.append("<div>" + tr("offerDuration", "capitalizefirst") + ": " +
                             util.parseDate(record.get("durationTo")) + " " + tr("until") + "</div>");
            } else {
              details.append("<div>" + tr("offerDuration", "capitalizefirst") + ": " + (record.get("duration") ?
                             record.get("duration") : "-") + " " + tr(record.get("durationType")) + "</div>");
            }

            details.append("<div>" + tr("offerPaymentType", "capitalizefirst") + ": " + (record.get("paymentType") ?
                           tr(record.get("paymentType")) : "-") + "</div>");
          });
        });
        if (position === "0") {
          section.appendTo(container);
        } else {
          section.appendTo(container).hide();
        }
        section.change(function() {
          var childNodes = $(this).children(".packageRuleNode");

          if (childNodes.length > 0) {
            var currentDisplayNodes = childNodes.filter(":visible");
            var displayNodes = getDisplayNodes(view, $(this), childNodes);

            if (displayNodes.length > 0) {
              displayNodes.show();
              currentDisplayNodes.each(function(index, ele) {
                if ($.inArray(ele, displayNodes) < 0) {
                  $(ele).hide();
                }
              });
            } else {
              childNodes.hide();
            }
          }

          // Check against end condition
          if (checkEndConditionsFulfilled(view)) {
            $(".dialog." + view.elementId).siblings(".ui-dialog-buttonpane").find("button:eq(0)").button("enable");
          } else {
            $(".dialog." + view.elementId).siblings(".ui-dialog-buttonpane").find("button:eq(0)").button("disable");
          }
        });

        var r = {};
        if (typeof rule.min !== "undefined" && rule.min > -1) {
          r.min = rule.min;
        }
        if (typeof rule.max !== "undefined" && rule.max > -1) {
          r.max = rule.max;
        }

        if (typeof r.min !== "undefined" || typeof r.max !== "undefined") {
          if (typeof view.transitions[sectionID] === "undefined") {
            view.transitions[sectionID] = {};
          }
          view.transitions[sectionID]["all"] = r;
        }
      } else if (rule.type === "condition") {
        var r = {};
        if (typeof rule.min !== "undefined" && rule.min > -1) {
          r.min = rule.min;
        }
        if (typeof rule.max !== "undefined" && rule.max > -1) {
          r.max = rule.max;
        }
        if (typeof rule.match !== "undefined" && rule.match instanceof Array && rule.match.length > 0) {
          r.match = rule.match;
        }

        if (typeof r.min !== "undefined" || typeof r.max !== "undefined" || typeof r.match !== "undefined") {
          var containerID = container.attr("id");
          for (var i = 0; i < rule.children.length; i++) {
            var transitionTo = "ruleNode" + position + "_" + i;

            if (typeof view.transitions[containerID] === "undefined") {
              view.transitions[containerID] = {};
            }
            view.transitions[containerID][transitionTo] = r;
          }
        }
      } else {
        return;
      }

      if (typeof rule.children !== "undefined" && rule.children instanceof Array &&
          rule.children.length > 0) {
        for (var i = 0; i < rule.children.length; i++) {
          if (typeof section !== "undefined") {
            renderRule(view, section, position + "_" + i, rule.children[i]);
          } else {
            renderRule(view, container, position + "_" + i, rule.children[i]);
          }
        }
      }
    }
  }

  function _renderRules(view) {
    if (typeof view.configuration !== "undefined") {
      var container = $(".dialog." + view.elementId + " .packageConfigurationDialogContent");
      renderRule(view, container, "0", view.configuration);
    }
  }

  var PackageConfigurationDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    transitions: {},
    didInsertElement: function() {
      var _this = this;
      var packageConfigurationDialog = this.$(".packageConfigurationDialog");

      packageConfigurationDialog.addClass(this.elementId);
      var dialogButtons = {};
      dialogButtons[tr("confirm")] = function() {
        var selected = [];
        packageConfigurationDialog.find(".packageConfigurationDialogContent input:checkbox:checked:visible")
          .each(function () {
            var offerID = $(this).val();
            selected.push(offerID);
          });
        if (selected.length > 0 && typeof _this.options.configurationDone === "function") {
          _this.options.configurationDone(selected);
        }
        $(this).dialog("close");
      };
      dialogButtons[tr("close")] = function() {
        $(this).dialog("close");
      };
      packageConfigurationDialog.dialog({minWidth: 500, minHeight: 450, modal: true, buttons: dialogButtons});
      packageConfigurationDialog.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        packageConfigurationDialog.dialog("destroy");
        _this.destroy();
      });

      $(".dialog." + this.elementId).siblings(".ui-dialog-buttonpane").find("button:eq(0)").button("disable");

      if (typeof this.configuration !== "undefined" && this.configuration) {
        _renderRules(this)
      }
    },
    renderRules: function(view) {
      if ($(".dialog." + view.elementId).length > 0) {
        _renderRules(view);
      }
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.id !== "undefined") {
      var settings = {options: options};

      var packageConfigurationDialog = PackageConfigurationDialog.create(settings).appendTo($("body"));
      var pkg = DP.find({type: "package", id: options.id});
      pkg.then(function(data) {
        if (typeof data !== "undefined" && data && typeof data.get("configuration") !== "undefined" &&
            data.get("configuration")) {
          packageConfigurationDialog.configuration = JSON.parse(data.get("configuration"));
          packageConfigurationDialog.renderRules(packageConfigurationDialog);
        }
      });

      return packageConfigurationDialog;
    }
  }
});
