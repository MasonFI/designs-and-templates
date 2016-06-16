define(['jquery', 'moment', 'translate', 'dataPool', 'viivaNotification'],
  function ($, moment, tr, DP, Notification) {
    return {

      jumpToLeka: function (operation, param, param2) {

        console.log("Initializing the awesome");

        var data;

        if (operation === 'customerbaseinfo') {
          data = {
            operation: "customerbaseinfo",
            customerId: param
          }
        }

        else if (operation === 'billpayment') {
          data = {
            operation: "billpayment",
            invoiceInstructionNumber: param
          }

        }

        else if (operation === 'postdelivery') {
          data = {
            operation: "postdelivery",
            orderId: param
          }

        }

        else if (operation === 'customerBenefit') {
          data = {
            operation: "customerBenefit",
            customerId: param
          }

        }

        else if (operation === 'salesPerson') {
          data = {
            operation: "salesPerson",
            salesPersonNumber: param
          }

        }

        else if (operation === 'paymentEntry') {
          data = {
            operation: "paymentEntry",
            orderId: param,
            invoiceInstructionNumber: param2
          }

        }

        else if (operation === 'discountItem') {
          data = {
            operation: "discountItem",
            benefitCode: param
          }

        }

        DP.execute({type: "apiLink", method: "executeLink", params: data}).then(function (response) {
          if (response.message === 'Successful') {
            Notification.success({
              title: "Hypätty lekaan",
              message: "Lekahyppy onnistui"
            });
          }
        });
        return true;
      }
    };
  });
