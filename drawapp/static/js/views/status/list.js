(function () {
    window.StatusListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('reset', this.addAll, this);
            this.views = [];

            var self = this;
            this.collection.on("add", function(status){
                self.addOne(status);
            });

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
            if(status.isNew()){
                $(this.el).prepend(view.render().el);
            }
            else{
                $(this.el).append(view.render().el);
            }            

            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            this.addAll();
        }

    });
})();