(function (){
    "use strict";

    var balanceController = function($scope, $routeParams, $window){
        //new code goes here

        $scope.user = {};
        $scope.user.userId = "1";
        $scope.user.firstName = "Marijn";
        $scope.user.lastName = "Hosten";
        $scope.user.depositAmount = 0;
        $scope.user.currentAmount = 2000;

        $scope.deposit = function(user){
            $scope.user.currentAmount += user.depositAmount;
            $window.location.hash = "/home";
        };

        $scope.isEnabled = function(){
            if($scope.user.depositAmount === 0 || typeof $scope.user.depositAmount == "undefined"){
                return true;
            }else {
                return false;
            }
        }
    };



    angular.module("app").controller("balanceController", [ "$scope", "$routeParams", "$window",balanceController]);
})();