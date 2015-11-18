app.controller("userListController", ['$scope', 'userProvider', function($scope, userProvider){
    $scope.users = [];
    $scope.users = userProvider.getStudioUsers();
}]);
