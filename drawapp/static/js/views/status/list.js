(function () {
    window.StatusListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this);
            
            this.views = [];

            //this.collection.bind('reset', this.addAll, this);
            var self = this;
            this.collection.on("add", function(status, collection, options){
                self.addOne(status);
            });


            //this.collection.startLongPolling();
            //this.collection.on('reset', function(){ console.log('Statuses fetched'); });

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
            //view.bind('all', this.rethrow, this);
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            this.addAll();
        }

    });
})();