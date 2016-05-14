module Login {

    export class LoginCtrl {
        user: {
            name: string,
            password: string,
            email: string,
            address: string
        };
        login: boolean;
        reg: boolean;
        error: string;
        static $inject = ['$scope','$http','$window','$location'];
        constructor(private $scope: ng.IScope, private $http: ng.IHttpService,private $window : ng.IWindowService,private $location: ng.ILocationService) {
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
                (data: any, status : Number) => (this.$window.location.href = "/calendar")
            );
        }
    }
}