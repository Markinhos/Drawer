(function () {
    window.UserProfile = Backbone.RelationalModel.extend({
    	urlRoot: APP_GLOBAL.USER_PROFILE_API,
    	url: function(){
            return APP_GLOBAL.USER_PROFILE_API;
        },
        relations: [
            {
                type: Backbone.HasMany,
                key: 'invitations',
                url: this.urlRoot + '/' + this.idAttribute + '/',
                relatedModel: 'Invitation',
                collectionType: 'InvitationCollection',
                reverseRelation: {
                    key: 'userProfile'
                }
            }
        ]
    });
})();