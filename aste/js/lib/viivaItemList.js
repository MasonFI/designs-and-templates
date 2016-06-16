define(['jquery', 'jqueryui', 'smartAdmin'], function($, jui) {
  var html = "<div class='jarviswidget item-list' " +
               "data-widget-colorbutton='false' data-widget-editbutton='false' " +
               "data-widget-togglebutton='false' data-widget-deletebutton='false' " +
               "data-widget-fullscreenbutton='false' data-widget-custombutton='false' "+
               "data-widget-sortable='false'>" +
               "<header><h2></h2>" +
                 "<div class='jarviswidget-ctrls'>" +
                   "<a href='javascript:void(0);' class='button-icon list-remove'><i class='fa fa-minus'></i></a>" +
                   "<a href='javascript:void(0);' class='button-icon list-add'><i class='fa fa-plus'></i></a>" +
                 "</div>" +
               "</header>" +
               "<div role='content'>" +
                 "<div class='widget-body'><ul class='dd'></ul></div>" +
               "</div>" +
             "</div>";

  return function() {
    var list = null;
    var options = null;
    var disabled = false;

    function itemSelect() {
      if (disabled) {
        return;
      }

      if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
      } else {
        $(this).siblings().removeClass("selected");
        $(this).addClass("selected");
      }

      if (options && typeof options.selectedFunc === "function" &&
          options.selectedFunc) {
        if ($(this).hasClass("selected")) {
          options.selectedFunc($(this).index());
        } else {
          options.selectedFunc(-1);
        }
      }
    }

    this.create = function(opt) {
      if (typeof opt !== "undefined" && opt &&
          typeof opt.container !== "undefined" && opt.container) {
        var _this = this;

        options = opt;

        list = $(html).appendTo(options.container);

        if (typeof options.title === "string" && options.title) {
          list.find("header h2").html(options.title);
        }

        if (typeof pageSetUp == "function") {
          pageSetUp(list);
        }

        if (typeof options.reorder === "undefined" || options.reorder) {
          list.find(".widget-body > ul").sortable({
            placeholder: "dd-placeholder",
            start: function(e, ui ){
              ui.placeholder.height(ui.helper.outerHeight());
            }
          });
        }

        list.find("header .jarviswidget-ctrls > .list-add").click(function(e) {
          var i = null;
          if (options.item !== "undefined" && options.item) {
            i = (new options.item).create();
          } else if (typeof options.itemFunc == "function" && options.itemFunc) {
            var r = options.itemFunc(e);
            if (typeof r === "string" && r) {
              i = $(r);
            } else if (typeof r !== "undefined" && r instanceof $) {
              i = r;
            }
          }

          if (i) {
            i.appendTo(list.find(".widget-body > ul"));

            if (disabled) {
              i.find("input, select").attr('disabled', 'disabled');
            } else {
              i.click(itemSelect);
            }
          }
        });

        list.find("header .jarviswidget-ctrls > .list-remove").click(function() {
          var index = list.find(".widget-body > ul > li.selected").index();

          if (index > -1) {
            if (options && typeof options.removeFunc === "function" &&
                options.removeFunc) {
              options.removeFunc(index);
            } else {
              _this.removeItem({index: index});
            }
          }
        });
      }
    };

    this.appendItems = function(params) {
      if (typeof params !== "undefined" && params && typeof params.items !== "undefined" &&
          params.items instanceof Array && params.items.length > 0) {
        var ul = list.find(".widget-body > ul");
        for (var i = 0; i < params.items.length; i++) {
          if (typeof params.items[i] === "string" || params.items[i] instanceof $) {
            var item = params.items[i] instanceof $ ? params.items[i] : $(params.items[i]);

            item.appendTo(ul);

            if (disabled) {
              item.find("input, select").attr('disabled', 'disabled');
            } else {
              item.click(itemSelect);
            }
          }
        }
      }
    };

    this.getItem = function(params) {
      if (typeof params !== "undefined" && params && typeof params.index === "number") {
        return list.find(".widget-body > ul > li").eq(params.index);
      }
    };

    this.getAllItems = function() {
      return list.find(".widget-body > ul > li");
    };

    this.removeItem = function(params) {
      if (typeof params !== "undefined" && params && typeof params.index === "number") {
        list.find(".widget-body > ul > li").eq(params.index).remove();

        if (options && typeof options.removedFunc === "function" &&
            options.removedFunc) {
          options.removedFunc(params.index);
        }
      }
    };

    this.enable = function() {
      disabled = false;
      list.find("header .jarviswidget-ctrls").show();
      list.find(".widget-body > ul input, .widget-body > ul select").removeAttr('disabled');
    };

    this.disable = function() {
      disabled = true;
      list.find("header .jarviswidget-ctrls").hide();
      list.find(".widget-body > ul input, .widget-body > ul select").attr('disabled', 'disabled');
    };
  };
});
