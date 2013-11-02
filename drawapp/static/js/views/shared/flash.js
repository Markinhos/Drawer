(function () {
    window.Flash = Backbone.View.extend({
        render: function(text, type) {
        	var data = { message: text};
        	if (type == "error"){
        		data.type = "alert-error";
            	$(this.el).html(ich.flash(data));
            }
            else if (type == "success"){
            	data.type = "alert-success";
            	$(this.el).html(ich.flash(data));                
            }
            else {
                $(this.el).html(ich.flash(data));   
            }
            $("#flash").fadeIn("fast");
            $(function() {
                setTimeout(function() {
                    $("#flash").fadeOut("slow");
                }, 5000);
            });
            return this;
        }
    });
})();