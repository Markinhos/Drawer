(function () {
	window.FileDetailOverviewView = Backbone.View.extend({
        render: function(){
            var data = this.model.toJSON();
            if(this.model.get('thumb_exists')) {
                var exp = /(size=(.)*\b)/;
                data.thumb_url = data.thumb_url.replace(exp, 'size=l');
                $(this.el).html(ich.fileDetailOverviewTemplate(data));
            }       
            return this;
        }
    });
})();