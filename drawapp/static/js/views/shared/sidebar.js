(function () {
	window.SidebarApp = Backbone.View.extend({
        el: "#sidebar",
        rethrow: function () {
            this.trigger.apply(this, arguments);
        },
        render: function(id){
            $(this.el).html(ich.sidebarApp({}));
            var list = new ListProjectView({
                collection: this.collection,
                active: id || null
            });
            list.addAll();
            new InputProjectView({
                collection: this.collection,
                el: this.$('#projectModal')
            });
        }
    });
})();