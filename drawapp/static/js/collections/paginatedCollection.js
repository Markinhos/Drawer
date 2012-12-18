// includes bindings for fetching/fetched
(function() {
  window.PaginatedCollection = Backbone.Collection.extend({
    initialize: function() {
      _.bindAll(this, 'parse', 'url', 'pageInfo', 'nextPage', 'previousPage', 'filtrate', 'sort_by');
      typeof(options) != 'undefined' || (options = {});
      typeof(this.limit) != 'undefined' || (this.limit = 2);
      typeof(this.offset) != 'undefined' || (this.offset = 0);
      typeof(this.filter_options) != 'undefined' || (this.filter_options = {});
      typeof(this.sort_field) != 'undefined' || (this.sort_field = '');
    },
    fetch: function(options) {
      typeof(options) != 'undefined' || (options = {});
      //this.trigger("fetching");
      var self = this;
      var success = options.success;
      options.success = function(resp) {
        //self.trigger("fetched");
        if(success) { success(self, resp); }
      };
      debugger;
      return Backbone.Collection.prototype.fetch.call(this, options);
    },
    parse: function(resp) {
      this.offset = resp.meta.offset;
      this.limit = resp.meta.limit;
      this.total = resp.meta.total_count;
      return resp.objects;
    },
    url: function() {
        debugger;
        urlparams = {offset: this.offset, limit: this.limit};
        urlparams = $.extend(urlparams, this.filter_options);
        if (this.sort_field) {
            urlparams = $.extend(urlparams, {sort_by: this.sort_field});
        }
        return this.baseUrl() + '?' + $.param(urlparams);
    },
    pageInfo: function() {
      var info = {
        total: this.total,
        offset: this.offset,
        limit: this.limit,
        pages: Math.ceil(this.total / this.limit),
        prev: false,
        next: false
      };

      var max = Math.min(this.total, this.offset + this.limit);

      if (this.total == this.pages * this.limit) {
        max = this.total;
      }

      info.range = [(this.offset + 1), max];

      if (this.offset > 0) {
        info.prev = (this.offset - this.limit) || 1;
      }

      if (this.offset + this.limit < info.total) {
        info.next = this.offset + this.limit;
      }

      return info;
    },
    nextPage: function() {
      if (!this.pageInfo().next) {
        return false;
      }
      this.offset = this.offset + this.limit;
      return this.fetch();
    },
    previousPage: function() {
      if (!this.pageInfo().prev) {
        return false;
      }
      this.offset = (this.offset - this.limit) || 0;
      return this.fetch();
    },
    fetchPage: function(page){
      if(this.pageInfo().pages < page || page < 1){
        return false;
      }
      debugger;
      this.offset = (this.limit * (page - 1));
      return this.fetch();
    },
    filtrate: function (options) {
        this.filter_options = options || {};
        this.offset = 0;
        return this.fetch();
    },
    sort_by: function (field) {
        this.sort_field = field;
        this.offset = 0;
        return this.fetch();
    }
  });
})();