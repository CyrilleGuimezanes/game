
app.controller("MapController", ['$rootScope', '$scope', '$interval', function($rootScope, $scope, $interval){
    $scope.selectedContruction = null;
    $scope.rows = window.map;
    $scope.pnjs = window.pnjs;

    for (var row = 0; row < MAP_SIZE; row++){
      $scope.rows[row] = [];
      for (var col = 0; col < MAP_SIZE; col++){
        $scope.rows[row][col] = null;
      }
    }

    for (var row = 0; row < MAP_SIZE; row++){
      for (var col = 0; col < MAP_SIZE; col++){
        mapManager.registerTile(Ground, row, col);
      }
    }

    mapManager.registerUnit(Soldier, 14,15);


    mapManager.registerUnit(Soldier, 5,5);
    mapManager.registerUnit(Soldier, 15,1);
    mapManager.registerUnit(Soldier, 20,1);
    mapManager.registerUnit(Soldier, 25,1);
    mapManager.registerUnit(Soldier, 30,1);
    mapManager.registerUnit(Soldier, 35,1);
    mapManager.registerUnit(Soldier, 40,1);
    mapManager.registerUnit(Soldier, 45,1);
    mapManager.registerUnit(Soldier, 49,1);

    mapManager.registerUnit(Soldier, 5,49);
    mapManager.registerUnit(Soldier, 10,49);
    mapManager.registerUnit(Soldier, 15,49);
    mapManager.registerUnit(Soldier, 20,49);
    mapManager.registerUnit(Soldier, 25,49);
    mapManager.registerUnit(Soldier, 30,49);
    mapManager.registerUnit(Soldier, 35,49);
    mapManager.registerUnit(Soldier, 40,49);
    mapManager.registerUnit(Soldier, 45,49);
    mapManager.registerUnit(Soldier, 49,49);

    mapManager.registerUnit(Soldier, 49,5);
    mapManager.registerUnit(Soldier, 49,10);
    mapManager.registerUnit(Soldier, 49,15);
    mapManager.registerUnit(Soldier, 49,20);
    mapManager.registerUnit(Soldier, 49,25);
    mapManager.registerUnit(Soldier, 49,30);
    mapManager.registerUnit(Soldier, 49,35);
    mapManager.registerUnit(Soldier, 49,40);
    mapManager.registerUnit(Soldier, 49,45);
    mapManager.registerUnit(Soldier, 49,49);

    mapManager.registerUnit(Soldier, 1,5);
    mapManager.registerUnit(Soldier, 1,10);
    mapManager.registerUnit(Soldier, 1,15);
    mapManager.registerUnit(Soldier, 1,20);
    mapManager.registerUnit(Soldier, 1,25);
    mapManager.registerUnit(Soldier, 1,30);
    mapManager.registerUnit(Soldier, 1,35);
    mapManager.registerUnit(Soldier, 1,40);
    mapManager.registerUnit(Soldier, 1,45);
    mapManager.registerUnit(Soldier, 1,49);


    mapManager.registerTile(Tower, 18,18);
    mapManager.registerTile(Tower, 29,29);
    mapManager.registerTile(Tower, 29,17);

    mapManager.registerTile(Heart, 25,25);
    mapManager.registerTile(SmallWall, 24,24);
    mapManager.registerTile(SmallWall, 25,24);
    mapManager.registerTile(SmallWall, 26,24);
    mapManager.registerTile(SmallWall, 24,25);
    mapManager.registerTile(SmallWall, 26,25);
    mapManager.registerTile(SmallWall, 24,26);
    mapManager.registerTile(SmallWall, 25,26);
    mapManager.registerTile(SmallWall, 26,26);


    $scope.closePlaceMenu = function($event){

    };
    $scope.openPlaceMenu = function($event){

    };

    $scope.closeBuildMenu = function($event){

    }
    $scope.openBuildMenu = function($event){

    }


    new Zone(10, 10, 20, Tree);
    new Zone(35, 35, 40, Tree);
    new Zone(10, 35, 60, Tree);
    new Zone(35, 10, 80, Tree);

    /********************************** boucle de jeu *****************************/
    $interval(function(){
      for (var i = 0; i < window.occupableItems.length; i++)
        if(window.occupableItems[i] && window.occupableItems[i].getActivity() == null){
          var activity = window.occupableItems[i].getActivities();
          window.occupableItems[i][activity]();
        }
    }, 50);

    /********************************** END boucle de jeu *****************************/


    /*setTimeout(function(){
      var doAttack = function(unit){
        //console.log(unit.id + " move to attack ");


      }
      for (var i = 0; i < $scope.pnjs.length; i++){
          var unit = $scope.pnjs[i];
          if(unit.getType() == Soldier)
            doAttack(unit);
      }
    }, 0);*/
    $scope.do = function($event, item){
        $scope.closePlaceMenu();

        if ($scope.selectedContruction == null)//DEBUG
          $scope.selectedContruction = {
            type: "line",
            selection: SmallWall
          };


        if(item.getType() == "ground" && $scope.selectedContruction != null){

          if($scope.selectedContruction.type == "block"){
            new Building(item, null, $scope.selectedContruction.selection);
          }
          else if($scope.selectedContruction.type == "line" && $scope.selectedContruction.start){//
            new Building($scope.selectedContruction.start, item, $scope.selectedContruction.selection);
            $scope.selectedContruction = null;
          }
          else if($scope.selectedContruction.type == "line"){
            $scope.selectedContruction.start = item;
          }
        }
        item.onClick && item.onClick($event);
    }


}])
