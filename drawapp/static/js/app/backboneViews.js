(function () {

    window.TaskView = Backbone.View.extend({
        tagName: 'li',
        render: function(){
            $(this.el).html(ich.taskTemplate(this.model.toJSON()));
            return this;
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
            app.detail.model = this.model;
            app.detail.render();
        }
    });

    window.ListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('add', this.addOne);
            this.collection.bind('reset', this.addAll, this);
            this.views = [];
        },

        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function (thisModel) {
            var view = new TaskView({
                model: thisModel
            });
            $(this.el).prepend(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
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

    window.DetailApp = Backbone.View.extend({
        events: {
            'click .home': 'home'
        },

        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        render: function(){
            this.model.fetch();
            $(this.el).html(ich.detailApp(this.model.toJSON()));
            return this;
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
                this.collection.create({
                    title: title
                });
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