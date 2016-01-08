
app.run(["ModelManager", function(ModelManager){
  ModelManager.registerTile("small-wall", {
    life: 10,
    height: 5,
    getClass: function(){
      return this.params;
    },
    getType: function(){
      return types.SMALL_WALL;
    },
    getInterest: function(){
      return 101 - life;
    }
  })
}]);
