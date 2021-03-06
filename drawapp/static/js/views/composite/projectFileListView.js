(function () {
    window.ProjectFileListView = Backbone.View.extend({
        events: {
            'click .dropbox-refresher': 'refreshFiles'
        },
        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;            
        },
        render: function(){            
            //If user is not logged to dropbox prompt not logged view
            if(!app.userProfile.get('is_dropbox_synced')){
                var data = this.model.toJSON();
                data.host = location.protocol + '//' + window.location.host;
                $(this.el).html(ich.projectFileListNoDropboxLoggingTemplate(data));
            }
            //Show dropbox files
            else
            {
                $(this.el).html(ich.projectFileListTemplate(this.model.toJSON()));                

                this.fileListView = new FileListView({
                    collection: this.model.get('files'),
                    el: this.$("#file-list")
                });

                this.fileAddView = new FileAddView({
                    model: this.model,
                    el: this.$("#file-add"),
                    parentView: this.fileListView
                });
                this.fileAddView.render();
                this.fileListView.render();
                $(".fancybox").fancybox();
            }            
            
            return this;
        },

        refreshFiles: function(e){
            var elem = $(e.target);
            elem.addClass('icon-spin');
            this.model.get('files').fetch({
                success : function(){
                    elem.removeClass('icon-spin');
                    $('.fancybox').fancybox();
                }
            });
        }
    });
})();