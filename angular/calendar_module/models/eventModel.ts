module Calendar{
	export class Event {
        addUser: (id : string) => ng.IHttpPromise<Event>;
        removeUser: (id : string) => ng.IHttpPromise<Event>;
        update: (id: string, url : string) => ng.IHttpPromise<Event>;
        finish: (id: string) => ng.IHttpPromise<Event>;
        set: (task : Event) => void;
        title : string;
        _id : string;
        start : Date;
        color : string;
        user : string;
        finished : boolean;
        description : string;
		constructor(private $http : ng.IHttpService) {
            this.addUser = (id : string) =>  this.$http({
					method: "POST",
					url : "/task/addTaskUser",
					data : this,
					params : {id : id}
            });
            this.removeUser = (id : string) => this.$http({
					method: "POST",
					url : "/task/removeTaskUser",
					data : this,
					params : {id : id}
			});

            this.set = (task : Event) => {
                this.title = task.title;
                this._id = task._id;
                this.start = task.start;
                this.color = task.color;
                this.user = task.user;
                this.finished = task.finished;
                this.description = task.description;
            };
            this.update = (id : string, url : string) => 
                this.$http({
					method: "POST",
					url : url,
					data : this,
					params : {id : id}
			});
            this.finish = (id : string) =>
                this.$http({
                    method : "POST",
                    url : "/task/finish",
                    data : {task : this},
                    params : {id : id}
                })
        }
    }
} 