(function () {
    window.ProjectPeopleView = Backbone.View.extend({
        initialize: function(arguments){     
            this.el = arguments.el;
            this.project = arguments.project;
            this.model = arguments.userProfile;
        },
        render: function(){
            $(this.el).html(ich.projectPeopleTemplate(this.model.toJSON()));
            this.peopleAddView = new PeopleAddView({
                model: this.model,
                project: this.project,
                el: this.$('#people-invite')
            });
            this.peopleAddView.render();
            return this;
        }
    });
})();