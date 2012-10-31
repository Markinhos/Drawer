(function () {
    window.ProjectView = Backbone.View.extend({
        events: {
            'click .project-tool' : 'showPopup',
            'click .projectDetail': 'project_detail'            
        },
        tagName: 'li',
        render: function(){
            $(this.el).html(ich.projectTemplate(this.model.toJSON()));
            return this;
        },
        project_detail: function(){
            app.router.navigate('project/' + this.model.get('id') + '/', {trigger: true});
        },

        showPopup: function(e){
            e.stopPropagation();
            this.options.parentView.deleteOne(this.model.cid);
        }
    });
})();