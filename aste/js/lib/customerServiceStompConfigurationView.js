define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility',
        'viivaTableView', 'viivaFormElements', 'viivaListBox', 'viivaDataTable',
        'dialogManager', 'viivaNotification', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaTableView, ViivaFormElements, ViivaListBox,
                ViivaDataTable, DialogManager, Notification) {


  return function(options) {
    return Ember.View.extend({
      // Effectively document ready
      didInsertElement: function() {

        var _this = this;
        var jRoot = _this.$("");

        var view = new ViivaTableView();
        view.create({title: tr("stompConfiguration"), container: jRoot});

        this.createView(jRoot);
        this.addEventListeners(_this);
        this.loadData(_this, jRoot);

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
      },
      loadData: function(_this, jRoot) {

        var params = {
          id: "1"
        }

        DP.execute({type:"apiStomp", method:"getConfiguration", params:params}).then(function(response) {
         _this.renderResults(response, jRoot);
        });


      },
      addEventListeners: function(_this) {
        // new number event listener
        $('.add-stomp-number').click(function(event) {
            event.preventDefault();
           $(".table-body .number-area .table").append('<tr class="number-row"><td><input type="text" id="null"'+
           'class="stomp-number"></input><span class="stomp-controls pull-right"><a class="control-button">'+
           '<span class="glyphicon glyphicon-remove-sign glyphicon-control"></span></a></span></td></tr>');

          $('.control-button').click(function () {
            $(this).parent().parent().remove();
            $('.stomp-controls-container').removeClass('hidden');
          });

          $('.stomp-controls-container').removeClass('hidden');  
        });
        // number modification
        $('.number-area input').on('input', function(){
          $('.stomp-controls-container').removeClass('hidden');
  
        }); 

        $('#stomp-cancel-button').click(function() {
          var params = {
            id: "1"
        }

        DP.execute({type:"apiStomp", method:"getConfiguration", params:params}).then(function(response) {
          $('.stomp-controls-container').addClass('hidden');
          _this.renderResults(response);
        });

        });

        // save numbers
        $('#stomp-save-button').click(function() {

          var numbersFromHTML = $('.table-body .number-area .table .stomp-number');
          var numbers = [];

          $.each(numbersFromHTML, function() {

            if($(this).val() !== "") {
              var number = {
                id: $(this).attr('id'),
                number: $(this).val()
              }
              numbers.push(number);
            }
          });

          var params = {
            stompConfiguration: numbers
          }

          DP.execute({type:"apiStomp", method:"updateConfiguration", params:params}).then(function(response) {
            if (typeof response !== "undefined" && response && typeof response.message !== "undefined" && response.message === 'Successful') {
              Notification.success({
                title: tr("widgetStompUpdateSuccess"),
                message: tr("widgetStompUpdateSuccess"),
                container: $("body")
              });
              $('.stomp-controls-container').addClass('hidden');
              _this.renderResults(response);
            }
            else {
               Notification.error({
                title: tr("widgetStompUpdateFailed"),
                message: tr("widgetStompUpdateFailed"),
                container: $("body")
              });
            }

          });

        });
      },
      createView: function(jRoot) {

        jRoot.find('.table-body').removeClass('no-padding');
        jRoot.find('.table-body .widget-body-toolbar').remove();

        jRoot.find('.table-body').append('<h3>'+tr("widgetStompConfigurationHeader")+'</h3><p>'+tr("widgetStompConfigurationText")+'</p>'+
        '<div class="number-area">'+
          '<table class="table table-striped table-hover stomp-table">'+
            '<tr>'+
              '<th style="background-color:#4C4F53; color:white;">Numero <span class="add-stomp-number"><btn class="fa fa-plus pull-right stomp-add-button"></btn></span></th>'+
            '</tr>'+
            '</table>'+
        '<span class="stomp-controls-container hidden">'+
        '<button type="button" class="btn btn-primary" id="stomp-save-button">'+tr("save")+'</button>'+
        '<button type="button" class="btn btn-primary" id="stomp-cancel-button">'+tr("cancel")+'</button>'+
        '</span>'+
        '</div>');

      },
      renderResults: function(results) {

         $(".table-body .number-area .table .number-row").remove();

        if (typeof results.stompConfiguration !== "undefined" && results.stompConfiguration 
          && results.stompConfiguration.length > 0) {

          for (var i = 0; i < results.stompConfiguration.length; i++) {
            $(".table-body .number-area .table").append("<tr class='number-row'><td><input type='text' class='stomp-number' id ="+results.stompConfiguration[i].id+" "+
             "value="+results.stompConfiguration[i].number+"></input><i class='fa fa-close'></i></td></tr>");
          }

        $('.stomp-table td').append("<span class='stomp-controls pull-right'><a class='control-button'>"+
              "<span class='glyphicon glyphicon-remove-sign glyphicon-control'></span></a></span>");
        }

        $('.control-button').click(function () {
          $(this).parent().parent().remove();
          $('.stomp-controls-container').removeClass('hidden');  
        });

          // number modification
        $('.number-area input').on('input', function(){
          $('.stomp-controls-container').removeClass('hidden');
  
        }); 

      }
    });
  };
});
