define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment', 'viivaNotification', 'viivaGraphSettings',
  'smartAdmin', 'ember', 'dialogManager'],
  function($, jui, DP, util, tr, moment, Notification, viivaGraph, viivaGraphSettings, Ember, DialogManager) {

    return function (){
      this.settings = new Object();
      this.destroyed = false;


      this.loadData = function (customerId) {
        var _this = this;

        var data = {
          id: customerId
        };

        DP.execute({type: "apiOffer", method:"getOffers", params: data}).then(function(response) {

         _this.populateOffers(response);

       });

      };

      this.populateOffers = function(response) {

        var _this = this;

        $("#customer-offers-table tr").remove();
        $("#customer-offers-table").append("<tr>"+
          "<th>"+tr("widgetProduct")+"</th>"+
          "<th>"+tr("widgetDate")+"</th>"+
          "<th>"+tr("widgetOT")+"</th>"+
          "<th>"+tr("widgetPrice")+"</th>"+
          "<th>"+tr("widgetOfferNo")+"</th>"+
          "<th>"+tr("widgetExplanation")+"</th>"+
          "</tr>");

        if (response.message === 'Failed') {
          $("#customer-offers-table").append("<tr><td colspan='100%'>"+response.offers.message+"</td></tr>");
        }

        else {
          response.offers = simpleSorter.sortByProperty(response.offers, 'offerDate', 'desc');

          var resultsInPeriod = 0;

          for ( var i = 0; i < response.offers.length; i++) {

            response.offers[i] = characterReplacer.replaceCharacters(response.offers[i]);

            var offerDate = response.offers[i].offerDate;
            var offerPrice = response.offers[i].price;

            if (offerDate !== characterReplacer.replaceCharacter) {
              offerDate = moment(offerDate).format('DD.MM.YYYY');
            }

            if (offerPrice !== characterReplacer.replaceCharacter) {
              offerPrice = offerPrice.toFixed(2);
            }

            var shouldHideOfferRow = true;
              // 6 months old but max 10 offers
              if(!moment().subtract(0.5,'year').isAfter(response.offers[i].offerDate) && i<10) {
                shouldHideOfferRow = false;
                resultsInPeriod++;
              }
              
              $("#customer-offers-table").append("<tr"+(shouldHideOfferRow ? " class='offers-fullscreen-row hidden'" :" ")+">"+
                "<td>" + response.offers[i].productCode + "</td>"+
                "<td>" + offerDate + "</td>"+
                "<td>" + response.offers[i].campaignSubCode+ "</td>"+
                "<td>" + offerPrice+ "</td>"+
                "<td>"+ (typeof response.offers[i].link !== "undefined" ? "" :  response.offers[i].offerNumber )+"</td>"+
                "<td>"+ (typeof response.offers[i].link !== "undefined" ? "<a href='"+this.getNeolaneLink(response.offers[i].link)+"' target='_blank' class='blue-underline'>"+response.offers[i].description+"</a>" :  response.offers[i].description )+"</td>"+
                "</tr>");
            }


          }

          if (resultsInPeriod < 1) {
            $("#customer-offers-table").append("<tr><td colspan='100%'>Ei tuloksia tarkastelujaksolla.</td></tr>");
          }

          _this.bindEvents();
        };

        this.getNeolaneLink = function(link) {

          var customerName = this.getLekaName(customerServiceWidgetManager.activeCustomer.name);
          var email="";
          if (typeof customerServiceWidgetManager.activeCustomer.email != "undefined" && customerServiceWidgetManager.activeCustomer.email != null ) {
            email = customerServiceWidgetManager.activeCustomer.email.toLowerCase();
          }

          var firstName = "&etu="+this.capitalize(customerName.firstName);
          var lastName = "&suku="+this.capitalize(customerName.lastName);
          var address = "&osoite="+this.capitalize(customerServiceWidgetManager.activeCustomer.address);
          var postNo = "&pono="+customerServiceWidgetManager.activeCustomer.postNumber;
          var postOffice = "&potp="+this.capitalize(customerServiceWidgetManager.activeCustomer.postOffice);
          var email = "&sposti="+email;

          return link+firstName+lastName+address+postNo+postOffice+email;
        };

        this.getLekaName = function(name) {

          var name = name.split(" ");
          var firstName = name.pop();
          var lastName = name.join(" ");

          var lekaName = {
            firstName: firstName,
            lastName: lastName
          };

          return lekaName;
        };

        this.capitalize = function(str) {
          var lower = str.toLowerCase();
          return lower.replace(/(^| )(\w)/g, function(x) {
            return x.toUpperCase();
          });
        };

        this.bindEvents = function() {

          $('#offers').on('click', function(event) {

           if(document.getElementById("jarviswidget-fullscreen-mode")) {
            $('#customer-offers-table .offers-fullscreen-row').removeClass('hidden');

          }
          else {
            $('#customer-offers-table .offers-fullscreen-row').addClass('hidden');

          }
        });


        };


        this.create = function(insideElement){

          this.view = $("<div class='jarviswidget jarviswidget-color-blueDark' data-widget-deletebutton='false' data-widget-colorbutton='false' data-widget-editbutton='false'  id='offers'>"+
            " <header>"+
            " <h2>Tarjoukset</h2> "+             
            " </header>"+
            "<!-- widget div-->"+
            "<div class='widget-body' id='offersWidget'>"+
            "  <!-- widget edit box -->"+
            " <table class='table table-striped' id='customer-offers-table'>"+
            " <thead>"+
            "</thead>"+
            "<tbody>"+
            "</tbody>"+
            "</table>"+
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