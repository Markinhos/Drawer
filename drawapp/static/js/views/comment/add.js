(function () {
    window.CommentAddView = Backbone.View.extend({
        tagName: "li",
        className: "well",
        events: {
            'click .commentInput': 'createComment',
            'keypress #comment-text': 'createOnEnter'
        },

        createOnEnter: function (e) {
            if ((e.keyCode || e.which) === 13) {
                this.createComment();
                e.preventDefault();
            }

        },

        createComment: function () {
            var text = this.$('#comment-text').val();
            if (text) {
                var comment = {
                    text: text,
                    owner: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                };
                this.model.get('comments').push(comment);
                var that = this;
                var result = this.model.save({ wait : true ,
                    success : function(model) {
                        debugger;
                        that.options.parentView.addOne(comment);
                        that.$('#comment-text').val('');
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