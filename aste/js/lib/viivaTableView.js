define(['jquery', 'jqueryui', 'smartAdmin'], function($, jui, SA) {
  var view = "<div class='row table-view'><article class='col-xs-12'>" +
               "<div class='jarviswidget' " +
                 "data-widget-colorbutton='false' data-widget-editbutton='false' " +
                 "data-widget-togglebutton='false' data-widget-deletebutton='false' " +
                 "data-widget-fullscreenbutton='false' data-widget-custombutton='false' "+
                 "data-widget-sortable='false'>" +
                 "<header><h2></h2></header>" +
                 "<div role='content'>" +
                   "<div class='widget-body no-padding table-body'><div class='widget-body-toolbar'></div></div>" +
                 "</div>" +
               "</div>" +
             "</article></div>";

  var settings = "<div class='widget-toolbar table-settings'>" +
                   "<a href='javascript:void(0);' class='button-icon' data-toggle='dropdown'><i class='fa fa-cog'></i></a>" +
                   "<div class='dropdown-menu arrow-box-up-right pull-right table-settings-body'>" +
                   "</div>" +
                 "</div>";

  var ctrls = "<div class='jarviswidget-ctrls'></div>";

  var reload = "<a href='javascript:void(0);' class='button-icon table-reload'><i class='fa fa-refresh'></i></a>";
  var add = "<a href='javascript:void(0);' class='button-icon table-add'><i class='fa fa-plus'></i></a>";
  var export_table = "<a href='javascript:void(0);' class='button-icon table-export'><i class='fa fa-download'></i></a>";

  var reload_cycle = 1000; // 2s refer to font-awesome.min.css or font-awesome.css, divided by 2 due to its symmetry
  var reload_cycle_offset = -10;

  return function() {
    // Flags for HTML generation
    this.SETTINGS = 1 << 0;
    this.RELOAD = 1 << 1;
    this.ADD = 1 << 2;
    this.EXPORT_TABLE = 1 << 4;

    var table = null;
    var reload_start = 0;
    var reload_timeout = 0;

    this.create = function(options) {
      if (typeof options !== "undefined" && options &&
          typeof options.container !== "undefined" && options.container) {
        table = $(view).appendTo(options.container);

        if (typeof options.color === "undefined" || options.color === "dark") {
          table.find(".jarviswidget").addClass("jarviswidget-color-blueDark");
        }

        if (typeof options.title === "string" && options.title) {
          table.find("header h2").html(options.title);
        }

        if (typeof options.flags !== "undefined") {
          if (options.flags & this.SETTINGS) {
            table.find("header").append(settings);
          }

          if ((options.flags & this.RELOAD) ||
              (options.flags & this.ADD) || 
              (options.flags & this.EXPORT_TABLE)) {
            var c = $(ctrls);

            if (options.flags & this.RELOAD) {
              c.prepend(reload);
            }

            if (options.flags & this.ADD) {
              c.prepend(add);
            }
            if (options.flags & this.EXPORT_TABLE) {
              c.prepend(export_table);
            }

            table.find("header").append(c);
          }
        }

        if (typeof pageSetUp == "function") {
          pageSetUp(table);
        }

        table.find("header .table-settings .dropdown-menu").click(function(e) {
          // Stop dropdown menu from popping down
          e.stopPropagation();
        });

        table.find("header .table-reload").click(function() {
          if (!$(this).find("i").hasClass("fa-spin")) {
            table.trigger("reload");
          }
        });

        table.find("header .table-add").click(function() {
          table.trigger("add");
        });
        
        table.find("header .table-export_table").click(function() {
          table.trigger("export_table");
        });
      }
    };

    this.toggleReload = function(processing) {
      if (processing && reload_start ===  0) {
        reload_start = (new Date()).getTime();
        table.find("header .table-reload").addClass("non-link")
                    .find("i").addClass("fa-spin");
      } else if (!processing &&  reload_start !== 0){
        var to = 0;

        if (reload_start > 0) {
          var current = (new Date()).getTime();
          var diff = current - reload_start;
          var over = diff % reload_cycle;

          if (over > 0) {
            to = reload_cycle - over + reload_cycle_offset;
          }
        }

        reload_timeout = setTimeout(function() {
           reload_start = 0;
           reload_timeout = 0;
           table.find("header .table-reload").removeClass("non-link")
                      .find("i").removeClass("fa-spin");
        }, to);
      }
    };
  }
});
