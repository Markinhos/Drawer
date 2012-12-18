(function() {
    window.Project = Backbone.RelationalModel.extend({
        urlRoot: APP_GLOBAL.PROJECT_API,
        
        maybeFetch: function(options){
            // Helper function to fetch only if this collection has not been fetched before.
            if(this._fetched){
                // If this has already been fetched, call the success, if it exists
                options.success && options.success();
                return;
            }

            // when the original success function completes mark this collection as fetched
            var self = this;
            var successWrapper = function(success){
                return function(){
                    self._fetched = true;
                    success && success.apply(this, arguments);
                };
            };
            options.success = successWrapper(options.success);
            this.fetch(options);
        },
        relations: [
            {
                type: Backbone.HasMany,
                key: 'tasks',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Task',
                collectionType: 'TaskCollection',
                reverseRelation: {
                    key: 'project',
                    includeInJSON: 'id'
                }
            },
            {
                type: Backbone.HasMany,
                key: 'notes',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Note',
                collectionType: 'NoteCollection',
                reverseRelation: {
                    key: 'project',
                    includeInJSON: 'id'
                }
            },
            {
                type: Backbone.HasMany,
                key: 'files',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'File',
                collectionType: 'FileCollection',
                reverseRelation: {
                    key: 'project',
                    includeInJSON: 'id'
                }
            },
            {
                type: Backbone.HasMany,
                key: 'statuses',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Status',
                collectionType: 'StatusCollection',
                reverseRelation: {
                    key: 'project',
                    includeInJSON: 'id'
                }
            }
        ]
    });
})();