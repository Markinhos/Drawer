(function () {
    window.UserProfile = Backbone.Model.extend({
    	urlRoot: APP_GLOBAL.USER_PROFILE_API,
    	url: function(){
            return APP_GLOBAL.USER_PROFILE_API;
        }
    });
})();