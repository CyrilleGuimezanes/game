app.service('MapManager', ['$q','$rootScope', 'ModelManager', 'Move', function($q, $rootScope, ModelManager, Move){
  return {
    _tiles: {},
    _units: {},
    _that: this,
    registerTile: function(name, x, y, params){
      var item = ModelManager.init(name, x, y, params);
      var type = item.getType();
      this._tiles[type] = this._tiles[type] || {};
      this._tiles[type][item.id] = item;
      $rootScope.map[item.getY()][item.getX()] = item;
    },

    registerUnit: function(name, x, y, params){
      var item = ModelManager.init(name, x, y, params);
      var type = item.getType();
      this._units[type] = this._units[type] || {};
      this._units[type][item.id] = item;
      $rootScope.pnjs.push(item);


    },
    unregisterUnit: function(){

    },
    unregisterTile: function(item){
      var type = item.getType();
      var id = item.id;
      $rootScope.map[item.getY()][item.getX()] = null;
      delete this._tiles[type][id];


    },
    replaceTile: function(from, to){
      from.trigger("replacedBy", to);
      this.unregisterTile(from);
      this.registerTile(to, from.getX(), from.getY());
    }
  }
}]);
