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
                type: Backbone.HasOne,
                key: 'task',
                relatedModel: 'Task'
            }
        ]
    });
})();