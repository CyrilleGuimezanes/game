

var Soldier = function(x, y){

  Unit.call(this);
  this.x = x;
  this.y = y;
  this.range = 1;
  this.speed = 3; //en tile/s
  this.activitySpeed = 1000;
  this.force = 1;
  this.life = 100;
  this.class="soldier"
}

Soldier.prototype = Object.create(Unit.prototype);
Soldier.prototype.constructor = Soldier;

Soldier.prototype.getType = function(){
  return types.SOLDIER;
};
Soldier.prototype.getTargets = function(){
  return ["tree", "heart", "small-wall", "cytizen"];
};
Soldier.prototype.getWalkableTiles = function(tile){
    return ["ground"];
};
Soldier.prototype.canAttack = function(tile){
  return Math.abs(tile.getX() - this.x) <= this.range || Math.abs(tile.getY() - this.y) <= this.range;
};
Soldier.prototype.getActivities = function(){
  return ["attack"];
};
