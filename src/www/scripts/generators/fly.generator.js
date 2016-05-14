//handle fly of projectile
var Fly = function(sender, target, projectile){
  this.projectile = projectile;
  this.sender = sender;
  this.target = target;
    //http://stackoverflow.com/questions/2248876/2d-game-fire-at-a-moving-target-by-predicting-intersection-of-projectile-and-u
    /**
     * Return the firing solution for a projectile starting at 'src' with
     * velocity 'v', to hit a target, 'dst'.
     *
     * @param Object src position of shooter
     * @param Object dst position & velocity of target
     * @param Number v   speed of projectile
     * @return Object Coordinate at which to fire (and where intercept occurs)
     *
     * E.g.
     * >>> intercept({x:2, y:4}, {x:5, y:7, vx: 2, vy:1}, 5)
     * = {x: 8, y: 8.5}
     */
    function intercept(src, dst, v) {
      var tx = dst.x - src.x,
          ty = dst.y - src.y,
          tvx = dst.vx,
          tvy = dst.vy;

      // Get quadratic equation components
      var a = tvx*tvx + tvy*tvy - v*v;
      var b = 2 * (tvx * tx + tvy * ty);
      var c = tx*tx + ty*ty;

      // Solve quadratic
      var ts = quad(a, b, c); // See quad(), below

      // Find smallest positive solution
      var sol = null;
      if (ts) {
        var t0 = ts[0], t1 = ts[1];
        var t = Math.min(t0, t1);
        if (t < 0) t = Math.max(t0, t1);
        if (t > 0) {
          sol = {
            x: dst.x + dst.vx*t,
            y: dst.y + dst.vy*t
          };
        }
      }

      return sol;
    }


    /**
     * Return solutions for quadratic
     */
    function quad(a,b,c) {
      var sol = null;
      if (Math.abs(a) < 1e-6) {
        if (Math.abs(b) < 1e-6) {
          sol = Math.abs(c) < 1e-6 ? [0,0] : null;
        } else {
          sol = [-c/b, -c/b];
        }
      } else {
        var disc = b*b - 4*a*c;
        if (disc >= 0) {
          disc = Math.sqrt(disc);
          a = 2*a;
          sol = [(-b-disc)/a, (-b+disc)/a];
        }
      }
      return sol;
    }

    var isPointOnLine = function(linePointA,linePointB, point)
    {
       var a = (linePointB.y - linePointA.y) / (linePointB.x - linePointB.x);
       var b = linePointA.y - a * linePointA.x;
       return Math.abs(point.y - (a*point.x+b)) < 0.001;
    }
//Possibilité d'avoir des éléments trop haut pour être franchits? A voir

    var pos = null;
    if(!target.path || target.path.length == 1){
      pos = intercept({x:sender.getX(), y:sender.getY()}, {x:target.getVirtualX(), y:target.getVirtualY(), vx: 0, vy:0}, this.projectile.getSpeed());
    }
    else{
        var p1 = {x: target.path[0][0], y: target.path[0][1]};
        var p2 = {x: target.path[1][0], y: target.path[1][1]};

        var diff = {x: p2.x - p1.x, y: p2.y - p1.y};
        var velocity = {x: diff.x * target.getSpeed(), y: diff.y * target.getSpeed()};
        pos = intercept({x:sender.getX(), y:sender.getY()}, {x:target.getVirtualX(), y:target.getVirtualY(), vx: velocity.x , vy: velocity.y}, this.projectile.getSpeed());

    }



    if(!pos || Math.abs(pos.x - this.sender.getX()) > this.sender.getRange() || Math.abs(pos.y - this.sender.getY()) > this.sender.getRange())
      return null;
    if (pos.x < MAP_SIZE && pos.y < MAP_SIZE){
      //$("#place_"+window.map[Math.round(target.getVirtualY())][Math.round(target.getVirtualX())].id).css("border", "1px solid #0F0");
      //$("#place_"+window.map[Math.round(pos.y)][Math.round(pos.x)].id).css("border", "1px solid #F00");
      this.path = [[sender.getX(), sender.getY()],[Math.round(pos.x), Math.round(pos.y)]];
    }
    else {
      return null;
    }


}

Fly.prototype.start = function(){
    if(!this.path)
      return this.sender.stop();
    var _unit = $("#projectile_"+this.projectile.id);
    var _this = this;
    var css = new CSS(this.path, this.projectile, this.target);

    var _onMovementFinished = function(){
      //onEnded(current.translation, current.rotation);
      _unit.removeClass(css.ident);
      this.projectile.trigger("hit",this.projectile,  this.target);
      $("#style-"+css.animationId).remove();
    }.bind(this);
    _unit.addClass(css.ident);
    setTimeout(_onMovementFinished, css.animationDuration * 1000);
};
Fly.prototype.getTarget = function(){
   return target;
 }
