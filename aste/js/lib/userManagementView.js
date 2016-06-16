  define(['jquery', 'jqueryui', 'ember', 'translate', 'viivaUtility', 'viivaDataTable', 'viivaTableView', 'dialogManager'],
  	function($, jui, Ember, tr, util, ViivaDataTable, ViivaTableView, DialogManager) {
  		return function(options) {
  			return Ember.View.extend({
        // Effectively document ready
        didInsertElement: function() {
        	var _this = this;
        	var jRoot = _this.$("");

        	var view = new ViivaTableView();
        	view.create({title: tr("users"), flags: view.RELOAD | view.ADD, container: jRoot});

        	var dataTable = new ViivaDataTable();
        	dataTable.create({
        		container: jRoot.find(".table-body"),
        		method: "user.get",
        		onProcessing: function(processing) {
        			view.toggleReload(processing);
        		},
        		colDefs: [
        		{name: tr("userID"), prop: "id", visible: false},
        		{name: tr("userEmail"), prop: "userEmail"},
        		{name: tr("userGivenName"), prop: "userGivenName"},
        		{name: tr("userFamilyName"), prop: "userFamilyName"},
        		{name: tr("userLevel"), prop: "userLevel", sortable: false,
             render: function(data){return tr(data, "capitalizefirst"); }},
        		],
          defaultSort: [[0, "desc"]],
          onClick: function(row, data) {

          	var dialogOption = {type: "UserDialog", id: data.id,
                                update: function() {dataTable.updateTable();}};

            DialogManager.create(dialogOption);

          	},
          	filterFn: function(data) {

          		return null;
          	}
          });

        jRoot.find(".table-view").on("reload", function() {
          dataTable.updateTable();
        });

        jRoot.find(".table-view").on("add", function() {
          DialogManager.create({type: "UserDialog", id: "new",
                               update: function() {dataTable.updateTable();}});
        });

        }
    });
};
});