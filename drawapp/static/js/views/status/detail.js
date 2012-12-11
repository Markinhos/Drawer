(function () {
    window.StatusDetailView = Backbone.View.extend({
        events: {
            'click .icon-comment': 'toggleComments',
            'click .icon-tasks': 'createTask',
            'click .preview': 'showVideo'
        },    
        initialize: function(){
            _.bindAll();
            this.model.bind('change', this.render, this);
        },
    	toggleComments: function(e){
            e.preventDefault();
    		$("#status-comments-list-" + this.model.get('id')).slideToggle();
    	},
        isLink: function(link){
            var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
            return re.test(link);
        },
        createTask: function(e){
            var title = this.model.get('text');
            if (title) {
                var task = new Task({
                    title: title,
                    status : 'TODO',
                    creator: '/api/v1/user/' + APP_GLOBAL.USER + '/'
                });
                var that = this;

                debugger;
                var result = this.model.get('project').get('tasks').create(task,{ wait : true ,
                    success : function(model) {
                        debugger;
                        that.model.set();
                        that.model.save({'task': task.id},{
                            success : function(model){
                                debugger;
                                that.options.parentView.options.parentView.renderTask(task);
                            }
                        });                        
                    },
                    error : function(model, response){
                        that.errorView = new Flash();
                        that.errorView.render("Sorry, there has been an error. :(", "error");
                    }
                });
            }
        },
        showVideo: function(e){
            e.preventDefault();
            if (this.model.get('dataResponse') && this.model.get('dataResponse').type === "video"){
                data = this.model.toJSON();
                //var parsedHtml = $(this.dataResponse.html).removeAttr("width").removeAttr("height");
                //this.dataResponse.html = parsedHtml;
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
            data = this.model.toJSON();
            $.extend(data, this.model.get('dataResponse'));
            if(this.model.get('dataResponse').type === "rich"){                
                $(this.el).html(ich.statusDetailLinkRichTemplate(data));
            }            
            else{
                $(this.el).html(ich.statusDetailLinkTemplate(data));
            }
            this.renderComments();
        },        
        renderComments: function(){
            this.commentListView = new CommentListView({
                el : this.$(".status-comments-list"),
                collection: this.model.get('comments')
            });
            this.commentAddView = new CommentAddView({
                model: this.model
            });
            this.commentListView.render();
            $(".status-comments-list", this.el).append(this.commentAddView.render().el);            
        },
        render: function(){
            if(this.isLink(this.model.get('text'))) {
                if(!this.model.get('dataResponse')){                    
                    var that = this;
                    var widthVideo = $(window).width()/2.5;
                    $(this.el).html('<div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div>');
                    $.embedly(this.model.get('text'), { key : "a3fa84e00cb84b0386bde0b7055c8bb4" , 
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
                $(this.el).html(ich.statusDetailTemplate(this.model.toJSON()));
                this.renderComments();
            }
            return this;
        },
        deleteStatus: function(){
            this.options.parentView.deleteOne(this.model.cid);
        }

    });
})();
