function HallwayTransforms (prefix) {
    this.prefix = prefix;
    
    this.directions = ["front", "left", "right", "bottom", "behind", "top"];
    
    this.__directionsToMoveGroups = {
        behind: {
            shortcut: "b", 
            moves: [{type: "move", value: 1}]},
        bottom: {
            shortcut: "c", 
            moves: [{type: "move", value: 0.5}]},
        front:  {
            shortcut: "f", 
            moves: []},
        top:  {moves: []},
        left:   {
            shortcut: "l", 
            moves: [
                {type: "move", value: 0.5},
                {type: "turn", value: "left"},
                {type: "move", value: 0.5}
                   ]
        },
        right:   {
            shortcut: "r", 
            moves: [
                {type: "move", value: 0.5},
                {type: "turn", value: "right"},
                {type: "move", value: 0.5}
                   ]
        }
    }

    this.__getMovesForElements = function(elements) {
        
        var moves = []
        //var parents = target.parents("ul" + this.hallwayClass + ", ul" + this.hallwayClass + " > li");
        var lis = elements;
        for (var i = 0; i < lis.length; i++) {
            var li_span = lis[i];
            var direction = this._getDirectionFromElement(li_span);
            if (li_span.nodeName === "LI") { //or has row class?
                var li = li_span;
                var liNextSiblingCount = 0
                while (li.previousElementSibling) {
                    li = li.previousElementSibling;
                    liNextSiblingCount++;
                    if (li.classList.contains("separator")) {
                        moves.push({shortcut: "f", moves: [{type: "move", value: 0.5}]});    
                    } else {
                        moves.push({shortcut: "f", moves: [{type: "move", value: 1}]});    
                    }
                };
            } else if (direction !== "ERROR") { //or has direction class?
                var span = li_span;
                moves.push(this.__directionToMoveGroup(direction));
            }
            //console.log(li_span.nodeName);
        }
        moves.reverse();
        return moves;
    }
    
    this._getDirectionFromElement = function(element) {
        if (element.getAttribute("data-direction")) {
            return element.getAttribute("data-direction");
        }
        return this._getDirectionFromClass(element.className);
    }
  
    this._getDirectionFromClass = function (className) {
        for (var i = 0; i < this.directions.length; i++) {
            var direction = this.directions[i];
            if (className.indexOf(this.prefix + direction) !== -1) {
                return direction;
            }
        }
        return "ERROR";
    }

    this.__directionToMoveGroup = function (direction) {
        if (!this.__directionsToMoveGroups[direction]) {
            throw "Direction not found: " + direction;
        }
        return this.__directionsToMoveGroups[direction];
    }
    
    this.lastRoration;
    
    this.getTransform = function (moves, orientation) {
        var translate = "";
        var orientations = ["SOUTH", "WEST", "NORTH", "EAST"];
        var o = orientation;
        for (var i = 0; i < moves.length; i++) {
            var moveGroup = moves[i];
            var moveGroupTransformResult = this.getTransformByMoveGroup(moveGroup, o);
            o = moveGroupTransformResult.orientation;
            if (moveGroupTransformResult.lastRotation) {
                this.lastRotation = moveGroupTransformResult.lastRotation;
            }
            translate += moveGroupTransformResult.translate;
        }
        return {translate: translate, rotate: this.getRotateFromOrientation(o), orientation: o, orientationStr: orientations[o], lastRotation: this.lastRotation};
    }
    
    this.getTransformByMoveGroup = function(moveGroup, orientation) {
        var o = orientation;
        var translate = "";
        //var rotate = "";
        for (var j = 0; j < moveGroup.moves.length; j++) {
            var move = moveGroup.moves[j];
            var transformResult = this.getTrasformByMove(move, o);
            o = transformResult.orientation;
            translate += transformResult.translate;
        }
        return {orientation: o, translate: translate};
    }
    
    this.getTrasformByMove = function(move, orientation) {
        var o = orientation;
        var translate = "";
        //var rotate = "";
        if (move.type === "turn" && move.value === "left") {
            //rotate += this.getRotate(move, o);
            o = ((o - 1) + 4) % 4;
            this.lastRotation = move.value;
        } else if (move.type === "turn" && move.value === "right") {
            //rotate += this.getRotate(move, o);
            o = (o + 1) % 4;
            this.lastRotation = move.value;
        } else if (move.type === "move") {
            translate += this.getTranslate(move, o);
        }
        return {orientation: o, translate: translate};
    }
    
    this.getRotateFromOrientation = function (orientation) {
        if (orientation === 0) {
            return " none ";
        } else if (orientation === 1) {
            return " rotateY(90deg) ";
        } else if (orientation === 2) {
            if (this.lastRotation == "left") {
                return " rotateY(-180deg) ";
            } else {
                return " rotateY(180deg) ";
            }
        } else if (orientation === 3) {
            return " rotateY(-90deg) ";
        } else {
            throw "Invalid orientation: " + orientation;
        }
    }
    
    this.getRotate = function (move, orientation) {
        if (move.value === "left") {
            return " rotateY(-90deg) ";
        } else if (move.value === "right") {
            return " rotateY(90deg) ";
        }
    }
    
    this.getTranslate = function (move, orientation) {
        if (orientation === 0) {
            return " translateZ(" + (move.value * 100) + "vw) ";
        } else if (orientation === 1) {
            return " translateX(" + (move.value * -100) + "vw) ";
        } else if (orientation === 2) {
            return " translateZ(" + (move.value * -100) + "vw) ";
        } else if (orientation === 3) {
            return " translateX(" + (move.value * 100) + "vw) ";
        } else {
            throw "Invalid orientation: " + orientation;
        }
    }
}