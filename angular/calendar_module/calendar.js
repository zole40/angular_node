var Calendar;
(function (Calendar) {
    var CalendarApp = (function () {
        function CalendarApp(angularModule) {
            this.angularModule = angularModule;
        }
        return CalendarApp;
    }());
    Calendar.CalendarApp = CalendarApp;
    function start() {
        Calendar.calendar = new CalendarApp(angular.module("calendar", ['ui.calendar', 'ngMaterial', 'color.picker'])
            .controller("calendarCtrl", Calendar.calendarCtrl));
    }
    Calendar.start = start;
})(Calendar || (Calendar = {}));
//# sourceMappingURL=calendar.js.map