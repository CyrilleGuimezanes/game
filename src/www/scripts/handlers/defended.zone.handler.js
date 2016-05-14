var DefendedZone = function(unit){
  this.unit = unit;
  this.zone = {};
  this.enemies = [];
  unit.once("moveStart", this.remove);
  unit.once("moveEnd", this.set);
  this.set();

}
DefendedZone.prototype.off = function(){
  for (var id in this.enemies){
    var data = this.enemies[id];
    data.unit.off("destroyed", data.unitDestroy);
  }

  for (var i in this.zone){
    var data = this.zone[i];
    window.map[data.y][data.x].off("unitEnter", data.unitEnter);
    window.map[data.y][data.x].off("unitLeave", data.unitLeave);
  //  $("#place_"+data.target.id).css("border", "1px solid black");
  }

}
DefendedZone.prototype.selectTarget = function(){
  var ids = Object.keys(this.enemies);
  if (ids.length){
    this.unit.attack(this.enemies[ids[0]].unit);
  }
}
DefendedZone.prototype.set = function(){
  var _this = this;
  var checkActions = function(enemy){
    //Eventuellement, on enléve l'enemie de la liste d'enemie présents dans la zone
    delete _this.enemies[enemy.id];
    //si on peut, on choisie une autre target
    _this.selectTarget();
  }
  for (var y = this.unit.getY() - this.unit.getRange(); y < this.unit.getY() + this.unit.getRange() + 1; y++){
    for (var x = this.unit.getX() - this.unit.getRange(); x < this.unit.getX() + this.unit.getRange() + 1; x++){
      //if(window.map[y][x].getType() == "ground"){
        //$("#place_"+window.map[y][x].id).css("border", "1px solid blue");
        var unitEnter = window.map[y][x].on("unitEnter", function(e, enemy, from){
            if(_this.unit.getActivity() == "guard"){
              _this.unit.attack(enemy);
            }
            if(!_this.enemies[enemy.id]){
              var unitDestroy = enemy.once("destroyed", function(e, unit){
                  checkActions(unit);
              });
              _this.enemies[enemy.id] = {
                unit: enemy,
                unitDestroy: unitDestroy
              };
            }


        });

        var unitLeave = window.map[y][x].on("unitLeave", function(e, enemy, to){
          //SI leave zone == remove / stop attack si enemy = currentTarget
          if (!_this.zone[to.x+"x"+to.y])
            checkActions(enemy);
        });

        _this.zone[x+"x"+y] = {
          unitEnter: unitEnter,
          unitLeave: unitLeave,
          x: x,
          y: y
        }



      //}
      //TODO écouter aussi un événement de construction/destruction et détruire l'évenement dans ce cas.
    }
  }
}

DefendedZone.prototype.remove = function(){
  this.off();
  this.zone = {};
  this.enemies = [];
}
