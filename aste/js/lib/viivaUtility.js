define(['jquery', 'moment', 'translate'], function($, moment, tr) {
  return {
    apiBase: "../api/admin/beta/",
    apiAnalytics: "../api/analytics/beta/",

    countryCodeSelectHTML: '<select name="country" class="form-control">' +
                             '<option value="AF">Afganistan</option>' +
                             '<option value="AX">Ahvenanmaa</option>' +
                             '<option value="NL">Alankomaat</option>' +
                             '<option value="AN">Alankomaiden Antillit</option>' +
                             '<option value="AL">Albania</option>' +
                             '<option value="DZ">Algeria</option>' +
                             '<option value="AS">Amerikan Samoa</option>' +
                             '<option value="AD">Andorra</option>' +
                             '<option value="AO">Angola</option>' +
                             '<option value="AI">Anguilla</option>' +
                             '<option value="AQ">Antarktis</option>' +
                             '<option value="AG">Antigua ja Barbuda</option>' +
                             '<option value="AE">Arabiemiirikunnat</option>' +
                             '<option value="AR">Argentiina</option>' +
                             '<option value="AM">Armenia</option>' +
                             '<option value="AW">Aruba</option>' +
                             '<option value="AC">Ascension Island</option>' +
                             '<option value="AU">Australia</option>' +
                             '<option value="AZ">Azerbaidžan</option>' +
                             '<option value="BS">Bahama</option>' +
                             '<option value="BH">Bahrain</option>' +
                             '<option value="BD">Bangladesh</option>' +
                             '<option value="BB">Barbados</option>' +
                             '<option value="BE">Belgia</option>' +
                             '<option value="BZ">Belize</option>' +
                             '<option value="BJ">Benin</option>' +
                             '<option value="BM">Bermuda</option>' +
                             '<option value="BT">Bhutan</option>' +
                             '<option value="BO">Bolivia</option>' +
                             '<option value="BA">Bosnia ja Hertsegovina</option>' +
                             '<option value="BW">Botswana</option>' +
                             '<option value="BV">Bouvet’nsaari</option>' +
                             '<option value="BR">Brasilia</option>' +
                             '<option value="IO">Brittiläinen Intian valtameren alue</option>' +
                             '<option value="VG">Brittiläiset Neitsytsaaret</option>' +
                             '<option value="BN">Brunei</option>' +
                             '<option value="BG">Bulgaria</option>' +
                             '<option value="BF">Burkina Faso</option>' +
                             '<option value="BI">Burundi</option>' +
                             '<option value="KY">Caymansaaret</option>' +
                             '<option value="EA">Ceuta, Melilla</option>' +
                             '<option value="CL">Chile</option>' +
                             '<option value="CP">Clippertoninsaari</option>' +
                             '<option value="CK">Cookinsaaret</option>' +
                             '<option value="CR">Costa Rica</option>' +
                             '<option value="DG">Diego Garcia</option>' +
                             '<option value="DJ">Djibouti</option>' +
                             '<option value="DM">Dominica</option>' +
                             '<option value="DO">Dominikaaninen tasavalta</option>' +
                             '<option value="EC">Ecuador</option>' +
                             '<option value="EG">Egypti</option>' +
                             '<option value="SV">El Salvador</option>' +
                             '<option value="ER">Eritrea</option>' +
                             '<option value="ES">Espanja</option>' +
                             '<option value="ET">Etiopia</option>' +
                             '<option value="ZA">Etelä-Afrikka</option>' +
                             '<option value="GS">Etelä-Georgia ja Eteläiset Sandwichsaaret</option>' +
                             '<option value="FK">Falklandinsaaret</option>' +
                             '<option value="FO">Färsaaret</option>' +
                             '<option value="FJ">Fidži</option>' +
                             '<option value="PH">Filippiinit</option>' +
                             '<option value="GA">Gabon</option>' +
                             '<option value="GM">Gambia</option>' +
                             '<option value="GE">Georgia</option>' +
                             '<option value="GH">Ghana</option>' +
                             '<option value="GI">Gibraltar</option>' +
                             '<option value="GD">Grenada</option>' +
                             '<option value="GL">Grönlanti</option>' +
                             '<option value="GP">Guadeloupe</option>' +
                             '<option value="GU">Guam</option>' +
                             '<option value="GT">Guatemala</option>' +
                             '<option value="GG">Guernsey</option>' +
                             '<option value="GN">Guinea</option>' +
                             '<option value="GW">Guinea-Bissau</option>' +
                             '<option value="GY">Guyana</option>' +
                             '<option value="HT">Haiti</option>' +
                             '<option value="HM">Heard ja McDonaldinsaaret</option>' +
                             '<option value="HN">Honduras</option>' +
                             '<option value="HK">Hongkong</option>' +
                             '<option value="ID">Indonesia</option>' +
                             '<option value="IN">Intia</option>' +
                             '<option value="IQ">Irak</option>' +
                             '<option value="IR">Iran</option>' +
                             '<option value="IE">Irlanti</option>' +
                             '<option value="IS">Islanti</option>' +
                             '<option value="IL">Israel</option>' +
                             '<option value="IT">Italia</option>' +
                             '<option value="TL">Itä-Timor</option>' +
                             '<option value="AT">Itävalta</option>' +
                             '<option value="JM">Jamaika</option>' +
                             '<option value="JP">Japani</option>' +
                             '<option value="YE">Jemen</option>' +
                             '<option value="JE">Jersey</option>' +
                             '<option value="JO">Jordania</option>' +
                             '<option value="CX">Joulusaari</option>' +
                             '<option value="KH">Kambodža</option>' +
                             '<option value="CM">Kamerun</option>' +
                             '<option value="CA">Kanada</option>' +
                             '<option value="IC">Kanariansaaret</option>' +
                             '<option value="CV">Kap Verde</option>' +
                             '<option value="KZ">Kazakstan</option>' +
                             '<option value="KE">Kenia</option>' +
                             '<option value="CF">Keski-Afrikan tasavalta</option>' +
                             '<option value="CN">Kiina</option>' +
                             '<option value="KG">Kirgisia</option>' +
                             '<option value="KI">Kiribati</option>' +
                             '<option value="CO">Kolumbia</option>' +
                             '<option value="KM">Komorit</option>' +
                             '<option value="CD">Kongon demokraattinen tasavalta</option>' +
                             '<option value="CG">Kongon tasavalta</option>' +
                             '<option value="CC">Kookossaaret</option>' +
                             '<option value="KP">Korean demokraattinen kansantasavalta</option>' +
                             '<option value="KR">Korean tasavalta</option>' +
                             '<option value="GR">Kreikka</option>' +
                             '<option value="HR">Kroatia</option>' +
                             '<option value="CU">Kuuba</option>' +
                             '<option value="KW">Kuwait</option>' +
                             '<option value="CY">Kypros</option>' +
                             '<option value="LA">Laos</option>' +
                             '<option value="LV">Latvia</option>' +
                             '<option value="LS">Lesotho</option>' +
                             '<option value="LB">Libanon</option>' +
                             '<option value="LR">Liberia</option>' +
                             '<option value="LY">Libya</option>' +
                             '<option value="LI">Liechtenstein</option>' +
                             '<option value="LT">Liettua</option>' +
                             '<option value="LU">Luxemburg</option>' +
                             '<option value="EH">Länsi-Sahara</option>' +
                             '<option value="MO">Macao</option>' +
                             '<option value="MG">Madagaskar</option>' +
                             '<option value="MK">Makedonian tasavalta|Makedonia</option>' +
                             '<option value="MW">Malawi</option>' +
                             '<option value="MV">Malediivit</option>' +
                             '<option value="MY">Malesia</option>' +
                             '<option value="ML">Mali</option>' +
                             '<option value="MT">Malta</option>' +
                             '<option value="IM">Mansaari</option>' +
                             '<option value="MA">Marokko</option>' +
                             '<option value="MH">Marshallinsaaret</option>' +
                             '<option value="MQ">Martinique</option>' +
                             '<option value="MR">Mauritania</option>' +
                             '<option value="MU">Mauritius</option>' +
                             '<option value="YT">Mayotte</option>' +
                             '<option value="MX">Meksiko</option>' +
                             '<option value="FM">Mikronesian liittovaltio</option>' +
                             '<option value="MD">Moldova</option>' +
                             '<option value="MC">Monaco</option>' +
                             '<option value="MN">Mongolia</option>' +
                             '<option value="ME">Montenegro</option>' +
                             '<option value="MS">Montserrat</option>' +
                             '<option value="MZ">Mosambik</option>' +
                             '<option value="MM">Myanmar</option>' +
                             '<option value="NA">Namibia</option>' +
                             '<option value="NR">Nauru</option>' +
                             '<option value="NP">Nepal</option>' +
                             '<option value="NI">Nicaragua</option>' +
                             '<option value="NE">Niger</option>' +
                             '<option value="NIGERIA">Nigeria</option>' +
                             '<option value="NU">Niue</option>' +
                             '<option value="NF">Norfolkinsaari</option>' +
                             '<option value="NO">Norja</option>' +
                             '<option value="CI">Norsunluurannikko</option>' +
                             '<option value="OM">Oman</option>' +
                             '<option value="PK">Pakistan</option>' +
                             '<option value="PW">Palau</option>' +
                             '<option value="PS">Palestiina</option>' +
                             '<option value="PA">Panama</option>' +
                             '<option value="PG">Papua-Uusi-Guinea</option>' +
                             '<option value="PY">Paraguay</option>' +
                             '<option value="PE">Peru</option>' +
                             '<option value="MP">Pohjois-Mariaanit</option>' +
                             '<option value="PN">Pitcairn</option>' +
                             '<option value="PT">Portugali</option>' +
                             '<option value="PR">Puerto Rico</option>' +
                             '<option value="PL">Puola</option>' +
                             '<option value="GQ">Päiväntasaajan Guinea</option>' +
                             '<option value="QA">Qatar</option>' +
                             '<option value="FR">Ranska</option>' +
                             '<option value="FX">Ranska (Eurooppaan kuuluvat osat)</option>' +
                             '<option value="TF">Ranskan eteläiset alueet</option>' +
                             '<option value="GF">Ranskan Guayana</option>' +
                             '<option value="PF">Ranskan Polynesia</option>' +
                             '<option value="RE">Réunion</option>' +
                             '<option value="RO">Romania</option>' +
                             '<option value="RW">Ruanda</option>' +
                             '<option value="SE">Ruotsi</option>' +
                             '<option value="SH">Saint Helena</option>' +
                             '<option value="KN">Saint Kitts ja Nevis</option>' +
                             '<option value="LC">Saint Lucia</option>' +
                             '<option value="PM">Saint-Pierre ja Miquelon</option>' +
                             '<option value="VC">Saint Vincent ja Grenadiinit</option>' +
                             '<option value="DE">Saksa</option>' +
                             '<option value="SB">Salomonsaaret</option>' +
                             '<option value="ZM">Sambia</option>' +
                             '<option value="WS">Samoa</option>' +
                             '<option value="SM">San Marino</option>' +
                             '<option value="ST">São Tomé ja Príncipe</option>' +
                             '<option value="SA">Saudi-Arabia</option>' +
                             '<option value="SN">Senegal</option>' +
                             '<option value="RS">Serbia</option>' +
                             '<option value="SC">Seychellit</option>' +
                             '<option value="SL">Sierra Leone</option>' +
                             '<option value="SG">Singapore</option>' +
                             '<option value="SK">Slovakia</option>' +
                             '<option value="SI">Slovenia</option>' +
                             '<option value="SO">Somalia</option>' +
                             '<option value="LK">Sri Lanka</option>' +
                             '<option value="SD">Sudan</option>' +
                             '<option value="FI" selected="selected">Suomi</option>' +
                             '<option value="SR">Suriname</option>' +
                             '<option value="SJ">Svalbard ja Jan Mayen</option>' +
                             '<option value="SZ">Swazimaa</option>' +
                             '<option value="CH">Sveitsi</option>' +
                             '<option value="SY">Syyria</option>' +
                             '<option value="TJ">Tadžikistan</option>' +
                             '<option value="TW">Taiwan</option>' +
                             '<option value="TZ">Tansania</option>' +
                             '<option value="DK">Tanska</option>' +
                             '<option value="TH">Thaimaa</option>' +
                             '<option value="TG">Togo</option>' +
                             '<option value="TK">Tokelau</option>' +
                             '<option value="TO">Tonga</option>' +
                             '<option value="TT">Trinidad ja Tobago</option>' +
                             '<option value="TA">Tristan da Cunha</option>' +
                             '<option value="TD">Tšad</option>' +
                             '<option value="CZ">Tšekki</option>' +
                             '<option value="TN">Tunisia</option>' +
                             '<option value="TR">Turkki</option>' +
                             '<option value="TM">Turkmenistan</option>' +
                             '<option value="TC">Turks- ja Caicossaaret</option>' +
                             '<option value="TV">Tuvalu</option>' +
                             '<option value="UG">Uganda</option>' +
                             '<option value="UA">Ukraina</option>' +
                             '<option value="HU">Unkari</option>' +
                             '<option value="UY">Uruguay</option>' +
                             '<option value="NC">Uusi-Kaledonia</option>' +
                             '<option value="NZ">Uusi-Seelanti</option>' +
                             '<option value="UZ">Uzbekistan</option>' +
                             '<option value="BY">Valko-Venäjä</option>' +
                             '<option value="VU">Vanuatu</option>' +
                             '<option value="VA">Vatikaanivaltio</option>' +
                             '<option value="VE">Venezuela</option>' +
                             '<option value="RU">Venäjä</option>' +
                             '<option value="VN">Vietnam</option>' +
                             '<option value="EE">Viro</option>' +
                             '<option value="WF">Wallis ja Futunasaaret</option>' +
                             '<option value="GB">Yhdistynyt kuningaskunta</option>' +
                             '<option value="US">Yhdysvallat</option>' +
                             '<option value="VI">Yhdysvaltain Neitsytsaaret</option>' +
                             '<option value="UM">Yhdysvaltain pienet erillissaaret</option>' +
                             '<option value="ZW">Zimbabwe</option>' +
                           '</select>',

    paymentTypeSelectHTML: '<select name="paymentType">' +
                             '<option value="fixed">' + tr("fixed", "capitalizefirst") + "</option>" +
                             '<option value="renewing">' + tr("renewing", "capitalizefirst") + "</option>" +
                             '<option value="recurring">' + tr("recurring", "capitalizefirst") + "</option>" +
                           '</select>',

    arrayToObject: function(arr) {
      if (typeof arr !== "undefined" && arr && arr instanceof Array) {
        var obj = {};

        $.each(arr, function() {
          if (obj[this.name]) {
            if (!(obj[this.name] instanceof Array)) {
              obj[this.name] = [obj[this.name]];
            }
            obj[this.name].push(typeof this.value !== "undefined" ? this.value : '');
          } else {
            obj[this.name] = typeof this.value !== "undefined" ? this.value : '';
          }
        });

        return obj;
      } else {
        return null;
      }
    },

     validateEmail: function(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    },

    endOfDay: function(date) {
      if (typeof date !== "undefined" && date && date instanceof Date) {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        return date;
      } else {
        return null;
      }
    },

    dateToUTCString: function(date) {
      if (typeof date !== "undefined" && date && date instanceof Date) {
        return moment.utc(date).format();
      } else {
        return null;
      }
    },

    parseDate: function(date, format) {
      if (typeof date !== "undefined" && date) {
        if (typeof format !== "undefined" && format) {
          return moment(date).format(format);
        } else {
          return moment(date).format("D.M.YYYY H:mm:ss");
        }
      } else {
        return null;
      }
    },
    
    exportToCsv: function(data, filename) {
      // '\ufeff' is needed to euro sign to show properly
      var blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
      }
    },
    
    convertTableToCsvData: function($table) {
      if (!$table) {
        return null;
      }
      var csvFile = '';
      var rows = $table.find('tr:has(th), tr:has(td)')
      
      rows.each(function(index) {
        var row = $(this);
        var finalVal = '';
        var colCounter = 0;
        $(this).children("td,th").each(function() {
          var col = $(this);
          var innerValue = col.text();
          if (col instanceof Date) {
              innerValue = col.toLocaleString();
          };
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0) {
              result = '"' + result + '"';
          }
          if (colCounter > 0) {
            finalVal += ',';
          }
          finalVal += result;
          // add colspans as empty cols
          if (col.attr('colspan')) {
            for (var i=1;i<col.attr('colspan');i++) {
              finalVal += ',';
            }
          }
          colCounter++;
        });
        csvFile += finalVal + '\n';
      });
      return csvFile;
    }
  };
});
