var Calendar;
(function (Calendar) {
    var ProjectList = (function () {
        function ProjectList($http, avaible, selected, id) {
            var _this = this;
            this.$http = $http;
            this.avaible = avaible;
            this.selected = selected;
            this.id = id;
            this.getProject = function () { return _this.$http.get("/project/getProject")
                .success(function (data, status) {
                _this.avaible = [];
                data.projects.forEach(function (element) {
                    var project = new Calendar.Project(_this.$http);
                    project.set(element);
                    _this.avaible.push(project);
                });
                _this.id = _this.avaible[_this.selected]._id;
            }); };
            this.getProjectUsers = function () { return _this.avaible[_this.selected] ? _this.avaible[_this.selected].users : undefined; };
            this.changeProject = function (userName) {
                for (var i in _this.avaible) {
                    if (_this.avaible[i]._id === _this.id) {
                        _this.selected = _this.avaible.indexOf(_this.avaible[i]);
                    }
                }
                if (_this.avaible[_this.selected]) {
                    _this.owner = userName === _this.avaible[_this.selected].owner;
                }
            };
            this.selectProject = function (newProject) {
                _this.newProject = newProject;
                _this.newProject ?
                    _this.selectedProject = new Calendar.Project(_this.$http) : _this.selectedProject = _this.avaible[_this.selected];
            };
            this.updateProject = function () {
                var url = "/project/";
                _this.newProject ?
                    url += "addProject" : url += "modifyProject";
                return _this.selectedProject.update(url)
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
        }
        return ProjectList;
    }());
    Calendar.ProjectList = ProjectList;
})(Calendar || (Calendar = {}));
;
//# sourceMappingURL=projectList.js.map