define(['jquery', 'jqueryui', 'dataPool', 'viivaUtility', 'translate', 'moment', 'viivaNotification', 'dialogManager', 'slider', 'smartAdmin', 'aws-sdk.min', /*'colorPicker',*/ 'colpick', 'summernote'],
    function($, jui, DP, util, tr, moment, Notification, DialogManager) {

return function (){

    this.domReady = false;

    this.create = function(insideElement){

        this.devMode = false;
        this.devSuffix = "";
        if (window.location.hostname != "mydigi.otavamedia.fi") {

            console.log('working in development mode');
            this.devMode = true;
            this.devSuffix = ".dev";
        }

        this.landingPageView = $('<article/>')
            .attr('class', 'col-xs-12 sortable-grid ui-sortable')
            .attr('data-sortable', 'false')
            .append($('<div id="wid-id-landingpage" class="jarviswidget jarviswidget-color-blueDark"' +
                      'data-widget-colorbutton="false" '+
                      'data-widget-editbutton="false" '+
                      'data-widget-custombutton="false"'+
                      'data-widget-deletebutton="true"' +
                      'data-widget-togglebutton="false"' +
                      'data-widget-sortable="false"' +
                      'data-widget-fullscreenbutton="false">'));

        this.landingPageViewHeader = $('<header/>').append([
            $('<div/>').attr('role', 'menu').addClass('jarviswidget-ctrls'),
            $('<h2/>').html('Myyntipaikkojen suunnittelu')
        ]);

        this.formWrapper = $('<div/>').append($('<form/>').css({paddingBottom: '20px'}));
        // Save reference to the master form
        this.form = this.formWrapper.find('form');
        this.serializedForm = null;

        this.saveButton = $('<button/>').attr('class', 'btn btn-primary pull-right').html('Tallenna');
        this.contButton = $('<button/>').attr('class', 'btn btn-primary pull-right').html('Kestotilaaja');



        this.continualBoxContainer = $('<div/>').attr('class','form-group col-xs-12 smart-form').append([
            $('<div/>').addClass('col-xs-6').append([
            $('<legend>Kestotilaajalaatikko</legend>'),
            $('<div/>').addClass('col-xs-12').append([
            $('<label/>').addClass('toggle').append([
            $('<input/>').attr('type','checkbox').attr('name','continual-box-visible'),
            $('<i/>').attr('id','cont-shower').attr('data-swchon-text', 'Kyllä').attr('data-swchoff-text','Ei'),
            $('<span/>').html('Näytä Kestotilaajalaatikko')

                ])])])
            ]);

          this.footerShowContainer = $('<div/>').attr('class','form-group col-xs-12 smart-form').append([
            $('<div/>').addClass('col-xs-6').append([
            $('<legend>Alapalkki</legend>'),
            $('<div/>').addClass('col-xs-12').append([
            $('<label/>').addClass('toggle').append([
            $('<input/>').attr('type','checkbox').attr('name','footer-package-hidden'),
            $('<i/>').attr('id','footer-shower').attr('data-swchon-text', 'Kyllä').attr('data-swchoff-text','Ei'),
            $('<span/>').html('Näytä alapalkki')

                ])])])
            ]);

        this.layoutControl = $('<fieldset/>').append([
            $('<legend>Sivumallit</legend>'),
            $('<div/>').addClass('row')
        ]);

        this.packetLayoutCheckboxGroup = $('<div/>').addClass('col-md-4').addClass('btn-group').attr('data-toggle', 'buttons').append([
          $('<p/>').html('Palstojen määrä'),
          $('<label/>').attr('class', 'btn btn-default btn-sm active').html('1')
            .append($('<input/>').attr({name: 'columns', value: '1', type: 'radio', checked: 'checked'})),
          $('<label></label>').attr('class', 'btn btn-default btn-sm').html('2')
            .append($('<input/>').attr({name: 'columns', value: '2', type: 'radio'})),
          $('<label/>').attr('class', 'btn btn-default btn-sm').html('3')
            .append($('<input/>').attr({name: 'columns', value: '3', type: 'radio'})),
        ]);

        this.spotSelect = $('<div/>').addClass('col-md-4 form-group').html(
            '<label>Valitse myyntipaikka</label>'+
            '<select name="spot-select" class="select2"><option selected disabled>Valitse myyntipaikka</option></select>'
        );
        this.spotSelectInfo = $('<div/>').addClass('col-md-5 form-group spot-info').html(
            '<label>Myyntipaikan URL:</label>'+
			'<input type="text" disabled="disabled" class="form-control">'
        ).css("display", "none");
        this.layoutControl.find('div').append([
            this.spotSelect,
            this.spotSelectInfo
        ]);

        this.colorSelect = $('<fieldset/>').append([
            $('<legend>Värit</legend>'),
            $('<div/>').addClass('row')
        ]);

        this.colorSelect.find('div').html(
            '<div class="col-xs-12 form-group"><label>Lomakkeen tausta</label><input name="background-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text" value="#ffffff"></input></div>\
             <div class="col-xs-12 form-group"><label>Otsikon tausta</label><input name="header-background-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text" value="#ffffff"></input></div>\
             <div class="col-xs-12 form-group"><label>Iso otsikko, tilaa-nappula, hinta</label><input name="highlight-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text" value="#0000ff"></input></div>\
             <div class="col-xs-12 form-group"><label>Leipäteksti</label><input name="text-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text" value="#000000"></input></div>\
             <div class="col-xs-12 form-group">\
             <div class="row">\
             <label class="col-xs-12">Sivun tausta</label>\
             <div class="col-xs-6"><input name="page-background-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text" value="#000000"></input></div>\
             <div class="col-xs-6"><input type="text" name="background-css-selector" class="form-control" placeholder="Elementin css-selektori"></div>\
             </div>\
             </div>'
        );

        this.headerBackgroundimageElement = $('<div/>').addClass('smart-form row').html(
            '<div class="col-xs-12">'+
            '<label class="label">Otsikon taustakuva</label>' +
            '<label for="header-background-image" class="input input-file">'+
                '<div class="button"><input type="file" name="header-background-image" onchange="this.parentNode.nextSibling.value = this.value">Selaa</div><input type="text" placeholder="Lisää kuva" readonly="">' +
            '</label>' +
            '</div>'
        );
		this.headerBackgroundimageInput = this.headerBackgroundimageElement.find('input[type="file"]');

        this.backgroundImageSelect = $('<fieldset/>').append([
            $('<legend>Taustakuva</legend>'),
            $('<div/>').append(this.headerBackgroundimageElement)
        ]);

        this.textInputs = $('<fieldset/>').append([
            $('<legend>Tekstit</legend>'),
            $('<div/>')
        ]);

        this.headerTextVerticalAlignment = $('<div/>').addClass('col-xs-12').html(
            '<label class="label">Otsikon pystytasaus</label>' +
            '<div class="inline-group">' +
            '<label class="radio">' +
            '<input type="radio" name="header-text-vertical-alignment" value="top">' +
            '<i></i>Ylös</label>' +
            '<label class="radio">' +
            '<input type="radio" name="header-text-vertical-alignment" value="middle">' +
            '<i></i>Keskelle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="header-text-vertical-alignment" value="bottom">' +
            '<i></i>Alas</label>'
        );

        this.headerBigTextElement = $('<div/>').addClass('col-xs-12').html(
            '<label class="label">Iso otsikko</label>' +
            '<label class="textarea textarea-expandable">'+
                '<textarea rows="3" class="custom-scroll" name="header-big-text" style="display: inline-block;"></textarea>' +
            '</label>' +
            '<div class="note"><strong>Ohje:</strong> kenttä laajenee klikatessa.</div>' +
            '<label class="label">Sivutasaus</label>' +
            '<div class="inline-group">' +
            '<label class="radio">' +
            '<input type="radio" name="header-big-text-alignment" checked="checked" value="left">' +
            '<i></i>Vasemmalle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="header-big-text-alignment" value="center">' +
            '<i></i>Keskelle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="header-big-text-alignment" value="right">' +
            '<i></i>Oikealle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="header-big-text-alignment" value="justify">' +
            '<i></i>Tasattu</label>' +
            '</div>' +
            '<label class="label">Asemointi</label>' +
            '<section class="col col-md-3">' +
            '<label class="input">' +
			'Ylös' +
            '<input type="text" class="input-xs" name="header-big-text-padding-top">' +
			'</label>' +
            '</section>' +
            '<section class="col col-md-3">' +
            '<label class="input">' +
            'Oikealle' +
			'<input type="text" class="input-xs" name="header-big-text-padding-right">' +
			'</label>' +
            '</section>' +
            '<section class="col col-md-3">' +
            '<label class="input">' +
            'Alas' +
			'<input type="text" class="input-xs" name="header-big-text-padding-bottom">' +
			'</label>' +
            '</section>' +
            '<section class="col col-md-3">' +
            '<label class="input">' +
            'Vasemmalle' +
			'<input type="text" class="input-xs" name="header-big-text-padding-left">' +
			'</label>' +
            '</section>' +
            '<div class="note">Tyhjä tila pikseleissä.</div>'
        );
        this.headerBigTextInput = this.headerBigTextElement.find('textarea');

        this.headerSmallTextElement = $('<div/>').addClass('col-xs-12').html(
            '<label class="label">Pieni otsikko</label>' +
            '<label class="textarea textarea-expandable">'+
                '<textarea rows="3" class="custom-scroll" name="header-small-text" style="display: inline-block;"></textarea>' +
            '</label>' +
            '<div class="note"><strong>Ohje:</strong> kenttä laajenee klikatessa.</div>' +
            '<label class="label">Sivutasaus</label>' +
            '<div class="inline-group">' +
            '<label class="radio">' +
            '<input type="radio" name="header-small-text-alignment" checked="checked" value="left">' +
            '<i></i>Vasemmalle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="header-small-text-alignment" value="center">' +
            '<i></i>Keskelle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="header-small-text-alignment" value="right">' +
            '<i></i>Oikealle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="header-small-text-alignment" value="justify">' +
            '<i></i>Tasattu</label>' +
            '</div>' +
            '<label class="label">Asemointi</label>' +
            '<section class="col col-md-3">' +
            '<label class="input">' +
			'Ylös' +
            '<input type="text" class="input-xs" name="header-small-text-padding-top">' +
			'</label>' +
            '</section>' +
            '<section class="col col-md-3">' +
            '<label class="input">' +
            'Oikealle' +
			'<input type="text" class="input-xs" name="header-small-text-padding-right">' +
			'</label>' +
            '</section>' +
            '<section class="col col-md-3">' +
            '<label class="input">' +
            'Alas' +
			'<input type="text" class="input-xs" name="header-small-text-padding-bottom">' +
			'</label>' +
            '</section>' +
            '<section class="col col-md-3">' +
            '<label class="input">' +
            'Vasemmalle' +
			'<input type="text" class="input-xs" name="header-small-text-padding-left">' +
			'</label>' +
            '</section>' +
            '<div class="note">Tyhjä tila pikseleissä.</div>'
        );
        this.headerSmallTextInput = this.headerSmallTextElement.find('textarea');
/*
        this.textInputs.find('div').append([
            this.headerTextVerticalAlignment,
            this.headerBigTextElement,
            this.headerSmallTextElement
        ]);
*/
        this.textInputs.find('div').append([
            $('<section/>').addClass('row smart-form').append(this.headerTextVerticalAlignment),
            $('<div/>').attr('id', 'header-text').css({'border' : '1px dashed slategray', 'height' : '200px'})
        ]);
        this.textInputs.find('#header-text').summernote({
                focus : true,
                height : '200',
                toolbar: [
                    ['fontfamily', ['fontname']],
                    ['style', ['color', 'bold', 'italic', 'underline']],
                    ['size', ['fontsize']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']]
                ]
        });

        this.brandLogoElement = $('<div/>').addClass('smart-form row').html(
            '<div class="col-xs-12">' +
            '<label class="label">Sivutasaus</label>' +
            '<div class="inline-group">' +
            '<label class="radio">' +
            '<input type="radio" name="brand-logo-alignment" value="left">' +
            '<i></i>Vasemmalle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="brand-logo-alignment" value="center">' +
            '<i></i>Keskelle</label>' +
            '<label class="radio">' +
            '<input type="radio" name="brand-logo-alignment" value="right">' +
            '<i></i>Oikealle</label>'+
            '</div>'+
            '<div class="col-xs-12">' +
            '<label for="brand-logo-image" class="input input-file">'+
                '<div class="button"><input type="file" name="brand-logo-image" onchange="this.parentNode.nextSibling.value = this.value">Selaa</div><input type="text" placeholder="Lisää kuva" readonly="">' +
            '</label>' +
            '</div>'
        );
		this.brandLogoInput = this.brandLogoElement.find('input[type="file"]');

        this.brandLogoSelect = $('<fieldset/>').append([
            $('<legend>Brändin logo</legend>'),
            $('<div/>').append(this.brandLogoElement)
        ]);

        var slider = '<label>Reunan koko (pikseliä)</label>'+
        '<input style="" class="slider slider-primary" data-slider-min="1" data-slider-max="15" data-slider-value="1" data-slider-selection="before" data-slider-handle="round" type="text">';

        this.packageStyles = $('<div/>').addClass('col-xs-12').html(

            '<legend class="col-xs-12">Pakettien tyylit</legend>'+
            '<div class="form-group col-xs-4"><label>Otsikon tausta</label><input name="packages-header-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text"></input></div>'+
            '<div class="form-group col-xs-4"><label>Paketin tausta</label><input name="packages-background-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text"></input></div>'+
            '<div class="form-group col-xs-4"><label>Reunan väri</label><input name="packages-border-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text"></input></div>'
        );

        this.mobileHeaderimageElement = $('<div/>').addClass('col-xs-6').html(
        	'<legend class="col-xs-12">Otsikon taustakuva mobiilissa</legend>'+
            '<div class="col-xs-12 form-group smart-form" style="margin-bottom: 15px;">' +
            '<label for="header-mobile-image" class="input input-file">'+
                '<div class="button"><input type="file" name="header-mobile-image" onchange="this.parentNode.nextSibling.value = this.value">Selaa</div><input type="text" placeholder="Lisää kuva" readonly="">' +
            '</label>' +
            '</div>'+
            '</div>'
        );

        this.mobileHeaderimageInput = this.mobileHeaderimageElement.find('input[type="file"]');



        this.footerSettings = $('<div/>').addClass('col-xs-6 footerbox').html(
            '<legend class="col-xs-12">Alapalkin tyylit</legend>'+
            '<div class="form-group col-xs-12 smart-form" style="margin-bottom: 15px;">'+
            '<label for="footer-image" class="input input-file">'+
                '<div class="button"><input type="file" name="footer-image" onchange="this.parentNode.nextSibling.value = this.value">Selaa</div><input type="text" placeholder="Lisää kuva" readonly="">' +
            '</label>' +
            '</div>'+
   			'<div class="form-group col-xs-12">'+
            '<label>Ylempi teksti</label><input name="footer-upper" class="form-control" type="text"></input></div>'+
            '<div class="form-group col-xs-12">'+
            '<label>Alempi teksti</label><input name="footer-lower" class="form-control" type="text"></input></div>'+
            '</div>'+

            '<div class="form-group col-xs-12">'+
            '<label>Taustaväri</label><input name="footer-background-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text"></input></div>'+
            '<div class="form-group col-xs-12">'+
            '<label>Tekstin väri</label><input name="footer-text-color" placeholder="Valitse väri" class="colorpicker-input form-control" type="text"></input></div>'+
             '<div class="form-group col-xs-12">'+
            '<label>Linkki</label><input name="footer-redirect" class="form-control" type="text"></input></div>'+
            '</div>'


        );


        this.footerImageInput = this.footerSettings.find('input[type="file"]');


        this.packageLayoutModel = $('<article/>').addClass('col-xs-12 col-sm-4 sortable-grid ui-sortable').append($('<div/>').addClass('jarviswidget jarviswidget-color-blueDark jarviswidget-sortable single-package').attr('role', 'widget').html(
                    '<header role="heading">'+
                        '<div role="menu" class="jarviswidget-ctrls"></div>'+
                        '<h2></h2>'+
                        '<div class="widget-toolbar dialog-open"><i class="fa fa-cog"></i><div>'+
                    '</header>'+
                    '<div role="content">'+
                        '<div class="widget-body">'+
                            '<div class="orderExtraText"></div>' +
                            '<legend class="col-xs-12"></legend>' +
                            '<div class="package-bgimage">'+
                                '<legend class="col-xs-12">Kuva</legend>'+
                            '</div>'+
                            '<div class="row smart-form">' +
                                '<legend class="col-xs-12">Otsikko</legend>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Fontin koko</label>' +
                                    '<input type="text" name="package-header-font-size" placeholder="12px"/>'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Vaihtoehtoinen teksti</label>' +
                                    '<input type="text" name="package-header-alt-text"/>'+
                                '</div>'+
                            '</div>'+
                            '<div class="row smart-form">' +
                                '<legend class="col-xs-12">Paketin komponentit</legend>' +
                                '<div class="col-xs-12">' +
                                    '<label class="toggle">'+
                                        '<input type="checkbox" name="package-components-hidden">'+
                                        '<i data-swchon-text="Kyllä" data-swchoff-text="Ei"></i>Piilossa'+
                                    '</label>'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="toggle">'+
                                        '<input type="checkbox" name="package-components-before-image">'+
                                    '<i data-swchon-text="Yllä" data-swchoff-text="Alla"></i>Kuvan yllä vai alla'+
                                    '</label>'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Vaihtoehtoinen teksti</label>'+
                                    '<input type="text" name="package-components-alt-text" />'+
                                '</div>'+
                            '</div>'+
                            '<div class="row smart-form">' +
                                '<legend class="col-xs-12">Muuta</legend>' +
                                '<div class="col-xs-12">' +
                                    '<label class="label">Oheistuotteen otsikko</label>'+
                                    '<input type="text" name="package-giveaway-header-text" value="Valitse etusi" />'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Oheistuotteen tarkennusteksti</label>'+
                                    '<input type="text" name="package-giveaway-small-text" value="Kun tilaat nyt, voit valita kaupan päälle jonkin seuraavista tutustumisjaksoista" />'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Painikkeen teksti</label>'+
                                    '<input type="text" name="package-button-text" value="Valitse" />'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Vaihtoehtoinen kuvaus</label>'+
                                    '<div class="package-alt-description" style="border: 1px dashed slategray; min-height: 100px;"></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'
        ));

        this.continualBoxLayoutModel = $('<article/>').addClass('col-xs-12 col-sm-4 sortable-grid ui-sortable').append($('<div/>').addClass('jarviswidget jarviswidget-color-blueDark jarviswidget-sortable single-package').attr('role', 'widget').html(
                    '<header role="heading">'+
                        '<div role="menu" class="jarviswidget-ctrls"></div>'+
                        '<h2></h2>'+
                        '<span class="jarviswidget-loader"><i class="fa fa-refresh fa-spin"></i></span>'+
                    '</header>'+
                    '<div role="content">'+
                        '<div class="widget-body">'+
                            '<div class="continualbox-bgimage row">'+
                                '<legend class="col-xs-12">Kuva</legend>'+
                                    '<div class="col-xs-12 form-group smart-form" style="margin-bottom: 15px;">' +
                                    '<div class="continualBoxS3Image"></div><br/>'+
                                    '<label for="continualbox-image" class="input input-file">'+
                                        '<div class="button"><input type="file" name="continualbox-image-image" onchange="this.parentNode.nextSibling.value = this.value">Selaa</div><input type="text" placeholder="Lisää kuva" readonly="">' +
                                     '</label>' +
                                    '</div>'+

                            '</div>'+
                            '<div class="row smart-form">' +
                               '<legend class="col-xs-12">Kestotilaajapaketti</legend>'+
                                   '<div class="col-xs-12">' +
                                    '<label class="label">Kestotilaajalaatikon otsikkoteksti</label>' +
                                    '<input type="text" name="continualbox-package-header-description" style="min-width:250px"/>'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Kestotilaajalaatikon otsikkotekstin fontin koko</label>' +
                                    '<input type="text" name="continualbox-header-font-size" placeholder="12px"/>'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Kestotilaajalaatikon kuvaus</label>' +
                                    '<div class="package-alt-description" style="border: 1px dashed slategray; min-height: 100px;"></div>'+
                                '</div>'+
                                  '<div class="col-xs-12">' +
                                    '<label class="label">Hinta</label>' +
                                    '<input type="text" name="continualbox-price" placeholder="0 €"/>'+
                                '</div>'+

                            '</div>'+
                            '<div class="row smart-form">' +
                                '<legend class="col-xs-12">Muuta</legend>' +
                                '<div class="col-xs-12">' +
                                    '<label class="label">Painikkeen teksti</label>'+
                                    '<input type="text" name="continualbox-package-button-text" value="Valitse" />'+
                                '</div>'+
                                '<legend class="col-xs-12">Paketin klikkauksen kohde </legend>' +
                                '<div class="col-xs-12">' +
                                    '<label class="toggle">'+
                                        '<input type="checkbox" name="continualbox-link-click">'+
                                        '<i data-swchon-text="URL" data-swchoff-text="Koodi"></i>Paketin linkin tyyppi'+
                                    '</label>'+
                                '</div>'+
                                '<div class="col-xs-12">' +
                                    '<label class="label">Linkin URL</label>'+
                                    '<input type="text" name="continualbox-package-link" value="http://" />'+
                                '</div>'+
                                   '<div class="col-xs-12">' +
                                    '<label class="label">Linkin koodi</label>'+
                                     '<textarea rows="6" cols="60" placeholder="// javascript-koodi tähän" name="continualbox-package-code"></textarea>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'
        ));
        this.packageLayoutControl = function(id, packageName, packageAdminName) {

            var packageCol = "";

            if (id === 'continualBox') {
                packageCol = this.continualBoxLayoutModel.clone(true);
            }

            else {

            packageCol = this.packageLayoutModel.clone(true);
            }

            /*
             * this listener moves the other package to where this package was (article.sortable-grid)
             * this is necessary to avoid packages stacking in the same spot
             *
             **/
            packageCol.find('.jarviswidget').on('mouseup', function(ev) {

                var _this = this;
                window.setTimeout(function() {

                    if ($(_this).siblings().length) {

                        var sibling = $($(_this).siblings()[0]);
                        if (sibling !== $(_this)) {

                            $.each($('#widget-grid .sortable-grid'), function(i, e) {

                                if ($(e).children().length === 0) {

                                    $(e).append(sibling);
                                }
                            });
                        }
                    }
                }, 1000);
            });
            var packageDescription = packageCol.find('.package-alt-description');
            packageDescription.summernote({
                focus : true,
                toolbar: [
                    ['fontfamily', ['fontname']],
                    ['style', ['color', 'bold', 'italic', 'underline']],
                    ['size', ['fontsize']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']]
                ]
            });

            var _this = this;

            packageCol.find('header h2').html( packageName );

            packageCol.find('.dialog-open').bind( 'click', function(){

                _this.openPackageDialog( $(this) );
            });

            packageCol.find('.jarviswidget').attr('id', id);
            packageCol.find('.jarviswidget').attr("data-name", packageName);

            return packageCol;
        };

		this.alertWrapper = $('<article/>').addClass("col-sm-12");

        this.alert = function(type) {

            var alert = $('<div class="alert alert-'+type+' fade in">'+
				'<button class="close" data-dismiss="alert">'+
					'&#215'+
				'</button>'+
				'<i class="fa-fw fa fa-check"></i>'+
				'<span></span>'+
			'</div>');

            return alert;
        };

        this.alertSuccess = function(msg) {

            var alert = this.alert('success');
            alert.find('span').html(msg);
            return alert;
        };

        this.alertInfo = function(msg) {

            var alert = this.alert('info');
            alert.find('span').html(msg);
            return alert;
        };

        this.alertWarning = function(msg) {

            var alert = this.alert('warning');
            alert.find('span').html(msg);
            return alert;
        };

        this.alertDanger = function(msg) {

            var alert = this.alert('danger');
            alert.find('span').html(msg);
            return alert;
        };

        this.upperCodeBox = $('<div/>').addClass('col-xs-12').html(
            '<label class="label">Ennen lomaketta (html, css, js):</label>' +
            '<label class="textarea textarea-expandable">'+
                '<textarea id="upper-code" rows="6" class="custom-scroll" name="upper-code" style="display: inline-block;"></textarea>' +
                '<!--div contenteditable="true" id="upper-code"></div-->'+
            '</label>' +
            '<div class="note"><strong>Ohje:</strong> kenttä laajenee klikatessa.</div>'
        );
        this.lowerCodeBox = $('<div/>').addClass('col-xs-12').html(
            '<label class="label">Lomakkeen jälkeen (html, css, js):</label>' +
            '<label class="textarea textarea-expandable">'+
                '<textarea id="lower-code" rows="6" class="custom-scroll" name="lower-code" style="display: inline-block;"></textarea>' +
                '<!--div contentEditable="true" id="lower-code"></div-->'+
            '</label>' +
            '<div class="note"><strong>Ohje:</strong> kenttä laajenee klikatessa.</div>'
        );
        this.codeBoxLayout =  $('<fieldset/>').html(
            '<legend>Vapaa koodi</legend>'+
            '<div class="row smart-form"></div>'
        );
        this.codeBoxLayout.find('div').append([this.upperCodeBox, this.lowerCodeBox]);

        $(this.form).append([
            this.layoutControl,
            $('<div/>').addClass('row').append([$('<div/>').addClass('col-md-6').append(this.backgroundImageSelect), $('<div/>').addClass('col-md-6').append(this.colorSelect)]),
            $('<div/>').addClass('row').append([$('<div/>').addClass('col-md-6').append([this.textInputs, this.brandLogoSelect]), $('<div/>').addClass('col-md-6').append(this.codeBoxLayout)]),
            $('<div/>').addClass('row').append(this.packageStyles),
            $('<div/>').addClass('row').append(this.footerShowContainer),
            $('<div/>').addClass('row').append(this.footerSettings),
            $('<div/>').addClass('row').append(this.mobileHeaderimageElement),
            $('<div/>').addClass('row').append(this.continualBoxContainer),
            $('<br/>'),
            this.saveButton,
            $('<br/><br/>')
        ]);

        // hide the form initially, display only when spot is selected
        $(this.form).children().css('display', 'none');
        this.layoutControl.css('display', 'block');

        this.landingPageView.find('.jarviswidget').append([
           this.landingPageViewHeader,
           this.formWrapper
        ]);

        this.snippetUpdater = $('<article/>')
            .attr('class', 'col-xs-12 sortable-grid ui-sortable')
            .attr('data-sortable', 'false')
            .append($('<div id="wid-id-landingpage" class="jarviswidget jarviswidget-color-blueDark" \
                      data-widget-colorbutton="false" \
                      data-widget-editbutton="false" \
                      data-widget-custombutton="false" \
                      data-widget-deletebutton="true" \
                      data-widget-togglebutton="false" \
                      data-widget-sortable="false" \
                      data-widget-fullscreenbutton="false">'));

        this.snippetUpdaterHeader = $('<header/>').append([
            $('<div/>').attr('role', 'menu').addClass('jarviswidget-ctrls'),
            $('<h2/>').html('Snippetin päivitys')
        ]);

        this.snippetUpdaterContent = $('<div/>').attr('role', 'content');
        this.snippetUpdaterForm = $('<form/>').addClass('smart-form');
        this.snippetUpdaterRevSelect = $('<fieldset>'+
                                           '<legend>Päivitettävä revisio</legend>'+
                                           '<section>'+
                                             '<div class="inline-group">'+
                                                 '<label class="radio">'+
                                                     '<input type="radio" name="snippet-updater-rev" value="dev" checked="dev">'+
                                                     '<i></i>Dev'+
                                                 '</label>'+
                                                 '<label class="radio">'+
                                                     '<input type="radio" name="snippet-updater-rev" value="prod">'+
                                                     '<i></i>Tuotanto'+
                                                 '</label>'+
                                             '</div>'+
                                           '</section>'+
                                           '<section class="form-group">'+
                                             '<button style="padding: 6px 12px;" type="submit" class="btn btn-primary">Päivitä</button>'+
                                           '</section>'+
							             '</fieldset>');
        this.snippetUpdaterForm.append(this.snippetUpdaterRevSelect);
        this.snippetUpdaterContent.append(this.snippetUpdaterForm);

        this.snippetUpdater.find('.jarviswidget').append([this.snippetUpdaterHeader, this.snippetUpdaterContent]);

        this.widgetWrapper = $('<div/>')
            .append($('<div/>').addClass('row').append(this.alertWrapper));

        if (window.App.__container__.lookup("controller:application").get("isUserAdmin")) {

            if (window.location.hostname === "accounts-dev.viivamedia.fi") {
                this.widgetWrapper.append($('<div/>').addClass('row').append(this.snippetUpdater));
            }

        }
        this.widgetWrapper.append([
                    $('<div/>').addClass('row').append(this.landingPageView),
                    $('<section/>').attr('id', 'widget-grid').addClass('packages-grid').append($('<div/>').addClass('row packages-wrapper').attr('data-row', 0))]);

        $(insideElement).append(this.widgetWrapper);

        this.domReady = true;
        this.parent = insideElement;

        // Fix button size
        this.landingPageView.find('label.btn-sm').css('width', '80px');
        this.landingPageView.find('.btn-primary').css('width', '100px').css('margin-bottom', '15px');



    };

    this.loadAll = function() {

        this.loadProductList();
    };

    this.loadSpots = function() {

        /*
         * this function queries the mydigi backend api for the
         * existing service channels
         *
         **/

		this.servicePointGetParams = {

			"sEcho":1,
			"iColumns":4,
			"sColumns":"",
			"iDisplayStart":0,
			"iDisplayLength":0,
			"mDataProp_0":"id",
			"mDataProp_1":"name",
			"mDataProp_2":"service",
			"mDataProp_3":"url",
			"sSearch":"",
			"bRegex":false,
			"sSearch_0":"",
			"bRegex_0":false,
			"bSearchable_0":true,
			"sSearch_1":"",
			"bRegex_1":false,
			"bSearchable_1":true,
			"sSearch_2":"",
			"bRegex_2":false,
			"bSearchable_2":true,
			"sSearch_3":"",
			"bRegex_3":false,
			"bSearchable_3":true,
			"iSortCol_0":0,
			"sSortDir_0":"asc",
			"iSortingCols":1,
			"bSortable_0":true,
			"bSortable_1":true,
			"bSortable_2":true,
			"bSortable_3":true,
			"format":"datatable"
		};
		var _spots = [];
		var	_this = this;
		$.ajax({
			type : 'POST',
			url : util.apiBase + 'service.point.get',
			data : JSON.stringify(this.servicePointGetParams),
			contentType : 'application/json',
			dataType : 'json'})
		.done(function(data) {


                _this.populateServicePoints(data.aaData);
		})
        .fail(function(jqXHR, textStatus, errorThrown) {

            console.log('error querying servicechannels');
        });
	};

	this.populateServicePoints = function(servicePoints) {

        /*
         * this function calculates the s3keys for the servicechannels
         * and appends them in the select element
         *
         **/

            servicePoints = servicePoints.sort(function (a, b) {
              return a.service.localeCompare(b.service);
            });

		var select = this.spotSelect.find('select');
        var _this = this;
		$.each(servicePoints, function(i, e) {

            // s3key is calculated from the service channel's url
            // the url is first stripped of protocol, query and hash parts
            /*var s3key = 0;
            var chr;
            var url = e.url.replace("http:", "");
            url = url.replace("https:", "");
            if (url.indexOf("?") > -1) {

                url = url.substr(0, url.indexOf("?"));
            }
            if (url.indexOf("#") > -1) {

                url = url.substr(0, url.indexOf("#"));
            }
            for (var i = 0, len = url.length; i < len; i++) {

                chr = url.charCodeAt(i);
                s3key = ((s3key << 5) - s3key) + chr;
                s3key |= 0; // Convert to 32bit integer
            }*/
			select.append($('<option/>').attr('value', e.id).attr('data-url', e.url).attr('data-s3key', e.id).html(e.service + " - " + e.name));
		});
	};

	this.uploadToAmazon = function(event) {

        /*
         * this function serves as the savebutton listener
         * here the service channel settings data is parsed as a settings JSON,
         * which is then uploaded to amazon s3
         *
         **/

		event.preventDefault();
        this.clearAlerts();

        // service channel settings data is stored in the mydigi s3 bucket
        // it is identified by key that is calculated from its url
        // bucketURL/[serviceChannelUrlHash].settings[devSuffix = ".dev"]
        // bucketURL/[serviceChannelUrlHash].headerbgimage[devSuffix = ".dev"]
		var _this = this;
        var s3key = this.spotSelect.find('option:selected').attr('data-s3key');
        var s3data = {};
        s3data.packages = {};

        s3data.backgroundcolor = $('[name="background-color"]').val();
        s3data.headerbackgroundcolor = $('[name="header-background-color"]').val();
        s3data.highlightcolor = $('[name="highlight-color"]').val();
        s3data.textcolor = $('[name="text-color"]').val();
        s3data.pagebackgroundcolor = $('[name="page-background-color"]').val();
        s3data.pagebackgroundselector = $('[name="background-css-selector"]').val();

        s3data.headertext = $('#header-text').code();
        if ($.trim($('<div/>').html(s3data.headertext).text()) === "") {

            s3data.headertext = "";
        }
        s3data.headertextverticalalignment = $('[name="header-text-vertical-alignment"]:checked').val();

        s3data.headerbigtext = $('[name="header-big-text"]').val();
        s3data.headerbigtextalignment = $('[name="header-big-text-alignment"]:checked').val();
        s3data.headerbigtextpaddingtop = parseInt($('[name="header-big-text-padding-top"]').val());
        s3data.headerbigtextpaddingright = parseInt($('[name="header-big-text-padding-right"]').val());
        s3data.headerbigtextpaddingbottom = parseInt($('[name="header-big-text-padding-bottom"]').val());
        s3data.headerbigtextpaddingleft = parseInt($('[name="header-big-text-padding-left"]').val());

        s3data.headersmalltext = $('[name="header-small-text"]').val();
        s3data.headersmalltextalignment = $('[name="header-small-text-alignment"]:checked').val();
        s3data.headersmalltextpaddingtop = parseInt($('[name="header-small-text-padding-top"]').val());
        s3data.headersmalltextpaddingright = parseInt($('[name="header-small-text-padding-right"]').val());
        s3data.headersmalltextpaddingbottom = parseInt($('[name="header-small-text-padding-bottom"]').val());
        s3data.headersmalltextpaddingleft = parseInt($('[name="header-small-text-padding-left"]').val());

        // footer

        s3data.footeruppertext = $('[name="footer-upper"]').val();
        s3data.footerlowertext = $('[name="footer-lower"]').val();
        s3data.footertarget = $('[name="footer-redirect"]').val();
        s3data.footerbackgroundcolor = $('[name="footer-background-color"]').val();
        s3data.footertextcolor = $('[name="footer-text-color"]').val();
        s3data.footerhidden = $('[name="footer-package-hidden"]').prop('checked');

        s3data.lowercode = $('textarea[name="lower-code"]').val().replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        s3data.uppercode = $('textarea[name="upper-code"]').val().replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');




        s3data.servicepointid = $('[name="spot-select"]').val();
        s3data.servicepointurl = this.spotSelect.find('option:selected').attr('data-url');
        s3data.baseurl = "//"+window.location.hostname+"/blackbox/blackbox.php";

        if (_this.headerBackgroundimageInput[0].files.length || typeof _this.headerBackgroundimageInput.attr("data-s3key") != 'undefined') {

            s3data.headerbgimage = s3key + '.headerbgimage' + this.devSuffix;
        }

        if (_this.brandLogoInput[0].files.length || typeof _this.brandLogoInput.attr("data-s3key") != 'undefined') {

            s3data.brandlogoimage = s3key + '.brandlogoimage' + this.devSuffix;
        }
        s3data.brandlogoimagealignment = $('[name="brand-logo-alignment"]:checked').val();

        if (_this.footerImageInput[0].files.length || typeof _this.footerImageInput.attr("data-s3key") != 'undefined') {

            s3data.footerimage = s3key + '.footerimage' + this.devSuffix;
        }

        if (_this.mobileHeaderimageInput[0].files.length || typeof _this.mobileHeaderimageInput.attr("data-s3key") != 'undefined') {

            s3data.mobileheaderimage = s3key + '.mobileheaderimage' + this.devSuffix;
        }


        var contBoxSuffix = this.devSuffix;

         s3data.packagecount = $('.single-package').length;

        // information about packages contains only their id and order in which to display them
        // packages own settings data is stored in its own JSON with the packageID as the key
        // bucketURL/[packageID].settings[devSuffix = ".dev"]
        // bucketURL/[packageID].bgimage[devSuffix = ".dev"]
        var s3packages = [];
        $.each($('.single-package'), function(i, e) {

            var s3package = {};

            s3package.id = $(e).attr("id");
            s3package.position = i;
            s3package.headerfontsize = $(e).find('[name="package-header-font-size"]').val();
            s3package.headeralttext = $(e).find('[name="package-header-alt-text"]').val();
            s3package.componentshidden = $(e).find('[name="package-components-hidden"]').prop('checked');
            s3package.componentsbeforeimage = $(e).find('[name="package-components-before-image"]').prop('checked');
            s3package.componentsalttext = $(e).find('[name="package-components-alt-text"]').val();
            s3package.buttontext = !!$(e).find('[name="package-button-text"]').val() ? $(e).find('[name="package-button-text"]').val() : 'Valitse';
            s3package.giveawayheadertext = $(e).find('[name="package-giveaway-header-text"]').val();
            s3package.giveawaysmalltext = $(e).find('[name="package-giveaway-small-text"]').val();
            s3package.altdescription = $(e).find('.package-alt-description').code();
            if ($.trim($('<div/>').html(s3package.altdescription).text()) === "") {

                s3package.altdescription = "";
            }

            if (s3package.id === "continualBox") {
                s3package.continualBoxDescription = $(e).find('.package-alt-description').code();
                s3package.continualBoxDigi = 1;
                s3package.continualBoxFrom = "";
                s3package.continualBoxMarketingname = $(e).find('[name="continualbox-package-header-description"]').val();
                s3package.continualBoxMarketingprice = 0;
                s3package.continualBoxMarketingsubtext = null;
                s3package.continualBoxHeaderFontSize = $(e).find('[name="continualbox-header-font-size"]').val();
                s3package.continualBoxPrice = $(e).find('[name="continualbox-price"]').val();
                s3package.continualBoxNormalprice = null;
                s3package.continualBoxPaymentcredit = 0;
                s3package.continualBoxButtonText = $(e).find('[name="continualbox-package-button-text"]').val();
                s3package.continualBoxLink = $(e).find('[name="continualbox-package-link"]').val();
                s3package.continualBoxLinkCode = $(e).find('[name="continualbox-package-code"]').val().replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
                s3package.continualBoxClick = $(e).find('[name="continualbox-link-click"]').prop('checked');

                 var continualBoxImageInput = $('.continualbox-bgimage').find('input[type="file"]');

                    if (continualBoxImageInput[0].files.length || typeof continualBoxImageInput.attr("data-s3key") != 'undefined') {

                        s3data.continualboximage = s3key + '.continualboximage' +contBoxSuffix;

                    }

               s3data.continualBoxCode= $('[name="continualbox-package-code"]').val().replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');


            }


            // add package if it's not cont box
            // or if it is contbox and it its visible
            if(s3package.id !== "continualBox" || s3package.id === "continualBox" && !$(e).parent().attr('visibility') ) {
                s3packages.push(s3package);
            }
            else {
                // remove one from package count since we are not pushing
                // contbox
                s3data.packagecount--;
            }



        });

        s3data.packages.ids = s3packages;

        var packageStyles = {};
        packageStyles.headercolor = $('[name$="packages-header-color"]').val();
        packageStyles.backgroundcolor = $('[name$="packages-background-color"]').val();
        packageStyles.bordercolor = $('[name$="packages-border-color"]').val();
        s3data.packages.styles = packageStyles;

		AWS.config.update({accessKeyId: 'AKIAIIZFDJNQZHVXG3VQ', secretAccessKey: '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'});
		AWS.config.region = 'eu-west-1';
		var bucket = new AWS.S3({params: {Bucket: 'otavamedia-mydigi'}});
		var params = {Key: s3key + '.settings' + this.devSuffix, Body: JSON.stringify(s3data), ContentType: 'application/json', ACL: 'public-read'};
		bucket.putObject(params, function(error, data) {

			if (error) {

				_this.alertWrapper.append(_this.alertDanger("Myyntipaikan tietojen tallennus ei onnistunut!"));
			}
			else {

                // servicechannel JSON uploaded successfully, next try uploading the image
                Notification.info({title: "Tiedot päivitetty!", message: "Myyntipaikan tiedot tallennettu! Katso sivun yläosasta tarkempaa tietoa."});
                _this.alertWrapper.append(_this.alertSuccess("Myyntipaikan tiedot tallennettu!"));
                if (_this.devMode) {

                    _this.alertWrapper.append(_this.alertInfo('Lisää seuraava rivi haluamallesi sivulle siihen paikkaan mihin haluat lomakkeen tulevan:<br />'+
                                            '&lt;div id="s3_tilaa_form"&gt;\n<br />'+
                                            '&lt;/div&gt;<br>\n'+
                                            '&lt;script type="text/javascript"&gt;<br />\n'+
                                            'var s3key = "'+s3key+'";<br />\n'+
                                            'var s3dev = true;<br />\n'+
                                            'var s3snippettarget = "s3_tilaa_form";\n'+
                                            '&lt;/script&gt;<br />\n'+
                                            '&lt;script src="//otavamedia-mydigi.s3.amazonaws.com/s3.snippet.dev.js" id="s3-snippet" data-s3key="'+s3key+'"&gt;&lt;/script&gt;'));
                }
                else {

                    _this.alertWrapper.append(_this.alertInfo('Lisää seuraava rivi haluamallesi sivulle siihen paikkaan mihin haluat lomakkeen tulevan:<br />'+
                                            '&lt;div id="s3_tilaa_form"&gt;\n<br />'+
                                            '&lt;/div&gt;<br>\n'+
                                            '&lt;script type="text/javascript"&gt;<br />\n'+
                                            'var s3key = "'+s3key+'";<br />\n'+
                                            'var s3snippettarget = "s3_tilaa_form";\n'+
                                            '&lt;/script&gt;<br />\n'+
                                            '&lt;script src="//otavamedia-mydigi.s3.amazonaws.com/s3.snippet.js" id="s3-snippet" data-s3key="'+s3key+'"&gt;&lt;/script&gt;'));
                }
                // next try uploading the headerimage
				if (_this.headerBackgroundimageInput[0].files.length) {

					var file = _this.headerBackgroundimageInput[0].files[0];
                    var key = s3data.headerbgimage;
					var params = {Key: key, ContentType: file.type, Body: file, ACL: 'public-read'};
					bucket.putObject(params, function (error, data) {

						if (error) {

							_this.alertWrapper.append(_this.alertDanger("Otsikkokuvan tallennus ei onnistunut!"));
						}
						else {

                            // all uploaded to s3 successfully
                            $('img[data-pos="header"]').attr('src', '//otavamedia-mydigi.s3.amazonaws.com/' + key + '?refresh=' + (new Date()).getTime());

                            _this.alertWrapper.append(_this.alertSuccess("Otiskkokuva tallennettu!"));

                            Notification.info({title: "Otsikko kuva tallennettu!", message: "Otsikon kuva tallennettu onnistuneesti."});
						}
					});
				}

                if (_this.brandLogoInput[0].files.length) {

					var file = _this.brandLogoInput[0].files[0];
                    var key = s3data.brandlogoimage;
					var params = {Key: key, ContentType: file.type, Body: file, ACL: 'public-read'};
					bucket.putObject(params, function (error, data) {

						if (error) {
							_this.alertWrapper.append(_this.alertDanger("Brändin logon tallennus ei onnistunut!"));
						}
						else {

                            // all uploaded to s3 successfully
                            $('img[data-pos="brandlogo"]').attr('src', '//otavamedia-mydigi.s3.amazonaws.com/' + key + '?refresh=' + (new Date()).getTime());

                            _this.alertWrapper.append(_this.alertSuccess("Brändin logo tallennettu!"));

                            Notification.info({title: "Brändin logo tallennettu!", message: "Brändin logo tallennettu onnistuneesti."});
						}
					});
				}

                 var continualBoxImageInput = $('.continualbox-bgimage').find('input[type="file"]');
                 if (typeof continualBoxImageInput !== "undefined" && continualBoxImageInput[0].files.length) {

                    var file = continualBoxImageInput[0].files[0];
                    var key =  s3data.continualboximage;
                    var params = {Key: key, ContentType: file.type, Body: file, ACL: 'public-read'};
                    bucket.putObject(params, function (error, data) {

                        if (error) {
                            _this.alertWrapper.append(_this.alertDanger("Kestotilaajalaatikon kuvan tallennus ei onnistunut!"));
                        }
                        else {

                            // all uploaded to s3 successfully
                            $('img[data-pos="continualbox"]').attr('src', '//otavamedia-mydigi.s3.amazonaws.com/' + key + '?refresh=' + (new Date()).getTime());

                            _this.alertWrapper.append(_this.alertSuccess("Kestotilaajalaatikon kuvan tallennus onnistui!"));

                            Notification.info({title: "Kestotilaajalaatikon kuva tallennettu!", message: "Kestotilaajalaatikon kuva tallennettu onnistuneesti."});
                        }
                    });
                }


                if (_this.footerImageInput[0].files.length) {

                    var file = _this.footerImageInput[0].files[0];
                    var key = s3data.footerimage;
                    var params = {Key: key, ContentType: file.type, Body: file, ACL: 'public-read'};
                    bucket.putObject(params, function (error, data) {

                        if (error) {
                            _this.alertWrapper.append(_this.alertDanger("Alapalkin kuvan tallennus ei onnistunut!!"));
                        }
                        else {

                            // all uploaded to s3 successfully
                            $('img[data-pos="footerimage"]').attr('src', '//otavamedia-mydigi.s3.amazonaws.com/' + key + '?refresh=' + (new Date()).getTime());

                            _this.alertWrapper.append(_this.alertSuccess("Alapalkin kuva tallennettu!"));

                            Notification.info({title: "Alapalkin kuva tallennettu!", message: "Alapalkin kuva tallennettu onnistuneesti!"});
                        }
                    });
                }

                if (_this.mobileHeaderimageInput[0].files.length) {

                    var file = _this.mobileHeaderimageInput[0].files[0];
                    var key = s3data.mobileheaderimage;
                    var params = {Key: key, ContentType: file.type, Body: file, ACL: 'public-read'};
                    bucket.putObject(params, function (error, data) {

                        if (error) {
                            _this.alertWrapper.append(_this.alertDanger("Mobiiliheaderin kuvan tallennnus ei onnistunut!"));
                        }
                        else {

                            // all uploaded to s3 successfully
                            $('img[data-pos="mobileheaderimage"]').attr('src', '//otavamedia-mydigi.s3.amazonaws.com/' + key + '?refresh=' + (new Date()).getTime());

                            _this.alertWrapper.append(_this.alertSuccess("Mobiiliheaderin kuva tallennettu!"));

                            Notification.info({title: "Mobiiliheaderin kuva tallennettu!", message: "Mobiiliheaderin kuva tallennettu onnistuneesti!"});
                        }
                    });
                }

                // clear dirty state
                _this.serializedForm = _this.form.serialize();
			}
		});
	};

    this.updateSnippet = function() {

		event.preventDefault();
        this.clearAlerts();

        var _this = this;
        var rev = this.snippetUpdaterRevSelect.find('input[name="snippet-updater-rev"]:checked').val();
        var revSuffix = rev === 'dev' ? '.dev' : '';
        var snippetName = 's3.snippet' + revSuffix + '.js';
        var snippet = null;

        $.ajax({
			type : 'GET',
			url : 'external/' + snippetName,
			dataType : 'text'})
        .done(function(data) {

            snippet = data;
            AWS.config.update({accessKeyId: 'AKIAIIZFDJNQZHVXG3VQ', secretAccessKey: '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'});
            AWS.config.region = 'eu-west-1';
            var bucket = new AWS.S3({params: {Bucket: 'otavamedia-mydigi'}});
            var params = {Key: snippetName, ContentType: 'application/javascript', Body: snippet, ACL: 'public-read'};
            bucket.putObject(params, function (error, data) {

                if (error) {
                    _this.alertWrapper.append(_this.alertDanger("Snippetin päivitys ei onnistunut, tallennus Amazoniin epäonnistui! (" + rev + ")"));
                }
                else {

                    _this.alertWrapper.append(_this.alertSuccess("Snippetti päivitetty! ("+ rev + ")"));
                    Notification.info({title: "Snippetti päivitetty!", message: "Snippetti päivitetty Amazoniin! (" + rev + ")"});
                }
            });
        })
        .fail(function(jqXHR, status, error) {
            _this.alertWrapper.append(_this.alertDanger("Snippetin päivitys ei onnistunut, snippetin luku palvelimelta epäonnistui! (" + rev + ")"));
        });
    };

    this.clearAlerts = function() {

        this.alertWrapper.children().remove();
    };

	this.resetForm = function() {

        /*
         * reset form data
         *
         **/

        this.form.children().css('display', 'none');

        // reset form elements
        var formElements = this.form.get(0).elements;
        for (i = 0; i < formElements.length; i++) {

            if (formElements[i].name === 'spot-select') continue;

            fieldType = formElements[i].type.toLowerCase();
            switch (fieldType) {

                case "text":
                case "password":
                case "textarea":
                case "hidden":

                    formElements[i].value = "";
                    break;

                case "radio":
                case "checkbox":

                    if (formElements[i].checked) {

                        formElements[i].checked = false;
                    }
                    break;

                case "select-one":
                case "select-multi":

                    formElements[i].selectedIndex = -1;
                    break;

                default:

                    break;
            }
        }
        //remove current bgimage and packages
        this.form.find('.bgimage-preview').remove();
        this.form.find('.brandlogo-preview').remove();
        $('.single-package').parent().remove();
        this.form.children().css('display', 'block');

        // setup colorpickers
        $('.colorpicker-input').colpick({
            layout:'hex',
            submit:0,
            onChange:function(hsb,hex,rgb,el,bySetColor) {
                $(el).val('#' + hex);
            }
        }).keyup(function(){
            $(this).colpickSetColor(this.value);
        });
        $('[name="background-color"]').colpick().colpickSetColor('ffffff');
        $('[name="header-background-color"]').colpick().colpickSetColor('ffffff');
        $('[name="page-background-color"]').colpick().colpickSetColor('ffffff');
        $('[name="highlight-color"]').colpick().colpickSetColor('ff0000');
        $('[name="text-color"]').colpick().colpickSetColor('000000');

        $('[name="packages-header-color"]').colpick().colpickSetColor('000000');
        $('[name="packages-background-color"]').colpick().colpickSetColor('ffffff');
        $('[name="packages-border-color"]').colpick().colpickSetColor('000000');

        $('[name="footer-background-color"]').colpick().colpickSetColor('000000');
        $('[name="footer-text-color"]').colpick().colpickSetColor('ffffff');

        $('#header-text').code('');
        $('[name="header-text-vertical-alignment"][value="top"]').prop('checked', true);
        $('[name="brand-logo-alignment"][value="left"]').prop('checked', true);

        $('.mobileheaderimage-preview, .footerimage-preview').remove();

        // clear alerts
        this.clearAlerts();

	};

	this.spotSelectListener = function(event) {

        /*
         * this function serves as the listener for the service channel select
         * and initiates data gathering and presentation for the service channel
         *
         **/

        this.resetForm();
        var spotUrl = this.spotSelect.find('option:selected').attr('data-url');
        this.spotSelectInfo.css("display", "block").find('input').val(spotUrl);
        this.fetchServiceSpotData();
	};

    this.fetchServiceSpotData = function() {

        /*
         * this function fetches the service channel settings data from s3
         * and populates the form fields accordingly, if one is found
         *
         **/

        var _this = this;
        var s3key = this.spotSelect.find('option:selected').attr('data-s3key');

        $.ajax({
            'type' : 'GET',
            'url' : '//otavamedia-mydigi.s3.amazonaws.com/' + s3key + '.settings' + _this.devSuffix + '?refresh=' + (new Date()).getTime(),
            'dataType' : 'json'})
            .done(function(response) {

                /* Colors */
                if (typeof response.backgroundcolor !== 'undefined') {
                    $('[name="background-color"]').colpick().colpickSetColor(response.backgroundcolor.substr(1, 6));
                }
                if (typeof response.headerbackgroundcolor !== 'undefined') {
                    $('[name="header-background-color"]').colpick().colpickSetColor(response.headerbackgroundcolor.substr(1, 6));
                }
                if (typeof response.pagebackgroundcolor !== 'undefined') {
                    $('[name="page-background-color"]').colpick().colpickSetColor(response.pagebackgroundcolor.substr(1, 6));
                }

                if (typeof response.pagebackgroundselector !== 'undefined') {
                    $('[name="background-css-selector"]').val(response.pagebackgroundselector);
                }

                if (typeof response.footeruppertext !== 'undefined') {
                    $('[name="footer-upper"]').val(response.footeruppertext);
                }

                if (typeof response.footerlowertext !== 'undefined') {
                    $('[name="footer-lower"]').val(response.footerlowertext);
                 }

                if(typeof response.footertarget !== 'undefined'){
                	$('[name="footer-redirect"]').val(response.footertarget);
                }

                if(typeof response.footerhidden !== 'undefined'){
                    $('[name="footer-package-hidden"]').prop('checked', response.footerhidden);

                      if($('[name="footer-package-hidden"]').prop('checked')) {
                                $('.footerbox').show();

                            }
                        else {
                                $('.footerbox').hide();
                        }


                }

                if (typeof response.footerbackgroundcolor !== 'undefined') {
                    $('[name="footer-background-color"]').colpick().colpickSetColor(response.footerbackgroundcolor.substr(1, 6));
                }

                if (typeof response.footertextcolor !== 'undefined') {
                    $('[name="footer-text-color"]').colpick().colpickSetColor(response.footertextcolor.substr(1, 6));
                }

                if (typeof response.highlightcolor !== 'undefined') {
                    $('[name="highlight-color"]').colpick().colpickSetColor(response.highlightcolor.substr(1, 6));
                }
                if (typeof response.textcolor !== 'undefined') {
                    $('[name="text-color"]').colpick().colpickSetColor(response.textcolor.substr(1, 6));
                }


                /* Headertext */
                if (typeof response.headertext !== 'undefined') {

                    if ($.trim($('<div/>').html(response.headertext).text()) !== "") {

                        $('#header-text').code(response.headertext);
                    }
                }

                /* Big header text */
                if (typeof response.headerbigtext !== 'undefined') {
                    $('[name="header-big-text"]').html(response.headerbigtext);
                }
                if (typeof response.headerbigtextalignment !== 'undefined') {
                    $('[name="header-big-text-alignment"][value="' + response.headerbigtextalignment + '"]').prop('checked', true);
                }
                if (typeof response.headerbigtextpaddingtop !== 'undefined') {
                    $('[name="header-big-text-padding-top"]').val(response.headerbigtextpaddingtop);
                }
                if (typeof response.headerbigtextpaddingright !== 'undefined') {
                    $('[name="header-big-text-padding-right"]').val(response.headerbigtextpaddingright);
                }
                if (typeof response.headerbigtextpaddingbottom !== 'undefined') {
                    $('[name="header-big-text-padding-bottom"]').val(response.headerbigtextpaddingbottom);
                }
                if (typeof response.headerbigtextpaddingleft !== 'undefined') {
                    $('[name="header-big-text-padding-left"]').val(response.headerbigtextpaddingleft);
                }

                /* Small header text */
                if (typeof response.headersmalltext !== 'undefined') {
                    $('[name="header-small-text"]').html(response.headersmalltext);
                }
                if (typeof response.headersmalltextalignment !== 'undefined') {
                    $('[name="header-small-text-alignment"][value="' + response.headersmalltextalignment + '"]').prop('checked', true);
                }
                if (typeof response.headersmalltextpaddingtop !== 'undefined') {
                    $('[name="header-small-text-padding-top"]').val(response.headersmalltextpaddingtop);
                }
                if (typeof response.headersmalltextpaddingright !== 'undefined') {
                    $('[name="header-small-text-padding-right"]').val(response.headersmalltextpaddingright);
                }
                if (typeof response.headersmalltextpaddingbottom !== 'undefined') {
                    $('[name="header-small-text-padding-bottom"]').val(response.headersmalltextpaddingbottom);
                }
                if (typeof response.headersmalltextpaddingleft !== 'undefined') {
                    $('[name="header-small-text-padding-left"]').val(response.headersmalltextpaddingleft);
                }

                /* Header text general */
                if (typeof response.headertextverticalalignment !== 'undefined') {
                    $('[name="header-text-vertical-alignment"][value="' + response.headertextverticalalignment + '"]').prop('checked', true);
                }

                /* Codeboxes */
                if (typeof response.lowercode !== 'undefined') {

                    $('#lower-code').val($('<p>').html(response.lowercode).text());
                }
                if (typeof response.uppercode !== 'undefined') {

                    $('#upper-code').val($('<p>').html(response.uppercode).text());
                }

                /* Header image */
                if (typeof response.headerbgimage !== 'undefined') {

                    $('<img />').addClass("bgimage-preview col-xs-12").attr("data-pos", "header")
                            .attr("src", '//otavamedia-mydigi.s3.amazonaws.com/' + s3key + '.headerbgimage' + _this.devSuffix + '?refresh=' + (new Date()).getTime())
                            .attr("style", "height: auto; display: block; margin-top: 10px;")
                            .insertAfter(_this.form.find('input[name="header-background-image"]').parent().parent());
                        _this.form.find('input[name="header-background-image"]').attr("data-s3key", response.headerbgimage);
                }

                /* Brand logo */
                if (typeof response.brandlogoimage !== 'undefined') {

                    $('<img />').addClass("brandlogo-preview").attr("data-pos", "brandlogo")
                            .attr("src", '//otavamedia-mydigi.s3.amazonaws.com/' + s3key + '.brandlogoimage' + _this.devSuffix + '?refresh=' + (new Date()).getTime())
                            .attr("style", "height: auto; display: block; margin-top: 10px; max-width: 100%; margin-bottom: 10px;")
                            .insertAfter(_this.form.find('input[name="brand-logo-image"]').parent().parent());
                        _this.form.find('input[name="brand-logo-image"]').attr("data-s3key", response.brandlogoimage);
                }
                if (!!response.brandlogoimagealignment) {

                    $('[name="brand-logo-alignment"][value="' + response.brandlogoimagealignment + '"]').prop('checked', true);
                }

                // Footer image
                if (typeof response.footerimage !== 'undefined') {

                    $('<img />').addClass("footerimage-preview col-xs-12").attr("data-pos", "footerimage")
                            .attr("src", '//otavamedia-mydigi.s3.amazonaws.com/' + s3key + '.footerimage' + _this.devSuffix + '?refresh=' + (new Date()).getTime())
                            .attr("style", "width: auto; display: block; margin-top: 10px;")
                            .insertAfter(_this.form.find('input[name="footer-image"]').parent().parent());
                        _this.form.find('input[name="footer-image"]').attr("data-s3key", response.footerimage);
                }

                // Mobile header
                if (typeof response.mobileheaderimage !== 'undefined') {

                    $('<img />').addClass("mobileheaderimage-preview col-xs-12").attr("data-pos", "mobileheaderimage")
                            .attr("src", '//otavamedia-mydigi.s3.amazonaws.com/' + s3key + '.mobileheaderimage' + _this.devSuffix + '?refresh=' + (new Date()).getTime())
                            .attr("style", "width: auto; display: block; margin-top: 10px;")
                            .insertAfter(_this.form.find('input[name="header-mobile-image"]').parent().parent());
                        _this.form.find('input[name="header-mobile-image"]').attr("data-s3key", response.mobileheaderimage);
                }

                /* Packages */
                if (typeof response.packages !== 'undefined') {
                    if (typeof response.packages.styles !== 'undefined') {
                        if (typeof response.packages.styles.headercolor !== 'undefined') {
                            $('[name="packages-header-color"]').colpick().colpickSetColor(response.packages.styles.headercolor.substr(1, 6));
                        }
                        if (typeof response.packages.styles.backgroundcolor !== 'undefined') {
                            $('[name="packages-background-color"]').colpick().colpickSetColor(response.packages.styles.backgroundcolor.substr(1, 6));
                        }
                        if (typeof response.packages.styles.bordercolor !== 'undefined') {
                            $('[name="packages-border-color"]').colpick().colpickSetColor(response.packages.styles.bordercolor.substr(1, 6));
                        }
                    }
                    // fetch and display package information next
                    // parameter here serves as the ordering basis for the packages
                    if (typeof response.packages.ids !== 'undefined') {
                        _this.fetchPackageData(response.packages.ids);
                    }
                    else {
                        _this.fetchPackageData(null);
                    }
                }

                _this.serializedForm = _this.form.serialize();

                if (_this.devMode) {

                      _this.alertWrapper.append(_this.alertInfo('Lisää seuraava rivi haluamallesi sivulle siihen paikkaan mihin haluat lomakkeen tulevan:<br />'+
                                            '&lt;div id="s3_tilaa_form"&gt;\n<br />'+
                                            '&lt;/div&gt;<br>\n'+
                                            '&lt;script type="text/javascript"&gt;<br />\n'+
                                            'var s3key = "'+s3key+'";<br />\n'+
                                            'var s3dev = true;<br />\n'+
                                            'var s3snippettarget = "s3_tilaa_form";\n'+
                                            '&lt;/script&gt;<br />\n'+
                                            '&lt;script src="//otavamedia-mydigi.s3.amazonaws.com/s3.snippet.dev.js" id="s3-snippet" data-s3key="'+s3key+'"&gt;&lt;/script&gt;'));
                }
                else {

                    _this.alertWrapper.append(_this.alertInfo('Lisää seuraava rivi haluamallesi sivulle siihen paikkaan mihin haluat lomakkeen tulevan:<br />'+
                                            '&lt;div id="s3_tilaa_form"&gt;\n<br />'+
                                            '&lt;/div&gt;<br>\n'+
                                            '&lt;script type="text/javascript"&gt;<br />\n'+
                                            'var s3key = "'+s3key+'";<br />\n'+
                                            'var s3snippettarget = "s3_tilaa_form";\n'+
                                            '&lt;/script&gt;<br />\n'+
                                            '&lt;script src="//otavamedia-mydigi.s3.amazonaws.com/s3.snippet.js" id="s3-snippet" data-s3key="'+s3key+'"&gt;&lt;/script&gt;'));
                }
        })
        .fail(function(jqXHR, status, error) {

            // service channel has no s3 settings saved
            // but still packages need to be queried from mydigi backend api
            _this.fetchPackageData(null);
        });
    };

    this.fetchPackageData = function(packageOrderList) {

        // this function queries the backend api of mydigi for packages available for this service channel

        if (packageOrderList.length === 0 ) {

            var _this = this;
            _this.makePackagesSortable();

        }

        else {

        var servicepointID = this.spotSelect.find('option:selected').attr('value');
        var _this = this;
		$.ajax({
			type : 'POST',
			url : util.apiBase+'service.point.package.get',
			data : JSON.stringify({servicepoint : servicepointID}),
			contentType : 'application/json',
			dataType : 'json'})
        .done(function(data) {

            var packages = [];
            $.each(data.packages, function(i, p) {

                if ((new Date(p[0].to)) >= (new Date())) {

                    packages.push(p);
                }
            });

            // pacakgeorderlist is the service channel's packagelist from s3
            // it contains the preset order of packages
            if (packageOrderList !== null) {

                     // if there is a continual box we have to fake a package
                    for ( var i = 0; i < packageOrderList.length; i++) {
                        if(packageOrderList[i].id === 'continualBox') {
                            var fakePackageArr = [];
                            var fakePackage = {
                                id: "continualBox",
                                marketingName: packageOrderList[i].continualBoxMarketingname
                            };
                            fakePackageArr.push(fakePackage);
                            packages.push(fakePackageArr);
                            break;
                        }
                    }

                var newPackages = packages;


                for (var i = 0; i < packageOrderList.length; i++) {


                    for (var j = 0; j < packages.length; j++) {

                        if (packages[j][0].id === packageOrderList[i].id) {

                            _this.populatePackages($.extend({}, packages[j][0], packageOrderList[i]), packages.length);
                            newPackages.splice(newPackages.indexOf(packages[j]), 1);
                        }
                    }


                }

                // newPackages should always be empty at this point
                // service channel's s3 data is updated when package is created
                // but good to check nevertheless
                for (var i = newPackages.length; i < newPackages.length; i++) {

                    _this.populatePackages(newPackages[i][0], packages.length);
                }
            }
            else {

                for (var i = 0; i < packages.length; i++) {

                    _this.populatePackages(packages[i][0], packages.length);
                }
            }


        });

        }
    };

    this.populatePackages = function(p, packagesTotal) {

        var _this = this;
        var packageContainer = _this.packageLayoutControl(p.id, p.marketingName, p.name);
        var packagesWrapper = $('.packages-wrapper:last');
        var packageFrom = new Date(p.from);

        if (packageFrom > (new Date())) {

            $('<p/>').html('Tämän paketin myynti alkaa vasta ' + packageFrom.getDate() + '.' + (packageFrom.getMonth() + 1) + '.' + packageFrom.getFullYear()).insertBefore(packageContainer.find('.package-bgimage'));
        }

        // check if the current packages-wrapper row is 'full', ie. contains three packages
        // if it is, or does, create a new row
        if (packagesWrapper.children().length === 3) {

            packagesWrapper = $('<div/>').addClass('row packages-wrapper').attr('data-row', $('.packages-wrapper').length);
            $('.packages-grid').append(packagesWrapper);
        }

        // append new package to dom
        packagesWrapper.append(packageContainer);


        if (p.id ==='continualBox') {

            $('[name="continual-box-visible"]').prop('checked',true);

            packageContainer.find('.package-alt-description').code(p.continualBoxDescription);
           // packageContainer.find('[name="continualbox-package-description"]').val(p.continualBoxDescription);
            packageContainer.find('[name="continualbox-package-header-description"]').val(p.continualBoxMarketingname);
            packageContainer.find('[name="continualbox-package-button-text"]').val(p.continualBoxButtonText);
            packageContainer.find('[name="continualbox-package-link"]').val(p.continualBoxLink);
            packageContainer.find('[name="continualbox-package-code"]').val($('<p>').html(p.continualBoxLinkCode).text());
            packageContainer.find('[name="continualbox-link-click"]').prop('checked', p.continualBoxClick);
            packageContainer.find('[name="continualbox-price"]').val(p.continualBoxPrice);
            packageContainer.find('[name="continualbox-header-font-size"]').val(p.continualBoxHeaderFontSize);

            var s3keyForContBox = this.spotSelect.find('option:selected').attr('data-s3key');
            $('.continualBoxS3Image').append($("<img/>").attr("style","max-width: 400px; max-height: 400px;").attr("src","//otavamedia-mydigi.s3.amazonaws.com/"+s3keyForContBox + '.continualboximage' + _this.devSuffix + '?refresh=' + (new Date()).getTime()));
            $('[name="continualbox-image-image"]').attr("data-s3key", s3keyForContBox + '.continualboximage' + _this.devSuffix);
        }

        if (!!p.name && !!p.id) {
            packageContainer.find(".orderExtraText").html(p.name + '<br>' + p.id);
        }

        if (!!p.headerfontsize) {

            packageContainer.find('[name="package-header-font-size"]').val(p.headerfontsize);
        }
        if (!!p.headeralttext) {

            packageContainer.find('[name="package-header-alt-text"]').val(p.headeralttext);
        }
        if (!!p.componentshidden) {

            packageContainer.find('[name="package-components-hidden"]').prop('checked', p.componentshidden);
        }
        if (!!p.componentsbeforeimage) {

            packageContainer.find('[name="package-components-before-image"]').prop('checked', p.componentsbeforeimage);
        }
        if (!!p.componentsalttext) {

            packageContainer.find('[name="package-components-alt-text"]').val(p.componentsalttext);
        }
        if (!!p.buttontext) {

            packageContainer.find('[name="package-button-text"]').val(p.buttontext);
        }
         if (!!p.giveawayheadertext) {

            packageContainer.find('[name="package-giveaway-header-text"]').val(p.giveawayheadertext);
        }
         if (!!p.giveawaysmalltext) {

            packageContainer.find('[name="package-giveaway-small-text-text"]').val(p.giveawaysmalltext);
        }
        if (!!p.altdescription) {

            if ($.trim($('<div/>').html(p.altdescription).text()) !== "") {

                packageContainer.find('.package-alt-description').code(p.altdescription);
            }
        }


        // check for existence of package image
        $.ajax({
            url : "//otavamedia-mydigi.s3.amazonaws.com/" + p.id + ".bgimage" + _this.devSuffix + '?refresh=' + (new Date()).getTime(),
            type : "GET"})
        .done(function(){

            packageContainer.find(".package-bgimage").append($("<img/>").attr("src", "//otavamedia-mydigi.s3.amazonaws.com/" + p.id + ".bgimage" + _this.devSuffix + '?refresh=' + (new Date()).getTime()).addClass("col-xs-12").css('margin-bottom', '13px'));
        })
        .fail(function() {

            packageContainer.find(".package-bgimage").html('<p>Paketille ei ole asetettu taustakuvaa. Voit asettaa taustakuvan pakettien-hallinnasta.</p>');
        })
        .always(function() {

            // check if all packages are done and make them sortable
          if ($('.single-package').length === packagesTotal) {

                _this.makePackagesSortable();
           }
        });
    };


    this.makeContinualBox = function() {


        var p = {
            id: "continualBox",
            marketingName: "Kestotilaajalaatikko"
        };

        var packageContainer = this.packageLayoutControl(p.id, p.marketingName);
        var packagesWrapper = $('.packages-wrapper:last');

        // check if the current packages-wrapper row is 'full', ie. contains three packages
        // if it is, or does, create a new row
        if (packagesWrapper.children().length === 3) {

            packagesWrapper = $('<div/>').addClass('row packages-wrapper').attr('data-row', $('.packages-wrapper').length);
            $('.packages-grid').append(packagesWrapper);
        }

        // append new package to dom
        packagesWrapper.append(packageContainer);

          // append new package to dom
        packageContainer.css('display','none');
        packageContainer.attr('id', 'continous');
        packageContainer.attr('visibility', 'none');

    };

    this.showContinualBox = function(event) {

        var element = $('#continualBox');

      // event.preventDefault();

            if(element.parent().attr('visibility')) {
                element.parent().fadeIn(400, function() {
                    element.parent().css('display','block');
                    element.parent().removeAttr('visibility');
            });

            }

            else {
                element.parent().fadeOut(400, function() {
                    element.parent().attr('visibility','none');
                    element.parent().css('display','none');
                });

            }

    };

    this.spDataChanged = function(){

        if( this.serializedForm != this.form.serialize() )
            return true;

        return false;

    }

   this.openPackageDialog = function(event){

        var _this = this;

        var packageDialog = {type: "PackageDialog", id: event.closest( '.single-package' ).attr( 'id' ), 
            update: function(){
                _this.spotSelect.find('select').trigger('change');
            }
        };

        if( this.spDataChanged() ){

            DialogManager.create({type: "ConfirmDialog", 
                          id: "spDataDirty", 
                          title: tr("warning", "capitalize"),
                          message: tr("servicePointDataDirty"),
                          yes: function(){

                            DialogManager.create( packageDialog );

                          },
                          no: function(){


                          }});

        }

        else{
              DialogManager.create( packageDialog );

        }

    };

    this.showFooterBox= function(event) {

        if(this.footerShowContainer.find(':checkbox').prop('checked') ) {
            $('.footerbox').show();
        }

        else {
            $('.footerbox').hide();
        }
    };


    this.makePackagesSortable = function() {

        /*** TAKEN FROM JARVISADMIN
         * needed enable drag'n'drop ordering of package
         ***/

        /* so far this is covering most hand held devices */
        var ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
        if(!ismobile){
            // don't make a continual box if it was already made
            if(!document.getElementById('continualBox')) {
                 this.makeContinualBox();
            }
            else {
            }

            setup_widgets_desktop();
        } else {
            setup_widgets_mobile();
        }

        /*** END OF JARVISADMIN CODE-QUOTE ***/
    };

    this.bindEvents = function(){
        var _this = this;
		this.spotSelect.find('select').on('change', _this.spotSelectListener.bind(_this));
        this.saveButton.on('click', _this.uploadToAmazon.bind(_this));
        this.continualBoxContainer.find(':checkbox').on('change', _this.showContinualBox.bind(_this));
        this.footerShowContainer.find(':checkbox').on('change', _this.showFooterBox.bind(_this));
        this.snippetUpdater.find('button[type="submit"]').on('click', _this.updateSnippet.bind(_this));
        this.form.find('[type=file]').on('click', function(){ _this.serializedForm = 'fileinputchange'; });
        this.packetLayoutCheckboxGroup.find('input').on('change', function(event){
            var columnLayoutsDiv = _this.columnLayouts.find('div');

            var inputvalue = $(this).val();

            if (inputvalue == "1"){
                _this.firstColumnLayoutControl.removeClass().addClass('col-sm-12').show();
                _this.secondColumnLayoutControl.removeClass().hide();
                _this.thirdColumnLayoutControl.removeClass().hide();
            } else if (inputvalue == "2") {
                _this.firstColumnLayoutControl.removeClass().addClass('col-sm-6').show();
                _this.secondColumnLayoutControl.removeClass().addClass('col-sm-6').show();
                _this.thirdColumnLayoutControl.removeClass().hide();
            } else {
                _this.firstColumnLayoutControl.removeClass().addClass('col-sm-4').show();
                _this.secondColumnLayoutControl.removeClass().addClass('col-sm-4').show();
                _this.thirdColumnLayoutControl.removeClass().addClass('col-sm-4').show();
            }
        });
    };
};

});
