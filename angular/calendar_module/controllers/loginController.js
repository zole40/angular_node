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
                    console.log(data);
                    _this.pageService.login(data.user);
                }
                else if (status === 401) {
                    _this.pageService.logout();
                }
            });
        };
        loginCtrl.$inject = ['$scope', '$http', '$window', '$location', 'pageService'];
        return loginCtrl;
    }());
    Calendar.loginCtrl = loginCtrl;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=loginController.js.map