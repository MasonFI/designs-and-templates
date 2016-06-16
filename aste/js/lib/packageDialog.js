define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaDialogView',
        'viivaItemList', 'viivaDataTable', 'viivaTreeView', 'offerRequirement','viivaNotification',
        'aws-sdk.min', 'timepicker', 'viivaDialog', 'smartAdmin', 'summernote'],
       function($, jui, Ember, DP, tr, util, ViivaDialogView, ViivaItemList, ViivaDataTable,
                ViivaTreeView, OfferRequirement, Notification) {
  var dialog = "<section>" +
                 "<div class='row'>" +
                   "<div class='col-xs-8 smart-form'>" +
                     "<label class='label'>" + tr("packageName") + "</label>" +
                     "<div class='input mandatory'>{{input type='text' value=name}}</div>" +
                   "</div>" +
                   "<div class='col-xs-4 smart-form'>" +
                     "<label class='label'>" + tr("packageAddressCollection") + "</label>" +
                     "<div class='input'>{{input type='text' value=otNumber}}</div>" +
                   "</div>" +
                 "</div>" +
                 "<div class='row'>" +
                   "<div class='col-xs-6 smart-form package-sales-time package-sales-start'>" +
                     "<label class='label'>" + tr("packageSalesStart") + "</label>" +
                     "<div class='input'>" +
                       "<i class='fa fa-calendar icon-append'></i>" +
                       "<input class='datepicker start'>" +
                     "</div>" +
                     "<div class='input'>" +
                       "<i class='fa fa-clock-o icon-append'></i>" +
                       "<input class='timepicker start'>" +
                     "</div>" +
                   "</div>" +
                   "<div class='col-xs-6 smart-form package-sales-time package-sales-end'>" +
                     "<label class='label'>" + tr("packageSalesEnd") + "</label>" +
                     "<div class='input mandatory'>" +
                       "<i class='fa fa-calendar icon-append'></i>" +
                       "<input class='datepicker end'>" +
                     "</div>" +
                     "<div class='input mandatory'>" +
                       "<i class='fa fa-clock-o icon-append'></i>" +
                       "<input class='timepicker end'>" +
                     "</div>" +
                   "</div>" +
                 "</div>" +
                 "<div class='row'>" +
                   "<div class='col-xs-6 smart-form'>" +
                     "<section>" +
                       "<label class='label'>" + tr("packageDescription") + "</label>" +
                        "<div class='textarea highlight'>{{textarea rows='11' value=description}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("packageMarketingName") + "</label>" +
                       "<div class='input highlight mandatory'>{{input type='text' value=marketingName}}</div>" +
                     "</section>" +
                   "</div>" +
                   "<div class='col-xs-6 offer-requirements'>" +
                   "</div>" +
                 "</div>" +
               "</section>" +
               "<section>" +
                 "<div class='row'>" +
                   "<div class='col-xs-4 smart-form bgimage-control'>" +
                   "<label class='label'>" + tr("packageImage") + "</label>" +
                     "<label for='bgImage' class='input input-file'>" +
                     "<div class='button'><input type='file' name='bgImage' onchange='this.parentNode.nextSibling.value = this.value'>Selaa</div><input type='text' placeholder='Lisää paketille kuva' readonly=''>"+
                   "</label>"+
                   "<label for='category' id='packageCategory' class='category' style='margin-top: 20px;'>"+tr("packageCategory")+"</label>"+
                   "<select class='form-control' id='packageCategorySelect'>"+
                     "<option value='initial_sales'>"+tr("initialsales", "capitalizefirst")+"</option>"+
                     "<option value='customerservice'>"+tr("customerservice", "capitalizefirst")+"</option>"+
                     "<option value='continual_sales'>"+tr("continualsales", "capitalizefirst")+"</option>"+
                     "<option value='subpackage'>"+tr("subpackage", "capitalizefirst")+"</option>"+
                   "</select>"+
                   "<label for='packageDiscountCode' id='packageDiscountCode' style='margin-top: 20px;'>"+tr("packageDiscountCode")+"</label>"+
                   "<div class='input'>{{input type='text' value=discountCode}}</div>" +

                         "<label class='toggle' style='margin-top:10px'>" +
                         "{{ input type='checkbox' checked=isOrderPrevention value='1' data-unchecked-value='0' }}"+
                         ""+tr("packageIsOrderPrevention")+""+
                           //"<input type='checkbox' {{bind-attr checked=isOrderPrevention}}>" + tr("packageIsOrderPrevention") +
                           "<i data-swchon-text='" + tr('yes', "capitalizefirst") + "'data-swchoff-text='" +
                           tr("no", "capitalizefirst") + "'></i>" +
                         "</label>" +
                   "</div>" +
                   "<div class='col-xs-8 bgimage-preview'>" +
                   "</div>" +
                 "</div>" +
               "</section>" +
               "<section>" +
                 "<div class='offers-container'>" +
                   "<div class='product-pane'>" +
                     "<div class='well'>" +
                       "<h2>" + tr("products") + "</h2>" +
                       "<header>" +
                         "<button class='btn btn-default add-offer custom-popover'><i class='fa fa-plus'></i> " +
                         tr("addOffer", "capitalizefirst") +
                         "</button>" +
                         "<button class='btn btn-default remove-offer'><i class='fa fa-minus'></i> " +
                         tr("removeOffer", "capitalizefirst") +
                         "</button>" +
                       "</header>" +
                       "<footer>" +
                         "<label class='pull-right'>" + tr("totalCost") + "</label>" +
                       "</footer>" +
                     "</div>" +
                   "</div>" +
                   "<div class='card-pane'>" +
                     "<div class='well'>" +
                       "<h2>" + tr("cardPayment") + "</h2>" +
                       "<header class='smart-form'>" +
                         "<label class='label'>" + tr("billingPeriod") +"</label>" +
                         "<div class='select billing-period mandatory'><select>" +
                           "<option value='1'>1 " + tr("months") + "</option>" +
                           "<option value='2'>2 " + tr("months") + "</option>" +
                           "<option value='3'>3 " + tr("months") + "</option>" +
                           "<option value='4'>4 " + tr("months") + "</option>" +
                           "<option value='5'>5 " + tr("months") + "</option>" +
                           "<option value='6'>6 " + tr("months") + "</option>" +
                           "<option value='7'>7 " + tr("months") + "</option>" +
                           "<option value='8'>8 " + tr("months") + "</option>" +
                           "<option value='9'>9 " + tr("months") + "</option>" +
                           "<option value='10'>10 " + tr("months") + "</option>" +
                           "<option value='11'>11 " + tr("months") + "</option>" +
                           "<option value='12'>12 " + tr("months") + "</option>" +
                         "</select><i></i></div>" +
                         "<label class='label'>" + tr("offerPeriods") +"</label>" +
                         "<div class='select offer-periods mandatory'><select>" +
                           "<option value='1'>1</option>" +
                           "<option value='2'>2</option>" +
                           "<option value='3'>3</option>" +
                           "<option value='4'>4</option>" +
                           "<option value='5'>5</option>" +
                           "<option value='6'>6</option>" +
                           "<option value='7'>7</option>" +
                           "<option value='8'>8</option>" +
                           "<option value='9'>9</option>" +
                           "<option value='10'>10</option>" +
                           "<option value='11'>11</option>" +
                           "<option value='12'>12</option>" +
                           "<option value='0'>" + tr("offerAlways", "capitalizefirst") + "</option>" +
                         "</select><i></i></div>" +
                         "<br/><div class='note'>Paketti veloitetaan {{creditBillPeriod}} kk " +
                         "tarjousjaksoissa <span class='credit-offer-period-text'>1 kerran ennen " +
                         "hinnastoon siirtymistä</span>.</div>" +
                       "</header>" +
                       "<footer>" +
                         "<label class='card-baseprice-sum'><span>0</span> €</label>" +
                         "<label class='card-offerprice-sum pull-right'><span>0</span> €</label>" +
                       "</footer>" +
                     "</div>" +
                   "</div>" +
                   "<div class='paper-pane'>" +
                     "<div class='well'>" +
                       "<h2>" + tr("paperPayment") + "</h2>" +
                       "<header class='smart-form'>" +
                         "<label class='label'>" + tr("billPeriod") +"</label>" +
                         "<div class='select bill-period mandatory'><select>" +
                           "<option value='1'>1 " + tr("months") + "</option>" +
                           "<option value='2'>2 " + tr("months") + "</option>" +
                           "<option value='3'>3 " + tr("months") + "</option>" +
                           "<option value='4'>4 " + tr("months") + "</option>" +
                           "<option value='5'>5 " + tr("months") + "</option>" +
                           "<option value='6'>6 " + tr("months") + "</option>" +
                           "<option value='7'>7 " + tr("months") + "</option>" +
                           "<option value='8'>8 " + tr("months") + "</option>" +
                           "<option value='9'>9 " + tr("months") + "</option>" +
                           "<option value='10'>10 " + tr("months") + "</option>" +
                           "<option value='11'>11 " + tr("months") + "</option>" +
                           "<option value='12'>12 " + tr("months") + "</option>" +
                         "</select><i></i></div>" +
                       "</header>" +
                       "<footer>" +
                         "<label class='paper-offerprice-sum'><span>0</span> €</label>" +
                       "</footer>" +
                     "</div>" +
                   "</div>" +
                   "<ul class='offer-list'></ul>" +
                 "</div>" +
               "</section>" +
               "<section>" +
                 "<div class='row'>" +
                   "<div class='col-xs-6 smart-form'>" +
                     "<section>" +
                       "<label class='label'>" + tr("packageMarketingPrice") +
                       "</label><div class='input highlight'>{{input type='text' value=marketingPrice}}</div>" +
                     "</section>" +
                      "<section>" +
                       "<label class='label'>" + tr("packageNormalPrice") +
                       "</label><div class='input highlight'>{{input type='text' value=normalPrice}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("packageExtraDescription") + "</label>" +
                       "<div class='textarea highlight'>{{textarea rows='8' value=extraDescription}}</div>" +
                     "</section>" +
                     "<section>" +
                       "<label class='label'>" + tr("packageMarketingSubtext") + "</label>" +
                       "<div class='textarea highlight'>{{textarea rows='8' value=marketingSubtext}}</div>" +
                     "</section>" +
                   "</div>" +
                   "<div class='col-xs-6 sales-channels'>" +
                   "</div>" +
                   "<div class='col-xs-6 smart-form sales-return-page'>" +
                     "<label class='label'>" + tr("salesReturnPage") +"</label>" +
                       "<div class='select'><select>" +
                       "</select><i></i></div>" +
                   "</div>" +
                 "</div>" +
               "</section>"+
               "<section class='package-giveaway-tab'>" +
                 "<div class='row'>" +
                   "<div class='col-xs-6 package-giveaways'>" +
                   "</div>" +
                 "</div>" +
               "</section>";

  var productColumn = "<div class='smart-form product-column'>" +
                        "<label class='label product-name'></label>" +
                        "<label class='label product-short-code'></label>"+
                        "<div class='type select'><select>" +
                          "<option value='0'>" + tr("durationOfferRow", "capitalizefirst") + "</option>" +
                          "<option value='1'>" + tr("fixedOfferDateRow", "capitalizefirst" ) + "</option>" +
                          "<option value='2'>" + tr("fixedOfferPeriodRow", "capitalizefirst" ) + "</option>" +
                        "</select><i></i></div>" +
                        "<div class='input end-date mandatory'>" +
                          "<i class='fa fa-calendar icon-append'></i>" +
                          "<input class='datepicker' placeholder='" + tr("offerPeriodTill", "capitalizefirst") + "'>" +
                        "</div>" +
                        "<div class='input end-time mandatory'><input type='text' placeholder='" + tr("months") + "'></div>" +
                        "<div class='input pull-right no-margin'><input class='ot' placeholder='" +
                          tr("offerAddressCollection", "uppercase")  + "' type='text'></div>" +
                      "</div>";

  var cardColumn = "<div class='smart-form card-column'>" +
                     "<div class='price-definition select mandatory'><select>" +
                     "</select><i></i></div>" +
                     "<label class='label'><span class='card-price'></span> €</label>" +
                     "<div class='input pull-right no-margin'><input placeholder='" + tr("offerPrice", "capitalizefirst")  + "' type='text'></div>" +
                   "</div>";

  var paperColumn = "<div class='smart-form paper-column'>" +
                      "<div class='input'><input placeholder='" + tr("offerPrice", "capitalizefirst")  + "' type='text'></div>" +
                    "</div>";

  function addOfferRow(packageDialog, product, offer) {
    if (typeof product !== "undefined" && product &&
        typeof product.name === "string" && product.name &&
        typeof product.id !== "undefined" && product.id) {
      var row = $("<li></li>").appendTo(packageDialog.$(".offers-container > ul.offer-list"));
      row.data("product", product.id);

      var productC = $(productColumn);

      productC.find(".product-name").html(product.name);
      productC.find(".product-short-code").html(product.shortCode);
      var type = productC.appendTo(row).find(".type select").change(function() {
        switch (parseInt($(this).val())) {
          case 0:
            row.find('.end-date').hide();
            row.find('.end-time').hide();
            break;
          case 1:
            row.find('.end-time').hide();
            row.find('.end-date').css({display: "inline-block"});
            break;
          case 2:
            row.find('.end-date').hide();
            row.find('.end-time').css({display: "inline-block"});
            break;
        }
      });

      // GLOBAL SMART ADMIN FUNCTION smartAdmin.js : 610
      if (typeof runAllForms === "function") {
        runAllForms(productC);
      }

      if (typeof offer !== "undefined" && offer) {
        if (typeof offer.paymentType == "string") {
          if (offer.paymentType == "fixed") {
            if (typeof offer.durationTo == "string" && offer.durationTo) {
              productC.find(".end-date .datepicker").datepicker("setDate",
                            util.parseDate(offer.durationTo, "D.M.YYYY"));
              type.val(1);
            } else if (offer.duration) {
              productC.find(".end-time input").val(offer.duration);
              type.val(2);
            }
          }

        }
        if(typeof offer.id !== "undefined" && offer.id){
          row.data("id", offer.id);
        }

        if (typeof offer.otNumber !== "undefined" && offer.otNumber) {
          productC.find(".ot").val(offer.otNumber);
        }
      }

      type.trigger("change");

      var cardC = $(cardColumn).appendTo(row);

      cardC.find(".price-definition select").change(function() {
        var def = $(this).find("option:selected");

        if (def.length) {
          prices = def.data("prices");

          var priceLength = packageDialog.controller.get("creditBillPeriod");

          if (prices && prices instanceof Array && priceLength) {
            // Update row price
            cardC.find(".card-price").html(parseFloat(prices[priceLength - 1]));

            // Update base sum price
            var sum = 0;

            packageDialog.$(".card-price").each(function() {
              var amount = parseFloat($(this).html());
              if (!isNaN(amount)) {
                sum += amount;
              }
            });
            packageDialog.$(".card-baseprice-sum span").html(parseFloat(sum).toFixed(2));
          }
        }
      });

      cardC.find("input").keyup(function() {
        // Update card offer sum price
        var sum = 0;

        packageDialog.$(".card-column input").each(function() {
          var amount = parseFloat($(this).val());
          if (!isNaN(amount)) {
            sum += amount;
          }
        });
        packageDialog.$(".card-offerprice-sum span").html(sum);
      });

      DP.execute({type: "product", method: "findDefinitions", params: {product: product.id}})
        .then(function(defTables) {
          var defs = cardC.find(".price-definition select");
          for(var i = 0; i < defTables.length; i++) {
            var def = $("<option value='" + defTables[i].id +
                        "'>" + defTables[i].name + "</option>");
            def.data("prices", defTables[i].prices);
            defs.append(def);
          }

          if (typeof offer !== "undefined" && offer &&
              typeof offer.priceDefinition == "string" && offer.priceDefinition) {
            defs.val(offer.priceDefinition);
          }

          // Trigger price change
          defs.trigger("change");
      });

      var paperC = $(paperColumn).appendTo(row);

      paperC.find("input").keyup(function() {
        // Update paper offer sum price
        var sum = 0;

        packageDialog.$(".paper-column input").each(function() {
          var amount = parseFloat($(this).val());
          if (!isNaN(amount)) {
            sum += amount;
          }
        });
        packageDialog.$(".paper-offerprice-sum span").html(sum);
      });

      if (typeof offer !== "undefined" && offer) {
        if (typeof offer.creditPrice !== "undefined") {
          cardC.find("input").val(offer.creditPrice).trigger("keyup");
        }

        if (typeof offer.paperPrice !== "undefined") {
          paperC.find("input").val(offer.paperPrice).trigger("keyup");
        }
      }

      // Allow selection
      row.click(function() {
        if ($(this).hasClass("selected")) {
          $(this).removeClass("selected");
        } else {
          $(this).siblings().removeClass("selected");
          $(this).addClass("selected");
        }
      });
      row.find("select, input").click(function(e) {
        e.stopPropagation();
      });
    }
  }

  function offersToHTML(packageDialog, offers) {
    if (typeof packageDialog !== "undefined" && packageDialog &&
        typeof offers !== "undefined" && offers && offers instanceof Array &&
        offers.length > 0) {
      packageDialog.$(".offer-list").html("");

      for (var i = 0; i < offers.length; i++) {
        addOfferRow(packageDialog, {id: offers[i].product, shortCode: offers[i].shortCode,
                    name: offers[i].productName}, offers[i]);
      }
    }
  }

  function offersFromHTML(packageDialog) {
    // returns
    // array on success
    // null on essential field missing
    // 0 on price inconsistency
    // -1 misc error (e.g., failed to get product ID)
    var offers = [];

    if (typeof packageDialog !== "undefined" && packageDialog) {
      var cardPayment = null;
      var paperPayment = null;

      packageDialog.$(".offer-list > li").each(function() {
        var offer = {
          product: null,
          duration: null,
          durationTo: null,
          durationType: null,
          creditPrice: null,
          paperPrice: null,
          paymentType: null,
          otNumber: null,
          priceDefinition: null,
          offerPeriodStart: null
        };

        if ($(this).data("id")) {
          offer.id = $(this).data("id");
        }

        var name = $(this).find(".product-name").html();
        if (name) {
          offer.productName = name;
        }

        var shortCode = $(this).find(".product-short-code").html();
        if (shortCode) {
          offer.shortCode = shortCode;
          if (shortCode === 'IN' || shortCode === 'IP') {
            offer.periodStart = 'instant';
          }
          else {
            offer.periodStart = 'delayed';
          }
        }

        // always at the moment
        offer.durationType = "months";

        var product = $(this).data("product");
        if (product) {
          offer.product = product;
        } else {
          offers = -1;
          return false;
        }

        var type = $(this).find(".type select").val();
        switch (parseInt(type)) {
          case 0:
            offer.paymentType = "repeating";
            break;
          case 1:
            offer.paymentType = "fixed";

            var date = $(this).find(".end-date .datepicker").datepicker("getDate");
            if (date && date instanceof Date) {
              offer.durationTo = util.dateToUTCString(date);
            } else {
              // Missing end date
              offers = null;
              return false;
            }
            break;
          case 2:
            offer.paymentType = "fixed";

            var duration = parseInt($(this).find(".end-time input").val());
            if (!isNaN(duration) && duration) {
              offer.duration = duration;
            } else {
              // Missing duration
              offers = null;
              return false;
            }
            break;
        }

        var ot = parseInt($(this).find(".ot").val());
        if (!isNaN(ot) && ot) {
          offer.otNumber = ot;
        }

        var def = $(this).find(".price-definition select").val();
        if (def) {
          offer.priceDefinition = def;
        } else {
          // Missing price definition
          offers = null;
          return false;
        }

        var card = parseFloat($(this).find(".card-column input").val());
        if (!isNaN(card)) {
          if (cardPayment === false) {
            // Price inconsistency
            // Having previously no card price, but this one has
            offers = 0;
            return false;
          }

          cardPayment = true;
          offer.creditPrice = card;
        } else {
          if (cardPayment === true) {
            // Price inconsistency
            // Having previously card price but this one doesn't have
            offers = 0;
            return false;
          }

          cardPayment = false;
        }

        var paper = parseFloat($(this).find(".paper-column input").val());
        if (!isNaN(paper)) {
          if (paperPayment === false) {
            // Price inconsistency
            // Having previously no paper price, but this one has
            offers = 0;
            return false;
          }

          paperPayment = true;
          offer.paperPrice = paper;
        } else {
          if (paperPayment === true) {
            // Price inconsistency
            // Having previously paper price but this one doesn't have
            offers = 0;
            return false;
          }

          paperPayment = false;
        }

        offers.push(offer);
      });
    }

    return offers;
  }

  var PackageDialog = ViivaDialogView.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = _this.$("").addClass("package-dialog");
      _this.s3 = {old : {}};

      AWS.config.update({accessKeyId: 'AKIAIIZFDJNQZHVXG3VQ', secretAccessKey: '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'});
      AWS.config.region = 'eu-west-1';
      var bucket = new AWS.S3({params: {Bucket: 'otavamedia-mydigi'}});

      var devMode = false;
      var devSuffix = "";
      if (window.location.hostname != "mydigi.otavamedia.fi") {

       // console.log('working in development mode');
        devMode = true;
        devSuffix = ".dev";
      }

       var select = jRoot.find('#packageCategorySelect');

       if (typeof _this.newPackage === "undefined" || !_this.newPackage) {
       _this.controller.then(function() {

          select.val(_this.controller.content.get("category"));
           if(_this.controller.content.get("category") === 'subpackage') {
            jRoot.prev().last().find('[name="subpackage"]').hide();
            jRoot.prev().last().find('[name="salesChannels"]').hide();
          }

        });
      }
      
       select.change(function() {
        if (typeof _this.controller.set === "function") {
            _this.controller.set("category", $(this).val());
            if($(this).val() === 'subpackage') {
             jRoot.prev().last().find('[name="subpackage"]').hide();
             jRoot.prev().last().find('[name="salesChannels"]').hide();
            }
            else {
              jRoot.prev().last().find('[name="subpackage"]').show();
              jRoot.prev().last().find('[name="salesChannels"]').show();
            }
           }
        });

      var rList = new ViivaItemList();
      rList.create({title: tr("lekaRequirements"), container: jRoot.find(".offer-requirements"),
                     reorder: false, item: OfferRequirement});

      jRoot.find(".add-offer").popover({
        title: tr("selectProduct"), placement: 'bottom', container: 'body', html: true,
        template: "<div class='popover dynamic products-popover'><div class='arrow'></div>" +
                  "<div class='popover-header'><h3 class='popover-title'></h3>" +
                  "<div class='popover-ctrls'><button class='btn btn-default btn-ms'> " +
                  tr("cancel") + "</button><button class='btn btn-primary btn-ms'>" +
                  tr("select") + "</button></div><div class='clearfix'></div></div>" +
                  "<div class='popover-content'></div></div>",
        content: "<div class='products-selection'></div>"
      }).on('shown.bs.popover', function () {
        var productsTable = new ViivaDataTable();
        productsTable.create({
          container: $(".products-selection"),
          method: "product.get",
          pagination: false,
          onProcessing: function(processing) {
            if (processing) {
              $(".products-popover").css({"height": "450px"});
            }
          },
          colDefs: [
          {name: tr("productID"), prop: "id", visible: false},
          {name: tr("productCode"), prop: "code", visible: false},
          {name: tr("productGroup"), prop: "group"},
          {name: tr("shortCode"), prop: "shortCode"},
          {name: tr("productType"), prop: "type", render: function(data)
          {return tr(data, "capitalizefirst");}},
          ],
          defaultSort: [[2, "asc"]], // alphabetical order
          onClick: function(row, data) {
            if (row.hasClass("selected")) {
              row.removeClass("selected");
            } else {
              row.siblings("tr").removeClass("selected");
              row.addClass("selected");
            }
          }
        });

        $(".products-popover .popover-ctrls > button.btn-primary")
          .unbind("click").bind("click", function() {
            var selected = $(".products-selection .selected");

            if (selected.length) {
              var product = productsTable.getData(selected.get(0));

              if (product && typeof product.code === "string" &&
                  typeof product.id !== "undefined" && product.id) {
                // Parse name
                var names = product.code.split(".");
                var label;

                if (names.length > 1) {
                  names[0] = names[0].toUpperCase();
                  names[1] = names[1].charAt(0).toUpperCase() + names[1].slice(1);

                  label = names[0] + " " + names[1];
                } else {
                  label = names[0].charAt(0).toUpperCase() + names[0].slice(1);
                }

                // check for previous offers to find luekirja 
                /*
                Array can't contain Luekirja products if something else is already there
                Array can't contain other products if Luekirja products are there
            
                */
                var previousOffers = offersFromHTML(_this);
                var shortCodeArray = [];
                var offerToAddShortCode = product.shortCode;
                var addingLueKirja = (offerToAddShortCode ==='IN' || offerToAddShortCode === 'IP' ? true: false);
                var hasLueKirja = false;
                var allowedToAdd = true;

                if (previousOffers && previousOffers.length > 0) {

                  $.each(previousOffers, function() {
                    shortCodeArray.push(this.shortCode);
                  });

                  if (shortCodeArray.indexOf("IN") > -1 || shortCodeArray.indexOf("IP") > -1) {
                    hasLueKirja = true;
                  }              
                  if (addingLueKirja && !hasLueKirja) {
                    allowedToAdd = false;
                  }
                
                  else if (!addingLueKirja && hasLueKirja)  {
                    allowedToAdd = false;
                  }
                }

                if (allowedToAdd) {
                  addOfferRow(_this, {name: label, shortCode: offerToAddShortCode, id: product.id});
                  updateReturnPagesByOffer();
                }
                else {
                  Notification.error({title: tr("offerAddFailed"), message: tr("offerAddNormalLuekirjaFail")});
                }

              }
            }

            jRoot.find(".add-offer").popover("hide");
          });

        $(".products-popover .popover-ctrls > button.btn-default")
          .unbind( "click" ).bind("click", function() {
            jRoot.find(".add-offer").popover("hide");
          });
      }).on('hide.bs.popover', function() {
        $(".products-popover").removeAttr("style");
      });

      jRoot.find(".remove-offer").click(function() {
        var selectedOffer = jRoot.find(".offers-container > ul.offer-list > li.selected");

        if (selectedOffer.length) {
          selectedOffer.remove();

          // Update price calculations
          if (jRoot.find(".offers-container > ul.offer-list > li").length) {
            jRoot.find(".price-definition select").trigger("change");
            jRoot.find(".card-column input").trigger("keyup");
            jRoot.find(".paper-column input").trigger("keyup");
          } else {
            // No offer left, reset sums
            jRoot.find(".card-baseprice-sum span").html("0");
            jRoot.find(".card-offerprice-sum span").html("0");
            jRoot.find(".paper-offerprice-sum span").html("0");
          }

          updateReturnPagesByOffer();
        }
      });


      var giveAwaysList = new ViivaItemList();
      giveAwaysList.create({title: tr("giveAways"), container: jRoot.find('.package-giveaways'),
        reorder: false});


      jRoot.find(".package-giveaways header .jarviswidget-ctrls > .list-add").addClass("custom-popover").popover({
        title: tr("giveAways"), placement: 'bottom', container: 'body', html: true,
        template: "<div class='popover dynamic package-giveaways-popover'><div class='arrow'></div>" +
                  "<div class='popover-header'><h3 class='popover-title'></h3>" +
                  "<div class='popover-ctrls'><button class='btn btn-default btn-ms'> " +
                  tr("cancel") + "</button><button class='btn btn-primary btn-ms'>" +
                  tr("select") + "</button></div><div class='clearfix'></div></div>" +
                  "<div class='popover-content'></div></div>",
        content: "<div class='package-giveaways-selection'></div>"
      }).on('shown.bs.popover', function () {
        var packageGiveAwaysTable = new ViivaDataTable();
        packageGiveAwaysTable.create({
          container: $(".package-giveaways-selection"),
          method: "package.get",
          pagination: false,
          onProcessing: function(processing) {
            if (processing) {
              $(".package-giveaways-popover").css({"height": "450px"});
            }
          },
          colDefs: [
            {name: tr("packageID"), prop: "id", visible: false},
            {name: tr("productGroup"), prop: "group", sortable: true},
            {name: tr("packageOffers"), prop: "packageOffers", visible: false},
            {name: tr("packageName"), prop: "name"},
            {name: tr("packageMarketingName"), prop: "marketingName"},
            {name: tr("packageSalesStart"), prop: "start",
             render: function(data) {return util.parseDate(data);}},
            {name: tr("packageSalesEnd"), prop: "end",
             render: function(data) {return util.parseDate(data);}}
          ],
          defaultSort: [[1, "asc"]], // alphabetical order
          onClick: function(row, data) {
            if (row.hasClass("selected")) {
              row.removeClass("selected");
            } else {
              row.addClass("selected");
            }
          },
            filterFn: function(data) {
              var now = new Date();
              data.push({name: "salesStartEnd", value: util.dateToUTCString(now)});
              data.push({name: "salesEndStart", value: util.dateToUTCString(now)});
              data.push({name: "packageCategory", value: "subpackage"});
              return data;
            }
        });

        $(".package-giveaways-popover .popover-ctrls > button.btn-primary")
          .unbind( "click" ).bind("click", function() {
            var selected = [];

            $(".package-giveaways-selection .selected").each(function() {
              var data = packageGiveAwaysTable.getData(this);
              if (data) {
                var item = $("<li class='dd-item'><div class='dd-handle'>" + data.marketingName +
                             "</div></li>");

                var packageDuration = null;
                if (data.packageOffers[0].offer.duration != null) {
                  packageDuration = data.packageOffers[0].offer.duration+ " kk";
                }
                else {
                  packageDuration =  util.parseDate(data.packageOffers[0].offer.durationTo, "D.M.YYYY")+ " asti";
                }

                item.data({
                  "id": data.id,
                  "marketingName": data.marketingName,
                  "duration": packageDuration});
                selected.push(item);
              }
            });

            giveAwaysList.appendItems({items: selected});

            jRoot.find(".package-giveaways header .jarviswidget-ctrls > .list-add").popover("hide");
          });

        $(".package-giveaways-popover .popover-ctrls > button.btn-default")
          .unbind( "click" ).bind("click", function() {
            jRoot.find(".package-giveaways header .jarviswidget-ctrls > .list-add").popover("hide");
          });
      }).on('hide.bs.popover', function() {
        $(".package-giveaways-popover").removeAttr("style");
      });

      var sc = new ViivaItemList();
      sc.create({title: tr("salesChannels"), container: jRoot.find(".sales-channels"),
                 reorder: false});

      jRoot.find(".sales-channels header .jarviswidget-ctrls > .list-add").addClass("custom-popover").popover({
        title: tr("selectSalesChannel"), placement: 'bottom', container: 'body', html: true,
        template: "<div class='popover dynamic sales-channels-popover'><div class='arrow'></div>" +
                  "<div class='popover-header'><h3 class='popover-title'></h3>" +
                  "<div class='popover-ctrls'><button class='btn btn-default btn-ms'> " +
                  tr("cancel") + "</button><button class='btn btn-primary btn-ms'>" +
                  tr("select") + "</button></div><div class='clearfix'></div></div>" +
                  "<div class='popover-content'></div></div>",
        content: "<div class='sales-channels-selection'></div>"
      }).on('shown.bs.popover', function () {
        var salesChannelsTable = new ViivaDataTable();
        salesChannelsTable.create({
          container: $(".sales-channels-selection"),
          method: "service.point.get",
          pagination: false,
          onProcessing: function(processing) {
            if (processing) {
              $(".sales-channels-popover").css({"height": "450px"});
            }
          },
          colDefs: [
            {name: tr("serviceID"), prop: "id", visible: false},
            {name: tr("serviceName"), prop: "service"},
            {name: tr("servicePointName"), prop: "name"},
            {name: tr("servicePointURL"), prop: "url", sortable: false,
             render: function(data) {
               return "<button class='btn btn-default btn-ms' title='" + data + "' onclick=\"window.open('" +
                      data + "', '_blank'); event.stopPropagation();\">" + tr("openServicePoint") + "</button>";
             }}
          ],
          defaultSort: [[1, "asc"]], // alphabetical order
          onClick: function(row, data) {
            if (row.hasClass("selected")) {
              row.removeClass("selected");
            } else {
              row.addClass("selected");
            }
          }
        });

        $(".sales-channels-popover .popover-ctrls > button.btn-primary")
          .unbind( "click" ).bind("click", function() {
            var selected = [];

            $(".sales-channels-selection .selected").each(function() {
              var data = salesChannelsTable.getData(this);
              if (data) {
                var item = $("<li class='dd-item'><div class='dd-handle'>" +
                             data.service + ", " + data.name +
                             "<button class='pull-right btn btn-default btn-ms' title='" +
                             data.url + "' onclick=\"window.open('" + data.url +
                             "', '_blank'); event.stopPropagation();\">" +
                             tr("openServicePoint") + "</button></div></li>");

                item.data("id", data.id);
                selected.push(item);
              }
            });

            sc.appendItems({items: selected});

            jRoot.find(".sales-channels header .jarviswidget-ctrls > .list-add").popover("hide");
          });

        $(".sales-channels-popover .popover-ctrls > button.btn-default")
          .unbind( "click" ).bind("click", function() {
            jRoot.find(".sales-channels header .jarviswidget-ctrls > .list-add").popover("hide");
          });
      }).on('hide.bs.popover', function() {
        $(".sales-channels-popover").removeAttr("style");
      });

      if (typeof pageSetUp == "function") {
        pageSetUp(jRoot);
      }

      jRoot.find(".timepicker").timepicker({showMeridian: false, defaultTime: "0:0:0"});

      // Init non ember bound fields in case of a new dialog through duplication
      if (_this.options.id === "copy") {
        jRoot.find(".offers-container .billing-period select")
             .val(_this.controller.get("creditBillPeriod"));
        jRoot.find(".offers-container .offer-periods select")
             .val(_this.controller.get("creditOfferPeriodCount"));
        setCreditOfferPeriodCount();
        jRoot.find(".offers-container .bill-period select")
             .val(_this.controller.get("paperBillPeriod"));
        jRoot.find('#packageCategorySelect')
        .val(_this.controller.get("category"));

        if(_this.controller.get("category") === 'subpackage') {
            setTimeout(function() {
              jRoot.prev().last().find('[name="subpackage"]').hide();
              jRoot.prev().last().find('[name="salesChannels"]').hide();
            }, 100);
       
          }  
        
      }

      // Fill in exisitng offers, requiremens, and services
      if (typeof _this.offers !== "undefined" && _this.offers) {
        if (_this.offers instanceof Array) {
          offersToHTML(_this, _this.offers);
        } else if (typeof _this.offers.then === "function") {
          _this.offers.then(function(offers) {
            offersToHTML(_this, offers);

            // Wait till resolution to disable offer editing
            _this.controller.then(function() {
              if (!_this.controller.content.get("editable")) {
                jRoot.find(".offer-list > li").unbind("click")
                     .find(".input, .select").removeClass("mandatory")
                     .find("input, select").attr('disabled', 'disabled');
              }
            });
          });
        }
      }

      function setRequirements(requirements) {
        if (requirements && requirements.length > 0) {
          var items = [];
          for (var i = 0; i < requirements.length; i++) {
            var r = (new OfferRequirement()).create(requirements[i]);
            if (typeof requirements[i].id !== "undefined") {
              r.data("id", requirements[i].id);
            }
            items.push(r);
          }

          rList.appendItems({items: items});
        }
      }

      if (typeof _this.requirements !== "undefined" && _this.requirements) {
        if (_this.requirements instanceof Array) {
          setRequirements(_this.requirements);
        } else if (typeof _this.requirements.then === "function") {
          _this.requirements.then(function(requirements) {
            setRequirements(requirements);
          });
        }
      }

      function getRequirements() {
        var requirements = [];
        var items = rList.getAllItems();

        items.each(function() {
         var item = {};

         if ($(this).data("id")) {
           item.id = $(this).data("id");
         }

         item.code = $(this).find(".product select").val();

         var types = $(this).find(".select2").select2('val');
         if (!types || types.length === 0) {
           return false;
         }
         item.type = {types: types};

         requirements.push(item);
        });

        return requirements;
      }



      function setServices(services) {
        _this.s3.old.servicepoints = [];
        if (services && services.length > 0) {
          var items = [];
          for (var i = 0; i < services.length; i++) {
             var item = $("<li class='dd-item'><div class='dd-handle'><span>" +
                          services[i].service + "</span>, <span>" + services[i].name +
                          "</span><button class='pull-right btn btn-default btn-ms' title='" +
                          services[i].url + "' onclick=\"window.open('" + services[i].url +
                          "', '_blank'); event.stopPropagation();\">" +
                          tr("openServicePoint") + "</button></div></li>");

             item.data("id", services[i].id);
             items.push(item);
             _this.s3.old.servicepoints.push({id : services[i].id, url : services[i].url});
          }
          sc.appendItems({items: items});
        }
      }

      if (typeof _this.services !== "undefined" && _this.services) {
        if (_this.services instanceof Array) {
          setServices(_this.services);
        } else if (typeof _this.services.then === "function") {
          _this.services.then(function(services) {
            setServices(services);
          });
        }
      }


      function getServices() {
        var services = [];
        var items = sc.getAllItems();

        items.each(function() {
         var id = $(this).data("id");

         if (id && $.inArray(id, services) == -1) {
           services.push(id);
         }
        });

        return services;
      }

      function getGiveAways(copy) {
        var giveAways = [];
        var items = giveAwaysList.getAllItems();

        items.each(function() {
         var id = $(this).data("id");
         var marketingName = $(this).data("marketingName");
         var duration = $(this).data("duration");

         if (id && $.inArray(id, giveAways) == -1) {
            // set marketing name also if copying
            if (typeof copy !== "undefined") {
              giveAways.push({"id": id, "marketingName": marketingName, "duration": duration});
            }
            else {
               giveAways.push(id);
            }
         }
        });

        return giveAways;
      }

        function setGiveAways(giveAways) {
        if (giveAways && giveAways.length > 0) {
          var items = [];
          for (var i = 0; i < giveAways.length; i++) {

             var item = $("<li class='dd-item'><div class='dd-handle'>" + giveAways[i].marketingName +
                             "</div></li>");
             var giveAwayDuration = null;

             // from copying
             if (giveAways[i].duration && giveAways[i].duration != null) {
              giveAwayDuration = giveAways[i].duration;

             }
             // from database
             else {
               if (giveAways[i].offers[0].offer.duration != null) {
                 giveAwayDuration = giveAways[i].offers[0].offer.duration + " kk";
                }
                else {
                giveAwayDuration =  util.parseDate(giveAways[i].offers[0].offer.durationTo, "D.M.YYYY")+ " asti";
                }
              }
             item.data({
                  "id": giveAways[i].id,
                  "marketingName": giveAways[i].marketingName,
                  "duration": giveAwayDuration});
             items.push(item);
          }
          giveAwaysList.appendItems({items: items});
        }

      }

      if (typeof _this.giveAways !== "undefined" && _this.giveAways) {
        if (_this.giveAways instanceof Array) {
          setGiveAways(_this.giveAways);
        } else if (typeof _this.giveAways.then === "function") {
          _this.giveAways.then(function(giveAways) {
            setGiveAways(giveAways);
          });
        }
      }


      function trimURL(url) {
        if (typeof url === "string" && url) {
          return url.toLowerCase().replace(/.+?:\/\//, "").replace(/\/.*/, "");
        }
      }

      function setReturnPages(returnPages) {
        var select = jRoot.find(".sales-return-page select");

        if (select.length > 0) {
          // really actually clear select options
          select.empty();
          if (typeof returnPages !== "undefined" && returnPages instanceof Array && returnPages.length > 0) {
            // if returnPagesSetting null & returnPages has at least one page, set it to returnPagesSetting
            if (typeof _this.controller.set === "function" && typeof _this.controller.get === "function") {
              if (_this.controller.get("returnPagesSetting") === null) {
                _this.controller.set("returnPagesSetting", returnPages[0].id);
              }
            }

            for (var i = 0; i < returnPages.length; i++) {
              select.append("<option value='" + returnPages[i].id + "'>" + returnPages[i].name +
                            " (" + trimURL(returnPages[i].success) + ", " +
                            trimURL(returnPages[i].fail) + ")</option>");
            }
          }
        }
      }

      function updateReturnPagesByOffer() {
        // Collect all product IDs from offers
        var products = [];

        jRoot.find(".offer-list > li").each(function() {
          if ($(this).data("product")) {
            products.push($(this).data("product"));
          }
        });

        // Clear current setting
        setReturnPages();
        if (typeof _this.controller.set === "function") {
          _this.controller.set("returnPagesSetting", null);
        }

        if (products.length > 0) {
          _this.returnPages = DP.execute({type: "product", method: "findReturnPages",
                                         params: {products: products}});
          _this.returnPages.then(function(returnPages) {
            setReturnPages(returnPages);
          });
        }
      }

      function updateServicePointJSON(servicePoint, packageID, add) {

        // query the servicepoint json from the s3
        $.ajax({
          url : "//otavamedia-mydigi.s3.amazonaws.com/" + servicePoint.id + ".settings"+devSuffix,
          type : "GET",
          dataType : "json"})
        .done(function(data){

          // check whether the package is already saved in the servicepoint json
          var saved = !add;
          var index = -1;

          if (typeof data.packages !== 'undefined') {

            if (typeof data.packages.ids !== 'undefined') {

              $.each(data.packages.ids, function(i, p) {

                if (p.id === packageID) {

                  saved = !saved;
                  index = i;
                  return false;
                }
              });
            }
            else {

              data.packages.ids = [];
            }
          }
          else {

            data.packages = {ids: []};
          }

          // if not, update json and push it back to s3
          if (!saved) {

            if (add) {

              data.packages.ids.push({id: packageID, position: data.packages.ids.length});
            }
            else {

              if (index !== -1) {

                data.packages.ids.splice(index, 1);
              }
            }
            var servicePointParams = {Key: servicePoint.id + '.settings' + devSuffix, Body: JSON.stringify(data), ContentType: 'application/json', ACL: 'public-read'};
            bucket.putObject(servicePointParams, function (error, data) {

              if (error) {

                //console.log(error);
                _this.s3.error = true;
              }
              else {
                // increase updated count for servicepoints
                _this.s3.servicePointsUpdated++;

              }
            });
          }
          else {

            _this.s3.servicePointsUpdated++;

          }
        })
        .fail(function() {

          _this.s3.servicePointsUpdated++;

        });
      }

      function updatePackageImage(packageID, add) {

        var bgImageKey = packageID + '.bgimage' + devSuffix;
        var bgImageParams;

        // if orig id exists, package is a copy -> copy image
        if( _this.options.original_id && typeof _this.options.original_id != 'undefined' && _this.options.originalHasImage){

          copyKey = 'otavamedia-mydigi/'+ _this.options.original_id + '.bgimage' + devSuffix;
          copyParams = {CopySource: copyKey, Key: bgImageKey, ACL: 'public-read'};

          bucket.copyObject(copyParams, function(error, data){

            if(error){
              _this.s3.error = true;
          
            }

            else{
                _this.s3.packageImageUpdated = true;

              _this.dialogLock = false;
              Notification.success({title: tr("packageImageUpdateSuccess"), message:
                                              tr("packageUpdateSuccessDescription").replace(
                                              "_NAME_", _this.controller.get('name'))});            
            }

          });

        }
        else if(add){
    
          var bgImage = $('input[name="bgImage"]')[0].files[0];
          bgImageParams = {Key: bgImageKey, ContentType: bgImage.type, Body: bgImage, ACL: 'public-read'};

          bucket.putObject(bgImageParams, function (error, data) {

            if (error) {
              _this.s3.error = true;
            }
            else {

              _this.s3.packageImageUpdated = true;

              _this.dialogLock = false;
              Notification.success({title: tr("packageImageUpdateSuccess"), message:
                                              tr("packageUpdateSuccessDescription").replace(
                                              "_NAME_", _this.controller.get('name'))});
            }
          });
        }
        else {
      
          bgImageParams = {Key: bgImageKey};
          bucket.deleteObject(bgImageParams, function (error, data) {

            if (error) {

              _this.s3.error = true;
            }
            else {

              _this.s3.packageImageUpdated = true;


            }
          });
        }
      }

      function updatePackageJSON(s3data, add) {

        var packageParams;
        if (add) {

          packageParams = {Key: s3data.id + '.settings' + devSuffix, Body: JSON.stringify(s3data), ContentType: 'application/json', ACL: 'public-read'};
          bucket.putObject(packageParams, function (error, data) {

            if (error) {

              //console.log(error);
              _this.s3.error = true;
            }
            else {

              if ($('input[name="bgImage"]').last()[0].files.length > 0 || _this.options.original_id &&  _this.options.originalHasImage) {
                 updatePackageImage(s3data.id, true);
              }

              else{
                // no image to add -> true
                _this.s3.packageImageUpdated = true;
              }

              _this.s3.packageUpdated = true;

            }

          });
        }
        else {

          packageParams = {Key: s3data.id + '.settings' + devSuffix};
          bucket.deleteObject(packageParams, function (error, data) {

            if (error) {

             // console.log(error);
              _this.s3.error = true;
            }
            else {
              _this.s3.servicePointsToUpdate--;
              _this.s3.packageUpdated = true;

            }
          });
        }


      }

      if (typeof _this.returnPages !== "undefined" && _this.returnPages &&
          typeof _this.returnPages.then === "function") {
        _this.returnPages.then(function(returnPages) {
          setReturnPages(returnPages);

          if (_this.options.id === "copy") {
            var rps = _this.controller.get("returnPagesSetting");
            if (rps) {
              jRoot.find(".sales-return-page select").val(rps);
            }
          } else if (_this.options.id !== "new") {
            _this.controller.then(function() {
              var rps = _this.controller.get("returnPagesSetting");
              if (rps) {
                jRoot.find(".sales-return-page select").val(rps);
              }
            });
          }
        });
      }

      jRoot.find(".sales-return-page select").change(function() {
        if (typeof _this.controller.set === "function") {
          if ($(this).val() === 0) { // Soft compare "0" with 0
            _this.controller.set("returnPagesSetting", null);
          } else {
            _this.controller.set("returnPagesSetting", $(this).val());
          }
        }
      });

      var s3_id = _this.options.id;

      if( _this.options.id == 'copy' && _this.options.original_id ){
          s3_id = _this.options.original_id;
          _this.options.originalHasImage = true;
      }

      var imageModifiedTime;
      $.ajax({
          url : "//otavamedia-mydigi.s3.amazonaws.com/"+s3_id+".bgimage"+devSuffix,
          type : "GET",
          success: function(res, stat, xhr) {
            imageModifiedTime = xhr.getResponseHeader("Last-Modified");
          },
          error: function(){

            if(typeof _this.options.original_id != 'undefined' && _this.options.original_id)
               _this.options.originalHasImage = false;
             
          }})
         .done(function(res){
          
          jRoot.find(".bgimage-preview").append($("<img/>").attr("src", "//otavamedia-mydigi.s3.amazonaws.com/"+s3_id+".bgimage"+devSuffix).css("max-width", "100%"));
          var helper = new Date(imageModifiedTime);
          var month = helper.getMonth() + 1;
          var modified = helper.getDate() + "." + month + "." + helper.getFullYear() + " klo " + helper.getHours() + ":" + helper.getMinutes();
          jRoot.find(".bgimage-preview").append($("<p>Viimeksi muokattu: " + modified + "</p>").css("padding-left", "20px") );
          jRoot.find(".bgimage-control").append(

            $("<button/>").addClass("btn btn-danger").attr('style', 'padding: 6px 12px; margin-top: 5px;').html('<i class="fa fa-trash-o"></i> Poista kuva')
            .on('click', function() {
             // console.log("plop");
              updatePackageImage(_this.options.id, false);
              $('.bgimage-preview').find('img').remove();
            })
          );
        });

      var dialogButtons = [];
      _this.dialogLock = false;
      // Duplicate a package
      if (typeof _this.newPackage === "undefined" || !_this.newPackage) {
        dialogButtons.push({
          html: "<i class='fa fa-files-o'></i> " + tr("duplicate", "capitalizefirst"),
          "class": "btn btn-success",
          click: function() {

            if (_this.dialogLock) {
              return;
            }

            var i;

            _this.dialogLock = true;

            var data = _this.controller.get("data");
            var data_cp = $.extend(deep=true, {}, data); // deep copy the package data...

            if (data && data_cp) {

              var params = {type: "PackageDialog", id: "copy", data: data_cp, original_id: data.id};

              if (typeof _this.options.update === "function" && _this.options.update) {
                params.update = _this.options.update;
              }

              var offers = offersFromHTML(_this);
              var requirements = getRequirements();

              // Trim off offer and requirements IDs
              if (offers instanceof Array && offers.length > 0) {
                for (i = 0; i < offers.length; i++) {
                  if (typeof offers[i].id !== "undefined") {
                    delete offers[i].id;
                  }
                }
                params.offers = offers;
              }

              if (requirements instanceof Array && requirements.length > 0) {
                for (i = 0; i < requirements.length; i++) {
                  if (typeof requirements[i].id !== "undefined") {
                    delete requirements[i].id;
                  }
                }
                params.requirements = requirements;
              }

              // Different from getServices to include everything other than IDs
              var services = sc.getAllItems();

              if (services.length) {
                params.services = [];
                services.each(function() {
                  params.services.push({
                    id: $(this).data("id"),
                    service: $(this).find("span").eq(0).html(),
                    name: $(this).find("span").eq(1).html(),
                    url: $(this).find("button").attr("title"),
                  });
                });
              }

              var giveAways = getGiveAways("copy");

              if (giveAways instanceof Array && giveAways.length > 0) {
                params.giveAways = giveAways;
              }

              if (typeof _this.returnPages !== "undefined" && _this.returnPages) {
                params.returnPages = _this.returnPages;
              }

              var dialog = $(this);
              // Open up a new package dialog prefilled with the copied data
              require("dialogManager").create(params);
                
              // close dialog where data is copied from
              setTimeout(function() {
                 dialog.dialog("close");
              }, 600);

            }

            _this.dialogLock = false;
          }
        });
      }
      // Save a package
      dialogButtons.push({
        html: "<i class='fa fa-save'></i> " + tr("save", "capitalizefirst"),
        "class": "btn btn-primary",
        click: function() {
          //_this.dialogLock = true;
          _this.s3.servicePointsUpdated = 0;
          _this.s3.error = false;
          _this.s3.packageUpdated = false;
          _this.s3.packageImageUpdated = false;

          var dialog = $(this);
          var offers = offersFromHTML(_this);

          /*
          Checks for subpackage aka giveaway aka kylkiäinen as of 2015-09-10
          - can't have more than one offer
          - can't be a luekirja product
          - must be of fixed length
          - must be free ( 0e )
          */
          if ( _this.controller.get('category') === 'subpackage') {
            if (offers instanceof Array && offers.length > 1 ) {
             Notification.error({title: tr("subpackageTooManyOffers"), message: tr("subpackageTooManyOffers")});
             return false;
            }
            else if ( offers instanceof Array && (offers[0].shortCode === 'IN' || offers[0].shortCode === 'IP')) {
              Notification.error({title: tr("subpackageNotPossibleInLuekirja"), message: tr("subpackageNotPossibleInLuekirja")});
              return false;
            }
            else if (offers instanceof Array && offers.length == 1 &&
              _this.controller.get('category') === 'subpackage' && offers[0].paymentType !== 'fixed' ) {
             Notification.error({title: tr("subpackageNotFixed"), message: tr("subpackageNotFixed")});
             return false;
            }
            else if (offers instanceof Array && offers.length == 1 &&
              _this.controller.get('category') === 'subpackage' && offers[0].paperPrice !== 0 ) {
             Notification.error({title: tr("subpackagePriceNotValid"), message: tr("subpackagePriceNotValid")});
             return false;
            }

          }

          /*
          Checks for Luekirja products as of 2015-09-10
          - Luekirja and other products can't be in the same package
          - Luekirja free package must have paper price of 0e and no credit price

          */
  
    
         if ( offers instanceof Array && offers.length > 0 && ( (offers[0].shortCode === 'IN' || offers[0].shortCode === 'IP') && offers[0].paperPrice != null ))  {
              if (offers[0].paperPrice !== 0) {
                Notification.error({title: tr("packageAddFailed"), message: tr("lueKirjaFreePriceFail")});
                return false;
              }
              else if (offers[0].creditPrice != null) {
                Notification.error({title: tr("packageAddFailed"), message: tr("lueKirjaFreeCardFail")});
                return false;
              }
         }
         else if ( offers instanceof Array && offers.length > 0 && (offers[0].shortCode === 'IN' && offers[0].paperPrice != null || offers[0].shortCode === 'IP' && offers[0].paperPrice != null )) {
            Notification.error({title: tr("packageAddFailed"), message: tr("lueKirjaPaperPriceFail")});
            return false;
         }

         else if ( offers instanceof Array && offers.length > 0 && (offers[0].shortCode === 'IN' && getGiveAways().length != 0 || offers[0].shortCode === 'IP' && getGiveAways().length != 0 )) {
            Notification.error({title: tr("packageAddFailed"), message: tr("giveAwayLueKirjaFail")});
            return false;
          }

          if (typeof _this.controller.save === "function") {

            // Save a new package
            if (typeof _this.controller.get('name') === "string" && _this.controller.get('name') &&
                typeof _this.controller.get('from') !== "undefined" && _this.controller.get('from') &&
                typeof _this.controller.get('to') !== "undefined" && _this.controller.get('to') &&
                typeof _this.controller.get('marketingName') !== "undefined" &&
                _this.controller.get('marketingName') && offers !== null) {

              if (offers !== 0) {

                if (offers instanceof Array && offers.length > 0) {
                  _this.controller.save().then(function(package) {

                    console.log("saving");

                    // Update offer, service and requirement in parallel
                    // Because package can exist without them, there is no need to chain them
                    DP.execute({type: "package", method: "createOffers",
                                params: {package: package.get("id"), offers: offers}});

                    var requirements = getRequirements();
                    if (requirements !== null) {
                      DP.execute({type: "package", method: "createRequirements",
                                 params: {package: package.get("id"), requirements: requirements}});
                    }

                    var services = getServices();

                    if (services !== null) {
                      DP.execute({type: "package", method: "createServices",
                                 params: {package: package.get("id"), services: services}});
                    }

                    var giveAways = getGiveAways();
                    if (giveAways !== null) {
                      DP.execute({type: "package", method: "createGiveAways",
                                 params: {package: package.get("id"), giveAways: giveAways}});
                    }

                    if (typeof _this.options.update === "function" && _this.options.update) {
                      _this.options.update();
                    }

                    $.ajax({
                      type : 'POST',
                      url : util.apiBase+'package.type.get',
                      data : JSON.stringify({package : package.get("id")}),
                      contentType : 'application/json',
                      dataType : 'json'
                    })
                    .done(function(data) {


                      // Update the service point information

                      var products = data.products;
                      var s3data = {};

                      // form the s3data for the package
                      s3data.id = package.get("id");
                      s3data.description = package.get("description");
                      s3data.extradescription = package.get("extradescription");
                      s3data.marketingprice = package.get("marketingPrice");
                      s3data.normalprice = package.get("normalPrice");
                      s3data.marketingsubtext = package.get("marketingSubtext");
                      s3data.marketingname = package.get("marketingName");
                      s3data.name = package.get("name");
                      s3data.from = package.get("from");
                      s3data.to = package.get("to");
                      s3data.existingcustomeroffer = 0;
                      s3data.digi = 0;
                      s3data.print = 0;
                      s3data.paymentcredit = 0;
                      s3data.paymentpaper = 0;
                      s3data.paymentmethodhidden = false;
                      s3data.giveaways = [];
                      s3data.repeating = 0;

                      var s3paperPriceSum = $('.paper-offerprice-sum span').html();
                      var s3cardPriceSum = $('.card-offerprice-sum span').html();

                      if (s3paperPriceSum === '0' && s3cardPriceSum === '0') {
                          s3data.paymentmethodhidden = true;
                      }


                      $.each(offers, function(i,e) {
                        if (e.paymentType !== 'fixed') {
                          s3data.repeating = 1;
                        }

                      });


                      var packageGiveAways = giveAwaysList.getAllItems();

                      if (packageGiveAways.length !== 0) {

                        packageGiveAways.each(function() {

                          var giveAwayPackageID = $(this).data("id");
                          var giveAwayMarketingName = $(this).data("marketingName");
                          var giveAwayDuration = $(this).data("duration");
                          // find offers for giveaways
      
                          s3data.giveaways.push({"id": giveAwayPackageID, "marketingName": giveAwayMarketingName, "duration": giveAwayDuration});
                      
                        });
                       
                      }


                      $.each(products, function(i, e) {

                        if (e.type === 1) {

                            s3data.digi = 1;
                        }
                        else if (e.type === 2) {

                            s3data.print = 1;
                        }
                      });


                      if (offers !== null) {

                        if (offers.length > 0) {

                          if (offers[0].creditPrice !== null) {

                            s3data.paymentcredit = 1;
                          }

                          if (offers[0].paperPrice !== null) {

                            s3data.paymentpaper = 1;
                          }
                        }
                      }

                      if (requirements !== null) {

                        if (requirements.length > 0) {

                          s3data.existingcustomeroffer = 1;
                        }
                      }
                      updatePackageJSON(s3data, true);
                      // put json to s3
                    });
                    var servicePoints = sc.getAllItems();
                    _this.servicePoints = servicePoints;

                    servicePoints.each(function() {

                      updateServicePointJSON({id : $(this).data('id')}, package.get("id"), true);
                    });

                    var closeMaybe = window.setInterval(function() {

                      if (_this.s3.servicePointsUpdated === _this.servicePoints.length &&
                          _this.s3.packageUpdated && _this.s3.packageImageUpdated) {

                        clearInterval(closeMaybe);
                        _this.dialogLock = false;
                        Notification.success({title: tr("packageUpdateSuccess"), message:
                                              tr("packageUpdateSuccessDescription").replace(
                                              "_NAME_", _this.controller.get('name'))});
                        dialog.dialog("close");
                      }
                      else if (_this.s3.error) {

                        _this.dialogLock = false;
                        Notification.error({title: tr("packageUpdateFailed"), message: tr("s3error")});
                      }
                    }, 250);

                  }, function() {
                    _this.dialogLock = false;
                    Notification.error({title: tr("packageAddFailed"), message: tr("unknownError")});
                  });
                } else {
                  _this.dialogLock = false;
                  Notification.error({title: tr("packageAddFailed"), message: tr("packageMissingOffer")});
                }
              } else {
                _this.dialogLock = false;
                Notification.error({title: tr("packageAddFailed"), message: tr("packageOfferPriceInconsistency")});
              }
            } else {
              _this.dialogLock = false;
              Notification.error({title: tr("packageAddFailed"), message: tr("invalidFields")});
            }
          } else {

            // Cannot save a new package, so it's an existing package
            if (typeof _this.controller.get('name') === "string" && _this.controller.get('name') &&
                typeof _this.controller.get('from') !== "undefined" && _this.controller.get('from') &&
                typeof _this.controller.get('to') !== "undefined" && _this.controller.get('to') &&
                typeof _this.controller.get('marketingName') !== "undefined" &&
                _this.controller.get('marketingName') && offers !== null) {
              if (offers !== 0) {
                if (offers instanceof Array && offers.length > 0) {
                  record = _this.controller.get("content");
                  record.save().then(function() {
                    // Update offer, service and requirement in parallel
                    // Because package can exist without them, there is no need to chain them
                    DP.execute({type: "package", method: "createOffers",
                                params: {package: _this.options.id, offers: offers}});

                    var requirements = getRequirements();
                    if (requirements !== null) {
                      DP.execute({type: "package", method: "createRequirements",
                                 params: {package: _this.options.id, requirements: requirements}});
                    }

                    var services = getServices();
                    if (services !== null) {
                      DP.execute({type: "package", method: "createServices",
                                 params: {package: _this.options.id, services: services}});
                    }

                    var giveAways = getGiveAways();
                    if (giveAways !== null) {
                      DP.execute({type: "package", method: "createGiveAways",
                                 params: {package: _this.options.id, giveAways: giveAways}});
                    }

                    $.ajax({
                      type : 'POST',
                      url : util.apiBase+'package.type.get',
                      data : JSON.stringify({package : _this.options.id}),
                      contentType : 'application/json',
                      dataType : 'json'
                    })
                    .done(function(data) {
                      var products = data.products;
                      var s3data = {};

                      // form the s3data for the package
                      s3data.id = _this.options.id;
                      s3data.description = record._data.description;
                      s3data.extradescription = record._data.extradescription;
                      s3data.marketingprice = record._data.marketingPrice;
                      s3data.normalprice = record._data.normalPrice;
                      s3data.marketingsubtext = record._data.marketingSubtext;
                      s3data.marketingname = record._data.marketingName;
                      s3data.name = record._data.name;
                      s3data.from = record._data.from;
                      s3data.to = record._data.to;
                      s3data.existingcustomeroffer = 0;
                      s3data.digi = 0;
                      s3data.print = 0;
                      s3data.paymentcredit = 0;
                      s3data.paymentpaper = 0;
                      s3data.paymentmethodhidden = false;
                      s3data.giveaways = [];
                      s3data.repeating = 0;

                      $.each(offers, function(i,e) {
                        if (e.paymentType !== 'fixed') {
                          s3data.repeating = 1;
                        }

                      });



                      var s3paperPriceSum = $('.paper-offerprice-sum span').html();
                      var s3cardPriceSum = $('.card-offerprice-sum span').html();

                      if (s3paperPriceSum === '0' && s3cardPriceSum === '0') {
                          s3data.paymentmethodhidden = true;
                      }

                      var packageGiveAways = giveAwaysList.getAllItems();

                       if (packageGiveAways.length !== 0) {

                        packageGiveAways.each(function() {

                          var giveAwayPackageID = $(this).data("id");
                          var giveAwayMarketingName = $(this).data("marketingName");
                          var giveAwayDuration = $(this).data("duration");
                          // find offers for giveaways
      
                          s3data.giveaways.push({"id": giveAwayPackageID, "marketingName": giveAwayMarketingName, "duration": giveAwayDuration});
                      
                        });
                       
                      }


                      $.each(products, function(i, e) {

                        if (e.type === 1) {

                            s3data.digi = 1;
                        }
                        else if (e.type === 2) {

                            s3data.print = 1;
                        }
                      });

                      if (offers !== null) {

                        if (offers.length > 0) {

                          if (offers[0].creditPrice !== null) {

                            s3data.paymentcredit = 1;
                          }

                          if (offers[0].paperPrice !== null) {
                            s3data.paymentpaper = 1;
                          }
                        }
                      }

                      if (requirements !== null) {
                        if (requirements.length > 0) {

                          s3data.existingcustomeroffer = 1;
                        }
                      }
                      updatePackageJSON(s3data, true);
                      // put json to s3
                    });
                    var servicePoints = sc.getAllItems();

                    _this.servicePoints = servicePoints;
                    var servicePointsToUpdate = [];

                    if(servicePoints.length !== 0 || _this.s3.old.servicepoints.length !== 0){

                      servicePoints.each(function() {

                        servicePointsToUpdate.push({url : $(this).find("button").attr("title"), id : $(this).data("id"), add : true});
                      });

                      if(_this.s3.old.servicepoints && typeof _this.s3.old.servicepoints != 'undefined'){

                        $.each(_this.s3.old.servicepoints, function(i, e) {

                          var found = false;
                          $.each(servicePointsToUpdate, function(j, sp) {

                            if (sp.id === e.id) {

                              found = true;
                              return false;
                            }
                          });
                          if (!found) {

                            servicePointsToUpdate.push({url : e.url, id : e.id, add : false});
                          }
                        });
                      }                    
                      $.each(servicePointsToUpdate, function(i, e) {

                        updateServicePointJSON({id : e.id}, _this.options.id, e.add); 
                      });
                    }

                    var closeMaybe = window.setInterval(function() {

                      if ( (_this.s3.servicePointsUpdated === _this.servicePoints.length || _this.s3.servicePointsUpdated === _this.s3.old.servicepoints.length) && 
                          _this.s3.packageUpdated && _this.s3.packageImageUpdated) {

                        if (typeof _this.options.update === "function" && _this.options.update) {
                           _this.options.update();
                        }

                        clearInterval(closeMaybe);
                        _this.dialogLock = false;
                        Notification.success({title: tr("packageUpdateSuccess"), message:
                                              tr("packageUpdateSuccessDescription").replace(
                                              "_NAME_", _this.controller.get('name'))});
                        dialog.dialog("close");
                      }
                      else if (_this.s3.error) {

                        _this.dialogLock = false;
                        Notification.error({title: tr("packageUpdateFailed"), message: tr("s3error")});
                      }
                    }, 250);

                  }, function() {
                    _this.dialogLock = false;
                    Notification.error({title: tr("packageUpdateFailed"), message: tr("unknownError")});
                  });
                } else {
                  _this.dialogLock = false;
                  Notification.error({title: tr("packageUpdateFailed"), message: tr("packageMissingOffer")});
                }
              } else {
                _this.dialogLock = false;
                Notification.error({title: tr("packageUpdateFailed"), message: tr("packageOfferPriceInconsistency")});
              }
            } else {
              _this.dialogLock = false;
              Notification.error({title: tr("packageUpdateFailed"), message: tr("invalidFields")});
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
      jRoot.dialog({minWidth: 1200, minHeight: 580,
                    title: typeof _this.newPackage !== "undefined" && _this.newPackage ?
                           tr("newPackage") : tr("package"),
                    buttons: dialogButtons,
                    tabs: [{title: tr("basicInfo"), name:'basicInfo'}, {title: tr("extraInfo"), name:'extraInfo' },
                           {title: tr("packageOffers"), name:'packageOffers'}, {title: tr("salesChannels"), name:'salesChannels'}, 
                           {title: tr("giveAways"), name:'subpackage'}]});
      jRoot.on('dialogclose', function() {
        $(this).find(".custom-popover").popover("hide");

        if (typeof _this.controller.content !== "undefined" && _this.controller.content.get("isDirty")) {
          _this.controller.content.rollback();
        }

        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        jRoot.dialog("destroy");
        _this.destroy();
      });

      function setCreditOfferPeriodCount() {
        var count = _this.controller.get("creditOfferPeriodCount");
        if (count == 1) {
          jRoot.find(".credit-offer-period-text").html("1 kerran ennen hinnastoon siirtymistä");
        } else if (count === 0) {
          jRoot.find(".credit-offer-period-text").html("siirtymättä hinnastoon");
        } else {
          jRoot.find(".credit-offer-period-text").html(count + " kertaa ennen hinnastoon siirtymistä");
        }
      }

      // Remove a package
      if (typeof _this.newPackage === "undefined" || !_this.newPackage) {

        _this.controller.then(function() {

          if (_this.controller.content.get("editable")) {
            jRoot.find(".package-sales-start .input").addClass("mandatory");
            dialogButtons.unshift({
              html: "<i class='fa fa-trash-o'></i> " + tr("remove", "capitalizefirst"),
              "class": "btn btn-danger",
              click: function() {
                if (_this.dialogLock) {
                  return;
                }
                _this.dialogLock = true;
                _this.s3.servicePointsUpdated = 0;
                _this.s3.error = false;
                _this.s3.packageUpdated = false;
                _this.s3.packageImageUpdated = false;

                var dialog = $(this);
                var message = tr("packageDeleteConfirmation").replace("_NAME_", _this.controller.get("name"));
                require("dialogManager").create({type: "ConfirmDialog", id: "confirm",
                  message: message, yes: function() {
                    record = _this.controller.get("content");
                    record.deleteRecord();
                    record.save().then(function() {
                      if (typeof _this.options.update === "function" && _this.options.update) {
                        _this.options.update();
                      }

                      updatePackageJSON({id : record.get("id")}, false);

                      var servicePoints = sc.getAllItems();
                      _this.servicePoints = servicePoints;
                      servicePoints.each(function() {

                        updateServicePointJSON({id : $(this).data('id')}, record.get("id"), false);
                      });

                      updatePackageImage(record.get("id"), false);

                      var closeMaybe = window.setInterval(function() {

                        if (_this.s3.servicePointsUpdated === _this.servicePoints.length &&
                            _this.s3.packageUpdated && _this.s3.packageImageUpdated) {

                          clearInterval(closeMaybe);
                          _this.dialogLock = false;
                          Notification.success({title: tr("packageUpdateSuccess"), message:
                                                tr("packageUpdateSuccessDescription").replace(
                                                "_NAME_", _this.controller.get('name'))});
                          dialog.dialog("close");
                        }
                        else if (_this.s3.error) {

                          _this.dialogLock = false;
                          Notification.error({title: tr("packageUpdateFailed"), message: tr("s3error")});
                        }
                      }, 100);
                    }, function() {
                      _this.dialogLock = false;
                      Notification.error({title: tr("packageDeleteFailed"), message: tr("unknownError")});
                    });
                  }, no: function() {_this.dialogLock = false;}
                });
              }
            });
            jRoot.dialog({buttons: dialogButtons});
          } else {
            jRoot.find(".package-sales-start .input input").attr('disabled', 'disabled');
            jRoot.find(".add-offer, .remove-offer").hide();
            jRoot.find(".billing-period, .offer-periods, .bill-period").removeClass("mandatory")
                      .find("select").attr('disabled', 'disabled');
            rList.disable();
          }

          // Set date and time according to data
          jRoot.find(".package-sales-start input.datepicker").datepicker("setDate",
                     util.parseDate(_this.controller.content.get("from"), "D.M.YYYY"));
          jRoot.find(".package-sales-start input.timepicker").timepicker("setTime",
                     util.parseDate(_this.controller.content.get("from"), "H:mm"));

          jRoot.find(".package-sales-end input.datepicker").datepicker("setDate",
                     util.parseDate(_this.controller.content.get("to"), "D.M.YYYY"));
          jRoot.find(".package-sales-end input.timepicker").timepicker("setTime",
                     util.parseDate(_this.controller.content.get("to"), "H:mm"));

          // Set duration selects according to data
          jRoot.find(".offers-container .billing-period select")
               .val(_this.controller.content.get("creditBillPeriod"));
          // Update all price definition calculation if rendered
          jRoot.find(".price-definition select").trigger("change");
          jRoot.find(".offers-container .offer-periods select")
               .val(_this.controller.content.get("creditOfferPeriodCount"));
          setCreditOfferPeriodCount();
          jRoot.find(".offers-container .bill-period select")
               .val(_this.controller.content.get("paperBillPeriod"));
        });
      } else {
        jRoot.find(".package-sales-time .input").addClass("mandatory");
      }

      // Connect date and time picker to data
      jRoot.find(".package-sales-start input.datepicker, " +
                 ".package-sales-start input.timepicker").change(function() {
        if (typeof _this.controller.set === "function") {
          var date = jRoot.find(".package-sales-start input.datepicker").datepicker("getDate");

          // Limit start date for sales end datepicker
          jRoot.find(".package-sales-end input.datepicker").datepicker("option", "minDate", date);

          if (date) {
            var time = jRoot.find(".package-sales-start input.timepicker").val();

            if (typeof time === "string" && time) {
              time = time.split(":");

              if (time instanceof Array && time.length == 2) {
                date.setHours(time[0]);
                date.setMinutes(time[1]);

                _this.controller.set("from", date);
                return;
              }
            }
          }

          _this.controller.set("from", null);
        }
      });

      jRoot.find(".package-sales-end input.datepicker, " +
                 ".package-sales-end input.timepicker").change(function() {
        if (typeof _this.controller.set === "function") {
          var date = jRoot.find(".package-sales-end input.datepicker").datepicker("getDate");

          if (date) {
            var time = jRoot.find(".package-sales-end input.timepicker").val();

            if (typeof time === "string" && time) {
              time = time.split(":");

              if (time instanceof Array && time.length == 2) {
                date.setHours(time[0]);
                date.setMinutes(time[1]);

                _this.controller.set("to", date);
                return;
              }
            }
          }

          _this.controller.set("to", null);
        }
      });

      // Connect duration select to data
      jRoot.find(".offers-container .billing-period select").change(function() {
        if (typeof _this.controller.set === "function") {
          _this.controller.set("creditBillPeriod", $(this).val());
        }

        // Update all price definition calculation if rendered
        jRoot.find(".price-definition select").trigger("change");
      });
      jRoot.find(".offers-container .offer-periods select").change(function() {
        if (typeof _this.controller.set === "function") {
          _this.controller.set("creditOfferPeriodCount", $(this).val());
        }

        setCreditOfferPeriodCount();
      });
      jRoot.find(".offers-container .bill-period select").change(function() {
        if (typeof _this.controller.set === "function") {
          _this.controller.set("paperBillPeriod", $(this).val());
        }
      });
    }
  });

  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.id !== "undefined") {
      var params = {options: options};

      if (options.id === "new") {
        params.controller = DP.create({type: "package", data: {creditBillPeriod: 1,
                                      creditOfferPeriodCount: 1, paperBillPeriod: 1,
                                      editable: true}});
        params.newPackage = true;
      } else if (options.id === "copy" && typeof options.data !== "undefined" && options.data) {
        options.data.editable = true;
        options.data.from = null;
        options.data.to = null;
        delete options.data.id;

        console.log(options.offers);


        if (typeof options.offers !== "undefined" && options.offers instanceof Array &&
            options.offers.length > 0) {
          params.offers = options.offers;
        }

        if (typeof options.requirements !== "undefined" && options.requirements instanceof Array &&
            options.requirements.length > 0) {
          params.requirements = options.requirements;
        }

        if (typeof options.services !== "undefined" && options.services instanceof Array &&
            options.services.length > 0) {
          params.services = options.services;
        }

        if (typeof options.giveAways !== "undefined" && options.giveAways instanceof Array &&
            options.giveAways.length > 0) {
          params.giveAways = options.giveAways;
        }

        if (typeof options.returnPages !== "undefined" && options.returnPages) {
          params.returnPages = options.returnPages;
        }

        params.controller = DP.create({type: "package", data: options.data});
        params.newPackage = true;
      } else {
        params.controller = DP.find({type: "package", id: options.id, reload: true});
        params.offers = DP.execute({type: "package", method: "findOffers",
                                   params: {package: options.id}});
        params.requirements = DP.execute({type: "package", method: "findRequirements",
                                         params: {package: options.id}});
        params.services = DP.execute({type: "package", method: "findServices",
                                     params: {package: options.id}});
        params.returnPages = DP.execute({type: "package", method: "findReturnPages",
                                        params: {package: options.id}});
        params.giveAways = DP.execute({type:"package", method: "findGiveAways",
                                        params: {package: options.id}});
      }

      var packageDialog = PackageDialog.create(params);

      packageDialog.appendTo($("body"));

      return packageDialog;
    }
  };
});
