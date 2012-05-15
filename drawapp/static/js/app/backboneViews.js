(function () {

    window.TaskView = Backbone.View.extend({
        render: function(){
            $(this.el).html(ich.taskTemplate(this.model.toJSON()));
            return this;
        }
    });

    window.ProjectView = Backbone.View.extend({
        render: function(){
            $(this.el).html(ich.projectTemplate(this.model.toJSON()));
            return this;
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

        addOne: function(thisModel){
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

        addOne: function(thisModel){
            var view = new ProjectView({
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

    window.DetailApp = Backbone.View.extend({
        events: {
            'click .home': 'home'
        },

        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        render: function(){
            $(this.el).html(ich.detailApp(this.model.toJSON()));
            return this;
        }
    });

    window.InputView = Backbone.View.extend({
        events: {
            'click .taskInput': 'createTask',
            'keypress #title': 'createOnEnter'
        },

        createOnEnter: function(e){
            if((e.keyCode || e.which) == 13){
                this.createTask();
                e.preventDefault();
            }

        },

        createTask: function(){
            var title = this.$('#title').val();
            if(title){
                this.collection.create({
                    title: title
                });
                this.$('#title').val('');
            }
        }

    });

    window.SidebarApp = Backbone.View.extend({
        el: "#sidebar",
        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            $(this.el).html(ich.sidebarApp({}));
            var list = new ListProjectView({
                collection: this.collection,
                el: this.$('#projects')
            });
            list.addAll();
            list.bind('all', this.rethrow, this);
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