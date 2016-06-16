define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaNotification', 'viivaDialog'],
 function($, jui, Ember, DP, tr, Notification) {
  var dialog = "<div class='row'>"+
                  "<div class='smart-form col-xs-12'>"+
                      "<section class='col-xs-12'>"+
                      "<label class='label'>" + tr("userEmail") + "</label><div class='input'>" +
                      "{{#if view.newUser}}" +
                        "{{input type='text' value=email}}</div>" +
                      "{{else}}" +
                        "{{input disabled='disabled' type='text' value=email}}</div>" +
                      "{{/if}}" +
                      "</section>" +
                      "<section class='col-xs-5'>"+
                        "<label class='label'>" + tr("userGivenName") + "</label><div class='input'>" +
                        "{{input type='text' value=givenName}}</div>" +
                      "</section>" +
                      "<section class='col-xs-1'></section>"+
                      "<section class='col-xs-6'>"+
                        "<label class='label'>" + tr("userFamilyName") + "</label><div class='input'>" +
                        "{{input type='text' value=familyName}}</div>" +
                      "</section>" +
                      "<section class='col-xs-5'>"+
                        "<label for='userLevel'>"+tr("userLevel", "capitalizefirst")+"</label>"+
                        "<select class='form-control' id='userLevelSelect'>"+
                          "<option value='limited'>"+tr("limited", "capitalizefirst")+"</option>"+
                          "<option value='basic'>"+tr("basic", "capitalizefirst")+"</option>"+
                          "<option value='extended'>"+tr("extended", "capitalizefirst")+"</option>"+
                          "<option value='administrative'>"+tr("administrative", "capitalizefirst")+"</option>"+
                        "</select>"+
                      "</section>"+
                    "</div>" +
                    "<div class='smart-form col-xs-12'>"+
                      "<section class='col-xs-5'>"+
                        "<label class='label'>"+tr("userLekaUserID")+"</label><div class='input'>"+
                        "{{input type='text' value=lekaUserID}}</div>"+
                      "</section>"+
                      "<section class='col-xs-1'></section>"+
                      "<section class='col-xs-6'>"+
                        "<label class='label'>"+tr("userLekaSalesID")+"</label><div class='input'>"+
                        "{{input type='text' value=lekaSalesID}}</div>"+
                      "</section>"+
                    "</div>";

  var UserDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = this.$("");

        if(typeof _this.newUser === "undefined") {
      
      // user level check
        _this.controller.then(function(){
          if (_this.controller.get('level') == "administrative" && !window.App.__container__.lookup("controller:application").get("isUserAdmin")) {
            jRoot.find(':input').attr('disabled', true);
            $('.usersavebutton').remove();
          }
        });
      }
    

      var dialogButtons = [{
        html: tr("save"),
        "class": "usersavebutton btn btn-primary",
        click: function() {
          
          if(_this.dialogLock)
            return;
          
          _this.dialogLock = true;
          var dialog = $(this);

          if(typeof _this.controller.get('email') !== "undefined" && _this.controller.get('email')) {

            if(typeof _this.newUser !== "undefined" && _this.newUser) {

                // New user
                if(typeof _this.controller.set === 'function')
                  _this.controller.set("level", jRoot.find('#userLevelSelect').val() );

                _this.controller.save().then(function(user){
                   _this.dialogLock = false;
                   Notification.success({title: tr("userCreationSuccesful"), message: tr("userCreationSuccesfulMessage").replace("_EMAIL_", _this.controller.get('email'))});
                   
                   _this.options.update();
                   dialog.dialog("close");

               }, function(){
                _this.dialogLock = false;
                Notification.error({title: tr("userCreationFailed"), message: tr("userEmailUsed")});
              });
              }

              else {

                var record = _this.controller.get("content");

                if (record.get("isDirty")){
                  record.save().then(function(){

                    _this.dialogLock = false;
                    Notification.success({title: tr("userUpdateSuccesful"), message: tr("userUpdateSuccesful")});
                    _this.options.update();
                    dialog.dialog("close");

                  });

                }

                else {
                  _this.dialogLock = false;
                  Notification.warn({title: tr("userUpdateNoAction"), message: tr("userDataSetUnchanged")});
                  
                }
              }
            }

            else {
              _this.dialogLock = false;
              Notification.error({title: tr("userCreationFailed"), message: tr("userEmailEmpty")});       
            }
          }
        }, {
          html: tr("close"),
          "class": "btn btn-default",
          click: function() {

            if (_this.dialogLock)
              return;
            
            $(this).dialog("close");
            
          }
         },{
          html: tr("resetPassword"),
          "class": "password-reset-button btn btn-default",
          click: function() {

            if (_this.dialogLock)
              return;

            var userObject = {
              id: _this.options.id
            }

             DP.execute({type:"user", method:"passwordReset", params: userObject}).then(function(response) {

              if (response.code == 0) {
                Notification.success({
                  title: tr("passwordSuccess"),
                       message: tr("passwordSent"),
                       container: $("body")
                     });

                dialog.dialog("close");
                $(this).dialog("close");
               
              }
              else {
                Notification.success({
                  title: tr("passwordFail"),
                       message: tr("passwordFail"),
                       container: $("body")
                     });
              } 
            });
          }
          }
        ];

/* This might be useful later.
        if(typeof _this.newUser === "undefined" || !_this.newUser ){
        }*/

var userLevelSelect = jRoot.find('#userLevelSelect');

if(typeof _this.newUser === "undefined" && !_this.newUser){
  _this.controller.then(function(){
    userLevelSelect.val(_this.controller.get("level"));

  });


}

userLevelSelect.change(function(){
  if(typeof _this.controller.set === "function"){
    _this.controller.set("level", $(this).val());
  }
});

 if(!window.App.__container__.lookup("controller:application").get("isUserAdmin")) {
  $("#userLevelSelect option[value='administrative']").remove();
 }

jRoot.dialog({minWidth: 500, minHeight: 400, modal: true, draggable: false, resizable: false,
 title: typeof _this.newUser !== "undefined" && _this.newUser ?
 tr("newUser") : tr("user"), buttons: dialogButtons});
jRoot.on('dialogclose', function() {
  if (typeof _this.onDestroy === "function" && _this.onDestroy){
    _this.onDestroy();
  }
  jRoot.dialog("destroy");
  _this.destroy();
});
}
});

return function(options) {
  if (typeof options !== "undefined" && options) {

   var params = {options: options};

   if( options.id === 'new' ){
    params.controller = DP.create({type: "user", data: {}})
    params.newUser = true;
  }

  else{
    params.controller = DP.find({type: "user", id: options.id, reload: true});

  }

  return UserDialog.create(params).appendTo($("body"));
}

}
});
