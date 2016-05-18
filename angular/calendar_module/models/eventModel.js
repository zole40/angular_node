var Calendar;
(function (Calendar) {
    var Event = (function () {
        function Event(title, _id, start, color, user, finished) {
            this.title = title;
            this._id = _id;
            this.start = start;
            this.color = color;
            this.user = user;
            this.finished = finished;
        }
        return Event;
    }());
    Calendar.Event = Event;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=eventModel.js.map