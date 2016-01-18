(function(){
    "use strict";

    var url = "http://localhost:3000/api";

    var tradeService = function ($http) {

        var getTradesFromUser = function (token) {

            return $http.get(url + "/trades", {
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data;
            });
        };

        var getCompanies = function(token) {
            return $http.get(url + "/companies", {
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data;
            });
        };

        var postTrade = function(trade, companies, token){
            // companyId, isShort, AmountInvested, PercentageInvested, StartStockPrice, Comment, StartStockPrice
            fillProperties(trade, companies);

            return $http.post(url + "/trades", trade, {
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data;
            });
        };

        function fillProperties(trade, companies){

            if(trade.longShort.toString() === "long"){
                trade.IsShort = false;
            }else {
                trade.IsShort = true;
            }

            trade.CompanyId = 0;

            angular.forEach(companies, function(company){
                if(company.Name == trade.Company){
                    trade.CompanyId = company._id;
                    trade.StartStockPrice = company.CurrentStockPrice;
                }
            });
        }

        return {
            getTradesFromUser: getTradesFromUser,
            postTrade: postTrade,
            getCompanies: getCompanies
        };

    };

    angular.module("app").factory("tradeService", ["$http", tradeService]);
})();