(function () {
    window.ProjectView = Backbone.View.extend({
        events: {
            'click .project-tool' : 'deleteProject',
            'click .project-detail': 'projectDetail'            
        },
        tagName: 'li',
        render: function(){
            $(this.el).html(ich.projectTemplate(this.model.toJSON()));
            return this;
        },
        projectDetail: function(){
            app.router.navigate('project/' + this.model.get('id') + '/', {trigger: true});
        },

        deleteProject: function(e){
            e.stopPropagation();
            if(confirm("Are you sure you want to delete this project?")){            
                this.options.parentView.deleteOne(this.model.cid);
            }
        }
    });
})();