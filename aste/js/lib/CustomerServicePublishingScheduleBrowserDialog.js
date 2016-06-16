define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility',
    'viivaDataTable', 'viivaNotification', 'viivaDialog', 'smartAdmin'],
  function ($, jui, Ember, DP, tr, util, ViivaDataTable, Notification) {

    var dialog = "<div class='row'>" +
      "<div class='col-md-12 smart-form' id='publishingScheduleBody'>" +
      "<table class='table' style='width:100%; display:none;'>" +
      "<thead>" +
      "<tr>" +
      "<th>" + tr("issue") + "</th>" +
      "<th>" + tr("publishingDate") + "</th>" +
      "<th>" + tr("labelDate") + "</th>" +
      "<th>" + tr("deliveryDate") + "</th>" +
      "<th>" + tr("printDate") + "</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody>" +
      "</tbody>" +
      "</table>" +
      "<img src='resources/img/ajax_loader.gif' style='display: block; margin: 10px auto;' />" +
      "<div class='row' id='publishingScheduleButtons'>" +
      "<div class='col-md-6 text-center'><button id='publishingScheduleButtonPrev' class='btn btn-lg btn-default' style='display: none;'>Aiempia</button></div>" +
      "<div class='col-md-6 text-center'><button id='publishingScheduleButtonNext' class='btn btn-lg btn-default' style='display: none;'>Myöhempiä</button></div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    var WidgetConfirmDialog = Ember.View.extend({
      template: Ember.Handlebars.compile(dialog),

      didInsertElement: function () {
        var _this = this, $that = $(_this);
        var jRoot = _this.$("").addClass("publishing-schedule-browser-dialog");
        var $tbody = $('#publishingScheduleBody').find('tbody');
        var $publishingScheduleButtonPrev = $('#publishingScheduleButtonPrev');
        var $publishingScheduleButtonNext = $('#publishingScheduleButtonNext');

        var lastRowDate = null;
        var firstRowDate = null;

        var appendTableRows = function (publishingSchedule) {
          for (var i = 0; i < publishingSchedule.length; i++) {
            var issue = publishingSchedule[i];

            if(i === 0) {
              firstRowDate = moment(issue.publishingDate);
            } else if(i === publishingSchedule.length - 1) {
              lastRowDate = moment(issue.publishingDate);
            }

            $tbody.append($(
              "<tr>" +
              "<td>" + issue.publishingNumber + "/" + issue.publishingYear + "</td>" +
              "<td>" + moment(issue.publishingDate).format('D.M.YYYY') + "</td>" +
              "<td>" + moment(issue.labelDate).format('D.M.YYYY') + "</td>" +
              "<td>" + moment(issue.deliveryDate).format('D.M.YYYY') + "</td>" +
              "<td>" + moment(issue.printDate).format('D.M.YYYY') + "</td>" +
              "</tr>"
            ));
          }
        };

        DP.execute({
          type: "product", method: "getPublishingSchedule", params: {
            prev: 10,
            next: 5,
            productCode: _this.options.product
          }
        })
          .then(function (response) {
            appendTableRows(response.publishingSchedule);

            jRoot.find('table').show();
            jRoot.find('img').hide();

            $publishingScheduleButtonPrev.show();
            $publishingScheduleButtonNext.show();
          });

        $publishingScheduleButtonPrev.click(function(e) {
          e.preventDefault();

          jRoot.find('table').hide();
          jRoot.find('img').show();

          $publishingScheduleButtonPrev.hide();
          $publishingScheduleButtonNext.hide();

          DP.execute({
            type: "product", method: "getPublishingSchedule", params: {
              prev: 15,
              next: 0,
              now: lastRowDate.subtract(1, 'day').unix(),
              productCode: _this.options.product
            }
          })
            .then(function (response) {
              $tbody.html('');
              appendTableRows(response.publishingSchedule);

              jRoot.find('table').show();
              jRoot.find('img').hide();

              if(response.publishingSchedule.length > 14) {
                $publishingScheduleButtonPrev.show();
              }

              $publishingScheduleButtonNext.show();
            });
        });

        $publishingScheduleButtonNext.click(function(e) {
          e.preventDefault();

          jRoot.find('table').hide();
          jRoot.find('img').show();
          $publishingScheduleButtonPrev.hide();
          $publishingScheduleButtonNext.hide();

          DP.execute({
            type: "product", method: "getPublishingSchedule", params: {
              prev: 0,
              next: 15,
              now: firstRowDate.add(1, 'day').unix(),
              productCode: _this.options.product
            }
          })
            .then(function (response) {
              $tbody.html('');
              appendTableRows(response.publishingSchedule);

              jRoot.find('table').show();
              jRoot.find('img').hide();

              $publishingScheduleButtonPrev.show();

              if(response.publishingSchedule.length > 14) {
                $publishingScheduleButtonNext.show();
              }
            });
        });

        jRoot.dialog({
          minWidth: 750, minHeight: 500,
          title: tr('productPublishingSchedule').replace('_PRODUCT_', _this.options.productName)
        });

        jRoot.on('dialogclose', function () {
          if (typeof _this.onDestroy === "function" && _this.onDestroy) {
            _this.onDestroy();
          }
          jRoot.dialog("destroy");
          _this.destroy();
        });
      }
    });

    return function (options) {
      if (typeof options !== "undefined" && options) {
        return WidgetConfirmDialog.create({options: options}).appendTo($("body"));
      }
    };
  });
