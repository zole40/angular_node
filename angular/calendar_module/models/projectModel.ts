module Calendar{
    export class Project{
        constructor(public _id : string,
                    public title : string,
                    public owner : string,
                    public users : Array<string>,
                    public description : string){
                        users = new Array<string>();
                    }
    }
}
