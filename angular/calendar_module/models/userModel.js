var Calendar;
(function (Calendar) {
    var User = (function () {
        function User() {
            var _this = this;
            this.set = function (user) {
                _this._id = user._id;
                _this.address = user.address;
                _this.color = user.color;
                _this.email = user.email;
                _this.name = user.name;
                _this.password = user.password;
            };
            this.setHttp = function (http) { return _this.$http = http; };
            /**Update user profile */
            this.update = function () { return _this.$http({
                method: "POST",
                url: "/user/modifyUser",
                data: _this
            }); };
            this.changeColor = function () { return _this.$http({
                method: "POST",
                url: "/user/changeColor",
                data: { color: _this.color }
            }); };
        }
        return User;
    }());
    Calendar.User = User;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=userModel.js.map