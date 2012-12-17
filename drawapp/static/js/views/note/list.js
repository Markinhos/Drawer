(function () {
    window.NoteListView = Backbone.View.extend({
        el: '#note-list',
        initialize: function(arguments){
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll, this);
            this.views = [];

            var self = this;
            this.collection.on('add', function(task){
                self.addOne(task);
            });
            this.collection.on('destroy', function(task){
                self.deleteOne(task);
            });
        },

        addAll: function(){
            $(this.views).each(function(index){
                this.remove();
            });
            this.views = [];            
            this.collection.each(this.addOne);
        },

        addOne: function(note){
            var view = new NoteDetailView({
                parentView: this.options.parentView,
                model: note
            });
            $(this.el).prepend(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        deleteOne: function(note){
            var v = this.views.filter(function(view) { return view.model == note })[0];
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