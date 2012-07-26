(function () {
    window.Flash = Backbone.View.extend({
        el: "#errors",
        render: function(errorText) {
            $(this.el).html(ich.flash(errorText));
        }
    });
})();