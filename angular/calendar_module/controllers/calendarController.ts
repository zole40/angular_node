module Calendar {
    export class calendarCtrl {
        
        uiConfig: Object;
        alertEventOnClick: Object;
        alertOnResize: Object;
		projects: ProjectList;
        user : User; 
		adminMenu: boolean;
		changeColor: () => void;        
        getTasks: (_id : string) => void;
        getFreeTasks: (_id : string) => void;
		getFinishedTask: (_id : string) => void;
        updateTask: () => void;
		updateProject: () => void;
		selectTask: (task : Event) => void;
        alertOnDrop: (event: Event,delta,revertFunc) => void;
		eventClick: (event : Event) => void;
		/**remove user from task */
		removeUser: () => void;
		addUser: () => void;
		renderCalendar: () => void;
		taskUser: () => boolean;
		finishTask: () => void;
		getProject: () => void;
		changeProject: () => void;
		updateUser: () => void;
		taskList : taskList;
		getEvents: () => void;
		allUser: Array<User>
		selectProject: (newProject : boolean) => void;
		getAllUser: () => void;
		deleteProject: () => void;
		userName: string;
		//static $inject = ['$scope','$http','uiCalendarConfig','pageService']
		constructor(private $scope: ng.IScope,
                    private $http: ng.IHttpService,
                    private uiCalendarConfig: any,
                    private pageService : pageService
                    )
       {
		   this.getAllUser = () => 
		   		this.$http({
					   method : "GET",
					   url : "/user/getAll",
					 	params : {id : this.projects.id}   
				   }).success((data : any) => 
						this.allUser = data.users);
						
		   this.finishTask = () => 
		   		this.taskList.finish(this.projects.id)
				   .success( () => 
				   {
				   		this.renderCalendar();
				   })
		   this.getEvents = () =>
		   {
			   	this.getTasks(  this.projects.id);
               	this.getFreeTasks(  this.projects.id);
				this.getFinishedTask(this.projects.id);
				this.projects.change(this.user.name);
				
				this.uiConfig["calendar"].editable = this.projects.owner;
		   }
		   this.deleteProject = () => this.projects.delete()
		   .success((data : any ,status : number) =>
		   {
			   	let element = <any> angular.element("#project");
				element.modal("hide");
			   	this.getEvents();
		   })
		   	this.updateProject = () => 
		   		this.projects.update()
				   .success((data : any , status : number) =>
				   {
					   	if(status === 201) {
							   this.getEvents();
					   	}
					   	let element = <any> angular.element("#project");
						element.modal("hide");
				   })
				   	.error((data : any, status : number) => 
					{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
                	})
		   
		   this.selectProject = (newProject : boolean) =>
		  		this.projects.select(newProject);
		   this.taskList = new taskList(this.$http,new Array<Event>(),new Array<Event>(),new Array<Event>(),new Event(this.$http));
		   this.changeProject = () => 
		   {
			   this.projects.change(this.user.name);
			   this.getProject();
		   }
		   this.projects = new ProjectList(this.$http,[],0,"0");
		   this.adminMenu = false;
		   this.pageService.user.setHttp(this.$http);
		   this.user = this.pageService.user;
		   
		   this.updateUser = () => 
		   	this.pageService.updateUser(this.user).success(function () {
				let element = <any> angular.element("#userModal");
				element.modal("hide");
			})
				.error((data : any, status : number) => 
				{
                   if(status == 401) { 
					   this.pageService.logout()
				   }
                })

		   /**Rerender calendar */
		   this.renderCalendar = () => 
		   {
			    let calendar  = <any> angular.element(document.querySelector("#calendar"));
                calendar.fullCalendar('removeEvents');
				calendar.fullCalendar('addEventSource',this.taskList.eventSources);
		   }		   			
			/**Update or create task */
			this.updateTask = () =>
				this.taskList.updateTask(this.projects.id)
					.success(() => 
					{
						let element = <any> angular.element("#task");
						element.modal("hide");
						this.taskList.getTasks(this.projects.id)
							.success(() => 
								this.renderCalendar())	
					})
					.error((data : any, status : number) => 
					{
                   		if(status == 401){
						    this.pageService.logout()
						}
                	});
		   
		   /**Event click */
		   this.eventClick = (event : Event) => 
		   {
		   		let element = <any> angular.element("#task");
				let task = new Event(this.$http);
				task.set(event);
				this.taskList.selectTask(task);
				element.modal("show");
			}
			
			/**Change event date */
		   	this.alertOnDrop = (event : Event,delta : any,revertFunc : any) => 
			{
				let task = new Event(this.$http);
				task.set(event);
				this.selectTask(task);
				this.updateTask();
		   	};
		   
		   /**init ui config */
           this.uiConfig = {
                calendar: {
                    height: 450,
                    editable: this.projects.owner,
                    header: {
                        left: 'month basicWeek basicDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
					eventSources : this.taskList.eventSources,
                    dayClick: this.alertEventOnClick,
                    eventDrop: this.alertOnDrop,
                    eventClick: this.eventClick
                }
            };
             
            /**change user color attribute */
            this.changeColor = () => 
				this.pageService.changeUserColor(this.user)
					.success(() => 
					{
						this.taskList.eventSources.forEach( (element : Event) =>
						{
							if(element.user == this.user.name){
								element.color = this.user.color;
								this.renderCalendar();
							}
						});
					})
					.error((data : any, status : number) => 
					{
                		if(status == 401) {
							 this.pageService.logout();
						}
            		}); 
			         
			/**Get avaible task */
            this.getFreeTasks = (_id : string) => 
			{ 
				this.taskList.getFreeTasks(_id)
					.error((data : any, status : number) => {
             	    	  	if(status == 401) {
								   this.pageService.logout()
					   		}    
					})
            };
                
			/**Get task */   
            this.getTasks = (_id : string) => 
				this.taskList.getTasks(_id)
					.success( () => 
					{
						this.renderCalendar()
					})
					.error((data : any, status : number) => 
					{
                  		 if(status == 401) {
							    this.pageService.logout()
						   }	
					});
					
						/**Get task */   
            this.getFinishedTask = (_id : string) => 
				this.taskList.getFinished(_id)
					.error((data : any, status : number) => 
					{
                  		 if(status == 401) {
							    this.pageService.logout()
						   }	
					});
            
            
         
            /**Get projects*/
            this.getProject = () => 
				this.projects.get()
                	.success((data: any,status : number) => 
					{
                    	this.getEvents();
					}
                ).error((data : any, status : number) => 
				{
                   if(status == 401) {
					    this.pageService.logout()
				   }
                });
			
			/**Select task */
			this.selectTask = (task : Event) => 
				this.taskList.selectTask(task)
			
			this.removeUser = () => 
				this.taskList.removeUser(this.projects.id)
					.success(() => this.renderCalendar())
					.error((data : any, status : number) => {
                   		if(status == 401){
				 			this.pageService.logout()
					  	 }
                	});
			
			this.addUser = () => 
				this.taskList.addUser(this.projects.id,this.user)
					.success(() => this.renderCalendar())
					.error((data : any, status : number) => {
                    	if(status == 401){
						 this.pageService.logout()
						}   
			 		});
					 
			this.taskUser = () => 
				this.taskList.taskUser(this.user.name);

            this.getProject(); 
        }
    }
}; 