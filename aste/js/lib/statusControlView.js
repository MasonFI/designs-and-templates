define(['jquery', 'jqueryui', 'ember', 'dataPool', 'translate', 'viivaNotification', 'moment', 'viivaUtility', 'dialogManager', 'timepicker', 'aws-sdk.min', 'smartAdmin'],
       function($, jui, Ember, DP, tr, Notification, moment, util, DialogManager) {
        var view = "<article class='col-xs-6'>" +
               "<div class='jarviswidget jarviswidget-color-blueDark'>" +
                 "<header><h2>"+tr("statusControl", "capitalize")+"</h2></header>" +
                   "<div class='widget-body'>"+
                        "<form class='smart-form'>"+
                          "<header>"+tr("serviceBreakSettings")+"</header>"+
                          "<fieldset>"+
                            "<section class='col'>"+
                              "<label class='label'>"+tr("serviceBreakEnvironment", "capitalize")+"</label>"+
                                "<div class='inline-group'>"+
                                  "<label class='radio'>"+
                                    "<input type='radio' name='status-environment' value='0' checked /><i></i>"+tr("environmentDev", "capitalize")+
                                  "</label>"+
                                  "<label class='radio'>"+
                                    "<input type='radio' name='status-environment' value='1' /><i></i>"+tr("environmentProd", "capitalize")+
                                  "</label>"+
                                "</div>"+
                            "</section>"+
                            "<section class='col'>"+
                              "<label for='statusLevelSelect'>Tila</label>"+
                                "<select id='statusLevelSelect' class='form-control' name='status-level'>"+
                                "<option value='0'>Normaali</option>"+
                                "<option value='1'>Kirjautumiset pois käytöstä</option>"+
                                "<option value='2'>Huoltokatko (MyDigi alhaalla)</option>"+
                                "<option value='3'>Myyntipalvelun katkos (Myyntipaikat pois käytöstä)</option>"+
                                "</select>"+
                            "</section>"+
                            "<section class='col'>"+
                              "<label for='status-affected-services'>Palvelut, joihin vaikuttaa</label>"+
                                "<select multiple style='width:100%;' name='status-affected-services' class='select2 status-affected-services'>"+
                                "</select>"+
                           "</section>"+
                          "</fieldset>"+
                          "<fieldset>"+
                           "<section class='col col-6'>"+
                            "<label for='status-date'>"+tr("startDate", "capitalize")+"</label>"+
                              "<div class='input-group'><input class='form-control datepicker' name='status-date'>"+
                              "<span class='input-group-addon'><i class='fa fa-calendar'></i></span>"+
                              "</div>"+
                            "</section>"+
                            "<section class='col col-6'>"+
                            "<label for='status-date-end'>"+tr("endDate", "capitalize")+"</label>"+
                              "<div class='input-group'><input class='form-control datepicker' name='status-date-end'>"+
                              "<span class='input-group-addon'><i class='fa fa-calendar'></i></span>"+
                              "</div>"+
                            "</section>"+
                            "<section class='col col-6'>"+
                              "<label for='status-time-start'>Alkaa klo</label>"+
                                "<div class='input'><i class='fa fa-clock-o icon-append'></i><input class='timepicker' name='status-time-start'></div>"+
                            "</section>"+ 
                            "<section class='col col-6'>"+
                              "<label for='status-time-end'>Päättyy klo</label>"+
                              "<div class='input'><i class='fa fa-clock-o icon-append'></i><input class='timepicker' name='status-time-end'></div>"+
                            "</section>"+
                            "</fieldset>"+
                            "<fieldset>"+
                            "<section>"+
                              "<label for='status-message'>Palveluissa esitettävä ilmoitus</label>"+
                              "<label class='textarea'>"+
                                "<textarea name='status-message' rows=3>Verkkopalvelussa suoritetaan huoltotöitä. Palvelun kirjautuminen, sekä kirjautumista edellyttävät sisällöt eivät toimi katkosten aikana. Pahoittelemme häiriötä.</textarea>"+
                              "</label>"+
                            "</section>"+
                           "<section>"+
                            "<label for='status-message'>Ilmoituksen tyylit</label>"+
                            "<label class='textarea'>"+
                            "<textarea rows=3 name='status-css'>font-size:20px; padding-top:10px; background: #FDF598; color: #000; width:100%; height: auto; line-height:20px; position:fixed;bottom: 0px;left: 0;box-shadow: 1px 2px 6px #ccc;text-align: center;</textarea>"+
                            "</label>"+
                          "</section>"+
                          "</fieldset>"+
                      "<footer class='status-control-footer'>"+
                        "<button type='submit' class='btn btn-primary status-control-submit'>Tallenna</button>"+
                      "</footer>"+
                      "</div>"+ 
                 "</div>" +
             "</article>";

  return function(options) {
    return Ember.View.extend({
      template: Ember.Handlebars.compile(view),
      didInsertElement: function() {
 
        var _this = this;
        var jRoot = _this.$("");

        AWS.config.update({accessKeyId: 'AKIAIIZFDJNQZHVXG3VQ', secretAccessKey: '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'});
        AWS.config.region = 'eu-west-1';

        this.getUpcomingServiceBreak = function(){

          jRoot.find('.alert').remove();

          $.ajax({
          url : "//otavamedia-mydigi.s3.amazonaws.com/" + 'service.status' + _this.getEnv() ,
          type : "GET",
          dataType : "json"})
         .done(function(data){

            var status = parseInt( data.status );
            var now = moment(new Date()).unix();
            var start = parseInt( data.statusTimeStart );
            var end = parseInt( data.statusTimeEnd );

            if( status == 0 || ( status > 0 && now > end ) ){
               jRoot.find('.widget-body').prepend('<div class="alert alert-success fade in"><button class="close" data-dismiss="alert">×</button>'+
                   '<i class="fa-fw fa fa-check"></i>'+
                   tr("noUpcomingServiceBreaks")+
                   '</div>');
               return false;
            }

            else if( status > 0 && now < start){
                jRoot.find('.widget-body').prepend('<div class="alert alert-warning fade in"><button class="close" data-dismiss="alert">×</button>'+
                   '<i class="fa-fw fa fa-warning"></i>'+
                   tr("scheduledServiceBreak")+
                   '</div>');
            }

            else{
               jRoot.find('.widget-body').prepend('<div class="alert alert-danger fade in"><button class="close" data-dismiss="alert">×</button>'+
                   '<i class="fa-fw fa fa-info"></i>'+
                   tr("ongoingServiceBreak")+
                   '</div>');

            }

            jRoot.find('[name="status-level"]').val( data.status );
            jRoot.find('[name="status-affected-services"]').select2('val', data.statusAffectedServices );

            jRoot.find('[name="status-date"]').val( moment(data.statusTimeStart * 1000).format('DD.MM.YYYY') );
            jRoot.find('[name="status-date-end"]').val( moment(data.statusTimeEnd * 1000).format('DD.MM.YYYY') );

            jRoot.find('[name="status-time-start"]').val( moment(data.statusTimeStart * 1000).format('HH:mm') );
            jRoot.find('[name="status-time-end"]').val( moment(data.statusTimeEnd * 1000).format('HH:mm') );

            jRoot.find('[name="status-message"]').val( data.statusMessage );
            jRoot.find('[name="status-css"]').val( data.statusCss );

          });

        }

        this.uploadServiceBreak = function( s3Status ){

          var s3params = {Key: 'service.status' + this.getEnv() , Body: JSON.stringify( s3Status ), ContentType: 'application/json', ACL: 'public-read' };

          this.bucket.putObject( s3params, function(error, data){

              if(error){
                console.log(error);
              }

              else{
                _this.getUpcomingServiceBreak();
                Notification.success({title: tr("serviceBreakSet"), message: tr("serviceBreakSetSuccess")});
              }

          });

        }

        this.submitServiceBreak = function(){
          
          var s3Status = {};
 
          s3Status.status = jRoot.find('[name="status-level"]').val();

          var timeStart = moment( jRoot.find('[name="status-date"]').val() + ' ' + jRoot.find('[name="status-time-start"]').val(), 'DD.MM.YYYY HH:mm' );
          var timeEnd = moment( jRoot.find('[name="status-date-end"]').val() + ' ' + jRoot.find('[name="status-time-end"]').val(), 'DD.MM.YYYY HH:mm' );

          s3Status.statusTimeStart = timeStart.unix();
          s3Status.statusTimeEnd = timeEnd.unix();

          if( s3Status.statusTimeEnd < s3Status.statusTimeStart ){
              Notification.error({title: tr("serviceBreakInvalidTiming"), message: tr("serviceBreakInvalidTimingMsg")});
              return false;
          }

          s3Status.statusAffectedServices = jRoot.find('[name="status-affected-services"]').select2('val');
          s3Status.statusMessage = jRoot.find('[name="status-message"]').val();

          s3Status.statusCss = jRoot.find('[name="status-css"]').val();

          this.uploadServiceBreak( s3Status );

        }

        this.getEnv = function(){

          if ( parseInt( jRoot.find('[name="status-environment"]:checked').val() ) == 0 )
            return ".dev";

          else return '';

        }

        this.bindEvents = function(){

         var _this = this;
         
         jRoot.find('.status-control-submit').bind('click', function(e){
          e.preventDefault();
          _this.submitServiceBreak();
                 
         });

         jRoot.find('[name="status-environment"]').bind('change', function(){
          $('[name="status-environment"]').prop('checked', false);
          $(this).prop('checked', true);
          _this.getUpcomingServiceBreak();
         });
         
        }

        this.initComponents = function(){

         jRoot.find('.datepicker').datepicker({prevText:"<", nextText:">"});
         jRoot.find('.timepicker').timepicker({showMeridian: false, defaultTime: "0:0:0"});
         jRoot.find('.status-affected-services').select2();
         jRoot.find('[name="status-date"]').val(moment().format('DD.MM.YYYY'));
         jRoot.find('[name="status-date-end"]').val(moment().format('DD.MM.YYYY'));

        }

        this.populateServiceSelect = function(){

             $.ajax({
              type: "post",
              url: util.apiBase + "service.get",
              data: JSON.stringify({}),
              contentType: 'application/json',
              dataType: 'json',
              success: function(data){

                var services = [];

                $.each(data, function(key, value){

                  if(typeof value == 'object')
                    services.push('<option value="' + value['url'] + '">'+ value['name'] + '</option>');

                });

                $('[name="status-affected-services"]').html(services.join(''));

              }
          });   
        } 

        this.init = function(){
          this.populateServiceSelect();
          this.initComponents();
          this.bindEvents();

          this.bucket = new AWS.S3({params: {Bucket: 'otavamedia-mydigi'}});
          this.getUpcomingServiceBreak();
        }

        this.init();

    }  
    });
  };
});
