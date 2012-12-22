(function () {
    window.StatusAddView = Backbone.View.extend({
        events: {
            'click .statusInput': 'createStatus',
            'keypress #status-text': 'createOnEnter'
        },

        createOnEnter: function (e) {
            if ((e.keyCode || e.which) === 13) {
                this.createStatus();
                e.preventDefault();
            }

        },

        createStatus: function () {
            var text = this.$('#status-text').val();
            if (text) {
                var status = new Status({
                    text: text,
                    owner: '/api/v1/user/' + APP_GLOBAL.USER + '/',
                    owner_name: app.userProfile.get('user').username
                });
                var that = this;
                var result = this.model.get('statuses').create(status,{
                    success : function(model) {
                        this.$('#status-text').val('');
                    },
                    error : function(model, response){
                        that.errorView = new Flash();
                        that.errorView.render("Sorry, there has been an error. :(", "error");
                    }
                });
                //this.model.get('statuss').create(status);
            }
        },

        render: function () {
            $(this.el).html(ich.statusAddTemplate());
        }

    });
})();