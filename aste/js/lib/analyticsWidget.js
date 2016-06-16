define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment', 'viivaNotification', 'viivaGraph', 'viivaGraphSettings',
        'smartAdmin', 'flot', 'flotResize', 'flotFillbetween', 'flotOrderBar', 'flotPie', 'flotTooltip'],
    function($, jui, DP, util, tr, moment, Notification, viivaGraph, viivaGraphSettings) {

return function (){
    this.settings = new Object();
    this.destroyed = false;
    
    /* Product groups title to productID mappings */
    this.products = new Object();
    /* Product groups title to product info (group, id) mappings */
    this.productGroups = new Object();
    /* Product groups to related packages mappings */
    this.packageGroups = new Object();
    /* Packages to packageID mappings */
    this.packages = new Object();
    
    /* Generic flags */
    this.productSelectReady = false;
    this.settingsLoaded = false;
    this.productGroupsLoaded = false;
    this.packagesLoaded = false;
    this.gaDataReady = false;
    this.mydigiDataReady = false;
    /* Generic asynchronous interval */
    this.interval = null;
    this.intervalCount = 0;
    
    /* Product name to Google analytics id mappings */
    this.google_analytics_ids = {"Suomen Kuvalehti" : "ga:79336468", "Golf Digest" : "ga:69312549", "Anna" : "ga:72730090"};
    
    /* Google analytics related datasets in format api name : label */
    this.datasets = {
    "Rekisteröityneet käyttäjät" : "optionGroup",
    "ga:users" : "Kaikki käyttäjät",
    "Kävijät" : "optionGroup",
    "ga:visits" : "Kaikki kävijät",
    "Sivunlataukset" : "optionGroup",
    "ga:pageviews" : "Kaikki sivunlataukset",
    "ga:uniquePageviews" : "Uniikit sivunlataukset",
    "Haut" : "optionGroup",
    "ga:organicSearches" : "Orgaaniset haut",
    "Istunnot" : "optionGroup",
    "ga:sessions" : "Kaikki istunnot",
    "ga:avgSessionDuration" : "Istunnon pituus (sekuntia)",
    "ga:avgTimeOnPage" : "Keskimääräinen katseluaika (sekuntia)",
    "Sosiaalinen media" : "optionGroup",
    "ga:socialActivities" : "Linkattu SoMe:ssa",
    "Mainokset" : "optionGroup",
    "ga:adClicks" : "Mainosklikkaukset",
    "Sivuston nopeus" : "optionGroup",
    "ga:avgPageLoadTime" : "Sivuston latautumisaika"
    };
    
    /* Available datasets from MyDigi API in format api name : label */
    this.mydigi_datasets = {
    "Myynti" : "optionGroup", "orders" : "Tilaukset",
    };
    
    /* Remap object keys to original object's values */
    this.reverseObjectProperties = function(object){
        var reversed = new Object();
        for (var key in object) {
            reversed[object[key]] = key;
        }
        return reversed;
    }
    
    /* Return integer timescale in days from timeframe label */
    this.getTimeScale = function(timeframe, from, to){
        switch (timeframe) {
            case "month": return 30;
            case "week": return 7;
            case "custom":
                t1 = new Date(moment(from, "DD.MM.YYYY")).getTime()/1000;
                t2 = new Date(moment(to, "DD.MM.YYYY")).getTime()/1000;
                diff = Math.floor((t2-t1)/86400);
                return diff;
            default: return 0;
        }
    }
    
    /* Find the selected from dataset multiselect */
    this.findDatasetSelected = function(){
        var _this = this;
        var selected = new Array();
        $(_this.dataSelect.find('ul')).find('.select2-search-choice').each(function(i){
            e = $(this).find('div');
            selected.push(e.html());
        });
        return selected;
    }
    
    /* Find the selected from packet multiselect */
    this.findPacketSelected = function(){
        var _this = this;
        var selected = new Array();
        $(_this.packetSelect.find('ul')).find('.select2-search-choice').each(function(i){
            e = $(this).find('div');
            selected.push(e.html());
        });
        return selected;
    }
    
    /* Load Flot chart based on form data. First create chart object where the chart settings and
     * data will be populated. Then serializeArray the form to get the chart settings.
     * Get the chart data from AdminAPIController and switch to graph view waiting the data to load
     * until finally drawing the chart
     */
    this.loadChart = function(){
        var _this = this;
        
        var chart = new Object();
        var form = new Object();
        
        // Populate the form data object
        var formArray = $(this.form).serializeArray();
        for (var i=0; i<formArray.length; i++){
            form[formArray[i].name] = formArray[i].value;
        }
        
        // Find and calculate time scale (time range)
        form.timescale = $(this.timeCheckboxGroup.find('label.active')).find('input').val();
        form["chart-type"] = $(this.graphTypeControl.find('label.active')).find('input').val();
        
        var now = new Date();
        var now_date = now.getFullYear() + "-" + (("0" + (now.getMonth() + 1)).slice(-2)) + "-" + (("0" + now.getDate()).slice(-2));
        var timescale = _this.getTimeScale(form["timescale"], form["date-from"], form["date-to"]);
        var date_from = (new Date(now_date).getTime())-(86400000*timescale);
        var d = new Date(date_from);
        var start_date = d.getFullYear() + "-" + (("0" + (d.getMonth() + 1)).slice(-2)) + "-" + (("0" + d.getDate()).slice(-2));
        
        // Set an appropriate metric dimension
        var dim = "ga:date";
        
        /* Setup chart settings */
        chart.type = form["chart-type"];
        chart["data-type"] = "time";
        chart["data-name"] = _this.datasets[form["dataset"]];
        chart["timescale"] = timescale;
        chart["chart-options"] = new Object();
        chart["chart-options"]["tooltips-enabled"] = form["tooltips-enabled"];
        chart["chart-options"]["data-points"] = (form["data-points"] == "on") ? true : false;
        chart["chart-options"]["shadows"] = form["shadows"];
        chart.dataset = new Array();
        
        // List of selected products or packages
        var selected_products = new Array();
        // Google Analytics ID of selected products joined with semicolon for GAPI endpoint query
        var gaidselect = "";
        // Reversed associative list for mapping gaids to product names
        var reversed_gaids = this.reverseObjectProperties(this.google_analytics_ids);
        // Get products from multiselect
        $(this.productSelect.find('ul')).find('.select2-search-choice').each(function(i){
            e = $(this).find('div');
            gaidselect += _this.google_analytics_ids[_this.productGroups[e.html()].group] + ";";
            selected_products.push(e.html());
        });
        var packet_selected = _this.findPacketSelected();
        if (packet_selected.length > 0) {
            selected_products = packet_selected;
        }
        
        var dataselect = "";
        var mydigi_dataselect = new Array();
        var reversed_datasets = this.reverseObjectProperties(this.datasets);
        var reversed_mydigi_datasets = this.reverseObjectProperties(this.mydigi_datasets);
        
        $(this.dataSelect.find('ul')).find('.select2-search-choice').each(function(i){
            e = $(this).find('div');
            dataset = e.html();
            if (typeof reversed_datasets[dataset] !== "undefined") {
                dataselect += reversed_datasets[dataset] + ";";
            }
            if (typeof reversed_mydigi_datasets[dataset] !== "undefined") {
                mydigi_dataselect.push(reversed_mydigi_datasets[dataset]);
            }
        });
        
        // Notifications for required fields
        if (form.timescale == "custom") {
            if ((form["date-from"] == "") || (form["date-to"] == "")) {
                Notification.info({title: "Päivämäärä", message: "Valitse alkamis- ja päättymispäivämäärät!"});
               return;
            }
        }
        if (gaidselect == "") {
            Notification.info({title: "Tuote", message: "Valitse ainakin yksi tuoteryhmä!"});
            return;
        }
        if (dataselect == "" && mydigi_dataselect.length < 1) {
            Notification.info({title: "Data", message: "Valitse ainakin yksi datalähde!"});
            return;
        }
        
        var compare = $(this.dataCompareGroup.find('label.active')).find('input').val();
        if (compare == "products") {
            if (typeof chart["data-name"] == "undefined") {
                var dataset_selected = _this.findDatasetSelected();
                chart["data-name"] = dataset_selected[0];
            }
            chart.legend = chart["data-name"] + ", "+ timescale +" päivää";
        } else {
            chart.legend = reversed_gaids[gaidselect.split(";")[0]] + ", "+ timescale +" päivää";     
        }
        
        // Set graph view title
        if (form["name-input"] !== "") {
            _this.graphTitle.html(form["name-input"]);
        } else {
            _this.graphTitle.html(chart.legend);
        }
        
        /* Switch to graph view */
        _this.switchView(2);
        
        if (dataselect != "") {
            
        j = JSON.stringify({gaids: gaidselect, gadata: dataselect, compare: compare, t_frame: form.timescale, t_from: form["date-from"], t_to: form["date-to"], dim: dim});
        
        /* Do ajax to googe analytics endpoint */
        $.ajax({
            type: "post",
            url: util.apiAnalytics + "gapi.get",
            data: j,
            contentType: 'application/json',
            dataType: 'json',
            success: function(data){
                
                if (data.message == "Successful") {
                    array = data.ga;
                    if (compare == "products") {
                        for (var gaid in array) {
                            var dataset = new Object();
                            
                            /* Set dataset label and reformat data */
                            dataset.label = reversed_gaids[gaid];//+" "+_this.datasets[form["dataset"]];
                            
                            dataset.data = $.map(array[gaid], function(value, index) {
                                return [[parseInt(index)*1000, parseInt(value)]];
                            });
                            
                            chart.dataset.push(dataset);
                        }
                    } else {
                        for (var dataname in array) {
                            var dataset = new Object();
                            
                            /* Set dataset label and reformat data */
                            dataset.label = _this.datasets[dataname];
                            
                            dataset.data = $.map(array[dataname], function(value, index) {
                                return [[parseInt(index)*1000, parseInt(value)]];
                            });
                            
                            chart.dataset.push(dataset);
                        }   
                    }
                }
                
                _this.gaDataReady = true;
            }
        });
        } else {
            _this.gaDataReady = true;
        }
        
        if (mydigi_dataselect.length > 0) {
            _this.mydigiDataReady = false;
            var index;
            for (index=0; index < mydigi_dataselect.length; index++) {
                /* e.g "orders" */
                var current_dataset = mydigi_dataselect[index];
                /* api/analytics method */
                var method = "order.analytics.get";
                var product_index;
                
                /* TODO: switch case current_dataset when analytics api supports more mydigi
                 * datasets */
                
                for (product_index=0; product_index < selected_products.length; product_index++){
                    var product_name = selected_products[product_index];
                    var product_type = 'group';
                    var product_id = "";
                    var time_start = start_date;
                    var time_end = form["date-to"];
                    
                    if (typeof _this.products[product_name] != "undefined") {
                        product_type = 'group';
                        product_id = _this.products[product_name];
                    }
                    else if (typeof _this.packages[product_name] != "undefined") {
                        product_type = 'package';
                        product_id = _this.packages[product_name];
                    }
                    
                    if (time_end == "") {
                        time_end = now_date;
                    }
                    
                    var params = {id : product_id, productType : product_type, timeStart: time_start, timeEnd: time_end};
                    
                    console.log(params);
                    
                    $.ajax({
                        type: "post",
                        url: util.apiAnalytics + method,
                        data: JSON.stringify(params),
                        contentType: 'application/json',
                        dataType: 'json',
                        currentDataset: current_dataset,
                        productName: product_name,
                        success: function(data){
                            
                            var dataset = new Object();
                            
                            dataset.data = data.chartdata;
                            
                            if (compare == "products") {
                                dataset.label = this.productName + " (yht "+data.totalCount+")";
                            } else {
                                dataset.label = _this.mydigi_datasets[this.currentDataset] + " (yht "+data.totalCount+")";
                            }
                            
                            chart.dataset.push(dataset);
                            
                            /* Final round sets data ready flag */
                            if ((index >= mydigi_dataselect.length) && (product_index >= selected_products.length)) {
                                _this.mydigiDataReady = true;
                            }
                        } 
                    });
                    
                }
                
            } // for index=0
        } // if mydigi_dataselect.length
        else {
            _this.mydigiDataReady = true;
        }
    
        function drawChartData(){
            if (_this.gaDataReady == true && _this.mydigiDataReady == true) {
                clearInterval(_this.interval);
                _this.graphContent.find('.widget-body').removeClass('analyticsLoading');
                viivaRenderChart(_this, chart);
            }
            _this.intervalCount += 1;
            if (_this.intervalCount > 30) {
                _this.gaDataReady = true;
                _this.mydigiDataReady = true;
                _this.intervalCount = 0;
            }
        }    
    
        _this.interval = setInterval(drawChartData, 500);
    
        
    }
    
    this.create = function(insideElement){
      
        this.graphView = $('<article/>')
          .attr('class', 'col-xs-12 col-sm-12 col-md-12 col-lg-12')
          .append($('<div class="jarviswidget jarviswidget-color-blueDark" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-custombutton="false" data-widget-deletebutton="false" data-widget-togglebutton="false">'));
          //.append($('<div class="jarvischild">'));
          
        this.graphHeader = $('<header/>').append([
          $('<div/>').attr('role', 'menu').addClass('jarviswidget-ctrls').append(
            $('<a data-original-title="Asetukset" href="javascript:void(0);" class="button-icon" rel="tooltip" title="Asetukset" data-placement="bottom"><i class="fa fa-cog"></i></a>')
          ),
          $('<span class="widget-icon"><i class="fa fa-bar-chart-o"></i></span>'),
          $('<h2/>').html(tr("graph", "capitalize"))
        ]);
        
        this.graphTitle = this.graphHeader.find('h2');
        this.graphChart = $('<div/>').addClass('chart');
        this.graphLoader = $('<img/>').attr('src', 'resources/img/ajax_loader.gif');
        
        this.graphContent = $('<div/>').html('<div class="jarviswidget-editbox"></div>'+
        '<div class="widget-body">');
        this.graphContent.find('.widget-body')
        .addClass('analyticsLoading')
        .append(this.graphChart);
        
        /* Construct DOM for the graph widget */
        this.graphView.find('.jarviswidget').append([
          this.graphHeader,
          this.graphContent
        ]);
        
        /* Save reference to "return to settings" button */
        this.graphReturn = this.graphHeader.find('a.button-icon');
        
        


        this.settingsView = $('<article/>')
          .attr('class', 'col-sm-12 col-md-12 col-lg-6')
          .append($('<div class="jarviswidget jarviswidget-color-blueDark" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-custombutton="false" data-widget-deletebutton="true" data-widget-togglebutton="false" data-widget-fullscreenbutton="false">'));
          //.append($('<div class="jarvischild">'));
      
        this.settingsHeader = $('<header/>').append([
          $('<div/>').attr('role', 'menu').addClass('jarviswidget-ctrls').append([
            $('<a data-original-title="Ladataan dataa" href="javascript:void(0);" class="button-icon table-reload non-link" rel="tooltip"><i class="fa fa-refresh fa-spin"></i></a>'),
            $('<a data-original-title="Poista" href="javascript:void(0);" class="button-icon jarviswidget-delete-btn" rel="tooltip" title="" data-placement="bottom"><i class="fa fa-times"></i></a>')
            ]),
          $('<h2/>').html(tr('visualizationTitle'))
        ]);
        
        /* Settings widget controls wrapper */
        this.settingsWidgetWrapper = $('<div/>').append($('<form/>'));
        this.form = this.settingsWidgetWrapper.find('form');
        
        this.settingsCancel = $('<button/>').attr('class', 'btn btn-default').html("Tyhjennä");
        this.settingsPlot = $('<button/>').attr('class', 'btn btn-primary').html(tr('plotGraph', 'capitalize'));
        
        this.settingsActions = $('<div/>').addClass("form-actions").css('margin-bottom', '0px').append(
          $('<div/>').addClass('row').append(
            $('<div/>').attr('class', 'col-md-12').append([this.settingsCancel, this.settingsPlot])
          )
        );
        

        
        
        this.nameInput = $('<div/>').addClass('input-group').append([
            $('<p/>').html('Graafinäkymän otsikko'),
            $('<input/>').addClass('form-control').attr({name: 'name-input', placeholder: 'Otsikko'})
        ]);
    

    
    
        this.timeWidget = $('<div/>');
        
        /* Month, week, custom time range checkbox select */
        this.timeCheckboxGroup = $('<div/>').addClass('btn-group').attr('data-toggle', 'buttons').append([
          $('<label/>').attr('class', 'btn btn-default btn-sm active').html('30 '+tr("days"))
            .append($('<input/>').attr({name: 'time-scale', value: 'month', type: 'radio'})),
          $('<label></label>').attr('class', 'btn btn-default btn-sm').html('7 '+tr("days"))
            .append($('<input/>').attr({name: 'time-scale', value: 'week', type: 'radio'})),
          $('<label/>').attr('class', 'btn btn-default btn-sm').html(tr("timeScale"))
            .append($('<input/>').attr({name: 'time-scale', value: 'custom', type: 'radio'})),
        ]);
      
        /* Jarvis datepicker tool */
        this.timeDatePicker = $('<div/>').addClass('row').append([
          $('<br/>'),
          $('<div/>').addClass('col-sm-12')
            .append($('<label/>').html(tr("timeScale", "capitalize"))),
          $('<div/>').addClass('col-sm-6')
            .append($('<div/>').addClass('input-group')
              .append([$('<input/>')
                        .attr('class', 'form-control datepicker')
                        .attr({type: 'text', name: 'date-from', placeholder: tr("startDate", "capitalize")})
                        .attr('data-dateformat', 'dd.mm.yy'),
                        $('<span class="input-group-addon"><i class="fa fa-calendar"></i></span>')
                      ])
                    ),
          $('<div/>').addClass('col-sm-6')
            .append($('<div/>').addClass('input-group')
              .append([$('<input/>')
                        .attr('class', 'form-control datepicker')
                        .attr({type: 'text', name: 'date-to', placeholder: tr("endDate", "capitalize")})
                        .attr('data-dateformat', 'dd.mm.yy'),
                        $('<span class="input-group-addon"><i class="fa fa-calendar"></i></span>')
                      ])
                    )
          ]);
        
        this.timeWidget.append([
          $('<p/>').html(tr('dataTimeTitle', 'capitalizefirst')),
          this.timeCheckboxGroup,
          this.timeDatePicker.hide()
        ]);
        
        

        
        this.dataCompareWidget = $('<div/>');
        
        this.dataCompareGroup = $('<div/>').addClass('btn-group').attr('data-toggle', 'buttons').append([
          $('<label/>').attr('class', 'btn btn-default btn-sm active').html('Tuoteryhmät')
            .append($('<input/>').attr({name: 'data-compare', value: 'products', type: 'radio'})),
          $('<label></label>').attr('class', 'btn btn-default btn-sm').html('Data')
            .append($('<input/>').attr({name: 'data-compare', value: 'data', type: 'radio'})),
        ]);
        
        this.dataCompareWidget.append([
           $('<p/>').html('Vertailu'),
           this.dataCompareGroup
        ]);
        
        
        
        
        this.productSelectWidget = $('<div/>').addClass('widget-body');
        
        this.productSelect = $('<div/>').addClass('form-group').addClass('product-select-div').append([
          $('<label/>').html(tr('productGroup', 'capitalize')),
          $('<select multiple style="width:100%;" name="product" class="select2"></select>')
        ]);
        
        this.packetSelect = $('<div/>').addClass('form-group').addClass('packet-select-div').append([
          $('<label/>').html(tr('productCombo', 'capitalize')),
          $('<select multiple style="width:100%;" name="offer" class="select2"><option value="loading">Valitse tuoteryhmä</option></select>')
        ]);
        
        this.dataSelect = $('<div/>').addClass('form-group').addClass('data-select-div').append([
          $('<label/>').html(tr('dataToVisualize', 'capitalizefirst')),
          $('<select multiple style="width:100%;" name="dataset" class="select2"></select>')
        ]);
        
        this.productSelectWidget.append([
          this.productSelect,
          this.packetSelect,
          this.dataSelect
        ])
        
        
        
        
        /* Graph Settings selections */
        this.graphSettingsWidget = $('<div/>');
        
        this.graphTypeControl = $('<div/>').addClass('btn-group').attr('data-toggle', 'buttons').append([
          $('<label/>').attr('class', 'btn btn-default btn-sm active')
            .append($('<input name="chart-type" value="line" type="radio" checked="checked">'))
            .append(tr('lineChart', 'capitalize')),
          $('<label/>').attr('class', 'btn btn-default btn-sm')
            .append($('<input name="chart-type" value="bar" type="radio">'))
            .append(tr('barChart', 'capitalize')),
        /*
          $('<label/>').attr('class', 'btn btn-default btn-sm')
            .append($('<input name="chart-type" value="pie" type="radio">'))
            .append(tr('pieChart', 'capitalize'))
        */
          ]);
        
        this.graphOptionsControl = $('<div/>').addClass('smart-form').append([
          $('<br/>'),
          $('<label/>').css("marginBottom", '10px').html(tr('graphExtraOptions', 'capitalizefirst')),
          $('<div/>').addClass('inline-group').append([
            $('<label class="checkbox">')
              .append($('<input type="checkbox" name="data-points" checked="checked">'))
              .append($('<i/>'))
              .append(tr("dataPoints", "capitalize")),
            $('<label class="checkbox">')
              .append($('<input type="checkbox" name="shadows" checked="checked">'))
              .append($('<i/>'))
              .append(tr("shadows", "capitalize")),
            $('<label class="checkbox">')
              .append($('<input type="checkbox" name="tooltips-enabled" checked="checked">'))
              .append($('<i/>'))
              .append(tr("tooltip", "capitalize"))
          ])
        ]);
        
        this.graphSettingsWidget.append([
          this.graphTypeControl,
          this.graphOptionsControl
        ]);
        
        
           
        
        /* Construct the DOM inside settingsView */
        this.settingsWidgetWrapper.find('form').append([
            this.nameInput,
            $('<br/>'),
            this.timeWidget,
            $('<br/>'),
            this.dataCompareWidget,
            $('<br/>'),
            this.productSelectWidget,
            this.graphSettingsWidget,
            this.settingsActions
        ])
      
        this.settingsView.find('.jarviswidget').append([
          this.settingsHeader,
          this.settingsWidgetWrapper
        ]);
        
        //this.widgetWrapper = $('<div class="jarviswidget"  data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-custombutton="false" data-widget-deletebutton="false" data-widget-togglebutton="false"/>')
        this.widgetWrapper = $('<div/>')
        .append([this.settingsView, this.graphView.hide()])
        
        $(insideElement).append(this.widgetWrapper);
        
        /* Fix weird button click problem */
        this.settingsView.find('label.btn-sm').css('width', '100px');
        
        this.domReady = true;
        this.parent = insideElement;
        
    } // this.create
    
    /* Self destruct */
    this.destroy = function(){
        //$(_this).parent().remove();
        this.widgetWrapper.remove();
        this.destroyed = true;
    }
    
    /* Switch from settings view to graph view or vice versa */
    this.switchView = function(view){
        this.settings.currentView = view;
        /* Settings view */
        if (view == 1) {
            this.settingsView.show();
            this.graphView.hide();
        }
        /* Graph view */
        else {
            this.settingsView.hide();
            this.graphView.show();
        }
    }
    
    /* Populate product group multiselect */
    this.loadProductSelect = function(){
        var _this = this;
        // Populate select elements
        _this.productSelect.find('select').empty();
        $.each(_this.productGroups, function(title, info){
            _this.productSelect.find('select').append($('<option/>').addClass("analyticsOptionGroup").attr('value', _this.google_analytics_ids[info.group]).html(title));
        });
    }
    
    /* Load product groups and packages and populate product multiselect once loaded */
    this.loadProductsAndPackages = function(){
        var _this = this;
        
        /* Parameters for api product.get and package.get */
        var params = {"sEcho":1,"iColumns":4,"sColumns":"",
        "iDisplayStart":0,"iDisplayLength":0, /* When iDisplayLength < 1 it will return all available */
        "mDataProp_0":"id","mDataProp_1":"group","mDataProp_2":"name", "mDataProp_3":"title",
        "sSearch":"","bRegex":false,
        "sSearch_0":"","bRegex_0":false,"bSearchable_0":true,
        "sSearch_1":"","bRegex_1":false,"bSearchable_1":true,
        "sSearch_2":"","bRegex_2":false,"bSearchable_2":true,
        "sSearch_3":"","bRegex_3":false,"bSearchable_3":true,
        "iSortCol_0":0,"sSortDir_0":"asc","iSortingCols":1,
        "bSortable_0":true,
        "bSortable_1":true,
        "bSortable_2":true,
        "bSortable_3":true,
        "format":"datatable"
        };
        
        /* Fetch all product groups */
        $.ajax({
            type: "post",
            url: util.apiBase + "product.get",
            data: JSON.stringify(params),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data){
                if (data.message == "Successful") {
                    var index;
                    for (index=0; index < data.aaData.length; index++){
                        var product = data.aaData[index];
                        if (typeof _this.products[product.title] == "undefined" ) {
                             _this.products[product.title] = product.id;
                        }
                        
                        if (typeof _this.productGroups[product.title] == "undefined" ) {
                            _this.productGroups[product.title] = new Object();
                            _this.productGroups[product.title].group = product.group;
                            _this.productGroups[product.title].id = product.id;
                        }
                    } // for
                    
                    _this.productGroupsLoaded = true;
                    
                } // if data.message
            } // success function
        });
        
        /* Fetch all available packages */
        $.ajax({
            type: "post",
            url: util.apiBase + "package.get",
            data: JSON.stringify(params),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data){
                if (data.message == "Successful") {
                    var index;
                    for (index=0; index < data.aaData.length; index++){
                        var p = data.aaData[index];
                        if (typeof _this.packageGroups[p.group] == "undefined") {
                            _this.packageGroups[p.group] = new Array();
                        }
                        _this.packageGroups[p.group].push(p);
                        
                        _this.packages[p.name] = p.id;
                        
                    } // for
                    
                    _this.packagesLoaded = true;
                    
                } // if data.message
            } // success function
        });
        
        /* Interval function to load product multiselect when async product and package loads
         * have succeeded */
        function doneLoading() {
            if (_this.productGroupsLoaded == true && _this.packagesLoaded == true) {
                clearInterval(_this.interval);
                /* Load product groups select */
                _this.loadProductSelect();
                /* Remove spinner */
                $(_this.settingsHeader.find('.table-reload')).remove();
                
                _this.productSelectReady = true;
            } 
        }
        
        _this.interval = setInterval(doneLoading, 300);
    }
    
    /* Load multiselect options for packages select from package list if product group
     * is selected */
    this.loadPacketSelect = function(){
        var _this = this;
        var selected_groups = new Array();
        
        /* Find selected product groups */
        $(_this.productSelect.find('ul')).find('.select2-search-choice').each(function(i){
            e = $(this).find('div');
            selected_groups.push(_this.productGroups[e.html()].group);
        });
        
        /* If no product groups are selected, empty package multiselect */
        if (selected_groups.length < 1) {
            _this.packetSelect.find('select').empty();
            $(_this.packetSelect.find('ul.select2-choices')).find('a.select2-search-choice-close').trigger('click');
        }
        /* Product groups selected, populate package select options */
        else {
            select = _this.packetSelect.find('select');
            select.empty();
            
            for (var i=0; i<selected_groups.length; i++) {
                key = selected_groups[i];
                group = _this.packageGroups[key];
                optgroup = $('<optgroup/>').attr('label', key);
                for (var j=0; j<group.length; j++){
                    packet = group[j];
                    optgroup.append($('<option/>').attr('value', packet.id).html(packet.name));
                }
                
                select.append(optgroup);
            }
        }    
    }
    
    /* Load multiselect options for dataset select from datasets and mydigi_datasets */
    this.loadDatasetList = function(){
        var _this = this;
        /* Empty options */
        _this.dataSelect.find('select').empty();
        
        /* Populate multiselect with mydigi dataset */
        $.each(_this.mydigi_datasets, function(value, name){
            if (name == "optionGroup") {
                $optgroup = $('<optgroup/>').attr('label', value);
                _this.dataSelect.find('select').append($optgroup);
            } else {
                $optgroup.append($('<option/>').attr('value', value).html(name));
            }
        });
        
        /* Check if packets are selected */
        var packetSelected = _this.findPacketSelected();
        
        /* If no packet is selected then Google analytics datasets are available */
        if (packetSelected.length < 1) {
            // Populate with GoogleAnalytics datasets
            $.each(_this.datasets, function(value, name){
                if (name == "optionGroup") {
                    $optgroup = $('<optgroup/>').attr('label', value);
                    _this.dataSelect.find('select').append($optgroup);
                } else {
                    $optgroup.append($('<option/>').attr('value', value).html(name));
                }
            });
        }
        
    }
    
    // this.loadOrderdData = function()
    
    this.loadAll = function(){
        this.loadProductsAndPackages();
        this.loadDatasetList();
    }
    
    this.bindEvents = function(){
        /* Save reference to analyticsWiget scope */
        var _this = this;
        
        if (this.domReady !== true) {
          this.eventsReady = false;
          return;
        }
        
        this.settingsView.find('.jarviswidget-delete-btn').on('click', function(event){
            event.preventDefault();
            _this.destroy();
        });
        
        this.productSelect.on('change', function(event){
            event.preventDefault();
            _this.loadPacketSelect();
        });
        
        this.packetSelect.on('change', function(event){
            event.preventDefault();
            _this.loadDatasetList();
        });
        
        this.timeCheckboxGroup.find('input').on('change', function(event){
          event.preventDefault();
          if ($(this).val() == "custom"){
              _this.timeDatePicker.show(200);
          } else {
              _this.timeDatePicker.hide(200);
          }
        });
        
        this.graphTypeControl.find('input').on('change', function(event){
          event.preventDefault();
          var value = $(this).val();
          
          $inlineGroup = _this.graphOptionsControl.find('.inline-group');
          
          $inlineGroup.find('label').removeClass('state-disabled');
          $inlineGroup.find('input').removeAttr('disabled');
          
          if (value == "pie"){
            $inlineGroup.find('label').addClass('state-disabled');
            $inlineGroup.find('input').attr('disabled', true);
          } else if (value == "bar"){
            /* Disable first 2 labels and inputs */
            $inlineGroup.find('label').slice(0,2).addClass('state-disabled');
            $inlineGroup.find('input').slice(0,2).attr('disabled', true);
          }  
        });
        
        this.settingsPlot.on('click', function(event){
            event.preventDefault();
            _this.loadChart();
        });
        
        this.settingsCancel.on('click', function(event){
            event.preventDefault();
            /* Hide datepicker */
            _this.timeDatePicker.hide();
            /* Empty multiselect */
            $('ul.select2-choices').find('a.select2-search-choice-close').trigger('click');
            /* Reset button labels */
            _this.settingsView.find('label.active').removeClass('active');
            _this.settingsView.find('input[type=radio]').removeAttr('checked');
            
            $('.btn-group').each(function(){
                var label = $(this).find('label:first-child');
                label.addClass('active');
                label.find('input[type=radio]:first-child').attr('checked', 'checked');
            });
            /*_this.settingsView.find('label.active').find('input[type=radio]:first-child').attr('checked', 'checked');*/
            
            /*$('.btn-group').find('input:first-child').attr('checked', 'checked');*/
            /* Reset checkboxes */
            $('.smart-form').find('label.checkbox').removeClass('state-disabled');
            $('.smart-form').find('input').removeAttr("disabled");
            
        })
        
        this.graphReturn.on('click', function(event){
            event.preventDefault();
            _this.graphChart.empty();
            _this.graphContent.find('.widget-body').addClass('analyticsLoading');
            _this.switchView(1);
            /* Opt for data reload */
            _this.gaDataReady = false;
            _this.mydigiDataReady = false;
        });
      
    } // this.bindEvents
    
    this.initializeSettings = function(){
        this.settings.currentView = 1;
        this.settings.graphTitle = "";
        this.settings.dataTimeFrame = "month";
        this.settings.dateFrom = "";
        this.settings.dateTo = "";
        this.settings.dataCompare = "products";
        this.settings.productSelected = new Array();
        this.settings.packageSelected = new Array();
        this.settings.dataSelected = new Array();
        this.settings.graphType = "line";
        this.settings.graphOptionPoints = true;
        this.settings.graphOptionShadows = true;
        this.settings.graphOptionTooltips = true;
    }
    
    this.saveSettings = function(){
        var _this = this;
        var form = new Object();
        /* Populate the form data object */
        var formArray = $(this.form).serializeArray();
        for (var i=0; i<formArray.length; i++){
            form[formArray[i].name] = formArray[i].value;
        }
        
        this.settings.graphTitle = form["name-input"];
        this.settings.dataTimeFrame = $(this.timeCheckboxGroup.find('label.active')).find('input').val();
        this.settings.dateFrom = form["date-from"];
        this.settings.dateTo = form["date-to"];
        
        this.settings.dataCompare = $(this.dataCompareGroup.find('label.active')).find('input').val();
        
        this.settings.productSelected = new Array();
        $(this.productSelect.find('ul')).find('.select2-search-choice').each(function(i){
            e = $(this).find('div');
            _this.settings.productSelected.push(e.html());
        });
        
        this.settings.packageSelected = this.findPacketSelected();
        this.settings.dataSelected = this.findDatasetSelected();
        
        this.settings.graphType = form["chart-type"];
        this.settings.graphOptionPoints = form["data-points"];
        this.settings.graphOptionShadows = form["shadows"];
        this.settings.graphOptionTooltips = form["tooltips-enabled"];
        
        console.log(this.settings);
    }
    
    this.loadSettings = function(settings){
        var _this = this;
    
        if (typeof settings == "undefined") {
            return;
        }
        if (settings != null) {
            this.settings = settings;
        }
        
        $(this.nameInput.find('input')).val(this.settings.graphTitle);
        $(this.timeCheckboxGroup.find('label').removeClass('active'))
            .find('input[value='+this.settings.dataTimeFrame+']')
            .trigger('click');
            
        this.timeDatePicker.find('input[name=date-from]').val(this.settings.dateFrom);
        this.timeDatePicker.find('input[name=date-to]').val(this.settings.dateTo);
        
        $(this.dataCompareGroup.find('label').removeClass('active'))
            .find('input[value='+this.settings.dataCompare+']')
            .trigger('click');
            
        /* Multiselects */
        for (var i=0; i<_this.settings.productSelected.length; i++) {
            var item = _this.settings.productSelected[i];
            _this.productSelect.find('option:contains('+item+')').prop('selected', 'selected').trigger('change');
        }
        for (var i=0; i<_this.settings.packageSelected.length; i++) {
            var item = _this.settings.packageSelected[i];
            _this.packetSelect.find('option:contains('+item+')').prop('selected', 'selected').trigger('change');
        }
        for (var i=0; i<this.settings.dataSelected.length; i++) {
            var item = this.settings.dataSelected[i];
            _this.dataSelect.find('option:contains('+item+')').prop('selected', 'selected').trigger('change');
            //$(_this.dataSelect.find('select.select2')).find('option:contains('+item+')').prop('selected', 'selected').trigger('change');
        }
            
        $(this.graphTypeControl.find('label').removeClass('active'))
            .find('input[value='+this.settings.graphType+']')
            .trigger('click');
            
        
        /* Default is checked */
        if (this.settings.graphOptionPoints != "on") {
            this.graphOptionsControl.find('input[name=data-points]').trigger('click');
        }
        if (this.settings.graphOptionShadows != "on") {
            this.graphOptionsControl.find('input[name=shadows]').trigger('click');
        }
        if (this.settings.graphOptionTooltips != "on") {
            this.graphOptionsControl.find('input[name=tooltips-enabled]').trigger('click');
        }

        if (this.settings.currentView == 2) {
            this.loadChart();
        }

    }
    
    this.asyncLoadSettings = function(){
        var _this = this;
        
        _this.switchView(this.settings.currentView);
        
        function async(){
            if ((_this.domReady == true) && (_this.productSelectReady == true)) {
                console.log(_this.productSelectReady);
                clearInterval(_this.load_interval);
                _this.loadSettings(null);
            }
        }
        
        _this.load_interval = setInterval(async, 250);
    }
    
} // analyticsWidget

});