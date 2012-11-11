(function () {
    window.ProjectNoteAddNoteListView = Backbone.View.extend({
        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;
        },
        render: function(){                      
            $(this.el).html(ich.projectNoteAddNoteListTemplate(this.model.toJSON()));

            this.noteListView = new NoteListView({
                collection: this.model.get('notes'),
                el: this.$("#note-list")
            });

            this.noteAddView = new NoteAddView({
                model: this.model,
                el: $("#note-input"),
                parentView: this.noteListView
            });
                    
            this.noteAddView.render();
            this.noteListView.render();

            if(!app.userProfile.get('is_evernote_synced')){
                this.errorView = new Flash({ el: "#flash"});
                this.errorView.render('You are not logged into evernote! If you would like, click <a href="' 
                    + location.protocol + '//' + window.location.host + '/evernote-url/?project='+ this.model.get('id') +'">here</a>');
            }  

            return this;
        }
    });
})();