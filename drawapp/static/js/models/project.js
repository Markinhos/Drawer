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
            },
            {
                type: Backbone.HasMany,
                key: 'notes',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Note',
                collectionType: 'NoteCollection',
                reverseRelation: {
                    key: 'project'
                }
            },
            {
                type: Backbone.HasMany,
                key: 'files',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'File',
                collectionType: 'FileCollection',
                reverseRelation: {
                    key: 'project'
                }
            },
            {
                type: Backbone.HasMany,
                key: 'statuses',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Status',
                collectionType: 'StatusCollection',
                reverseRelation: {
                    key: 'project'
                }
            }
        ]
    });
})();