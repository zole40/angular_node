module Calendar {
    
    interface Color{
        color : string;
    }
   
    interface User{
        name : String;
        color : Color;
        _id : string;
        email: string;
        address : string;
    }
    
    interface Event{
        title: string;
        _id: string;
        end: Date;
        color: Color;
        /**User name */
        user : string;
    }
    
    interface Project{
        _id : string;
        title: string;
        /**User name */
        owner : string;
        description: string;
        /**User name */
        users: Array<string>;
    }
    
    /**
     * ProjectList
     */
    class ProjectList {
       avaible : Array<Project>;
       /**Project _id */
       selected : string;
        constructor() {
            this.avaible = new Array<Project>();     
        }
    }
    
    export class calendarCtrl {
        
        uiConfig: Object;
        alertEventOnClick: Object;
        alertOnDrop: Object;
        alertOnResize: Object;
        events: Event;
        eventSources: Array<Event>;
        projects : ProjectList;
        selectedTask : Event;
        /**User name */
        ProjectUsers : Array<string>;
        tasks : Array<Event>;
        project : Project;
        user : User; 
		adminMenu: boolean;
        changeColor: () => void;        
        getProject: () => void;
        getProjectUsers: (string) => void;
        getTasks: (string) => void;
        getFreeTasks: (string) => void;
        getProjectattr: (string) => void;
        castDate: (Event) => void;
        addAdminMenu: () => void;
        removeAdminMenu: () => void; 
        addUserModal: () => void;
        updateTask: () => void;
		selectTask: (Event) => void;
		updateUser: () => void;
        constructor(private $scope: ng.IScope,
                    private $http: ng.IHttpService,
                    private $window: ng.IWindowService,
                    private $location: ng.ILocationService,
                    private uiCalendarConfig: any
                    )
       {
           /**Get user */
       		this.$http.get("/user/getUser").success(
				   (data : any , status : number) => this.user = data.user		    
           	);
           /**Init */
           this.eventSources = new Array<Event>();
           this.projects = new ProjectList();  
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
                    eventResize: this.alertOnResize
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
                }).success(function(data,status){
                    console.log(status);
                })
            );
            
            this.addAdminMenu =  () => this.adminMenu = true;
            
            this.removeAdminMenu = () => this.adminMenu = false;
            
            this.addUserModal = () => {
                this.$http.get("/profile").success(
                    (data : any , status : number) => angular.element("#userModalBody").html(data)
                )    
            }
			
			this.updateUser = () => {
				this.$http({
					method: "POST",
					url: "/user/modifyUser",
					data : this.user
				}).success(function(data : any, status : number){
					console.log(status);
				})
			}
                
            
               
            this.getFreeTasks = (_id : string) => {
                this.$http({
                  method : "GET",
                  url : "task/getFreeTask",
                  params: {id : _id}  
                }).success(
                    (data : any, status : number) =>(
                        this.tasks = data.events
                    )
                )
            }
            
               
            this.getProjectUsers = (_id : string) => {
                this.$http({
                  method : "GET",
                  url : "project/getProjectUsers",
                  params: {id : _id}  
                }).success(
                    (data : any, status : number) =>(
                        this.ProjectUsers = data.users
                    )
                )
            }                            
                this.castDate = function(events : Event) {
                    var calendar  = <any> angular.element(document.querySelector("#calendar"));
                    calendar.fullCalendar('removeEvents');
                    for (var i in this.events){
                        events[i]['_id'] = parseInt(i) + 1;
                        events[i]['start'] = new Date(events[i]['start']);
                        events[i]['end'] = new Date(events[i]['end']);
                    }
                    this.eventSources = events;
                        calendar.fullCalendar('addEventSource',this.eventSources);
                }
               
            this.getTasks = (_id : string) => {
                this.$http({
                  method : "GET",
                  url : "task/getTasks",
                  params: {id : _id}  
                }).success(
                    (data : any, status : number) =>(
                        this.events = data.events,
                        this.castDate(this.events)
                    )
                )
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
                    (data: any,status : number) => (
                        this.projects.avaible = data.projects,
                        this.projects.selected = this.projects.avaible[0]._id,
                        this.getProjectUsers(this.projects.selected),
                        this.getTasks(this.projects.selected),
                        this.getFreeTasks(this.projects.selected)
                    )
                )
            );
			
			this.selectTask = (task : Event) => {this.selectedTask = task; console.log(task)};
			
			this.updateTask = () => {
				this.$http({
					method: "POST",
					url : "/task/modifyTask",
					data : this.selectedTask,
					params : {id : this.projects.selected}
				}).success(function (data : any , status : number) {
					console.log(status);
				})
			}
			
            this.getProject();
            
            
        }
        
    }
} 