define(['jquery', 'smartnotification', 'translate', 'viivaUtility'],
       function($, SN, tr, util) {
  return {

    login: function(options) {

      function displayLoginUI() {

        $.SmartMessageBox({
          title: "<i class='fa fa-sign-in txt-color-orangeDark'></i> " + tr("loginWelcome"),
          content: tr("loginInstruction"),
          classes: "loginDialog",
          input: "text",
          placeholder: tr("loginUser", "capitalizefirst"),
          secondInput: "password",
          secondPlaceholder : tr("loginPassword", "capitalizefirst"),
          buttons: '[' + tr('loginSubmit') + ']'
        });

        // React to enter key
        $(".loginDialog").keypress(function(e) {
          if (e.keyCode == 13) {
            $(this).find(".botTempo").trigger("click");
          }
        });

        // Replace the stock callback mechanism with this
        // so that we can check the login before the dialog
        // goes
        $(".loginDialog .botTempo").unbind("click");
        $(".loginDialog .botTempo").click(function() {
          var dialog = $(this).closest(".MessageBoxContainer");

          $.ajax({
            url: util.apiBase + "session.login",
            type: "POST",
            data: JSON.stringify({user: dialog.find(".form-control[type=text]").val(),
                                 password: dialog.find(".form-control[type=password]").val()}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
              if (typeof data !== "undefined" && data && typeof data.code !== "undefined" &&
                  data.code === 0 && typeof data.state !== "undefined" && data.state) {
                if (typeof options !== "undefined" && options && typeof options.success === "function" &&
                    options.success) {
                  // FIXME essentially a copy from smartNotificaton.js. We shouldn't modify
                  // smartNotification's global variables, until there is a better way
                  // this will have to do
                  dialog.addClass("animated fadeOut fast");

                  if (--SmartMSGboxCount === 0) {
                     $("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(300).queue(function () {
                       ExistMsg = 0;
                       $(this).remove();
                     });
                  }

                  options.success(data.state);
                }
              } else if (typeof options !== "undefined" && options && typeof options.error === "function" &&
                         options.error) {
                options.error();
              }
            },
            error: function() {
              if (typeof options !== "undefined" && options && typeof options.error === "function" &&
                  options.error) {
                options.error();
              }
            }
          });
        });
      }

      // Check current state
      $.ajax({
        url: util.apiBase + "session.state",
        type: "POST",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
          if (typeof data !== "undefined" && data && typeof data.code !== "undefined" &&
              data.code === 0 && typeof data.state !== "undefined" && data.state) {
            if (typeof options !== "undefined" && options && typeof options.success === "function" &&
                options.success) {
              options.success(data.state);
            }
          } else {
            displayLoginUI();
          }
        },
        error: function() {
          displayLoginUI();
        }
      });
    },

    logout: function(options) {
      $.SmartMessageBox({
        title: "<i class='fa fa-sign-out txt-color-orangeDark'></i> " + tr("logout", "capitalizefirst") +
                " <span class='txt-color-orangeDark'>" + (typeof options !== "undefined" && options &&
                typeof options.name === "string" && options.name ? options.name : "" ) +
                "<strong>" + $('#show-shortcut').text() + "</strong></span> ?",
        buttons: '[' + tr('no') + '][' + tr('yes') + ']'
      }, function(ButtonPressed) {
        if (ButtonPressed ==  tr('yes')) {
          $.ajax({
            url: util.apiBase + "session.logout",
            type: "POST",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            complete: function() {
              if (typeof options !== "undefined" && options && typeof options.complete === "function" &&
                  options.complete) {
                options.complete();
              }
            }
          });
        }
      });
    }
  };
});
