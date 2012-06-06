(function () {

    window.AppRouter = Backbone.Router.extend({
        routes: {
            '': 'list',
            'task/:id/': 'detail',
            'project/:id/': 'project_detail'
        },
        navigate_to: function (model) {
            var path = (model && model.get('id') + '/') || '';
            this.navigate(path, true);
        },

        project_detail: function (id) {

        },

        detail: function(){},

        list: function(){}
    });


    $(function(){
        window.app = window.app || {};
        app.router = new AppRouter();
        app.tasks = new TaskList();
        app.projects = new ProjectList();
        app.list = new ListApp({
            el: $("#app"),
            collection: app.tasks
        });
        app.sidebar = new SidebarApp({
            el: $("#sidebar"),
            collection: app.projects
        });
        app.detail = new DetailApp({
            el: $("#app")
        });
        app.router.bind('route:list', function(){
            app.projects.maybeFetch({
                success: _.bind(app.sidebar.render, app.sidebar)
            });
            app.tasks.maybeFetch({
                success: _.bind(app.list.render, app.list)
            });
        });
        app.router.bind('route:detail', function(id){
            app.tasks.getOrFetch(app.tasks.urlRoot + id + '/', {
                success: function(model){
                    app.detail.model = model;
                    app.detail.render();
                }
            });
        });

        app.list.bind('navigate', app.router.navigate_to, app.router);
        app.detail.bind('home', app.router.navigate_to, app.router);
        Backbone.history.start({
            pushState: true,
            silent: app.loaded
        });
    });
})();