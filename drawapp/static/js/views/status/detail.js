(function () {
    window.StatusDetailView = Backbone.View.extend({
        render: function(){
            $(this.el).html(ich.statusDetailTemplate(this.model.toJSON()));
            return this;
        },
        deleteTask: function(){
            this.options.parentView.deleteOne(this.model.cid);
        }
    });
})();
