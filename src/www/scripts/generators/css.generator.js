var CSS = function(path, unit, target){
  this.animationId = Math.floor(Math.random() * 1000000000);
  this.animationDuration = 0;
  this.cssClass = null;
  this.animationsSteps = [];
  this.target = target;
  var currentTransform = unit.getCurrentPosition();
  this.current = {
    rotation: currentTransform?currentTransform.rotation : 0,
    translation: {x: 0, y: 0}
  }

  this.createObjects(path, unit);

  return {
    ident: this.cssClass,
    last:this.current,
    animationId:this.animationId,
    animationsSteps: this.animationsSteps,
    animationDuration: this.animationDuration
  }
}
/**
 * Inject une balise Style dans le Head de la pager
 * @param  {String} css Contenu de la balise Style
 */
CSS.prototype.injectStyleTag = function(css){
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
CSS.prototype.createTranslation = function(p1, p2){
  var distX = this.current.translation.x + (p2.x - p1.x) * TILE_SIZE;
  var distY = this.current.translation.y + (p2.y - p1.y) * TILE_SIZE;

  return {
    "translation": {x: distX, y:distY}
  }
}

/**
 * Créé une rotation
 * @param  {Object} p1 Position de départ (x et y)
 * @param  {Object} p2 Position d'arrivée (x et y)
 * @return {Object}    Rotation en 0 et 360°
 */
CSS.prototype.createRotation = function(p1, p2){
  var right = p2.x - p1.x > 0;
  var bottom = p2.y - p1.y > 0;
  var left = p1.x - p2.x > 0;
  var top = p1.y - p2.y > 0;
  var ret = 0;


  //top
  if (top && !left && !right)
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
  //diagonale top left:
  else if (top && left)
    ret = 315;

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
CSS.prototype.objectsToKeyframeCss = function(array, duration){
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
CSS.prototype.createObjects = function(path, unit){
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
        /*var id1 = window.map[p1.y][p1.x].id;
        var id2 = window.map[p2.y][p2.x].id;
        $("#place_"+id1).css("border", "1px solid red");
        $("#place_"+id2).css("border", "1px solid red");*/
        ///debug

        if(i == path.length -2)
          angular.extend(obj, this.createRotation(p1, {x: this.target.getX(), y:this.target.getY()}));
        else
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
