(function (){
    "use strict";

    var mainController = function($scope){
        //new code goes here
        $scope.user = {};
        $scope.user.userId = "1";
        $scope.user.firstName = "Marijn";
        $scope.user.lastName = "Hosten";
        $scope.user.currentAmount = 2000;

        var Anna = {id: 9, firstName: "Anna", lastName: "Abcd", followers: 27};
        var Bob = {id: 2, firstName: "Bob", lastName: "Abcd", followers: 28};
        var Christine = {id: 3, firstName: "Christine", lastName: "Abcd", followers: 105};
        var Dave = {id: 4, firstName: "Dave", lastName: "Abcd", followers: 30};
        var Eric = {id : 5, firstName: "Eric", lastName: "Abcd", followers: 2};
        var Francis = {id: 6,firstName: "Francis", lastName: "Abcd", followers: 0};
        var Gaben = {id: 7,firstName: "Gaben", lastName: "Abcd", followers: 299};
        var Harold = {id: 8,firstName: "Harold", lastName: "Abcd", followers: 4};

        $scope.traders = [Anna, Bob, Christine, Dave, Eric, Francis, Gaben, Harold];
    };

    angular.module("app").controller("mainController", [ "$scope", mainController]);
})();