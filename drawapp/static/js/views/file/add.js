(function () {
    window.FileAddView = Backbone.View.extend({
        render: function () {
            var data = { 'csfr_input' : APP_GLOBAL.CSFR_TOKEN}
            data.project_id = this.model.get('id');
            $(this.el).html(ich.fileAddTemplate(data));
        }
    });
})();