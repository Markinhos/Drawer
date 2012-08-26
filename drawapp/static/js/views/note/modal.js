(function () {
	window.NoteModalView = Backbone.View.extend({
        render: function(){        	
            $(this.el).html(ich.noteModalTemplate(this.model.toJSON()));
            $('#noteModal').modal();
            return this;
        }
    });
})();