var Calendar;
(function (Calendar) {
    var loginCtrl = (function () {
        function loginCtrl($scope, $http, $window, $location, pageService) {
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
            this.$location = $location;
            this.pageService = pageService;
            this.login = true;
        }
        loginCtrl.prototype.loginPanel = function () {
            this.login = true;
            this.reg = false;
        };
        loginCtrl.prototype.regPanel = function () {
            this.login = false;
            this.reg = true;
        };
        loginCtrl.prototype.submit = function () {
            var _this = this;
            if (this.login) {
                var url = '/user/login';
            }
            else {
                var url = '/user/register';
            }
            this.$http.post(url, this.user).success(function (data, status) {
                console.log(status);
                if (status === 200) {
                    _this.pageService.login();
                }
                else if (status === 401) {
                    _this.pageService.login();
                }
            });
        };
        loginCtrl.$inject = ['$scope', '$http', '$window', '$location', 'pageService'];
        return loginCtrl;
    }());
    Calendar.loginCtrl = loginCtrl;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=loginController.js.map