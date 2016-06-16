define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment', 'customerServiceAccessHistory',
        'viivaNotification', 'ember', 'dialogManager', 'customerServiceLekaJumper','smartAdmin'],
    function($, jui, DP, util, tr, moment, AccessHistory, Notification, Ember, DialogManager, LekaJumper) {

return function (){
    this.settings = new Object();
    this.destroyed = false;
    this.activeCustomer = new Object();
    
    this.loadData = function(customerId) {
      var _this = this;

      var data = {
        id: customerId
      };

       DP.execute({type:"apiCustomer", method:"getCustomer", params:data}).then(function(response) {

          var logData = {
                  id: response.customer.customerNumber,
                  name: response.customer.name,
                  email: response.customer.email
                  };

                AccessHistory.logAccess(logData);
              _this.populateCustomerInformation(response.customer);

        });
    };

    this.populateCustomerInformation = function(response) {
            var _this = this;
          // X = customer is dead, disable marketing switches
          if ( response.supplyDenial === 'X' ) {
            this.activeCustomer.personDead = true;
            $('#customer-email-marketing').prop('checked', false);
            $('#customer-email-marketing').prop('disabled', true);
            $('.customer-email-container').addClass('hidden');

            $('#customerDead').append('<strong>Henkilö on kuollut</strong>');
            $('.supplyDenialsWrapper').addClass('hidden');

          }
          // N = customer has denied everything
          else if ( response.emailSupplyDenial === 'E' || response.emailSupplyDenial === null) {
            $('#customer-email-marketing').prop('checked', false);
          }

          if (response.supplyDenial !== null) {
             $('[name=supplyDenials]').val(response.supplyDenial);
          }
          else {
             $('[name=supplyDenials]').val("allowed");
          }


          if (response.saleDenial !== null) {
             $('[name=saleDenials]').val(response.saleDenial);
          }
          else {
             $('[name=saleDenials]').val("no");
          }

          response = characterReplacer.replaceCharacters(response);



          $('#info [name=country]').addClass('col-md-12');
          $('#customer-birthyear').text(response.birthyear);
          if (response.gender) {
            var gender = response.gender;
            
            switch(gender) {
                case " ":
                  $('#customer-gender').html('<i class="fa fa-question" title="'+tr("widgetGenderUnknown")+'"></i>');
                    break;
                case "F":
                   $('#customer-gender').html('<i class="fa fa-suitcase" title="'+tr("widgetGenderF")+'"></i>');
                    break;
                case "M":
                   $('#customer-gender').html('<i class="fa fa-male" title="'+tr("widgetGenderM")+'"></i>');
                    break;
                case "N":
                   $('#customer-gender').html('<i class="fa fa-female" title="'+tr("widgetGenderN")+'"></i>');
                    break;
                case "X":
                   $('#customer-gender').html('<i class="fa fa-question" title="'+tr("widgetGenderX")+'"></i>');
                    break;
                case "Y":
                   $('#customer-gender').html('<i class="fa fa-users" title="'+tr("widgetGenderY")+'"></i>');
                    break;
                default:
                  $('#customer-gender').html('<i class="fa fa-question" title="'+tr("widgetGenderUnknown")+'"></i>');
                  break;
            }
          }
          else {
            $('#customer-gender').html('<i class="fa fa-question" title="'+tr("widgetGenderUnknown")+'"></i>');
          }

          $('#customer-name').val(response.name);
          $('#customer-customerNumber').val(response.customerNumber);
          $('#customer-address').val(response.address);
          $('#info [name=country]').val(response.countryCode);
          $('#customer-email').val(response.email);
          $('#customer-phone').val(response.phoneNumber);
          $('#customer-phone-areaCode').val(response.areaCode);
          $('#customer-mobile').val(response.mobileNumber);
          $('#customer-post').val(response.postNumber);
          $('#customer-city').val(response.postOffice);
          $('#customer-customerSpecifier').val(response.addressSpecifier);

          $('#infoWidgetLoader').removeClass('widget-black');

 
          $('#fonectaLink').attr("href","https://www.fonecta.fi/henkilot/haku/-/"+response.name+"");
          $('#finnishPostLink').attr("href", "http://www.verkkoposti.com/e3/postinumeroluettelo?po_commune_radio=zip&streetname=&po_commune=&zipcode="+response.postNumber+"");

          $('#addressChangeCount').text(response.addressChangeCount);

          var operation = "customer";

   

          $('#customer-leka-link').html("<span class='lekaCustomerJump' leka-number='"+response.customerNumber+"'><a href='#' class='blue-underline' target='blank'>"+tr('widgetCustomerNumber')+"</a></span>");


          if(!_this.eventsBinded) {
             _this.bindEvents();
           }

          if ( response.addressChangeCount > 0 ) {
            _this.loadCustomerAddressHistory(response.customerNumber);
          }
        
        }

        this.loadCustomerAddressHistory = function(customerId) {

          var customer = {
            id: customerId
            
          };

          DP.execute({type: "apiCustomerAddress", method: "findCustomerAddress", params: customer }).then(function(response) {

              $('#addresstablehidden tr').remove();
              $('#addresstablehidden').append("<tr>"+
                              "<th>"+tr("widgetActive")+"</th>"+
                              "<th>"+tr("widgetCustomerAddress")+"</th>"+
                              "<th>"+tr("widgetCustomerPOandCity")+"</th>"+
                              "<th>"+tr("widgetCountry")+"</th>"+
                              "<th>"+tr("widgetSpecifier")+"</th>"+ 
                                "</tr>");

              $.map(response.addressHistory, function(customerAddress) {
           
                customerAddress = characterReplacer.replaceCharacters(customerAddress);

                var startDate = customerAddress.startDate;
                var endDate = customerAddress.endDate;

                if (customerAddress.startDate !== characterReplacer.replaceCharacter) {
                  startDate = moment(startDate).format('DD.MM.YYYY');
                  endDate = moment(endDate).format('DD.MM.YYYY');

                $('#addresstablehidden').append("<tr>"+
                      "<td>" + startDate + " - " + endDate + "</td>"+
                      "<td>" + customerAddress.address + "</td>"+
                      "<td>" + customerAddress.postNumber +" "+customerAddress.postOffice+ "</td>"+
                      "<td>" + customerAddress.countryCode +"</td>"+
                      "<td>" + customerAddress.addressSpecifier +"</td>"+
                      "</tr>");
             
                  }

                });       

        });

    }


    this.updateCustomerInformation = function (customerNumber) {

          var _this = this;

          // null means allowed
          var saleDenial = null;
          var supplyDenial = null;
          // null means not allowed.
          var emailSupplyDenial = null;

          if ($('[name=saleDenials]').val() !== 'no') {
            saleDenial =  $('[name=saleDenials]').val();
          }

          if ($('[name=supplyDenials]').val() !== 'allowed') {
            supplyDenial = $('[name=supplyDenials]').val();
          }

          if ($('#customer-email-marketing').prop('checked')) {
            emailSupplyDenial = "K";
          }
          else {
            emailSupplyDenial = "E";
          }

          var myDigiUser = null;
          if (typeof customerServiceWidgetManager.activeMyDigiCustomer !== "undefined") {
            myDigiUser = customerServiceWidgetManager.activeMyDigiCustomer;
          }

          var customer  = {
              address: $('#customer-address').val(), 
              addressSpecifier: $('#customer-customerSpecifier').val(), 
              areaCode: $('#customer-phone-areaCode').val(),
              countryCode: $('#info [name=country]').val(),
              customerNumber: customerNumber,
              email: $('#customer-email').val(), 
              emailSupplyDenial: emailSupplyDenial,
              mobileNumber: $('#customer-mobile').val(),
              name: $('#customer-name').val(),
              phoneNumber: $('#customer-phone').val(), 
              postNumber: $('#customer-post').val(), 
              saleDenial: saleDenial,
              supplyDenial: supplyDenial,
              myDigiUser: myDigiUser
          };

          // Check if this a temporary change
          if ($('.customer-service-info-widget #temporary-change').prop("checked")) {
            if ( $('.customer-service-info-widget .temporary-date-start').datepicker("getDate") != null &&
                 $('.customer-service-info-widget .temporary-date-end').datepicker("getDate") != null) {
              customer.startDate = moment($('.customer-service-info-widget .temporary-date-start').datepicker("getDate")).format('YYYY-MM-DD');
              customer.endDate = moment($('.customer-service-info-widget .temporary-date-end').datepicker("getDate")).format('YYYY-MM-DD');
            } else {
              Notification.error({title: tr("widgetCustomerInfoUpdateFailedException"),
                                  message: tr("widgetMissingTemporaryDateException")});
              return;
            }
          }

          if ( $('#customer-name').val() !== null && $('#customer-name').val().length > 26 ) {

             Notification.error({
                    title: tr("widgetCustomerInfoUpdateFailedException"),
                    message: tr("widgetNameTooLongException")
                  });
          }
          else if ( $('#customer-address').val() !== null && $('#customer-address').val().length > 26 ) {
               Notification.error({
                    title: tr("widgetCustomerInfoUpdateFailedException"),
                    message: tr("widgetStreetTooLongException")
                  });

          }

          else if ( $('#customer-customerSpecifier').val() !== null && $('#customer-customerSpecifier').val().length > 26 ) {
               Notification.error({
                    title: tr("widgetCustomerInfoUpdateFailedException"),
                    message: tr("widgetSpecifierTooLongException")
                  });
          }

          else {

          DP.execute({type:"apiCustomer", method:"updateCustomer", params: customer}).then(function(response) {
             
             var updatedCustomer = {
              id: customer.customerNumber

            };


             if (response.message === 'Successful') {

               $('input').removeClass('modified-green');
               $('.footer').addClass('hidden');

                    Notification.success({
                    title: tr("widgetCustomerChanged"),
                         message: tr("widgetCustomerNewInfo"),
                         container: $("body")
                       });

                   _this.populateCustomerInformation(response.customer);
                   customerServiceWidgetManager.activeCustomer = response.customer;
                   customerServiceWidgetManager.householdWidget.loadData(response.customer.customerNumber);
              
             }

             else if (response.message === 'Failed') {
       

                  Notification.error({
                    title: "Asiakastietojen päivitys epäonnistui",
                    message: response.customer.message
                  });

            }

            });

        }

    }


    this.bindEvents = function() {

      this.eventsBinded = true;

       var _this = this;

       $('#infoWidget input').on('input', function(){

            $(this).addClass('modified-green');
            $('.footer').removeClass('hidden');
  
        }); 

      $('.lekaCustomerJump').on('click', function(event) {

          event.preventDefault();

         LekaJumper.jumpToLeka("customerbaseinfo", $('.lekaCustomerJump').attr('leka-number'));

        });

       $('#info').on('click', function(event) {

         if(document.getElementById("jarviswidget-fullscreen-mode")) {
            $('#addresstablehidden').removeClass('hidden');
            $('#addressHistoryLabel').show();
            
          }
          else {
            $('#addresstablehidden').addClass('hidden');
            $('#addressHistoryLabel').hide();
      
            }
        });

        // listener for sales denials change
        $('#customer-email-marketing').on('change', function(event) {
          $(this).addClass('modified-green');
          $('.footer').removeClass('hidden');

        });


        $('#cancelbutton').click(function() {
           $('#infoWidget select').removeClass('modified-green');
           $('input').removeClass('modified-green');
           $('.footer').addClass('hidden');

          _this.loadData($('#customer-customerNumber').val())
      

        });

         // listener for sales denials change
        $('[name="supplyDenials"]').on('change', function(event) {
          $(this).addClass('modified-green');
          $('.footer').removeClass('hidden');

        });

        // listener for marketings allowed change
        $('[name="saleDenials"]').on('change', function(event) {
        
          $(this).addClass('modified-green');
          $('.footer').removeClass('hidden');

        });

         $('#savebutton').click(function() {

          _this.updateCustomerInformation($('#customer-customerNumber').val());

        });

        // Set up temporary address change UIs
        $('.customer-service-info-widget .temporary-date-start').datepicker("option", "minDate", 0);
        $('.customer-service-info-widget .temporary-date-end').datepicker("option", "minDate", 0);

        $('.customer-service-info-widget #temporary-change').change(function() {
          if ($(this).prop("checked")) {
            $('.customer-service-info-widget .footer .smart-form > *:not(.checkbox)').removeClass("hidden");
          } else {
            $('.customer-service-info-widget .footer .smart-form > *:not(.checkbox)').addClass("hidden");
          }
        });

        $('.customer-service-info-widget .temporary-date-start').change(function() {
          var date = $(this).datepicker("getDate");

          // Limit start date of end datepicker
          $('.customer-service-info-widget .temporary-date-end').datepicker("option", "minDate", date);
        });
    }

    this.create = function(insideElement){

        this.view = $("<div class='jarviswidget jarviswidget-color-blueDark customer-service-info-widget' data-widget-deletebutton='false' data-widget-colorbutton='false' data-widget-editbutton='false'  id='info'>"+
                  " <header>"+
                 " <h2>Asiakastiedot</h2> "+             
                   " </header>"+
                   "<!-- widget div-->"+
                  "<div class='widget-body' id='infoWidget'>"+
                  "  <!-- widget edit box -->"+
                   "<p class='eliteWidget year'><b>"+tr("widgetBirthYear")+"</b>: <span id='customer-birthyear'></span> <b>"+tr("widgetGender")+"</b>: <span id='customer-gender'></span></p>"+
                 
                    "<div class='col-xs-6'>"+

                       "<form class='form-horizontal' role='form'>"+
                       "<fieldset>"+
                              "<div class='form-group'>"+

                              "<label class='col-md-4 control-label text-left'>"+tr("widgetCustomerName")+"</label>"+
                                 "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='customer-name' value=''  />"+
                                  "</div>"+
                              "</div>"+ 

                              "<div class='form-group'>"+
                                  "<label class='col-md-4 control-label text-left'><span id='customer-leka-link'></span></label>"+
                                  "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='customer-customerNumber' value='' disabled />"+
                                  "</div>"+
                              "</div>"+
                               "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'><a id='finnishPostLink' href='http://www.posti.fi/henkiloasiakkaat/postipalvelee/tyokalut/postinumerohaku/' target='blank' class='blue-underline'>"+tr("widgetPostOffice")+"</a><i class='fa fa-external-link external-link-widget' title='"+tr("widgetItellaTitle")+"'></i></label>"+
                                  "<div class='col-md-3 reduced-padding'>"+
                                    "<input class='form-control' type='text' id='customer-post' value=''  />"+
                                  "</div>"+
                                  "<div class='col-md-5'>"+
                                    "<input class='form-control' type='text' id='customer-city' value='' disabled  />"+
                                  "</div>"+
                                 
                                 
                              "</div>"+
                              "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetCustomerAddress")+"</label>"+
                                 "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='customer-address' value=''  />"+
                                  "</div>"+
                              "</div>"+
                              "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetCountry")+"</label>"+
                                 "<div class='col-md-8'>"+
                                  util.countryCodeSelectHTML+
                                  "</div>"+
                              "</div>"+
                                 "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetSpecifier")+"</label>"+
                                 "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='customer-customerSpecifier' value=''  />"+
                                  "</div>"+
                            "</div>"+
                              "</fieldset>"+

                            "</form>"+
                         "</div>"+
                    
                         "<div class='col-xs-6'>"+
                          "<form class='form-horizontal' role='form'>"+
                              "<fieldset>"+
                            
                             "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'><a id='fonectaLink' href='https://www.fonecta.fi/henkilot/haku/-/puhelinnumero' target='blank' class='blue-underline'>"+tr("widgetPhone")+"</a><i class='fa fa-external-link external-link-widget' title='"+tr("widgetFonectaTitle")+"'></i></label>"+
                                  "<div class='col-md-3 reduced-padding'>"+
                                    "<input class='form-control' type='text' id='customer-phone-areaCode'  value='' disabled  />"+
                                  "</div>"+
                                  "<div class='col-md-5'>"+
                                    "<input class='form-control' type='text' id='customer-phone' value=''  />"+
                                  "</div>"+
                            "</div>"+
                            "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetOtherPhone")+"</label>"+
                                 "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='customer-mobile' value=''  />"+
                                  "</div>"+
                            "</div>"+
                             "<div class='form-group'>"+
                                 "<label class='col-md-4 control-label text-left'>"+tr("widgetEmail")+"</label>"+
                                 "<div class='col-md-8'>"+
                                    "<input class='form-control' type='text' id='customer-email' value='' style='font-size:10px;'  />"+
                                  "</div>"+
                            "</div>"+
                          "<div class='smart-form customer-email-container'>"+
                         
                           "<label class='toggle'>" +
                           "<input type='checkbox' name='checkbox-toggle' id='customer-email-marketing' checked=checked>"+tr("widgetEmailAllowed")+
                           "<i data-swchon-text='"+tr("yes")+"' data-swchoff-text='"+tr("no")+"'></i>" +
                         "</label><br>" +
                         "</div>"+
                               "<div class='form-group supplyDenialsWrapper'>"+
                                 "<label class='col-md-6 control-label text-left'><a href='http://www.asml.fi/kieltopalvelut/' target='blank' class='blue-underline'>"+tr("widgetDenials")+"</a><i class='fa fa-external-link external-link-widget' title='"+tr("asmlService")+"'></i></label>"+
                                 "<div class='col-md-6'>"+
                                    "<select name='supplyDenials' class='form-control'>"+
                                      "<option value='N'>"+tr("widgetN")+"</option>"+
                                      "<option value='O'>"+tr("widgetOOO")+"</option>"+
                                      "<option value='P'>"+tr("widgetPPP")+"</option>"+
                                      "<option value='K'>"+tr("widgetKKK")+"</option>"+
                                      "<option value='X'>"+tr("widgetXXX")+"</option>"+
                                      "<option value='allowed'>"+tr("widgetAllowed")+"</option>"+
                                    "</select>"+
                                  "</div>"+
                                 "</div>"+
                                 "<div class='form-group saleDenialsWrapper'>"+
                                 "<label class='col-md-6 control-label text-left'>"+tr("widgetSaleDenials")+"</label>"+
                                 "<div class='col-md-6'>"+
                                    "<select name='saleDenials' class='form-control'>"+
                                      "<option value='X'>"+tr("widgetSalesDenial")+"</option>"+
                                      "<option value='Z'>"+tr("widgetCustomerServiceDenial")+"</option>"+
                                      "<option value='no'>"+tr("widgetAllowed")+"</option>"+
                                    "</select>"+
                                  "</div>"+
                                 "</div>"+
                        "</fieldset>"+
                        "</form>"+
                        "</div>"+
                       
                            "<div class='form-group'>"+
                             "<span id='customerDead' style='padding-left:15px;'></span>"+
                             "</div>"+
                        "<div class='clearfix'></div>"+

                        "<div class='eliteWidget footer hidden text-right'>"+
                      "<div>" +
                        "<span class='smart-form'>" +
                          "<label class='checkbox'><input id='temporary-change' type='checkbox' name='checkbox-inline'><i></i>" + tr("widgetTempChange", "capitalizefirst") + "</label> " +
                          "<div class='datepickerwrapper hidden'><i class='fa fa-calendar icon-append'></i><input class='datepicker temporary-date-start'></div>" +
                          "<span class='hidden'>–</span>"+
                          "<div class='datepickerwrapper hidden'><i class='fa fa-calendar icon-append'></i><input class='datepicker temporary-date-end'></div>" +
                        "</span>" +
                        "<span>"+tr("widgetSaveChanges")+"</span>" +
                        "<span><button type='button' class='btn btn-success btn-large' id='savebutton'>" +
                          tr("save") +
                        "</button></span>" +
                        "<span><button stype='button' id='cancelbutton' class='btn btn-default btn-large'>" +
                          tr("cancel") +
                        "</button></span></div>"+
                      "</div>"+

                        "<span style='padding-left:10px;'><b>"+tr("widgetAddressHistory")+"</b> <span id='addressChangeCount'></span> "+tr("widgetPreviousAddress")+"</span><br><br>"+
                        "<table class='table table-striped hidden' id='addresstablehidden'>"+   
                        "<thead>"+
                        "</thead>"+
                        "<tbody>"+
                        "</tbody>"+            
                        "</table>"+

                    "<div class='clearfix'></div>"+
                      "</div>"+
                   "</div>");
        

        $(insideElement).append(this.view);
        
        /* Fix weird button click problem */
       // this.settingsView.find('label.btn-sm').css('width', '100px');
        
        this.domReady = true;
        this.parent = insideElement;


    } // this.create

} // analyticsWidget

});
