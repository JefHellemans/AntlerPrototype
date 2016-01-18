(function (){
    "use strict";

    var tradeController = function($scope, $window, userService, tradeService) {

        var authenticate = function(config){
            userService.authenticate(config).then(onAuthenticated, onAuthError);
        };

        var onAuthenticated = function(response){
            $scope.token = response.token;
            getTrades();
        };

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            $scope.user.currentAmount = response.balance;
            var config = {email: response.email, password: response.password};
            authenticate(config);
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        var getTrades = function() {
            tradeService.getTradesFromUser($scope.token).then(onTradesLoaded, onTradesError);
        };

        var onTradesLoaded = function(response) {
            $scope.user.trades = response;
            tradeCanvas($scope.user);
        };

        var onTradesError = function(err) {
            console.log(err);
        };

        $scope.sortType = 'date';
        $scope.sortReverse = false;

        getLoggedInUser();
    };

    angular.module("app").controller("tradeController", [ "$scope", "$window", "userService", "tradeService", tradeController]);
})();