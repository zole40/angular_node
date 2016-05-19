var Calendar;
(function (Calendar) {
    var pageService = (function () {
        function pageService() {
            var _this = this;
            this.user = new Calendar.User();
            this.login = function (user) {
                _this.authorized = true;
                _this.user.set(user);
            };
            this.updateUser = function (user) {
                _this.user.set(user);
                return _this.user.update();
            };
            this.changeUserColor = function (user) {
                _this.user.set(user);
                return _this.user.changeColor();
            };
            this.logout = function () { return _this.authorized = false; };
            this.isAuthorized = function () { return _this.authorized; };
        }
        return pageService;
    }());
    Calendar.pageService = pageService;
})(Calendar || (Calendar = {}));
;
//# sourceMappingURL=pageService.js.map