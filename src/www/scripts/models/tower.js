var Tower = function(x, y){

  Tile.call(this);
  this.x = x;
  this.y = y;
  this.range = 4; //en tile => zone de surveillance en tiles
  this.activitySpeed = 200;
  this.life = 300;
  this.force = 1;//nb de dommage par attaque
  this.projectile = Arrow;
  this.class="tower"
}

Tower.prototype = Object.create(Tile.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.getType = function(){
  return types.TOWER;
};
Tower.prototype.getTargets = function(){
  return [];
};
Tower.prototype.canAttack = function(tile){
  return Math.abs(tile.getX() - this.x) <= this.range && Math.abs(tile.getY() - this.y) <= this.range;
};

Tower.prototype.getActivities = function(){
  return ["guard"];
};
Tower.prototype.guard = function(){
  if(!this._hasZone){
    this.defend = new DefendedZone(this);
    this._hasZone = true;
  }
  this.activity = "guard";
  this.defend.selectTarget();
};
