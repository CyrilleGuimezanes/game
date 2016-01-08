app.factory("Path", ["$rootScope", function($rootScope){
	var matrixBase = [];
	for (var i = 0; i < MAP_SIZE; i++){
		matrixBase[i] = [];
		var log = "";
		for (var j = 0; j < MAP_SIZE; j++){
			matrixBase[i][j] = 0;
		}
	}
	return function(start, end, walkableTile, params){

	  var map = $rootScope.map;
		this.x1 = start.x;
		this.x2 = end.x;
		this.y1 = start.y;
		this.y2 = end.y;
		this.path = [];
		params = params || {};
		var matrix = matrixBase.slice(0);
		for (var i = 0; i < MAP_SIZE; i++){
			for (var j = 0; j < MAP_SIZE; j++){
				matrix[j][i] = walkableTile.indexOf(map[j][i].getType()) > -1? 0 : 1;
			}
		}
		var grid = new PF.Grid(matrix);
		var finder = new PF.AStarFinder({
			allowDiagonal: params.allowDiagonal != undefined? params.allowDiagonal : true,
	    dontCrossCorners:  params.dontCrossCorners != undefined? params.dontCrossCorners : true
		});
		this.path = finder.findPath(this.x1, this.y1, this.x2, this.y2, grid);
		var _this = this;
		return {
			get: function(){
				return _this.path;
			},
			getStartX: function(){
				return _this.x1;
			},
			getStartY: function(){
				return _this.y1;
			},
			getEndX: function(){
				return _this.x2;
			},
			getEndY: function(){
				return _this.y2;
			}
		}
	}

}]);
