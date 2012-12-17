(function () {
    window.ProjectNoteAddNoteListView = Backbone.View.extend({
        events: {
            'click .add-note': 'addNote',
            'click .evernote-refresher': 'refreshNotes'
        },

        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;
        },
        render: function(){                      
            $(this.el).html(ich.projectNoteAddNoteListTemplate(this.model.toJSON()));

            this.noteListView = new NoteListView({
                collection: this.model.get('notes'),
                el: this.$("#note-list"),
                parentView: this
            });
            
            var that = this;
            if(this.model.get('notes').last()){
                this.noteEditView = new NoteEditView({
                    model: this.model.get('notes').last(),
                    el: $(".editor-side"),
                    parentView: that
                });
            }            
                    
            this.noteListView.render();
            if(this.noteEditView){
                this.noteEditView.render();
            }

            debugger;
            var views = views = this.noteListView.views;
            if (views.length > 0)
                $(views[views.length - 1].el).addClass("active")

            if(!app.userProfile.get('is_evernote_synced')){
                this.errorView = new Flash({ el: "#flash"});
                this.errorView.render('You are not logged into evernote! If you would like, click <a href="' 
                    + location.protocol + '//' + window.location.host + '/evernote-url/?project_id='+ this.model.get('id') +'">here</a>');
            }  

            return this;
        },

        addNote: function(){
            if( this.noteEditView ) {this.noteEditView.undelegateEvents();}
            this.noteAddView = new NoteAddView({
                model: this.model.get('notes'),
                el: $(".editor-side"),
                parentView: this
            });
            this.noteAddView.render();
        },

        refreshNotes: function(e){
            var elem = $(e.target);
            elem.addClass('icon-large');
            this.model.get('notes').fetch({
                success : function(){
                    elem.removeClass('icon-large')
                }
            });
        }
    });
})();