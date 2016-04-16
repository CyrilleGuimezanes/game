var Heart = function(x, y){

  Tile.call(this);
  this.x = x;
  this.y = y;

  this.life = 1000;
}

Heart.prototype = Object.create(Tile.prototype);
Heart.prototype.constructor = Heart;

Heart.prototype.getClass = function(){
  return "heart";
};
Heart.prototype.getType =function(){
  return types.HEART;
};
Heart.prototype.getInterest = function(){
  return 100000000;//on peut pas être plus important comme cible
};
