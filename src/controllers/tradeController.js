(function (){
    "use strict";

    var tradeController = function($scope, $window, userService, tradeService) {

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            $scope.user.currentAmount = response.balance;
            getTrades();
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        var getTrades = function() {
            tradeService.getTradesFromUser().then(onTradesLoaded, onTradesError);
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