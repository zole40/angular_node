var Calendar;
(function (Calendar) {
    var calendarCtrl = (function () {
        function calendarCtrl($scope, $http, $window, $location, uiCalendarConfig, pageService) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
            this.$location = $location;
            this.uiCalendarConfig = uiCalendarConfig;
            this.pageService = pageService;
            /**Rerender calendar */
            this.renderCalendar = function () {
                var calendar = angular.element(document.querySelector("#calendar"));
                calendar.fullCalendar('removeEvents');
                calendar.fullCalendar('addEventSource', _this.eventSources);
            };
            /**Get user */
            this.$http.get("/user/getUser").success(function (data, status) { return _this.user = data.user; }).error(function (data, status) {
                if (status == 401)
                    _this.pageService.logout();
            });
            /**Init */
            this.eventSources = new Array();
            this.projects = new Calendar.ProjectList([], 0);
            /**Update or create task */
            this.updateTask = function (task) {
                var url = "/task/";
                _this.newTask ? url += "addTask" : url += "modifyTask";
                _this.$http({
                    method: "POST",
                    url: url,
                    data: task,
                    params: { id: _this.projects.avaible[_this.projects.selected]._id }
                }).success(function (data, status) {
                    console.log(status);
                    if (status == 204) {
                        _this.getTasks(_this.projects.avaible[_this.projects.selected]._id);
                        _this.getFreeTasks(_this.projects.avaible[_this.projects.selected]._id);
                    }
                }).error(function (data, status) {
                    if (status == 401)
                        _this.pageService.logout();
                });
            };
            /**Event click */
            this.eventClick = function (event) {
                var element = angular.element("#task");
                var task = new Calendar.Event(event.title, event._id, event.start, event.color, event.user, event.finished);
                _this.selectTask(task);
                element.modal("show");
            };
            /**Change event date */
            this.alertOnDrop = function (event, delta, revertFunc) {
                var task = new Calendar.Event(event.title, event._id, event.start, event.color, event.user, event.finished);
                _this.updateTask(task);
            };
            /**init ui config */
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
                    eventClick: this.eventClick
                }
            };
            this.ProjectUsers = new Array();
            /**change user color attribute */
            this.changeColor = function () { return (_this.$http({
                method: "POST",
                url: "/user/changeColor",
                data: { color: _this.user.color }
            }).error(function (data, status) {
                if (status == 401)
                    _this.pageService.logout();
            })); };
            /**Show admin menu */
            this.addAdminMenu = function () { return _this.adminMenu = true; };
            /**Hide admin menu */
            this.removeAdminMenu = function () { return _this.adminMenu = false; };
            this.addUserModal = function () {
                _this.$http.get("/profile").success(function (data, status) {
                    angular.element("#userModalBody").html(data);
                }).error(function (data, status) {
                    if (status == 401)
                        _this.pageService.logout();
                });
            };
            /**Update user profile */
            this.updateUser = function () {
                _this.$http({
                    method: "POST",
                    url: "/user/modifyUser",
                    data: _this.user
                }).error(function (data, status) {
                    if (status == 401)
                        _this.pageService.logout();
                });
            };
            /**Get avaible task */
            this.getFreeTasks = function (_id) {
                _this.$http({
                    method: "GET",
                    url: "task/getFreeTask",
                    params: { id: _id }
                }).success(function (data, status) {
                    _this.tasks = data.events;
                }).error(function (data, status) {
                    if (status == 401)
                        _this.pageService.logout();
                });
            };
            /**Get project users */
            this.getProjectUsers = function (_id) {
                _this.$http({
                    method: "GET",
                    url: "project/getProjectUsers",
                    params: { id: _id }
                }).success(function (data, status) {
                    _this.ProjectUsers = data.users;
                }).error(function (data, status) {
                    if (status == 401)
                        _this.pageService.logout();
                });
            };
            /**Get task */
            this.getTasks = function (_id) {
                _this.$http({
                    method: "GET",
                    url: "task/getTasks",
                    params: { id: _id }
                }).success(function (data, status) {
                    _this.eventSources = data.events;
                    _this.renderCalendar();
                }).error(function (data, status) {
                    if (status == 401)
                        _this.pageService.logout();
                });
            };
            /**Get user, tasks, freetasks */
            this.getProjectattr = function (_id) { return (_this.getProjectUsers(_id),
                _this.getTasks(_id),
                _this.getFreeTasks(_id)); };
            /**Get projects*/
            this.getProject = function () { return (_this.$http.get("/project/getProject")
                .success(function (data, status) {
                _this.projects.avaible = data.projects;
                _this.projects.selected = 0;
                _this.getProjectUsers(_this.projects.avaible[_this.projects.selected]._id);
                _this.getTasks(_this.projects.avaible[_this.projects.selected]._id);
                _this.getFreeTasks(_this.projects.avaible[_this.projects.selected]._id);
            }).error(function (data, status) {
                if (status == 401)
                    _this.pageService.logout();
            })); };
            /**Select task */
            this.selectTask = function (task) {
                task ? _this.newTask = false : _this.newTask = true;
                _this.selectedTask = task;
                console.log(_this.selectedTask);
            };
            this.removeUser = function (task) {
                _this.$http({
                    method: "POST",
                    url: "/task/removeTaskUser",
                    data: task,
                    params: { id: _this.projects.avaible[_this.projects.selected]._id }
                }).success(function (data, status) {
                    if (status == 204) {
                        task.user = "";
                        _this.tasks.push(task);
                        var index = _this.eventSources.indexOf(task);
                        _this.eventSources.splice(index, 1);
                        _this.renderCalendar();
                    }
                }).error(function (data, status) {
                    if (status == 401)
                        _this.pageService.logout();
                });
            };
            this.addUser = function (task) {
                _this.$http({
                    method: "POST",
                    url: "/task/addTaskUser",
                    data: task,
                    params: { id: _this.projects.avaible[_this.projects.selected]._id }
                }).success(function (data, status) {
                    if (status == 204) {
                        task.user = _this.user.name;
                        _this.eventSources.push(task);
                        var index = _this.tasks.indexOf(task);
                        _this.tasks.splice(index, 1);
                        _this.renderCalendar();
                    }
                }).error(function (data, status) {
                    if (status == 401)
                        _this.pageService.logout();
                });
            };
            this.taskUser = function () { return _this.selectedTask.user === _this.user.name; };
            //this.projectOwner = () => this.projects.avaible[this.projects.selected].owner === this.user.name;
            this.getProject();
        }
        return calendarCtrl;
    }());
    Calendar.calendarCtrl = calendarCtrl;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=calendarController.js.map