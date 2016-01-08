app.service('Attack', ['$q','$rootScope', 'MapManager', 'Move', function($q, $rootScope, MapManager, Move){
  return function(unit){

    var findClosestTailOfType = function(unit, type){
      if (!unit || !type)
        throw "Mandatory paramaters: Unit && type";
      var closest = {x: 0, y:0, dist: -1};
      var tiles = MapManager._tiles[type];
      for (var j in tiles){
        var p1 = unit;
        var p2 = tiles[j];
        if (!p2.life)//si l'element est en cours de destruction, on ne le selectionne pas
          continue;
        var d = Math.sqrt(Math.pow(p2.getX() - p1.getX(), 2) + Math.pow(p2.getY() - p1.getY(), 2));
        if (closest.dist == -1 || d < closest.dist){
          closest = {x: p2.getX(), y: p2.getY(), dist: d, unit: unit, target: tiles[j]};
        }
      }

      return closest;
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
      var map = $rootScope.map;
      for (var i = 0; i <  tiles.length; i++){
        var p2 = tiles[i];
        var wallables = p1.getWalkableTiles().concat(p1.getTargets());//on prend d'abord toute les cases pouvant être parcourue avant trouver une éventuelle target sur le chemin => chemin le plus direct au coeur du chateau
        if (p1 && wallables.indexOf(map[p2.y][p2.x].getType()) > -1){
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


    var targets = unit.getTargets();
    var closest = null;
    var target = null;
    var defer = $q.defer();
    for (var i = 0; i < targets.length; i++){
      var target = targets[i];
      closest = findClosestTailOfType(unit, target);
      if (closest && closest.dist > -1){//TODO faire le check pour toutes les tile. La tile la plus proche n'est pas forcément accécible...
        var closestTarget = findClosestWalkableTile(closest);//TODO handle unit range
        if(closestTarget){
          //console.log(unit.id + " will attack" + closest.target.id);
          var m = new Move(unit, closest.target, closestTarget.x, closestTarget.y);
          if(m){
            var to = m.getTarget();
            var idBlock = null;
            var idDestroy = null;
            var onEvent = function(){
              unit.off("blocked", idBlock);
              to.off("destroy", idDestroy);
              if(!m.isDone()){
                m.interupt();
                defer.resolve({type:"interupt", target:m.getTarget(), unit: unit } );
              }

            }
            idDestroy = to.once("destroy", onEvent);
            idBlock = unit.once("blocked", onEvent);

            m.start(function(){
              defer.resolve({type:"done", target:m.getTarget(), unit: unit } )
            });//target found! Move to
            break;
          }
        }else{
          console.log(unit.id + " no target found for move");
        }

      }
      else{
        console.log(unit.id + " no closest found for move");
      }

    }
    if(!target)
    {
      defer.reject()
    }
    return defer.promise;
   }
}]);
