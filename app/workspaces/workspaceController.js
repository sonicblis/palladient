app.controller("workspaceController", ['$scope', 'workspaceProvider', 'userProvider', function($scope, workspaceProvider, userProvider){
    userProvider.getCurrentUserWorkspace().then(function(workspace){
        workspaceProvider.getEntityDefinitions(workspace.$id).then(function(definitions){
            $scope.userCreatableEntities = definitions;
        })
    });
}]);
