(function () {
    window.StatusDetailView = Backbone.View.extend({
        events: {
            'click .icon-comment': 'toggleComments',
            'click .icon-tasks': 'createTask',
            'click .icon-file': 'createNote',
            'click .preview': 'showVideo',
            'hover .media': 'showContext'
        },    
        initialize: function(){
            _.bindAll(this);
            this.model.bind('change:dropbox_link', this.showContext, this);
            this.status = this.model;
        },
    	toggleComments: function(e){
            e.preventDefault();
    		$("#status-comments-list-" + this.model.get('id')).slideToggle();
    	},
        showContext: function(e){
            /*e.preventDefault();
            e.stopPropagation();*/
            $(".tool-context").each(function(index){
                $(this).addClass("context-hidden");
            });
            if(this.$el.find(".tool-context").hasClass("context-hidden")){
                this.$el.find(".tool-context").removeClass("context-hidden");
            }            
            /*if(!this.statusContextView){
                this.statusContextView = new StatusContextView({
                    model: this.model,
                    el: this.$('.tool-list')
                });
            }*/            

            //this.statusContextView.render();
        },
        createTask: function(e){
            e.preventDefault();
            e.stopPropagation();            
            var title = this.model.get('text');
            if (title) {
                var task = new Task({
                    title: title,
                    status : 'TODO',
                    creator: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                });
                var that = this;

                var result = this.status.get('project').get('tasks').create(task,{
                    success : function(model) {
                        that.status.get('tasks').add(task);
                        that.status.save();                        
                    },
                    error : function(model, response){
                        that.errorView = new Flash();
                        that.errorView.render("Sorry, there has been an error. :(", "error");
                    }
                });
            }
            if(!this.statusContextView || this.statusContextView.$el.children().first().length == 0){
                this.showContext();
            } 
        },
        createNote: function(e){
            e.preventDefault();
            e.stopPropagation();
            var title = this.model.get('dataResponse').title;
            var description = this.model.get('dataResponse').description;
            if (title) {                                    
                var note = new Note({
                    title: title,
                    content: '<en-note>' + description + '</en-note>'
                });
                var that = this;

                var result = this.status.get('project').get('notes').create(note,{
                    success : function(model) {
                        that.status.get('notes').add(note);
                        that.status.save();                        
                    },
                    error : function(model, response){
                        that.errorView = new Flash();
                        that.errorView.render("Sorry, there has been an error. :(", "error");
                    }
                });
            }
            if(!this.statusContextView || this.statusContextView.$el.children().first().length == 0){
                this.showContext();
            }            
        },
        showVideo: function(e){
            e.preventDefault();
            if (this.model.get('dataResponse') && this.model.get('dataResponse').type === "video"){
                var data = this.model.toJSON();
                $.extend(data, this.model.get('dataResponse'));
                $(this.el).find(".link-content").replaceWith(ich.statusDetailLinkVideoTemplate(data));
            }
            else if(this.model.get('dataResponse') && this.model.get('dataResponse').type === "link"){
                window.open(this.model.get('dataResponse').url);
            }
        },
        renderLink: function(res, dict){
            //this.dataResponse = res;
            this.model.set('dataResponse', res);
            var data = this.model.toJSON();
            data.parsed_text = this.replaceURLWithHTMLLinks(this.model.get('text'))
            $.extend(data, this.model.get('dataResponse'));
            if(this.model.get('dataResponse').type === "rich"){                
                $(this.el).html(ich.statusDetailLinkRichTemplate(data));
            }   
            else if(this.model.get('dataResponse').type === "photo"){
                $(this.el).html(ich.statusDetailLinkPhotoTemplate(data));
                $(this.el).find(".embed>a").attr('title', this.model.get('text'));
                $(this.el).find(".embed>a").fancybox({
                    openEffect  : 'elastic',
                    closeEffect : 'elastic',

                    helpers : {
                        title : {
                            type : 'inside'
                        }
                    }
                });
            }
            else{
                $(this.el).html(ich.statusDetailLinkTemplate(data));
            }
            this.renderComments();

            this.statusContextView = new StatusContextView({
                model: this.model,
                el: this.$('.tool-list')
            });
            this.statusContextView.render();
        },        
        renderComments: function(){
            this.commentListView = new CommentListView({
                el : this.$(".status-comments-list"),
                collection: this.model.get('comments'),
                statusView: this
            });
            this.commentAddView = new CommentAddView({
                el : this.$(".status-comment-input"),
                model: this.model
            });
            this.commentListView.render();
            this.commentAddView.render();
            //$(".status-comment-input", this.el).hide().append(this.commentAddView.render().el).fadeIn('slow');
        },
        render: function(){
            
            if(this.hasLink(this.model.get('text'))) {
                if(!this.model.get('dataResponse')){                    
                    var that = this;
                    var widthVideo = $(window).width()/2.5;
                    $(this.el).html('<div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div>');
                    $.embedly(this.getLink(this.model.get('text')), { key : "a3fa84e00cb84b0386bde0b7055c8bb4" , 
                        success: function(oembed, dict) { 
                            console.log("Link fetched");
                            that.renderLink(oembed, dict);                            
                        }
                    });
                }
                else{
                    this.renderLink(this.model.get('dataResponse'), {});
                }                
            }
            else
            {                
                $(this.el).html(ich.statusDetailTemplate(this.model.toJSON())).fadeIn('slow');
                this.renderComments();

                this.statusContextView = new StatusContextView({
                    model: this.model,
                    el: this.$('.tool-list')
                });
                this.statusContextView.render();
            }
                        
            return this;
        },
        isLink: function(link){
            var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
            return re.test(link);
        },
        hasLink: function(text){
            if (this.getLink(text)) {
                return true;
            }
            else{
                return false;
            }
        },
        getLink: function(text){
            words = text.split(" ");
            for(x in words){
                if(this.isLink(words[x])){
                    return words[x];
                }
            }
        },
        replaceURLWithHTMLLinks: function(text) {
            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return text.replace(exp,'<a target="_blank" href="$1">$1</a>'); 
        },
        deleteStatus: function(){
            this.options.parentView.deleteOne(this.model.cid);
        }

    });
})();
