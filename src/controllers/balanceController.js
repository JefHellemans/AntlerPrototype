(function (){
    "use strict";

    var balanceController = function($scope, $routeParams, $window, userService) {

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            $scope.user.currentAmount = 2000;
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        $scope.sortType = 'date';
        $scope.sortReverse = false;

        $scope.transactions = [];
        $scope.transactions.push({"date": new Date().toLocaleString(), "change": ((Math.floor((Math.random() * 20000)) / 100) - 100)});
        $scope.transactions.push({"date": new Date().toLocaleString(), "change": ((Math.floor((Math.random() * 20000)) / 100) - 100)});
        $scope.transactions.push({"date": new Date().toLocaleString(), "change": ((Math.floor((Math.random() * 20000)) / 100) - 100)});
        $scope.transactions.push({"date": new Date().toLocaleString(), "change": ((Math.floor((Math.random() * 20000)) / 100) - 100)});

        $scope.deposit = function(user) {
            $scope.user.currentAmount += user.depositAmount;
            $window.location.hash = "/home";
        };

        $scope.isEnabled = function() {
            return ($scope.user.depositAmount === 0 || typeof $scope.user.depositAmount == "undefined");
        };

        getLoggedInUser();
    };

    angular.module("app").controller("balanceController", [ "$scope", "$routeParams", "$window", "userService", balanceController]);
})();