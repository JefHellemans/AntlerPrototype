
(function(){

    "use strict";

    var url = "http://localhost:3000/api";

    var userService = function($http) {

        var getAll = function(token){

            return $http.get(url + "/users", {
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data;
            });
        };

        var getById = function(id, token){

            return $http.get(url + "/users/" + id, {
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data[0];
            });
        };

        var getLoggedInUser = function() {

            return $http.get(url + "/loggedInUser").then(function(response){
                return response.data;
            });
        };

        var followTrader = function(trader, token) {
            return $http.post(url + "/following", trader, {
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data;
            });
        };

        var getAllFollowing = function(token){


            return $http.get(url + "/following", {
                headers: {'x-access-token': token}
            }).then(function(response){
                return response.data;
            });

        };

        var authenticate = function(config){
            return $http.post(url + "/authenticate", config).then(function(response){
                return response.data;
            })
        };

        return{
            getAll: getAll,
            getById: getById,
            getLoggedInUser: getLoggedInUser,
            followTrader: followTrader,
            getAllFollowing: getAllFollowing,
            authenticate: authenticate
        };
    };

    angular.module("app").factory("userService", ["$http", userService]);

})();