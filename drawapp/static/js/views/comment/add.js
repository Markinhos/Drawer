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
                var comment = new Comment({
                    text: text,
                    owner: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                });
                this.model.get('comments').add(comment);
                var that = this;
                var result = this.model.save({ wait : true ,
                    success : function(model) {
                        that.options.parentView.addOne(comment);
                        this.$('#comment-text').val('');
                    },
                    error : function(model, response){
                        that.errorView = new Flash(),
                        that.errorView.render({message : "Sorry, there has been an error. :(" })
                    }
                });
                //this.model.get('comments').create(comment);
            }
        },

        render: function () {
            $(this.el).html(ich.commentAddTemplate());
        }

    });
})();