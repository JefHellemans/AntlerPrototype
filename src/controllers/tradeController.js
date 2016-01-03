(function (){
    "use strict";

    var tradeController = function($scope, $routeParams, $window) {
        //new code goes here

        $scope.user = {};
        $scope.user.userId = "1";
        $scope.user.firstName = "Jef";
        $scope.user.lastName = "Hellemans";
        $scope.user.depositAmount = 0;
        $scope.user.currentAmount = 2000;

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

    };

    angular.module("app").controller("tradeController", [ "$scope", "$routeParams", "$window", tradeController]);
})();