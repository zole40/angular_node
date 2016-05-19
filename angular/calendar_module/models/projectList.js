var Calendar;
(function (Calendar) {
    var ProjectList = (function () {
        function ProjectList($http, avaible, selected, id) {
            var _this = this;
            this.$http = $http;
            this.avaible = avaible;
            this.selected = selected;
            this.id = id;
            this.getProject = function () { return _this.$http.get("/project/getProject"); };
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
        }
        return ProjectList;
    }());
    Calendar.ProjectList = ProjectList;
})(Calendar || (Calendar = {}));
;
//# sourceMappingURL=projectList.js.map