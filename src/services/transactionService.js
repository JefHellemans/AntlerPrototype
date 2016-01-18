(function(){

    "use strict";

    var url = "http://localhost:3000/api";

    var transactionService = function($http) {

        var postTransaction = function(amount, token){
            var a = {amountchange: amount};
            return $http.post(url + "/transactions", a, {
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data;
            });
        };

        return{
            postTransaction: postTransaction
        };
    };

    angular.module("app").factory("transactionService", ["$http", transactionService]);

})();