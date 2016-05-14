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
            /**Init evensources */
            this.eventSources = new Array();
            this.projects = new ProjectList();
            /**Init uiConfig */
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
            /**change user color attribute */
            this.changeColor = function () { return (_this.$http({
                method: "POST",
                url: "/user/changeColor",
                data: { color: _this.color.color }
            }).success(function (data, status) {
                console.log(status);
            })); };
            this.getProject = function () { return (_this.$http.get("/project/getProject")
                .success(function (data, status) { return _this.projects.avaible = data.projects; })); };
            this.getProject();
        }
        return calendarCtrl;
    }());
    Calendar.calendarCtrl = calendarCtrl;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=calendarController.js.map