(function () {
    window.ProjectNoteAddNoteListView = Backbone.View.extend({
        events: {
            'click .add-note': 'addNote',
            'click .evernote-refresher': 'refreshNotes'
        },

        initialize: function(arguments){
            _.bindAll(this);
            this.el = arguments.el;
            this.model = arguments.project;
            this.model.get('notes').comparator = function(note1, note2) { 
                var modified1 = note1.get('modified');
                var modified2 = note2.get('modified');
                if (modified1 > modified2){
                    return 1;
                }
                else if(modified2 > modified1){
                    return -1;
                }
                else
                    return 0;
            };
            this.model.get('notes').maybeFetch({});

            var self = this;
            this.model.get('notes').on('add', function(){
                self.render();
            });
            this.model.get('notes').on('destroy', function(){
                self.render();
            });
        },
        render: function(){     
            $(this.el).html(ich.projectNoteAddNoteListTemplate(this.model.toJSON()));

            this.noteListView = new NoteListView({
                collection: this.model.get('notes'),
                el: this.$("#note-list"),
                parentView: this
            });

            this.paginatedView = new PaginatedView({
                collection: this.model.get('notes'),
                el: this.$('.pagination')
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

            if(this.model.get('notes').pageInfo().pages > 1){
                this.paginatedView.render();    
            }
            
            var views = this.noteListView.views;
            if (views.length > 0)
                $(views[views.length - 1].el).addClass("active")

            if(!app.userProfile.get('is_evernote_synced')){
                this.errorView = new Flash({ el: "#flash"});
                this.errorView.render('You are not logged into evernote! If you would like, click <a href="' 
                    + location.protocol + '//' + window.location.host + '/evernote-url/?project_id='+ this.model.get('id') +'">here</a>');
            }  

            return this;
        },

        addNote: function(e){
            e.preventDefault();
            if( this.noteEditView ) {this.noteEditView.undelegateEvents();}
            this.noteAddView = new NoteAddView({
                model: this.model.get('notes'),
                el: $(".editor-side"),
                parentView: this
            });
            this.noteAddView.render();
        },

        refreshNotes: function(e){
            e.preventDefault();
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