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
        updateTask: (task : Event) => void;
		updateProject: () => void;
		selectTask: (task : Event, index? : number) => void;
        alertOnDrop: (event: Event,delta,revertFunc) => void;
		eventClick: (event : Event) => void;
		/**remove user from task */
		removeUser: (task : Event) => void;
		addUser: (task : Event) => void;
		renderCalendar: () => void;
		taskUser: () => boolean;
		getProject: () => void;
		changeProject: () => void;
		updateUser: () => void;
		taskList : taskList;
		selectProject: (newProject : boolean) => void;
		//static $inject = ['$scope','$http','uiCalendarConfig','pageService']
		constructor(private $scope: ng.IScope,
                    private $http: ng.IHttpService,
                    private uiCalendarConfig: any,
                    private pageService : pageService
                    )
       {
		   	this.updateProject = () => 
		   		this.projects.updateProject()
				   .success((data : any , status : number) =>
				   {
					   	if(status === 201) {
							this.getTasks(  this.projects.id);
                        	this.getFreeTasks(  this.projects.id);
							this.projects.changeProject(this.user.name);
							this.uiConfig["calendar"].editable = this.projects.owner;
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
		  		this.projects.selectProject(newProject);
		   this.taskList = new taskList(this.$http,new Array<Event>(),new Array<Event>(),null);
		   this.changeProject = () => 
		   {
			   this.projects.changeProject(this.user.name);
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
			this.updateTask = (task : Event) =>
				this.taskList.updateTask(task,this.projects.id)
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
				this.updateTask(task);
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
					})
            
         
            /**Get projects*/
            this.getProject = () => 
				this.projects.getProject()
                	.success((data: any,status : number) => 
					{
                        this.getTasks(  this.projects.id);
                        this.getFreeTasks(  this.projects.id);
						this.projects.changeProject(this.user.name);
						this.uiConfig["calendar"].editable = this.projects.owner;
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
			
			this.removeUser = (task : Event) => 
				this.taskList.removeUser(task,this.projects.id)
					.success(() => this.renderCalendar())
					.error((data : any, status : number) => {
                   		if(status == 401){
				 			this.pageService.logout()
					  	 }
                	});
			
			this.addUser = (task : Event) => 
				this.taskList.addUser(task,this.projects.id,this.user)
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