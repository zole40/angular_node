module Calendar {
       

    

    

    
    export class calendarCtrl {
        
        uiConfig: Object;
        alertEventOnClick: Object;
        
        alertOnResize: Object;
        eventSources: Array<Event>;
        projects : ProjectList;
        selectedTask : Event;
        /**User name */
        ProjectUsers : Array<string>;
        tasks : Array<Event>;
        project : Project;
        user : User; 
		adminMenu: boolean;
        newTask: boolean;
		changeColor: () => void;        
        getProject: () => void;
        getProjectUsers: (_id : string) => void;
        getTasks: (_id : string) => void;
        getFreeTasks: (_id : string) => void;
        getProjectattr: (_id : string) => void;
        castDate: (events : Array<Event>) => void;
        addAdminMenu: () => void;
        removeAdminMenu: () => void; 
        addUserModal: () => void;
        updateTask: (task : Event) => void;
		selectTask: (task : Event) => void;
		updateUser: () => void;
        alertOnDrop: (event: Event,delta,revertFunc) => void;
		eventClick: (event : Event) => void;
		/**remove user from task */
		removeUser: (task : Event) => void;
		addUser: (task : Event) => void;
		renderCalendar: () => void;
		taskUser: () => boolean;
		projectOwner: boolean;
		constructor(private $scope: ng.IScope,
                    private $http: ng.IHttpService,
                    private $window: ng.IWindowService,
                    private $location: ng.ILocationService,
                    private uiCalendarConfig: any,
                    private pageService : pageService
                    )
       {
		   
		   /**Rerender calendar */
		   this.renderCalendar = () => {
			    let calendar  = <any> angular.element(document.querySelector("#calendar"));
                calendar.fullCalendar('removeEvents');
				calendar.fullCalendar('addEventSource',this.eventSources);  
		   }
		   
           /**Get user */
       		this.$http.get("/user/getUser").success(
				   (data : any , status : number) => this.user = data.user		    
           	).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                });
           /**Init */
           this.eventSources = new Array<Event>();
           this.projects = new ProjectList([],0);  
		   
		   			
			/**Update or create task */
			this.updateTask = (task : Event) => {
				let url = "/task/";
				this.newTask ? url+= "addTask" : url += "modifyTask";
				this.$http({
					method: "POST",
					url : url,
					data : task,
					params : {id : this.projects.avaible[this.projects.selected]._id}
				}).success((data : any , status : number) => {
                    console.log(status);
					if(status == 204){
						this.getTasks(this.projects.avaible[this.projects.selected]._id);
						this.getFreeTasks(this.projects.avaible[this.projects.selected]._id);
						
					}
				}).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })
			}
		   
		   /**Event click */
		   this.eventClick = (event : Event) => {
		   		let element = <any> angular.element("#task");
				let task = new Event(event.title,event._id,event.start,event.color,event.user,event.finished);
				this.selectTask(task);
				element.modal("show");
			}
			
			/**Change event date */
		   	this.alertOnDrop = (event : Event,delta : any,revertFunc : any) => {
				let task = new Event(event.title,event._id,event.start,event.color,event.user,event.finished);
				this.updateTask(task);
		   };
		   
		   /**init ui config */
           this.uiConfig = {
                calendar: {
                    height: 450,
                    editable: true,
                    header: {
                        left: 'month basicWeek basicDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    dayClick: this.alertEventOnClick,
                    eventDrop: this.alertOnDrop,
                    eventClick: this.eventClick
                }
            };
            this.ProjectUsers = new Array<string>();
             
            /**change user color attribute */
            this.changeColor = () => (
                this.$http(
                {
                   method : "POST",
                   url : "/user/changeColor",
                   data : { color : this.user.color }  
                }).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })
            );
			
            /**Show admin menu */
            this.addAdminMenu =  () => this.adminMenu = true;
            /**Hide admin menu */
            this.removeAdminMenu = () => this.adminMenu = false;
            
            this.addUserModal = () => {
                this.$http.get("/profile").success(
                    (data : any , status : number) => {
                    angular.element("#userModalBody").html(data)
                    }).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })  
            }
			
			/**Update user profile */
			this.updateUser = () => {
				this.$http({
					method: "POST",
					url: "/user/modifyUser",
					data : this.user
				}).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })
			}
                
			/**Get avaible task */
            this.getFreeTasks = (_id : string) => {
                this.$http({
                  method : "GET",
                  url : "task/getFreeTask",
                  params: {id : _id}  
                }).success(
                    (data : any, status : number) =>{
                       this.tasks = data.events
                    }).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })
            }
            
			/**Get project users */  
            this.getProjectUsers = (_id : string) => {
                this.$http({
                  method : "GET",
                  url : "project/getProjectUsers",
                  params: {id : _id}  
                }).success(
                    (data : any, status : number) =>{
                        this.ProjectUsers = data.users
                    }).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })
            }
            
			/**Get task */   
            this.getTasks = (_id : string) => {
                this.$http({
                  method : "GET",
                  url : "task/getTasks",
                  params: {id : _id}  
                }).success(
                    (data : any, status : number) =>{
                        this.eventSources = data.events;
                        this.renderCalendar();
                }).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })
            }   
           
            /**Get user, tasks, freetasks */
            this.getProjectattr = (_id : string) => (
                this.getProjectUsers(_id),
                this.getTasks(_id),
                this.getFreeTasks(_id)
            );
         
            /**Get projects*/
            this.getProject = () => (
                this.$http.get("/project/getProject")
                .success(
                    (data: any,status : number) => {

                        this.projects.avaible = data.projects;
                        this.projects.selected = 0;
                        this.getProjectUsers(this.projects.avaible[this.projects.selected]._id);
                        this.getTasks(this.projects.avaible[this.projects.selected]._id);
                        this.getFreeTasks(this.projects.avaible[this.projects.selected]._id);

					}
                ).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })
            );
			
			/**Select task */
			this.selectTask = (task : Event) =>{
				task ? this.newTask = false : this.newTask = true;
				this.selectedTask = task;
				console.log(this.selectedTask);
			} 
			
			this.removeUser = (task : Event) => {
			this.$http({
					method: "POST",
					url : "/task/removeTaskUser",
					data : task,
					params : {id : this.projects.avaible[this.projects.selected]._id}
				}).success((data : any , status : number) => {
					if(status == 204){
						task.user = "";
						this.tasks.push(task);
						let  index = this.eventSources.indexOf(task);
						this.eventSources.splice(index,1);
						this.renderCalendar();	
					}
				}).error((data : any, status : number) => {
                   if(status == 401) this.pageService.logout()
                })
			}
			
			this.addUser = (task : Event) => {
			this.$http({
					method: "POST",
					url : "/task/addTaskUser",
					data : task,
					params : {id : this.projects.avaible[this.projects.selected]._id}
				}).success((data : any , status : number) => {
					if(status == 204){
						task.user = this.user.name;
						this.eventSources.push(task);
						let  index = this.tasks.indexOf(task);
						this.tasks.splice(index,1);
						this.renderCalendar();
					}
				}).error((data : any, status : number) => {
                    if(status == 401) this.pageService.logout()
                })
			}
			this.taskUser = () => this.selectedTask.user === this.user.name;
			//this.projectOwner = () => this.projects.avaible[this.projects.selected].owner === this.user.name;
            this.getProject();
            
            
        }
        
    }
} 