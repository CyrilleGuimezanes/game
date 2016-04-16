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
  return "unknow";
};
Common.prototype.getType = function(){
  return types.UNKNOW;
};
