(function () {
    window.CommentListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll, this);
            this.views = [];

            var self = this;
            /*this.collection.on("add", function(status){
                self.addOne(status);
            });*/
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'remove', this.removeOne);
            /*this.collection.on("remove", function(status){
                self.removeOne(status);
            });*/

        },
        removeOne: function(comment, id, event){
            var v = this.views.filter(function(view) { return view.model == comment })[0];                        
            var index = this.views.indexOf(v);
            this.views.splice(index, 1);
            v.remove();
        },
        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function(status, id, event){
            var view = new CommentDetailView({
                statusView: this.options.statusView,
                model: status
            });            
            //$(this.el).find(".comment-input").before(view.render().el);
            $(this.el).append(view.render().el);

            this.views.push(view);
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            this.addAll();
        }
    });
})();