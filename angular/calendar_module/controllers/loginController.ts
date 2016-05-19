module Calendar {

    export class loginCtrl {
        user: {
            name: string,
            password: string,
            email: string,
            address: string
        };
        login: boolean;
        reg: boolean;
        error: string;
        static $inject = ['$scope','$http','$window','$location','pageService'];
        constructor(private $scope: ng.IScope,
                    private $http: ng.IHttpService,
                    private $window : ng.IWindowService,
                    private $location: ng.ILocationService,
                    private pageService : pageService) {
            this.login = true;
        }

        loginPanel() {
            this.login = true;
            this.reg = false;
        }

        regPanel() {
            this.login = false;
            this.reg = true;
        }
        submit() {
            if (this.login) {
                var url = '/user/login';
              
            }
            else {
                var url = '/user/register';
            }
            this.$http.post(url, this.user).success( 
                (data: any, status : Number) => {
                    console.log(status);
                    if(status === 200){  
                        console.log(data);
                        this.pageService.login(data.user);    
                    }
                    else if(status === 401){
                        this.pageService.logout();
                    }
                }
            );
        }
    }
}