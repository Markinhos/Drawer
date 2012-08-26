(function () {
    window.StatusListView = Backbone.View.extend({
        el: '#task-list',
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

        addOne: function(task){
            var view = new StatusDetailView({
                parentView: this,
                model: task
            });
            $(this.el).prepend(view.render().el);
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