(function () {
    window.StatusContextView = Backbone.View.extend({ 
        initialize: function(){
            _.bindAll(this);
            //this.model.bind('change', this.render, this);
            this.taskViews = [];
            this.noteViews = [];
            if(this.model){
                this.model.get('tasks').bind('reset', this.addAllTasks, this);
                this.model.get('notes').bind('reset', this.addAllNotes, this);
                var self = this;
                this.model.get('tasks').on('add', function(task){
                    self.addOneTask(task);
                });
                this.model.get('tasks').on('remove', function(task){
                    self.deleteOneTask(task);
                });
                this.model.get('notes').on('add', function(note){
                    self.addOneNote(note);
                });
                this.model.get('notes').on('remove', function(note){
                    self.deleteOneTask(note);
                });
            }            
        },
        addAllTasks: function(){
            this.taskViews = [];
            this.model.get('tasks').each(this.addOneTask);
        },
        addOneTask: function(task){
            var view = new TaskDetailView({
                parentView: this,
                model: task
            });
            debugger;
            $(this.el).find(".context-tasks").hide().prepend(view.render().el).fadeIn('slow');            
            this.taskViews.push(view);
            view.bind('all', this.rethrow, this);
        },
        deleteOneTask: function(task){
            var v = this.taskViews.filter(function(view) { return view.model == task })[0];
            v.remove();
            this.taskViews.pop(v);
        },
        addAllNotes: function(){
            this.noteViews = [];
            this.model.get('notes').each(this.addOneNote);
        },
        addOneNote: function(note){
            var view = new NoteDetailView({
                parentView: this,
                model: note
            });
            debugger;
            $(this.el).find(".context-notes").hide().prepend(view.render().el).fadeIn('slow');            
            this.noteViews.push(view);
            view.bind('all', this.rethrow, this);
        },
        deleteOneNote: function(note){
            var v = this.noteViews.filter(function(view) { return view.model == note })[0];
            v.remove();
            this.noteViews.pop(v);
        },
        render: function(){
            if(this.model){                
                $(this.el).html(ich.statusContextTemplate(this.model.toJSON())).fadeIn('slow');
                this.taskInputView = new InputContextView({
                    model: this.model,
                    el: this.$('.context-task-input'),
                    parentView: this.taskListView
                });

                this.taskInputView.render();
                this.addAllTasks();
                this.addAllNotes();                
            }
            return this;
        },
        rethrow: function(){
            this.trigger.apply(this, arguments);
        }
    });
})();
