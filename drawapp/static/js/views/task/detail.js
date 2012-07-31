(function () {
    window.TaskDetailView = Backbone.View.extend({
        events: {
            'click .icon-trash': 'deleteTask',
            'change .task-status' : 'selectStatus'
        },
        selectStatus: function(){
            var status;
            status = this.model.get('status') === "TODO" ? "DONE" : "TODO"
            this.model.set('status', status)
            this.model.save();
        },
        render: function(){
            var isDone, doneStatus;
            isTodo = this.model.get('status') === "TODO";
            isTodo ? doneStatus = '' : doneStatus = 'checked';
            data = this.model.toJSON();
            data.doneStatus = doneStatus;
            $(this.el).html(ich.taskDetailTemplate(data));
            return this;
        },
        deleteTask: function(){
            this.options.parentView.deleteOne(this.model.cid);
        }
    });
})();
