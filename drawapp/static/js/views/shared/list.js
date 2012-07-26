(function () {
	window.ListApp = Backbone.View.extend({
        el: "#app",
        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            $(this.el).html(ich.taskApp({}));
            var list = new ListView({
                collection: this.collection,
                el: this.$('#task-list')
            });
            list.addAll();
            list.bind('all', this.rethrow, this);
            new InputView({
                collection: this.collection,
                el: this.$('#input')
            });
        }
    });
})();