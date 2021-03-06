(function () {
    window.StatusDetailOverviewView = StatusDetailView.extend({
        events: {
        },    
        initialize: function(){
            _.bindAll(this);
            this.status = this.model;
        },
        renderLink: function(res, dict){
            this.model.set('dataResponse', res);
            var data = this.model.toJSON();
            data.parsed_text = this.replaceURLWithHTMLLinks(this.model.get('text'))
            $.extend(data, this.model.get('dataResponse'));
            if(this.model.get('dataResponse').type === "rich"){                
                $(this.el).html(ich.statusDetailLinkRichOverviewTemplate(data));
            }   
            else if(this.model.get('dataResponse').type === "photo"){
                $(this.el).html(ich.statusDetailLinkPhotoOverviewTemplate(data));
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
            else if(this.model.get('dataResponse').type === "video"){
                $(this.el).html(ich.statusDetailLinkVideoOverviewTemplate(data));
            }
            else{
                $(this.el).html(ich.statusDetailLinkOverviewTemplate(data));
            }
        },
        render: function(){
            
            if(this.hasLink(this.model.get('text'))) {
                if(!this.model.get('dataResponse') || $.isEmptyObject(this.model.get("dataResponse"))) {                    
                    var that = this;
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
                $(this.el).html(ich.statusDetailOverviewTemplate(this.model.toJSON())).fadeIn('slow');                
            }
                        
            return this;
        }

    });
})();
