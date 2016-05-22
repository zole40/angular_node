var Calendar;
(function (Calendar) {
    var calendarCtrl = (function () {
        //static $inject = ['$scope','$http','uiCalendarConfig','pageService']
        function calendarCtrl($scope, $http, uiCalendarConfig, pageService) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.uiCalendarConfig = uiCalendarConfig;
            this.pageService = pageService;
            this.getAllUser = function () {
                return _this.$http({
                    method: "GET",
                    url: "/user/getAll",
                    params: { id: _this.projects.id }
                }).success(function (data) {
                    return _this.allUser = data.users;
                });
            };
            this.finishTask = function () {
                return _this.taskList.finish(_this.projects.id)
                    .success(function () {
                    _this.renderCalendar();
                });
            };
            this.getEvents = function () {
                _this.getTasks(_this.projects.id);
                _this.getFreeTasks(_this.projects.id);
                _this.getFinishedTask(_this.projects.id);
                _this.projects.change(_this.user.name);
                _this.uiConfig["calendar"].editable = _this.projects.owner;
            };
            this.deleteProject = function () { return _this.projects.delete()
                .success(function (data, status) {
                var element = angular.element("#project");
                element.modal("hide");
                _this.getEvents();
            }); };
            this.updateProject = function () {
                return _this.projects.update()
                    .success(function (data, status) {
                    if (status === 201) {
                        _this.getEvents();
                    }
                    var element = angular.element("#project");
                    element.modal("hide");
                })
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            this.selectProject = function (newProject) {
                return _this.projects.select(newProject);
            };
            this.taskList = new Calendar.taskList(this.$http, new Array(), new Array(), new Array(), new Calendar.Event(this.$http));
            this.changeProject = function () {
                _this.projects.change(_this.user.name);
                _this.getProject();
            };
            this.projects = new Calendar.ProjectList(this.$http, [], 0, "0");
            this.adminMenu = false;
            this.pageService.user.setHttp(this.$http);
            this.user = this.pageService.user;
            this.updateUser = function () {
                return _this.pageService.updateUser(_this.user).success(function () {
                    var element = angular.element("#userModal");
                    element.modal("hide");
                })
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            /**Rerender calendar */
            this.renderCalendar = function () {
                var calendar = angular.element(document.querySelector("#calendar"));
                calendar.fullCalendar('removeEvents');
                calendar.fullCalendar('addEventSource', _this.taskList.eventSources);
            };
            /**Update or create task */
            this.updateTask = function () {
                return _this.taskList.updateTask(_this.projects.id)
                    .success(function () {
                    var element = angular.element("#task");
                    element.modal("hide");
                    _this.taskList.getTasks(_this.projects.id)
                        .success(function () {
                        return _this.renderCalendar();
                    });
                })
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            /**Event click */
            this.eventClick = function (event) {
                var element = angular.element("#task");
                var task = new Calendar.Event(_this.$http);
                task.set(event);
                _this.taskList.selectTask(task);
                element.modal("show");
            };
            /**Change event date */
            this.alertOnDrop = function (event, delta, revertFunc) {
                var task = new Calendar.Event(_this.$http);
                task.set(event);
                _this.selectTask(task);
                _this.updateTask();
            };
            /**init ui config */
            this.uiConfig = {
                calendar: {
                    height: 450,
                    editable: this.projects.owner,
                    header: {
                        left: 'month basicWeek basicDay',
                        center: 'title',
                        right: 'today prev,next'
                    },
                    eventSources: this.taskList.eventSources,
                    dayClick: this.alertEventOnClick,
                    eventDrop: this.alertOnDrop,
                    eventClick: this.eventClick
                }
            };
            /**change user color attribute */
            this.changeColor = function () {
                return _this.pageService.changeUserColor(_this.user)
                    .success(function () {
                    _this.taskList.eventSources.forEach(function (element) {
                        if (element.user == _this.user.name) {
                            element.color = _this.user.color;
                            _this.renderCalendar();
                        }
                    });
                })
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            /**Get avaible task */
            this.getFreeTasks = function (_id) {
                _this.taskList.getFreeTasks(_id)
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            /**Get task */
            this.getTasks = function (_id) {
                return _this.taskList.getTasks(_id)
                    .success(function () {
                    _this.renderCalendar();
                })
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            /**Get task */
            this.getFinishedTask = function (_id) {
                return _this.taskList.getFinished(_id)
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            /**Get projects*/
            this.getProject = function () {
                return _this.projects.get()
                    .success(function (data, status) {
                    _this.getEvents();
                }).error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            /**Select task */
            this.selectTask = function (task) {
                return _this.taskList.selectTask(task);
            };
            this.removeUser = function () {
                return _this.taskList.removeUser(_this.projects.id)
                    .success(function () { return _this.renderCalendar(); })
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            this.addUser = function () {
                return _this.taskList.addUser(_this.projects.id, _this.user)
                    .success(function () { return _this.renderCalendar(); })
                    .error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            this.taskUser = function () {
                return _this.taskList.taskUser(_this.user.name);
            };
            this.getProject();
        }
        return calendarCtrl;
    }());
    Calendar.calendarCtrl = calendarCtrl;
})(Calendar || (Calendar = {}));
;
//# sourceMappingURL=calendarController.js.map