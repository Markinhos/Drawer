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
            return this;
        }
    });
})();