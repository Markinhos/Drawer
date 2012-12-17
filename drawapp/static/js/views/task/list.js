(function () {
    window.TaskListView = Backbone.View.extend({
        el: '#task-list',
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

        changeEvent: function(){
            alert('sync');
        },

        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function(task){
            var view = new TaskDetailView({
                parentView: this,
                model: task
            });
            if(task.get('status') == "DONE"){
                $(this.el).find("#task-list-recently-done").hide().prepend(view.render().el).fadeIn('slow');
            }
            else{
                $(this.el).find("#task-to-do").hide().prepend(view.render().el).fadeIn('slow');                
            }
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        deleteOne: function(task){
            var v = this.views.filter(function(view) { return view.model == task })[0];
            v.remove();
            this.views.pop(v);
        },

        moveToDoneOne: function(cid){
            var task = this.collection.getByCid(cid);
            var view = this.views.filter(function(view) { return view.model == task })[0];
            $(view).detach();
            if(task.get('status') == "DONE"){
                $(this.el).find("#task-list-recently-done").prepend(view.render().el).fadeIn('slow');
            }
            else{
                $(this.el).find("#task-to-do").prepend(view.render().el).fadeIn('slow');                
            }
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },
        render: function(){
            this.addAll();
        }

    });
})();