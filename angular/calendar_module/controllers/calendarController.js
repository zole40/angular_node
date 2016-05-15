var Calendar;
(function (Calendar) {
    /**
     * ProjectList
     */
    var ProjectList = (function () {
        function ProjectList() {
            this.avaible = new Array();
        }
        return ProjectList;
    }());
    var calendarCtrl = (function () {
        function calendarCtrl($scope, $http, $window, $location, uiCalendarConfig) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
            this.$location = $location;
            this.uiCalendarConfig = uiCalendarConfig;
            /**Get user */
            this.$http.get("/user/getUser").success(function (data, status) { return _this.user = data.user; });
            /**Init */
            this.eventSources = new Array();
            this.projects = new ProjectList();
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
            this.ProjectUsers = new Array();
            /**change user color attribute */
            this.changeColor = function () { return (_this.$http({
                method: "POST",
                url: "/user/changeColor",
                data: { color: _this.user.color }
            }).success(function (data, status) {
                console.log(status);
            })); };
            this.addAdminMenu = function () { return _this.adminMenu = true; };
            this.removeAdminMenu = function () { return _this.adminMenu = false; };
            this.addUserModal = function () {
                _this.$http.get("/profile").success(function (data, status) { return angular.element("#userModalBody").html(data); });
            };
            this.updateUser = function () {
                _this.$http({
                    method: "POST",
                    url: "/user/modifyUser",
                    data: _this.user
                }).success(function (data, status) {
                    console.log(status);
                });
            };
            this.getFreeTasks = function (_id) {
                _this.$http({
                    method: "GET",
                    url: "task/getFreeTask",
                    params: { id: _id }
                }).success(function (data, status) { return (_this.tasks = data.events); });
            };
            this.getProjectUsers = function (_id) {
                _this.$http({
                    method: "GET",
                    url: "project/getProjectUsers",
                    params: { id: _id }
                }).success(function (data, status) { return (_this.ProjectUsers = data.users); });
            };
            this.castDate = function (events) {
                var calendar = angular.element(document.querySelector("#calendar"));
                calendar.fullCalendar('removeEvents');
                for (var i in this.events) {
                    events[i]['_id'] = parseInt(i) + 1;
                    events[i]['start'] = new Date(events[i]['start']);
                    events[i]['end'] = new Date(events[i]['end']);
                }
                this.eventSources = events;
                calendar.fullCalendar('addEventSource', this.eventSources);
            };
            this.getTasks = function (_id) {
                _this.$http({
                    method: "GET",
                    url: "task/getTasks",
                    params: { id: _id }
                }).success(function (data, status) { return (_this.events = data.events,
                    _this.castDate(_this.events)); });
            };
            /**Get user, tasks, freetasks */
            this.getProjectattr = function (_id) { return (_this.getProjectUsers(_id),
                _this.getTasks(_id),
                _this.getFreeTasks(_id)); };
            /**Get projects*/
            this.getProject = function () { return (_this.$http.get("/project/getProject")
                .success(function (data, status) { return (_this.projects.avaible = data.projects,
                _this.projects.selected = _this.projects.avaible[0]._id,
                _this.getProjectUsers(_this.projects.selected),
                _this.getTasks(_this.projects.selected),
                _this.getFreeTasks(_this.projects.selected)); })); };
            this.selectTask = function (task) { _this.selectedTask = task; console.log(task); };
            this.updateTask = function () {
                _this.$http({
                    method: "POST",
                    url: "/task/modifyTask",
                    data: _this.selectedTask,
                    params: { id: _this.projects.selected }
                }).success(function (data, status) {
                    console.log(status);
                });
            };
            this.getProject();
        }
        return calendarCtrl;
    }());
    Calendar.calendarCtrl = calendarCtrl;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=calendarController.js.map