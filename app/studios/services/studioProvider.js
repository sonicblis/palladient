app.service('studioProvider', ['firebase', '$firebaseObject', '$rootScope', '$firebaseArray', '$q', function(firebase, $firebaseObject, $rootScope, $firebaseArray, $q) {
    var _this = this;
    var studio = null;
    var entityDefinitionRef = null;
    var studioLoaded = false;

    this.getStudio = function () {
        var deferred = $q.defer();
        if (!studioLoaded) {
            var userStudioRef = firebase.studios.child($rootScope.user.studio);
            studio = $firebaseObject(userStudioRef).$loaded(function (loadedStudio) {
                studio = loadedStudio;
                studioLoaded = true;
                deferred.resolve(loadedStudio);
            });
        }
        else {
            deferred.resolve(studio);
        }
        return deferred.promise;
    };
    this.getEntityDefinitions = function () {
        var deferred = $q.defer();
        if (!_this.entityDefinitions){
            _this.getStudio().then(function (loadedStudio) {
                entityDefinitionRef = firebase.entityDefinitions.orderByChild('studio').equalTo(loadedStudio.$id)
                _this.entityDefinitions = $firebaseArray(entityDefinitionRef);
                deferred.resolve(_this.entityDefinitions);
            });
        }
        else{
            deferred.resolve(_this.entityDefinitions);
        }
        return deferred.promise;
    };
    this.getWorkspaces = function(){
        var workspaces = $q.defer();
        if (!_this.workspaces) {
            _this.getStudio().then(function (studio) {
                _this.workspaces = $firebaseArray(firebase.workspaces.orderByChild('studio').equalTo(studio.$id));
                workspaces.resolve(_this.workspaces);
            })
        }
        else{
            workspaces.resolve(_this.workspaces);
        }
        return workspaces.promise;
    };
    this.getPackages = function(){
        var packages = $q.defer();
        if (!_this.packages) {
            _this.getStudio().then(function (studio) {
                _this.packages = $firebaseArray(firebase.packages.orderByChild('studio').equalTo(studio.$id));
                packages.resolve(_this.packages);
            })
        }
        else{
            packages.resolve(_this.packages);
        }
        return packages.promise;
    };
    this.saveEntityDefinition = function(entityDefinition){
        _this.getStudio().then(function(userStudio){
            entityDefinition.studio = userStudio.$id;
            _this.getEntityDefinitions().then(function(entityDefinitions){
                if (entityDefinition.$id) { //existing, update it
                    // entityDefinitions.$save didn't work here, I don't know why, didn't update and no error
                    // I had to use .set but had to clean off all the angular $ sign stuff in order for it to work
                    firebase.entityDefinitions.child(entityDefinition.$id).set(firebase.cleanAngularObject(entityDefinition));
                }
                else {
                    entityDefinitions.$add(entityDefinition);
                }
            });
        });
    };
    this.savePackage = function(package){
        this.getPackages().then(function(){
            package.studio = studio.$id;
            package.entityDefinitionCount = package.entityDefinitions.length;
            package.creator = $rootScope.user.$id;
            package.createdOn = firebase.getCurrentTime();
            _this.packages.$add(package);
        });
    };
    this.publishEntities = function(publishInfo){
        publishInfo.entityDefinitions.forEach(function(entityDefinition){
            firebase.workspaceEntityDefinitions.child(entityDefinition.$id).set({
                workspace: publishInfo.selectedWorkspace.$id,
                name: entityDefinition.name,
                properties: entityDefinition.properties
            });
            delete entityDefinition.selected;
        });
    };
}]);