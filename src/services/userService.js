
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
                return response.data[0];
            });
        };

        return{
            getAll: getAll,
            getById: getById,
            getLoggedInUser: getLoggedInUser
        };
    };

    angular.module("app").factory("userService", ["$http", userService]);

})();