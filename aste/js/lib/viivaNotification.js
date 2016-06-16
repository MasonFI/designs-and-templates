define(['jquery', 'smartnotification'], function($) {
  function notify(params) {
    $.smallBox($.extend({
     timeout: (typeof params.timeout !== "undefined" ? params.timeout : 2000)
    }, params));
  }

  return {
    info: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.message === "string" && params.message) {
        var options = {
          content: "<i>" + params.message + "</i>",
          color: "#3276B1",
          iconSmall: "fa fa-quote-right fadeInRight animated",
        };

        if (typeof params.title === "string" && params.title) {
          options.title = params.title;
        }

        if (typeof params.container !== "undefined" && params.container instanceof $) {
          options.container = params.container;
        }

        notify(options);
      }
    },

    success: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.message === "string" && params.message) {
        var options = {
          content: "<i>" + params.message + "</i>",
          color: "#739E73",
          iconSmall: "fa fa-check fadeInRight animated",
        };

        if (typeof params.title === "string" && params.title) {
          options.title = params.title;
        }

        if (typeof params.container !== "undefined" && params.container instanceof $) {
          options.container = params.container;
        }

        notify(options);
      }
    },

    warn: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.message === "string" && params.message) {
        var options = {
          content: "<i>" + params.message + "</i>",
          color: "#C79121",
          iconSmall: "fa fa-exclamation fadeInRight animated"
        };

        if (typeof params.title === "string" && params.title) {
          options.title = params.title;
        }

        if (typeof params.container !== "undefined" && params.container instanceof $) {
          options.container = params.container;
        }

    

        notify(options);
      }
    },

    error: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.message === "string" && params.message) {
        var options = {
          content: "<i>" + params.message + "</i>",
          color: "#C46A69",
          iconSmall: "fa fa-times fadeInRight animated",
        };

        if (typeof params.title === "string" && params.title) {
          options.title = params.title;
        }

        if (typeof params.container !== "undefined" && params.container instanceof $) {
          options.container = params.container;
        }

        options.timeout = 15000;

        notify(options);
      }
    }
  };
});
