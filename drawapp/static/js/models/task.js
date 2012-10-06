(function () {
    window.Task = Backbone.RelationalModel.extend({
    	relations: [            
            {
                type: Backbone.HasMany,
                key: 'comments',
                relatedModel: 'Comment',
                collectionType: 'CommentCollection'
            }
        ]
    });
})();