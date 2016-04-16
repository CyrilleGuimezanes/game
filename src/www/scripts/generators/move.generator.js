var Move = function(unit, target, x, y){
  this.target = target;
  this.unit = unit;
  this._done = false;
  this._startTime= 0;
  this._interval= null;
  this._remaningIteration= 0;
  this._currentTile= {x: unit.getX(), y: unit.getY()};
  this.cssClass = null;
  this.animationsSteps = [];
  this.eventListen = [];
  this.current = {
    rotation: 0,
    translation: {x: 0, y: 0}
  }
  //done = done || angular.noop;
  var p = new Path({x: unit.getX(), y: unit.getY()}, {x: x, y:y}, unit.getWalkableTiles());

  if(!p.get().length){
    var walkables = unit.getWalkableTiles().concat(unit.getTargets());
    p = new Path({x: unit.getX(), y: unit.getY()}, {x: x, y:y}, walkables);
  }
  $("#place_"+window.map[target.getY()][target.getX()].id).css("border", "1px solid blue");

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
          this.path.splice(i, 1000000);

          break;
      }
    }
  }

  /*if (path.length <= 1)//soit pas de path possible, soit un path de 0 cases
  {
    console.log(unit.id + " path of "+ path.length + " step found");
    return {
        isDone: function(){return true;},
        start: function(done){done && done(); return;},
        interupt: angular.noop
      };
  }*/


  //var elt = document.getElementById(unit.id);
  this.animationId = Math.floor(Math.random() * 1000000000);
  this.animationDuration = 0;





  this.createObjects(this.path, this.unit);


}

/**
 * Inject une balise Style dans le Head de la pager
 * @param  {String} css Contenu de la balise Style
 */
Move.prototype.injectStyleTag = function(css){
  var head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

  style.type = 'text/css';
  style.id = 'style-'+this.animationId;
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);
}
/**
 * Calcule une translation en px
 * @param  {Object} p1 Position de départ (x et y)
 * @param  {Object} p2 Position d'arrivée (x et y)
 * @return {Object}    transition en X et en Y
 */
Move.prototype.createTranslation = function(p1, p2){
  var distX = this.current.translation.x + (p2.x - p1.x) * TILE_SIZE;
  var distY = this.current.translation.y + (p2.y - p1.y) * TILE_SIZE;

  return {
    "translation": {x: distX, y:distY}
  }
}
/*Move.prototype.getTransformations = function(elementId){

  var cssToMatrix = function(elementId) {
    var element = document.getElementById(elementId),
        style = window.getComputedStyle(element);

    return style.getPropertyValue("-webkit-transform") ||
           style.getPropertyValue("-moz-transform") ||
           style.getPropertyValue("-ms-transform") ||
           style.getPropertyValue("-o-transform") ||
           style.getPropertyValue("transform");
  }


   var matrixToTransformObj = function(matrix) {
    // this happens when there was no rotation yet in CSS
    if(matrix === 'none') {
      matrix = 'matrix(0,0,0,0,0)';
    }
    var obj = {},
        values = matrix.match(/([-+]?[\d\.]+)/g);

    obj.rotation = (Math.round(
      Math.atan2(
        parseFloat(values[1]),
        parseFloat(values[0])) * (180/Math.PI)) || 0
    );
    obj.rotation = obj.rotation < 0? 360 + obj.rotation : obj.rotation;
    obj.translation = values[5] ? {x: parseInt(values[4]), y:parseInt(values[5])} : (values[4] ? {x: parseInt(values[4])} : {});

    return obj;
  }

  var matrix = cssToMatrix(elementId);
  return matrixToTransformObj(matrix);

}*/
/**
 * Créé une rotation
 * @param  {Object} p1 Position de départ (x et y)
 * @param  {Object} p2 Position d'arrivée (x et y)
 * @return {Object}    Rotation en 0 et 360°
 */
Move.prototype.createRotation = function(p1, p2){
  var right = p2.x - p1.x > 0;
  var bottom = p2.y - p1.y > 0;
  var left = p1.x - p2.x > 0;
  var top = p1.y - p2.y > 0;
  var ret = 0;
  //diagonale top left:
  if (top && left)
  ret = 315;
  //top
  else if (top && !left && !right)
  ret = 0;
  //diagonale top right
  else if (top && right)
  ret = 45;
  //right
  else if (right && !top && !bottom)
  ret =  90;
  //diagonale bottom right
  else if (right && bottom)
  ret =  135;
  //bottom
  else if (bottom && !left && !right)
  ret =  180;
  //diagonale bottom left
  else if (bottom && left)
  ret =  225;
  //left
  else if (left && !top && !bottom)
  ret =  270;

  //ret -= current.rotation;
  return {
    "rotation": ret
  }
}

/**
 * Converti les translations et les rotations en une une animation de N étapes
 * @param  {Array} array    Liste des étapes de l'animation
 * @param  {Integer} duration Durée en seconde de l'animation
 * @return {String}          Animation CSS prête à être insérée
 */
Move.prototype.objectsToKeyframeCss = function(array, duration){
  var stepPctg = Math.round((100/(array.length)) *100) / 100;
  var id = Math.floor(Math.random() * 100000000);
  duration = duration > 0 ? Math.round(duration * 100) / 100 : 0.50;
  var css = ".animation_"+id+"{"+
  "animation: gen_"+id+" "+duration+"s linear;"+
  "-webkit-animation: gen_"+id+" "+duration+"s linear;"+
  "-moz-animation: gen_"+id+" "+duration+"s linear;"+
  "-o-animation: gen_"+id+" "+duration+"s linear;"+
  "-ms-animation: gen_"+id+" "+duration+"s linear;"+
  "animation-iteration-count: 1;"+
  "-webkit-animation-iteration-count: 1;"+
  "-moz-animation-iteration-count: 1;"+
  "-o-animation-iteration-count: 1;"+
  "-ms-animation-iteration-count: 1;"+
  "animation-fill-mode: forwards;"+
  "-webkit-animation-fill-mode: forwards;"+
  "-moz-animation-fill-mode: forwards;"+
  "-ms-animation-fill-mode: forwards;"+
  "}"+
  "@keyframes gen_"+id+" {";

  var currentPctg = 0;
  var translationToString = function(translation){
    if (!translation)
      return "";
    return "translate("+translation.x+"px,"+translation.y+"px)"
  }
  var rotationToString = function(rotation){
    if (!rotation)
      return "";
    return "rotate("+rotation+"deg)";
  }
  this.cssClass = "animation_"+id;
  for (var i = 0; i < array.length; i++){
    if(currentPctg > 100)
      console.error("MoveHandler : currentPctg > 100");
    css += (i < array.length - 1? currentPctg : "100") +"%   {";
    var transforms = array[i];
    css += "-webkit-transform: "+translationToString(transforms.translation)+" "+rotationToString(transforms.rotation)+";"+
    "-ms-transform: "+translationToString(transforms.translation)+" "+rotationToString(transforms.rotation)+";"+
    "-o-transform: "+translationToString(transforms.translation)+" "+rotationToString(transforms.rotation)+";"+
    "transform: "+translationToString(transforms.translation)+" "+rotationToString(transforms.rotation)+";";



    css += "}";
    currentPctg += stepPctg;
    currentPctg = Math.round(currentPctg * 100) / 100; //on remet sur deux décimaux
  }
  css += "}";
  this.animationDuration = duration;
  return css;
}

/**
 * Créé une liste d'étape d'animation composée de translations et de rotations
 * @param  {Array} path chemin à parcourir déterminé par le PathFinder
 * @param  {Object} unit Unité concernée
 */
Move.prototype.createObjects = function(path, unit){
  var distance = 0;
  var array = [];
  unit.path = path;
  //debug
  if (path.length > 1){
      array.push(this.createRotation({x: path[0][0], y: path[0][1]}, {x: path[1][0], y: path[1][1]}))//on positionne l'élément ne direction du centre de la carte
      for (var i = 0; i < path.length -1; i++){
        var p1 = {x: path[i][0], y: path[i][1]};
        var p2 = {x: path[i + 1][0], y: path[i + 1][1]};
        var obj = this.createTranslation(p1, p2);
        window.map[p1.y][p1.x].trigger("tileAddedInPath", window.map[p1.y][p1.x], unit, path, i);
        ///debug
        var id1 = window.map[p1.y][p1.x].id;
        var id2 = window.map[p2.y][p2.x].id;
        $("#place_"+id1).css("border", "1px solid red");
        $("#place_"+id2).css("border", "1px solid red");
        ///debug
        angular.extend(obj, this.createRotation(p1, p2));

        this.current.rotation = obj.rotation || 0;
        this.current.translation.x = obj.translation.x || 0;
        this.current.translation.y = obj.translation.y || 0;

        distance += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) * TILE_SIZE;

        array.push(obj);
      }
  }
  else{
    var obj = this.createRotation({x: unit.getX(), y: unit.getY()}, {x: this.target.getX(), y:this.target.getY()});
    array.push(obj);
    this.current.rotation = obj.rotation || 0;
  }
  /*
  var obj = angular.extend({"translation": this.current.translation}, this.createRotation({x: unit.getX(), y: unit.getY()}, {x: target.getX(), y:target.getY()}));
  array.push(obj);
  this.current.rotation = obj.rotation || 0;
  */
  this.animationsSteps = array;
  var css = this.objectsToKeyframeCss(array, distance / (unit.getSpeed() * TILE_SIZE) );
  this.injectStyleTag(css);
}



Move.prototype.onEnded = function(translation, rotation){
  var _unit = $("#unit_"+this.unit.id);
  this.unit.setX(Math.round((this.unit.getPosX() + (translation? translation.x : 0)) / TILE_SIZE));
  this.unit.setY(Math.round((this.unit.getPosY() + (translation? translation.y : 0)) / TILE_SIZE));
  this.unit.path = null;
  for (var i = 0; i < this.eventListen.length; i++){
    if(this.eventListen[i].elt)
      this.eventListen[i].elt.off("replacedBy", this.eventListen[i].id);
  }
  _unit[0].style.webkitTransform = 'rotate(' + rotation + 'deg)';
  _unit[0].style.MozTransform = 'rotate(' + rotation + 'deg)';
  _unit[0].style.msTransform = 'rotate(' + rotation + 'deg)';
  _unit[0].style.OTransform = 'rotate(' + rotation + 'deg)';
  _unit[0].style.transform = 'rotate(' + rotation + 'deg)';
  _unit.removeClass(this.cssClass);
  $("#style-"+this.animationId).remove();
}

Move.prototype.isDone = function(){
  return this._done;
};

Move.prototype.interupt = function(){
  if(!this._done){
    if (this._interval)
      clearInterval(this._interval);
    var elapsedTime = Date.now() - this._startTime;
    var currentStep = Math.round((elapsedTime * this.animationsSteps.length)/ (this.animationDuration * 1000));
    currentStep = currentStep < 1? 1 : currentStep > this.animationsSteps.length? this.animationsSteps.length : currentStep;
    //var data = getTransformations("unit_"+unit.id);
    //console.log(unit.id + " interupted on step "+ (currentStep - 1) + " over "+ (this.animationsSteps.length - 1), this.animationsSteps[currentStep - 1]);
    this.onEnded(this.animationsSteps[currentStep - 1].translation, this.animationsSteps[currentStep - 1].rotation);
    this._done = true;
  }

};

Move.prototype.start = function(done){
  if(!this._done){
    var _unit = $("#unit_"+this.unit.id);
    var _this = this;
    this._onMovementFinished = function(){
      if (_this._interval)
        clearInterval(_this._interval);
      this.onEnded(this.current.translation, this.current.rotation);
      _this._done = true;
      done && done();
    }
    _unit.addClass(this.cssClass);
    _this._startTime = Date.now();
    _this._remaningIteration = this.animationsSteps.length;
    _this._remaningIteration == 0 && this._onMovementFinished();

    _this._interval = setInterval(function(){

      if(_this._remaningIteration <= 0)
        this._onMovementFinished();
      else{
        var currentStep = this.animationsSteps[this.animationsSteps.length - _this._remaningIteration];
        if(currentStep)
        {
          var x = Math.round((this.unit.getPosX() + (currentStep.translation? currentStep.translation.x : 0)) / TILE_SIZE);
          var y = Math.round((this.unit.getPosY() + (currentStep.translation? currentStep.translation.y : 0)) / TILE_SIZE);
          if (x != _this._currentTile.x || y != _this._currentTile.y){
            //do something;
            window.map[_this._currentTile.y][_this._currentTile.x].trigger("unitLeave", this.unit);
            window.map[y][x].trigger("unitEnter", this.unit);
            $("#place_"+window.map[_this._currentTile.y][_this._currentTile.x].id).css("border", "1px solid white");
            if(this.unit.path && this.unit.path.length)
              this.unit.path.shift();

            //console.log(unit.id + "leave "+_this._currentTile.x+"x"+_this._currentTile.y+" and enter in " + x+ "x"+y);
            _this._currentTile.x = x;
            _this._currentTile.y = y;
          }
        }


      }

      _this._remaningIteration--;
    }.bind(this), (this.animationDuration / (this.animationsSteps.length)) * 1000)//une itération = une case parcourue
  }

};

Move.prototype.getTarget = function(){
  return this.target;
}
