define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment', 'viivaNotification', 'viivaGraphSettings',
        'smartAdmin', 'ember', 'dialogManager', 'underscore'],
    function($, jui, DP, util, tr, moment, Notification, viivaGraph, viivaGraphSettings, Ember, DialogManager, underscore) {

return function (){
  this.settings = new Object();
    this.destroyed = false;

  this.loadData = function (customerNumber) {

          var _this = this;

          var customerId = {

            id: customerNumber
          };

          DP.execute({type: "apiNote", method:"getNote", params: customerId}).then(function(response) {

            $('#customer-notes-area').text('');
            _this.populateNote(response, customerNumber);

          });

  };


    this.populateNote = function(response, customerNumber) {


          var _this = this;

          if (_.isEmpty(response.notes)) {

             $('#customer-notes-area').append('Ei tuloksia');

          }

          else {

          response.notes = simpleSorter.sortByProperty(response.notes, 'createDate', 'desc');


          var resultsInPeriod = 0;
          for ( var i = 0 ; i <response.notes.length; i++) {

            response.notes[i] = characterReplacer.replaceCharacters(response.notes[i]);

            var createDate = response.notes[i].createDate;

            if ( createDate !== characterReplacer.replaceCharacter) {
              createDate = moment(createDate).format('DD.MM.YYYY HH:mm:ss');
            }

          var shouldHideNote = true;

          // one year old but max 5
          if(!moment().subtract(1,'year').isAfter(response.notes[i].createDate) && i<5) {
            shouldHideNote = false;
              resultsInPeriod++;

          }

          var noteTags = response.notes[i].tags.split(",");
          var noteMeta = response.notes[i].meta.split(",");

          var select2idString = response.notes[i].id.replace(/,/g,'a');

            $('#customer-notes-area').append("<div"+(shouldHideNote ? " class='notebody-fullscreen hidden'" :" class='notebody' ")+"style='padding:7px; margin-bottom:7px; background-color: rgb(247, 246, 244);' id="+select2idString+">"+
            "<span class='noteHiddenId' style='display:none;'>"+response.notes[i].id+"</span>"+
             "<span class='noteHiddenChannel' style='display:none;'>"+response.notes[i].channel+"</span>"+
             "<span class='noteHiddenCustomerNumber' style='display:none;'>"+response.notes[i].customerNumber+"</span>"+
              "<span class='noteHiddenType' style='display:none;'>"+response.notes[i].noteType+"</span>"+
                  "<header style='background-color:#FFFFFF;'><b>"+tr("widgetServer")+":</b> "+response.notes[i].updaterId+" <b>"+tr("widgetDate")+":</b> "+createDate+
                  "<i class='fa fa-save pull-right saveNote' style='font-size:1.3em; cursor:pointer;'></i></header>"+
                  "<p style='padding:7px;'>"+
                    "<div class='meta-select'>"+
                  "<select multiple style='width:100%;' name='meta' class='select2'>"+
                    "<option value='laskutus'>laskutus</option>"+
                    "<option value='osoitetiedot'>osoitetiedot</option>"+
                    "<option value='myyntikielto'>myyntikielto</option>"+
                  "</select>"+
                  "</div>"+
                     "<div class='tags-select'>"+
                  "<select multiple style='width:100%;' name='tags' class='select2'>"+
                    "<option value='laskutus'>laskutus</option>"+
                    "<option value='osoitetiedot'>osoitetiedot</option>"+
                    "<option value='myyntikielto'>myyntikielto</option>"+
                  "</select>"+
                  "</div>"+
                  "</p>"+
                "<textarea class='form-control' maxlength='280' rows='3'>"+response.notes[i].description+"</textarea>"+
               "</div>");

                $("#"+select2idString+" select[name=tags]").select2();
                $("#"+select2idString+" select[name=meta]").select2();


               $("#"+select2idString+" select[name=tags]").select2("val", noteTags);
               $("#"+select2idString+" select[name=meta]").select2("val", noteMeta);
          
              if(response.user.user !== response.notes[i].updaterId) {
                $("#"+select2idString+" select").attr('disabled', true);
                $("#"+select2idString+" textarea").attr('disabled', true);
                $("#"+select2idString+" .saveNote").remove();
              }
          }
          }


        if (resultsInPeriod < 1) {
           
             $('#customer-notes-area').append('Ei tuloksia tarkastelujaksolla');
          }
      
       _this.bindEvents(customerNumber);

    };

    this.updateNote = function(note) {

      var _this = this;

      DP.execute({type:"apiNote", method:"updateNote", params: note}).then(function(response) {

        if (response.message === 'Successful') {
          Notification.success({
            title: tr("widgetNote"),
            message: tr("widgetNoteUpdated"),
            container: $("body")
            });

         $('#customer-notes-area').text('');
          _this.loadData(note.customerNumber);

        }

        else {
          Notification.error({
            title: tr("widgetNoteCreateFailed"),
            message: response.note.message,
            container: $("body")
            });
        }

       
        });

    };


    this.bindEvents = function(customerNumber) {

       var _this = this;


       // fullscreen on/off
        $('#customerNotes').on('click', function(event) {

         if(document.getElementById("jarviswidget-fullscreen-mode")) {
             $('#customer-notes-area .notebody-fullscreen').removeClass('hidden');
          }
          else {
              $('#customer-notes-area .notebody-fullscreen').addClass('hidden');
            }
        });

        // new note click
        $('#customerNotes .btn').on('click',function() {
          // send customer number to dialog
          DialogManager.create({type: "NoteCreateDialog", id:"note", message:customerNumber});
       });

       // save note click
        $('.saveNote').click(function (event) {

            var noteToUpdate = $(this).parent().parent();

              var noteMeta = null;
              var noteTags = null;

              if (noteToUpdate.find('select[name=meta]').val() != null) {
                noteMeta = noteToUpdate.find('select[name=meta]').val().join();
              }

              if (noteToUpdate.find('select[name=tags]').val() != null) {
                noteTags = noteToUpdate.find('select[name=tags]').val().join();
              }

            var note = {
              noteId: noteToUpdate.find('.noteHiddenId').text(),
              noteType: noteToUpdate.find('.noteHiddenType').text(),
              noteChannel: noteToUpdate.find('.noteHiddenChannel').text(),
              noteTags: noteTags,
              noteMeta: noteMeta,
              customerNumber: customerNumber,
              noteDescription: noteToUpdate.find('.form-control').val()

            };
          
            _this.updateNote(note);

        });


    };

  this.create = function (insideElement) {
        this.view = $("<div class='jarviswidget jarviswidget-color-blueDark' data-widget-deletebutton='false' data-widget-togglebutton='false' data-widget-editbutton='false' data-widget-colorbutton='false' id='customerNotes'>"+
                  " <header>"+
                 " <h2>Muistilaput</h2> "+   
                    "<div class='widget-toolbar'> "+
                      "<btn class='btn btn-xs'><i class='fa fa-plus'></i></button>"+
                   "</div>"+          
                   " </header>"+
                   "<!-- widget div-->"+
                  "<div class='widget-body' id='notesWidget'>"+
                     "<div id='customer-notes-area'></div>"+
                     "</div>"+
                  "</div>"+
                 "</div>");

    $(insideElement).append(this.view);
        
        /* Fix weird button click problem */
       // this.settingsView.find('label.btn-sm').css('width', '100px');
        
        this.domReady = true;
        this.parent = insideElement;


  }; // this.create

}; // analyticsWidget

});