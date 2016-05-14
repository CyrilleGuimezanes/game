var Arrow = function(x, y){

  Projectile.call(this);
  this.x = x;
  this.y = y;
  this.speed = 7;
  this.force = 30;
  this.class = "arrow";
}

Arrow.prototype = Object.create(Projectile.prototype);
Arrow.prototype.constructor = Arrow;

Arrow.prototype.getType = function(){
  return types.ARROW;
};
