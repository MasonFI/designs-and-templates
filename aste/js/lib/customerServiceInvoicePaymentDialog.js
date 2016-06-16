define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaNotification', 'viivaUtility', 'viivaDialog'],
 function($, jui, Ember, DP, tr, Notification, util) {
  var dialog = "<div class='row' style='margin-left: 0'>"+
                    "<h2>"+tr("invoices")+"</h2><br>"+
                    "<div class='invoices'>"+
                      "<table class='table table-hover invoices-table'>"+
                        "<thead>"+
                          "<tr>"+
                            "<th>"+tr("invoiceReferenceDate")+"</th>"+
                            "<th>"+tr("invoiceVtype")+"</th>"+
                            "<th>"+tr("invoiceReference")+"</th>"+
                            "<th>"+tr("invoiceSmax")+"</th>"+
                            "<th>"+tr("invoiceVmin")+"</th>"+
                            "<th>"+tr("invoiceDueDate")+"</th>"+
                            "<th>"+tr("invoiceProductCode")+"</th>"+
                            "<th>"+tr("invoiceBatchNumber")+"</th>"+
                            "<th>"+tr("invoicePacketReferenceNumber")+"</th>"+
                            "<th>"+tr("invoiceInvoiceAddress")+"</th>"+
                          "</tr>"+
                        "</thead>"+
                      "</table>"+
                      "</div>"+
                    "<h2>"+tr("payments")+"</h2><br>"+
                    "<div class='payments'>"+
                        "<table class='table table-hover payments-table'>"+
                          "<thead>"+ 
                            "<tr>"+
                              "<th>"+tr("paymentDate")+"</th>"+
                              "<th>"+tr("paymentAmount")+"</th>"+
                              "<th>"+tr("paymentReferenceNumber")+"</th>"+
                              "<th>"+tr("paymentLoggingDate")+"</th>"+
                              "<th>"+tr("paymentTransactionDate")+"</th>"+ 
                              "<th>"+tr("paymentarchiveNumber")+"</th>"+
                            "</tr>"+
                          "</thead>"+
                      "</table>"+
                      "</div>"+                    
                    "</div>";

  var UserDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = this.$("");

      var data = {
        orderNumber: _this.options.message.id
      }
  
        DP.execute({type: "apiOrder", method:"getInvoicePaymentInformation", params: data}).then(function(response) {

        for (var i = 0; i < response.orderinvoicepaymentinformation.invoices.length; i++ ) {

          var smax = response.orderinvoicepaymentinformation.invoices[i].smax;
          var smin = response.orderinvoicepaymentinformation.invoices[i].smin;

          if (smax != null && smax != "")  {
            smax = smax.toFixed(2);
          }

           if (smin != null && smin != "")  {
            smin = smin.toFixed(2);
          }

       response.orderinvoicepaymentinformation.invoices[i] = characterReplacer.replaceCharacters(response.orderinvoicepaymentinformation.invoices[i]);

         $('.invoices-table').append("<tr>"+
          "<td>"+util.parseDate(response.orderinvoicepaymentinformation.invoices[i].referenceDate, "DD.MM.YYYY")+"</td>"+
          "<td>"+tr("invoice"+response.orderinvoicepaymentinformation.invoices[i].vtype)+"</td>"+
          "<td>"+response.orderinvoicepaymentinformation.invoices[i].reference+"</td>"+
          "<td>"+smax+"</td>"+
          "<td>"+smin+"</td>"+
          "<td>"+util.parseDate(response.orderinvoicepaymentinformation.invoices[i].dueDate, "DD.MM.YYYY")+"</td>"+
          "<td>"+response.orderinvoicepaymentinformation.invoices[i].productCode+"</td>"+
          "<td>"+response.orderinvoicepaymentinformation.invoices[i].batchNumber+"</td>"+
          "<td>"+response.orderinvoicepaymentinformation.invoices[i].packetReference+"</td>"+
          "<td>"+response.orderinvoicepaymentinformation.invoices[i].invoiceAddress+"</td>"+
          "</tr>");
        }

        for (var j = 0; j <response.orderinvoicepaymentinformation.payments.length; j++ ) {
          response.orderinvoicepaymentinformation.payments[j] = characterReplacer.replaceCharacters(response.orderinvoicepaymentinformation.payments[j]);

          var paymentDate = response.orderinvoicepaymentinformation.payments[j].paymentDate;
          if (paymentDate != null && paymentDate.length > 0) {
            paymentDate = util.parseDate(response.orderinvoicepaymentinformation.payments[j].paymentDate, "DD.MM.YYYY")
          } 

          var amount = response.orderinvoicepaymentinformation.payments[j].amount;

          if (amount != null && amount != "") {
            amount = amount.toFixed(2);
          }
          var loggingDate = response.orderinvoicepaymentinformation.payments[j].loggingDate;
          var transactionDate = response.orderinvoicepaymentinformation.payments[j].transactionDate;

          $('.payments-table').append("<tr>"+
            "<td>"+paymentDate+"</td>"+
            "<td>"+amount+"</td>"+
            "<td>"+response.orderinvoicepaymentinformation.payments[j].reference+"</td>"+
            "<td>"+util.parseDate(response.orderinvoicepaymentinformation.payments[j].loggingDate, "DD.MM.YYYY")+"</td>"+
            "<td>"+util.parseDate(response.orderinvoicepaymentinformation.payments[j].transactionDate, "DD.MM.YYYY")+"</td>"+ 
            "<td>"+response.orderinvoicepaymentinformation.payments[j].archiveNumber+"</td>"+   
            "</tr>");
          }

       });
    

      var dialogButtons = [ {
          html: tr("close"),
          "class": "btn btn-default",
          click: function() {

            if (_this.dialogLock)
              return;
            
            $(this).dialog("close");
            
          }
        }
        ];



jRoot.dialog({minWidth: 1000, minHeight: 800, modal: true, draggable: true, resizable: true,
 title: typeof _this.newUser !== "undefined" && _this.newUser ?
 tr("invoiceInformation") : tr("invoiceInformation"), buttons: dialogButtons});
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
  if (typeof options !== "undefined" && options) {

   var params = {options: options};
  return UserDialog.create(params).appendTo($("body"));
}

}
});
