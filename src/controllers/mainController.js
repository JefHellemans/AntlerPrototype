(function (){
    "use strict";

    var mainController = function($scope, userService, tradeService){

        $scope.isNewTrade = false;
        $scope.trade = {
            "Company": "",
            "AmountInvested": 0,
            "stock": 0,
            "PercentageInvested": 0,
            "longShort": "",
            "Comment": ""
        };

        $scope.sortTypeNew = 'name';
        $scope.sortReverseNew = true;

        var gotFollowing = false;
        var gotAuthenticated = false;
        var canvas;
        var makeNewTradeOnCanvas = false;
        var newTrade;

        var makeCanvas = function() {
            if(gotFollowing && gotAuthenticated) {
                canvas = new tradeCanvas($scope.user, $scope.traders);
            }
        };

        var authenticate = function(config){
            userService.authenticate(config).then(onAuthenticated, onAuthError);
        };

        var onAuthenticated = function(response){
            $scope.token = response.token;
            getFollowing();
            getCompanies();
            getNewTraders();
            doSockets();
            gotAuthenticated = true;
            makeCanvas();
        };

        var onAuthError = function(err){
            console.log(err);
        };

        var getFollowing = function(){
            userService.getAllFollowing($scope.token).then(onUsersLoaded, onUsersError);
        };

        var onUsersLoaded = function(response){
            console.log(response);
            $scope.traders = response;
            gotFollowing = true;
            makeCanvas();
        };

        var onUsersError = function(err){
            console.log(err);
        };

        var getLoggedInUser = function(){
            userService.getLoggedInUser().then(onLoggedIn, onLoggedError);
        };

        var onLoggedIn = function(response){
            $scope.user = response;
            //console.log("Trades:", response.trades.length, response.trades);
            $scope.user.currentAmount = response.balance;
            $scope.user.profilepicture = response.imageUrl;

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
            var newTraders = [];


            angular.forEach(users, function(user){
                var index = users.indexOf(user);
                if(user._id === $scope.user._id){
                    users.splice(index, 1);
                }
            });



            angular.forEach(users, function(user){
                if(user.followers.length > 0){

                    var found = false;

                    angular.forEach(user.followers, function(follower){
                        if(follower == $scope.user._id){
                            found = true;

                        }
                    });

                    if(!found){
                        newTraders.push(user);
                    }
                }else {
                    newTraders.push(user);
                }

            });
            $scope.newTraders = newTraders;

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
            //console.log(response);
            doTradeSocket(response.data._id);
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

        var getUserAgain = function() {
            userService.getById($scope.user._id, $scope.token).then(onReUser, onReUserError);
        };

        var onReUser = function(response) {
            addTradeToCanvas(response);
        };

        var onReUserError = function(err) {
            console.log(err);
        };

        var socket;
        var doSockets =  function(){
            if(!gotAuthenticated) {
                var hostname = window.location.protocol + "//" + window.location.host;
                socket = io.connect(hostname);


                socket.on("socketID", function (object) {
                    console.log(object.id);
                    socket.emit("attachAntlerId", {antlerid: $scope.user._id});
                });

                socket.on("newTradeFromFollowing", function (object) {
                    newTrade = object;
                    makeNewTradeOnCanvas = true;

                    var traderList = document.getElementsByClassName("ng-binding")[0];
                    var textNode = document.createTextNode("You have a new trade!");
                    var p = document.createElement("p");
                    p.appendChild(textNode);
                    traderList.appendChild(p);
                    if (canvas !== undefined) {
                        //getUserAgain();
                    }
                });

                socket.on("priceUpdate", function (companiesarray) {
                    if (canvas !== undefined) {
                        canvas.updatePrices(companiesarray);
                    }
                });
            }
        };

        var addTradeToCanvas = function(response) {
            if(makeNewTradeOnCanvas && newTrade !== undefined) {
                var trade;
                var trader;
                console.log(response.trades);
                console.log(newTrade.tradeid);
                for(var j = 0, m = response.trades.length; j < m; j++) {
                    if(response.trades[j].ParentTrade === newTrade.tradeid) {
                        console.log("match found");
                        trade = response.trades[j];
                        break;
                    }
                }
                for(var i = 0, l = $scope.traders.length; i < l; i++) {
                    if($scope.traders[i]._id === newTrade.traderid) {
                        trader = $scope.traders[i];
                        break;
                    }
                }
                canvas.addTrade(trade, trader);
            }
            makeNewTradeOnCanvas = false;
            newTrade = undefined;
        };

        function doTradeSocket(id){
            socket.emit("newTrade", {traderid: $scope.user._id, tradeid: id});
        }

        $scope.filterQuery = "";
        $scope.filterTraders = function(trader){
            if($scope.filterQuery === ""){
                return true;
            }
            if(trader.firstname.toLowerCase().indexOf($scope.filterQuery.toLowerCase()) >= 0 ||
                trader.lastname.toLowerCase().indexOf($scope.filterQuery.toLowerCase()) >= 0){
                return true;
            }
            return false;
        };

        getLoggedInUser();

    };

    angular.module("app").controller("mainController", [ "$scope", "userService", "tradeService", mainController]);
})();