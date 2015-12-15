(function (){
    "use strict";

    var app = angular.module("app", ["ngRoute"]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "pages/home.html",
                controller: "mainController"
            })
            .when("/profile/:id", {
                templateUrl: "pages/profile.html",
                controller: "profileController"
            })
            .otherwise({
                redirectTo: "/home"
            });
    });
})();