(function () {
    window.Status = Backbone.RelationalModel.extend({
    	relations: [
            {
                type: Backbone.HasMany,
                key: 'comments',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Comment',
                collectionType: 'CommentCollection'
            },
            {
                type: Backbone.HasMany,
                key: 'tasks',
                keySource: 'tasks_ids',
                keyDestination: 'tasks_ids',
                includeInJSON: Backbone.Model.prototype.idAttribute,
                relatedModel: 'Task',
                collectionType: 'TaskCollection'
            },
            {
                type: Backbone.HasMany,
                key: 'notes',
                relatedModel: 'Note',
                collectionType: 'NoteCollection',
                keySource: 'notes_ids',
                keyDestination: 'notes_ids',
                includeInJSON: Backbone.Model.prototype.idAttribute
            }
        ]
    });
})();