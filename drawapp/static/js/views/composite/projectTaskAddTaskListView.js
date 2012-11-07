(function () {
    window.ProjectTaskAddTaskListView = Backbone.View.extend({
        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;
        },
        render: function(){
            debugger;
            $(this.el).html(ich.projectTaskAddTaskListTemplate(this.model.toJSON()));

            this.taskListView = new TaskListView({
                collection: this.model.get('tasks'),
                el: this.$("#task-list")
            });

            this.taskInputView = new InputView({
                model: this.model,
                el: this.$('#task-input'),
                parentView: this.taskListView
            });

            this.taskInputView.render();
            this.taskListView.render();
            return this;
        }
    });
})();