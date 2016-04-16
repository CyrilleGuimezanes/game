var DefendedZone = function(unit){
  this.unit = unit;
  this.recordedEvent = {};

  unit.once("moveStart", this.remove);
  unit.once("moveEnd", this.set);
  this.set();

}

DefendedZone.prototype.set = function(){
  for (var y = this.unit.getY() - this.unit.getZone(); y < this.unit.getY() + this.unit.getZone() + 1; y++){
    for (var x = this.unit.getX() - this.unit.getZone(); x < this.unit.getX() + this.unit.getZone() + 1; x++){
      if(window.map[y][x].getType() == "ground"){
        $("#place_"+window.map[y][x].id).css("border", "1px solid blue");
        var unitEnter = window.map[y][x].on("unitEnter", function(e, tile, enemy, path, pos){

            //écouter aussi un événement de construction et détruire l'évenement dans ce cas.
            var unitDestroy = enemy.once("destroyed", function(e, tile, enemy, path, pos){
              this.unit.stop();
              recordedEvent[enemy.id].target.off("unitLeave", recordedEvent[enemy.id].unitEnter);
            });
            var unitLeave = window.map[y][x].once("unitLeave", function(e, tile, enemy, path, pos){
              this.unit.stop();
              recordedEvent[enemy.id].target.off("unitDestroyed", recordedEvent[enemy.id].unitEnter);
            });

            this.unit.attack(enemy);

            this.recordedEvent[enemy.id] = {
              unitEnter: unitEnter,
              unitDestroy: unitDestroy,
              unitLeave: unitLeave,
              target: window.map[y][x]
            }
        });




      }
      else{
        //ce n'est pas du sol, on écoute la destruction pour le rajouter à la zone dans ce cas.
      }

    }
  }
}

DefendedZone.prototype.remove = function(){
  for (var i in this.recordedEvent){
    var data = this.recordedEvent[i];
    $("#place_"+data.target.id).css("border", "1px solid black");
    data.target.off("unitEnter", data.unitEnter);
  }
}
