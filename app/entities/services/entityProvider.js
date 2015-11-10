app.service("entityProvider", ['firebase', '$firebaseArray', function(dataSource, $firebaseArray){
    this.getEntities = function(entityDefinitionId){
        return $firebaseArray(dataSource.entities.orderByChild('fromDefinition').equalTo(entityDefinitionId));
    };
    this.saveInstance = function(instance){
        dataSource.entities.push(instance);
    };
}]);