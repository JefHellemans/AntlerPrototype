(function (){
    "use strict";

    var balanceController = function($scope, $routeParams, $window) {
        //new code goes here

        $scope.user = {};
        $scope.user._id = "1";
        $scope.user.firstName = "Jef";
        $scope.user.lastName = "Hellemans";
        $scope.user.profilepicture = "../dist/images/profiles/profile.jpg";
        $scope.user.depositAmount = 0;
        $scope.user.currentAmount = 2000;

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
    };

    angular.module("app").controller("balanceController", [ "$scope", "$routeParams", "$window", balanceController]);
})();