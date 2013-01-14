(function () {
    window.NoteDetailOverviewView = Backbone.View.extend({
        render: function(){
            var data = this.model.toJSON();
            $(this.el).html(ich.noteDetailOverviewTemplate(data));
            return this;
        }
    });
})();