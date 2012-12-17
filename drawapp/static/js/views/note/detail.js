(function () {
	window.NoteDetailView = Backbone.View.extend({
		tagName: "li",
		className: "",
		events: {
            'click #delete-note': 'deleteNote',
            'click .caption'    : 'showModal',
            'click .tabbed-note' : 'showEditor'
        },
        initialize: function(arguments){
            this.model.bind('change', this.render, this);
        },
        deleteNote: function(){
            if(confirm("Are you sure do you want to delete the note?")){
                this.model.destroy();
            }
        },
        showModal: function(){
            this.noteModalView = new NoteModalView({
                el: $(".noteModalContainer"),
                model : this.model
            });
            this.noteModalView.render();
            return this;
        },
        render: function(){
            var data = this.model.toJSON();
            data.snipett = data.content.replace(/<(?:.|\n)*?>/gm, '');
            $(this.el).html(ich.noteDetailTemplate(data));
            var images = this.$el.find("img");
            var self = this;
            images.each( function(index) { 
                $(this)
                    .load()
                    .error(function() {
                        $(self.$el.find(".evernote-thumbnail")).remove();
                        $(self.$el.find(".note-snipett")).removeClass("span10").addClass("span12")
                    })
            });
            return this;
        },
        showEditor: function(e){
            $(this.options.parentView.el).find("li.active").removeClass("active")
            $(this.el).addClass("active");
            if(this.options.parentView.noteEditView){                
                this.options.parentView.noteEditView.model = this.model;
                this.options.parentView.noteEditView.delegateEvents();
            }
            else{
                this.options.parentView.noteEditView = new NoteEditView({
                    model: this.model,
                    el: $(".editor-side"),
                    parentView: this.options.parentView
                });
            }                      
            this.options.parentView.noteEditView.render();
        }
    });
})();