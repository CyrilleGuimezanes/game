
var Ground = function(x, y){

  Tile.call(this);
  this.x = x;
  this.y = y;
  this.class = "ground-sand";
}

Ground.prototype = Object.create(Tile.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.getType = function(){
  return types.GROUND;
};
