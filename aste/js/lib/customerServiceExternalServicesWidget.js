define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment','smartAdmin'],
    function($, jui, DP, util, tr, moment) {

return function (){
    this.settings = new Object();
    this.destroyed = false;

    this.create = function(insideElement){
      
        var view = $( " <!-- new widget -->"+
                "<div class='jarviswidget jarviswidget-color-blueDark'  data-widget-deletebutton='false' data-widget-colorbutton='false' data-widget-editbutton='false' id='externalservices'>"+
                  "<header>"+
                 "<h2>Ulkoiset palvelut</h2>"+             
                  " </header>"+
                "<!-- widget div-->"+
                  "<div class='widget-body'>"+
                    "<a href='https://console.elmaeinvoice.net/' target='blank' class='blue-underline'>"+tr("widgetInvoiceArchive")+"</a><br/>"+
                  "</div>"+
                      " <!-- end widget div -->"+
                   "</div>"+
              " <!-- end widget -->");
        
        $(insideElement).append(view);
        
        /* Fix weird button click problem */
       // this.settingsView.find('label.btn-sm').css('width', '100px');
        
        this.domReady = true;
        this.parent = insideElement;
        
    } // this.create
    
    /* Self destruct */
    this.destroy = function(){
        //$(_this).parent().remove();
        this.widgetWrapper.remove();
        this.destroyed = true;
    }
    
    
    
    
} // analyticsWidget

});