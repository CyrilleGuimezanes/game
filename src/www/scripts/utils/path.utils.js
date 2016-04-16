var Path = function(start, end, walkableTile, params){
	var matrixBase = [];
	for (var i = 0; i < MAP_SIZE; i++){
		matrixBase[i] = [];
		var log = "";
		for (var j = 0; j < MAP_SIZE; j++){
			matrixBase[i][j] = 0;
		}
	}

	this.x1 = start.x;
	this.x2 = end.x;
	this.y1 = start.y;
	this.y2 = end.y;
	this.path = [];
	params = params || {};
	var matrix = matrixBase.slice(0);
	if (walkableTile != null)//l'unité n'a pas de contrainte (ex: arrow)
		for (var i = 0; i < MAP_SIZE; i++){
			for (var j = 0; j < MAP_SIZE; j++){
				matrix[j][i] = walkableTile.indexOf(window.map[j][i].getType()) > -1? 0 : 1;
			}
		}
	var grid = new PF.Grid(matrix);
	var finder = new PF.AStarFinder({
		allowDiagonal: params.allowDiagonal != undefined? params.allowDiagonal : true,
		dontCrossCorners:  params.dontCrossCorners != undefined? params.dontCrossCorners : true
	});
	this.path = finder.findPath(this.x1, this.y1, this.x2, this.y2, grid);


}
Path.prototype.get= function(){
	return this.path;
};
Path.prototype.getStartX= function(){
	return this.x1;
};
Path.prototype.getStartY= function(){
	return this.y1;
};
Path.prototype.getEndX= function(){
	return this.x2;
};
Path.prototype.getEndY = function(){
	return this.y2;
};
