(function () {
    window.InputView = Backbone.View.extend({
        events: {
            'click .taskInput': 'createTask',
            'keypress #task-title': 'createOnEnter'
        },

        createOnEnter: function (e) {
            if ((e.keyCode || e.which) === 13) {
                this.createTask();
                e.preventDefault();
            }

        },

        createTask: function () {
            var title = this.$('#task-title').val();
            if (title) {
                var task = new Task({
                    title: title,
                    status : 'TODO'
                });
                var that = this;
                var result = this.model.get('tasks').create(task,{ wait : true ,
                    success : function(model) {
                        that.options.parentView.addOne(task);
                        this.$('#task-title').val('');
                    },
                    error : function(model, response){
                        that.errorView = new Flash(),
                                that.errorView.render({message : "Sorry, there has been an error. :(" })
                    }
                });
                //this.model.get('tasks').create(task);
            }
        },

        render: function () {
            $(this.el).html(ich.taskInputView());
        }

    });
})();