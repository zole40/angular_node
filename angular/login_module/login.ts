module Login {
    export class loginApp {
        constructor(public angularModule: ng.IModule) { }
    }
    export var login: loginApp;

    export function start() {
        login = new loginApp(angular.module("login", ["ngMaterial"])
        .controller("LoginCtrl",LoginCtrl));
    }
} 