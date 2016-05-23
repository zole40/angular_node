module Calendar{
    export class taskList{
        getFreeTasks: (id : string) => ng.IHttpPromise<Event>;
        getTasks: (id : string) => ng.IHttpPromise<Event>;
        deleteTask: (id : string) => ng.IHttpPromise<Event>;
        getFinished: (id : string) => ng.IHttpPromise<Event>;
        removeUser: (id : string) => ng.IHttpPromise<Event>;
        addUser: (id : string,user : User) => ng.IHttpPromise<Event>;
        taskUser: (userName : string) => boolean;
        newTask: boolean;
        updateTask: ( id : string) => ng.IHttpPromise<Event>; 
        selectTask: (task : Event) => void;
        finish: ( id : string) => ng.IHttpPromise<Event>;
        static $inject = ["$http","eventSources","tasks","finished","selectedTask"];
   		constructor(private $http : ng.IHttpService,
                    public eventSources : Array<Event>,
                    public tasks : Array<Event>,
                    public finished : Array<Event>,
                    public selectedTask: Event){      
                        
                this.deleteTask = (id : string) =>
                    this.selectedTask.delete(id)
                        .success(() => 
                        {
                            let index = this.tasks.indexOf(this.selectedTask) 
                            if(index > -1){
                                this.tasks.splice(index,1);
                            }
                            else {
                                index = this.finished.indexOf(this.selectedTask);
                                if(index > -1){
                                    this.finished.splice(index,1);
                                }
                            }
                        });                   
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
                
                this.getFinished = (_id : string) => this.$http({
                    method : "GET",
                    url : "task/getFinished",
                    params: {id : _id}  
                }).success(
                    (data : any, status : number) =>{
						this.finished = [];
						data.events.forEach((element : Event) =>{
							let task = new Event(this.$http);
							task.set(element);
							this.finished.push(task);
						})
                });

                this.removeUser = (id : string) =>
                    this.selectedTask.removeUser(id)
			            .success((data : any , status : number) => {
					        if(status == 204){
                                let index : number;
                                this.eventSources.forEach((element : Event) =>{
                                    if(element._id === this.selectedTask._id) 
                    		            index =  this.eventSources.indexOf(element) 
                    	        });
						        this.selectedTask.user = "";
						        this.eventSources[index].user = "";
				                this.tasks.push(this.eventSources[index]);
						        this.eventSources.splice(index,1);	
					        }
				    });
                this.addUser = ( id : string,user : User) => 
                    this.selectedTask.addUser(id)
					    .success((data : any , status : number) => {
					        if(status == 204){
						        this.selectedTask.user = user.name;
						        this.selectedTask.color = user.color;
						        this.eventSources.push(this.selectedTask);
						        let  index = this.tasks.indexOf(this.selectedTask);
						        this.tasks.splice(index,1);
					        }
				    });
                    this.taskUser = (userName : string) => this.selectedTask.user === userName;
                    
                    this.selectTask = (task : Event) => {
                        task ? 
                            this.newTask = false : this.newTask = true;
                        if(this.newTask){
                            this.selectedTask = new Event(this.$http);
                        } 
                        else{
                            this.selectedTask = task;
                            this.selectedTask.start = new Date(this.selectedTask.start.toString());
                        }    
                };
                    
                this.updateTask = (id :string) => {
				    let url = "/task/";
				    this.newTask ? url+= "addTask" : url += "modifyTask";
                    return this.selectedTask.update(id,url)
                    .success((data : any , status : number) =>
                    {
                        if(status === 201) {
                            let event = new Event(this.$http);
                            event.set(data.task);
                            this.tasks.push(event);
                        }
                    });
                }
                this.finish = (id : string) => 
                   this.selectedTask.finish(id)
                    .success( () => {
                        if(this.selectedTask.finished){
                             let index : number;

                                this.eventSources.forEach((element : Event) =>{
                                    if(element._id === this.selectedTask._id) 
                    		            index =  this.eventSources.indexOf(element) 
                    	        });
				                this.finished.push(this.eventSources[index]);
						        this.eventSources.splice(index,1);	
                    }
                    else{
                             let index : number;
                                this.finished.forEach((element : Event) =>{
                                    if(element._id === this.selectedTask._id) 
                    		            index =  this.finished.indexOf(element) 
                    	        });
				                this.eventSources.push(this.finished[index]);
						        this.finished.splice(index,1);
                    }
                    } )
       
    }
    }
};