(function () {
    window.CommentListView = Backbone.View.extend({
        render: function(){
            $(this.el).html(ich.commentDetailTemplate(this.model.toJSON()));
            return this;
        }
    });
})();