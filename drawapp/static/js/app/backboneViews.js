(function () {

    window.TaskView = Backbone.View.extend({
        events: {
            'click .icon-trash': 'deleteTask'
        },
        render: function(){
            $(this.el).html(ich.taskDetailView(this.model.toJSON()));
            return this;
        },
        deleteTask: function(){
            this.options.parentView.deleteOne(this.model.get('id'));
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
            var project = this.model;
            app.detail = new DetailApp({
                project: this.model,
                el: $("#app")
            });
            app.detail.render();
        }
    });

    window.TaskListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('add', this.addOne);
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

        deleteOne: function(id){
            var t = this.collection.find(function(task){ return task.get('id') == id});
            var v = this.views.filter(function(view) { return view.model == t })[0];
            t.destroy();
            v.remove();           
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
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
                model: thisModel
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
            'keypress #title': 'createOnEnter'
        },

        createOnEnter: function (e) {
            if ((e.keyCode || e.which) === 13) {
                this.createTask();
                e.preventDefault();
            }

        },

        createTask: function () {
            var title = this.$('#title').val();
            if (title) {
                var task = new Task({
                    title: title
                });
                this.model.get('task_list').add(task);
                this.model.save();
                this.options.parentView.render();
                //this.model.get('task_list').create(task);
                this.$('#title').val('');
            }
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
            if (title) {
                this.collection.create({
                    title: title,
                    user: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                });
                this.$('#projectTitle').val('');
            }
        }

    });

    window.ProjectDetailView = Backbone.View.extend({        

        render: function(){
            this.model.fetch();
            $(this.el).html(ich.projectDetailView(this.model.toJSON()));
            this.taskListView = new TaskListView({
                collection: this.model.get('task_list'),
                el: this.$("#task-list")
            });
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
            new InputView({
                model: this.model,
                el: this.$('#input'),
                parentView: this
            });
            return this;
        }
    });

    window.SidebarApp = Backbone.View.extend({
        el: "#sidebar",
        rethrow: function () {
            this.trigger.apply(this, arguments);
        },
        render: function(){
            $(this.el).html(ich.sidebarApp({}));
            var list = new ListProjectView({
                collection: this.collection
            });
            list.addAll();
            list.bind('all', this.rethrow, this);
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
                el: this.$('#tasks')
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