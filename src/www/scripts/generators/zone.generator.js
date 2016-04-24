var Zone = function(x, y, size, model){
    if (!(x >= 0 && y >= 0 && x < MAP_SIZE && y < MAP_SIZE)){
      console.error("x or y are out of bounds");
    }

    var remainingSize = size - 1;
    var turn = 10;

    if (remainingSize > 0 && window.map[y][x].getType() == "ground"){
      mapManager.replaceTile(window.map[y][x], model);
    }


    var minX = x - 1;
    var minY = y - 1;
    var maxX = x + 1;
    var maxY = y + 1;
    var zone = [];
    while (remainingSize > 0 && !!turn){
      minX = minX > 0? minX : 0;
      minY = minY > 0? minY : 0;
      maxY = maxY > 0? maxY : 0;
      maxX = maxX > 0? maxX : 0;

      for (var i = minX; i < maxX; i++)
        for (var j = minY; j < maxY; j++){
            if (!window.map[j] || !window.map[j][i] || !window.map[j][i].getType() == "ground" || window.map[j][i].getType() == model)
              continue;
            if (remainingSize == 0)//plus rien à placer, on débranche...
              break;
            if (Math.random() <= 0.4)//si on est en train de finir, on fait des bordure irrégulière pour ne pas avoir un carré tout le temps
              continue;
            mapManager.replaceTile(window.map[j][i], model);
            zone.push({x: i, y: j});
            remainingSize--;

        }
        minX--;
        minY--;
        maxY++;
        maxX++;
        turn--;
    }
    for (var i = 0; i < zone.length; i++)
    {
       var x = zone[i].x;
       var y = zone[i].y;

       var type = window.map[y][x].getType();
       if(window.map[y][x].borders){
         window.map[y][x].borders = {
           left: false,
           right: false,
           top: false,
           bottom: false
         };
         window.map[y][x].borders.left = x > 0 ? window.map[y][x - 1].getType() != type : true;
         window.map[y][x].borders.right =  x < MAP_SIZE - 1? window.map[y][x + 1].getType() != type : true;
         window.map[y][x].borders.top =  y > 0 ? window.map[y - 1][x].getType() != type  :true;
         window.map[y][x].borders.bottom =  y < MAP_SIZE - 1? window.map[y + 1][x].getType() != type: true;


       }
    }

}
