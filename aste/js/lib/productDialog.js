define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility',
        'viivaDataTable', 'viivaNotification', 'viivaDialog', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaDataTable, Notification) {
  var dialog = "<section>" +
                 "<div class='row'>" +
                   "<div class='col-xs-4 smart-form'>" +
                     "<label class='label'>" + tr("productGroup") + "</label>" +
                     "<div class='select productGroups'><select>" +
                     "</select><i></i></div>" +
                   "</div>" +
                   "<div class='col-xs-3 smart-form'>" +
                     "<label class='label'>" + tr("productType") + "</label>" +
                     "<div class='select productTypes'><select>" +
                     "</select><i></i></div>" +
                   "</div>" +
                   "<div class='col-xs-2 smart-form'>" +
                     "<label class='label'>" + tr("productShortCode") + "</label>" +
                     "{{#if editable}}" +
                       "<div class='input mandatory'>{{input type='text' value=shortCode}}</div>" +
                     "{{else}}" +
                       "<div class='input'>{{input type='text' value=shortCode disabled='disabled'}}</div>" +
                     "{{/if}}" +
                   "</div>" +
                   "{{#unless view.newProduct}}" +
                     "<div class='col-xs-3 smart-form'>" +
                       "<label class='label'>" + tr("productAddressCollection") + "</label>" +
                       "<div class='input'>{{input type='text' value=otNumber disabled='disabled'}}</div>" +
                     "</div>" +
                   "{{/unless}}" +
                 "</div>" +
                 "<div class='row'>" +
                   "<div class='col-xs-12 smart-form'>" +
                     "<label class='label'>" + tr("productDescription") + "</label>" +
                     "<div class='textarea mandatory'>{{textarea rows='10' value=description}}</div>" +
                   "</div>" +
                 "</div>" +
                 "<div class='row'>" +
                   "<div class='col-xs-6 smart-form'>" +
                     "<label class='label'>" + tr("productReceiptInfo") + "</label>" +
                     "<div class='textarea'>{{textarea rows='10' value=receiptInfo}}</div>" +
                   "</div>" +
                   "<div class='col-xs-6 smart-form'>" +
                     "<label class='label'>" + tr("productExtraDescription") + "</label>" +
                     "<div class='textarea'>{{textarea rows='10' value=extraDescription}}</div>" +
                   "</div>" +
                 "</div>" +
               "</section>" +
               "<section class='price-definitions'>" +
                 "<div class='col-xs-6'><div class='well tree price-definition-list'>" +
                   "<ul class='add-definition'><li class='parent_li'><span>" +
                   "<i class='fa fa-plus'></i> " + tr("addPriceDefinition", "capitalizefirst") +
                   "</span></li></ul>" +
                 "</div></div>" +
                 "<div class='col-xs-6 smart-form'><div class='price-definition-view'>" +
                 "</div></div>" +
               "</section>"+
               "<section class='product-texts'>"+
                "<p>"+tr("productTextsExplanation")+"</p>"+
                 "<div class='row'>" +
                 "<div class='col-xs-6 smart-form'>" +
                     "<p>" + tr("renewingSiblingRenewing") + "</p>" +
                     "<div class='textarea'>{{textarea rows='10' value=renewingSiblingRenewing}}</div>" +
                   "</div>" +
                   "<div class='col-xs-6 smart-form'>" +
                     "<p>" + tr("fixedSiblingRenewing") + "</p>" +
                     "<div class='textarea'>{{textarea rows='10' value=fixedSiblingRenewing}}</div>" +
                   "</div>" +
                   
                 "</div>" +
                 "<div class='row'>" +
                  "<div class='col-xs-6 smart-form'>" +
                     "<p>" + tr("renewingSiblingFixed") + "</p>" +
                     "<div class='textarea'>{{textarea rows='10' value=renewingSiblingFixed}}</div>" +
                   "</div>" +
                   "<div class='col-xs-6 smart-form'>" +
                     "<p>" + tr("fixedSiblingFixed") + "</p>" +
                     "<div class='textarea'>{{textarea rows='10' value=fixedSiblingFixed}}</div>" +
                   "</div>" +
                  
                 "</div>" +
                 "<div class='row'>" +
                  "<div class='col-xs-6 smart-form'>" +
                     "<p>" + tr("renewingSiblingNone") + "</p>" +
                     "<div class='textarea'>{{textarea rows='10' value=renewingSiblingNone}}</div>" +
                   "</div>" +
                   "<div class='col-xs-6 smart-form'>" +
                     "<p>" + tr("fixedSiblingNone") + "</p>" +
                     "<div class='textarea'>{{textarea rows='10' value=fixedSiblingNone}}</div>" +
                   "</div>" +
                  
                 "</div>" +
               "</section>";

  var priceDefinition = "<ul><li class='parent_li price-definition'>" +
                        "<span><i class='fa fa-list-ul'></i> " +
                        "<label class='price-definition-title'>" + tr("newPriceDefinition") +
                        "</label></span><ul><li class='parent_li add-price'><span>" +
                        "<i class='fa fa-plus'></i> " + tr("addPrices", "capitalizefirst") +
                        "</span></li></ul></li></ul>";

  var priceAmount = "<li class='parent_li price-amount'><span><i class='fa fa-clock-o'></i> " +
                    "<label class='price-amount-title'></label></span></li>";

  var priceDefinitionFields = "<div class='price-definition-fields'>" +
                                "<section>" +
                                  "<label class='label'>" + tr("priceDefinitionName") + "</label>" +
                                  "<div class='input mandatory'><input class='price-definition-name' type='text' value='" +
                                    tr("newPriceDefinition") + "'></div>" +
                                "</section>" +
                                "<section>" +
                                  "<label class='label'>" + tr("priceDefinitionDescription") + "</label>" +
                                  "<div class='textarea'><textarea class='price-definition-description' " +
                                  "rows='8'></textarea></div>" +
                                "</section>" +
                                "<section class='form-ctrls'>" +
                                  "<button class='btn btn-danger'>" + tr("remove") + "</button>" +
                                "</section>" +
                                "<ul class='price-amount-list'></ul>" +
                              "</div>";

  var priceAmountFields = "<div class='price-amount-fields'>" +
                            "<section>" +
                              "<label class='label'>" + tr("priceDefinitionDate") + "</label>" +
                              "<div class='input mandatory'><input class='datepicker price-definition-date'>" +
                              "<i class='fa fa-calendar icon-append'></i></div>" +
                            "</section>" +
                            "<section>" +
                              "<label class='label'>" + tr("priceDefinitionPrices") + "</label>" +
                              "<table class='price-list'>" +
                                "<tr><td class='col-3'>1 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m1'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>2 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m2'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>3 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m3'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>4 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m4'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>5 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m5'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>6 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m6'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>7 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m7'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>8 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m8'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>9 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m9'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>10 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m10'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>11 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m11'></div>" +
                                  "</td>" +
                                "</tr>" +
                                "<tr>" +
                                  "<td>12 " + tr("months") + "</td>" +
                                  "<td>" +
                                    "<div class='input col-10 mandatory'><input type='text' class='m12'></div>" +
                                  "</td>" +
                                "</tr>" +
                              "</table>" +
                            "</section>" +
                            "<section class='form-ctrls'>" +
                              "<button class='btn btn-danger'>" + tr("remove") + "</button>" +
                            "</section>" +
                          "<div>";

  function addDefinition(jRoot, selected, definition) {
    if (typeof jRoot !== "undefined" && jRoot instanceof $) {
      var defField = $(priceDefinition).appendTo(jRoot.find(".price-definition-list"));
      var title = defField.find(".price-definition-title");
      var defFields = $(priceDefinitionFields)
                        .appendTo(jRoot.find(".price-definitions .price-definition-view"));
      var nameInput = defFields.find("input.price-definition-name");

      nameInput.keyup(function() {title.html($(this).val());});

      defFields.find("button.btn-danger").click(function() {
        jRoot.find(".price-definition-list > ul").eq(defFields.index() + 1).remove();
        defFields.remove();
      });

      if (typeof definition !== "undefined" && definition) {
        if (typeof definition.id !== "undefined" && definition.id) {
          defFields.data("id", definition.id);
        }

        if (typeof definition.name !== "undefined" && definition.name) {
          title.html(definition.name);
          nameInput.val(definition.name);
        }

        if (typeof definition.description !== "undefined" && definition.description) {
          defFields.find("textarea.price-definition-description").val(definition.description);
        }
      }

      if (typeof selected === "undefined" || selected) {
        jRoot.find(".price-definitions li.selected").removeClass("selected");
        jRoot.find(".price-definitions .price-definition-fields").hide();

        defField.find(".price-definition").addClass("selected");
        defFields.show();
      }

      return defField;
    }

    return null;
  }

  function addPrices(jRoot, container, selected, definition) {
    if (typeof jRoot !== "undefined" && jRoot instanceof $ &&
        typeof container !== "undefined" && container instanceof $) {
      var amountField = $(priceAmount).insertAfter(container.children().eq(0));
      var title = amountField.find(".price-amount-title");
      var amountFields = $(priceAmountFields)
                            .prependTo(jRoot.find(".price-definitions .price-amount-list")
                                      .eq(container.closest(".price-definition").parent().index() - 1));
      var dateInput = amountFields.find(".datepicker.price-definition-date");

      if (typeof runAllForms === "function") {
        runAllForms(amountFields);
      }

      dateInput.change(function() {title.html($(this).val());});

      amountFields.find("button.btn-danger").click(function() {
        jRoot.find(".price-amount.selected").remove();
        amountFields.remove();
      });

      if (typeof definition !== "undefined" && definition) {
        if (typeof definition.id !== "undefined" && definition.id) {
          amountFields.data("id", definition.id);
        }

        if (typeof definition.from !== "undefined" && definition.from) {
          var val = util.parseDate(definition.from, "D.M.YYYY");
          title.html(val);
          dateInput.datepicker("setDate", val);
        }

        if (typeof definition.prices !== "undefined" && definition.prices instanceof Array) {
          for (var i = 0; i < definition.prices.length; i++) {
            amountFields.find(".m" + (i + 1)).val(definition.prices[i]);
          }
        }
      }

      if (typeof selected === "undefined" || selected) {
        jRoot.find(".price-definitions li.selected").removeClass("selected");
        jRoot.find(".price-definitions .price-definition-fields > section").hide();
        jRoot.find(".price-definitions .price-definition-fields .price-amount-fields").hide();

        amountField.addClass("selected");
        amountFields.show();
        amountFields.closest(".price-definition-fields").show();
      }

      return amountField;
    }

    return null;
  }

  function priceDefinitionToHTML(jRoot, defTables) {
    if (typeof jRoot !== "undefined" && jRoot instanceof $ &&
        typeof defTables !== "undefined" && defTables instanceof Array &&
        defTables.length > 0) {
      // Clear the current tree
      jRoot.find(".price-definition-list > ul:not(.add-definition)").remove();
      jRoot.find(".price-definition-fields").remove();

      for (var i = 0; i < defTables.length; i++) {
        var defHTML = addDefinition(jRoot, false, defTables[i]);

        for (var j = 0; j < defTables[i].definitions.length; j++) {
          addPrices(jRoot, defHTML.find(".price-definition > ul"), false, defTables[i].definitions[j]);
        }
      }
    }
  }

  function priceDefinitionFromHTML(jRoot) {
    var defTables = [];

    if (typeof jRoot !== "undefined" && jRoot instanceof $) {
      jRoot.find(".price-definition-view .price-definition-fields").each(function() {
        var defTable = {definitions: []};

        var name = $(this).find(".price-definition-name");
        var description = $(this).find(".price-definition-description");

        if ($(this).data("id")) {
          defTable.id = $(this).data("id");
        }

        if (name.length && name.val()) {
          defTable.name = name.val();
          if (description.length && description.val()) {
            defTable.description = description.val();
          }

          $(this).find(".price-amount-fields").each(function() {
            var def = {prices: []};

            var date = $(this).find(".price-definition-date").datepicker("getDate");

            if ($(this).data("id")) {
              def.id = $(this).data("id");
            }

            if (date && date instanceof Date) {
              def.from = util.dateToUTCString(date);

              for (var i = 1; i < 13; i++) {
                var price = $(this).find(".m" + i);

                if (price.length && price.val()) {
                  def.prices.push(parseFloat(price.val()));
                } else {
                  // Missing a price
                  defTables = null;
                  return false;
                }
              }
            } else {
              // Missing date
              defTables = null;
              return false;
            }

            defTable.definitions.push(def);
          });
        } else {
          // Missing name
          defTables = null;
        }

        if (defTables) {
          defTables.push(defTable);
        } else {
          return false;
        }
      });
    }

    return defTables;
  }

  var ProductDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = _this.$("").addClass("product-dialog");

      if (typeof _this.groups !== "undefined" && _this.groups) {
        _this.groups.then(function(groups) {

          if (groups instanceof Array && groups.length > 0) {

            // alphabetical order
            groups = groups.sort(function (a, b) {
              return a.name.localeCompare(b.name);
            });

            var select = jRoot.find(".productGroups select");

            if (select.length > 0) {
              select.html("");

              for (var i = 0; i < groups.length; i++) {
                select.append("<option value='" + groups[i].id + "'>" + groups[i].name + "</option>");
              }

              if (typeof _this.newProduct === "undefined" || !_this.newProduct) {
                _this.controller.then(function() {
                  select.val(_this.controller.content.get("group"));
                });
              } else {
                _this.controller.set("group", select.val());
              }

              select.change(function() {
                if (typeof _this.controller.set === "function") {
                  _this.controller.set("group", $(this).val());
                }
              });
            }
          }
        });
      }

      if (typeof _this.types !== "undefined" && _this.types) {
        _this.types.then(function(types) {
          if (types instanceof Array && types.length > 0) {
            var select = jRoot.find(".productTypes select");

            if (select.length > 0) {
              select.html("");

              for (var i = 0; i < types.length; i++) {
                select.append("<option value='" + types[i].id + "'>" + types[i].name + "</option>");
              }

              if (typeof _this.newProduct === "undefined" || !_this.newProduct) {
                _this.controller.then(function() {
                  select.val(_this.controller.content.get("type"));
                });
              } else {
                _this.controller.set("type", select.val());
              }

              select.change(function() {
                if (typeof _this.controller.set === "function") {
                  _this.controller.set("type", $(this).val());
                }
              });
            }
          }
        });
      }

      jRoot.find(".add-definition").click(function() {
        addDefinition(jRoot);
      });

      jRoot.on("click", ".add-price", function() {
        addPrices(jRoot, $(this).parent());
      });

      jRoot.on("click", ".price-definition > span", function() {
        if (!$(this).parent().hasClass("selected")) {
          jRoot.find(".price-definitions li.selected").removeClass("selected");
          $(this).parent().addClass("selected");

          jRoot.find(".price-definitions .price-definition-fields .price-amount-fields").hide();
          jRoot.find(".price-definition-view .price-definition-fields").hide()
               .eq($(this).closest("ul").index() - 1).show().children("section").show();
        }
      });

      jRoot.on("click", ".price-amount > span", function() {
        if (!$(this).parent().hasClass("selected")) {
          jRoot.find(".price-definitions li.selected").removeClass("selected");
          $(this).parent().addClass("selected");

          jRoot.find(".price-definitions .price-definition-fields > section").hide();
          jRoot.find(".price-definition-view .price-definition-fields").hide()
               .eq($(this).closest(".price-definition").parent().index() - 1).show().
               find(".price-amount-fields").hide().eq($(this).closest("li").index() - 1).show();
        }
      });

      // Fill in the price definitions
      if (typeof _this.definitions !== "undefined" && _this.definitions) {
        _this.definitions.then(function(defTables) {
          priceDefinitionToHTML(jRoot, defTables);
        });
      }

      var dialogButtons = [];
      _this.dialogLock = false;
      dialogButtons.push({
        html: "<i class='fa fa-save'></i> " + tr("save", "capitalizefirst"),
        "class": "btn btn-primary",
        click: function() {
          if (_this.dialogLock) {
            return;
          }
          _this.dialogLock = true;

          var dialog = $(this);
          var priceDefs = priceDefinitionFromHTML(jRoot);
          if (typeof _this.controller.save === "function") {
            // New product
            if (typeof _this.controller.get('description') === "string" &&
               _this.controller.get('description').trim().length >= 5 && _this.controller.get('description').trim().length < 52) {
            if (typeof _this.controller.get('shortCode') === "string" &&
                _this.controller.get('shortCode').length == 2) {
                if(priceDefs){
              _this.controller.save().then(function(product) {
                DP.execute({type: "product", method: "createDefinitions",
                           params: {product: product.get("id"), definitions: priceDefs}}).then(function() {
                  if (typeof _this.options.update === "function" && _this.options.update) {
                    _this.options.update();
                  }
                  _this.dialogLock = false;
                  Notification.success({title: tr("productAddSuccess"), message:
                                        tr("productAddSuccessDescription").replace(
                                        "_NAME_", jRoot.find('.productGroups select option:selected').text() +
                                        " " + jRoot.find('.productTypes select option:selected').text())});
                  dialog.dialog("close");
                }, function() {
                  _this.dialogLock = false;
                  Notification.error({title: tr("productUpdateFailed"), message: tr("unknownError")});
                });
              }, function() {
                _this.dialogLock = false;
                Notification.error({title: tr("productAddFailed"), message: tr("unknownError")});
              });
            } 
               else{
                _this.dialogLock = false;
                Notification.error({title: tr("productUpdateFailed"), message: tr("productInvalidPriceDefs")});
               }
            }
            else {
              _this.dialogLock = false;
              Notification.error({title: tr("productAddFailed"), message: tr("productInvalidShortCode")});
              }
            }
            else {
              _this.dialogLock = false;
              Notification.error({title: tr("productAddFailed"), message: tr("productInvalidDescription")});
            }
          } else {
            if (typeof _this.controller.get('description') === "string" &&
               _this.controller.get('description').trim().length >= 5 && _this.controller.get('description').trim().length < 52) {
              if (typeof _this.controller.get('shortCode') === "string" &&
                  _this.controller.get('shortCode').length == 2) {
                if(priceDefs){
                record = _this.controller.get("content");
                _this.controller.set("priceDefsUpdated", true);
                record.save().then(function() {
                  DP.execute({type: "product", method: "createDefinitions",
                             params: {product: _this.options.id, definitions: priceDefs}}).then(function() {
                    if (typeof _this.options.update === "function" && _this.options.update) {
                      _this.options.update();
                    }
                    _this.dialogLock = false;
                    Notification.success({title: tr("productUpdateSuccess"), message:
                                          tr("productUpdateSuccessDescription").replace(
                                          "_NAME_", jRoot.find('.productGroups select option:selected').text() +
                                          " " + jRoot.find('.productTypes select option:selected').text())});
                    dialog.dialog("close");
                  }, function() {
                    _this.dialogLock = false;
                    Notification.error({title: tr("productUpdateFailed"), message: tr("unknownError")});
                  });
                }, function() {
                  _this.dialogLock = false;
                  Notification.error({title: tr("productUpdateFailed"), message: tr("unknownError")});
                });
              }
                 else{
                  _this.dialogLock = false;
                  Notification.error({title: tr("productUpdateFailed"), message: tr("productInvalidPriceDefs")});
                 }
              }
               else {
                _this.dialogLock = false;
                Notification.error({title: tr("productUpdateFailed"), message: tr("productInvalidShortCode")});
              }
            }
            else {
              _this.dialogLock = false;
              Notification.error({title: tr("productUpdateFailed"), message: tr("productInvalidDescription")});
            }
            }
          }
      });
      dialogButtons.push({
        html: tr("close"),
        "class": "btn btn-default",
        click: function() {
          if (_this.dialogLock) {
            return;
          }
          $(this).dialog("close");
        }
      });
      jRoot.dialog({minWidth: 680, minHeight: 660,
                    title: typeof _this.newProduct !== "undefined" && _this.newProduct ?
                           tr("newProduct") : tr("product"),
                    buttons: dialogButtons,
                    tabs: [{title: tr("basicInfo")}, {title: tr("priceDefinitions")},{title: tr("productTexts")}]});
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

      if (typeof _this.newProduct === "undefined" || !_this.newProduct) {
        _this.controller.then(function() {
          if (_this.controller.content.get("editable")) {
            dialogButtons.unshift({
              html: "<i class='fa fa-trash-o'></i> " + tr("remove", "capitalizefirst"),
              "class": "btn btn-danger",
              click: function() {
                if (_this.dialogLock) {
                  return;
                }
                _this.dialogLock = true;

                var dialog = $(this);
                var message = tr("productDeleteConfirmation").replace("_NAME_", _this.controller.get("title"));
                require("dialogManager").create({type: "ConfirmDialog", id: "confirm",
                  message: message, yes: function() {
                    record = _this.controller.get("content");
                    record.deleteRecord();
                    record.save().then(function() {
                      if (typeof _this.options.update === "function" && _this.options.update) {
                        _this.options.update();
                      }
                      _this.dialogLock = false;
                      dialog.dialog("close");
                    }, function() {
                      _this.dialogLock = false;
                      Notification.error({title: tr("productDeleteFailed"), message: tr("unknownError")});
                    });
                  }, no: function() {_this.dialogLock = false;}
                });
              }
            });
            jRoot.dialog({buttons: dialogButtons});
          } else {
            jRoot.find(".productGroups select, .productTypes select").attr('disabled', 'disabled');
          }
        });
      }

      if (typeof pageSetUp == "function") {
        pageSetUp(jRoot);
      }
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.id !== "undefined") {
      var productGroups = DP.execute({type: "product", method: "findGroups"});
      var productTypes = DP.execute({type: "product", method: "findTypes"});
      var params = {groups: productGroups, types: productTypes, options: options};

      if (options.id === "new") {
        params.controller = DP.create({type: "product", data: {editable: true}});
        params.newProduct = true;
      } else {
        params.controller = DP.find({type: "product", id: options.id, reload: true});
        params.definitions = DP.execute({type: "product", method: "findDefinitions",
                                        params: {product: options.id}});
      }

      var productDialog = ProductDialog.create(params);

      productDialog.appendTo($("body"));

      return productDialog;
    }
  };
});
