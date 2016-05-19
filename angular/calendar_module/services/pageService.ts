module Calendar{
    
    export class pageService{
       	authorized : boolean;
       	login: (user : User) => void;
	   	logout: () => void;
		isAuthorized: () => boolean;
		user : User;
		updateUser: (user : User) => ng.IHttpPromise<User>;
		changeUserColor: (user : User) => ng.IHttpPromise<User>;
   		constructor(){
			this.user = new User();
        	this.login = (user : User) => {
				 this.authorized = true;
				 this.user.set(user);
			}
			this.updateUser = (user : User) => {
				 this.user.set(user);
				 return this.user.update();
			}
			
			this.changeUserColor = (user : User) => {
				 this.user.set(user);
				 return this.user.changeColor();
			}
			
       		this.logout = () => this.authorized = false
			this.isAuthorized = () => this.authorized
       		}  
		}
    };
