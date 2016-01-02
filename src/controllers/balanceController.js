(function (){
    "use strict";

    var balanceController = function($scope, $routeParams, $window) {
        //new code goes here

        $scope.user = {};
        $scope.user.userId = "1";
        $scope.user.firstName = "Marijn";
        $scope.user.lastName = "Hosten";
        $scope.user.depositAmount = 0;
        $scope.user.currentAmount = 2000;

        $scope.transactions = [];
        $scope.transactions.push({"date": new Date().toLocaleString(), "change": ((Math.floor((Math.random() * 20000)) / 100) - 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'})});
        $scope.transactions.push({"date": new Date().toLocaleString(), "change": ((Math.floor((Math.random() * 20000)) / 100) - 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'})});
        $scope.transactions.push({"date": new Date().toLocaleString(), "change": ((Math.floor((Math.random() * 20000)) / 100) - 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'})});
        $scope.transactions.push({"date": new Date().toLocaleString(), "change": ((Math.floor((Math.random() * 20000)) / 100) - 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'})});

        $scope.deposit = function(user) {
            $scope.user.currentAmount += user.depositAmount;
            $window.location.hash = "/home";
        };

        $scope.isEnabled = function() {
            return ($scope.user.depositAmount === 0 || typeof $scope.user.depositAmount == "undefined");
        };
    };

    angular.module("app").controller("balanceController", [ "$scope", "$routeParams", "$window", balanceController]);
})();