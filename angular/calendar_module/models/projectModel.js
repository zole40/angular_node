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
        return Project;
    }());
    Calendar.Project = Project;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=projectModel.js.map