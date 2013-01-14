(function () {
	window.SidebarApp = Backbone.View.extend({
        events: {
            'click #userSettings' : 'navigateToUserSettings'
        },
        el: "#sidebar",
        rethrow: function () {
            this.trigger.apply(this, arguments);
        },
        render: function(id){
            $(this.el).html(ich.sidebarApp({}));
            this.list = new ListProjectView({
                collection: this.collection,
                active: id || null
            });
            this.list.addAll();
            new AddProjectView({
                collection: this.collection,
                el: $('#projectModal')
            });
        },
        navigateToUserSettings: function(e){
            e.preventDefault();
            app.router.navigate('user-settings/', {trigger: true});
        }
    });
})();