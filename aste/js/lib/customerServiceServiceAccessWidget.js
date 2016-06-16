define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment', 'viivaNotification', 'viivaGraphSettings',
        'smartAdmin', 'ember', 'dialogManager', 'underscore'],
    function($, jui, DP, util, tr, moment, Notification, viivaGraph, viivaGraphSettings, Ember, DialogManager, underscore) {

return function (){
    this.settings = new Object();
    this.destroyed = false;

    this.loadData = function (email) {

        var _this = this;

        if (typeof email !== "undefined") {

            var data = {
              email: email
            }
       
            DP.execute({type: "apiServiceAccess", method:"getServiceAccess", params: data}).then(function(response) {
                  _this.populateServiceAccess(response);
                

                });
          }

          else {

               $('#serviceaccessTable').append("<tr><td colspan='100%'>Ei tuloksia</td></tr>");

          }
         
        }
       

      this.populateServiceAccess = function(response) {

          $('#serviceaccess tbody tr').remove();


          if (_.isEmpty(response.access)) {
              $('#serviceaccessTable').append("<tr><td colspan='100%'>Ei tuloksia</td></tr>");
          }

          else {

          for ( var i = 0; i < response.access.length; i++ ) {

          response.access[i] = characterReplacer.replaceCharacters(response.access[i]);

          var lastAuth = response.access[i].lastAuth;
          var firstAuth = response.access[i].firstAuth;


            if (lastAuth !== characterReplacer.replaceCharacter) {
              lastAuth = moment(lastAuth).format('DD.MM.YYYY HH:mm:ss');
            }
            if (firstAuth !== characterReplacer.replaceCharacter) {
              firstAuth = moment(firstAuth).format('DD.MM.YYYY HH:mm:ss');
            }
          
          $('#serviceaccessTable tbody').append("<tr>"+
            "<td>"+ response.access[i].serviceName +"</td>"+
            "<td>"+ lastAuth + "</td>"+
            "<td>"+ firstAuth + "</td>");
          }

        }
      }

 
    this.create = function(insideElement){

        this.view = $("<div class='jarviswidget jarviswidget-color-blueDark' data-widget-custombutton='true' data-widget-deletebutton='false' data-widget-colorbutton='false' data-widget-editbutton='false'  id='serviceAccess'>"+
                  " <header>"+
                 " <h2>Palveluiden käyttö</h2> "+             
                   " </header>"+
                   "<!-- widget div-->"+
                  "<div class='widget-body' id='serviceAccessWidget'>"+
                  "  <!-- widget edit box -->"+
                        "<table class='table table-hover' id='serviceaccessTable'>"+
                       "<thead>"+
                        " <tr>"+
                         "<th>"+tr("widgetService")+"</th>"+
                          "<th>"+tr("widgetLastLogin")+"</th>"+
                          "<th>"+tr("widgetFirstLogin")+"</th>"+
                          "</tr>"+
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