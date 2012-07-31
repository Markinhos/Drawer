(function () {
	window.NoteDetailView = Backbone.View.extend({
		tagName: "li",
		className: "span3",
		events: {
            'click #delete-note': 'deleteNote'
        },
        deleteNote: function(){
        	this.options.parentView.deleteOne(this.model.cid);
        },
        render: function(){        	
            $(this.el).html(ich.noteDetailTemplate(this.model.toJSON()));
            return this;
        }
    });
})();