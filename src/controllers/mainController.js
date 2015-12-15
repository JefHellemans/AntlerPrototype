(function (){
    "use strict";

    var mainController = function($scope){
        //new code goes here

        $scope.userId = "1";
        $scope.firstName = "Marijn";
        $scope.lastName = "Hosten";
    };

    angular.module("app").controller("mainController", [ "$scope", mainController]);
})();