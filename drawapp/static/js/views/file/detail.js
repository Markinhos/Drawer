(function () {
	window.FileDetailView = Backbone.View.extend({        
        events: {
            'click .delete-file': 'deleteFile'
        },
		tagName: "tr",
        render: function(){
            var data = this.model.toJSON();
            data.file_name = this.model.get('filename');
            d = new Date(this.model.get('modified'));
            data.localetime = d.toDateString() + ' ' + d.toLocaleTimeString();
            if(this.model.get('thumb_exists')) {
                var exp = /(size=(.)*\b)/;
                //data.thumb_url = data.thumb_url.replace(exp, 'size=xs');
                $(this.el).html(ich.fileDetailThumbnailTemplate(data));
            }
            else if (this.model.get('is_dir')){
                $(this.el).html(ich.fileDetailFolderTemplate(data));
            }
            else if(this.model.get('mime_type') == 'text/plain'){
                $(this.el).html(ich.fileDetailTextTemplate(data));
            }
            else if(this.model.get('mime_type') == 'application/pdf'){
                $(this.el).html(ich.fileDetailPdfTemplate(data));   
            }
            else if(this.model.get('mime_type') == 'video'){
            }
            else{
                $(this.el).html(ich.fileDetailTemplate(data));            
            }            
            return this;
        },
        deleteFile: function(e){
            if(confirm("Are you sure do you want to delete the file?")){
                this.model.destroy();
            }            
        }
    });
})();