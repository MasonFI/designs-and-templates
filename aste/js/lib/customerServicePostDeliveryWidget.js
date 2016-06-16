define(['jquery', 'dataPool', 'translate', 'moment'],
  function($, DP, tr, moment) {

    return function() {
      this.settings = new Object();
      this.destroyed = false;
      this.activeCustomer = new Object();

      this.create = function(insideElement){
        this.view = $(
          "<div class='jarviswidget jarviswidget-color-blueDark ' " +
              "data-widget-deletebutton='false' data-widget-colorbutton='false' " +
              "data-widget-editbutton='false' id='post-delivery-widget'>"+
            "<header>"+
              "<h2>" + tr('postShipmentListing') + "</h2>"+
            "</header>"+
            "<div class='widget-body' id='postDeliveryWidgetBody'>" +
              "<table class='table'>" +
                "<thead>" +
                  "<tr>" +
                    "<th>" + tr("orderedAt") + "</th>" +
                    "<th>" + tr("widgetOrderNo") + "</th>" +
                    "<th>" + tr("orderSoldByUser", "capitalizefirst") + "</th>" +
                    "<th>" + tr("productDetails", "capitalizefirst") + "</th>" +
                    "<th>" + tr("issue") + "</th>" +
                    "<th>" + tr("urgentOrder") + "</th>" +
                  "</tr>" +
                "</thead>" +
                "<tbody></tbody>" +
              "</table>"+
            "</div>"+
          "</div>");

        $(insideElement).append(this.view);

        this.domReady = true;
        this.parent = insideElement;
      };

      this.reload = function() {
        console.log('reloading postDeliveryWidget..');
        $('#postDeliveryWidgetBody').find('tbody').empty();
        this.loadData();
      };

      this.loadData = function(customerId) {
        var _this = this;

        var mydigiCustomerId;

        if (typeof customerServiceWidgetManager.activeMyDigiCustomer !== "undefined" && customerServiceWidgetManager.activeMyDigiCustomer.id !== null ) {
          mydigiCustomerId = customerServiceWidgetManager.activeMyDigiCustomer.id;
        }

        var params = {
          mydigiCustomerId: mydigiCustomerId,
          limit: 100
        };

        console.log("querying postdelivery", params);

        DP.execute({type:"product", method:"postDeliveryGet", params: params}).then(function(response) {
          _this.populatePostDeliveryTable(response);
        });
      };

      this.bindEvents = function() {
        this.eventsBinded = true;
        var _this = this;

        $('#post-delivery-widget').on('click', function(e) {
          console.log("fullscreen toggle");
          if(document.getElementById("jarviswidget-fullscreen-mode")) {
            $('#postDeliveryWidgetBody').find('.post-delivery-fullscreen-row').removeClass('hidden');
          } else {
            $('#postDeliveryWidgetBody').find('.post-delivery-fullscreen-row').addClass('hidden');
          }
        });
      };

      this.populatePostDeliveryTable = function(response) {
        var _this = this;
        var $tbody = $('#postDeliveryWidgetBody').find('tbody');

        if (response.length < 1) {
          $tbody.append("<tr><td colspan='6'>Ei vanhoja jälkitoimitustilauksia</td></tr>");
        }

        for (var i = 0; i < response.length; i++) {
          var row = response[i];

          $tbody.append($(
            "<tr" + (i > 4 ? " class='post-delivery-fullscreen-row hidden'" : '') + ">" +
            "<td>" + moment(row.createdAt).format('D.M.YYYY HH:MM') + "</td>" +
            "<td>" + row.orderId + "</td>" +
            "<td>" + row.userName + "</td>" +
            "<td>" + row.productName + "</td>" +
            "<td>" + row.issueNumber + "/" + row.issueYear + "</td>" +
            "<td>" + (row.emailNotification ? tr('yes') : tr('no')) + "</td>" +
            "</tr>"
          ));
        }

        _this.bindEvents();
      };

    };

  });