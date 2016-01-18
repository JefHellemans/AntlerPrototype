(function (){
    "use strict";

    var mainController = function($scope, userService, tradeService){

        $scope.isNewTrade = true;
        $scope.homepage = true;


        var authenticate = function(config){
            userService.authenticate(config).then(onAuthenticated, onAuthError);
        };

        var onAuthenticated = function(response){
            $scope.token = response.token;
            getFollowing();
            getCompanies();
            getNewTraders();
            getTrades();
        };

        var onAuthError = function(err){
            console.log(err);
        };

        var getFollowing = function(){
            userService.getAllFollowing($scope.token).then(onUsersLoaded, onUsersError);
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
            $scope.user.currentAmount = 0;
            $scope.user.profilepicture = "../dist/images/profiles/profile.jpg";
            var config = {email: response.email, password: response.password};
            authenticate(config);
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        var getTrades = function() {
            tradeService.getTradesFromUser($scope.token).then(onTradesLoaded, onTradesError);
        };

        var onTradesLoaded = function(response) {
            $scope.user.trades = response;
            tradeCanvas($scope.user);
        };

        var onTradesError = function(err) {
            console.log(err);
        };

        var getNewTraders = function(){
            userService.getAll($scope.token).then(onNewTraders, onNewTradersError);
        };

        var onNewTraders = function(response){

            var users = response;

            angular.forEach(users, function(user){
                var index = users.indexOf(user);
                if(user._id === $scope.user._id){
                    users.splice(index, 1);
                }
            });

            $scope.newTraders = users;

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
                    tradeService.postTrade(trade, $scope.companies, $scope.token).then(onTradePosted, onTradeError);
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
            tradeService.getCompanies($scope.token).then(onCompanies, onCompaniesError);
        };

        var onCompanies = function(response){
            $scope.companies = response;
        };
        var onCompaniesError = function(err){
            console.log(err);
        };

        getLoggedInUser();
    };

    angular.module("app").controller("mainController", [ "$scope", "userService", "tradeService", mainController]);
})();