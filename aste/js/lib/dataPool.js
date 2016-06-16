define(['jquery', 'ember-data', 'viivaUtility'], function($, DS, util) {
  var debug = false;

  var app = null;
  var classLookup = {};

  function ajax(params) {
    if (typeof params !== "undefined" && params &&
        typeof params.url !== "undefined" && params.url) {
      return new Ember.RSVP.Promise(function(resolve, reject) {

        if (debug && typeof console !== "undefined" && console && typeof console.log === "function") {
          console.log(params.url);
          console.log(typeof params.params !== "undefined" && params.params ? JSON.stringify(params.params) : "{}");
        }

        $.ajax({
          url: params.url,
          type: typeof params.type === "string" && params.type ? params.type : "POST",
          contentType: "application/json; charset=utf-8",
          data: typeof params.params !== "undefined" && params.params ? JSON.stringify(params.params) : "{}",
          dataType: "json",
          success: function(data) {
            if (typeof data !== "undefined" && parseInt(data.code) === 0) {
              if (typeof params.dataInterpreter === "function" &&
                  params.dataInterpreter) {
                data = params.dataInterpreter(data);
                Ember.run(null, resolve, data);
              } else {
                Ember.run(null, resolve);
              }
            } else {
              if (typeof data.message !== "undefined") {
                Ember.run(null, reject, data.message);
              } else {
                Ember.run(null, reject);
              }
            }
          },
          error: function(jqXHR) {
            Ember.run(null, reject, jqXHR);
          }
        });
      });
    } else {
      return null;
    }
  }

  return {
    init: function(appInstance) {
      if (typeof appInstance !== "undefined" && appInstance) {
        app = appInstance;
        var _this = this;

        // Override date type transform for Ember data so
        // that serialization conforms our backend format
        DS.DateTransform = DS.Transform.extend({
          deserialize: function(serialized) {
            var type = typeof serialized;

            if (type === "string") {
              return new Date(Ember.Date.parse(serialized));
            } else if (type === "number") {
              return new Date(serialized);
            } else if (serialized === null || serialized === undefined) {
              // if the value is not present in the data,
              // return undefined, not null.
              return serialized;
            } else {
              return null;
            }
          },

          serialize: function(date) {
            if (date instanceof Date) {
              return util.dateToUTCString(date);
            } else {
              return null;
            }
          }
        });

        // Models
        classLookup["profile"] = app.Profile = DS.Model.extend({
          email: DS.attr("string"),
          givenName: DS.attr("string"),
          familyName: DS.attr("string"),
          level: DS.attr("string"),
          group: DS.attr("string"),
          lekaUserID: DS.attr("string"),
          lekaSalesID: DS.attr("string")
        });

        classLookup["customer"] = app.Customer = DS.Model.extend({
          name: DS.attr("string"),
          customerNumber: DS.attr("string"),
          email: DS.attr("string"),
          created: DS.attr("date"),
          lastAuth: DS.attr("date"),
          phoneMarketable: DS.attr("boolean"),
          emailMarketable: DS.attr("boolean")
        });

        app.Customer.adapter = {
          findURL: util.apiBase + "account.get",
          findParams: function(id) {
            return {account: id};
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data &&
                typeof data.account !== "undefined" && data.account) {
              return data.account;
            }
            return data;
          },

          createURL: util.apiBase + "account.add",
          createDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.account !== "undefined" &&
                data.account) {
              _this.push({type: "customer", data: data.account});
              return data.account;
            }

            return null;
          },

          updateURL: util.apiBase + "account.update",
          updateDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var account = data.get("id");
              var email = data.get("email");
              if (typeof account !== "undefined") {
                return {account: account, email: email};
              }
            }
            return null;
          },

          deleteURL: util.apiBase + ""
        };

        classLookup["user"] = app.User = DS.Model.extend({
          email: DS.attr("string"),
          givenName: DS.attr("string"),
          familyName: DS.attr("string"),
          level: DS.attr("string"),
          lekaUserID: DS.attr("string"),
          lekaSalesID: DS.attr("string")
        });

        app.User.adapter = {
          findURL: util.apiBase + "user.get",
          findParams: function(id){
            return {user: id};
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data &&
                typeof data.user !== "undefined" && data.user) {
              return data.user;
            }
            return data;
          },
          createURL: util.apiBase + "user.add",
          createDataInterpreter: function(data){
            if(typeof data !== "undefined" && data && typeof data.user !== "undefined" && data.user){
              _this.push({type: "user", data: data.user});
              console.log(data);
              return data.user;
            }
            return null;
          },
          passwordResetURL: util.apiBase + "user.password.reset",
          passwordReset: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.passwordResetURL, params: params,
                                  dataInterpreter: function(data) {
                                      return data;
                  }});
              }
          },
          updateURL: util.apiBase + "user.update",
          updateDataFormatter: function(data){
            if(typeof data !== "undefined" && data){
              var user = data.get("id");
              if(typeof user !== "undefined" && user){
                return {user: user, data: data};
              }
            }
            return null;
          }
        };

        classLookup["apiCustomerAddress"] = app.apiCustomerAddress = DS.Model.extend( {
          address: DS.attr("string"),
          addressSpecifier: DS.attr("string"),
          countryCode: DS.attr("string"),
          customerNumber: DS.attr("number"),
          endDate: DS.attr("string"),
          id: DS.attr("string"),
          name: DS.attr("string"),
          postNumber: DS.attr("string"),
          postOffice: DS.attr("string"),
          startDate: DS.attr("string")
        });

        app.apiCustomerAddress.adapter = {
          findURL: util.apiBase + "webapi.customer.address.get",
          findCustomerAddress: function(store, params) {
              if (typeof params !== "undefined" && params) {
                return ajax({url: this.findURL, params: params,
                                  dataInterpreter: function(data) {
                                    if (typeof data.addressHistory !== "undefined" && data.addressHistory &&
                                        data.addressHistory.length > 0) {
                                      return data;
                                    }

                        return null;
                  }});
              }

          }

        };

        classLookup["apiCustomer"] = app.apiCustomer = DS.Model.extend( {
          address: DS.attr("string"),
          addressChangeCount: DS.attr("number"),
          addressSource: DS.attr("number"),
          addressSpecifier: DS.attr("string"),
          areaCode: DS.attr("string"),
          aspaExplanation: DS.attr("string"),
          aspaExplanationDate: DS.attr("string"),
          birthyear: DS.attr("string"),
          countryCode: DS.attr("string"),
          customerNumber: DS.attr("number"),
          email: DS.attr("string"),
          emailSupplyDenial: DS.attr("string"),
          gender: DS.attr("string"),
          id: DS.attr("string"),
          mobileNumber: DS.attr("string"),
          name: DS.attr("string"),
          offerDenial: DS.attr("string"),
          orderReceiverCount: DS.attr("number"),
          orderSensitiveProduct: DS.attr("string"),
          paymentReceiverCount: DS.attr("number"),
          phoneNumber: DS.attr("string"),
          postNumber: DS.attr("string"),
          postOffice: DS.attr("string"),
          saleDenial: DS.attr("string"),
          smsSupplyDenial: DS.attr("string"),
          supplyDenial: DS.attr("string")

        });

        app.apiCustomer.adapter = {
          findURL: util.apiBase + "webapi.customer.query",
          findCustomers: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.findURL, params: params,
                                  dataInterpreter: function(data) {

                                      return data;


                  }});
              }
          },
          customerURL: util.apiBase + "webapi.customer.get",
          getCustomer: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.customerURL, params: params,
                                  dataInterpreter: function(data) {
                                      return data;

                  }});
              }
          },
          checkURL: util.apiBase + "webapi.customer.check",
          checkCustomer: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.checkURL, params: params,
                                  dataInterpreter: function(data) {

                                      return data;


                  }});
              }
          },
          updateURL: util.apiBase + "webapi.customer.update",
          updateCustomer: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.updateURL, params: params,
                                  dataInterpreter: function(data) {
                                    if (typeof data.customer !== "undefined" && data.customer) {
                                      return data;
                                    }


                        return data;
                  }});
              }
          },
          householdURL: util.apiBase + "webapi.household.get",
          getCustomerHousehold: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.householdURL, params: params,
                                  dataInterpreter: function(data) {
                                    if (typeof data.household !== "undefined" && data.household) {
                                      return data;
                                    }

                        return null;
                  }});
              }
          },
          addMdAccountURL: util.apiBase + "webapi.customer.add",
          addMdAccount: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.addMdAccountURL, params: params,
                                  dataInterpreter: function(data) {
                        return data;
                  }});
              }
          },
          changeCustomerNumberURL: util.apiBase + "webapi.customernumber.update",
          changeCustomerNumber: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.changeCustomerNumberURL, params: params,
                                  dataInterpreter: function(data) {
                        return data;
                  }});
              }
          },
          updateEmailURL: util.apiBase + "webapi.customer.email.update",
          updateEmail: function(store, params) {
            if (typeof params !== "undefined" && params) {
              console.log("1");
                return ajax({url: this.updateEmailURL, params: params,
                                  dataInterpreter: function(data) {
                        return data;
                  }});
              }
          }



        };

        classLookup["apiStomp"] = app.apiStomp = DS.Model.extend( {
          number: DS.attr("number")

        });

        app.apiStomp.adapter = {

          executeURL: util.apiBase + "webapi.stomp.get",
          getStomp: function(store, params) {
              if (typeof params !== "undefined" && params) {
                return ajax({url: this.executeURL, params: params,
                            dataInterpreter: function(data) {

                          return data;
                  }});
              }
          },
          getConfigurationURL: util.apiBase + "webapi.stomp.configuration.get",
          getConfiguration: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.getConfigurationURL, params: params,
                                  dataInterpreter: function(data) {
                                    if (typeof data.stompConfiguration !== "undefined" && data.stompConfiguration) {
                                      return data;
                                    }

                        return null;
                  }});
              }
          },
          updateURL: util.apiBase + "webapi.stomp.configuration.update",
          updateConfiguration: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.updateURL, params: params,
                                  dataInterpreter: function(data) {
                                    if (typeof data.stompConfiguration !== "undefined" && data.stompConfiguration) {
                                      return data;
                                    }

                        return null;
                  }});
              }
          }

        };


        classLookup["apiLink"] = app.apiLink = DS.Model.extend( {
          customerNumber: DS.attr("number"),
          orderId: DS.attr("number"),
          invoiceInstructionNumber: DS.attr("number"),
          salesPersonNumber: DS.attr("number"),
          benefitCode: DS.attr("number"),
          operation: DS.attr("string")

        });

        app.apiLink.adapter = {

          executeURL: util.apiBase + "webapi.formview.open",
          executeLink: function(store, params) {
              if (typeof params !== "undefined" && params) {
                return ajax({url: this.executeURL, params: params,
                            dataInterpreter: function(data) {

                          return data;
                  }});
              }
          }

        };

        classLookup["apiOrder"] = app.apiOrder = DS.Model.extend( {
          archivingNumber: DS.attr("string"),
          benefitCode: DS.attr("number"),
          benefitCount: DS.attr("number"),
          campaignSubCode: DS.attr("number"),
          cancellationReason: DS.attr("string"),
          cancellationType: DS.attr("string"),
          deliveryType: DS.attr("string"),
          id: DS.attr("string"),
          invoiceInstructionNumber: DS.attr("number"),
          invoiceReceiverCustomerNumber: DS.attr("number"),
          invoicingPhase: DS.attr("string"),
          nextSalesMethod: DS.attr("string"),
          onlineOrderId: DS.attr("string"),
          orderBonus: DS.attr("number"),
          orderCategory: DS.attr("string"),
          orderDeliveryStartDate: DS.attr("string"),
          orderEndDate: DS.attr("string"),
          orderItemcount: DS.attr("number"),
          orderNumber: DS.attr("number"),
          orderPrice: DS.attr("number"),
          orderProcessingDate: DS.attr("string"),
          orderStartDate: DS.attr("string"),
          orderStartNumber: DS.attr("number"),
          ordererCustomerNumber: DS.attr("number"),
          paymentEntryCount: DS.attr("number"),
          productCode: DS.attr("string"),
          receiverCustomerNumber: DS.attr("number"),
          salesMethod: DS.attr("string"),
          salesPersonNumber: DS.attr("number")

        });

        app.apiOrder.adapter = {
          orderURL: util.apiBase + "webapi.order.query",
          getOrders: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.orderURL, params: params,
                  dataInterpreter: function(data) {
                  if (typeof data.orders !== "undefined" && data.orders) {
                    return data;
                  }
                    return null;
                  }});
              }
          },
          payersOrderURL: util.apiBase + "webapi.order.payers.query",
          getPayersOrders: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.payersOrderURL, params: params,
                  dataInterpreter: function(data) {
                  if (typeof data.orders !== "undefined" && data.orders) {
                    return data;
                  }
                    return null;
                  }});
              }
          },
          consolidatedUrl: util.apiBase + "webapi.consolidated.order.create",
          createConsolidatedOrder: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.consolidatedUrl, params: params,
                  dataInterpreter: function(data) {
                    return data;
                  }});
              }
          },
          resumeURL: util.apiBase + "webapi.order.cancel.resume",
          cancelOrderResume: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.resumeURL, params: params,
                  dataInterpreter: function(data) {
                    return data;
                  }});
              }
          },
          invoicePaymentURL: util.apiBase + "webapi.order.invoicepaymentinformation.get",
          getInvoicePaymentInformation: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.invoicePaymentURL, params: params,
                  dataInterpreter: function(data) {
                    return data;
                  }});
              }
          },
          updateOrderPriceURL: util.apiBase + "webapi.order.price.update",
          updateOrderPrice: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.updateOrderPriceURL, params: params,
                  dataInterpreter: function(data) {
                    return data;
                  }});
              }
          },
          breakURL: util.apiBase + "webapi.order.break",
          breakOrder: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.breakURL, params: params,
                  dataInterpreter: function(data) {
                    return data;
                  }});
              }
          },
          transferURL: util.apiBase + "webapi.order.transfer",
          transferOrder: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.transferURL, params: params,
                  dataInterpreter: function(data) {
                    return data;
                  }});
              }
          },
          cancelURL: util.apiBase + "webapi.order.cancel",
          cancelOrder: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.cancelURL, params: params,
                    dataInterpreter: function(data) {
                    return data;
                  }});
              }
          }

        };

        classLookup["apiOffer"] = app.apiOffer = DS.Model.extend( {
          campaignSubCode: DS.attr("number"),
          description: DS.attr("string"),
          firstMonth: DS.attr("string"),
          id: DS.attr("string"),
          offerDate: DS.attr("string"),
          offerNumber: DS.attr("number"),
          periods: DS.attr("number"),
          price: DS.attr("number"),
          productCode: DS.attr("string"),
          salesMethod: DS.attr("string")
        });

        app.apiOffer.adapter = {
            offerURL: util.apiBase + "webapi.offer.query",
            getOffers: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.offerURL, params: params,
                                  dataInterpreter: function(data) {

                                      return data;

                  }});
              }
          }

        };

        classLookup["accessLog"] = app.AccessLog = DS.Model.extend( {
          customerNumber: DS.attr("string"),
          customerName: DS.attr("string"),
          accessTime: DS.attr("string")

        });


        app.AccessLog.adapter = {
          findURL: util.apiBase + "user.log.get",
          findParams: function(id) {
            return {accessLog: id};
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && data.history !== "undefined" &&
              data.history && data.history instanceof Array && data.history.length > 0) {
                return data.history[0];
              }
              return data;

          },
          findAccesses: function() {
            return ajax({url: util.apiBase + "user.log.get",
                        dataInterpreter: function(data) {
                          if (typeof data.history !== "undefined" && data.history &&
                           data.history.length > 0) {
                            return data.history;
                          }

                          return null;
                        }});
          },
          createURL: util.apiBase + "user.log.access",
          createAccessLog: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.id !== "undefined" && params.id &&
                typeof params.extraData !== "undefined" && params.extraData ) {
              return ajax({url: this.createURL, params: params, dataInterpreter: function(data) {
                           if (typeof data !== "undefined" && data) {
                            _this.push({type: "accessLog", data: data.code});
                             return true;
                           }
                           return true;
                         }});
            } else {
              return true;
            }
          }


        };

        classLookup["apiServiceAccess"] = app.apiServiceAccess = DS.Model.extend( {
         firstAuth: DS.attr("string"),
          lastAuth: DS.attr("string"),
          serviceName: DS.attr("string")

        });

        app.apiServiceAccess.adapter = {

          getURL: util.apiBase + "webapi.serviceaccess.get",
          getServiceAccess: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.getURL, params: params,
                                  dataInterpreter: function(data) {
                                    if (typeof data.access !== "undefined" && data.access) {
                                      return data;
                                    }
                        return null;
                  }});
              }
          }
        };

        classLookup["apiUndeliveredItems"] = app.apiUndeliveredItems = DS.Model.extend( {
         number: DS.attr("number")

        });

        app.apiUndeliveredItems.adapter = {

          undeliveredURL: util.apiBase + "webapi.order.undelivered",
          getUndelivered: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.undeliveredURL, params: params,
                                  dataInterpreter: function(data) {

                                      return data;

                  }});
              }
          }

        };

        classLookup["apiNote"] = app.apiNote = DS.Model.extend( {
          customerNumber: DS.attr("number"),
          updaterId: DS.attr("string"),
          createDate: DS.attr("string"),
          channel: DS.attr("string"),
          noteType: DS.attr("string"),
          description: DS.attr("string"),
          tags: DS.attr("string"),
          meta: DS.attr("string")


        });

        app.apiNote.adapter = {

          noteURL: util.apiBase + "webapi.note.get",
          getNote: function(store, params) {
            if (typeof params !== "undefined" && params) {
                return ajax({url: this.noteURL, params: params,
                                  dataInterpreter: function(data) {
                                    if (typeof data.notes !== "undefined" && data.notes) {
                                      return data;
                                    }

                        return null;
                  }});
              }
          },
          updateURL: util.apiBase + "webapi.note.update",
          updateNote: function(store, params) {
            if (typeof params !== "undefined" && params) {
              return ajax({url: this.updateURL, params: params, dataInterpreter: function(data) {
                             return data;
                         }});
            }
          },
          createURL: util.apiBase + "webapi.note.create",
          createNote: function(store, params) {
            if (typeof params !== "undefined" && params) {
              return ajax({url: this.createURL, params: params, dataInterpreter: function(data) {
                             return data;
                         }});
            }
          }

        };

        classLookup["contact"] = app.Contact = DS.Model.extend({
          account: DS.attr("string"),
          givenName: DS.attr("string"),
          familyName: DS.attr("string"),
          mobile: DS.attr("string"),
          phone: DS.attr("string"),
          email: DS.attr("string"),
          address: DS.attr("string"),
          postCode: DS.attr("string"),
          city: DS.attr("string"),
          country: DS.attr("string"),
          company: DS.attr("string")
        });

        app.Contact.adapter = {
          findURL: util.apiBase + "contact.get",
          findParams: function(id) {
            return {contact: id};
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.contacts !== "undefined" &&
                data.contacts && data.contacts instanceof Array && data.contacts.length > 0) {
              return data.contacts[0];
            }
            return data;
          },
          findByCustomer: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.customer !== "undefined" && params.customer) {
              var promise =  ajax({url: this.findURL, params: {account: params.customer},
                                  dataInterpreter: function(data) {
                                    if (typeof data.contacts !== "undefined" && data.contacts &&
                                        data.contacts.length > 0) {
                                      _this.pushMany({type: "contact", data: data.contacts});
                                      return data.contacts;
                                    }
                                  }});
              if (promise) {
                return DS.PromiseArray.create({promise: promise});
              } else {
                return null;
              }
            }
          },

          createURL: util.apiBase + "contact.add",
          createDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.contact !== "undefined" &&
                data.contact) {
              _this.push({type: "contact", data: data.contact});
              return data.contact;
            }

            return null;
          },

          updateURL: util.apiBase + "contact.update",
          updateDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var contact = data.get("id");
              if (typeof contact !== "undefined") {
                return {contact: contact, data: data};
              }
            }
            return null;
          },

          deleteURL: util.apiBase + "contact.delete",
          deleteDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var contact = data.get("id");
              if (typeof contact !== "undefined") {
                return {contact: contact};
              }
            }

            return null;
          }
        };

        classLookup["order"] = app.Order = DS.Model.extend({
          account: DS.attr("string"),
          created: DS.attr("date"),
          lastPaid: DS.attr("date"),
          state: DS.attr("string"),
          package: DS.attr("string"),
          packageName: DS.attr("string"),
          sellerServiceName: DS.attr("string"),
          sellerUserName: DS.attr("string"),
          paymentMethod: DS.attr("string"),
          emailNotification: DS.attr("boolean"),

          givenName: DS.attr("string"),
          familyName: DS.attr("string"),
          mobile: DS.attr("string"),
          phone: DS.attr("string"),
          email: DS.attr("string"),
          address: DS.attr("string"),
          postCode: DS.attr("string"),
          city: DS.attr("string"),
          country: DS.attr("string"),
          company: DS.attr("string"),

          giftReceiverEmail: DS.attr("string"),
          giftReceiverAddress: DS.attr("string"),
          giftReceiverCity: DS.attr("string"),
          giftReceiverCountry: DS.attr("string"),
          giftReceiverFamilyName: DS.attr("string"),
          giftReceiverGivenName: DS.attr("string"),
          giftReceiverPhone: DS.attr("string"),
          giftReceiverPostCode: DS.attr("string"),

          cancelReason: DS.attr("string"),
          cancelSource: DS.attr("string")
        });

        app.Order.adapter = {
          findURL: util.apiBase + "order.get",
          findParams: function(id) {
            return {order: id};
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.orders !== "undefined" &&
                data.orders && data.orders instanceof Array && data.orders.length > 0) {
              return data.orders[0];
            }
            return data;
          },
          findOffers: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.order !== "undefined" && params.order) {
              return ajax({url: util.apiBase + "order.offer.get",
                          params: {order: params.order},
                          dataInterpreter: function(data) {
                            if (typeof data.offers !== "undefined" && data.offers &&
                                data.offers.length > 0) {
                              return data.offers;
                            }

                            return null;
                          }});
            }
          },

          createURL: util.apiBase + "order.add",
          createWithOffers: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.account !== "undefined" && params.account &&
                typeof params.contact !== "undefined" && params.contact &&
                typeof params.package !== "undefined" && params.package &&
                typeof params.offers !== "undefined" && params.offers instanceof Array &&
                params.offers.length > 0) {
              return ajax({url: this.createURL, params: params, dataInterpreter: function(data) {
                           if (typeof data !== "undefined" && data && typeof data.order !== "undefined" &&
                               data.order) {
                             _this.push({type: "order", data: data.order});
                             return data.order;
                           }

                           return null;
                         }});
            } else {
              return null;
            }
          },

          updateURL: util.apiBase + "",

          // No real delete, just cancel
          deleteURL: util.apiBase + "order.cancel",
          deleteDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var order = data.get("id");
              if (typeof order !== "undefined") {
                var formattedData = {order: order};
                if (data.get("cancelSource")) {
                  formattedData.source = data.get("cancelSource");
                }
                if (data.get("cancelReason")) {
                  formattedData.reason = data.get("cancelReason");
                }

                return formattedData;
              }
            }

            return null;
          }
        };

        classLookup["product"] = app.Product = DS.Model.extend({
          title: DS.attr("string"),
          domain: DS.attr("string"),
          code: DS.attr("string"),
          shortCode: DS.attr("string"),
          otNumber: DS.attr("number"),
          paymentType: DS.attr("string"),
          created: DS.attr("date"),
          description: DS.attr("string"),
          duration: DS.attr("number"),
          price: DS.attr("number"),
          group: DS.attr("number"),
          type: DS.attr("number"),
          receiptInfo: DS.attr("string"),
          extraDescription: DS.attr("string"),
          editable: DS.attr("boolean"),
          fixedSiblingRenewing: DS.attr("string"),
          fixedSiblingFixed: DS.attr("string"),
          fixedSiblingNone: DS.attr("string"),
          renewingSiblingRenewing: DS.attr("string"),
          renewingSiblingFixed: DS.attr("string"),
          renewingSiblingNone: DS.attr("string")
        });

        app.Product.adapter = {
          findURL: util.apiBase + "product.get",
          findParams: function(id) {
            return {product: id};
          },
          getPublishingSchedule: function(store, params) {
            if (typeof params !== "undefined" && params) {
              return ajax({url: util.apiBase + "product.publishingScheduleGet", params: params,
                dataInterpreter: function(data) {
                  if (typeof data.publishingSchedule !== "undefined" && data.publishingSchedule) {
                    return data;
                  }

                  return null;
                }});
            }
          },
          getAll: function(store, params) {
              return ajax({url: util.apiBase + "product.getAll", params: params,
                dataInterpreter: function(data) {
                  if (typeof data.products !== "undefined" && data.products) {
                    return data;
                  }

                  return null;
                }});
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.products !== "undefined" &&
                data.products && data.products instanceof Array && data.products.length > 0) {
              return data.products[0];
            }

            return null;
          },
          postDeliveryAdd: function(store, params) {
            return ajax({url: util.apiBase + "product.postDelivery.add", params: params,
              dataInterpreter: function(data) {
                if (typeof data !== "undefined" && data) {
                  return data;
                }

                return null;
              }});
          },
          postDeliveryGet: function(store, params) {
            return ajax({url: util.apiBase + "product.postDelivery.get", params: params,
              dataInterpreter: function(data) {
                if (typeof data !== "undefined" && data && typeof data.postDeliveries !== "undefined" && data.postDeliveries) {
                  return data.postDeliveries;
                }

                return null;
              }});
          },
          findGroups: function() {
            return ajax({url: util.apiBase + "product.group.get",
                        dataInterpreter: function(data) {
                          if (typeof data.groups !== "undefined" && data.groups &&
                           data.groups.length > 0) {
                            return data.groups;
                          }

                          return null;
                        }});
          },
          findTypes: function() {
            return ajax({url: util.apiBase + "product.type.get",
                        dataInterpreter: function(data) {
                          if (typeof data.types !== "undefined" && data.types &&
                           data.types.length > 0) {
                            return data.types;
                          }

                          return null;
                        }});
          },
          findDefinitions: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.product !== "undefined" && params.product) {
              return ajax({url: util.apiBase + "product.definition.get",
                           params: {product: params.product},
                           dataInterpreter: function(data) {
                             if (typeof data.definitions !== "undefined" && data.definitions &&
                                 data.definitions.length > 0) {
                               return data.definitions;
                             }

                             return null;
                           }});
            }
          },
          findReturnPages: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.products !== "undefined" && params.products) {
              return ajax({url: util.apiBase + "product.returnPages.get",
                          params: {products: params.products},
                          dataInterpreter: function(data) {
                            if (typeof data.returnPages !== "undefined" && data.returnPages &&
                                data.returnPages.length > 0) {
                              return data.returnPages;
                            }

                            return null;
                          }});
            }
          },

          createURL: util.apiBase + "product.add",
          createDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.product !== "undefined" &&
                data.product) {
              _this.push({type: "product", data: data.product});
              return data.product;
            }

            return null;
          },
          createDefinitions: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.product !== "undefined" && params.product &&
                typeof params.definitions !== "undefined" && params.definitions) {
              return ajax({url: util.apiBase + "product.definition.set", params: {product:
                          params.product, definitions: params.definitions}});
            } else {
              return null;
            }
          },

          updateURL: util.apiBase + "product.update",
          updateDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var product = data.get("id");
              if (typeof product !== "undefined") {
                return {product: product, data: data};
              }
            }
            return null;
          },

          deleteURL: util.apiBase + "product.remove",
          deleteDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var product = data.get("id");
              if (typeof product !== "undefined") {
                return {product: product};
              }
            }

            return null;
          }
        };

        classLookup["offer"] = app.Offer = DS.Model.extend({
          product: DS.attr("string"),
          productName: DS.attr("string"),
          durationTo: DS.attr("date"),
          paymentType: DS.attr("string"),
          duration: DS.attr("number"),
          durationType: DS.attr("string"),
          creditPrice: DS.attr("number"),
          paperPrice: DS.attr("number"),
          otNumber: DS.attr("number"),
          priceDefinition: DS.attr("string")
        });

        app.Offer.adapter = {

          findURL: util.apiBase + "offer.get",
          findParams: function(id) {
            return {offer: id};
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.offers !== "undefined" &&
                data.offers && data.offers instanceof Array && data.offers.length > 0) {
              return data.offers[0];
            }
            return data;
          },

          createURL: util.apiBase + "offer.add",
          createDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.offer !== "undefined" &&
                data.offer) {
              _this.push({type: "offer", data: data.offer});
              return data.offer;
            }

            return null;
          },

          updateURL: util.apiBase + "offer.update",
          updateDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var offer = data.get("id");
              if (typeof offer !== "undefined") {
                return {offer: offer, data: data};
              }
            }
            return null;
          },

          deleteURL: util.apiBase + "offer.remove",
          deleteDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var offer = data.get("id");
              if (typeof offer !== "undefined") {
                return {offer: offer};
              }
            }

            return null;
          }
        };

        classLookup["billrow"] = app.BillRow = DS.Model.extend({
          bill: DS.attr("string"),
          start: DS.attr("date"),
          end: DS.attr("date"),
          price: DS.attr("number"),
          lekaReference: DS.attr("string"),
          tax: DS.attr("number"),

          productTitle: DS.attr("string"),
          productShortCode: DS.attr("string"),
          productPaymentType: DS.attr("string")
        });

        app.BillRow.adapter = {
          findURL: util.apiBase + "bill.row.get",
          findParams: function(id) {
            return {billrow: id};
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.billrows !== "undefined" &&
                data.billrows && data.billrows instanceof Array && data.billrows.length > 0) {
              return data.billrows[0];
            }
            return data;
          },
          findByBill: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.bill !== "undefined" && params.bill) {
              var promise =  ajax({url: this.findURL, params: {bill: params.bill},
                                  dataInterpreter: function(data) {
                                    if (typeof data.billrows !== "undefined" && data.billrows &&
                                        data.billrows.length > 0) {
                                      _this.pushMany({type: "billrow", data: data.billrows});
                                      return data.billrows;
                                    }
                                  }});
              if (promise) {
                return DS.PromiseArray.create({promise: promise});
              } else {
                return null;
              }
            }
          },

          createURL: util.apiBase + "",
          updateURL: util.apiBase + "",
          deleteURL: util.apiBase + ""
        };

        classLookup["service"] = app.Service = DS.Model.extend({
          name: DS.attr("string"),
          slug: DS.attr("string"),
          URL: DS.attr("string"),
          extra: DS.attr("string")
        });

        app.Service.adapter = {
          findURL: util.apiBase + "service.get",
          findParams: function(id){
            return {service: id}
          },
          findDataInterpreter: function(data) {
            return data;
          }
        };

        classLookup["package"] = app.Package = DS.Model.extend({
          name: DS.attr("string"),
          from: DS.attr("date"),
          to: DS.attr("date"),
          marketingName: DS.attr("string"),
          creditBillPeriod: DS.attr("number"),
          creditOfferPeriodCount: DS.attr("number"),
          paperBillPeriod: DS.attr("number"),
          otNumber: DS.attr("number"),
          description: DS.attr("string"),
          marketingPrice: DS.attr("string"),
          normalPrice: DS.attr("string"),
          extraDescription: DS.attr("string"),
          marketingSubtext: DS.attr("string"),
          configuration: DS.attr("string"),
          returnPagesSetting: DS.attr("string"),
          editable: DS.attr("boolean"),
          category: DS.attr("string"),
          discountCode: DS.attr("string"),
          isOrderPrevention: DS.attr("boolean")
        });

        app.Package.adapter = {
          findURL: util.apiBase + "package.get",
          findParams: function(id) {
            return {package: id};
          },
          findDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.packages !== "undefined" &&
                data.packages && data.packages instanceof Array && data.packages.length > 0) {
              return data.packages[0];
            }
            return data;
          },
          findByMonth: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.month !== "undefined" && params.month) {
              return ajax({url: this.findURL, params: {month: params.month},
                          dataInterpreter: function(data) {
                             if (typeof data.packages !== "undefined" && data.packages &&
                                 data.packages.length > 0) {
                               return data.packages;
                             }

                             return null;
                           }});
            }
          },
          findOffers: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package) {
              return ajax({url: util.apiBase + "package.offer.get",
                           params: {package: params.package},
                           dataInterpreter: function(data) {
                             if (typeof data.offers !== "undefined" && data.offers &&
                                 data.offers.length > 0) {
                               return data.offers;
                             }

                             return null;
                           }});
            }
          },
          findRequirements: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package) {
              return ajax({url: util.apiBase + "package.requirement.get",
                          params: {package: params.package},
                          dataInterpreter: function(data) {
                            if (typeof data.requirements !== "undefined" && data.requirements &&
                                data.requirements.length > 0) {
                              return data.requirements;
                            }

                            return null;
                          }});
            }
          },
          findServices: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package) {
              return ajax({url: util.apiBase + "package.service.get",
                          params: {package: params.package},
                          dataInterpreter: function(data) {
                            if (typeof data.services !== "undefined" && data.services &&
                                data.services.length > 0) {
                              return data.services;
                            }

                            return null;
                          }});
            }
          },
          findGiveAways: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package) {
              return ajax({url: util.apiBase + "package.giveAways.get",
                          params: {package: params.package},
                          dataInterpreter: function(data) {
                            if (typeof data.giveAways !== "undefined" && data.giveAways &&
                                data.giveAways.length > 0) {
                              return data.giveAways;
                            }

                            return null;
                          }});
            }
          },
          findReturnPages: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package) {
              return ajax({url: util.apiBase + "package.returnPages.get",
                          params: {package: params.package},
                          dataInterpreter: function(data) {
                            if (typeof data.returnPages !== "undefined" && data.returnPages &&
                                data.returnPages.length > 0) {
                              return data.returnPages;
                            }

                            return null;
                          }});
            }
          },

          createURL: util.apiBase + "package.add",
          createDataInterpreter: function(data) {
            if (typeof data !== "undefined" && data && typeof data.package !== "undefined" &&
                data.package) {
              _this.push({type: "package", data: data.package});
              return data.package;
            }

            return null;
          },
          createWithOffers: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.name !== "undefined" && params.name &&
                typeof params.offers !== "undefined" && params.offers instanceof Array &&
                params.offers.length > 0) {
              return ajax({url: this.createURL, params: params, dataInterpreter: function(data) {
                            if (typeof data !== "undefined" && data && typeof data.package !== "undefined" &&
                                data.package) {
                              _this.push({type: "package", data: data.package});
                              return data.package;
                            }

                            return null;
                          }});
            } else {
              return null;
            }
          },
          addOffer: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package &&
                typeof params.offer !== "undefined" && params.offer) {
              return ajax({url: util.apiBase + "package.addOffers", params: {package:
                          params.package, offers: [params.offer]}});
            } else {
              return null;
            }
          },
          removeOffer: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package &&
                typeof params.offer !== "undefined" && params.offer) {
              return ajax({url: util.apiBase + "package.removeOffers", params: {package:
                          params.package, offers: [params.offer]}});
            } else {
              return null;
            }
          },
          createOffers: function(store, params) {
            console.log("create offers");
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package &&
                typeof params.offers !== "undefined" && params.offers) {
              return ajax({url: util.apiBase + "package.offer.set", params: {package:
                          params.package, offers: params.offers}});
            } else {
              return null;
            }
          },
          createRequirements: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package &&
                typeof params.requirements !== "undefined" && params.requirements) {
              return ajax({url: util.apiBase + "package.requirement.set", params: {package:
                          params.package, requirements: params.requirements}});
            } else {
              return null;
            }
          },
          createServices: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package &&
                typeof params.services !== "undefined" && params.services) {
              return ajax({url: util.apiBase + "package.service.set", params: {package:
                          params.package, services: params.services}});
            } else {
              return null;
            }
          },
          createGiveAways: function(store, params) {
            if (typeof params !== "undefined" && params &&
                typeof params.package !== "undefined" && params.package &&
                typeof params.giveAways !== "undefined" && params.giveAways) {
              return ajax({url: util.apiBase + "package.giveAways.set", params: {package:
                          params.package, giveAways: params.giveAways}});
            } else {
              return null;
            }
          },

          updateURL: util.apiBase + "package.update",
          updateDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var package = data.get("id");
              if (typeof package !== "undefined") {
                return {package: package, data: data};
              }
            }
            return null;
          },
          updateWithServices: function(store, params) {
            if (typeof params !== "undefined" && params) {
              return ajax({url: this.updateURL, params: params});
            } else {
              return null;
            }
          },

          deleteURL: util.apiBase + "package.remove",
          deleteDataFormatter: function(data) {
            if (typeof data !== "undefined" && data) {
              var package = data.get("id");
              if (typeof package !== "undefined") {
                return {package: package};
              }
            }

            return null;
          }
        };

        // Adapter
        app.ApplicationAdapter = DS.Adapter.extend({
          find: function(store, type, id) {
            if (typeof type.adapter !== "undefined" && type.adapter &&
                typeof type.adapter.findURL !== "undefined" && type.adapter.findURL) {
              var params;
              if (typeof type.adapter.findParams === "function" && type.adapter.findParams) {
                params = type.adapter.findParams(id);
              } else {
                params = {id: id};
              }
              return ajax({url: type.adapter.findURL, params: params,
                          dataInterpreter: typeof type.adapter.findDataInterpreter !== "undefined" ?
                          type.adapter.findDataInterpreter : null});
            } else {
              return null;
            }
          },

          createRecord: function(store, type, record) {
            if (typeof type.adapter !== "undefined" && type.adapter &&
                typeof type.adapter.createURL !== "undefined" && type.adapter.createURL) {
              return ajax({url: type.adapter.createURL, params: record,
                          dataInterpreter: typeof type.adapter.createDataInterpreter !== "undefined" ?
                          type.adapter.createDataInterpreter : null});
            } else {
              return null;
            }
          },

          updateRecord: function(store, type, record) {
            if (typeof type.adapter !== "undefined" && type.adapter &&
                typeof type.adapter.updateURL !== "undefined" && type.adapter.updateURL) {
              return ajax({url: type.adapter.updateURL, params:
                          typeof type.adapter.updateDataFormatter !== "undefined" ?
                          type.adapter.updateDataFormatter(record) : record});
            } else {
              return null;
            }
          },

          deleteRecord: function(store, type, record) {
            if (typeof type.adapter !== "undefined" && type.adapter &&
                typeof type.adapter.deleteURL !== "undefined" && type.adapter.deleteURL) {
              return ajax({url: type.adapter.deleteURL, params:
                          typeof type.adapter.deleteDataFormatter !== "undefined" ?
                          type.adapter.deleteDataFormatter(record) : record});
            } else {
              return null;
            }
          }
        });

        app.store = DS.Store.create({
          adapter: app.ApplicationAdapter.create(),
          // app container needs to be associated with the store
          // so that serialization will use the default ones
          // registered in app container. It is a bit of a hack.
          container: app.__container__
        });
      }
    },

    find: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.type === "string" && params.type &&
          typeof classLookup[params.type] !== "undefined" &&
          typeof params.id !== "undefined") {
        if (typeof params.reload !== "undefined" && params.reload) {
          if (app.store.recordIsLoaded(classLookup[params.type], params.id)) {
            var record = app.store.recordForId(classLookup[params.type], params.id);
            record.reload();
          }
        }

        // Store find automatically pushes the result in
        return app.store.find(classLookup[params.type], params.id);
      } else {
        return null;
      }
    },

    // None standard ember data ajax calls
    execute: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.type === "string" && params.type &&
          typeof classLookup[params.type] !== "undefined" &&
          typeof params.method !== "undefined" && params.method &&
          typeof classLookup[params.type].adapter !== "undefined" &&
          typeof classLookup[params.type].adapter &&
          typeof classLookup[params.type].adapter[params.method] === "function" &&
          classLookup[params.type].adapter[params.method]) {
        // Alternative find does NOT push records automatically, if needed. Do it in
        // its dataInterpreter function passed to ajax.
        return classLookup[params.type].adapter[params.method](app.store, params.params);
      } else {
        return null;
      }
    },

    push: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.type === "string" && params.type &&
          typeof classLookup[params.type] !== "undefined" &&
          typeof params.data !== "undefined" && params.data &&
          typeof params.data.id !== "undefined") {
        if (app.store.recordIsLoaded(classLookup[params.type], params.data.id)) {
          var record = app.store.recordForId(classLookup[params.type], params.data.id);
          record.rollback();
        }
        app.store.push(classLookup[params.type], params.data);
      }
    },

    pushMany: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.type === "string" && params.type &&
          typeof classLookup[params.type] !== "undefined" &&
          typeof params.data !== "undefined" && params.data instanceof Array &&
          params.data.length > 0) {
        var _this = this;
        $.map(params.data, function(data) {
          _this.push({type: classLookup[params.type], data: data});
        });
      }
    },

    getCachedRecord: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.type === "string" && params.type &&
          typeof classLookup[params.type] !== "undefined" &&
          typeof params.id !== "undefined") {
        if (app.store.recordIsLoaded(classLookup[params.type], params.id)) {
          return app.store.recordForId(classLookup[params.type], params.id);
        } else {
          return null;
        }
      }
    },

    create: function(params) {
      if (typeof params !== "undefined" && params &&
          typeof params.type === "string" && params.type &&
          typeof classLookup[params.type] !== "undefined" &&
          typeof params.data !== "undefined" && params.data) {
        return app.store.createRecord(classLookup[params.type], params.data);
      }
    }
  };
});
