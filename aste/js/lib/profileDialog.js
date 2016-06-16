define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility', 'viivaNotification'],
       function($, jui, Ember, DP, tr, util, Notification) {
  var dialog = "<div class='col-xs-12 smart-form'>" +
                 "<section class='clearfix'>" +
                   "<label class='label'>" + tr("userFirstName") + ":</label>" +
                   "<div class='input'>" +
                     "{{input disabled='disabled' type='text' value=givenName}}" +
                   "</div>" +
                 "</section>" +
                 "<section class='clearfix'>" +
                   "<label class='label'>" + tr("userLastName") + ":</label>" +
                   "<div class='input'>" +
                     "{{input disabled='disabled' type='text' value=familyName}}" +
                   "</div>" +
                 "</section>" +
                 "<section class='clearfix'>" +
                     "<label class='label'>" + tr("userEmail") + ":</label>" +
                     "<div class='input'>" +
                       "{{input disabled='disabled' type='text' value=email}}" +
                     "</div>" +
                   "</section>" +
                   "<div class='current-password'>"+
                     "<section class='clearfix'>" +
                       "<label class='label'>" + tr("oldPassword") + ":</label>" +
                       "<div class='input old-password'><input type='password'>" +
                       "<div class='note note-error'>"+ tr("requiredField") +"</div>"+
                       "</div>"+
                     "</section>" +
                   "</div>"+
                   "<div class='change-lekainfo'>"+
                     "<section class='clearfix'>"+
                     "<label class='label'>" + tr("userLekaUserID") + ":</label>" +
                       "<div class='input lekaUserID'>"+
                       "{{input type='text' value=lekaUserID}}"+
                       "</div>" +
                     "</section>"+
                     "<section class='clearfix'>"+
                     "<label class='label'>" + tr("userLekaSalesID") + ":</label>" +
                        "<div class='input lekaSalesID'>"+
                       "{{input type='text' value=lekaSalesID}}"+
                       "</div>" +
                     "</section>"+
                     "<section class='form-ctrls clearfix'> "+
                     "<button class='btn btn-primary' {{action 'changeLekaInfo' target='view' bubbles=false}}>" +
                         tr("changeLekaInfo") +
                       "</button>" +
                     "</section>"+
                   "</div>"+  
                   "<div class='change-password'>"+
                     "<section class='clearfix'>" +
                       "<label class='label'>" + tr("newPassword") + ":</label>" +
                       "<div class='input new-password'><input type='password'></div>" +
                     "</section>" +
                     "<section class='clearfix'>" +
                       "<label class='label'>" + tr("confirmPassword") + ":</label>" +
                       "<div class='input confirm-password'><input type='password'></div>" +
                     "</section>" +
                     "<section class='form-ctrls'>" +
                       "<button class='btn btn-primary' {{action 'changePassword' target='view' bubbles=false}}>" +
                         tr("changePassword") +
                       "</button>" +
                     "</section>" +
                 "</div>" +
               "</div>";

  var ProfileDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {
      var _this = this;
      var jRoot = _this.$("").addClass("profile-dialog");

      var dialogButtons = [{
        html: tr("close"),
        "class": "btn btn-default",
        click: function() {
          $(this).dialog("close");
        }
      }];
      jRoot.dialog({minWidth: 500, title: tr("profileInfo"),
                   draggable: false, resizable: false,
                   modal: true, buttons: dialogButtons});
      jRoot.on('dialogclose', function() {
        if (typeof _this.onDestroy === "function" && _this.onDestroy){
          _this.onDestroy();
        }
        jRoot.dialog("destroy");
        _this.destroy();
      });
    },
    changePassword: function() {
      var _this = this;
      var jRoot = _this.$("");

      var oldPassword = jRoot.find(".old-password > input").val();
      var newPassword = jRoot.find(".new-password > input").val();
      var confirmPassword = jRoot.find(".confirm-password > input").val();

      if (newPassword) {
        if (confirmPassword && newPassword === confirmPassword) {
         $.ajax({
            url: util.apiBase + "session.password.change",
            type: "POST",
            data: JSON.stringify({user: _this.options.id, password: oldPassword,
                                 newPassword: newPassword}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
              if (typeof data !== "undefined" && data && typeof data.code !== "undefined" &&
                  data.code == 0) {
                Notification.success({title: tr("passwordChangeSuccess"), message:
                                     tr("passwordChangeSuccessDescription")
                                     .replace("_EMAIL_", _this.controller.get('email'))});
                jRoot.find("input[type=password]").val("");
                jRoot.dialog("close");
              } else if (typeof data !== "undefined" && data && typeof data.code !== "undefined" &&
                  data.code == 1) {
                Notification.error({title: tr("passwordChangeFailed"), message: tr("wrongPassword")});
              } else {
                Notification.error({title: tr("passwordChangeFailed"), message: tr("unknownError")});
              }
            },
            error: function() {
              Notification.error({title: tr("passwordChangeFailed"), message: tr("unknownError")});
            }
          });
        } else {
          Notification.error({title: tr("passwordChangeFailed"), message: tr("newPasswordMismatch")});
        }
      } else {
        Notification.error({title: tr("passwordChangeFailed"), message: tr("newPasswordMissing")});
      }
    },
  changeLekaInfo: function(){
    var _this = this;
    var jRoot = _this.$("");

    var dialog = $(this);

    var lekaUserID = jRoot.find(".lekaUserID > input").val();
    var lekaSalesID = jRoot.find(".lekaSalesID > input").val();

    var confirmPassword = jRoot.find(".old-password > input").val();

    if(confirmPassword){

      if(lekaUserID || lekaSalesID){

        $.ajax({

          url: util.apiBase + "user.lekainfo.change",
          type: "POST",
          data: JSON.stringify({user: _this.options.id, password: confirmPassword, lekaUserID: lekaUserID, lekaSalesID: lekaSalesID}),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data){
            if (typeof data !== "undefined" && data && typeof data.code !== "undefined" &&
                  data.code == 0) {
                Notification.success({title: tr("lekaInfoUpdateSuccess"), message: tr("lekaInfoUpdateSuccessDescription").replace("_EMAIL_", _this.controller.get('email'))});
                jRoot.dialog("close");
            }
            else if (typeof data !== "undefined" && data && typeof data.code !== "undefined" &&
                  data.code == 1) {
                Notification.error({title: tr("lekaInfoUpdateFailed"), message: tr("wrongPassword")});
              }
            else {
                Notification.error({title: tr("lekaInfoUpdateFailed"), message: tr("unknownError")});
              }
          },
          error: function(){
              Notification.error({title: tr("lekaInfoUpdateFailed"), message: tr("unknownError")});
          }
        });
        }
        else{
            Notification.error({title: tr("lekaInfoUpdateFailed"), message: tr("lekaInfoMissing")});
        }
          }
      else{
          Notification.error({title: tr("lekaInfoUpdateFailed"), message: tr("currentPasswordMissing")});
      }
  }
  });
  return function(options) {
    if (typeof options !== "undefined" && options && typeof options.id !== "undefined") {
      var ctrlr = DP.find({type: "profile", id: options.id});

      var profileDialog = ProfileDialog.create({controller: ctrlr, options: options});

      profileDialog.appendTo($("body"));

      return profileDialog;
    }
  }
});
