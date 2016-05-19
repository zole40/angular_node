module Calendar{
    export class ProjectList{
        addProjects: (project : Project) => ng.IHttpPromise<Project>;
        removeProject: (project : Project) => ng.IHttpPromise<Project>;
        getProject: () => ng.IHttpPromise<Project>;
        getProjectUsers: () => Array<string>;
        selectedProject : Project;
        changeProject: (userName :string) => void;
        updateProject: () => ng.IHttpPromise<Project>;
        selectProject: (newProject : boolean) => void;
        owner: boolean;
        newProject: boolean;
   		constructor(private $http : ng.IHttpService,
                    public avaible : Array<Project>,
                    public selected : number,
                    public id: string){
             this.getProject = () => this.$http.get("/project/getProject")
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
       		 this.getProjectUsers = () => this.avaible[this.selected] ? this.avaible[this.selected].users : undefined
             this.changeProject = (userName : string) => {
                 for (let i in this.avaible) {
                    if(this.avaible[i]._id === this.id){
                        this.selected = this.avaible.indexOf(this.avaible[i]);
                    }    
                 }
               if(this.avaible[this.selected]){
                   this.owner = userName === this.avaible[this.selected].owner              
               }  
            };
            this.selectProject = ( newProject : boolean) =>{
                this.newProject = newProject;
                this.newProject ? 
                    this.selectedProject = new Project(this.$http) : this.selectedProject = this.avaible[this.selected];
            }
            this.updateProject = () => 
            {
                let url = "/project/";
                this.newProject ?
                    url += "addProject" : url += "modifyProject";
               return this.selectedProject.update(url)
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
    }
}
};