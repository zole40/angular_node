var Login;
(function (Login) {
    var loginApp = (function () {
        function loginApp(angularModule) {
            this.angularModule = angularModule;
        }
        return loginApp;
    }());
    Login.loginApp = loginApp;
    function start() {
        Login.login = new loginApp(angular.module("login", ["ngMaterial"])
            .controller("LoginCtrl", Login.LoginCtrl));
    }
    Login.start = start;
})(Login || (Login = {}));
//# sourceMappingURL=login.js.map