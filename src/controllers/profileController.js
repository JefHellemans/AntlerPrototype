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

                if(!followers.indexOf(follower) > -1){
                    followers.push(follower);
                    followerAmount++;
                }
            });

            var following = [];
            var followingAmount = 0;
            angular.forEach($scope.trader.following, function(followee){
                if(!following.indexOf(followee) > -1){
                    following.push(followee);
                    followingAmount++;
                }
            });

            var trades = [];
            var total = 0;
            angular.forEach($scope.trader.trades, function(trade){
                if(!trades.indexOf(trade) > -1){
                    trades.push(trade);
                    total++;
                }
            });

            $scope.trader.followersAmount = followerAmount;
            $scope.trader.followingAmount = followingAmount;
            $scope.trader.total = total;
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
            if($scope.user._id != trader._id) {

                if ($scope.trader.followers.indexOf($scope.user._id) == -1) {
                    userService.followTrader(trader).then(onFollow, onFollowError);
                } else {
                    $scope.errorText = "U volgt deze persoon al";
                }
            }
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