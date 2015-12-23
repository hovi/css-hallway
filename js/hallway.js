function Hallway(wrap, prefix) {
    "use strict";

    this.wrap = wrap;
    this.prefix = prefix;
    this.win = $(window);
    this.body = $(document.body);
    this.movement = new HallwayMovement(wrap, prefix);
    this.wheel = {deltaX: 0, deltaY: 0};
    document.body.scrollLeft = 1;

    this._getScrollPercent = function () {
        return 100 * this.win.scrollTop() / (this.body.height() - this.win.height());
    }.bind(this);

    this._onScroll = function () {
        var scrollPercentage = 100 - this._getScrollPercent();
        //size by current hallway
        
    }.bind(this);
    
    document.body.onscroll = this._onScroll;
    
    //$("*[data-position]", this.wrap).on("click", this.movement.move.bind(this.movement));

    $(document).keyup(function (e) {
        if (e.keyCode === 27) {
            this.movement.resetCamera();
        }
        if (e.keyCode === 65) {
            this.movement.popHistory();
        }
    }.bind(this));
    
    $(this.wrap).on("wheel", function(event) {
        //console.log(event.originalEvent.deltaX);
        //console.log(event.originalEvent.deltaY);
        this.wheel.deltaX += event.originalEvent.deltaX;
        this.wheel.deltaY += event.originalEvent.deltaY;
        var limit = 0;
        if (event.originalEvent.deltaY == 0 && event.originalEvent.deltaX == 0) {
            if (this.wheel.deltaX == 0 || this.wheel.deltaY == 0) {
                this.wheel = {deltaX: 0, deltaY: 0};
                return;
            }
            //console.log(this.wheel);
            if (Math.abs(this.wheel.deltaY) > Math.abs(this.wheel.deltaX)) {
                if (this.wheel.deltaY < - limit) {
                    this.movement.moveForward();
                    //console.log("F");
                } else if (this.wheel.deltaY > limit) {
                    this.movement.popHistory();
                    //console.log("B")
                }
            } else {
                if (this.wheel.deltaX < - limit) {
                    this.movement.moveLeft();
                    //console.log("L");
                } else if (this.wheel.deltaX > limit) {
                    this.movement.moveRight();
                    //console.log("R");
                }
            }
            this.wheel = {deltaX: 0, deltaY: 0};
        }
        document.body.scrollLeft = 1;
        return;
        event.stopPropagation();
        return;
        if (event.originalEvent.deltaX < - limit) {
            this.movement.moveLeft();
        } else if (event.originalEvent.deltaX > limit) {
            this.movement.moveRight();
        }
        //event.preventDefault();
        //this.movement.wheel(originalEvent);
    }.bind(this));

    //$("li", this.wrap).click(this.movement.moveToRowByEvent.bind(this.movement));
    
    $(".behind, .front, .bottom, .left, .right, .top, *[data-direction]", this.wrap).click(this.movement.moveWithinRowByEvent.bind(this.movement));
    
    $("." + this.prefix + "back").click(this.movement.popHistory.bind(this.movement));
    $("." + this.prefix + "home").click(this.movement.resetCamera.bind(this.movement));
    $("." + this.prefix + "move-forward").click(this.movement.moveForward.bind(this.movement));
    $("." + this.prefix + "move-left").click(this.movement.moveLeft.bind(this.movement));
    $("." + this.prefix + "move-right").click(this.movement.moveRight.bind(this.movement));

}
