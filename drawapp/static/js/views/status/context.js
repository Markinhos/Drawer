(function () {
    window.StatusContextView = Backbone.View.extend({
        events: {
            'click .add-note-context': 'addNote'
        },
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
                this.model.get('tasks').on('destroy', function(task){
                    self.deleteOneTask(task);
                });
                this.model.get('notes').on('add', function(note){
                    self.addOneNote(note);
                });
                this.model.get('notes').on('destroy', function(note){
                    self.deleteOneNote(note);
                });
            }            
        },
        addNote: function(){
            debugger;
            this.noteAddContextView = new NoteAddContextView({
                model: this.model,
                el: $(".note-context-input"),
                "class": "well",
                parentView: this
            });
            this.noteAddContextView.render();
        },
        addAllTasks: function(){
            this.taskViews = [];
            this.model.get('tasks').each(this.addOneTask);
        },
        addOneTask: function(task){
            var view = new TaskDetailContextView({
                parentView: this,
                model: task
            });
            debugger;
            $(this.el).find(".context-tasks").hide().prepend(view.render().el).fadeIn();            
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
            var view = new NoteDetailContextView({
                parentView: this,
                model: note
            });
            $(this.el).find(".context-notes").hide().prepend(view.render().el).fadeIn();            
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
                $(this.el).html(ich.statusContextTemplate(this.model.toJSON())).fadeIn();
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
