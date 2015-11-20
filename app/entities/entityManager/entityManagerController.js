app.controller("entityManagerController", ['logProvider', '$scope', '$rootScope', 'studioProvider', 'entityProvider', 'workspaceProvider', 'userProvider', function(logProvider, $scope, $rootScope, studioProvider, entityProvider, workspaceProvider, userProvider){
    $scope.selectedDefinition = null;
    $scope.entityDefinitions = [];
    $scope.entityData = [];
    $scope.tableDefinition = [];
    $scope.entity = {};

    //loads entities for the selected type
    $scope.$watch('selectedDefinition', function(selectedEntityDefinition){
        logProvider.info('entityManagerController', 'selectedDefinition watch fired', selectedEntityDefinition);
        if (selectedEntityDefinition && selectedEntityDefinition.properties){

            logProvider.info('entityManagerController', 'generating table definition for selected entity definition', selectedEntityDefinition);
            $scope.tableDefinition = entityProvider.getDefaultTableDefinition($scope.selectedDefinition);
            logProvider.debug('entityManagerController', 'generated table definition', $scope.tableDefinition);

            logProvider.info('entityManagerController', 'getting entities from provider', selectedEntityDefinition);
            entityProvider.getEntities(selectedEntityDefinition.$id, true).then(function(entities){
                $scope.entityData = entities;
            });
        }
        else if (selectedEntityDefinition && !selectedEntityDefinition.properties){
            logProvider.error('entityManagerController', 'the selected type has no defined properties', selectedEntityDefinition);
        }
    });

    $scope.deleteSelected = function(){
        logProvider.info('entityManagerController', 'deleting selected entities');
        var selected = $scope.entityData.filter(function(entity){
            return entity.$selected;
        });
        logProvider.info('entityManagerController', '    selected entities', selected);
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

    //init
    logProvider.info('entityManagerController', 'getting workspace definitions for user', $rootScope.user);
    userProvider.getCurrentUserWorkspace().then(function(workspace){
        workspaceProvider.getEntityDefinitions(workspace.$id).then(function(definitions){
            $scope.entityDefinitions = definitions;
            definitions.$loaded(function(){
                logProvider.info('entityManagerController', 'workspace definitions loaded', $rootScope.user);
                $scope.selectedDefinition = definitions[0];
            });
        });
    });
}]);
