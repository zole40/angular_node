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
        return taskList;
    }());
    Calendar.taskList = taskList;
})(Calendar || (Calendar = {}));
;
//# sourceMappingURL=taskList.js.map