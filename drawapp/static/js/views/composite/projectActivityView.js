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
                el: this.$("#status-list"),
                parentView: this
            });

            this.statusAddView = new StatusAddView({
                model: this.model,
                el: this.$('#status-input'),
                parentView: this.statusListView
            });

            //this.noteAddView = new NoteAddView({
                //model: this.model.get('notes'),
                //el: $(".tool-list"),
              //  parentView: this
            //});

            this.statusAddView.render();
            this.statusListView.render();

            debugger;
            lastStatus = this.model.get('statuses').last();
            if (lastStatus.get('task')){
                this.renderTask(lastStatus.get('task'));
            }
            
            //this.statusListView.collection.startLongPolling();
            this.statusListView.collection.on('reset', function(){ console.log('Comments fetched'); });
            return this;
        }
    });
})();