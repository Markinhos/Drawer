(function () {
    window.ProjectOverviewView = Backbone.View.extend({
        initialize: function(arguments){
            _.bindAll(this);

            this.model.get('statuses').bind('reset', this.render, this);
            this.model.get('notes').bind('reset', this.render, this);

            this.model.get('statuses').maybeFetch();
            this.model.get('notes').maybeFetch({});

        },
        render: function(){
            $(this.el).html(ich.projectOverviewTemplate(this.model.toJSON()));
            var self = this;
            var views = [];
            _.each(this.model.get('statuses').models, function(element, index, list){                
                var view = new StatusDetailOverviewView({
                    parentView: self,
                    model: element
                });
                views.push(view);
            });

            _.each(this.model.get('notes').models, function(element, index, list){                
                var view = new NoteDetailOverviewView({
                    parentView: self,
                    model: element
                });
                views.push(view);
            });

            _.each(this.model.get('files').models, function(element, index, list){
                if (element.get('thumb_exists')){
                    var view = new FileDetailOverviewView({
                        parentView: self,
                        model: element
                    });
                    views.push(view);
                }                   
            });

            /*_.each(this.model.get('tasks').models, function(element, index, list){
                var view = new TaskDetailOverviewView({
                    parentView: self,
                    model: element
                });
                views.push(view);
            });*/
            
            var sorted = _.sortBy(views, function(e) { return -e.model.get('modified'); });
            _.each(sorted, function(element, index, list){
                $(self.el).find('.overview-list').append(element.render().el);
            });         

            var $tumblelog = $('#tumblelog');

            $tumblelog.imagesLoaded( function(){
              $tumblelog.masonry({
                isAnimated: true,
                columnWidth: 240
              });
            });

            $(".fancybox").fancybox();
            return this;
        }
    });
})();