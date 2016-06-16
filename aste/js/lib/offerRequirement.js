define(['jquery', 'jqueryui', 'translate', 'viivaUtility', 'viivaFormElements', 'smartAdmin'],
       function($, jui, tr, util, ViivaFormElements) {
  var html = "<li class='dd-item offer-requirement' ><div class='dd-handle smart-form'>" +
               "<div class='product select'><select>" +
                 "<option value='AL'>AL</option>" +
                 "<option value='AN'>AN</option>" +
                 "<option value='DE'>DE</option>" +
                 "<option value='DP'>DP</option>" +
                 "<option value='ER'>ER</option>" +
                 "<option value='HY'>HY</option>" +
                 "<option value='KA'>KA</option>" +
                 "<option value='KI'>KI</option>" +
                 "<option value='KL'>KL</option>" +
                 "<option value='KO'>KO</option>" +
                 "<option value='KP'>KP</option>" +
                 "<option value='KU'>KU</option>" +
                 "<option value='MK'>MK</option>" +
                 "<option value='ML'>ML</option>" +
                 "<option value='NK'>NK</option>" +
                 "<option value='PA'>PA</option>" +
                 "<option value='RM'>RM</option>" +
                 "<option value='SE'>SE</option>" +
                 "<option value='SK'>SK</option>" +
                 "<option value='SR'>SR</option>" +
                 "<option value='TJ'>TJ</option>" +
                 "<option value='TM'>TM</option>" +
                 "<option value='TV'>TV</option>" +
                 "<option value='VA'>VA</option>" +
                 "<option value='VE'>VE</option>" +
                 "<option value='VM'>VM</option>" +
                 "<option value='VV'>VV</option>" +
                 "<option value='I1'>I1</option>" +
                 "<option value='I2'>I2</option>" +
                 "<option value='I3'>I3</option>" +
                 "<option value='I4'>I4</option>" +
                 "<option value='I5'>I5</option>" +
                 "<option value='I6'>I6</option>" +
                 "<option value='I7'>I7</option>" +
                 "<option value='I8'>I8</option>" +
                 "<option value='I9'>I9</option>" +
                 "<option value='IA'>IA</option>" +
                 "<option value='IB'>IB</option>" +
                 "<option value='IC'>IC</option>" +
                 "<option value='ID'>ID</option>" +
                 "<option value='IE'>IE</option>" +
               "</select><i></i></div>" +
               "<div class='product-type'>" +
                 "<select multiple class='select2' data-no-match='" +
                   tr("lekaRequirementAllAccepted", "capitalizefirst") + "'>" +
                   "<option value='K' selected='selected'>Kesto</option>" +
                   "<option value='M'>Määrä</option>" +
                 "</select>" +
               "</div>" +
             "</div></li>";

  return function() {
    this.create = function(options) {
      var item = $(html);

      if (typeof pageSetUp == "function") {
        pageSetUp(item);
      }

      item.find("select").click(function(e) {
        e.stopPropagation();
      });

      if (typeof options !== "undefined" && options) {
        if (typeof options.code !== "undefined" && options.code) {
          item.find(".product select").val(options.code);
        }

        if (typeof options.type !== "undefined" && options.type &&
            typeof options.type.types !== "undefined" &&
            options.type.types instanceof Array) {
          item.find(".select2").select2('val', options.type.types);
        }
      }

      return item;
    };
  };
});
