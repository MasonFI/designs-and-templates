define(['jquery', 'translate', 'viivaUtility', 'dataTables', 'colReorder', 'fixedColumns', 'colVis',
    'zeroClipboard', 'dtBootstrap'], function($, tr, util, dataTables) {
      return function() {
        // Private instance variables
        var table = null;
        var dt = null;

        // Public instance methods
        this.create = function(options) {
          if (typeof options !== "undefined" && options &&
              typeof options.container !== "undefined" && options.container &&
              typeof options.colDefs !== "undefined" && options.colDefs instanceof Array &&
              options.colDefs.length > 0 && typeof options.method === "string" && options.method) {
            // Build html element
            table = $("<table class='viivaDataTable table table-striped table-bordered" +
                (typeof options.onClick === "function" && options.onClick ? " table-hover": "") +
                "'></table>").appendTo(options.container);

            if (typeof options.classes === "string" && options.classes) {
              table.addClass(options.classes);
            }

            var skeleton = "<thead><tr>";
            var columnData = [];
            for (var i = 0; i < options.colDefs.length; i++) {
              if (typeof options.colDefs[i].prop === "string" && options.colDefs[i].prop) {
                // Construct header
                if (typeof options.colDefs[i].name === "string" && options.colDefs[i].name) {
                  skeleton += "<th>" + tr(options.colDefs[i].name) + "</th>";
                } else {
                  skeleton += "<th></th>";
                }
                // Set property to read data from server
                var def = {"mData": options.colDefs[i].prop};
                if (typeof options.colDefs[i].sortable !== "undefined" && !options.colDefs[i].sortable) {
                  def.bSortable = false;
                }
                if (typeof options.colDefs[i].visible !== "undefined" && !options.colDefs[i].visible) {
                  def.bVisible = false;
                }
                if (typeof options.colDefs[i].render === "function" && options.colDefs[i].render) {
                  def.mRender = options.colDefs[i].render;
                }
                columnData.push(def);
              }
            }
            skeleton += "</tr></thead><tbody></tbody>";
            table.append(skeleton);

            // Set it up with dataTables
            var params = {
              sPaginationType: 'bootstrap_full',
              bPaginate: typeof options.pagination !== "undefined" && !options.pagination ? false : true,
              iDisplayLength: 25,
              bServerSide: true,
              sAjaxSource: util.apiBase + options.method,
              aoColumns: columnData,
              fnServerData: function(sSource, aoData, fnCallback) {
                if (typeof options.filterFn === "function" && options.filterFn) {
                  var augmentedData = options.filterFn(aoData);
                  if (augmentedData) {
                    aoData = augmentedData;
                  }
                }
                aoData.push({name: "format", value: "datatable"});
                $.ajax({
                  url: sSource,
                  type: "POST",
                  contentType: "application/json; charset=utf-8",
                  data: JSON.stringify(util.arrayToObject(aoData)),
                  dataType: "json",
                  success: function(data) {
                    if (data.code) {
                      // TODO Failed
                    } else {
                      if (typeof options.formatFn === "function" && options.formatFn) {
                        data.aaData = $.map(data.aaData, options.formatFn);
                      }
                      fnCallback(data);
                    }
                  },
                  error: function( xhr, status, thrown ) {
                    // TODO Failed
                  }
                });
              },
              fnRowCallback: function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                // Replace empty data with - for placeholding
                $(nRow).find("td").each(function() {
                  var value = $(this).html();
                  if (value.replace(/ /g,'') === "") {
                    $(this).html("-");
                  }
                });

                if (typeof options.onClick === "function" && options.onClick) {
                  $(nRow).css("cursor", "pointer").click(function() {options.onClick($(this), aData);});
                }
              },
              oLanguage: {
                oAria: {
                  sSortAscending: tr("sSortAscending", "capitalizefirst"),
                  sSortDescending: tr("sSortDescending", "capitalizefirst")
                },
                oPaginate: {
                sFirst: tr("sFirst"),
                sLast: tr("sLast"),
                sNext: tr("sNext"),
                sPrevious: tr("sPrevious")
                },
                sEmptyTable: tr("sEmptyTable", "capitalizefirst"),
                sInfo: tr("sInfo", "capitalizefirst"),
                sInfoEmpty: tr("sInfoEmpty", "capitalizefirst"),
                sInfoFiltered: tr("sInfoFiltered", "capitalizefirst"),
                  //          sInfoPostFix: tr("sInfoPostFix", "capitalizefirst"),
                  //          sInfoThousands: tr("sInfoThousands", "capitalizefirst"),
                  //          sLengthMenu: tr("sLengthMenu", "capitalizefirst"),
                sLoadingRecords: tr("sLoadingRecords", "capitalizefirst"),
                sProcessing: tr("sProcessing", "capitalizefirst"),
                sSearch: tr("sSearch", "capitalizefirst"),
                  //          sUrls: tr("sUrls", "capitalizefirst"),
                sZeroRecords: tr("sZeroRecords", "capitalizefirst")
              }
            };

            if (typeof options.defaultSort !== "undefined") {
              params.aaSorting = options.defaultSort;
            }

            if (typeof options.onRowCreated === "function" && options.onRowCreated) {
              params.fnCreatedRow = function(row, data, index) {
                options.onRowCreated(row, data);
              };
            }

            if (typeof options.onDrawn === "function" && options.onDrawn) {
              params.fnDrawCallback = function() {
                options.onDrawn();
              };
            }

            if (typeof options.controls !== "undefined" && options.controls instanceof Array &&
                options.controls.length > 0) {
              params.sDom = "<'H'lf<'toolbar'>r>t<'F'ip>";
            }

            dt = table.dataTable(params);
            table.css('width', '');

            if (typeof options.wrapperClasses === "string" && options.wrapperClasses) {
              table.closest(".dataTables_wrapper").addClass(options.wrapperClasses);
            }

            if (typeof options.controls !== "undefined" && options.controls instanceof Array &&
                options.controls.length > 0) {
              var toolbar = table.closest(".dataTables_wrapper").find(".toolbar");
              if (toolbar.length) {
                $.map(options.controls, function(control) {
                  if (typeof control.label === "string" && control.label) {
                    var button = $("<div>" + control.label + "</div>").appendTo(toolbar).button();

                    if (typeof control.onClick === "function" && control.onClick) {
                      button.click(function() {
                        control.onClick();
                      });
                    }
                  }
                });
              }
            }

            if (typeof options.onProcessing === "function" && options.onProcessing) {
              dt.on("processing", function(e, table, processing) {
                options.onProcessing(processing);
              });

              // Initial load
              options.onProcessing(true);
            }

            return table;
          }
        };

        this.updateTable = function() {
          if (dt) {
            dt.fnDraw();
          }
        };

        this.getData = function(selection) {
          if (dt) {
            if (typeof selection !== "undefined" && selection) {
              return dt.fnGetData(selection);
            } else {
              return dt.fnGetData();
            }
          } else {
            return null;
          }
        };

        this.setColumnVisibility = function(params) {
          if (dt && typeof params !== "undefined" && params &&
              typeof params.columnIndex !== "undefined" &&
              typeof params.visibility !== "undefined") {
            dt.fnSetColumnVis(params.columnIndex, params.visibility);
          }
        };

        this.openInfo = function(params) {
          if (dt && typeof params !== "undefined" && params &&
              typeof params.row !== "undefined" &&  params.row &&
              typeof params.html !== "undefined" && params.html) {
            if (typeof params.classes !== "undefined" && params.classes) {
              dt.fnOpen(params.row, params.html, params.classes);
            } else {
              dt.fnOpen(params.row, params.html);
            }
          }
        };

        this.closeInfo = function(params) {
          if (dt && typeof params !== "undefined" && params &&
              typeof params.row !== "undefined" &&  params.row) {
            dt.fnClose(params.row);
          }
        };

      };
    });
