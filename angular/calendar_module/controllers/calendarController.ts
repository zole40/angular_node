module Calendar {
    export class calendarCtrl {
        
		/**Calendar */
        uiConfig: Object;
        alertEventOnClick: Object;
		alertOnDrop: (event: Event,delta,revertFunc) => void;
		eventClick: (event : Event) => void;
		renderCalendar: () => void;
		
		/**Project */
		projects: ProjectList;
        updateProject: () => void;
		addProjectUser: () => void;
		getProject: () => void;
		changeProject: () => void;
		deleteProject: () => void;
		removeProjectUser: () => void;
		selectProject: (newProject : boolean) => void;
		
		/**Task */
		taskList : taskList;
		getTasks: (_id : string) => void;
        getFreeTasks: (_id : string) => void;
		getFinishedTask: (_id : string) => void;
        updateTask: () => void;
		selectTask: (task : Event) => void;
		removeUser: () => void;
		addUser: () => void;
		taskUser: () => boolean;
		finishTask: () => void;
		deleteTask: () => void;
		getEvents: () => void;
		
		/**user */
		user : User; 
		changeColor: () => void;
		updateUser: () => void;
		
		/**Add user */
		userName: string;
		select: string;
		allUser: Array<string>
		selectedUsers: Array<string>;
		getAllUser: () => void;
		selectUser: () => void;
		selectChange: () => void;
		
		adminMenu: boolean;
		
		static $inject = ['$scope','$http','pageService']
		constructor(private $scope: ng.IScope,
                    private $http: ng.IHttpService,
                    private pageService : pageService
                    )
       {
		   this.deleteTask = () =>
		   		this.taskList.deleteTask(this.projects.id)
				   .success(() =>
				   {
				   		this.taskList.getTasks(this.projects.id)
				   			.success(() =>
				   				this.renderCalendar()
				   		).error((data : any, status : number) => 
						{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
                	});
						let element = <any> angular.element("#task");
						element.modal("hide");
						
				   }).error((data : any, status : number) => 
					{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
                	})
				   ;
		   this.selectChange = () =>
		   {
			   this.selectedUsers = new Array<string>();
			   if(this.select === 'add'){
				   this.getAllUser();
			   }
			   else if (this.select === 'remove'){
				   this.allUser = new Array<string>();
				   this.projects.avaible[this.projects.selected].users.forEach((element) =>
				   {
					   this.allUser.push(element);
				   })
				   
			   }
		   }
		   this.select = "add";
		   this.addProjectUser = () =>
		   {
			   this.$http({
				  method : "POST",
				  url : "/project/addUser",
				  data :  {users : this.selectedUsers},
				  params : {id : this.projects.id}
			   }).success(() => {
					this.selectedUsers.forEach((element) =>
					{
						this.projects.avaible[this.projects.selected].users.push(element);	
					});
				  	this.selectedUsers = new Array<string>();
					let element = <any> angular.element("#add_user");
					element.modal("hide");
				   
			   }).error((data : any, status : number) => 
					{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
                	});
		   }
		  this.removeProjectUser = () =>
		   {
			   this.$http({
				  method : "POST",
				  url : "/project/deleteUser",
				  data :  {users : this.selectedUsers},
				  params : {id : this.projects.id}
			   }).success(() => {
					this.selectedUsers.forEach((element) =>
					{
					this.selectedUsers.forEach((element2) =>
						{
							this.projects.avaible[this.projects.selected].users.forEach((element)=>{
								if(element === element2){
									this.projects.avaible[this.projects.selected].users.splice(this.projects.avaible[this.projects.selected].users.indexOf(element2),1);
									return;
								}
							});
						});
					});
				  	this.selectedUsers = new Array<string>();
					let element = <any> angular.element("#add_user");
					element.modal("hide");
				   
			   })		   	.error((data : any, status : number) => 
					{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
                	});
		   }
		   
		   this.allUser = new Array<string>();
		   this.selectedUsers = new Array<string>();
		   this.selectUser = () =>{
				this.selectedUsers.push(this.userName);
				this.allUser.splice(this.allUser.indexOf(this.userName),1);
				this.allUser.length ? this.userName = this.allUser[0] : this.userName = "";
	
		   };
		   this.getAllUser = () => 
		   		this.$http({
					   method : "GET",
					   url : "/user/getAll"
				   }).success((data : any) => 
					{
						this.allUser = new Array<string>();
				   data.users.forEach((element =>
				   {
					   this.allUser.push(element.name);
				   }))
						this.projects.avaible[this.projects.selected].users.forEach((element) =>
						{
							this.allUser.forEach((element2)=>{
								if(element === element2){
									this.allUser.splice(this.allUser.indexOf(element2),1);
									return;
								}
							});
						});
						this.allUser.splice(this.allUser.indexOf(this.user.name),1);
				   }).error((data : any, status : number) => 
					{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
                	});
						
		   this.finishTask = () => 
		   {
			   if(this.taskList.selectedTask.user){
		   		this.taskList.finish(this.projects.id)
				   .success( () => 
				   {
				   		this.renderCalendar();
				   }).error((data : any, status : number) => 
					{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
                	});
		   }
		   }
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
		   }).error((data : any, status : number) => 
					{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
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
								this.renderCalendar()).error((data : any, status : number) => 
					{
                   		if(status == 401) { 
					   		this.pageService.logout()
				   		}
                	})	
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