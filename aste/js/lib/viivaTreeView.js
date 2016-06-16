define(['jquery'], function($) {
  return function() {
    var tree = null;
    var data = null;

    function itemClicked() {
      if (!$(this).hasClass("ui-state-highlight")) {
        $(this).closest(".viivaTreeView").find("div.ui-state-highlight").removeClass("ui-state-highlight");
        $(this).addClass("ui-state-highlight");
        tree.trigger("change");
      }
    }

    this.create = function(options) {
      // Node object should have follwing strcuture:
      // {
      //   label: "",
      //   type: "",
      //   rule: {},
      //   children []
      // }
      if (typeof options !== "undefined" && options &&
          typeof options.data !== "undefined" && options.data instanceof Array &&
          options.data.length > 0) {
        tree = $("<div class='viivaTreeView'></div>");
        data = options.data;

        if (typeof options.id === "string" && options.id) {
          tree.attr("id", options.id);
        }

        if (typeof options.classes === "string" && options.classes) {
          tree.addClass(options.classes);
        }

        function constructNodes(data) {
          if (typeof data !== "undefined" && data instanceof Array &&
              data.length > 0) {
            var structure = $("<ul></ul>");
            $.each(data, function(index, value) {
              if (typeof value.type === "string" && (value.type === "selection" ||
                  value.type === "condition") && typeof value.rule !== "undefined" &&
                  value.rule) {
                var item = $("<li></li>");
                if (typeof value.label === "string" && value.label) {
                  item.append("<div class='" + value.type + "'>" + value.label + "</div>");
                }

                if (typeof value.children !== "undefined" &&
                    value.children instanceof Array && value.children.length > 0) {
                  substructure = constructNodes(value.children);
                  if (substructure) {
                  item.append(substructure);
                  }
                }

                structure.append(item);
              }
            });

            return structure;
          } else {
            return null;
          }
        }

        structure = constructNodes(options.data);
        if (structure) {
          structure.appendTo(tree);
        }

        tree.find("div").click(itemClicked);

        return tree;
      }
    };

    this.getSelectedNode = function() {
      if (tree) {
        var selected = tree.find("div.ui-state-highlight");

        if (selected.length) {
          return selected.first();
        } else {
          return null;
        }
      } else {
        return null;
      }
    };

    this.getNodeCount = function() {
      if (tree) {
        return tree.find("div").length;
      } else {
        return 0;
      }
    };

    this.changeNode = function(params) {
      if (tree && typeof params !== "undefined" && params &&
          typeof params.data !== "undefined" && params.data) {
        var target = null;

        if (typeof params.target !== "undefined" && params.target &&
            params.target instanceof jQuery && tree.find(params.target).length) {
          target = params.target;
        } else {
          target = this.getSelectedNode();
        }

        if (target) {
          if (typeof params.data.label === "string" && params.data.label) {
            target.html(params.data.label);
          }
        }
      }
    };

    this.deleteNode = function(params) {
      if (tree) {
        var target = null;

        if (typeof params !== "undefined" && params && typeof params.target !== "undefined" &&
            params.target && params.target instanceof jQuery && tree.find(params.target).length) {
          target = params.target;
        } else {
          target = this.getSelectedNode();
        }

        if (target) {
          // Remove li
          var li = target.closest("li");
          if (li.length) {
            var ul = li.closest("ul");
            li.remove();

            // Remove the ul if this was the last li
            if (ul.find("li").length == 0) {
              ul.remove();
            }
          }
        }
      }
    };

    this.addChild = function(params) {
      if (tree && typeof params !== "undefined" && params &&
          typeof params.data !== "undefined" && params.data &&
          typeof params.data.type === "string" && (params.data.type === "selection" ||
          params.data.type === "condition")) {
        var target = null;

        if (typeof params.target !== "undefined" && params.target &&
            params.target instanceof jQuery && tree.find(params.target).length) {
          target = params.target;
        } else {
          target = this.getSelectedNode();
        }

        if (target) {
          var children = target.siblings("ul:eq(0)");
          var parent = target.parent();

          if (children.length || parent.length) {
            if (typeof params.data.label === "string" && params.data.label) {
              var item = $("<li></li>").append($("<div class='" + params.data.type +"'>" +
                           params.data.label + "</div>").click(itemClicked));
            }

            if (children.length) {
              item.appendTo(children);
            } else{
              $("<ul></ul>").append(item).appendTo(parent);
            }
          }
        }
      }
    };
  };
});
