(function () {
	window.NoteView = Backbone.View.extend({
        render: function(){
            $(this.el).html(ich.noteDetailView(data));
            return this;
        }
    });
})();