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
            var selectedTask = {};
            
            this.ProjectUsers = {};
            this.events = [];
            this.eventSources = [this.events];
            this.tasks = {
                title : "",
                description: ""
            };
            this.project ={
                title: "",
                description: ""
            }
            this.user ={
                color: "hsl(30,30,30)"
            };
            this.color = this.user.color;
            _this.$http({
                    method: "GET",
                    url: "/user/getUser",
                }).success(function(data,status){
                    _this.user = data["user"];
                    console.log(_this.user);
                    _this.color = _this.user.color;
                });
            this.changeColor = function(){
                    _this.$http({
                    method: "POST",
                    url: "/user/changeColor",
                    data: {color : _this.color}
                }).success(function(data,status){
                    console.log(status);
                });
            };
            this.addProject = function(){
                _this.$http({
                method: "POST",
                url: "/project/deleteProject",
                params:  {"id" : "57265717bbcbe1b01ea1f20c"}
            }).success(function(data,status){
                console.log(_this.project);
            });
                
              /*  _this.$http({
                method: "POST",
                url: "/modifyProject",
                data: {project :_this.project},
                params:  {"id" : "572621422ae2874fb40fe278"}
            }).success(function(data,status){
                _this.ProjectUsers = data['users'];
                console.log(_this.project);
            });*/
            /*
                _this.$http({
                    method: "POST",
                    url: "/addProject",
                    data: _this.project
                }).success(function(data,status){
                    console.log(status);
                });*/
            };
            this.task ={
                title: "",
                user: "",
                description: ""
            }
            this.addTask = function(){
                _this.$http({
                    method: "POST",
                    url: "/task/addTask",
                    data: _this.task,
                    params: {id :"572621422ae2874fb40fe278"}
                }).success(function(data,status){
                    console.log(status);
                });
            }
            
                  this.modifyTask = function(){
                _this.$http({
                    method: "POST",
                    url: "/task/modifyTask",
                    data: _this.selectedTask,
                    params: {id :"572621422ae2874fb40fe278"}
                }).success(function(data,status){
                    console.log(status);
                });
            }
            
            this.addTaskUser = function(){
                _this.$http({
                    method: "POST",
                    url: "/task/addTaskUser",
                    data: { _id : _this.selectedTask._id},
                    params: {id :"572621422ae2874fb40fe278"}
                }).success(function(data,status){
                    console.log(status);
                });
            }
            
            
            this.getTask = function(task){
                _this.selectedTask = task;
            }
            this.newProjectUsers =[];
            this.ProjectUser = "bela";
            this.addProjectUser= function(){
                _this.newProjectUsers.push(_this.ProjectUser);
            };
            this.sendProjectUsers = function(){
                _this.$http({
                    method: "POST",
                    url: "/project/deleteUser",
                    data: {users : _this.newProjectUsers},
                    params: {id : "572621422ae2874fb40fe278"}
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
                url: "/task/getFreeTask",
                params: {id : "572621422ae2874fb40fe278"}
            }).success(function(data,status){
                _this.tasks = data['events'];
            });

            this.$http({
                method: "GET",
                url: "/project/getProject",
            }).success(function(data,status){
                _this.projects.avaible = data['projects'];
            });

            this.$http({
                method: "GET",
                url: "/project/getProjectUsers",
                params: {"id" : "572621422ae2874fb40fe278"},
            }).success(function(data,status){
                _this.ProjectUsers = data['users'];
                console.log(_this.ProjectUsers);
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
                url: '/task/getTasks',
                params: {"id" : "572621422ae2874fb40fe278"}
            }).success(function (data, status) {
             angular.element('#calendar').fullCalendar( 'removeEvents');
             _this.events = data['events'];
            for(i in _this.events){
                _this.events[i]['_id'] = parseInt(i) + 1;
                _this.events[i]['start'] = new Date(_this.events[i]['start']);
            if( _this.events[i]['end']){
                _this.events[i]['end'] = new Date(_this.events[i]['end']);
            }
                console.log(_this.events[i]);
                angular.element('#calendar').fullCalendar( 'renderEvent' ,_this.events[i]);
            }
            _this.eventSources = [_this.events];
        



            });
            this.submit = function () {
            this.$http({
                method: 'POST',
                url: '/user/modifyUser',
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
                var ur = '/user/login';
            }
            else {
                var ur = '/user/register';
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
