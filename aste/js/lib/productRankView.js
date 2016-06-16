define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility',
        'viivaTableView', 'viivaFormElements', 'viivaListBox', 'viivaDataTable',
        'dialogManager', 'viivaNotification', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaTableView, ViivaFormElements, ViivaListBox,
                ViivaDataTable, DialogManager, Notification) {


  return function(options) {
    return Ember.View.extend({
      // Effectively document ready
      didInsertElement: function() {

        var _this = this;
        var jRoot = _this.$("");

        this.createView(jRoot);
        this.addEventListeners(_this);

        if (typeof pageSetUp == "function") {
          pageSetUp(jRoot);
        }
      },
      addEventListeners: function(_this) {

        $('#calculate-product-total').click(function(){
          _this.calculatePoints();

        });
      
 
      },
      getCustomerProducts: function() {

        var min = 0;
        var max = 2;

        var customerProducts = [];
        var numberOfProducts = Math.floor(Math.random() * (max - min + 1)) + min;

        for (var i = 0; i < numberOfProducts; i++ ) {
          customerProducts.push(this.getRandomProduct());

        }

        this.customerProducts = customerProducts;

        return customerProducts;

      },
      getProducts: function() {

        var products = ['AL', 'DE', 'ER', 'KA', 'AN', 'KP', 'KO', 'HY','RM','SK', 'TM', 'VM','GP','VE', 'KI'];

        return products;

      },
      getRandomProduct: function() {

        var products = this.getProducts();
        var min = 0;
        var max = products.length-1;

        return products[Math.floor(Math.random() * (max - min + 1)) + min];

      },
      getRandomProductType: function() {
        var min = 0;
        var max = 1;

        var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        if (randomNumber == 0) {
          return "Digi";
        }

        return "Printti";

      },
      calculatePoints: function() {

        var level1Products = this.getLevel1Products();
        var level2Products = this.getLevel2Products();
        var level3Products = this.getLevel3Products();
        var level4Products = this.getLevel4Products();

        var combinedArr = [];
        combinedArr = combinedArr.concat(level1Products, level2Products, level3Products, level4Products);
       
        var pointsTotal = d3.nest()
        .key(function(d) { return d.product; })
        .rollup(function(v) { return d3.sum(v, function(d) { return d.points; }); })
        .map(combinedArr);

        var productArray = [];
        for (var property in pointsTotal) {

           var product = {
            product: property,
            points: pointsTotal[property]
           }

          productArray.push(product);

        }

        productArray = simpleSorter.sortByProperty(productArray, 'points', 'desc');

        $('.results-table tr').remove();

         for (var i = 0; i < productArray.length; i++ ) {
            if (this.customerProducts.indexOf(productArray[i].product) < 0) {
              $('.results-table').append("<tr><td>"+productArray[i].product+"</td><td>"+productArray[i].points+"</td></tr>");
            }
          }

      },
      getLevel1Products: function() {

        var level1Products = [];
        var level1Points = $('#points-level-1').val();

        var product1 =  {
          product: $('#serviceaccess-1').val(),
          points: level1Points
        }
        var product2 = {
          product: $('#serviceaccess-2').val(),
          points: level1Points
        }
        var product3 = {
          product: $('#serviceaccess-3').val(),
          points: level1Points
        }

        level1Products.push(product1);
        level1Products.push(product2);
        level1Products.push(product3);

        return level1Products;
      },
      getLevel2Products: function() {

        var level2Products = [];
        var level2Points = $('#points-level-2').val();

        var product1 =  {
          product: $('#frosmo-1').val(),
          points: level2Points
        }
        var product2 = {
          product: $('#frosmo-2').val(),
          points: level2Points
        }
        var product3 = {
          product: $('#frosmo-3').val(),
          points: level2Points
        }

        level2Products.push(product1);
        level2Products.push(product2);
        level2Products.push(product3);

        return level2Products;

      },
      getLevel3Products: function() {

        var level3Products = [];
        var level3Points = $('#points-level-3').val();

        var product1 =  {
          product: $('#nextbest-1').val(),
          points: level3Points
        }
        var product2 = {
          product: $('#nextbest-2').val(),
          points: level3Points
        }
        var product3 = {
          product: $('#nextbest-3').val(),
          points: level3Points
        }

        level3Products.push(product1);
        level3Products.push(product2);
        level3Products.push(product3);

        return level3Products;

      },
      getLevel4Products: function() {

        var level4Products = [];
        var level4Points = $('#points-level-4').val();

        var product1 =  {
          product: $('#bigfive-1').val(),
          points: level4Points
        }
        var product2 = {
          product: $('#bigfive-2').val(),
          points: level4Points
        }
        var product3 = {
          product: $('#bigfive-3').val(),
          points: level4Points
        }
         var product4 = {
          product: $('#bigfive-4').val(),
          points: level4Points
        }
         var product5 = {
          product: $('#bigfive-5').val(),
          points: level4Points
        }

        level4Products.push(product1);
        level4Products.push(product2);
        level4Products.push(product3);

        return level4Products;

      },
      createView: function(jRoot) {

       $('#content').css('overflow', 'auto');
       $('#content').css('padding', '10px');

        this.cSubscribersView = $("<article/>").addClass('col-xs-6 analytics-csubs').append([

        $("<div class='jarviswidget' />").addClass('jarviswidget-color-blueDark').append("<header><h2>ProductRank</h2></header>")
            .append("<div role='content'><div id='cProductRankContainer' class='widget-body no-padding table-body qplot-target'></div></div>")
          ]);

         jRoot.append(this.cSubscribersView);    

        var calculate =  $('#cProductRankContainer').append("<button id='calculate-product-total'>Laske pisteet</button>");

        var hotProduct = $('#cProductRankContainer').append("<h2>Kuuma tuote</h2>"+

          "<select id='hotproduct'>"+
            "<option value='NO'>-</option>"+
            "<option value='AL'>Alibi</option>"+
            "<option value='DE'>Deko</option>"+
            "<option value='ER'>Erä</option>"+
            "<option value='KA'>Koululainen</option>"+
            "<option value='AN'>Anna</option>"+
            "<option value='KP'>Kaksplus</option>"+
            "<option value='KO'>Kotiliesi</option>"+
            "<option value='HY'>Hymy</option>"+
            "<option value='RM'>TM Rakennusmaailma</option>"+
            "<option value='SK'>Suomen Kuvalehti</option>"+
            "<option value='TM'>Tekniikan Maailma</option>"+
            "<option value='VM'>Vauhdin Maailma</option>"+
            "<option value='GP'>Golfpiste</option>"+
            "<option value='VE'>Venelehti</option>"+
            "<option value='KI'>Kippari</option>"+
          "</select><br><br>");

        var questionnaireTable = $('#cProductRankContainer').append("<table class='table'>"+
          "<tr>"+
            "<th>Taso</th>"+
            "<th>Nimi</th>"+
            "<th>Pisteet</th>"+
          "</tr>"+
          "<tr>"+
            "<td>1</td>"+
            "<td>Kirjautumistiedot</td>"+
            "<td><input type='text' id='points-level-1' value='7' disabled></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td>2</td>"+
            "<td>Frosmo</td>"+
            "<td><input type='text' id='points-level-2' value='5' disabled></input></td>"+
          "</tr>"+
         " <tr>"+
           " <td>3</td>"+
            "<td>NextBest</td>"+
            "<td><input type='text' id='points-level-3' value='3' disabled></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td>4</td>"+
            "<td>Big 5</td>"+
            "<td><input type='text' id='points-level-4' value='1' disabled></input></td>"+
          "</tr>"+
        "</table>");

          var serviceAccessTable = $('#cProductRankContainer').append("<h2>Kirjautumistiedot + 7p</h2><table class='table'>"+
          "<tr>"+
            "<th>Palvelu</th>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='serviceaccess-1' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='serviceaccess-2' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='serviceaccess-3' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
        "</table>");

          var frosmoTable = $('#cProductRankContainer').append("<h2>Frosmo +5p</h2><table class='table'>"+
            "<tr>"+
            "<th>Tuote</th>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='frosmo-1' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='frosmo-2' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='frosmo-3' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
        "</table>");

           var nextBestTable  = $('#cProductRankContainer').append("<h2>NextBestAPI +3p</h2><table class='table'>"+
          "<tr>"+
            "<th>Tuote</th>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='nextbest-1' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='nextbest-2' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='nextbest-3' value='"+this.getRandomProduct()+"'></input></td>"+
          "</tr>"+
        "</table>");

          var big5Table = $('#cProductRankContainer').append("<h2>Big5 +1p</h2><table class='table'>"+
          "<tr>"+
            "<th>Tuote</th>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='bigfive-1' value='SK'></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='bigfive-2' value='TM'></input></td>"+
          "</tr>"+
          "<tr>"+
            "<td><input type='text' id='bigfive-3' value='AN'></input></td>"+
          "</tr>"+
           "<tr>"+
            "<td><input type='text' id='bigfive-4' value='KO'></input></td>"+
          "</tr>"+
           "<tr>"+
            "<td><input type='text' id='bigfive-5' value='SE'></input></td>"+
          "</tr>"+
        "</table>");

          var customerOrdersTable = $('#cProductRankContainer').append("<h2>Asiakkaan tilaukset</h2><table class='table customer-orders-table'>"+
          "<tr>"+
            "<th>Tuote</th>"+
          "</tr>"+
        "</table>");

          var customerHistoryTable = $('#cProductRankContainer').append("<h2>Asiakkaan tilaushistoria</h2><table class='table customer-orders-history-table'>"+
          "<tr>"+
            "<th>Tuote</th>"+
          "</tr>"+
        "</table>");

          var customerProducts = this.getCustomerProducts();

          for (var i = 0; i < customerProducts.length; i++ ) {
            $('.customer-orders-table').append("<tr><td>"+customerProducts[i]+"</td></tr>");
          }

          var customerProductHistory = this.getCustomerProducts();

          for (var i = 0; i < customerProductHistory.length; i++ ) {
            $('.customer-orders-history-table').append("<tr><td>"+customerProductHistory[i]+"</td></tr>");
          }

          var customerProductType = $('#cProductRankContainer').append("<h2>Asiakkaan tuotetyyppi</h2><p>"+this.getRandomProductType()+"</p>");


          var resultsTable = $('#cProductRankContainer').append("<h2>Pisteet</h2><table class='table results-table'>"+
          "<tr>"+
            "<th>Tuote</th>"+
            "<th>Pisteet</th>"+
          "</tr>"+
          "</table>");

          this.calculatePoints();

      }
    });
  };
});
