(function () {
    window.InputContextView = Backbone.View.extend({
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
            var title = this.$('.task-input').val();
            if (title) {
                var task = new Task({
                    title: title,
                    status : 'TODO',
                    creator: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                });
                var that = this;
                var result = this.model.get('project').get('tasks').create(task,{ wait : true ,
                    success : function(model) {
                        that.model.get('tasks').add(task);
                        that.model.save();
                        that.$el.find('.task-input').val('');
                    },
                    error : function(model, response){
                        that.errorView = new Flash();
                        that.errorView.render("Sorry, there has been an error. :(", "error");
                    }
                });
            }
        },

        render: function () {
            $(this.el).html(ich.taskAddTemplate());
        }

    });
})();