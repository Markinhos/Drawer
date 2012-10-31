(function () {

    window.AppRouter = Backbone.Router.extend({
        routes: {
            '': 'list',
            'task/:id/': 'detail',
            'project/:id/': 'project_detail',
            'project/:id/tasks/': 'project_detail_tasks',
            'project/:id/notes/': 'project_detail_notes',
            'project/:id/activity/': 'project_detail_activity',
            'project/:id/files/': 'project_detail_files',
            'project/:id/people/': 'project_detail_people'
        },
        navigate_to: function (model) {
            var path = (model && model.get('id') + '/') || '';
            this.navigate(path, true);
        },
        
        project_detail_tasks: function (id) {
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

        project_detail_notes: function(id) {
            //fetch or get cached projects            
            app.projects.fetch({
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

        project_detail_activity: function(id) {
            //fetch or get cached projects            
            app.projects.fetch({
                //if success render sidebar and detail app
                success: function() {
                    app.sidebar.render(id);
                    var project = app.projects.get(APP_GLOBAL.PROJECT_API + id + '/');
                    app.menu.model = project;
                    app.menu.render({ "activity-active" : "active"});
                    app.detail = new ProjectActivityView({
                        project: project,
                        el: $("#content")
                    });
                    app.detail.render();
                }
            });
        },

        project_detail_files: function(id) {
            //fetch or get cached projects            
            app.projects.fetch({
                //if success render sidebar and detail app
                success: function() {
                    app.sidebar.render(id);
                    var project = app.projects.get(APP_GLOBAL.PROJECT_API + id + '/');
                    app.menu.model = project;
                    app.menu.render({ "file-active" : "active"});
                    app.detail = new ProjectFileListView({
                        project: project,
                        el: $("#content")
                    });
                    app.detail.render();
                }
            });
        },

        project_detail_people: function(id) {
            //fetch or get cached projects            
            app.projects.fetch({
                //if success render sidebar and detail app
                success: function() {
                    app.sidebar.render(id);
                    app.userProfile.fetch();        
                    var userProfile = app.userProfile;
                    var project = app.projects.get(APP_GLOBAL.PROJECT_API + id + '/');
                    app.menu.model = project;
                    app.detail = new ProjectPeopleView({
                        userProfile: userProfile,
                        project: project,
                        el: $("#content")
                    });
                    app.detail.render();
                }
            });
        },

        project_detail: function (id){
            this.project_detail_activity(id);
        },
        list: function(){
            app.projects.maybeFetch({
                success: app.sidebar.render()   
            });
        }
    });
})();