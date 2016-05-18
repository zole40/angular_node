module Calendar{
	export class Event {
		constructor(public title : string,
                    public _id : string,
                    public start : Date,
                    public color : string,
                    public user : string,
                    public finished : boolean) {}
                   

    }
} 