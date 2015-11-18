app.service("userProvider", ['$rootScope', '$firebaseObject', '$firebaseArray', 'firebase', '$state', function($rootScope, $firebaseObject, $firebaseArray, firebase, $state) {
    //local
    var _this = this;
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
        _this.userRef.update(_userInfo, function(){
            getUserWorkspaces(_userInfo.id);
        });
    }

    function getUserWorkspaces(userId){
        $rootScope.user.$workspaces = $firebaseArray(firebase.workspaceAccounts.orderByKey().equalTo(userId));
        $rootScope.user.$workspaces.$loaded(function(workspaces){
            if (workspaces.length == 1){ //load the single workspace by default
                $rootScope.user.$workspace = $firebaseObject(firebase.workspaces.child(workspaces[0].workspace));
                if (!$rootScope.user.studio) {
                    $state.go('work');
                }
            }
        });
    }

    //exposed
    this.getStudioUsers = function(){
        if ($rootScope.user.studio){
            return $firebaseArray(firebase.workspaceAccounts.orderByChild('studio').equalTo($rootScope.user.studio));
        }
        else{
            console.warn('You don\'t have a studio to load users from');
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
    this.userRef = null;
}]);