
app.controller("MapController", ['$rootScope', '$scope', 'ModelManager', 'Zone', 'Move', 'Attack','MapManager', 'Construction', function($rootScope, $scope, ModelManager, Zone, Move,Attack,MapManager, Construction){
    $scope.selectedContruction = null;
    $scope.rows = $rootScope.map;
    $scope.pnjs = $rootScope.pnjs;

    for (var row = 0; row < MAP_SIZE; row++){
      $scope.rows[row] = [];
      for (var col = 0; col < MAP_SIZE; col++){
        $scope.rows[row][col] = null;
      }
    }

    for (var row = 0; row < MAP_SIZE; row++){
      for (var col = 0; col < MAP_SIZE; col++){
        MapManager.registerTile("ground", row, col);
      }
    }

  MapManager.registerUnit("soldier", 5,1);
      MapManager.registerUnit("soldier", 1,25);
    MapManager.registerUnit("soldier", 15,1);
    MapManager.registerUnit("soldier", 20,1);
    MapManager.registerUnit("soldier", 25,1);
    MapManager.registerUnit("soldier", 30,1);
    MapManager.registerUnit("soldier", 35,1);
    MapManager.registerUnit("soldier", 40,1);
    MapManager.registerUnit("soldier", 45,1);
    MapManager.registerUnit("soldier", 49,1);

  MapManager.registerUnit("soldier", 5,49);
    MapManager.registerUnit("soldier", 10,49);
    MapManager.registerUnit("soldier", 15,49);
    MapManager.registerUnit("soldier", 20,49);
    MapManager.registerUnit("soldier", 25,49);
    MapManager.registerUnit("soldier", 30,49);
    MapManager.registerUnit("soldier", 35,49);
    MapManager.registerUnit("soldier", 40,49);
    MapManager.registerUnit("soldier", 45,49);
    MapManager.registerUnit("soldier", 49,49);

    MapManager.registerUnit("soldier", 49,5);
    MapManager.registerUnit("soldier", 49,10);
    MapManager.registerUnit("soldier", 49,15);
    MapManager.registerUnit("soldier", 49,20);
    MapManager.registerUnit("soldier", 49,25);
    MapManager.registerUnit("soldier", 49,30);
    MapManager.registerUnit("soldier", 49,35);
    MapManager.registerUnit("soldier", 49,40);
    MapManager.registerUnit("soldier", 49,45);
    MapManager.registerUnit("soldier", 49,49);

    MapManager.registerUnit("soldier", 1,5);
    MapManager.registerUnit("soldier", 1,10);
    MapManager.registerUnit("soldier", 1,15);
    MapManager.registerUnit("soldier", 1,20);
    MapManager.registerUnit("soldier", 1,25);
    MapManager.registerUnit("soldier", 1,30);
    MapManager.registerUnit("soldier", 1,35);
    MapManager.registerUnit("soldier", 1,40);
    MapManager.registerUnit("soldier", 1,45);
    MapManager.registerUnit("soldier", 1,49);


    MapManager.registerUnit("pecor", 23,23);


    MapManager.registerTile("heart", 25,25);
    MapManager.registerTile("small-wall", 24,24);
    MapManager.registerTile("small-wall", 25,24);
    MapManager.registerTile("small-wall", 26,24);
    MapManager.registerTile("small-wall", 24,25);
    MapManager.registerTile("small-wall", 26,25);
    MapManager.registerTile("small-wall", 24,26);
    MapManager.registerTile("small-wall", 25,26);
    MapManager.registerTile("small-wall", 26,26);




    var createLine = function(startX, startY, endX, endY, model){

    }

    var populateRows = function(){

    }

    $scope.closePlaceMenu = function($event){

    };
    $scope.openPlaceMenu = function($event){

    };

    $scope.closeBuildMenu = function($event){

    }
    $scope.openBuildMenu = function($event){

    }


    new Zone(10, 10, 20, "tree");
    new Zone(35, 35, 40, "tree");
    new Zone(10, 35, 60, "tree");
    new Zone(35, 10, 80, "tree");
    setTimeout(function(){
      var doAttack = function(unit){
        //console.log(unit.id + " move to attack ");
          new Attack(unit).then(function(params){
            var target = params.target;
            //console.log(params.unit.id + " move done, attack"+  +  target.id);

            if(params.type == "done"){//la target à été détruite durant le mouvement
              target.once("destroy", function(){
              //console.log(params.unit.id + " destroyed " +  target.id);
                MapManager.replaceTile(target, "ground");
                doAttack(params.unit);//recursive attack!
              });
              (params.unit.attack).bind(params.unit)(target);
            }
            else{
              doAttack(params.unit);
            }
          });
      }
      for (var i = 0; i < $scope.pnjs.length; i++){
          var unit = $scope.pnjs[i];
          doAttack(unit);
      }
    }, 0)
    $scope.do = function($event, item){
        $scope.closePlaceMenu();

        if ($scope.selectedContruction == null)//DEBUG
          $scope.selectedContruction = {
            type: "line",
            selection: "small-wall"
          };


        if(item.getType() == "ground" && $scope.selectedContruction != null){

          if($scope.selectedContruction.type == "block"){
            new Construction(item, null, $scope.selectedContruction.selection);
          }
          else if($scope.selectedContruction.type == "line" && $scope.selectedContruction.start){//
            new Construction($scope.selectedContruction.start, item, $scope.selectedContruction.selection);
            $scope.selectedContruction = null;
          }
          else if($scope.selectedContruction.type == "line"){
            $scope.selectedContruction.start = item;
          }
        }
        item.onClick && item.onClick($event);
    }


}])
