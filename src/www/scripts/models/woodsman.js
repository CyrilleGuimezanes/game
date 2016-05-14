var Woodsman = function(x, y){

  Unit.call(this);
  this.x = x;
  this.y = y;
  this.range = 1;
  this.speed = 2; //en tile/s
  this.activitySpeed = 2000;
  this.force = 1;
  this.life = 10;
  this.class="wooder";
  this.type = types.WOODER;
  this.targets = ["tree"];
  this.walkableTiles = ["ground", "small-gate"];
  this.activities = ["exploit"];
}

Woodsman.prototype = Object.create(Unit.prototype);
Woodsman.prototype.constructor = Woodsman;
