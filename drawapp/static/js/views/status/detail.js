(function () {
    window.StatusDetailView = Backbone.View.extend({
        events: {
            'click .status-meta': 'toggleComments'
        },    
        initialize: function(){
            this.model.bind('change', this.render, this);
        },
    	toggleComments: function(){
    		$("#status-comments-list-" + this.model.get('id')).slideToggle();
    	},
        render: function(){
            $(this.el).html(ich.statusDetailTemplate(this.model.toJSON()));
            this.commentAddView = new CommentAddView({
                model: this.model
            });
            $(".status-comments-list", this.el).append(this.commentAddView.render().el);     	
            return this;
        },
        deleteTask: function(){
            this.options.parentView.deleteOne(this.model.cid);
        }
    });
})();
