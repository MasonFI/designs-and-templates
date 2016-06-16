require.config({
  baseUrl: 'resources/js/lib',
  paths: {
    app: '../app',
    jquery: 'jquery-1.10.2.min',
    bootstrap: 'bootstrap.min',
    jqueryui: 'jquery-ui-1.10.3.custom.min',
    timepicker: 'bootstrap-timepicker.min',
    jarviswidget: 'jarvis.widget.min',
    smartnotification: "smartNotification",
    select2: "select2.min",
    moment: 'moment-with-langs.min',
    fullcalendar: "jquery.fullcalendar.min",

    // Data tables
    dataTables: 'dataTables/jquery.dataTables-cust',
    colReorder: 'dataTables/ColReorder.min',
    fixedColumns: 'dataTables/FixedColumns.min',
    colVis: 'dataTables/ColVis.min',
    zeroClipboard: 'dataTables/ZeroClipboard',
    dtBootstrap: 'dataTables/DT_bootstrap',

    // Flot
    flot: "jquery.flot.cust",
    flotResize: "jquery.flot.resize.min",
    flotFillbetween: "jquery.flot.fillbetween.min",
    flotOrderBar: "jquery.flot.orderBar.min",
    flotPie: "jquery.flot.pie.min",
    flotTooltip: "jquery.flot.tooltip.min",

    // jqPlot

    jqPlot: "jquery.jqplot.min",
    jqPlotBar: "jqplot.barRenderer.min",
    jqCategoryAxis: "jqplot.categoryAxisRenderer.min",
    jqPointLabels: "jqplot.pointLabels.min",

    // d3

    d3: "d3.min",
    d3legend: "d3legend",

    // Colorpicker
    colorPicker: "jquery.colorpicker.min",
    
    // Colpick
    colpick: "colpick.min",

    // underscore
    underscore: "underscore.min",
    
    // Summernote
    summernote: "summernote",

    // Slider
    slider: "bootstrap-slider.min"
  },
  shim: {
    'bootstrap': {
      deps: ['jquery', 'jqueryui']
    },
    'jqueryui': {
      exports: '$',
      deps: ['jquery']
    },
    'timepicker': {
      deps: ['bootstrap']
    },
    'jquery.ui.datepicker-fi': {
      deps: ['jqueryui']
    },
    'jarviswidget': {
      deps: ['jqueryui']
    },
    'smartnotification': {
      deps: ['jquery']
    },
    'select2': {
      deps: ['jquery']
    },
    'fullcalendar': {
      deps: ['jquery']
    },
    'smartAdmin': {
      deps: ['bootstrap','jquery', 'jqueryui', 'jarviswidget',
             'smartnotification', 'select2']
    },
    'ember': {
      exports: 'Ember',
      deps: ['jquery', 'handlebars']
    },
    'ember-data': {
      exports: 'DS',
      deps: ['ember']
    },

    // Data tables
    colReorder: {
      deps: ['dataTables']
    },
    fixedColumns: {
      deps: ['dataTables']
    },
    colVis: {
      deps: ['dataTables']
    },
    zeroClipboard: {
      deps: ['dataTables']
    },
    dtBootstrap: {
      deps: ['dataTables']
    },

    // Flot
    flot: {
      deps: ['jquery']
    },
    flotResize: {
      deps: ['flot']
    },
    flotFillbetween: {
      deps: ['flot']
    },
    flotOrderBar: {
      deps: ['flot']
    },
    flotPie: {
      deps: ['flot']
    },
    flotTooltip: {
      deps: ['flot']
    },
    // d3
    d3: {
      deps: ['jquery']
    },

    d3legend: {
      deps: ['d3']
    },

  	// jqPlot

    jqPlot: {
      deps: ['jquery']
   	},

	jqPlotBar: {
	 deps: ['jqPlot']
	 },

	jqCategoryAxis: {
	 deps: ['jqPlot']
	},

	jqPointLabels: {
		deps: ['jqPlot']
	},

    colorPicker: {
      deps: ['jquery']
    },
    colpick: {
      deps: ['jquery']
    },
    summernote: {
      deps: ['jquery', 'bootstrap']
    },
    slider: {
      deps: ['jqueryui']
    }
  }
});

// Set jquery UI default options
require(['jquery', 'jqueryui', 'jquery.ui.datepicker-fi'], function($) {
  // Datepicker
  $.datepicker.setDefaults($.datepicker.regional[ "fi" ]);

  // Prevent the date picker widget from closing the UI element underneath it
  // e.g. dropdown menu
  $(document).on('click', '.ui-datepicker-header', function(event){
    event.stopPropagation();
  });
});

// Set up custom Ember helper
require(['ember', 'translate', 'viivaUtility'], function(Ember, tr, util) {
  Ember.Handlebars.registerHelper('trigger', function (evtName, options) {
    var options = arguments[arguments.length - 1],
        hash = options.hash,
        view = options.data.view,
        target;

    view = view.get('concreteView');

    if (hash.target) {
      target = Ember.Handlebars.get(this, hash.target, options);
    } else {
      target = view;
    }

    Ember.run.next(function () {
      if (typeof options.hashContexts !== "undefined" && options.hashContexts &&
          typeof options.hashContexts.target !== "undefined") {
        target.trigger(evtName, options.hashContexts.target);
      } else {
        target.trigger(evtName);
      }
    });
  });

  Ember.Handlebars.registerBoundHelper('parseDate', function (date) {
    var dateString = util.parseDate(date);

    if (dateString) {
      return dateString;
    } else {
      return "";
    }
  });
});

require(['jquery', 'ember', 'translate', 'authentication', 'smartAdmin', 'dataPool', 'dialogManager',
         'viivaNotification', 'customersView', 'ordersView', 'productsView', 'packagesView',
         'packageCalendarView', 'settingsView', 'landingPageView', 'analyticsView', 'customerServiceSearchView', 
         'analyticsSubscribersView', 'analyticsSalesView', 'analyticsContinualsView', 'customerServiceView',
         'customerServiceStompConfigurationView', 'userManagementView', 'statusControlView', 'productRankView'],
        function($, Ember, tr, Auth, SA, DP, DM, Notification, CustomersView, OrdersView, ProductsView,
                 PackagesView, PackageCalendarView, SettingsView, LandingPageView, AnalyticsView, CustomerServiceSearchView, 
                 AnalyticsSubscribersView, AnalyticsSalesView, AnalyticsContinualsView, CustomerServiceView,
                 CustomerServiceStompConfigurationView, UserManagementView, StatusControlView, ProductRankView) {
  function initialization(user) {
    var app = Ember.Application.create();

    // Init data pool
    DP.init(app);

    window.App = app;

    // Push user profile data in
    DP.push({type: "profile", data: user});

    // Do some document ready initialization for the app
    app.ApplicationView = Ember.View.extend({
      didInsertElement : function(){
        smartAdminReady();
      }
    });

    // Routing
    app.Router.map(function() {
      switch (user.level) {
        case 'administrative':
          this.route('settings');
          this.route('products');
          this.route('landingPage');
          this.route('statusControl');
          this.route('productRank');
          // Fall through
        case 'extended':
          this.route('userManagement');
          this.route('packages');
          this.route('packageCalendar');
          this.route('customerServiceStompConfiguration');
          this.route('analyticsSubscribers');
          this.route('analyticsSales');
          this.route('analyticsContinuals');
          this.route('analytics');
          // Fall through
        case 'basic':
          this.route('customers');
          this.route('orders');
          // Fall through
        case 'limited':
          this.resource('customerService', { path:'customerService/:customerId' });
          this.route('customerServiceSearch'); 
      }
    });

    app.IndexRoute = Ember.Route.extend({
      beforeModel: function() {
        this.transitionTo('customerServiceSearch');
      }
    });

    app.CustomerServiceRoute = Ember.Route.extend({
      model: function(params) {
        return params.customerId;
      },
      setupController: function(controller, model) {  
        controller.set("content", model);  
        // reload view        
        $.each(Ember.View.views, function( i, view ) {
              if (view.renderedName === "customerService"){
                view.rerender();
              }
          });
        }
      });

    // Controller
    app.ApplicationController = Ember.Controller.extend({
      // Static UI values
      adminTitle: tr('salesSystem'),
      user: user,
      userName: user.givenName + " " + user.familyName,
      customers: tr("customers"),
      orders: tr("orders"),
      products: tr("products"),
      listing: tr("listing"),
      packages: tr("packages"),
      packageCalendar: tr("packageCalendar"),
      settings: tr("settings"),
      landingPage: tr("landingPages"),
      analytics: tr("analytics"),
      analyticsSubscribers: tr("analyticsSubscribers"),
      analyticsSales: tr("analyticsSales"),
      analyticsContinuals: tr("analyticsContinuals"),
      customerServiceSearch: tr("aspa konepelti"),
      customerService: tr("toinen sivu"),
      stompConfiguration: tr("stompConfiguration"),
      hidemenuTooltip: tr("hidemenu", "capitalizefirst"),
      logoutTooltip: tr("logout", "capitalizefirst"),
      userManagement: tr("userManagement", "capitalizefirst"),
      statusControl: tr("statusControl", "capitalizefirst"),
      administration: tr("administration", "capitalizefirst"),
      productRank: tr("productRank", "capitalizefirst"),

      isUserSuperUser: function() {
        return this.user.level === "superuser";
      }.property('user'),
      isUserAboveLimited: function() {
        return this.user.level === "extended" || this.user.level === "administrative" || this.user.level === "basic";
      }.property('user'),
      isUserSales: function() {
        return this.user.level === "extended" || this.user.level === "administrative";
      }.property('user'),
      isUserAdmin: function() {
        return this.user.level === "administrative";
      }.property('user'),
      openProfileDialog: function() {
        DM.create({type: 'ProfileDialog', id: this.user.id});
      },
      logout: function() {
        Auth.logout({
          name: this.userName,
          complete: function() {
            location.reload();
          }
        });
      }
    });

    // Views
    switch (user.level) {
      case 'administrative':
        app.SettingsView = SettingsView();
        app.ProductsView = ProductsView();
        app.LandingPageView = LandingPageView();
        app.StatusControlView = StatusControlView();
        app.ProductRankView = ProductRankView();
        // Fall through
      case 'extended':
        app.PackagesView = PackagesView();
        app.UserManagementView = UserManagementView();
        app.AnalyticsSubscribersView = AnalyticsSubscribersView();
        app.AnalyticsSalesView = AnalyticsSalesView();
        app.AnalyticsContinualsView = AnalyticsContinualsView();
        app.PackageCalendarView = PackageCalendarView();
        app.AnalyticsView = AnalyticsView();
        app.CustomerServiceStompConfigurationView = CustomerServiceStompConfigurationView();
        // Fall through
      case 'basic':
        app.CustomersView = CustomersView();
        app.OrdersView = OrdersView();
      case 'limited':
        app.CustomerServiceSearchView = CustomerServiceSearchView();
        app.CustomerServiceView = CustomerServiceView();
    }
  }

          //var user = {id: "123", givenName: "Tianyan", familyName: "Liu", level: 'administrative'};
          //initialization(user);

          //*
  Auth.login({success: function(user) {
               // Close all possible error notification
               $("body > .SmallBox ").trigger("click");
               initialization(user);
             }, error: function() {
               Notification.error({
                 title: tr("loginFailed"),
                 message: tr("loginFailedInstructions"),
                 container: $("body")
               });
             }});
           //*/
});