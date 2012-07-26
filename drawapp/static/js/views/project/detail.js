(function () {
    window.ProjectDetailView = Backbone.View.extend({

        render: function(){
            $(this.el).html(ich.projectDetailView(this.model.toJSON()));

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