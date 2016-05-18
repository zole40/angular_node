module Calendar {
    export class CalendarApp {
        constructor(public angularModule: ng.IModule) { }
    }

    export var calendar: CalendarApp;

    export function start() {
        calendar = new CalendarApp(angular.module("calendar", ["ui.calendar","ngMaterial","color.picker"])
            .controller("calendarCtrl", calendarCtrl)
            .controller("loginCtrl",loginCtrl)
            .controller("pageCtrl",pageCtrl)
            .service("pageService",pageService));
    }
} 