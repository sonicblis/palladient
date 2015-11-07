app.controller("studioController", ['$scope', 'studioProvider', function($scope, studioProvider){
    $scope.studio = studioProvider.getStudio();
    studioProvider.getEntityDefinitions().then(function(definitions){
        $scope.entityDefinitions = definitions;
    });
}]);
