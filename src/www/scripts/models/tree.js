app.run(["ModelManager", function(ModelManager){
  ModelManager.registerUnit("tree", {
    ressource: 1000,
    life: 2,
    borders: {
      left: false,
      right: false,
      top: false,
      bottom: false,
    },
    getClass: function(){
      if(this.borders.left || this.borders.right || this.borders.top || this.borders.bottom)
        return "tree-small"
      return "tree";
    },
    getType: function(){
      return types.TREE;
    }
  })
}]);
