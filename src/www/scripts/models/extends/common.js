var Common = function(){
  this.x = 0;
  this.y = 0;

  this.life = 1;
  this.id = Math.round(Math.random() * 1000000000);
  this._callbacks = {};
};


Common.prototype.trigger = function(name, a, b, c, d, e){
  var cb = this._callbacks[name] || {};
  var _this = this;
  //console.log("event: "+ name, Object.keys(calls).length);
  for (var i in cb){
      var callb = (cb[i]).bind(_this);
      callb(name, a, b, c, d, e);
  }
};
Common.prototype.on = function(name, callback, once){
  var id = Math.randomInt(0, 10000000000000);
  //TODO check if id not exist;
  if (angular.isString(name) && angular.isFunction(callback)){
    this._callbacks[name] = this._callbacks[name] || {};
    if(!once)
      this._callbacks[name][id] = callback;
    else{
      this._callbacks[name][id] = function(name, a, b, c, d, e){
        callback(name, a, b, c, d, e);
        this.off(name, id);
      }
    }
    return id;
  }
  else {
    throw "Unable to register callback, be sure name is a string and callback is a function";
  }

};
Common.prototype.once = function(name, callback){
  return this.on(name, callback, true);
};
Common.prototype.off = function(name, id){
  if (this._callbacks[name])
    delete this._callbacks[name][id];
};
Common.prototype.getX = function(){
  return this.x;
};
Common.prototype.getY = function(){
  return this.y;
};
Common.prototype.getClass = function(){
  return this.class;
};
Common.prototype.getType = function(){
  return this.type;
};

Common.prototype.getPosX = function(){
  return this.x * TILE_SIZE + 1;//+1 for borders
};
Common.prototype.getPosY = function(){
  return this.y * TILE_SIZE + 1;//+1 for borders
};
Common.prototype.getPos = function(){
  return {x: this.x * TILE_SIZE + 1, y: this.y * TILE_SIZE + 1};//+1 for borders
};
//get physical unit position
Common.prototype.getCurrentPosition = function(){

  /**
  * Retrieves element transformation as a matrix
  *
  * Note that this will only take translate and rotate in account,
  * also it always reports px and deg, never % or turn!
  *
  * @param elementId
  * @return string matrix
  */
  var cssToMatrix = function(elementId) {
    var element = document.getElementById(elementId);
    if (!element)
      return null;
    var style = window.getComputedStyle(element);

    return style.getPropertyValue("-webkit-transform") ||
    style.getPropertyValue("-moz-transform") ||
    style.getPropertyValue("-ms-transform") ||
    style.getPropertyValue("-o-transform") ||
    style.getPropertyValue("transform");
  }
  var _this = this;
  /**
  * Transforms matrix into an object
  *
  * @param string matrix
  * @return object
  */
  var matrixToTransformObj = function(matrix) {
    // this happens when there was no rotation yet in CSS
    if(matrix === 'none') {
      matrix = 'matrix(0,0,0,0,0)';
    }
    var obj = {},
    values = matrix.match(/([-+]?[\d\.]+)/g);

    obj.rotate = (Math.round(
      Math.atan2(
        parseFloat(values[1]),
        parseFloat(values[0])) * (180/Math.PI)) || 0
      );
      if(values[5])
        obj.translate = {x: (_this.getPosX() + parseFloat(values[4])) / TILE_SIZE, y: (_this.getPosY() + parseFloat(values[5])) / TILE_SIZE}
      else
        obj.translate = {x: (_this.getPosX() + parseFloat(values[4])) / TILE_SIZE, y: (_this.getPosY() + parseFloat(values[4])) / TILE_SIZE}
      return obj;
    }

    var matrix = cssToMatrix("unit_"+this.id);
    if (matrix)
      var transform = matrixToTransformObj(matrix);




    if(!transform)
      return null;

    else if(transform.translate.x == 0 && transform.translate.y == 0)
      return {translate: {x: this.getX(), y: this.getY()}, rotation: transform.rotation};
    return transform;
}
