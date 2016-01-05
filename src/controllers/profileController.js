(function (){
    "use strict";

    var profileController = function($scope, $routeParams, $window, userService) {

        var userId = $routeParams.id;
        var getTrader = function() {
            userService.getById(userId).then(onTraderLoaded, onTraderError);
        };

        var onTraderLoaded = function(response) {
            $scope.trader = response;
        };

        var onTraderError = function(err) {
            console.log(err);
        };

        var getUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        $scope.submitForm = function(user) {
            alert("changes saved");
            $window.location = "index";
        };

        $scope.follow = function(trader){
            console.log(trader);
            console.log($scope.user);
            userService.followTrader(trader).then(onFollow, onFollowError);
        };

        var onFollow = function(response){
            $window.location = "index";
        };

        var onFollowError = function(err){
            console.log(err);
        };

        getTrader();
        getUser();
    };

    angular.module("app").controller("profileController", [ "$scope", "$routeParams", "$window", "userService", profileController]);
})();