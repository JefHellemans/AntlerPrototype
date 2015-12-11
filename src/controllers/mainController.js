(function (){
    "use strict";

    var mainController = function($scope){

        console.log("dit is de main controller");
        //new code goes here

    };

    angular.module("app").controller("mainController", [ "$scope", mainController]);
})();