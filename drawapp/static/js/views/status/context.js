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
                this.model.on('change:dropbox_link', function(note){
                    self.render(true);
                });
            }            
        },

        /*showContext: function(e){
            this.$el.find(".tool-context").removeClass("showContext");
        },*/
        addNote: function(){
            this.noteAddContextView = new NoteAddContextView({
                model: this.model,
                el: this.$el.find(".note-context-input"),
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
        render: function(showContext){
            if(this.model){
                var data = this.model.toJSON();
                if (!showContext){
                    data.showContext = "context-hidden";
                }

                var contextHtml = ich.statusContextTemplate(data);
                $(this.el).html(contextHtml).fadeIn();
                this.taskInputView = new InputContextView({
                    model: this.model,
                    el: this.$('.context-task-input'),
                    parentView: this.taskListView
                });

                this.taskInputView.render();
                this.addAllTasks();
                this.addAllNotes();

                //Dropbox.load();

                //var dbId = "db-chooser-" + this.model.get('id');
                var el = contextHtml.find(".db-input")[0];
                Dropbox.loadElement(el);

                var self = this;
                el.addEventListener("DbxChooserSuccess",
                    function(e) {
                        console.log("Here's the chosen file: " + e.files[0].link);
                        self.setDbLink(e.files[0].link);
                    }, false);

            }
            return this;
        },
        rethrow: function(){
            this.trigger.apply(this, arguments);
        },

        setDbLink: function(link){
            this.model.set('dropbox_link', link);
            this.model.save();
        },
        dropboxChoose: function(e){
            var self = this;
            Dropbox.choose({linkType: 'preview', success: function(files){
                self.model.set('dropbox_link', files[0].link);
            }});
        }
    });
})();
