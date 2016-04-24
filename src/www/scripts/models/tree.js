var Tree = function(x, y){
  Tile.call(this);
  this.x = x;
  this.y = y;
  this.ressource = 1000;
  this.borders = {//rename to neibourgs?
    left: false,
    right: false,
    top: false,
    bottom: false,
  };
}

Tree.prototype = Object.create(Tile.prototype);
Tree.prototype.constructor = Tree;


Tree.prototype.getClass = function(){
  if(this.borders.left || this.borders.right || this.borders.top || this.borders.bottom)
    return "tree-small"
  return "tree";
};
Tree.prototype.getType = function(){
  return types.TREE;
};
