(function (){
    "use strict";



    var profileController = function($scope, $routeParams, $window, userService){
        //new code goes here

        var userId = $routeParams.id;
        $scope.user = userService.getById(userId);

        /*$scope.user = {
            "id": 1,
            "firstName": "Marijn",
            "lastName": "Hosten",
            "passw1": "123456",
            "passw2": "123456",
            "currentAmount": 2000
        };*/

        $scope.isEnabled = function (){
            return false;
        };

        $scope.submitForm = function(user) {
            alert("changes saved");
            $window.location.hash = "/home";
        };
    };

    angular.module("app").controller("profileController", [ "$scope", "$routeParams", "$window", "userService", profileController]);
})();