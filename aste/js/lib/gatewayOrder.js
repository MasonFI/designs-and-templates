

(function() {

  "use strict";

  var GatewayOrder = {};

  GatewayOrder.init = function () {
    GatewayOrder.form = $('#gatewayOrderForm');
    GatewayOrder.orderProcessing = false;
    GatewayOrder.hasPrint = GatewayOrder.form.find('[name="gateway_order_hasprint"]').val();
    GatewayOrder.hasDigi = GatewayOrder.form.find('[name="gateway_order_hasdigi"]').val();
    GatewayOrder.hidePayment = GatewayOrder.form.find('[name="gateway_order_paymentmethod_hidden"]').val();
    GatewayOrder.originalCountry = GatewayOrder.form.find('[name="gateway_order_customer_country"]').val();
    GatewayOrder.selectCountry();
    GatewayOrder.bindListeners();
    GatewayOrder.checkPayment();
    
  } 

  GatewayOrder.checkPayment = function() {
    if (GatewayOrder.hidePayment) {
      $('.order_paymentmethod').css('display', 'none');
    }
  }

  GatewayOrder.selectCountry = function() {
    $('[name="gateway_order_country"]').val(GatewayOrder.originalCountry);
  }

  GatewayOrder.bindListeners = function() {
    $('#gateWayOrderButton').click(function() {
      GatewayOrder.sendForm();
    });

   $('#gateway_order_btn_forgotpass').click(function() {
    var email = $('#gateway_order_email').text()
      GatewayOrder.resetPassword(email);
    });

    GatewayOrder.form.find('[name="gateway_order_paymentmethod"]').on('change', function(event) {
      if ($(this).val() === 'payex_credit' && GatewayOrder.hasPrint) {              
        $('[name="gateway_order_country"]').html('<option value="FI" selected>Suomi</option>');
        $('<div/>').addClass("").html(
          '<div class="country-alert">'+
          'Huom: Suomen ulkopuolella lasku on ainoa valittavissa oleva maksutapa, mikäli paketti sisältää printtilehden.'+
          '</div>'
          ).insertAfter($('[name="gateway_order_country"]'));
        }
        else if ($(this).val() === 'leka') {
          $('[name="gateway_order_country"]').html('<option value="AF">Afganistan</option><option value="AX">Ahvenanmaa</option><option value="NL">Alankomaat</option><option value="AN">Alankomaiden Antillit</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">Amerikan Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarktis</option><option value="AG">Antigua ja Barbuda</option><option value="AE">Arabiemiirikunnat</option><option value="AR">Argentiina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AC">Ascension Island</option><option value="AU">Australia</option><option value="AZ">Azerbaidžan</option><option value="BS">Bahama</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BE">Belgia</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia ja Hertsegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet’nsaari</option><option value="BR">Brasilia</option><option value="IO">Brittiläinen Intian valtameren alue</option><option value="VG">Brittiläiset Neitsytsaaret</option><option value="BN">Brunei</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KY">Caymansaaret</option><option value="EA">Ceuta, Melilla</option><option value="CL">Chile</option><option value="CP">Clippertoninsaari</option><option value="CK">Cookinsaaret</option><option value="CR">Costa Rica</option><option value="DG">Diego Garcia</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominikaaninen tasavalta</option><option value="EC">Ecuador</option><option value="EG">Egypti</option><option value="SV">El Salvador</option><option value="ER">Eritrea</option><option value="ES">Espanja</option><option value="ET">Etiopia</option><option value="ZA">Etelä-Afrikka</option><option value="GS">Etelä-Georgia ja Eteläiset Sandwichsaaret</option><option value="FK">Falklandinsaaret</option><option value="FO">Färsaaret</option><option value="FJ">Fidži</option><option value="PH">Filippiinit</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GD">Grenada</option><option value="GL">Grönlanti</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GG">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard ja McDonaldinsaaret</option><option value="HN">Honduras</option><option value="HK">Hongkong</option><option value="ID">Indonesia</option><option value="IN">Intia</option><option value="IQ">Irak</option><option value="IR">Iran</option><option value="IE">Irlanti</option><option value="IS">Islanti</option><option value="IL">Israel</option><option value="IT">Italia</option><option value="TL">Itä-Timor</option><option value="AT">Itävalta</option><option value="JM">Jamaika</option><option value="JP">Japani</option><option value="YE">Jemen</option><option value="JE">Jersey</option><option value="JO">Jordania</option><option value="CX">Joulusaari</option><option value="KH">Kambodža</option><option value="CM">Kamerun</option><option value="CA">Kanada</option><option value="IC">Kanariansaaret</option><option value="CV">Kap Verde</option><option value="KZ">Kazakstan</option><option value="KE">Kenia</option><option value="CF">Keski-Afrikan tasavalta</option><option value="CN">Kiina</option><option value="KG">Kirgisia</option><option value="KI">Kiribati</option><option value="CO">Kolumbia</option><option value="KM">Komorit</option><option value="CD">Kongon demokraattinen tasavalta</option><option value="CG">Kongon tasavalta</option><option value="CC">Kookossaaret</option><option value="KP">Korean demokraattinen kansantasavalta</option><option value="KR">Korean tasavalta</option><option value="GR">Kreikka</option><option value="HR">Kroatia</option><option value="CU">Kuuba</option><option value="KW">Kuwait</option><option value="CY">Kypros</option><option value="LA">Laos</option><option value="LV">Latvia</option><option value="LS">Lesotho</option><option value="LB">Libanon</option><option value="LR">Liberia</option><option value="LY">Libya</option><option value="LI">Liechtenstein</option><option value="LT">Liettua</option><option value="LU">Luxemburg</option><option value="EH">Länsi-Sahara</option><option value="MO">Macao</option><option value="MG">Madagaskar</option><option value="MK">Makedonian tasavalta|Makedonia</option><option value="MW">Malawi</option><option value="MV">Malediivit</option><option value="MY">Malesia</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="IM">Mansaari</option><option value="MA">Marokko</option><option value="MH">Marshallinsaaret</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Meksiko</option><option value="FM">Mikronesian liittovaltio</option><option value="MD">Moldova</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MZ">Mosambik</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolkinsaari</option><option value="NO">Norja</option><option value="CI">Norsunluurannikko</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestiina</option><option value="PA">Panama</option><option value="PG">Papua-Uusi-Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="MP">Pohjois-Mariaanit</option><option value="PN">Pitcairn</option><option value="PT">Portugali</option><option value="PR">Puerto Rico</option><option value="PL">Puola</option><option value="GQ">Päiväntasaajan Guinea</option><option value="QA">Qatar</option><option value="FR">Ranska</option><option value="FX">Ranska (Eurooppaan kuuluvat osat)</option><option value="TF">Ranskan eteläiset alueet</option><option value="GF">Ranskan Guayana</option><option value="PF">Ranskan Polynesia</option><option value="RE">Réunion</option><option value="RO">Romania</option><option value="RW">Ruanda</option><option value="SE">Ruotsi</option><option value="SH">Saint Helena</option><option value="KN">Saint Kitts ja Nevis</option><option value="LC">Saint Lucia</option><option value="PM">Saint-Pierre ja Miquelon</option><option value="VC">Saint Vincent ja Grenadiinit</option><option value="DE">Saksa</option><option value="SB">Salomonsaaret</option><option value="ZM">Sambia</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">São Tomé ja Príncipe</option><option value="SA">Saudi-Arabia</option><option value="SN">Senegal</option><option value="RS">Serbia</option><option value="SC">Seychellit</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SO">Somalia</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="FI" selected>Suomi</option><option value="SR">Suriname</option><option value="SJ">Svalbard ja Jan Mayen</option><option value="SZ">Swazimaa</option><option value="CH">Sveitsi</option><option value="SY">Syyria</option><option value="TJ">Tadžikistan</option><option value="TW">Taiwan</option><option value="TZ">Tansania</option><option value="DK">Tanska</option><option value="TH">Thaimaa</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad ja Tobago</option><option value="TA">Tristan da Cunha</option><option value="TD">Tšad</option><option value="CZ">Tšekki</option><option value="TN">Tunisia</option><option value="TR">Turkki</option><option value="TM">Turkmenistan</option><option value="TC">Turks- ja Caicossaaret</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraina</option><option value="HU">Unkari</option><option value="UY">Uruguay</option><option value="NC">Uusi-Kaledonia</option><option value="NZ">Uusi-Seelanti</option><option value="UZ">Uzbekistan</option><option value="BY">Valko-Venäjä</option><option value="VU">Vanuatu</option><option value="VA">Vatikaanivaltio</option><option value="VE">Venezuela</option><option value="RU">Venäjä</option><option value="VN">Vietnam</option><option value="EE">Viro</option><option value="WF">Wallis ja Futunasaaret</option><option value="GB">Yhdistynyt kuningaskunta</option><option value="US">Yhdysvallat</option><option value="VI">Yhdysvaltain Neitsytsaaret</option><option value="UM">Yhdysvaltain pienet erillissaaret</option><option value="ZW">Zimbabwe</option>');
          GatewayOrder.selectCountry();
          $('.country-alert').remove();
          }
      });
  }

  GatewayOrder.resetPassword = function(email) {

    var formData = {
        email: email,
        isPasswordCheck: 1
    }

    formData.baseurl = "https://"+GatewayOrder.form.find('[name="gateway_order_baseurl"]').val()+"/blackbox/blackbox.php";
  
      $.ajax({  
        type : 'POST',
        url : formData.baseurl,
        data : { json : JSON.stringify(formData)},
        dataType: 'json',
        success : function(response) {
          GatewayOrder.passwordResponse(response);    
                    
        }
        }).fail(function(jqXHR, textStatus, errorThrown) { alert("Salasanan vaihto epäonnistui. Yritä uudelleen"); });
  }

  GatewayOrder.passwordResponse = function(response) {
     if (response.code === 0) {
        alert("Salasana lähetetty osoitteeseen "+response.email);
    }
    else {
         alert("Salasanan vaihto epäonnistui. Yritä uudelleen");
    }
  }

  GatewayOrder.sendForm = function() {

    if (GatewayOrder.orderProcessing) {
      return false;
    }

    GatewayOrder.orderProcessing = true;

    var formData = {};
    var baseurl = "https://"+GatewayOrder.form.find('[name="gateway_order_baseurl"]').val()+"/gateway/customer/finishMobileOrder";
    formData.country = GatewayOrder.form.find('[name="country"]').val();

    if (!!GatewayOrder.form.find('[name="gateway_order_firstname"]').val()) {
      formData.firstname = GatewayOrder.form.find('[name="gateway_order_firstname"]').val();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_lastname"]').val()) {
      formData.lastname = GatewayOrder.form.find('[name="gateway_order_lastname"]').val();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_streetaddress"]').val()) {
      formData.streetaddress = GatewayOrder.form.find('[name="gateway_order_streetaddress"]').val();
    }
     if (!!GatewayOrder.form.find('[name="gateway_order_customernumber"]').val()) {
      formData.customernumber = GatewayOrder.form.find('[name="gateway_order_customernumber"]').val();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_city"]').val()) {
      formData.city = GatewayOrder.form.find('[name="gateway_order_city"]').val();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_phone"]').val()) {
      formData.phone = GatewayOrder.form.find('[name="gateway_order_phone"]').val();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_postcode"]').val()) {
      formData.postcode = GatewayOrder.form.find('[name="gateway_order_postcode"]').val();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_orderid"]').val()) {
      formData.orderid = GatewayOrder.form.find('[name="gateway_order_orderid"]').val();
    }
    if (!!GatewayOrder.form.find('#gateway_order_email').text()) {
      formData.email = GatewayOrder.form.find('#gateway_order_email').text();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_country"]').val()) {
      formData.country = GatewayOrder.form.find('[name="gateway_order_country"]').val();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_paymentmethod"]:checked').val()) {
      formData.paymentMethod = GatewayOrder.form.find('[name="gateway_order_paymentmethod"]:checked').val();
    }
    if (!!GatewayOrder.form.find('[name="gateway_order_password"]').val()) {
      formData.password = GatewayOrder.form.find('[name="gateway_order_password"]').val();
    }
    
    formData.phoneMarketing = true;
    if ($('[name="gateway_order_phonemarketing"]').prop('checked')) {
        formData.phoneMarketing = false;
    }
    
    formData.emailMarketing = true;
    if ($('[name="gateway_order_emailmarketing"]').prop('checked')) {
        formData.emailMarketing = false;
    }

    if (GatewayOrder.hidePayment) {
      formData.paymentMethod = "leka";
    }

    GatewayOrder.formData = formData;
 
    $.ajax({
            type : 'POST',
            url : baseurl,
            data : {json: JSON.stringify( formData )},
            dataType: 'json',
            success : function(response) {
                GatewayOrder.success(response);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) { GatewayOrder.orderProcessing = false; });
  }

  GatewayOrder.success = function(response) {
  
    GatewayOrder.orderProcessing = false;
    if (response.url != null) {

      /*

        if(GatewayOrder.hasDigi && GatewayOrder.formData.paymentMethod === 'leka'){

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
                        email: GatewayOrder.formData.email,
                        password: GatewayOrder.formData.password
                      },
                      xhrFields: {
                        withCredentials: true
                      }
                    } ).always( function() {

                       window.location = response.url;
                    } );          
            }

            else{*/
              if (typeof response.url === "object")
                window.location = response.url["0"];
              else 
                window.location = response.url;
            //}
        
        } else {
            
            if (response.code == 0) {
                alert("Kiitos tilauksesta, voit kirjautua palveluun");
            } else if (response.code == 1){
                alert("Lahjatilaus onnistui");
            } else if (response.code == 4){
                alert("Tilausta ei voitu tehdä, täytä puuttuvat pakolliset kentät!");
            } else if (response.code == 5) { // This is buggy! 
                alert("Tilausta ei voitu tehdä, sähköpostiosoite on jo rekisteröity");
            }else if (response.code == 7) {
                alert("Tilausta ei voitu tehdä, salasana on virheellinen");
            }else if  (response.code == 9) {
                alert("Tilausta ei voitu tehdä, tarkasta asiakasnumero.");
            }else if  (response.code == 10) {
                alert("Tilausta ei voitu tehdä, sähköpostiosoite ei vastaa asiakasnumeroon liitettyä sähköpostiosoitetta. Jos haluat vaihtaa sähköpostiosoitteesi, ota yhteyttä asiakaspalveluun.");
            }else if  (response.code == 11) {
                alert("Tilausta ei voitu tehdä, asiakasnumerolla ei löydy etuun oikeuttavia tilauksia.");
            }else if (response.code == 12) {
                alert('Tilausta ei voitu tehdä, oheistuotetta ei löydy');
            }else if (response.code == 13) {
                alert('Tilausta ei voitu tehdä, virheellinen tilaus');
            }
            else {
                alert("Tilauksessa tapahtui virhe! Yritä myöhemmin uudestaan");
            }
     
        }
  }


  $(document).ready(function() {

    GatewayOrder.init();

  });

})();