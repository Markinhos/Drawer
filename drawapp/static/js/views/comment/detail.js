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
                $(this.el).html(ich.commentDetailTemplate(this.model.toJSON())).fadeIn('slow');
            }
            return this;
        },
        renderLink: function(res, dict){
            this.model.set('dataResponse', res);
            data = this.model.toJSON();
            data.parsed_text = this.replaceURLWithHTMLLinks(this.model.get('text'))
            $.extend(data, this.model.get('dataResponse'));
            if(this.model.get('dataResponse').type === "rich"){                
                $(this.el).html(ich.statusDetailLinkRichTemplate(data));
            }            
            else{
                $(this.el).html(ich.commentDetailLinkTemplate(data));
            }
        },
        showContext: function(e){
            $(".tool-context:first-child").each(function(index){
                $(this).remove().fadeOut("slow");
            });
            if(!this.options.statusView.statusContextView){
                this.options.statusView.statusContextView = new StatusContextView({
                    model: this.model.get('status'),
                    el: this.options.statusView.$('.tool-list')
                });
            }            

            this.options.statusView.statusContextView.render();
        }
    });
})();
