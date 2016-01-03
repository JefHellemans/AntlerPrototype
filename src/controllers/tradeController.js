(function (){
    "use strict";

    var tradeController = function($scope, $window, userService) {

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            $scope.user.currentAmount = 2000;
        };

        var onLoggedError = function(err){
            console.log(err);
        };

        $scope.sortType = 'date';
        $scope.sortReverse = false;

        $scope.trades = [];
        for(var i = 0; i < 5; i++) {
            var shares = Math.floor(Math.random() * 200);
            var type = Math.floor(Math.random() * 2);
            var inAt = Math.floor((Math.random() * 20000)) / 100;
            var outAt = Math.floor((Math.random() * 20000)) / 100;
            var difference = (inAt - outAt) * shares;
            if(type === 0) {
                type = "Long";
            } else {
                difference = -difference;
                type = "Short";
            }
            $scope.trades.push({"date": new Date().toLocaleString(),
                "shares": shares,
                "type": type,
                "inAt": inAt,
                "outAt": outAt,
                "difference": difference
            });
        }

        getLoggedInUser();
    };

    angular.module("app").controller("tradeController", [ "$scope", "$window", "userService", tradeController]);
})();