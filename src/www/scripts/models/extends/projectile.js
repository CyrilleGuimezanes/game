var Projectile = function(){
  Common.call(this);
  this.speed = 1; //tile/s
  this.force = 1; //pv/attack
}

Projectile.prototype = Object.create(Common.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.getSpeed = function(){
  return this.speed;
};
Projectile.prototype.getFamily = function(){
  return "projectile";
};
