app.run(["ModelManager", function(ModelManager){
  ModelManager.registerTile("ground", {
    getClass: function(){
      return "ground-sand";
    },
    getType: function(){
      return types.GROUND;
    }
  })
}]);
