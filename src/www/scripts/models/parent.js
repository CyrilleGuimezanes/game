function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

app.service("ModelManager", ['Move', '$interval', function(Move, $interval){

  //on replace par du sol (ruine?)
  return {
    _that: this,
    _common: function(){
      return {
        x: 0,
        y: 0,
        life: 1,

        _callbacks: {},

        trigger: function(name, a, b, c, d, e){
          var perm = this._callbacks[name] || [];
          var once = this._callbacks[name + "_once"] || [];
          var calls = angular.extend(perm, once);
          for (var i in calls){

              var callb = (calls[i]).bind(this);
              callb(name, a, b, c, d, e);
          }
          delete this._callbacks[name + "_once"];
        },
        on: function(name, callback){
          var id = Math.randomInt(0, 10000000000000);
          //TODO check if id not exist;
          if (angular.isString(name) && angular.isFunction(callback)){
            this._callbacks[name] = this._callbacks[name] || {};
            this._callbacks[name][id] = callback;
            return id;
          }
          else {
            throw "Unable to register callback, be sure name is a string and callback is a function";
          }
        },
        once: function(name, callback){
          return this.on(name+"_once", callback);
        },
        off: function(name, id){
          if (this._callbacks[name])
            delete this._callbacks[name][id];
          if(this._callbacks[name+"_once"])
            delete this._callbacks[name+"_once"][id];
        },
        getX: function(){
          return this.x;
        },
        getY: function(){
          return this.y;
        },
        getClass: function(){
          return "unknow";
        },
        getType: function(){
          return types.UNKNOW;
        },
      }
    },
    _baseTile:function(){
      return {

        /*onDestroy: angular.noop,
        onWalkOver: angular.noop,
        onClick: angular.noop,
        onBuildStart: angular.noop,
        onBuildEnd: angular.noop,
        onExploit: angular.noop,
        onAttack: function(dmg){


        onAttack: angular.noop,
        onDestroy: angular.noop,
        onClick: angular.noop,
      },*/


      getLife: function(){
        return this.life;
      },
      getInterest: function(){
        return 0;
      }
    }
  },
  _baseUnit: function(){
    return {
      x: 0,
      y: 0,
      id: 0,

      getLife: function(){
        return this.life;
      },
      getPosX: function(){
        return this.x * TILE_SIZE + 1;//+1 for borders
      },
      getPosY: function(){
        return this.y * TILE_SIZE + 1;//+1 for borders
      },
      setX: function(x){
        if(x < 0 || x > MAP_SIZE)
          throw Error("x out of bounds!");
        this.x = x;
        $("#unit_"+this.id).css("left", this.getPosX()+ "px");
        return this;
      },
      setY: function(y){
        if(y < 0 || y > MAP_SIZE)
          throw Error("x out of bounds!");
        this.y = y;
        $("#unit_"+this.id).css("top", this.getPosY()+ "px");
        return this;
      },
      getSpeed: function(){
        return 1;
      },

      getTargets: function(){
        return [];//overriden in each unit
      },
      getWalkableTiles: function(){
        return [];//overriden in each unit
      },
      canAttack: function(tile){
        return false;//overriden in each unit
      },
      _action: null,
      _this: this,
      attack: function(target){
        var _this = this;
        if (target){
          //TODO check if we can attack it (out of range)

          var speed = _this.attackSpeed;
          var dmg = _this.force;
          _this._action = $interval(function(){
            target.life -= dmg;//-shield?
            if (target.life <= 0){//dead!
              //evenement de destruction
              try{
                target.trigger("destroy", _this);
              }
              catch(e){
                console.error(e);
                //ignore exception
              }
              //on arrete l'attaque
              $interval.cancel(_this._action);
            }
            else
              target.trigger("attack", _this, dmg);
          }, speed || 1000);
        }
        else{
          console.log(this.id + " no target found");
          //oh, no target, dance?
        }
      }
    }
  },
  registerTile: function(name, params){
    var _this = this;
    this[name] = function(){
      return angular.extend({}, new _this._common(),  new _this._baseTile(), clone(params));
    }


  },
  registerUnit: function(name, params){
    var _this = this;
    this[name] = function(){
      return angular.extend({}, new _this._common(), new _this._baseUnit(), clone(params));
    }
  },

  init: function(name, x, y, params){
    if(!this[name])
    console.error("Model "+ name + " is not define, call registerTile or registerUnit");
    var item = angular.extend({}, new this[name]());
    item.x = x;
    item.y = y;
    item.id = Math.round(Math.random() * 10000000);
    item.params = params;
    //MapManager.registerTile(item);
    return item;
  }
}
}])
