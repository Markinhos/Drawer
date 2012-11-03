(function () {
    window.ProjectView = Backbone.View.extend({
        events: {
            'click .project-tool' : 'deleteProject',
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

        deleteProject: function(e){
            e.stopPropagation();
            if(confirm("Are you sure you want to delete this project?")){            
                this.options.parentView.deleteOne(this.model.cid);
            }
        }
    });
})();