var Login;
(function (Login) {
    var LoginCtrl = (function () {
        function LoginCtrl($scope, $http, $window, $location) {
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
            this.$location = $location;
            this.login = true;
        }
        LoginCtrl.prototype.loginPanel = function () {
            this.login = true;
            this.reg = false;
        };
        LoginCtrl.prototype.regPanel = function () {
            this.login = false;
            this.reg = true;
        };
        LoginCtrl.prototype.submit = function () {
            var _this = this;
            if (this.login) {
                var url = '/user/login';
            }
            else {
                var url = '/user/register';
            }
            this.$http.post(url, this.user).success(function (data, status) { return (_this.$window.location.href = "/calendar"); });
        };
        LoginCtrl.$inject = ['$scope', '$http', '$window', '$location'];
        return LoginCtrl;
    }());
    Login.LoginCtrl = LoginCtrl;
})(Login || (Login = {}));
//# sourceMappingURL=LoginController.js.map