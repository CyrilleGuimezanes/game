///SEEMS TO BE NOT USE.... TO BE CHECK



app.factory('Target', ["$rootScope", function($rootScope){
  return function(unit){
    var map = $rootScope.map;
  	var targets = unit.getTargets();
  	var founds = [];
  	for (var t = 0; t < targets.length; t++){
  		for (var i = 0; i < MAP_SIZE; i++){
  			for (var j = 0; j < MAP_SIZE; j++){
  				if (targets[t].indexOf(map[j][i].getType()) > -1){
  					founds.push(map[j][i]);
  				}
  			}
  		}
  		if (founds.length)
  			break;
  	}
  	var bestPath = [];
  	if(founds.length){
  		founds.sort(function(a, b){
  			var sumA = Math.abs(a.getX() - unit.getX()) + Math.abs(a.getY() - unit.getY());
  			var sumB = Math.abs(b.getX() - unit.getX()) + Math.abs(b.getY() - unit.getY());
  			var interest = b.getInterest() - a.getInterest();
  			return sumB - sumA + interest;//formule qui sort de nul part ... a verifier :D
  		});
  		var length = Math.min(found.length, MAX_CHECKED_PATH);

  		for (var i = 0; i < length; i++)
  		{
  			var target = founds[i];
  			var p = new Path(unit.getX(), unit.getY(), target.getX(), target.getY(), map, unit);
  			var path = p.getPath();
  			if (path && path.length)
  				if (!bestPath.length || path.length < bestPath.length)
  					bestPath = path;
  		}
  	}
  	return bestPath;
  }
}]);
