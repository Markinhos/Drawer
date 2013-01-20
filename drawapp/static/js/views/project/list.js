(function () {
    window.ListProjectView = Backbone.View.extend({
        el: "#projects",
        initialize: function () {
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('add', this.addOne);
            this.collection.bind('reset', this.addAll, this);
            this.views = [];

            var self = this;
            this.collection.on('destroy', function(project){
                self.deleteOne(project);
            });
        },
       
        addAll: function () {
            this.views = [];
            this.collection.each(this.addOne);            
        },

        addOne: function (thisModel) {
            var view = new ProjectView({
                id: thisModel.id,
                model: thisModel,
                parentView: this,
                className: (this.options.active && this.options.active === thisModel.get('id')) ? 'active' : ''
            });
            $(this.el).children().first().after(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        rethrow: function () {
            this.trigger.apply(this, arguments);
        },

        deleteOne: function(project){            
            var v = this.views.filter(function(view) { return view.model == project })[0];
            v.remove();
            this.views.pop(v);
        }


    });
})();