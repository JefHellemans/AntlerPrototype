(function(){

    "use strict";


    var userService = function() {


        var getAll = function(){

        };

        var getById = function(id){

            // API call via $http.get(localhost://8000/api/users/id)

            return {
                firstName: "Anna",
                lastName: "Abdce",
                password: 123456
            }
        };

        return{
            getAll: getAll,
            getById: getById
        };
    };

    angular.module("app").factory("userService", [userService]);

})();