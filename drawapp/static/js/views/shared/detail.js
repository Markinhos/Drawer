(function () {
	window.DetailApp = Backbone.View.extend({        

        events: {
            'click .home': 'home'
        },

        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        initialize: function(arguments){            
            this.el = arguments.el;
            this.model = arguments.project;
        },

        render: function(){
            this.projectDetailView = new ProjectDetailView({
                model: this.model,
                el: this.el
            });
            this.projectDetailView.render();            
            return this;
        }
    });
})();	