(function (){
    "use strict";

    var balanceController = function($scope, $routeParams, $window, userService) {

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            $scope.user.currentAmount = 2000;
            $scope.user.traders = 2000;
            $scope.user.invested = 2000;
            $scope.user.total = $scope.user.currentAmount + $scope.user.traders + $scope.user.invested;
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        $scope.sortType = 'date';
        $scope.sortReverse = false;

        $scope.transactions = [];
        $scope.transactions.push({"date": new Date().toLocaleString(), "source": "Balance", "destination": "Withdrawal", "change": ((Math.floor((Math.random() * 20000)) / 100) - 100)});
        $scope.transactions.push({"date": new Date().toLocaleString(), "source": "Balance", "destination": "Deposit", "change": ((Math.floor((Math.random() * 20000)) / 100) - 100)});
        $scope.transactions.push({"date": new Date().toLocaleString(), "source": "Balance", "destination": "Withdrawal", "change": ((Math.floor((Math.random() * 20000)) / 100) - 100)});
        $scope.transactions.push({"date": new Date().toLocaleString(), "source": "Balance", "destination": "Deposit", "change": ((Math.floor((Math.random() * 20000)) / 100) - 100)});

        $scope.deposit = function(user) {
            $scope.user.currentAmount += user.depositAmount;
            $window.location = "/index";
        };

        $scope.withdraw = function(user){
            console.log(user);
            $scope.user.currentAmount -= user.withdrawAmount;
        };

        $scope.isEnabled = function() {
            return ($scope.user.depositAmount === 0 || typeof $scope.user.depositAmount === "undefined");
        };

        $scope.withdrawEnabled = function() {
            return ($scope.user.currentAmount === 0 || typeof $scope.user.withdrawAmount === "undefined");
        };

        getLoggedInUser();
    };

    angular.module("app").controller("balanceController", [ "$scope", "$routeParams", "$window", "userService", balanceController]);
})();