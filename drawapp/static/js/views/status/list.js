(function () {
    window.StatusListView = Backbone.View.extend({
        el: '#status-list',
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('reset', this.addAll, this);
            this.views = [];
        },

        changeEvent: function(){
            alert('sync');
        },

        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function(status){
            var view = new StatusDetailView({
                parentView: this,
                model: status
            });
            $(this.el).prepend(view.render().el);
            view.commentAddView = new CommentAddView({
                el: $("#status-comments-list-" +  view.model.get('id')),
                model: status
            });

            view.commentListView = new CommentListView({
                el: $("#status-comments-list-" +  view.model.get('id')),
                collection: status.get('comments')
            });

            view.commentAddView.render();
            view.commentListView.render();

            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        deleteOne: function(cid){
            var t = this.collection.getByCid(cid);
            var v = this.views.filter(function(view) { return view.model == t })[0];
            t.destroy();
            v.remove();
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            this.addAll();
        }

    });
})();