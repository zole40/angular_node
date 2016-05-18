var Calendar;
(function (Calendar) {
    var Project = (function () {
        function Project(_id, title, owner, users, description) {
            this._id = _id;
            this.title = title;
            this.owner = owner;
            this.users = users;
            this.description = description;
            users = new Array();
        }
        return Project;
    }());
    Calendar.Project = Project;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=projectModel.js.map