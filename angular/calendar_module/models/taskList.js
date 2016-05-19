var Calendar;
(function (Calendar) {
    var taskList = (function () {
        function taskList($http, eventSources, tasks, selectedTask) {
            var _this = this;
            this.$http = $http;
            this.eventSources = eventSources;
            this.tasks = tasks;
            this.selectedTask = selectedTask;
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
            this.removeUser = function (task, id) {
                return task.removeUser(id)
                    .success(function (data, status) {
                    if (status == 204) {
                        var index_1;
                        _this.eventSources.forEach(function (element) {
                            if (element._id === task._id)
                                index_1 = _this.eventSources.indexOf(element);
                        });
                        task.user = "";
                        _this.eventSources[index_1].user = "";
                        _this.tasks.push(_this.eventSources[index_1]);
                        _this.eventSources.splice(index_1, 1);
                    }
                });
            };
            this.addUser = function (task, id, user) {
                return task.addUser(id)
                    .success(function (data, status) {
                    if (status == 204) {
                        task.user = user.name;
                        task.color = user.color;
                        _this.eventSources.push(task);
                        var index = _this.tasks.indexOf(task);
                        _this.tasks.splice(index, 1);
                    }
                });
            };
            this.taskUser = function (userName) { return _this.selectedTask.user === userName; };
            this.selectTask = function (task) {
                task ?
                    _this.newTask = false : _this.newTask = true;
                _this.newTask ?
                    _this.selectedTask = new Calendar.Event(_this.$http) : _this.selectedTask = task;
            };
            this.updateTask = function (task, id) {
                var url = "/task/";
                _this.newTask ? url += "addTask" : url += "modifyTask";
                return task.update(id, url)
                    .success(function (data, status) {
                    if (status === 201) {
                        var event_1 = new Calendar.Event(_this.$http);
                        event_1.set(data.task);
                        _this.tasks.push(event_1);
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