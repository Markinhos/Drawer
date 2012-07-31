(function () {	
    window.MenuView = Backbone.View.extend({
    	events: {
    		'click .task': 'navigate_to_tasks',
    		'click .note': 'navigate_to_notes'
		},
        render: function(data){
            $(this.el).html(ich.menuView(data));
            return this;
        },
        navigate_to_notes: function(){
        	app.router.navigate('project/' + this.model.get('id') + '/note/', {trigger: true});
        },
        navigate_to_tasks: function(){
        	app.router.navigate('project/' + this.model.get('id') + '/task/', {trigger: true});
        }
    });
})();