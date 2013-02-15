(function() {
    window.PollingCollection = Backbone.Collection.extend({
        longPolling : false,
        intervalSeconds : 120,
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
            try{
                this.fetch({ update:true,
                    success : function(collection, response, options) {
                        that.update(that.models);
                        that.onFetch();
                    }
                });
            }
            catch(e) {
                console.log(e);
            }
        },
        onFetch : function () {
            if( this.longPolling ){
                setTimeout(this.executeLongPolling, 1000 * this.intervalSeconds); // in order to update the view each N seconds
            }
        }
    });
})();