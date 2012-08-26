(function () {
    window.ProjectActivityView = Backbone.View.extend({
        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;
        },
        render: function(){
            $(this.el).html(ich.projectActivityTemplate(this.model.toJSON()));

            this.statusListView = new StatusListView({
                collection: this.model.get('statuses'),
                el: this.$("#status-list")
            });

            this.statusAddView = new StatusAddView({
                model: this.model,
                el: this.$('#status-input'),
                parentView: this.statusListView
            });

            this.statusAddView.render();
            this.statusListView.render();
            return this;
        }
    });
})();