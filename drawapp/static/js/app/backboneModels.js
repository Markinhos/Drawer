(function() {

    window.Task = Backbone.RelationalModel.extend({
    });

    window.TaskList = Backbone.Collection.extend({
        urlRoot: '/api/v1/project/4fc3c6151d41c866b3000000/',
        model: Task,
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
                type: 'HasMany',
                key: 'task_list',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Task'
            }
        ]
    });

    window.ProjectList = Backbone.Collection.extend({
        urlRoot: APP_GLOBAL.PROJECT_API,
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