(function () {
	window.FileDetailView = Backbone.View.extend({
		tagName: "tr",
        render: function(){
            data = this.model.toJSON();
            data.file_name = this.model.get('path').substring(1);
            if(this.model.get('thumb_exists')) {
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
        }
    });
})();