(function () {
    window.UserSettingsView = Backbone.View.extend({
        events : {
            'click .change-settings': 'changeSettings',
            'click  .disconnect-evernote': 'disconnectEvernote',
            'click  .disconnect-dropbox': 'disconnectDropbox'
        },
        disconnectDropbox: function(e){

            var csrf = this.$el.find('input[name=csrfmiddlewaretoken]').val();
            var jqXHR = $.ajax({
                type: 'POST',
                url: '/disconnect-dropbox/',
                data : {
                    'csrfmiddlewaretoken'    : csrf
                },
                dataType: 'json',
                success: function(data, text, jqXHR){
                    self.errorView = new Flash({ el: "#flash"});
                    self.errorView.render('Dropbox disconnected', 'success');
                    $('.disconnect-dropbox').parent().hide();
                },
                error: function(xhr, ajaxOptions, thrownError){
                    self.errorView = new Flash({ el: "#flash"});
                    self.errorView.render('There was an error', 'error');
                }
            });
        },
        disconnectEvernote: function(e){

            var csrf = this.$el.find('input[name=csrfmiddlewaretoken]').val();
            var jqXHR = $.ajax({
                type: 'POST',
                url: '/disconnect-evernote/',
                data : {
                    'csrfmiddlewaretoken'    : csrf
                },
                dataType: 'json',
                success: function(data, text, jqXHR){
                    self.errorView = new Flash({ el: "#flash"});
                    self.errorView.render('Evernote disconnected', 'success');
                },
                error: function(xhr, ajaxOptions, thrownError){
                    self.errorView = new Flash({ el: "#flash"});
                    self.errorView.render('There was an error', 'error');
                }
            });
        },
        changeSettings: function(e){
            var username = this.$el.find('#username-input').val();
            var email = this.$el.find('#email-input').val();
            var currentpass = this.$el.find('#current-pass').val();
            var newpass = this.$el.find('#new-pass').val();            
            var newrepeatpass = this.$el.find('#new-repeat-pass').val();
            var csrf = this.$el.find('input[name=csrfmiddlewaretoken]').val();

            var self = this;
            var jqXHR = $.ajax({
                type: 'POST',
                url: '/change-settings/',
                data : { 
                    'username'      : username,
                    'email'         : email,
                    'currentpass'   : currentpass,
                    'newpass'       : newpass,
                    'newrepeatpass' : newrepeatpass,
                    'csrfmiddlewaretoken'    : csrf
                },
                dataType: 'json',
                success: function(data, text, jqXHR){
                    self.errorView = new Flash({ el: "#flash"});
                    self.errorView.render('Settings changed', 'success');
                    $('.password input').each(function(){
                        $(this).val('');
                    });
                    $('.control-group').each(function(field){ 
                        $(this).removeClass('error');
                    });
                },
                error: function(xhr, ajaxOptions, thrownError){
                    self.errorView = new Flash({ el: "#flash"});
                    self.errorView.render('There was an error', 'error');

                    var response = $.parseJSON(xhr.responseText);
                    $('.control-group').each(function(field){ 
                        $(this).removeClass('error');
                    });
                    $.each(response.fields, function(index, field){
                        $('#' + field).parents('.control-group').addClass('error');
                        $('#' + field).after('<span class="help-inline">' + response.message + '</span>');
                    });
                }
            });
        },
        initialize: function(arguments){
        },
        render: function(){
            var dataModel = this.model.toJSON();
            dataModel.noServiceConnected = !(dataModel.is_dropbox_synced && dataModel.is_evernote_synced);
            dataModel.csrftoken = APP_GLOBAL.CSFR_TOKEN;
            $(this.el).html(ich.userSettingsTemplate(dataModel));
            return this;
        }
    });
})();