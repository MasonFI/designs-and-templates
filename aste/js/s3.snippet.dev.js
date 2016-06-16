function makeXDR(params) {
  if (typeof params === "undefined") return false;
  if (typeof params.tries === "undefined") params.tries = 1;
  var xdr = new XDomainRequest();
  xdr.open("GET", params.url);
  xdr.onload = params.onload;
  xdr.timeout = 30000;
  xdr.ontimeout = function() { params.tries++; makeXDR(params); };
  xdr.onerror = function () { params.tries++;params.tries++;params.tries++;params.tries++;params.tries++;params.tries++;params.tries++;params.tries++;params.tries++;params.tries++; makeXDR(params); };
  xdr.onprogress = function () {  };
  xdr.onreadystatechange = function() { };

  setTimeout(function () {
      xdr.send();
  }, 200);  

}

function initLandingPage() {
  // FIXME - remove devsuffix in livesnippet
  $.ajax({
    'type' : 'GET',
    'url' : 'https://otavamedia-mydigi.s3-eu-west-1.amazonaws.com/service.status',
    'dataType' : 'json'
  })
  .always(function(response) {
    if (typeof response !== "undefined" && response.status >= 2) {
      var time = Math.round(new Date()/1000);
      
      if( response.statusTimeStart && response.statusTimeEnd ){
        if( response.statusTimeStart < time && response.statusTimeEnd > time )
          showMaintenanceMode(response);
        else {
          makeLandingPage();
        }
      } else {
        makeLandingPage();
      }
    } else {
      makeLandingPage();
    }
  });
}

function makeLandingPage() {
  var settings = {
    bucketURL : '//otavamedia-mydigi.s3.amazonaws.com/',
    snippet : $('#s3-snippet'),
    s3key : null,
    devSuffix : '',
    packagesFetched : 0
  };
  
  // add viewport meta if doesnt exist
  var viewport = document.querySelector('meta[name=viewport]');
  var viewportContent = 'width=device-width, initial-scale=1.0';
  
  if (viewport === null) {
    var head = document.getElementsByTagName('head')[0];
    viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    head.appendChild(viewport);
  }
  
  viewport.setAttribute('content', viewportContent);
  if (typeof s3snippettarget != 'undefined') {
    settings.container = $('#' + s3snippettarget);
  } else {
    settings.container = settings.snippet.parent();
  }
  
  if (typeof s3key !== 'undefined') {
    settings.s3key = s3key;
  } else if (typeof settings.snippet.attr("data-s3key") !== 'undefined') {
    settings.s3key = settings.snippet.attr("data-s3key");
  }
  
  if (typeof s3dev !== 'undefined' || !!settings.snippet.attr("data-s3dev")) {
    settings.devSuffix = '.dev';
  }
  
  var date = new Date();
  var s3time = date.getTime();
  var refreshSuffix="?refresh="+s3time;
  
  if (window.XDomainRequest) {
    makeXDR({url: settings.bucketURL + settings.s3key + '.settings' + settings.devSuffix + refreshSuffix, onload: function() { gotSpotSettings(JSON.parse(this.responseText)); } });
  } else {
    $.ajax({
      'type' : 'GET',
      'url' : settings.bucketURL + settings.s3key + '.settings' + settings.devSuffix + refreshSuffix ,
      'dataType' : 'json'
    }).done(function(response) {
      gotSpotSettings(response);
    });
  }
  
  function gotSpotSettings(response) {
    settings.formData = response;
    settings.formData.packageData = [];
    if (typeof s3dev !== 'undefined') {
    }
    if (typeof response.packages.ids !== 'undefined') {
      $.each(response.packages.ids, function(i, e) {
        fetchPackageData(e, settings);  
      });
    } else {      
    }
  }
}

function fetchPackageData(p, settings) {
  var date = new Date();
  var s3time = date.getTime();
  refreshSuffix="?refresh="+s3time;
  
  if (p.id === 'continualBox') {
    var response = {
      description: p.continualBoxDescription,
      digi: 1,
      existingcustomeroffer: 0,
      from: "2014-10-09T21:00:00.000Z",
      id: "continualBox",
      headerfontsize: p.continualBoxHeaderFontSize,
      buttontext: p.continualBoxButtonText,
      marketingname: p.continualBoxMarketingname,
      marketingprice: p.continualBoxPrice,
      marketingsubtext: null,
      name: p.continualBoxMarketingname,
      normalprice: null,
      paymentcredit: 0,
      paymentmethodhidden: true,
      continualBoxCode: p.continualBoxLinkCode,
      paymentpaper: 1,
      print: 1,
      to: "2014-11-07T22:00:00.000Z"
    }
    gotPackageSettings(response);
  } else {
    if (window.XDomainRequest) {
      makeXDR({url: settings.bucketURL + p.id + '.settings' + settings.devSuffix + refreshSuffix, onload: function() { gotPackageSettings(JSON.parse(this.responseText)); } });
    } else {
      $.ajax({
        'type' : 'GET',
        'url' : settings.bucketURL + p.id + '.settings' + settings.devSuffix + refreshSuffix ,
        'dataType' : 'json',
        'success' : function(response) {
          gotPackageSettings(response);
        }
      });
    }
  }
  
  function gotPackageSettings(response) {
    settings.packagesFetched++;
    var now = new Date();
    
    if ((new Date(response.from)) <= now && (new Date(response.to)) >= now) {
      settings.formData.packageData.push($.extend({}, p, response));
    } else if (response.id==='continualBox') {
      settings.formData.packageData.push($.extend({}, p, response));
    }

    if (settings.packagesFetched === settings.formData.packages.ids.length) {
      buildForm(settings);
    }
  }
}

function showMaintenanceMode(response){

    if (typeof response !== "undefined" ) {
        var container = $('#s3_tilaa_form');
        var maintenanceModeMsg = $('<div>').attr("id", "s3_maintenance_mode").css('padding', '2rem 1rem').append('<p>Teemme huoltotöitä verkkopalvelussa – yritä myöhemmin uudelleen. Pahoittelemme häiriötä.</p>'+
                                    '<p>Ystävällisin terveisin,</p>'+
                                    '<p> Otavamedia<br>'+
                                    'Asiakaspalvelu<br>'+
                                    'digi@otavamedia.fi</p>');
        container.prepend(maintenanceModeMsg);
    }
}

function buildForm(settings){
  var date = new Date();
  var s3time = date.getTime();
  refreshSuffix="?refresh="+s3time;
  
  var fd = settings.formData;
  var wrap = $('<div/>').attr("id", "s3_generated_wrap");
  var form = $('<form/>');
  var formWrap = $('<div/>').attr("id", "s3_generated_form").append(form);
  
  var headerbgimage = "";
  if (typeof fd.headerbgimage != 'undefined') {
    var headerimageclass = '';
    if (!!fd.headertext) {
      if ($.trim($('<div/>').html(fd.headertext).text()) === "") {
        headerimageclass = 'full';
      } else {
        headerimageclass = 'half';
      }
    }
    headerbgimage = '<img class="'+headerimageclass+'" src="'+settings.bucketURL+fd.headerbgimage+refreshSuffix+ '" id="s3_generated_form_header_image" />';
  }
  
  var brandlogoimage = '';
  if (!!fd.brandlogoimage) {
    brandlogoimage = '<div id="s3_generated_brand_logo"><img src="'+settings.bucketURL+fd.brandlogoimage+refreshSuffix + '" id="s3_generated_brand_logo_image" /></div>';
  }
  
  var footerimage = '';
  
  if(!!fd.footerimage) {
    footerimage = '<img class="s3_footer_image" src="'+settings.bucketURL+fd.footerimage+refreshSuffix + '"/>';
  }
  
  var headertext = '';
  if (!!fd.headertext) {
    if ($.trim($('<div/>').html(fd.headertext).text()) !== "") {
      headertext =    '<div id="s3_generated_form_header_inner"><div id="s3_generated_form_header_text">'+
      brandlogoimage+
      fd.headertext+
      '</div></div>';
    } else if (brandlogoimage !== "") {
      headertext =    '<div id="s3_generated_form_header_inner"><div id="s3_generated_form_header_text">'+
      brandlogoimage+
      '</div></div>';
    }
  } else if (brandlogoimage !== "") {
    headertext =    '<div id="s3_generated_form_header_inner"><div id="s3_generated_form_header_text">'+
    brandlogoimage+
    '</div></div>';
  }
  
  var formHeader = $('<div/>').attr("id", "s3_generated_form_header").html(
    headertext+
    headerbgimage+
    '<div style="clear: both;"></div>'
  );
  
  var formBody = $('<div/>').attr("id", "s3_generated_form_body");
  
  Array.prototype.sortByProp = function(p) {
    return this.sort(function(a,b) {
      return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    });
  }
  
  fd.packageData.sortByProp('position');
  
  for (var i = 0; i < fd.packageData.length; i++) {
    var p = fd.packageData[i];
    createPackage(p, formBody);
  }
  
  function createPackage(p, container) {
    var packageType = '';
      if (p.digi) {
        packageType += '<span>Digi</span>';
      }
      
      if (p.print) {
        if (p.digi) {
          packageType += ' + ';
        }
        packageType += '<span>lehti</span>';
      }
      
      if (!!p.componentsalttext) {
        if ($.trim(p.componentsalttext) !== "") {
          packageType = p.componentsalttext;
        }
      }
     
      var packagePrice = "";
      var normalPrice = "";
      if (typeof p.marketingprice !== 'undefined' && p.marketingprice !== null) {
        if(p.marketingprice.length>0) {
          var packagePriceValue="";
          var packagePriceUnitPerTime="";
          if (p.marketingprice.indexOf('€') !== -1) {
            packagePriceValue = p.marketingprice.substr(0, p.marketingprice.indexOf('€'));
            packagePriceUnitPerTime = p.marketingprice.substr(p.marketingprice.indexOf('€'), p.marketingprice.length);
          }  
         
          var packagePriceUnitPerTimeParts = packagePriceUnitPerTime.split("/");
          var packagePriceUnit = packagePriceUnitPerTimeParts[0];
          var packagePriceTime = typeof packagePriceUnitPerTimeParts[1] !== 'undefined' ? '/' + packagePriceUnitPerTimeParts[1] : '';
          packagePrice = '<p class="s3_package_price"><span class="s3_package_price_value">'+packagePriceValue+' <span class="s3_package_price_currency">'+packagePriceUnit+'</span></span>'+packagePriceTime+'</p>';
        }
      }
  
      if (typeof p.normalprice !== 'undefined' && p.normalprice !== null) {
        if(p.normalprice.length>0) {
          var normalPriceValue="";
                
          var normalPriceUnitPerTime="";
          if (p.normalprice.indexOf('€') !== -1) {
            normalPriceValue = p.normalprice.substr(0, p.normalprice.indexOf('€'));
            normalPriceUnitPerTime = p.normalprice.substr(p.normalprice.indexOf('€'), p.normalprice.length);
          }
           
          var normalPriceUnitPerTimeParts = normalPriceUnitPerTime.split("/");
          var normalPriceUnit = normalPriceUnitPerTimeParts[0];
          var normalPriceTime = typeof normalPriceUnitPerTimeParts[1] !== 'undefined' ? '/' + normalPriceUnitPerTimeParts[1] : '';

          normalPrice = '<p><span class="s3_normal_price_value">'+normalPriceValue+' <span class="s3_package_price_currency">'+normalPriceUnit+'</span></span>'+normalPriceTime+'</p>';
        }        
      }
  
      var packageDescription = "";
  
      if (typeof p.description === "undefined" || p.description === null) {
        p.description = "";
      }
      
      if (typeof p.marketingsubtext === "undefined" || p.marketingsubtext === null) {
        p.marketingsubtext = "";
      }
      if (typeof p.extradescription === "undefined" || p.extradescription === null) {
        p.extradescription = "";
      }
      if (p.extradescription.length > 0) {
        p.description = '<b>'+p.description+'</b>';
        p.extradescription = '<p>'+p.extradescription+'</p>';
      }
      packageDescription = '<p>' + p.description + '</p>' + p.extradescription;
  
      if (!!p.altdescription) {
        if ($.trim($('<div/>').html(p.altdescription).text()) !== "") {
          packageDescription = p.altdescription;
        }
      }
  
      var packageHeader = "";
      
      if (!!p.headerfontsize) {
        packageHeader += '<span style="font-size: ' + p.headerfontsize + ';">';
      }
      if (!!p.headeralttext) {
        if ($.trim(p.headeralttext) !== "") {
          packageHeader += p.headeralttext;
        } else {
          packageHeader += p.marketingname;
        }
      } else {
        packageHeader += p.marketingname;
      }
  
      if (!!p.headerfontsize) {
        packageHeader += '</span>';
      }
      
      var packageButtonText = "Valitse";
      if (!!p.buttontext) {
        if (p.buttontext !== "") {
          packageButtonText = p.buttontext;
        }
      }
  
      var packageBody = $('<div/>').attr("data-package", i).attr('data-id', p.id).addClass("s3_package").html(
        '<div class="s3_package_inner">'+
          '<div class="s3_package_info">'+
            '<div class="s3_package_info_header">'+packageHeader+'</div>'+
            '<div class="s3_package_info_cover"></div>'+
            '<div class="s3_package_info_description">'+
              packageDescription+
            '</div>'+
            '<div class="s3_package_order">'+
              '<span>'+packagePrice+'</span>'+
              '<span>'+normalPrice+'</span>'+
              '<div class="s3_order_button">'+packageButtonText+'</div>'+
            '</div>'+
          '</div>'+
        '</div>'
      );
      
      if (!p.componentshidden ) {
        if (p.id !== "continualBox") {
          if (!!p.componentsbeforeimage) {
            packageBody.find('.s3_package_info_cover').before('<div class="s3_package_info_offerings">'+packageType+'</div>');
          } else {
            packageBody.find('.s3_package_info_cover').after('<div class="s3_package_info_offerings">'+packageType+'</div>');
          }
        }
      }
  
      if(typeof p.orderLengthSelect !== 'undefined' && p.orderLengthSelect.length > 0){
        packageBody.find('div').first().append(p.orderLengthSelect);
      }
  
      fetchPackageImage(p, settings.devSuffix);
          
      container.append(packageBody);
  }
  
  if (fd.packageData.length === 0) {
    formBody.append($('<p/>').html('Valitettavasti yhtään tarjousta ei ole tällä hetkellä saatavilla.'));
  }
  
  // check that package is not continual box to avoid trap
  if (fd.packageData.length === 1 &&  fd.packageData[0].id !== "continualBox") {
    $( ".s3_package_inner" ).on( "click", function() {
    });
  
    $( ".s3_package_inner" ).trigger( "click" );
  }
  
  var upperCode = $('<div/>').addClass("s3_generated_custom_code_top");
  if (!!fd.uppercode) {
    upperCode.html(
      fd.uppercode.replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
    );
  }
  
  var lowerCode = $('<div/>').addClass("s3_generated_custom_code_bottom");
  if (!!fd.lowercode) {
    lowerCode.html(
      fd.lowercode.replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
    );
  }
  
  var continualBoxScript = $('<div/>').addClass("s3_generated_continualbox_code");
  if (!!fd.continualBoxCode) {
    var codeStart = "<script>function s3BoxClickAction() {";
    var codeMiddle = fd.continualBoxCode.replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    var codeEnd = "}</script>";
    continualBoxScript.append(codeStart+codeMiddle+codeEnd);
  }
  
  packageWidth = "100%";
  if (fd.packageData.length > 2) {
    packageWidth = "30%";
  } else if (fd.packageData.length > 1) {
    packageWidth = "47%";
  }
  
  var packageAlign = 'center';
    
  if(fd.packageData.length == 1 && fd.packageData[0].id !== "continualBox") {
    packageAlign = 'left';
    $('.s3_footer').css('display', 'block');
  }
  
  var snippet_styles = $('<style/>').html(
    '#s3_generated_wrap {'+
    'background-color: ' + fd.backgroundcolor + ';'+
    '}'+
    '#s3_generated_form_header {'+
    'color: ' + fd.textcolor + ';'+
    'margin: 0 0 20px;'+
    'padding: 0;'+
    'font-weight: 200;'+
    'position: relative;'+
    'text-align: left;'+
    'background-color: ' + fd.headerbackgroundcolor + ';'+
    '}'+
    '#s3_generated_form_header_inner {'+
    'width: 50%;'+
    'min-width: 250px;'+
    'display: block;'+
    'float: left;'+
    'position: relative;'+
    'line-height: 100%'+
    '}'+
    '#s3_generated_form_header_text {'+
    'width: 100%;'+
    'display: inline-block;'+
    'vertical-align: ' + fd.headertextverticalalignment + ';'+
    'line-height: 1;'+
    '}'+
    '#s3_generated_form_header_image {'+
    'display: block;'+
    'max-width: 50%;'+
    'min-width: 250px;'+
    'height: auto;'+
    'vertical-align: top;'+
    'margin-left: 50%'+
    '}'+
    '.full {'+
    'max-width: 100%;'+
    'margin: 0 auto;'+
    '}'+
    '#s3_generated_form_header_image.full {'+
    'max-width: 100%;'+
    'margin: 0 auto;'+
    '}'+
    '#s3_generated_form_header_image.half {'+
    'max-width: 50%;'+
    'float: right;'+
    '}'+
    '#s3_generated_brand_logo {'+
    'text-align: '+fd.brandlogoimagealignment+';'+
    '}'+
    '#s3_generated_brand_logo_image {'+
    'display: none;'+
    'max-width: 100%;'+
    '}'+
    '#s3_generated_form_body {'+
    'text-align:'+packageAlign+';'+
    '}'+
    '.s3_package {'+
    'display: inline-block;'+
    'vertical-align: top;'+
    'width: ' + packageWidth + ';'+
    'text-align: left;'+
    'margin: 10px 6px!important;'+
    'color: ' + fd.textcolor + ';'+
    'min-width: 250px;'+
    'max-width: 310px;'+
    '}'+
    '.s3_package.faded {'+
    'opacity: 0.50;'+
    '}'+
    '.s3_package_info {'+
    'border: 0px!important;'+
    'padding: 0 0 10px!important;'+
    '}'+
    '.s3_package_info_cover {'+
    'text-align: center;'+
    '}'+
    '.s3_package_info_cover > img {'+
    'max-width: 100%;'+
    'margin-bottom: 10px auto;'+
    '}'+
    '.s3_package_info_offerings {'+
    'text-align: center;'+
    'height: 20px;'+
    '}'+
    '.s3_package_info_offerings span {'+
    'padding: 5px;'+
    'font-size: 15px;'+
    'margin: 0 0px 5px;'+
    'text-transform: uppercase;'+
    'font-weight: bold;'+
    'color: #000;'+
    'text-align: left;'+
    'background-color: white;'+
    'margin-bottom: 5px;'+
    'margin-top: 0;'+
    'padding-top: 0;'+
    '}'+
    '.s3_package_info_description {'+
    'min-height: 10px!important;'+
    '}'+
    '.s3_text_12 {'+
    'font-size: 12px !important'+
    '}'+
    '.s3_text_13 {'+
    'font-size: 13px !important;'+
    'padding: 8px 0;'+
    'margin: 4px 0px 4px 0px;'+
    '}'+
    '.s3_package_info_description p {'+
    'padding: 10px!important;'+
    'font-size: 14px;'+
    '}'+
    '.s3_package_info_description p:first-child {'+
    'padding-top: 20px;'+
    '}'+
    '.s3_package_order {'+
    'text-align: center;'+
    'position: absolute;'+
    'bottom: 0;'+
    'width: 100%;'+
    '}'+
    '.s3_package_order span {'+
    'font-size: 21px;'+
    'margin-top: 5px;'+
    '}'+
    '.s3_password_forgotten_field {'+
    'height: 25px;'+
    'padding: 3px;'+
    'background-color: #ddd !important;'+
    'margin-top: 2px;'+
    'margin-bottom: 0px;'+
    '}'+
    '.login-toptip{'+
    'margin: 8px 0;'+
    '}'+
    '.s3_package_price {'+
    'margin: 0;'+
    '}'+
    '.s3_package_price_value {'+
    'color: ' + fd.highlightcolor + ';'+
    'font-family: franklin-gothic-urw;'+
    'font-size: 30px;'+
    'line-height: 25px;'+
    '}'+
    '.s3_normal_price_value {'+
    'color: ' + fd.textcolor + ';'+
    'font-family: franklin-gothic-urw;'+
    'font-size: 15px !important;'+
    'line-height: 25px;'+
    '}'+
    '.s3_package_order .s3_package_price_currency {'+
    'font-size: 15px;'+
    '}'+
    '.s3_order_button, .s3_existing_customer_button {'+
    'background: ' + fd.highlightcolor + ';'+
    'cursor: pointer;'+
    'display: inline-block;'+
    'font-size: 17px;'+
    'border-radius: 5px;'+
    'padding: 5px 20px!important;'+
    'color: #fff;'+
    'margin-bottom: 10px!important;'+
    'box-shadow: none;'+
    '}'+
    '.s3_marketing_subtext {'+
    'margin-right: 1%;'+
    'padding: 5px 0;'+
    '}'+
    '.s3_marketing_subtext p {'+
    'text-align: left;'+
    'margin: 0;'+
    'margin-top: 10px!important;'+
    'font-size: 12px;'+
    'color: #555;'+
    'line-height: 14px;'+
    '}'+
    '#s3_generated_form {'+ // UUDET
    'font-size: 0.85em;'+ 
    '}'+
    '#s3_order_info {'+
    'max-width: 90%;'+
    'margin: 0 auto;'+
    'text-align: left;'+
    '}'+
    '#s3_generated_form h2 {'+
    'margin: 20px 0 15px;'+
    'font-size: 20px;'+
    'clear: both;'+
    'color: #555;'+
    'text-transform: none;'+
    '}'+
    '#s3_generated_form input[type="radio"] {'+
    '-webkit-appearance: radio;'+
    'margin-left: 2px;'+
    'margin-right: 5px;'+
    'margin-bottom: 5px;'+
    '}'+
    '#s3_gift_order_customer_info{'+
    'display: none;'+
    '}'+
    '#customGreetingForGiftRecipient{'+
    'display: none;'+
    '}'+
    '.s3_submit_button_sending {'+
    'background: url("http://digi-dev.anna.fi/wp-content/themes/asteikko-theme/images/core/loader-fff.gif") no-repeat 24% !important;'+
    '}'+
    '#s3_generated_form input[type="text"], #s3_generated_form input[type="password"], #s3_generated_form input[type="tel"]{'+
    'border: 0;'+
    'height: 25px;'+
    'padding: 3px;'+
    'background-color: #ddd;'+
    'width: 100%;'+
    'font-style: italic;'+
    'margin-bottom: 0px;'+
    '}'+
    '#s3_generated_form input[type="checkbox"] {'+
    '-webkit-appearance: checkbox;'+
    'margin-right: 5px;'+
    'margin-left: 2px;'+
    'margin-bottom: 5px;'+
    '}'+
    '#s3_generated_form input[type="submit"] {'+
    'background: ' + fd.highlightcolor + ';'+
    'float: left;'+
    'padding: 5px;'+
    'width: 300px;'+
    'height: 45px;'+
    'font-size: 25px;'+
    'letter-spacing: 1px;'+
    'font-weight: bold;'+
    'cursor: pointer;'+
    'color: white;'+
    '}'+
    '.s3_mobile_order_button {'+
    'background: ' + fd.highlightcolor + ';'+
    'float: left;'+
    'padding: 5px;'+
    'width: 95%;'+
    'height: 45px;'+
    'font-size: 25px;'+
    'letter-spacing: 1px;'+
    'font-weight: bold;'+
    'cursor: pointer;'+
    'color: white;'+
    '}'+
    '#s3_generated_form input.threequarters {'+
    'width: 90%;'+
    '}'+
    '#s3_generated_form input.half {'+
    'width: 50%;'+
    '}'+
    '#s3_generated_form input.quarter {'+
    'width: 25%;'+
    '}'+
    '#s3_generated_form select {'+
    'border: 1px solid #ddd;'+
    'width: 66%;'+
    '-webkit-appearance: menulist;'+
    'margin-top: 5px;'+
    '}'+
    '.s3_accept_conditions{'+
    'font-family: inherit;'+
    'font-weight: initial;'+
    'font-size: 14px;'+
    'line-height: initial;'+
    '}'+
    '#s3_generated_form label {'+
    'cursor: pointer;'+
    'font-size: 14px;'+
    'margin-bottom: 5px;'+
    'line-height: 25px;'+
    'display: inline;'+
    '}'+
    '#s3_generated_form label.group {'+
    'display: inline-block;'+
    'min-width: 45%;'+
    '}'+
    '#s3_generated_form .label-info {'+
    'font-size: 0.85em;'+
    'margin-bottom: 4px;'+
    '}'+
    '#s3_generated_form .password-reset-alert {'+
    'display: none;'+
    'font-weight: 700;'+
    'padding: 8px;'+
    'border: 1px solid red;'+
    '}'+
    '.s3_order_form_marketing_subtext {'+
    'font-size: 14px;'+
    'font-style: italic;'+
    'color: #777;'+
    '}'+
    '.s3_payex_link {'+
    'float: left;'+
    'clear: both;'+
    'padding: 20px 0 0 0;'+
    'font-size: 12px !important;'+
    'color: #666;'+
    'line-height: 25px !important;'+
    '}'+
    '.s3_payex_logo {'+
    'float: left;'+
    'height: 25px !important;'+
    'width: auto !important;'+
    'margin: 0 20px 10px 0 !important;'+
    '}'+
    '.s3_package .s3_package_inner {'+
    'cursor: pointer;'+
    'background-color: ' + fd.packages.styles.backgroundcolor + ';'+
    'border: 1px solid ' + fd.packages.styles.bordercolor + '!important;'+
    'position: relative;'+
    '}'+
    '.s3_package .s3_package_info_header {'+
    'font-size: 17px;'+
    'text-align: center;'+
    'vertical-align: middle;'+
    'color: #fff;'+
    'background-color: ' + fd.packages.styles.headercolor + ';'+
    'min-height: 40px;'+
    'line-height: 20px;'+
    'padding: 15px 0 10px'+
    '}'+
    '#s3_tilaa_form fieldset{'+
    'border: none;'+
    'padding: 0;'+
    '}'+
    '#s3_password_help_text {'+
    'display: none;'+
    '}'+

    // page background color
    fd.pagebackgroundselector+'{'+
    'background-color: ' + fd.pagebackgroundcolor + ' !important;'+
    '}'+

    // 'footer' block settings
    '.s3_footer{'+
    'background-color: ' + fd.footerbackgroundcolor + ';'+
    'color: ' + fd.footertextcolor + ';' +
    'position: relative;'+
    'text-align: left;'+
    'padding: 5px 5px 5px;'+
    'margin-bottom: 10px;'+
    '}'+

    '.s3_footer h5{'+
    'font-size: 18px;'+
    '}'+

    '.s3_footer_text{'+
    'padding: 2em;'+
    '}'+

     '.s3_small_field {'+
    'width: 41% !important; '+
    '}'+

    '.s3_footer_image{'+
    'max-width: 300px !important;'+
    'position: absolute !important;'+
    'display: inline-block !important;'+
    'right: 30px !important;'+
    'bottom: 0px !important;'+
    'margin: 0px 0px 0px 0px !important;'+
    '}'+
    '#s3_btn_forgotpass{'+
    'cursor:pointer;'+
    '}'+
    '.s3_usage_terms-wrapper{'+
    'cursor: pointer;'+
    'display: none;'+
    '}'+
    '.s3_package_left {'+
    'float: left;'+
    'width: 33%;'+
    '}'+
    '.s3_package_small_top{'+
    'margin-top: 10px !important;'+
    '}'+
    '.s3_package_right {'+
    'float:right;'+
    'width: 60%;'+
    '}'+
    '.s3_footer_link{'+
    'text-decoration: none'+
    '}'+
    '#s3_no_password {'+
    'display: none;'+
    '}'+
    '#s3_has_password {'+
    'display: none;'+
    '}'+
    '#mobihead{'+
    'display: none;'+
    '}'+
    '.s3-clear{'+
    'clear: both;'+
    '}'+
    '.s3_existing_customer_fields{'+
    'display:none;'+
    '}'+
    '#s3_existing_customer{'+
    'display:none;'+
    'margin: 0 auto;'+
    'max-width: 90%;'+
    '}'
  );
  
  var snippet_mobile_styles = $('<style/>').html('@media screen and (max-width: 768px){'+
    '#mobihead{'+
    'display: block;'+
    'text-align: center;'+
    'margin: 0 auto;'+
    'max-width: 300px;'+
    '}'+
    '#s3_generated_form_body{'+
    'text-align: center !important;'+
    '}'+
    '.s3_footer_image{'+
    'display:block !important;'+
    'position:relative !important;'+
    'bottom: -37px !important;'+
    'left:10px !important;'+
    '}'+
    '#s3_generated_form label.group {'+
    'display: inline;'+
    '}'+
    '#s3_generated_form_header_image {'+
    'display: none;'+
    '}'+
    '#s3_generated_form input[type="submit"]{'+
    'width: 95%;'+
    '}'+
    '.s3_package_right {'+
    'float:none;'+
    'clear: both !important;'+
    'width: auto !important;'+
    '}'+
    '.s3_package_left {'+
    'width: 100% !important;'+
    '}'+
    '.s3_package{'+
    'height: auto !important;'+
    'width: auto !important;'+
    '}'+
    '#s3_existing_customer{'+
    'display: block;'+
    '}'+
    '.s3_small_field{'+
    'width: 90% !important;'+
    '}'+
    '.s3_package_order{'+
    'position: relative;'+
    '}'+
    '.s3_package_inner{'+
    'height: auto !important;'+
    '}'+
    '}'
  );
  
  function checkFooterMargin() {
    // set footer top margin according to used image size
    var footerTopMargin = ($('.s3_footer_image').height() - $('.s3_footer').outerHeight());

    footerTopMargin = footerTopMargin + $('.s3_marketing_subtext p').last().height();

    if(footerTopMargin > 0){
      $('.s3_footer').css('margin-top', footerTopMargin+'px');
    }
  }
  
  $(footerimage).load(function() {
    checkFooterMargin();
  });
  
  var footer = $('<a class="s3_footer_link" href="'+fd.footertarget+'">').html(
    '<div class="s3_footer">'+
    '<div class="s3_footer_text">'+
    '<h5>'+
    fd.footeruppertext +
    '</h5>'+
    '<p>'+
    fd.footerlowertext +
    '</p>' +
    footerimage + 
    '</div>'+
    '</a>'
  );
  
  var existingCustomerOption = $('<div class="s3_existing_customer_option">'+
    '<button class="s3_existing_customer_button" value="0">Kyllä</button>'+
    '<button class="s3_existing_customer_button" value="1">Ei</button>'+
    '</div>').hide();
  
  formBody.append($('<div/>').css('clear', 'both'));
  
  formBody.append(existingCustomerOption);
  
  form.append(formHeader);
  form.append(upperCode);
  form.append(formBody);
  form.append(continualBoxScript);
  wrap.append(snippet_styles);
  
  wrap.append(formWrap);
  wrap.append($("<div/>").css("clear", "both"));
  // show this
  //form.append(lowerCode);
  
  wrap.append(footer);
  
  var isIE = (navigator.userAgent.indexOf("MSIE") != -1);
  if (!isIE) {
    wrap.append(snippet_mobile_styles);
  }
  
  //wrap.insertAfter(settings.snippet);
  settings.container.append(wrap);
  
  
  if(!fd.footerhidden) {
    $('.s3_footer').hide();
  }   
  
  var date = new Date();
  var s3time = date.getTime();
  refreshSuffix="?refresh="+s3time;
  $("#s3_generated_form_header > div").last().prepend('<img id="mobihead" src="'+settings.bucketURL+fd.mobileheaderimage+refreshSuffix + '" />');
    
  if (typeof fd.continualboximage !== "undefined") {
    $('[data-id="continualBox"]').find(".s3_package_info_cover").append($("<img onload='refreshPackages();' />").attr("src", settings.bucketURL+fd.continualboximage+ refreshSuffix));
  }
  
  function checkHeaderLayout() {
    if ($('#s3_generated_form_header').innerWidth() < 500) {
      $('#s3_generated_form_header_inner').css({
        'width' : '100%',
        'height' : 'auto',
        'line-height' : '100%',
        'padding' : '10px 0'
      });
      
      $('#s3_generated_form_header_image').css({
        'margin' : '0 auto',
        'max-width' : '100%'
      });
    } else {
      $('#s3_generated_form_header_inner').css({
        'width' : '50%',
        'padding' : '0'
      });
  
      $('#s3_generated_form_header_image').css({
        'margin' : '0 0 0 50%',
        'max-width' : '50%'
      });
  
    }
  
    if(fd.headertext.length == 0){
      $('#s3_generated_form_header_inner').css('display', 'none');
      $('#s3_generated_form_header_image').css('margin', '0px auto');
      $('#s3_generated_form_header_image').css('max-width', '100%');
    }
  }
  
  if ($('#s3_generated_form_header_image.full').length < 1) {
    $(window).on('resize', function(ev) {
      checkHeaderLayout();
      refreshPackages();
      checkFooterMargin();
    });
    checkHeaderLayout();
  }
  
  $.ajax( {
    url: '/asauth/ajax',
    type: 'POST',
    dataType: 'json',
    data: {action: 'getAccount'}
  } )
  .always( function( data ) {
    if( data && data.code == 0 ) {
      settings.customer = data;
      // in case of single packages, if openform fires before the request finishes
      if( !( $('#s3_email_field').val() ) )
        prefillForm( data, $('#s3_generated_form form') );
      }
    }
  );
   
  $('.s3_package_inner').on('click', settings, openForm);
  
  if($('.s3_package').length === 1 && p.id !== 'continualBox') {
    $('.s3_package_inner').click();
    $('.s3_package_order').css('position', 'relative');
  
    if($('.s3_package_info_description p:last-child').text() == ''){
      $('.s3_package_info_description p:last-child').css('display', 'none');
    }
  }
}

function refreshPackages() {
  refreshSuffix="";

  var orderInfoHeights = [];

  $('.s3_package_order').each(function() {
    orderInfoHeights.push($(this).height());
  });

  if(orderInfoHeights.length == 1) {
    return false;
  }

  var largestOrderInfo = Math.max.apply(null, orderInfoHeights);
  var heights = [];

  // packageinfo height changes after img is loaded
  $('.s3_package_info').each(function(index, item) {
    heights.push($(this).height());
  });

  var largest = Math.max.apply(null, heights);

  // make room for orderinfo at bottom
  // -10 is for removing marginbottom
  if($('.s3_package').length > 1) {
    largest = largest + largestOrderInfo -10;
    // set new height on package, package_inner, but dont touch package_info (since it represents the most recent updated height)
    $('.s3_package_inner').each(function(index, item){
      $(this).height(largest);
    });
  }

  // set new height on package, package_inner, but dont touch package_info (since it represents the most recent updated height)
  $('.s3_package').each(function(index, item) {
    $(this).height(largest);
  });

  $('.s3_package_inner').each(function(index, item) {
    $(this).height(largest);
  });
}

function fetchPackageImage(p, devSuffix) {
  if (p.id !== "continualBox") {
    var date = new Date();
    var s3time = date.getTime();
    refreshSuffix="?refresh="+s3time;
  
    // continual box image is loaded elsewhere
    if (window.XDomainRequest) {
      //makeXDR({url: "//otavamedia-mydigi.s3.amazonaws.com/" + p.id + ".bgimage" + devSuffix + refreshSuffix, onload: function() { gotPackageSettings(JSON.parse(this.responseText)); refreshPackages(); } });
      var xdr = new XDomainRequest();
      xdr.onload = function() {
        $('[data-id="' + p.id + '"]').find(".s3_package_info_cover").append($("<img onload='refreshPackages();' />").attr("src", "http://otavamedia-mydigi.s3.amazonaws.com/" + p.id + ".bgimage" + devSuffix + refreshSuffix));
        refreshPackages();
      };
  
      xdr.timeout = 30000;
      xdr.onprogress = function(){};
      xdr.onerror = function(){};
      xdr.ontimeout = function(){};
      xdr.open("GET", "//otavamedia-mydigi.s3.amazonaws.com/" + p.id + ".bgimage" + devSuffix + refreshSuffix);
  
      setTimeout(function () {
        xdr.send();
      }, 0);
    } else {
      $.ajax({
        url : "//otavamedia-mydigi.s3.amazonaws.com/" + p.id + ".bgimage" + devSuffix +refreshSuffix,
        type : "GET",
        success: function() {
          $('[data-id="' + p.id + '"]').find(".s3_package_info_cover").append($("<img onload='refreshPackages();' />").attr("src", "http://otavamedia-mydigi.s3.amazonaws.com/" + p.id + ".bgimage" + devSuffix + refreshSuffix));
          $('.s3_package img').on('load', function(){
            refreshPackages();
          });
  
          $('img').on('error', function() {
            $(this).css('visibility','hidden');
          });
        }
      });
    }
  }  
}

function inputPrefix(v){
  if(v && typeof v != 'undefined') {
    v = v + '_';
  } else {
    v = '';
  }
  return v;
}

function createCustomerInfoHTML(prefix) {
  prefix = inputPrefix(prefix);

  var html = $('<div/>').html(
    '<label class="group">'+
      '<label>Etunimi <span class="gen_asteriks">*</span></label>'+
      '<br/>'+
      '<input type="text" name="'+prefix+'firstname" value="" class="threequarters" />'+
   '</label>'+
   '<label class="group">'+
     '<label>Sukunimi <span class="gen_asteriks">*</span></label>'+
     '<br/>'+
     '<input type="text" name="'+prefix+'lastname" value="" class="threequarters" />'+
   '</label>'+
   '<div style="clear:both;"></div>'+
     '<label class="group">'+
     '<label>Katuosoite <span class="gen_asteriks">*</span></label>'+
     '<br/>'+
     '<input type="text" name="'+prefix+'streetaddress" value="" class="threequarters"  />'+
   '</label>'+
     '<div style="clear:both;"></div>'+
     '<label class="group">'+
   '<label>Postinumero <span class="gen_asteriks">*</span></label>'+
     '<br/>'+
     '<input type="text" name="'+prefix+'postcode" value="" class="threequarters" />'+
   '</label>'+
   '<label class="group">'+
     '<label>Postitoimipaikka <span class="gen_asteriks">*</span></label>'+
     '<br/>'+
     '<input type="text" name="'+prefix+'city" value="" class="threequarters" />'+
   '</label>'+
   '<div style="clear:both;"></div>'+
   '<label class="group">'+
     '<label>Puhelin</label>'+
       '<br/>'+
       '<input type="tel" name="'+prefix+'phone" value="" class="threequarters"/>'+
     '</label>'+
   '<div style="clear:both;"></div>'
  );

  return html;
}

function createCredentialsHTML(prefix, p){
  prefix = inputPrefix(prefix);
  var html =  '<label class="sahkoposti-label">Sähköposti <span class="gen_asteriks">*</span></label><br/>';
  
  // gift giver
  if(prefix.length == 0 && prefix == '') {
    html += '<p class="label-info s3_text_12 s3_email_userinfotext">Varmista, että sähköpostiosoite on oikein. Sähköpostiosoite toimii digipalvelun käyttäjätunnuksena.</p>';
  }
  
  // gift recipient
  if (prefix && prefix.length > 0 ) {
    if (p && !p.print) {
      html +=  '<p class="label-info s3_text_12 s3_email_userinfotext">Varmista, että sähköpostiosoite on oikein. Sähköpostiosoite toimii digipalvelun käyttäjätunnuksena.</p>';
    } else {
      html +=  '<p class="s3_gift_order_email_warning_text">Lähetämme osoitteeseen tilausvahvistuksen ilman hintatietoa. Voit myös kirjoittaa oman tervehdyksesi lahjan saajalle.</p>';
    }
  }

  html += '<input type="text" class="s3_small_field" name="'+prefix+'email" id="'+prefix+'s3_email_field" value="" /><br/>'+
              '<div id="'+prefix+'s3_password_fields"><p class="password-reset-alert">'+
                  'Voit halutessasi vaihtaa salasanasi <a class="s3_generated_link" href="http://suomenkuvalehti.fi/kirjaudu">täällä</a>.'+
              '</p>'+
              '<label class="s3_pwLabel" style="display: block; margin-bottom: 0;">Salasana <span class="gen_asteriks">*</span></label>'+
              '<p id="'+prefix+'s3_password_help_text" class="label-info s3_text_12">Syötä tähän Otavamedian digipalveluissa käyttämäsi salasana</p>'+
              '<input type="password" class="s3_small_field" name="'+prefix+'password1" value="" /><br/>'+
              '<div class="dialogWrapper" style="display:none;" id="'+prefix+'s3_forgotPassFormWrap">'+
                  '<p class="login-toptip">'+
                  '<span id="'+prefix+'s3_has_password"><a id="'+prefix+'s3_btn_forgotpass" class="s3_generated_link">'+
                  '<u>Tilaa uusi salasana</u>'+
                  '</a> jos sinulla ei ole salasanaa tai olet unohtanut sen.</span> '+
                  '<span id="'+prefix+'s3_no_password">Olet jo rekisteröinyt antamasi sähköpostiosoitteen Otavamedian digipalveluihin, mutta salasana ei täsmää tai sitä ei löydy. '+
                  '<a id="'+prefix+'s3_btn_forgotpass" class="s3_generated_link">'+
                  '<u>Tilaa uusi salasana</u>'+
                  '</a> niin saat sähköpostiin linkin, jonka kautta voit vaihtaa salasanasi.</span>'+
                  '</p>'+
                  '<div style="clear:both;"></div>'+
              '</div>'+
              '<label class="s3_pwLabel" id="'+prefix+'s3_password2" style="display: block; margin-bottom: 0;">Salasana uudelleen <span class="gen_asteriks">*</span></label>'+
              '<input type="password" class="s3_small_field" name="'+prefix+'password2" style="margin-bottom: 8px;" value="" />'+
              '</div>';
  
  return html;
}

function createCountrySelectHTML(prefix, p) {
  prefix = inputPrefix(prefix);

  var html = '';

  if(p.paymentpaper || !p.print) {
     html +=  '<label>Maa <span class="gen_asteriks">*</span></label><br/>'+
     '<select name="'+prefix+'country">'+
     '<option value="AF">Afganistan</option><option value="AX">Ahvenanmaa</option><option value="NL">Alankomaat</option><option value="AN">Alankomaiden Antillit</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">Amerikan Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarktis</option><option value="AG">Antigua ja Barbuda</option><option value="AE">Arabiemiirikunnat</option><option value="AR">Argentiina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AC">Ascension Island</option><option value="AU">Australia</option><option value="AZ">Azerbaidžan</option><option value="BS">Bahama</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BE">Belgia</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia ja Hertsegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet’nsaari</option><option value="BR">Brasilia</option><option value="IO">Brittiläinen Intian valtameren alue</option><option value="VG">Brittiläiset Neitsytsaaret</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KY">Caymansaaret</option><option value="EA">Ceuta, Melilla</option><option value="CL">Chile</option><option value="CP">Clippertoninsaari</option><option value="CK">Cookinsaaret</option><option value="CR">Costa Rica</option><option value="DG">Diego Garcia</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominikaaninen tasavalta</option><option value="EC">Ecuador</option><option value="EG">Egypti</option><option value="SV">El Salvador</option><option value="ER">Eritrea</option><option value="ES">Espanja</option><option value="ET">Etiopia</option><option value="ZA">Etelä-Afrikka</option><option value="GS">Etelä-Georgia ja Eteläiset Sandwichsaaret</option><option value="FK">Falklandinsaaret</option><option value="FO">Färsaaret</option><option value="FJ">Fidži</option><option value="PH">Filippiinit</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GD">Grenada</option><option value="GL">Grönlanti</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GG">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard ja McDonaldinsaaret</option><option value="HN">Honduras</option><option value="HK">Hongkong</option><option value="ID">Indonesia</option><option value="IN">Intia</option><option value="IQ">Irak</option><option value="IR">Iran</option><option value="IE">Irlanti</option><option value="IS">Islanti</option><option value="IL">Israel</option><option value="IT">Italia</option><option value="TL">Itä-Timor</option><option value="AT">Itävalta</option><option value="JM">Jamaika</option><option value="JP">Japani</option><option value="YE">Jemen</option><option value="JE">Jersey</option><option value="JO">Jordania</option><option value="CX">Joulusaari</option><option value="KH">Kambodža</option><option value="CM">Kamerun</option><option value="CA">Kanada</option><option value="IC">Kanariansaaret</option><option value="CV">Kap Verde</option><option value="KZ">Kazakstan</option><option value="KE">Kenia</option><option value="CF">Keski-Afrikan tasavalta</option><option value="CN">Kiina</option><option value="KG">Kirgisia</option><option value="KI">Kiribati</option><option value="CO">Kolumbia</option><option value="KM">Komorit</option><option value="CD">Kongon demokraattinen tasavalta</option><option value="CG">Kongon tasavalta</option><option value="CC">Kookossaaret</option><option value="KP">Korean demokraattinen kansantasavalta</option><option value="KR">Korean tasavalta</option><option value="GR">Kreikka</option><option value="HR">Kroatia</option><option value="CU">Kuuba</option><option value="KW">Kuwait</option><option value="CY">Kypros</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LS">Lesotho</option><option value="LB">Libanon</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Liettua</option><option value="LU">Luxemburg</option><option value="EH">Länsi-Sahara</option><option value="MO">Macao</option><option value="MG">Madagaskar</option><option value="MK">Makedonian tasavalta|Makedonia</option><option value="MW">Malawi</option><option value="MV">Malediivit</option><option value="MY">Malesia</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="IM">Mansaari</option><option value="MA">Marokko</option><option value="MH">Marshallinsaaret</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Meksiko</option><option value="FM">Mikronesian liittovaltio</option><option value="MD">Moldova</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MZ">Mosambik</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolkinsaari</option><option value="NO">Norja</option><option value="CI">Norsunluurannikko</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestiina</option><option value="PA">Panama</option><option value="PG">Papua-Uusi-Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="MP">Pohjois-Mariaanit</option><option value="PN">Pitcairn</option><option value="PT">Portugali</option><option value="PR">Puerto Rico</option><option value="PL">Puola</option><option value="GQ">Päiväntasaajan Guinea</option><option value="QA">Qatar</option><option value="FR">Ranska</option><option value="FX">Ranska (Eurooppaan kuuluvat osat)</option><option value="TF">Ranskan eteläiset alueet</option><option value="GF">Ranskan Guayana</option><option value="PF">Ranskan Polynesia</option><option value="RE">Réunion</option><option value="RO">Romania</option><option value="RW">Ruanda</option><option value="SE">Ruotsi</option><option value="SH">Saint Helena</option><option value="KN">Saint Kitts ja Nevis</option><option value="LC">Saint Lucia</option><option value="PM">Saint-Pierre ja Miquelon</option><option value="VC">Saint Vincent ja Grenadiinit</option><option value="DE">Saksa</option><option value="SB">Salomonsaaret</option><option value="ZM">Sambia</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">São Tomé ja Príncipe</option><option value="SA">Saudi-Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychellit</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SO">Somalia</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="FI" selected>Suomi</option><option value="SR">Suriname</option><option value="SJ">Svalbard ja Jan Mayen</option><option value="SZ">Swazimaa</option><option value="CH">Sveitsi</option><option value="SY">Syyria</option><option value="TJ">Tadžikistan</option><option value="TW">Taiwan</option><option value="TZ">Tansania</option><option value="DK">Tanska</option><option value="TH">Thaimaa</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad ja Tobago</option><option value="TA">Tristan da Cunha</option><option value="TD">Tšad</option><option value="CZ">Tšekki</option><option value="TN">Tunisia</option><option value="TR">Turkki</option><option value="TM">Turkmenistan</option><option value="TC">Turks- ja Caicossaaret</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraina</option><option value="HU">Unkari</option><option value="UY">Uruguay</option><option value="NC">Uusi-Kaledonia</option><option value="NZ">Uusi-Seelanti</option><option value="UZ">Uzbekistan</option><option value="BY">Valko-Venäjä</option><option value="VU">Vanuatu</option><option value="VA">Vatikaanivaltio</option><option value="VE">Venezuela</option><option value="RU">Venäjä</option><option value="VN">Vietnam</option><option value="EE">Viro</option><option value="WF">Wallis ja Futunasaaret</option><option value="GB">Yhdistynyt kuningaskunta</option><option value="US">Yhdysvallat</option><option value="VI">Yhdysvaltain Neitsytsaaret</option><option value="UM">Yhdysvaltain pienet erillissaaret</option><option value="ZW">Zimbabwe</option>'+
     '</select>'+
     '<div class="s3-clear"></div>';
  } else {
    html +=  '<label>Maa <span class="gen_asteriks">*</span></label><br/>'+
    '<select name="'+prefix+'country">'+
    '<option value="FI" selected>Suomi</option>'+
    '</select>'+
    '<br/>'+
    '<div class="sk-maa-laskutustapahuomio label-info">'+
    'Huom: Suomen ulkopuolella lasku on ainoa valittavissa oleva maksutapa.'+
    '</div>'+
    '<div class="s3-clear"></div>';
  }

  return html;
}

function addEmailChecker(el, cb){
  el.addEventListener('input', function() {
    if(this.value.length > 2 && validateEmail(this.value)) {
      if (typeof cb !== "undefined") {
        checkEmail(this.value, cb, el);
      } else {
        checkEmail(this.value, null, el);
      }
    }
  });
}

function s3checkAccount(event) {
  event.preventDefault();
  console.log(test);
  //checkEmail(this.value, mobileOrderAccountResponse, el);
}

function openExistingCustomerOption(e, fd) {
  $('.s3_existing_customer_option').show();
}

function prefillForm( data, form ) {
  if( data.account ) {
    form.find('[name="email"]').val( data.account.email ).attr( 'readonly', true );
  
    checkEmail(data.account.email, null, form.find('[name="email"]'));
  
    if( form.find('[name="customernumber"]') && data.account.customerNumber ) {
      form.find('[name="customernumber"]').val( data.account.customerNumber).attr( 'readonly', true );
    }
  }
  
  if( data.contact ) {
    form.find('[name="firstname"]').val( data.contact.givenName ).attr( 'readonly', true );
    form.find('[name="lastname"]').val( data.contact.familyName ).attr( 'readonly', true );

    form.find('[name="streetaddress"]').val( data.contact.address );
    form.find('[name="postcode"]').val( data.contact.postCode );
    form.find('[name="city"]').val( data.contact.city );

    form.find('[name="country"]').val( data.contact.country );

    form.find('[name="phone"]').val( data.contact.phone );
  }
}

function openForm(event) {
  refreshSuffix="";
  $('.s3_order_button').html("Valitse");
  $('.s3_package').addClass('faded');
  $('.s3_footer').css('display', 'none');

  event.preventDefault();
  event.currentTarget = $(event.currentTarget).parent();
  $(event.currentTarget).removeClass('faded');
    
  $(event.currentTarget).find('.s3_order_button').html("Valittu");
    
  var fd = event.data.formData;
  var settings = event.data;
  var pno = parseInt($(event.currentTarget).attr("data-package"));
    
  var _p = fd.packageData[pno];
  var extra = "";

  if(_p.id === 'continualBox') {   
    // link has been defined for continual box
    if (_p.continualBoxClick) {
      window.location = _p.continualBoxLink;
    } else {
      // use custom function
      if(typeof s3BoxClickAction === "function" ) {
        s3BoxClickAction();
      }
    }        
  } else {
    var isRepeating = false;

    if (typeof _p.repeating != "undefined" && _p.repeating) {
      isRepeating = true;
    }

    if (_p.digi && isRepeating) {
      extra = "Voit irtisanoa tilauksesi 2 viikkoa ennen uuden tilausjakson alkua osoitteessa otavamedia.fi.<br>";
    }
    
    if (_p.print && isRepeating) {
      extra = "Voit irtisanoa tilauksesi 2 viikkoa ennen uuden tilausjakson alkua osoitteessa otavamedia.fi.<br>";
    }

    var form = $('#s3_generated_form form');
    form.unbind('submit');
    form.bind('submit', sendOrder);
    form.find("#s3_order_info").remove();
    form.find("#s3_existing_customer").remove();
    var orderInfo = $('<div/>').attr("id", "s3_order_info").addClass("tilaustiedot");

    var orderType = $('<div/>').attr("id", "s3_order_type").html('<h2>Tilauksen saaja</h2>');

    orderType.append($('<div/>').addClass('order_regular').html(
      '<input id="s3_generated_r3" type="radio" name="s3_ordertype" value="regular_order" checked /><label for="s3_generated_r3">Tilaan itselle</label>'
    ));
    
    // packages that have requirements cannot be gifted
    if (!_p.existingcustomeroffer) {
      orderType.append($('<div/>').addClass('order_gift').html(
        '<input id="s3_generated_r4" type="radio" name="s3_ordertype" value="gift_order" /><label for="s3_generated_r4">Tilaan lahjaksi</label>'
      ));
    }
        
    var paymentMethod = $('<div/>').attr("id", "s3_payment_method").html(
      '<h2 class="s3_generated_scroll_point">Valitse tilauksen maksutapa</h2>'
    );

    if (_p.paymentcredit) {
      paymentMethod.append($('<div/>').addClass('laskutustapa-toistuva').html(
        '<input id="s3_generated_r1" type="radio" name="laskutustapa" value="payex_credit" checked /><label for="s3_generated_r1"> Luottokortti: Visa, Visa Electron, Master Card ja Euro Card</label>'
      ));
    }
    
    if (_p.paymentpaper) {
      paymentMethod.append($('<div/>').addClass('laskutustapa-kesto').html(
        '<input id="s3_generated_r2" type="radio" name="laskutustapa" value="leka" checked/><label for="s3_generated_r2"> Lasku</label><br/>'
      ));
    }

    var accountNotFoundText = "<p id='s3_account_notfound' style='display:none'>Tietojasi ei löytynyt Otavamedian asiakasrekisteristä. Täytä yhteystietosi lomakkeelle.</p>";
    orderInfo.append(accountNotFoundText);

    if (typeof _p.giveaways !== "undefined" && _p.giveaways && _p.giveaways.length > 0) {
      var giveAwaysList = $('<div/>').attr("id", "s3_giveaways_list").html(
        '<h2 id="s3_giveawayheader_text">Valitse etusi</h2><p>Kun tilaat nyt, voit valita kaupan päälle jonkin seuraavista tutustumisjaksoista</p><select name="s3_giveaways"><option value="">En halua ilmaista oheistuotetta</option></select>');
      orderInfo.append(giveAwaysList);
    }

    if(orderType) {
      orderInfo.append(orderType);
    }

    orderInfo.append(paymentMethod);
    
    orderInfo.find('[name=s3_ordertype]').on('change', function(event){
      $('#s3_gift_order_customer_info').toggle();
      $('#s3_customer_info .s3_email_userinfotext').toggle();
//      $('#s3_password_fields').hide();
    });
    
    if (orderInfo.find('[name="laskutustapa"]').length > 1) {
      orderInfo.find('[name="laskutustapa"], [name="s3_ordertype"]').on('change', function(event) {
        var billingMethod = orderInfo.find('[name="laskutustapa"]:checked').val();
        var selectedOrderType = orderInfo.find('[name="s3_ordertype"]:checked').val();

        $('#s3_order_info .maa-laskutustapahuomio').remove();
        
        if (billingMethod === 'payex_credit' && _p.print && selectedOrderType != 'gift_order' ) {
          $('#s3_order_info [name="country"]').html('<option value="FI" selected>Suomi</option>');
          $('<div/>').addClass("").html(
            '<div class="maa-laskutustapahuomio label-info">'+
              'Huom: Suomen ulkopuolella lasku on ainoa valittavissa oleva maksutapa, mikäli paketti sisältää printtilehden.'+
            '</div>'
          ).insertAfter($('#s3_order_info [name="country"]'));
          $('.s3_payex_link').css('display', '');
        } else if (billingMethod === 'payex_credit' && _p.print && selectedOrderType == 'gift_order' ) {
          $('#s3_order_info [name="country"]').html('<option value="AF">Afganistan</option><option value="AX">Ahvenanmaa</option><option value="NL">Alankomaat</option><option value="AN">Alankomaiden Antillit</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">Amerikan Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarktis</option><option value="AG">Antigua ja Barbuda</option><option value="AE">Arabiemiirikunnat</option><option value="AR">Argentiina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AC">Ascension Island</option><option value="AU">Australia</option><option value="AZ">Azerbaidžan</option><option value="BS">Bahama</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BE">Belgia</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia ja Hertsegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet’nsaari</option><option value="BR">Brasilia</option><option value="IO">Brittiläinen Intian valtameren alue</option><option value="VG">Brittiläiset Neitsytsaaret</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KY">Caymansaaret</option><option value="EA">Ceuta, Melilla</option><option value="CL">Chile</option><option value="CP">Clippertoninsaari</option><option value="CK">Cookinsaaret</option><option value="CR">Costa Rica</option><option value="DG">Diego Garcia</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominikaaninen tasavalta</option><option value="EC">Ecuador</option><option value="EG">Egypti</option><option value="SV">El Salvador</option><option value="ER">Eritrea</option><option value="ES">Espanja</option><option value="ET">Etiopia</option><option value="ZA">Etelä-Afrikka</option><option value="GS">Etelä-Georgia ja Eteläiset Sandwichsaaret</option><option value="FK">Falklandinsaaret</option><option value="FO">Färsaaret</option><option value="FJ">Fidži</option><option value="PH">Filippiinit</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GD">Grenada</option><option value="GL">Grönlanti</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GG">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard ja McDonaldinsaaret</option><option value="HN">Honduras</option><option value="HK">Hongkong</option><option value="ID">Indonesia</option><option value="IN">Intia</option><option value="IQ">Irak</option><option value="IR">Iran</option><option value="IE">Irlanti</option><option value="IS">Islanti</option><option value="IL">Israel</option><option value="IT">Italia</option><option value="TL">Itä-Timor</option><option value="AT">Itävalta</option><option value="JM">Jamaika</option><option value="JP">Japani</option><option value="YE">Jemen</option><option value="JE">Jersey</option><option value="JO">Jordania</option><option value="CX">Joulusaari</option><option value="KH">Kambodža</option><option value="CM">Kamerun</option><option value="CA">Kanada</option><option value="IC">Kanariansaaret</option><option value="CV">Kap Verde</option><option value="KZ">Kazakstan</option><option value="KE">Kenia</option><option value="CF">Keski-Afrikan tasavalta</option><option value="CN">Kiina</option><option value="KG">Kirgisia</option><option value="KI">Kiribati</option><option value="CO">Kolumbia</option><option value="KM">Komorit</option><option value="CD">Kongon demokraattinen tasavalta</option><option value="CG">Kongon tasavalta</option><option value="CC">Kookossaaret</option><option value="KP">Korean demokraattinen kansantasavalta</option><option value="KR">Korean tasavalta</option><option value="GR">Kreikka</option><option value="HR">Kroatia</option><option value="CU">Kuuba</option><option value="KW">Kuwait</option><option value="CY">Kypros</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LS">Lesotho</option><option value="LB">Libanon</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Liettua</option><option value="LU">Luxemburg</option><option value="EH">Länsi-Sahara</option><option value="MO">Macao</option><option value="MG">Madagaskar</option><option value="MK">Makedonian tasavalta|Makedonia</option><option value="MW">Malawi</option><option value="MV">Malediivit</option><option value="MY">Malesia</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="IM">Mansaari</option><option value="MA">Marokko</option><option value="MH">Marshallinsaaret</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Meksiko</option><option value="FM">Mikronesian liittovaltio</option><option value="MD">Moldova</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MZ">Mosambik</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolkinsaari</option><option value="NO">Norja</option><option value="CI">Norsunluurannikko</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestiina</option><option value="PA">Panama</option><option value="PG">Papua-Uusi-Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="MP">Pohjois-Mariaanit</option><option value="PN">Pitcairn</option><option value="PT">Portugali</option><option value="PR">Puerto Rico</option><option value="PL">Puola</option><option value="GQ">Päiväntasaajan Guinea</option><option value="QA">Qatar</option><option value="FR">Ranska</option><option value="FX">Ranska (Eurooppaan kuuluvat osat)</option><option value="TF">Ranskan eteläiset alueet</option><option value="GF">Ranskan Guayana</option><option value="PF">Ranskan Polynesia</option><option value="RE">Réunion</option><option value="RO">Romania</option><option value="RW">Ruanda</option><option value="SE">Ruotsi</option><option value="SH">Saint Helena</option><option value="KN">Saint Kitts ja Nevis</option><option value="LC">Saint Lucia</option><option value="PM">Saint-Pierre ja Miquelon</option><option value="VC">Saint Vincent ja Grenadiinit</option><option value="DE">Saksa</option><option value="SB">Salomonsaaret</option><option value="ZM">Sambia</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">São Tomé ja Príncipe</option><option value="SA">Saudi-Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychellit</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SO">Somalia</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="FI" selected>Suomi</option><option value="SR">Suriname</option><option value="SJ">Svalbard ja Jan Mayen</option><option value="SZ">Swazimaa</option><option value="CH">Sveitsi</option><option value="SY">Syyria</option><option value="TJ">Tadžikistan</option><option value="TW">Taiwan</option><option value="TZ">Tansania</option><option value="DK">Tanska</option><option value="TH">Thaimaa</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad ja Tobago</option><option value="TA">Tristan da Cunha</option><option value="TD">Tšad</option><option value="CZ">Tšekki</option><option value="TN">Tunisia</option><option value="TR">Turkki</option><option value="TM">Turkmenistan</option><option value="TC">Turks- ja Caicossaaret</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraina</option><option value="HU">Unkari</option><option value="UY">Uruguay</option><option value="NC">Uusi-Kaledonia</option><option value="NZ">Uusi-Seelanti</option><option value="UZ">Uzbekistan</option><option value="BY">Valko-Venäjä</option><option value="VU">Vanuatu</option><option value="VA">Vatikaanivaltio</option><option value="VE">Venezuela</option><option value="RU">Venäjä</option><option value="VN">Vietnam</option><option value="EE">Viro</option><option value="WF">Wallis ja Futunasaaret</option><option value="GB">Yhdistynyt kuningaskunta</option><option value="US">Yhdysvallat</option><option value="VI">Yhdysvaltain Neitsytsaaret</option><option value="UM">Yhdysvaltain pienet erillissaaret</option><option value="ZW">Zimbabwe</option>');
          $('#s3_order_info [name="giftorder_country"]').html('<option value="FI" selected>Suomi</option>');
          $('.s3_payex_link').css('display', '');
        } else if (billingMethod === 'leka') {
          $('#s3_order_info [name="country"], #s3_order_info [name="giftorder_country"]').html('<option value="AF">Afganistan</option><option value="AX">Ahvenanmaa</option><option value="NL">Alankomaat</option><option value="AN">Alankomaiden Antillit</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">Amerikan Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarktis</option><option value="AG">Antigua ja Barbuda</option><option value="AE">Arabiemiirikunnat</option><option value="AR">Argentiina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AC">Ascension Island</option><option value="AU">Australia</option><option value="AZ">Azerbaidžan</option><option value="BS">Bahama</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BE">Belgia</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia ja Hertsegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet’nsaari</option><option value="BR">Brasilia</option><option value="IO">Brittiläinen Intian valtameren alue</option><option value="VG">Brittiläiset Neitsytsaaret</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KY">Caymansaaret</option><option value="EA">Ceuta, Melilla</option><option value="CL">Chile</option><option value="CP">Clippertoninsaari</option><option value="CK">Cookinsaaret</option><option value="CR">Costa Rica</option><option value="DG">Diego Garcia</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominikaaninen tasavalta</option><option value="EC">Ecuador</option><option value="EG">Egypti</option><option value="SV">El Salvador</option><option value="ER">Eritrea</option><option value="ES">Espanja</option><option value="ET">Etiopia</option><option value="ZA">Etelä-Afrikka</option><option value="GS">Etelä-Georgia ja Eteläiset Sandwichsaaret</option><option value="FK">Falklandinsaaret</option><option value="FO">Färsaaret</option><option value="FJ">Fidži</option><option value="PH">Filippiinit</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GD">Grenada</option><option value="GL">Grönlanti</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GG">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard ja McDonaldinsaaret</option><option value="HN">Honduras</option><option value="HK">Hongkong</option><option value="ID">Indonesia</option><option value="IN">Intia</option><option value="IQ">Irak</option><option value="IR">Iran</option><option value="IE">Irlanti</option><option value="IS">Islanti</option><option value="IL">Israel</option><option value="IT">Italia</option><option value="TL">Itä-Timor</option><option value="AT">Itävalta</option><option value="JM">Jamaika</option><option value="JP">Japani</option><option value="YE">Jemen</option><option value="JE">Jersey</option><option value="JO">Jordania</option><option value="CX">Joulusaari</option><option value="KH">Kambodža</option><option value="CM">Kamerun</option><option value="CA">Kanada</option><option value="IC">Kanariansaaret</option><option value="CV">Kap Verde</option><option value="KZ">Kazakstan</option><option value="KE">Kenia</option><option value="CF">Keski-Afrikan tasavalta</option><option value="CN">Kiina</option><option value="KG">Kirgisia</option><option value="KI">Kiribati</option><option value="CO">Kolumbia</option><option value="KM">Komorit</option><option value="CD">Kongon demokraattinen tasavalta</option><option value="CG">Kongon tasavalta</option><option value="CC">Kookossaaret</option><option value="KP">Korean demokraattinen kansantasavalta</option><option value="KR">Korean tasavalta</option><option value="GR">Kreikka</option><option value="HR">Kroatia</option><option value="CU">Kuuba</option><option value="KW">Kuwait</option><option value="CY">Kypros</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LS">Lesotho</option><option value="LB">Libanon</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Liettua</option><option value="LU">Luxemburg</option><option value="EH">Länsi-Sahara</option><option value="MO">Macao</option><option value="MG">Madagaskar</option><option value="MK">Makedonian tasavalta|Makedonia</option><option value="MW">Malawi</option><option value="MV">Malediivit</option><option value="MY">Malesia</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="IM">Mansaari</option><option value="MA">Marokko</option><option value="MH">Marshallinsaaret</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Meksiko</option><option value="FM">Mikronesian liittovaltio</option><option value="MD">Moldova</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MZ">Mosambik</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolkinsaari</option><option value="NO">Norja</option><option value="CI">Norsunluurannikko</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestiina</option><option value="PA">Panama</option><option value="PG">Papua-Uusi-Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="MP">Pohjois-Mariaanit</option><option value="PN">Pitcairn</option><option value="PT">Portugali</option><option value="PR">Puerto Rico</option><option value="PL">Puola</option><option value="GQ">Päiväntasaajan Guinea</option><option value="QA">Qatar</option><option value="FR">Ranska</option><option value="FX">Ranska (Eurooppaan kuuluvat osat)</option><option value="TF">Ranskan eteläiset alueet</option><option value="GF">Ranskan Guayana</option><option value="PF">Ranskan Polynesia</option><option value="RE">Réunion</option><option value="RO">Romania</option><option value="RW">Ruanda</option><option value="SE">Ruotsi</option><option value="SH">Saint Helena</option><option value="KN">Saint Kitts ja Nevis</option><option value="LC">Saint Lucia</option><option value="PM">Saint-Pierre ja Miquelon</option><option value="VC">Saint Vincent ja Grenadiinit</option><option value="DE">Saksa</option><option value="SB">Salomonsaaret</option><option value="ZM">Sambia</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">São Tomé ja Príncipe</option><option value="SA">Saudi-Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychellit</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SO">Somalia</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="FI" selected>Suomi</option><option value="SR">Suriname</option><option value="SJ">Svalbard ja Jan Mayen</option><option value="SZ">Swazimaa</option><option value="CH">Sveitsi</option><option value="SY">Syyria</option><option value="TJ">Tadžikistan</option><option value="TW">Taiwan</option><option value="TZ">Tansania</option><option value="DK">Tanska</option><option value="TH">Thaimaa</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad ja Tobago</option><option value="TA">Tristan da Cunha</option><option value="TD">Tšad</option><option value="CZ">Tšekki</option><option value="TN">Tunisia</option><option value="TR">Turkki</option><option value="TM">Turkmenistan</option><option value="TC">Turks- ja Caicossaaret</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraina</option><option value="HU">Unkari</option><option value="UY">Uruguay</option><option value="NC">Uusi-Kaledonia</option><option value="NZ">Uusi-Seelanti</option><option value="UZ">Uzbekistan</option><option value="BY">Valko-Venäjä</option><option value="VU">Vanuatu</option><option value="VA">Vatikaanivaltio</option><option value="VE">Venezuela</option><option value="RU">Venäjä</option><option value="VN">Vietnam</option><option value="EE">Viro</option><option value="WF">Wallis ja Futunasaaret</option><option value="GB">Yhdistynyt kuningaskunta</option><option value="US">Yhdysvallat</option><option value="VI">Yhdysvaltain Neitsytsaaret</option><option value="UM">Yhdysvaltain pienet erillissaaret</option><option value="ZW">Zimbabwe</option>');
          $('.s3_payex_link').css('display', 'none');
        } else if (billingMethod === 'payex_credit' && !_p.print) {
          $('.s3_payex_link').css('display', '');
        } else if (billingMethod === 'leka' && !_p.print) {
          $('.s3_payex_link').css('display', 'none');
        }
      });
    } 

    var customerInfo = $('<div/>').attr("id", "s3_customer_info").html(
      '<h2>Täytä tilaajan tiedot</h2>'+
      '<fieldset style="width: 350px; max-width: 100%;"></fieldset>'
    );

    // gift order fields   
    var giftOrderCustomerInfo = $('<div/>').attr("id", "s3_gift_order_customer_info").html('<h2>Täytä lahjan saajan tiedot</h2>');
    var giftOrderCustomerBasicInfo = createCustomerInfoHTML('giftorder');
    giftOrderCustomerBasicInfo.append(createCredentialsHTML('giftorder', _p));
    // recipient email is not mandatory if giftorder is paper
    if(_p.print && !_p.digi) {
      giftOrderCustomerBasicInfo.find('.sahkoposti-label > span').hide();
    }
    
    if (_p.existingcustomeroffer) {
      customerInfo.find('fieldset').append($('<div/>').addClass('asiakasnumero').html(
        '<label>Asiakasnumero <span class="gen_asteriks">*</span></label>'+
        '<p class="label-info"> Löydät asiakasnumeron lehden takakannesta ja laskusta.</p>'+
        '<input type="text" name="customernumber" value="" class="customernumber" />'
      ));
    }
    
    var sendCustomMessageToRecipient = '<br><fieldset>'+
      '<input type="checkbox" name="sendCustomGreetingToGiftRecipient" id="sendCustomGreetingToGiftRecipient" value="1">'+
      '<label for="sendCustomGreetingToGiftRecipient">Lähetä tervehdys lahjan saajalle</label>'+
      '<br>'+
      '<textarea name="customGreetingToGiftRecipient" id="customGreetingForGiftRecipient" class="s3_small_field" rows="8" cols="64"></textarea>'+
      '</fieldset>';
    giftOrderCustomerBasicInfo.append(sendCustomMessageToRecipient);
    
    // if user wants to send custom greeting to recipient    
    giftOrderCustomerBasicInfo.find('#sendCustomGreetingToGiftRecipient').on('change', function(event){
      $('#customGreetingForGiftRecipient').toggle();
      // if user wants to sent greeting, recipient email is mandatory even if gift order is print
      if(_p.print && !_p.digi) {
        giftOrderCustomerBasicInfo.find('.sahkoposti-label > span').toggle();
      }
    });
    
    giftOrderCustomerBasicInfo.append(createCountrySelectHTML('giftorder', _p));

    var basicInfo = createCustomerInfoHTML();
    basicInfo.append(createCountrySelectHTML(null, _p));
    basicInfo.append(createCredentialsHTML(null, _p));

    var marketingQuestions = '<fieldset>'+
      '<p style="padding: 0 0 8px 0; margin: 4px 0px 4px 0px;">Minulle voi lähettää tietoa asiakaseduista ja tarjouksista sähköisesti Otavamedia Oy:ltä ja sen kanssa kulloinkin samaan konserniin kuuluvilta yhtiöiltä</p>'+
      '<input id="s3_generated_c1" type="checkbox" name="phonemarketing" value="matkapuhelin" /><label for="s3_generated_c1"> Matkapuhelimeeni </label>'+
      '<input id="s3_generated_c2"  type="checkbox" name="emailmarketing" value="sahkoposti" /><label for="s3_generated_c2"> Sähköpostiin</label><br/>'+
      '</fieldset>';
    
    var finePrint = 
        '<fieldset>'+
          '<br><div class="s3_accept_conditions">Lähettämällä tämän lomakkeen, hyväksyt <a id="s3_btn_usage_terms" target="_blank" class="s3_generated_link" href="#"><u>tilaus- ja käyttöehdot.</u></a></div>'+
          '<br/><div class="s3_order_form_marketing_subtext">'+_p.marketingsubtext+ ' <span class="s3_order_form_marketing_subtext_extra">' + extra+ '</span><div class="s3_abroad_delivery"></div>' + '</div>'+
        '</fieldset>';
      
    var submitButton = '<br/><input type="submit" onclick="javascript:void(0);" value="Tilaa" />';
      
    if (_p.paymentpaper) {
      finePrint +=
      '<p class="s3_payex_link" style="display: none"><a target="_blank" href="http://www.payex.com">'+
      '<img class="s3_payex_logo" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAEsAAAAgCAYAAABafYVzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6 eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNl SUQ9InhtcC5paWQ6NzJGNjZCMEI0NzMzMTFFMzg0NTBCMDgwMkNCMTUyOTQiIHhtcE1NOkRvY3Vt ZW50SUQ9InhtcC5kaWQ6NzJGNjZCMEM0NzMzMTFFMzg0NTBCMDgwMkNCMTUyOTQiPiA8eG1wTU06 RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MkY2NkIwOTQ3MzMxMUUzODQ1 MEIwODAyQ0IxNTI5NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3MkY2NkIwQTQ3MzMxMUUz ODQ1MEIwODAyQ0IxNTI5NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1w bWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpfImdoAABIZSURBVHja7FppeFRllj636tZeSVWqsoeQ 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 AAAAAElFTkSuQmCC">'+
      '</a> Maksujen välitykseen käytetään PayEx-palvelua.</p><br/><br/><br/><br/>';
    } else {
      finePrint +=
      '<p class="s3_payex_link"><a target="_blank" href="http://www.payex.com">'+
      '<img class="s3_payex_logo" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAEsAAAAgCAYAAABafYVzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ bWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6 eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNl SUQ9InhtcC5paWQ6NzJGNjZCMEI0NzMzMTFFMzg0NTBCMDgwMkNCMTUyOTQiIHhtcE1NOkRvY3Vt ZW50SUQ9InhtcC5kaWQ6NzJGNjZCMEM0NzMzMTFFMzg0NTBCMDgwMkNCMTUyOTQiPiA8eG1wTU06 RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3MkY2NkIwOTQ3MzMxMUUzODQ1 MEIwODAyQ0IxNTI5NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3MkY2NkIwQTQ3MzMxMUUz ODQ1MEIwODAyQ0IxNTI5NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1w bWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpfImdoAABIZSURBVHja7FppeFRllj636tZeSVWqsoeQ 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 AAAAAElFTkSuQmCC">'+
      '</a> Maksujen välitykseen käytetään PayEx-palvelua.</p><br/><br/><br/><br/>';
    }

    var packageInfo = $('<div/>').addClass('paketti-info-wrapper').html(
      '<input type="hidden" value="'+_p.id+'" name="packageid" />'+
      '<input type="hidden" value="'+fd.servicepointid+'" name="servicepointid" />'+
      '<input type="hidden" value="'+fd.baseurl+'" name="baseurl" />'+
      '<input type="hidden" value="'+_p.digi+'" name="s3digi" />'
    );

    var usageTerms = $('<div/>').addClass('s3_usage_terms-wrapper').html(
      '<iframe src="http://otavamedia.fi/tilausehdot/" width="768" height="800" style="-webkit-transform:scale(0.7);-moz-transform-scale(0.7);">"></iframe>');            
      
    /* Put the pieces together */
    customerInfo.append(basicInfo);
    customerInfo.append(marketingQuestions);
    orderInfo.append(customerInfo);

    if(giftOrderCustomerBasicInfo){
      giftOrderCustomerInfo.append(giftOrderCustomerBasicInfo);
      orderInfo.append(giftOrderCustomerInfo);
    }

    orderInfo.append(packageInfo);
    
    orderInfo.append(finePrint);
    
    orderInfo.append(submitButton);
    
    orderInfo.append(usageTerms);

    form.append(orderInfo);

    if(settings.customer) {
      prefillForm(settings.customer, form);
    }

    // Never show password fields for gift recipients...
    $('#giftorder_s3_password_fields').css('display', 'none');

    // ...and show the password field conditionally for digi orders
    if($('[name=s3digi]').val() == "0") {
      $('#s3_password_fields').css('display', 'none');
      $('.s3_email_userinfotext').css('display', 'none');
    } else {
      $('#s3_password_fields').css('display', 'block');
    }

    if (typeof _p.giveaways !== "undefined" && _p.giveaways && _p.giveaways.length > 0) {
      for (var i = 0; i < _p.giveaways.length; i++) {
        var giveAwayID =  _p.giveaways[i].id;
        var giveAwayMarketingName = _p.giveaways[i].marketingName;
        var giveAwayDuration = _p.giveaways[i].duration;
        if (typeof giveAwayMarketingName !== "undefined") {
          $('#s3_order_info [name="s3_giveaways"]').append("<option value="+giveAwayID+" "+(i === 0 ? "selected" : "")+ ">"+giveAwayMarketingName+"</option>");
        }
      }

      if (typeof _p.giveawayheadertext !== "undefined") {
        $('#s3_giveawayheader_text').text(_p.giveawayheadertext); 
      }
      
      if (typeof _p.giveawaysmalltext !== "undefined") {
        $('.s3_giveawaysmall_text').text(_p.giveawaysmalltext);
      }
    }

    if($('.s3_package').length > 1) {
      // form.append(orderInfo);
    } else {
      $('#s3_generated_form_body').addClass('s3_package_left');
      $('#s3_order_info').addClass('s3_package_right');
      $('#s3_generated_form h2').addClass('s3_package_small_top');
      // $('#s3_generated_form_body').append(orderInfo);
    }

    $('select[name=country]').change(function() {
      if($(this).val() != 'FI') {
        $('.s3_abroad_delivery').html('<br/>Ulkomaille lähetettävien painettujen lehtien tilaushintoihin lisätään postimaksu.');
      } else {
        $('.s3_abroad_delivery').html('');
      }
    });
            
    $('.s3_generated_link').css('color', fd.highlightcolor);
    $('input').css('-webkit-user-select', 'auto');
    //$('input[type=text]').css('margin-bottom', '0px');
    $('.gen_asteriks').css('color', fd.highlightcolor);        
           
    if ($(window).width() < 769) {
      document.getElementById('s3_existing_customer').scrollIntoView();
    } else if($('.s3_package').length > 1) {
      document.getElementById('s3_order_info').scrollIntoView();
    }

    if(_p.paymentmethodhidden) {
      $('#s3_payment_method').hide();
    } else {
      $('#s3_payment_method').show();
    }

    addEmailChecker(document.getElementById('s3_email_field'));
    //addEmailChecker(document.getElementById('s3_existing_customer_email_field'), mobileOrderAccountResponse);
    // no need to check recipients email
//    if(!_p.print && _p.digi) {
//      addEmailChecker(document.getElementById('giftorder_s3_email_field'));
//    }

    if(_p.digi == 0) {
      $('#s3_password_fields').hide();
    }

    /*
    // for mobile order
    $('[name="s3_existingcustomer_toggle"]').change(function() {
        if ($(this).val() === "existing_customer") {
            $('.s3_existing_customer_fields').css('display', 'block');
            $('#s3_order_info').css('display', 'none');
        }
        else {
            $('.s3_existing_customer_fields').css('display', 'none');
            $('#s3_order_info').css('display', 'block');
        }

    });*/

    $('#s3_btn_usage_terms').click(function(event) {
      event.preventDefault();
      $('.s3_usage_terms-wrapper').css('display', 'block');
    });


    $('#s3_continue_button').click(function(event) {
      event.preventDefault();
      var emailToCheck = $('#s3_existing_customer_email_field').val();

      if (emailToCheck && emailToCheck.length > 2 && validateEmail(emailToCheck)) {
        checkEmail($('#s3_existing_customer_email_field').val(), mobileOrderAccountResponse, null);
      } else {
        alert('Anna sähköpostiosoite jatkaaksesi');
      }
    });

    $('#s3_cancel_button').click(function(event) {
      event.preventDefault();
      $('#s3_existing_customer').css('display', 'none');
      $('#s3_order_info').css('display', 'block');
    });

    $('#s3_btn_forgotpass, #giftorder_s3_btn_forgotpass').click(function() {
      if($(this).attr('id') == 'giftorder_s3_btn_forgotpass') {
        var email = $('#giftorder_s3_email_field').val();
      } else {
        var email = $('#s3_email_field').val();
      }

      resetPassword(email);

      /* TODO: WP stuff
      if (typeof Asteikko !== undefined) {
          Asteikko.submitAccountForm("s3_form_forgotpass", s3OnForgotPasswordDone);
      }
      else {
          
      }*/
    });          
  }
}

function passwordResponse(response) {
  if (response.code === 0) {
    alert("Salasana lähetetty osoitteeseen "+response.email);
  } else {
    alert("Salasanan vaihto epäonnistui. Yritä uudelleen");
  }
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

/**
 * If custom greeting to recipient is selected, fail validation if custom message has no input
 */
function validateGiftOrderGreeting(customGreetingChecked, customGreetingText) {
  var valid = true;
  
  return valid;
}


function resetPassword(email) {
  var form = $('#s3_generated_form form');
  var formData = {
    email: email,
    isPasswordCheck: 1
  }
  
  formData.baseurl = form.find('[name="baseurl"]').val();
  
  if (window.XDomainRequest) {
    var xdr = new XDomainRequest();
    xdr.onload = function() {
      var response = JSON.parse(xdr.responseText);
      passwordResponse(response);
    };
    
    xdr.onprogress = function() {};
    xdr.open("POST", formData.baseurl);
    
    setTimeout(function () {
      xdr.send("json=" + JSON.stringify(formData));
    }, 0);
  } else {
    $.ajax({
      type : 'POST',
      url : formData.baseurl,//'https://accounts-dev.viivamedia.fi/blackbox/blackbox.php',
      data : { json : JSON.stringify(formData)},
      dataType: 'json',
      success : function(response) {
        passwordResponse(response);    
      }
    }).fail(function(jqXHR, textStatus, errorThrown) { });
  }
}


function checkEmail(email, cb, field) {
  var form = $('#s3_generated_form form');

  var formData = {
    email: email,
    isEmailCheck: 1
  }

  formData.baseurl = form.find('[name="baseurl"]').val();

  if (window.XDomainRequest) {
    (function(_cb) {
      var xdr = new XDomainRequest();
      
      xdr.onload = function() {
        var response = JSON.parse(xdr.responseText);
        
        if (typeof _cb !== "undefined" && typeof _cb === "function") {
          _cb(response);
        } else {
          emailResponse(response, field);
        }
      };
      
      xdr.onprogress = function() {};
      xdr.open("POST", formData.baseurl);
      xdr.timeout = 30000;
      
      setTimeout(function() {
        xdr.send("json=" + JSON.stringify(formData));
      }, 0);
    })(cb);
  } else {
    (function(_cb) {
      $.ajax({
        type: 'POST',
        url: formData.baseurl, //'https://accounts-dev.viivamedia.fi/blackbox/blackbox.php',
        data: {
          json: JSON.stringify(formData)
        },
        dataType: 'json',
        success: function(response) {
          if (typeof _cb !== "undefined" && typeof _cb === "function") {
            _cb(response);
          } else {
            emailResponse(response, field);
          }
          //return response.code;
        }
      }).fail(function(jqXHR, textStatus, errorThrown) {});
    })(cb);
  }
}

function mobileOrderAccountResponse(response) {
  var form = $('#s3_generated_form form');
  if (response.email) {
      $('.s3_existing_customer_fields').css('display', 'block');
      $('#s3_order_info').css('display', 'none');
      $('.s3_mobile_order_upper_fields').css('display', 'none');
  } else {
      $('#s3_existing_customer').css('display', 'none');
      $('#s3_order_info').css('display', 'block');
      $('#s3_account_notfound').css('display', 'block');
      form.find('[name=email]').val(response.search);
  }
}

function showMobileOrderSuccess() {
  $('#s3_existing_customer').css('display', 'none');
  $('#s3_mobile_order_success_block').css('display', 'block');
  $('#s3_generated_form_body').css('display', 'none');
  $('#s3_generated_form_header').css('display', 'none');
}


function emailResponse(response, field) {
  var form = $('#s3_generated_form form');
  var onlyPrint = form.find('[name="s3digi"]').val();
  var targetID = field.id;
  var orderType = form.find('[name="s3_ordertype"]:checked').val();
  $('#s3_password_fields').css('display', 'block');

  if (response.email) {
    // Email found
    form.find('[name="password1"]').show(); 
    form.find('[name="password2"]').hide();
    $('#s3_password2').hide();
    $('#s3_forgotPassFormWrap').show();
    if (!response.password) {
      $('#s3_no_password').css('display', 'block');
      $('#s3_has_password').css('display', 'none');
      $('#s3_password_help_text').css('display', 'none');
    } else {
      $('#s3_no_password').css('display', 'none');
      $('#s3_has_password').css('display', 'block');
      $('#s3_password_help_text').css('display', 'block');
    }
    
    // hide recipients password fields always
    $('#s3_gift_order_password_fields').hide();
  } else {
    // Email not found
    // If gift order, hide givers password fields
    if (orderType == 'gift_order') {
      $('#s3_password_fields').hide();
    } else {
      form.find('[name="password2"]').show();
      $('#s3_password2').show();
      $('#s3_password2').css('display', 'block');
      $('#s3_password_help_text').hide();
      $('#s3_forgotPassFormWrap').hide();
      $('#s3_no_password').css('display', 'none');
  
      if ( !response.email && onlyPrint == "0") {
        $('#s3_password_fields').hide();
      }
    }
    // hide recipients password fields always
    $('#s3_gift_order_password_fields').hide();
  }
}

function generateRandomPassword() {
  var text = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ ) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return text;
}

var s3OrderProcessing = false;

function sendOrder(event) {
  console.log(event.currentTarget);
  refreshSuffix="";

  if (s3OrderProcessing) {
    return false;
  }

  s3OrderProcessing = true;
  var form = $('#s3_generated_form form');

  // disable submit button and add gif animation to prevent multiple clicks
  form.find('input[type="submit"]').prop('disabled', true);
  form.find('input[type="submit"]').addClass('s3_submit_button_sending');

  if(form.find('[name="s3_existing_customer_email"]').val() && validateEmail(form.find('[name="s3_existing_customer_email"]').val())) {
    var email = form.find('[name="s3_existing_customer_email"]').val();
    if (!s3CheckEmptyEmail(email)) {
      alert('Sähköpostiosoite virheellinen! Tarkista, että olet kirjoittanut sen oikein');
      form.find('input[type="submit"]').removeClass('s3_submit_button_sending');
      form.find('input[type="submit"]').prop('disabled', false);
      s3OrderProcessing = false;
      return false;
    }
    event.preventDefault();
    finishOrder();
  } else {
    var email = form.find('[name="email"]').val();

    if (!s3CheckEmptyEmail(email)) {
      alert('Sähköpostiosoite virheellinen! Tarkista, että olet kirjoittanut sen oikein');
      form.find('input[type="submit"]').removeClass('s3_submit_button_sending');
      form.find('input[type="submit"]').prop('disabled', false);
      s3OrderProcessing = false;
      return false;
    }

    if(!!form.find('[name=s3_ordertype]:checked').val()) {
      if(form.find('[name=s3_ordertype]:checked').val() == 'gift_order') {
        var giftOrderEmail = form.find('[name=giftorder_email]').val();
                       
        // email is mandatory if gift is digi or if user wants to sent custom greeting to recipient
        var s3digi = form.find('input[name="s3digi"]').val();
        var sendCustomGreeting = form.find('input[name="sendCustomGreetingToGiftRecipient"]:checked');
        if((s3digi == 1 || sendCustomGreeting.length > 0) && !s3CheckEmptyEmail(giftOrderEmail)) {
          alert('Saajan sähköpostiosoite virheellinen! Tarkista, että olet kirjoittanut sen oikein');
          form.find('input[type="submit"]').removeClass('s3_submit_button_sending');
          form.find('input[type="submit"]').prop('disabled', false);
          s3OrderProcessing = false;
          return false;
        }
        // email is valid, but check that is not same as givers email
        if (s3digi == 1 && giftOrderEmail == email) {
          alert('Saajan sähköpostiosoite ei saa olla sama kuin lahjan antajan!');
          form.find('input[type="submit"]').removeClass('s3_submit_button_sending');
          form.find('input[type="submit"]').prop('disabled', false);
          s3OrderProcessing = false;
          return false;
        }
        // validate gift greeting
        // currently not enabled, but just in case customer wants this
        // this IS NOT tested!
//        if (!validateGiftOrderGreeting(form.find('#sendCustomGreetingToGiftRecipient').attr('checked'), form.find('#customGreetingForGiftRecipient').text())) {
//          alert('Kirjoita viesti lahjan saajalle!');
//          form.find('input[type="submit"]').removeClass('s3_submit_button_sending');
//          form.find('input[type="submit"]').prop('disabled', false);
//          s3OrderProcessing = false;
//          return false;
//        }
      }
    } 
    event.preventDefault();     
    var found = checkEmail(email, finishOrder);
  }
}

function s3CheckEmptyEmail(email) {
  if (typeof email !== 'undefined' && email !== null && validateEmail(email) && email.length > 2 && email.indexOf(' ') == -1) {
    return true;
  } else {
    return false;
  }
}

function finishOrder(res){
  s3OrderProcessing = false;
  var form = $('#s3_generated_form form');   
  var formData = {};

  if (!!form.find('[name="s3_ordertype"]:checked').val()){
    if(form.find('[name="s3_ordertype"]:checked').val() == 'gift_order') {
      formData.isGiftOrder = true;
      // set empty placeholder for password, it is not needed if gifting order and giver has not account
      formData.password = '';
    } else {
      formData.isGiftOrder = false;
    }
  }

  var onlyPrint = form.find('[name="s3digi"]').val();

  if(res && res.code == 1 && onlyPrint == "0") {
    formData.password = generateRandomPassword();
  }

  if (!!form.find('[name="servicepointid"]').val()) {
    formData.service = form.find('[name="servicepointid"]').val();
  }
    
  if (!!form.find('[name="packageid"]').val()) {
    formData.package = form.find('[name="packageid"]').val();
  }
    
  if (!!form.find('[name="email"]').val()) {
    formData.email = form.find('[name="email"]').val();
  }    
  
  if (!!form.find('[name="password1"]').val()) {
    if(res && res.code == 0) {
      formData.password = form.find('[name="password1"]').val();
    } else {
      if (form.find('[name="password1"]').val() == form.find('[name="password2"]').val()) {
        formData.password = form.find('[name="password1"]').val();
      } else {
        // passwords do not match, alert user
        return orderResponse(null, true);
      }
    }
  }

  formData.paymentMethod = form.find('[name="laskutustapa"]:checked').val();

  if (typeof formData.paymentMethod === "undefined") {
    formData.paymentMethod = "leka";
  }

    
  if (!!form.find('[name="firstname"]').val()) {
    formData.firstname = form.find('[name="firstname"]').val();
  }    
  
  if (!!form.find('[name="lastname"]').val()) {
    formData.lastname = form.find('[name="lastname"]').val();
  }    
  
  if (!!form.find('[name="streetaddress"]').val()) {
    formData.streetaddress = form.find('[name="streetaddress"]').val();
  }    
  
  if (!!form.find('[name="postcode"]').val()) {
    formData.postcode = form.find('[name="postcode"]').val();
  }    
  
  if (!!form.find('[name="city"]').val()) {  
    formData.city = form.find('[name="city"]').val();
  }    
  
  formData.phoneMarketing = false;
  if (!!form.find('[name="phonemarketing"]').prop('checked')) {
    formData.phoneMarketing = true;
  }
    
  formData.emailMarketing = false;
  if (form.find('[name="emailmarketing"]').prop('checked')) {
    formData.emailMarketing = true;
  }
    
  if (!!form.find('[name="phone"]').val()) {
    formData.phone = form.find('[name="phone"]').val();
  }

  if (form.find('[name="customernumber"]').length) {
    if (!!form.find('[name="customernumber"]').val()) {
      formData.customernumber = form.find('[name="customernumber"]').val();
    }
  }

  if(typeof formData.isGiftOrder != 'undefined' && formData.isGiftOrder) {    
    formData.giftRecipient = {};
    if(!!form.find('[name=giftorder_firstname]').val()) {
      formData.giftRecipient.email = form.find('[name=giftorder_email]').val();
    }

    if(!!form.find('[name=giftorder_firstname]').val()) {
      formData.giftRecipient.firstname = form.find('[name=giftorder_firstname]').val();
    }

    if(!!form.find('[name=giftorder_lastname]').val()) {
      formData.giftRecipient.lastname = form.find('[name=giftorder_lastname]').val();
    }

    if(!!form.find('[name=giftorder_streetaddress]').val()) {
      formData.giftRecipient.streetaddress = form.find('[name=giftorder_streetaddress]').val();
    }

    if(!!form.find('[name=giftorder_postcode]').val()) {
      formData.giftRecipient.postcode = form.find('[name=giftorder_postcode]').val();
    }

    if(!!form.find('[name=giftorder_city]').val()) {
      formData.giftRecipient.city = form.find('[name=giftorder_city]').val();
    }

    if(!!form.find('[name=giftorder_country]').val()) {
      formData.giftRecipient.country = form.find('[name=giftorder_country]').val();
    }

    if(!!form.find('[name=giftorder_phone]').val()) {
      formData.giftRecipient.phone = form.find('[name=giftorder_phone]').val();
    }
  }
  
  if (form.find('[name="sendCustomGreetingToGiftRecipient"]:checked').length > 0) {
    formData.sendCustomGreetingToGiftRecipient = true;
  } else {
    formData.sendCustomGreetingToGiftRecipient = false;
  }
  
  if(!!form.find('[name=customGreetingToGiftRecipient]').val()) {
    formData.customGreetingToGiftRecipient = form.find('[name=customGreetingToGiftRecipient]').val();
  }
  
  if(!!form.find('[name=s3digi]').val()) {
    formData.s3digi = form.find('[name=s3digi]').val();
  }
  
  /*
      if(res && res.code == 0) {
          formdData.giftRecipient.Password = form.find('[name="giftorder_password1"]').val();
      }
      else if(res && res.code == 1 && onlyPrint == "0"){
          formdData.giftRecipient.Password = generateRandomPassword();
      }
      else{  
          if (form.find('[name="giftorder_password1"]').val() == form.find('[name="giftorder_password2"]').val()) {                
              formdData.giftRecipient.Password = form.find('[name="giftorder_password1"]').val();
          }
      }
  */

  if(!!form.find('[name="s3_giveaways"]').val()) {
    formData.giveAwayPackage = form.find('[name="s3_giveaways"]').val();
  } else {
    formData.giveAwayPackage = "";
  }
    
  formData.country = form.find('[name="country"]').val();
  formData.baseurl = form.find('[name="baseurl"]').val();

  if (form.find('[name="s3_existing_customer_email"]').val() && validateEmail(form.find('[name="s3_existing_customer_email"]').val())) {
    formData.isMobileOrder = true;
    formData.email = form.find('[name="s3_existing_customer_email"]').val();
    formData.customernumber = "";
    formData.phone = "";
    formData.password = "";
    formData.paymentMethod = "";
    formData.firstname = "";
    formData.lastname = "";
    formData.streetaddress = "";
    formData.postcode = "";
    formData.city = "";
    formData.country = "";
    formData.phoneMarketing = "";
    formData.emailMarketing = "";
    formData.giveAwayPackage = "";
  }
   
  if (window.XDomainRequest) {
    var xdr = new XDomainRequest();
    xdr.onload = function() {
      var response = JSON.parse(xdr.responseText);
      orderResponse(response);
    };
    
    xdr.onprogress = function() {};
    xdr.open("POST", formData.baseurl);
      
    setTimeout(function () {
      xdr.send("json=" + JSON.stringify(formData));
    }, 0);  
  } else {
    $.ajax({
      type : 'POST',
      url : formData.baseurl,//'https://accounts-dev.viivamedia.fi/blackbox/blackbox.php',
      data : { json : JSON.stringify(formData) },
      dataType: 'json',
      success : function(response) {
        orderResponse(response);
      }
    }).fail(function(jqXHR, textStatus, errorThrown) {  });
  }
    
  function orderResponse(response, forcePasswordsDoNotMatchError) {
    if (typeof forcePasswordsDoNotMatchError == 'undefined') {
      forcePasswordsDoNotMatchError = false;
    }
    if (response && response.url != null) {
      if(typeof onlyPrint !== 'undefined' && onlyPrint != "0" && formData.paymentMethod != 'payex_credit' && window.location.protocol != 'https:' && !window.XDomainRequest) {
        var getLocation = function(href) {
          var l = document.createElement("a");
          l.href = href;
          return l;
        };

        var service = getLocation(response.url);
        var serviceURL = service.hostname;
  
        jQuery.ajax( 'http://'+serviceURL+'/asauth/ajax/', {
          method: 'post',
          data: {
            asauth: 'asauth',
            action: 'login',
            email: formData.email,
            password: formData.password
          },
          xhrFields: {
            withCredentials: true
          }
        })
        .always( function() {
          window.location = response.url;
        });
      } else { 
        window.location = response.url;
      }
    } else {
      var form = $('#s3_generated_form form');
      form.find('input[type="submit"]').removeClass('s3_submit_button_sending');
      
      if (forcePasswordsDoNotMatchError) {
        alert('Salasanat eivät täsmää!');
      } else {
        if (response.code == 0) {
          alert("Kiitos tilauksesta, voit kirjautua palveluun");
        } else if (response.code == 1){
          alert("Lahjatilaus onnistui");
        } else if (response.code == 4){
          alert("Tilausta ei voitu tehdä, täytä puuttuvat pakolliset kentät!");
        } else if (response.code == 5) { // This is buggy! 
          alert("Tilausta ei voitu tehdä, sähköpostiosoite on jo rekisteröity");
        } else if (response.code == 7) {
          alert("Tilausta ei voitu tehdä, salasana on virheellinen");
        } else if  (response.code == 9) {
          alert("Tilausta ei voitu tehdä, tarkasta asiakasnumero.");
        } else if  (response.code == 10) {
          alert("Tilausta ei voitu tehdä, sähköpostiosoite ei vastaa asiakasnumeroon liitettyä sähköpostiosoitetta. Jos haluat vaihtaa sähköpostiosoitteesi, ota yhteyttä asiakaspalveluun.");
        } else if  (response.code == 11) {
          alert("Tilausta ei voitu tehdä, asiakasnumerolla ei löydy etuun oikeuttavia tilauksia.");
        } else if (response.code == 12) {
          alert('Tilausta ei voitu tehdä, oheistuotetta ei löydy');
        } else if (response.code == 13) {
          alert('Tilausta ei voitu tehdä, sähköpostiosoitetta ei löydy järjestelmästä. Voit luoda uuden tilin itsellesi')
        } else if (response.code == 14) {
          showMobileOrderSuccess();
        } else if (response.code == 15) {
          alert('Sähköpostiosoite osoite virheellinen!');
        } else if (response.code == 16) {
          alert('Tuotetta ei voi tilata lahjaksi!');
        } else {
          alert("Tilauksessa tapahtui virhe! Yritä myöhemmin uudestaan");
        }
      }

      // disable submit button and add gif animation to prevent multiple clicks
      form.find('input[type="submit"]').prop('disabled', false);
    }
  }
}

(function() {
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
      for (var i = (start || 0), j = this.length; i < j; i++) {
        if (this[i] === obj) { return i; }
      }
      return -1;
    }
  }

  var resize = setInterval(function() {
    refreshPackages();
  }, 200);

  setTimeout(function(){
    clearInterval(resize);
  }, 5000);

  var domready = window.setInterval(function() {
    if (document.readyState === 'complete') {
      window.clearInterval(domready);
      if (typeof s3key === 'undefined') {
        return;
      }

      if(typeof s3loadjq === 'undefined') {
        initLandingPage();
      } else {
        if (s3loadjq) {
          var headTag = document.getElementsByTagName("head")[0];
          var jqTag = document.createElement('script');
          jqTag.type = 'text/javascript';
          jqTag.src = '//code.jquery.com/jquery-1.11.0.min.js';
          jqTag.onload = initLandingPage;
          headTag.appendChild(jqTag);
        } else {
          initLandingPage();
        }
      }
    }
  }, 100);
})();
