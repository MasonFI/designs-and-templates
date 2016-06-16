define(['jquery', 'jqueryui', 'ember', 'translate'],
  function($, jui, Ember, tr) {
    /*
      message: '',
      rootClass: 'resend-confirm-dialog',
      yesText: null,
      noText: null,
      onYes: function() {},
      onNo: function(){},
     */

    var dialog = "<div>" +
      "<p>"+tr('resendConfirm')+"</p>" +
      "<div id='resend-dialog-list'></div>" +
      "<label class='label' for='resend-email-notification'>" +
      "<input type='checkbox' id='resend-email-notification' />" +
      tr('sendEmailOnBreakResume') + "</label>" +
      "</div>";

    var ConfirmDialog = Ember.View.extend({
      template: Ember.Handlebars.compile(dialog),
      didInsertElement: function() {
        var _this = this;

        var jRoot = _this.$("");

        var table = $(
          "<table class='table'>" +
          "<thead>" +
          "<tr>" +
          "<th>" + tr("issue") + "</th>" +
          "<th>" + tr("publishingDate") + "</th>" +
          "<th>" + tr("labelDate") + "</th>" +
          "</tr>" +
          "</thead>" +
          "<tbody>" +
          "</tbody>" +
          "</table>"
        );

        $('#resend-dialog-list').html(table);

        for (var i = 0; i < _this.options.issues.length; i++) {
          var publishingSchedule = _this.options.issues[i];

          table.find('tbody').append($(
            '<tr>' +
            '<td>' + publishingSchedule.publishingNumber +'/' + publishingSchedule.publishingYear +'</td>' +
            '<td>' + moment(publishingSchedule.publishingDate).format('D.M.YYYY') +'</td>' +
            '<td>' + moment(publishingSchedule.labelDate).format('D.M.YYYY') +'</td>' +
            '</tr>'
          ));
        }

        // JQuery UI takes the dialog element out. Mark it
        // by a class name that is this view's ID
        var dialogButtons = [{
          html: tr("yes"),
          "class": "btn btn-primary",
          click: function() {
            _this.options.onYes({
              emailNotification: $('#resend-email-notification').val(),
              issues: _this.options.issues
            });
            $(this).dialog("close");
          }
        }, {
          html: tr("no"),
          "class": "btn btn-default",
          click: function() {
            if (typeof _this.options.no === "function" && _this.options.no) {
              _this.options.onNo();
            }
            $(this).dialog("close");
          }
        }];

        jRoot.dialog({
          title: tr('postShipments'),
          modal: true,
          draggable: false,
          resizable: false,
          buttons: dialogButtons
        });

        jRoot.on('dialogclose', function() {
          if (typeof _this.onDestroy === "function" && _this.onDestroy){
            _this.onDestroy();
          }
          jRoot.dialog("destroy");
          _this.destroy();
        });
      }
    });

    return function(options) {
      return ConfirmDialog.create({options: options}).appendTo($("body"));
    }
  });
