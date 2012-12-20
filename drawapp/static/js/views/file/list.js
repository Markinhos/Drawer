(function () {
    window.FileListView = Backbone.View.extend({
        el: '#file-list',
        initialize: function(){
            _.bindAll(this);
            this.collection.bind('reset', this.addAll, this);
            this.views = [];

            this.collection.on('destroy', function(file){
                self.deleteOne(file);
            });
        },

        changeEvent: function(){
            alert('sync');
        },

        addAll: function(){
            $(this.views).each(function(index){
                this.remove();
            });
            this.views = [];            
            this.collection.each(this.addOne);
        },

        addOne: function(task){
            var view = new FileDetailView({
                parentView: this,
                model: task
            });
            $(this.el).prepend(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        deleteOne: function(file){
            var v = this.views.filter(function(view) { return view.model == file })[0];
            v.remove();
            this.views.pop(v);
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            this.addAll();
        }

    });
})();