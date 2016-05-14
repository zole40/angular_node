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
        Calendar.calendar = new CalendarApp(angular.module("calendar", ['ui.calendar', 'ngMaterial','color.picker'])
            .controller("calendarCtrl", Calendar.calendarController));
    }
    Calendar.start = start;
})(Calendar || (Calendar = {}));
var Calendar;
(function (Calendar) {
    var calendarController = (function () {
        function calendarController($scope, $http, $window, $location, uiCalendarConfig) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
            this.$location = $location;
            this.uiCalendarConfig = uiCalendarConfig;
            this.projects = {
                selected : 0,
                avaible: []
            };
            this.color = "hsl (20%, 30% 40%)";
            this.ProjectUsers = {};
            this.events = [];
            this.eventSources = [this.events];
            this.tasks = {};
            this.project ={
                title: ""
            }
            this.addProject = function(){
                _this.$http({
                    method: "POST",
                    url: "/addProject",
                    data: _this.project
                }).success(function(data,status){
                    console.log(status);
                });
            };
            this.task ={
                title: "",
                user: "",
                end: "",
                description: ""
            }
            this.addTask = function(){
                _this.$http({
                    method: "POST",
                    url: "/addTask",
                    data: _this.task
                }).success(function(data,status){
                    console.log(status);
                });
            }
            this.newProjectUsers =[];
            this.ProjectUser = "";
            this.addProjectUser= function(){
                _this.newProjectUsers.push(_this.ProjectUser);
                console.log(_this.ProjectUser);
            };
            this.sendProjectUsers = function(){
                _this.$http({
                    method: "POST",
                    url: "/addUser",
                    data: _this.newProjectUsers
                }).success(function(data,status){
                    console.log(status);
                });
            }

            this.user = {
                name: "zoli",
                password: "111",
                address: "Budapest",
                email: "zoli@z.com"
            };
            this.$http({
                method: "GET",
                url: "/getTasks",
                date: _this.projects.selected
            }).success(function(data,status){
                _this.tasks = data['events'];
            });

            this.$http({
                method: "GET",
                url: "/getProject",
                date: _this.projects.selected
            }).success(function(data,status){
                _this.projects.avaible = data['projects'];
            });

            this.$http({
                method: "GET",
                url: "/getProjectUsers",
                date: _this.projects.selected
            }).success(function(data,status){
                _this.ProjectUsers = data['users'];
            });


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
            this.$http({
                method: 'GET',
                url: '/getTask',
            }).success(function (data, status) {
             angular.element('#calendar').fullCalendar( 'removeEvents');
             _this.events = data['events']
            for(i in _this.events){
                _this.events[i]['_id'] = parseInt(i) + 1;
                _this.events[i]['start'] = new Date(_this.events[i]['start']);
            if( _this.events[i]['end']){
                _this.events[i]['end'] = new Date(_this.events[i]['end']);
            }
                angular.element('#calendar').fullCalendar( 'renderEvent' ,_this.events[i]);
            }
            _this.eventSources = [_this.events];
        



            });
            this.submit = function () {
            this.$http({
                method: 'POST',
                url: '/modifyUser',
                data: this.user,
            }).then(function successCallback(response) {
                this.location.href = '/calendar';
            }, function errorCallback(response) {
                this.error = response.data.error;
            });
            };
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
                this.location.href = '/calendar';
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