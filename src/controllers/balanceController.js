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
        $scope.change = 0;

        $scope.deposit = function() {
            $scope.user.currentAmount += $scope.change;
            $window.location = "/balance";
        };

        $scope.withdraw = function() {
            $scope.user.currentAmount -= $scope.change;
            $window.location = "/balance";
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

        getLoggedInUser();
    };

    angular.module("app").controller("balanceController", [ "$scope", "$routeParams", "$window", "userService", balanceController]);
})();