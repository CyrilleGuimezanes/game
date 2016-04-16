//handle fly of projectile

app.factory("Fly", ['$rootScope', 'Path', function($rootScope, Path){
  /**
   * Génére le mouvement d'une unité sur la carte
   * @param  {Array}   map  Carte à parcourir
   * @param  {Object}   unit Unitée à faire bouger
   * @param  {Integer}   x    Absise cible
   * @param  {Integer}   y    Ordonée cible
   * @return {Object}        Move Instance
   */
  return function(sender, target, projectile){

    //done = done || angular.noop;
    //http://stackoverflow.com/questions/17204513/how-to-find-the-interception-coordinates-of-a-moving-target-in-3d-space
    var v0 = {x: target.getPosX(), y:target.getPosY()};
    if(target.path && target.path.length > 1){
      v0 = {x: target.path[1][0] * TILE_SIZE, y: target.path[1][1] * TILE_SIZE};
    }

    var p0 = {x: target.getPosX(),y:target.getPosY()};
    var p1 = {x: projectile.getPosX(), y:projectile.getPosY()};
    var s0 = target.getSpeed();
    var s1 = projectile.getSpeed();

    var a = (v0.x * v0.x) + (v0.y * v0.y) - (s1 * s1)
    var b = 2 * ((p0.x * v0.x) + (p0.y * v0.y) - (p1.x * v0.x) - (p1.y * v0.y))
    var c = (p0.x * p0.x) + (p0.y * p0.y) + (p1.x * p1.x) + (p1.y * p1.y) - (2 * p1.x * p0.x) - (2 * p1.y * p0.y)

    var t1 = (-b + Math.sqrt((b * b) - (4 * a * c))) / (2 * a)
    var t2 = (-b - Math.sqrt((b * b) - (4 * a * c))) / (2 * a)

    var t = (isNaN(t1) || t1 < 0)? t2 : t1;

    var x = (p0.x - p1.x + (t * s0 * v0.x)) / (t * s1)
    var y = (p0.y - p1.y + (t * s0 * v0.y)) / (t * s1)
    //Possibilité d'avoir des éléments trop haut pour être franchits? A voir
    var p = new Path({x: sender.getX(), y: sender.getY()}, {x: x, y:y}, null);

    var path = p.get();

    var elt = document.getElementById(sender.id);
    var animationId = Math.floor(Math.random() * 1000000000);
    var animationDuration = 0;

    var cssClass = 0;
    var current = {
      rotation: 0,
      translation: {x: 0, y: 0}
    }
    /**
     * Inject une balise Style dans le Head de la pager
     * @param  {String} css Contenu de la balise Style
     */
    var injectStyleTag = function(css){
      var head = document.head || document.getElementsByTagName('head')[0],
          style = document.createElement('style');

      style.type = 'text/css';
      style.id = 'style-'+animationId;
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
    var createTranslation = function(p1, p2){
      var distX = current.translation.x + (p2.x - p1.x) * TILE_SIZE;
      var distY = current.translation.y + (p2.y - p1.y) * TILE_SIZE;

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
    var createRotation = function(p1, p2){
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
    var objectsToKeyframeCss = function(array, duration){
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
      cssClass = "animation_"+id;
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
      animationDuration = duration;
      return css;
    }

    /**
     * Créé une liste d'étape d'animation composée de translations et de rotations
     * @param  {Array} path chemin à parcourir déterminé par le PathFinder
     * @param  {Object} unit Unité concernée
     */
    var animationsSteps = [];
    var createObjects = function(path, unit){
      var distance = 0;
      var array = [];
      //debug
      if (path.length > 1){
          array.push(createRotation({x: path[0][0], y: path[0][1]}, {x: path[1][0], y: path[1][1]}))//on positionne l'élément ne direction du centre de la carte
          for (var i = 0; i < path.length -1; i++){
            var p1 = {x: path[i][0], y: path[i][1]};
            var p2 = {x: path[i + 1][0], y: path[i + 1][1]};
            var obj = createTranslation(p1, p2);
            ///debug
            var id1 = window.map[p1.y][p1.x].id;
            var id2 = window.map[p2.y][p2.x].id;
            ///debug
            angular.extend(obj, createRotation(p1, p2));

            current.rotation = obj.rotation || 0;
            current.translation.x = obj.translation.x || 0;
            current.translation.y = obj.translation.y || 0;

            distance += Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) * TILE_SIZE;

            array.push(obj);
          }
      }
      else{
        var obj = createRotation({x: unit.getX(), y: unit.getY()}, {x: target.getX(), y:target.getY()});
        array.push(obj);
        current.rotation = obj.rotation || 0;
      }
      /*
      var obj = angular.extend({"translation": current.translation}, createRotation({x: unit.getX(), y: unit.getY()}, {x: target.getX(), y:target.getY()}));
      array.push(obj);
      current.rotation = obj.rotation || 0;
      */
      animationsSteps = array;
      var css = objectsToKeyframeCss(array, distance / (unit.getSpeed() * TILE_SIZE) );
      injectStyleTag(css);
    }

    createObjects(path, unit);
    var onEnded = function(translation, rotation){
      var _unit = $("#unit_"+unit.id);
      unit.setX(Math.round((unit.getPosX() + (translation? translation.x : 0)) / TILE_SIZE));
      unit.setY(Math.round((unit.getPosY() + (translation? translation.y : 0)) / TILE_SIZE));

      for (var i = 0; i < eventListen.length; i++){
        if(eventListen[i].elt)
          eventListen[i].elt.off("replacedBy", eventListen[i].id);
      }
      _unit[0].style.webkitTransform = 'rotate(' + rotation + 'deg)';
      _unit[0].style.MozTransform = 'rotate(' + rotation + 'deg)';
      _unit[0].style.msTransform = 'rotate(' + rotation + 'deg)';
      _unit[0].style.OTransform = 'rotate(' + rotation + 'deg)';
      _unit[0].style.transform = 'rotate(' + rotation + 'deg)';
      _unit.removeClass(cssClass);
      $("#style-"+animationId).remove();
    }

    return {
      _done: false,
      _startTime: 0,
      _interval: null,
      _remaningIteration: 0,
      isDone: function(){
        return this._done;
      },

      /**
       * Lance l'animation
       * @param  {Function} done Callback appellé à la fin de l'animation
       */
      start: function(done){
        if(!this._done){
          var _unit = $("#projectile_"+unit.id);
          var _this = this;
          var _onMovementFinished = function(){
            if (_this._interval)
              clearInterval(_this._interval);
            onEnded(current.translation, current.rotation);
            _this._done = true;
            done && done();
          }
          _unit.addClass(cssClass);
          _this._startTime = Date.now();
          _this._remaningIteration = animationsSteps.length;
          _this._remaningIteration == 0 && _onMovementFinished();

          _this._interval = setInterval(function(){

            if(_this._remaningIteration <= 0)
              _onMovementFinished();
            else{
              var currentStep = animationsSteps[animationsSteps.length - _this._remaningIteration];
              var x = Math.round((unit.getPosX() + (currentStep.translation? currentStep.translation.x : 0)) / TILE_SIZE);
              var y = Math.round((unit.getPosY() + (currentStep.translation? currentStep.translation.y : 0)) / TILE_SIZE);
              if (x != _this._currentTile.x || y != _this._currentTile.y){

                //console.log(unit.id + "leave "+_this._currentTile.x+"x"+_this._currentTile.y+" and enter in " + x+ "x"+y);
                _this._currentTile.x = x;
                _this._currentTile.y = y;
              }

            }

            _this._remaningIteration--;
          }, Math.round(1000 / unit.getSpeed()))//une itération = une case parcourue
        }

      },
     getTarget: function(){
       return target;
     }
    }
  }
}]);
