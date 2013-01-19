LoadMoreView = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this);
    this.collection.bind('reset', this.render);
  },
  events: {
    'click .load': 'loadMore'
  },
  render: function() {
    if(this.collection.pageInfo().next)
      this.$el.html(ich.loadMore());
    else
      this.$el.find(".load").addClass("disabled");
  },
 
  loadMore: function(){
    if(!this.collection.pageInfo().next){
      this.render();
    }
    else{
      this.collection.loadMore();
    }    
  },
});