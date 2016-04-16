var Attackable = function(){
  Common.call(this);
  this.life = 1;
  this.activity = null;
  this.strategy = "closest"
}
Attackable.prototype = Object.create(Common.prototype);
Attackable.prototype.constructor = Attackable;


Attackable.prototype.stop = function(){
  this.activity = null;
  /*if(_this._action){
    $interval.cancel(_this._action);
    _this.trigger("stop");
  }*/
};

Attackable.prototype.attack = function(){
    var _this = this;
    this.activity = "attack";
    if(this.range > 1){//distance

    }
    else{
      var move = new Movement(this);
      var target = move.getTarget();
      if(target == null){
        this.activity = null;
        return;
      }
      target.once("destroyed", function(name, target){
      //console.log(params.unit.id + " destroyed " +  target.id);
        mapManager.replaceTile(target, Ground);
        _this.stop();//attack is done
      }.bind(this));

      move.start().then(function(params){
        var target = params.target;
        var speed = _this.attackSpeed;
        var dmg = _this.force;
        _this._action = setInterval(function(){
          target.life -= dmg;//-shield?
          target.life = Math.max(target.life, 0);
          if (target.life <= 0){//dead!
            //evenement de destruction
            //try{
              target.trigger("destroyed", target);
            //}
            //catch(e){
              //console.error(e);
              //ignore exception
            //}
            //on arrete l'attaque
            clearInterval(_this._action);
          }
          else
            target.trigger("attacked", _this, dmg);
        }, speed || 1000);


        //console.log(params.unit.id + " move done, attack"+  +  target.id);

          //(params.unit.attack).bind(params.unit)(target);
      });
    }

};

Attackable.prototype.guard = function(){
  this.activity = "guard";
  return false;
}
Attackable.prototype.getStrategy = function(){
  return this.strategy;
}
Attackable.prototype.getLife = function(){
  return this.life;
};
Attackable.prototype.getPosX = function(){
  return this.x * TILE_SIZE + 1;//+1 for borders
};
Attackable.prototype.getPosY = function(){
  return this.y * TILE_SIZE + 1;//+1 for borders
};

Attackable.prototype.getInterest= function(){
  return 0;
};

Attackable.prototype.getTargets = function(){
  return [];//overriden in each unit
};


Attackable.prototype.canAttack = function(tile){
  return false;//overriden in each unit
};
Attackable.prototype.getZone = function(){
  return this.zone;
};

Attackable.prototype.getActivity = function(){
  return this.activity;
};

Attackable.prototype.getActivities = function(){
  return [];
};
