app.service('studioProvider', ['firebase', '$firebaseObject', '$rootScope', '$firebaseArray', '$q', function(firebase, $firebaseObject, $rootScope, $firebaseArray, $q) {
    var _this = this;
    var studio = null;
    var entityDefinitions = null;
    var entityDefinitionRef = null;

    this.getEntityDefinitions = function () {
        var deferred = $q.defer();
        _this.getStudio().then(function () {
            deferred.resolve(entityDefinitions);
        });
        return deferred.promise;
    };

    //gets the currently logged in user's studio and wires up the entity type definitions and ref for future updates
    this.getStudio = function () {
        var deferred = $q.defer();
        if (!studio) {
            var userStudioRef = firebase.studios.child($rootScope.user.studio);
            studio = $firebaseObject(userStudioRef).$loaded(function (loadedStudio) {
                entityDefinitionRef = firebase.entityDefinitions.orderByChild('studio').equalTo(loadedStudio.$id)
                entityDefinitions = $firebaseArray(entityDefinitionRef);
                studio = loadedStudio;
                deferred.resolve(loadedStudio);
            });
        }
        else {
            deferred.resolve(studio);
        }
        return deferred.promise;
    };
    this.saveEntityDefinition = function(entityDefinition){
        _this.getStudio().then(function(userStudio){
            entityDefinition.studio = userStudio.$id;
            _this.getEntityDefinitions().then(function(entityDefinitions){
                entityDefinitions.$add(entityDefinition);
            });
        });
    };
}]);