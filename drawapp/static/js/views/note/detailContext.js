(function () {
    window.NoteDetailContextView = NoteDetailView.extend({    	
		tagName: "div",
		className: "accordion-group note-group",
        showEditor: function(e){
            this.noteEditView = new NoteEditView({
                model: this.model,
                el: $(".editor-context"),
                parentView: this
            });	
            this.noteEditView.render();
        },
        render: function(){
            var data = this.model.toJSON();
            data.snipett = data.content.replace(/<(?:.|\n)*?>/gm, '');

            $(this.el).html(ich.noteDetailContextTemplate(data));
            var images = this.$el.find("img");
            var self = this;
            images.each( function(index) { 
                $(this)
                    .load()
                    .error(function() {
                        $(self.$el.find(".evernote-thumbnail")).remove();
                        $(self.$el.find(".note-snipett")).removeClass("span10").addClass("span12")
                    })
            });
            this.noteEditView = new NoteEditView({
                model: this.model,
                el: $(this.$el.find(".editor-context")),
                parentView: this
            });	
            this.noteEditView.render();
            return this;
        }
    });
})();