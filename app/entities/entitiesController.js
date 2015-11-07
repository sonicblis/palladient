app.controller("entitiesController", ['$scope', 'studioProvider', function($scope, studioProvider){
    $scope.tableDefinition = [
        new columnDefinition('Name', 'name')
    ];
    $scope.publisher = {selectedWorkspace: null};
    $scope.studio = studioProvider.getStudio();
    studioProvider.getWorkspaces().then(function(workspaces){
        $scope.workspaces = workspaces;
    });
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
    };
    $scope.prepareForPublish = function(){
        $scope.publisher.entityDefinitions = $scope.entityDefinitions.map(function(entityDefinition){
            if (entityDefinition.selected){
                return entityDefinition;
            }
        });
        $scope.publishing = true;
    };
    $scope.publishEntitiesToWorkspace = function(){
        studioProvider.publishEntities($scope.publisher)
        $scope.publishing = false;
    };
    $scope.cancel = function(){
        $scope.entityDefinition = {};
        $scope.publishing = false;
        $scope.addingEntity = false;
    };
}]);
