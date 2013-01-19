(function () {
    window.FileAddView = Backbone.View.extend({
    	events: {
    		'click .start' : 'startUpload',
            'click .upload-cancel-one': 'cancelOne',
            'click .cancel-all': 'cancelAll',
            'click .upload-canceled': 'cleanUpload',
            'click .upload-button': 'submitOne'
    	},     
        initialize: function(){
            _.bindAll(this);
            this.uploadsActive = {};            
            this.fileData = [];
        },
    	startUpload: function(e){
    		e.preventDefault();
    		e.stopPropagation();            
            var self = this;
            _.each(this.uploadsActive, function(data, value) {                 
                data.submit(); 
            });
    	},
        cancelAll: function(e){
            var that = this;    
            _.each(this.uploadsActive, function(key, value){ 
                if(key.abort){
                    key.abort();
                }
                var ele = $("[class="+value+"]");
                that.cancelTr(ele);
            });
        },
        submitOne: function(e){            
            e.preventDefault();
            e.stopPropagation();            
            var selector = $(e.target).parents('tr').attr('class');            
            this.uploadsActive[selector].submit();
        },
        cancelOne: function(e){
            e.preventDefault();
            e.stopPropagation();
            var selector = $(e.target).parents('tr').attr('class');
            this.uploadsActive[selector].abort();
            var ele = $("[class="+selector+"]");
            this.cancelTr(ele);
        },
        cleanUpload: function(e){
            e.preventDefault();
            e.stopPropagation();
            var selector = $(e.target).parents('tr').attr('class');
            delete this.uploadsActive[selector];
            $("[class="+selector+"]").remove();
        },
        cancelTr: function(ele){
            ele.find('.bar').css('width', 0);
            ele.find('.upload-button').removeClass('btn-warning').removeClass('upload-cancel-one').addClass('btn-danger upload-canceled');
            ele.find('i').replaceWith($('<i/>').addClass("icon-ban-circle icon-white"));
            ele.find('span').replaceWith($('<span/>').text('Canceled'));
        },
        render: function () {
            var dataModel = { 'csfr_input' : APP_GLOBAL.CSFR_TOKEN};
            dataModel.project_id = this.model.get('id');
            $(this.el).html(ich.fileAddTemplate(dataModel));

            var self = this;
            $('#fileupload').fileupload({
                dataType: 'json',
                done: function(e, data){
                    var selector = self.escapeSelector(data.files[0].name);
                    $("[class="+selector+"]").remove();
                    self.model.get('files').fetch();
                    console.log('ok');
                },
                add: function (e, data) {
                    self.uploadsActive[self.escapeSelector(data.files[0].name)] = data;
                    $.each(data.files, function (index, file) {
                        self.$el.find(".uploader-presentation").append('<tr class=' + self.escapeSelector(file.name) + '>' + 
                            '<td>'+ file.name + '</td>' + 
                            '<td>'+ file.type + '</td>' +
                            '<td>'+ file.size + '</td>' +
                            '<td><div class="progress progress-success progress-striped active"><div class="bar" style="width:0%;"></div></div></td>' +                     
                            '<td>'+ '<button class="btn btn-primary upload-button"><i class="icon-upload icon-white"></i><span>Start</span></button>' + '</td>' +
                            '</tr>');
                    });
                    
                },
                progress: function(e, data){   
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    var selector = self.escapeSelector(data.files[0].name);
                    $("[class="+selector+"]").find('.bar').css('width', progress);
                },

                send: function(e, data){
                    var selector = self.escapeSelector(data.files[0].name);
                    var ele = $("[class="+selector+"]").find('.upload-button');
                    ele.removeClass('btn-primary').addClass('btn-warning upload-cancel-one');
                    ele.find('i').replaceWith($('<i/>').addClass("icon-ban-circle icon-white"));
                    ele.find('span').replaceWith($('<span/>').text('Cancel'));                        
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