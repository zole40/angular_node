module Calendar{
    
    export class pageCtrl{
        
        static $inject = ['$scope','pageService','$http'];
        isAuthorized: () => boolean;
        logout: () => void;
        constructor(private $scope: ng.IScope,private pageService : pageService,private $http: ng.IHttpService){
           this.isAuthorized = this.pageService.isAuthorized;
           this.logout = () => {
               this.$http.post("/user/logout",FormData = null).success(
                   (data: any , status : number) => {
											if(status == 200) this.pageService.logout(); console.log(status);
										}
							 )}    
    	} 
    }
}