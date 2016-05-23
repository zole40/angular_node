module Calendar{
    
    export class pageCtrl{
        
        
        isAuthorized: () => boolean;
        logout: () => void;
        static $inject = ['$scope','pageService','$http'];
        constructor(private $scope: ng.IScope,private pageService : pageService,private $http: ng.IHttpService){
           this.isAuthorized = this.pageService.isAuthorized;
           this.logout = () => {
               this.$http.post("/user/logout",FormData = null).success(
                   (data: any , status : number) => {
											if(status == 200) this.pageService.logout(); console.log(status);
										}
							 )}
           this.$http.get("/user/getUser")
           		.success( (data : any) => this.pageService.login(data.user) ) 
    			.error( () => this.pageService.logout() )	
		} 
    }
}