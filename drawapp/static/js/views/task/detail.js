(function () {
    window.TaskDetailView = Backbone.View.extend({
        events: {
            'click .delete-task': 'deleteTask',
            'click .task-status' : 'selectStatus',
            'click .task-description' : 'editDescription',
            'click .task-location' : 'editLocation',
            'click .edit-task' : 'editTask',
            'hover .task-description' : 'hoverTaskDescription',
            'hover .task-location' : 'hoverTaskDescription'
        },
        selectStatus: function(e){
            e.stopPropagation();
            var status;
            status = this.model.get('status') === "TODO" ? "DONE" : "TODO"
            this.model.set('status', status)
            this.model.save();
            if(this.options.parentView.moveToDoneOne){
                this.options.parentView.moveToDoneOne(this.model.cid);
            }
            else{
                var taskGroup = $(this.el).find(".task-group");
                if (taskGroup.hasClass("checked")){
                    taskGroup.removeClass("checked");
                }
                else{
                    taskGroup.addClass("checked");
                }
            }         
        },
        render: function(accordionOpen){
            var isDone, doneStatus;
            isTodo = this.model.get('status') === "TODO";
            isTodo ? doneStatus = '' : doneStatus = 'checked';
            data = this.model.toJSON();
            data.doneStatus = doneStatus; 
            if(!isTodo){
                data.opacity = "checked";
            }
            if(accordionOpen) { data.accordionOpen = "in"; }
            if (this.model.get('duedate')){
                var duedate = new Date(this.model.get('duedate'));
                data.duedateDate = duedate.getDay() + '-' + duedate.getMonth() + '-' + duedate.getFullYear();
                data.duedateTime = duedate.getHours() + ':' + duedate.getMinutes();
            }
            if (this.model.get('description')){
                data.descriptionHtml = '<span class="task-description">' + this.model.get('description') + '</span>';
            }
            else {
                data.descriptionHtml = '<textarea class="task-description editable" placeholder="Add a description"></textarea>';   
            }

            if(this.model.get('location')){
                data.locationHtml = '<a class="fancybox-media span1" href="https://maps.google.com/maps?q=' + this.model.get('location') +'"><i class="icon-globe"></i></a><div class="span4 task-location">' + this.model.get('location') + '</div>';
            }
            else {
                data.locationHtml = '<input class="task-location editable" placeholder="Add a location" type="text"></input>';   
            }

            $(this.el).html(ich.taskDetailTemplate(data));            
            $(this.el).find(".bootstrap-datepicker").datepicker({ format: 'dd-mm-yyyy' });
            $(this.el).find(".timepicker-default").timepicker({ showMeridian: false});

            $('.fancybox-media').fancybox({
                openEffect  : 'none',
                closeEffect : 'none',
                type: 'iframe',
                helpers : {
                    media : {}
                }
            });
            return this;
        },
        deleteTask: function(e){
            if(confirm("Are you sure do you want to delete the task?")){
                this.model.destroy();
            }            
        },
        editDescription: function(e)
        {
            var clickedEl = $(e.target);
            if (!clickedEl.hasClass('editable')){
                var description = this.model.get('description');
                if (description) {
                    clickedEl.replaceWith('<textarea class="task-description editable">' + this.model.get('description') + '</textarea>');
                }
                else {
                    clickedEl.replaceWith('<textarea class="task-description editable"></textarea>');
                }  
            }
        },
        editLocation: function(e)
        {
            var clickedEl = $(e.target);
            if (!clickedEl.hasClass('editable')){
                var description = this.model.get('location');
                if (description) {
                    clickedEl.replaceWith('<input class="task-location editable" placeholder="Add a location" type="text" value="' + this.model.get('location') + '"</input>');
                }
                else {
                    clickedEl.replaceWith('<input class="task-location editable" placeholder="Add a location" type="text"></input>');
                }  
            }
        },
        hoverTaskDescription: function(e){
            var clickedEl = $(e.target);
            if (clickedEl.hasClass("bordered")){
                clickedEl.removeClass("bordered");
            }
            else{
                clickedEl.addClass("bordered");
            }            
        },        
        editTask: function(e){
            var parent = $(e.target).parents(".task-group");

            var desc = parent.find('.task-description').val() || parent.find('.task-description').text();
            var loc = parent.find('.task-location').val() || parent.find('.task-location').text();

            this.model.set({ description: desc, location: loc });

            var d;        
            if(parent.find('.task-date').val()){
                var date = parent.find('.task-date').val().match(/(\d+)/g);
                var time = ["0","0"]              
                if(parent.find('.task-time').val()){
                    time = parent.find('.task-time').val().match(/(\d+)/g);
                }
                d = new Date(date[2], date[1] - 1, date[0], time[1], time[0]);
                this.model.set({ duedate: d.toLocaleString()});
            }

            this.model.save();
            this.render(true);           
        }
    });
})();
