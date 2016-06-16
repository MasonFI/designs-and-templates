define(['jquery', 'jqueryui', 'ember', 'translate', 'viivaUtility', 'viivaDataTable'],
       function($, jui, Ember, tr, util, ViivaDataTable) {
  var view = $("<div class='settingsView'>" +
                 "<ul>" +
                   "<li><a href='#settingsUsers'>" + tr("settingsUsers") + "</a></li>" +
                   "<li><a href='#settingsVAT'>" + tr("settingsVAT") + "</a></li>" +
                   "<li><a href='#settingsEvents'>" + tr("settingsEvents") + "</a></li>" +
                 "</ul>" +
                 "<div id='settingsUsers'>" +
                   "<div class='viewFilter'>" +
                     "<div class='userAccountCreated'><div>" + tr("userAccountCreated") + ":</div>" +
                     "<div><input class='datepicker start'>-<input class='datepicker end'></div></div>" +
                     "<div class='userLastLogin'><div>" + tr("userLastLogin") + ":</div>" +
                     "<div><input class='datepicker start'>-<input class='datepicker end'></div></div>" +
                     "<div class='userLevel'><div>" + tr("userLevel") + ":</div><select>" +
                       "<option value='0'>" + tr("noLimit", "capitalizefirst") + "</option>" +
                       "<option value='1'>" + tr("customerservice", "capitalizefirst") + "</option>" +
                       "<option value='2'>" + tr("financialAdministration", "capitalizefirst") + "</option>" +
                       "<option value='3'>" + tr("administrators", "capitalizefirst") + "</option>" +
                     "</select></div>" +
                   "</div>" +
                 "</div>" +
                 "<div id='settingsVAT'>" +
                 "</div>" +
                 "<div id='settingsEvents'>" +
                   "<div class='viewFilter'>" +
                     "<div class='eventTime'><div>" + tr("eventTime") + ":</div>" +
                     "<div><input class='datepicker start'>-<input class='datepicker end'></div></div>" +
                     "<div class='eventType'><div>" + tr("eventType") + ":</div><select>" +
                       "<option value='0'>" + tr("noLimit", "capitalizefirst") + "</option>" +
                       "<option value='1'>" + tr("eventOrder", "capitalizefirst") + "</option>" +
                       "<option value='2'>" + tr("eventPayment", "capitalizefirst") + "</option>" +
                       "<option value='3'>" + tr("eventDataChange", "capitalizefirst") + "</option>" +
                     "</select></div>" +
                     "<div class='tableFields'><div>" + tr("tableFields") + ":</div>" +
                       "<input type='checkbox' checked='checked' value='0' id='eventIDColumnCheck'>" +
                         "<label for='eventIDColumnCheck'>" + tr("eventID", "uppercase") + "</label><br>" +
                       "<input type='checkbox' checked='checked' value='1' id='eventTimeColumnCheck'>" +
                         "<label for='eventTimeColumnCheck'>" + tr("eventTime", "capitalizefirst") + "</label><br>" +
                       "<input type='checkbox' checked='checked' value='2' id='eventColumnCheck'>" +
                         "<label for='eventColumnCheck'>" + tr("event", "capitalizefirst") + "</label><br>" +
                       "<input type='checkbox' checked='checked' value='3' id='eventUserColumnCheck'>" +
                         "<label for='eventUserColumnCheck'>" + tr("eventUser", "capitalizefirst") + "</label><br>" +
                     "</div>" +
                   "</div>" +
                 "</div>" +
               "</div>");

  return function(options) {
    return Ember.View.extend({
      template: Ember.Handlebars.compile(view[0].outerHTML),
      // Effectively document ready
      didInsertElement: function() {
        var settingsView = this.$(".settingsView");

        // Users
        settingsView.tabs().find(" > ul > li").removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
        this.$("input.datepicker").datepicker();
        this.$("input.datepicker.start").change(function() {
          var startDate = $(this).datepicker("getDate");
          $(this).siblings("input.datepicker.end").datepicker("option", "minDate", startDate);
        });

        var userTable = new ViivaDataTable();
        userTable.create({
          container: settingsView.find("#settingsUsers"),
          method: "product.get",
          wrapperClasses: "viewDataTable",
          colDefs: [
            {name: tr("userEmail"), prop: "email"},
            {name: tr("userName"), prop: "name"},
            {name: tr("userLevel"), prop: "level"},
            {name: tr("userAccountCreated"), prop: "created"},
            {name: tr("userLastLogin"), prop: "lastLogin"}
          ],
          filterFn: function(data) {
            if (typeof data !== "undefined" && data) {
              var accountCreatedStart = settingsView.find(".userAccountCreated input.datepicker.start").datepicker("getDate");
              var accountCreatedEnd = settingsView.find(".userAccountCreated input.datepicker.end").datepicker("getDate");
              var lastLoginStart = settingsView.find(".userLastLogin input.datepicker.start").datepicker("getDate");
              var lastLoginEnd = settingsView.find(".userLastLogin input.datepicker.end").datepicker("getDate");
              var userLevel = parseInt(settingsView.find('.userLevel select').find(":selected").val());

              var added = false;

              if (accountCreatedStart) {
                data.push({name: "accountCreatedStart", value: util.dateToUTCString(accountCreatedStart)});
                added = true;
              }
              if (accountCreatedEnd) {
                data.push({name: "accountCreatedEnd", value: util.dateToUTCString(accountCreatedEnd)});
                added = true;
              }
              if (lastLoginStart) {
                data.push({name: "lastLoginStart", value: util.dateToUTCString(lastLoginStart)});
                added = true;
              }
              if (lastLoginEnd) {
                data.push({name: "lastLoginEnd", value: util.dateToUTCString(lastLoginEnd)});
                added = true;
              }
              if (userLevel) {
                data.push({name: "userLevel", value: userLevel});
                added = true;
              }

              if (added) {
                return data;
              }
            }

            return null;
          }
        });
        this.$("#settingsUsers .datepicker, #settingsUsers select").change(function() {
          userTable.updateTable();
        });

        // VAT
        var regionsTable = new ViivaDataTable();
        regionsTable.create({
          container: settingsView.find("#settingsVAT"),
          method: "product.get",
          wrapperClasses: "viewDataTable regionVATs",
          colDefs: [
            {name: tr("vatRegion"), prop: "region"},
            {name: tr("digital"), prop: "digital"},
            {name: tr("print"), prop: "print"},
            {name: tr("singleIssue"), prop: "single"}
          ]
        });

        var countriesTable = new ViivaDataTable();
        countriesTable.create({
          container: settingsView.find("#settingsVAT"),
          method: "product.get",
          wrapperClasses: "viewDataTable countryVATs",
          colDefs: [
            {name: tr("vatCountry"), prop: "country"},
            {name: tr("digital"), prop: "digital"},
            {name: tr("print"), prop: "print"},
            {name: tr("singleIssue"), prop: "single"}
          ]
        });

        // Events
        var eventTable = new ViivaDataTable();
        eventTable.create({
          container: settingsView.find("#settingsEvents"),
          method: "product.get",
          wrapperClasses: "viewDataTable",
          colDefs: [
            {name: tr("eventID"), prop: "id"},
            {name: tr("eventTime"), prop: "time"},
            {name: tr("event"), prop: "event"},
            {name: tr("eventUser"), prop: "user"}
          ],
          filterFn: function(data) {
            if (typeof data !== "undefined" && data) {
              var timeStart = settingsView.find(".eventTime input.datepicker.start").datepicker("getDate");
              var timeEnd = settingsView.find(".eventTime input.datepicker.end").datepicker("getDate");
              var eventType = parseInt(settingsView.find('.eventType select').find(":selected").val());

              var added = false;

              if (timeStart) {
                data.push({name: "timeStart", value: util.dateToUTCString(timeStart)});
                added = true;
              }
              if (timeEnd) {
                data.push({name: "timeEnd", value: util.dateToUTCString(timeEnd)});
                added = true;
              }
              if (eventType) {
                data.push({name: "eventType", value: eventType});
                added = true;
              }

              if (added) {
                return data;
              }
            }

            return null;
          }
        });
        this.$("#settingsEvents .tableFields input:checkbox").change(function() {
          eventTable.setColumnVisibility({columnIndex: parseInt($(this).val()),
                                         visibility: $(this).is(':checked')});
        });
        this.$("#settingsEvents .datepicker, #settingsEvents select").change(function() {
          eventTable.updateTable();
        });
      }
    });
  };
});
