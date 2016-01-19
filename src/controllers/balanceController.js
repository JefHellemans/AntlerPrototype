(function (){
    "use strict";

    var balanceController = function($scope, $routeParams, $window, userService, transactionService, tradeService) {

        var authenticate = function(config){
            userService.authenticate(config).then(onAuthenticated, onAuthError);
        };

        var onAuthenticated = function(response){
            $scope.token = response.token;
            getTradesFromUser();
        };

        var onAuthError = function(err){
            console.log(err);
        };

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            var config = {email: response.email, password: response.password};
            authenticate(config);
            for(var i = 0, l = response.transactions.length; i < l; i++) {
                var d = response.transactions[i].date;
                response.transactions[i].date = new Date(d);
            }
            $scope.user = response;
            $scope.user.currentAmount = response.balance;
            $scope.user.profilepicture = response.imageUrl;

        };

        var onLoggedError = function(err){
            console.log(err);
        };

        $scope.sortType = 'date';
        $scope.sortReverse = true;
        $scope.change = 0;

        $scope.deposit = function() {
            transactionService.postTransaction($scope.change, $scope.token).then(onTransactionPosted, onTransactionError);
        };

        $scope.withdraw = function() {
            transactionService.postTransaction(-$scope.change, $scope.token).then(onTransactionPosted, onTransactionError);
        };

        var onTransactionPosted = function() {
            $window.location = "/balance";
        };

        var onTransactionError = function(err) {
            console.log(err);
        };

        $scope.changeField = function(withdraw) {
            if($scope.change === undefined) {
                $scope.change = 0;
            } else if(withdraw && $scope.change > $scope.user.currentAmount) {
                $scope.change = $scope.user.currentAmount;
            }
        };

        $scope.isEnabled = function() {
            return ($scope.change <= 0);
        };

        $scope.transactionClass = function(transaction) {
            if(transaction.amountchange >= 0) {
                return "positive";
            } else {
                return "negative";
            }
        };

        var getTradesFromUser = function(){
            tradeService.getTradesFromUser($scope.token).then(onTradesLoaded, onTradesError);
        };

        var onTradesLoaded = function(response){
            var invested = 0;
            angular.forEach(response, function(trade){
                invested += trade.AmountInvested;
            });
            $scope.user.invested = invested;
        };

        var onTradesError = function(err){
            console.log(err);
        };

        getLoggedInUser();
    };

    angular.module("app").controller("balanceController", [ "$scope", "$routeParams", "$window", "userService", "transactionService", "tradeService",balanceController]);
})();