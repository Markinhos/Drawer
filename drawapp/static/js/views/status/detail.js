(function () {
    window.StatusDetailView = Backbone.View.extend({
    	events: {
    		'click .icon-comment': 'toggleComments'
    	},
    	toggleComments: function(){
    		debugger;
    		$("#status-comments-list-" + this.model.get('id')).slideToggle();
    	},
        render: function(){
            $(this.el).html(ich.statusDetailTemplate(this.model.toJSON()));        	
            return this;
        },
        deleteTask: function(){
            this.options.parentView.deleteOne(this.model.cid);
        }
    });
})();
