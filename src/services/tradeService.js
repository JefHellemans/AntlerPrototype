(function(){
    "use strict";

    var url = "http://localhost:3000/api";

    var tradeService = function ($http) {

        var getTradesFromUser = function () {

        };

        return {
            getTradesFromUser: getTradesFromUser
        };

    };

    angular.module("app").factory("tradeService", ["$http", tradeService]);
})();