(function () {
    window.ProjectActivityView = Backbone.View.extend({
        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;
        },
        renderTask: function(task){
            var view = new TaskDetailView({
                parentView: this,
                model: task
            });
            $(this.el).find(".tool-list").prepend(view.render().el);
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
            
            this.statusContextView = new StatusContextView({
                model: this.model.get('statuses').last(),
                el: this.$('.tool-list'),
                parentView: this
            });
            
            this.statusAddView.render();
            this.statusListView.render();
            this.statusContextView.render();
            
            //this.statusListView.collection.startLongPolling();
            this.statusListView.collection.on('reset', function(){ console.log('Comments fetched'); });
            return this;
        }
    });
})();