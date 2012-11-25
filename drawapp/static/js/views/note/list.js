(function () {
    window.NoteListView = Backbone.View.extend({
        el: '#note-list',
        initialize: function(arguments){
            _.bindAll(this, 'addOne', 'addAll');
            this.collection.bind('reset', this.addAll, this);
            this.views = [];
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

        addOne: function(note){
            var view = new NoteDetailView({
                parentView: this.options.parentView,
                model: note
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