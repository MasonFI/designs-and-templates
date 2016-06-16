define(['jquery', 'jqueryui', 'translate'], function($, jui, tr) {
  // Private class variable
  var listBoxCount = 0; // Used to generate unique IDs

  return function() {
    var listBox = null;

    this.create = function(options) {
      if (typeof options !== "undefined" && options &&
          typeof options.items && options.items instanceof Array &&
          options.items.length > 0) {
        listBox = $("<div class='viivaListBox'></div>");

        if (typeof options.id === "string" && options.id) {
          listBox.attr("id", options.id);
        }

        if (typeof options.classes === "string" && options.classes) {
          listBox.addClass(options.classes);
        }

        for (var i = 0; i < options.items.length; i++) {
          if (typeof options.items[i].name === "string" && options.items[i].name ) {
            var id = "vlb" + listBoxCount + "-" + i;
            var item = "<div><input type='checkbox' id='" + id + "'";

            if (typeof options.items[i].value !== "undefined") {
              item += " value='" + options.items[i].value + "'";
            }

            if (typeof options.items[i].set !== "undefined" &&  options.items[i].set) {
              item += " checked='checked'";
            }

            item += "><label for='" + id + "'>" + tr(options.items[i].name) + "</label></div>";

            listBox.append(item);
          }
        }

        listBox.find("input:checkbox").button();

        listBoxCount++;
        return listBox;
      }
    };

    this.getList = function() {
      if (listBox) {
        var ret = [];
        listBox.find("input:checkbox:checked").each(function(index) {
          ret.push(index);
        });
        return ret;
      } else {
        return null;
      }
    };

    this.getValues = function() {
      if (listBox) {
        var ret = [];
        listBox.find("input:checkbox:checked").each(function() {
          // Using value resturns on when value is not set
          if (typeof $(this).attr("value") !== "undefined") {
            ret.push($(this).attr("value"));
          }
        });
        return ret;
      } else {
        return null;
      }
    };
  };
});
