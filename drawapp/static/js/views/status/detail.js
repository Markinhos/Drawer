(function () {
    window.StatusDetailView = Backbone.View.extend({
        events: {
            'click .status-meta': 'toggleComments',
            'click .preview': 'showVideo'
        },    
        initialize: function(){
            _.bindAll();
            this.model.bind('change', this.render, this);
        },
    	toggleComments: function(){
    		$("#status-comments-list-" + this.model.get('id')).slideToggle();
    	},
        isLink: function(link){
            var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
            return re.test(link);
        },
        showVideo: function(e){
            debugger;
            e.preventDefault();
            if (this.dataResponse && this.dataResponse.type === "video"){
                data = this.model.toJSON();
                //var parsedHtml = $(this.dataResponse.html).removeAttr("width").removeAttr("height");
                //this.dataResponse.html = parsedHtml;
                $.extend(data, this.dataResponse);
                $(this.el).find(".link-content").replaceWith(ich.statusDetailLinkVideoTemplate(data));
            }
            else if(this.dataResponse && this.dataResponse.type === "link"){
                window.open(this.dataResponse.url);
            }
        },
        renderLink: function(res, dict){
            this.dataResponse = res;
            data = this.model.toJSON();
            $.extend(data, this.dataResponse);
            $(this.el).html(ich.statusDetailLinkTemplate(data));
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
                if(!this.dataResponse){
                    this.dataResponse = {};
                    var that = this;
                    debugger;
                    var widthVideo = $(window).width()/3.5;
                    $.embedly(this.model.get('text'), { key : "a3fa84e00cb84b0386bde0b7055c8bb4" , maxWidth: parseInt(widthVideo), maxHeight: 200,
                        success: function(oembed, dict) { 
                            console.log("Link fetched");
                            that.renderLink(oembed, dict);                            
                        }
                    });
                }
                else{
                    this.renderLink(this.dataResponse, {});
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
