(function () {

    $(function(){
        window.app = window.app || {};
        app.router = new AppRouter();
        app.projects = new ProjectList();
        app.sidebar = new SidebarApp({
            el: $("#sidebar"),
            collection: app.projects
        });
        app.menu = new MenuView({
            el: $("#app")
        });
        
        app.userProfile = new UserProfile();
        app.userProfile.fetch();
        Backbone.history.start({
            pushState: true,
            silent: app.loaded
        });
    });
})();