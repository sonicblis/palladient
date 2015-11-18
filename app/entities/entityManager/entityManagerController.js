app.controller("entityManagerController", ['$scope', 'studioProvider', 'entityProvider', function($scope, studioProvider, entityProvider){
    $scope.selectedDefinition = null;
    $scope.entityDefinitions = [];
    $scope.entityData = [];
    $scope.tableDefinition = [];
    $scope.entity = {};

    $scope.$watch('selectedDefinition', function(selectedEntityDefinition){
        if (selectedEntityDefinition && selectedEntityDefinition.properties){
            $scope.tableDefinition = entityProvider.getDefaultTableDefinition($scope.selectedDefinition);
            $scope.entityData = entityProvider.getEntities(selectedEntityDefinition.$id, true);
        }
    });

    studioProvider.getEntityDefinitions().then(function(definitions){
        $scope.entityDefinitions = definitions;
        definitions.$loaded(function(){
            $scope.selectedDefinition = definitions[0];
        });
    });

    $scope.deleteSelected = function(){
        var selected = $scope.entityData.filter(function(entity){
            return entity.$selected;
        });
        selected.forEach(function(entity){
            $scope.entityData.$remove(entity);
        });
    };

    $scope.edit = function(item){
        $scope.entity = item;
        $scope.editingEntity = true;
    };

    $scope.saveInstance = function(){
        var instance = $scope.entity;
        instance.fromDefinition = $scope.selectedDefinition.$id;
        entityProvider.saveInstance(instance);
    };
}]);
