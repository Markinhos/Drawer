(function () {
    window.CommentDetailView = Backbone.View.extend({
		className: "well",
        render: function(){
            $(this.el).html(ich.commentDetailTemplate(this.model.toJSON()));
            return this;
        },
        deleteTask: function(){
            this.options.parentView.deleteOne(this.model.cid);
        }
    });
})();
