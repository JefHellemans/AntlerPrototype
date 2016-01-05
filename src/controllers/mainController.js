(function (){
    "use strict";

    var mainController = function($scope, userService, tradeService){

        $scope.isNewTrade = true;
        $scope.homepage = true;

        var getFollowing = function(){
            userService.getAllFollowing().then(onUsersLoaded, onUsersError);
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
            getNewTraders();
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        var getNewTraders = function(){
            userService.getAll().then(onNewTraders, onNewTradersError);
        };

        var onNewTraders = function(response){

            var users = response;
            var currentFollowing = [];
            var newTraders = [];

            angular.forEach($scope.user.following, function(followee){
                currentFollowing.push(followee);

                angular.forEach(users, function(user){

                    var index = users.indexOf(user);

                    if(user._id === followee || user._id === $scope.user._id){
                        users.splice(index, 1);
                    }
                });
            });

            angular.forEach(users, function(user){
                 newTraders.push(user);
            });

            $scope.newTraders = newTraders;
        };

        var onNewTradersError = function(err){
            console.log(err);
        };

        $scope.newTrade = function(){
            return $scope.isNewTrade = false;
        };


        $scope.confirmTrade = function (trade) {
            console.log(trade);

            //post met trade info naar trade api
            //tradeService.makeTrade(trade);

            return $scope.isNewTrade = true;
        };

        tradeCanvas();
        getFollowing();
        getLoggedInUser();
    };

    angular.module("app").controller("mainController", [ "$scope", "userService", "tradeService", mainController]);
})();