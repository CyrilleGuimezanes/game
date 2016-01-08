
  app.run(["ModelManager", function(ModelManager){
  ModelManager.registerUnit("soldier", {
    range: 1,
    speed: 3, //en tile/s
    attackSpeed: 100,
    force: 1,
    getSpeed: function(){
      return this.speed;
    },
    getClass: function(){
      return "soldier";
    },
    getType: function(){
      return types.SOLDIER;
    },
    getTargets: function(){
      return ["tree","heart", "small-wall", "cytizen"];
    },
    getWalkableTiles: function(tile){
        return ["ground"];
    },
    canAttack: function(tile){
      return Math.abs(tile.getX() - this.x) <= this.range || Math.abs(tile.getY() - this.y) <= this.range;
    }
  })
}]);
