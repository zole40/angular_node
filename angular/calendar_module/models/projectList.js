var Calendar;
(function (Calendar) {
    var ProjectList = (function () {
        function ProjectList(avaible, selected) {
            var _this = this;
            this.avaible = avaible;
            this.selected = selected;
            this.addProjects = function (project) { return _this.avaible.push(project); };
            this.removeProject = function (project) {
                var index = avaible.indexOf(project);
                if (_this.selected === index)
                    _this.selected = 0;
                avaible.slice(index, 1);
            };
        }
        return ProjectList;
    }());
    Calendar.ProjectList = ProjectList;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=projectList.js.map