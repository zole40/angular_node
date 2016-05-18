var Calendar;
(function (Calendar) {
    var pageService = (function () {
        function pageService() {
            var _this = this;
            this.authorized = false;
            this.login = function () { return _this.authorized = true; };
            this.logout = function () { return _this.authorized = false; };
            this.isAuthorized = function () { return _this.authorized; };
        }
        return pageService;
    }());
    Calendar.pageService = pageService;
})(Calendar || (Calendar = {}));
;
//# sourceMappingURL=pageService.js.map