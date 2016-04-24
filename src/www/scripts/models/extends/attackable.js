var Attackable = function(){
  Common.call(this);
  this.life = 1;
  this.activity = null;
  this.strategy = "closest"
  this.currentTarget = null;
  this._action = null;
  this.attackSpeed = 1000;
  this.bag = {};//object (ressource, weapon, shield ... ) by unit
  this.bagSize = 10;
  this.transform = {
    x: 0,
    y: 0,
    angle: 0,
  }
}
Attackable.prototype = Object.create(Common.prototype);
Attackable.prototype.constructor = Attackable;


Attackable.prototype.stop = function(){
  this.activity = null;
  this.currentTarget = null;
  if(this._action){
    clearInterval(this._action);
  }
};

Attackable.prototype.attack = function(to){
    var _this = this;
    if(this.activity == "attack")
      return;
    var to = to;

    var _dealDmg = function(target, dmg){
      target.life -= dmg;//-shield?
      target.life = Math.max(target.life, 0);

      if (target.life <= 0){//dead!
          target.trigger("destroyed", target);
          if(target.getFamily() == "tile")
            mapManager.replaceTile(target, Ground);
          else
            mapManager.unregisterUnit(target);
        //on arrete l'attaque
        _this.stop();
      }
      else
        target.trigger("attacked", _this, dmg);
    }

    this.activity = "attack";

    //distant attack
    if(this.range > 1){//distance
      this.currentTarget = to;
      var _attack = function(){
        var item = mapManager.registerProjectile(_this.projectile, _this.getX(), _this.getY());
        item.once("hit", function(e, projectile, target){
          _dealDmg(target, projectile.force);
        });
        apply();
        new Fly(_this, to, item).start();
      }
      _this._action = setInterval(_attack, _this.attackSpeed || 1000);
      _attack();

    }

    //body to body attack
    else{
      var move = new Movement(this);
      to = move.getTarget();
      if(to == null){
        this.activity = null;
        return;
      }
      this.currentTarget = to;
      //on bouge et on attack
      move.start().then(function(params){
        var _attack = function(){
          _dealDmg(params.target, _this.force);

        }
        if (params.type == "done"){
          _this._action = setInterval(_attack, _this.attackSpeed || 1000);
          _attack();
        }
        else{
          _this.stop();
        }

      });
    }



};
//get Ressource (tree, gold, water)
Attackable.prototype.exploit = function(){
  
    var move = new Movement(this);
  move.start().then(function(params){
    var _exploit = function(){

    }
    if (params.type == "done"){
      _this._action = setInterval(_exploit, _this.exploitSpeed || 1000);
      _exploit();
    }
    else{
      _this.stop();
    }

  });
}
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


Attackable.prototype.getInterest= function(){
  return 0;
};

Attackable.prototype.getTargets = function(){
  return [];//overriden in each unit
};


Attackable.prototype.canAttack = function(tile){
  return false;//overriden in each unit
};
Attackable.prototype.getRange = function(){
  return this.range;
};

Attackable.prototype.getActivity = function(){
  return this.activity;
};

Attackable.prototype.getActivities = function(){
  return [];
};

Attackable.prototype.addToBag = function(item, quantity){
  var toAdd = Math.min(this.bagSize - this.bag[typeof item], quantity);
  this.bag[typeof item] += toAdd;
  return toAdd;
};

Attackable.prototype.removeFromBag = function(item, quantity){//0 == all
  if(this.bag[typeof item]){
    if (quantity == 0)
      this.bag[typeof item] = 0;
    else{
      this.bag[typeof item] -= quantity;
      this.bag[typeof item] = Math.max(0, this.bag[typeof item]);
    }

  }
  return this.bag[typeof item];
};

Attackable.prototype.hasOnBag = function(item){
  return this.bag[typeof item] && this.bag[typeof item] > 0;
};
Attackable.prototype.getBag = function(){
  return this.bag;
};
