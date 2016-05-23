var Calendar;
(function (Calendar) {
    var Event = (function () {
        function Event($http) {
            var _this = this;
            this.$http = $http;
            this.delete = function (id) {
                return _this.$http({
                    method: "POST",
                    url: "/task/deleteTask",
                    data: { id: _this._id },
                    params: { id: id }
                });
            };
            this.addUser = function (id) { return _this.$http({
                method: "POST",
                url: "/task/addTaskUser",
                data: _this,
                params: { id: id }
            }); };
            this.removeUser = function (id) { return _this.$http({
                method: "POST",
                url: "/task/removeTaskUser",
                data: _this,
                params: { id: id }
            }); };
            this.set = function (task) {
                _this.title = task.title;
                _this._id = task._id;
                _this.start = task.start;
                _this.color = task.color;
                _this.user = task.user;
                _this.finished = task.finished;
                _this.description = task.description;
            };
            this.update = function (id, url) {
                return _this.$http({
                    method: "POST",
                    url: url,
                    data: _this,
                    params: { id: id }
                });
            };
            this.finish = function (id) {
                return _this.$http({
                    method: "POST",
                    url: "/task/finish",
                    data: { task: _this },
                    params: { id: id }
                });
            };
        }
        Event.$inject = ["$http"];
        return Event;
    }());
    Calendar.Event = Event;
})(Calendar || (Calendar = {}));

var Calendar;
(function (Calendar) {
    var ProjectList = (function () {
        function ProjectList($http, avaible, selected, id) {
            var _this = this;
            this.$http = $http;
            this.avaible = avaible;
            this.selected = selected;
            this.id = id;
            this.get = function () { return _this.$http.get("/project/getProject")
                .success(function (data, status) {
                _this.avaible = [];
                data.projects.forEach(function (element) {
                    var project = new Calendar.Project(_this.$http);
                    project.set(element);
                    _this.avaible.push(project);
                });
                _this.id = _this.avaible[_this.selected]._id;
            }); };
            this.getUsers = function () { return _this.avaible[_this.selected] ? _this.avaible[_this.selected].users : undefined; };
            this.change = function (userName) {
                for (var i in _this.avaible) {
                    if (_this.avaible[i]._id === _this.id) {
                        _this.selected = _this.avaible.indexOf(_this.avaible[i]);
                    }
                }
                if (_this.avaible[_this.selected]) {
                    _this.owner = userName === _this.avaible[_this.selected].owner;
                }
            };
            this.select = function (newProject) {
                _this.newP = newProject;
                _this.newP ?
                    _this.selectedP = new Calendar.Project(_this.$http) : _this.selectedP = _this.avaible[_this.selected];
            };
            this.update = function () {
                var url = "/project/";
                _this.newP ?
                    url += "addProject" : url += "modifyProject";
                return _this.selectedP.update(url)
                    .success(function (data, status) {
                    if (status == 201) {
                        var project = new Calendar.Project(_this.$http);
                        project.set(data.project);
                        _this.avaible.push(project);
                        _this.selected = _this.avaible.length - 1;
                        _this.id = project._id;
                    }
                });
            };
            this.delete = function () {
                return _this.$http({
                    method: "POST",
                    url: "/project/deleteProject",
                    data: {},
                    params: { id: _this.selectedP._id }
                }).success(function (data, status) {
                    _this.avaible.splice(_this.avaible.indexOf(_this.selectedP, 1));
                    if (_this.avaible.length) {
                        if (_this.selected > _this.avaible.length - 1) {
                            _this.selected -= 1;
                        }
                        _this.id = _this.avaible[_this.selected]._id;
                    }
                    else {
                        _this.selected = 0;
                        _this.id = "";
                    }
                });
            };
        }
        ProjectList.$inject = ["$http", "avaible", "selected", "id"];
        return ProjectList;
    }());
    Calendar.ProjectList = ProjectList;
})(Calendar || (Calendar = {}));
;

var Calendar;
(function (Calendar) {
    var Project = (function () {
        function Project($http) {
            var _this = this;
            this.$http = $http;
            this.set = function (project) {
                _this._id = project._id;
                _this.title = project.title;
                _this.owner = project.owner;
                _this.users = project.users;
                _this.description = project.description;
            };
            this.update = function (url) {
                return _this.$http({
                    method: "POST",
                    url: url,
                    data: { project: _this },
                    params: { id: _this._id }
                });
            };
        }
        Project.$inject = ["$http"];
        return Project;
    }());
    Calendar.Project = Project;
})(Calendar || (Calendar = {}));

var Calendar;
(function (Calendar) {
    var taskList = (function () {
        function taskList($http, eventSources, tasks, finished, selectedTask) {
            var _this = this;
            this.$http = $http;
            this.eventSources = eventSources;
            this.tasks = tasks;
            this.finished = finished;
            this.selectedTask = selectedTask;
            this.deleteTask = function (id) {
                return _this.selectedTask.delete(id)
                    .success(function () {
                    var index = _this.tasks.indexOf(_this.selectedTask);
                    if (index > -1) {
                        _this.tasks.splice(index, 1);
                    }
                    else {
                        index = _this.finished.indexOf(_this.selectedTask);
                        if (index > -1) {
                            _this.finished.splice(index, 1);
                        }
                    }
                });
            };
            this.getFreeTasks = function (id) { return _this.$http({
                method: "GET",
                url: "task/getFreeTask",
                params: { id: id }
            }).success(function (data, status) {
                _this.tasks = [];
                data.events.forEach(function (element) {
                    var task = new Calendar.Event(_this.$http);
                    task.set(element);
                    _this.tasks.push(task);
                });
            }); };
            this.getTasks = function (_id) { return _this.$http({
                method: "GET",
                url: "task/getTasks",
                params: { id: _id }
            }).success(function (data, status) {
                _this.eventSources = [];
                data.events.forEach(function (element) {
                    var task = new Calendar.Event(_this.$http);
                    task.set(element);
                    _this.eventSources.push(task);
                });
            }); };
            this.getFinished = function (_id) { return _this.$http({
                method: "GET",
                url: "task/getFinished",
                params: { id: _id }
            }).success(function (data, status) {
                _this.finished = [];
                data.events.forEach(function (element) {
                    var task = new Calendar.Event(_this.$http);
                    task.set(element);
                    _this.finished.push(task);
                });
            }); };
            this.removeUser = function (id) {
                return _this.selectedTask.removeUser(id)
                    .success(function (data, status) {
                    if (status == 204) {
                        var index_1;
                        _this.eventSources.forEach(function (element) {
                            if (element._id === _this.selectedTask._id)
                                index_1 = _this.eventSources.indexOf(element);
                        });
                        _this.selectedTask.user = "";
                        _this.eventSources[index_1].user = "";
                        _this.tasks.push(_this.eventSources[index_1]);
                        _this.eventSources.splice(index_1, 1);
                    }
                });
            };
            this.addUser = function (id, user) {
                return _this.selectedTask.addUser(id)
                    .success(function (data, status) {
                    if (status == 204) {
                        _this.selectedTask.user = user.name;
                        _this.selectedTask.color = user.color;
                        _this.eventSources.push(_this.selectedTask);
                        var index = _this.tasks.indexOf(_this.selectedTask);
                        _this.tasks.splice(index, 1);
                    }
                });
            };
            this.taskUser = function (userName) { return _this.selectedTask.user === userName; };
            this.selectTask = function (task) {
                task ?
                    _this.newTask = false : _this.newTask = true;
                if (_this.newTask) {
                    _this.selectedTask = new Calendar.Event(_this.$http);
                }
                else {
                    _this.selectedTask = task;
                    _this.selectedTask.start = new Date(_this.selectedTask.start.toString());
                }
            };
            this.updateTask = function (id) {
                var url = "/task/";
                _this.newTask ? url += "addTask" : url += "modifyTask";
                return _this.selectedTask.update(id, url)
                    .success(function (data, status) {
                    if (status === 201) {
                        var event_1 = new Calendar.Event(_this.$http);
                        event_1.set(data.task);
                        _this.tasks.push(event_1);
                    }
                });
            };
            this.finish = function (id) {
                return _this.selectedTask.finish(id)
                    .success(function () {
                    if (_this.selectedTask.finished) {
                        var index_2;
                        _this.eventSources.forEach(function (element) {
                            if (element._id === _this.selectedTask._id)
                                index_2 = _this.eventSources.indexOf(element);
                        });
                        _this.finished.push(_this.eventSources[index_2]);
                        _this.eventSources.splice(index_2, 1);
                    }
                    else {
                        var index_3;
                        _this.finished.forEach(function (element) {
                            if (element._id === _this.selectedTask._id)
                                index_3 = _this.finished.indexOf(element);
                        });
                        _this.eventSources.push(_this.finished[index_3]);
                        _this.finished.splice(index_3, 1);
                    }
                });
            };
        }
        taskList.$inject = ["$http", "eventSources", "tasks", "finished", "selectedTask"];
        return taskList;
    }());
    Calendar.taskList = taskList;
})(Calendar || (Calendar = {}));
;

var Calendar;
(function (Calendar) {
    var User = (function () {
        function User() {
            var _this = this;
            this.set = function (user) {
                _this._id = user._id;
                _this.address = user.address;
                _this.color = user.color;
                _this.email = user.email;
                _this.name = user.name;
                _this.password = user.password;
            };
            this.setHttp = function (http) { return _this.$http = http; };
            /**Update user profile */
            this.update = function () { return _this.$http({
                method: "POST",
                url: "/user/modifyUser",
                data: _this
            }); };
            this.changeColor = function () { return _this.$http({
                method: "POST",
                url: "/user/changeColor",
                data: { color: _this.color }
            }); };
        }
        return User;
    }());
    Calendar.User = User;
})(Calendar || (Calendar = {}));

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

var Calendar;
(function (Calendar) {
    var calendarCtrl = (function () {
        function calendarCtrl($scope, $http, pageService) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.pageService = pageService;
            this.deleteTask = function () {
                return _this.taskList.deleteTask(_this.projects.id)
                    .success(function () {
                    _this.taskList.getTasks(_this.projects.id)
                        .success(function () {
                        return _this.renderCalendar();
                    }).error(function (data, status) {
                        if (status == 401) {
                            _this.pageService.logout();
                        }
                    });
                    var element = angular.element("#task");
                    element.modal("hide");
                }).error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            this.selectChange = function () {
                _this.selectedUsers = new Array();
                if (_this.select === 'add') {
                    _this.getAllUser();
                }
                else if (_this.select === 'remove') {
                    _this.allUser = new Array();
                    _this.projects.avaible[_this.projects.selected].users.forEach(function (element) {
                        _this.allUser.push(element);
                    });
                }
            };
            this.select = "add";
            this.addProjectUser = function () {
                _this.$http({
                    method: "POST",
                    url: "/project/addUser",
                    data: { users: _this.selectedUsers },
                    params: { id: _this.projects.id }
                }).success(function () {
                    _this.selectedUsers.forEach(function (element) {
                        _this.projects.avaible[_this.projects.selected].users.push(element);
                    });
                    _this.selectedUsers = new Array();
                    var element = angular.element("#add_user");
                    element.modal("hide");
                }).error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            this.removeProjectUser = function () {
                _this.$http({
                    method: "POST",
                    url: "/project/deleteUser",
                    data: { users: _this.selectedUsers },
                    params: { id: _this.projects.id }
                }).success(function () {
                    _this.selectedUsers.forEach(function (element) {
                        _this.selectedUsers.forEach(function (element2) {
                            _this.projects.avaible[_this.projects.selected].users.forEach(function (element) {
                                if (element === element2) {
                                    _this.projects.avaible[_this.projects.selected].users.splice(_this.projects.avaible[_this.projects.selected].users.indexOf(element2), 1);
                                    return;
                                }
                            });
                        });
                    });
                    _this.selectedUsers = new Array();
                    var element = angular.element("#add_user");
                    element.modal("hide");
                }).error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            this.allUser = new Array();
            this.selectedUsers = new Array();
            this.selectUser = function () {
                _this.selectedUsers.push(_this.userName);
                _this.allUser.splice(_this.allUser.indexOf(_this.userName), 1);
                _this.allUser.length ? _this.userName = _this.allUser[0] : _this.userName = "";
            };
            this.getAllUser = function () {
                return _this.$http({
                    method: "GET",
                    url: "/user/getAll"
                }).success(function (data) {
                    _this.allUser = new Array();
                    data.users.forEach((function (element) {
                        _this.allUser.push(element.name);
                    }));
                    _this.projects.avaible[_this.projects.selected].users.forEach(function (element) {
                        _this.allUser.forEach(function (element2) {
                            if (element === element2) {
                                _this.allUser.splice(_this.allUser.indexOf(element2), 1);
                                return;
                            }
                        });
                    });
                    _this.allUser.splice(_this.allUser.indexOf(_this.user.name), 1);
                }).error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
                });
            };
            this.finishTask = function () {
                _this.taskList.finish(_this.projects.id)
                    .success(function () {
                    _this.renderCalendar();
                }).error(function (data, status) {
                    if (status == 401) {
                        _this.pageService.logout();
                    }
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
            }).error(function (data, status) {
                if (status == 401) {
                    _this.pageService.logout();
                }
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
                    }).error(function (data, status) {
                        if (status == 401) {
                            _this.pageService.logout();
                        }
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
        calendarCtrl.$inject = ['$scope', '$http', 'pageService'];
        return calendarCtrl;
    }());
    Calendar.calendarCtrl = calendarCtrl;
})(Calendar || (Calendar = {}));
;

var Calendar;
(function (Calendar) {
    var loginCtrl = (function () {
        function loginCtrl($scope, $http, $window, $location, pageService) {
            this.$scope = $scope;
            this.$http = $http;
            this.$window = $window;
            this.$location = $location;
            this.pageService = pageService;
            this.login = true;
        }
        loginCtrl.prototype.loginPanel = function () {
            this.login = true;
            this.reg = false;
        };
        loginCtrl.prototype.regPanel = function () {
            this.login = false;
            this.reg = true;
        };
        loginCtrl.prototype.submit = function () {
            var _this = this;
            if (this.login) {
                var url = '/user/login';
            }
            else {
                var url = '/user/register';
            }
            this.$http.post(url, this.user).success(function (data, status) {
                console.log(status);
                if (status === 200) {
                    console.log(data);
                    _this.pageService.login(data.user);
                }
                else if (status === 401) {
                    _this.pageService.logout();
                }
            });
        };
        loginCtrl.$inject = ['$scope', '$http', '$window', '$location', 'pageService'];
        return loginCtrl;
    }());
    Calendar.loginCtrl = loginCtrl;
})(Calendar || (Calendar = {}));

var Calendar;
(function (Calendar) {
    var pageCtrl = (function () {
        function pageCtrl($scope, pageService, $http) {
            var _this = this;
            this.$scope = $scope;
            this.pageService = pageService;
            this.$http = $http;
            this.isAuthorized = this.pageService.isAuthorized;
            this.logout = function () {
                _this.$http.post("/user/logout", FormData = null).success(function (data, status) {
                    if (status == 200)
                        _this.pageService.logout();
                    console.log(status);
                });
            };
            this.$http.get("/user/getUser")
                .success(function (data) { return _this.pageService.login(data.user); })
                .error(function () { return _this.pageService.logout(); });
        }
        pageCtrl.$inject = ['$scope', 'pageService', '$http'];
        return pageCtrl;
    }());
    Calendar.pageCtrl = pageCtrl;
})(Calendar || (Calendar = {}));

var Calendar;
(function (Calendar) {
    var CalendarApp = (function () {
        function CalendarApp(angularModule) {
            this.angularModule = angularModule;
        }
        CalendarApp.$inject = ["angularModule"];
        return CalendarApp;
    }());
    Calendar.CalendarApp = CalendarApp;
    function start() {
        Calendar.calendar = new CalendarApp(angular.module("calendar", ["ui.calendar", "ngMaterial", "color.picker"])
            .controller("calendarCtrl", Calendar.calendarCtrl)
            .controller("loginCtrl", Calendar.loginCtrl)
            .controller("pageCtrl", Calendar.pageCtrl)
            .service("pageService", Calendar.pageService));
    }
    Calendar.start = start;
})(Calendar || (Calendar = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVscy9ldmVudE1vZGVsLnRzIiwibW9kZWxzL3Byb2plY3RMaXN0LnRzIiwibW9kZWxzL3Byb2plY3RNb2RlbC50cyIsIm1vZGVscy90YXNrTGlzdC50cyIsIm1vZGVscy91c2VyTW9kZWwudHMiLCJzZXJ2aWNlcy9wYWdlU2VydmljZS50cyIsImNvbnRyb2xsZXJzL2NhbGVuZGFyQ29udHJvbGxlci50cyIsImNvbnRyb2xsZXJzL2xvZ2luQ29udHJvbGxlci50cyIsImNvbnRyb2xsZXJzL3BhZ2VDb250cm9sbGVyLnRzIiwiY2FsZW5kYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxRQUFRLENBK0RkO0FBL0RELFdBQU8sUUFBUSxFQUFBLENBQUM7SUFDZjtRQWVDLGVBQW9CLEtBQXVCO1lBZjVDLGlCQTZESTtZQTlDaUIsVUFBSyxHQUFMLEtBQUssQ0FBa0I7WUFFakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFDLEVBQVc7Z0JBQ3RCLE9BQUEsS0FBSSxDQUFDLEtBQUssQ0FBQztvQkFDUixNQUFNLEVBQUcsTUFBTTtvQkFDZixHQUFHLEVBQUcsa0JBQWtCO29CQUN4QixJQUFJLEVBQUcsRUFBRSxFQUFFLEVBQUcsS0FBSSxDQUFDLEdBQUcsRUFBQztvQkFDdkIsTUFBTSxFQUFHLEVBQUMsRUFBRSxFQUFHLEVBQUUsRUFBQztpQkFDcEIsQ0FBQztZQUxGLENBS0UsQ0FBQztZQUNQLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBQyxFQUFXLElBQU0sT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNuRCxNQUFNLEVBQUUsTUFBTTtnQkFDZCxHQUFHLEVBQUcsbUJBQW1CO2dCQUN6QixJQUFJLEVBQUcsS0FBSTtnQkFDWCxNQUFNLEVBQUcsRUFBQyxFQUFFLEVBQUcsRUFBRSxFQUFDO2FBQ1YsQ0FBQyxFQUwrQixDQUsvQixDQUFDO1lBQ0gsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFDLEVBQVcsSUFBSyxPQUFBLEtBQUksQ0FB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QUFRLEtBQVIsUUFBUSxRQXFCZDs7QUNyQkQsSUFBTyxRQUFRLENBY2Q7QUFkRCxXQUFPLFFBQVEsRUFBQyxDQUFDO0lBQ2I7UUFFSSxxQkFBbUIsYUFBeUI7WUFBekIsa0JBQWEsR0FBYixhQUFhLENBQVk7UUFBSSxDQUFDO1FBRDFDLG1CQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUV2QyxrQkFBQztJQUFELENBSEEsQUFHQyxJQUFBO0lBSFksb0JBQVcsY0FHdkIsQ0FBQTtJQUdEO1FBQ0ksaUJBQVEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsY0FBYyxDQUFDLENBQUM7YUFDN0YsVUFBVSxDQUFDLGNBQWMsRUFBRSxxQkFBWSxDQUFDO2FBQ3hDLFVBQVUsQ0FBQyxXQUFXLEVBQUMsa0JBQVMsQ0FBQzthQUNqQyxVQUFVLENBQUMsVUFBVSxFQUFDLGlCQUFRLENBQUM7YUFDL0IsT0FBTyxDQUFDLGFBQWEsRUFBQyxvQkFBVyxDQUFDLENBQUMsQ0FBQTtJQUM1QyxDQUFDO0lBTmUsY0FBSyxRQU1wQixDQUFBO0FBQ0wsQ0FBQyxFQWRNLFFBQVEsS0FBUixRQUFRLFFBY2QiLCJmaWxlIjoiY2FsZW5kYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgQ2FsZW5kYXJ7XHJcblx0ZXhwb3J0IGNsYXNzIEV2ZW50IHtcclxuICAgICAgICBhZGRVc2VyOiAoaWQgOiBzdHJpbmcpID0+IG5nLklIdHRwUHJvbWlzZTxFdmVudD47XHJcbiAgICAgICAgcmVtb3ZlVXNlcjogKGlkIDogc3RyaW5nKSA9PiBuZy5JSHR0cFByb21pc2U8RXZlbnQ+O1xyXG4gICAgICAgIHVwZGF0ZTogKGlkOiBzdHJpbmcsIHVybCA6IHN0cmluZykgPT4gbmcuSUh0dHBQcm9taXNlPEV2ZW50PjtcclxuICAgICAgICBmaW5pc2g6IChpZDogc3RyaW5nKSA9PiBuZy5JSHR0cFByb21pc2U8RXZlbnQ+O1xyXG4gICAgICAgIGRlbGV0ZTogKGlkOiBzdHJpbmcpID0+IG5nLklIdHRwUHJvbWlzZTxFdmVudD47XHJcbiAgICAgICAgc2V0OiAodGFzayA6IEV2ZW50KSA9PiB2b2lkO1xyXG4gICAgICAgIHRpdGxlIDogc3RyaW5nO1xyXG4gICAgICAgIF9pZCA6IHN0cmluZztcclxuICAgICAgICBzdGFydCA6IERhdGU7XHJcbiAgICAgICAgY29sb3IgOiBzdHJpbmc7XHJcbiAgICAgICAgdXNlciA6IHN0cmluZztcclxuICAgICAgICBmaW5pc2hlZCA6IGJvb2xlYW47XHJcbiAgICAgICAgZGVzY3JpcHRpb24gOiBzdHJpbmc7XHJcbiAgICAgICAgc3RhdGljICRpbmplY3QgPSBbXCIkaHR0cFwiXTtcclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgJGh0dHAgOiBuZy5JSHR0cFNlcnZpY2UpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlID0gKGlkIDogc3RyaW5nKSA9PiBcclxuICAgICAgICAgICAgICAgIHRoaXMuJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kIDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICB1cmwgOiBcIi90YXNrL2RlbGV0ZVRhc2tcIixcclxuICAgICAgICAgICAgICAgICAgIGRhdGEgOiB7IGlkIDogdGhpcy5faWR9LFxyXG4gICAgICAgICAgICAgICAgICAgcGFyYW1zIDoge2lkIDogaWR9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5hZGRVc2VyID0gKGlkIDogc3RyaW5nKSA9PiAgdGhpcy4kaHR0cCh7XHJcblx0XHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdFx0dXJsIDogXCIvdGFzay9hZGRUYXNrVXNlclwiLFxyXG5cdFx0XHRcdFx0ZGF0YSA6IHRoaXMsXHJcblx0XHRcdFx0XHRwYXJhbXMgOiB7aWQgOiBpZH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVXNlciA9IChpZCA6IHN0cmluZykgPT4gdGhpcy4kaHR0cCh7XHJcblx0XHRcdFx0XHRtZXRob2Q6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdFx0dXJsIDogXCIvdGFzay9yZW1vdmVUYXNrVXNlclwiLFxyXG5cdFx0XHRcdFx0ZGF0YSA6IHRoaXMsXHJcblx0XHRcdFx0XHRwYXJhbXMgOiB7aWQgOiBpZH1cclxuXHRcdFx0fSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldCA9ICh0YXNrIDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUgPSB0YXNrLnRpdGxlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faWQgPSB0YXNrLl9pZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQgPSB0YXNrLnN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvciA9IHRhc2suY29sb3I7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXIgPSB0YXNrLnVzZXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaGVkID0gdGFzay5maW5pc2hlZDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0YXNrLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSA9IChpZCA6IHN0cmluZywgdXJsIDogc3RyaW5nKSA9PiBcclxuICAgICAgICAgICAgICAgIHRoaXMuJGh0dHAoe1xyXG5cdFx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcclxuXHRcdFx0XHRcdHVybCA6IHVybCxcclxuXHRcdFx0XHRcdGRhdGEgOiB0aGlzLFxyXG5cdFx0XHRcdFx0cGFyYW1zIDoge2lkIDogaWR9XHJcblx0XHRcdH0pO1xyXG4gICAgICAgICAgICB0aGlzLmZpbmlzaCA9IChpZCA6IHN0cmluZykgPT5cclxuICAgICAgICAgICAgICAgIHRoaXMuJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZCA6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA6IFwiL3Rhc2svZmluaXNoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA6IHt0YXNrIDogdGhpc30sXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zIDoge2lkIDogaWR9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAiLCJtb2R1bGUgQ2FsZW5kYXJ7XHJcbiAgICBleHBvcnQgY2xhc3MgUHJvamVjdExpc3R7XHJcbiAgICAgICAgYWRkOiAocHJvamVjdCA6IFByb2plY3QpID0+IG5nLklIdHRwUHJvbWlzZTxQcm9qZWN0PjtcclxuICAgICAgICByZW1vdmU6IChwcm9qZWN0IDogUHJvamVjdCkgPT4gbmcuSUh0dHBQcm9taXNlPFByb2plY3Q+O1xyXG4gICAgICAgIGdldDogKCkgPT4gbmcuSUh0dHBQcm9taXNlPFByb2plY3Q+O1xyXG4gICAgICAgIGdldFVzZXJzOiAoKSA9PiBBcnJheTxzdHJpbmc+O1xyXG4gICAgICAgIHNlbGVjdGVkUCA6IFByb2plY3Q7XHJcbiAgICAgICAgZGVsZXRlOiAoKSA9PiBuZy5JSHR0cFByb21pc2U8UHJvamVjdD47XHJcbiAgICAgICAgY2hhbmdlOiAodXNlck5hbWUgOnN0cmluZykgPT4gdm9pZDtcclxuICAgICAgICB1cGRhdGU6ICgpID0+IG5nLklIdHRwUHJvbWlzZTxQcm9qZWN0PjtcclxuICAgICAgICBzZWxlY3Q6IChuZXdQcm9qZWN0IDogYm9vbGVhbikgPT4gdm9pZDtcclxuICAgICAgICBvd25lcjogYm9vbGVhbjtcclxuICAgICAgICBuZXdQOiBib29sZWFuIDtcclxuICAgICAgICBzdGF0aWMgJGluamVjdCA9IFtcIiRodHRwXCIsXCJhdmFpYmxlXCIsXCJzZWxlY3RlZFwiLFwiaWRcIl07XHJcbiAgIFx0XHRjb25zdHJ1Y3Rvcihwcml2YXRlICRodHRwIDogbmcuSUh0dHBTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpYyBhdmFpYmxlIDogQXJyYXk8UHJvamVjdD4sXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGljIHNlbGVjdGVkIDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpYyBpZDogc3RyaW5nKXtcclxuICAgICAgICAgICAgIHRoaXMuZ2V0ID0gKCkgPT4gdGhpcy4kaHR0cC5nZXQoXCIvcHJvamVjdC9nZXRQcm9qZWN0XCIpXHJcbiAgICAgICAgICAgICAgICAuc3VjY2VzcygoZGF0YSA6IGFueSAsIHN0YXR1cyA6IG51bWJlcikgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlibGUgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnByb2plY3RzLmZvckVhY2goIChlbGVtZW50KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByb2plY3QgPSBuZXcgUHJvamVjdCh0aGlzLiRodHRwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdC5zZXQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXZhaWJsZS5wdXNoKHByb2plY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcblx0XHRcdFx0XHR0aGlzLmlkID0gdGhpcy5hdmFpYmxlWyAgdGhpcy5zZWxlY3RlZF0uX2lkOyBcclxuICAgICAgICAgICAgICAgIH0pOyBcclxuICAgICAgIFx0XHQgdGhpcy5nZXRVc2VycyA9ICgpID0+IHRoaXMuYXZhaWJsZVt0aGlzLnNlbGVjdGVkXSA/IHRoaXMuYXZhaWJsZVt0aGlzLnNlbGVjdGVkXS51c2VycyA6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgdGhpcy5jaGFuZ2UgPSAodXNlck5hbWUgOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICBmb3IgKGxldCBpIGluIHRoaXMuYXZhaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuYXZhaWJsZVtpXS5faWQgPT09IHRoaXMuaWQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5hdmFpYmxlLmluZGV4T2YodGhpcy5hdmFpYmxlW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgaWYodGhpcy5hdmFpYmxlW3RoaXMuc2VsZWN0ZWRdKXtcclxuICAgICAgICAgICAgICAgICAgIHRoaXMub3duZXIgPSB1c2VyTmFtZSA9PT0gdGhpcy5hdmFpYmxlW3RoaXMuc2VsZWN0ZWRdLm93bmVyICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ID0gKCBuZXdQcm9qZWN0IDogYm9vbGVhbikgPT57XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5ld1AgPSBuZXdQcm9qZWN0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdQID8gXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFAgPSBuZXcgUHJvamVjdCh0aGlzLiRodHRwKSA6IHRoaXMuc2VsZWN0ZWRQID0gdGhpcy5hdmFpYmxlW3RoaXMuc2VsZWN0ZWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlID0gKCkgPT4gXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCB1cmwgPSBcIi9wcm9qZWN0L1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdQID9cclxuICAgICAgICAgICAgICAgICAgICB1cmwgKz0gXCJhZGRQcm9qZWN0XCIgOiB1cmwgKz0gXCJtb2RpZnlQcm9qZWN0XCI7XHJcbiAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkUC51cGRhdGUodXJsKVxyXG4gICAgICAgICAgICAgICAgLnN1Y2Nlc3MoKGRhdGEgOiBhbnkgLCBzdGF0dXMgOiBudW1iZXIpID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhdHVzID09IDIwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJvamVjdCA9IG5ldyBQcm9qZWN0KHRoaXMuJGh0dHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9qZWN0LnNldChkYXRhLnByb2plY3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlibGUucHVzaChwcm9qZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRoaXMuYXZhaWJsZS5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkID0gcHJvamVjdC5faWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlID0gKCkgPT5cclxuICAgICAgICAgICAgICAgICB0aGlzLiRodHRwKHtcclxuICAgICAgICAgICAgICAgICAgICAgbWV0aG9kIDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvcHJvamVjdC9kZWxldGVQcm9qZWN0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgICBwYXJhbXMgOiB7aWQgOiB0aGlzLnNlbGVjdGVkUC5faWR9XHJcbiAgICAgICAgICAgICAgICAgfSkuc3VjY2VzcyggKGRhdGEgOiBhbnksIHN0YXR1cyA6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICB0aGlzLmF2YWlibGUuc3BsaWNlKHRoaXMuYXZhaWJsZS5pbmRleE9mKHRoaXMuc2VsZWN0ZWRQLDEpKTtcclxuICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5hdmFpYmxlLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWQgPiB0aGlzLmF2YWlibGUubGVuZ3RoIC0gMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkIC09IDE7ICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5hdmFpYmxlW3RoaXMuc2VsZWN0ZWRdLl9pZDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICB9KTsgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgfTsiLCJtb2R1bGUgQ2FsZW5kYXJ7XHJcbiAgICBleHBvcnQgY2xhc3MgUHJvamVjdHtcclxuICAgICAgICBfaWQgOiBzdHJpbmc7XHJcbiAgICAgICAgdGl0bGUgOiBzdHJpbmc7XHJcbiAgICAgICAgb3duZXIgOiBzdHJpbmc7XHJcbiAgICAgICAgdXNlcnMgOiBBcnJheTxzdHJpbmc+O1xyXG4gICAgICAgIGRlc2NyaXB0aW9uIDogc3RyaW5nO1xyXG4gICAgICAgIHNldDogKHByb2plY3QgOiBQcm9qZWN0KSA9PiB2b2lkO1xyXG4gICAgICAgIHVwZGF0ZTogKHVybCA6IHN0cmluZykgPT4gbmcuSUh0dHBQcm9taXNlPFByb2plY3Q+O1xyXG4gICAgICAgIHN0YXRpYyAkaW5qZWN0ID0gW1wiJGh0dHBcIl07XHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSAkaHR0cCA6IG5nLklIdHRwU2VydmljZSl7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0ID0gKHByb2plY3QgOiBQcm9qZWN0KSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IHByb2plY3QuX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aXRsZSA9IHByb2plY3QudGl0bGU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm93bmVyID0gcHJvamVjdC5vd25lcjtcclxuICAgICAgICAgICAgICAgIHRoaXMudXNlcnMgPSBwcm9qZWN0LnVzZXJzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHByb2plY3QuZGVzY3JpcHRpb247ICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlID0gKHVybCA6IHN0cmluZykgPT4gXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRodHRwKHtcclxuICAgICAgICAgICAgICAgICAgIG1ldGhvZCA6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgdXJsIDogdXJsLCBcclxuICAgICAgICAgICAgICAgICAgIGRhdGE6IHtwcm9qZWN0IDogdGhpcyB9LFxyXG4gICAgICAgICAgICAgICAgICAgcGFyYW1zIDoge2lkIDogdGhpcy5faWR9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibW9kdWxlIENhbGVuZGFye1xyXG4gICAgZXhwb3J0IGNsYXNzIHRhc2tMaXN0e1xyXG4gICAgICAgIGdldEZyZWVUYXNrczogKGlkIDogc3RyaW5nKSA9PiBuZy5JSHR0cFByb21pc2U8RXZlbnQ+O1xyXG4gICAgICAgIGdldFRhc2tzOiAoaWQgOiBzdHJpbmcpID0+IG5nLklIdHRwUHJvbWlzZTxFdmVudD47XHJcbiAgICAgICAgZGVsZXRlVGFzazogKGlkIDogc3RyaW5nKSA9PiBuZy5JSHR0cFByb21pc2U8RXZlbnQ+O1xyXG4gICAgICAgIGdldEZpbmlzaGVkOiAoaWQgOiBzdHJpbmcpID0+IG5nLklIdHRwUHJvbWlzZTxFdmVudD47XHJcbiAgICAgICAgcmVtb3ZlVXNlcjogKGlkIDogc3RyaW5nKSA9PiBuZy5JSHR0cFByb21pc2U8RXZlbnQ+O1xyXG4gICAgICAgIGFkZFVzZXI6IChpZCA6IHN0cmluZyx1c2VyIDogVXNlcikgPT4gbmcuSUh0dHBQcm9taXNlPEV2ZW50PjtcclxuICAgICAgICB0YXNrVXNlcjogKHVzZXJOYW1lIDogc3RyaW5nKSA9PiBib29sZWFuO1xyXG4gICAgICAgIG5ld1Rhc2s6IGJvb2xlYW47XHJcbiAgICAgICAgdXBkYXRlVGFzazogKCBpZCA6IHN0cmluZykgPT4gbmcuSUh0dHBQcm9taXNlPEV2ZW50PjsgXHJcbiAgICAgICAgc2VsZWN0VGFzazogKHRhc2sgOiBFdmVudCkgPT4gdm9pZDtcclxuICAgICAgICBmaW5pc2g6ICggaWQgOiBzdHJpbmcpID0+IG5nLklIdHRwUHJvbWlzZTxFdmVudD47XHJcbiAgICAgICAgc3RhdGljICRpbmplY3QgPSBbXCIkaHR0cFwiLFwiZXZlbnRTb3VyY2VzXCIsXCJ0YXNrc1wiLFwiZmluaXNoZWRcIixcInNlbGVjdGVkVGFza1wiXTtcclxuICAgXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgJGh0dHAgOiBuZy5JSHR0cFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGljIGV2ZW50U291cmNlcyA6IEFycmF5PEV2ZW50PixcclxuICAgICAgICAgICAgICAgICAgICBwdWJsaWMgdGFza3MgOiBBcnJheTxFdmVudD4sXHJcbiAgICAgICAgICAgICAgICAgICAgcHVibGljIGZpbmlzaGVkIDogQXJyYXk8RXZlbnQ+LFxyXG4gICAgICAgICAgICAgICAgICAgIHB1YmxpYyBzZWxlY3RlZFRhc2s6IEV2ZW50KXsgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVRhc2sgPSAoaWQgOiBzdHJpbmcpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRhc2suZGVsZXRlKGlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcygoKSA9PiBcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy50YXNrcy5pbmRleE9mKHRoaXMuc2VsZWN0ZWRUYXNrKSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGluZGV4ID4gLTEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFza3Muc3BsaWNlKGluZGV4LDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLmZpbmlzaGVkLmluZGV4T2YodGhpcy5zZWxlY3RlZFRhc2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGluZGV4ID4gLTEpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaGVkLnNwbGljZShpbmRleCwxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOyAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0RnJlZVRhc2tzID0gKGlkIDogc3RyaW5nKSA9PiB0aGlzLiRodHRwKHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2QgOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybCA6IFwidGFzay9nZXRGcmVlVGFza1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczoge2lkIDogaWR9ICBcclxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChkYXRhIDogYW55LCBzdGF0dXMgOiBudW1iZXIpID0+e1xyXG5cdFx0XHRcdFx0XHR0aGlzLnRhc2tzID0gW107XHJcblx0XHRcdFx0XHRcdGRhdGEuZXZlbnRzLmZvckVhY2goKGVsZW1lbnQgOiBFdmVudCkgPT57XHJcblx0XHRcdFx0XHRcdFx0bGV0IHRhc2sgPSBuZXcgRXZlbnQodGhpcy4kaHR0cCk7XHJcblx0XHRcdFx0XHRcdFx0dGFzay5zZXQoZWxlbWVudCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50YXNrcy5wdXNoKHRhc2spO1xyXG5cdFx0XHRcdFx0XHR9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRUYXNrcyA9IChfaWQgOiBzdHJpbmcpID0+IHRoaXMuJGh0dHAoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZCA6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsIDogXCJ0YXNrL2dldFRhc2tzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiB7aWQgOiBfaWR9ICBcclxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgKGRhdGEgOiBhbnksIHN0YXR1cyA6IG51bWJlcikgPT57XHJcblx0XHRcdFx0XHRcdHRoaXMuZXZlbnRTb3VyY2VzID0gW107XHJcblx0XHRcdFx0XHRcdGRhdGEuZXZlbnRzLmZvckVhY2goKGVsZW1lbnQgOiBFdmVudCkgPT57XHJcblx0XHRcdFx0XHRcdFx0bGV0IHRhc2sgPSBuZXcgRXZlbnQodGhpcy4kaHR0cCk7XHJcblx0XHRcdFx0XHRcdFx0dGFzay5zZXQoZWxlbWVudCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5ldmVudFNvdXJjZXMucHVzaCh0YXNrKTtcclxuXHRcdFx0XHRcdFx0fSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldEZpbmlzaGVkID0gKF9pZCA6IHN0cmluZykgPT4gdGhpcy4kaHR0cCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kIDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmwgOiBcInRhc2svZ2V0RmluaXNoZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHtpZCA6IF9pZH0gIFxyXG4gICAgICAgICAgICAgICAgfSkuc3VjY2VzcyhcclxuICAgICAgICAgICAgICAgICAgICAoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PntcclxuXHRcdFx0XHRcdFx0dGhpcy5maW5pc2hlZCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRkYXRhLmV2ZW50cy5mb3JFYWNoKChlbGVtZW50IDogRXZlbnQpID0+e1xyXG5cdFx0XHRcdFx0XHRcdGxldCB0YXNrID0gbmV3IEV2ZW50KHRoaXMuJGh0dHApO1xyXG5cdFx0XHRcdFx0XHRcdHRhc2suc2V0KGVsZW1lbnQpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZmluaXNoZWQucHVzaCh0YXNrKTtcclxuXHRcdFx0XHRcdFx0fSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlVXNlciA9IChpZCA6IHN0cmluZykgPT5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGFzay5yZW1vdmVVc2VyKGlkKVxyXG5cdFx0XHQgICAgICAgICAgICAuc3VjY2VzcygoZGF0YSA6IGFueSAsIHN0YXR1cyA6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdFx0ICAgICAgICBpZihzdGF0dXMgPT0gMjA0KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggOiBudW1iZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudFNvdXJjZXMuZm9yRWFjaCgoZWxlbWVudCA6IEV2ZW50KSA9PntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZWxlbWVudC5faWQgPT09IHRoaXMuc2VsZWN0ZWRUYXNrLl9pZCkgXHJcbiAgICAgICAgICAgICAgICAgICAgXHRcdCAgICAgICAgICAgIGluZGV4ID0gIHRoaXMuZXZlbnRTb3VyY2VzLmluZGV4T2YoZWxlbWVudCkgXHJcbiAgICAgICAgICAgICAgICAgICAgXHQgICAgICAgIH0pO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIHRoaXMuc2VsZWN0ZWRUYXNrLnVzZXIgPSBcIlwiO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIHRoaXMuZXZlbnRTb3VyY2VzW2luZGV4XS51c2VyID0gXCJcIjtcclxuXHRcdFx0XHQgICAgICAgICAgICAgICAgdGhpcy50YXNrcy5wdXNoKHRoaXMuZXZlbnRTb3VyY2VzW2luZGV4XSk7XHJcblx0XHRcdFx0XHRcdCAgICAgICAgdGhpcy5ldmVudFNvdXJjZXMuc3BsaWNlKGluZGV4LDEpO1x0XHJcblx0XHRcdFx0XHQgICAgICAgIH1cclxuXHRcdFx0XHQgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFVzZXIgPSAoIGlkIDogc3RyaW5nLHVzZXIgOiBVc2VyKSA9PiBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGFzay5hZGRVc2VyKGlkKVxyXG5cdFx0XHRcdFx0ICAgIC5zdWNjZXNzKChkYXRhIDogYW55ICwgc3RhdHVzIDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0XHQgICAgICAgIGlmKHN0YXR1cyA9PSAyMDQpe1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIHRoaXMuc2VsZWN0ZWRUYXNrLnVzZXIgPSB1c2VyLm5hbWU7XHJcblx0XHRcdFx0XHRcdCAgICAgICAgdGhpcy5zZWxlY3RlZFRhc2suY29sb3IgPSB1c2VyLmNvbG9yO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIHRoaXMuZXZlbnRTb3VyY2VzLnB1c2godGhpcy5zZWxlY3RlZFRhc2spO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIGxldCAgaW5kZXggPSB0aGlzLnRhc2tzLmluZGV4T2YodGhpcy5zZWxlY3RlZFRhc2spO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIHRoaXMudGFza3Muc3BsaWNlKGluZGV4LDEpO1xyXG5cdFx0XHRcdFx0ICAgICAgICB9XHJcblx0XHRcdFx0ICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFza1VzZXIgPSAodXNlck5hbWUgOiBzdHJpbmcpID0+IHRoaXMuc2VsZWN0ZWRUYXNrLnVzZXIgPT09IHVzZXJOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0VGFzayA9ICh0YXNrIDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFzayA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXdUYXNrID0gZmFsc2UgOiB0aGlzLm5ld1Rhc2sgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLm5ld1Rhc2spe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFRhc2sgPSBuZXcgRXZlbnQodGhpcy4kaHR0cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGFzayA9IHRhc2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkVGFzay5zdGFydCA9IG5ldyBEYXRlKHRoaXMuc2VsZWN0ZWRUYXNrLnN0YXJ0LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgIFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGFzayA9IChpZCA6c3RyaW5nKSA9PiB7XHJcblx0XHRcdFx0ICAgIGxldCB1cmwgPSBcIi90YXNrL1wiO1xyXG5cdFx0XHRcdCAgICB0aGlzLm5ld1Rhc2sgPyB1cmwrPSBcImFkZFRhc2tcIiA6IHVybCArPSBcIm1vZGlmeVRhc2tcIjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFRhc2sudXBkYXRlKGlkLHVybClcclxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcygoZGF0YSA6IGFueSAsIHN0YXR1cyA6IG51bWJlcikgPT5cclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gMjAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgRXZlbnQodGhpcy4kaHR0cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5zZXQoZGF0YS50YXNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFza3MucHVzaChldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoID0gKGlkIDogc3RyaW5nKSA9PiBcclxuICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRUYXNrLmZpbmlzaChpZClcclxuICAgICAgICAgICAgICAgICAgICAuc3VjY2VzcyggKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnNlbGVjdGVkVGFzay5maW5pc2hlZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4IDogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50U291cmNlcy5mb3JFYWNoKChlbGVtZW50IDogRXZlbnQpID0+e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihlbGVtZW50Ll9pZCA9PT0gdGhpcy5zZWxlY3RlZFRhc2suX2lkKSBcclxuICAgICAgICAgICAgICAgICAgICBcdFx0ICAgICAgICAgICAgaW5kZXggPSAgdGhpcy5ldmVudFNvdXJjZXMuaW5kZXhPZihlbGVtZW50KSBcclxuICAgICAgICAgICAgICAgICAgICBcdCAgICAgICAgfSk7XHJcblx0XHRcdFx0ICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoZWQucHVzaCh0aGlzLmV2ZW50U291cmNlc1tpbmRleF0pO1xyXG5cdFx0XHRcdFx0XHQgICAgICAgIHRoaXMuZXZlbnRTb3VyY2VzLnNwbGljZShpbmRleCwxKTtcdFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA6IG51bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaGVkLmZvckVhY2goKGVsZW1lbnQgOiBFdmVudCkgPT57XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVsZW1lbnQuX2lkID09PSB0aGlzLnNlbGVjdGVkVGFzay5faWQpIFxyXG4gICAgICAgICAgICAgICAgICAgIFx0XHQgICAgICAgICAgICBpbmRleCA9ICB0aGlzLmZpbmlzaGVkLmluZGV4T2YoZWxlbWVudCkgXHJcbiAgICAgICAgICAgICAgICAgICAgXHQgICAgICAgIH0pO1xyXG5cdFx0XHRcdCAgICAgICAgICAgICAgICB0aGlzLmV2ZW50U291cmNlcy5wdXNoKHRoaXMuZmluaXNoZWRbaW5kZXhdKTtcclxuXHRcdFx0XHRcdFx0ICAgICAgICB0aGlzLmZpbmlzaGVkLnNwbGljZShpbmRleCwxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICBcclxuICAgIH1cclxuICAgIH1cclxufTsiLCJtb2R1bGUgQ2FsZW5kYXJ7XHJcbiAgICBleHBvcnQgY2xhc3MgVXNlcntcclxuICAgICAgICB1cGRhdGU6ICgpID0+IG5nLklIdHRwUHJvbWlzZTxVc2VyPjtcclxuICAgICAgICBzZXQ6ICh1c2VyIDogVXNlcikgPT4gdm9pZDtcclxuICAgICAgICBjaGFuZ2VDb2xvcjogKCkgPT4gbmcuSUh0dHBQcm9taXNlPFVzZXI+O1xyXG4gICAgICAgIG5hbWUgOiBzdHJpbmc7XHJcbiAgICAgICAgY29sb3I6IHN0cmluZztcclxuICAgICAgICBfaWQ6IHN0cmluZztcclxuICAgICAgICBlbWFpbDogc3RyaW5nO1xyXG4gICAgICAgIGFkZHJlc3M6IHN0cmluZztcclxuICAgICAgICBwYXNzd29yZDogc3RyaW5nO1xyXG4gICAgICAgICRodHRwIDogbmcuSUh0dHBTZXJ2aWNlO1xyXG4gICAgICAgIHNldEh0dHAgOiAoaHR0cCA6IG5nLklIdHRwU2VydmljZSkgPT4gdm9pZDtcclxuICAgICAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgICAgICB0aGlzLnNldCA9ICh1c2VyOiBVc2VyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IHVzZXIuX2lkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRyZXNzID0gdXNlci5hZGRyZXNzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvciA9IHVzZXIuY29sb3I7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtYWlsID0gdXNlci5lbWFpbDtcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IHVzZXIubmFtZTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFzc3dvcmQgPSB1c2VyLnBhc3N3b3JkO1xyXG4gICAgICAgICAgICB9OyAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2V0SHR0cCA9IChodHRwIDogbmcuSUh0dHBTZXJ2aWNlKSA9PiB0aGlzLiRodHRwID0gaHR0cCAgICAgIFxyXG4gICAgICAgICAgICAvKipVcGRhdGUgdXNlciBwcm9maWxlICovXHJcblx0XHRcdHRoaXMudXBkYXRlID0gKCkgPT4gIHRoaXMuJGh0dHAoe1xyXG5cdFx0XHRcdFx0bWV0aG9kOiBcIlBPU1RcIixcclxuXHRcdFx0XHRcdHVybDogXCIvdXNlci9tb2RpZnlVc2VyXCIsXHJcblx0XHRcdFx0XHRkYXRhIDogdGhpc1xyXG5cdFx0XHRcdH0pO1xyXG4gICAgICAgICAgIHRoaXMuY2hhbmdlQ29sb3IgPSAoKSA9PiB0aGlzLiRodHRwKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgbWV0aG9kIDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgICAgICAgICB1cmwgOiBcIi91c2VyL2NoYW5nZUNvbG9yXCIsXHJcbiAgICAgICAgICAgICAgICAgICBkYXRhIDogeyBjb2xvciA6IHRoaXMuY29sb3IgfSAgXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHRcdFx0XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiIsIm1vZHVsZSBDYWxlbmRhcntcclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIHBhZ2VTZXJ2aWNle1xyXG4gICAgICAgXHRhdXRob3JpemVkIDogYm9vbGVhbjtcclxuICAgICAgIFx0bG9naW46ICh1c2VyIDogVXNlcikgPT4gdm9pZDtcclxuXHQgICBcdGxvZ291dDogKCkgPT4gdm9pZDtcclxuXHRcdGlzQXV0aG9yaXplZDogKCkgPT4gYm9vbGVhbjtcclxuXHRcdHVzZXIgOiBVc2VyO1xyXG5cdFx0dXBkYXRlVXNlcjogKHVzZXIgOiBVc2VyKSA9PiBuZy5JSHR0cFByb21pc2U8VXNlcj47XHJcblx0XHRjaGFuZ2VVc2VyQ29sb3I6ICh1c2VyIDogVXNlcikgPT4gbmcuSUh0dHBQcm9taXNlPFVzZXI+O1xyXG4gICBcdFx0Y29uc3RydWN0b3IoKXtcclxuXHRcdFx0dGhpcy51c2VyID0gbmV3IFVzZXIoKTtcclxuICAgICAgICBcdHRoaXMubG9naW4gPSAodXNlciA6IFVzZXIpID0+IHtcclxuXHRcdFx0XHQgdGhpcy5hdXRob3JpemVkID0gdHJ1ZTtcclxuXHRcdFx0XHQgdGhpcy51c2VyLnNldCh1c2VyKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnVwZGF0ZVVzZXIgPSAodXNlciA6IFVzZXIpID0+IHtcclxuXHRcdFx0XHQgdGhpcy51c2VyLnNldCh1c2VyKTtcclxuXHRcdFx0XHQgcmV0dXJuIHRoaXMudXNlci51cGRhdGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5jaGFuZ2VVc2VyQ29sb3IgPSAodXNlciA6IFVzZXIpID0+IHtcclxuXHRcdFx0XHQgdGhpcy51c2VyLnNldCh1c2VyKTtcclxuXHRcdFx0XHQgcmV0dXJuIHRoaXMudXNlci5jaGFuZ2VDb2xvcigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG4gICAgICAgXHRcdHRoaXMubG9nb3V0ID0gKCkgPT4gdGhpcy5hdXRob3JpemVkID0gZmFsc2VcclxuXHRcdFx0dGhpcy5pc0F1dGhvcml6ZWQgPSAoKSA9PiB0aGlzLmF1dGhvcml6ZWRcclxuICAgICAgIFx0XHR9ICBcclxuXHRcdH1cclxuICAgIH07XHJcbiIsIm1vZHVsZSBDYWxlbmRhciB7XHJcbiAgICBleHBvcnQgY2xhc3MgY2FsZW5kYXJDdHJsIHtcclxuICAgICAgICBcclxuXHRcdC8qKkNhbGVuZGFyICovXHJcbiAgICAgICAgdWlDb25maWc6IE9iamVjdDtcclxuICAgICAgICBhbGVydEV2ZW50T25DbGljazogT2JqZWN0O1xyXG5cdFx0YWxlcnRPbkRyb3A6IChldmVudDogRXZlbnQsZGVsdGEscmV2ZXJ0RnVuYykgPT4gdm9pZDtcclxuXHRcdGV2ZW50Q2xpY2s6IChldmVudCA6IEV2ZW50KSA9PiB2b2lkO1xyXG5cdFx0cmVuZGVyQ2FsZW5kYXI6ICgpID0+IHZvaWQ7XHJcblx0XHRcclxuXHRcdC8qKlByb2plY3QgKi9cclxuXHRcdHByb2plY3RzOiBQcm9qZWN0TGlzdDtcclxuICAgICAgICB1cGRhdGVQcm9qZWN0OiAoKSA9PiB2b2lkO1xyXG5cdFx0YWRkUHJvamVjdFVzZXI6ICgpID0+IHZvaWQ7XHJcblx0XHRnZXRQcm9qZWN0OiAoKSA9PiB2b2lkO1xyXG5cdFx0Y2hhbmdlUHJvamVjdDogKCkgPT4gdm9pZDtcclxuXHRcdGRlbGV0ZVByb2plY3Q6ICgpID0+IHZvaWQ7XHJcblx0XHRyZW1vdmVQcm9qZWN0VXNlcjogKCkgPT4gdm9pZDtcclxuXHRcdHNlbGVjdFByb2plY3Q6IChuZXdQcm9qZWN0IDogYm9vbGVhbikgPT4gdm9pZDtcclxuXHRcdFxyXG5cdFx0LyoqVGFzayAqL1xyXG5cdFx0dGFza0xpc3QgOiB0YXNrTGlzdDtcclxuXHRcdGdldFRhc2tzOiAoX2lkIDogc3RyaW5nKSA9PiB2b2lkO1xyXG4gICAgICAgIGdldEZyZWVUYXNrczogKF9pZCA6IHN0cmluZykgPT4gdm9pZDtcclxuXHRcdGdldEZpbmlzaGVkVGFzazogKF9pZCA6IHN0cmluZykgPT4gdm9pZDtcclxuICAgICAgICB1cGRhdGVUYXNrOiAoKSA9PiB2b2lkO1xyXG5cdFx0c2VsZWN0VGFzazogKHRhc2sgOiBFdmVudCkgPT4gdm9pZDtcclxuXHRcdHJlbW92ZVVzZXI6ICgpID0+IHZvaWQ7XHJcblx0XHRhZGRVc2VyOiAoKSA9PiB2b2lkO1xyXG5cdFx0dGFza1VzZXI6ICgpID0+IGJvb2xlYW47XHJcblx0XHRmaW5pc2hUYXNrOiAoKSA9PiB2b2lkO1xyXG5cdFx0ZGVsZXRlVGFzazogKCkgPT4gdm9pZDtcclxuXHRcdGdldEV2ZW50czogKCkgPT4gdm9pZDtcclxuXHRcdFxyXG5cdFx0LyoqdXNlciAqL1xyXG5cdFx0dXNlciA6IFVzZXI7IFxyXG5cdFx0Y2hhbmdlQ29sb3I6ICgpID0+IHZvaWQ7XHJcblx0XHR1cGRhdGVVc2VyOiAoKSA9PiB2b2lkO1xyXG5cdFx0XHJcblx0XHQvKipBZGQgdXNlciAqL1xyXG5cdFx0dXNlck5hbWU6IHN0cmluZztcclxuXHRcdHNlbGVjdDogc3RyaW5nO1xyXG5cdFx0YWxsVXNlcjogQXJyYXk8c3RyaW5nPlxyXG5cdFx0c2VsZWN0ZWRVc2VyczogQXJyYXk8c3RyaW5nPjtcclxuXHRcdGdldEFsbFVzZXI6ICgpID0+IHZvaWQ7XHJcblx0XHRzZWxlY3RVc2VyOiAoKSA9PiB2b2lkO1xyXG5cdFx0c2VsZWN0Q2hhbmdlOiAoKSA9PiB2b2lkO1xyXG5cdFx0XHJcblx0XHRhZG1pbk1lbnU6IGJvb2xlYW47XHJcblx0XHRcclxuXHRcdHN0YXRpYyAkaW5qZWN0ID0gWyckc2NvcGUnLCckaHR0cCcsJ3BhZ2VTZXJ2aWNlJ11cclxuXHRcdGNvbnN0cnVjdG9yKHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgcGFnZVNlcnZpY2UgOiBwYWdlU2VydmljZVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgIHtcclxuXHRcdCAgIHRoaXMuZGVsZXRlVGFzayA9ICgpID0+XHJcblx0XHQgICBcdFx0dGhpcy50YXNrTGlzdC5kZWxldGVUYXNrKHRoaXMucHJvamVjdHMuaWQpXHJcblx0XHRcdFx0ICAgLnN1Y2Nlc3MoKCkgPT5cclxuXHRcdFx0XHQgICB7XHJcblx0XHRcdFx0ICAgXHRcdHRoaXMudGFza0xpc3QuZ2V0VGFza3ModGhpcy5wcm9qZWN0cy5pZClcclxuXHRcdFx0XHQgICBcdFx0XHQuc3VjY2VzcygoKSA9PlxyXG5cdFx0XHRcdCAgIFx0XHRcdFx0dGhpcy5yZW5kZXJDYWxlbmRhcigpXHJcblx0XHRcdFx0ICAgXHRcdCkuZXJyb3IoKGRhdGEgOiBhbnksIHN0YXR1cyA6IG51bWJlcikgPT4gXHJcblx0XHRcdFx0XHRcdHtcclxuICAgICAgICAgICAgICAgICAgIFx0XHRpZihzdGF0dXMgPT0gNDAxKSB7IFxyXG5cdFx0XHRcdFx0ICAgXHRcdHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KClcclxuXHRcdFx0XHQgICBcdFx0fVxyXG4gICAgICAgICAgICAgICAgXHR9KTtcclxuXHRcdFx0XHRcdFx0bGV0IGVsZW1lbnQgPSA8YW55PiBhbmd1bGFyLmVsZW1lbnQoXCIjdGFza1wiKTtcclxuXHRcdFx0XHRcdFx0ZWxlbWVudC5tb2RhbChcImhpZGVcIik7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdCAgIH0pLmVycm9yKChkYXRhIDogYW55LCBzdGF0dXMgOiBudW1iZXIpID0+IFxyXG5cdFx0XHRcdFx0e1xyXG4gICAgICAgICAgICAgICAgICAgXHRcdGlmKHN0YXR1cyA9PSA0MDEpIHsgXHJcblx0XHRcdFx0XHQgICBcdFx0dGhpcy5wYWdlU2VydmljZS5sb2dvdXQoKVxyXG5cdFx0XHRcdCAgIFx0XHR9XHJcbiAgICAgICAgICAgICAgICBcdH0pXHJcblx0XHRcdFx0ICAgO1xyXG5cdFx0ICAgdGhpcy5zZWxlY3RDaGFuZ2UgPSAoKSA9PlxyXG5cdFx0ICAge1xyXG5cdFx0XHQgICB0aGlzLnNlbGVjdGVkVXNlcnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG5cdFx0XHQgICBpZih0aGlzLnNlbGVjdCA9PT0gJ2FkZCcpe1xyXG5cdFx0XHRcdCAgIHRoaXMuZ2V0QWxsVXNlcigpO1xyXG5cdFx0XHQgICB9XHJcblx0XHRcdCAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ID09PSAncmVtb3ZlJyl7XHJcblx0XHRcdFx0ICAgdGhpcy5hbGxVc2VyID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuXHRcdFx0XHQgICB0aGlzLnByb2plY3RzLmF2YWlibGVbdGhpcy5wcm9qZWN0cy5zZWxlY3RlZF0udXNlcnMuZm9yRWFjaCgoZWxlbWVudCkgPT5cclxuXHRcdFx0XHQgICB7XHJcblx0XHRcdFx0XHQgICB0aGlzLmFsbFVzZXIucHVzaChlbGVtZW50KTtcclxuXHRcdFx0XHQgICB9KVxyXG5cdFx0XHRcdCAgIFxyXG5cdFx0XHQgICB9XHJcblx0XHQgICB9XHJcblx0XHQgICB0aGlzLnNlbGVjdCA9IFwiYWRkXCI7XHJcblx0XHQgICB0aGlzLmFkZFByb2plY3RVc2VyID0gKCkgPT5cclxuXHRcdCAgIHtcclxuXHRcdFx0ICAgdGhpcy4kaHR0cCh7XHJcblx0XHRcdFx0ICBtZXRob2QgOiBcIlBPU1RcIixcclxuXHRcdFx0XHQgIHVybCA6IFwiL3Byb2plY3QvYWRkVXNlclwiLFxyXG5cdFx0XHRcdCAgZGF0YSA6ICB7dXNlcnMgOiB0aGlzLnNlbGVjdGVkVXNlcnN9LFxyXG5cdFx0XHRcdCAgcGFyYW1zIDoge2lkIDogdGhpcy5wcm9qZWN0cy5pZH1cclxuXHRcdFx0ICAgfSkuc3VjY2VzcygoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLnNlbGVjdGVkVXNlcnMuZm9yRWFjaCgoZWxlbWVudCkgPT5cclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dGhpcy5wcm9qZWN0cy5hdmFpYmxlW3RoaXMucHJvamVjdHMuc2VsZWN0ZWRdLnVzZXJzLnB1c2goZWxlbWVudCk7XHRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdCAgXHR0aGlzLnNlbGVjdGVkVXNlcnMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG5cdFx0XHRcdFx0bGV0IGVsZW1lbnQgPSA8YW55PiBhbmd1bGFyLmVsZW1lbnQoXCIjYWRkX3VzZXJcIik7XHJcblx0XHRcdFx0XHRlbGVtZW50Lm1vZGFsKFwiaGlkZVwiKTtcclxuXHRcdFx0XHQgICBcclxuXHRcdFx0ICAgfSkuZXJyb3IoKGRhdGEgOiBhbnksIHN0YXR1cyA6IG51bWJlcikgPT4gXHJcblx0XHRcdFx0XHR7XHJcbiAgICAgICAgICAgICAgICAgICBcdFx0aWYoc3RhdHVzID09IDQwMSkgeyBcclxuXHRcdFx0XHRcdCAgIFx0XHR0aGlzLnBhZ2VTZXJ2aWNlLmxvZ291dCgpXHJcblx0XHRcdFx0ICAgXHRcdH1cclxuICAgICAgICAgICAgICAgIFx0fSk7XHJcblx0XHQgICB9XHJcblx0XHQgIHRoaXMucmVtb3ZlUHJvamVjdFVzZXIgPSAoKSA9PlxyXG5cdFx0ICAge1xyXG5cdFx0XHQgICB0aGlzLiRodHRwKHtcclxuXHRcdFx0XHQgIG1ldGhvZCA6IFwiUE9TVFwiLFxyXG5cdFx0XHRcdCAgdXJsIDogXCIvcHJvamVjdC9kZWxldGVVc2VyXCIsXHJcblx0XHRcdFx0ICBkYXRhIDogIHt1c2VycyA6IHRoaXMuc2VsZWN0ZWRVc2Vyc30sXHJcblx0XHRcdFx0ICBwYXJhbXMgOiB7aWQgOiB0aGlzLnByb2plY3RzLmlkfVxyXG5cdFx0XHQgICB9KS5zdWNjZXNzKCgpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuc2VsZWN0ZWRVc2Vycy5mb3JFYWNoKChlbGVtZW50KSA9PlxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGhpcy5zZWxlY3RlZFVzZXJzLmZvckVhY2goKGVsZW1lbnQyKSA9PlxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5wcm9qZWN0cy5hdmFpYmxlW3RoaXMucHJvamVjdHMuc2VsZWN0ZWRdLnVzZXJzLmZvckVhY2goKGVsZW1lbnQpPT57XHJcblx0XHRcdFx0XHRcdFx0XHRpZihlbGVtZW50ID09PSBlbGVtZW50Mil7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMucHJvamVjdHMuYXZhaWJsZVt0aGlzLnByb2plY3RzLnNlbGVjdGVkXS51c2Vycy5zcGxpY2UodGhpcy5wcm9qZWN0cy5hdmFpYmxlW3RoaXMucHJvamVjdHMuc2VsZWN0ZWRdLnVzZXJzLmluZGV4T2YoZWxlbWVudDIpLDEpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0ICBcdHRoaXMuc2VsZWN0ZWRVc2VycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcblx0XHRcdFx0XHRsZXQgZWxlbWVudCA9IDxhbnk+IGFuZ3VsYXIuZWxlbWVudChcIiNhZGRfdXNlclwiKTtcclxuXHRcdFx0XHRcdGVsZW1lbnQubW9kYWwoXCJoaWRlXCIpO1xyXG5cdFx0XHRcdCAgIFxyXG5cdFx0XHQgICB9KVx0XHQgICBcdC5lcnJvcigoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PiBcclxuXHRcdFx0XHRcdHtcclxuICAgICAgICAgICAgICAgICAgIFx0XHRpZihzdGF0dXMgPT0gNDAxKSB7IFxyXG5cdFx0XHRcdFx0ICAgXHRcdHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KClcclxuXHRcdFx0XHQgICBcdFx0fVxyXG4gICAgICAgICAgICAgICAgXHR9KTtcclxuXHRcdCAgIH1cclxuXHRcdCAgIFxyXG5cdFx0ICAgdGhpcy5hbGxVc2VyID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuXHRcdCAgIHRoaXMuc2VsZWN0ZWRVc2VycyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcblx0XHQgICB0aGlzLnNlbGVjdFVzZXIgPSAoKSA9PntcclxuXHRcdFx0XHR0aGlzLnNlbGVjdGVkVXNlcnMucHVzaCh0aGlzLnVzZXJOYW1lKTtcclxuXHRcdFx0XHR0aGlzLmFsbFVzZXIuc3BsaWNlKHRoaXMuYWxsVXNlci5pbmRleE9mKHRoaXMudXNlck5hbWUpLDEpO1xyXG5cdFx0XHRcdHRoaXMuYWxsVXNlci5sZW5ndGggPyB0aGlzLnVzZXJOYW1lID0gdGhpcy5hbGxVc2VyWzBdIDogdGhpcy51c2VyTmFtZSA9IFwiXCI7XHJcblx0XHJcblx0XHQgICB9O1xyXG5cdFx0ICAgdGhpcy5nZXRBbGxVc2VyID0gKCkgPT4gXHJcblx0XHQgICBcdFx0dGhpcy4kaHR0cCh7XHJcblx0XHRcdFx0XHQgICBtZXRob2QgOiBcIkdFVFwiLFxyXG5cdFx0XHRcdFx0ICAgdXJsIDogXCIvdXNlci9nZXRBbGxcIlxyXG5cdFx0XHRcdCAgIH0pLnN1Y2Nlc3MoKGRhdGEgOiBhbnkpID0+IFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFsbFVzZXIgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG5cdFx0XHRcdCAgIGRhdGEudXNlcnMuZm9yRWFjaCgoZWxlbWVudCA9PlxyXG5cdFx0XHRcdCAgIHtcclxuXHRcdFx0XHRcdCAgIHRoaXMuYWxsVXNlci5wdXNoKGVsZW1lbnQubmFtZSk7XHJcblx0XHRcdFx0ICAgfSkpXHJcblx0XHRcdFx0XHRcdHRoaXMucHJvamVjdHMuYXZhaWJsZVt0aGlzLnByb2plY3RzLnNlbGVjdGVkXS51c2Vycy5mb3JFYWNoKChlbGVtZW50KSA9PlxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5hbGxVc2VyLmZvckVhY2goKGVsZW1lbnQyKT0+e1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoZWxlbWVudCA9PT0gZWxlbWVudDIpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmFsbFVzZXIuc3BsaWNlKHRoaXMuYWxsVXNlci5pbmRleE9mKGVsZW1lbnQyKSwxKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0dGhpcy5hbGxVc2VyLnNwbGljZSh0aGlzLmFsbFVzZXIuaW5kZXhPZih0aGlzLnVzZXIubmFtZSksMSk7XHJcblx0XHRcdFx0ICAgfSkuZXJyb3IoKGRhdGEgOiBhbnksIHN0YXR1cyA6IG51bWJlcikgPT4gXHJcblx0XHRcdFx0XHR7XHJcbiAgICAgICAgICAgICAgICAgICBcdFx0aWYoc3RhdHVzID09IDQwMSkgeyBcclxuXHRcdFx0XHRcdCAgIFx0XHR0aGlzLnBhZ2VTZXJ2aWNlLmxvZ291dCgpXHJcblx0XHRcdFx0ICAgXHRcdH1cclxuICAgICAgICAgICAgICAgIFx0fSk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0ICAgdGhpcy5maW5pc2hUYXNrID0gKCkgPT4gXHJcblx0XHQgICB7XHJcblx0XHQgICBcdFx0dGhpcy50YXNrTGlzdC5maW5pc2godGhpcy5wcm9qZWN0cy5pZClcclxuXHRcdFx0XHQgICAuc3VjY2VzcyggKCkgPT4gXHJcblx0XHRcdFx0ICAge1xyXG5cdFx0XHRcdCAgIFx0XHR0aGlzLnJlbmRlckNhbGVuZGFyKCk7XHJcblx0XHRcdFx0ICAgfSkuZXJyb3IoKGRhdGEgOiBhbnksIHN0YXR1cyA6IG51bWJlcikgPT4gXHJcblx0XHRcdFx0XHR7XHJcbiAgICAgICAgICAgICAgICAgICBcdFx0aWYoc3RhdHVzID09IDQwMSkgeyBcclxuXHRcdFx0XHRcdCAgIFx0XHR0aGlzLnBhZ2VTZXJ2aWNlLmxvZ291dCgpXHJcblx0XHRcdFx0ICAgXHRcdH1cclxuICAgICAgICAgICAgICAgIFx0fSk7XHJcblx0XHQgICB9XHJcblx0XHQgICB0aGlzLmdldEV2ZW50cyA9ICgpID0+XHJcblx0XHQgICB7XHJcblx0XHRcdCAgIFx0dGhpcy5nZXRUYXNrcyggIHRoaXMucHJvamVjdHMuaWQpO1xyXG4gICAgICAgICAgICAgICBcdHRoaXMuZ2V0RnJlZVRhc2tzKCAgdGhpcy5wcm9qZWN0cy5pZCk7XHJcblx0XHRcdFx0dGhpcy5nZXRGaW5pc2hlZFRhc2sodGhpcy5wcm9qZWN0cy5pZCk7XHJcblx0XHRcdFx0dGhpcy5wcm9qZWN0cy5jaGFuZ2UodGhpcy51c2VyLm5hbWUpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMudWlDb25maWdbXCJjYWxlbmRhclwiXS5lZGl0YWJsZSA9IHRoaXMucHJvamVjdHMub3duZXI7XHJcblx0XHQgICB9XHJcblx0XHQgICB0aGlzLmRlbGV0ZVByb2plY3QgPSAoKSA9PiB0aGlzLnByb2plY3RzLmRlbGV0ZSgpXHJcblx0XHQgICAuc3VjY2VzcygoZGF0YSA6IGFueSAsc3RhdHVzIDogbnVtYmVyKSA9PlxyXG5cdFx0ICAge1xyXG5cdFx0XHQgICBcdGxldCBlbGVtZW50ID0gPGFueT4gYW5ndWxhci5lbGVtZW50KFwiI3Byb2plY3RcIik7XHJcblx0XHRcdFx0ZWxlbWVudC5tb2RhbChcImhpZGVcIik7XHJcblx0XHRcdCAgIFx0dGhpcy5nZXRFdmVudHMoKTtcclxuXHRcdCAgIH0pLmVycm9yKChkYXRhIDogYW55LCBzdGF0dXMgOiBudW1iZXIpID0+IFxyXG5cdFx0XHRcdFx0e1xyXG4gICAgICAgICAgICAgICAgICAgXHRcdGlmKHN0YXR1cyA9PSA0MDEpIHsgXHJcblx0XHRcdFx0XHQgICBcdFx0dGhpcy5wYWdlU2VydmljZS5sb2dvdXQoKVxyXG5cdFx0XHRcdCAgIFx0XHR9XHJcbiAgICAgICAgICAgICAgICBcdH0pXHJcblx0XHQgICB0aGlzLnVwZGF0ZVByb2plY3QgPSAoKSA9PiBcclxuXHRcdCAgIFx0XHR0aGlzLnByb2plY3RzLnVwZGF0ZSgpXHJcblx0XHRcdFx0ICAgLnN1Y2Nlc3MoKGRhdGEgOiBhbnkgLCBzdGF0dXMgOiBudW1iZXIpID0+XHJcblx0XHRcdFx0ICAge1xyXG5cdFx0XHRcdFx0ICAgXHRpZihzdGF0dXMgPT09IDIwMSkge1xyXG5cdFx0XHRcdFx0XHRcdCAgIHRoaXMuZ2V0RXZlbnRzKCk7XHJcblx0XHRcdFx0XHQgICBcdH1cclxuXHRcdFx0XHRcdCAgIFx0bGV0IGVsZW1lbnQgPSA8YW55PiBhbmd1bGFyLmVsZW1lbnQoXCIjcHJvamVjdFwiKTtcclxuXHRcdFx0XHRcdFx0ZWxlbWVudC5tb2RhbChcImhpZGVcIik7XHJcblx0XHRcdFx0ICAgfSlcclxuXHRcdFx0XHQgICBcdC5lcnJvcigoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PiBcclxuXHRcdFx0XHRcdHtcclxuICAgICAgICAgICAgICAgICAgIFx0XHRpZihzdGF0dXMgPT0gNDAxKSB7IFxyXG5cdFx0XHRcdFx0ICAgXHRcdHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KClcclxuXHRcdFx0XHQgICBcdFx0fVxyXG4gICAgICAgICAgICAgICAgXHR9KVxyXG5cdFx0ICAgXHJcblx0XHQgICB0aGlzLnNlbGVjdFByb2plY3QgPSAobmV3UHJvamVjdCA6IGJvb2xlYW4pID0+XHJcblx0XHQgIFx0XHR0aGlzLnByb2plY3RzLnNlbGVjdChuZXdQcm9qZWN0KTtcclxuXHRcdCAgIHRoaXMudGFza0xpc3QgPSBuZXcgdGFza0xpc3QodGhpcy4kaHR0cCxuZXcgQXJyYXk8RXZlbnQ+KCksbmV3IEFycmF5PEV2ZW50PigpLG5ldyBBcnJheTxFdmVudD4oKSxuZXcgRXZlbnQodGhpcy4kaHR0cCkpO1xyXG5cdFx0ICAgdGhpcy5jaGFuZ2VQcm9qZWN0ID0gKCkgPT4gXHJcblx0XHQgICB7XHJcblx0XHRcdCAgIHRoaXMucHJvamVjdHMuY2hhbmdlKHRoaXMudXNlci5uYW1lKTtcclxuXHRcdFx0ICAgdGhpcy5nZXRQcm9qZWN0KCk7XHJcblx0XHQgICB9XHJcblx0XHQgICB0aGlzLnByb2plY3RzID0gbmV3IFByb2plY3RMaXN0KHRoaXMuJGh0dHAsW10sMCxcIjBcIik7XHJcblx0XHQgICB0aGlzLmFkbWluTWVudSA9IGZhbHNlO1xyXG5cdFx0ICAgdGhpcy5wYWdlU2VydmljZS51c2VyLnNldEh0dHAodGhpcy4kaHR0cCk7XHJcblx0XHQgICB0aGlzLnVzZXIgPSB0aGlzLnBhZ2VTZXJ2aWNlLnVzZXI7XHJcblx0XHQgICBcclxuXHRcdCAgIHRoaXMudXBkYXRlVXNlciA9ICgpID0+IFxyXG5cdFx0ICAgXHR0aGlzLnBhZ2VTZXJ2aWNlLnVwZGF0ZVVzZXIodGhpcy51c2VyKS5zdWNjZXNzKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRsZXQgZWxlbWVudCA9IDxhbnk+IGFuZ3VsYXIuZWxlbWVudChcIiN1c2VyTW9kYWxcIik7XHJcblx0XHRcdFx0ZWxlbWVudC5tb2RhbChcImhpZGVcIik7XHJcblx0XHRcdH0pXHJcblx0XHRcdFx0LmVycm9yKChkYXRhIDogYW55LCBzdGF0dXMgOiBudW1iZXIpID0+IFxyXG5cdFx0XHRcdHtcclxuICAgICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PSA0MDEpIHsgXHJcblx0XHRcdFx0XHQgICB0aGlzLnBhZ2VTZXJ2aWNlLmxvZ291dCgpXHJcblx0XHRcdFx0ICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcblx0XHQgICAvKipSZXJlbmRlciBjYWxlbmRhciAqL1xyXG5cdFx0ICAgdGhpcy5yZW5kZXJDYWxlbmRhciA9ICgpID0+IFxyXG5cdFx0ICAge1xyXG5cdFx0XHQgICAgbGV0IGNhbGVuZGFyICA9IDxhbnk+IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NhbGVuZGFyXCIpKTtcclxuICAgICAgICAgICAgICAgIGNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVtb3ZlRXZlbnRzJyk7XHJcblx0XHRcdFx0Y2FsZW5kYXIuZnVsbENhbGVuZGFyKCdhZGRFdmVudFNvdXJjZScsdGhpcy50YXNrTGlzdC5ldmVudFNvdXJjZXMpO1xyXG5cdFx0ICAgfVx0XHQgICBcdFx0XHRcclxuXHRcdFx0LyoqVXBkYXRlIG9yIGNyZWF0ZSB0YXNrICovXHJcblx0XHRcdHRoaXMudXBkYXRlVGFzayA9ICgpID0+XHJcblx0XHRcdFx0dGhpcy50YXNrTGlzdC51cGRhdGVUYXNrKHRoaXMucHJvamVjdHMuaWQpXHJcblx0XHRcdFx0XHQuc3VjY2VzcygoKSA9PiBcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0bGV0IGVsZW1lbnQgPSA8YW55PiBhbmd1bGFyLmVsZW1lbnQoXCIjdGFza1wiKTtcclxuXHRcdFx0XHRcdFx0ZWxlbWVudC5tb2RhbChcImhpZGVcIik7XHJcblx0XHRcdFx0XHRcdHRoaXMudGFza0xpc3QuZ2V0VGFza3ModGhpcy5wcm9qZWN0cy5pZClcclxuXHRcdFx0XHRcdFx0XHQuc3VjY2VzcygoKSA9PiBcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMucmVuZGVyQ2FsZW5kYXIoKSkuZXJyb3IoKGRhdGEgOiBhbnksIHN0YXR1cyA6IG51bWJlcikgPT4gXHJcblx0XHRcdFx0XHR7XHJcbiAgICAgICAgICAgICAgICAgICBcdFx0aWYoc3RhdHVzID09IDQwMSkgeyBcclxuXHRcdFx0XHRcdCAgIFx0XHR0aGlzLnBhZ2VTZXJ2aWNlLmxvZ291dCgpXHJcblx0XHRcdFx0ICAgXHRcdH1cclxuICAgICAgICAgICAgICAgIFx0fSlcdFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5lcnJvcigoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PiBcclxuXHRcdFx0XHRcdHtcclxuICAgICAgICAgICAgICAgICAgIFx0XHRpZihzdGF0dXMgPT0gNDAxKXtcclxuXHRcdFx0XHRcdFx0ICAgIHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KClcclxuXHRcdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgXHR9KTtcclxuXHRcdCAgIFxyXG5cdFx0ICAgLyoqRXZlbnQgY2xpY2sgKi9cclxuXHRcdCAgIHRoaXMuZXZlbnRDbGljayA9IChldmVudCA6IEV2ZW50KSA9PiBcclxuXHRcdCAgIHtcclxuXHRcdCAgIFx0XHRsZXQgZWxlbWVudCA9IDxhbnk+IGFuZ3VsYXIuZWxlbWVudChcIiN0YXNrXCIpO1xyXG5cdFx0XHRcdGxldCB0YXNrID0gbmV3IEV2ZW50KHRoaXMuJGh0dHApO1xyXG5cdFx0XHRcdHRhc2suc2V0KGV2ZW50KTtcclxuXHRcdFx0XHR0aGlzLnRhc2tMaXN0LnNlbGVjdFRhc2sodGFzayk7XHJcblx0XHRcdFx0ZWxlbWVudC5tb2RhbChcInNob3dcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8qKkNoYW5nZSBldmVudCBkYXRlICovXHJcblx0XHQgICBcdHRoaXMuYWxlcnRPbkRyb3AgPSAoZXZlbnQgOiBFdmVudCxkZWx0YSA6IGFueSxyZXZlcnRGdW5jIDogYW55KSA9PiBcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGxldCB0YXNrID0gbmV3IEV2ZW50KHRoaXMuJGh0dHApO1xyXG5cdFx0XHRcdHRhc2suc2V0KGV2ZW50KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR0aGlzLnNlbGVjdFRhc2sodGFzayk7XHJcblx0XHRcdFx0dGhpcy51cGRhdGVUYXNrKCk7XHJcblx0XHQgICBcdH07XHJcblx0XHQgICBcclxuXHRcdCAgIC8qKmluaXQgdWkgY29uZmlnICovXHJcbiAgICAgICAgICAgdGhpcy51aUNvbmZpZyA9IHtcclxuICAgICAgICAgICAgICAgIGNhbGVuZGFyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiA0NTAsXHJcbiAgICAgICAgICAgICAgICAgICAgZWRpdGFibGU6IHRoaXMucHJvamVjdHMub3duZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICdtb250aCBiYXNpY1dlZWsgYmFzaWNEYXknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXI6ICd0aXRsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAndG9kYXkgcHJldixuZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcblx0XHRcdFx0XHRldmVudFNvdXJjZXMgOiB0aGlzLnRhc2tMaXN0LmV2ZW50U291cmNlcyxcclxuICAgICAgICAgICAgICAgICAgICBkYXlDbGljazogdGhpcy5hbGVydEV2ZW50T25DbGljayxcclxuICAgICAgICAgICAgICAgICAgICBldmVudERyb3A6IHRoaXMuYWxlcnRPbkRyb3AsXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRDbGljazogdGhpcy5ldmVudENsaWNrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLyoqY2hhbmdlIHVzZXIgY29sb3IgYXR0cmlidXRlICovXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQ29sb3IgPSAoKSA9PiBcclxuXHRcdFx0XHR0aGlzLnBhZ2VTZXJ2aWNlLmNoYW5nZVVzZXJDb2xvcih0aGlzLnVzZXIpXHJcblx0XHRcdFx0XHQuc3VjY2VzcygoKSA9PiBcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dGhpcy50YXNrTGlzdC5ldmVudFNvdXJjZXMuZm9yRWFjaCggKGVsZW1lbnQgOiBFdmVudCkgPT5cclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGlmKGVsZW1lbnQudXNlciA9PSB0aGlzLnVzZXIubmFtZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LmNvbG9yID0gdGhpcy51c2VyLmNvbG9yO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5yZW5kZXJDYWxlbmRhcigpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LmVycm9yKChkYXRhIDogYW55LCBzdGF0dXMgOiBudW1iZXIpID0+IFxyXG5cdFx0XHRcdFx0e1xyXG4gICAgICAgICAgICAgICAgXHRcdGlmKHN0YXR1cyA9PSA0MDEpIHtcclxuXHRcdFx0XHRcdFx0XHQgdGhpcy5wYWdlU2VydmljZS5sb2dvdXQoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICBcdFx0fSk7IFxyXG5cdFx0XHQgICAgICAgICBcclxuXHRcdFx0LyoqR2V0IGF2YWlibGUgdGFzayAqL1xyXG4gICAgICAgICAgICB0aGlzLmdldEZyZWVUYXNrcyA9IChfaWQgOiBzdHJpbmcpID0+IFxyXG5cdFx0XHR7IFxyXG5cdFx0XHRcdHRoaXMudGFza0xpc3QuZ2V0RnJlZVRhc2tzKF9pZClcclxuXHRcdFx0XHRcdC5lcnJvcigoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICBcdCAgICBcdCAgXHRpZihzdGF0dXMgPT0gNDAxKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQgICB0aGlzLnBhZ2VTZXJ2aWNlLmxvZ291dCgpXHJcblx0XHRcdFx0XHQgICBcdFx0fSAgICBcclxuXHRcdFx0XHRcdH0pXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBcclxuXHRcdFx0LyoqR2V0IHRhc2sgKi8gICBcclxuICAgICAgICAgICAgdGhpcy5nZXRUYXNrcyA9IChfaWQgOiBzdHJpbmcpID0+IFxyXG5cdFx0XHRcdHRoaXMudGFza0xpc3QuZ2V0VGFza3MoX2lkKVxyXG5cdFx0XHRcdFx0LnN1Y2Nlc3MoICgpID0+IFxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0aGlzLnJlbmRlckNhbGVuZGFyKClcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQuZXJyb3IoKGRhdGEgOiBhbnksIHN0YXR1cyA6IG51bWJlcikgPT4gXHJcblx0XHRcdFx0XHR7XHJcbiAgICAgICAgICAgICAgICAgIFx0XHQgaWYoc3RhdHVzID09IDQwMSkge1xyXG5cdFx0XHRcdFx0XHRcdCAgICB0aGlzLnBhZ2VTZXJ2aWNlLmxvZ291dCgpXHJcblx0XHRcdFx0XHRcdCAgIH1cdFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0LyoqR2V0IHRhc2sgKi8gICBcclxuICAgICAgICAgICAgdGhpcy5nZXRGaW5pc2hlZFRhc2sgPSAoX2lkIDogc3RyaW5nKSA9PiBcclxuXHRcdFx0XHR0aGlzLnRhc2tMaXN0LmdldEZpbmlzaGVkKF9pZClcclxuXHRcdFx0XHRcdC5lcnJvcigoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PiBcclxuXHRcdFx0XHRcdHtcclxuICAgICAgICAgICAgICAgICAgXHRcdCBpZihzdGF0dXMgPT0gNDAxKSB7XHJcblx0XHRcdFx0XHRcdFx0ICAgIHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KClcclxuXHRcdFx0XHRcdFx0ICAgfVx0XHJcblx0XHRcdFx0XHR9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgICAgICAgLyoqR2V0IHByb2plY3RzKi9cclxuICAgICAgICAgICAgdGhpcy5nZXRQcm9qZWN0ID0gKCkgPT4gXHJcblx0XHRcdFx0dGhpcy5wcm9qZWN0cy5nZXQoKVxyXG4gICAgICAgICAgICAgICAgXHQuc3VjY2VzcygoZGF0YTogYW55LHN0YXR1cyA6IG51bWJlcikgPT4gXHJcblx0XHRcdFx0XHR7XHJcbiAgICAgICAgICAgICAgICAgICAgXHR0aGlzLmdldEV2ZW50cygpO1xyXG5cdFx0XHRcdFx0fVxyXG4gICAgICAgICAgICAgICAgKS5lcnJvcigoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PiBcclxuXHRcdFx0XHR7XHJcbiAgICAgICAgICAgICAgICAgICBpZihzdGF0dXMgPT0gNDAxKSB7XHJcblx0XHRcdFx0XHQgICAgdGhpcy5wYWdlU2VydmljZS5sb2dvdXQoKVxyXG5cdFx0XHRcdCAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0LyoqU2VsZWN0IHRhc2sgKi9cclxuXHRcdFx0dGhpcy5zZWxlY3RUYXNrID0gKHRhc2sgOiBFdmVudCkgPT4gXHJcblx0XHRcdFx0dGhpcy50YXNrTGlzdC5zZWxlY3RUYXNrKHRhc2spXHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnJlbW92ZVVzZXIgPSAoKSA9PiBcclxuXHRcdFx0XHR0aGlzLnRhc2tMaXN0LnJlbW92ZVVzZXIodGhpcy5wcm9qZWN0cy5pZClcclxuXHRcdFx0XHRcdC5zdWNjZXNzKCgpID0+IHRoaXMucmVuZGVyQ2FsZW5kYXIoKSlcclxuXHRcdFx0XHRcdC5lcnJvcigoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICBcdFx0aWYoc3RhdHVzID09IDQwMSl7XHJcblx0XHRcdFx0IFx0XHRcdHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KClcclxuXHRcdFx0XHRcdCAgXHQgfVxyXG4gICAgICAgICAgICAgICAgXHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuYWRkVXNlciA9ICgpID0+IFxyXG5cdFx0XHRcdHRoaXMudGFza0xpc3QuYWRkVXNlcih0aGlzLnByb2plY3RzLmlkLHRoaXMudXNlcilcclxuXHRcdFx0XHRcdC5zdWNjZXNzKCgpID0+IHRoaXMucmVuZGVyQ2FsZW5kYXIoKSlcclxuXHRcdFx0XHRcdC5lcnJvcigoZGF0YSA6IGFueSwgc3RhdHVzIDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHRpZihzdGF0dXMgPT0gNDAxKXtcclxuXHRcdFx0XHRcdFx0IHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KClcclxuXHRcdFx0XHRcdFx0fSAgIFxyXG5cdFx0XHQgXHRcdH0pO1xyXG5cdFx0XHRcdFx0IFxyXG5cdFx0XHR0aGlzLnRhc2tVc2VyID0gKCkgPT4gXHJcblx0XHRcdFx0dGhpcy50YXNrTGlzdC50YXNrVXNlcih0aGlzLnVzZXIubmFtZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmdldFByb2plY3QoKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyAiLCJtb2R1bGUgQ2FsZW5kYXIge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBsb2dpbkN0cmwge1xyXG4gICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogc3RyaW5nLFxyXG4gICAgICAgICAgICBlbWFpbDogc3RyaW5nLFxyXG4gICAgICAgICAgICBhZGRyZXNzOiBzdHJpbmdcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxvZ2luOiBib29sZWFuO1xyXG4gICAgICAgIHJlZzogYm9vbGVhbjtcclxuICAgICAgICBlcnJvcjogc3RyaW5nO1xyXG4gICAgICAgIHN0YXRpYyAkaW5qZWN0ID0gWyckc2NvcGUnLCckaHR0cCcsJyR3aW5kb3cnLCckbG9jYXRpb24nLCdwYWdlU2VydmljZSddO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpdmF0ZSAkaHR0cDogbmcuSUh0dHBTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgJHdpbmRvdyA6IG5nLklXaW5kb3dTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgJGxvY2F0aW9uOiBuZy5JTG9jYXRpb25TZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaXZhdGUgcGFnZVNlcnZpY2UgOiBwYWdlU2VydmljZSkge1xyXG4gICAgICAgICAgICB0aGlzLmxvZ2luID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxvZ2luUGFuZWwoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW4gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVnUGFuZWwoKSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9naW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5yZWcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdWJtaXQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmxvZ2luKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gJy91c2VyL2xvZ2luJztcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSAnL3VzZXIvcmVnaXN0ZXInO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuJGh0dHAucG9zdCh1cmwsIHRoaXMudXNlcikuc3VjY2VzcyggXHJcbiAgICAgICAgICAgICAgICAoZGF0YTogYW55LCBzdGF0dXMgOiBOdW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gMjAwKXsgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlU2VydmljZS5sb2dpbihkYXRhLnVzZXIpOyAgICBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihzdGF0dXMgPT09IDQwMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBDYWxlbmRhcntcclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIHBhZ2VDdHJse1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGlzQXV0aG9yaXplZDogKCkgPT4gYm9vbGVhbjtcclxuICAgICAgICBsb2dvdXQ6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgc3RhdGljICRpbmplY3QgPSBbJyRzY29wZScsJ3BhZ2VTZXJ2aWNlJywnJGh0dHAnXTtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLHByaXZhdGUgcGFnZVNlcnZpY2UgOiBwYWdlU2VydmljZSxwcml2YXRlICRodHRwOiBuZy5JSHR0cFNlcnZpY2Upe1xyXG4gICAgICAgICAgIHRoaXMuaXNBdXRob3JpemVkID0gdGhpcy5wYWdlU2VydmljZS5pc0F1dGhvcml6ZWQ7XHJcbiAgICAgICAgICAgdGhpcy5sb2dvdXQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgIHRoaXMuJGh0dHAucG9zdChcIi91c2VyL2xvZ291dFwiLEZvcm1EYXRhID0gbnVsbCkuc3VjY2VzcyhcclxuICAgICAgICAgICAgICAgICAgIChkYXRhOiBhbnkgLCBzdGF0dXMgOiBudW1iZXIpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmKHN0YXR1cyA9PSAyMDApIHRoaXMucGFnZVNlcnZpY2UubG9nb3V0KCk7IGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdCApfVxyXG4gICAgICAgICAgIHRoaXMuJGh0dHAuZ2V0KFwiL3VzZXIvZ2V0VXNlclwiKVxyXG4gICAgICAgICAgIFx0XHQuc3VjY2VzcyggKGRhdGEgOiBhbnkpID0+IHRoaXMucGFnZVNlcnZpY2UubG9naW4oZGF0YS51c2VyKSApIFxyXG4gICAgXHRcdFx0LmVycm9yKCAoKSA9PiB0aGlzLnBhZ2VTZXJ2aWNlLmxvZ291dCgpIClcdFxyXG5cdFx0fSBcclxuICAgIH1cclxufSIsIm1vZHVsZSBDYWxlbmRhciB7XHJcbiAgICBleHBvcnQgY2xhc3MgQ2FsZW5kYXJBcHAge1xyXG4gICAgICAgIHN0YXRpYyAkaW5qZWN0ID0gW1wiYW5ndWxhck1vZHVsZVwiXTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYW5ndWxhck1vZHVsZTogbmcuSU1vZHVsZSkgeyB9XHJcbiAgICB9IFxyXG4gICAgZXhwb3J0IHZhciBjYWxlbmRhcjogQ2FsZW5kYXJBcHA7XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0KCkge1xyXG4gICAgICAgIGNhbGVuZGFyID0gbmV3IENhbGVuZGFyQXBwKGFuZ3VsYXIubW9kdWxlKFwiY2FsZW5kYXJcIiwgW1widWkuY2FsZW5kYXJcIixcIm5nTWF0ZXJpYWxcIixcImNvbG9yLnBpY2tlclwiXSlcclxuICAgICAgICAgICAgLmNvbnRyb2xsZXIoXCJjYWxlbmRhckN0cmxcIiwgY2FsZW5kYXJDdHJsKVxyXG4gICAgICAgICAgICAuY29udHJvbGxlcihcImxvZ2luQ3RybFwiLGxvZ2luQ3RybClcclxuICAgICAgICAgICAgLmNvbnRyb2xsZXIoXCJwYWdlQ3RybFwiLHBhZ2VDdHJsKVxyXG4gICAgICAgICAgICAuc2VydmljZShcInBhZ2VTZXJ2aWNlXCIscGFnZVNlcnZpY2UpKVxyXG4gICAgfVxyXG59ICJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
