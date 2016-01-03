(function (){
    "use strict";

    var mainController = function($scope, userService){

        $scope.isNewTrade = true;

        $scope.homepage = true;

        var getUsers = function(){
            userService.getAll().then(onUsersLoaded, onUsersError);
        };

        var onUsersLoaded = function(response){
            $scope.traders = response;
        };

        var onUsersError = function(err){
            console.log(err);
        };

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            $scope.user.currentAmount = 2000;
            $scope.user.profilepicture = "../dist/images/profiles/profile.jpg";
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        $scope.newTrade = function(){
            //nieuwe trade maken via slide animation
            return $scope.isNewTrade = false;
        };

        $scope.confirmTrade = function () {
            return $scope.isNewTrade = true;
        };

        tradeCanvas();
        getUsers();
        getLoggedInUser();
    };

    angular.module("app").controller("mainController", [ "$scope", "userService", mainController]);
})();