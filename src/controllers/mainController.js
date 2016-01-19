(function (){
    "use strict";

    var mainController = function($scope, userService, tradeService){

        $scope.isNewTrade = false;
        $scope.homepage = true;
        $scope.trade = {
            "Company": "",
            "AmountInvested": 0,
            "stock": 0,
            "PercentageInvested": 0,
            "longShort": "",
            "Comment": ""
        };

        var authenticate = function(config){
            userService.authenticate(config).then(onAuthenticated, onAuthError);
        };

        var onAuthenticated = function(response){
            $scope.token = response.token;
            getFollowing();
            getCompanies();
            getNewTraders();
            tradeCanvas($scope.user);
            connectSockets();
        };

        var onAuthError = function(err){
            console.log(err);
        };

        var getFollowing = function(){
            userService.getAllFollowing($scope.token).then(onUsersLoaded, onUsersError);
        };

        var onUsersLoaded = function(response){
            $scope.traders = response;
        };

        var onUsersError = function(err){
            console.log(err);
        };

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            $scope.user.currentAmount = response.balance;
            $scope.user.profilepicture = "../dist/images/profiles/profile.jpg";

            var config = {email: response.email, password: response.password};
            authenticate(config);


        };

        var onLoggedError = function(err){
            console.log(err);
        };

        var getNewTraders = function(){
            userService.getAll($scope.token).then(onNewTraders, onNewTradersError);
        };

        var onNewTraders = function(response){

            var users = response;

            angular.forEach(users, function(user){
                var index = users.indexOf(user);
                if(user._id === $scope.user._id){
                    users.splice(index, 1);
                }
            });

            $scope.newTraders = users;

        };

        var onNewTradersError = function(err){
            console.log(err);
        };

        $scope.newTrade = function(){
            return $scope.isNewTrade = !$scope.isNewTrade;
        };

        $scope.isNewTradeOpen = function() {
            if($scope.isNewTrade) {
                return "open";
            } else {
                return "";
            }
        };

        $scope.changeNewTradeField = function(what) {
            var companyName = $scope.trade.Company;
            var stockPrice;
            var stock;
            for(var i = 0, l = $scope.companies.length; i < l; i++) {
                if(companyName === $scope.companies[i].Name) {
                    stockPrice = $scope.companies[i].CurrentStockPrice;
                    break;
                }
            }
            if(stockPrice !== undefined) {
                if (what === "AmountInvested") {
                    if($scope.trade.AmountInvested < 0) {
                        $scope.trade.AmountInvested = 0;
                    }
                    stock = Math.floor($scope.trade.AmountInvested / stockPrice);
                    if(stock !== $scope.trade.stock) {
                        setStockAmount(stock, stockPrice);
                    }
                } else if(what === "stock") {
                    if($scope.trade.stock < 0) {
                        $scope.trade.stock = 0;
                    }
                    setStockAmount($scope.trade.stock, stockPrice);
                } else if(what === "PercentageInvested") {
                    if($scope.trade.PercentageInvested < 0) {
                        $scope.trade.PercentageInvested = 0;
                    }
                    var amount = Math.floor(($scope.trade.PercentageInvested / 100) * $scope.user.balance);
                    stock = Math.floor(amount / stockPrice);
                    if(stock !== $scope.trade.stock) {
                        setStockAmount(stock, stockPrice);
                    }
                }
            }
        };

        $scope.changeCompanyField = function() {
            var companyName = $scope.trade.Company;
            var stockPrice;
            for(var i = 0, l = $scope.companies.length; i < l; i++) {
                if(companyName === $scope.companies[i].Name) {
                    stockPrice = $scope.companies[i].CurrentStockPrice;
                    break;
                }
            }
            document.getElementById('amount').step = stockPrice;
            document.getElementById('investedPercentage').step = Math.ceil((stockPrice / $scope.user.balance) * 10000) / 100
        };

        var setStockAmount = function(stock, price) {
            var amount = stock * price;
            var percentage = Math.floor((amount / $scope.user.balance) * 10000) / 100;
            $scope.trade.stock = stock;
            $scope.trade.AmountInvested = amount;
            $scope.trade.PercentageInvested = percentage;
        };

        $scope.isAmountFieldEnabled = function(trade) {
            if(trade !== undefined) {
                if(trade.Company !== undefined && trade.Company !== "") {
                    return false;
                }
            }
            return true;
        };

        $scope.confirmTrade = function (trade) {
            if($scope.user.balance >= trade.AmountInvested){
                trade.Comment = trade.Comment.replace(new RegExp('\n', 'g'), '\\n');
                $scope.isNewTrade = false;
                tradeService.postTrade(trade, $scope.companies, $scope.token).then(onTradePosted, onTradeError);
            }

        };

        $scope.isNewTradeEnabled = function(trade) {
            if(trade !== undefined) {
                if(trade.Company !== undefined && trade.Company !== "" &&
                    ((trade.AmountInvested !== undefined && trade.AmountInvested !== "" && trade.AmountInvested > 0) ||
                    (trade.PercentageInvested !== undefined && trade.PercentageInvested !== "" && trade.PercentageInvested > 0)) &&
                    trade.stock !== undefined && trade.stock !== "" && trade.stock > 0 &&
                    trade.longShort !== undefined && trade.longShort !== "" &&
                    trade.Comment !== undefined && trade.Comment !== "") {
                    return false;
                }
            }
            return true;
        };

        var onTradePosted = function(response){
            doTradeSocket();
            $scope.trade = {
                "Company": "",
                "AmountInvested": 0,
                "stock": 0,
                "PercentageInvested": 0,
                "longShort": "",
                "Comment": ""
            };
        };
        var onTradeError = function(err){
            console.log(err);
        };

        var getCompanies = function(){
            tradeService.getCompanies($scope.token).then(onCompanies, onCompaniesError);
        };

        var onCompanies = function(response){
            $scope.companies = response;
        };
        var onCompaniesError = function(err){
            console.log(err);
        };
        var hostname = window.location.protocol + "//"+ window.location.host ;
        var socket = io.connect(hostname);

        var connectSockets = function(){

            socket.on("socketID", function(object){
                //console.log(object.id);
                socket.emit("attachAntlerID", {antlerid: $scope.user._id});
            });

        };
        socket.on("newTradeFromFollowing", function(trade){
            console.log("SOCKETS: " + trade);
        });
        var doTradeSocket = function(){
            socket.emit("newTrade", {traderid: $scope.user._id, trade: $scope.trade});
        };

        getLoggedInUser();
    };

    angular.module("app").controller("mainController", [ "$scope", "userService", "tradeService", mainController]);
})();