(function () {

    window.AppRouter = Backbone.Router.extend({
        routes: {
            '': 'list',
            'task/:id/': 'detail',
            'project/:id/': 'project_detail',
            'project/:id/task/': 'project_detail_task',
            'project/:id/note/': 'project_detail_note'
        },
        navigate_to: function (model) {
            var path = (model && model.get('id') + '/') || '';
            this.navigate(path, true);
        },
        
        project_detail_task: function (id) {
            //fetch or get cached projects
            app.projects.maybeFetch({
                //if success render sidebar and detail app
                success: function() {
                    app.sidebar.render(id);                                
                    var project = app.projects.get(APP_GLOBAL.PROJECT_API + id + '/');
                    app.menu.model = project;
                    app.menu.render({ "task-active" : "active"});
                    app.detail = new ProjectTaskAddTaskListView({
                        project: project,
                        el: $("#content")
                    });
                    app.detail.render();
                }
            }); 
        },

        project_detail_note: function(id) {
            //fetch or get cached projects            
            app.projects.maybeFetch({
                //if success render sidebar and detail app
                success: function() {
                    app.sidebar.render(id);
                    var project = app.projects.get(APP_GLOBAL.PROJECT_API + id + '/');
                    app.menu.model = project;
                    app.menu.render({ "note-active" : "active"});
                    app.detail = new ProjectNoteAddNoteListView({
                        project: project,
                        el: $("#content")
                    });
                    app.detail.render();
                }
            });
        },
        project_detail: function (id){
            this.project_detail_task(id);
        },
        list: function(){
            app.projects.maybeFetch({
                success: app.sidebar.render()   
            });
        }
    });
})();