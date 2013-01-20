(function () {
    window.CommentAddView = Backbone.View.extend({
        events: {
            'keypress .comment-input-text': 'createOnEnter'
        },

        createOnEnter: function (e) {
            if ((e.keyCode || e.which) === 13) {
                this.createComment();
                e.preventDefault();
            }

        },

        createComment: function () {
            var text = this.$('.comment-input-text').val();
            if (text) {
                var comment = new Comment({
                    text: text,
                    owner: '/api/v1/user/' + APP_GLOBAL.USER + '/',
                    owner_name: app.userProfile.get('user').username
                });
                this.model.get('comments').push(comment);
                var that = this;
                var result = this.model.save(null, {
                    success : function(model) {
                        //that.options.parentView.addOne(comment);
                        that.$('.comment-input-text').val('');
                    },
                    error : function(model, response){
                        that.errorView = new Flash({el : "#flash"}),
                        that.errorView.render("Sorry, there has been an error. :(", "error")
                    }
                });
            }
        },

        render: function () {
            $(this.el).html(ich.commentAddTemplate());
            return this;
        }

    });
})();