(function (){
    "use strict";

    var app = angular.module("app", ["ngRoute"]);

    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "pages/home.html",
                controller: "mainController"
            })
            .when("/user/:id", {
                templateUrl: "pages/profile.html",
                controller: "profileController"
            })
            .when("/user", {
                templateUrl: "pages/ownProfile.html",
                controller: "profileController"
            })
            .when("/balanceHistory", {
                templateUrl: "pages/balanceHistory.html",
                controller: "balanceController"
            })
            .when("/deposit", {
                templateUrl: "pages/deposit.html",
                controller: "balanceController"
            })
            .when("/withdraw", {
                templateUrl: "pages/withdraw.html",
                controller: "balanceController"
            })
            .when("/tradeHistory", {
                templateUrl: "pages/tradeHistory.html",
                controller: "tradeController"
            })
            .otherwise({
                redirectTo: "/"
            });
        $locationProvider.html5Mode(true);
    });

})();