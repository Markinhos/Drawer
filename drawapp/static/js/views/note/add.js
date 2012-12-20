(function () {
    window.NoteAddView = Backbone.View.extend({
        events: {
            'click .save-note': 'saveNote',
            'click .delete-note': 'deleteNote'
        },

        deleteNote: function(e) {
            e.preventDefault();
            if(confirm("Are you sure you want to delete this note?")){
                this.undelegateEvents();
                this.options.parentView.render();
            }            
        },

        saveNote: function (e) {
            e.preventDefault();
            var contentEdited = this.$('.editor-note-area').val();
            var titleEdited = this.$('.editor-note-title').val();            
            if (contentEdited && titleEdited) {
                //this.model.set({content : contentEdited, title: titleEdited });
                var that = this;
                var note = new Note({
                    content: '<en-note>' + contentEdited + '</en-note>',
                    title: titleEdited
                });
                var result = this.model.create(note, {
                    success : function(model) {
                        that.undelegateEvents();
                    },
                    error : function(model, response){
                        that.errorView = new Flash({el : "#flash"});
                        that.errorView.render("Sorry, there has been an error. :(", "error");
                    }
                });
            }
        },
        render: function () {
            $(this.el).html(ich.noteAddTemplate());
            var editor = $(this.el).find('.editor-note-area');
            editor.wysihtml5();
        }

    });
})();