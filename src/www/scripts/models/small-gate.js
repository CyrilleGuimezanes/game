
var SmallGate = function(x, y){
  Tile.call(this);
  this.x = x;
  this.y = y;
  this.life = 1000;
  this.class ="small-gate";
  this.type =types.SMALL_GATE;
  this.interest = 101 - this.life;
}

SmallGate.prototype = Object.create(Tile.prototype);
SmallGate.prototype.constructor = SmallGate;
