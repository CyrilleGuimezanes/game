
var SmallWall = function(x, y){
  Tile.call(this);
  this.x = x;
  this.y = y;
  this.life = 1000;
  this.class ="small-wall";
  this.type =types.SMALL_WALL;
  this.interest = 101 - this.life;
}

SmallWall.prototype = Object.create(Tile.prototype);
SmallWall.prototype.constructor = SmallWall;
