app.controller("studioController", ['$scope', 'studioProvider', function($scope, studioProvider){
    $scope.studio = studioProvider.getStudio();
    studioProvider.getEntityDefinitions().then(function(definitions){
        $scope.entityDefinitions = definitions;
    });
    $scope.entityDefinition = {properties: [{}]};
    $scope.addEntityDefinition = function(){
        $scope.addingEntity = true;
    };
    $scope.saveEntityDefinition = function(){
        studioProvider.saveEntityDefinition($scope.entityDefinition);
        $scope.addingEntity = false;
        $scope.entityDefinition = {properties: [{}]};
    }
}]);
