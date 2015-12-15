(function (){
    "use strict";

    var profileController = function($scope, $routeParams){
        //new code goes here
        console.log($routeParams.id);

        $scope.firstName = "Marijn";
        $scope.lastName = "Hosten";
        $scope.passw1 = "";
        $scope.passw2 = "";
    };

    angular.module("app").controller("profileController", [ "$scope", "$routeParams", profileController]);
})();