var Calendar;
(function (Calendar) {
    var User = (function () {
        function User(name, color, _id, email, address) {
            this.name = name;
            this.color = color;
            this._id = _id;
            this.email = email;
            this.address = address;
        }
        return User;
    }());
    Calendar.User = User;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=userModel.js.map