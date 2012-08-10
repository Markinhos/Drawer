(function () {
	window.NoteModalView = Backbone.View.extend({
        events: {
            'click .icon-edit': 'editNote'
        },
        render: function(){        	
            $(this.el).html(ich.noteModalTemplate(this.model.toJSON()));
            $('#noteModal').modal();
            return this;
        }
    });
})();