app.service("workspaceProvider", ['logProvider', 'firebase', '$firebaseArray', '$q', function(logProvider, firebase, $firebaseArray, $q){
    var _this = this;
    this.workspaceDefinitions = {};
    this.getEntityDefinitions = function(workspaceId){
        if (!workspaceId) {
            logProvider.error('workspaceProvider', 'no workspace id was provided.  Use the userProvider.getCurrentUserWorkspace to get a workspace.');
            return;
        }
        logProvider.info('workspaceProvider', 'getting entity definitions for workspace id', workspaceId);
        var deferred = $q.defer();
        if (!_this.workspaceDefinitions[workspaceId]){
            _this.workspaceDefinitions[workspaceId] = $firebaseArray(firebase.workspaceEntityDefinitions.orderByChild('workspace').equalTo(workspaceId));
            deferred.resolve(_this.workspaceDefinitions[workspaceId]);
        }
        else{
            deferred.resolve(_this.workspaceDefinitions[workspaceId]);
        }
        return deferred.promise;
    };
}]);
