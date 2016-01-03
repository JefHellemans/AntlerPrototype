
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

            // API call via $http.get(localhost://8000/api/users/+id)

            return {
                firstName: "Anna",
                lastName: "Abdce",
                password: 123456
            }
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