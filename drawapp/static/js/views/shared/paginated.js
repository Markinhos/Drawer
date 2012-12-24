PaginatedView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'previous', 'next', 'render');
    this.collection.bind('reset', this.render);
  },
  events: {
    'click .prev': 'previous',
    'click .next': 'next',
    'click .page': 'goToPage'
  },
  render: function() {
    var data = this.collection.pageInfo();
    data.totalPages = _.range(1, data.pages + 1);
    if(!data.next){
      data.hasNext = 'disabled'
    }
    if(!data.prev){
      data.hasPrevious = 'disabled'
    }
    this.$el.html(ich.paginated(data));
    var currentPage = (data.offset / data.limit) +1;
    this.$el.find("li.page.active").removeClass("active");
    this.$el.find('li.page' + currentPage).addClass("active");
  },
 
  previous: function() {
    this.collection.previousPage();
    return false;
  },
 
  next: function() {
    this.collection.nextPage();
    return false;
  },
  goToPage: function(e){
    var elem = e.target;
    page = $(elem).parent().attr('page-num');
    this.collection.fetchPage(page);
    return false;
  }
});