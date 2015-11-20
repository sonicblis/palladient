app.service("licensePlanProvider", ['firebase', 'userProvider', '$rootScope', '$firebaseArray', function(firebase, userProvider, $rootScope, $firebaseArray){
    this.getLicensePlans = function(){
        return $firebaseArray(firebase.licensePlans);
    };
    this.enrollUserInLicensePlan = function(licensePlan){
        var newStudioKey = firebase.studios.push().key();
        var newWorkspaceKeys = [];
        var updates = {};
        var workspaceIndex = 1;

        //create a new workspace key for each allowed workspace
        for (var i = 0; i < licensePlan.workspaces; i++){
            newWorkspaceKeys.push(firebase.workspaces.push().key());
        }

        //update the user's studio assignment
        updates[firebase.stringify(userProvider.userRef, 'studio')] = newStudioKey;

        //put the user in the first workspace of the new studio
        updates[firebase.stringify(firebase.workspaceAccounts, $rootScope.user.id)] = {
            studio: newStudioKey,
            workspace: newWorkspaceKeys[0]
        };

        //create the new studio
        updates[firebase.stringify(firebase.studios, newStudioKey)] = {
            name: $rootScope.user.name + '\'s Studio',
            licensePlan: licensePlan.$id,
            owner: $rootScope.user.$id
        };

        //create each workspace
        newWorkspaceKeys.forEach(function(workspaceKey){
            updates[firebase.stringify(firebase.workspaces, workspaceKey)] = {
                name: 'Workspace ' + workspaceIndex++,
                studio: newStudioKey
            }
        });

        //execute it all in a sweet transaction
        firebase.root.update(updates);
    };
}]);
