(function () {
	window.NoteDetailView = Backbone.View.extend({
		tagName: "li",
		className: "",
		events: {
            'click #delete-note': 'deleteNote',
            'click .caption'    : 'showModal'
        },
        deleteNote: function(){
        	this.options.parentView.deleteOne(this.model.cid);
        },
        showModal: function(){
            this.noteModalView = new NoteModalView({
                el: $(".noteModalContainer"),
                model : this.model
            });
            this.noteModalView.render();
            return this;
        },
        render: function(){        	
            $(this.el).html(ich.noteDetailTemplate(this.model.toJSON()));
            return this;
        }
    });
})();