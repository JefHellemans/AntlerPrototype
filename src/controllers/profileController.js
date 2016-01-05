(function (){
    "use strict";

    var profileController = function($scope, $routeParams, $window, userService) {

        var userId = $routeParams.id;
        var getTrader = function() {
            userService.getById(userId).then(onTraderLoaded, onTraderError);
        };

        var onTraderLoaded = function(response) {
            $scope.trader = response;
            // follower amount, trader amount, total trades amount
            var followers = [];
            var followerAmount = 0;
            angular.forEach($scope.trader.followers, function(follower){
                followers.push(follower);
                //if(followers[followerAmount])
                followerAmount++;
            });
        };

        var onTraderError = function(err) {
            console.log(err);
        };

        var getUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        $scope.submitForm = function(user) {
            alert("changes saved");
            $window.location = "index";
        };

        $scope.follow = function(trader){
            userService.followTrader(trader).then(onFollow, onFollowError);
        };

        var onFollow = function(response){
            $window.location = "index";
        };

        var onFollowError = function(err){
            console.log(err);
        };

        getTrader();
        getUser();
    };

    angular.module("app").controller("profileController", [ "$scope", "$routeParams", "$window", "userService", profileController]);
})();