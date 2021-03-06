(function () {
    window.NoteEditView = Backbone.View.extend({
        events: {
            'click .edit-note': 'makeEditable',
            'click .save-note': 'saveNote',
            'click .delete-note': 'deleteNote'
        },
        initialize: function(arguments){
            this.parentView = arguments.parentView;
        },
        deleteNote: function(e) {
            e.preventDefault();
            if(confirm("Are you sure you want to delete the note?")){
                this.model.destroy();
            }          
        },

        saveNote: function (e) {
            var contentEdited = this.$('.editor-note-area').val();
            var titleEdited = this.$('.editor-note-title').val();            
            if (contentEdited && titleEdited) {
                //this.model.set({content : contentEdited, title: titleEdited });
                var that = this;
                var parsedContent = '<en-note>' + contentEdited + '</en-note>'
                var result = this.model.save({content : parsedContent, title: titleEdited}, {
                    success : function(model) {
                        that.render();
                    },
                    error : function(model, response){
                        that.errorView = new Flash({el : "#flash"});
                        that.errorView.render("Sorry, there has been an error. :(", "error");
                    }
                });
            }
        },

        makeEditable: function(e){
            var clickedEl = $(e.target);
            var editor = $('<textarea class="editor-note-area" rows="10">' + this.model.get('content') + '</textarea>');
            clickedEl.parents().find("#note-editor-content").find(".content-note").replaceWith(editor);
            editor.wysihtml5({ "image": false, "html": true});

            var title = $('<input class="editor-note-title span10 pull-left" value="' + this.model.get('title') + '" />');
            clickedEl.parents().find("#note-editor-content").find(".title-note").replaceWith(title);

            var saveButton =$('<a class="btn" href="#"><i class="icon-save save-note"></i></a>')
            clickedEl.parents().find("#note-editor-content").find(".edit-link").replaceWith(saveButton);            
        },

        render: function () {
            $(this.el).html(ich.noteEditTemplate(this.model.toJSON()));
        }

    });
})();