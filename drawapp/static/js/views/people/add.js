(function () {
    window.PeopleAddView = Backbone.View.extend({
        events: {
            'click .noteInput': 'createInvitation',
            'keypress #email-receiver': 'createOnEnter'
        },

        initialize: function(arguments){
            this.el = arguments.el;
            this.project = arguments.project;
            this.model = arguments.model;
        },

        createOnEnter: function (e) {
            if ((e.keyCode || e.which) === 13) {
                this.createInvitation();
                e.preventDefault();
            }

        },

        createInvitation: function () {
            var content = this.$('#email-receiver').val();
            if (content) {                
                var invitation = new Invitation({
                    receiver : content,
                    project : APP_GLOBAL.PROJECT_API + this.project.get('id') +'/',
                    project_id: this.project.get('id')
                });
                var that = this;
                var result = this.model.get('invitations').create(invitation,{ wait : true ,
                    success : function(model) {
                        that.errorView = new Flash({el : "#flash"});
                        that.errorView.render("The invitation has been sent successfully :)", "success");
                        this.$('#email-receiver').val('');
                    },
                    error : function(model, response){
                        that.errorView = new Flash({el : "#flash"});
                        if (response.status === 404){
                            that.errorView.render("Sorry, the email was not found", "error");    
                        }
                        else{
                            that.errorView.render("Sorry, there has been an error. :(", "error");
                        }                        
                    }
                });
            }
        },

        render: function () {
            $(this.el).html(ich.peopleAddTemplate());
        }

    });
})();