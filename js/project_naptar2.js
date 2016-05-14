var Calendar;
(function (Calendar) {
    var CalendarApp = (function () {
        function CalendarApp(angularModule) {
            this.angularModule = angularModule;
        }
        return CalendarApp;
    })();
    Calendar.CalendarApp = CalendarApp;
    function start() {
        Calendar.calendar = new CalendarApp(angular.module("calendar", ['ui.calendar', 'ngMaterial'])
            .controller("calendarCtrl", Calendar.calendarController));
    }
    Calendar.start = start;
})(Calendar || (Calendar = {}));
var Calendar;
(function (Calendar) {
    var calendarController = (function () {
        function calendarController($scope, $http, $window, $location) {
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
            this.$location = $location;
            this.date = new Date();
            this.d = this.date.getDate();
            this.m = this.date.getMonth();
            this.y = this.date.getFullYear();
            this.events = [
                { title: 'All Day Event', start: new Date(this.y, this.m, 1) },
                { title: 'Long Event', start: new Date(this.y, this.m, this.d - 5), end: new Date(this.y, this.m, this.d - 2) },
            ];
            this.uiConfig = {
                calendar: {
                    height: 450,
                    editable: true,
                    header: {
                        left: 'month basicWeek basicDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    dayClick: this.alertEventOnClick,
                    eventDrop: this.alertOnDrop,
                    eventResize: this.alertOnResize
                }
            };
            this.eventSource = [this.events];
        }
        return calendarController;
    })();
    Calendar.calendarController = calendarController;
})(Calendar || (Calendar = {}));
var Login;
(function (Login) {
    var LoginController = (function () {
        function LoginController($scope, $http, $window, $location) {
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
            this.$location = $location;
            this.login = true;
        }
        LoginController.prototype.loginPanel = function () {
            this.login = true;
            this.reg = false;
        };
        LoginController.prototype.regPanel = function () {
            this.login = false;
            this.reg = true;
        };
        LoginController.prototype.submit = function () {
            if (this.login) {
                var ur = '/login';
            }
            else {
                var ur = '/register';
            }
            this.$http({
                method: 'POST',
                url: ur,
                data: this.user,
            }).then(function successCallback(response) {
                this.$location.href = '/calendar';
            }, function errorCallback(response) {
                this.error = response.data.error;
            });
        };
        return LoginController;
    })();
    Login.LoginController = LoginController;
})(Login || (Login = {}));
var Login;
(function (Login) {
    var LoginApp = (function () {
        function LoginApp(angularModule) {
            this.angularModule = angularModule;
        }
        return LoginApp;
    })();
    Login.LoginApp = LoginApp;
    function start() {
        Login.login = new LoginApp(angular.module("login", ["ngMaterial"])
            .controller("LoginCtrl", Login.LoginController));
    }
    Login.start = start;
})(Login || (Login = {}));
//# sourceMappingURL=project_naptar.js.map