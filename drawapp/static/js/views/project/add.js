(function () {
    window.AddProjectView = Backbone.View.extend({
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
            var title = $('#projectTitle').val();
            var description = $('#projectDescription').val();
            if (title) {
                this.collection.create({
                    title: title,
                    description: description,
                    user: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                });
                this.$('#projectTitle').val('');
                this.$('#projectDescription').val('');
                this.$el.modal('hide');                
            }
        }

    });
})();