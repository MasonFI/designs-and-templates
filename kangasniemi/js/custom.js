$(document).ready(function(){
   var excelId = "1jV0SyZK-nzKQme6io-1FypP6lGw2jYgOULEG35bGDFA";
   var url = "https://spreadsheets.google.com/feeds/list/";
   url += excelId += "/od6/public/basic?alt=json";
   console.log(url);
   // ID of the Google Spreadsheet
   var spreadsheetID = "SPREADSHEET KEY";
   
   // Make sure it is public or set to Anyone with link can view 
   var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";
   
   $.getJSON(url, function(data) {
   
    var entry = data.feed.entry;
   
    $(entry).each(function(){
      // Column names are name, age, etc.
      $('.results').prepend('<h2>'+this.gsx$name.$t+'</h2><p>'+this.gsx$age.$t+'</p>');
    });
   
   });
   
   var chart = AmCharts.makeChart( "sampleChart", {
      "type": "serial",
      "theme": "light",
      "dataProvider": [ {
        "country": "USA",
        "visits": 2025
      }, {
        "country": "China",
        "visits": 1882
      }, {
        "country": "Japan",
        "visits": 1809
      }, {
        "country": "Germany",
        "visits": 1322
      }, {
        "country": "UK",
        "visits": 1122
      }, {
        "country": "France",
        "visits": 1114
      }, {
        "country": "India",
        "visits": 984
      }, {
        "country": "Spain",
        "visits": 711
      }, {
        "country": "Netherlands",
        "visits": 665
      }, {
        "country": "Russia",
        "visits": 580
      }, {
        "country": "South Korea",
        "visits": 443
      }, {
        "country": "Canada",
        "visits": 441
      }, {
        "country": "Brazil",
        "visits": 395
      } ],
      "valueAxes": [ {
        "gridColor": "#FFFFFF",
        "gridAlpha": 0.2,
        "dashLength": 0
      } ],
      "gridAboveGraphs": true,
      "startDuration": 1,
      "graphs": [ {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "fillAlphas": 0.8,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": "visits"
      } ],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "cursorAlpha": 0,
        "zoomable": false
      },
      "categoryField": "country",
      "categoryAxis": {
        "gridPosition": "start",
        "gridAlpha": 0,
        "tickPosition": "start",
        "tickLength": 20
      },
      "export": {
        "enabled": true
      }

    } );
});