(function () {
    window.NoteAddView = Backbone.View.extend({
        events: {
            'click .noteInput': 'createNote',
            'keypress #note-content': 'createOnEnter'
        },

        createOnEnter: function (e) {
            if ((e.keyCode || e.which) === 13) {
                this.createNote();
                e.preventDefault();
            }

        },

        createNote: function () {
            var content = this.$('#note-content').val();
            if (content) {
                var note = new Note({
                    content: '<div>' + content + '</div>'
                });
                var that = this;
                var result = this.model.get('notes').create(note,{ wait : true ,
                    success : function(model) {
                        that.options.parentView.addOne(note);
                        this.$('#note-content').val('');
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
        }

    });
})();