
(function(){

    "use strict";

    var url = "http://localhost:3000/api";

    var userService = function($http) {

        var getAll = function(){

            return $http.get(url + "/users").then(function(response){
                return response.data;
            });
        };

        var getById = function(id){
            return $http.get(url + "/users/" + id).then(function(response){
                return response.data[0];
            });
        };

        var getLoggedInUser = function() {
            return $http.get(url + "/loggedInUser").then(function(response){
                return response.data;
            });
        };

        var followTrader = function(trader) {
            return $http.post(url + "/following", trader).then(function(response){
                return response.data;
            });
        };

        var getAllFollowing = function(){
            return $http.get(url + "/following").then(function(response){
                return response.data;
            });
        };


        return{
            getAll: getAll,
            getById: getById,
            getLoggedInUser: getLoggedInUser,
            followTrader: followTrader,
            getAllFollowing: getAllFollowing,
        };
    };

    angular.module("app").factory("userService", ["$http", userService]);

})();