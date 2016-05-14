var Movement = function(unit, targets){
  this.move = null;

  var strategies = {
    closest: function(unit, candidates){
      var closest = {x: 0, y:0, dist: -1};
      for (var j in candidates){
        var p1 = unit;
        var p2 = candidates[j];
        if (!p2.life)//si l'element est en cours de destruction, on ne le selectionne pas
          continue;
        var d = Math.sqrt(Math.pow(p2.getX() - p1.getX(), 2) + Math.pow(p2.getY() - p1.getY(), 2));
        if (closest.dist == -1 || d < closest.dist){
          closest = {x: p2.getX(), y: p2.getY(), dist: d, unit: unit, target: candidates[j]};
        }
      }

      if(closest.dist == -1){
        throw "No target found"
      }
      return closest;
    },
    interest: function(unit, candidates){

    }
  }

  var findBestTarget = function(unit, candidates){
    var stategy = strategies[unit.getStrategy()];
    if(stategy){
      return stategy(unit, candidates);
    }
    else{
      return strategies["closest"](unit, candidates);
    }
  }

  var findClosestWalkableTile = function(closest){
    var x = closest.x;
    var y = closest.y;
    var tiles = [
      {x: x - 1, y: y - 1},
      {x: x - 1,y: y},
      {x: x - 1,y: y + 1},
      {x: x, y: y + 1},
      {x: x + 1,y: y + 1},
      {x: x + 1,y: y},
      {x: x + 1,y: y - 1},
      {x: x ,y: y - 1}
    ];
    var p1 = closest.unit;
    var ret = [];
    for (var i = 0; i <  tiles.length; i++){
      var p2 = tiles[i];
      var wallables = p1.getWalkableTiles().concat(p1.getTargets());//on prend d'abord toute les cases pouvant être parcourue avant trouver une éventuelle target sur le chemin => chemin le plus direct au coeur du chateau
      if (p1 && wallables.indexOf(window.map[p2.y][p2.x].getType()) > -1){
        var d = Math.sqrt(Math.pow(p2.x - p1.getX(), 2) + Math.pow(p2.y - p1.getY(), 2));
        p2.dist = d;
        p2.target = closest.target;
        p2.unit = closest.unit;
        ret.push(p2);
      }
    }
    if (!ret.length)
      return null;
    return ret.sort(function(a, b){
      return a.dist - b.dist;
    })[0]
  }

  this.findTarget = function(){
    var targets = targets || unit.getTargets();
    var closest = null;
    var candidates = {};
    for (var i = 0; i < targets.length; i++){
      candidates = angular.extend(candidates, mapManager._tiles[targets[i]]);
    }
    //try{
      bestTarget = findBestTarget(unit, candidates);
      var closestTile = findClosestWalkableTile(bestTarget);//TODO handle unit range
      if(closestTile){
        this.move = new Move(unit, closestTile.target, closestTile.x, closestTile.y);
        return closestTile;
      }else{
        //TODO handle recursion on candidates
        throw "No walkable tile found";
      }
      if(!target)
        throw "No target found";
  //  }
    //catch(e){
      //console.error(e);
      //return null;
    //}


  }
  this._moveToTarget = function(){
    //console.log(unit.id + " will attack" + closest.target.id);

    var defer = $q.defer();

    if(this.move){
      var to = this.move.getTarget();
      var idBlock = null;
      var idDestroy = null;
      var idDestroy2 = null;
      //var idAttack = null;
      var onEvent = function(isInterupted){
        to.off("destroyed", idDestroy);
        unit.off("blocked", idBlock);
        unit.off("destroyed", idDestroy2);
        //unit.off("attacked", idAttack);
        unit.trigger("moveEnd", {type:isInterupted? "interupt": "done", target:this.move.getTarget(), unit: unit } );

        if(!this.move.isDone()){
          this.move.interupt();
        }

      }.bind(this);
      idDestroy = to.once("destroyed",  function(){onEvent(true)});
      idBlock = unit.once("blocked",  function(){onEvent(true)});
      idDestroy2 = unit.once("destroyed", function(){onEvent(true)});
      /*idAttack = unit.once("attacked", function(e, by){//le soldat ce fait attacker durant son mouvement
        unit.trigger("moveEnd", {type:"attacked", target:by, unit: unit });
        unit.off("blocked", idBlock);
        to.off("destroyed", idDestroy);
        this.move.interupt();
        defer.resolve({type:"attacked", target:by, unit: unit } );
      });*/

      this.move.start(function(isInterupted){
        onEvent(isInterupted);
        defer.resolve({type:isInterupted? "interupt": "done", target:this.move.getTarget(), unit: unit } )
      }.bind(this));//target found! Move to
      return defer.promise;
    }
  }
  this.findTarget();
}
Movement.prototype.getTarget = function(){
  if (!this.move)
   return null;
  return this.move.getTarget();
}
Movement.prototype.start = function(){
  return this._moveToTarget();
}
