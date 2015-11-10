app.controller("entityManagerController", ['$scope', 'studioProvider', 'entityProvider', function($scope, studioProvider, entityProvider){
    $scope.selectedDefinition = null;
    $scope.entityData = [];
    $scope.tableDefinition = [];
    $scope.entity = {};

    $scope.$watch('selectedDefinition', function(newVal){
        if (newVal && newVal.properties){

            //update the table definition from the entity definition
            $scope.tableDefinition.length = 0;
            newVal.properties.forEach(function(property){
                if (property.primaryListProperty) {
                    $scope.tableDefinition.push(new columnDefinition(property.headerText, property.name));
                }
            });

            //get entity data
            $scope.entityData = entityProvider.getEntities(newVal.$id);
        }
    });

    studioProvider.getEntityDefinitions().then(function(definitions){
        $scope.entityDefinitions = definitions;
        definitions.$loaded(function(){
            $scope.selectedDefinition = definitions[0];
        });
    });
    $scope.saveInstance = function(){
        var instance = $scope.entity;
        instance.fromDefinition = $scope.selectedDefinition.$id;
        entityProvider.saveInstance(instance);
    };
}]);
