define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaItemList',
        'viivaTableView', 'viivaDataTable', 'viivaNotification', 'viivaDialog', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaItemList, ViivaTableView, ViivaDataTable,
                Notification) {
  var dialog = "<section>" +
                 "<div class='row col-xs-12'>" +
                   "<div class='smart-form'>" +
                     "<section class='col-10'>" +
                       "<label class='label'>" + tr("customerName") + "</label><div class='input'>" +
                       "{{#if view.newCustomer}}" +
                         "{{input type='text' value=name}}</div>" +
                       "{{else}}" +
                         "{{input disabled='disabled' type='text' value=name}}</div>" +
                       "{{/if}}" +
                     "</section>" +
                   "</div>" +
                   "<div class='smart-form'>" +
                     "<section>" +
                       "<label class='label'>" + tr("customerEmail") + "</label>" +
                         "{{#if view.newCustomer}}" +
                           "<div class='input customer-email mandatory'>{{input type='text' value=email}}" +
                         "{{else}}" +
                           "<div class='input customer-email'>{{input disabled='disabled' type='text' value=email}}" +
                           "<button class='btn btn-default edit-email' {{action 'editEmail' target='view' bubbles=false}}>" +
                           tr("edit") + "</button>" +
                           "<button class='btn btn-primary update-email' style='display: none;' " +
                           "{{action 'updateEmail' target='view' bubbles=false}}>" + tr("save") + "</button>" +
                         "{{/if}}" +
                       "</div>" +
                     "</section>" +
                   "</div>" +
                   "{{#unless view.newCustomer}}" +
                     "<div class='smart-form'>" +
                       "<section class='col-10'>" +
                         "<label class='toggle'>" +
                           "<input type='checkbox' disabled='disabled' {{bind-attr checked=phoneMarketable}}>" + tr("customerPhoneMarketable") +
                           "<i data-swchon-text='" + tr('yes', "capitalizefirst") + "'data-swchoff-text='" +
                           tr("no", "capitalizefirst") + "'></i>" +
                         "</label>" +
                       "</section>" +
                       "<section class='col-10'>" +
                         "<label class='toggle'>" +
                           "<input type='checkbox' disabled='disabled' {{bind-attr checked=emailMarketable}}>" + tr("customerEmailMarketable") +
                           "<i data-swchon-text='" + tr('yes', "capitalizefirst") + "'data-swchoff-text='" +
                           tr("no", "capitalizefirst") + "'></i>" +
                         "</label>" +
                       "</section>" +
                       "</div>" +
                     "</div>" +
                   "{{/unless}}" +
                 "</div>" +
                 "{{#unless view.newCustomer}}" +
                   "<div class='row col-xs-12 user-info'>" +
                     "<div class='smart-form'>" +
                       "<section class='col-10'>" +
                         "<label class='label'>" + tr("customerUserID") + "</label>" +
                         "<div class='text'>{{id}}</div>" +
                       "</section>" +
                       "<section class='col-10'>" +
                         "<label class='label'>" + tr("userCreated") + "</label>" +
                         "<div class='text'>{{parseDate created}}</div>" +
                       "</section>" +
                       "<section class='col-10'>" +
                         "<label class='label'>" + tr("customerLastLogin") + "</label>" +
                         "<div class='text'>{{parseDate lastAuth}}</div>" +
                       "</section>" +
                       "<section class='col-10'>" +
                         "<label class='label'>" + tr("lekaCustomerNumber") + "</label>" +
                         "<div class='text'>{{customerNumber}}</div>" +
                       "</section>" +
                     "</div>" +
                   "</div>" +
                 "{{/unless}}" +
               "</section>" +
               "<section class='customer-contacts'>" +
                 "<div class='col-xs-6 customer-contacts-list'>" +
                 "</div>" +
                 "<div class='col-xs-6 smart-form'><div>" +
                   "<div class='contact-form'>" +
                     "<section>" +
                       "<div class='input mandatory'><input class='givenName' type='text' placeholder='" +
                       tr("customerFirstName", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='input mandatory'><input class='familyName' type='text' placeholder='" +
                       tr("customerLastName", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='input'><input class='mobile' type='text' placeholder='" +
                       tr("customerMobile", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='input'><input class='phone' type='text' placeholder='" +
                       tr("customerPhone", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='input mandatory'><input class='email' type='text' placeholder='" +
                       tr("customerEmail", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='input mandatory'><input class='address' type='text' placeholder='" +
                       tr("customerAddress", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='input mandatory'><input class='postCode' type='text' placeholder='" +
                       tr("customerPostalCode", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='input mandatory'><input class='city' type='text' placeholder='" +
                       tr("customerCity", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='select mandatory'>" +
                         util.countryCodeSelectHTML +
                       "<i></i></div>" +
                     "</section>" +
                     "<section>" +
                       "<div class='input company'><input type='text' placeholder='" +
                       tr("customerCompany", "capitalizefirst") + "'></div>" +
                     "</section>" +
                     "<section class='form-ctrls'>" +
                       "<button class='btn btn-primary' {{action 'addContact' target='view' bubbles=false}}>" +
                       tr("save") + "</button>" +
                       "<button class='btn btn-danger' {{action 'resetContact' target='view' bubbles=false}}>" +
                       tr("resetForm") + "</button>" +
                     "</section>" +
                   "</div>" +
                   "{{view view.ContactView viewName='contactView'}}" +
                 "</div>" +
               "</section>" +
               "{{#unless view.newCustomer}}" +
                 "<section class='customer-orders'>" +
                 "</section>" +
                 "<section class='customer-service-access'>" +
                 "</section>" +
               "{{/unless}}";

  var contact = "{{#each}}<div class='contact-info'>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='givenName' disabled='disabled' value=givenName placeholder='" +
                    tr("customerFirstName", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='familyName' disabled='disabled' value=familyName placeholder='" +
                    tr("customerLastName", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='mobile' disabled='disabled' value=mobile placeholder='" +
                    tr("customerMobile", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='phone' disabled='disabled' value=phone placeholder='" +
                    tr("customerPhone", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='email' disabled='disabled' value=email placeholder='" +
                    tr("customerEmail", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='address' disabled='disabled' value=address placeholder='" +
                    tr("customerAddress", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='postCode' disabled='disabled' value=postCode placeholder='" +
                    tr("customerPostalCode", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='city' disabled='disabled' value=city placeholder='" +
                    tr("customerCity", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='select'>" +
                      util.countryCodeSelectHTML +
                    "<i></i></div>" +
                  "</section>" +
                  "<section>" +
                    "<div class='input'>{{input type='text' class='company' disabled='disabled' value=company placeholder='" +
                    tr("customerCompany", "capitalizefirst") + "'}}</div>" +
                  "</section>" +
                  "<section class='form-ctrls'>" +
                    "<button class='btn btn-primary update-contact' style='display: none;' " +
                    "{{action 'updateContact' this target='view' bubbles=false}}>" + tr("save") + "</button>" +
                    "<button class='btn btn-default edit-contact' {{action 'editContact' this target='view' bubbles=false}}>" + tr("edit") + "</button>" +
                  "</section>" +
                  "{{trigger didRenderContact this target='view'}}" +
                "</div>{{/each}}";

  var CustomerDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    createChildView: function(viewClass, attrs) {
      if (typeof attrs !== "undefined" && attrs && typeof attrs.viewName === "string" && attrs.viewName == "contactView") {
        attrs.context = attrs.controller = this.get("contacts");
        if (typeof this.newCustomer !== "undefined") {
          attrs.newCustomer = this.newCustomer;
        }
      }
      return this._super(viewClass, attrs);
    },
    ContactView: Ember.View.extend({
      template: Ember.Handlebars.compile(contact),
      didRenderContact: function(contact) {
        // Set up the country dropdown
        var country = null;

        if (typeof contact.get === "function") {
          country = contact.get("country");
        } else if (typeof contact.country !== "undefined") {
          country = contact.country;
        }

        var select = this.$("> div:eq(" + this.controller.indexOf(contact) + ") select[name='country']");
        if (select.length > 0) {
          select.attr('disabled', 'disabled');

          if (country) {
            select.val(country);
          }

          select.change(function() {
            if (typeof contact.set === "function") {
              contact.set("country", $(this).val());
            } else {
              Ember.set(contact, "country", $(this).val());
            }
          });
        }
      },
      editContact: function(contact) {
        var contactHTML = this.$("> div:eq(" + this.controller.indexOf(contact) + ")");
        contactHTML.find(" input, select").removeAttr('disabled').eq(0).focus();
        contactHTML.find(".edit-contact").hide();
        contactHTML.find(".update-contact").show();

        this.get("parentView").contactInEdit = contact;
        this.get("parentView").contactBeforeEdit = $.extend(true, {}, contact);
      },
      updateContact: function(contact) {
        var _this = this;

        function contactUpdated() {
          var index = _this.controller.indexOf(contact);

          if (typeof contact.get === "function") {
            _this.get("parentView").contactList.getItem({index: index}).html("<div class='dd-handle'>" +
              contact.get("givenName") + " " + contact.get("familyName") + ", " + contact.get("address") + "</div>");
          } else if (typeof contact.country !== "undefined") {
            _this.get("parentView").contactList.getItem({index: index}).html("<div class='dd-handle'>" +
              contact.givenName + " " + contact.familyName + ", " + contact.address + "</div>");
          }

          var contactHTML = _this.$("> div:eq(" + index + ")");
          contactHTML.find(" input, select").attr('disabled', 'disabled').blur();
          contactHTML.find(".update-contact").hide();
          contactHTML.find(".edit-contact").show();

          _this.get("parentView").contactInEdit = null;
          _this.get("parentView").contactBeforeEdit = $.extend(true, {}, contact);
        }

        if (typeof contact !== "undefined" && contact &&
            typeof contact.id !== "undefined" && contact.id) {
          if (typeof contact.save === "function") {
            // Contact created in this opening
            contact.save().then(function() {
              contactUpdated();
            }, function() {
              Notification.error({title: tr("contactUpdateFailed"), message: tr("unknownError")});
            });
          } else {
            // Contact created in previously
            // Push change in, then get a record that has save() method
            DP.push({type: "contact", data: contact});
            var ctct = DP.find({type: "contact", id: contact.id});
            ctct.then(function(record) {
              record.save().then(function() {
                contactUpdated();
              }, function() {
                Notification.error({title: tr("contactUpdateFailed"), message: tr("unknownError")});
              });
            });
          }
        } else {
          contactUpdated();
        }
      }
    }),
    didInsertElement: function() {
      var _this = this;
      var jRoot = _this.$("").addClass("customer-dialog");

      function cancelContactEdit() {
        if (typeof _this.contactInEdit !== "undefined" && _this.contactInEdit) {
          var visibleContact = jRoot.find(".customer-contacts .contact-info:visible");

          if (typeof _this.contactInEdit.rollback !== "undefined") {
            _this.contactInEdit.rollback();
          } else if (typeof _this.contactBeforeEdit !== "undefined" &&
                     _this.contactBeforeEdit) {
            $.extend(_this.contactInEdit, _this.contactBeforeEdit);

            for (var prop in _this.contactBeforeEdit) {
              visibleContact.find("input." + prop).val(_this.contactBeforeEdit[prop]);
            }

            visibleContact.find("select[name='country']").val(_this.contactBeforeEdit.country);
          }

          _this.contactInEdit = null;
          _this.contactBeforeEdit = null;

          /* Reset edit state */
          visibleContact.find(" input, select").attr('disabled', 'disabled').blur();
          visibleContact.find(".update-contact").hide();
          visibleContact.find(".edit-contact").show();
        }
      }

      _this.contactList = new ViivaItemList();
      _this.contactList.create({title: tr("customerContactInfo"), container: jRoot.find(".customer-contacts-list"),
                 reorder: false, itemFunc: function() {
                   cancelContactEdit();

                   if (jRoot.find(".customer-contacts .contact-form .email").val() === "" && _this.controller.get("email")) {
                     jRoot.find(".customer-contacts .contact-form .email").val(_this.controller.get("email"));
                   }

                   jRoot.find(".customer-contacts-list .widget-body > ul > li.selected").removeClass("selected");
                   jRoot.find(".customer-contacts .contact-info").hide();
                   jRoot.find(".customer-contacts .contact-form").show();
                 }, selectedFunc: function(index) {
                   cancelContactEdit();

                   jRoot.find(".customer-contacts .contact-form, .customer-contacts .contact-info").hide();
                   if (index > -1) {
                     jRoot.find(".customer-contacts .contact-info").eq(index).show();
                   }
                 }, removeFunc: function(index) {
                   var message = tr("contactDeleteConfirmation").replace("_CONTACT_",
                                 _this.contactList.getItem({index: index}).find(".dd-handle").html());
                   require("dialogManager").create({type: "ConfirmDialog", id: "confirm",
                     message: message, title: tr("deleteContact"), yes: function() {
                       // Delete contact
                       if (typeof _this.contacts !== "undefined") {
                         if (_this.contacts instanceof Array) {
                           _this.contacts.splice(index, 1);
                         } else if (typeof _this.contacts.objectAt === "function") {
                           var contact = _this.contacts.objectAt(index);
                           var ctct = DP.find({type: "contact", id: contact.id});
                           ctct.then(function(record) {
                             record.deleteRecord();
                             record.save().then(function() {
                               _this.contacts.removeObject(contact);
                             }, function() {
                               Notification.error({title: tr("contactRemoveFailed"), message: tr("unknownError")});
                             });
                           });
                         }
                       } else {
                         return;
                       }

                       _this.contactList.removeItem({index: index});
                     }
                   });
                 }, removedFunc: function(index) {
                   jRoot.find(".customer-contacts .contact-info").eq(index).remove();
                 }});

      if (typeof _this.newCustomer === "undefined" || !_this.newCustomer) {
        // Existing customer
        _this.contacts.then(function(contacts) {
          var items = [];

          $.map(contacts, function(contact) {
            items.push("<li class='dd-item'><div class='dd-handle'>" + contact.givenName + " " +
                       contact.familyName + ", " + contact.address + "</div></li>");
          });

          _this.contactList.appendItems({items: items});
        });

        // Customer orders
        var view = new ViivaTableView();
        view.create({title: tr("orders"), color: "light", flags: view.RELOAD | view.ADD,
                    container: jRoot.find(".customer-orders")});

        var dataTable = new ViivaDataTable();
        dataTable.create({
          container: jRoot.find(".customer-orders .table-body"),
          method: "order.get",
          onProcessing: function(processing) {
            view.toggleReload(processing);
          },
          colDefs: [
            {name: tr("orderID"), prop: "id", visible: false},
            {name: tr("productGroup"), prop: "group"},
            {name: tr("packageName"), prop: "package"},
            {name: tr("orderCustomerName"), prop: "customer"},
            {name: tr("orderCreated"), prop: "created",
             render: function(data) {return util.parseDate(data);}},
            {name: tr("orderLastPaid"), prop: "lastPaid",
             render: function(data) {return util.parseDate(data);}},
            {name: tr("orderStatus"), prop: "state",
             render: function(data) {return tr(data, "capitalizefirst");}},
            {prop: "state", sortable: false,
             render: function(data) {
               if (data === "active" || data === "inactive") {
                 return "<button class='btn btn-danger btn-ms'>" + tr("cancel") + "</button>";
               } else {
                 return "";
               }
             }}
          ],
          defaultSort: [[4, "desc"]],
          onRowCreated: function(row, data) {
            $(row).find("button").click(function(event) {
              var message = tr("orderCancelConfirmationAlt");
              message = message.replace("_ORDER_ID_", data.id)
                               .replace("_CUSTOMER_", data.customer);
              require("dialogManager").create({type: "OrderCancelConfirmDialog", id: "confirm",
                message: message, yes: function(source, reason) {
                  // Cancel order
                  DP.find({type: "order", id: data.id}).then(function(record) {
                    record.set("cancelSource", source);
                    record.set("cancelReason", reason);
                    record.deleteRecord();
                    record.save().then(function() {
                      dataTable.updateTable();
                    });
                  });
                }
              });
              event.stopPropagation();
            });
          },
          onClick: function(row, data) {
            var dialogOption = {type: "OrderDialog", id: data.id, state: data.state,
                                update: function() {dataTable.updateTable();}};
            require("dialogManager").create(dialogOption);
          },
          filterFn: function(data) {
            if (typeof data !== "undefined" && data) {
              data.push({name: "account", value: _this.options.id});
              return data;
            }

            return null;
          }
        });

        jRoot.find(".customer-orders .table-view").on("reload", function() {
          dataTable.updateTable();
        });

        jRoot.find(".customer-orders .table-view").on("add", function() {
          require("dialogManager").create({type: "OrderDialog", id: "new", customer: _this.options.id,
                                           update: function() {dataTable.updateTable();}});
        });

        // Customer Service Access
        var csaView = new ViivaTableView();
        csaView.create({title: tr("customerServiceAccess"), color: "light", flags: csaView.RELOAD,
                    container: jRoot.find(".customer-service-access")});

        var csaDataTable = new ViivaDataTable();
        csaDataTable.create({
          container: jRoot.find(".customer-service-access .table-body"),
          method: "account.service.get",
          pagination: false,
          onProcessing: function(processing) {
            csaView.toggleReload(processing);
          },
          colDefs: [
            {name: tr("serviceName"), prop: "serviceName"},
            {name: tr("serviceURL"), prop: "serviceURL"},
            {name: tr("lastAuth"), prop: "lastAuth", 
            render: function(data) {return util.parseDate(data);}},
            {name: tr("firstAuth"), prop: "firstAuth",
            render: function(data) {return util.parseDate(data);}}
          ],
          defaultSort: [[1, "desc"]],
          filterFn: function(data) {
            if (typeof data !== "undefined" && data) {
              data.push({name: "account", value: _this.options.id});
              return data;
            }

            return null;
          }
        });

        jRoot.find(".customer-service-access .table-view").on("reload", function() {
          dataTable.updateTable();
        });
      }

      _this.dialogLock = false;
      var dialogButtons = [{
        html: tr("close"),
        "class": "btn btn-default",
        click: function() {
          if (_this.dialogLock) {
            return;
          }
          $(this).dialog("close");
        }
      }];

      var tabs = [{title: tr("basicInfo")}, {title: tr("customerContact")}];
      if (typeof this.newCustomer === "undefined" || !this.newCustomer) {
        tabs.push({title: tr("customerOrders")});
        tabs.push({title: tr("customerServiceAccess")});
      } else {
        dialogButtons.unshift({
          html: "<i class='fa fa-save'></i> " + tr("save", "capitalizefirst"),
          "class": "btn btn-primary",
          click: function() {
            if (_this.dialogLock) {
              return;
            }
            _this.dialogLock = true;

            var dialog = $(this);

            if (typeof _this.controller.get('email') !== "undefined" && _this.controller.get('email')) {
              // Save new customer
              _this.controller.save().then(function(customer) {
                if (typeof _this.contacts !== "undefined" && _this.contacts instanceof Array &&
                    _this.contacts.length > 0) {
                  $.map(_this.contacts, function(contact) {
                    contact.account = customer.get("id");
                    DP.create({type: "contact", data: contact}).save();
                  });
                }

                // FIXME in case of creating profile with contact, not waiting
                // till they have resovled (probably should do so)
                if (typeof _this.options.update === "function" && _this.options.update) {
                  _this.options.update();
                }
                _this.dialogLock = false;
                Notification.success({title: tr("customerAddSuccess"), message:
                                      tr("customerAddSuccessDescription").replace(
                                      "_EMAIL_", _this.controller.get('email'))});
                dialog.dialog("close");
              }, function() {
                _this.dialogLock = false;
                Notification.error({title: tr("customerAddFailed"), message: tr("customerEmailUsed")});
              });
            } else {
              _this.dialogLock = false;
              Notification.error({title: tr("customerAddFailed"), message: tr("invalidFields")});
            }
          }
        });
      }

      jRoot.dialog({minWidth: 680, minHeight: 630,
                    title: typeof _this.newCustomer !== "undefined" && _this.newCustomer ?
                           tr("newCustomer") : tr("customer"),
                    buttons: dialogButtons, tabs: tabs});
      jRoot.on('dialogclose', function() {
        if (typeof _this.controller.content !== "undefined" && _this.controller.content.get("isDirty")) {
          _this.controller.content.rollback();
        }

        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        jRoot.dialog("destroy");
        _this.destroy();
      });

      if (typeof pageSetUp == "function") {
        pageSetUp(jRoot);
      }
    },
    editEmail: function() {
      this.$(".customer-email input").removeAttr('disabled').focus();
      this.$(".edit-email").hide();
      this.$(".update-email").show();
    },
    updateEmail: function() {
      var _this = this;

      record = _this.controller.get("content");
      if (record.get("isDirty")) {
        record.save().then(function() {
          _this.$(".customer-email input").attr('disabled', 'disabled').blur();
          _this.$(".update-email").hide();
          _this.$(".edit-email").show();
          if (typeof _this.options.update === "function" && _this.options.update) {
            _this.options.update();
          }
        }, function(request) {
          Notification.error({title: tr("emailChangeFailed"), message: tr("customerEmailUsed")});
        });
      }
    },
    resetContact: function() {
      this.$(".contact-form input").val("");
      this.$(".contact-form select[name='country']").val("FI");
    },
    addContact: function() {
      var _this = this;
      var contact = {};

      _this.$(".customer-contacts .contact-form input").each(function() {
        if ($(this).attr("class") && $(this).val()) {
          contact[$(this).attr("class")] = $(this).val();
        }
      });

      var country = _this.$(".customer-contacts .contact-form select[name='country']");
      if (country.length > 0) {
        contact.country = country.val();
      }

      // Check through required fields
      if (typeof contact.givenName === "undefined" || !contact.givenName ||
          typeof contact.familyName === "undefined" || !contact.familyName ||
          typeof contact.email === "undefined" || !contact.email ||
          typeof contact.address === "undefined" || !contact.address ||
          typeof contact.postCode === "undefined" || !contact.postCode ||
          typeof contact.city === "undefined" || !contact.city) {
        Notification.error({title: tr("contactAddFailed"), message: tr("invalidFields")});
        return;
      }

      function contactAdded() {
        _this.contactList.appendItems({items: [
          "<li class='dd-item'><div class='dd-handle'>" + contact.givenName + " " +
          contact.familyName + ", " + contact.address + "</div></li>"
       ]});

       _this.$(".customer-contacts .contact-form").hide();
       _this.resetContact();
      }

      if (typeof contact !== "undefined" && contact) {
        if (typeof _this.contacts !== "undefined" && _this.contacts instanceof Array) {
          _this.contacts.push(contact);
          _this.get("contactView").rerender();

          contactAdded();
        } else if (typeof _this.newCustomer === "undefined" || !_this.newCustomer) {
          contact.account = _this.options.id;
          DP.create({type: "contact", data: contact}).save().then(function(record) {
            _this.contacts.addObject(record);

            contactAdded();
          }, function() {
            Notification.error({title: tr("contactAddFailed"), message: tr("unknownError")});
          });
        }
      }
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.id !== "undefined") {
      var params = {options: options};

      if (options.id === "new") {
        params.controller = DP.create({type: "customer", data: {}});
        params.contacts = [];
        params.newCustomer = true;
      } else {
        params.controller = DP.find({type: "customer", id: options.id, reload: true});
        params.contacts = DP.execute({type: "contact", method: "findByCustomer", params: {customer: options.id}});
      }

      var customerDialog = CustomerDialog.create(params);

      customerDialog.appendTo($("body"));

      return customerDialog;
    }
  };
});
