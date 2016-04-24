var DefendedZone = function(unit){
  this.unit = unit;
  this.zone = {};
  this.enemies = [];
  unit.once("moveStart", this.remove);
  unit.once("moveEnd", this.set);
  this.set();

}
DefendedZone.prototype.off = function(){
  for (var i = 0; i < this.enemies.length; i++){
    var data = this.enemies[i];
    data.unit.off("destroyed", data.unitDestroy);
  }

  for (var i in this.zone){
    var data = this.zone[i];
    window.map[data.y][data.x].off("unitEnter", data.unitEnter);
    window.map[data.y][data.x].off("unitLeave", data.unitLeave);
    $("#place_"+data.target.id).css("border", "1px solid black");
  }

}
DefendedZone.prototype.set = function(){
  var _this = this;
  var checkActions = function(enemy){

    //si l'enmie attaqué est ceului concerné, on arrete l'attaque
    if (_this.unit.currentTarget && enemy.id == _this.unit.currentTarget.id){
      _this.unit.stop();
      _this.unit.activity = "guard";
    }


    //Eventuellement, on enléve l'enemie de la liste d'enemie présents dans la zone
    for (var i = 0; i < _this.enemies.length; i++)
      if (_this.enemies[i].unit.id == enemy.id)
        _this.enemies.splice(i, 1);

    //si on peut, on choisie une autre target
    if (_this.unit.getActivity() == "guard" && _this.enemies.length){
      _this.unit.attack(_this.enemies[0].unit);
    }
  }
  for (var y = this.unit.getY() - this.unit.getRange(); y < this.unit.getY() + this.unit.getRange() + 1; y++){
    for (var x = this.unit.getX() - this.unit.getRange(); x < this.unit.getX() + this.unit.getRange() + 1; x++){
      //if(window.map[y][x].getType() == "ground"){
        $("#place_"+window.map[y][x].id).css("border", "1px solid blue");
        var unitEnter = window.map[y][x].on("unitEnter", function(e, enemy, from){
            if(_this.unit.getActivity() == "guard"){

              _this.unit.attack(enemy);

              var unitDestroy = enemy.once("destroyed", function(e){
                  checkActions(this);
              });

              _this.enemies.push({
                unit: enemy,
                unitDestroy: unitDestroy
              })
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
