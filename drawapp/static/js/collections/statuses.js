(function() {
    window.StatusCollection = PaginatedCollection.extend({
        model: Status,
        longPolling : false,
        invervalSeconds : 120,
        order_field: '-created',
        limit: 10,
        urlRoot: APP_GLOBAL.PROJECT_API,
        baseUrl: function(){
            return this.project.id + 'statuses/';
        },
        initialize : function(){
            _.bindAll(this);            
            this.baseInitialize();
        },
        maybeFetch: function(options){
            // Helper function to fetch only if this collection has not been fetched before.
            typeof(options) != 'undefined' || (options = {});
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

            model = new Status({
                resource_uri: id
            });

            model.fetch(options);
        },        
        startLongPolling : function(invervalSeconds){
            this.longPolling = true;
            if( invervalSeconds ){
                this.invervalSeconds = invervalSeconds;
            }
            this.executeLongPolling();
        },
        stopLongPolling : function(){
            this.longPolling = false;
        },
        executeLongPolling : function(){
            var that = this;
            this.fetch({
                success : function(collection, response, options) {
                    that.onFetch();
                }
            });
        },
        onFetch : function () {
            if( this.longPolling ){
                setTimeout(this.executeLongPolling, 1000 * this.invervalSeconds); // in order to update the view each N seconds
            }
        },
        parse: function(resp) {
            this.offset = resp.meta.offset;
            this.limit = resp.meta.limit;
            this.total = resp.meta.total_count;
            return resp.objects;
        }
    });
})();