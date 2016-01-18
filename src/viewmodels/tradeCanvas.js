var tradeCanvas = function(user) {
    if(document.getElementById("trades") !== null) {
        //declare basic vars;
        var objects = [];
        var companies = [];
        var profile = new Drawable();
        var trash = new Drawable();

        //create the profile
        profile.setImage(user.profilepicture, function() {
            canvas.draw();
        });
        profile.radius = 100;
        profile.color = "#ffffff";
        profile.borderColor = "#eeeeee";
        profile.borderScaling = false;
        profile.borderWidth = 2;
        profile.textSize = 12;
        profile.textColor = "#ffffff";
        profile.textFont = "SourceSansPro";
        profile.textAnchor = new Vector2D(0.5, 0.5);
        profile.textPos = new Vector2D(0, 0.5);
        profile.textPadding = new Vector2D(10, 10);
        profile.textReplace = 15;

        //define how the profile is drawn
        profile.draw = function(ctx, scale) {
            this.drawCircle(ctx);
            this.drawImageInCircle(ctx);
            this.drawBorderForCircle(ctx, scale);
            this.drawText(ctx, scale);
        };

        //create the trash icon
        trash.setImage("dist/images/misc/trash.svg", function() {
            canvas.draw();
        });
        trash.radius = 50;
        trash.color = "#eeeeee";
        trash.borderColor = "#eeeeee";
        trash.borderScaling = false;
        trash.borderWidth = 2;
        trash.pos = new Vector2D(window.innerWidth - 100, window.innerHeight - 150);

        //define how the interaction with the trash can is calculated
        trash.interaction = function(mousePos) {
            var mouseDifference = mousePos.subVector(canvas.margin).subVector(this.pos);
            var difference = this.radius * canvas.scale;
            return (mouseDifference.length() <= difference && this.show);
        };

        //define how the trash can is drawn
        trash.draw = function(ctx, scale) {
            var p = this.pos.subVector(canvas.offset).subVector(canvas.center).mul(1 / canvas.scale);
            ctx.save();
            ctx.translate(p.x, p.y);
            this.drawCircle(ctx);
            this.drawImageInCircle(ctx);
            this.drawBorderForCircle(ctx, scale);
            ctx.restore();
        };

        //load trades
        var diff = 0;
        for(var i = 0, l = user.trades.length; i < l; i++) {
            var t = user.trades[i];
            //if trade isn't closed yet
            if(t.StopStockPrice !== undefined || t.StopStockPrice < 0) {
                var c;
                var trader;
                //if trade is started by current user, trader is current user
                if (typeof t.parentTrade === 'undefined') {
                    trader = new Trader(user.firstname + " " + user.lastname, (t.AmountInvested / t.StartStockPrice), t.StartStockPrice, t.IsShort, t.Comment);
                    trader.drawable.setImage(user.profilepicture);
                } else {
                    console.log(t);
                }
                //if the company is already being drawn on screen, add the trader to the company
                var companyFound = false;
                for (var j = 0, m = companies.length; j < m; j++) {
                    c = companies[j];
                    if (c.id === t.Company._id) {
                        companyFound = true;
                        c.traders.push(trader);
                        break;
                    }
                }
                //if not, create a new company and add the trader to it
                if (!companyFound) {
                    c = {
                        "id": t.Company._id,
                        "stockPrice": t.Company.CurrentStockPrice,
                        "traders": [trader],
                        "image": t.Company.Image
                    };
                    companies.push(c);
                }
            }
        }

        //for every company, create a Trade object and add it to the canvas objects
        for(var k = 0, n = companies.length; k < n; k++) {
            var trade = new Trade(companies[k].id, companies[k].stockPrice, companies[k].traders, null);
            trade.drawable.setImage(companies[k].image);
            objects.push(trade);
        }

        //add the profile and the trashcan
        objects.push(profile);
        objects.push(trash);

        //if a user is currently making profit, color the text blue, if not, color it red
        if(diff >= 0) {
            profile.textBackground = "#36B5DB";
            profile.textReplaceColor = "#36B5DB";
        } else {
            profile.textBackground = "#E74C3C";
            profile.textReplaceColor = "#E74C3C";
        }
        profile.setText((Math.floor(diff * 100) / 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}));

        //create a canvas, set the objects and set a callback that happens whenever the canvas is redrawn
        //the canvas doesn't need to be drawn a first time, it will be drawn every time an image is set
        var canvas = new Canvas(0, 50, window.innerWidth, window.innerHeight - 50, "trades", objects);
        canvas.drawCallback = function() {
            //get the users loss/profit
            var diff = 0;
            for(var i = 0, l = canvas.objects.length; i < l; i++) {
                if(typeof canvas.objects[i].difference !== 'undefined') {
                    diff += canvas.objects[i].difference;
                }
            }
            //set the text
            if(diff >= 0) {
                profile.textBackground = "#36B5DB";
                profile.textReplaceColor = "#36B5DB";
            } else {
                profile.textBackground = "#E74C3C";
                profile.textReplaceColor = "#E74C3C";
            }
            profile.setText((Math.floor(diff * 100) / 100).toLocaleString('be-NL', {style: 'currency', currency: 'EUR'}));
        };

        //when a user starts interaction with the canvas
        document.body.addEventListener('touchstart', function(e) {
            e.preventDefault();
        });
        document.getElementById("trades").addEventListener("mousedown", function(e) {
            interactionStart(e);
        });
        document.getElementById("trades").addEventListener("touchstart", function(e) {
            var touch = e.touches[0];
            interactionStart(touch);
        });
        var interactionStart = function(e) {
            //tell the canvas the interaction has started
            //callback will return the object that is being interacted with and the mouse position
            canvas.interactionStart(e, function(object, mousePos) {
                var index;
                //if the object is a Trade, set it to be the top object
                if(object instanceof Trade) {
                    index = canvas.objects.indexOf(object);
                    canvas.objects.push(canvas.objects.splice(index, 1)[0]);
                }
                //if the object is a Trader, make sure it returns to its original position after interacting
                if(object instanceof Trader) {
                    object.drawable.returnPos = object.drawable.pos;
                }
                //if the object is the canvas itself, set the trash can to be the top object
                if(object === "self") {
                    index = canvas.objects.indexOf(trash);
                    canvas.objects.splice(index, 1);
                    canvas.objects.push(trash);
                    canvas.draw();
                }
                //keep track of what happened in preparation for further interactions
                canvas.selected = object;
                canvas.mousePos = mousePos;
            });
        };

        //when a user moves the selected object
        document.getElementById("trades").addEventListener("mousemove", function(e) {
            interactionMove(e);
        });
        document.getElementById("trades").addEventListener("touchmove", function(e) {
            var touch = e.touches[0];
            interactionMove(touch);
        });
        var interactionMove = function(e) {
            //tell the canvas the interaction is moving
            //canvas returns the object being interacted with, the current mouse position and the difference compared to the last mouse position
            canvas.interactionMove(e, function(object, mousePos, difference) {
                //if the object is a Trade, lower the opacity and make it follow the mouse
                if(object instanceof Trade) {
                    object.drawable.opacity = 0.5;
                    object.drawable.pos = mousePos;
                }
                //if the object is a Trader, lower the opacity and make it follow the mouse
                if(object instanceof Trader) {
                    object.drawable.opacity = 0.5;
                    object.drawable.pos = object.drawable.pos.addVector(difference.rotate(-object.drawable.rotation).mul(1 / canvas.scale));
                }
                //if the object is hovering over the trash can, color the can red
                if(trash.interaction(new Vector2D(e.pageX, e.pageY))) {
                    trash.color = "#E74C3C";
                } else {
                    trash.color = "#eeeeee";
                }
                //redraw the canvas
                canvas.draw();
            });
        };

        //when a user releases the selected object
        document.getElementById("trades").addEventListener("mouseup", function(e) {
            interactionStop(e);
        });
        document.getElementById("trades").addEventListener("touchend", function(e) {
            var touch = e.touches[0];
            interactionStop(touch);
        });
        var interactionStop = function(e) {
            //tell the canvas the user has released, the callback returns the object and if it was clicked or dragged
            canvas.interactionStop(function(click, object) {
                var i, l;
                //if the object was clicked
                if(click) {
                    //if the object was a Trade, set the opacity back to 1 and close all Trades on the canvas
                    if(object instanceof Trade) {
                        object.drawable.opacity = 1;
                        for (i = 0, l = canvas.objects.length; i < l; i++) {
                            if (canvas.objects[i].open && canvas.objects[i] !== object) {
                                canvas.objects[i].clicked();
                            }
                        }
                    }
                    //if the object was a Trader, set the opacity back to 1
                    if(object instanceof Trader) {
                        object.drawable.opacity = 1;
                    }
                    //if the object was the canvas, close all objects
                    if(object === "self") {
                        for (i = 0, l = canvas.objects.length; i < l; i++) {
                            if (canvas.objects[i].open) {
                                canvas.objects[i].clicked();
                            }
                        }
                    }
                    //if the objects has a clicked() function, execute it
                    if(typeof object.clicked === 'function') {
                        object.clicked();
                    }
                //if the object was dragged
                } else {
                    //if the object is a Trade, set its opacity back to 1
                    if(object instanceof Trade) {
                        object.drawable.opacity = 1;
                        //if the object was hovering over the trash can, remove it
                        if(trash.interaction(new Vector2D(e.pageX, e.pageY))) {
                            object.delete(canvas.objects);
                        }
                    }
                    //if the object is a Trader, set its opacity back to 1
                    if(object instanceof Trader) {
                        object.drawable.opacity = 1;
                        //if the Trader isn't in its original position, animate it back to that position
                        if(object.drawable.returnPos.length() !== object.drawable.pos.length() && object.drawable.returnPos.x !== object.drawable.pos.x) {
                            object.drawable.animateVector("pos", object.drawable.returnPos, 500, "easeInOut", null);
                        }
                        //if the Trader was hovering over the trash can, remove it
                        if(trash.interaction(new Vector2D(e.pageX, e.pageY))) {
                            object.delete(canvas.objects);
                        }
                    }
                }
                //reset the trash cans color back to gray, seeing as no object is selected anymore
                trash.color = "#eeeeee";
            });
            //redraw the canvas
            canvas.draw();
        };

        //when the user scrolls the mouse wheel somewhere on the canvas
        document.getElementById("trades").addEventListener("wheel", function(e) {
            scrollInteraction(e);
        });
        document.getElementById("trades").addEventListener("DOMMouseScroll", function(e) {
            scrollInteraction(e);
        });
        var scrollInteraction = function(e) {
            //don't scroll the page
            e.preventDefault();
            //crossbrowser calculation of the difference being scrolled
            var delta = 0;
            if(typeof e.wheelDelta !== 'undefined') {
                delta = e.wheelDelta / 300;
            } else {
                delta = -e.detail / 50;
            }
            //calculate the new scale and make sure it stays in between the limits
            var scale = canvas.scale + delta;
            if(scale > 1.8) {
                scale = 1.8;
            }
            if(scale < 0.4) {
                scale = 0.4;
            }
            scale = Math.floor(scale * 100) / 100;
            //set the new scale, don't scale the trash can, apply the scale to the slider and redraw the canvas
            canvas.scale = scale;
            trash.radius = 50 / canvas.scale;
            document.getElementById("scaleCanvas").value = canvas.scale;
            canvas.draw();
        };

        //when a user uses the slider, scale the canvas
        document.getElementById("scaleCanvas").addEventListener("mousemove", function() {
            canvas.scale = parseFloat(this.value);
            trash.radius = 50 / canvas.scale;
            canvas.draw();
        });

        //when a user clicks the center button, tell the canvas to center itself
        document.getElementById("resetOffset").addEventListener("click", function() {
            canvas.moveToCenter();
        });

        //when a user resizes the page, resize the canvas and reposition the trash can
        window.addEventListener("resize", function() {
            canvas.setSize(window.innerWidth, window.innerHeight - 50);
            trash.pos = new Vector2D(window.innerWidth - 100, window.innerHeight - 150);
        });
    }

};