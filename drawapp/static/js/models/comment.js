(function () {
    window.Comment = Backbone.RelationalModel.extend({
    	idAttribute : "_id",
        toJSON: function(){
            json = _.clone(this.attributes);
            delete json.status;
            delete json.dataResponse;
            return json;

        }
    });
})();