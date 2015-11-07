app.controller("workspacesController", ['$scope', 'studioProvider', function($scope, studioProvider){
    $scope.tableDefinition = [
        new columnDefinition('Name', 'name')
    ];
    studioProvider.getWorkspaces().then(function(workspaces){
        $scope.workspaces = workspaces;
    });
}]);
