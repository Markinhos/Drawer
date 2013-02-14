(function () {
    window.CommentDetailView = StatusDetailView.extend({
        tagName: "li",    
        initialize: function(){
            _.bindAll(this);
            this.model.bind('change', this.render, this);
            this.status = this.model.get('status');
        },
        render: function(){
            if(this.hasLink(this.model.get('text'))) {
                if(!this.model.get('dataResponse') || this.isEmpty(this.model.get('dataResponse'))){                
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
                else if(this.model.get('dataResponse').type === "photo"){
                    $(this.el).html(ich.commentDetailLinkPhotoTemplate(data));
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
                    this.renderLink(this.model.get('dataResponse'), {});
                }                
            }
            else
            {
                $(this.el).html(ich.commentDetailTemplate(this.model.toJSON())).fadeIn('slow');
            }
            return this;
        },
        renderLink: function(res, dict){
            this.model.set('dataResponse', res);
            var data = this.model.toJSON();
            data.parsed_text = this.replaceURLWithHTMLLinks(this.model.get('text'))
            $.extend(data, this.model.get('dataResponse'));
            if(this.model.get('dataResponse').type === "rich"){                
                $(this.el).html(ich.commentDetailLinkRichTemplate(data));
            }            
            else{
                $(this.el).html(ich.commentDetailLinkTemplate(data));
            }
        },
        showContext: function(e){
            $(".tool-context").each(function(index){
                $(this).addClass("context-hidden");
            });
            if(this.$el.find(".tool-context").hasClass("context-hidden")){
                this.$el.find(".tool-context").removeClass("context-hidden");
            }  
        }
    });
})();
