var MapManager = function(){
  this._tiles = {};
  this._units = {};
}

MapManager.prototype.registerTile = function(klass, x, y, params){
  var item = new klass(x, y, params);
  var type = item.getType();

  this._tiles[type] = this._tiles[type] || {};
  this._tiles[type][item.id] = item;
  window.map[item.getY()][item.getX()] = item;

  if(item.getActivities().length)
    window.occupableItems.push(item);
};

MapManager.prototype.registerUnit = function(klass, x, y, params){
  var item = new klass(x, y, params);
  var type = item.getType();

  this._units[type] = this._units[type] || {};
  this._units[type][item.id] = item;
  window.pnjs.push(item);

  if(item.getActivities().length)
    window.occupableItems.push(item);
};

MapManager.prototype.registerProjectile = function(klass, x, y, params){
  var item = new klass(x, y, params);
  window.projectiles.push(item);
  item.on("hit", function(){
    var i = window.projectiles.indexOf(item);
    delete window.projectiles[i];
  });
  return item;
}

MapManager.prototype.unregisterUnit = function(item){
  var i = window.pnjs.indexOf(item);
  delete window.pnjs[i];
},
MapManager.prototype.unregisterTile = function(item){
  var type = item.getType();
  var id = item.id;
  window.map[item.getY()][item.getX()] = null;
  item._callbacks = {};
  delete this._tiles[type][id];


};
MapManager.prototype.replaceTile = function(from, to){
  from.trigger("replacedBy", to);
  this.unregisterTile(from);
  this.registerTile(to, from.getX(), from.getY());
};
