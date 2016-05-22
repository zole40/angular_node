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
        return ProjectList;
    }());
    Calendar.ProjectList = ProjectList;
})(Calendar || (Calendar = {}));
;
//# sourceMappingURL=projectList.js.map