var Calendar;
(function (Calendar) {
    var Event = (function () {
        function Event($http) {
            var _this = this;
            this.$http = $http;
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
        }
        return Event;
    }());
    Calendar.Event = Event;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=eventModel.js.map