function HallwayMovement(wrap, prefix) {
    "use strict";

    this.wrap = wrap;
    this.prefix = prefix;
    this.history = [];
    this.cameras = {
        translate: $(".camera-translate", this.wrap)[0],
        rotate: $(".camera-rotate", this.wrap)[0]
    }
    this.hallwayClass = "." + this.prefix + "hallway";
    this.rootHallway = $(this.hallwayClass, this.wrap)[0];
    this.rootRow = $("> li:first-child", this.rootHallway)[0];
    this.currentRow = this.rootRow;
    this.setRow = function(row) {
        if (this.currentRow) {
            this.currentRow.classList.remove(this.prefix + "selected");
        }
        this.currentRow = row;
        this.currentRow.classList.add(this.prefix + "selected");
    }
    this.setRow(this.rootRow);
    this.currentHallway = this.rootHallway;
    this.transforms = new HallwayTransforms(this.prefix);
    this.wrap.setAttribute("data-direction", "front");
    this.wrap.setAttribute("data-orientation", 0);
    this.movementMap = {
        front: {
            left:
            {
                direction: "left",
                directionChangeRow: "front"
            },
            right:
            {
                direction: "right",
                directionChangeRow: "front"
            },
            front:
            {
                direction: "bottom"
            }
        },
        behind: {
            left:
            {
                direction: "left",
                directionChangeRow: "front"
            },
            right:
            {
                direction: "right",
                directionChangeRow: "front"
            },
            front:
            {
                directionChangeRow: "bottom"
            }
        },
        bottom: {
            left:
            {
                direction: "left",
                directionChangeRow: "front"
            },
            right:
            {
                direction: "right",
                directionChangeRow: "front"
            },
            front:
            {
                directionChangeRow: "front",
                direction: "behind"
            }
        },
        left: {
            left:
            {
                directionChangeRow: "left"
            },
            right:
            {
                direction: "front"
            },
            front:
            {
                direction: "front",
                directionChangeRow: "front"
            }
        },
        right: {
            left:
            {
                direction: "front"
            },
            right:
            {
                directionChangeRow: "right"
            },
            front:
            {
                direction: "front",
                directionChangeRow: "front"
            }
        }
    }
    

    
    this.resetCamera = function () {
        $("*[data-position]." + this.prefix + "selected", this.wrap).removeClass(this.prefix + "selected");
        this.wrap.setAttribute("data-orientation", 0);
        this.wrap.setAttribute("data-direction", "front");
        this.cameras.translate.style.transform = "";
        this.cameras.rotate.style.transform = ""; 
        this.currentHallway = this.rootHallway;
        this.setRow(this.rootRow);
    }
    
    this.popHistory = function () {
        if (this.history.length > 0) {
            this.history.pop();
        }
        if (this.history.length === 0) {
            this.resetCamera();
            return;
        }
        var lastElement = this.history[this.history.length - 1];
        this.moveWithinRow(lastElement.row, lastElement.direction, true);
    }

    this.pushHistory = function(element) {
        var lastElement = this.history[this.history.length - 1];
        if (lastElement && lastElement.row === element.row && lastElement.direction === element.direction) {
            return;
        }
        this.history.push(element);
    }
    
    this.transform = function (trans) {
        this.cameras.translate.style.transform = trans.translate;
        this.cameras.rotate.style.transform = trans.rotate; 
    }
    
    this.moveForward = function () {
        this.move("front");
    }
    
    this.moveLeft = function () {
        this.move("left");
    }
    
    this.moveRight = function () {
        this.move("right");
    }
    
    this.move = function(cmdDirection) {        
        console.log("CMD: " + cmdDirection);
        var currentDirection = wrap.getAttribute("data-direction");
        console.log("current: " + currentDirection);
        var movementMapItem = this.movementMap[currentDirection][cmdDirection];
        var row = this.currentRow;
        var direction = movementMapItem.direction;
        if (movementMapItem.directionChangeRow) {
            var childRow = this.getRowInDirection(cmdDirection);
            if (childRow) {
                row = childRow;
                direction = movementMapItem.directionChangeRow;
            } else if (!movementMapItem.direction) {
                console.log("no place to go")
                return;
            }
        }        
        this.moveWithinRow(row, direction);
    }
    
    this.getRowInDirection = function(direction) {
        if (direction === "left" || direction === "right") {
            return $("> ." + this.prefix + direction + " > " + this.hallwayClass + " > li:first-child", this.currentRow)[0];
        } else if (direction === "front") {
            //return this.currentRow.previousElementSibling;
            return this.currentRow.nextElementSibling;
        }
        throw "Unknown direction for getting row: " + direction;
    }

    this.moveWithinRowByEvent = function(event) {
        var element = event.currentTarget;
        var row = this._getParentRow(element);
        var direction = this.transforms._getDirectionFromElement(element);
        this.moveWithinRow(row, direction);
        event.stopPropagation();
    }
    
    this._getParentRow = function (element) {
        return $(element).parents("ul" + this.hallwayClass + " > li", this.wrap)[0];
    }

    this.moveWithinRow = function(row, direction, noHistory) {
        this.__moveToRow(row);
        var moveGroup = this.transforms.__directionToMoveGroup(direction);
        var trans = this.transforms.getTransform([moveGroup], parseInt(row.getAttribute("data-orientation")), row.getAttribute("data-last-rotation"));
        this.cameras.translate.style.transform += trans.translate;
        this.cameras.rotate.style.transform = trans.rotate;
        this.wrap.setAttribute("data-orientation", trans.orientation);
        this.wrap.setAttribute("data-orientation-str", trans.orientationStr);
        this.wrap.setAttribute("data-direction", direction);
        if (!noHistory) {
            this.pushHistory({row: row, direction: direction});
        }
    }

        
    this.__moveToRow = function (liRow) {
        this.setRow(liRow);
        if (liRow.getAttribute("data-rotate") && liRow.getAttribute("data-translate")) {
        } else {
            this.__setRowAttributes(liRow);
        }
        var rotate = liRow.getAttribute("data-rotate");
        var translate = liRow.getAttribute("data-translate");
        this.cameras.translate.style.transform = translate;
        this.cameras.rotate.style.transform = rotate; 
        this.wrap.setAttribute("data-orientation", liRow.getAttribute("data-orientation"));
        this.wrap.setAttribute("data-orientation-str", liRow.getAttribute("data-orientation-str"));
        this.wrap.setAttribute("data-direction", "front");
    }
    
    this.__setRowAttributes = function(liRow) {
        var moves = this.getRowMoves(liRow);
        var trans = this.transforms.getTransform(moves, 0);
        liRow.setAttribute("data-rotate", trans.rotate);
        liRow.setAttribute("data-translate", trans.translate);
        liRow.setAttribute("data-orientation", trans.orientation);
        liRow.setAttribute("data-orientation-str", trans.orientationStr);
        liRow.setAttribute("data-last-rotation", trans.lastRotation);
    }
    
    this.getRowMoves = function (liRow) {
        var lis = $(liRow).parents("ul" + this.hallwayClass + " > li, ul" + this.hallwayClass + " > li > *", this.wrap);
        var elements = [];
        elements.push(liRow);
        //unshift = push front
        for (var i = 0; i < lis.length; i++) {
            var li_span = lis[i];
            elements.push(li_span);
        }
        var moves = this.transforms.__getMovesForElements(elements);
        var id = ""
        for (var i = 0; i < moves.length; i++) {
            id += moves[i].shortcut;
        }
        liRow.id = id;
        return moves;
    }
}