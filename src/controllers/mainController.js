(function (){
    "use strict";

    var mainController = function($scope){
        //new code goes here

        $scope.user = {};
        $scope.user.userId = "1";
        $scope.user.firstName = "Marijn";
        $scope.user.lastName = "Hosten";


    };

    angular.module("app").controller("mainController", [ "$scope", mainController]);
})();