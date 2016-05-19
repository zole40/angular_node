module Calendar{
    export class Project{
        _id : string;
        title : string;
        owner : string;
        users : Array<string>;
        description : string;
        set: (project : Project) => void;
        update: (url : string) => ng.IHttpPromise<Project>;
        constructor(private $http : ng.IHttpService){
            this.set = (project : Project) =>
            {
                this._id = project._id;
                this.title = project.title;
                this.owner = project.owner;
                this.users = project.users;
                this.description = project.description;    
            }
            this.update = (url : string) => 
                this.$http({
                   method : "POST",
                   url : url, 
                   data: {project : this },
                   params : {id : this._id}
                });
        }
    }
}
