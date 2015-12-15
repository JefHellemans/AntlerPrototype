(function (){
    "use strict";

    var balanceController = function($scope, $routeParams){
        //new code goes here

        $scope.user = {};
        $scope.user.userId = "1";
        $scope.user.firstName = "Marijn";
        $scope.user.lastName = "Hosten";


    };

    angular.module("app").controller("balanceController", [ "$scope", "$routeParams", balanceController]);
})();