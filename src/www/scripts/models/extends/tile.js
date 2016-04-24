var Tile = function(){
  Attackable.call(this);
}
Tile.prototype = Object.create(Attackable.prototype);
Tile.prototype.constructor = Tile;
Tile.prototype.getFamily = function(){
  return "tile";
};
