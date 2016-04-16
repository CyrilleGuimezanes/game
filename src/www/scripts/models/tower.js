var Tower = function(x, y){

  Tile.call(this);
  this.x = x;
  this.y = y;
  this.range = 3; //en tile => zone de surveillance de 3 tiles
  this.attackSpeed = 1000;
  this.life = 300;
  this.force = 1;//nb de dommage par attaque

  new DefendedZone(this);
}

Tower.prototype = Object.create(Tile.prototype);
Tower.prototype.constructor = Tower;


Tower.prototype.getClass = function(){
  return "tower";
};
Tower.prototype.getType = function(){
  return types.TOWER;
};
Tower.prototype.getTargets = function(){
  return [];
};
Tower.prototype.canAttack = function(tile){
  return Math.abs(tile.getX() - this.x) <= this.range || Math.abs(tile.getY() - this.y) <= this.range;
};

Tower.prototype.getActivities = function(){
  return ["guard"];
};
