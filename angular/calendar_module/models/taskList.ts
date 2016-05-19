module Calendar{
    export class taskList{
        getFreeTasks: (id : string) => ng.IHttpPromise<Event>;
        getTasks: (id : string) => ng.IHttpPromise<Event>;
        removeUser: (task : Event,id : string) => ng.IHttpPromise<Event>;
        addUser: (task : Event,id : string,user : User) => ng.IHttpPromise<Event>;
        taskUser: (userName : string) => boolean;
        newTask: boolean;
        updateTask: (task : Event,od : string) => ng.IHttpPromise<Event>; 
        selectTask: (task : Event) => void;
   		constructor(private $http : ng.IHttpService,
                    public eventSources : Array<Event>,
                    public tasks : Array<Event>,
                    public selectedTask: Event){                        
                this.getFreeTasks = (id : string) => this.$http({
                    method : "GET",
                    url : "task/getFreeTask",
                    params: {id : id}  
                }).success(
                        (data : any, status : number) =>{
						this.tasks = [];
						data.events.forEach((element : Event) =>{
							let task = new Event(this.$http);
							task.set(element);
							this.tasks.push(task);
						})
                    });
                this.getTasks = (_id : string) => this.$http({
                    method : "GET",
                    url : "task/getTasks",
                    params: {id : _id}  
                }).success(
                    (data : any, status : number) =>{
						this.eventSources = [];
						data.events.forEach((element : Event) =>{
							let task = new Event(this.$http);
							task.set(element);
							this.eventSources.push(task);
						})
                });

                this.removeUser = (task : Event,id : string) =>
                    task.removeUser(id)
			            .success((data : any , status : number) => {
					        if(status == 204){
                                let index : number;
                                this.eventSources.forEach((element : Event) =>{
                                    if(element._id === task._id) 
                    		            index =  this.eventSources.indexOf(element) 
                    	        });
						        task.user = "";
						        this.eventSources[index].user = "";
				                this.tasks.push(this.eventSources[index]);
						        this.eventSources.splice(index,1);	
					        }
				    });
                this.addUser = (task : Event , id : string,user : User) => 
                    task.addUser(id)
					    .success((data : any , status : number) => {
					        if(status == 204){
						        task.user = user.name;
						        task.color = user.color;
						        this.eventSources.push(task);
						        let  index = this.tasks.indexOf(task);
						        this.tasks.splice(index,1);
					        }
				    });
                    this.taskUser = (userName : string) => this.selectedTask.user === userName;
                    
                    this.selectTask = (task : Event) => {
                        task ? 
                            this.newTask = false : this.newTask = true;
                        this.newTask ? 
                            this.selectedTask = new Event(this.$http) : this.selectedTask = task;
                    };
                    
                this.updateTask = (task : Event,id :string) => {
				    let url = "/task/";
				    this.newTask ? url+= "addTask" : url += "modifyTask";
                    return task.update(id,url)
                    .success((data : any , status : number) =>
                    {
                        if(status === 201) {
                            let event = new Event(this.$http);
                            event.set(data.task);
                            this.tasks.push(event);
                        }
                    });
                }
    }
    }
};