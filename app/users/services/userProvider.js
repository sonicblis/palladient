app.service("userProvider", ['$rootScope', '$firebaseObject', '$firebaseArray', 'firebase', '$state', '$q', 'logProvider', function($rootScope, $firebaseObject, $firebaseArray, firebase, $state, $q, logProvider) {
    //local
    var _this = this;
    var userWorkspaceDetails = {};
    var userInfo = function(authData){
        this.name = authData.google.displayName;
        this.id = authData.uid;
        this.icon = authData.google.profileImageURL;
        this.authenticated = true;
        this.lastLoggedIn = Firebase.ServerValue.TIMESTAMP;
    }

    $rootScope.logout = function(){
        _this.logout();
    }
    $rootScope.login = function(){
        _this.login();
    }

    function loadUser(user){
        //hook up the current user's ref
        _this.userRef = firebase.accounts.child(user.uid);
        $rootScope.user = $firebaseObject(_this.userRef);

        //update the user's info
        var _userInfo = new userInfo(user);
        getUserWorkspaces(_userInfo.id);
        logProvider.info('userProvider', 'updating user information', _userInfo);
        _this.userRef.update(_userInfo);
    }
    function getUserWorkspaces(userId){
        logProvider.info('userProvider', 'getting workspaces for user', $rootScope.user)
        $rootScope.user.$workspaces = $firebaseArray(firebase.workspaceAccounts.orderByKey().equalTo(userId));
        $rootScope.user.$workspaces.$loaded(function(workspaces){
            logProvider.info('userProvider', '    workspaces loaded');
            if (workspaces.length == 1){ //load the single workspace by default
                $rootScope.user.$workspace = $firebaseObject(firebase.workspaces.child(workspaces[0].workspace));
                if (!$rootScope.user.studio) {
                    $state.go('work');
                }
            }
        });
    }

    //exposed
    this.getCurrentUserWorkspace = function(){
        var deferred = $q.defer();
        $rootScope.user.$workspaces.$loaded(function(){
            $rootScope.user.$workspace.$loaded(function(workspace){
                deferred.resolve(workspace);
            })
        });
        return deferred.promise;
    };
    this.getStudioUsers = function(){
        if ($rootScope.user.studio){
            return $firebaseArray(firebase.workspaceAccounts.orderByChild('studio').equalTo($rootScope.user.studio));
        }
        else{
            return $firebaseArray(firebase.workspaceAccounts.orderByChild('studio').equalTo($rootScope.user.$workspace.studio));
        }
    };
    this.logout = function(){
        _this.userRef.update({logout: Firebase.ServerValue.TIMESTAMP});
        firebase.root.unauth();
        $rootScope.user = {authenticated: false};
    };
    this.login = function(){
        firebase.root.authWithOAuthPopup("google", function (error, auth) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                loadUser(auth);
            }
        });
    };
    this.checkForAuth = function(){
        var auth = firebase.root.getAuth();
        if (auth) {
            loadUser(auth);
        }
    };
    this.getUserWorkspaceDetails = function(userWorkspaceInfo){
        var deferred = $q.defer();
        if (!userWorkspaceDetails[userWorkspaceInfo.$id]) {
            userWorkspaceDetails[userWorkspaceInfo.$id] = {
                userName: $firebaseObject(firebase.accounts.child(userWorkspaceInfo.$id).child('name')),
                workspace: $firebaseObject(firebase.workspaces.child(userWorkspaceInfo.workspace).child('name'))
            };
        }
        var promises = [
            userWorkspaceDetails[userWorkspaceInfo.$id].userName.$loaded(),
            userWorkspaceDetails[userWorkspaceInfo.$id].workspace.$loaded()
        ];
        $q.all(promises).then(function(){
            deferred.resolve(userWorkspaceDetails[userWorkspaceInfo.$id]);
        });
        return deferred.promise;
    };
    this.getCurrentUser = function() {
        return $rootScope.user;
    } ;
    this.userRef = null;
}]);