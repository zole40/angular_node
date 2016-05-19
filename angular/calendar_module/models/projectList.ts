module Calendar{
    export class ProjectList{
        addProjects: (project : Project) => ng.IHttpPromise<Project>;
        removeProject: (project : Project) => ng.IHttpPromise<Project>;
        getProject: () => ng.IHttpPromise<Project>;
        getProjectUsers: () => Array<string>;
        changeProject: (userName :string) => void;
        updateProject: () => ng.IHttpPromise<Project>;
        
        owner: boolean;
   		constructor(private $http : ng.IHttpService,
                    public avaible : Array<Project>,
                    public selected : number,
                    public id: string){
             this.getProject = () => this.$http.get("/project/getProject"); 
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
            }

    }
}
};