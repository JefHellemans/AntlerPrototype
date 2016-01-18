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
            $scope.user.currentAmount = response.balance;
            $scope.user.profilepicture = "../dist/images/profiles/profile.jpg";
            getNewTraders();
            getTrades();
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        var getTrades = function() {
            tradeService.getTradesFromUser().then(onTradesLoaded, onTradesError);
        };

        var onTradesLoaded = function(response) {
            $scope.user.trades = response;
            tradeCanvas($scope.user);
        };

        var onTradesError = function(err) {
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
                if($scope.user._id != user._id){
                    newTraders.push(user);
                }
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
            if(trade != null){
                if(trade.Company != null && trade.AmountInvested != null
                    && trade.stock != null && trade.PercentageInvested != null
                    && trade.longShort != null && trade.Comment != null) {
                    tradeService.postTrade(trade, $scope.companies).then(onTradePosted, onTradeError);
                }else {

                }
            }else {
                $scope.errorText = "Gelieve alles in te vullen";
            }
        };

        var onTradePosted = function(response){
            return $scope.isNewTrade = true;
        };
        var onTradeError = function(err){
            console.log(err);
        };

        var getCompanies = function(){
            tradeService.getCompanies().then(onCompanies, onCompaniesError);
        };

        var onCompanies = function(response){
            $scope.companies = response;
        };
        var onCompaniesError = function(err){
            console.log(err);
        };

        getFollowing();
        getLoggedInUser();
        getCompanies();
    };

    angular.module("app").controller("mainController", [ "$scope", "userService", "tradeService", mainController]);
})();