
app.run(["ModelManager", function(ModelManager){
  ModelManager.registerTile("heart", {
    life: 1000,
    getClass: function(){
      return "heart";
    },
    getType: function(){
      return types.HEART;
    },
    onClick: function($event){
      alert("I'm your heart! Dont kill me!");
    },
    getInterest: function(){
      return 100000000;//on peut pas être plus important comme cible
    }
  })
}]);
