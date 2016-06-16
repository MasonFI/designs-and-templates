define(['jquery', 'jqueryui'], function($) {
  jDialog = typeof $.fn.dialog === "function" ? $.fn.dialog : null;

  $.fn.dialog = function(options) {
    if (jDialog) {
      var r = jDialog.call(this, options);

      if (typeof options !== "undefined" && options &&
          typeof options.modal !== "undefined" && options.modal) {
        $(this).closest(".ui-dialog").addClass("ui-dialog-modal");
      }

      if (typeof options !== "undefined" && options && typeof options.tabs !== "undefined" &&
          options.tabs instanceof Array && options.tabs.length > 0) {
        var _this = this;
        var container = $("<ul class='ui-dialog-tabs nav nav-pills'></ul>")
                          .appendTo($(this).siblings(".ui-dialog-titlebar"));

        var active = 0;
        $.each(options.tabs, function(index, value) {
          if (typeof value.title === "string") {
            var name = null;
            if (typeof value.name !=="undefined" && value.name) {
              name = value.name;
            }
            var item = $("<li class='ui-dialog-tabs-anchor'  "+(name ? "name ='"+name+"' ":" ")+"><a href='javascript:void(0);'>" +
                         value.title + "</a></li>").appendTo(container);
            if (!active && typeof value.active !== "undefined" && value.active) {
              active = index;
            }
          }
        });

        container.find(".ui-dialog-tabs-anchor a").click(function() {
          var li = $(this).parent();
          if (!li.hasClass("active")) {
            li.siblings(".active").removeClass("active");
            li.addClass("active");
            _this.children("section").hide().eq(li.index()).show();
          }
        });

        container.find("li").eq(active).addClass("active");
        _this.children("section").hide().eq(active).show();
      }
      return r;
    }    
  }
});