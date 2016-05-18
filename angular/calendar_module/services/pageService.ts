module Calendar{
    
    export class pageService{
       	authorized : boolean;
       	login: () => void;
	   	logout: () => void;
		isAuthorized: () => boolean;
   		constructor(){
        	this.authorized = false;
        	this.login = () =>	this.authorized = true
       		this.logout = () => this.authorized = false
			this.isAuthorized = () => this.authorized
       		}
		}
    };
