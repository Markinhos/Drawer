(function () {

    window.TaskView = Backbone.View.extend({
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
            $(this.el).html(ich.taskDetailView(data));
            return this;
        },
        deleteTask: function(){
            this.options.parentView.deleteOne(this.model.cid);
        }
    });

    window.ProjectView = Backbone.View.extend({
        events: {
            'click .projectDetail': 'project_detail'
        },
        tagName: 'li',
        render: function(){
            $(this.el).html(ich.projectTemplate(this.model.toJSON())); 
            return this;
        },
        project_detail: function(){
            app.router.navigate('project/' + this.model.get('id') + '/', true)
        }
    });

    window.TaskListView = Backbone.View.extend({
        el: '#task-list',
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('reset', this.addAll, this);
            this.views = [];
        },

        changeEvent: function(){
            alert('sync');
        },

        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function(task){            
            var view = new TaskView({                
                parentView: this,
                model: task
            });
            $(this.el).prepend(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        deleteOne: function(cid){
            var t = this.collection.getByCid(cid);
            var v = this.views.filter(function(view) { return view.model == t })[0];
            t.destroy();
            v.remove();           
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            this.addAll();
        }

    });


    window.ListProjectView = Backbone.View.extend({
        el: "#projects",
        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('add', this.addOne);
            this.collection.bind('reset', this.addAll, this);
            this.views = [];
        },

        addAll: function () {
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function (thisModel) {
            var view = new ProjectView({
                id: thisModel.id,
                model: thisModel,
                className: (this.options.active && this.options.active === thisModel.get('id')) ? 'active' : ''          
            });
            $(this.el).children().first().after(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        rethrow: function () {
            this.trigger.apply(this, arguments);
        }

    });

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

    window.Flash = Backbone.View.extend({
        el: "#errors",
        render: function(errorText) {
            $(this.el).html(ich.flash(errorText));
        }
    });

    window.InputProjectView = Backbone.View.extend({
        events: {
            'click .projectInput': 'createProject',
            'keypress #projectTitle': 'createOnEnterProject'
        },

        createOnEnterProject: function (e) {
            if ((e.keyCode || e.which) === 13) {
                this.createProject();
                e.preventDefault();
            }
        },

        createProject: function () {
            var title = this.$('#projectTitle').val();
            var description = this.$('#projectDescription').val();
            if (title) {
                this.collection.create({
                    title: title,
                    description: description,
                    user: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                });
                this.$('#projectTitle').val('');
                this.$('#projectDescription').val('');
            }
        }

    });

    window.ProjectDetailView = Backbone.View.extend({ 
        render: function(){
            this.model.fetch();
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
    })
    

    window.DetailApp = Backbone.View.extend({        

        events: {
            'click .home': 'home'
        },

        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;
        },

        render: function(){
            this.projectDetailView = new ProjectDetailView({
                model: this.model,
                el: this.el
            });
            this.projectDetailView.render();            
            return this;
        }
    });

    window.SidebarApp = Backbone.View.extend({
        el: "#sidebar",
        rethrow: function () {
            this.trigger.apply(this, arguments);
        },
        render: function(id){
            $(this.el).html(ich.sidebarApp({}));
            var list = new ListProjectView({
                collection: this.collection,
                active: id || null
            });
            list.addAll();
            new InputProjectView({
                collection: this.collection,
                el: this.$('#projectModal')
            });
        }
    });

    window.ListApp = Backbone.View.extend({
        el: "#app",
        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            $(this.el).html(ich.taskApp({}));
            var list = new ListView({
                collection: this.collection,
                el: this.$('#task-list')
            });
            list.addAll();
            list.bind('all', this.rethrow, this);
            new InputView({
                collection: this.collection,
                el: this.$('#input')
            });
        }
    });
})();