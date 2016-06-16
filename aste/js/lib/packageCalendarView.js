define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'dialogManager',
       'jquery.ui.datepicker-fi', 'fullcalendar', 'smartAdmin'],
       function($, jui, Ember, DP, tr, DialogManager) {
  var view = "<div class='row table-view'><article class='col-xs-12'>" +
               "<div class='jarviswidget jarviswidget-color-blueDark' " +
                 "data-widget-colorbutton='false' data-widget-editbutton='false' " +
                 "data-widget-togglebutton='false' data-widget-deletebutton='false' " +
                 "data-widget-fullscreenbutton='false' data-widget-custombutton='false' "+
                 "data-widget-sortable='false'>" +
                 "<header>" +
                   "<h2>" + tr("packageCalendar") + "</h2>" +
                 "</header>" +
                 "<div role='content'>" +
                   "<div class='widget-body no-padding'>" +
                     "<div class='widget-body-toolbar'>" +
                       "<div id='calendar-buttons'>" +
                         "<div class='btn-group'>" +
                           "<a href='javascript:void(0);' class='btn btn-default btn-xs calendar-prev'><i class='fa fa-chevron-left'></i></a>" +
                           "<a href='javascript:void(0);' class='btn btn-default btn-xs calendar-next'><i class='fa fa-chevron-right'></i></a>" +
                         "</div>" +
                       "</div>" +
                     "</div>" +
                     "<div class='package_calendar'></div>" +
                   "</div>" +
                 "</div>" +
               "</div>" +
             "</article></div>";

  return function(options) {
    return Ember.View.extend({
      template: Ember.Handlebars.compile(view),
      didInsertElement: function() {
        var _this = this;
        var jRoot = _this.$("");

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }

        var cal = jRoot.find('.package_calendar');

        function getPackage() {
          var currentDate = cal.fullCalendar('getDate');

          if (typeof currentDate != "undefined" && currentDate instanceof Date) {
            var month = (currentDate.getMonth() + 1) + "." + currentDate.getFullYear();

            DP.execute({type: "package", method: "findByMonth", params: {month: month}})
              .then(function(packages) {
                if (typeof packages !== "undefined" && packages instanceof Array && packages.length > 0) {
                  for (var i = 0; i < packages.length; i++) {
                    var start =  new Date(packages[i].from);
                    var end = new Date(packages[i].to);
                    end.setSeconds(-1);

                    cal.fullCalendar("renderEvent", {
                      id: packages[i].id,
                      title: packages[i].name,
                      start: start,
                      end: end,
                      className: ["event", "bg-color-blue"]
                    });
                  }
                }
            });
          }
        }

        cal.fullCalendar($.extend(true, {
          eventClick: function (event, element) {
            DialogManager.create({type: "PackageDialog", id: event.id,
                                  update: function() {
                                    cal.fullCalendar('removeEvents');
                                    getPackage(); // Best way to account for all kinds Package update (include duplicate)
                                  }});
          }
        }, $.datepicker.regional[ "fi" ]));

        jRoot.find('.calendar-prev').click(function() {
          cal.fullCalendar("prev");
          getPackage();
        });
        jRoot.find('.calendar-next').click(function() {
          cal.fullCalendar("next");
          getPackage();
        });

        getPackage();
      }
    });
  };
});
