var Move = function(unit, target, x, y){
  this.target = target;
  this.unit = unit;
  this._done = false;
  this._startTime= 0;
  this._interval= null;
  this.interupted = false;
  this._remaningIteration= 0;
  this._currentTile= {x: unit.getX(), y: unit.getY()};
  this.css = null;


  this.eventListen = [];
  //done = done || angular.noop;
  var p = new Path({x: unit.getX(), y: unit.getY()}, {x: x, y:y}, unit.getWalkableTiles());

  if(!p.get().length){
    var walkables = unit.getWalkableTiles().concat(unit.getTargets());

    p = new Path({x: unit.getX(), y: unit.getY()}, {x: x, y:y}, walkables);
  }


  this.path = p.get();

  if (this.path.length > 2){
    var targets = unit.getTargets();
    for (var i = 1; i < this.path.length; i++){
      var pathElt = window.map[this.path[i][1]][this.path[i][0]];
      var eventId = pathElt.once("replacedBy", function(e, type){
        unit.trigger("blocked");
        console.log("Block replaced!");
      });
      this.eventListen.push({elt: pathElt, id: eventId});
      if(targets.indexOf(pathElt.getType()) > -1){//si, sur le chemin, on trouve une target, on change de target

          this.target = pathElt;

          console.log("path reduced at "+ i +" of" + (this.path.length - 1));
          this.path.splice(i, 1000);

          break;
      }
    }
  }
  $("#place_"+window.map[unit.getY()][unit.getX()].id).css("border", "1px solid orange");
  $("#place_"+window.map[y][x].id).css("border", "1px solid orange");
  this.css = new CSS(this.path, this.unit, this.target);
}




Move.prototype.onEnded = function(translation, rotation){
  var _unit = $("#unit_"+this.unit.id);
  this.unit.setX(Math.round((this.unit.getPosX() + (translation? translation.x : 0)) / TILE_SIZE));
  this.unit.setY(Math.round((this.unit.getPosY() + (translation? translation.y : 0)) / TILE_SIZE));
  this.unit.path = null;
  _unit.removeClass(this.css.ident);
  $("#style-"+this.css.animationId).remove();

  _unit[0].style.webkitTransform = 'rotate(' + rotation + 'deg)';
  _unit[0].style.MozTransform = 'rotate(' + rotation + 'deg)';
  _unit[0].style.msTransform = 'rotate(' + rotation + 'deg)';
  _unit[0].style.OTransform = 'rotate(' + rotation + 'deg)';
  _unit[0].style.transform = 'rotate(' + rotation + 'deg)';


  for (var i = 0; i < this.eventListen.length; i++){
    if(this.eventListen[i].elt)
      this.eventListen[i].elt.off("replacedBy", this.eventListen[i].id);
  }

}

Move.prototype.isDone = function(){
  return this._done;
};

Move.prototype.interupt = function(){
  this.interupted = true;
};

Move.prototype.start = function(done){
  if(!this._done){
    var _unit = $("#unit_"+this.unit.id);
    var _this = this;
    this._onMovementFinished = function(transform){
      if (_this._interval)
        clearInterval(_this._interval);
      this.onEnded(transform.translation, transform.rotation);
      _this._done = true;
      done && done(_this.interupted);
    }
    _unit.addClass(this.css.ident);
    _this._startTime = Date.now();
    _this._remaningIteration = this.css.animationsSteps.length;
    _this._remaningIteration == 0 && this._onMovementFinished(this.css.last);

    _this._interval = setInterval(function(){

      if(_this._remaningIteration <= 0)
        this._onMovementFinished(this.css.last);
      else if(_this.interupted){
        var elapsedTime = Date.now() - _this._startTime;
        var currentStep = Math.round((elapsedTime * _this.css.animationsSteps.length)/ (_this.css.animationDuration * 1000));
        currentStep = currentStep < 1? 1 : currentStep > _this.css.animationsSteps.length - 1? _this.css.animationsSteps.length - 1: currentStep;
        window.map[_this._currentTile.y][_this._currentTile.x].trigger("unitLeave", this.unit, {x: x, y});
        _this._onMovementFinished(this.css.animationsSteps[currentStep]);
      }
      else{
        var currentStep = this.css.animationsSteps[this.css.animationsSteps.length - _this._remaningIteration + 1];
        if(currentStep)
        {

          var x = Math.round((this.unit.getPosX() + (currentStep.translation? currentStep.translation.x : 0)) / TILE_SIZE);
          var y = Math.round((this.unit.getPosY() + (currentStep.translation? currentStep.translation.y : 0)) / TILE_SIZE);
          if (x != _this._currentTile.x || y != _this._currentTile.y){
            //do something;

            window.map[_this._currentTile.y][_this._currentTile.x].trigger("unitLeave", this.unit, {x: x, y});
            window.map[y][x].trigger("unitEnter", this.unit, window.map[_this._currentTile.y][_this._currentTile.x]);
            //$("#place_"+window.map[_this._currentTile.y][_this._currentTile.x].id).css("border", "1px solid white");
            if(this.unit.path && this.unit.path.length)
              this.unit.path.shift();


            _this._currentTile.x = x;
            _this._currentTile.y = y;
          }


        }
      }
      _this._remaningIteration--;
    }.bind(this), (this.css.animationDuration / (this.css.animationsSteps.length)) * 1000)//une itération = une case parcourue
  }

};

Move.prototype.getTarget = function(){
  return this.target;
}
