
var Ground = function(x, y){

  Tile.call(this);
  this.x = x;
  this.y = y;
}

Ground.prototype = Object.create(Tile.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.getClass = function(){
  return "ground-sand";
};
Ground.prototype.getType = function(){
  return types.GROUND;
};
