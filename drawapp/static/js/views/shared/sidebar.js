(function () {
	window.SidebarApp = Backbone.View.extend({
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
        }
    });
})();