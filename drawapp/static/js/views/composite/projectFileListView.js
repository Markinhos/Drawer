(function () {
    window.ProjectFileListView = Backbone.View.extend({
        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;            
        },
        render: function(){            
            //If user is not logged to dropbox prompt not logged view
            if(!app.userProfile.get('is_dropbox_synced')){
                $(this.el).html(ich.projectFileListNoDropboxLoggingTemplate(this.model.toJSON()));
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
            }            
            
            return this;
        }
    });
})();