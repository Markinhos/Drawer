(function() {

    window.Task = Backbone.RelationalModel.extend({
    });

    window.TaskCollection = Backbone.Collection.extend({
        model: Task,
        urlRoot: APP_GLOBAL.PROJECT_API,
        url: function(){
            return this.project.id + 'tasks/';
        },
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

        getOrFetch: function(id, options){
            // Helper function to use this collection as a cache for models on the server
            var model = this.get(id);

            if(model){
                options.success && options.success(model);
                return;
            }

            model = new Task({
                resource_uri: id
            });

            model.fetch(options);
        }
    });
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

    window.ProjectList = Backbone.Collection.extend({
        url: APP_GLOBAL.PROJECT_API,
        model: Project,
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

        getOrFetch: function(id, options){
            // Helper function to use this collection as a cache for models on the server
            var model = this.get(id);

            if(model){
                options.success && options.success(model);
                return;
            }

            model = new Task({
                resource_uri: id
            });

            model.fetch(options);
        }
    });
    
})();