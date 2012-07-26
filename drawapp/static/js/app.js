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
            //fetch or get cached projects
            app.projects.maybeFetch({
                //if success render sidebar and detail app
                success: function() {
                    app.sidebar.render(id);
                    var project = app.projects.get(APP_GLOBAL.PROJECT_API + id + '/');
                    app.detail = new DetailApp({
                        project: project,
                        el: $("#app")
                    });
                    app.detail.render();
                }
            }); 
        },

        detail: function(){},

        list: function(){
            app.projects.maybeFetch({
                success: app.sidebar.render()   
            });
        }
    });


    $(function(){
        window.app = window.app || {};
        app.router = new AppRouter();
        app.projects = new ProjectList();
        app.list = new ListApp({
            el: $("#app"),
            collection: app.tasks
        });
        app.sidebar = new SidebarApp({
            el: $("#sidebar"),
            collection: app.projects
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
        Backbone.history.start({
            pushState: true,
            silent: app.loaded
        });
    });
})();