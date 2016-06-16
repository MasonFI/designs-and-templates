define(['jquery', 'translate'], function($, tr) {
  // A convenient class that generates the HTML for now
  // quite sophisticated form element

  // Note many of these HTML itself is not enough. Some
  // form of JS init is needed at document ready

  var dateRangeHTML = "<div><label class='col-xs-12'></label>" +
                      "<div class='form-group col-xs-6'><div class='smart-form'><div class='input'>" +
                      "<input class='datepicker start'>" +
                      "<i class='fa fa-calendar icon-append'></i>" +
                      "</div></div></div>" +
                      "<div class='form-group col-xs-6'><div class='smart-form'><div class='input'>" +
                      "<input class='datepicker end'>" +
                      "<i class='fa fa-calendar icon-append'></i>" +
                      "</div></div></div></div>";

  var selectHTML = "<div><label class='col-xs-12'></label>" +
                   "<div class='form-group col-xs-12'><div class='smart-form'><div class='select'><select>" +
                   "</select><i></i></div></div></div></div>";

  var switchGroupHTML = "<div><label class='col-xs-12'></label></div>";

  return {
    dateRange: function(params) {
      var r = $(dateRangeHTML);

      if (typeof params !== "undefined" && params &&
          typeof params.label === "string" && params.label) {
        r.find("label").html(params.label);
      }

      if (typeof params !== "undefined" && params &&
          typeof params.classes === "string" && params.classes) {
        r.addClass(params.classes);
      }

      return r[0].outerHTML;
    },

    select: function(params) {
      var r = $(selectHTML);

      if (typeof params !== "undefined" && params &&
          typeof params.label === "string" && params.label) {
        r.find("label").html(params.label);
      }

      if (typeof params !== "undefined" && params &&
          typeof params.classes === "string" && params.classes) {
        r.addClass(params.classes);
      }

      if (typeof params !== "undefined" && params &&
          typeof params.items !== "undefined" &&
          params.items instanceof Array && params.items.length > 0) {
        var s = r.find("select");
        for (var i = 0; i < params.items.length; i++) {
          var item = params.items[i];
          s.append("<option" + (typeof item.value !== "undefined" ? " value='" + item.value + "'>" : ">") +
                   (typeof item.name !== "undefined" ? item.name : "") + "</option>");
        }
      }

      return r[0].outerHTML;
    },

    switchGroup: function(params) {
      var r = $(switchGroupHTML);
      var on = "ON";
      var off = "OFF";

      if (typeof params !== "undefined" && params &&
          typeof params.label === "string" && params.label) {
        r.find("label").html(params.label);
      }

      if (typeof params !== "undefined" && params &&
          typeof params.classes === "string" && params.classes) {
        r.addClass(params.classes);
      }

      if (typeof params !== "undefined" && params &&
          typeof params.on === "string") {
        on = params.on;
      }

      if (typeof params !== "undefined" && params &&
          typeof params.off === "string") {
        off = params.off;
      }

      if (typeof params !== "undefined" && params &&
          typeof params.items !== "undefined" &&
          params.items instanceof Array && params.items.length > 0) {
        var div = [];

        if (typeof params.columns === "number") {
          switch(params.columns) {
            // Only supports upto 3 columns
            case 2:
              r.append(Array(3).join("<div class='smart-form col-xs-6'></div>"));
              div = [Math.ceil(params.items.length / 2), params.items.length];
              break;
            case 3:
              r.append(Array(4).join("<div class='smart-form col-xs-4'></div>"));
              var s = Math.floor(params.items.length / 3);
              var rem = params.items.length % 3;
              if (rem == 0) {
                div = [s, s * 2, s * 3];
              } else if (rem == 1) {
                div = [s + 1, s * 2 + 1, s * 3 + 1]
              } else {
                div = [s + 1, s * 2 + 2, s * 3 + 2]
              }
              break;
            default:
              r.append("<div class='smart-form col-xs-12'></div>");
              div = [params.items.length];
              break;
          }
        } else {
          r.append("<div class='smart-form col-xs-12'></div>");
          div = [params.items.length];
        }

        var columns = r.find(".smart-form").addClass("switch-group-column");
        var currentColumn = 0;
        for (var i = 0; i < params.items.length; i++) {
          var item = params.items[i];
          if (i >= div[currentColumn]) {
            currentColumn++;
          }
          columns.eq(currentColumn).append("<label class='toggle'><input type='checkbox'" +
                                           (typeof item.value !== "undefined" ? " value='" + item.value + "'" : "") +
                                           (typeof item.id !== "undefined" ? " id='" + item.id + "'" : "") +
                                           (typeof item.checked !== "undefined" && item.checked ? "checked='checked'" : "") +
                                            ">" + (typeof item.name !== "undefined" ? item.name : "") +
                                           "<i data-swchon-text='" + on + "' data-swchoff-text='" + off +"'></i></label>");
        }
      }

      return r[0].outerHTML;
    }
  };
});
