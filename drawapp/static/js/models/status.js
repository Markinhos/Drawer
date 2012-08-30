(function () {
    window.Status = Backbone.RelationalModel.extend({
        defaults: {
            "comments": []
        },
    	relations: [            
            {
                type: Backbone.HasMany,
                key: 'comments',
                relatedModel: 'Comment',
                collectionType: 'CommentCollection',
                includeInJSON: true,
                reverseRelation: {
                    key: 'status'
                }
            }
        ]
    });
})();