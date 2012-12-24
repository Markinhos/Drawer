(function () {
    window.FileAddView = Backbone.View.extend({
    	events: {
    		'click .start' : 'startUpload'
    	},     
        initialize: function(){
            _.bindAll(this);
        },
    	startUpload: function(e){
    		e.preventDefault();
    		e.stopPropagation();
            $.each(this.fileData, function(index, data) { data.submit() });
    	},
        render: function () {
            this.fileData = [];
            var dataModel = { 'csfr_input' : APP_GLOBAL.CSFR_TOKEN}
            dataModel.project_id = this.model.get('id');
            $(this.el).html(ich.fileAddTemplate(dataModel));

            var self = this;
            debugger;
            $('#fileupload').fileupload({
                dataType: 'json',
                done: function(e, data){
                    var selector = self.escapeSelector(data.files[0].name);
                    $("[class="+selector+"]").remove();
                    self.model.get('files').fetch();
                    console.log('ok');
                },
                add: function (e, data) {
                    self.fileData.push(data);
                    $.each(data.files, function (index, file) {
                        self.$el.find(".uploader-presentation").append('<tr class=' + self.escapeSelector(file.name) + '>' + 
                            '<td>'+ file.name + '</td>' + 
                            '<td>'+ file.type + '</td>' +
                            '<td>'+ file.size + '</td>' +
                            '<td><div class="progress progress-success progress-striped active"><div class="bar" style="width:0%;"></div></div></td>' +                     
                            '<td>'+ '<button class="btn btn-primary"><i class="icon-upload icon-white"></i><span>Start</span></button>' + '</td>' +
                            '</tr>');
                    });
                    
                },
                progress: function(e, data){
                    debugger;                    
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    var selector = self.escapeSelector(data.files[0].name);
                    $("[class="+selector+"]").find('.bar').css('width', progress);
                }

            });

            
        },
        escapeSelector: function( str) {
             if( str)
                 return str.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g,'')
             else
                 return str;            
        }
    });
})();