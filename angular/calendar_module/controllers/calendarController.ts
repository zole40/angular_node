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
        color : Color;
        changeColor: () => void;        
        getProject: () => void;
        constructor(private $scope: ng.IScope,
                    private $http: ng.IHttpService,
                    private $window: ng.IWindowService,
                    private $location: ng.ILocationService,
                    private uiCalendarConfig: any
                    )
       {
           /**Init evensources */
           this.eventSources = new Array<Event>();
           this.projects = new ProjectList(); 
           
           /**Init uiConfig */  
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
            
            /**change user color attribute */
            this.changeColor = () => (
                this.$http(
                {
                   method : "POST",
                   url : "/user/changeColor",
                   data : { color : this.color.color }  
                }).success(function(data,status){
                    console.log(status);
                })
            );
            this.getProject = () => (
                this.$http.get("/project/getProject")
                .success(
                    (data: any,status : number) => this.projects.avaible = data.projects
                )
            )
        this.getProject();
        }
        
    }
} 