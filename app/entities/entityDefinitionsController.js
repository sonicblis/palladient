app.controller("entityDefinitionsController", ['$scope', 'studioProvider', function($scope, studioProvider){
    $scope.tableDefinition = [
        new columnDefinition('Name', 'name')
    ];
    $scope.publisher = {selectedWorkspace: null};
    $scope.resetEditors = function(){
        $scope.$broadcast('reset');
    };
    $scope.studio = studioProvider.getStudio();
    studioProvider.getWorkspaces().then(function(workspaces){
        $scope.workspaces = workspaces;
    });
    studioProvider.getEntityDefinitions().then(function(definitions){
        $scope.entityDefinitions = definitions;
    });
    $scope.entityDefinition = {properties: [{}]};
    $scope.showEntityEditor = function(){
        $scope.addingEntity = true;
        $scope.resetEditors();
    };
    $scope.saveEntityDefinition = function(){
        studioProvider.saveEntityDefinition($scope.entityDefinition);
        $scope.addingEntity = false;
        $scope.entityDefinition = {properties: [{}]};
    };
    $scope.prepareForPublish = function(){
        $scope.resetEditors();
        $scope.publisher.entityDefinitions = $scope.entityDefinitions.filter(function(entityDefinition){
            return entityDefinition.$selected;
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
    $scope.editDefinition = function(item){
        $scope.entityDefinition = item;
        $scope.showEntityEditor();
    };
}]);
