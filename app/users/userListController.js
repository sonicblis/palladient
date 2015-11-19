app.controller("userListController", ['$scope', 'userProvider', function($scope, userProvider){
    $scope.users = [];
    $scope.users = userProvider.getStudioUsers();
    $scope.userDetails = [];
    $scope.tableDefinition = [
        new columnDefinition('User', 'name'),
        new columnDefinition('Workspace', 'workspace')
    ];
    $scope.users.$watch(function(args){
        if (args.event === 'child_added') {
            var userObject = $scope.users.$getRecord(args.key);
            userProvider.getUserWorkspaceDetails(userObject).then(function(userInfo){
                $scope.userDetails.push({name: userInfo.userName.$value, workspace: userInfo.workspace.$value});
            });
        }
    });
}]);
