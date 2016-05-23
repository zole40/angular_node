module Calendar{
    export class ProjectList{
        add: (project : Project) => ng.IHttpPromise<Project>;
        remove: (project : Project) => ng.IHttpPromise<Project>;
        get: () => ng.IHttpPromise<Project>;
        getUsers: () => Array<string>;
        selectedP : Project;
        delete: () => ng.IHttpPromise<Project>;
        change: (userName :string) => void;
        update: () => ng.IHttpPromise<Project>;
        select: (newProject : boolean) => void;
        owner: boolean;
        newP: boolean ;
        static $inject = ["$http","avaible","selected","id"];
   		constructor(private $http : ng.IHttpService,
                    public avaible : Array<Project>,
                    public selected : number,
                    public id: string){
             this.get = () => this.$http.get("/project/getProject")
                .success((data : any , status : number) =>
                {
                    this.avaible = [];
                    data.projects.forEach( (element) =>
                    {
                        let project = new Project(this.$http);
                        project.set(element);
                        this.avaible.push(project);
                    })
					this.id = this.avaible[  this.selected]._id; 
                }); 
       		 this.getUsers = () => this.avaible[this.selected] ? this.avaible[this.selected].users : undefined
             this.change = (userName : string) => {
                 for (let i in this.avaible) {
                    if(this.avaible[i]._id === this.id){
                        this.selected = this.avaible.indexOf(this.avaible[i]);
                    }    
                 }
               if(this.avaible[this.selected]){
                   this.owner = userName === this.avaible[this.selected].owner              
               }  
            };
            this.select = ( newProject : boolean) =>{
                this.newP = newProject;
                this.newP ? 
                    this.selectedP = new Project(this.$http) : this.selectedP = this.avaible[this.selected];
            }
            this.update = () => 
            {
                let url = "/project/";
                this.newP ?
                    url += "addProject" : url += "modifyProject";
               return this.selectedP.update(url)
                .success((data : any , status : number) =>
                {
                    if(status == 201) {
                        let project = new Project(this.$http);
                        project.set(data.project);
                        this.avaible.push(project);
                        this.selected = this.avaible.length - 1;
                        this.id = project._id;
                    }
                });
            }
                this.delete = () =>
                 this.$http({
                     method : "POST",
                     url: "/project/deleteProject",
                     data: {},
                     params : {id : this.selectedP._id}
                 }).success( (data : any, status : number) => {
                     this.avaible.splice(this.avaible.indexOf(this.selectedP,1));
                     if(this.avaible.length){
                        if(this.selected > this.avaible.length - 1){
                            this.selected -= 1;     
                        }
                        this.id = this.avaible[this.selected]._id;
                    }
                    else{
                        this.selected = 0;
                        this.id = "";
                    }
                 });   
                }
            }
    };