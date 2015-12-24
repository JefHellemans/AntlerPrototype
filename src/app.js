(function (){
    "use strict";

    var app = angular.module("app", ["ngRoute"]);

    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "pages/home.html",
                controller: "mainController"
            })
            .when("/profile/:id", {
                templateUrl: "pages/profile.html",
                controller: "profileController"
            })
            .when("/balanceHistory/:id", {
                templateUrl: "pages/balanceHistory.html",
                controller: "balanceController"
            })
            .when("/deposit/:id", {
                templateUrl: "pages/deposit.html",
                controller: "balanceController"
            })
            .when("/withdraw/:id", {
                templateUrl: "pages/withdraw.html",
                controller: "balanceController"
            })
            .otherwise({
                redirectTo: "/home"
            });
    });

})();