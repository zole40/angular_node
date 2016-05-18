module Calendar{
    export class ProjectList{
        addProjects: (project : Project) => void;
        removeProject: (project : Project) => void;
        constructor(public avaible : Array<Project>,
                    public selected : number){
                        this.addProjects = ( project :Project) => this.avaible.push(project);
                        this.removeProject =(project : Project) => {
                           let index = avaible.indexOf(project);
                           if(this.selected === index)
                                this.selected = 0;
                           avaible.slice(index,1);
                        }              
                    }

    }
}