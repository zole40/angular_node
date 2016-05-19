module Calendar{
    export class User{
        update: () => ng.IHttpPromise<User>;
        set: (user : User) => void;
        changeColor: () => ng.IHttpPromise<User>;
        name : string;
        color: string;
        _id: string;
        email: string;
        address: string;
        password: string;
        $http : ng.IHttpService;
        setHttp : (http : ng.IHttpService) => void;
        constructor(){
            this.set = (user: User) => {
                this._id = user._id;
                this.address = user.address;
                this.color = user.color;
                this.email = user.email;
                this.name = user.name;
                this.password = user.password;
            };     
            this.setHttp = (http : ng.IHttpService) => this.$http = http      
            /**Update user profile */
			this.update = () =>  this.$http({
					method: "POST",
					url: "/user/modifyUser",
					data : this
				});
           this.changeColor = () => this.$http(
                {
                   method : "POST",
                   url : "/user/changeColor",
                   data : { color : this.color }  
                });
			
        }
      }
    }
