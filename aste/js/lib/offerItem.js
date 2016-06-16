define(['jquery', 'jqueryui', 'translate', 'viivaUtility', 'viivaFormElements', 'smartAdmin'],
       function($, jui, tr, util, ViivaFormElements) {
  var html = "<li class='dd-item offer-item' ><div class='dd-handle smart-form'>" +
               "<div class='type select'><select>" +
                 "<option value='0'>" + tr("durationOfferRow", "capitalizefirst") + "</option>" +
                 "<option value='1'>" + tr("endDateOfferRow", "capitalizefirst" ) + "</option>" +
                 "<option value='2'>" + tr("repeatOfferRow", "capitalizefirst") + "</option>" +
                 "<option value='3'>" + tr("repeatOfferRowDefined", "capitalizefirst") + "</option>" +
               "</select><i></i></div>" +
               "<div class='end-time'>" +
                 "<div class='input'><input type='text' placeholder='" + tr("months") + "'></div>" +
               "</div>" +
               "<div class='end-date'>" +
                 "<div class='input'>" +
                 "<input class='datepicker' placeholder='" + tr("offerPeriodTill", "capitalizefirst") + "'>" +
                 "<i class='fa fa-calendar icon-append'></i>" +
                 "</div>" +
               "</div>" +
               "<div class='price'>" +
                 "<div class='input'><input placeholder='" + tr("offerPrice", "capitalizefirst")  + "' type='text'></div>" +
               "</div>" +
               "<div class='price-definition select'><select>" +
                 "<option value='0'>Normaali</option>" +
                 "<option value='1'>Tilaajille</option>" +
               "</select><i></i></div>" +
             "</div></li>";

  return function() {
    this.create = function(options) {
      var item = $(html);

      if (typeof pageSetUp == "function") {
        pageSetUp(item);
      }

      item.find(".type select").change(function() {
        switch (parseInt($(this).val())) {
          case 0:
            item.find('.end-date').hide();
            item.find('.price-definition').hide();
            item.find('.price').css({display: "inline-block"});
            item.find('.end-time').css({display: "inline-block"});
            break;
          case 1:
            item.find('.end-time').hide();
            item.find('.price-definition').hide();
            item.find('.price').css({display: "inline-block"});
            item.find('.end-date').css({display: "inline-block"});
            break;
          case 2:
            item.find('.end-date').hide();
            item.find('.price-definition').hide();
            item.find('.price').css({display: "inline-block"});
            item.find('.end-time').css({display: "inline-block"});
            break;
          case 3:
            item.find('.end-date').hide();
            item.find('.price').hide();
            item.find('.end-time').css({display: "inline-block"});
            item.find('.price-definition').css({display: "inline-block"});
            break;
        }
      }).trigger("change");

      item.find("select, input").click(function(e) {
        e.stopPropagation();
      });

      return item;
    };
  };
});
