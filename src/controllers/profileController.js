(function (){
    "use strict";

    var profileController = function($scope, $routeParams, $window, userService){

        var userId = $routeParams.id;
        var getUser = function(){
            userService.getById(userId).then(onUserLoaded, onUserError);
        };

        var onUserLoaded = function(response){
            $scope.user = response;
        };

        var onUserError = function(err){
            console.log(err);
        };

        $scope.isEnabled = function (){
            return false;
        };

        $scope.submitForm = function(user) {
            alert("changes saved");
            $window.location.hash = "/home";
        };

        getUser();
    };

    angular.module("app").controller("profileController", [ "$scope", "$routeParams", "$window", "userService", profileController]);
})();