(function() {
    window.Project = Backbone.RelationalModel.extend({
        urlRoot: APP_GLOBAL.PROJECT_API,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'tasks',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Task',
                collectionType: 'TaskCollection',
                reverseRelation: {
                    key: 'project'
                }
            }
        ]
    });
})();