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
                relatedModel: 'Task',
                collectionType: 'TaskCollection'
            },
            {
                type: Backbone.HasMany,
                key: 'notes',
                relatedModel: 'Note',
                collectionType: 'NoteCollection'
            }
        ]
    });
})();