var Building = function(start, end, selection){
  if(!end){//single click build

  }
  else{//line build
    //handle line, orientation & diagonal
    var p = new Path({x: start.getX(),y: start.getY()}, {x:end.getX(), y:end.getY()}, ["ground"], {allowDiagonal: false, dontCrossCorners: false});
    var path = p.get();
    for (var i = 0; i < path.length; i++){
      var coords = path[i];
      mapManager.replaceTile(window.map[coords[1]][coords[0]], selection);
    }

  }
}
