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

        var onAuthError = function(err){
            console.log(err);
        };

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            $scope.user.currentAmount = response.balance;
            $scope.user.profilepicture = "../dist/images/profiles/profile.jpg";
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
            $scope.user.tradeHistory = [];
            for(var i = 0, l = $scope.user.trades.length; i < l; i++) {
                var t = $scope.user.trades[i];
                if(t.stopStockPrice >= 0) {
                    t.Date = new Date(t.Date);
                    t.stock = Math.floor(t.AmountInvested / t.StartStockPrice);
                    if(t.IsShort) {
                        t.difference = (t.StartStockPrice - t.StopStockPrice) * t.stock;
                    } else {
                        t.difference = (t.StopStockPrice - t.StartStockPrice) * t.stock;
                    }
                    $scope.user.tradeHistory.push(t);
                }
            }
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