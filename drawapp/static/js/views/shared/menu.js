(function () {	
    window.MenuView = Backbone.View.extend({
    	events: {
    		'click .task': 'navigate_to_tasks',
    		'click .note': 'navigate_to_notes',
            'click .file': 'navigate_to_files',
            'click .activity': 'navigate_to_activity',
            'click .people': 'navigate_to_people',
            'click .overview': 'navigate_to_overview'
		},
        render: function(data){
            $(this.el).html(ich.menuView(data));
            return this;
        },
        navigate_to_notes: function(){
        	app.router.navigate('project/' + this.model.get('id') + '/notes/', {trigger: true});
        },
        navigate_to_tasks: function(){
        	app.router.navigate('project/' + this.model.get('id') + '/tasks/', {trigger: true});
        },
        navigate_to_files: function(){
            app.router.navigate('project/' + this.model.get('id') + '/files/', {trigger: true});
        },
        navigate_to_activity: function(){
            app.router.navigate('project/' + this.model.get('id') + '/activity/', {trigger: true});
        },
        navigate_to_people: function(){
            app.router.navigate('project/' + this.model.get('id') + '/people/', {trigger: true});
        },
        navigate_to_overview: function(){
            app.router.navigate('project/' + this.model.get('id') + '/overview/', {trigger: true});
        }
    });
})();