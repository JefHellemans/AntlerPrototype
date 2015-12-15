(function (){
    "use strict";

    var profileController = function($scope, $routeParams){
        //new code goes here
        console.log($routeParams.id);

        $scope.firstName = "Marijn";
        $scope.lastName = "Hosten";
    };

    angular.module("app").controller("profileController", [ "$scope", "$routeParams", profileController]);
})();