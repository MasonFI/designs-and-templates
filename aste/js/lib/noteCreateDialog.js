define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaUtility',
        'viivaDataTable', 'viivaNotification', 'viivaDialog', 'smartAdmin'],
       function($, jui, Ember, DP, tr, util, ViivaDataTable, Notification) {
  var dialog =  "<section>"+
                "<p>Uuden muistilapun luonti</p>" +          
                 "<div class='row'>" +
                  "<div class='col-md-8 smart-form'>" +
                  "<section>"+
                  "<label class='label'>Kuvaus</label>" +
                  "<textarea class='form-control description' maxlength='280' rows='3'></textarea>"+
                  "</section>"+
                   "<section>"+
                  "<label class='label'>Meta</label>" +
                  "<div class='meta-select'>"+
                  "<select multiple style='width:100%;' name='meta' class='select2'>"+
                    "<option value='laskutus'>laskutus</option>"+
                    "<option value='osoitetiedot'>osoitetiedot</option>"+
                    "<option value='myyntikielto'>myyntikielto</option>"+
                  "</select>"+
                  "</div>"+
                  "</section>"+
                  "<section>"+
              
                "</section>"+
                   "<section>"+
                  "<label class='label'>Tagit</label>" +
                   "<div class='tags-select'>"+
                  "<select multiple style='width:100%;' name='tags' class='select2'>"+
                    "<option value='laskutus'>laskutus</option>"+
                    "<option value='osoitetiedot'>osoitetiedot</option>"+
                    "<option value='myyntikielto'>myyntikielto</option>"+
                  "</select>"+
                  "</div>"+
                  "</section>"+
          
                 "<section>" +
                     "<label class='label'>Kanava</label>" +
                     "<div class='select'>" +
                       "<select class='noteChannel'>" +
                         "<option value='MA'>Sähköposti</option>" +
                         "<option value='PU'>Puhelin</option>" +
                         "<option value='MU'>Muu</option>" +
  
                       "</select><i></i>" +
                     "</div>" +
                   "</section>" +
                   "<section>" +
                     "<label class='label'>Tyyppi</label>" +
                     "<div class='select'>" +
                       "<select class='noteType'>" +
                         "<option value='TO'>Toimitus</option>" +
                         "<option value='AS'>Asiakaspalvelu</option>"+
                         "<option value='LA'>Laskutus</option>" +
                         "<option value='MU'>Muu</option>" +
                       "</select><i></i>" +
                     "</div>" +
                   "</section>" +
                   "</div>" +
                "</div></section>";

  var NoteCreateDialog = Ember.View.extend({
    template: Ember.Handlebars.compile(dialog),
    didInsertElement: function() {

      var _this = this;
      var jRoot = _this.$("").addClass("order-note-create-dialog");


      jRoot.find('select[name=meta]').select2();
      jRoot.find('select[name=tags]').select2();

      var dialogButtons = [{
        html: tr("yes"),
        "class": "btn btn-primary",
        click: function() {

          var dialog = $(this);

          var noteMeta = null;
          var noteTags = null;

          if (jRoot.find('select[name=meta]').val() != null) {
            noteMeta = jRoot.find('select[name=meta]').val().join();
          }

          if (jRoot.find('select[name=tags]').val() != null) {
            noteTags = jRoot.find('select[name=tags]').val().join();
          }
          var noteDescription = $('.description').val();
          var noteChannel = $('.noteChannel').val();
          var noteType = $('.noteType').val();
       
          // customerNumber is stored here on dialog create
          var customerNumber = _this.options.message;

          var newNote = {
            noteDescription: noteDescription,
            noteChannel: noteChannel,
            noteType: noteType,
            customerNumber: customerNumber,
            noteMeta: noteMeta,
            noteTags: noteTags

          }

          if (typeof noteDescription !== 'undefined' && noteDescription && noteDescription.length > 280 ) {
               Notification.error({
                  title: tr("widgetNoteCreateFailed"),
                       message: tr("widgetNoteDescriptionTooLong"),
                       container: $("body")
            });
            
          }

          else if (typeof noteMeta !== 'undefined' && noteMeta && noteMeta.length > 140 ) {
               Notification.error({
                  title: tr("widgetNoteCreateFailed"),
                       message: tr("widgetNoteMetaTooLong"),
                       container: $("body")
            });
            
          }

         else if (typeof noteTags !== 'undefined' && noteTags && noteTags.length > 140 ) {
               Notification.error({
                  title: tr("widgetNoteCreateFailed"),
                       message: tr("widgetNoteTagsTooLong"),
                       container: $("body")
            });
            
          }

          else {
          DP.execute({type: "apiNote", method:"createNote", params: newNote}).then(function(response) {

          if (response.message === 'Successful') {
            Notification.success({
              title: tr("widgetNewNote"),
              message: tr("widgetNoteCreated"),
              container: $("body")
            });
              
            customerServiceWidgetManager.notesWidget.loadData(customerNumber);
            dialog.dialog("close"); 
          }
          else {
            Notification.error({
                  title: tr("widgetNoteCreateFailed"),
                       message: response.note.message,
                       container: $("body")
            });
            
          }
            
          });
          }
          
        }
      }, {
        html: tr("no"),
        "class": "btn btn-default",
        click: function() {

          $(this).dialog("close");
        }
      }];

            jRoot.dialog({minWidth: 700, minHeight: 580,
                    title: tr("widgetNewNote"),
                    buttons: dialogButtons, 
                    tabs: [{title: tr("basicInfo")}]});
            

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
     return NoteCreateDialog.create({options: options}).appendTo($("body"));
    }
  
  }
});
