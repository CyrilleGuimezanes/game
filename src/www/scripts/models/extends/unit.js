var Unit = function(){
  Attackable.call(this);
  this.path = null; //if moving path != null;

}
Unit.prototype = Object.create(Attackable.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.getPath = function(){
  return this.path;
};

Unit.prototype.getWalkableTiles = function(){
  return [];//overriden in each unit
};

Unit.prototype.getSpeed = function(){
  return this.speed;
};


Unit.prototype.setX = function(x){
  if(x < 0 || x > MAP_SIZE)
    throw Error("x out of bounds!");
  this.x = x;
  $("#unit_"+this.id).css("left", this.getPosX()+ "px");
  return this;
};
Unit.prototype.setY = function(y){
  if(y < 0 || y > MAP_SIZE)
    throw Error("x out of bounds!");
  this.y = y;
  $("#unit_"+this.id).css("top", this.getPosY()+ "px");
  return this;
};
Unit.prototype.getFamily = function(){
  return "unit";
};
