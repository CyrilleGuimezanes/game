
var SmallWall = function(x, y){
  Tile.call(this);
  this.x = x;
  this.y = y;
  this.life = 11;
  this.class ="small-wall";
}

SmallWall.prototype = Object.create(Tile.prototype);
SmallWall.prototype.constructor = SmallWall;

SmallWall.prototype.getType = function(){
  return types.SMALL_WALL;
};
SmallWall.prototype.getInterest = function(){
  return 101 - life;
};
