var Calendar;
(function (Calendar) {
    var pageCtrl = (function () {
        function pageCtrl($scope, pageService, $http) {
            var _this = this;
            this.$scope = $scope;
            this.pageService = pageService;
            this.$http = $http;
            this.isAuthorized = this.pageService.isAuthorized;
            this.logout = function () {
                _this.$http.post("/user/logout", FormData = null).success(function (data, status) {
                    if (status == 200)
                        _this.pageService.logout();
                    console.log(status);
                });
            };
        }
        pageCtrl.$inject = ['$scope', 'pageService', '$http'];
        return pageCtrl;
    }());
    Calendar.pageCtrl = pageCtrl;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=pageController.js.map