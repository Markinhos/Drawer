(function () {
    window.TaskDetailView = Backbone.View.extend({
        events: {
            'click .icon-trash': 'deleteTask',
            'change .task-status' : 'selectStatus',
            'hover .task-tools' : 'increaseIconTool'
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
            var today = new Date();
            data.todayDay = today.getDay();
            data.todayMonth = today.getMonth();
            data.todayYear = today.getFullYear();
            $(this.el).html(ich.taskDetailTemplate(data));            
            $(this.el).find(".dateinput").datepicker({ format: 'dd-mm-yyyy'});
            //$(this.el).find(".timepicker-default").timepicker({defultTime: 'current'});
            return this;
        },
        deleteTask: function(){
            this.options.parentView.deleteOne(this.model.cid);
        },
        increaseIconTool: function(e){
            var element = $(this.el).find(".task-tools");
            if(!element.hasClass("icon-large")){
                $(this.el).find(".task-tools").addClass("icon-large");
            }
            else{
                $(this.el).find(".task-tools").removeClass("icon-large");
            }
        }
    });
})();
