app.controller("packagesController", ['$scope', 'studioProvider', function($scope, studioProvider){
    $scope.newPackage = {entityDefinitions: []};
    $scope.tableDefinition = [
        new columnDefinition('Name', 'name'),
        new columnDefinition('Created', 'createdOn', templateOptions.date),
        new columnDefinition('Aspects', 'entityDefinitionCount')
    ];
    studioProvider.getPackages().then(function(packages){
        $scope.packages = packages;
    });
    studioProvider.getEntityDefinitions().then(function(entityDefinitions){
        $scope.entityDefinitions = entityDefinitions;
    });
    $scope.addEntityDefinition = function(entityDefinition){
        $scope.newPackage.entityDefinitions.push(entityDefinition);
        $scope.entityDefinitions.splice($scope.entityDefinitions.indexOf(entityDefinition), 1);
    };
    $scope.savePackageDefinition = function(package){
        studioProvider.savePackage(package);
        $scope.creatingPackage = false;
    };
    $scope.cancel = function(){
        $scope.newPackage = {entityDefinitions: []};
        $scope.creatingPackage = false;
    };
}]);
