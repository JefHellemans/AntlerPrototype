(function (){
    "use strict";

    var tradeController = function($scope, $routeParams, $window) {
        //new code goes here

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
                "inAt": inAt.toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}),
                "outAt": outAt.toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}),
                "difference": difference.toLocaleString('be-NL', {style: 'currency', currency: 'EUR'})
            });
        }

    };

    angular.module("app").controller("tradeController", [ "$scope", "$routeParams", "$window", tradeController]);
})();