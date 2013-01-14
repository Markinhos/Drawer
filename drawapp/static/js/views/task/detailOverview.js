(function () {
    window.TaskDetailOverviewView = Backbone.View.extend({
        initialize: function(){
            this.template = ich.taskDetailOverviewTemplate;
        },
        render: function(){
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        }
    });
})();
