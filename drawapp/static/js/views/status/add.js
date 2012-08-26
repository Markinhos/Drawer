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
                    owner: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                });
                var that = this;
                var result = this.model.get('statuses').create(status,{ wait : true ,
                    success : function(model) {
                        that.options.parentView.addOne(status);
                        this.$('#status-title').val('');
                    },
                    error : function(model, response){
                        that.errorView = new Flash(),
                        that.errorView.render({message : "Sorry, there has been an error. :(" })
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