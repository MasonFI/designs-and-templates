define(['jquery', 'moment', 'translate', 'dataPool'], 
    function($, moment, tr, DP) {
  return {
    
    getAccessHistory: function() {

      $('#historyTable tr').remove();

        DP.execute({type: "accessLog", method:"findAccesses"}).then(function(history) {

            $.map(history, function(access) {

              $('#historyTable').append("<tr>"+
              "<td>"+access.customerNumber+"</td>"+
              "<td>"+access.name+"</td>"+
              "<td>"+access.date+"</td>"+
              "</tr>"
              );

              });  

             $("#historyTable tr").click(function() {
              var customerNumber = $(this).closest('tr').find('td:first').text();
              if (customerNumber != null && customerNumber.length>0) {
                App.Router.router.transitionTo('customerService', customerNumber);
                       
              }
              
              });

        });

        return true;
            
    },

    logAccess: function(logData) {

      if (typeof logData !== "undefined" && logData) {
        var data = {

            id: logData.id,
            extraData: {
              name: logData.name,
              email: logData.email
            }
          }

       DP.execute({type: "accessLog", method:"createAccessLog", params:data}).then(function() {
          
          return true;
       });

        
      } else {
        return null;
      }
    },
  };
});
