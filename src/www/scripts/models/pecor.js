
  app.run(["ModelManager", function(ModelManager){
  ModelManager.registerUnit("pecor", {
    range: 1,
    speed: 1, //en tile/s
    attackSpeed: 1000,
    force: 1,
    getSpeed: function(){
      return this.speed;
    },
    getClass: function(){
      return "pecor";
    },
    getType: function(){
      return types.PECOR;
    },
    getTargets: function(){
      return [];
    },
    getWalkableTiles: function(tile){
        return ["ground"];
    },
    canAttack: function(tile){
      return Math.abs(tile.getX() - this.x) <= this.range || Math.abs(tile.getY() - this.y) <= this.range;
    }
  })
}]);
