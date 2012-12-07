(function () {
	window.NoteDetailView = Backbone.View.extend({
		tagName: "li",
		className: "",
		events: {
            'click #delete-note': 'deleteNote',
            'click .caption'    : 'showModal',
            'click .tabbed-note' : 'showEditor'
        },
        deleteNote: function(){
        	this.options.parentView.deleteOne(this.model.cid);
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
            $(this.el).html(ich.noteDetailTemplate(this.model.toJSON()));
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